const app = getApp()

Page({
  data: {
    // 用户信息
    userInfo: null,
    userLevel: 1,
    userId: '000000',

    // 游戏统计
    totalGames: 0,
    totalScore: 0,
    bestScore: 0,
    winRate: 0,
    totalTime: '0小时',
    maxLength: 0,

    // 成就系统
    achievements: [],
    achievementCount: 0,
    totalAchievements: 0,

    // 最近游戏
    recentGames: []
  },

  onLoad() {
    console.log('个人资料页面加载')
    this.loadUserInfo()
    this.loadGameStats()
    this.loadAchievements()
    this.loadRecentGames()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadGameStats()
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userInfo
      })
    } else {
      // 如果没有用户信息，尝试获取
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        },
        fail: () => {
          console.log('用户拒绝授权')
        }
      })
    }

    // 生成用户ID和等级
    this.setData({
      userId: this.generateUserId(),
      userLevel: Math.floor(Math.random() * 50) + 1
    })
  },

  generateUserId() {
    // 生成6位数字用户ID
    return Math.floor(100000 + Math.random() * 900000).toString()
  },

  loadGameStats() {
    // 模拟加载游戏统计数据
    // 实际项目中应该从服务器获取
    this.setData({
      totalGames: Math.floor(Math.random() * 500) + 50,
      totalScore: Math.floor(Math.random() * 100000) + 10000,
      bestScore: Math.floor(Math.random() * 15000) + 5000,
      winRate: Math.floor(Math.random() * 40) + 60,
      totalTime: `${Math.floor(Math.random() * 100) + 10}小时`,
      maxLength: Math.floor(Math.random() * 50) + 10
    })
  },

  // 生成基础成就数据的辅助函数
  generateBasicAchievements() {
    return [
      {
        id: 1,
        icon: '🎯',
        name: '初次尝试',
        description: '完成第一局游戏',
        progress: 100,
        unlocked: true
      },
      {
        id: 2,
        icon: '🏆',
        name: '百战不殆',
        description: '完成100局游戏',
        progress: 75,
        unlocked: false
      },
      {
        id: 3,
        icon: '⭐',
        name: '高分达人',
        description: '单局得分超过10000分',
        progress: 100,
        unlocked: true
      },
      {
        id: 4,
        icon: '🐍',
        name: '蛇王',
        description: '蛇身长度达到50',
        progress: 60,
        unlocked: false
      }
    ]
  },

  // 生成高级成就数据的辅助函数
  generateAdvancedAchievements() {
    return [
      {
        id: 5,
        icon: '⚡',
        name: '速度之王',
        description: '使用加速道具10次',
        progress: 40,
        unlocked: false
      },
      {
        id: 6,
        icon: '🛡️',
        name: '护盾大师',
        description: '使用护盾道具20次',
        progress: 25,
        unlocked: false
      },
      {
        id: 7,
        icon: '🎁',
        name: '礼包收集者',
        description: '收集100个礼包',
        progress: 80,
        unlocked: false
      },
      {
        id: 8,
        icon: '👑',
        name: '排行榜王者',
        description: '进入排行榜前10名',
        progress: 100,
        unlocked: true
      }
    ]
  },

  // 生成成就数据的辅助函数
  generateAchievementsData() {
    const basicAchievements = this.generateBasicAchievements()
    const advancedAchievements = this.generateAdvancedAchievements()
    return [...basicAchievements, ...advancedAchievements]
  },

  // 更新成就统计的辅助函数
  updateAchievementStats(achievements) {
    const unlockedCount = achievements.filter(item => item.unlocked).length
    this.setData({
      achievementCount: unlockedCount,
      totalAchievements: achievements.length
    })
  },

  loadAchievements() {
    const achievements = this.generateAchievementsData()
    this.setData({ achievements })
    this.updateAchievementStats(achievements)
  },

  loadRecentGames() {
    // 模拟加载最近游戏记录
    const recentGames = [
      {
        id: 1,
        time: '2024-01-15 14:30',
        score: 8500,
        rank: 3,
        duration: '12:30'
      },
      {
        id: 2,
        time: '2024-01-15 13:45',
        score: 7200,
        rank: 5,
        duration: '10:15'
      },
      {
        id: 3,
        time: '2024-01-15 12:20',
        score: 6300,
        rank: 8,
        duration: '08:45'
      },
      {
        id: 4,
        time: '2024-01-15 11:10',
        score: 9100,
        rank: 2,
        duration: '15:20'
      },
      {
        id: 5,
        time: '2024-01-15 10:05',
        score: 5400,
        rank: 12,
        duration: '07:30'
      }
    ]

    this.setData({
      recentGames
    })
  },

  // 用户操作
  editProfile() {
    wx.showModal({
      title: '编辑资料',
      content: '功能开发中，敬请期待！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  viewAllHistory() {
    wx.showModal({
      title: '游戏历史',
      content: '完整游戏历史功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 设置功能
  openSoundSettings() {
    wx.showModal({
      title: '音效设置',
      content: '音效设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  openControlSettings() {
    wx.showModal({
      title: '控制设置',
      content: '控制设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  openNotificationSettings() {
    wx.showModal({
      title: '通知设置',
      content: '通知设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  openPrivacySettings() {
    wx.showModal({
      title: '隐私设置',
      content: '隐私设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 其他功能
  shareApp() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  rateApp() {
    wx.showModal({
      title: '评价应用',
      content: '感谢您的支持！请在应用商店给我们五星好评！',
      showCancel: false,
      confirmText: '好的'
    })
  },

  contactSupport() {
    wx.showModal({
      title: '联系客服',
      content: '客服QQ: 123456789\n客服微信: snakegame_support',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  aboutApp() {
    wx.showModal({
      title: '关于应用',
      content:
        '贪食蛇大战 v1.0.0\n\n一款多人在线实时对战的贪食蛇游戏\n\n开发者: SnakeGame Team\n\n感谢您的使用！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 清除用户信息
          app.globalData.userInfo = null

          // 返回首页
          wx.switchTab({
            url: '/pages/index/index',
            success: () => {
              wx.showToast({
                title: '已退出登录',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '🐍 贪食蛇大战 - 多人在线实时对战',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    }
  },

  onShareTimeline() {
    return {
      title: '🐍 贪食蛇大战 - 多人在线实时对战',
      imageUrl: '/images/share.png'
    }
  }
})
