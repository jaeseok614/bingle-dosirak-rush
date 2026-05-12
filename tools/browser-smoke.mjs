#!/usr/bin/env node
import { spawn, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const targetUrl = process.env.QA_URL || process.argv[2] || "http://127.0.0.1:4173/";
const chromePath =
  process.env.CHROME_PATH || "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe";
const cdpPort = Number(process.env.CDP_PORT || 9300 + Math.floor(Math.random() * 500));
const userDataDir = path.resolve(process.env.CHROME_USER_DATA_DIR || ".chrome-qa");
const windowsChromeFromWsl = process.platform === "linux" && chromePath.endsWith(".exe");
const cdpHost = process.env.CDP_HOST || (windowsChromeFromWsl ? getWslHostIp() : "127.0.0.1");
const cdpBindAddress = process.env.CDP_BIND_ADDRESS || (windowsChromeFromWsl ? "0.0.0.0" : "127.0.0.1");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toWindowsPathIfNeeded(filePath) {
  if (process.platform !== "linux" || !filePath.startsWith("/mnt/")) {
    return filePath;
  }
  try {
    return execFileSync("wslpath", ["-w", filePath], { encoding: "utf8" }).trim();
  } catch {
    return filePath;
  }
}

function getWslHostIp() {
  try {
    const resolvConf = readFileSync("/etc/resolv.conf", "utf8");
    const match = resolvConf.match(/^nameserver\s+([^\s]+)/m);
    if (match) return match[1];
  } catch {
    // Fall back to localhost for non-standard WSL networking setups.
  }
  return "127.0.0.1";
}

function rewriteWebSocketHost(wsUrl) {
  const url = new URL(wsUrl);
  url.hostname = cdpHost;
  return url.toString();
}

function isBenignBrowserLog(text = "") {
  return text.includes("Blocked call to navigator.vibrate");
}

function stopChromeProfile() {
  const profilePath = toWindowsPathIfNeeded(userDataDir).replace(/'/g, "''");
  const command = [
    "Get-CimInstance Win32_Process -Filter \"name = 'chrome.exe'\"",
    `Where-Object { $_.CommandLine -like '*${profilePath}*' }`,
    "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }",
  ].join(" | ");

  try {
    execFileSync("powershell.exe", ["-NoProfile", "-Command", command], {
      stdio: "ignore",
    });
  } catch {
    // Best-effort cleanup for Chrome children that outlive the WSL parent process.
  }
}

function requestJson(requestPath) {
  return new Promise((resolve, reject) => {
    const request = http.get(
      { hostname: cdpHost, port: cdpPort, path: requestPath },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    request.on("error", reject);
    request.setTimeout(1000, () => {
      request.destroy(new Error("CDP request timed out"));
    });
  });
}

async function waitForCdp() {
  for (let i = 0; i < 80; i += 1) {
    try {
      await requestJson("/json/version");
      return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome DevTools Protocol did not become available");
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async open() {
    if (typeof WebSocket !== "function") {
      throw new Error("This smoke test requires Node.js with global WebSocket support.");
    }

    this.socket = new WebSocket(this.wsUrl);
    this.socket.addEventListener("message", (event) => this.handleMessage(event.data));
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  close() {
    this.socket?.close();
  }

  handleMessage(data) {
    const raw = typeof data === "string" ? data : Buffer.from(data).toString("utf8");
    const message = JSON.parse(raw);

    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject, timer } = this.pending.get(message.id);
      clearTimeout(timer);
      this.pending.delete(message.id);
      if (message.error) {
        reject(new Error(`${message.error.message}: ${message.error.data || ""}`));
      } else {
        resolve(message.result || {});
      }
      return;
    }

    if (message.method && this.listeners.has(message.method)) {
      for (const listener of this.listeners.get(message.method)) {
        listener(message.params || {});
      }
    }
  }

  send(method, params = {}, timeout = 30000) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, timeout);
      this.pending.set(id, { resolve, reject, timer });
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || new Set();
    listeners.add(listener);
    this.listeners.set(method, listeners);
    return () => listeners.delete(listener);
  }

  once(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const remove = this.on(method, (params) => {
        clearTimeout(timer);
        remove();
        resolve(params);
      });
      const timer = setTimeout(() => {
        remove();
        reject(new Error(`${method} did not fire`));
      }, timeout);
    });
  }
}

async function evaluate(client, expression, awaitPromise = false) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    const text = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
    throw new Error(text);
  }
  return result.result?.value;
}

async function waitForExpression(client, expression, timeout = 8000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) {
      return;
    }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function navigateFresh(client, url) {
  const load = client.once("Page.loadEventFired", 20000).catch(() => null);
  await client.send("Page.navigate", { url });
  await load;
  await waitForExpression(client, "document.readyState === 'complete'", 10000);
  await evaluate(client, "localStorage.clear(); sessionStorage.clear();");
  const reload = client.once("Page.loadEventFired", 20000).catch(() => null);
  await client.send("Page.reload", { ignoreCache: true });
  await reload;
  await waitForExpression(client, "document.readyState === 'complete'", 10000);
  await waitForExpression(client, "Boolean(window.Matter && document.querySelector('#startButton'))");
}

async function click(client, selector) {
  await evaluate(
    client,
    `(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) throw new Error("Missing selector: ${selector}");
      element.click();
      return true;
    })()`,
  );
}

async function startRun(client) {
  await click(client, "#startButton");
  await sleep(250);
  const characterSelectOpen = await evaluate(
    client,
    "!document.querySelector('#characterSelectOverlay').hidden",
  );
  if (characterSelectOpen) {
    await click(client, "#startSelectedButton");
  }
  await waitForExpression(
    client,
    "document.querySelector('#guideOverlay').hidden && document.querySelector('#characterSelectOverlay').hidden && document.querySelector('#gameOver').hidden",
  );
}

async function playKeyboardRun(client) {
  await startRun(client);
  const startedAt = Date.now();
  let step = 0;
  while (Date.now() - startedAt < 65000) {
    const right = step % 2 === 0;
    const key = right ? "ArrowRight" : "ArrowLeft";
    const code = right ? "ArrowRight" : "ArrowLeft";
    await evaluate(
      client,
      `window.dispatchEvent(new KeyboardEvent("keydown", { key: "${key}", code: "${code}", bubbles: true }));`,
    );
    await sleep(520);
    await evaluate(
      client,
      `window.dispatchEvent(new KeyboardEvent("keyup", { key: "${key}", code: "${code}", bubbles: true }));`,
    );

    if (step % 9 === 4) {
      await evaluate(
        client,
        `window.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }));`,
      );
      await evaluate(
        client,
        `window.dispatchEvent(new KeyboardEvent("keyup", { key: " ", code: "Space", bubbles: true }));`,
      );
    }

    if (!(await evaluate(client, "document.querySelector('#gameOver').hidden"))) {
      break;
    }
    step += 1;
  }
  await waitForExpression(client, "!document.querySelector('#gameOver').hidden", 10000);
}

async function playTouchRun(client) {
  await startRun(client);
  const points = await evaluate(
    client,
    `(() => {
      const rect = document.querySelector('#gameCanvas').getBoundingClientRect();
      return {
        launcher: { x: Math.round(rect.left + rect.width * 0.5), y: Math.round(rect.top + rect.height * 0.85) },
        left: { x: Math.round(rect.left + rect.width * 0.28), y: Math.round(rect.top + rect.height * 0.32) },
        right: { x: Math.round(rect.left + rect.width * 0.72), y: Math.round(rect.top + rect.height * 0.32) },
      };
    })()`,
  );

  const startedAt = Date.now();
  let step = 0;
  while (Date.now() - startedAt < 65000) {
    const direction = step % 2 === 0 ? "right" : "left";
    const target = points[direction];
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: points.launcher.x, y: points.launcher.y, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
    });
    await sleep(80);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: target.x, y: target.y, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
    });
    await sleep(180);
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await sleep(300);

    if (step % 10 === 5) {
      await click(client, "#skillButton");
    }

    if (!(await evaluate(client, "document.querySelector('#gameOver').hidden"))) {
      break;
    }
    step += 1;
  }
  await waitForExpression(client, "!document.querySelector('#gameOver').hidden", 10000);
}

async function startTutorialRun(client) {
  await click(client, "#tutorialStartButton");
  await waitForExpression(
    client,
    "document.querySelector('#guideOverlay').hidden && !document.querySelector('#tutorialCoach').hidden",
    10000,
  );
}

async function playGuidedTutorialRun(client) {
  await startTutorialRun(client);
  const points = await evaluate(
    client,
    `(() => {
      const rect = document.querySelector('#gameCanvas').getBoundingClientRect();
      return {
        launcher: { x: Math.round(rect.left + rect.width * 0.5), y: Math.round(rect.top + rect.height * 0.84) },
        left: { x: Math.round(rect.left + rect.width * 0.34), y: Math.round(rect.top + rect.height * 0.28) },
        right: { x: Math.round(rect.left + rect.width * 0.66), y: Math.round(rect.top + rect.height * 0.28) },
      };
    })()`,
  );

  for (let step = 0; step < 140; step += 1) {
    const state = await evaluate(
      client,
      `(() => {
        const coach = document.querySelector('#tutorialCoach');
        const next = document.querySelector('#tutorialCoachNext');
        const delivery = document.querySelector('#mobileDeliveryReadyButton');
        const dock = document.querySelector('#mobileAmmoDock');
        return {
          coachHidden: !coach || coach.hidden,
          nextDisabled: !next || next.disabled,
          nextText: next?.textContent.trim() || '',
          waitingAction: Boolean(coach?.classList.contains('is-waiting-action')),
          deliveryVisible: Boolean(dock && !dock.hidden && delivery && !delivery.hidden && !delivery.disabled),
          gameOver: !document.querySelector('#gameOver').hidden,
        };
      })()`,
    );

    if (state.gameOver) break;
    if (state.coachHidden) {
      await sleep(1200);
      const stillHidden = await evaluate(client, "document.querySelector('#tutorialCoach')?.hidden !== false");
      if (stillHidden) return;
      continue;
    }

    if (!state.waitingAction) {
      await evaluate(
        client,
        `(() => {
          const next = document.querySelector('#tutorialCoachNext');
          const coach = document.querySelector('#tutorialCoach');
          if (next && !next.disabled) next.click();
          else coach?.click();
          return true;
        })()`,
      );
      await sleep(420);
      continue;
    }

    if (!state.nextDisabled && state.nextText === "선택") {
      await click(client, "#tutorialCoachNext");
      await sleep(420);
      continue;
    }

    if (state.deliveryVisible) {
      await click(client, "#mobileDeliveryReadyButton");
      await sleep(420);
      continue;
    }

    const target = step % 2 === 0 ? points.right : points.left;
    await evaluate(
      client,
      `(() => {
        if (window.__bingleQa?.fireDirection) {
          window.__bingleQa.fireDirection(${step % 2 === 0 ? "'right'" : "'left'"});
          return true;
        }
        const x = ${target.x};
        const y = ${target.y};
        document.elementFromPoint(x, y)?.click();
        return true;
      })()`,
    );
    await sleep(900);
  }

  const finalState = await evaluate(
    client,
    `(() => {
      const coach = document.querySelector('#tutorialCoach');
      const next = document.querySelector('#tutorialCoachNext');
      return {
        coachHidden: !coach || coach.hidden,
        waitingAction: Boolean(coach?.classList.contains('is-waiting-action')),
        nextDisabled: Boolean(next?.disabled),
        coachText: document.querySelector('#tutorialCoachText')?.textContent.trim() || '',
        orderText: document.querySelector('#mobileOrderText')?.textContent.trim() || '',
        actionHint: document.querySelector('#mobileActionHint')?.textContent.trim() || '',
        completed: document.querySelector('#completedValue')?.textContent.trim() || '',
        currentAmmo: document.querySelector('#mobileCurrentAmmo')?.textContent.trim() || '',
        score: document.querySelector('#scoreValue')?.textContent.trim() || '',
        qaState: window.__bingleQa?.state?.() || null,
        elementAtCenter: (() => {
          const rect = document.querySelector('#gameCanvas').getBoundingClientRect();
          const element = document.elementFromPoint(rect.left + rect.width * 0.66, rect.top + rect.height * 0.28);
          return element ? element.tagName.toLowerCase() + '#' + element.id + '.' + element.className : '';
        })(),
      };
    })()`,
  );
  if (!finalState.coachHidden) {
    throw new Error(`Tutorial did not finish: ${JSON.stringify(finalState)}`);
  }
}

async function collectResult(client, label) {
  const result = await evaluate(
    client,
    `(() => {
      const text = (selector) => document.querySelector(selector)?.textContent.trim() || "";
      const canvas = document.querySelector('#gameCanvas');
      const context = canvas.getContext('2d');
      const samplePoints = [
        [90, 90], [450, 340], [810, 590], [300, 220], [610, 420]
      ];
      const nonBlankPixels = samplePoints.filter(([x, y]) => {
        const data = context.getImageData(x, y, 1, 1).data;
        return data[3] > 0 && (data[0] !== 0 || data[1] !== 0 || data[2] !== 0);
      }).length;
      return {
        label: ${JSON.stringify(label)},
        score: text('#finalScore'),
        orders: text('#finalOrders'),
        combo: text('#finalCombo'),
        coins: text('#finalCoins'),
        rank: text('#finalRank'),
        share: text('#sharePreview'),
        viewport: window.innerWidth + "x" + window.innerHeight,
        nonBlankPixels,
      };
    })()`,
  );
  return result;
}

async function runTextFitStress(client, label) {
  await evaluate(
    client,
    `(() => {
      const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
      };
      setText('#timeValue', '999.9');
      setText('#scoreValue', '999,999,999,999');
      setText('#comboValue', 'x999');
      setText('#completedValue', '999');
      setText('#itemValue', '자석 999초');
      setText('#feverValue', '999초 x2');
      setText('#coinValue', '999,999,999');
      setText('#characterValue', '느긋한 사장님');
      setText('#orderNumber', '#999');
      setText('#orderPercent', '100%');
      setText('#finalScore', '999,999,999,999');
      setText('#finalOrders', '999');
      setText('#finalCombo', 'x999');
      setText('#finalCoins', '+999,999');
      setText('#finalRank', '이번 기록 999위');
      setText('#leaderboardTitle', '오늘 챌린지 TOP 5');
      setText('#shopCoinValue', '999,999,999코인');
      setText('#selectCoinValue', '999,999,999코인');
      setText('#achievementSummary', '999/999');
      setText('#balancePresetLabel', '커스텀');
      for (const selector of ['#gameOver', '#shopOverlay', '#achievementOverlay', '#balanceOverlay', '#characterSelectOverlay']) {
        const overlay = document.querySelector(selector);
        if (overlay) overlay.hidden = false;
      }
      const leaderboard = document.querySelector('#leaderboardList');
      if (leaderboard) {
        leaderboard.innerHTML = '<li class="leaderboard-row"><span>1</span><strong>999,999,999,999</strong><span class="leaderboard-meta">999개 / x999</span></li>';
      }
      const breakdown = document.querySelector('#scoreBreakdown');
      if (breakdown) {
        breakdown.innerHTML = '<div class="breakdown-row"><span>피버 보너스</span><strong>+999,999,999</strong></div>';
      }
      window.dispatchEvent(new Event('resize'));
      return true;
    })()`,
  );
  await sleep(350);

  return evaluate(
    client,
    `(() => {
      const selector = [
        '.stat-cell strong',
        '.profile-strip strong',
        '#orderNumber',
        '#orderPercent',
        '.order-count',
        '.mission-row strong',
        '#finalScore',
        '#finalOrders',
        '#finalCombo',
        '#finalCoins',
        '#finalRank',
        '#leaderboardTitle',
        '.leaderboard-row strong',
        '.leaderboard-meta',
        '.breakdown-row strong',
        '#shopCoinValue',
        '#selectCoinValue',
        '#achievementSummary',
        '#balancePresetLabel',
        '.collection-state',
        '.balance-value',
        '.shop-actions button',
        '.result-actions button',
        '.action-panel button'
      ].join(',');
      const overflowing = [...document.querySelectorAll(selector)]
        .filter((element) => element.getClientRects().length && element.scrollWidth > element.clientWidth + 1)
        .map((element) => ({
          text: element.textContent.trim(),
          className: element.className,
          id: element.id,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          fontSize: getComputedStyle(element).fontSize
        }));
      return {
        label: ${JSON.stringify(label)},
        viewport: window.innerWidth + 'x' + window.innerHeight,
        overflowing
      };
    })()`,
  );
}

async function runLayoutOnly(client) {
  await setDesktop(client);
  await navigateFresh(client, `${targetUrl}?qa=layout-desktop-${Date.now()}`);
  const desktop = await runTextFitStress(client, "desktop-layout");

  await setMobile(client);
  await navigateFresh(client, `${targetUrl}?qa=layout-mobile-${Date.now()}`);
  const mobile = await runTextFitStress(client, "mobile-layout");

  const results = [desktop, mobile];
  console.log(JSON.stringify({ ok: results.every((result) => result.overflowing.length === 0), results }, null, 2));
  if (results.some((result) => result.overflowing.length > 0)) {
    process.exitCode = 1;
  }
}

async function runTutorialOnly(client) {
  await setMobile(client);
  await navigateFresh(client, `${targetUrl}?qa=tutorial-${Date.now()}`);
  await playGuidedTutorialRun(client);
  const result = await evaluate(
    client,
    `(() => ({
      tutorialHidden: document.querySelector('#tutorialCoach')?.hidden !== false,
      guideHidden: document.querySelector('#guideOverlay').hidden,
      gameOverHidden: document.querySelector('#gameOver').hidden,
      started: document.querySelector('#timeValue').textContent.trim().length > 0,
      orderText: document.querySelector('#mobileOrderText')?.textContent.trim() || '',
      actionHint: document.querySelector('#mobileActionHint')?.textContent.trim() || '',
    }))()`,
  );
  console.log(JSON.stringify({ ok: result.tutorialHidden && result.guideHidden && result.gameOverHidden, result }, null, 2));
  if (!result.tutorialHidden || !result.guideHidden || !result.gameOverHidden) {
    process.exitCode = 1;
  }
}

async function setDesktop(client) {
  await client.send("Emulation.clearDeviceMetricsOverride").catch(() => null);
  await client.send("Emulation.setTouchEmulationEnabled", { enabled: false }).catch(() => null);
}

async function setMobile(client) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await client.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 5,
  });
  await client.send("Emulation.setUserAgentOverride", {
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
}

async function main() {
  await mkdir(userDataDir, { recursive: true });
  stopChromeProfile();
  const chromeMessages = [];
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-address=${cdpBindAddress}`,
    `--remote-debugging-port=${cdpPort}`,
    "--remote-allow-origins=*",
    `--user-data-dir=${toWindowsPathIfNeeded(userDataDir)}`,
    "about:blank",
  ]);

  chrome.on("exit", (code, signal) => {
    if (code || signal) {
      chromeMessages.push(`Chrome exited early: code=${code ?? ""} signal=${signal ?? ""}`);
    }
  });
  chrome.stderr.on("data", (chunk) => {
    const text = chunk.toString("utf8").trim();
    if (text) chromeMessages.push(text);
  });

  let client;
  const browserErrors = [];
  try {
    await waitForCdp();
    const targets = await requestJson("/json/list");
    const page = targets.find((target) => target.type === "page");
    if (!page?.webSocketDebuggerUrl) {
      throw new Error("Could not find a debuggable page target");
    }

    client = new CdpClient(rewriteWebSocketHost(page.webSocketDebuggerUrl));
    await client.open();
    client.on("Runtime.exceptionThrown", (params) => {
      browserErrors.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text);
    });
    client.on("Log.entryAdded", (params) => {
      if (params.entry?.level === "error" && !isBenignBrowserLog(params.entry.text)) {
        browserErrors.push(params.entry.text);
      }
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Log.enable");
    await client.send("Input.setIgnoreInputEvents", { ignore: false });

    if (process.env.QA_LAYOUT_ONLY === "1") {
      await runLayoutOnly(client);
      return;
    }

    if (process.env.QA_TUTORIAL_ONLY === "1") {
      await runTutorialOnly(client);
      return;
    }

    await setDesktop(client);
    await navigateFresh(client, `${targetUrl}?qa=desktop-${Date.now()}`);
    await playKeyboardRun(client);
    const desktop = await collectResult(client, "desktop-keyboard");

    await setMobile(client);
    await navigateFresh(client, `${targetUrl}?qa=mobile-${Date.now()}`);
    await playTouchRun(client);
    const mobile = await collectResult(client, "mobile-touch");

    const summary = { ok: browserErrors.length === 0, browserErrors, results: [desktop, mobile] };
    console.log(JSON.stringify(summary, null, 2));
    if (!summary.ok || summary.results.some((result) => result.nonBlankPixels < 3)) {
      process.exitCode = 1;
    }
  } finally {
    client?.close();
    chrome.kill();
    stopChromeProfile();
    if ((process.exitCode || process.env.QA_VERBOSE) && chromeMessages.length) {
      console.error(chromeMessages.slice(-8).join("\n"));
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
