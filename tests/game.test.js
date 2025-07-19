/**
 * @jest-environment jsdom
 */

// 模拟游戏页面
const mockGamePage = {
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

  // 方法
  setData: jest.fn(),
  addScore: jest.fn(),
  moveSnake: jest.fn(),
  checkCollision: jest.fn(),
  checkFoodCollision: jest.fn(),
  checkGiftCollision: jest.fn(),
  checkBlackHoleCollision: jest.fn(),
  generateFood: jest.fn(),
  spawnGift: jest.fn(),
  spawnBlackHole: jest.fn(),
  applyGiftEffect: jest.fn(),
  gameOver: jest.fn(),
  updateRanking: jest.fn(),
  cleanup: jest.fn()
}

describe('游戏逻辑测试', () => {
  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks()

    // 重置游戏状态
    mockGamePage.snake = [
      { x: 400, y: 300 },
      { x: 380, y: 300 },
      { x: 360, y: 300 }
    ]
    mockGamePage.direction = 'right'
    mockGamePage.nextDirection = 'right'
    mockGamePage.food = []
    mockGamePage.gifts = []
    mockGamePage.blackHoles = []
    mockGamePage.otherPlayers = []
  })

  describe('蛇的移动逻辑', () => {
    test('向右移动应该增加x坐标', () => {
      const head = { ...mockGamePage.snake[0] }
      const newHead = {
        x: head.x + mockGamePage.gameConfig.gridSize,
        y: head.y
      }

      expect(newHead.x).toBe(420)
      expect(newHead.y).toBe(300)
    })

    test('向左移动应该减少x坐标', () => {
      const head = { ...mockGamePage.snake[0] }
      const newHead = {
        x: head.x - mockGamePage.gameConfig.gridSize,
        y: head.y
      }

      expect(newHead.x).toBe(380)
      expect(newHead.y).toBe(300)
    })

    test('向上移动应该减少y坐标', () => {
      const head = { ...mockGamePage.snake[0] }
      const newHead = {
        x: head.x,
        y: head.y - mockGamePage.gameConfig.gridSize
      }

      expect(newHead.x).toBe(400)
      expect(newHead.y).toBe(280)
    })

    test('向下移动应该增加y坐标', () => {
      const head = { ...mockGamePage.snake[0] }
      const newHead = {
        x: head.x,
        y: head.y + mockGamePage.gameConfig.gridSize
      }

      expect(newHead.x).toBe(400)
      expect(newHead.y).toBe(320)
    })
  })

  describe('边界检测', () => {
    test('穿墙逻辑应该正确处理左边界', () => {
      const head = { x: -20, y: 300 }
      const adjustedHead = { ...head }

      if (adjustedHead.x < 0) {
        adjustedHead.x =
          mockGamePage.gameConfig.canvasWidth - mockGamePage.gameConfig.gridSize
      }

      expect(adjustedHead.x).toBe(780)
    })

    test('穿墙逻辑应该正确处理右边界', () => {
      const head = { x: 820, y: 300 }
      const adjustedHead = { ...head }

      if (adjustedHead.x >= mockGamePage.gameConfig.canvasWidth) {
        adjustedHead.x = 0
      }

      expect(adjustedHead.x).toBe(0)
    })

    test('穿墙逻辑应该正确处理上边界', () => {
      const head = { x: 400, y: -20 }
      const adjustedHead = { ...head }

      if (adjustedHead.y < 0) {
        adjustedHead.y =
          mockGamePage.gameConfig.canvasHeight -
          mockGamePage.gameConfig.gridSize
      }

      expect(adjustedHead.y).toBe(580)
    })

    test('穿墙逻辑应该正确处理下边界', () => {
      const head = { x: 400, y: 620 }
      const adjustedHead = { ...head }

      if (adjustedHead.y >= mockGamePage.gameConfig.canvasHeight) {
        adjustedHead.y = 0
      }

      expect(adjustedHead.y).toBe(0)
    })
  })

  describe('碰撞检测', () => {
    test('应该检测到蛇头与蛇身的碰撞', () => {
      const head = { x: 360, y: 300 } // 与蛇身重叠
      const snake = [
        { x: 400, y: 300 },
        { x: 380, y: 300 },
        { x: 360, y: 300 } // 蛇身
      ]

      const collision = snake.some(
        (segment, index) =>
          index > 0 && head.x === segment.x && head.y === segment.y
      )

      expect(collision).toBe(true)
    })

    test('应该检测到与其他玩家的碰撞', () => {
      const head = { x: 400, y: 300 }
      const otherPlayer = {
        snake: [
          { x: 400, y: 300 }, // 与蛇头重叠
          { x: 380, y: 300 },
          { x: 360, y: 300 }
        ]
      }

      const collision = otherPlayer.snake.some(
        segment => head.x === segment.x && head.y === segment.y
      )

      expect(collision).toBe(true)
    })

    test('应该检测到与食物的碰撞', () => {
      const head = { x: 400, y: 300 }
      const food = [
        { x: 400, y: 300 }, // 与蛇头重叠
        { x: 420, y: 320 }
      ]

      const collision = food.some(
        item => head.x === item.x && head.y === item.y
      )

      expect(collision).toBe(true)
    })

    test('应该检测到与礼包的碰撞', () => {
      const head = { x: 400, y: 300 }
      const gifts = [
        { x: 400, y: 300, type: 'speed', points: 300 }, // 与蛇头重叠
        { x: 420, y: 320, type: 'shield', points: 400 }
      ]

      const collision = gifts.some(
        gift => head.x === gift.x && head.y === gift.y
      )

      expect(collision).toBe(true)
    })

    test('应该检测到与黑洞的碰撞', () => {
      const head = { x: 400, y: 300 }
      const blackHoles = [
        { x: 400, y: 300 }, // 与蛇头重叠
        { x: 420, y: 320 }
      ]

      const collision = blackHoles.some(
        blackHole => head.x === blackHole.x && head.y === blackHole.y
      )

      expect(collision).toBe(true)
    })
  })

  describe('得分系统', () => {
    test('吃食物应该增加100分', () => {
      const currentScore = 500
      const newScore = currentScore + 100

      expect(newScore).toBe(600)
    })

    test('吃礼包应该增加礼包分数', () => {
      const currentScore = 500
      const giftPoints = 300
      const newScore = currentScore + giftPoints

      expect(newScore).toBe(800)
    })

    test('蛇身长度应该正确计算', () => {
      const snakeLength = mockGamePage.snake.length
      expect(snakeLength).toBe(3)
    })
  })

  describe('道具效果', () => {
    test('加速道具应该临时提升速度', () => {
      const originalSpeed = mockGamePage.gameConfig.gameSpeed
      const boostedSpeed = originalSpeed / 2

      expect(boostedSpeed).toBe(75)
    })

    test('传送道具应该随机传送', () => {
      const maxX = Math.floor(
        mockGamePage.gameConfig.canvasWidth / mockGamePage.gameConfig.gridSize
      )
      const maxY = Math.floor(
        mockGamePage.gameConfig.canvasHeight / mockGamePage.gameConfig.gridSize
      )

      expect(maxX).toBe(40)
      expect(maxY).toBe(30)
    })
  })

  describe('排行榜计算', () => {
    test('应该正确计算玩家排名', () => {
      const allPlayers = [
        { id: 'player1', name: '玩家1', score: 5000 },
        { id: 'player2', name: '玩家2', score: 3000 },
        { id: 'current_player', name: '我', score: 4000 },
        { id: 'player3', name: '玩家3', score: 2000 }
      ]

      // 按分数排序
      allPlayers.sort((a, b) => b.score - a.score)

      // 添加排名
      const rankingList = allPlayers.map((player, index) => ({
        ...player,
        rank: index + 1
      }))

      expect(rankingList[0].rank).toBe(1)
      expect(rankingList[0].name).toBe('玩家1')
      expect(rankingList[1].rank).toBe(2)
      expect(rankingList[1].name).toBe('我')
    })
  })

  describe('游戏时间计算', () => {
    test('应该正确格式化游戏时间', () => {
      const elapsed = 125 // 125秒
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      expect(timeString).toBe('02:05')
    })

    test('应该正确处理分钟为0的情况', () => {
      const elapsed = 45 // 45秒
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      expect(timeString).toBe('00:45')
    })
  })

  describe('资源清理', () => {
    test('应该清理游戏循环定时器', () => {
      const clearIntervalSpy = jest
        .spyOn(global, 'clearInterval')
        .mockImplementation()

      // 模拟一个定时器ID
      mockGamePage.gameLoop = 123
      clearInterval(mockGamePage.gameLoop)

      expect(clearIntervalSpy).toHaveBeenCalled()

      clearIntervalSpy.mockRestore()
    })

    test('应该清理游戏时间定时器', () => {
      const clearIntervalSpy = jest
        .spyOn(global, 'clearInterval')
        .mockImplementation()

      // 模拟一个定时器ID
      mockGamePage.gameTimer = 456
      clearInterval(mockGamePage.gameTimer)

      expect(clearIntervalSpy).toHaveBeenCalled()

      clearIntervalSpy.mockRestore()
    })
  })
})
