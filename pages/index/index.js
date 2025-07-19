// index.js
const Logger = require('../../utils/logger')

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse('open-data.type.userAvatarUrl') &&
      wx.canIUse('open-data.type.userNickName')
  },

  onLoad() {
    Logger.pageLoad('首页')
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: () => {
        Logger.userAction('用户拒绝授权')
      }
    })
  },

  getUserInfo(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      Logger.userAction('用户拒绝授权')
    }
  },

  startGame() {
    Logger.userAction('开始游戏')
    wx.navigateTo({
      url: '/pages/game/game',
      success: () => {
        Logger.feature('跳转到游戏页面成功')
      },
      fail: (err) => {
        Logger.appError(err, '跳转到游戏页面失败')
      }
    })
  },

  viewRanking() {
    Logger.userAction('查看排行榜')
    wx.navigateTo({
      url: '/pages/rank/rank'
    })
  },

  viewTutorial() {
    Logger.userAction('查看教程')
    wx.showModal({
      title: '游戏教程',
      content:
        '1. 点击屏幕控制蛇的移动方向\n2. 吃食物增加分数\n3. 收集礼包获得特殊效果\n4. 避开黑洞和其他玩家\n5. 挑战排行榜！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  viewProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  onShareAppMessage() {
    return {
      title: '🐍 贪食蛇大战 - 多人实时对战',
      path: '/pages/index/index',
      imageUrl: '/images/share-index.png'
    }
  },

  onShareTimeline() {
    return {
      title: '🐍 贪食蛇大战 - 多人实时对战',
      imageUrl: '/images/share-index.png'
    }
  }
})
