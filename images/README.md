# 图片资源目录

这个目录用于存放小程序所需的图片资源。

## 需要的图片文件

### 导航栏图标
- `home.png` - 首页图标（未选中状态）
- `home-active.png` - 首页图标（选中状态）
- `game.png` - 游戏图标（未选中状态）
- `game-active.png` - 游戏图标（选中状态）
- `rank.png` - 排行榜图标（未选中状态）
- `rank-active.png` - 排行榜图标（选中状态）
- `profile.png` - 个人资料图标（未选中状态）
- `profile-active.png` - 个人资料图标（选中状态）

### 分享图片
- `share.png` - 分享到朋友圈的图片
- `share-rank.png` - 排行榜分享图片

### 头像图片
- `default-avatar.png` - 默认头像
- `avatar_1.png` - 头像1
- `avatar_2.png` - 头像2
- `avatar_3.png` - 头像3
- `avatar_4.png` - 头像4
- `avatar_5.png` - 头像5

## 图片规格建议

### 导航栏图标
- 尺寸: 81px × 81px
- 格式: PNG
- 背景: 透明
- 颜色: 未选中状态使用灰色，选中状态使用主题色

### 分享图片
- 尺寸: 500px × 400px
- 格式: PNG/JPG
- 内容: 游戏截图或宣传图

### 头像图片
- 尺寸: 132px × 132px
- 格式: PNG
- 背景: 圆形或方形均可
- 风格: 卡通风格或真实头像

## 注意事项

1. 所有图片文件大小建议控制在100KB以内
2. 使用PNG格式以支持透明背景
3. 图片命名使用小写字母和下划线
4. 确保图片版权合规

## 临时解决方案

如果暂时没有图片资源，可以：
1. 使用在线图标库（如iconfont）下载图标
2. 使用占位图片服务生成临时图片
3. 在代码中使用emoji作为临时图标

## 示例代码

```javascript
// 在app.json中使用图标
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home-active.png",
        "text": "首页"
      }
    ]
  }
}
``` 