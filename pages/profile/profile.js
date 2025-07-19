// profile.js
const app = getApp()
const Logger = require('../../utils/logger')

Page({
  data: {
    userInfo: null,
    gameStats: {
      totalGames: 0,
      bestScore: 0,
      averageScore: 0,
      winRate: 0,
      totalPlayTime: 0
    },
    achievements: [],
    achievementCount: 0,
    totalAchievements: 0,
    recentGames: [],
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      notificationsEnabled: true
    }
  },

  onLoad() {
    Logger.pageLoad('个人资料')
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
      // 如果没有用户信息，生成一个临时用户ID
      const tempUserInfo = {
        nickName: `玩家${this.generateUserId()}`,
        avatarUrl: '/images/default-avatar.png'
      }
      this.setData({
        userInfo: tempUserInfo
      })
    }
  },

  generateUserId() {
    return Math.floor(Math.random() * 10000) + 1000
  },

  loadGameStats() {
    // 模拟加载游戏统计数据
    // 实际项目中应该从服务器获取
    this.setData({
      gameStats: {
        totalGames: Math.floor(Math.random() * 500) + 50,
        bestScore: Math.floor(Math.random() * 15000) + 5000,
        averageScore: Math.floor(Math.random() * 8000) + 2000,
        winRate: Math.floor(Math.random() * 40) + 60,
        totalPlayTime: Math.floor(Math.random() * 10000) + 1000
      }
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
    const unlockedCount = achievements.filter((item) => item.unlocked).length
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
    Logger.userAction('编辑资料')
    wx.showModal({
      title: '编辑资料',
      content: '功能开发中，敬请期待！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  viewAllHistory() {
    Logger.userAction('查看完整历史')
    wx.showModal({
      title: '游戏历史',
      content: '完整游戏历史功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 设置功能
  openSoundSettings() {
    Logger.userAction('打开音效设置')
    wx.showModal({
      title: '音效设置',
      content: '音效设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  openControlSettings() {
    Logger.userAction('打开控制设置')
    wx.showModal({
      title: '控制设置',
      content: '控制设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  openNotificationSettings() {
    Logger.userAction('打开通知设置')
    wx.showModal({
      title: '通知设置',
      content: '通知设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  openPrivacySettings() {
    Logger.userAction('打开隐私设置')
    wx.showModal({
      title: '隐私设置',
      content: '隐私设置功能开发中！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 其他功能
  shareApp() {
    Logger.userAction('分享应用')
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  rateApp() {
    Logger.userAction('评价应用')
    wx.showModal({
      title: '评价应用',
      content: '感谢您的支持！请在应用商店给我们五星好评！',
      showCancel: false,
      confirmText: '好的'
    })
  },

  contactSupport() {
    Logger.userAction('联系客服')
    wx.showModal({
      title: '联系客服',
      content: '客服功能开发中！如有问题请发送邮件至：support@snakesnake.com',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  aboutApp() {
    Logger.userAction('关于应用')
    wx.showModal({
      title: '关于贪食蛇大战',
      content:
        '版本：1.1.2\n开发者：SnakeSnake Team\n\n一款多人在线实时对战的贪食蛇游戏！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  logout() {
    Logger.userAction('退出登录')
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          app.globalData.userInfo = null
          this.setData({
            userInfo: null
          })

          // 返回首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '🐍 贪食蛇大战 - 查看我的游戏成就！',
      path: '/pages/profile/profile',
      imageUrl: '/images/share-profile.png'
    }
  },

  onShareTimeline() {
    return {
      title: '🐍 贪食蛇大战 - 查看我的游戏成就！',
      imageUrl: '/images/share-profile.png'
    }
  }
})
