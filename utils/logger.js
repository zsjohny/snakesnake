/**
 * 日志工具模块
 * 用于替代console语句，提供统一的日志管理
 */

// 日志级别
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// 当前日志级别（生产环境可以设置为ERROR）
const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO

// 日志工具类
class Logger {
  static debug(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  }

  static info(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.log(`[INFO] ${message}`, ...args)
    }
  }

  static warn(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  }

  static error(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args)
    }
  }

  // 页面加载日志
  static pageLoad(pageName) {
    this.info(`${pageName}页面加载`)
  }

  // 功能执行日志
  static feature(featureName) {
    this.info(`执行功能: ${featureName}`)
  }

  // 错误日志
  static appError(error, context = '') {
    this.error(`小程序错误${context ? ` (${context})` : ''}:`, error)
  }

  // 用户操作日志
  static userAction(action) {
    this.info(`用户操作: ${action}`)
  }

  // 网络请求日志
  static network(operation, url) {
    this.info(`网络${operation}: ${url}`)
  }

  // 游戏状态日志
  static gameState(state, details = '') {
    this.info(`游戏状态: ${state}${details ? ` - ${details}` : ''}`)
  }
}

module.exports = Logger
