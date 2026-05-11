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
    orderHint: document.querySelector("#orderHint"),
    orderList: document.querySelector("#orderList"),
    orderPercent: document.querySelector("#orderPercent"),
    orderMeter: document.querySelector("#orderMeter"),
    mobileOrderHud: document.querySelector("#mobileOrderHud"),
    mobileOrderText: document.querySelector("#mobileOrderText"),
    mobileTimeText: document.querySelector("#mobileTimeText"),
    mobileScoreText: document.querySelector("#mobileScoreText"),
    mobileComboText: document.querySelector("#mobileComboText"),
    missionList: document.querySelector("#missionList"),
    restart: document.querySelector("#restartButton"),
    guide: document.querySelector("#guideButton"),
    guideOverlay: document.querySelector("#guideOverlay"),
    tutorialStart: document.querySelector("#tutorialStartButton"),
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
  const HEIGHT = 720;
  const CENTER = { x: WIDTH / 2, y: 348 };
  const ARENA = {
    left: 92,
    right: 808,
    top: 66,
    bottom: 620,
    wall: 32,
    slotTop: 90,
    slotBottom: 198,
    slotGap: 10,
  };
  const GAME_SECONDS = 60;
  const LEADERBOARD_KEY = "bingle-dosirak-rush-leaderboard";
  const DAILY_LEADERBOARD_KEY = "bingle-dosirak-rush-daily";
  const META_KEY = "bingle-dosirak-rush-meta";
  const FEVER_SECONDS = 8;
  const FEVER_COMBO = 8;
  const FEVER_ORDER_STREAK = 3;
  const SKILL_COOLDOWN = 8;
  const DELIVERY_HOLD_SECONDS = 0.18;
  const WRONG_HOLD_SECONDS = 1.35;
  const FORBIDDEN_HOLD_SECONDS = 0.9;
  const MAX_PIECES = 16;
  const STARTER_PIECES = 1;
  const MAX_FOOD_LEVEL = 3;
  const LAUNCH_PAD_COOLDOWN_MS = 180;
  const LAUNCH_PAD_MERGE_REFRESH_MS = 3200;
  const PLAYER_MERGE_WINDOW_MS = 2600;
  const MERGE_MIN_RELATIVE_SPEED = 1.1;
  const BOOSTER_CAPTURE_RADIUS = 78;
  const MAX_TIME_BONUS = 8;
  const RUSH_PHASES = [
    {
      name: "오픈 준비",
      smartChance: 0.85,
      specialChance: 0,
      deliveryAssist: 1.28,
      deliveryWindow: 1.12,
      reloadMultiplier: 1,
      slotMotion: 0,
    },
    {
      name: "점심 러시",
      smartChance: 0.65,
      specialChance: 0.28,
      deliveryAssist: 1,
      deliveryWindow: 1,
      reloadMultiplier: 0.92,
      slotMotion: 0,
    },
    {
      name: "마감 러시",
      smartChance: 0.52,
      specialChance: 0.46,
      deliveryAssist: 0.82,
      deliveryWindow: 0.88,
      reloadMultiplier: 0.82,
      slotMotion: 16,
    },
  ];
  const SHOT_DIRECT_DELIVERY_MS = 2000;
  const SHOT_DIRECT_MERGE_MS = 2600;
  const SHOT_CHAIN_TARGET = 3;
  const AMMO_STASH_SIZE = 4;
  const PICKUP_ZONE_TOP = ARENA.bottom - 86;
  const PICKUP_SETTLE_SECONDS = 0.52;
  const PICKUP_MAX_SPEED = 0.62;
  const PICKUP_GRACE_MS = 850;
  const PICKUP_CLICK_MS = 5200;
  const PICKUP_BLINK_MS = 1800;
  const DELIVERY_READY_MS = 5200;
  const TUTORIAL_KEY = "bingle-dosirak-rush-tutorial";
  const TAU = Math.PI * 2;
  const FIT_TEXT_SELECTOR = [
    ".stat-cell strong",
    ".profile-strip strong",
    "#orderNumber",
    "#orderPercent",
    "#orderHint",
    "#mobileOrderText",
    ".mobile-hud-meta span",
    ".order-count",
    ".order-recipe",
    ".mission-row strong",
    "#finalScore",
    "#finalOrders",
    "#finalCombo",
    "#finalCoins",
    "#finalRank",
    "#leaderboardTitle",
    ".leaderboard-row strong",
    ".leaderboard-meta",
    ".breakdown-row strong",
    "#shopCoinValue",
    "#selectCoinValue",
    "#achievementSummary",
    "#balancePresetLabel",
    ".collection-state",
    ".balance-value",
    ".shop-actions button",
    ".result-actions button",
    ".action-panel button",
  ].join(",");
  const DEBUG_MODE = new URLSearchParams(window.location.search).get("debug") === "1";

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
      cost: 70,
      color: "#e85d4f",
      image: "assets/characters/sprinter.png",
      description: "발사 속도 +15%, 톡 치기 쿨타임 -15%",
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
      cost: 105,
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
      cost: 125,
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
      cost: 145,
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
      cost: 25,
      color: "#2c9aa0",
      description: "진행 중 남은 시간을 5초 늘립니다.",
    },
    comboSpice: {
      id: "comboSpice",
      name: "콤보 향신료",
      short: "콤보",
      cost: 30,
      color: "#e85d4f",
      description: "진행 중 합체 콤보를 2 올립니다.",
    },
    magnetKit: {
      id: "magnetKit",
      name: "자석 키트",
      short: "자석",
      cost: 35,
      color: "#f1c453",
      description: "진행 중 필요한 음식과 합체 후보를 8초 끌어당깁니다.",
    },
    feverStamp: {
      id: "feverStamp",
      name: "피버 스탬프",
      short: "피버",
      cost: 45,
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
      detail: "주문 음식 단계와 개수 증가 속도에 영향을 줍니다.",
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
  const FOOD_EVOLUTIONS = {
    rice: ["밥알", "주먹밥", "김밥", "특제 도시락"],
    egg: ["계란", "계란말이", "오믈렛", "계란 도시락"],
    kimchi: ["김치", "볶음김치", "김치볶음밥", "매운 도시락"],
    nori: ["김", "김말이", "김 주먹밥", "바삭 도시락"],
    shrimp: ["새우", "새우튀김", "새우볶음밥", "해물 도시락"],
  };
  const FOOD_SHORT_LABELS = {
    rice: ["밥", "주먹", "김밥", "특도"],
    egg: ["계란", "말이", "오믈", "계도"],
    kimchi: ["김치", "볶김", "김볶", "매도"],
    nori: ["김", "김말", "김주", "바삭"],
    shrimp: ["새우", "튀김", "새볶", "해물"],
  };
  const LEVEL_SCORE = [0, 180, 420, 920];
  const SLOT_WIDTH = (ARENA.right - ARENA.left - ARENA.slotGap * (FOOD_KEYS.length + 1)) / FOOD_KEYS.length;
  const SLOTS = FOOD_KEYS.map((type, index) => ({
    type,
    index,
    left: ARENA.left + ARENA.slotGap + index * (SLOT_WIDTH + ARENA.slotGap),
    right: ARENA.left + ARENA.slotGap + index * (SLOT_WIDTH + ARENA.slotGap) + SLOT_WIDTH,
    x: ARENA.left + ARENA.slotGap + index * (SLOT_WIDTH + ARENA.slotGap) + SLOT_WIDTH / 2,
    y: (ARENA.slotTop + ARENA.slotBottom) / 2,
  }));

  const LAUNCH_PAD_LAYOUT = [
    { x: -178, y: -58, radius: 25, color: "#2c9aa0", edge: "#17646d" },
    { x: 182, y: -82, radius: 24, color: "#f1c453", edge: "#9b7423" },
    { x: -112, y: 96, radius: 24, color: "#6d4c96", edge: "#422b61" },
    { x: 120, y: 126, radius: 25, color: "#e85d4f", edge: "#9c302c" },
  ];
  const BOOSTER_DIRECTIONS = [-Math.PI / 2, -2.35, -0.79, Math.PI, 0, 2.35, 0.79, Math.PI / 2];
  const CANNON = {
    x: CENTER.x,
    y: ARENA.bottom - 44,
    minAngle: -2.58,
    maxAngle: -0.56,
    defaultAngle: -Math.PI / 2,
    leftAngle: -1.95,
    rightAngle: -1.19,
    minPower: 0.54,
    presetPower: 0.92,
    maxPower: 1,
    dragDistance: 190,
    chargeSeconds: 0.95,
    baseSpeed: 17.8,
    reloadSeconds: 0.28,
  };

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
      name: "자석 키트",
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
    launchPads: [],
    pieces: [],
    pendingMerges: new Set(),
    powerItems: [],
    particles: [],
    floatingTexts: [],
    ammoStash: [],
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
    elapsed: 0,
    timeBonusUsed: 0,
    running: false,
    started: false,
    awaitingFirstInput: false,
    wasRunningBeforeGuide: false,
    wasRunningBeforeShop: false,
    mode: "normal",
    dailyDate: "",
    orderRng: Math.random,
    itemRng: Math.random,
    magnetTimer: 0,
    itemSpawnTimer: 0,
    ingredientSpawnTimer: 0,
    itemMessage: "대기",
    itemMessageTimer: 0,
    feverTimer: 0,
    feverComboArmed: true,
    feverParticleTimer: 0,
    lastRushPhase: 0,
    closingCallShown: false,
    ammoHintShown: false,
    shotSerial: 0,
    shotStreak: 0,
    orderStreak: 0,
    skillCooldown: 0,
    characterMessage: "준비 완료",
    characterMood: "idle",
    characterReactionTimer: 0,
    newAchievements: [],
    lastCoinAward: 0,
    lastShareText: "",
    tutorialActive: false,
    tutorialRun: false,
    tutorialStep: 0,
    tutorialAssistTimer: 0,
    trayAngle: 0,
    trayVelocity: 0,
    cannon: {
      loadedType: FOOD_KEYS[0],
      loadedLevel: 0,
      nextType: FOOD_KEYS[1],
      nextLevel: 0,
      loadedFromStashAt: 0,
      angle: CANNON.defaultAngle,
      power: 0.74,
      aiming: false,
      charging: false,
      chargeTime: 0,
      pointerId: null,
      aimPoint: { x: CANNON.x, y: CANNON.y - CANNON.dragDistance * 0.74 },
      reloadTimer: 0,
      flash: 0,
      shotCount: 0,
    },
    nextOrderDelay: 0,
    lastFrame: 0,
    uiTimer: 0,
    fitTextFrame: 0,
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
    document.body.classList.toggle("is-debug", DEBUG_MODE);
    if (!DEBUG_MODE && ui.balanceButton) {
      ui.balanceButton.hidden = true;
    }
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
    game.engine.gravity.scale = 0.00112;

    Events.on(game.engine, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA.plugin?.ingredient;
        const b = pair.bodyB.plugin?.ingredient;
        const itemA = pair.bodyA.plugin?.powerItem;
        const itemB = pair.bodyB.plugin?.powerItem;
        const padA = pair.bodyA.plugin?.launchPad;
        const padB = pair.bodyB.plugin?.launchPad;
        const wallA = pair.bodyA.plugin?.wall;
        const wallB = pair.bodyB.plugin?.wall;
        if (a) a.bump = 0.14;
        if (b) b.bump = 0.14;
        if (a && wallB) markWallBounce(a, wallB);
        if (b && wallA) markWallBounce(b, wallA);
        if (a && itemB) collectPowerItem(itemB);
        if (b && itemA) collectPowerItem(itemA);
        if (a && padB) triggerLaunchPad(a, padB);
        if (b && padA) triggerLaunchPad(b, padA);
        if (a && b) queueMerge(a, b);
      }
    });

    buildTray();
  }

  function bindControls() {
    window.addEventListener("keydown", (event) => {
      unlockAudio();
      if (!ui.guideOverlay.hidden) {
        if (event.key === "Enter" || event.key === " ") {
          closeGuide({ forceTutorial: true });
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
        setDirectionActive("left", true);
        if (!event.repeat) {
          triggerCannonPreset("left");
        }
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setDirectionActive("right", true);
        if (!event.repeat) {
          triggerCannonPreset("right");
        }
        event.preventDefault();
      }
      if (event.key.toLowerCase() === "r") {
        openCharacterSelect();
      }
      if (event.key.toLowerCase() === "g") {
        showGuide();
      }
      if (event.code === "Space") {
        fireCannonFromCurrentAim();
        event.preventDefault();
      }
      if (event.key.toLowerCase() === "e") {
        useSkill();
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setDirectionActive("left", false);
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setDirectionActive("right", false);
        event.preventDefault();
      }
    });

    for (const button of ui.controls) {
      const direction = button.dataset.dir;
      const setActive = (active) => {
        setDirectionActive(direction, active);
      };
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        unlockAudio();
        button.setPointerCapture(event.pointerId);
        setActive(true);
        triggerCannonPreset(direction);
      });
      button.addEventListener("pointerup", () => setActive(false));
      button.addEventListener("pointercancel", () => setActive(false));
      button.addEventListener("lostpointercapture", () => setActive(false));
    }

    canvas.addEventListener("pointerdown", handleCannonPointerDown);
    canvas.addEventListener("pointermove", handleCannonPointerMove);
    canvas.addEventListener("pointerup", handleCannonPointerUp);
    canvas.addEventListener("pointercancel", cancelCannonAim);

    ui.restart.addEventListener("click", openCharacterSelect);
    ui.modeButton.addEventListener("click", toggleMode);
    ui.characterButton.addEventListener("click", () => openShop("characters"));
    ui.shopButton.addEventListener("click", () => openShop("items"));
    ui.achievementButton.addEventListener("click", openAchievements);
    ui.balanceButton?.addEventListener("click", openBalance);
    ui.soundButton.addEventListener("click", toggleSound);
    ui.shopClose.addEventListener("click", closeShop);
    ui.characterShop.addEventListener("click", handleShopAction);
    ui.shopItems.addEventListener("click", handleShopAction);
    ui.selectShop.addEventListener("click", () => openShop("characters"));
    ui.startCharacterList.addEventListener("click", handleStartCharacterClick);
    ui.startSelected.addEventListener("click", () => startGame({ skipTutorial: true }));
    ui.achievementClose.addEventListener("click", closeAchievements);
    ui.balanceClose.addEventListener("click", closeBalance);
    ui.balanceReset.addEventListener("click", resetBalance);
    ui.balanceList.addEventListener("input", handleBalanceInput);
    ui.skill.addEventListener("click", useSkill);
    ui.guide.addEventListener("click", showGuide);
    ui.tutorialStart?.addEventListener("click", () => closeGuide({ forceTutorial: true }));
    ui.start.addEventListener("click", () => closeGuide({ skipTutorial: true }));
    ui.playAgain.addEventListener("click", openCharacterSelect);
    ui.copyResult.addEventListener("click", copyResultText);
    window.addEventListener("resize", scheduleFitText);
  }

  function buildTray() {
    const width = ARENA.right - ARENA.left;
    const height = ARENA.bottom - ARENA.top;
    const wall = ARENA.wall;
    const walls = [
      Bodies.rectangle(ARENA.left - wall / 2, ARENA.top + height / 2, wall, height + wall, {
        isStatic: true,
        friction: 0.22,
        restitution: 0.32,
      }),
      Bodies.rectangle(ARENA.right + wall / 2, ARENA.top + height / 2, wall, height + wall, {
        isStatic: true,
        friction: 0.22,
        restitution: 0.32,
      }),
      Bodies.rectangle(ARENA.left + width / 2, ARENA.top - wall / 2, width + wall, wall, {
        isStatic: true,
        friction: 0.18,
        restitution: 0.48,
      }),
      Bodies.rectangle(ARENA.left + width / 2, ARENA.bottom + wall / 2, width + wall, wall, {
        isStatic: true,
        friction: 0.2,
        restitution: 0.4,
      }),
    ];

    for (const [index, body] of walls.entries()) {
      body.plugin.local = {
        x: body.position.x - CENTER.x,
        y: body.position.y - CENTER.y,
        angle: body.angle,
      };
      body.plugin.wall = ["left", "right", "top", "bottom"][index];
      game.trayBodies.push(body);
    }

    World.add(game.world, game.trayBodies);
    buildLaunchPads();
    updateTrayBodies();
  }

  function buildLaunchPads() {
    game.launchPads = LAUNCH_PAD_LAYOUT.map((config, index) => {
      const pad = {
        id: `launch-${index}`,
        ...config,
        captureRadius: config.captureRadius || BOOSTER_CAPTURE_RADIUS,
        body: Bodies.circle(0, 0, config.captureRadius || BOOSTER_CAPTURE_RADIUS, {
          isStatic: true,
          isSensor: true,
          label: `launch-pad:${index}`,
        }),
        flash: 0,
        phase: index * 1.7,
        activeTimer: index < 2 ? randomRange(1.8, 3.4, game.itemRng) : 0,
        respawnTimer: index < 2 ? 0 : randomRange(1.2, 4.2, game.itemRng),
        directionAngle: pickBoosterDirection(),
      };
      pad.body.plugin.launchPad = pad;
      return pad;
    });
    World.add(
      game.world,
      game.launchPads.map((pad) => pad.body),
    );
    updateLaunchPadBodies();
  }

  function updateTrayBodies() {
    for (const body of game.trayBodies) {
      const local = body.plugin.local;
      Body.setPosition(
        body,
        {
          x: CENTER.x + local.x,
          y: CENTER.y + local.y,
        },
        true,
      );
      Body.setAngle(body, local.angle, true);
    }
    updateLaunchPadBodies();
    updatePowerItemBodies();
  }

  function updateLaunchPadBodies() {
    for (const pad of game.launchPads) {
      Body.setPosition(
        pad.body,
        {
          x: CENTER.x + pad.x,
          y: CENTER.y + pad.y,
        },
        true,
      );
    }
  }

  function pickBoosterDirection() {
    return BOOSTER_DIRECTIONS[Math.floor(game.itemRng() * BOOSTER_DIRECTIONS.length)] || -Math.PI / 2;
  }

  function updatePowerItemBodies() {
    for (const item of game.powerItems) {
      Body.setPosition(
        item.body,
        {
          x: CENTER.x + item.local.x,
          y: CENTER.y + item.local.y,
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

  function resetGame(shouldRun, options = {}) {
    const forceTutorial = Boolean(options.forceTutorial);
    const skipTutorial = Boolean(options.skipTutorial);
    const tutorialRun = shouldRun && forceTutorial;
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
    game.ammoStash = [];
    game.timeLeft = tutorialRun ? 20 : GAME_SECONDS + getCharacterStats().startTime;
    game.elapsed = 0;
    game.timeBonusUsed = 0;
    game.running = shouldRun;
    game.started = shouldRun;
    game.awaitingFirstInput = shouldRun;
    game.wasRunningBeforeGuide = false;
    game.wasRunningBeforeShop = false;
    game.magnetTimer = 0;
    game.itemSpawnTimer = getInitialItemDelay();
    game.ingredientSpawnTimer = 0;
    game.itemMessage = "조준 대기";
    game.itemMessageTimer = 0;
    game.feverTimer = 0;
    game.feverComboArmed = true;
    game.feverParticleTimer = 0;
    game.lastRushPhase = 0;
    game.closingCallShown = false;
    game.shotSerial = 0;
    game.shotStreak = 0;
    game.orderStreak = 0;
    game.skillCooldown = 0;
    game.characterMessage = shouldRun ? "꾹 눌러 힘 조절" : "준비 완료";
    game.characterMood = shouldRun ? "happy" : "idle";
    game.characterReactionTimer = shouldRun ? 1.6 : 0;
    game.newAchievements = [];
    game.lastCoinAward = 0;
    game.lastShareText = "";
    game.ammoHintShown = false;
    game.tutorialRun = tutorialRun;
    game.tutorialActive = shouldRun && (forceTutorial || (!skipTutorial && !isTutorialComplete()));
    game.tutorialStep = 0;
    game.tutorialAssistTimer = 0;
    game.trayAngle = 0;
    game.trayVelocity = 0;
    resetCannonLoad();
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
    prepareCannonLoad(true);
    updateCharacterHud(true);
    updateUi(true);
  }

  function startGame(options = {}) {
    unlockAudio();
    resetGame(true, options);
    resetControls();
    ui.guideOverlay.hidden = true;
    ui.characterSelectOverlay.hidden = true;
    setCharacterReaction("꾹 눌러 발사", "happy", 1.6);
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
    ui.start.textContent = game.started && game.timeLeft > 0 ? "계속하기" : "바로 시작";
    if (ui.tutorialStart) {
      ui.tutorialStart.hidden = game.started && game.timeLeft > 0;
    }
  }

  function closeGuide(options = {}) {
    unlockAudio();
    ui.guideOverlay.hidden = true;
    resetControls();

    if (!game.started || game.timeLeft <= 0) {
      startGame(options);
      return;
    }

    game.running = game.wasRunningBeforeGuide;
    game.lastFrame = 0;
  }

  function resetControls() {
    setDirectionActive("left", false);
    setDirectionActive("right", false);
    cancelCannonAim();
  }

  function setDirectionActive(direction, active) {
    if (!direction) return;
    controls[direction] = active;
    for (const button of ui.controls) {
      if (button.dataset.dir === direction) {
        button.classList.toggle("is-active", active);
      }
    }
  }

  function useSkill() {
    if (!game.running || game.skillCooldown > 0 || game.pieces.length === 0) return;

    unlockAudio();
    markFirstInput();
    const hitAt = performance.now();
    game.skillCooldown = SKILL_COOLDOWN * getCharacterStats().skillCooldown;
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
      markPlayerHit(piece, hitAt);
    }

    burst(CENTER.x, CENTER.y, "#2c9aa0", 24);
    setCharacterReaction("톡!", "skill", 1.2);
    playSound("item");
    vibrate(12);
    updateUi(false);
  }

  function getCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }

  function canUseCannon() {
    return (
      game.running &&
      game.started &&
      game.timeLeft > 0 &&
      ui.guideOverlay.hidden &&
      !isBlockingOverlayOpen() &&
      game.cannon.loadedType &&
      game.cannon.reloadTimer <= 0
    );
  }

  function setCannonAim(angle, power) {
    game.cannon.angle = clamp(angle, CANNON.minAngle, CANNON.maxAngle);
    game.cannon.power = clamp(power, CANNON.minPower, CANNON.maxPower);
    game.cannon.aimPoint = {
      x: CANNON.x + Math.cos(game.cannon.angle) * CANNON.dragDistance * game.cannon.power,
      y: CANNON.y + Math.sin(game.cannon.angle) * CANNON.dragDistance * game.cannon.power,
    };
  }

  function updateCannonAim(point) {
    const dx = point.x - CANNON.x;
    const dy = point.y - CANNON.y;
    setCannonAim(Math.atan2(dy, dx), game.cannon.power);
  }

  function startCannonCharge(point) {
    game.cannon.aiming = true;
    game.cannon.charging = true;
    game.cannon.chargeTime = 0;
    const dx = point.x - CANNON.x;
    const dy = point.y - CANNON.y;
    setCannonAim(Math.atan2(dy, dx), CANNON.minPower);
  }

  function handleCannonPointerDown(event) {
    const point = getCanvasPoint(event);
    if (triggerStashMergeAtPoint(point)) {
      event.preventDefault();
      unlockAudio();
      return;
    }
    if (selectAmmoSlotAtPoint(point)) {
      event.preventDefault();
      unlockAudio();
      return;
    }
    if (collectPickupPieceAtPoint(point)) {
      event.preventDefault();
      unlockAudio();
      return;
    }
    if (game.cannon.aiming || game.cannon.charging) return;

    if (!canUseCannon()) return;

    event.preventDefault();
    unlockAudio();
    canvas.setPointerCapture?.(event.pointerId);
    game.cannon.pointerId = event.pointerId;
    startCannonCharge(point);
  }

  function handleCannonPointerMove(event) {
    if (!game.cannon.aiming || game.cannon.pointerId !== event.pointerId) return;

    event.preventDefault();
    updateCannonAim(getCanvasPoint(event));
  }

  function handleCannonPointerUp(event) {
    if (!game.cannon.aiming || game.cannon.pointerId !== event.pointerId) return;

    event.preventDefault();
    updateCannonAim(getCanvasPoint(event));
    canvas.releasePointerCapture?.(event.pointerId);
    game.cannon.charging = false;
    fireCannonFromCurrentAim();
  }

  function cancelCannonAim(event = null) {
    if (event && game.cannon.pointerId !== event.pointerId) return;

    game.cannon.aiming = false;
    game.cannon.charging = false;
    game.cannon.chargeTime = 0;
    game.cannon.pointerId = null;
  }

  function triggerCannonPreset(direction) {
    if (!["left", "right"].includes(direction) || !canUseCannon()) return;

    unlockAudio();
    const slot = getPrimaryOrderSlot();
    if (slot) {
      const sideOffset = direction === "left" ? -SLOT_WIDTH * 0.18 : SLOT_WIDTH * 0.18;
      const target = {
        x: clamp(getSlotCenterX(slot) + sideOffset, ARENA.left + 56, ARENA.right - 56),
        y: ARENA.slotBottom + 42,
      };
      setCannonAim(Math.atan2(target.y - CANNON.y, target.x - CANNON.x), CANNON.presetPower);
    } else {
      setCannonAim(direction === "left" ? CANNON.leftAngle : CANNON.rightAngle, CANNON.presetPower);
    }
    fireCannonFromCurrentAim();
  }

  function fireCannonFromCurrentAim() {
    if (!canUseCannon()) return;

    const now = performance.now();
    const type = game.cannon.loadedType || pickCannonType();
    const level = game.cannon.loadedLevel || 0;
    const fromStash = game.cannon.loadedFromStashAt > 0;
    const speed = CANNON.baseSpeed * (0.76 + game.cannon.power * 0.46) * getCharacterStats().rotate;
    const feverShotCount = game.feverTimer > 0 ? 2 : 1;
    trimCannonBoard();
    markFirstInput();

    for (let index = 0; index < feverShotCount; index += 1) {
      const offset = feverShotCount === 1 ? 0 : index === 0 ? -0.075 : 0.075;
      spawnCannonShot(
        type,
        level,
        game.cannon.angle + offset,
        speed * (index === 0 ? 1 : 0.96),
        now,
        feverShotCount === 1 ? -1 : index,
        fromStash,
      );
    }

    game.cannon.aiming = false;
    game.cannon.charging = false;
    game.cannon.chargeTime = 0;
    game.cannon.pointerId = null;
    game.cannon.reloadTimer = CANNON.reloadSeconds * getRushConfig().reloadMultiplier * (game.feverTimer > 0 ? 0.62 : 1);
    game.cannon.flash = 0.28;
    game.cannon.shotCount += 1;
    game.itemMessage = feverShotCount > 1 ? `${getFoodName(type, level)} 2발!` : `${getFoodName(type, level)} 발사!`;
    game.itemMessageTimer = 0.9;
    burst(CANNON.x, CANNON.y, FOODS[type].color, feverShotCount > 1 ? 28 : 18);
    advanceCannonLoad();
    playSound("item");
    vibrate(10);
  }

  function spawnCannonShot(type, level, angle, speed, timestamp, index, fromStash = false) {
    const sideOffset = index < 0 ? 0 : index === 0 ? -9 : 9;
    const piece = spawnIngredient(
      type,
      index,
      1,
      level,
      {
        x: CANNON.x + Math.cos(angle + Math.PI / 2) * sideOffset,
        y: CANNON.y + Math.sin(angle + Math.PI / 2) * sideOffset,
      },
      {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
    );
    attachShotMeta(piece, createShotMeta(type, level, timestamp, fromStash));
    markPlayerHit(piece, timestamp);
    piece.bump = 0.28;
    return piece;
  }

  function trimCannonBoard() {
    while (game.pieces.length >= MAX_PIECES) {
      const candidate = [...game.pieces]
        .filter((piece) => !piece.scored && !piece.merging)
        .sort((a, b) => Number(isDeliveryReadyPiece(a)) - Number(isDeliveryReadyPiece(b)) || a.bornAt - b.bornAt)[0];
      if (!candidate) return;

      World.remove(game.world, candidate.body);
      game.pieces = game.pieces.filter((piece) => piece !== candidate);
    }
  }

  function resetCannonLoad() {
    game.cannon.loadedType = "";
    game.cannon.loadedLevel = 0;
    game.cannon.nextType = "";
    game.cannon.nextLevel = 0;
    game.cannon.loadedFromStashAt = 0;
    game.cannon.reloadTimer = 0;
    game.cannon.flash = 0;
    game.cannon.shotCount = 0;
    game.cannon.aiming = false;
    game.cannon.charging = false;
    game.cannon.chargeTime = 0;
    game.cannon.pointerId = null;
    setCannonAim(CANNON.defaultAngle, 0.74);
  }

  function prepareCannonLoad(force = false) {
    if (force || !game.cannon.loadedType) {
      setCannonAmmo(createSmartAmmo());
    }
    setNextCannonAmmo(createSmartAmmo());
  }

  function advanceCannonLoad() {
    setCannonAmmo(getNextCannonAmmo() || createSmartAmmo());
    setNextCannonAmmo(createSmartAmmo());
  }

  function createAmmo(type, level = 0, priority = false) {
    return {
      type: FOODS[type] ? type : FOOD_KEYS[0],
      level: clamp(Math.round(level), 0, MAX_FOOD_LEVEL),
      priority,
    };
  }

  function createSmartAmmo() {
    if (game.tutorialActive && game.completed === 0 && game.tutorialStep <= 2) {
      return createAmmo("rice", 0, false);
    }

    return createAmmo(pickCannonType(), 0, false);
  }

  function getCurrentCannonAmmo() {
    if (!game.cannon.loadedType) return null;
    return createAmmo(game.cannon.loadedType, game.cannon.loadedLevel || 0, false);
  }

  function getNextCannonAmmo() {
    if (!game.cannon.nextType) return null;
    return createAmmo(game.cannon.nextType, game.cannon.nextLevel || 0, false);
  }

  function setCannonAmmo(ammo, fromStash = false) {
    game.cannon.loadedType = ammo?.type || "";
    game.cannon.loadedLevel = ammo?.level || 0;
    game.cannon.loadedFromStashAt = fromStash ? performance.now() : 0;
  }

  function setNextCannonAmmo(ammo) {
    game.cannon.nextType = ammo?.type || "";
    game.cannon.nextLevel = ammo?.level || 0;
  }

  function getPrimaryOrderSlot() {
    const id = Object.keys(game.order || {}).find((key) => {
      return (game.progress?.[key] || 0) < (game.order?.[key] || 0);
    });
    if (!id) return null;

    const { type } = parseOrderKey(id);
    return SLOTS.find((slot) => slot.type === type) || null;
  }

  function getAmmoSlotRects() {
    const width = 72;
    const height = 58;
    const gap = 10;
    const totalWidth = AMMO_STASH_SIZE * width + (AMMO_STASH_SIZE - 1) * gap;
    const startX = CENTER.x - totalWidth / 2;
    const y = HEIGHT - 70;

    return Array.from({ length: AMMO_STASH_SIZE }, (_, index) => ({
      index,
      x: startX + index * (width + gap),
      y,
      width,
      height,
      centerX: startX + index * (width + gap) + width / 2,
      centerY: y + height / 2,
    }));
  }

  function getStashMergeButtonRect() {
    const slots = getAmmoSlotRects();
    return {
      x: CENTER.x + 34,
      y: slots[0].y - 27,
      width: 92,
      height: 22,
    };
  }

  function isPointInRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  function triggerStashMergeAtPoint(point) {
    if (game.cannon.charging) return false;
    if (!game.started || game.timeLeft <= 0 || isBlockingOverlayOpen() || !ui.guideOverlay.hidden) return false;
    if (!isPointInRect(point, getStashMergeButtonRect())) return false;

    mergeBestStashAmmo();
    return true;
  }

  function selectAmmoSlotAtPoint(point) {
    if (game.cannon.charging) return false;
    if (!game.started || game.timeLeft <= 0 || isBlockingOverlayOpen() || !ui.guideOverlay.hidden) return false;

    const slot = getAmmoSlotRects().find((rect) => {
      return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
      );
    });
    if (!slot) return false;

    return selectAmmoFromStash(slot.index);
  }

  function selectAmmoFromStash(index) {
    const selected = game.ammoStash[index];
    if (!selected) return true;

    const current = getCurrentCannonAmmo();
    if (current) {
      game.ammoStash[index] = current;
    } else {
      game.ammoStash.splice(index, 1);
    }
    setCannonAmmo(selected, true);
    if (game.tutorialActive) {
      game.running = true;
      game.lastFrame = 0;
      game.tutorialStep = Math.max(game.tutorialStep, 3);
    }
    game.cannon.reloadTimer = Math.min(game.cannon.reloadTimer, 0.08);
    game.cannon.flash = Math.max(game.cannon.flash, 0.16);
    game.itemMessage = `${getFoodName(selected.type, selected.level)} 장전`;
    game.itemMessageTimer = 1.1;
    showFloatingText("장전!", CANNON.x, CANNON.y - 88, FOODS[selected.type].color, 28);
    setCharacterReaction("장전!", "happy", 1);
    playSound("item");
    vibrate(8);
    updateUi(false);
    return true;
  }

  function collectPickupPieceAtPoint(point) {
    if (game.cannon.charging) return false;
    if (!game.started || game.timeLeft <= 0 || isBlockingOverlayOpen() || !ui.guideOverlay.hidden) return false;

    const target = [...game.pieces]
      .filter((piece) => piece.pickupReady && !piece.scored && !piece.merging)
      .map((piece) => {
        const distance = Math.hypot(piece.body.position.x - point.x, piece.body.position.y - point.y);
        return { piece, distance };
      })
      .filter(({ piece, distance }) => distance <= piece.body.circleRadius + 24)
      .sort((a, b) => a.distance - b.distance)[0]?.piece;

    if (!target) return false;

    collectPieceToAmmo(target, true);
    return true;
  }

  function markFirstInput() {
    if (!game.awaitingFirstInput) return;

    game.awaitingFirstInput = false;
    game.lastFrame = 0;
    setCharacterReaction("출발!", "happy", 1.1);
  }

  function markPlayerHit(piece, timestamp = performance.now()) {
    if (piece) {
      piece.lastPlayerHitAt = timestamp;
    }
  }

  function createShotMeta(type, level, timestamp, fromStash = false) {
    game.shotSerial += 1;
    return {
      id: game.shotSerial,
      type,
      level,
      firedAt: timestamp,
      fromStash,
      wallBounces: 0,
      mergeAwarded: false,
      deliveryAwarded: false,
      stashAwarded: false,
      bingleAwarded: false,
      nearMissShown: false,
    };
  }

  function attachShotMeta(piece, shot) {
    if (!piece || !shot) return;
    piece.shot = { ...shot };
  }

  function getActiveShot(piece) {
    if (!piece?.shot) return null;
    return piece.shot;
  }

  function markWallBounce(piece, wallType) {
    const shot = getActiveShot(piece);
    if (!shot || wallType === "bottom") return;
    shot.wallBounces += 1;
  }

  function triggerLaunchPad(piece, pad) {
    if (!game.running || piece.scored || piece.merging || pad.activeTimer <= 0) return;

    const now = performance.now();
    if (now - piece.lastLaunchAt < LAUNCH_PAD_COOLDOWN_MS) return;
    piece.lastLaunchAt = now;
    if (piece.lastPlayerHitAt && now - piece.lastPlayerHitAt < LAUNCH_PAD_MERGE_REFRESH_MS) {
      markPlayerHit(piece, now);
    }

    const angle = pad.directionAngle;
    const speed = randomRange(15.8, 21.2, game.orderRng) / (1 + piece.level * 0.04);
    Body.setVelocity(piece.body, {
      x: piece.body.velocity.x * 0.08 + Math.cos(angle) * speed,
      y: piece.body.velocity.y * 0.08 + Math.sin(angle) * speed,
    });
    Body.setAngularVelocity(piece.body, randomRange(-0.42, 0.42, game.orderRng));
    piece.bump = 0.24;
    pad.flash = 0.38;
    pad.activeTimer = 0;
    pad.respawnTimer = randomRange(0.9, 2.6, game.itemRng);
    pad.directionAngle = pickBoosterDirection();
    game.trayVelocity += randomRange(-0.08, 0.08, game.orderRng);
    game.itemMessage = "부스터!";
    game.itemMessageTimer = 0.9;
    burst(pad.body.position.x, pad.body.position.y, pad.color, 16);
    playSound("item");
    vibrate(10);
  }

  function clearIngredients() {
    if (game.pieces.length) {
      World.remove(
        game.world,
        game.pieces.map((piece) => piece.body),
      );
    }
    game.pieces = [];
    game.pendingMerges.clear();
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
    game.floatingTexts = [];
  }

  function getRushPhase() {
    if (game.completed < 2) return 0;
    if (game.elapsed < 40 || game.completed < 6) return 1;
    return 2;
  }

  function getRushConfig() {
    return RUSH_PHASES[getRushPhase()] || RUSH_PHASES[0];
  }

  function getOrderCountForPhase(phase) {
    if (phase <= 0) return 1;
    if (phase === 1) return game.completed >= 4 ? 2 : 1;
    return game.completed >= 8 ? 3 : 2;
  }

  function getNeededOrderTypes() {
    return Object.keys(game.order || {})
      .filter((id) => (game.progress?.[id] || 0) < (game.order?.[id] || 0))
      .map((id) => parseOrderKey(id).type);
  }

  function updateRushState() {
    const phase = getRushPhase();
    if (phase !== game.lastRushPhase) {
      game.lastRushPhase = phase;
      const config = getRushConfig();
      game.itemMessage = config.name;
      game.itemMessageTimer = 1.6;
      showFloatingText(config.name, CENTER.x, CENTER.y - 72, phase >= 2 ? "#e85d4f" : "#2f6d5b", 34);
      burst(CENTER.x, CENTER.y - 20, phase >= 2 ? "#e85d4f" : "#f1c453", 20 + phase * 8);
    }

    if (!game.closingCallShown && game.timeLeft <= 10) {
      game.closingCallShown = true;
      game.itemMessage = "마감 10초!";
      game.itemMessageTimer = 2;
      showFloatingText("마감 10초!", CENTER.x, CENTER.y - 90, "#e85d4f", 40);
      burst(CENTER.x, CENTER.y - 20, "#e85d4f", 34);
      playSound("combo");
      vibrate([16, 24, 16]);
    }
  }

  function createOrder() {
    const phase = getRushPhase();
    const baseCount = getOrderCountForPhase(phase);
    const count = clamp(Math.round(baseCount * meta.balance.orderDifficulty), 1, 3);
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

    if (game.tutorialActive && game.completed === 0) {
      const id = orderKey("rice", 1);
      order[id] = 1;
      game.progress[id] = 0;
      game.targetTotal = 1;
      game.orderRule = ORDER_RULES.normal;
    } else {
      for (let i = 0; i < count; i += 1) {
        const key = foodPool[Math.floor(game.orderRng() * foodPool.length)];
        const level = pickOrderLevel();
        const id = orderKey(key, level);
        order[id] = (order[id] || 0) + 1;
        game.progress[id] = 0;
      }
    }

    if (game.orderRule.id === "spicy" && !orderHasType(order, "kimchi")) {
      ensureOrderHas(order, "kimchi", pickOrderLevel());
    }

    if (game.orderRule.id === "heavy") {
      ensureOrderHas(order, "rice", pickOrderLevel());
    }

    if (game.orderRule.id === "slippery") {
      ensureOrderHas(order, "nori", pickOrderLevel());
    }

    if (game.orderRule.id === "forbidden") {
      game.forbiddenType = pickForbiddenType(order);
    }

    game.order = order;
    game.orderIndex = game.completed + 1;

    if (game.pieces.length === 0) {
      spawnStarterIngredients();
    }
    if (game.started) {
      if (!game.cannon.loadedType || getRushPhase() === 0 || !orderHasType(game.order, game.cannon.loadedType)) {
        setCannonAmmo(createSmartAmmo());
      }
      setNextCannonAmmo(createSmartAmmo());
    }
    updateUi(true);
  }

  function pickOrderLevel() {
    if (game.completed < 2) return 0;

    const phase = getRushPhase();
    const tunedDifficulty = meta.balance.orderDifficulty;
    const maxLevel = clamp(phase + Math.floor((game.completed * tunedDifficulty) / 8), 1, MAX_FOOD_LEVEL);
    const minLevel = phase >= 2 ? 2 : 1;
    return Math.floor(randomRange(minLevel, maxLevel + 1, game.orderRng));
  }

  function orderHasType(order, type) {
    return Object.keys(order).some((id) => parseOrderKey(id).type === type);
  }

  function ensureOrderHas(order, type, level) {
    if (orderHasType(order, type)) return;

    const replaceTarget = Object.keys(order).find((key) => parseOrderKey(key).type !== type) || Object.keys(order)[0];
    if (!replaceTarget) return;

    order[replaceTarget] -= 1;
    if (order[replaceTarget] <= 0) {
      delete order[replaceTarget];
      delete game.progress[replaceTarget];
    }

    const id = orderKey(type, level);
    order[id] = (order[id] || 0) + 1;
    game.progress[id] = game.progress[id] || 0;
  }

  function pickForbiddenType(order) {
    const orderedTypes = new Set(Object.keys(order).map((id) => parseOrderKey(id).type));
    const candidates = FOOD_KEYS.filter((type) => !orderedTypes.has(type));
    const pool = candidates.length ? candidates : FOOD_KEYS;
    return pool[Math.floor(game.orderRng() * pool.length)];
  }

  function pickOrderRule() {
    if (game.completed === 0) return ORDER_RULES.normal;
    const phaseChance = getRushConfig().specialChance;
    const tunedChance = phaseChance * (meta.balance.specialChance / DEFAULT_BALANCE.specialChance);
    if (game.orderRng() > clamp(tunedChance, 0, 0.75)) return ORDER_RULES.normal;
    return SPECIAL_RULES[Math.floor(game.orderRng() * SPECIAL_RULES.length)];
  }

  function orderKey(type, level) {
    return `${type}:${clamp(Math.round(level), 0, MAX_FOOD_LEVEL)}`;
  }

  function parseOrderKey(id) {
    const [type, rawLevel] = String(id).split(":");
    return {
      type: FOODS[type] ? type : FOOD_KEYS[0],
      level: clamp(Math.round(Number(rawLevel) || 0), 0, MAX_FOOD_LEVEL),
    };
  }

  function getFoodName(type, level = 0) {
    return FOOD_EVOLUTIONS[type]?.[clamp(Math.round(level), 0, MAX_FOOD_LEVEL)] || FOODS[type]?.name || "";
  }

  function getFoodShortLabel(type, level = 0) {
    const safeLevel = clamp(Math.round(level), 0, MAX_FOOD_LEVEL);
    return FOOD_SHORT_LABELS[type]?.[safeLevel] || getFoodName(type, safeLevel).slice(0, 2);
  }

  function getRecipeHint(type, level = 0) {
    const safeLevel = clamp(Math.round(level), 0, MAX_FOOD_LEVEL);
    if (safeLevel <= 0) return "바로 배달";

    const previous = getFoodName(type, safeLevel - 1);
    return `${previous} + ${previous} = ${getFoodName(type, safeLevel)}`;
  }

  function getFoodLevelConfig(type, level = 0) {
    const base = FOODS[type] || FOODS.rice;
    const safeLevel = clamp(Math.round(level), 0, MAX_FOOD_LEVEL);
    return {
      ...base,
      name: getFoodName(type, safeLevel),
      radius: base.radius + safeLevel * 7,
      density: base.density * (0.9 + safeLevel * 0.08),
      level: safeLevel,
    };
  }

  function pickSpawnType() {
    const pool = [];
    for (const key of FOOD_KEYS) {
      pool.push(key, key);
    }

    for (const id of Object.keys(game.order || {})) {
      const { type, level } = parseOrderKey(id);
      const weight = 5 + level * 2;
      for (let i = 0; i < weight; i += 1) {
        pool.push(type);
      }
    }

    if (game.orderRule.foods) {
      for (const type of game.orderRule.foods) {
        pool.push(type, type);
      }
    }

    return pool[Math.floor(game.orderRng() * pool.length)] || FOOD_KEYS[0];
  }

  function pickCannonType() {
    const neededTypes = getNeededOrderTypes();
    if (neededTypes.length && game.orderRng() < getRushConfig().smartChance) {
      return neededTypes[Math.floor(game.orderRng() * neededTypes.length)];
    }

    return pickSpawnType();
  }

  function spawnStarterIngredients() {
    if (game.tutorialActive && game.completed === 0) {
      spawnTutorialMergeTarget();
      return;
    }

    const starters = [];

    for (const id of Object.keys(game.order || {})) {
      const { type } = parseOrderKey(id);
      starters.push(type, type);
    }

    while (starters.length < STARTER_PIECES) {
      starters.push(pickSpawnType());
    }

    for (let i = starters.length - 1; i > 0; i -= 1) {
      const j = Math.floor(game.orderRng() * (i + 1));
      [starters[i], starters[j]] = [starters[j], starters[i]];
    }

    for (let i = 0; i < STARTER_PIECES; i += 1) {
      const lane = i - (STARTER_PIECES - 1) / 2;
      spawnIngredient(
        starters[i],
        i,
        STARTER_PIECES,
        0,
        {
          x: CENTER.x + lane * 92 + randomRange(-18, 18, game.orderRng),
          y: CENTER.y + 48 + randomRange(-42, 48, game.orderRng),
        },
        {
          x: randomRange(-0.25, 0.25, game.orderRng),
          y: randomRange(-0.2, 0.25, game.orderRng),
        },
      );
    }
  }

  function spawnTutorialMergeTarget() {
    if (game.pieces.some((piece) => piece.type === "rice" && piece.level === 0 && !piece.scored && !piece.merging)) {
      return;
    }

    const piece = spawnIngredient(
      "rice",
      0,
      1,
      0,
      {
        x: CENTER.x,
        y: CENTER.y + 26,
      },
      {
        x: 0,
        y: 0,
      },
    );
    piece.tutorialTarget = true;
    piece.lastPlayerHitAt = performance.now();
    Body.setAngularVelocity(piece.body, 0);
  }

  function spawnIngredient(type, index = 0, total = 1, level = 0, position = null, velocity = null) {
    const food = getFoodLevelConfig(type, level);
    const spread = Math.min(120, 34 * total);
    const offset = index - (total - 1) / 2;
    const body = Bodies.circle(
      position?.x ?? CENTER.x + offset * 26 + randomRange(-16, 16, game.orderRng),
      position?.y ?? ARENA.top + 214 + randomRange(-spread * 0.14, spread * 0.14, game.orderRng),
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
      level,
      body,
      hold: 0,
      wrongHold: 0,
      forbiddenHold: 0,
      settleTime: 0,
      pickupReady: false,
      pickupReadyAt: 0,
      pickupExpiresAt: 0,
      bump: 0,
      lastLaunchAt: 0,
      lastPlayerHitAt: 0,
      deliveryReadyUntil: 0,
      shot: null,
      scored: false,
      merging: false,
      bornAt: performance.now(),
    };
    body.plugin.ingredient = piece;
    Body.setVelocity(
      body,
      velocity || {
        x: randomRange(-2.5, 2.5, game.orderRng),
        y: randomRange(-1.5, 1.5, game.orderRng),
      },
    );
    game.pieces.push(piece);
    World.add(game.world, body);
    return piece;
  }

  function queueMerge(a, b) {
    if (!canMerge(a, b)) return;

    const key = [a.id, b.id].sort().join("|");
    if (game.pendingMerges.has(key)) return;

    a.merging = true;
    b.merging = true;
    game.pendingMerges.add(key);
  }

  function canMerge(a, b) {
    return (
      a &&
      b &&
      !a.scored &&
      !b.scored &&
      !a.merging &&
      !b.merging &&
      !a.pickupReady &&
      !b.pickupReady &&
      !isDeliveryReadyPiece(a) &&
      !isDeliveryReadyPiece(b) &&
      a.type === b.type &&
      a.level === b.level &&
      a.level < MAX_FOOD_LEVEL &&
      isPlayerDrivenMerge(a, b)
    );
  }

  function isPlayerDrivenMerge(a, b) {
    const now = performance.now();
    const recentHit = Math.max(a.lastPlayerHitAt || 0, b.lastPlayerHitAt || 0);
    if (recentHit <= 0 || now - recentHit > PLAYER_MERGE_WINDOW_MS) return false;

    const rvx = a.body.velocity.x - b.body.velocity.x;
    const rvy = a.body.velocity.y - b.body.velocity.y;
    const threshold = game.tutorialActive && a.type === "rice" && a.level === 0 ? 0.55 : MERGE_MIN_RELATIVE_SPEED;
    return Math.hypot(rvx, rvy) >= threshold;
  }

  function getBestShotPiece(...pieces) {
    return pieces
      .filter((piece) => piece?.shot)
      .sort((a, b) => b.shot.firedAt - a.shot.firedAt)[0] || null;
  }

  function copyMergedShot(a, b, merged) {
    const source = getBestShotPiece(a, b);
    if (!source?.shot || !merged) return;
    merged.shot = {
      ...source.shot,
      wallBounces: Math.max(a.shot?.wallBounces || 0, b.shot?.wallBounces || 0),
    };
  }

  function awardMergeShotBonus(a, b, position, type) {
    const source = getBestShotPiece(a, b);
    const shot = source?.shot;
    if (!shot) return;

    const age = performance.now() - shot.firedAt;
    if (shot.wallBounces > 0 && age <= 5200 && !shot.bingleAwarded) {
      shot.bingleAwarded = true;
      addScore(250, "combo");
      showShotFeedback("빙글샷! +250", position.x, position.y - 38, "#f1c453");
      registerShotResult(position, FOODS[type].color);
      return;
    }

    if (age <= SHOT_DIRECT_MERGE_MS && !shot.mergeAwarded) {
      shot.mergeAwarded = true;
      addScore(150, "combo");
      showShotFeedback("정조준! +150", position.x, position.y - 38, "#2c9aa0");
      registerShotResult(position, FOODS[type].color);
    }
  }

  function awardDeliveryShotBonus(piece, slot) {
    const shot = getActiveShot(piece);
    if (!shot || shot.deliveryAwarded) return;

    const age = performance.now() - shot.firedAt;
    let label = "";
    let score = 0;
    let color = "#f1c453";
    if (shot.wallBounces > 0 && age <= 6200) {
      label = "빙글배송! +500";
      score = 500;
      color = "#e85d4f";
    } else if (age <= SHOT_DIRECT_DELIVERY_MS) {
      label = "직배송! +300";
      score = 300;
      color = "#2c9aa0";
    }

    if (score <= 0) return;

    shot.deliveryAwarded = true;
    addScore(score, "order");
    showShotFeedback(label, getSlotCenterX(slot), ARENA.slotTop - 18, color);
    registerShotResult({ x: getSlotCenterX(slot), y: slot.y }, color);
  }

  function awardStashDeliveryBonus(piece, slot) {
    const shot = getActiveShot(piece);
    if (!shot?.fromStash || shot.stashAwarded) return;

    shot.stashAwarded = true;
    addScore(300, "order");
    showShotFeedback("준비배송! +300", getSlotCenterX(slot), ARENA.slotTop - 44, "#f1c453");
  }

  function registerShotResult(position, color) {
    game.shotStreak += 1;
    if (game.shotStreak > 0 && game.shotStreak % SHOT_CHAIN_TARGET === 0) {
      game.combo += 1;
      game.maxCombo = Math.max(game.maxCombo, game.combo);
      addScore(240, "combo");
      showShotFeedback("연속 명중! +240", CENTER.x, CENTER.y - 34, "#f1c453");
      burst(position.x, position.y, color, 16);
      checkFeverTriggers();
    }
  }

  function showShotFeedback(text, x, y, color) {
    game.itemMessage = text.replace(/\s\+\d+$/, "");
    game.itemMessageTimer = 1.15;
    showFloatingText(text, x, y, color, 30);
  }

  function processMerges() {
    if (!game.pendingMerges.size) return;

    for (const key of [...game.pendingMerges]) {
      game.pendingMerges.delete(key);
      const [aId, bId] = key.split("|");
      const a = game.pieces.find((piece) => piece.id === aId);
      const b = game.pieces.find((piece) => piece.id === bId);
      if (!a || !b) {
        if (a) a.merging = false;
        if (b) b.merging = false;
        continue;
      }

      const distance = Math.hypot(a.body.position.x - b.body.position.x, a.body.position.y - b.body.position.y);
      if (distance > a.body.circleRadius + b.body.circleRadius + 18) {
        a.merging = false;
        b.merging = false;
        continue;
      }

      mergePieces(a, b);
    }
  }

  function mergePieces(a, b) {
    const type = a.type;
    const nextLevel = Math.min(MAX_FOOD_LEVEL, a.level + 1);
    const position = {
      x: (a.body.position.x + b.body.position.x) / 2,
      y: (a.body.position.y + b.body.position.y) / 2,
    };
    const velocity = {
      x: (a.body.velocity.x + b.body.velocity.x) / 2,
      y: (a.body.velocity.y + b.body.velocity.y) / 2 - 0.65,
    };

    World.remove(game.world, [a.body, b.body]);
    game.pieces = game.pieces.filter((piece) => piece !== a && piece !== b);

    const merged = spawnIngredient(type, 0, 1, nextLevel, position, velocity);
    merged.bump = 0.26;
    merged.hold = 0;
    merged.lastPlayerHitAt = Math.max(a.lastPlayerHitAt || 0, b.lastPlayerHitAt || 0);
    if (isAmmoUsefulForCurrentOrder(type, nextLevel)) {
      merged.deliveryReadyUntil = performance.now() + DELIVERY_READY_MS;
      merged.bump = 0.36;
      showFloatingText("배달 준비!", position.x, position.y - 52, "#f1c453", 28);
    }

    const score = LEVEL_SCORE[nextLevel] + nextLevel * 55;
    addScore(score, "base");
    addScore(Math.max(0, game.combo - 1) * 55, "combo");
    if (game.orderRule.id === "spicy" && type === "kimchi") {
      addScore(score, "order");
    }
    game.combo += 1;
    game.maxCombo = Math.max(game.maxCombo, game.combo);
    game.runStats.mergeCount += 1;
    game.itemMessage = `${getFoodName(type, nextLevel)} 합체!`;
    game.itemMessageTimer = 1.4;
    awardMergeShotBonus(a, b, position, type);
    copyMergedShot(a, b, merged);
    burst(position.x, position.y, FOODS[type].color, 22 + nextLevel * 4);
    setCharacterReaction("합체!", "happy", 1.15);
    playSound(game.combo >= 5 && game.combo % 5 === 0 ? "combo" : "success");
    vibrate([8, 14, 8]);
    checkFeverTriggers();
    updateUi(true);
  }

  function spawnPowerItem() {
    if (!game.running || game.powerItems.length > 0) return;

    const type = ITEM_KEYS[Math.floor(game.itemRng() * ITEM_KEYS.length)];
    const item = {
      id: cryptoId(),
      type,
      local: {
        x: randomRange(ARENA.left + 96, ARENA.right - 96, game.itemRng) - CENTER.x,
        y: randomRange(ARENA.slotBottom + 64, ARENA.bottom - 116, game.itemRng) - CENTER.y,
      },
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
      addBonusTime(5);
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

  function addBonusTime(seconds) {
    const amount = Math.min(seconds, Math.max(0, MAX_TIME_BONUS - game.timeBonusUsed));
    if (amount <= 0) return 0;

    game.timeBonusUsed += amount;
    game.timeLeft += amount;
    return amount;
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
      if (piece.scored || piece.merging) continue;

      let target = getMergeCandidateTarget(piece);
      if (!target && getDeliverableOrderId(piece)) {
        const slot = SLOTS.find((candidate) => candidate.type === piece.type);
        if (slot) {
          target = { x: slot.x, y: slot.y };
        }
      }
      if (!target) continue;

      const dx = target.x - piece.body.position.x;
      const dy = target.y - piece.body.position.y;
      const distance = Math.max(80, Math.hypot(dx, dy));
      const strength = 0.000055 * piece.body.mass;

      Body.applyForce(piece.body, piece.body.position, {
        x: (dx / distance) * strength,
        y: (dy / distance) * strength,
      });
    }
  }

  function applyDeliveryAssist() {
    if (game.nextOrderDelay > 0) return;

    for (const piece of game.pieces) {
      if (piece.scored || piece.merging || !getDeliverableOrderId(piece)) continue;

      const slot = SLOTS.find((candidate) => candidate.type === piece.type);
      if (!slot) continue;

      if (piece.body.position.y > ARENA.bottom - 58) continue;

      const dx = getSlotCenterX(slot) - piece.body.position.x;
      const dy = slot.y - piece.body.position.y;
      const pullDistance = Math.max(72, Math.hypot(dx, dy));
      const xGap = Math.abs(piece.body.position.x - getSlotCenterX(slot));
      const recentShot = performance.now() - (piece.lastPlayerHitAt || 0) < 3400;
      const slotScale = piece.body.position.y < CENTER.y + 150 ? 1.35 : 0.55;
      const aimScale = xGap <= SLOT_WIDTH * 1.15 ? 1.25 : recentShot ? 0.78 : 0.48;
      const feverScale = game.feverTimer > 0 ? 1.36 : 1;
      const tutorialScale = game.tutorialActive ? 1.8 : 1;
      const strength =
        0.00016 * slotScale * aimScale * getRushConfig().deliveryAssist * feverScale * tutorialScale * piece.body.mass;

      Body.applyForce(piece.body, piece.body.position, {
        x: (dx / pullDistance) * strength,
        y: (dy / pullDistance) * strength,
      });
    }
  }

  function getMergeCandidateTarget(piece) {
    if (piece.level >= MAX_FOOD_LEVEL) return null;

    let nearest = null;
    let nearestDistance = Infinity;
    for (const candidate of game.pieces) {
      if (
        candidate === piece ||
        candidate.merging ||
        candidate.type !== piece.type ||
        candidate.level !== piece.level
      ) {
        continue;
      }

      const distance = Math.hypot(
        candidate.body.position.x - piece.body.position.x,
        candidate.body.position.y - piece.body.position.y,
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = candidate;
      }
    }

    return nearest && nearestDistance < 210 ? nearest.body.position : null;
  }

  function getSlotOffset(slot) {
    const motion = getRushConfig().slotMotion;
    if (!motion || game.feverTimer > 0 || !isSlotOrdered(slot.type)) return 0;
    return Math.sin(game.elapsed * 2.6 + slot.index * 1.35) * motion;
  }

  function getSlotCenterX(slot) {
    return slot.x + getSlotOffset(slot);
  }

  function getSlotBounds(slot) {
    const offset = getSlotOffset(slot);
    return {
      left: slot.left + offset,
      right: slot.right + offset,
      x: slot.x + offset,
    };
  }

  function isSlotOrdered(type) {
    return Object.entries(game.order || {}).some(([id, amount]) => {
      const parsed = parseOrderKey(id);
      return parsed.type === type && (game.progress?.[id] || 0) < amount;
    });
  }

  function updateIngredientSpawns(dt) {
    if (!game.running || game.nextOrderDelay > 0) return;

    game.ingredientSpawnTimer = Math.max(0, game.ingredientSpawnTimer - dt);
  }

  function updateCannon(dt) {
    game.cannon.reloadTimer = Math.max(0, game.cannon.reloadTimer - dt);
    game.cannon.flash = Math.max(0, game.cannon.flash - dt);
    if (game.cannon.charging && game.cannon.aiming) {
      game.cannon.chargeTime = Math.min(CANNON.chargeSeconds, game.cannon.chargeTime + dt);
      const progress = clamp(game.cannon.chargeTime / CANNON.chargeSeconds, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 1.7);
      setCannonAim(game.cannon.angle, CANNON.minPower + (CANNON.maxPower - CANNON.minPower) * eased);
    }
  }

  function distanceToSegment(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq <= 0) {
      return Math.hypot(point.x - start.x, point.y - start.y);
    }

    const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq, 0, 1);
    const closestX = start.x + dx * t;
    const closestY = start.y + dy * t;
    return Math.hypot(point.x - closestX, point.y - closestY);
  }

  function updateLaunchPads(dt) {
    for (const pad of game.launchPads) {
      pad.flash = Math.max(0, pad.flash - dt);
    }

    if (!game.running || game.awaitingFirstInput) return;

    for (const pad of game.launchPads) {
      if (pad.activeTimer > 0) {
        pad.activeTimer = Math.max(0, pad.activeTimer - dt);
        if (pad.activeTimer <= 0) {
          pad.respawnTimer = randomRange(0.9, 3.2, game.itemRng);
        }
      } else {
        pad.respawnTimer = Math.max(0, pad.respawnTimer - dt);
        if (pad.respawnTimer <= 0) {
          pad.directionAngle = pickBoosterDirection();
          pad.activeTimer = randomRange(2.25, 3.7, game.itemRng);
          pad.flash = 0.24;
        }
      }
    }

    for (const piece of game.pieces) {
      if (piece.scored || piece.merging) continue;

      for (const pad of game.launchPads) {
        if (pad.activeTimer <= 0) continue;

        const distance = Math.hypot(
          piece.body.position.x - pad.body.position.x,
          piece.body.position.y - pad.body.position.y,
        );
        const sweepDistance = distanceToSegment(
          pad.body.position,
          piece.body.positionPrev || piece.body.position,
          piece.body.position,
        );
        const reach = pad.captureRadius + piece.body.circleRadius * 0.82;
        if (distance <= reach || sweepDistance <= reach) {
          triggerLaunchPad(piece, pad);
          break;
        }
      }
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
    if (game.awaitingFirstInput) {
      updateCannon(dt);
      updateLaunchPads(dt);
      updateCharacterReaction(dt);
      return;
    }

    game.elapsed += dt;
    updateRushState();
    game.trayVelocity *= Math.pow(0.35, dt * 5.8);
    game.trayAngle = 0;
    updateTrayBodies();

    updateTutorialAssist(dt);
    applyMagnetForces();
    applyDeliveryAssist();
    Engine.update(game.engine, dt * 1000);
    processMerges();
    containEscapedPieces();
    updateScoring(dt);
    updatePickupZone(dt);
    updateIngredientSpawns(dt);
    updateItemTimers(dt);
    updateFever(dt);
    updateSkill(dt);
    updateCannon(dt);
    updateLaunchPads(dt);
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
      burst(
        randomRange(ARENA.left + 34, ARENA.right - 34),
        randomRange(ARENA.top + 42, ARENA.bottom - 42),
        randomFeverColor(),
        5,
      );
      game.feverParticleTimer = 0.18;
    }
  }

  function updateSkill(dt) {
    game.skillCooldown = Math.max(0, game.skillCooldown - dt);
  }

  function containEscapedPieces() {
    for (const piece of game.pieces) {
      const body = piece.body;
      if (
        body.position.x < ARENA.left - 130 ||
        body.position.x > ARENA.right + 130 ||
        body.position.y < ARENA.top - 170 ||
        body.position.y > ARENA.bottom + 150
      ) {
        resetPiece(piece);
        game.itemMessage = "재투입";
        game.itemMessageTimer = 0.8;
      }
    }
  }

  function updateScoring(dt) {
    for (const piece of [...game.pieces]) {
      if (piece.scored || piece.merging) continue;
      piece.bump = Math.max(0, piece.bump - dt);

      const body = piece.body;
      const slot = getSlotForBody(body);
      const deliverableId = getDeliverableOrderId(piece);
      checkNearMiss(piece, deliverableId);

      if (slot && isForbiddenSlot(slot, piece)) {
        piece.forbiddenHold += dt;
        piece.hold = 0;
        piece.wrongHold = 0;
        if (piece.forbiddenHold >= FORBIDDEN_HOLD_SECONDS) {
          punishForbiddenPiece(piece);
        }
      } else if (slot && slot.type === piece.type && deliverableId) {
        stabilizeDeliveryPiece(piece, slot, dt);
        piece.hold += dt;
        piece.wrongHold = 0;
        piece.forbiddenHold = Math.max(0, piece.forbiddenHold - dt * 1.8);
        if (piece.hold >= getDeliveryHoldSeconds()) {
          scorePiece(piece, slot, deliverableId);
        }
      } else if (slot && slot.type !== piece.type && piece.level > 0) {
        piece.hold = 0;
        piece.forbiddenHold = Math.max(0, piece.forbiddenHold - dt * 1.8);
        piece.wrongHold += dt;
        if (piece.wrongHold >= WRONG_HOLD_SECONDS) {
          punishPiece(piece);
        }
      } else {
        piece.hold = Math.max(0, piece.hold - dt * 2.4);
        piece.forbiddenHold = Math.max(0, piece.forbiddenHold - dt * 1.8);
        piece.wrongHold = Math.max(0, piece.wrongHold - dt * 1.8);
      }
    }
  }

  function updatePickupZone(dt) {
    const now = performance.now();

    for (const piece of [...game.pieces]) {
      if (piece.scored || piece.merging) continue;

      const body = piece.body;
      const velocity = Math.hypot(body.velocity.x, body.velocity.y);
      const inPickupZone = body.position.y >= PICKUP_ZONE_TOP;
      const slow = velocity <= PICKUP_MAX_SPEED && Math.abs(body.angularVelocity) <= 0.22;
      const oldEnough = now - piece.bornAt >= PICKUP_GRACE_MS;

      if (piece.pickupReady) {
        Body.setVelocity(body, {
          x: body.velocity.x * Math.pow(0.08, dt),
          y: body.velocity.y * Math.pow(0.08, dt),
        });
        Body.setAngularVelocity(body, body.angularVelocity * Math.pow(0.04, dt));
        if (now >= piece.pickupExpiresAt) {
          discardPickupPiece(piece);
        }
        continue;
      }

      if (inPickupZone && slow && oldEnough) {
        piece.settleTime += dt;
      } else {
        piece.settleTime = 0;
      }

      if (piece.settleTime >= getPickupSettleSeconds()) {
        markPiecePickupReady(piece);
      }
    }
  }

  function getDeliveryHoldSeconds() {
    return game.tutorialActive ? 0.08 : DELIVERY_HOLD_SECONDS;
  }

  function getPickupSettleSeconds() {
    return game.tutorialActive ? 0.26 : PICKUP_SETTLE_SECONDS;
  }

  function markPiecePickupReady(piece) {
    if (!piece || piece.pickupReady || piece.scored || piece.merging) return;

    const now = performance.now();
    piece.pickupReady = true;
    piece.pickupReadyAt = now;
    piece.pickupExpiresAt = now + (game.tutorialActive ? PICKUP_CLICK_MS * 2.2 : PICKUP_CLICK_MS);
    piece.settleTime = 0;
    Body.setVelocity(piece.body, { x: 0, y: 0 });
    Body.setAngularVelocity(piece.body, 0);
    piece.bump = Math.max(piece.bump, 0.16);

    showFloatingText("탭!", piece.body.position.x, piece.body.position.y - 38, FOODS[piece.type].color, 24);
    if (game.tutorialActive && game.completed === 0 && isAmmoUsefulForCurrentOrder(piece.type, piece.level)) {
      game.tutorialStep = Math.max(game.tutorialStep, 2);
      setCharacterReaction("바닥 재료를 탭", "happy", 1.8);
    }
  }

  function collectPieceToAmmo(piece, clicked = false) {
    if (!piece || piece.scored || piece.merging) return;

    const ammo = createAmmo(piece.type, piece.level, isAmmoUsefulForCurrentOrder(piece.type, piece.level));
    World.remove(game.world, piece.body);
    game.pieces = game.pieces.filter((candidate) => candidate !== piece);
    addAmmoToStash(ammo);
    burst(piece.body.position.x, piece.body.position.y, FOODS[piece.type].color, ammo.priority ? 16 : 8);
    if (clicked) {
      showFloatingText("보관함으로!", CANNON.x, CANNON.y - 116, FOODS[piece.type].color, 24);
    }
  }

  function discardPickupPiece(piece) {
    if (!piece || piece.scored || piece.merging) return;

    const useful = isAmmoUsefulForCurrentOrder(piece.type, piece.level);
    World.remove(game.world, piece.body);
    game.pieces = game.pieces.filter((candidate) => candidate !== piece);
    burst(piece.body.position.x, piece.body.position.y, "rgba(107, 121, 116, 0.75)", 8);
    if (useful) {
      game.itemMessage = `${getFoodName(piece.type, piece.level)} 사라짐`;
      game.itemMessageTimer = 1;
    }
    if (game.tutorialActive && game.completed === 0 && useful) {
      game.tutorialStep = 1;
      game.running = true;
      game.lastFrame = 0;
      setCannonAmmo(createAmmo("rice", 0, false));
      setNextCannonAmmo(createAmmo("rice", 0, false));
      spawnTutorialMergeTarget();
      setCharacterReaction("다시 만들어 보세요", "mistake", 1.6);
    }
  }

  function addAmmoToStash(ammo) {
    if (!ammo) return;

    if (ammo.priority) {
      game.ammoStash.unshift(ammo);
      game.itemMessage = `${getFoodName(ammo.type, ammo.level)} 배달 준비`;
      game.itemMessageTimer = 1.4;
      showFloatingText("보관!", CANNON.x, CANNON.y - 112, FOODS[ammo.type].color, 26);
      showAmmoTapHint();
      if (game.tutorialActive && game.completed === 0) {
        game.tutorialStep = Math.max(game.tutorialStep, 2);
        game.running = false;
        setCharacterReaction("배송! 칸을 탭", "happy", 1.8);
      }
    } else {
      game.ammoStash.push(ammo);
    }

    trimAmmoStash();
    if (!game.cannon.loadedType) {
      setCannonAmmo(createSmartAmmo());
    }
    updateUi(false);
  }

  function showAmmoTapHint() {
    if (game.ammoHintShown) return;

    game.ammoHintShown = true;
    const rect = getAmmoSlotRects()[0];
    showFloatingText("탭해서 장전!", rect.centerX, rect.y - 12, "#f1c453", 26);
    setCharacterReaction("보관함을 눌러 장전", "happy", 1.6);
  }

  function canMergeAmmo(a, b) {
    return a && b && a.type === b.type && a.level === b.level && a.level < MAX_FOOD_LEVEL;
  }

  function findBestStashMerge() {
    let best = null;

    for (let i = 0; i < game.ammoStash.length; i += 1) {
      for (let j = i + 1; j < game.ammoStash.length; j += 1) {
        const a = game.ammoStash[i];
        const b = game.ammoStash[j];
        if (!canMergeAmmo(a, b)) continue;

        const nextLevel = a.level + 1;
        const useful = isAmmoUsefulForCurrentOrder(a.type, nextLevel);
        const orderType = getNeededOrderTypes().includes(a.type);
        const rank = (useful ? 10000 : 0) + (orderType ? 1200 : 0) + nextLevel * 120 - i * 4 - j;
        if (!best || rank > best.rank) {
          best = {
            firstIndex: i,
            secondIndex: j,
            type: a.type,
            level: a.level,
            nextLevel,
            useful,
            rank,
          };
        }
      }
    }

    return best;
  }

  function mergeBestStashAmmo() {
    const merge = findBestStashMerge();
    const rect = getStashMergeButtonRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y - 12;

    if (!merge) {
      game.itemMessage = "합칠 재료 없음";
      game.itemMessageTimer = 1.1;
      showFloatingText("합칠 재료 없음", x, y, "#6b7974", 20);
      setCharacterReaction("같은 재료 2개 필요", "idle", 1.2);
      playSound("mistake");
      return false;
    }

    game.ammoStash.splice(merge.secondIndex, 1);
    game.ammoStash.splice(merge.firstIndex, 1);
    const ammo = createAmmo(merge.type, merge.nextLevel, merge.useful);
    addAmmoToStash(ammo);

    const score = 150 + merge.nextLevel * 70;
    addScore(score, "combo");
    showShotFeedback(`보관합체! +${score}`, x, y, "#2c9aa0");
    burst(x, rect.y + rect.height + 18, FOODS[merge.type].color, 18);
    setCharacterReaction("보관합체!", "happy", 1.2);
    playSound("combo");
    vibrate([8, 14, 8]);
    updateUi(true);
    return true;
  }

  function trimAmmoStash() {
    while (game.ammoStash.length > AMMO_STASH_SIZE) {
      const index = findAmmoRecycleIndex();
      const [recycled] = game.ammoStash.splice(index, 1);
      if (!recycled) return;

      const recycleScore = 30 + recycled.level * 25;
      addScore(recycleScore, "item");
      game.itemMessage = `${getFoodName(recycled.type, recycled.level)} 정리 +${recycleScore}`;
      game.itemMessageTimer = 1.2;
    }
  }

  function findAmmoRecycleIndex() {
    let bestIndex = game.ammoStash.length - 1;
    let bestScore = Infinity;

    game.ammoStash.forEach((ammo, index) => {
      const usefulPenalty = isAmmoUsefulForCurrentOrder(ammo.type, ammo.level) ? 100 : 0;
      const score = usefulPenalty + ammo.level * 8 + index * 0.01;
      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  function stabilizeDeliveryPiece(piece, slot, dt) {
    const target = {
      x: getSlotCenterX(slot),
      y: clamp(piece.body.position.y, ARENA.slotTop + 26, ARENA.slotBottom - 26),
    };
    const dx = target.x - piece.body.position.x;
    const dy = target.y - piece.body.position.y;
    const distance = Math.max(42, Math.hypot(dx, dy));
    const strength = 0.00018 * piece.body.mass;

    Body.applyForce(piece.body, piece.body.position, {
      x: (dx / distance) * strength,
      y: (dy / distance) * strength,
    });

    const damping = Math.pow(0.035, dt);
    Body.setVelocity(piece.body, {
      x: piece.body.velocity.x * damping,
      y: piece.body.velocity.y * damping,
    });
    Body.setAngularVelocity(piece.body, piece.body.angularVelocity * damping);
  }

  function checkNearMiss(piece, deliverableId) {
    const shot = getActiveShot(piece);
    if (!shot || shot.nearMissShown || !deliverableId) return;

    const slot = SLOTS.find((candidate) => candidate.type === piece.type);
    if (!slot) return;

    const body = piece.body;
    const xGap = Math.abs(body.position.x - getSlotCenterX(slot));
    const yNear = body.position.y >= ARENA.slotTop - 34 && body.position.y <= ARENA.slotBottom + 66;
    if (!yNear || xGap > SLOT_WIDTH * 0.72 || getSlotForBody(body)) return;

    shot.nearMissShown = true;
    showFloatingText("아깝다!", body.position.x, body.position.y - 34, "#f1c453", 28);
  }

  function isForbiddenSlot(slot, piece) {
    return (
      game.orderRule.id === "forbidden" &&
      game.forbiddenType &&
      slot.type === game.forbiddenType &&
      slot.type !== piece.type
    );
  }

  function scorePiece(piece, slot, deliveredId = "") {
    piece.scored = true;
    const id = deliveredId || getDeliverableOrderId(piece) || orderKey(piece.type, piece.level);
    game.progress[id] = game.progress[id] || 0;
    game.progress[id] += 1;
    game.targetDone += 1;

    const speedBonus = Math.max(0, Math.round(game.timeLeft * 0.35));
    const baseScore = 220 + piece.level * 230 + speedBonus;
    const comboBonus = (90 + piece.level * 45) * Math.max(0, game.combo - 1);
    addScore(baseScore, "base");
    addScore(comboBonus, "combo");
    if (game.orderRule.id === "spicy" && piece.type === "kimchi") {
      addScore(baseScore + comboBonus, "order");
    }
    awardDeliveryShotBonus(piece, slot);
    awardStashDeliveryBonus(piece, slot);
    if (game.timeLeft <= 10) {
      addScore(500, "order");
      showShotFeedback("마감배송! +500", slot ? getSlotCenterX(slot) : piece.body.position.x, ARENA.slotTop - 24, "#e85d4f");
    }
    game.combo += 1;
    game.maxCombo = Math.max(game.maxCombo, game.combo);
    checkFeverTriggers();

    burst(piece.body.position.x, piece.body.position.y, FOODS[piece.type].color, 24 + piece.level * 4);
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
    game.shotStreak = 0;
    game.orderHadWrong = true;
    game.orderStreak = 0;
    game.runStats.wrongs += 1;
    game.runStats.flawlessStreak = 0;
    setCharacterReaction("앗, 다시!", "mistake", 1.3);
    playSound("mistake");
    vibrate(24);
  }

  function resetPiece(piece) {
    piece.lastPlayerHitAt = 0;
    piece.settleTime = 0;
    piece.pickupReady = false;
    piece.pickupReadyAt = 0;
    piece.pickupExpiresAt = 0;
    piece.deliveryReadyUntil = 0;
    Body.setPosition(piece.body, {
      x: CENTER.x + randomRange(-88, 88),
      y: ARENA.top + 218 + randomRange(-20, 20),
    });
    Body.setVelocity(piece.body, {
      x: randomRange(-1.8, 1.8),
      y: randomRange(-1.2, 0.8),
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
    const modeText = game.mode === "daily" ? `오늘의 도시락 #${game.dailyDate}` : "일반 모드";
    const score = Math.round(game.score).toLocaleString("ko-KR");
    const combo = Math.max(1, game.maxCombo - 1);
    return `빙글도시락 러시 ${score}점 / 도시락 ${game.completed}개 / 최고 콤보 x${combo} / ${getCharacter().name} / ${modeText} / 너도 해봐!`;
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
      mergeCount: 0,
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
    scheduleFitText();
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
    scheduleFitText();
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
    if (!DEBUG_MODE) return;

    unlockAudio();
    game.wasRunningBeforeShop = game.running;
    game.running = false;
    resetControls();
    closeShop(false);
    closeAchievements(false);
    renderBalanceControls();
    ui.balanceOverlay.hidden = false;
    scheduleFitText();
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
    scheduleFitText();
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
      addBonusTime(5);
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
    const scoreCoins = Math.floor((Math.max(0, game.score) / 400) * meta.balance.coinPayout);
    const orderCoins = Math.round(game.completed * 10 * meta.balance.coinPayout);
    const dailyCoins = game.mode === "daily" ? Math.round(8 * meta.balance.coinPayout) : 0;
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

  function needsMore(type, level = 0) {
    const id = orderKey(type, level);
    return (game.progress?.[id] || 0) < (game.order?.[id] || 0);
  }

  function isAmmoUsefulForCurrentOrder(type, level = 0) {
    return Object.keys(game.order || {}).some((id) => {
      const target = parseOrderKey(id);
      return target.type === type && target.level <= level && (game.progress?.[id] || 0) < (game.order?.[id] || 0);
    });
  }

  function isDeliveryReadyPiece(piece) {
    return (
      piece?.deliveryReadyUntil > performance.now() &&
      isAmmoUsefulForCurrentOrder(piece.type, piece.level)
    );
  }

  function getDeliverableOrderId(piece) {
    if (!piece || !game.order) return "";

    return (
      Object.keys(game.order)
        .filter((id) => {
          const { type, level } = parseOrderKey(id);
          return type === piece.type && level <= piece.level && (game.progress?.[id] || 0) < (game.order?.[id] || 0);
        })
        .sort((a, b) => parseOrderKey(b).level - parseOrderKey(a).level)[0] || ""
    );
  }

  function getSlotForBody(body) {
    const windowScale = getRushConfig().deliveryWindow;
    const feverScale = game.feverTimer > 0 ? 1.12 : 1;
    const tutorialScale = game.tutorialActive ? 1.28 : 1;
    const extra = body.circleRadius * 1.25 * windowScale * feverScale * tutorialScale;
    const xExtra = body.circleRadius * 0.95 * windowScale * feverScale * tutorialScale;
    if (body.position.y < ARENA.slotTop - extra || body.position.y > ARENA.slotBottom + extra) return null;

    for (const slot of SLOTS) {
      const bounds = getSlotBounds(slot);
      if (body.position.x >= bounds.left - xExtra && body.position.x <= bounds.right + xExtra) {
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
    if (ui.orderHint) {
      ui.orderHint.textContent = getOrderHintText();
    }
    ui.skill.disabled = game.skillCooldown > 0 || !game.started || !game.running;
    updateModeAndRuleUi();
    updateMetaUi();
    updateMobileHud();

    if (!force) {
      scheduleFitText();
      return;
    }

    ui.orderNumber.textContent = `#${game.orderIndex}`;
    const percent = game.targetTotal ? Math.round((game.targetDone / game.targetTotal) * 100) : 0;
    ui.orderPercent.textContent = `${percent}%`;
    ui.orderMeter.style.width = `${percent}%`;

    ui.orderList.replaceChildren(
      ...Object.entries(game.order || {}).map(([id, amount]) => {
        const { type, level } = parseOrderKey(id);
        const food = FOODS[type];
        const item = document.createElement("div");
        item.className = "order-item";

        const swatch = document.createElement("span");
        swatch.className = "order-swatch";
        swatch.style.background = food.color;
        swatch.style.borderColor = food.edge;

        const copy = document.createElement("span");
        copy.className = "order-copy";

        const name = document.createElement("span");
        name.className = "order-name";
        name.textContent = getFoodName(type, level);

        const recipe = document.createElement("span");
        recipe.className = "order-recipe";
        recipe.textContent = getRecipeHint(type, level);
        copy.append(name, recipe);

        const done = game.progress?.[id] || 0;
        const count = document.createElement("span");
        count.className = "order-count";
        count.textContent = `${done}/${amount}`;

        item.append(swatch, copy, count);
        return item;
      }),
    );
    renderMissions();
    scheduleFitText();
  }

  function updateMobileHud() {
    if (!ui.mobileOrderHud) return;

    const entries = Object.entries(game.order || {});
    if (!entries.length) {
      ui.mobileOrderText.textContent = "-";
    } else {
      const [id, amount] = entries[0];
      const { type, level } = parseOrderKey(id);
      const done = game.progress?.[id] || 0;
      const extra = entries.length > 1 ? ` 외 ${entries.length - 1}` : "";
      ui.mobileOrderText.textContent = `${getFoodName(type, level)} ${done}/${amount}${extra}`;
    }

    ui.mobileTimeText.textContent = `${game.timeLeft.toFixed(1)}초`;
    ui.mobileScoreText.textContent = `${Math.round(game.score).toLocaleString("ko-KR")}점`;
    ui.mobileComboText.textContent = `x${game.combo}`;
    ui.mobileOrderHud.classList.toggle("is-paused", game.awaitingFirstInput);
  }

  function scheduleFitText() {
    if (game.fitTextFrame) return;

    game.fitTextFrame = requestAnimationFrame(() => {
      game.fitTextFrame = 0;
      for (const element of document.querySelectorAll(FIT_TEXT_SELECTOR)) {
        fitTextElement(element);
      }
    });
  }

  function fitTextElement(element) {
    if (!element.getClientRects().length) return;

    element.style.fontSize = "";
    const baseSize = Number.parseFloat(getComputedStyle(element).fontSize);
    const available = element.clientWidth;
    if (!Number.isFinite(baseSize) || baseSize <= 0 || available <= 0) return;

    element.style.fontSize = `${baseSize}px`;
    if (element.scrollWidth <= available + 1) return;

    const minimumSize = element.closest(".stat-cell") ? 10 : 9;
    let nextSize = Math.max(minimumSize, Math.floor(baseSize * (available / element.scrollWidth) * 0.96));
    element.style.fontSize = `${nextSize}px`;

    for (let i = 0; i < 4 && element.scrollWidth > available + 1 && nextSize > minimumSize; i += 1) {
      nextSize -= 1;
      element.style.fontSize = `${nextSize}px`;
    }
  }

  function updateModeAndRuleUi() {
    const modeText = game.mode === "daily" ? `오늘 챌린지 ${game.dailyDate || getTodayKey()}` : "일반 모드";
    ui.modeBadge.textContent = `${modeText} · ${getRushConfig().name}`;
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
      return `${Math.ceil(game.feverTimer)}초 2발`;
    }
    return `x${FEVER_COMBO} 대기`;
  }

  function getSkillButtonText() {
    if (game.skillCooldown > 0) {
      return `톡 ${Math.ceil(game.skillCooldown)}초`;
    }
    return "톡!";
  }

  function getOrderHintText() {
    if (!game.started) {
      return "꾹 눌러 발사하고, 바닥 재료는 직접 탭해 보관하세요.";
    }

    const pickupPiece = game.pieces.find((piece) => piece.pickupReady && isAmmoUsefulForCurrentOrder(piece.type, piece.level));
    if (pickupPiece) {
      return `바닥의 ${getFoodName(pickupPiece.type, pickupPiece.level)}를 탭해 보관함으로 보내세요.`;
    }

    const usefulAmmo = game.ammoStash.find((ammo) => ammo && isAmmoUsefulForCurrentOrder(ammo.type, ammo.level));
    if (usefulAmmo) {
      return `보관함의 ${getFoodName(usefulAmmo.type, usefulAmmo.level)} 배송! 칸을 탭하세요.`;
    }

    const stashMerge = findBestStashMerge();
    if (stashMerge?.useful) {
      return `보관함 합치기로 ${getFoodName(stashMerge.type, stashMerge.nextLevel)}을 만들 수 있어요.`;
    }

    const currentAmmo = getCurrentCannonAmmo();
    if (currentAmmo && isAmmoUsefulForCurrentOrder(currentAmmo.type, currentAmmo.level)) {
      return `${getFoodName(currentAmmo.type, currentAmmo.level)}을 위 ${FOODS[currentAmmo.type].name} 칸에 배달하세요.`;
    }

    const id = Object.keys(game.order || {}).find((key) => {
      return (game.progress?.[key] || 0) < (game.order?.[key] || 0);
    });
    if (!id) return "다음 주문을 준비하세요.";

    const { type, level } = parseOrderKey(id);
    if (level <= 0) {
      return `${FOODS[type].name}을 쏴서 위 ${FOODS[type].name} 칸에 넣으세요.`;
    }
    return `${getRecipeHint(type, level)}. 만든 뒤 바닥에서 탭해 보관하세요.`;
  }

  function updateTutorialAssist(dt) {
    if (!game.tutorialActive || game.completed > 0) return;

    game.tutorialAssistTimer += dt;
    if (game.tutorialStep <= 1) {
      if (game.cannon.loadedType !== "rice" || game.cannon.loadedLevel !== 0) {
        setCannonAmmo(createAmmo("rice", 0, false));
      }
      if (game.cannon.nextType !== "rice" || game.cannon.nextLevel !== 0) {
        setNextCannonAmmo(createAmmo("rice", 0, false));
      }
      if (game.tutorialAssistTimer > 0.6) {
        spawnTutorialMergeTarget();
        game.tutorialAssistTimer = 0;
      }
    }

    if (game.tutorialStep === 2) {
      const usefulInStash = game.ammoStash.some((ammo) => ammo && isAmmoUsefulForCurrentOrder(ammo.type, ammo.level));
      const usefulOnBoard = game.pieces.some((piece) => isAmmoUsefulForCurrentOrder(piece.type, piece.level));
      if (!usefulInStash && !usefulOnBoard && game.tutorialAssistTimer > 1.2) {
        setCannonAmmo(createAmmo("rice", 0, false));
        setNextCannonAmmo(createAmmo("rice", 0, false));
        spawnTutorialMergeTarget();
        game.tutorialStep = 1;
        game.tutorialAssistTimer = 0;
      }
    }
  }

  function isTutorialComplete() {
    try {
      return window.localStorage.getItem(TUTORIAL_KEY) === "1";
    } catch {
      return false;
    }
  }

  function markTutorialComplete() {
    if (!game.tutorialActive) return;

    const shouldStartMain = game.tutorialRun;
    game.tutorialActive = false;
    game.tutorialRun = false;
    game.tutorialStep = 4;
    try {
      window.localStorage.setItem(TUTORIAL_KEY, "1");
    } catch {
      // Tutorial progress is optional local state.
    }
    if (shouldStartMain) {
      game.running = false;
      showFloatingText("좋아요! 본 게임 시작", CENTER.x, CENTER.y - 90, "#2c9aa0", 34);
      window.setTimeout(() => startGame({ skipTutorial: true }), 900);
    } else {
      showFloatingText("좋아요! 60초 러시 시작", CENTER.x, CENTER.y - 90, "#2c9aa0", 34);
    }
  }

  function updateTutorialState() {
    if (!game.tutorialActive) return;

    if (game.completed > 0) {
      markTutorialComplete();
      return;
    }
    if (game.tutorialStep === 0 && game.cannon.shotCount > 0) {
      game.tutorialStep = 1;
      game.tutorialAssistTimer = 0;
    }
    if (game.tutorialStep === 1 && game.runStats.mergeCount > 0) {
      game.tutorialStep = 2;
      game.tutorialAssistTimer = 0;
    }
    if (game.tutorialStep === 2 && game.cannon.loadedFromStashAt > 0) {
      game.tutorialStep = 3;
      game.tutorialAssistTimer = 0;
    }
  }

  function getTutorialMessage() {
    if (!game.tutorialActive) return null;

    if (game.tutorialStep === 0) {
      return {
        title: "1/5 꾹 눌러 발사",
        body: "화면을 누르면 힘 게이지가 찹니다. 방향을 맞추고 손을 떼세요.",
      };
    }
    if (game.tutorialStep === 1) {
      return {
        title: "2/5 같은 재료 합체",
        body: "밥을 밥에 맞춰 주먹밥을 만드세요.",
      };
    }
    if (game.tutorialStep === 2) {
      const hasUsefulAmmo = game.ammoStash.some((ammo) => ammo && isAmmoUsefulForCurrentOrder(ammo.type, ammo.level));
      const pickupPiece = game.pieces.find(
        (piece) => piece.pickupReady && isAmmoUsefulForCurrentOrder(piece.type, piece.level),
      );
      if (pickupPiece) {
        return {
          title: "3/5 바닥 재료 탭",
          body: "깜빡이는 주먹밥을 탭해 보관함으로 보내세요.",
        };
      }
      return {
        title: hasUsefulAmmo ? "4/5 보관함 장전" : "3/5 아래 회수대",
        body: hasUsefulAmmo
          ? "노란 보관함 칸을 탭해 주먹밥을 장전하세요."
          : "아래에서 멈춘 재료는 직접 탭해야 보관됩니다.",
      };
    }
    return {
      title: "5/5 위 칸에 배달",
      body: "주먹밥을 위쪽 밥 칸에 넣으면 본 게임이 시작됩니다.",
    };
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    updateTutorialState();
    drawBackdrop();
    drawTray();
    drawLaunchPads();
    drawCannon();
    drawAmmoStash();
    drawPowerItems();
    drawPieces();
    drawParticles();
    drawFloatingTexts();
    drawTutorialCoach();
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
    ctx.strokeText("피버 2발", WIDTH / 2, 22);
    ctx.fillText("피버 2발", WIDTH / 2, 22);
    ctx.restore();
  }

  function drawTutorialCoach() {
    const message = getTutorialMessage();
    if (!message || !game.started || game.timeLeft <= 0 || !ui.guideOverlay.hidden || !ui.modal.hidden) return;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "rgba(47, 109, 91, 0.26)";
    ctx.lineWidth = 3;
    roundRect(CENTER.x - 230, ARENA.slotBottom + 16, 460, 72, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1f5145";
    ctx.font = "950 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message.title, CENTER.x, ARENA.slotBottom + 42);
    ctx.fillStyle = "#62756e";
    ctx.font = "850 15px system-ui, sans-serif";
    ctx.fillText(message.body, CENTER.x, ARENA.slotBottom + 66);
    ctx.restore();
  }

  function drawTray() {
    const width = ARENA.right - ARENA.left;
    const height = ARENA.bottom - ARENA.top;

    ctx.save();
    ctx.fillStyle = "rgba(24, 49, 43, 0.18)";
    roundRect(ARENA.left + 24, ARENA.bottom + 12, width - 48, 28, 14);
    ctx.fill();

    ctx.fillStyle = "#244f45";
    roundRect(ARENA.left - 22, ARENA.top - 22, width + 44, height + 44, 30);
    ctx.fill();

    ctx.fillStyle = "#fbfaf2";
    roundRect(ARENA.left, ARENA.top, width, height, 22);
    ctx.fill();

    for (const slot of SLOTS) {
      drawTargetSlot(slot);
    }

    ctx.strokeStyle = "rgba(36, 79, 69, 0.16)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    for (let i = 1; i < SLOTS.length; i += 1) {
      const x = SLOTS[i].left - ARENA.slotGap / 2;
      ctx.beginPath();
      ctx.moveTo(x, ARENA.slotBottom + 20);
      ctx.lineTo(x, ARENA.bottom - 70);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    drawPickupZone();

    ctx.strokeStyle = "#244f45";
    ctx.lineWidth = 10;
    roundRect(ARENA.left + 2, ARENA.top + 2, width - 4, height - 4, 20);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
    ctx.lineWidth = 2;
    roundRect(ARENA.left + 12, ARENA.top + 12, width - 24, height - 24, 16);
    ctx.stroke();

    ctx.restore();
  }

  function drawTargetSlot(slot) {
    const food = FOODS[slot.type];
    const width = slot.right - slot.left;
    const height = ARENA.slotBottom - ARENA.slotTop;
    const bounds = getSlotBounds(slot);
    const isOrdered = Object.entries(game.order || {}).some(([id, amount]) => {
      const { type, level } = parseOrderKey(id);
      return type === slot.type && (game.progress?.[id] || 0) < amount && needsMore(type, level);
    });
    const currentAmmo = getCurrentCannonAmmo();
    const isCurrentTarget =
      currentAmmo?.type === slot.type && isAmmoUsefulForCurrentOrder(currentAmmo.type, currentAmmo.level);

    ctx.save();
    ctx.fillStyle = food.color;
    ctx.globalAlpha = isOrdered ? 0.88 : 0.62;
    roundRect(bounds.left, ARENA.slotTop, width, height, 12);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = isOrdered ? food.edge : "rgba(36, 79, 69, 0.42)";
    ctx.lineWidth = isOrdered ? 6 : 3;
    roundRect(bounds.left, ARENA.slotTop, width, height, 12);
    ctx.stroke();

    if (isCurrentTarget) {
      const pulse = 0.55 + Math.sin(performance.now() / 120) * 0.18;
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = "#f1c453";
      ctx.lineWidth = 9;
      roundRect(bounds.left - 5, ARENA.slotTop - 5, width + 10, height + 10, 15);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (game.orderRule.id === "forbidden" && slot.type === game.forbiddenType) {
      ctx.fillStyle = "rgba(232, 93, 79, 0.32)";
      roundRect(bounds.left + 5, ARENA.slotTop + 5, width - 10, height - 10, 10);
      ctx.fill();
    }

    ctx.fillStyle = food.edge;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 5;
    ctx.font = "900 26px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(food.name, bounds.x, slot.y - 6);
    ctx.fillText(food.name, bounds.x, slot.y - 6);
    if (game.orderRule.id === "forbidden" && slot.type === game.forbiddenType) {
      ctx.font = "950 19px system-ui, sans-serif";
      ctx.fillStyle = "#e85d4f";
      ctx.strokeText("금지", bounds.x, slot.y + 28);
      ctx.fillText("금지", bounds.x, slot.y + 28);
    } else if (isCurrentTarget) {
      ctx.font = "950 19px system-ui, sans-serif";
      ctx.fillStyle = "#18312b";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 4;
      ctx.strokeText("여기!", bounds.x, slot.y + 28);
      ctx.fillText("여기!", bounds.x, slot.y + 28);
    }
    ctx.restore();
  }

  function drawSmallBadge(text, x, y, fill = "#244f45", color = "#ffffff") {
    const width = 48;
    const height = 20;

    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
    ctx.lineWidth = 2;
    roundRect(x - width / 2, y - height / 2, width, height, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "950 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 0.5);
    ctx.restore();
  }

  function drawPickupZone() {
    ctx.save();
    ctx.fillStyle = "rgba(47, 109, 91, 0.08)";
    roundRect(ARENA.left + 30, PICKUP_ZONE_TOP, ARENA.right - ARENA.left - 60, ARENA.bottom - PICKUP_ZONE_TOP - 8, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 109, 91, 0.18)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 10]);
    roundRect(ARENA.left + 36, PICKUP_ZONE_TOP + 6, ARENA.right - ARENA.left - 72, ARENA.bottom - PICKUP_ZONE_TOP - 20, 14);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawCannon() {
    const cannon = game.cannon;
    const loadedType = cannon.loadedType || FOOD_KEYS[0];
    const flash = cannon.flash / 0.28;
    const ready = game.started && game.timeLeft > 0 && ui.modal.hidden;
    const barrelRotation = cannon.angle + Math.PI / 2;
    const muzzle = {
      x: CANNON.x + Math.cos(cannon.angle) * 36,
      y: CANNON.y + Math.sin(cannon.angle) * 36,
    };

    ctx.save();
    if (ready) {
      ctx.fillStyle = cannon.aiming ? "#f1c453" : "rgba(47, 109, 91, 0.62)";
      const step = 24 + cannon.power * 8;
      for (let i = 1; i <= 10; i += 1) {
        const distance = i * step;
        const x = CANNON.x + Math.cos(cannon.angle) * distance;
        const y = CANNON.y + Math.sin(cannon.angle) * distance + i * i * 0.8;
        if (x < ARENA.left + 16 || x > ARENA.right - 16 || y < ARENA.top + 20 || y > ARENA.bottom - 12) {
          continue;
        }
        ctx.globalAlpha = Math.max(0.18, 0.78 - i * 0.055);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(3, 7 - i * 0.25), 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    ctx.translate(CANNON.x, CANNON.y);
    ctx.rotate(barrelRotation);
    ctx.shadowColor = flash > 0 ? "rgba(241, 196, 83, 0.7)" : "rgba(24, 49, 43, 0.22)";
    ctx.shadowBlur = 12 + flash * 22;
    ctx.fillStyle = flash > 0 ? "#f1c453" : "#244f45";
    ctx.strokeStyle = flash > 0 ? "#ffffff" : "rgba(255, 255, 255, 0.78)";
    ctx.lineWidth = 5;
    roundRect(-19, -68, 38, 82, 18);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#18312b";
    roundRect(-12, -60, 24, 54, 12);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#10231f";
    ctx.strokeStyle = "#2f6d5b";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(CANNON.x, CANNON.y + 10, 38 + flash * 7, Math.PI, 0);
    ctx.lineTo(CANNON.x + 54, CANNON.y + 42);
    ctx.lineTo(CANNON.x - 54, CANNON.y + 42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    drawCannonPowerGauge();

    if (loadedType) {
      drawSmallBadge("현재", muzzle.x, muzzle.y - 34, "#2f6d5b");
      drawIngredient({
        type: loadedType,
        level: cannon.loadedLevel || 0,
        body: { position: muzzle, angle: 0 },
        bump: flash * 0.2,
        hold: 0,
        forbiddenHold: 0,
        wrongHold: 0,
      });
    }

    if (cannon.nextType) {
      drawSmallBadge("다음", CANNON.x + 70, CANNON.y - 14, "#fff8da", "#18312b");
      ctx.save();
      ctx.globalAlpha = 0.72;
      ctx.translate(CANNON.x + 70, CANNON.y + 28);
      ctx.scale(0.72, 0.72);
      ctx.translate(-(CANNON.x + 70), -(CANNON.y + 28));
      drawIngredient({
        type: cannon.nextType,
        level: cannon.nextLevel || 0,
        body: { position: { x: CANNON.x + 70, y: CANNON.y + 28 }, angle: 0 },
        bump: 0,
        hold: 0,
        forbiddenHold: 0,
        wrongHold: 0,
      });
      ctx.restore();
    }
  }

  function drawCannonPowerGauge() {
    const progress = clamp((game.cannon.power - CANNON.minPower) / (CANNON.maxPower - CANNON.minPower), 0, 1);
    const width = 136;
    const height = 13;
    const x = CANNON.x - width / 2;
    const y = CANNON.y + 49;

    ctx.save();
    ctx.fillStyle = "rgba(24, 49, 43, 0.28)";
    roundRect(x, y, width, height, 7);
    ctx.fill();
    ctx.fillStyle = game.cannon.charging ? "#f1c453" : "#2c9aa0";
    roundRect(x, y, Math.max(8, width * progress), height, 7);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    ctx.lineWidth = 2;
    roundRect(x, y, width, height, 7);
    ctx.stroke();
    ctx.restore();
  }

  function drawAmmoStash() {
    const rects = getAmmoSlotRects();
    const mergeButton = getStashMergeButtonRect();
    const canMergeStash = Boolean(findBestStashMerge());

    ctx.save();
    ctx.fillStyle = "#18312b";
    ctx.font = "950 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("보관함", CENTER.x - 112, rects[0].y - 16);

    ctx.fillStyle = "rgba(44, 154, 160, 0.14)";
    ctx.strokeStyle = "rgba(44, 154, 160, 0.34)";
    ctx.lineWidth = 2;
    roundRect(CENTER.x - 70, rects[0].y - 27, 86, 22, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1f5145";
    ctx.font = "950 12px system-ui, sans-serif";
    ctx.fillText("탭 장전", CENTER.x - 27, rects[0].y - 16);

    ctx.fillStyle = canMergeStash ? "#2c9aa0" : "rgba(107, 121, 116, 0.18)";
    ctx.strokeStyle = canMergeStash ? "rgba(255, 255, 255, 0.82)" : "rgba(107, 121, 116, 0.24)";
    ctx.lineWidth = 2;
    roundRect(mergeButton.x, mergeButton.y, mergeButton.width, mergeButton.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = canMergeStash ? "#ffffff" : "#6b7974";
    ctx.font = "950 12px system-ui, sans-serif";
    ctx.fillText("합치기", mergeButton.x + mergeButton.width / 2, mergeButton.y + mergeButton.height / 2);
    ctx.restore();

    for (const rect of rects) {
      const ammo = game.ammoStash[rect.index];
      const useful = ammo && isAmmoUsefulForCurrentOrder(ammo.type, ammo.level);
      const pulse = useful ? 0.5 + Math.sin(performance.now() / 130 + rect.index) * 0.22 : 0;

      ctx.save();
      ctx.fillStyle = useful ? "#fff8da" : "#f5f8f0";
      ctx.strokeStyle = useful ? "#f1c453" : "rgba(24, 49, 43, 0.22)";
      ctx.lineWidth = useful ? 4 + pulse * 2 : 2;
      ctx.shadowColor = useful ? "rgba(241, 196, 83, 0.42)" : "rgba(24, 49, 43, 0.16)";
      ctx.shadowBlur = useful ? 12 + pulse * 12 : 5;
      roundRect(rect.x, rect.y, rect.width, rect.height, 12);
      ctx.fill();
      ctx.stroke();
      if (useful) {
        ctx.globalAlpha = 0.42 + pulse * 0.3;
        ctx.strokeStyle = "#2c9aa0";
        ctx.lineWidth = 3;
        roundRect(rect.x - 5, rect.y - 5, rect.width + 10, rect.height + 10, 15);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.shadowColor = "transparent";

      if (!ammo) {
        ctx.strokeStyle = "rgba(24, 49, 43, 0.18)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        roundRect(rect.x + 10, rect.y + 10, rect.width - 20, rect.height - 20, 8);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();

      if (ammo) {
        ctx.save();
        ctx.translate(rect.centerX, rect.centerY);
        ctx.scale(0.54, 0.54);
        ctx.translate(-rect.centerX, -rect.centerY);
        drawIngredient({
          type: ammo.type,
          level: ammo.level,
          body: { position: { x: rect.centerX, y: rect.centerY - (useful ? 5 : 1) }, angle: 0 },
          bump: 0,
          hold: 0,
          forbiddenHold: 0,
          wrongHold: 0,
          deliveryReadyUntil: useful ? performance.now() + 1 : 0,
        });
        ctx.restore();

        if (useful) {
          ctx.save();
          ctx.fillStyle = "#18312b";
          ctx.font = "950 12px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("배송!", rect.centerX, rect.y + rect.height - 9);
          ctx.restore();
        }
      }
    }
  }

  function drawLaunchPads() {
    const time = performance.now() / 220;

    for (const pad of game.launchPads) {
      const pulse = Math.sin(time + pad.phase) * 2.5;
      const flash = pad.flash / 0.38;
      const active = pad.activeTimer > 0;
      const appear = active ? clamp(Math.min(pad.activeTimer, 0.35) / 0.35, 0, 1) : clamp(flash, 0, 1);
      if (!active && flash <= 0) continue;

      ctx.save();
      ctx.translate(pad.body.position.x, pad.body.position.y);
      ctx.globalAlpha = active ? 0.64 + 0.36 * appear : flash * 0.72;
      ctx.scale(0.72 + appear * 0.28, 0.72 + appear * 0.28);
      ctx.shadowColor = pad.color;
      ctx.shadowBlur = 10 + flash * 18;

      ctx.fillStyle = pad.color;
      ctx.globalAlpha *= active ? 0.14 : 0.2;
      ctx.beginPath();
      ctx.arc(0, 0, pad.captureRadius, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = active ? 0.64 + 0.36 * appear : flash * 0.72;

      ctx.fillStyle = "#10231f";
      ctx.strokeStyle = pad.edge;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, pad.radius + pulse + flash * 8, 0, TAU);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = "transparent";
      ctx.strokeStyle = pad.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, pad.radius * 0.62 + flash * 6, 0, TAU);
      ctx.stroke();

      ctx.fillStyle = flash > 0 ? "#ffffff" : pad.color;
      ctx.rotate(pad.directionAngle + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -pad.radius * 0.62);
      ctx.lineTo(pad.radius * 0.42, 0);
      ctx.lineTo(pad.radius * 0.16, 0);
      ctx.lineTo(pad.radius * 0.16, pad.radius * 0.55);
      ctx.lineTo(-pad.radius * 0.16, pad.radius * 0.55);
      ctx.lineTo(-pad.radius * 0.16, 0);
      ctx.lineTo(-pad.radius * 0.42, 0);
      ctx.closePath();
      ctx.fill();
      ctx.rotate(-(pad.directionAngle + Math.PI / 2));

      if (flash > 0) {
        ctx.globalAlpha = flash * 0.7;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, pad.radius + 12 + (1 - flash) * 20, 0, TAU);
        ctx.stroke();
      }

      ctx.restore();
    }
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
    const food = getFoodLevelConfig(piece.type, piece.level);
    const radius = food.radius;
    const lift = piece.bump > 0 ? piece.bump * 18 : 0;
    const now = performance.now();
    const pickupRemaining = piece.pickupReady ? piece.pickupExpiresAt - now : Infinity;
    const pickupBlink = piece.pickupReady && pickupRemaining <= PICKUP_BLINK_MS;

    ctx.save();
    if (pickupBlink) {
      ctx.globalAlpha = 0.34 + (Math.sin(now / 72) > 0 ? 0.66 : 0.18);
    }
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
    ctx.fillStyle = piece.level > 0 ? "#ffffff" : food.accent;
    ctx.strokeStyle = piece.level > 0 ? food.edge : "rgba(255, 255, 255, 0.82)";
    ctx.lineWidth = piece.level > 0 ? 4 : 3;
    ctx.font = `950 ${Math.max(11, Math.min(16, radius * 0.62))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = getFoodShortLabel(piece.type, piece.level);
    ctx.strokeText(label, 0, 0);
    ctx.fillText(label, 0, 0);

    ctx.shadowColor = "transparent";
    if (piece.hold > 0) {
      drawHoldRing(radius + 9, piece.hold / getDeliveryHoldSeconds(), "#2c9aa0");
    } else if (piece.pickupReady) {
      const total = Math.max(1, piece.pickupExpiresAt - piece.pickupReadyAt);
      const progress = clamp(pickupRemaining / total, 0, 1);
      drawHoldRing(radius + 13, progress, pickupBlink ? "#e85d4f" : "#f1c453");
      ctx.fillStyle = pickupBlink ? "#e85d4f" : "#18312b";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 4;
      ctx.font = "950 13px system-ui, sans-serif";
      ctx.strokeText("탭", 0, -radius - 17);
      ctx.fillText("탭", 0, -radius - 17);
    } else if (isDeliveryReadyPiece(piece)) {
      drawHoldRing(radius + 10, 1, "#f1c453");
    } else if (piece.forbiddenHold > 0) {
      drawHoldRing(radius + 9, piece.forbiddenHold / FORBIDDEN_HOLD_SECONDS, "#e85d4f");
    } else if (piece.wrongHold > 0) {
      drawHoldRing(radius + 9, piece.wrongHold / WRONG_HOLD_SECONDS, "#e85d4f");
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

  function drawFloatingTexts() {
    for (const text of game.floatingTexts) {
      const progress = clamp(text.life / text.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = progress;
      ctx.fillStyle = text.color;
      ctx.strokeStyle = "rgba(24, 49, 43, 0.72)";
      ctx.lineWidth = 6;
      ctx.font = `950 ${text.size}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText(text.text, text.x, text.y);
      ctx.fillText(text.text, text.x, text.y);
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

    game.floatingTexts = game.floatingTexts.filter((text) => {
      text.life -= dt;
      text.y += text.vy * dt;
      text.vy *= Math.pow(0.62, dt * 8);
      return text.life > 0;
    });
  }

  function showFloatingText(text, x, y, color = "#ffffff", size = 30) {
    game.floatingTexts.push({
      text,
      x,
      y,
      vy: -48,
      color,
      size,
      life: 0.92,
      maxLife: 0.92,
    });

    if (game.floatingTexts.length > 8) {
      game.floatingTexts.splice(0, game.floatingTexts.length - 8);
    }
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomRange(min, max, rng = Math.random) {
    return min + rng() * (max - min);
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
