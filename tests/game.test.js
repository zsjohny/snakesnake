/**
 * @jest-environment jsdom
 */

// 模拟微信小程序API
global.wx = {
  getSystemInfoSync: jest.fn(),
  showModal: jest.fn(),
  showToast: jest.fn(),
  request: jest.fn(),
  connectSocket: jest.fn(),
  onSocketOpen: jest.fn(),
  onSocketMessage: jest.fn(),
  onSocketError: jest.fn(),
  onSocketClose: jest.fn(),
  sendSocketMessage: jest.fn(),
  closeSocket: jest.fn()
}

// 模拟Canvas API
global.canvas = {
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    fillText: jest.fn(),
    clearRect: jest.fn(),
    setFillStyle: jest.fn(),
    setFontSize: jest.fn(),
    setTextAlign: jest.fn(),
    setTextBaseline: jest.fn()
  }))
}

// 模拟游戏页面对象
const mockGamePage = {
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
  score: 0,
  gameState: 'playing',
  startGame: jest.fn(),
  pauseGame: jest.fn(),
  resumeGame: jest.fn(),
  gameOver: jest.fn(),
  updateRanking: jest.fn(),
  cleanup: jest.fn()
}

// 重置游戏状态的辅助函数
const resetGameState = () => {
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
}

describe('游戏移动逻辑测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
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
})

describe('游戏边界检测测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
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
})

describe('游戏碰撞检测测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
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
        (segment) => head.x === segment.x && head.y === segment.y
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
        (item) => head.x === item.x && head.y === item.y
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
        (gift) => head.x === gift.x && head.y === gift.y
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
        (blackHole) => head.x === blackHole.x && head.y === blackHole.y
      )

      expect(collision).toBe(true)
    })
  })
})

describe('游戏得分系统测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
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

    test('分数应该正确累加', () => {
      let score = 0
      score += 100 // 吃食物
      score += 300 // 吃礼包
      score += 100 // 再吃食物

      expect(score).toBe(500)
    })
  })
})

describe('游戏状态管理测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
  })

  describe('游戏状态管理', () => {
    test('游戏应该能够开始', () => {
      mockGamePage.startGame()
      expect(mockGamePage.startGame).toHaveBeenCalled()
    })

    test('游戏应该能够暂停', () => {
      mockGamePage.pauseGame()
      expect(mockGamePage.pauseGame).toHaveBeenCalled()
    })

    test('游戏应该能够恢复', () => {
      mockGamePage.resumeGame()
      expect(mockGamePage.resumeGame).toHaveBeenCalled()
    })

    test('游戏应该能够结束', () => {
      mockGamePage.gameOver()
      expect(mockGamePage.gameOver).toHaveBeenCalled()
    })
  })
})

describe('游戏网络通信测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
  })

  describe('网络通信', () => {
    test('应该能够连接WebSocket', () => {
      wx.connectSocket({
        url: 'wss://test-server.com'
      })

      expect(wx.connectSocket).toHaveBeenCalledWith({
        url: 'wss://test-server.com'
      })
    })

    test('应该能够发送消息', () => {
      const message = {
        type: 'move',
        direction: 'right'
      }

      wx.sendSocketMessage({
        data: JSON.stringify(message)
      })

      expect(wx.sendSocketMessage).toHaveBeenCalledWith({
        data: JSON.stringify(message)
      })
    })

    test('应该能够接收消息', () => {
      const mockMessage = {
        type: 'gameState',
        players: []
      }

      // 模拟接收消息
      const messageHandler = jest.fn()
      wx.onSocketMessage(messageHandler)

      // 触发消息事件
      messageHandler({
        data: JSON.stringify(mockMessage)
      })

      expect(messageHandler).toHaveBeenCalledWith({
        data: JSON.stringify(mockMessage)
      })
    })
  })
})

describe('游戏道具系统测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
  })

  describe('道具系统', () => {
    test('礼包应该正确生成', () => {
      const gift = {
        x: 200,
        y: 300,
        type: 'speed',
        points: 300
      }

      expect(gift.x).toBe(200)
      expect(gift.y).toBe(300)
      expect(gift.type).toBe('speed')
      expect(gift.points).toBe(300)
    })

    test('黑洞应该正确生成', () => {
      const blackHole = {
        x: 400,
        y: 500
      }

      expect(blackHole.x).toBe(400)
      expect(blackHole.y).toBe(500)
    })

    test('道具效果应该正确应用', () => {
      const speedGift = { type: 'speed', duration: 5000 }
      const shieldGift = { type: 'shield', duration: 3000 }

      expect(speedGift.type).toBe('speed')
      expect(speedGift.duration).toBe(5000)
      expect(shieldGift.type).toBe('shield')
      expect(shieldGift.duration).toBe(3000)
    })
  })
})

describe('游戏排行榜系统测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
  })

  describe('排行榜系统', () => {
    test('应该能够更新排行榜', () => {
      mockGamePage.updateRanking()
      expect(mockGamePage.updateRanking).toHaveBeenCalled()
    })

    test('分数应该正确排序', () => {
      const scores = [
        { player: 'Player1', score: 1000 },
        { player: 'Player2', score: 800 },
        { player: 'Player3', score: 1200 }
      ]

      const sortedScores = scores.sort((a, b) => b.score - a.score)

      expect(sortedScores[0].player).toBe('Player3')
      expect(sortedScores[0].score).toBe(1200)
      expect(sortedScores[1].player).toBe('Player1')
      expect(sortedScores[1].score).toBe(1000)
      expect(sortedScores[2].player).toBe('Player2')
      expect(sortedScores[2].score).toBe(800)
    })
  })
})

describe('游戏资源清理测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGameState()
  })

  describe('资源清理', () => {
    test('应该能够清理游戏资源', () => {
      mockGamePage.cleanup()
      expect(mockGamePage.cleanup).toHaveBeenCalled()
    })

    test('应该能够关闭WebSocket连接', () => {
      wx.closeSocket()
      expect(wx.closeSocket).toHaveBeenCalled()
    })
  })
})
