// game.js
const app = getApp()
const Logger = require('../../utils/logger')

Page({
  data: {
    score: 0,
    snakeLength: 3,
    rank: 1,
    onlinePlayers: 0,
    isPaused: false,
    isGameOver: false,
    showRanking: false,
    canvasWidth: 800,
    canvasHeight: 600,
    giftCount: 0,
    blackHoleCount: 0,
    gameTime: '00:00',
    rankingList: []
  },

  // 游戏变量
  gameLoop: null,
  canvas: null,
  ctx: null,
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

  // 游戏状态
  snake: [
    { x: 400, y: 300 },
    { x: 380, y: 300 },
    { x: 360, y: 300 }
  ],
  direction: 'right',
  nextDirection: 'right',
  food: [],
  gifts: [],
  blackHoles: [],
  otherPlayers: [],

  // 触摸控制
  touchStartX: 0,
  touchStartY: 0,

  // 时间控制
  gameStartTime: 0,
  gameTimer: null,

  // WebSocket连接
  socket: null,

  onLoad() {
    Logger.pageLoad('游戏')
    this.initGame()
  },

  onShow() {
    if (this.data.isPaused) {
      this.resumeGame()
    }
  },

  onHide() {
    this.pauseGame()
  },

  onUnload() {
    this.cleanup()
  },

  initGame() {
    // 初始化游戏配置
    this.gameConfig = { ...app.globalData.gameConfig }
    this.setData({
      canvasWidth: this.gameConfig.canvasWidth,
      canvasHeight: this.gameConfig.canvasHeight
    })

    // 初始化画布
    this.initCanvas()

    // 生成初始食物
    this.generateFood()

    // 连接WebSocket
    this.connectWebSocket()

    // 开始游戏
    this.startGame()
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query
      .select('#gameCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = this.gameConfig.canvasWidth * dpr
        canvas.height = this.gameConfig.canvasHeight * dpr
        ctx.scale(dpr, dpr)

        this.canvas = canvas
        this.ctx = ctx

        // 开始渲染
        this.render()
      })
  },

  connectWebSocket() {
    Logger.network('连接', app.globalData.serverUrl)
    this.socket = wx.connectSocket({
      url: app.globalData.serverUrl,
      success: () => {
        Logger.network('连接成功', app.globalData.serverUrl)
      },
      fail: (err) => {
        Logger.appError(err, 'WebSocket连接失败')
      }
    })

    wx.onSocketOpen(() => {
      Logger.network('连接已打开', app.globalData.serverUrl)
      this.sendGameState()
    })

    wx.onSocketMessage((res) => {
      try {
        const data = JSON.parse(res.data)
        this.handleSocketMessage(data)
      } catch (error) {
        Logger.appError(error, '解析WebSocket消息失败')
      }
    })

    wx.onSocketError((err) => {
      Logger.appError(err, 'WebSocket错误')
    })

    wx.onSocketClose(() => {
      Logger.network('连接已关闭', app.globalData.serverUrl)
    })
  },

  sendGameState() {
    if (this.socket) {
      const gameState = {
        type: 'gameState',
        snake: this.snake,
        direction: this.direction,
        score: this.data.score,
        position: { x: this.snake[0].x, y: this.snake[0].y }
      }

      wx.sendSocketMessage({
        data: JSON.stringify(gameState)
      })
    }
  },

  handleSocketMessage(data) {
    switch (data.type) {
      case 'playerList':
        this.setData({
          onlinePlayers: data.players.length
        })
        break
      case 'gameState':
        this.updateOtherPlayers(data.players)
        break
      case 'ranking':
        this.setData({
          rankingList: data.ranking
        })
        break
      default:
        Logger.debug('未知消息类型:', data.type)
    }
  },

  updateOtherPlayers(players) {
    this.otherPlayers = players.filter(
      (player) => player.id !== this.data.userId
    )
  },

  startGame() {
    Logger.gameState('开始')
    this.gameStartTime = Date.now()
    this.gameLoop = setInterval(() => {
      this.updateGame()
    }, this.gameConfig.gameSpeed)

    this.gameTimer = setInterval(() => {
      this.updateGameTime()
    }, 1000)

    this.setData({
      isPaused: false,
      isGameOver: false
    })
  },

  pauseGame() {
    Logger.gameState('暂停')
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }

    this.setData({
      isPaused: true
    })
  },

  resumeGame() {
    Logger.gameState('恢复')
    this.startGame()
  },

  gameOver() {
    Logger.gameState('结束', `得分: ${this.data.score}`)
    this.pauseGame()

    this.setData({
      isGameOver: true
    })

    // 发送游戏结束消息
    if (this.socket) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          type: 'gameOver',
          score: this.data.score
        })
      })
    }

    // 显示游戏结束对话框
    wx.showModal({
      title: '游戏结束',
      content: `您的得分: ${this.data.score}\n是否重新开始？`,
      confirmText: '重新开始',
      cancelText: '返回首页',
      success: (res) => {
        if (res.confirm) {
          this.restartGame()
        } else {
          wx.navigateBack()
        }
      }
    })
  },

  restartGame() {
    Logger.gameState('重新开始')
    // 重置游戏状态
    this.snake = [
      { x: 400, y: 300 },
      { x: 380, y: 300 },
      { x: 360, y: 300 }
    ]
    this.direction = 'right'
    this.nextDirection = 'right'
    this.food = []
    this.gifts = []
    this.blackHoles = []
    this.otherPlayers = []

    this.setData({
      score: 0,
      snakeLength: 3,
      isGameOver: false,
      gameTime: '00:00'
    })

    this.generateFood()
    this.startGame()
  },

  updateGame() {
    this.moveSnake()
    this.checkCollision()
    this.checkFoodCollision()
    this.checkGiftCollision()
    this.checkBlackHoleCollision()
    this.spawnGift()
    this.spawnBlackHole()
    this.render()
    this.sendGameState()
  },

  moveSnake() {
    const head = { ...this.snake[0] }
    this.direction = this.nextDirection

    switch (this.direction) {
      case 'up':
        head.y -= this.gameConfig.gridSize
        break
      case 'down':
        head.y += this.gameConfig.gridSize
        break
      case 'left':
        head.x -= this.gameConfig.gridSize
        break
      case 'right':
        head.x += this.gameConfig.gridSize
        break
    }

    // 穿墙逻辑
    if (head.x < 0) {
      head.x = this.gameConfig.canvasWidth - this.gameConfig.gridSize
    } else if (head.x >= this.gameConfig.canvasWidth) {
      head.x = 0
    }

    if (head.y < 0) {
      head.y = this.gameConfig.canvasHeight - this.gameConfig.gridSize
    } else if (head.y >= this.gameConfig.canvasHeight) {
      head.y = 0
    }

    this.snake.unshift(head)
    this.snake.pop()
  },

  checkCollision() {
    const head = this.snake[0]

    // 检查与蛇身的碰撞
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.gameOver()
        return
      }
    }

    // 检查与其他玩家的碰撞
    for (const player of this.otherPlayers) {
      for (const segment of player.snake) {
        if (head.x === segment.x && head.y === segment.y) {
          this.gameOver()
          return
        }
      }
    }
  },

  checkFoodCollision() {
    const head = this.snake[0]
    const foodIndex = this.food.findIndex(
      (item) => item.x === head.x && item.y === head.y
    )

    if (foodIndex !== -1) {
      // 吃食物
      this.food.splice(foodIndex, 1)
      this.addScore(100)
      this.growSnake()
      this.generateFood()
    }
  },

  checkGiftCollision() {
    const head = this.snake[0]
    const giftIndex = this.gifts.findIndex(
      (gift) => gift.x === head.x && gift.y === head.y
    )

    if (giftIndex !== -1) {
      const gift = this.gifts[giftIndex]
      this.gifts.splice(giftIndex, 1)
      this.addScore(gift.points)
      this.applyGiftEffect(gift)
    }
  },

  checkBlackHoleCollision() {
    const head = this.snake[0]
    const blackHoleIndex = this.blackHoles.findIndex(
      (blackHole) => blackHole.x === head.x && blackHole.y === head.y
    )

    if (blackHoleIndex !== -1) {
      this.blackHoles.splice(blackHoleIndex, 1)
      this.gameOver()
    }
  },

  addScore(points) {
    const newScore = this.data.score + points
    this.setData({
      score: newScore
    })
  },

  growSnake() {
    const tail = { ...this.snake[this.snake.length - 1] }
    this.snake.push(tail)
    this.setData({
      snakeLength: this.snake.length
    })
  },

  generateFood() {
    if (this.food.length < 5) {
      const food = this.getRandomPosition()
      this.food.push(food)
    }
  },

  spawnGift() {
    if (this.gifts.length < this.gameConfig.maxGifts) {
      const now = Date.now()
      if (
        !this.lastGiftSpawn ||
        now - this.lastGiftSpawn > this.gameConfig.giftSpawnInterval
      ) {
        const gift = {
          ...this.getRandomPosition(),
          type: this.getRandomGiftType(),
          points: Math.floor(Math.random() * 500) + 100
        }
        this.gifts.push(gift)
        this.lastGiftSpawn = now
        this.setData({
          giftCount: this.gifts.length
        })
      }
    }
  },

  spawnBlackHole() {
    if (this.blackHoles.length < this.gameConfig.maxBlackHoles) {
      const now = Date.now()
      if (
        !this.lastBlackHoleSpawn ||
        now - this.lastBlackHoleSpawn > this.gameConfig.blackHoleSpawnInterval
      ) {
        const blackHole = this.getRandomPosition()
        this.blackHoles.push(blackHole)
        this.lastBlackHoleSpawn = now
        this.setData({
          blackHoleCount: this.blackHoles.length
        })
      }
    }
  },

  getRandomPosition() {
    const maxX = Math.floor(
      this.gameConfig.canvasWidth / this.gameConfig.gridSize
    )
    const maxY = Math.floor(
      this.gameConfig.canvasHeight / this.gameConfig.gridSize
    )
    return {
      x: Math.floor(Math.random() * maxX) * this.gameConfig.gridSize,
      y: Math.floor(Math.random() * maxY) * this.gameConfig.gridSize
    }
  },

  getRandomGiftType() {
    const types = ['speed', 'shield', 'teleport', 'double']
    return types[Math.floor(Math.random() * types.length)]
  },

  applyGiftEffect(gift) {
    let newPos
    switch (gift.type) {
      case 'speed':
        Logger.gameState('护盾激活')
        // 临时提升速度
        this.gameConfig.gameSpeed = Math.max(50, this.gameConfig.gameSpeed / 2)
        setTimeout(() => {
          this.gameConfig.gameSpeed = 150
        }, 5000)
        break
      case 'shield':
        // 临时无敌
        this.hasShield = true
        setTimeout(() => {
          this.hasShield = false
        }, 3000)
        break
      case 'teleport':
        // 随机传送
        newPos = this.getRandomPosition()
        this.snake[0] = newPos
        break
      case 'double':
        // 双倍得分
        this.doubleScore = true
        setTimeout(() => {
          this.doubleScore = false
        }, 10000)
        break
    }
  },

  updateGameTime() {
    const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    this.setData({
      gameTime: timeString
    })
  },

  // 绘制蛇的辅助函数
  drawSnake() {
    this.ctx.fillStyle = '#4CAF50'
    for (const segment of this.snake) {
      this.ctx.fillRect(
        segment.x,
        segment.y,
        this.gameConfig.gridSize - 2,
        this.gameConfig.gridSize - 2
      )
    }
  },

  // 绘制食物的辅助函数
  drawFood() {
    this.ctx.fillStyle = '#FF5722'
    for (const food of this.food) {
      this.ctx.fillRect(
        food.x,
        food.y,
        this.gameConfig.gridSize - 2,
        this.gameConfig.gridSize - 2
      )
    }
  },

  // 绘制礼包的辅助函数
  drawGifts() {
    this.ctx.fillStyle = '#FFC107'
    for (const gift of this.gifts) {
      this.ctx.fillRect(
        gift.x,
        gift.y,
        this.gameConfig.gridSize - 2,
        this.gameConfig.gridSize - 2
      )
    }
  },

  // 绘制黑洞的辅助函数
  drawBlackHoles() {
    this.ctx.fillStyle = '#000000'
    for (const blackHole of this.blackHoles) {
      this.ctx.fillRect(
        blackHole.x,
        blackHole.y,
        this.gameConfig.gridSize - 2,
        this.gameConfig.gridSize - 2
      )
    }
  },

  // 绘制其他玩家的辅助函数
  drawOtherPlayers() {
    this.ctx.fillStyle = '#2196F3'
    for (const player of this.otherPlayers) {
      for (const segment of player.snake) {
        this.ctx.fillRect(
          segment.x,
          segment.y,
          this.gameConfig.gridSize - 2,
          this.gameConfig.gridSize - 2
        )
      }
    }
  },

  render() {
    if (!this.ctx) return

    // 清空画布
    this.ctx.clearRect(
      0,
      0,
      this.gameConfig.canvasWidth,
      this.gameConfig.canvasHeight
    )

    // 绘制背景
    this.ctx.fillStyle = '#f0f0f0'
    this.ctx.fillRect(
      0,
      0,
      this.gameConfig.canvasWidth,
      this.gameConfig.canvasHeight
    )

    // 绘制游戏元素
    this.drawSnake()
    this.drawFood()
    this.drawGifts()
    this.drawBlackHoles()
    this.drawOtherPlayers()
  },

  onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  },

  // 处理水平滑动的辅助函数
  handleHorizontalSwipe(deltaX, minSwipeDistance) {
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && this.direction !== 'left') {
        this.nextDirection = 'right'
      } else if (deltaX < 0 && this.direction !== 'right') {
        this.nextDirection = 'left'
      }
    }
  },

  // 处理垂直滑动的辅助函数
  handleVerticalSwipe(deltaY, minSwipeDistance) {
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0 && this.direction !== 'up') {
        this.nextDirection = 'down'
      } else if (deltaY < 0 && this.direction !== 'down') {
        this.nextDirection = 'up'
      }
    }
  },

  onTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchEndX - this.touchStartX
    const deltaY = touchEndY - this.touchStartY

    const minSwipeDistance = 30

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.handleHorizontalSwipe(deltaX, minSwipeDistance)
    } else {
      this.handleVerticalSwipe(deltaY, minSwipeDistance)
    }
  },

  togglePause() {
    if (this.data.isPaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  },

  toggleRanking() {
    this.setData({
      showRanking: !this.data.showRanking
    })
  },

  updateRanking() {
    // 更新排行榜数据
    if (this.socket) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          type: 'getRanking'
        })
      })
    }
  },

  cleanup() {
    Logger.gameState('清理资源')
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }
    if (this.socket) {
      wx.closeSocket()
      this.socket = null
    }
  },

  onShareAppMessage() {
    return {
      title: `🐍 我在贪食蛇大战中获得了${this.data.score}分！`,
      path: '/pages/index/index',
      imageUrl: '/images/share-game.png'
    }
  },

  onShareTimeline() {
    return {
      title: `🐍 我在贪食蛇大战中获得了${this.data.score}分！`,
      imageUrl: '/images/share-game.png'
    }
  }
})
