App({
  globalData: {
    userInfo: null,
    gameConfig: {
      canvasWidth: 800,
      canvasHeight: 600,
      gridSize: 20,
      gameSpeed: 150,
      maxPlayers: 20,
      giftSpawnInterval: 10000, // 10秒刷新一次礼包
      blackHoleSpawnInterval: 15000, // 15秒刷新一次黑洞
      maxGifts: 10,
      maxBlackHoles: 5
    },
    serverUrl: 'wss://your-websocket-server.com', // 需要替换为实际的WebSocket服务器地址
    apiBaseUrl: 'https://your-api-server.com' // 需要替换为实际的API服务器地址
  },

  onLaunch () {
    console.log('贪食蛇大战小程序启动')

    // 检查更新
    this.checkUpdate()

    // 获取用户信息
    this.getUserInfo()

    // 初始化游戏配置
    this.initGameConfig()
  },

  checkUpdate () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: res => {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    }
  },

  getUserInfo () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },

  initGameConfig () {
    // 根据设备屏幕大小调整游戏配置
    const systemInfo = wx.getSystemInfoSync()
    const screenWidth = systemInfo.screenWidth
    const screenHeight = systemInfo.screenHeight

    // 调整画布大小以适应屏幕
    this.globalData.gameConfig.canvasWidth = screenWidth * 0.9
    this.globalData.gameConfig.canvasHeight = screenHeight * 0.7
  },

  // 全局错误处理
  onError (msg) {
    console.error('小程序错误:', msg)
  },

  // 全局未处理的Promise拒绝
  onUnhandledRejection (res) {
    console.error('未处理的Promise拒绝:', res.reason)
  }
})
