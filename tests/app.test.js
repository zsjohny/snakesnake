/**
 * @jest-environment jsdom
 */

// 导入app.js
require('../app.js')

// 创建模拟App实例的辅助函数
const createMockAppInstance = () => ({
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
  },
  onLaunch: jest.fn(),
  checkUpdate: jest.fn(),
  getUserInfo: jest.fn(),
  initGameConfig: jest.fn(),
  onError: jest.fn(),
  onUnhandledRejection: jest.fn()
})

// 重置测试环境的辅助函数
const resetTestEnvironment = () => {
  App.mockClear()
  jest.resetModules()
  require('../app.js')
}

// 获取App实例的辅助函数
const getAppInstance = () => {
  const appCall = App.mock.calls[0]
  if (appCall && appCall[0]) {
    return appCall[0]
  }
  return createMockAppInstance()
}

describe('App 基础配置测试', () => {
  let appInstance

  beforeEach(() => {
    resetTestEnvironment()
    appInstance = getAppInstance()
  })

  test('App应该被正确调用', () => {
    expect(App).toHaveBeenCalledTimes(1)
  })

  test('globalData应该包含正确的配置', () => {
    expect(appInstance.globalData).toBeDefined()
    expect(appInstance.globalData.userInfo).toBeNull()
    expect(appInstance.globalData.gameConfig).toBeDefined()
    expect(appInstance.globalData.serverUrl).toBeDefined()
    expect(appInstance.globalData.apiBaseUrl).toBeDefined()
  })

  test('gameConfig应该包含正确的游戏配置', () => {
    const gameConfig = appInstance.globalData.gameConfig

    expect(gameConfig.canvasWidth).toBe(800)
    expect(gameConfig.canvasHeight).toBe(600)
    expect(gameConfig.gridSize).toBe(20)
    expect(gameConfig.gameSpeed).toBe(150)
    expect(gameConfig.maxPlayers).toBe(20)
    expect(gameConfig.giftSpawnInterval).toBe(10000)
    expect(gameConfig.blackHoleSpawnInterval).toBe(15000)
    expect(gameConfig.maxGifts).toBe(10)
    expect(gameConfig.maxBlackHoles).toBe(5)
  })
})

describe('App 方法存在性测试', () => {
  let appInstance

  beforeEach(() => {
    resetTestEnvironment()
    appInstance = getAppInstance()
  })

  test('onLaunch方法应该存在', () => {
    expect(typeof appInstance.onLaunch).toBe('function')
  })

  test('checkUpdate方法应该存在', () => {
    expect(typeof appInstance.checkUpdate).toBe('function')
  })

  test('getUserInfo方法应该存在', () => {
    expect(typeof appInstance.getUserInfo).toBe('function')
  })

  test('initGameConfig方法应该存在', () => {
    expect(typeof appInstance.initGameConfig).toBe('function')
  })

  test('onError方法应该存在', () => {
    expect(typeof appInstance.onError).toBe('function')
  })

  test('onUnhandledRejection方法应该存在', () => {
    expect(typeof appInstance.onUnhandledRejection).toBe('function')
  })
})

describe('App 配置功能测试', () => {
  let appInstance

  beforeEach(() => {
    resetTestEnvironment()
    appInstance = getAppInstance()
  })

  test('initGameConfig应该根据屏幕尺寸调整配置', () => {
    // 模拟不同的屏幕尺寸
    wx.getSystemInfoSync.mockReturnValue({
      screenWidth: 414,
      screenHeight: 896
    })

    appInstance.initGameConfig()

    // 验证配置是否被调整
    expect(appInstance.globalData.gameConfig.canvasWidth).toBeCloseTo(372.6) // 414 * 0.9
    expect(appInstance.globalData.gameConfig.canvasHeight).toBeCloseTo(627.2) // 896 * 0.7
  })

  test('checkUpdate应该正确处理更新', () => {
    const mockUpdateManager = {
      onCheckForUpdate: jest.fn(),
      onUpdateReady: jest.fn(),
      applyUpdate: jest.fn()
    }

    wx.getUpdateManager.mockReturnValue(mockUpdateManager)
    wx.canIUse.mockReturnValue(true)

    appInstance.checkUpdate()

    expect(wx.getUpdateManager).toHaveBeenCalled()
    expect(mockUpdateManager.onCheckForUpdate).toHaveBeenCalled()
  })
})

describe('App 用户功能测试', () => {
  let appInstance

  beforeEach(() => {
    resetTestEnvironment()
    appInstance = getAppInstance()
  })

  test('getUserInfo应该正确处理用户信息', () => {
    const mockUserInfo = {
      nickName: '测试用户',
      avatarUrl: 'https://example.com/avatar.jpg'
    }

    wx.getSetting.mockImplementation(options => {
      options.success({
        authSetting: {
          'scope.userInfo': true
        }
      })
    })

    wx.getUserInfo.mockImplementation(options => {
      options.success({
        userInfo: mockUserInfo
      })
    })

    appInstance.getUserInfo()

    expect(wx.getSetting).toHaveBeenCalled()
  })
})

describe('App 错误处理测试', () => {
  let appInstance

  beforeEach(() => {
    resetTestEnvironment()
    appInstance = getAppInstance()
  })

  test('onError应该正确处理错误', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const errorMessage = '测试错误'

    appInstance.onError(errorMessage)

    expect(consoleSpy).toHaveBeenCalledWith('小程序错误:', errorMessage)

    consoleSpy.mockRestore()
  })

  test('onUnhandledRejection应该正确处理Promise拒绝', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const rejectionReason = 'Promise被拒绝'

    appInstance.onUnhandledRejection({
      reason: rejectionReason
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      '未处理的Promise拒绝:',
      rejectionReason
    )

    consoleSpy.mockRestore()
  })
})
