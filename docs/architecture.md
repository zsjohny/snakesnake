# 🏗️ SnakeSnake 架构设计文档

## 📋 目录

- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [核心设计图](#核心设计图)
- [数据流设计](#数据流设计)
- [模块设计](#模块设计)
- [部署架构](#部署架构)

## 🏛️ 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     SnakeSnake 系统架构                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   微信小程序端   │    │    WebSocket     │                │
│  │   (前端)        │◄──►│   服务器         │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   用户界面层     │    │   游戏逻辑层     │                │
│  │   (UI Layer)    │    │   (Game Logic)  │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   渲染引擎层     │    │   网络通信层     │                │
│  │  (Canvas API)   │    │  (WebSocket)    │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    后端服务层                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │ 用户认证服务 │ │ 游戏房间服务 │ │ 排行榜服务   │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │ 数据存储服务 │ │ 消息队列服务 │ │ 监控日志服务 │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                        表现层 (Presentation Layer)           │
├─────────────────────────────────────────────────────────────┤
│  • 微信小程序页面 (WXML/WXSS)                                │
│  • 用户交互处理                                              │
│  • 界面状态管理                                              │
├─────────────────────────────────────────────────────────────┤
│                        业务层 (Business Layer)               │
├─────────────────────────────────────────────────────────────┤
│  • 游戏逻辑引擎                                              │
│  • 碰撞检测算法                                              │
│  • 得分计算系统                                              │
│  • 排行榜算法                                                │
├─────────────────────────────────────────────────────────────┤
│                        服务层 (Service Layer)                │
├─────────────────────────────────────────────────────────────┤
│  • WebSocket通信服务                                         │
│  • 用户认证服务                                              │
│  • 数据持久化服务                                            │
│  • 实时消息服务                                              │
├─────────────────────────────────────────────────────────────┤
│                        数据层 (Data Layer)                   │
├─────────────────────────────────────────────────────────────┤
│  • 本地存储 (Storage)                                        │
│  • 远程数据库 (MongoDB/MySQL)                                │
│  • 缓存服务 (Redis)                                          │
│  • 文件存储 (OSS/COS)                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ 技术栈

### 前端技术栈

- **框架**: 微信小程序原生开发
- **渲染**: Canvas API
- **通信**: WebSocket
- **状态管理**: 小程序原生状态管理
- **样式**: WXSS (类似CSS)
- **模板**: WXML (类似HTML)

### 后端技术栈推荐

- **WebSocket服务器**: Socket.IO / ws
- **API服务器**: Express.js / Koa.js / Fastify
- **数据库**: MongoDB / MySQL / PostgreSQL
- **缓存**: Redis
- **消息队列**: RabbitMQ / Redis Pub/Sub
- **部署**: Docker + Kubernetes / 云服务

## 🎨 核心设计图

### 游戏流程图

```mermaid
graph TD
    A[用户启动小程序] --> B[初始化游戏]
    B --> C[连接WebSocket服务器]
    C --> D{连接成功?}
    D -->|是| E[进入游戏大厅]
    D -->|否| F[显示错误信息]
    E --> G[选择游戏模式]
    G --> H[加入游戏房间]
    H --> I[等待其他玩家]
    I --> J[游戏开始]
    J --> K[游戏循环]
    K --> L{游戏结束?}
    L -->|否| M[更新游戏状态]
    M --> N[发送状态到服务器]
    N --> O[接收其他玩家状态]
    O --> P[渲染游戏画面]
    P --> K
    L -->|是| Q[计算最终得分]
    Q --> R[更新排行榜]
    R --> S[显示游戏结果]
    S --> T{继续游戏?}
    T -->|是| G
    T -->|否| U[返回大厅]
```

### 详细游戏循环图

```mermaid
graph TD
    A[游戏循环开始] --> B[处理用户输入]
    B --> C[更新蛇的位置]
    C --> D[检查碰撞检测]
    D --> E{发生碰撞?}
    E -->|是| F[游戏结束处理]
    E -->|否| G[检查食物收集]
    G --> H{吃到食物?}
    H -->|是| I[增加分数和长度]
    H -->|否| J[检查礼包收集]
    I --> J
    J --> K{收集礼包?}
    K -->|是| L[应用礼包效果]
    K -->|否| M[检查黑洞碰撞]
    L --> M
    M --> N{碰到黑洞?}
    N -->|是| F
    N -->|否| O[更新游戏状态]
    O --> P[发送状态到服务器]
    P --> Q[接收其他玩家状态]
    Q --> R[渲染游戏画面]
    R --> S[等待下一帧]
    S --> A
    F --> T[保存游戏记录]
    T --> U[更新排行榜]
    U --> V[显示结果界面]
```

### 数据流图

```mermaid
sequenceDiagram
    participant Client as 小程序客户端
    participant WS as WebSocket服务器
    participant Game as 游戏逻辑服务
    participant DB as 数据库
    participant Cache as 缓存服务

    Client->>WS: 连接请求
    WS->>Client: 连接确认
    Client->>WS: 加入房间
    WS->>Game: 创建游戏房间
    Game->>DB: 保存房间信息
    Game->>Cache: 缓存房间状态
    WS->>Client: 房间加入成功

    loop 游戏进行中
        Client->>WS: 发送移动指令
        WS->>Game: 处理移动逻辑
        Game->>Cache: 更新游戏状态
        Game->>WS: 广播游戏状态
        WS->>Client: 接收其他玩家状态
        Client->>Client: 渲染游戏画面
    end

    Game->>DB: 保存游戏结果
    Game->>Cache: 更新排行榜
    WS->>Client: 发送游戏结果
```

### 详细数据交互图

```mermaid
sequenceDiagram
    participant User as 用户
    participant UI as 用户界面
    participant Game as 游戏引擎
    participant Network as 网络层
    participant Server as 服务器
    participant DB as 数据库

    User->>UI: 点击开始游戏
    UI->>Game: 初始化游戏
    Game->>Network: 连接服务器
    Network->>Server: WebSocket连接
    Server->>DB: 查询用户信息
    DB->>Server: 返回用户数据
    Server->>Network: 连接成功
    Network->>Game: 连接确认

    loop 游戏进行
        User->>UI: 方向控制
        UI->>Game: 更新方向
        Game->>Network: 发送移动数据
        Network->>Server: 处理移动
        Server->>Server: 更新游戏状态
        Server->>Network: 广播状态
        Network->>Game: 接收状态
        Game->>UI: 更新画面
        UI->>User: 显示游戏画面
    end

    Game->>Network: 游戏结束
    Network->>Server: 保存结果
    Server->>DB: 更新排行榜
    DB->>Server: 确认更新
    Server->>Network: 返回结果
    Network->>Game: 显示结果
    Game->>UI: 更新界面
    UI->>User: 显示游戏结果
```

### 组件关系图

```
┌─────────────────────────────────────────────────────────────┐
│                    SnakeSnake 组件架构                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │     App.js      │    │   Global Data   │                │
│  │   (应用入口)     │◄──►│   (全局数据)     │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    页面组件                              │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │   Index     │ │    Game     │ │    Rank     │       │ │
│  │  │  (首页)     │ │   (游戏)    │ │  (排行榜)   │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │  ┌─────────────┐                                       │ │
│  │  │   Profile   │                                       │ │
│  │  │ (个人资料)   │                                       │ │
│  │  └─────────────┘                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    游戏引擎                              │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │ Game Loop   │ │ Collision   │ │ Render      │       │ │
│  │  │ (游戏循环)   │ │ Detection   │ │ (渲染引擎)   │       │ │
│  │  │             │ │ (碰撞检测)   │ │ (渲染引擎)   │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │ Score       │ │ Ranking     │ │ Network     │       │ │
│  │  │ System      │ │ System      │ │ Manager     │       │ │
│  │  │ (得分系统)   │ │ (排行榜)    │ │ (网络管理)   │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  └─────────────────────────────────────────────────────────┘ │
```

### 详细组件架构图

```mermaid
graph TB
    subgraph "表现层 (Presentation Layer)"
        A[App.js] --> B[Index页面]
        A --> C[Game页面]
        A --> D[Rank页面]
        A --> E[Profile页面]
    end

    subgraph "业务层 (Business Layer)"
        F[游戏引擎] --> G[游戏循环]
        F --> H[碰撞检测]
        F --> I[得分系统]
        F --> J[排行榜系统]
        F --> K[道具系统]
    end

    subgraph "服务层 (Service Layer)"
        L[网络服务] --> M[WebSocket连接]
        L --> N[API请求]
        L --> O[数据同步]
    end

    subgraph "数据层 (Data Layer)"
        P[本地存储] --> Q[用户设置]
        P --> R[游戏缓存]
        S[远程数据] --> T[用户信息]
        S --> U[排行榜数据]
        S --> V[游戏记录]
    end

    B --> F
    C --> F
    D --> L
    E --> L
    F --> L
    L --> S
    F --> P
```

### 网络通信架构图

```mermaid
graph LR
    subgraph "客户端"
        A[微信小程序]
        B[Canvas渲染]
        C[用户输入]
        D[本地状态]
    end

    subgraph "网络层"
        E[WebSocket连接]
        F[消息队列]
        G[断线重连]
    end

    subgraph "服务器端"
        H[WebSocket服务器]
        I[游戏逻辑服务]
        J[房间管理]
        K[排行榜服务]
    end

    subgraph "数据存储"
        L[MongoDB]
        M[Redis缓存]
        N[文件存储]
    end

    A --> E
    B --> A
    C --> A
    D --> A
    E --> F
    F --> G
    E --> H
    H --> I
    I --> J
    I --> K
    J --> L
    K --> M
    I --> M
```

### 游戏状态机图

```mermaid
stateDiagram-v2
    [*] --> 初始化
    初始化 --> 连接中: 启动应用
    连接中 --> 已连接: 连接成功
    连接中 --> 连接失败: 连接失败
    连接失败 --> 连接中: 重试
    已连接 --> 大厅: 进入大厅
    大厅 --> 匹配中: 开始匹配
    匹配中 --> 游戏中: 匹配成功
    匹配中 --> 大厅: 取消匹配
    游戏中 --> 游戏结束: 游戏结束
    游戏结束 --> 大厅: 返回大厅
    游戏结束 --> 匹配中: 再来一局
    大厅 --> 已连接: 断开连接
    已连接 --> [*]: 退出应用
```

### 性能监控架构图

```mermaid
graph TD
    A[游戏客户端] --> B[性能监控]
    B --> C[FPS监控]
    B --> D[内存监控]
    B --> E[网络延迟]
    B --> F[错误日志]

    C --> G[性能数据收集]
    D --> G
    E --> G
    F --> G

    G --> H[数据上报]
    H --> I[监控服务器]
    I --> J[数据分析]
    J --> K[性能报告]
    J --> L[告警系统]
```

### 数据库设计图

```mermaid
erDiagram
    USER {
        string id PK
        string openid
        string nickname
        string avatar_url
        int total_score
        int total_games
        int best_score
        datetime created_at
        datetime updated_at
    }

    GAME_ROOM {
        string id PK
        string room_name
        int max_players
        int current_players
        string status
        datetime created_at
        datetime started_at
        datetime ended_at
    }

    GAME_SESSION {
        string id PK
        string room_id FK
        string user_id FK
        int score
        int snake_length
        int rank
        string game_data
        datetime created_at
    }

    LEADERBOARD {
        string id PK
        string user_id FK
        string period_type
        int score
        int rank
        datetime period_start
        datetime period_end
    }

    ACHIEVEMENT {
        string id PK
        string user_id FK
        string achievement_type
        string title
        string description
        int progress
        int target
        boolean completed
        datetime completed_at
    }

    USER ||--o{ GAME_SESSION : "participates"
    GAME_ROOM ||--o{ GAME_SESSION : "contains"
    USER ||--o{ LEADERBOARD : "ranked_in"
    USER ||--o{ ACHIEVEMENT : "has"
```

## 🔄 数据流设计

### 实时数据流

```
客户端 ←→ WebSocket服务器 ←→ 游戏逻辑服务 ←→ 数据存储
   ↑              ↑              ↑              ↑
   │              │              │              │
   ▼              ▼              ▼              ▼
本地缓存     消息队列        业务逻辑        持久化存储
```

### 数据同步策略

1. **状态同步**: 游戏状态通过WebSocket实时同步
2. **增量更新**: 只传输变化的数据，减少网络开销
3. **冲突解决**: 服务器权威，客户端状态以服务器为准
4. **断线重连**: 支持断线重连，恢复游戏状态

## 🧩 模块设计

### 核心模块

#### 1. 游戏引擎模块

- **职责**: 游戏逻辑处理、状态管理
- **接口**:
  - `initGame()`: 初始化游戏
  - `updateGame()`: 更新游戏状态
  - `renderGame()`: 渲染游戏画面
  - `handleInput()`: 处理用户输入

#### 2. 网络通信模块

- **职责**: WebSocket连接管理、消息处理
- **接口**:
  - `connect()`: 建立连接
  - `sendMessage()`: 发送消息
  - `onMessage()`: 接收消息
  - `disconnect()`: 断开连接

#### 3. 排行榜模块

- **职责**: 分数计算、排名更新
- **接口**:
  - `updateScore()`: 更新分数
  - `getRanking()`: 获取排名
  - `getLeaderboard()`: 获取排行榜

#### 4. 成就系统模块

- **职责**: 成就检测、进度跟踪
- **接口**:
  - `checkAchievement()`: 检查成就
  - `updateProgress()`: 更新进度
  - `getAchievements()`: 获取成就列表

### 模块依赖关系

```
App.js
├── GameEngine
│   ├── CollisionDetector
│   ├── ScoreCalculator
│   └── StateManager
├── NetworkManager
│   ├── WebSocketClient
│   └── MessageHandler
├── RankingSystem
│   ├── ScoreTracker
│   └── LeaderboardManager
└── AchievementSystem
    ├── AchievementChecker
    └── ProgressTracker
```

## 🚀 部署架构

### 开发环境

```
┌─────────────────┐    ┌─────────────────┐
│  微信开发者工具   │    │   本地服务器     │
│   (前端调试)     │◄──►│   (后端开发)     │
└─────────────────┘    └─────────────────┘
```

### 测试环境

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   测试小程序     │    │   测试服务器     │    │   测试数据库     │
│   (Staging)     │◄──►│   (Test API)    │◄──►│   (Test DB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 生产环境

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   生产小程序     │    │   负载均衡器     │    │   应用服务器集群  │
│   (Production)  │◄──►│   (Nginx/LB)    │◄──►│   (App Servers) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │   数据库集群     │
                                              │   (DB Cluster)  │
                                              └─────────────────┘
```

## 📊 性能指标

### 目标性能

- **响应时间**: < 100ms
- **并发用户**: 1000+
- **游戏延迟**: < 50ms
- **可用性**: 99.9%

### 监控指标

- **服务器性能**: CPU、内存、网络
- **游戏性能**: FPS、延迟、丢包率
- **用户体验**: 加载时间、响应时间
- **业务指标**: 在线用户数、游戏局数

## 🔒 安全设计

### 安全措施

1. **用户认证**: 微信授权登录
2. **数据验证**: 服务器端数据验证
3. **防作弊**: 服务器权威验证
4. **数据加密**: 敏感数据加密存储
5. **访问控制**: 基于角色的权限控制

### 安全架构

```
客户端 ←→ HTTPS/WSS ←→ 网关 ←→ 应用服务 ←→ 数据库
   ↑         ↑         ↑         ↑         ↑
   │         │         │         │         │
   ▼         ▼         ▼         ▼         ▼
本地验证   传输加密   访问控制   业务验证   数据加密
```

---

**注意**: 本文档描述了SnakeSnake项目的整体架构设计，为开发团队提供技术指导。
