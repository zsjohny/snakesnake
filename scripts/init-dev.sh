#!/bin/bash

# SnakeSnake 开发环境初始化脚本
# 支持 Linux 和 macOS 系统
# 作者: JohnyZheng <zs.johny@163.com>

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# 检查系统类型
check_system() {
    print_step "检查操作系统..."
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

# 检查版本是否满足要求
check_version() {
    local current_version=$1
    local required_version=$2
    local tool_name=$3
    
    if [[ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" == "$required_version" ]]; then
        print_message "$tool_name 版本满足要求: $current_version >= $required_version"
        return 0
    else
        print_warning "$tool_name 版本过低: $current_version < $required_version"
        return 1
    fi
}

# 安装 Node.js
install_nodejs() {
    print_step "检查 Node.js..."
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        print_message "Node.js 已安装: v$NODE_VERSION"
        
        if check_version "$NODE_VERSION" "18.0.0" "Node.js"; then
            return 0
        else
            print_warning "建议升级 Node.js 到 18.0.0 或更高版本"
            print_warning "是否继续使用当前版本? (y/n)"
            read -r response
            if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
                print_message "请手动升级 Node.js 后重新运行脚本"
                exit 1
            fi
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
        
        print_success "Node.js 安装完成: $(node --version)"
    fi
}

# 安装 npm
install_npm() {
    print_step "检查 npm..."
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_message "npm 已安装: $NPM_VERSION"
        
        if check_version "$NPM_VERSION" "8.0.0" "npm"; then
            return 0
        else
            print_warning "npm 版本较低，建议升级"
        fi
    else
        print_error "npm 未安装，请先安装 Node.js"
        exit 1
    fi
}

# 安装 Git
install_git() {
    print_step "检查 Git..."
    if command_exists git; then
        GIT_VERSION=$(git --version | awk '{print $3}')
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
        
        print_success "Git 安装完成: $(git --version)"
    fi
}

# 安装 Docker (可选)
install_docker() {
    print_step "检查 Docker..."
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
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
                print_warning "请重启终端或重新登录以应用 Docker 权限"
            elif [[ "$SYSTEM" == "macos" ]]; then
                if command_exists brew; then
                    brew install --cask docker
                else
                    print_error "需要 Homebrew 来安装 Docker"
                    exit 1
                fi
            fi
            
            print_success "Docker 安装完成: $(docker --version)"
        else
            print_message "跳过 Docker 安装"
        fi
    fi
}

# 安装微信开发者工具
install_wechat_devtools() {
    print_step "微信开发者工具..."
    print_message "请手动安装微信开发者工具:"
    print_message "下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    
    if [[ "$SYSTEM" == "linux" ]]; then
        print_warning "Linux 用户可能需要使用 Wine 运行微信开发者工具"
        print_message "建议使用 Docker 容器化开发环境"
    elif [[ "$SYSTEM" == "macos" ]]; then
        print_message "macOS 用户可以直接下载 .dmg 文件安装"
    fi
}

# 创建配置文件
create_config_files() {
    print_step "创建配置文件..."
    
    # 创建 .env 文件
    if [[ ! -f ".env" ]]; then
        cat > .env << EOF
# SnakeSnake 环境配置
NODE_ENV=development
WECHAT_APPID=your-app-id-here
SERVER_URL=wss://your-websocket-server.com
API_BASE_URL=https://your-api-server.com
EOF
        print_message "创建 .env 配置文件"
    else
        print_message ".env 文件已存在"
    fi
    
    # 创建 .gitignore 文件（如果不存在）
    if [[ ! -f ".gitignore" ]]; then
        cat > .gitignore << EOF
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境配置
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 构建输出
dist/
build/

# 日志
logs/
*.log

# 运行时数据
pids/
*.pid
*.seed
*.pid.lock

# 覆盖率目录
coverage/
.nyc_output/

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db

# 微信开发者工具
.idea/
.vscode/
EOF
        print_message "创建 .gitignore 文件"
    else
        print_message ".gitignore 文件已存在"
    fi
}

# 安装项目依赖
install_dependencies() {
    print_step "安装项目依赖..."
    
    if [[ -f "package.json" ]]; then
        print_message "正在安装 npm 依赖..."
        npm install
        
        print_message "正在安装开发依赖..."
        npm install --save-dev
        
        print_success "项目依赖安装完成"
    else
        print_error "未找到 package.json 文件"
        exit 1
    fi
}

# 运行测试
run_tests() {
    print_step "运行测试..."
    
    if npm test; then
        print_success "测试通过"
    else
        print_error "测试失败"
        print_warning "是否继续? (y/n)"
        read -r response
        if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            exit 1
        fi
    fi
}

# 运行代码检查
run_lint() {
    print_step "运行代码检查..."
    
    if npm run lint; then
        print_success "代码检查通过"
    else
        print_warning "代码检查发现问题"
        print_warning "是否自动修复? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            npm run lint:fix
            print_message "代码自动修复完成"
        fi
    fi
}

# 检查项目结构
check_project_structure() {
    print_step "检查项目结构..."
    
    local required_files=(
        "app.js"
        "app.json"
        "app.wxss"
        "package.json"
        "project.config.json"
    )
    
    local required_dirs=(
        "pages"
        "images"
        "docs"
        "scripts"
        "tests"
    )
    
    local missing_files=()
    local missing_dirs=()
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            missing_dirs+=("$dir")
        fi
    done
    
    if [[ ${#missing_files[@]} -eq 0 && ${#missing_dirs[@]} -eq 0 ]]; then
        print_success "项目结构完整"
    else
        print_warning "项目结构不完整:"
        if [[ ${#missing_files[@]} -gt 0 ]]; then
            print_warning "缺少文件: ${missing_files[*]}"
        fi
        if [[ ${#missing_dirs[@]} -gt 0 ]]; then
            print_warning "缺少目录: ${missing_dirs[*]}"
        fi
    fi
}

# 显示完成信息
show_completion_info() {
    print_header
    print_success "开发环境初始化完成！"
    echo
    print_message "下一步操作:"
    echo "1. 配置微信开发者工具"
    echo "2. 在 .env 文件中配置服务器地址"
    echo "3. 在 project.config.json 中配置 AppID"
    echo "4. 运行 'npm run dev' 启动开发服务器"
    echo "5. 使用微信开发者工具打开项目"
    echo
    print_message "有用的命令:"
    echo "- npm test          # 运行测试"
    echo "- npm run lint      # 代码检查"
    echo "- npm run docker:dev # 启动 Docker 开发环境"
    echo
    print_message "文档链接:"
    echo "- 部署指南: docs/deployment-guide.md"
    echo "- Docker 指南: docs/docker-guide.md"
    echo "- 架构文档: docs/architecture.md"
    echo
    print_message "技术支持:"
    echo "- GitHub: https://github.com/zsjohny/snakesnake"
    echo "- 邮箱: zs.johny@163.com"
    echo "- 作者: JohnyZheng"
}

# 主函数
main() {
    print_header
    
    # 检查系统
    check_system
    
    # 安装基础工具
    install_nodejs
    install_npm
    install_git
    install_docker
    
    # 创建配置文件
    create_config_files
    
    # 安装项目依赖
    install_dependencies
    
    # 检查项目结构
    check_project_structure
    
    # 运行测试和检查
    run_tests
    run_lint
    
    # 微信开发者工具提示
    install_wechat_devtools
    
    # 显示完成信息
    show_completion_info
}

# 错误处理
trap 'print_error "脚本执行失败，请检查错误信息"; exit 1' ERR

# 运行主函数
main "$@" 