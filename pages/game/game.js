const app = getApp()

Page({
  data: {
    // 游戏状态
    score: 0,
    snakeLength: 3,
    rank: 1,
    onlinePlayers: 0,
    isPaused: false,
    isGameOver: false,
    showRanking: false,

    // 画布尺寸
    canvasWidth: 800,
    canvasHeight: 600,

    // 游戏信息
    giftCount: 0,
    blackHoleCount: 0,
    gameTime: '00:00',

    // 排行榜
    rankingList: []
  },

  // 游戏变量
  gameLoop: null,
  canvas: null,
  ctx: null,
  gameConfig: null,

  // 游戏状态
  snake: [],
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
    console.log('游戏页面加载')
    this.initGame()
  },

  onShow() {
    // 页面显示时恢复游戏
    if (this.gameLoop && !this.data.isPaused && !this.data.isGameOver) {
      this.resumeGame()
    }
  },

  onHide() {
    // 页面隐藏时暂停游戏
    if (this.gameLoop && !this.data.isGameOver) {
      this.pauseGame()
    }
  },

  onUnload() {
    // 页面卸载时清理资源
    this.cleanup()
  },

  initGame() {
    // 获取游戏配置
    this.gameConfig = app.globalData.gameConfig

    // 设置画布尺寸
    this.setData({
      canvasWidth: this.gameConfig.canvasWidth,
      canvasHeight: this.gameConfig.canvasHeight
    })

    // 初始化画布
    this.initCanvas()

    // 初始化游戏状态
    this.initGameState()

    // 连接WebSocket
    this.connectWebSocket()

    // 开始游戏循环
    this.startGameLoop()

    // 开始游戏时间计时
    this.startGameTimer()

    // 开始生成礼包和黑洞
    this.startSpawnTimers()
  },

  initCanvas() {
    // 获取画布上下文
    this.canvas = wx.createCanvasContext('gameCanvas')
    this.ctx = this.canvas

    // 设置画布样式
    this.ctx.setFillStyle('#2c3e50')
    this.ctx.fillRect(
      0,
      0,
      this.gameConfig.canvasWidth,
      this.gameConfig.canvasHeight
    )
    this.ctx.draw()
  },

  initGameState() {
    // 初始化蛇的位置
    const startX =
      Math.floor(this.gameConfig.canvasWidth / this.gameConfig.gridSize / 2) *
      this.gameConfig.gridSize
    const startY =
      Math.floor(this.gameConfig.canvasHeight / this.gameConfig.gridSize / 2) *
      this.gameConfig.gridSize

    this.snake = [
      { x: startX, y: startY },
      { x: startX - this.gameConfig.gridSize, y: startY },
      { x: startX - this.gameConfig.gridSize * 2, y: startY }
    ]

    this.direction = 'right'
    this.nextDirection = 'right'

    // 生成初始食物
    this.generateFood()

    // 初始化其他玩家
    this.otherPlayers = []

    // 初始化礼包和黑洞
    this.gifts = []
    this.blackHoles = []

    // 重置游戏数据
    this.setData({
      score: 0,
      snakeLength: 3,
      rank: 1,
      onlinePlayers: 0,
      isPaused: false,
      isGameOver: false,
      giftCount: 0,
      blackHoleCount: 0
    })
  },

  connectWebSocket() {
    // 模拟WebSocket连接
    // 实际项目中需要连接真实的WebSocket服务器
    console.log('连接WebSocket服务器...')

    // 模拟接收其他玩家数据
    this.simulateOtherPlayers()
  },

  simulateOtherPlayers() {
    // 模拟其他玩家数据
    setInterval(() => {
      const playerCount = Math.floor(Math.random() * 10) + 5
      this.otherPlayers = []

      for (let i = 0; i < playerCount; i++) {
        this.otherPlayers.push({
          id: `player_${i}`,
          name: `玩家${i + 1}`,
          snake: this.generateRandomSnake(),
          score: Math.floor(Math.random() * 5000) + 100,
          color: this.getRandomColor()
        })
      }

      // 更新在线玩家数量
      this.setData({
        onlinePlayers: playerCount + 1
      })

      // 更新排行榜
      this.updateRanking()
    }, 2000)
  },

  generateRandomSnake() {
    const snake = []
    const startX =
      Math.floor(
        Math.random() * (this.gameConfig.canvasWidth / this.gameConfig.gridSize)
      ) * this.gameConfig.gridSize
    const startY =
      Math.floor(
        Math.random() *
          (this.gameConfig.canvasHeight / this.gameConfig.gridSize)
      ) * this.gameConfig.gridSize
    const length = Math.floor(Math.random() * 5) + 3

    for (let i = 0; i < length; i++) {
      snake.push({
        x: startX - i * this.gameConfig.gridSize,
        y: startY
      })
    }

    return snake
  },

  getRandomColor() {
    const colors = [
      '#e74c3c',
      '#3498db',
      '#2ecc71',
      '#f39c12',
      '#9b59b6',
      '#1abc9c'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  },

  startGameLoop() {
    this.gameLoop = setInterval(() => {
      if (!this.data.isPaused && !this.data.isGameOver) {
        this.updateGame()
        this.renderGame()
      }
    }, this.gameConfig.gameSpeed)
  },

  updateGame() {
    // 更新蛇的方向
    this.direction = this.nextDirection

    // 移动蛇
    this.moveSnake()

    // 检查碰撞
    if (this.checkCollision()) {
      this.gameOver()
      return
    }

    // 检查是否吃到食物
    this.checkFoodCollision()

    // 检查是否吃到礼包
    this.checkGiftCollision()

    // 检查是否碰到黑洞
    this.checkBlackHoleCollision()

    // 发送位置更新到服务器
    this.sendPositionUpdate()
  },

  moveSnake() {
    const head = { ...this.snake[0] }

    // 根据方向移动蛇头
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

    // 边界检查（允许穿墙）
    if (head.x < 0) {
      head.x = this.gameConfig.canvasWidth - this.gameConfig.gridSize
    }
    if (head.x >= this.gameConfig.canvasWidth) head.x = 0
    if (head.y < 0) {
      head.y = this.gameConfig.canvasHeight - this.gameConfig.gridSize
    }
    if (head.y >= this.gameConfig.canvasHeight) head.y = 0

    // 在蛇头前添加新位置
    this.snake.unshift(head)

    // 移除蛇尾（除非吃到食物）
    if (!this.checkFoodCollision()) {
      this.snake.pop()
    }
  },

  checkCollision() {
    const head = this.snake[0]

    // 检查是否撞到自己
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true
      }
    }

    // 检查是否撞到其他玩家
    for (const player of this.otherPlayers) {
      for (const segment of player.snake) {
        if (head.x === segment.x && head.y === segment.y) {
          return true
        }
      }
    }

    return false
  },

  checkFoodCollision() {
    const head = this.snake[0]

    for (let i = 0; i < this.food.length; i++) {
      if (head.x === this.food[i].x && head.y === this.food[i].y) {
        // 吃到食物
        this.food.splice(i, 1)
        this.addScore(100)
        this.setData({
          snakeLength: this.snake.length
        })

        // 生成新食物
        this.generateFood()
        return true
      }
    }

    return false
  },

  checkGiftCollision() {
    const head = this.snake[0]

    for (let i = 0; i < this.gifts.length; i++) {
      if (head.x === this.gifts[i].x && head.y === this.gifts[i].y) {
        // 吃到礼包
        const gift = this.gifts.splice(i, 1)[0]
        this.addScore(gift.points)

        // 应用礼包效果
        this.applyGiftEffect(gift.type)

        this.setData({
          giftCount: this.gifts.length
        })
        return true
      }
    }

    return false
  },

  checkBlackHoleCollision() {
    const head = this.snake[0]

    for (let i = 0; i < this.blackHoles.length; i++) {
      if (head.x === this.blackHoles[i].x && head.y === this.blackHoles[i].y) {
        // 碰到黑洞
        this.gameOver()
        return true
      }
    }

    return false
  },

  generateFood() {
    while (this.food.length < 5) {
      const food = {
        x:
          Math.floor(
            Math.random() *
              (this.gameConfig.canvasWidth / this.gameConfig.gridSize)
          ) * this.gameConfig.gridSize,
        y:
          Math.floor(
            Math.random() *
              (this.gameConfig.canvasHeight / this.gameConfig.gridSize)
          ) * this.gameConfig.gridSize
      }

      // 检查是否与蛇身重叠
      let overlap = false
      for (const segment of this.snake) {
        if (food.x === segment.x && food.y === segment.y) {
          overlap = true
          break
        }
      }

      if (!overlap) {
        this.food.push(food)
      }
    }
  },

  startSpawnTimers() {
    // 礼包生成定时器
    setInterval(() => {
      if (this.gifts.length < this.gameConfig.maxGifts) {
        this.spawnGift()
      }
    }, this.gameConfig.giftSpawnInterval)

    // 黑洞生成定时器
    setInterval(() => {
      if (this.blackHoles.length < this.gameConfig.maxBlackHoles) {
        this.spawnBlackHole()
      }
    }, this.gameConfig.blackHoleSpawnInterval)
  },

  spawnGift() {
    const gift = {
      x:
        Math.floor(
          Math.random() *
            (this.gameConfig.canvasWidth / this.gameConfig.gridSize)
        ) * this.gameConfig.gridSize,
      y:
        Math.floor(
          Math.random() *
            (this.gameConfig.canvasHeight / this.gameConfig.gridSize)
        ) * this.gameConfig.gridSize,
      type: ['speed', 'shield', 'teleport', 'points'][
        Math.floor(Math.random() * 4)
      ],
      points: Math.floor(Math.random() * 500) + 200
    }

    this.gifts.push(gift)
    this.setData({
      giftCount: this.gifts.length
    })
  },

  spawnBlackHole() {
    const blackHole = {
      x:
        Math.floor(
          Math.random() *
            (this.gameConfig.canvasWidth / this.gameConfig.gridSize)
        ) * this.gameConfig.gridSize,
      y:
        Math.floor(
          Math.random() *
            (this.gameConfig.canvasHeight / this.gameConfig.gridSize)
        ) * this.gameConfig.gridSize
    }

    this.blackHoles.push(blackHole)
    this.setData({
      blackHoleCount: this.blackHoles.length
    })
  },

  applyGiftEffect(type) {
    switch (type) {
      case 'speed':
        // 临时加速
        this.temporarySpeedBoost()
        break
      case 'shield':
        // 临时护盾
        this.temporaryShield()
        break
      case 'teleport':
        // 随机传送
        this.randomTeleport()
        break
      case 'points':
        // 额外分数已在checkGiftCollision中处理
        break
    }
  },

  temporarySpeedBoost() {
    const originalSpeed = this.gameConfig.gameSpeed
    this.gameConfig.gameSpeed = originalSpeed / 2

    setTimeout(() => {
      this.gameConfig.gameSpeed = originalSpeed
    }, 5000)
  },

  temporaryShield() {
    // 实现护盾效果
    console.log('护盾激活')
  },

  randomTeleport() {
    const head = this.snake[0]
    head.x =
      Math.floor(
        Math.random() * (this.gameConfig.canvasWidth / this.gameConfig.gridSize)
      ) * this.gameConfig.gridSize
    head.y =
      Math.floor(
        Math.random() *
          (this.gameConfig.canvasHeight / this.gameConfig.gridSize)
      ) * this.gameConfig.gridSize
  },

  renderGame() {
    // 清空画布
    this.ctx.setFillStyle('#2c3e50')
    this.ctx.fillRect(
      0,
      0,
      this.gameConfig.canvasWidth,
      this.gameConfig.canvasHeight
    )

    // 绘制网格
    this.drawGrid()

    // 绘制食物
    this.drawFood()

    // 绘制礼包
    this.drawGifts()

    // 绘制黑洞
    this.drawBlackHoles()

    // 绘制其他玩家
    this.drawOtherPlayers()

    // 绘制自己的蛇
    this.drawSnake()

    // 更新画布
    this.ctx.draw()
  },

  drawGrid() {
    this.ctx.setStrokeStyle('#34495e')
    this.ctx.setLineWidth(1)

    for (
      let x = 0;
      x <= this.gameConfig.canvasWidth;
      x += this.gameConfig.gridSize
    ) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.gameConfig.canvasHeight)
      this.ctx.stroke()
    }

    for (
      let y = 0;
      y <= this.gameConfig.canvasHeight;
      y += this.gameConfig.gridSize
    ) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.gameConfig.canvasWidth, y)
      this.ctx.stroke()
    }
  },

  drawFood() {
    this.ctx.setFillStyle('#e74c3c')
    for (const food of this.food) {
      this.ctx.fillRect(
        food.x + 2,
        food.y + 2,
        this.gameConfig.gridSize - 4,
        this.gameConfig.gridSize - 4
      )
    }
  },

  drawGifts() {
    this.ctx.setFillStyle('#f39c12')
    for (const gift of this.gifts) {
      this.ctx.fillRect(
        gift.x + 1,
        gift.y + 1,
        this.gameConfig.gridSize - 2,
        this.gameConfig.gridSize - 2
      )
    }
  },

  drawBlackHoles() {
    this.ctx.setFillStyle('#000000')
    for (const blackHole of this.blackHoles) {
      this.ctx.beginPath()
      this.ctx.arc(
        blackHole.x + this.gameConfig.gridSize / 2,
        blackHole.y + this.gameConfig.gridSize / 2,
        this.gameConfig.gridSize / 2,
        0,
        2 * Math.PI
      )
      this.ctx.fill()
    }
  },

  drawOtherPlayers() {
    for (const player of this.otherPlayers) {
      this.ctx.setFillStyle(player.color)
      for (const segment of player.snake) {
        this.ctx.fillRect(
          segment.x + 1,
          segment.y + 1,
          this.gameConfig.gridSize - 2,
          this.gameConfig.gridSize - 2
        )
      }
    }
  },

  drawSnake() {
    // 绘制蛇身
    this.ctx.setFillStyle('#2ecc71')
    for (let i = 1; i < this.snake.length; i++) {
      this.ctx.fillRect(
        this.snake[i].x + 1,
        this.snake[i].y + 1,
        this.gameConfig.gridSize - 2,
        this.gameConfig.gridSize - 2
      )
    }

    // 绘制蛇头
    this.ctx.setFillStyle('#27ae60')
    this.ctx.fillRect(
      this.snake[0].x + 1,
      this.snake[0].y + 1,
      this.gameConfig.gridSize - 2,
      this.gameConfig.gridSize - 2
    )
  },

  // 控制方法
  moveUp() {
    if (this.direction !== 'down') {
      this.nextDirection = 'up'
    }
  },

  moveDown() {
    if (this.direction !== 'up') {
      this.nextDirection = 'down'
    }
  },

  moveLeft() {
    if (this.direction !== 'right') {
      this.nextDirection = 'left'
    }
  },

  moveRight() {
    if (this.direction !== 'left') {
      this.nextDirection = 'right'
    }
  },

  // 触摸控制
  onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  },

  onTouchMove(e) {
    e.preventDefault()
  },

  onTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchEndX - this.touchStartX
    const deltaY = touchEndY - this.touchStartY

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > 0) {
        this.moveRight()
      } else {
        this.moveLeft()
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        this.moveDown()
      } else {
        this.moveUp()
      }
    }
  },

  // 游戏控制
  pauseGame() {
    this.setData({
      isPaused: true
    })
  },

  resumeGame() {
    this.setData({
      isPaused: false
    })
  },

  gameOver() {
    this.setData({
      isGameOver: true
    })

    // 停止游戏循环
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }

    // 发送游戏结果到服务器
    this.sendGameResult()
  },

  restartGame() {
    this.cleanup()
    this.initGame()
  },

  quitGame() {
    this.cleanup()
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  backToHome() {
    this.cleanup()
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 功能按钮
  useSpeedBoost() {
    this.temporarySpeedBoost()
  },

  useShield() {
    this.temporaryShield()
  },

  useTeleport() {
    this.randomTeleport()
  },

  // 排行榜
  toggleRanking() {
    this.setData({
      showRanking: !this.data.showRanking
    })
  },

  updateRanking() {
    const allPlayers = [
      {
        id: 'current_player',
        name: app.globalData.userInfo ? app.globalData.userInfo.nickName : '我',
        score: this.data.score
      },
      ...this.otherPlayers.map(player => ({
        id: player.id,
        name: player.name,
        score: player.score
      }))
    ]

    // 按分数排序
    allPlayers.sort((a, b) => b.score - a.score)

    // 添加排名
    const rankingList = allPlayers.map((player, index) => ({
      ...player,
      rank: index + 1
    }))

    this.setData({
      rankingList: rankingList.slice(0, 10) // 只显示前10名
    })

    // 更新自己的排名
    const currentPlayer = rankingList.find(
      player => player.id === 'current_player'
    )
    if (currentPlayer) {
      this.setData({
        rank: currentPlayer.rank
      })
    }
  },

  // 聊天功能
  openChat() {
    wx.showToast({
      title: '聊天功能开发中',
      icon: 'none'
    })
  },

  // 工具方法
  addScore(points) {
    this.setData({
      score: this.data.score + points
    })
  },

  startGameTimer() {
    this.gameStartTime = Date.now()
    this.gameTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      this.setData({
        gameTime: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      })
    }, 1000)
  },

  sendPositionUpdate() {
    // 发送位置更新到服务器
    // 实际项目中需要实现WebSocket发送
  },

  sendGameResult() {
    // 发送游戏结果到服务器
    // 实际项目中需要实现WebSocket发送
  },

  cleanup() {
    // 清理资源
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }

    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
})
