(() => {
  "use strict";

  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");

  const ui = {
    time: document.querySelector("#timeValue"),
    score: document.querySelector("#scoreValue"),
    combo: document.querySelector("#comboValue"),
    completed: document.querySelector("#completedValue"),
    item: document.querySelector("#itemValue"),
    fever: document.querySelector("#feverValue"),
    coin: document.querySelector("#coinValue"),
    character: document.querySelector("#characterValue"),
    modeBadge: document.querySelector("#modeBadge"),
    modeButton: document.querySelector("#modeButton"),
    characterButton: document.querySelector("#characterButton"),
    shopButton: document.querySelector("#shopButton"),
    achievementButton: document.querySelector("#achievementButton"),
    balanceButton: document.querySelector("#balanceButton"),
    soundButton: document.querySelector("#soundButton"),
    skill: document.querySelector("#skillButton"),
    orderNumber: document.querySelector("#orderNumber"),
    orderRule: document.querySelector("#orderRule"),
    orderList: document.querySelector("#orderList"),
    orderPercent: document.querySelector("#orderPercent"),
    orderMeter: document.querySelector("#orderMeter"),
    missionList: document.querySelector("#missionList"),
    restart: document.querySelector("#restartButton"),
    guide: document.querySelector("#guideButton"),
    guideOverlay: document.querySelector("#guideOverlay"),
    start: document.querySelector("#startButton"),
    playAgain: document.querySelector("#playAgainButton"),
    modal: document.querySelector("#gameOver"),
    resultTitle: document.querySelector("#resultTitle"),
    finalScore: document.querySelector("#finalScore"),
    finalOrders: document.querySelector("#finalOrders"),
    finalCombo: document.querySelector("#finalCombo"),
    finalCoins: document.querySelector("#finalCoins"),
    dailyDelta: document.querySelector("#dailyDelta"),
    scoreBreakdown: document.querySelector("#scoreBreakdown"),
    newAchievements: document.querySelector("#newAchievementList"),
    finalRank: document.querySelector("#finalRank"),
    leaderboardTitle: document.querySelector("#leaderboardTitle"),
    leaderboard: document.querySelector("#leaderboardList"),
    sharePreview: document.querySelector("#sharePreview"),
    copyResult: document.querySelector("#copyResultButton"),
    copyStatus: document.querySelector("#copyStatus"),
    characterHud: document.querySelector("#characterHud"),
    activeCharacterImage: document.querySelector("#activeCharacterImage"),
    activeCharacterName: document.querySelector("#activeCharacterName"),
    characterBubble: document.querySelector("#characterBubble"),
    characterSelectOverlay: document.querySelector("#characterSelectOverlay"),
    selectCoin: document.querySelector("#selectCoinValue"),
    startCharacterList: document.querySelector("#startCharacterList"),
    selectShop: document.querySelector("#selectShopButton"),
    startSelected: document.querySelector("#startSelectedButton"),
    shopOverlay: document.querySelector("#shopOverlay"),
    shopClose: document.querySelector("#shopCloseButton"),
    shopCoin: document.querySelector("#shopCoinValue"),
    characterShop: document.querySelector("#characterShopList"),
    shopItems: document.querySelector("#shopItemList"),
    shopStatus: document.querySelector("#shopStatus"),
    achievementOverlay: document.querySelector("#achievementOverlay"),
    achievementClose: document.querySelector("#achievementCloseButton"),
    achievementSummary: document.querySelector("#achievementSummary"),
    achievementCollection: document.querySelector("#achievementCollectionList"),
    balanceOverlay: document.querySelector("#balanceOverlay"),
    balanceClose: document.querySelector("#balanceCloseButton"),
    balanceReset: document.querySelector("#balanceResetButton"),
    balancePreset: document.querySelector("#balancePresetLabel"),
    balanceList: document.querySelector("#balanceControlList"),
    balanceStatus: document.querySelector("#balanceStatus"),
    controls: [...document.querySelectorAll(".control-button, .touch-zone")],
  };

  const WIDTH = 900;
  const HEIGHT = 680;
  const CENTER = { x: WIDTH / 2, y: 348 };
  const TRAY_RADIUS = 250;
  const TARGET_INNER = 68;
  const TARGET_OUTER = 248;
  const TARGET_WIDTH = (Math.PI * 2) / 5 * 0.92;
  const GAME_SECONDS = 60;
  const LEADERBOARD_KEY = "bingle-dosirak-rush-leaderboard";
  const DAILY_LEADERBOARD_KEY = "bingle-dosirak-rush-daily";
  const META_KEY = "bingle-dosirak-rush-meta";
  const FEVER_SECONDS = 8;
  const FEVER_COMBO = 8;
  const FEVER_ORDER_STREAK = 3;
  const SKILL_COOLDOWN = 8;
  const TAU = Math.PI * 2;

  const SCORE_CATEGORIES = {
    base: "기본 점수",
    combo: "콤보 보너스",
    order: "주문 보너스",
    item: "아이템 보너스",
    fever: "피버 보너스",
    penalty: "실수 감점",
  };

  const CHARACTERS = {
    cook: {
      id: "cook",
      name: "도시락 요리사",
      short: "요",
      cost: 0,
      color: "#2f6d5b",
      image: "assets/characters/cook.png",
      description: "기본 성능",
      stats: {
        rotate: 1,
        score: 1,
        comboScore: 1,
        itemDelay: 1,
        magnet: 1,
        skillCooldown: 1,
        startTime: 0,
      },
    },
    sprinter: {
      id: "sprinter",
      name: "스피드 셰프",
      short: "속",
      cost: 90,
      color: "#e85d4f",
      image: "assets/characters/sprinter.png",
      description: "회전 +15%, 톡 치기 쿨타임 -15%",
      stats: {
        rotate: 1.15,
        score: 1,
        comboScore: 1,
        itemDelay: 1,
        magnet: 1,
        skillCooldown: 0.85,
        startTime: 0,
      },
    },
    combo: {
      id: "combo",
      name: "콤보 장인",
      short: "콤",
      cost: 130,
      color: "#6d4c96",
      image: "assets/characters/combo.png",
      description: "콤보 점수 +18%, 기본 점수 +4%",
      stats: {
        rotate: 0.98,
        score: 1.04,
        comboScore: 1.18,
        itemDelay: 1,
        magnet: 1,
        skillCooldown: 1,
        startTime: 0,
      },
    },
    magnet: {
      id: "magnet",
      name: "자석 주방장",
      short: "자",
      cost: 165,
      color: "#2c9aa0",
      image: "assets/characters/magnet.png",
      description: "아이템 등장 빨라짐, 자석 지속 +35%",
      stats: {
        rotate: 1,
        score: 1,
        comboScore: 1,
        itemDelay: 0.82,
        magnet: 1.35,
        skillCooldown: 1,
        startTime: 0,
      },
    },
    owner: {
      id: "owner",
      name: "느긋한 사장님",
      short: "장",
      cost: 190,
      color: "#9b7423",
      image: "assets/characters/owner.png",
      description: "시작 시간 +6초, 전체 점수 +6%",
      stats: {
        rotate: 0.93,
        score: 1.06,
        comboScore: 1.06,
        itemDelay: 1.05,
        magnet: 1,
        skillCooldown: 1,
        startTime: 6,
      },
    },
  };

  const CHARACTER_ORDER = ["cook", "sprinter", "combo", "magnet", "owner"];

  const SHOP_ITEMS = {
    timeTicket: {
      id: "timeTicket",
      name: "시간 쿠폰",
      short: "+5초",
      cost: 40,
      color: "#2c9aa0",
      description: "진행 중 남은 시간을 5초 늘립니다.",
    },
    comboSpice: {
      id: "comboSpice",
      name: "콤보 향신료",
      short: "콤보",
      cost: 45,
      color: "#e85d4f",
      description: "진행 중 콤보를 2 올립니다.",
    },
    magnetKit: {
      id: "magnetKit",
      name: "자석 키트",
      short: "자석",
      cost: 50,
      color: "#f1c453",
      description: "진행 중 자석 효과를 8초 켭니다.",
    },
    feverStamp: {
      id: "feverStamp",
      name: "피버 스탬프",
      short: "피버",
      cost: 70,
      color: "#6d4c96",
      description: "진행 중 피버를 바로 발동합니다.",
    },
  };

  const SHOP_ITEM_ORDER = ["timeTicket", "comboSpice", "magnetKit", "feverStamp"];

  const ACHIEVEMENTS = {
    feverDuo: {
      id: "feverDuo",
      name: "뜨거운 주방",
      description: "한 판에 피버 2회 발동",
      target: 2,
      reward: 60,
    },
    cleanThree: {
      id: "cleanThree",
      name: "깔끔한 손놀림",
      description: "한 판에 깔끔 주문 3회 성공",
      target: 3,
      reward: 80,
    },
    flawlessFive: {
      id: "flawlessFive",
      name: "무실수 5연속",
      description: "실수 없이 도시락 5개 연속 완성",
      target: 5,
      reward: 110,
    },
    itemFive: {
      id: "itemFive",
      name: "반짝이 수집가",
      description: "한 판에 아이템 5개 획득",
      target: 5,
      reward: 55,
    },
    comboTwelve: {
      id: "comboTwelve",
      name: "콤보 숙련자",
      description: "최고 콤보 x12 달성",
      target: 12,
      reward: 75,
    },
    firstPurchase: {
      id: "firstPurchase",
      name: "첫 장보기",
      description: "상점에서 첫 구매",
      target: 1,
      reward: 35,
    },
  };

  const MISSION_IDS = ["feverDuo", "cleanThree", "flawlessFive", "itemFive", "comboTwelve"];
  const ACHIEVEMENT_ORDER = ["feverDuo", "cleanThree", "flawlessFive", "itemFive", "comboTwelve", "firstPurchase"];

  const DEFAULT_BALANCE = {
    characterPower: 1,
    coinPayout: 1,
    shopPrices: 1,
    orderDifficulty: 1,
    itemFrequency: 1,
    specialChance: 0.38,
  };

  const BALANCE_CONTROLS = [
    {
      id: "characterPower",
      label: "캐릭터 성능 반영",
      detail: "1.00은 기본, 낮추면 캐릭터별 차이가 줄어듭니다.",
      min: 0.7,
      max: 1.35,
      step: 0.05,
      suffix: "x",
    },
    {
      id: "coinPayout",
      label: "코인 지급량",
      detail: "결과 보상 코인에 적용됩니다.",
      min: 0.5,
      max: 2,
      step: 0.05,
      suffix: "x",
    },
    {
      id: "shopPrices",
      label: "상점 가격",
      detail: "캐릭터와 소모품 구매 가격에 적용됩니다.",
      min: 0.5,
      max: 1.8,
      step: 0.05,
      suffix: "x",
    },
    {
      id: "orderDifficulty",
      label: "주문 난이도",
      detail: "주문 재료 개수 증가 속도에 영향을 줍니다.",
      min: 0.75,
      max: 1.35,
      step: 0.05,
      suffix: "x",
    },
    {
      id: "itemFrequency",
      label: "아이템 등장 빈도",
      detail: "높을수록 보너스 아이템이 더 자주 나옵니다.",
      min: 0.6,
      max: 1.8,
      step: 0.05,
      suffix: "x",
    },
    {
      id: "specialChance",
      label: "특수 주문 빈도",
      detail: "빠른 주문, 금지칸 주문 같은 변형 주문 확률입니다.",
      min: 0.15,
      max: 0.75,
      step: 0.05,
      suffix: "",
    },
  ];

  const FOODS = {
    rice: {
      name: "밥",
      color: "#f8f2de",
      edge: "#beb493",
      accent: "#535956",
      radius: 17,
      shape: "rice",
      density: 0.0034,
      friction: 0.08,
      frictionAir: 0.019,
      restitution: 0.18,
    },
    egg: {
      name: "계란",
      color: "#f2c84f",
      edge: "#a96f1f",
      accent: "#fff6c8",
      radius: 18,
      shape: "egg",
      density: 0.0024,
      friction: 0.025,
      frictionAir: 0.009,
      restitution: 0.36,
    },
    kimchi: {
      name: "김치",
      color: "#e85d4f",
      edge: "#9c302c",
      accent: "#ffc0a6",
      radius: 16,
      shape: "kimchi",
      density: 0.0021,
      friction: 0.025,
      frictionAir: 0.01,
      restitution: 0.64,
    },
    nori: {
      name: "김",
      color: "#213c34",
      edge: "#10231f",
      accent: "#74b48a",
      radius: 16,
      shape: "nori",
      density: 0.0015,
      friction: 0.006,
      frictionAir: 0.025,
      restitution: 0.28,
    },
    shrimp: {
      name: "새우",
      color: "#f48b75",
      edge: "#9e473f",
      accent: "#ffe0ca",
      radius: 17,
      shape: "shrimp",
      density: 0.0027,
      friction: 0.03,
      frictionAir: 0.011,
      restitution: 0.55,
    },
  };

  const FOOD_KEYS = Object.keys(FOODS);
  const SLOTS = FOOD_KEYS.map((type, index) => ({
    type,
    angle: -Math.PI / 2 + index * (TAU / FOOD_KEYS.length),
  }));

  const ITEMS = {
    clock: {
      name: "시간 절임",
      short: "+5초",
      color: "#2c9aa0",
      edge: "#17646d",
      icon: "+5",
    },
    sauce: {
      name: "콤보 소스",
      short: "콤보 +3",
      color: "#e85d4f",
      edge: "#9c302c",
      icon: "x",
    },
    magnet: {
      name: "자석 젓가락",
      short: "자석",
      color: "#f1c453",
      edge: "#9b7423",
      icon: "M",
    },
  };

  const ITEM_KEYS = Object.keys(ITEMS);

  const ORDER_RULES = {
    normal: {
      id: "normal",
      name: "기본 주문",
      description: "",
    },
    fast: {
      id: "fast",
      name: "빠른 주문",
      description: "10초 안에 완성하면 +500점",
    },
    clean: {
      id: "clean",
      name: "깔끔 주문",
      description: "실수 없이 완성하면 +450점",
    },
    spicy: {
      id: "spicy",
      name: "매운 주문",
      description: "김치 점수 2배",
    },
    protein: {
      id: "protein",
      name: "단백질 주문",
      description: "계란과 새우만 등장",
      foods: ["egg", "shrimp"],
    },
    heavy: {
      id: "heavy",
      name: "무거운 주문",
      description: "밥 비중 증가, 완성하면 +300점",
      foods: ["rice", "rice", "rice", "egg", "kimchi"],
    },
    slippery: {
      id: "slippery",
      name: "미끄러운 주문",
      description: "김 비중 증가, 완성하면 +300점",
      foods: ["nori", "nori", "nori", "egg", "shrimp"],
    },
    forbidden: {
      id: "forbidden",
      name: "금지칸 주문",
      description: "지정 금지칸에 오래 머물면 -75점",
    },
  };

  const SPECIAL_RULES = [
    ORDER_RULES.fast,
    ORDER_RULES.clean,
    ORDER_RULES.spicy,
    ORDER_RULES.protein,
    ORDER_RULES.heavy,
    ORDER_RULES.slippery,
    ORDER_RULES.forbidden,
  ];

  const controls = {
    left: false,
    right: false,
  };

  const meta = loadMeta();
  const audio = {
    context: null,
    enabled: meta.soundEnabled,
  };

  const game = {
    engine: null,
    world: null,
    trayBodies: [],
    baffleBodies: [],
    pieces: [],
    powerItems: [],
    particles: [],
    score: 0,
    combo: 1,
    maxCombo: 1,
    completed: 0,
    orderIndex: 1,
    order: null,
    orderRule: ORDER_RULES.normal,
    orderElapsed: 0,
    orderHadWrong: false,
    orderHadForbiddenHit: false,
    forbiddenType: "",
    progress: null,
    targetTotal: 0,
    targetDone: 0,
    breakdown: createBreakdown(),
    runStats: createRunStats(),
    timeLeft: GAME_SECONDS,
    running: false,
    started: false,
    wasRunningBeforeGuide: false,
    wasRunningBeforeShop: false,
    mode: "normal",
    dailyDate: "",
    orderRng: Math.random,
    itemRng: Math.random,
    magnetTimer: 0,
    itemSpawnTimer: 0,
    itemMessage: "대기",
    itemMessageTimer: 0,
    feverTimer: 0,
    feverComboArmed: true,
    feverParticleTimer: 0,
    orderStreak: 0,
    skillCooldown: 0,
    characterMessage: "준비 완료",
    characterMood: "idle",
    characterReactionTimer: 0,
    newAchievements: [],
    lastCoinAward: 0,
    lastShareText: "",
    trayAngle: 0,
    trayVelocity: 0,
    nextOrderDelay: 0,
    lastFrame: 0,
    uiTimer: 0,
  };

  if (!window.Matter) {
    showEngineError();
    return;
  }

  const { Body, Bodies, Engine, Events, World } = window.Matter;

  function showEngineError() {
    ui.modal.hidden = false;
    ui.resultTitle.textContent = "엔진 로딩 실패";
    ui.finalScore.textContent = "Matter.js";
    ui.finalOrders.textContent = "확인 필요";
    ui.finalCombo.textContent = "x0";
  }

  function init() {
    createEngine();
    bindControls();
    updateMetaUi();
    renderShop();
    renderAchievementCollection();
    renderBalanceControls();
    updateSoundUi();
    updateCharacterHud(true);
    resetGame(false);
    showGuide();
    requestAnimationFrame(frame);
  }

  function createEngine() {
    game.engine = Engine.create({
      enableSleeping: false,
      positionIterations: 8,
      velocityIterations: 6,
    });
    game.world = game.engine.world;
    game.engine.gravity.y = 1;
    game.engine.gravity.scale = 0.00135;

    Events.on(game.engine, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA.plugin?.ingredient;
        const b = pair.bodyB.plugin?.ingredient;
        const itemA = pair.bodyA.plugin?.powerItem;
        const itemB = pair.bodyB.plugin?.powerItem;
        if (a) a.bump = 0.14;
        if (b) b.bump = 0.14;
        if (a && itemB) collectPowerItem(itemB);
        if (b && itemA) collectPowerItem(itemA);
      }
    });

    buildTray();
  }

  function bindControls() {
    window.addEventListener("keydown", (event) => {
      unlockAudio();
      if (!ui.guideOverlay.hidden) {
        if (event.key === "Enter" || event.key === " ") {
          closeGuide();
          event.preventDefault();
        }
        return;
      }

      if (!ui.modal.hidden && event.key.toLowerCase() === "r") {
        openCharacterSelect();
        return;
      }

      if (isBlockingOverlayOpen()) {
        if (event.key === "Escape") {
          closeTopOverlay();
        }
        return;
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        controls.left = true;
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        controls.right = true;
        event.preventDefault();
      }
      if (event.key.toLowerCase() === "r") {
        openCharacterSelect();
      }
      if (event.key.toLowerCase() === "g") {
        showGuide();
      }
      if (event.code === "Space") {
        useSkill();
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        controls.left = false;
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        controls.right = false;
        event.preventDefault();
      }
    });

    for (const button of ui.controls) {
      const direction = button.dataset.dir;
      const setActive = (active) => {
        controls[direction] = active;
        button.classList.toggle("is-active", active);
      };
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        unlockAudio();
        button.setPointerCapture(event.pointerId);
        setActive(true);
      });
      button.addEventListener("pointerup", () => setActive(false));
      button.addEventListener("pointercancel", () => setActive(false));
      button.addEventListener("lostpointercapture", () => setActive(false));
    }

    ui.restart.addEventListener("click", openCharacterSelect);
    ui.modeButton.addEventListener("click", toggleMode);
    ui.characterButton.addEventListener("click", () => openShop("characters"));
    ui.shopButton.addEventListener("click", () => openShop("items"));
    ui.achievementButton.addEventListener("click", openAchievements);
    ui.balanceButton.addEventListener("click", openBalance);
    ui.soundButton.addEventListener("click", toggleSound);
    ui.shopClose.addEventListener("click", closeShop);
    ui.characterShop.addEventListener("click", handleShopAction);
    ui.shopItems.addEventListener("click", handleShopAction);
    ui.selectShop.addEventListener("click", () => openShop("characters"));
    ui.startCharacterList.addEventListener("click", handleStartCharacterClick);
    ui.startSelected.addEventListener("click", startGame);
    ui.achievementClose.addEventListener("click", closeAchievements);
    ui.balanceClose.addEventListener("click", closeBalance);
    ui.balanceReset.addEventListener("click", resetBalance);
    ui.balanceList.addEventListener("input", handleBalanceInput);
    ui.skill.addEventListener("click", useSkill);
    ui.guide.addEventListener("click", showGuide);
    ui.start.addEventListener("click", closeGuide);
    ui.playAgain.addEventListener("click", openCharacterSelect);
    ui.copyResult.addEventListener("click", copyResultText);
  }

  function buildTray() {
    const outerSegments = 32;
    const wallThickness = 28;
    const wallLength = (TAU * (TRAY_RADIUS + 8)) / outerSegments * 1.08;

    for (let i = 0; i < outerSegments; i += 1) {
      const angle = (i / outerSegments) * TAU;
      const body = Bodies.rectangle(0, 0, wallLength, wallThickness, {
        isStatic: true,
        friction: 0.26,
        restitution: 0.18,
      });
      body.plugin.local = {
        x: Math.cos(angle) * (TRAY_RADIUS + wallThickness / 2 - 2),
        y: Math.sin(angle) * (TRAY_RADIUS + wallThickness / 2 - 2),
        angle: angle + Math.PI / 2,
      };
      game.trayBodies.push(body);
    }

    for (let i = 0; i < FOOD_KEYS.length; i += 1) {
      const boundary = -Math.PI / 2 + (i + 0.5) * (TAU / FOOD_KEYS.length);
      const body = Bodies.rectangle(0, 0, 122, 13, {
        isStatic: true,
        chamfer: { radius: 6 },
        friction: 0.22,
        restitution: 0.2,
      });
      body.plugin.local = {
        x: Math.cos(boundary) * 130,
        y: Math.sin(boundary) * 130,
        angle: boundary,
      };
      game.trayBodies.push(body);
      game.baffleBodies.push(body);
    }

    const centerBumper = Bodies.circle(0, 0, 35, {
      isStatic: true,
      friction: 0.18,
      restitution: 0.38,
    });
    centerBumper.plugin.local = { x: 0, y: 0, angle: 0 };
    game.trayBodies.push(centerBumper);

    World.add(game.world, game.trayBodies);
    updateTrayBodies();
  }

  function updateTrayBodies() {
    for (const body of game.trayBodies) {
      const local = body.plugin.local;
      const worldPoint = rotatePoint(local.x, local.y, game.trayAngle);
      Body.setPosition(
        body,
        {
          x: CENTER.x + worldPoint.x,
          y: CENTER.y + worldPoint.y,
        },
        true,
      );
      Body.setAngle(body, local.angle + game.trayAngle, true);
    }
    updatePowerItemBodies();
  }

  function updatePowerItemBodies() {
    for (const item of game.powerItems) {
      const worldPoint = rotatePoint(item.local.x, item.local.y, game.trayAngle);
      Body.setPosition(
        item.body,
        {
          x: CENTER.x + worldPoint.x,
          y: CENTER.y + worldPoint.y,
        },
        true,
      );
    }
  }

  function toggleMode() {
    game.mode = game.mode === "daily" ? "normal" : "daily";
    resetGame(false);
    resetControls();
    showGuide();
  }

  function setupRunRng() {
    if (game.mode === "daily") {
      game.dailyDate = getTodayKey();
      game.orderRng = createSeededRng(`orders:${game.dailyDate}`);
      game.itemRng = createSeededRng(`items:${game.dailyDate}`);
      return;
    }

    game.dailyDate = "";
    game.orderRng = Math.random;
    game.itemRng = Math.random;
  }

  function resetGame(shouldRun) {
    clearIngredients();
    clearPowerItems();
    clearParticles();
    setupRunRng();
    game.score = 0;
    game.combo = 1;
    game.maxCombo = 1;
    game.completed = 0;
    game.orderIndex = 1;
    game.orderRule = ORDER_RULES.normal;
    game.orderElapsed = 0;
    game.orderHadWrong = false;
    game.orderHadForbiddenHit = false;
    game.forbiddenType = "";
    game.breakdown = createBreakdown();
    game.runStats = createRunStats();
    game.timeLeft = GAME_SECONDS + getCharacterStats().startTime;
    game.running = shouldRun;
    game.started = shouldRun;
    game.wasRunningBeforeGuide = false;
    game.wasRunningBeforeShop = false;
    game.magnetTimer = 0;
    game.itemSpawnTimer = getInitialItemDelay();
    game.itemMessage = "대기";
    game.itemMessageTimer = 0;
    game.feverTimer = 0;
    game.feverComboArmed = true;
    game.feverParticleTimer = 0;
    game.orderStreak = 0;
    game.skillCooldown = 0;
    game.characterMessage = shouldRun ? "출발!" : "준비 완료";
    game.characterMood = shouldRun ? "happy" : "idle";
    game.characterReactionTimer = shouldRun ? 1.6 : 0;
    game.newAchievements = [];
    game.lastCoinAward = 0;
    game.lastShareText = "";
    game.trayAngle = 0;
    game.trayVelocity = 0;
    game.nextOrderDelay = 0;
    game.lastFrame = 0;
    ui.modal.hidden = true;
    ui.shopOverlay.hidden = true;
    ui.characterSelectOverlay.hidden = true;
    ui.achievementOverlay.hidden = true;
    ui.balanceOverlay.hidden = true;
    ui.copyStatus.textContent = "";
    ui.shopStatus.textContent = "";
    updateTrayBodies();
    createOrder();
    updateCharacterHud(true);
    updateUi(true);
  }

  function startGame() {
    unlockAudio();
    resetGame(true);
    resetControls();
    ui.guideOverlay.hidden = true;
    ui.characterSelectOverlay.hidden = true;
    setCharacterReaction("출발!", "happy", 1.6);
  }

  function showGuide() {
    closeShop(false);
    closeAchievements(false);
    closeBalance(false);
    ui.characterSelectOverlay.hidden = true;
    game.wasRunningBeforeGuide = game.running;
    game.running = false;
    resetControls();
    ui.guideOverlay.hidden = false;
    ui.start.textContent = game.started && game.timeLeft > 0 ? "계속하기" : "게임 시작";
  }

  function closeGuide() {
    unlockAudio();
    ui.guideOverlay.hidden = true;
    resetControls();

    if (!game.started || game.timeLeft <= 0) {
      openCharacterSelect();
      return;
    }

    game.running = game.wasRunningBeforeGuide;
    game.lastFrame = 0;
  }

  function resetControls() {
    controls.left = false;
    controls.right = false;
    for (const button of ui.controls) {
      button.classList.remove("is-active");
    }
  }

  function useSkill() {
    if (!game.running || game.skillCooldown > 0 || game.pieces.length === 0) return;

    unlockAudio();
    game.skillCooldown = SKILL_COOLDOWN * getCharacterStats().skillCooldown;
    game.trayVelocity += game.trayVelocity >= 0 ? 1.15 : -1.15;
    game.itemMessage = "톡!";
    game.itemMessageTimer = 1.2;

    for (const piece of game.pieces) {
      const dx = piece.body.position.x - CENTER.x;
      const dy = piece.body.position.y - CENTER.y;
      const distance = Math.max(60, Math.hypot(dx, dy));
      Body.setVelocity(piece.body, {
        x: piece.body.velocity.x + (dx / distance) * 3.6 + randomRange(-1.2, 1.2),
        y: piece.body.velocity.y + (dy / distance) * 3.6 - 1.2,
      });
      Body.setAngularVelocity(piece.body, randomRange(-0.22, 0.22));
      piece.bump = 0.18;
    }

    burst(CENTER.x, CENTER.y, "#2c9aa0", 24);
    setCharacterReaction("톡!", "skill", 1.2);
    playSound("item");
    vibrate(12);
    updateUi(false);
  }

  function clearIngredients() {
    if (game.pieces.length) {
      World.remove(
        game.world,
        game.pieces.map((piece) => piece.body),
      );
    }
    game.pieces = [];
  }

  function clearPowerItems() {
    if (game.powerItems.length) {
      World.remove(
        game.world,
        game.powerItems.map((item) => item.body),
      );
    }
    game.powerItems = [];
  }

  function clearParticles() {
    game.particles = [];
  }

  function createOrder() {
    clearIngredients();

    const baseCount = Math.min(2 + Math.floor(game.completed / 3), 5);
    const count = clamp(Math.round(baseCount * meta.balance.orderDifficulty), 2, 5);
    const order = {};
    game.progress = {};
    game.targetTotal = count;
    game.targetDone = 0;
    game.orderElapsed = 0;
    game.orderHadWrong = false;
    game.orderHadForbiddenHit = false;
    game.forbiddenType = "";
    game.orderRule = pickOrderRule();
    const foodPool = game.orderRule.foods || FOOD_KEYS;

    for (let i = 0; i < count; i += 1) {
      const key = foodPool[Math.floor(game.orderRng() * foodPool.length)];
      order[key] = (order[key] || 0) + 1;
      game.progress[key] = 0;
    }

    if (game.orderRule.id === "spicy" && !order.kimchi) {
      ensureOrderHas(order, "kimchi");
    }

    if (game.orderRule.id === "heavy") {
      ensureOrderHas(order, "rice");
    }

    if (game.orderRule.id === "slippery") {
      ensureOrderHas(order, "nori");
    }

    if (game.orderRule.id === "forbidden") {
      game.forbiddenType = pickForbiddenType(order);
    }

    game.order = order;
    game.orderIndex = game.completed + 1;

    const spawnList = [];
    for (const [type, amount] of Object.entries(order)) {
      for (let i = 0; i < amount; i += 1) {
        spawnList.push(type);
      }
    }
    shuffle(spawnList, game.orderRng);
    spawnList.forEach((type, index) => spawnIngredient(type, index, spawnList.length));
    updateUi(true);
  }

  function ensureOrderHas(order, type) {
    if (order[type]) return;

    const replaceTarget = Object.keys(order).find((key) => key !== type) || Object.keys(order)[0];
    if (!replaceTarget) return;

    order[replaceTarget] -= 1;
    if (order[replaceTarget] <= 0) {
      delete order[replaceTarget];
      delete game.progress[replaceTarget];
    }

    order[type] = (order[type] || 0) + 1;
    game.progress[type] = game.progress[type] || 0;
  }

  function pickForbiddenType(order) {
    const candidates = FOOD_KEYS.filter((type) => !order[type]);
    const pool = candidates.length ? candidates : FOOD_KEYS;
    return pool[Math.floor(game.orderRng() * pool.length)];
  }

  function pickOrderRule() {
    if (game.completed === 0) return ORDER_RULES.normal;
    if (game.orderRng() > meta.balance.specialChance) return ORDER_RULES.normal;
    return SPECIAL_RULES[Math.floor(game.orderRng() * SPECIAL_RULES.length)];
  }

  function spawnIngredient(type, index, total) {
    const food = FOODS[type];
    const spread = Math.min(120, 34 * total);
    const offset = index - (total - 1) / 2;
    const body = Bodies.circle(
      CENTER.x + offset * 20 + randomRange(-12, 12, game.orderRng),
      CENTER.y - 30 + randomRange(-spread * 0.2, spread * 0.18, game.orderRng),
      food.radius,
      {
        friction: food.friction,
        frictionAir: food.frictionAir,
        restitution: food.restitution,
        density: food.density,
        label: `ingredient:${type}`,
      },
    );

    const piece = {
      id: cryptoId(),
      type,
      body,
      hold: 0,
      wrongHold: 0,
      forbiddenHold: 0,
      bump: 0,
      scored: false,
      bornAt: performance.now(),
    };
    body.plugin.ingredient = piece;
    Body.setVelocity(body, {
      x: randomRange(-2.5, 2.5, game.orderRng),
      y: randomRange(-1.5, 1.5, game.orderRng),
    });
    game.pieces.push(piece);
    World.add(game.world, body);
  }

  function spawnPowerItem() {
    if (!game.running || game.powerItems.length > 0) return;

    const type = ITEM_KEYS[Math.floor(game.itemRng() * ITEM_KEYS.length)];
    const angle = randomRange(0, TAU, game.itemRng);
    const radius = randomRange(78, 182, game.itemRng);
    const item = {
      id: cryptoId(),
      type,
      local: polar(angle, radius),
      body: Bodies.circle(0, 0, 22, {
        isStatic: true,
        isSensor: true,
        label: `item:${type}`,
      }),
      phase: randomRange(0, TAU, game.itemRng),
      collected: false,
    };

    item.body.plugin.powerItem = item;
    game.powerItems.push(item);
    World.add(game.world, item.body);
    updatePowerItemBodies();
    game.itemMessage = ITEMS[type].name;
    game.itemMessageTimer = 1.8;
  }

  function collectPowerItem(item) {
    if (item.collected) return;

    item.collected = true;
    World.remove(game.world, item.body);
    game.powerItems = game.powerItems.filter((candidate) => candidate !== item);
    game.itemSpawnTimer = getItemRespawnDelay();

    const config = ITEMS[item.type];
    game.runStats.itemsCollected += 1;
    applyPowerEffect(item.type);
    burst(item.body.position.x, item.body.position.y, config.color, 26);
    game.itemMessage = config.short;
    game.itemMessageTimer = 2.2;
    setCharacterReaction(`${config.short}!`, "happy", 1.4);
    playSound("item");
    vibrate([10, 18, 10]);
    updateUi(true);
  }

  function getItemRespawnDelay() {
    const delay = game.feverTimer > 0
      ? randomRange(1.8, 3.4, game.itemRng)
      : randomRange(7.5, 10.5, game.itemRng);
    return delay * getCharacterStats().itemDelay / meta.balance.itemFrequency;
  }

  function getInitialItemDelay() {
    return 5.5 * getCharacterStats().itemDelay / meta.balance.itemFrequency;
  }

  function applyPowerEffect(type) {
    if (type === "clock") {
      game.timeLeft = Math.min(getTimeCap(), game.timeLeft + 5);
      addScore(80, "item");
    }

    if (type === "sauce") {
      game.combo += 3;
      game.maxCombo = Math.max(game.maxCombo, game.combo);
      addScore(220, "item");
      checkFeverTriggers();
    }

    if (type === "magnet") {
      game.magnetTimer = Math.max(game.magnetTimer, 6 * getCharacterStats().magnet);
      addScore(60, "item");
    }
  }

  function addScore(amount, category = "base") {
    const safeCategory = SCORE_CATEGORIES[category] ? category : "base";
    const adjusted = Math.max(0, Math.round(amount * getScoreMultiplier(safeCategory)));
    if (adjusted <= 0) return;

    const feverBonus = game.feverTimer > 0 ? adjusted : 0;
    const total = adjusted + feverBonus;
    game.score += total;
    game.breakdown[safeCategory] += adjusted;
    game.breakdown.fever += feverBonus;
  }

  function applyPenalty(amount) {
    const before = game.score;
    game.score = Math.max(0, game.score - Math.round(amount));
    game.breakdown.penalty += before - game.score;
  }

  function getScoreMultiplier(category) {
    const stats = getCharacterStats();
    if (category === "combo") return stats.comboScore || 1;
    return stats.score || 1;
  }

  function applyMagnetForces() {
    if (game.magnetTimer <= 0) return;

    for (const piece of game.pieces) {
      if (piece.scored || !needsMore(piece.type)) continue;

      const slot = SLOTS.find((candidate) => candidate.type === piece.type);
      if (!slot) continue;

      const targetLocal = polar(slot.angle, 176);
      const target = rotatePoint(targetLocal.x, targetLocal.y, game.trayAngle);
      const dx = CENTER.x + target.x - piece.body.position.x;
      const dy = CENTER.y + target.y - piece.body.position.y;
      const distance = Math.max(80, Math.hypot(dx, dy));
      const strength = 0.000055 * piece.body.mass;

      Body.applyForce(piece.body, piece.body.position, {
        x: (dx / distance) * strength,
        y: (dy / distance) * strength,
      });
    }
  }

  function frame(timestamp) {
    const previous = game.lastFrame || timestamp;
    const dt = Math.min(0.033, Math.max(0.001, (timestamp - previous) / 1000));
    game.lastFrame = timestamp;

    if (game.running) {
      updateGame(dt);
    }
    updateParticles(dt);
    draw();

    game.uiTimer += dt;
    if (game.uiTimer > 0.08) {
      updateUi(false);
      game.uiTimer = 0;
    }

    requestAnimationFrame(frame);
  }

  function updateGame(dt) {
    const input = Number(controls.right) - Number(controls.left);
    const rotatePower = getCharacterStats().rotate;
    game.trayVelocity += input * 8.2 * rotatePower * dt;
    game.trayVelocity *= Math.pow(0.78, dt * 5.8);
    game.trayVelocity = clamp(game.trayVelocity, -3.2 * rotatePower, 3.2 * rotatePower);
    game.trayAngle = normalizeAngle(game.trayAngle + game.trayVelocity * dt);
    updateTrayBodies();

    applyMagnetForces();
    Engine.update(game.engine, dt * 1000);
    containEscapedPieces();
    updateScoring(dt);
    updateItemTimers(dt);
    updateFever(dt);
    updateSkill(dt);
    updateCharacterReaction(dt);

    if (game.nextOrderDelay > 0) {
      game.nextOrderDelay -= dt;
      if (game.nextOrderDelay <= 0 && game.running) {
        createOrder();
      }
    }

    if (game.nextOrderDelay <= 0) {
      game.orderElapsed += dt;
    }
    game.timeLeft -= dt;
    if (game.timeLeft <= 0) {
      endGame();
    }
  }

  function updateItemTimers(dt) {
    game.magnetTimer = Math.max(0, game.magnetTimer - dt);
    game.itemMessageTimer = Math.max(0, game.itemMessageTimer - dt);

    if (game.powerItems.length === 0) {
      game.itemSpawnTimer -= game.feverTimer > 0 ? dt * 2.4 : dt;
      if (game.itemSpawnTimer <= 0) {
        spawnPowerItem();
      }
    }
  }

  function updateFever(dt) {
    if (game.combo < FEVER_COMBO) {
      game.feverComboArmed = true;
    }

    if (game.feverTimer <= 0) return;

    game.feverTimer = Math.max(0, game.feverTimer - dt);
    game.feverParticleTimer -= dt;

    if (game.feverParticleTimer <= 0) {
      const angle = randomRange(0, TAU);
      const radius = randomRange(90, 230);
      const point = rotatePoint(Math.cos(angle) * radius, Math.sin(angle) * radius, game.trayAngle);
      burst(CENTER.x + point.x, CENTER.y + point.y, randomFeverColor(), 5);
      game.feverParticleTimer = 0.18;
    }
  }

  function updateSkill(dt) {
    game.skillCooldown = Math.max(0, game.skillCooldown - dt);
  }

  function containEscapedPieces() {
    for (const piece of game.pieces) {
      const body = piece.body;
      const dx = body.position.x - CENTER.x;
      const dy = body.position.y - CENTER.y;
      const distance = Math.hypot(dx, dy);
      if (distance > TRAY_RADIUS + 120) {
        resetPiece(piece);
        applyPenalty(20);
        registerMistake();
      }
    }
  }

  function updateScoring(dt) {
    for (const piece of [...game.pieces]) {
      if (piece.scored) continue;
      piece.bump = Math.max(0, piece.bump - dt);

      const body = piece.body;
      const slot = getSlotForBody(body);

      if (slot && isForbiddenSlot(slot, piece)) {
        piece.forbiddenHold += dt;
        piece.wrongHold = 0;
        if (piece.forbiddenHold >= 0.78) {
          punishForbiddenPiece(piece);
        }
      } else if (slot && slot.type === piece.type && needsMore(piece.type)) {
        scorePiece(piece, slot);
      } else if (slot && slot.type !== piece.type) {
        piece.forbiddenHold = Math.max(0, piece.forbiddenHold - dt * 1.8);
        piece.wrongHold += dt;
        if (piece.wrongHold >= 1.35) {
          punishPiece(piece);
        }
      } else {
        piece.forbiddenHold = Math.max(0, piece.forbiddenHold - dt * 1.8);
        piece.wrongHold = Math.max(0, piece.wrongHold - dt * 1.8);
      }
    }
  }

  function isForbiddenSlot(slot, piece) {
    return (
      game.orderRule.id === "forbidden" &&
      game.forbiddenType &&
      slot.type === game.forbiddenType &&
      slot.type !== piece.type
    );
  }

  function scorePiece(piece, slot) {
    piece.scored = true;
    game.progress[piece.type] += 1;
    game.targetDone += 1;

    const speedBonus = Math.max(0, Math.round(game.timeLeft * 0.35));
    const baseScore = 120 + speedBonus;
    const comboBonus = 120 * Math.max(0, game.combo - 1);
    addScore(baseScore, "base");
    addScore(comboBonus, "combo");
    if (game.orderRule.id === "spicy" && piece.type === "kimchi") {
      addScore(baseScore + comboBonus, "order");
    }
    game.combo += 1;
    game.maxCombo = Math.max(game.maxCombo, game.combo);
    checkFeverTriggers();

    burst(piece.body.position.x, piece.body.position.y, FOODS[piece.type].color, 18);
    if (game.combo >= 5 && game.combo % 5 === 0) {
      setCharacterReaction(`콤보 x${game.combo - 1}!`, "happy", 1.3);
      playSound("combo");
      vibrate([8, 14, 8]);
    } else {
      playSound("success");
      vibrate(10);
    }
    World.remove(game.world, piece.body);
    game.pieces = game.pieces.filter((candidate) => candidate !== piece);

    if (slot) {
      pulseSlot(slot.type);
    }

    updateUi(true);

    if (game.targetDone >= game.targetTotal) {
      completeOrder();
    }
  }

  function punishPiece(piece) {
    piece.wrongHold = 0;
    applyPenalty(12);
    registerMistake();
    burst(piece.body.position.x, piece.body.position.y, "#2d4d46", 8);
    Body.setVelocity(piece.body, {
      x: piece.body.velocity.x * 0.35,
      y: piece.body.velocity.y * 0.35 - 1.2,
    });
  }

  function punishForbiddenPiece(piece) {
    piece.forbiddenHold = 0;
    applyPenalty(75);
    registerMistake();
    game.runStats.forbiddenHits += 1;
    game.orderHadForbiddenHit = true;
    game.itemMessage = "금지칸 -75";
    game.itemMessageTimer = 1.4;
    burst(piece.body.position.x, piece.body.position.y, "#e85d4f", 14);
    Body.setVelocity(piece.body, {
      x: piece.body.velocity.x * -0.25 + randomRange(-1.2, 1.2),
      y: piece.body.velocity.y * 0.25 - 2,
    });
  }

  function registerMistake() {
    game.combo = 1;
    game.orderHadWrong = true;
    game.orderStreak = 0;
    game.runStats.wrongs += 1;
    game.runStats.flawlessStreak = 0;
    setCharacterReaction("앗, 다시!", "mistake", 1.3);
    playSound("mistake");
    vibrate(24);
  }

  function resetPiece(piece) {
    Body.setPosition(piece.body, {
      x: CENTER.x + randomRange(-35, 35),
      y: CENTER.y - 80 + randomRange(-20, 20),
    });
    Body.setVelocity(piece.body, {
      x: randomRange(-1.5, 1.5),
      y: randomRange(-2, 0.5),
    });
    Body.setAngularVelocity(piece.body, randomRange(-0.08, 0.08));
  }

  function completeOrder() {
    game.completed += 1;
    game.orderStreak += 1;
    if (game.orderHadWrong) {
      game.runStats.flawlessStreak = 0;
    } else {
      game.runStats.flawlessStreak += 1;
    }
    if (game.orderRule.id === "clean" && !game.orderHadWrong) {
      game.runStats.cleanOrders += 1;
    }
    addScore(260, "order");
    addScore(game.combo * 18, "combo");
    applyOrderRuleBonus();
    game.combo += 1;
    game.maxCombo = Math.max(game.maxCombo, game.combo);
    burst(CENTER.x, CENTER.y, "#f1c453", 36);
    setCharacterReaction("도시락 완성!", "happy", 1.5);
    playSound("combo");
    vibrate([12, 20, 12]);
    checkFeverTriggers();
    game.nextOrderDelay = 0.45;
    updateUi(true);
  }

  function applyOrderRuleBonus() {
    if (game.orderRule.id === "fast" && game.orderElapsed <= 10) {
      addScore(500, "order");
      game.itemMessage = "빠른 주문 +500";
      game.itemMessageTimer = 2;
      burst(CENTER.x, CENTER.y - 50, "#2c9aa0", 20);
    }

    if (game.orderRule.id === "clean" && !game.orderHadWrong) {
      addScore(450, "order");
      game.itemMessage = "깔끔 주문 +450";
      game.itemMessageTimer = 2;
      burst(CENTER.x, CENTER.y - 50, "#f1c453", 20);
    }

    if (game.orderRule.id === "protein") {
      addScore(220, "order");
      game.itemMessage = "단백질 +220";
      game.itemMessageTimer = 2;
    }

    if (game.orderRule.id === "heavy") {
      addScore(300, "order");
      game.itemMessage = "무거운 주문 +300";
      game.itemMessageTimer = 2;
    }

    if (game.orderRule.id === "slippery") {
      addScore(300, "order");
      game.itemMessage = "미끄러운 주문 +300";
      game.itemMessageTimer = 2;
    }

    if (game.orderRule.id === "forbidden" && !game.orderHadForbiddenHit) {
      addScore(360, "order");
      game.itemMessage = "금지칸 회피 +360";
      game.itemMessageTimer = 2;
    }
  }

  function checkFeverTriggers() {
    if (game.feverTimer > 0) return;

    if (game.combo >= FEVER_COMBO && game.feverComboArmed) {
      game.feverComboArmed = false;
      activateFever("콤보 피버!");
      return;
    }

    if (game.orderStreak >= FEVER_ORDER_STREAK) {
      game.orderStreak = 0;
      activateFever("연속 완성 피버!");
    }
  }

  function activateFever(message) {
    game.feverTimer = FEVER_SECONDS;
    game.runStats.feverActivations += 1;
    game.feverParticleTimer = 0;
    game.itemSpawnTimer = Math.min(game.itemSpawnTimer, 1.2);
    game.itemMessage = message;
    game.itemMessageTimer = 2.4;
    burst(CENTER.x, CENTER.y, "#e85d4f", 46);
    burst(CENTER.x, CENTER.y, "#f1c453", 34);
    setCharacterReaction(message, "fever", 2.4);
    playSound("fever");
    vibrate([22, 35, 22]);
  }

  function endGame() {
    game.running = false;
    game.timeLeft = 0;
    clearIngredients();
    clearPowerItems();
    awardRunRewards();
    ui.finalScore.textContent = Math.round(game.score).toLocaleString("ko-KR");
    ui.finalOrders.textContent = `${game.completed}`;
    ui.finalCombo.textContent = `x${Math.max(1, game.maxCombo - 1)}`;
    ui.finalCoins.textContent = `+${game.lastCoinAward.toLocaleString("ko-KR")}`;
    ui.resultTitle.textContent = game.completed >= 8 ? "특급 도시락" : "도시락 마감";
    game.lastShareText = buildShareText();
    ui.sharePreview.textContent = game.lastShareText;
    ui.copyStatus.textContent = "";
    renderScoreBreakdown();
    renderNewAchievements();
    saveAndRenderLeaderboard();
    ui.modal.hidden = false;
    setCharacterReaction("수고했어요!", "happy", 2.2);
    playSound("gameover");
    vibrate(35);
    updateUi(true);
  }

  function saveAndRenderLeaderboard() {
    const currentId = cryptoId();
    const currentEntry = {
      id: currentId,
      score: Math.round(game.score),
      completed: game.completed,
      combo: Math.max(1, game.maxCombo - 1),
      date: new Date().toISOString(),
    };

    try {
      const entries = loadLeaderboard();
      entries.sort(compareEntries);
      const previousBest = entries[0]?.score || 0;
      entries.push(currentEntry);
      entries.sort(compareEntries);

      const rank = entries.findIndex((entry) => entry.id === currentId) + 1;
      const topEntries = entries.slice(0, 5);
      window.localStorage.setItem(getLeaderboardKey(), JSON.stringify(topEntries));
      renderDailyDelta(previousBest, currentEntry.score);
      renderLeaderboard(topEntries, currentId, rank);
    } catch {
      ui.finalRank.textContent = "저장 불가";
      renderDailyDelta(0, currentEntry.score);
      renderLeaderboard([currentEntry], currentId, 1);
    }
  }

  function loadLeaderboard() {
    const raw = window.localStorage.getItem(getLeaderboardKey());
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry) => Number.isFinite(entry.score))
      .map((entry) => ({
        id: String(entry.id || cryptoId()),
        score: Math.max(0, Math.round(entry.score)),
        completed: Math.max(0, Math.round(entry.completed || 0)),
        combo: Math.max(1, Math.round(entry.combo || 1)),
        date: entry.date || new Date().toISOString(),
      }));
  }

  function compareEntries(a, b) {
    return (
      b.score - a.score ||
      b.completed - a.completed ||
      b.combo - a.combo ||
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  function renderLeaderboard(entries, currentId, rank) {
    ui.leaderboardTitle.textContent = game.mode === "daily" ? "오늘 챌린지 TOP 5" : "로컬 TOP 5";
    ui.finalRank.textContent = rank <= 5 ? `이번 기록 ${rank}위` : "TOP 5 밖";

    ui.leaderboard.replaceChildren(
      ...entries.map((entry, index) => {
        const row = document.createElement("li");
        row.className = "leaderboard-row";
        if (entry.id === currentId) {
          row.classList.add("is-current");
        }

        const place = document.createElement("span");
        place.textContent = `${index + 1}`;

        const score = document.createElement("strong");
        score.textContent = entry.score.toLocaleString("ko-KR");

        const meta = document.createElement("span");
        meta.className = "leaderboard-meta";
        meta.textContent = `${entry.completed}개 / x${entry.combo}`;

        row.append(place, score, meta);
        return row;
      }),
    );
  }

  function getLeaderboardKey() {
    if (game.mode === "daily") {
      return `${DAILY_LEADERBOARD_KEY}:${game.dailyDate || getTodayKey()}`;
    }
    return LEADERBOARD_KEY;
  }

  function buildShareText() {
    const modeText = game.mode === "daily" ? `오늘 챌린지 ${game.dailyDate}` : "일반 모드";
    const score = Math.round(game.score).toLocaleString("ko-KR");
    const combo = Math.max(1, game.maxCombo - 1);
    return `빙글도시락 러시 ${score}점 / 도시락 ${game.completed}개 / 최고 콤보 x${combo} / ${getCharacter().name} / ${modeText}`;
  }

  async function copyResultText() {
    if (!game.lastShareText) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(game.lastShareText);
      } else {
        fallbackCopy(game.lastShareText);
      }
      ui.copyStatus.textContent = "결과를 복사했습니다.";
    } catch {
      fallbackCopy(game.lastShareText);
      ui.copyStatus.textContent = "결과를 복사했습니다.";
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function createBreakdown() {
    return {
      base: 0,
      combo: 0,
      order: 0,
      item: 0,
      fever: 0,
      penalty: 0,
    };
  }

  function createRunStats() {
    return {
      feverActivations: 0,
      cleanOrders: 0,
      flawlessStreak: 0,
      itemsCollected: 0,
      wrongs: 0,
      forbiddenHits: 0,
    };
  }

  function createDefaultMeta() {
    const inventory = {};
    for (const id of SHOP_ITEM_ORDER) {
      inventory[id] = 0;
    }
    return {
      coins: 0,
      selectedCharacter: "cook",
      ownedCharacters: ["cook"],
      inventory,
      achievements: [],
      totalPurchases: 0,
      soundEnabled: true,
      balance: { ...DEFAULT_BALANCE },
    };
  }

  function loadMeta() {
    const defaults = createDefaultMeta();
    try {
      const raw = window.localStorage.getItem(META_KEY);
      if (!raw) return defaults;

      const parsed = JSON.parse(raw);
      const ownedCharacters = new Set(
        Array.isArray(parsed.ownedCharacters)
          ? parsed.ownedCharacters.filter((id) => CHARACTERS[id])
          : [],
      );
      ownedCharacters.add("cook");

      const inventory = {};
      for (const id of SHOP_ITEM_ORDER) {
        inventory[id] = Math.max(0, Math.round(parsed.inventory?.[id] || 0));
      }

      const achievements = Array.isArray(parsed.achievements)
        ? parsed.achievements.filter((id) => ACHIEVEMENTS[id])
        : [];
      const selectedCharacter =
        CHARACTERS[parsed.selectedCharacter] && ownedCharacters.has(parsed.selectedCharacter)
          ? parsed.selectedCharacter
          : "cook";

      return {
        coins: Math.max(0, Math.round(parsed.coins || 0)),
        selectedCharacter,
        ownedCharacters: [...ownedCharacters],
        inventory,
        achievements: [...new Set(achievements)],
        totalPurchases: Math.max(0, Math.round(parsed.totalPurchases || 0)),
        soundEnabled: parsed.soundEnabled !== false,
        balance: normalizeBalance(parsed.balance),
      };
    } catch {
      return defaults;
    }
  }

  function saveMeta() {
    try {
      window.localStorage.setItem(META_KEY, JSON.stringify(meta));
    } catch {
      ui.shopStatus.textContent = "저장을 사용할 수 없습니다.";
    }
  }

  function getCharacter() {
    return CHARACTERS[meta.selectedCharacter] || CHARACTERS.cook;
  }

  function getCharacterStats() {
    const baseStats = getCharacter().stats;
    const power = meta.balance.characterPower;
    return {
      rotate: tuneMultiplier(baseStats.rotate, power),
      score: tuneMultiplier(baseStats.score, power),
      comboScore: tuneMultiplier(baseStats.comboScore, power),
      itemDelay: tuneMultiplier(baseStats.itemDelay, power),
      magnet: tuneMultiplier(baseStats.magnet, power),
      skillCooldown: tuneMultiplier(baseStats.skillCooldown, power),
      startTime: Math.round(baseStats.startTime * power),
    };
  }

  function tuneMultiplier(value, power) {
    return 1 + (value - 1) * power;
  }

  function normalizeBalance(balance) {
    const normalized = { ...DEFAULT_BALANCE };
    for (const control of BALANCE_CONTROLS) {
      const raw = Number(balance?.[control.id]);
      normalized[control.id] = Number.isFinite(raw)
        ? clamp(raw, control.min, control.max)
        : DEFAULT_BALANCE[control.id];
    }
    return normalized;
  }

  function updateMetaUi() {
    const character = getCharacter();
    ui.coin.textContent = meta.coins.toLocaleString("ko-KR");
    ui.character.textContent = character.name;
    ui.shopCoin.textContent = `${meta.coins.toLocaleString("ko-KR")}코인`;
    ui.selectCoin.textContent = `${meta.coins.toLocaleString("ko-KR")}코인`;
    updateCharacterHud(false);
  }

  function openCharacterSelect() {
    unlockAudio();
    game.wasRunningBeforeShop = game.running;
    game.running = false;
    resetControls();
    closeShop(false);
    closeAchievements(false);
    closeBalance(false);
    ui.guideOverlay.hidden = true;
    ui.modal.hidden = true;
    renderStartCharacterSelect();
    ui.characterSelectOverlay.hidden = false;
  }

  function renderStartCharacterSelect() {
    updateMetaUi();
    ui.startCharacterList.replaceChildren(
      ...CHARACTER_ORDER.map((id) => {
        const character = CHARACTERS[id];
        const owned = meta.ownedCharacters.includes(id);
        const selected = meta.selectedCharacter === id;
        const card = document.createElement("button");
        card.type = "button";
        card.className = "select-character-card";
        card.classList.toggle("is-selected", selected);
        card.classList.toggle("is-locked", !owned);
        card.dataset.character = id;

        const image = document.createElement("img");
        image.src = character.image;
        image.alt = "";
        image.loading = "lazy";

        const info = document.createElement("div");
        info.className = "shop-info";
        const name = document.createElement("strong");
        name.textContent = character.name;
        const detail = document.createElement("span");
        detail.textContent = owned ? character.description : `${getCharacterCost(id)}코인으로 해금`;
        info.append(name, detail);

        const state = document.createElement("span");
        state.className = "collection-state";
        state.textContent = selected ? "선택됨" : owned ? "선택" : "잠김";

        card.append(image, info, state);
        return card;
      }),
    );
  }

  function handleStartCharacterClick(event) {
    const card = event.target.closest("[data-character]");
    if (!card) return;

    const id = card.dataset.character;
    if (!meta.ownedCharacters.includes(id)) {
      openShop("characters");
      return;
    }

    meta.selectedCharacter = id;
    saveMeta();
    playSound("success");
    setCharacterReaction(`${CHARACTERS[id].name} 출전`, "happy", 1.4);
    renderStartCharacterSelect();
    renderShop();
    updateUi(true);
  }

  function openAchievements() {
    unlockAudio();
    game.wasRunningBeforeShop = game.running;
    game.running = false;
    resetControls();
    closeShop(false);
    closeBalance(false);
    renderAchievementCollection();
    ui.achievementOverlay.hidden = false;
  }

  function closeAchievements(shouldResume = true) {
    if (ui.achievementOverlay.hidden) return;
    ui.achievementOverlay.hidden = true;
    resetControls();
    resumeAfterOverlay(shouldResume);
  }

  function renderAchievementCollection() {
    const completedCount = ACHIEVEMENT_ORDER.filter((id) => meta.achievements.includes(id)).length;
    ui.achievementSummary.textContent = `${completedCount}/${ACHIEVEMENT_ORDER.length}`;
    ui.achievementCollection.replaceChildren(
      ...ACHIEVEMENT_ORDER.map((id) => {
        const achievement = ACHIEVEMENTS[id];
        const complete = meta.achievements.includes(id);
        const value = Math.min(achievement.target, getAchievementValue(id));
        const row = document.createElement("div");
        row.className = "collection-row";
        row.classList.toggle("is-complete", complete);

        const info = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = achievement.name;
        const detail = document.createElement("span");
        detail.textContent = `${achievement.description} / 보상 ${achievement.reward}코인`;
        info.append(name, detail);

        const state = document.createElement("span");
        state.className = "collection-state";
        state.textContent = complete ? "완료" : `${value}/${achievement.target}`;

        row.append(info, state);
        return row;
      }),
    );
  }

  function openBalance() {
    unlockAudio();
    game.wasRunningBeforeShop = game.running;
    game.running = false;
    resetControls();
    closeShop(false);
    closeAchievements(false);
    renderBalanceControls();
    ui.balanceOverlay.hidden = false;
  }

  function closeBalance(shouldResume = true) {
    if (ui.balanceOverlay.hidden) return;
    ui.balanceOverlay.hidden = true;
    ui.balanceStatus.textContent = "";
    resetControls();
    resumeAfterOverlay(shouldResume);
  }

  function renderBalanceControls() {
    const isDefault = BALANCE_CONTROLS.every((control) => meta.balance[control.id] === DEFAULT_BALANCE[control.id]);
    ui.balancePreset.textContent = isDefault ? "기본" : "커스텀";
    ui.balanceList.replaceChildren(
      ...BALANCE_CONTROLS.map((control) => {
        const row = document.createElement("div");
        row.className = "balance-row";

        const label = document.createElement("label");
        label.setAttribute("for", `balance-${control.id}`);
        const title = document.createElement("strong");
        title.textContent = control.label;
        const detail = document.createElement("span");
        detail.textContent = control.detail;
        label.append(title, detail);

        const input = document.createElement("input");
        input.id = `balance-${control.id}`;
        input.type = "range";
        input.min = `${control.min}`;
        input.max = `${control.max}`;
        input.step = `${control.step}`;
        input.value = `${meta.balance[control.id]}`;
        input.dataset.balance = control.id;

        const value = document.createElement("span");
        value.className = "balance-value";
        value.textContent = formatBalanceValue(control, meta.balance[control.id]);

        row.append(label, input, value);
        return row;
      }),
    );
  }

  function handleBalanceInput(event) {
    const input = event.target.closest("input[data-balance]");
    if (!input) return;

    const control = BALANCE_CONTROLS.find((candidate) => candidate.id === input.dataset.balance);
    if (!control) return;

    meta.balance[control.id] = clamp(Number(input.value), control.min, control.max);
    meta.balance = normalizeBalance(meta.balance);
    saveMeta();
    ui.balanceStatus.textContent = "튜닝값을 저장했습니다.";
    renderBalanceControls();
    renderShop();
    renderStartCharacterSelect();
    updateUi(true);
  }

  function resetBalance() {
    meta.balance = { ...DEFAULT_BALANCE };
    saveMeta();
    ui.balanceStatus.textContent = "기본 밸런스로 되돌렸습니다.";
    renderBalanceControls();
    renderShop();
    renderStartCharacterSelect();
    updateUi(true);
  }

  function formatBalanceValue(control, value) {
    if (control.id === "specialChance") {
      return `${Math.round(value * 100)}%`;
    }
    return `${value.toFixed(2)}${control.suffix}`;
  }

  function toggleSound() {
    meta.soundEnabled = !meta.soundEnabled;
    audio.enabled = meta.soundEnabled;
    if (!audio.enabled && audio.context?.state === "running") {
      audio.context.suspend();
    }
    saveMeta();
    updateSoundUi();
  }

  function updateSoundUi() {
    ui.soundButton.textContent = meta.soundEnabled ? "사운드 ON" : "사운드 OFF";
    ui.soundButton.classList.toggle("is-muted", !meta.soundEnabled);
  }

  function setCharacterReaction(message, mood = "happy", seconds = 1.2) {
    game.characterMessage = message;
    game.characterMood = mood;
    game.characterReactionTimer = seconds;
    updateCharacterHud(true);
  }

  function updateCharacterReaction(dt) {
    if (game.characterReactionTimer <= 0) return;

    game.characterReactionTimer = Math.max(0, game.characterReactionTimer - dt);
    if (game.characterReactionTimer <= 0) {
      game.characterMessage = game.running ? "집중!" : "준비 완료";
      game.characterMood = "idle";
      updateCharacterHud(true);
    }
  }

  function updateCharacterHud(force) {
    const character = getCharacter();
    if (force || ui.activeCharacterImage.src.indexOf(character.image) === -1) {
      ui.activeCharacterImage.src = character.image;
    }
    ui.activeCharacterName.textContent = character.name;
    ui.characterBubble.textContent = game.characterMessage || "준비 완료";
    ui.characterHud.classList.toggle("is-happy", game.characterMood === "happy");
    ui.characterHud.classList.toggle("is-skill", game.characterMood === "skill");
    ui.characterHud.classList.toggle("is-fever", game.characterMood === "fever");
    ui.characterHud.classList.toggle("is-mistake", game.characterMood === "mistake");
  }

  function isBlockingOverlayOpen() {
    return (
      !ui.shopOverlay.hidden ||
      !ui.characterSelectOverlay.hidden ||
      !ui.achievementOverlay.hidden ||
      !ui.balanceOverlay.hidden ||
      !ui.modal.hidden
    );
  }

  function closeTopOverlay() {
    if (!ui.balanceOverlay.hidden) {
      closeBalance();
      return;
    }
    if (!ui.achievementOverlay.hidden) {
      closeAchievements();
      return;
    }
    if (!ui.shopOverlay.hidden) {
      closeShop();
      return;
    }
    if (!ui.characterSelectOverlay.hidden) {
      ui.characterSelectOverlay.hidden = true;
      resumeAfterOverlay(true);
    }
  }

  function resumeAfterOverlay(shouldResume) {
    if (
      shouldResume &&
      game.wasRunningBeforeShop &&
      ui.guideOverlay.hidden &&
      ui.modal.hidden &&
      ui.shopOverlay.hidden &&
      ui.characterSelectOverlay.hidden &&
      ui.achievementOverlay.hidden &&
      ui.balanceOverlay.hidden
    ) {
      game.running = true;
      game.lastFrame = 0;
    }
  }

  function openShop(section) {
    unlockAudio();
    game.wasRunningBeforeShop = game.running;
    game.running = false;
    resetControls();
    closeAchievements(false);
    closeBalance(false);
    renderShop();
    ui.shopOverlay.hidden = false;
    ui.shopStatus.textContent =
      section === "characters" ? "보유 캐릭터는 바로 선택할 수 있습니다." : "아이템은 진행 중인 판에 사용할 수 있습니다.";
  }

  function closeShop(shouldResume = true) {
    if (ui.shopOverlay.hidden) return;
    ui.shopOverlay.hidden = true;
    ui.shopStatus.textContent = "";
    resetControls();
    resumeAfterOverlay(shouldResume);
  }

  function renderShop() {
    updateMetaUi();
    renderCharacterShop();
    renderItemShop();
  }

  function renderCharacterShop() {
    ui.characterShop.replaceChildren(
      ...CHARACTER_ORDER.map((id) => {
        const character = CHARACTERS[id];
        const owned = meta.ownedCharacters.includes(id);
        const selected = meta.selectedCharacter === id;
        const row = document.createElement("div");
        row.className = "shop-row";
        row.classList.add("is-character-row");
        row.classList.toggle("is-selected", selected);

        const avatar = document.createElement("span");
        avatar.className = "shop-avatar";
        avatar.classList.add("character-avatar");
        avatar.style.background = character.color;
        const image = document.createElement("img");
        image.src = character.image;
        image.alt = "";
        image.loading = "lazy";
        avatar.append(image);

        const info = document.createElement("div");
        info.className = "shop-info";
        const name = document.createElement("strong");
        name.textContent = character.name;
        const detail = document.createElement("span");
        detail.textContent = character.description;
        info.append(name, detail);

        const actions = document.createElement("div");
        actions.className = "shop-actions";
        const button = document.createElement("button");
        const cost = getCharacterCost(id);
        button.type = "button";
        button.dataset.shopAction = owned ? "select-character" : "buy-character";
        button.dataset.character = id;
        button.disabled = selected || (!owned && meta.coins < cost);
        button.textContent = selected ? "선택됨" : owned ? "선택" : `${cost}코인`;
        actions.append(button);

        row.append(avatar, info, actions);
        return row;
      }),
    );
  }

  function renderItemShop() {
    ui.shopItems.replaceChildren(
      ...SHOP_ITEM_ORDER.map((id) => {
        const item = SHOP_ITEMS[id];
        const count = meta.inventory[id] || 0;
        const row = document.createElement("div");
        row.className = "shop-row";

        const avatar = document.createElement("span");
        avatar.className = "shop-avatar";
        avatar.style.background = item.color;
        avatar.textContent = item.short.slice(0, 2);

        const info = document.createElement("div");
        info.className = "shop-info";
        const name = document.createElement("strong");
        name.textContent = `${item.name} x${count}`;
        const detail = document.createElement("span");
        detail.textContent = item.description;
        info.append(name, detail);

        const actions = document.createElement("div");
        actions.className = "shop-actions";

        const buyButton = document.createElement("button");
        const cost = getShopItemCost(id);
        buyButton.type = "button";
        buyButton.dataset.shopAction = "buy-item";
        buyButton.dataset.item = id;
        buyButton.disabled = meta.coins < cost;
        buyButton.textContent = `${cost}코인`;

        const useButton = document.createElement("button");
        useButton.type = "button";
        useButton.className = "secondary";
        useButton.dataset.shopAction = "use-item";
        useButton.dataset.item = id;
        useButton.disabled = count <= 0 || !canUseShopItem();
        useButton.textContent = "사용";

        actions.append(buyButton, useButton);
        row.append(avatar, info, actions);
        return row;
      }),
    );
  }

  function handleShopAction(event) {
    const button = event.target.closest("button[data-shop-action]");
    if (!button) return;

    const action = button.dataset.shopAction;
    if (action === "buy-character") {
      buyCharacter(button.dataset.character);
    }
    if (action === "select-character") {
      selectCharacter(button.dataset.character);
    }
    if (action === "buy-item") {
      buyShopItem(button.dataset.item);
    }
    if (action === "use-item") {
      useShopItem(button.dataset.item);
    }
  }

  function buyCharacter(id) {
    const character = CHARACTERS[id];
    if (!character || meta.ownedCharacters.includes(id)) return;
    if (!spendCoins(getCharacterCost(id))) {
      ui.shopStatus.textContent = "코인이 부족합니다.";
      return;
    }

    meta.ownedCharacters.push(id);
    meta.selectedCharacter = id;
    meta.totalPurchases += 1;
    const achievement = unlockAchievementById("firstPurchase", false);
    saveMeta();
    ui.shopStatus.textContent = `${character.name} 구매 완료${achievement ? ` / 업적 +${achievement.reward}코인` : ""}`;
    playSound("item");
    vibrate(18);
    renderShop();
    renderStartCharacterSelect();
    renderAchievementCollection();
    setCharacterReaction(`${character.name} 합류`, "happy", 1.5);
    updateUi(true);
  }

  function selectCharacter(id) {
    if (!CHARACTERS[id] || !meta.ownedCharacters.includes(id)) return;
    meta.selectedCharacter = id;
    saveMeta();
    ui.shopStatus.textContent = `${CHARACTERS[id].name} 선택`;
    playSound("success");
    renderShop();
    renderStartCharacterSelect();
    setCharacterReaction(`${CHARACTERS[id].name} 선택`, "happy", 1.4);
    updateUi(true);
  }

  function buyShopItem(id) {
    const item = SHOP_ITEMS[id];
    if (!item) return;
    if (!spendCoins(getShopItemCost(id))) {
      ui.shopStatus.textContent = "코인이 부족합니다.";
      return;
    }

    meta.inventory[id] = (meta.inventory[id] || 0) + 1;
    meta.totalPurchases += 1;
    const achievement = unlockAchievementById("firstPurchase", false);
    saveMeta();
    ui.shopStatus.textContent = `${item.name} 구매 완료${achievement ? ` / 업적 +${achievement.reward}코인` : ""}`;
    playSound("item");
    vibrate(18);
    renderShop();
    renderAchievementCollection();
  }

  function useShopItem(id) {
    if (!SHOP_ITEMS[id] || (meta.inventory[id] || 0) <= 0) return;
    if (!canUseShopItem()) {
      ui.shopStatus.textContent = "진행 중인 판에서 사용할 수 있습니다.";
      return;
    }

    meta.inventory[id] -= 1;
    if (id === "timeTicket") {
      game.timeLeft = Math.min(getTimeCap(), game.timeLeft + 5);
      game.itemMessage = "시간 쿠폰 +5초";
    }
    if (id === "comboSpice") {
      game.combo += 2;
      game.maxCombo = Math.max(game.maxCombo, game.combo);
      game.itemMessage = "콤보 향신료 +2";
      checkFeverTriggers();
    }
    if (id === "magnetKit") {
      game.magnetTimer = Math.max(game.magnetTimer, 8 * getCharacterStats().magnet);
      game.itemMessage = "자석 키트";
    }
    if (id === "feverStamp") {
      activateFever("피버 스탬프!");
    }

    game.itemMessageTimer = 2;
    saveMeta();
    ui.shopStatus.textContent = `${SHOP_ITEMS[id].name} 사용`;
    setCharacterReaction(SHOP_ITEMS[id].short, id === "feverStamp" ? "fever" : "happy", 1.6);
    playSound("item");
    vibrate([10, 18, 10]);
    renderShop();
    updateUi(true);
  }

  function canUseShopItem() {
    return game.started && game.timeLeft > 0 && ui.modal.hidden;
  }

  function spendCoins(cost) {
    if (meta.coins < cost) return false;
    meta.coins -= cost;
    return true;
  }

  function getCharacterCost(id) {
    return Math.max(0, Math.round((CHARACTERS[id]?.cost || 0) * meta.balance.shopPrices));
  }

  function getShopItemCost(id) {
    return Math.max(1, Math.round((SHOP_ITEMS[id]?.cost || 0) * meta.balance.shopPrices));
  }

  function awardRunRewards() {
    const scoreCoins = Math.floor((Math.max(0, game.score) / 700) * meta.balance.coinPayout);
    const orderCoins = Math.round(game.completed * 5 * meta.balance.coinPayout);
    const dailyCoins = game.mode === "daily" ? Math.round(6 * meta.balance.coinPayout) : 0;
    meta.coins += scoreCoins + orderCoins + dailyCoins;

    game.newAchievements = unlockRunAchievements();
    const achievementCoins = game.newAchievements.reduce((sum, achievement) => sum + achievement.reward, 0);
    game.lastCoinAward = scoreCoins + orderCoins + dailyCoins + achievementCoins;
    saveMeta();
    updateMetaUi();
    renderAchievementCollection();
  }

  function unlockRunAchievements() {
    const unlocked = [];
    for (const id of MISSION_IDS) {
      const achievement = ACHIEVEMENTS[id];
      if (getAchievementValue(id) >= achievement.target) {
        const unlockedAchievement = unlockAchievementById(id, false);
        if (unlockedAchievement) {
          unlocked.push(unlockedAchievement);
        }
      }
    }
    return unlocked;
  }

  function unlockAchievementById(id, shouldSave = true) {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement || meta.achievements.includes(id)) return null;
    meta.achievements.push(id);
    meta.coins += achievement.reward;
    if (shouldSave) {
      saveMeta();
    }
    return achievement;
  }

  function getAchievementValue(id) {
    if (id === "feverDuo") return game.runStats.feverActivations;
    if (id === "cleanThree") return game.runStats.cleanOrders;
    if (id === "flawlessFive") return game.runStats.flawlessStreak;
    if (id === "itemFive") return game.runStats.itemsCollected;
    if (id === "comboTwelve") return Math.max(1, game.maxCombo - 1);
    if (id === "firstPurchase") return meta.totalPurchases;
    return 0;
  }

  function renderMissions() {
    ui.missionList.replaceChildren(
      ...MISSION_IDS.map((id) => {
        const achievement = ACHIEVEMENTS[id];
        const value = Math.min(achievement.target, getAchievementValue(id));
        const complete = meta.achievements.includes(id);
        const row = document.createElement("div");
        row.className = "mission-row";
        row.classList.toggle("is-complete", complete);

        const name = document.createElement("span");
        name.textContent = achievement.name;
        const progress = document.createElement("strong");
        progress.textContent = complete ? "완료" : `${value}/${achievement.target}`;

        row.append(name, progress);
        return row;
      }),
    );
  }

  function renderScoreBreakdown() {
    const rows = [
      ["base", game.breakdown.base],
      ["combo", game.breakdown.combo],
      ["order", game.breakdown.order],
      ["item", game.breakdown.item],
      ["fever", game.breakdown.fever],
      ["penalty", -game.breakdown.penalty],
    ];

    ui.scoreBreakdown.replaceChildren(
      ...rows.map(([category, value]) => {
        const row = document.createElement("div");
        row.className = "breakdown-row";
        row.classList.toggle("is-penalty", category === "penalty");

        const label = document.createElement("span");
        label.textContent = SCORE_CATEGORIES[category];
        const amount = document.createElement("strong");
        amount.textContent = formatSignedScore(value);

        row.append(label, amount);
        return row;
      }),
    );
  }

  function renderNewAchievements() {
    if (!game.newAchievements.length) {
      const row = document.createElement("div");
      row.className = "achievement-row";
      const title = document.createElement("strong");
      title.textContent = "새 업적 없음";
      const detail = document.createElement("span");
      detail.textContent = "다음 판에서 미션을 노려보세요.";
      row.append(title, detail);
      ui.newAchievements.replaceChildren(row);
      return;
    }

    ui.newAchievements.replaceChildren(
      ...game.newAchievements.map((achievement) => {
        const row = document.createElement("div");
        row.className = "achievement-row";
        const title = document.createElement("strong");
        title.textContent = `${achievement.name} +${achievement.reward}코인`;
        const detail = document.createElement("span");
        detail.textContent = achievement.description;
        row.append(title, detail);
        return row;
      }),
    );
  }

  function renderDailyDelta(previousBest, currentScore) {
    if (game.mode !== "daily") {
      ui.dailyDelta.hidden = true;
      ui.dailyDelta.textContent = "";
      return;
    }

    ui.dailyDelta.hidden = false;
    if (!previousBest) {
      ui.dailyDelta.textContent = "오늘 챌린지 첫 기록입니다.";
      return;
    }

    const delta = currentScore - previousBest;
    if (delta >= 0) {
      ui.dailyDelta.textContent = `오늘 최고 기록보다 +${delta.toLocaleString("ko-KR")}점`;
    } else {
      ui.dailyDelta.textContent = `오늘 최고 기록까지 ${Math.abs(delta).toLocaleString("ko-KR")}점`;
    }
  }

  function formatSignedScore(value) {
    const rounded = Math.round(value);
    if (rounded > 0) return `+${rounded.toLocaleString("ko-KR")}`;
    if (rounded < 0) return `-${Math.abs(rounded).toLocaleString("ko-KR")}`;
    return "0";
  }

  function getTimeCap() {
    return GAME_SECONDS + getCharacterStats().startTime + 20;
  }

  function unlockAudio() {
    if (!audio.enabled) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!audio.context) {
      audio.context = new AudioContext();
    }
    if (audio.context.state === "suspended") {
      audio.context.resume();
    }
    return audio.context;
  }

  function playSound(type) {
    const context = unlockAudio();
    if (!context) return;

    if (type === "success") {
      playTone(context, 520, 0.08, 0, "sine", 0.045);
      playTone(context, 760, 0.1, 0.06, "triangle", 0.04);
    }
    if (type === "mistake") {
      playTone(context, 210, 0.16, 0, "sawtooth", 0.04, 120);
    }
    if (type === "combo") {
      playTone(context, 440, 0.07, 0, "triangle", 0.045);
      playTone(context, 660, 0.07, 0.06, "triangle", 0.045);
      playTone(context, 880, 0.1, 0.12, "triangle", 0.04);
    }
    if (type === "fever") {
      playTone(context, 330, 0.12, 0, "square", 0.035);
      playTone(context, 660, 0.14, 0.1, "square", 0.035);
      playTone(context, 990, 0.18, 0.2, "triangle", 0.04);
    }
    if (type === "item") {
      playTone(context, 780, 0.08, 0, "sine", 0.04);
      playTone(context, 1040, 0.12, 0.07, "sine", 0.035);
    }
    if (type === "gameover") {
      playTone(context, 520, 0.14, 0, "triangle", 0.04);
      playTone(context, 390, 0.18, 0.13, "triangle", 0.04);
      playTone(context, 260, 0.24, 0.3, "sine", 0.04);
    }
  }

  function playTone(context, frequency, duration, delay = 0, wave = "sine", volume = 0.04, endFrequency = frequency) {
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
  }

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Vibration is optional browser feedback.
    }
  }

  function needsMore(type) {
    return (game.progress?.[type] || 0) < (game.order?.[type] || 0);
  }

  function getSlotForBody(body) {
    const local = toTrayLocal(body.position.x, body.position.y);
    const distance = Math.hypot(local.x, local.y);
    if (distance < TARGET_INNER || distance > TARGET_OUTER) return null;

    const angle = Math.atan2(local.y, local.x);
    for (const slot of SLOTS) {
      if (Math.abs(angleDelta(angle, slot.angle)) <= TARGET_WIDTH / 2) {
        return slot;
      }
    }
    return null;
  }

  function updateUi(force) {
    ui.time.textContent = game.timeLeft.toFixed(1);
    ui.score.textContent = Math.round(game.score).toLocaleString("ko-KR");
    ui.combo.textContent = `x${game.combo}`;
    ui.completed.textContent = `${game.completed}`;
    ui.item.textContent = getItemStatusText();
    ui.fever.textContent = getFeverStatusText();
    ui.skill.textContent = getSkillButtonText();
    ui.skill.disabled = game.skillCooldown > 0 || !game.started || !game.running;
    updateModeAndRuleUi();
    updateMetaUi();

    if (!force) return;

    ui.orderNumber.textContent = `#${game.orderIndex}`;
    const percent = game.targetTotal ? Math.round((game.targetDone / game.targetTotal) * 100) : 0;
    ui.orderPercent.textContent = `${percent}%`;
    ui.orderMeter.style.width = `${percent}%`;

    ui.orderList.replaceChildren(
      ...Object.entries(game.order || {}).map(([type, amount]) => {
        const food = FOODS[type];
        const item = document.createElement("div");
        item.className = "order-item";

        const swatch = document.createElement("span");
        swatch.className = "order-swatch";
        swatch.style.background = food.color;
        swatch.style.borderColor = food.edge;

        const name = document.createElement("span");
        name.className = "order-name";
        name.textContent = food.name;

        const done = game.progress?.[type] || 0;
        const count = document.createElement("span");
        count.className = "order-count";
        count.textContent = `${done}/${amount}`;

        item.append(swatch, name, count);
        return item;
      }),
    );
    renderMissions();
  }

  function updateModeAndRuleUi() {
    ui.modeBadge.textContent =
      game.mode === "daily" ? `오늘 챌린지 ${game.dailyDate || getTodayKey()}` : "일반 모드";
    ui.modeBadge.classList.toggle("is-daily", game.mode === "daily");
    ui.modeButton.textContent = game.mode === "daily" ? "일반 모드" : "오늘 챌린지";

    if (game.orderRule.id === "normal") {
      ui.orderRule.hidden = true;
      ui.orderRule.textContent = "";
      return;
    }

    ui.orderRule.hidden = false;
    const fastTime =
      game.orderRule.id === "fast" ? ` / ${Math.max(0, 10 - game.orderElapsed).toFixed(1)}초` : "";
    const forbiddenText =
      game.orderRule.id === "forbidden" && game.forbiddenType
        ? ` / 금지칸: ${FOODS[game.forbiddenType].name}`
        : "";
    ui.orderRule.textContent = `${game.orderRule.name}: ${game.orderRule.description}${fastTime}${forbiddenText}`;
  }

  function getItemStatusText() {
    if (game.magnetTimer > 0) {
      return `자석 ${Math.ceil(game.magnetTimer)}초`;
    }
    if (game.itemMessageTimer > 0) {
      return game.itemMessage;
    }
    if (game.powerItems.length > 0) {
      return "먹기!";
    }
    return "대기";
  }

  function getFeverStatusText() {
    if (game.feverTimer > 0) {
      return `${Math.ceil(game.feverTimer)}초 x2`;
    }
    return `x${FEVER_COMBO} 대기`;
  }

  function getSkillButtonText() {
    if (game.skillCooldown > 0) {
      return `톡 ${Math.ceil(game.skillCooldown)}초`;
    }
    return "톡 치기";
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackdrop();
    drawTray();
    drawPowerItems();
    drawPieces();
    drawParticles();
    drawFeverOverlay();
  }

  function drawBackdrop() {
    ctx.save();
    ctx.fillStyle = game.feverTimer > 0 ? "#fff1c2" : "#eef6ee";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = game.feverTimer > 0 ? 0.75 : 0.55;
    ctx.strokeStyle = game.feverTimer > 0 ? "#ffd37a" : "#d9e8dc";
    ctx.lineWidth = 1;
    for (let x = -HEIGHT; x < WIDTH + HEIGHT; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + HEIGHT, HEIGHT);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFeverOverlay() {
    if (game.feverTimer <= 0) return;

    ctx.save();
    ctx.globalAlpha = 0.16 + Math.sin(performance.now() / 90) * 0.04;
    ctx.fillStyle = "#e85d4f";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#e85d4f";
    ctx.lineWidth = 6;
    ctx.font = "950 46px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.strokeText("FEVER x2", WIDTH / 2, 22);
    ctx.fillText("FEVER x2", WIDTH / 2, 22);
    ctx.restore();
  }

  function drawTray() {
    ctx.save();
    ctx.translate(CENTER.x, CENTER.y + 16);
    ctx.scale(1.02, 0.22);
    ctx.fillStyle = "rgba(24, 49, 43, 0.18)";
    ctx.beginPath();
    ctx.arc(0, 0, TRAY_RADIUS + 28, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(CENTER.x, CENTER.y);
    ctx.rotate(game.trayAngle);

    ctx.fillStyle = "#244f45";
    ctx.beginPath();
    ctx.arc(0, 0, TRAY_RADIUS + 31, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#fbfaf2";
    ctx.beginPath();
    ctx.arc(0, 0, TRAY_RADIUS + 6, 0, TAU);
    ctx.fill();

    for (const slot of SLOTS) {
      drawTargetSlot(slot);
    }

    ctx.strokeStyle = "#244f45";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, TARGET_INNER - 8, 0, TAU);
    ctx.stroke();

    ctx.lineCap = "round";
    for (let i = 0; i < FOOD_KEYS.length; i += 1) {
      const boundary = -Math.PI / 2 + (i + 0.5) * (TAU / FOOD_KEYS.length);
      const start = polar(boundary, 75);
      const end = polar(boundary, 188);
      ctx.strokeStyle = "#244f45";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    ctx.fillStyle = "#d9ead9";
    ctx.strokeStyle = "#244f45";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, TAU);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#244f45";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(0, 0, TRAY_RADIUS + 4, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  function drawTargetSlot(slot) {
    const food = FOODS[slot.type];
    const start = slot.angle - TARGET_WIDTH / 2;
    const end = slot.angle + TARGET_WIDTH / 2;
    drawAnnularWedge(start, end, TARGET_INNER, TARGET_OUTER, food.color, 0.7);
    if (game.orderRule.id === "forbidden" && slot.type === game.forbiddenType) {
      drawAnnularWedge(start, end, TARGET_INNER, TARGET_OUTER, "#e85d4f", 0.34);
    }

    const labelPoint = polar(slot.angle, 182);
    ctx.save();
    ctx.translate(labelPoint.x, labelPoint.y);
    ctx.rotate(-game.trayAngle);
    ctx.fillStyle = food.edge;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 5;
    ctx.font = "900 26px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(food.name, 0, 0);
    ctx.fillText(food.name, 0, 0);
    if (game.orderRule.id === "forbidden" && slot.type === game.forbiddenType) {
      ctx.font = "950 19px system-ui, sans-serif";
      ctx.fillStyle = "#e85d4f";
      ctx.strokeText("금지", 0, 30);
      ctx.fillText("금지", 0, 30);
    }
    ctx.restore();
  }

  function drawAnnularWedge(start, end, inner, outer, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, outer, start, end);
    ctx.arc(0, 0, inner, end, start, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawPieces() {
    for (const piece of game.pieces) {
      drawIngredient(piece);
    }
  }

  function drawPowerItems() {
    const time = performance.now() / 180;

    for (const item of game.powerItems) {
      const config = ITEMS[item.type];
      const pulse = Math.sin(time + item.phase) * 3;

      ctx.save();
      ctx.translate(item.body.position.x, item.body.position.y);
      ctx.rotate(Math.sin(time * 0.4 + item.phase) * 0.18);
      ctx.shadowColor = config.color;
      ctx.shadowBlur = 18;
      ctx.lineWidth = 4;
      ctx.fillStyle = config.color;
      ctx.strokeStyle = config.edge;
      ctx.beginPath();
      ctx.arc(0, 0, 22 + pulse, 0, TAU);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 30 + pulse * 0.5, 0, TAU);
      ctx.stroke();

      ctx.fillStyle = item.type === "magnet" ? "#18312b" : "#ffffff";
      ctx.font = "950 18px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(config.icon, 0, 1);
      ctx.restore();
    }
  }

  function drawIngredient(piece) {
    const body = piece.body;
    const food = FOODS[piece.type];
    const radius = food.radius;
    const lift = piece.bump > 0 ? piece.bump * 18 : 0;

    ctx.save();
    ctx.translate(body.position.x, body.position.y - lift);
    ctx.rotate(body.angle);

    ctx.shadowColor = "rgba(24, 49, 43, 0.22)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    if (food.shape === "rice") drawRice(food, radius);
    if (food.shape === "egg") drawEgg(food, radius);
    if (food.shape === "kimchi") drawKimchi(food, radius);
    if (food.shape === "nori") drawNori(food, radius);
    if (food.shape === "shrimp") drawShrimp(food, radius);

    ctx.shadowColor = "transparent";
    if (piece.hold > 0) {
      drawHoldRing(radius + 9, piece.hold / 0.62, "#2c9aa0");
    } else if (piece.forbiddenHold > 0) {
      drawHoldRing(radius + 9, piece.forbiddenHold / 0.78, "#e85d4f");
    } else if (piece.wrongHold > 0) {
      drawHoldRing(radius + 9, piece.wrongHold / 1.35, "#e85d4f");
    }

    ctx.restore();
  }

  function drawRice(food, radius) {
    ctx.fillStyle = food.color;
    ctx.strokeStyle = food.edge;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.08, radius * 0.92, 0.2, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = food.accent;
    for (let i = 0; i < 5; i += 1) {
      const angle = i * 1.37;
      ctx.beginPath();
      ctx.ellipse(Math.cos(angle) * 7, Math.sin(angle) * 5, 1.7, 3.2, angle, 0, TAU);
      ctx.fill();
    }
  }

  function drawEgg(food, radius) {
    ctx.fillStyle = "#fff8d9";
    ctx.strokeStyle = food.edge;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(1, 1, radius * 0.58, 0, TAU);
    ctx.fill();
  }

  function drawKimchi(food, radius) {
    ctx.fillStyle = food.color;
    ctx.strokeStyle = food.edge;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-radius, -radius * 0.45);
    ctx.lineTo(radius * 0.66, -radius * 0.86);
    ctx.lineTo(radius, radius * 0.4);
    ctx.lineTo(-radius * 0.42, radius * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = food.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-7, -7);
    ctx.lineTo(8, 5);
    ctx.moveTo(-2, 8);
    ctx.lineTo(10, -8);
    ctx.stroke();
  }

  function drawNori(food, radius) {
    ctx.fillStyle = food.color;
    ctx.strokeStyle = food.edge;
    ctx.lineWidth = 3;
    roundRect(-radius, -radius, radius * 2, radius * 2, 5);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = food.accent;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-radius + 4, i * 7);
      ctx.lineTo(radius - 4, i * 7 + 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawShrimp(food, radius) {
    ctx.fillStyle = food.color;
    ctx.strokeStyle = food.edge;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-2, 1, radius, -0.25, Math.PI * 1.32);
    ctx.quadraticCurveTo(radius * 0.7, radius * 0.3, radius * 0.92, -radius * 0.55);
    ctx.quadraticCurveTo(radius * 0.25, -radius * 0.35, -2, 1);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = food.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-4, 2, radius * 0.58, -0.2, Math.PI * 0.92);
    ctx.stroke();
  }

  function drawHoldRing(radius, progress, color) {
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, clamp(progress, 0, 1) * TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of game.particles) {
      ctx.save();
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.spin);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();
    }
  }

  function updateParticles(dt) {
    game.particles = game.particles.filter((particle) => {
      particle.life -= dt;
      particle.vy += 420 * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.spin += particle.spinSpeed * dt;
      return particle.life > 0;
    });
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = randomRange(0, TAU);
      const speed = randomRange(90, 330);
      game.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomRange(40, 120),
        color,
        size: randomRange(4, 9),
        spin: randomRange(0, TAU),
        spinSpeed: randomRange(-7, 7),
        life: randomRange(0.38, 0.78),
        maxLife: 0.78,
      });
    }
  }

  function pulseSlot() {
    game.trayVelocity += game.trayVelocity >= 0 ? 0.05 : -0.05;
  }

  function toTrayLocal(x, y) {
    return rotatePoint(x - CENTER.x, y - CENTER.y, -game.trayAngle);
  }

  function rotatePoint(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    };
  }

  function polar(angle, radius) {
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  function angleDelta(a, b) {
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
  }

  function normalizeAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomRange(min, max, rng = Math.random) {
    return min + rng() * (max - min);
  }

  function shuffle(items, rng = Math.random) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function randomFeverColor() {
    const colors = ["#e85d4f", "#f1c453", "#2c9aa0", "#ffffff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getTodayKey() {
    return new Date().toLocaleDateString("sv-SE");
  }

  function createSeededRng(seedText) {
    let seed = 2166136261;
    for (let i = 0; i < seedText.length; i += 1) {
      seed ^= seedText.charCodeAt(i);
      seed = Math.imul(seed, 16777619);
    }

    return function seededRandom() {
      seed += 0x6d2b79f5;
      let value = seed;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function cryptoId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  init();
})();
