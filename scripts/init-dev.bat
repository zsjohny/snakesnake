@echo off
REM SnakeSnake 开发环境初始化脚本
REM 支持 Windows 系统
REM 作者: JohnyZheng <zs.johny@163.com>

setlocal enabledelayedexpansion

REM 设置颜色代码
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "PURPLE=[95m"
set "CYAN=[96m"
set "NC=[0m"

REM 打印带颜色的消息
:print_message
echo %GREEN%[INFO]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_step
echo %CYAN%[STEP]%NC% %~1
goto :eof

:print_header
echo %BLUE%================================%NC%
echo %BLUE%  SnakeSnake 开发环境初始化%NC%
echo %BLUE%================================%NC%
goto :eof

REM 检查命令是否存在
:command_exists
where %1 >nul 2>&1
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)

REM 检查版本是否满足要求
:check_version
set "current_version=%~1"
set "required_version=%~2"
set "tool_name=%~3"

REM 简单的版本比较（仅支持主版本号）
for /f "tokens=1 delims=." %%a in ("%current_version%") do set "current_major=%%a"
for /f "tokens=1 delims=." %%a in ("%required_version%") do set "required_major=%%a"

if %current_major% geq %required_major% (
    call :print_message "%tool_name% 版本满足要求: %current_version% >= %required_version%"
    exit /b 0
) else (
    call :print_warning "%tool_name% 版本过低: %current_version% < %required_version%"
    exit /b 1
)

REM 检查 Node.js
:install_nodejs
call :print_step "检查 Node.js..."
call :command_exists node
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set "NODE_VERSION=%%i"
    set "NODE_VERSION=!NODE_VERSION:v=!"
    call :print_message "Node.js 已安装: v!NODE_VERSION!"
    
    call :check_version "!NODE_VERSION!" "18.0.0" "Node.js"
    if %errorlevel% neq 0 (
        call :print_warning "建议升级 Node.js 到 18.0.0 或更高版本"
        set /p "response=是否继续使用当前版本? (y/n): "
        if /i not "!response!"=="y" (
            call :print_message "请手动升级 Node.js 后重新运行脚本"
            exit /b 1
        )
    )
) else (
    call :print_message "正在安装 Node.js..."
    call :print_message "请访问 https://nodejs.org/ 下载并安装 Node.js 18.x 或更高版本"
    call :print_message "安装完成后重新运行此脚本"
    pause
    exit /b 1
)
goto :eof

REM 检查 npm
:install_npm
call :print_step "检查 npm..."
call :command_exists npm
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set "NPM_VERSION=%%i"
    call :print_message "npm 已安装: !NPM_VERSION!"
    
    call :check_version "!NPM_VERSION!" "8.0.0" "npm"
    if %errorlevel% neq 0 (
        call :print_warning "npm 版本较低，建议升级"
    )
) else (
    call :print_error "npm 未安装，请先安装 Node.js"
    exit /b 1
)
goto :eof

REM 检查 Git
:install_git
call :print_step "检查 Git..."
call :command_exists git
if %errorlevel% equ 0 (
    for /f "tokens=3" %%i in ('git --version') do set "GIT_VERSION=%%i"
    call :print_message "Git 已安装: !GIT_VERSION!"
) else (
    call :print_message "正在安装 Git..."
    call :print_message "请访问 https://git-scm.com/ 下载并安装 Git"
    call :print_message "安装完成后重新运行此脚本"
    pause
    exit /b 1
)
goto :eof

REM 检查 Docker
:install_docker
call :print_step "检查 Docker..."
call :command_exists docker
if %errorlevel% equ 0 (
    for /f "tokens=3 delims=," %%i in ('docker --version') do set "DOCKER_VERSION=%%i"
    call :print_message "Docker 已安装: !DOCKER_VERSION!"
) else (
    call :print_warning "Docker 未安装，是否安装? (y/n)"
    set /p "response=请输入选择: "
    if /i "!response!"=="y" (
        call :print_message "正在安装 Docker..."
        call :print_message "请访问 https://www.docker.com/products/docker-desktop 下载并安装 Docker Desktop"
        call :print_message "安装完成后重新运行此脚本"
        pause
    ) else (
        call :print_message "跳过 Docker 安装"
    )
)
goto :eof

REM 创建配置文件
:create_config_files
call :print_step "创建配置文件..."

REM 创建 .env 文件
if not exist ".env" (
    (
        echo # SnakeSnake 环境配置
        echo NODE_ENV=development
        echo WECHAT_APPID=your-app-id-here
        echo SERVER_URL=wss://your-websocket-server.com
        echo API_BASE_URL=https://your-api-server.com
    ) > .env
    call :print_message "创建 .env 配置文件"
) else (
    call :print_message ".env 文件已存在"
)

REM 创建 .gitignore 文件
if not exist ".gitignore" (
    (
        echo # 依赖
        echo node_modules/
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # 环境配置
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # 构建输出
        echo dist/
        echo build/
        echo.
        echo # 日志
        echo logs/
        echo *.log
        echo.
        echo # 运行时数据
        echo pids/
        echo *.pid
        echo *.seed
        echo *.pid.lock
        echo.
        echo # 覆盖率目录
        echo coverage/
        echo .nyc_output/
        echo.
        echo # 编辑器
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo *~
        echo.
        echo # 操作系统
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # 微信开发者工具
        echo .idea/
        echo .vscode/
    ) > .gitignore
    call :print_message "创建 .gitignore 文件"
) else (
    call :print_message ".gitignore 文件已存在"
)
goto :eof

REM 安装项目依赖
:install_dependencies
call :print_step "安装项目依赖..."

if exist "package.json" (
    call :print_message "正在安装 npm 依赖..."
    call npm install
    if %errorlevel% neq 0 (
        call :print_error "npm 安装失败"
        exit /b 1
    )
    
    call :print_message "正在安装开发依赖..."
    call npm install --save-dev
    if %errorlevel% neq 0 (
        call :print_warning "开发依赖安装失败，但继续执行"
    )
    
    call :print_success "项目依赖安装完成"
) else (
    call :print_error "未找到 package.json 文件"
    exit /b 1
)
goto :eof

REM 检查项目结构
:check_project_structure
call :print_step "检查项目结构..."

set "missing_files="
set "missing_dirs="

REM 检查必需文件
if not exist "app.js" set "missing_files=!missing_files! app.js"
if not exist "app.json" set "missing_files=!missing_files! app.json"
if not exist "app.wxss" set "missing_files=!missing_files! app.wxss"
if not exist "package.json" set "missing_files=!missing_files! package.json"
if not exist "project.config.json" set "missing_files=!missing_files! project.config.json"

REM 检查必需目录
if not exist "pages" set "missing_dirs=!missing_dirs! pages"
if not exist "images" set "missing_dirs=!missing_dirs! images"
if not exist "docs" set "missing_dirs=!missing_dirs! docs"
if not exist "scripts" set "missing_dirs=!missing_dirs! scripts"
if not exist "tests" set "missing_dirs=!missing_dirs! tests"

if "!missing_files!"=="" if "!missing_dirs!"=="" (
    call :print_success "项目结构完整"
) else (
    call :print_warning "项目结构不完整:"
    if not "!missing_files!"=="" (
        call :print_warning "缺少文件: !missing_files!"
    )
    if not "!missing_dirs!"=="" (
        call :print_warning "缺少目录: !missing_dirs!"
    )
)
goto :eof

REM 运行测试
:run_tests
call :print_step "运行测试..."

call npm test
if %errorlevel% equ 0 (
    call :print_success "测试通过"
) else (
    call :print_error "测试失败"
    call :print_warning "是否继续? (y/n)"
    set /p "response=请输入选择: "
    if /i not "!response!"=="y" (
        exit /b 1
    )
)
goto :eof

REM 运行代码检查
:run_lint
call :print_step "运行代码检查..."

call npm run lint
if %errorlevel% equ 0 (
    call :print_success "代码检查通过"
) else (
    call :print_warning "代码检查发现问题"
    call :print_warning "是否自动修复? (y/n)"
    set /p "response=请输入选择: "
    if /i "!response!"=="y" (
        call npm run lint:fix
        call :print_message "代码自动修复完成"
    )
)
goto :eof

REM 显示完成信息
:show_completion_info
call :print_header
call :print_success "开发环境初始化完成！"
echo.
call :print_message "下一步操作:"
echo 1. 配置微信开发者工具
echo 2. 在 .env 文件中配置服务器地址
echo 3. 在 project.config.json 中配置 AppID
echo 4. 运行 'npm run dev' 启动开发服务器
echo 5. 使用微信开发者工具打开项目
echo.
call :print_message "有用的命令:"
echo - npm test          # 运行测试
echo - npm run lint      # 代码检查
echo - npm run docker:dev # 启动 Docker 开发环境
echo.
call :print_message "文档链接:"
echo - 部署指南: docs/deployment-guide.md
echo - Docker 指南: docs/docker-guide.md
echo - 架构文档: docs/architecture.md
echo.
call :print_message "技术支持:"
echo - GitHub: https://github.com/zsjohny/snakesnake
echo - 邮箱: zs.johny@163.com
echo - 作者: JohnyZheng
goto :eof

REM 主函数
:main
call :print_header

REM 检查基础工具
call :install_nodejs
call :install_npm
call :install_git
call :install_docker

REM 创建配置文件
call :create_config_files

REM 安装项目依赖
call :install_dependencies

REM 检查项目结构
call :check_project_structure

REM 运行测试和检查
call :run_tests
call :run_lint

REM 微信开发者工具提示
call :print_step "微信开发者工具..."
call :print_message "请手动安装微信开发者工具:"
call :print_message "下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"

REM 显示完成信息
call :show_completion_info

pause
goto :eof

REM 运行主函数
call :main 