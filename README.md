# 🐍 SnakeSnake - 多人在线贪食蛇大战

[![CI/CD](https://github.com/zsjohny/snakesnake/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/zsjohny/snakesnake/actions)
[![Test Coverage](https://codecov.io/gh/zsjohny/snakesnake/branch/main/graph/badge.svg)](https://codecov.io/gh/zsjohny/snakesnake)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/zsjohny/snakesnake/releases)

一款多人在线实时对战的贪食蛇游戏，支持实时排行榜、礼包系统、黑洞陷阱等丰富功能。

## ✨ 功能特色

### 🎮 核心游戏功能
- **多人在线对战**: 支持最多20人同时在线游戏
- **超大游戏区域**: 800x600像素的游戏画布，提供充足的游戏空间
- **实时位置显示**: 实时显示所有玩家的位置和移动轨迹
- **实时排行榜**: 游戏过程中实时更新排名，支持日榜、周榜、月榜、总榜

### 🎁 特殊道具系统
- **礼包系统**: 每10秒自动刷新礼包，包含加速、护盾、传送、积分等效果
- **黑洞陷阱**: 每15秒刷新黑洞，碰到即游戏结束，增加游戏挑战性
- **道具效果**: 
  - 加速道具：临时提升移动速度
  - 护盾道具：临时无敌状态
  - 传送道具：随机传送到地图任意位置
  - 积分道具：获得额外分数

### 🏆 成就系统
- **多样化成就**: 包含游戏次数、高分、蛇身长度等多种成就类型
- **进度追踪**: 实时显示成就完成进度
- **奖励机制**: 完成成就获得特殊标识和奖励

### 📊 数据统计
- **个人统计**: 总游戏数、总分数、最高分、胜率等详细统计
- **游戏历史**: 记录最近游戏记录，包含得分、排名、时长等信息
- **排行榜**: 多维度排行榜系统，支持分页加载

## 🎯 游戏玩法

### 基本操作
- **方向控制**: 点击方向按钮或滑动屏幕控制蛇的移动方向
- **穿墙机制**: 蛇可以穿过地图边界，从另一侧出现
- **碰撞检测**: 撞到自己或其他玩家身体即游戏结束

### 得分规则
- **基础得分**: 每吃一个食物得100分
- **礼包得分**: 收集礼包获得200-700分不等
- **长度增长**: 吃食物后蛇身长度增加

### 特殊机制
- **礼包刷新**: 每10秒在地图随机位置生成礼包
- **黑洞陷阱**: 每15秒生成黑洞，增加游戏难度
- **实时排名**: 根据当前分数实时计算排名

## 🛠️ 技术架构

### 前端技术
- **微信小程序**: 原生微信小程序开发
- **Canvas绘图**: 使用Canvas API实现游戏画面渲染
- **WebSocket**: 实时通信支持（需要后端服务器）

### 项目结构
```
SnakeSnake/
├── app.js                 # 小程序入口文件
├── app.json              # 小程序配置文件
├── app.wxss              # 全局样式文件
├── package.json          # 项目依赖配置
├── .eslintrc.js          # ESLint配置
├── tests/                # 测试文件目录
│   ├── setup.js          # 测试环境配置
│   ├── app.test.js       # App测试
│   └── game.test.js      # 游戏逻辑测试
├── .github/              # GitHub配置
│   ├── workflows/        # GitHub Actions
│   └── ISSUE_TEMPLATE/   # Issue模板
├── pages/                # 页面目录
│   ├── index/           # 首页
│   ├── game/            # 游戏页面
│   ├── rank/            # 排行榜页面
│   └── profile/         # 个人资料页面
├── images/              # 图片资源目录
└── project.config.json  # 项目配置文件
```

## 🚀 快速开始

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本
- 微信开发者工具
- Git
- Docker (可选，用于容器化开发)

### 安装步骤

#### 方法一：传统安装

1. **克隆项目**
   ```bash
   git clone https://github.com/zsjohny/snakesnake.git
   cd snakesnake
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置项目**
   - 在 `project.config.json` 中配置你的小程序AppID
   - 在 `app.js` 中配置WebSocket服务器地址

4. **运行测试**
   ```bash
   npm test
   ```

5. **代码检查**
   ```bash
   npm run lint
   ```

6. **打开项目**
   - 使用微信开发者工具打开项目
   - 编译运行即可体验

#### 方法二：自动化初始化

**Linux/macOS:**
```bash
git clone https://github.com/zsjohny/snakesnake.git
cd snakesnake
npm run init:linux  # 或 npm run init:macos
```

**Windows:**
```bash
git clone https://github.com/zsjohny/snakesnake.git
cd snakesnake
npm run init:windows
```

#### 方法三：Docker 容器化开发

```bash
git clone https://github.com/zsjohny/snakesnake.git
cd snakesnake
npm run docker:dev
```

详细说明请参考 [Docker使用指南](docs/docker-guide.md)

### 配置说明

```javascript
// app.js 中的配置项
globalData: {
  serverUrl: 'wss://your-websocket-server.com', // WebSocket服务器地址
  apiBaseUrl: 'https://your-api-server.com'     // API服务器地址
}
```

## 📱 页面说明

### 首页 (pages/index/index)
- 游戏介绍和特色展示
- 游戏统计数据展示
- 最近游戏记录
- 游戏公告信息

### 游戏页面 (pages/game/game)
- 游戏画布和渲染
- 实时状态显示（分数、长度、排名、在线人数）
- 方向控制按钮
- 功能道具按钮
- 实时排行榜面板

### 排行榜页面 (pages/rank/rank)
- 我的排名信息
- 多维度排行榜（日榜、周榜、月榜、总榜）
- 分页加载功能
- 排行榜规则说明

### 个人资料页面 (pages/profile/profile)
- 用户信息展示
- 游戏统计数据
- 成就系统
- 最近游戏记录
- 设置选项

## 🎨 界面设计

### 设计风格
- **现代简约**: 采用现代化的UI设计风格
- **渐变色彩**: 使用渐变色提升视觉效果
- **响应式布局**: 适配不同屏幕尺寸
- **动画效果**: 丰富的交互动画

### 色彩方案
- **主色调**: 蓝色系 (#3498db, #2980b9)
- **辅助色**: 绿色 (#2ecc71)、橙色 (#f39c12)、红色 (#e74c3c)
- **背景色**: 深色系 (#34495e, #2c3e50)
- **文字色**: 浅色系 (#ecf0f1, #95a5a6)

## 🔧 开发手册

### 开发环境搭建

1. **安装Node.js**
   ```bash
   # 使用nvm安装Node.js
   nvm install 18
   nvm use 18
   ```

2. **安装微信开发者工具**
   - 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
   - 注册微信小程序账号

3. **克隆项目**
   ```bash
   git clone https://github.com/your-username/snakesnake.git
   cd snakesnake
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

### 开发规范

#### 代码风格
- 使用ES6+语法
- 遵循ESLint规则
- 使用单引号
- 不使用分号
- 使用2个空格缩进

#### 文件命名
- 页面文件：小写字母，用连字符分隔
- 组件文件：PascalCase
- 工具函数：camelCase
- 常量：UPPER_SNAKE_CASE

#### 注释规范
```javascript
/**
 * 函数描述
 * @param {string} param1 - 参数1描述
 * @param {number} param2 - 参数2描述
 * @returns {boolean} 返回值描述
 */
function exampleFunction(param1, param2) {
  // 单行注释
  return true
}
```

### 测试指南

#### 运行测试
```bash
# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

#### 编写测试
```javascript
describe('功能模块测试', () => {
  beforeEach(() => {
    // 测试前的准备工作
  })

  test('应该正确执行某个功能', () => {
    // 测试逻辑
    expect(result).toBe(expected)
  })

  afterEach(() => {
    // 测试后的清理工作
  })
})
```

#### 测试覆盖率要求
- 总体覆盖率不低于80%
- 核心业务逻辑覆盖率不低于90%
- 新增功能必须包含测试

### 游戏引擎开发

#### 游戏循环
```javascript
// 游戏主循环
this.gameLoop = setInterval(() => {
  if (!this.data.isPaused && !this.data.isGameOver) {
    this.updateGame()
    this.renderGame()
  }
}, this.gameConfig.gameSpeed)
```

#### 碰撞检测
```javascript
// 检测蛇头与蛇身的碰撞
checkSelfCollision() {
  const head = this.snake[0]
  return this.snake.slice(1).some(segment => 
    head.x === segment.x && head.y === segment.y
  )
}
```

#### 状态管理
```javascript
// 更新游戏状态
updateGameState() {
  this.setData({
    score: this.score,
    snakeLength: this.snake.length,
    rank: this.currentRank
  })
}
```

### 性能优化

#### Canvas优化
- 只渲染可见区域
- 使用requestAnimationFrame
- 避免频繁的Canvas操作

#### 内存管理
- 及时清理定时器
- 释放不需要的事件监听
- 避免内存泄漏

#### 网络优化
- 使用WebSocket减少HTTP请求
- 实现断线重连机制
- 数据压缩传输

### 调试技巧

#### 微信开发者工具调试
1. 使用Console面板查看日志
2. 使用Sources面板调试JavaScript
3. 使用Network面板监控网络请求
4. 使用Storage面板查看存储数据

#### 真机调试
1. 在开发者工具中点击"预览"
2. 使用微信扫码在真机上测试
3. 使用vConsole查看真机日志

#### 性能监控
```javascript
// 性能监控
const startTime = Date.now()
// 执行操作
const endTime = Date.now()
console.log(`操作耗时: ${endTime - startTime}ms`)
```

## 📋 待开发功能

### 后端服务
- [ ] WebSocket服务器实现
- [ ] 用户认证系统
- [ ] 数据持久化存储
- [ ] 实时排行榜计算

### 游戏功能
- [ ] 聊天系统
- [ ] 好友系统
- [ ] 组队模式
- [ ] 自定义皮肤
- [ ] 更多道具类型

### 其他功能
- [ ] 音效系统
- [ ] 震动反馈
- [ ] 分享功能
- [ ] 广告系统

## 🤝 贡献指南

### 开发流程

1. **Fork项目**
   - 在GitHub上Fork本项目

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **开发功能**
   - 编写代码
   - 添加测试
   - 更新文档

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin feature/your-feature-name
   ```

5. **创建Pull Request**
   - 在GitHub上创建PR
   - 填写PR模板
   - 等待代码审查

### 代码审查

#### 审查重点
- 代码逻辑是否正确
- 性能是否有影响
- 安全性是否考虑
- 用户体验是否改善
- 向后兼容性是否保持

#### 审查流程
1. 自动检查（CI/CD）
2. 代码审查者审查
3. 功能测试
4. 合并代码

### 发布流程

#### 版本管理
- 使用语义化版本号
- 主版本号：不兼容的API修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

#### 发布步骤
1. 更新版本号
2. 更新CHANGELOG.md
3. 创建Release
4. 部署到生产环境

## 📚 相关文档

- [架构设计文档](docs/architecture.md) - 详细的系统架构和设计图
- [后端实现推荐](docs/backend-recommendations.md) - 推荐的开源后端解决方案
- [发布指南](docs/deployment-guide.md) - 测试版和正式版发布方法
- [Docker使用指南](docs/docker-guide.md) - Docker环境配置和使用
- [开发手册](README.md#开发手册) - 完整的开发指南

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- **开发者**: JohnyZheng
- **GitHub**: [@zsjohny](https://github.com/zsjohny)
- **邮箱**: zs.johny@163.com
- **项目主页**: [GitHub Repository](https://github.com/zsjohny/snakesnake)
- **问题反馈**: [Issues](https://github.com/zsjohny/snakesnake/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**注意**: 这是一个演示项目，WebSocket服务器和API服务器需要自行实现。当前版本使用模拟数据来展示功能。 