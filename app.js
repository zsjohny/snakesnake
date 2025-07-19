// app.js
const Logger = require('./utils/logger')

App({
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
    serverUrl: 'wss://snakesnake-server.com',
    apiBaseUrl: 'https://snakesnake-api.com'
  },

  onLaunch() {
    Logger.pageLoad('App')
    this.checkUpdate()
    this.getUserInfo()
    this.initGameConfig()
  },

  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          Logger.info('发现新版本，正在下载...')
        }
      })

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  },

  getUserInfo() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },

  initGameConfig() {
    const systemInfo = wx.getSystemInfoSync()
    const screenWidth = systemInfo.screenWidth
    const screenHeight = systemInfo.screenHeight

    // 根据屏幕尺寸调整游戏配置
    this.globalData.gameConfig.canvasWidth = Math.floor(screenWidth * 0.9)
    this.globalData.gameConfig.canvasHeight = Math.floor(screenHeight * 0.7)
  },

  onError(msg) {
    Logger.appError(msg)
  },

  onUnhandledRejection(res) {
    Logger.appError(res.reason, 'Promise拒绝')
  }
})
