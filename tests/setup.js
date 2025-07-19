// Jest测试环境配置
// 模拟微信小程序环境

// 模拟wx对象
global.wx = {
  // 基础API
  showToast: jest.fn(),
  showModal: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  switchTab: jest.fn(),
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),

  // 用户信息API
  getUserInfo: jest.fn(),
  getUserProfile: jest.fn(),
  getSetting: jest.fn(),

  // 系统信息API
  getSystemInfoSync: jest.fn(() => ({
    screenWidth: 375,
    screenHeight: 667,
    platform: 'ios'
  })),

  // 画布API
  createCanvasContext: jest.fn(() => ({
    setFillStyle: jest.fn(),
    fillRect: jest.fn(),
    setStrokeStyle: jest.fn(),
    setLineWidth: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    draw: jest.fn()
  })),

  // 网络API
  request: jest.fn(),
  connectSocket: jest.fn(),

  // 存储API
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),

  // 分享API
  showShareMenu: jest.fn(),

  // 更新API
  getUpdateManager: jest.fn(() => ({
    onCheckForUpdate: jest.fn(),
    onUpdateReady: jest.fn(),
    applyUpdate: jest.fn()
  })),

  // 其他API
  canIUse: jest.fn(() => true),
  stopPullDownRefresh: jest.fn()
}

// 模拟App函数
global.App = jest.fn()

// 模拟Page函数
global.Page = jest.fn()

// 模拟Component函数
global.Component = jest.fn()

// 模拟getApp函数
global.getApp = jest.fn(() => ({
  globalData: {
    userInfo: null,
    gameConfig: {
      canvasWidth: 800,
      canvasHeight: 600,
      gridSize: 20,
      gameSpeed: 150,
      maxPlayers: 20,
      giftSpawnInterval: 10000,
      blackHoleSpawnInterval: 15000,
      maxGifts: 10,
      maxBlackHoles: 5
    },
    serverUrl: 'wss://test-server.com',
    apiBaseUrl: 'https://test-api.com'
  }
}))

// 设置测试超时时间
jest.setTimeout(10000)

// 清理函数
afterEach(() => {
  jest.clearAllMocks()
})
