const app = getApp()

Page({
  data: {
    onlinePlayers: 0,
    totalGames: 0,
    myRank: '--',
    myScore: 0,
    recentGames: [],
    notices: [],
    userInfo: null
  },

  onLoad() {
    console.log('首页加载')
    this.initData()
    this.loadUserInfo()
    this.loadGameStats()
    this.loadRecentGames()
    this.loadNotices()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadGameStats()
  },

  initData() {
    // 初始化数据
    this.setData({
      onlinePlayers: 0,
      totalGames: 0,
      myRank: '--',
      myScore: 0,
      recentGames: [],
      notices: []
    })
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
  },

  loadGameStats() {
    // 模拟加载游戏统计数据
    // 实际项目中应该从服务器获取
    this.setData({
      onlinePlayers: Math.floor(Math.random() * 100) + 50,
      totalGames: Math.floor(Math.random() * 10000) + 5000,
      myRank: Math.floor(Math.random() * 100) + 1,
      myScore: Math.floor(Math.random() * 10000) + 1000
    })
  },

  loadRecentGames() {
    // 模拟加载最近游戏记录
    const recentGames = [
      {
        id: 1,
        time: '2024-01-15 14:30',
        score: 8500,
        rank: 3
      },
      {
        id: 2,
        time: '2024-01-15 13:45',
        score: 7200,
        rank: 5
      },
      {
        id: 3,
        time: '2024-01-15 12:20',
        score: 6300,
        rank: 8
      }
    ]

    this.setData({
      recentGames
    })
  },

  loadNotices() {
    // 模拟加载游戏公告
    const notices = [
      {
        id: 1,
        content: '🎉 新年活动开启！参与游戏可获得双倍奖励！',
        time: '2024-01-15 10:00'
      },
      {
        id: 2,
        content: '🔧 系统维护通知：今晚22:00-24:00进行系统升级',
        time: '2024-01-14 18:30'
      },
      {
        id: 3,
        content: '🎁 每日登录奖励已更新，记得每日签到哦！',
        time: '2024-01-14 09:15'
      }
    ]

    this.setData({
      notices
    })
  },

  startGame() {
    console.log('开始游戏')

    // 检查用户信息
    if (!this.data.userInfo) {
      wx.showModal({
        title: '提示',
        content: '需要获取您的用户信息才能开始游戏',
        success: res => {
          if (res.confirm) {
            this.loadUserInfo()
          }
        }
      })
      return
    }

    // 跳转到游戏页面
    wx.switchTab({
      url: '/pages/game/game',
      success: () => {
        console.log('跳转到游戏页面成功')
      },
      fail: err => {
        console.error('跳转到游戏页面失败:', err)
        wx.showToast({
          title: '跳转失败',
          icon: 'error'
        })
      }
    })
  },

  viewRanking() {
    console.log('查看排行榜')
    wx.switchTab({
      url: '/pages/rank/rank'
    })
  },

  viewTutorial() {
    console.log('查看教程')
    wx.showModal({
      title: '游戏教程',
      content:
        '1. 使用方向键或滑动控制蛇的移动\n2. 吃掉食物可以增长身体和得分\n3. 避免撞到墙壁、其他玩家或自己的身体\n4. 收集礼包可以获得特殊效果\n5. 小心黑洞陷阱！',
      showCancel: false,
      confirmText: '知道了'
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
