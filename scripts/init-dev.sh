#!/bin/bash

# SnakeSnake 开发环境初始化脚本
# 支持 Linux 和 macOS 系统

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  SnakeSnake 开发环境初始化${NC}"
    echo -e "${BLUE}================================${NC}"
}

# 检查系统类型
check_system() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        SYSTEM="linux"
        print_message "检测到 Linux 系统"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        SYSTEM="macos"
        print_message "检测到 macOS 系统"
    else
        print_error "不支持的操作系统: $OSTYPE"
        exit 1
    fi
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 安装 Node.js
install_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_message "Node.js 已安装: $NODE_VERSION"
        
        # 检查版本是否满足要求
        REQUIRED_VERSION="18.0.0"
        if node -e "process.exit(process.version.slice(1).split('.').map(Number)[0] >= 18 ? 0 : 1)"; then
            print_message "Node.js 版本满足要求 (>= 18.0.0)"
        else
            print_warning "Node.js 版本过低，建议升级到 18.0.0 或更高版本"
        fi
    else
        print_message "正在安装 Node.js..."
        
        if [[ "$SYSTEM" == "linux" ]]; then
            # Linux 安装 Node.js
            if command_exists curl; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command_exists wget; then
                wget -qO- https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            else
                print_error "需要 curl 或 wget 来安装 Node.js"
                exit 1
            fi
        elif [[ "$SYSTEM" == "macos" ]]; then
            # macOS 安装 Node.js
            if command_exists brew; then
                brew install node@18
                brew link node@18 --force
            else
                print_message "正在安装 Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                brew install node@18
                brew link node@18 --force
            fi
        fi
        
        print_message "Node.js 安装完成: $(node --version)"
    fi
}

# 安装 npm
install_npm() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_message "npm 已安装: $NPM_VERSION"
    else
        print_error "npm 未安装，请先安装 Node.js"
        exit 1
    fi
}

# 安装 Git
install_git() {
    if command_exists git; then
        GIT_VERSION=$(git --version)
        print_message "Git 已安装: $GIT_VERSION"
    else
        print_message "正在安装 Git..."
        
        if [[ "$SYSTEM" == "linux" ]]; then
            sudo apt-get update
            sudo apt-get install -y git
        elif [[ "$SYSTEM" == "macos" ]]; then
            if command_exists brew; then
                brew install git
            else
                print_error "需要 Homebrew 来安装 Git"
                exit 1
            fi
        fi
        
        print_message "Git 安装完成: $(git --version)"
    fi
}

# 安装 Docker (可选)
install_docker() {
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version)
        print_message "Docker 已安装: $DOCKER_VERSION"
    else
        print_warning "Docker 未安装，是否安装? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_message "正在安装 Docker..."
            
            if [[ "$SYSTEM" == "linux" ]]; then
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                sudo usermod -aG docker $USER
                rm get-docker.sh
            elif [[ "$SYSTEM" == "macos" ]]; then
                if command_exists brew; then
                    brew install --cask docker
                else
                    print_error "需要 Homebrew 来安装 Docker"
                    exit 1
                fi
            fi
            
            print_message "Docker 安装完成: $(docker --version)"
            print_warning "请重启终端或重新登录以应用 Docker 权限"
        else
            print_message "跳过 Docker 安装"
        fi
    fi
}

# 安装微信开发者工具
install_wechat_devtools() {
    print_message "请手动安装微信开发者工具:"
    print_message "下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    
    if [[ "$SYSTEM" == "linux" ]]; then
        print_message "Linux 用户可能需要使用 Wine 运行微信开发者工具"
    elif [[ "$SYSTEM" == "macos" ]]; then
        print_message "macOS 用户可以直接下载 .dmg 文件安装"
    fi
}

# 安装项目依赖
install_dependencies() {
    print_message "正在安装项目依赖..."
    
    if [[ -f "package.json" ]]; then
        npm install
        print_message "项目依赖安装完成"
    else
        print_error "未找到 package.json 文件"
        exit 1
    fi
}

# 运行测试
run_tests() {
    print_message "正在运行测试..."
    
    if npm test; then
        print_message "测试通过"
    else
        print_error "测试失败"
        exit 1
    fi
}

# 代码规范检查
run_lint() {
    print_message "正在检查代码规范..."
    
    if npm run lint; then
        print_message "代码规范检查通过"
    else
        print_warning "代码规范检查发现问题，请查看详细信息"
    fi
}

# 创建配置文件
create_config() {
    print_message "正在创建配置文件..."
    
    # 创建 .env 文件
    if [[ ! -f ".env" ]]; then
        cat > .env << EOF
# SnakeSnake 环境配置
NODE_ENV=development
WECHAT_APPID=your-app-id-here
API_BASE_URL=https://your-api-server.com
WEBSOCKET_URL=wss://your-websocket-server.com
EOF
        print_message "创建 .env 配置文件"
    fi
    
    # 创建 .env.example 文件
    if [[ ! -f ".env.example" ]]; then
        cat > .env.example << EOF
# SnakeSnake 环境配置示例
NODE_ENV=development
WECHAT_APPID=your-app-id-here
API_BASE_URL=https://your-api-server.com
WEBSOCKET_URL=wss://your-websocket-server.com
EOF
        print_message "创建 .env.example 配置文件"
    fi
}

# 显示完成信息
show_completion() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}🎉 开发环境初始化完成！${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${GREEN}下一步操作:${NC}"
    echo "1. 配置微信开发者工具"
    echo "2. 在 .env 文件中配置你的 AppID"
    echo "3. 运行 'npm run dev' 启动开发服务器"
    echo "4. 在微信开发者工具中导入项目"
    echo ""
    echo -e "${GREEN}常用命令:${NC}"
    echo "npm test          - 运行测试"
    echo "npm run lint      - 代码规范检查"
    echo "npm run build     - 构建项目"
    echo "npm run dev       - 启动开发服务器"
    echo ""
    echo -e "${GREEN}文档链接:${NC}"
    echo "README.md                    - 项目介绍"
    echo "docs/architecture.md         - 架构设计"
    echo "docs/deployment-guide.md     - 发布指南"
    echo "docs/backend-recommendations.md - 后端实现推荐"
}

# 主函数
main() {
    print_header
    
    check_system
    install_nodejs
    install_npm
    install_git
    install_docker
    install_wechat_devtools
    install_dependencies
    create_config
    run_tests
    run_lint
    
    show_completion
}

# 运行主函数
main "$@" 