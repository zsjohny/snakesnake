@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM SnakeSnake 开发环境初始化脚本 (Windows)
REM 支持 Windows 10/11 系统

echo ================================
echo   SnakeSnake 开发环境初始化
echo ================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] 检测到管理员权限
) else (
    echo [WARNING] 未检测到管理员权限，某些功能可能受限
)

REM 检查 Node.js
echo [INFO] 检查 Node.js...
node --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [INFO] Node.js 已安装: !NODE_VERSION!
    
    REM 检查版本
    for /f "tokens=2 delims=v" %%i in ('node --version') do set NODE_MAJOR=%%i
    for /f "tokens=1 delims=." %%i in ("!NODE_MAJOR!") do set NODE_MAJOR=%%i
    if !NODE_MAJOR! geq 18 (
        echo [INFO] Node.js 版本满足要求 (^>= 18.0.0)
    ) else (
        echo [WARNING] Node.js 版本过低，建议升级到 18.0.0 或更高版本
    )
) else (
    echo [INFO] 正在安装 Node.js...
    echo [INFO] 请访问 https://nodejs.org/ 下载并安装 Node.js 18.x 或更高版本
    echo [INFO] 安装完成后请重新运行此脚本
    pause
    exit /b 1
)

REM 检查 npm
echo [INFO] 检查 npm...
npm --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [INFO] npm 已安装: !NPM_VERSION!
) else (
    echo [ERROR] npm 未安装，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查 Git
echo [INFO] 检查 Git...
git --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo [INFO] Git 已安装: !GIT_VERSION!
) else (
    echo [INFO] 正在安装 Git...
    echo [INFO] 请访问 https://git-scm.com/download/win 下载并安装 Git
    echo [INFO] 安装完成后请重新运行此脚本
    pause
    exit /b 1
)

REM 检查 Docker (可选)
echo [INFO] 检查 Docker...
docker --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo [INFO] Docker 已安装: !DOCKER_VERSION!
) else (
    echo [WARNING] Docker 未安装，是否安装? (Y/N)
    set /p DOCKER_CHOICE=
    if /i "!DOCKER_CHOICE!"=="Y" (
        echo [INFO] 正在安装 Docker...
        echo [INFO] 请访问 https://www.docker.com/products/docker-desktop 下载并安装 Docker Desktop
        echo [INFO] 安装完成后请重新运行此脚本
        pause
        exit /b 1
    ) else (
        echo [INFO] 跳过 Docker 安装
    )
)

REM 安装微信开发者工具
echo [INFO] 请手动安装微信开发者工具:
echo [INFO] 下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
echo [INFO] Windows 用户可以直接下载 .exe 文件安装
echo.

REM 安装项目依赖
echo [INFO] 正在安装项目依赖...
if exist "package.json" (
    npm install
    if !errorLevel! == 0 (
        echo [INFO] 项目依赖安装完成
    ) else (
        echo [ERROR] 项目依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo [ERROR] 未找到 package.json 文件
    pause
    exit /b 1
)

REM 创建配置文件
echo [INFO] 正在创建配置文件...

REM 创建 .env 文件
if not exist ".env" (
    (
        echo # SnakeSnake 环境配置
        echo NODE_ENV=development
        echo WECHAT_APPID=your-app-id-here
        echo API_BASE_URL=https://your-api-server.com
        echo WEBSOCKET_URL=wss://your-websocket-server.com
    ) > .env
    echo [INFO] 创建 .env 配置文件
)

REM 创建 .env.example 文件
if not exist ".env.example" (
    (
        echo # SnakeSnake 环境配置示例
        echo NODE_ENV=development
        echo WECHAT_APPID=your-app-id-here
        echo API_BASE_URL=https://your-api-server.com
        echo WEBSOCKET_URL=wss://your-websocket-server.com
    ) > .env.example
    echo [INFO] 创建 .env.example 配置文件
)

REM 运行测试
echo [INFO] 正在运行测试...
npm test
if !errorLevel! == 0 (
    echo [INFO] 测试通过
) else (
    echo [ERROR] 测试失败
    pause
    exit /b 1
)

REM 代码规范检查
echo [INFO] 正在检查代码规范...
npm run lint
if !errorLevel! == 0 (
    echo [INFO] 代码规范检查通过
) else (
    echo [WARNING] 代码规范检查发现问题，请查看详细信息
)

REM 显示完成信息
echo.
echo ================================
echo 🎉 开发环境初始化完成！
echo ================================
echo.
echo 下一步操作:
echo 1. 配置微信开发者工具
echo 2. 在 .env 文件中配置你的 AppID
echo 3. 运行 'npm run dev' 启动开发服务器
echo 4. 在微信开发者工具中导入项目
echo.
echo 常用命令:
echo npm test          - 运行测试
echo npm run lint      - 代码规范检查
echo npm run build     - 构建项目
echo npm run dev       - 启动开发服务器
echo.
echo 文档链接:
echo README.md                    - 项目介绍
echo docs/architecture.md         - 架构设计
echo docs/deployment-guide.md     - 发布指南
echo docs/backend-recommendations.md - 后端实现推荐
echo.
pause 