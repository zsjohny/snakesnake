const app = getApp()

Page({
  data: {
    // 我的排名信息
    myRank: 1,
    myScore: 0,
    userInfo: null,
    totalGames: 0,
    bestScore: 0,
    winRate: 0,

    // 排行榜数据
    rankingList: [],
    currentTab: 'daily',
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 20
  },

  onLoad () {
    console.log('排行榜页面加载')
    this.loadUserInfo()
    this.loadMyRanking()
    this.loadRankingList()
  },

  onShow () {
    // 页面显示时刷新数据
    this.loadMyRanking()
  },

  onPullDownRefresh () {
    // 下拉刷新
    this.refreshData()
  },

  onReachBottom () {
    // 上拉加载更多
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },

  loadUserInfo () {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
  },

  loadMyRanking () {
    // 模拟加载我的排名信息
    // 实际项目中应该从服务器获取
    this.setData({
      myRank: Math.floor(Math.random() * 100) + 1,
      myScore: Math.floor(Math.random() * 10000) + 1000,
      totalGames: Math.floor(Math.random() * 500) + 50,
      bestScore: Math.floor(Math.random() * 15000) + 5000,
      winRate: Math.floor(Math.random() * 40) + 60
    })
  },

  loadRankingList () {
    this.setData({
      loading: true
    })

    // 模拟加载排行榜数据
    // 实际项目中应该从服务器获取
    setTimeout(() => {
      const mockData = this.generateMockRankingData()

      this.setData({
        rankingList: mockData,
        loading: false,
        hasMore: mockData.length >= this.data.pageSize
      })
    }, 1000)
  },

  generateMockRankingData () {
    const data = []
    const names = [
      '王者归来', '蛇王', '贪吃蛇大师', '速度之王', '技巧达人',
      '游戏高手', '蛇神', '无敌玩家', '超级玩家', '游戏达人',
      '蛇王之王', '速度之神', '技巧大师', '游戏王者', '蛇神之王'
    ]

    for (let i = 0; i < this.data.pageSize; i++) {
      const score = Math.floor(Math.random() * 20000) + 1000
      const snakeLength = Math.floor(Math.random() * 50) + 10
      const gameTime = `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`

      data.push({
        id: `player_${i}`,
        name: names[Math.floor(Math.random() * names.length)],
        avatar: `/images/avatar_${Math.floor(Math.random() * 5) + 1}.png`,
        score,
        snakeLength,
        gameTime,
        level: Math.floor(Math.random() * 50) + 1,
        rank: i + 1
      })
    }

    // 按分数排序
    data.sort((a, b) => b.score - a.score)

    // 重新分配排名
    data.forEach((item, index) => {
      item.rank = index + 1
    })

    return data
  },

  switchTab (e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.currentTab) return

    this.setData({
      currentTab: tab,
      rankingList: [],
      page: 1,
      hasMore: true
    })

    this.loadRankingList()
  },

  loadMore () {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({
      loading: true,
      page: this.data.page + 1
    })

    // 模拟加载更多数据
    setTimeout(() => {
      const moreData = this.generateMockRankingData()
      const startIndex = (this.data.page - 1) * this.data.pageSize

      // 为新增数据分配排名
      moreData.forEach((item, index) => {
        item.rank = startIndex + index + 1
      })

      this.setData({
        rankingList: [...this.data.rankingList, ...moreData],
        loading: false,
        hasMore: moreData.length >= this.data.pageSize
      })
    }, 1000)
  },

  refreshData () {
    this.setData({
      rankingList: [],
      page: 1,
      hasMore: true
    })

    this.loadMyRanking()
    this.loadRankingList()

    wx.stopPullDownRefresh()
  },

  onShareAppMessage () {
    return {
      title: '🏆 贪食蛇大战排行榜 - 看看谁是最强王者',
      path: '/pages/rank/rank',
      imageUrl: '/images/share-rank.png'
    }
  },

  onShareTimeline () {
    return {
      title: '🏆 贪食蛇大战排行榜 - 看看谁是最强王者',
      imageUrl: '/images/share-rank.png'
    }
  }
})
