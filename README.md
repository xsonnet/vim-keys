# VimKeys.js

一个轻量级的JavaScript库，为网页添加类似Vim编辑器的键盘快捷键功能。

## ✨ 特性

- 🎯 **智能检测** - 自动检测页面交互状态，只在非交互模式下响应快捷键
- 🌍 **国际化支持** - 内置中文和英文语言包
- ⚙️ **高度可配置** - 支持自定义状态显示、动画效果、禁用特定快捷键等
- 🔍 **非入侵式搜索** - 右上角搜索框，不阻挡页面内容
- 📱 **现代化设计** - 平滑动画效果，美观的用户界面
- 🚀 **零依赖** - 纯JavaScript实现，无需任何外部依赖
- 🏗️ **即插即用** - 自动创建所需HTML元素和样式，无需手动配置

## 🚀 快速开始

### 基础用法

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- 您的页面内容 -->
    <h1>我的网站</h1>
    <p>这里是页面内容...</p>

    <!-- 引入VimKeys.js -->
    <script src="vim-keys.min.js"></script>
    <script>
        // 使用默认配置初始化
        document.addEventListener('DOMContentLoaded', () => {
            const vimKeys = new VimKeys()
        })
    </script>
</body>
</html>
```

> **注意**: VimKeys.js 会自动创建所需的HTML元素（状态显示器和搜索框），无需手动添加任何HTML元素！

### 自定义配置

```javascript
const config = {
    showStatus: true,        // 是否显示状态（默认: true）
    animationDuration: 100,  // 动画时长，0为无动画（默认: 100ms）
    disabledKeys: ['x'],     // 禁用的快捷键（默认: []）
    language: 'en'           // 语言 cn/en（默认: 'cn'）
}

const vimKeys = new VimKeys(config)
```

## ⌨️ 快捷键列表

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `gg` | 回到页面顶部 | 快速按两次g |
| `G` | 滚动到页面底部 | 按住Shift+G |
| `j` | 向下滚动 | 小幅度向下滚动 |
| `k` | 向上滚动 | 小幅度向上滚动 |
| `d` | 向下翻页 | 滚动一整屏高度 |
| `u` | 向上翻页 | 向上滚动一整屏高度 |
| `h` | 向左滚动 | 水平向左滚动 |
| `l` | 向右滚动 | 水平向右滚动 |
| `f` | 打开搜索 | 在右上角显示搜索框 |
| `x` | 关闭页面 | 关闭当前标签页 |

## 🔧 配置选项

### showStatus
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否在右下角显示快捷键状态

```javascript
const vimKeys = new VimKeys({ showStatus: false })
```

### animationDuration
- **类型**: `number`
- **默认值**: `100`
- **说明**: 滚动动画持续时间（毫秒），设为0禁用动画

```javascript
const vimKeys = new VimKeys({ animationDuration: 0 }) // 禁用动画
```

### disabledKeys
- **类型**: `string[]`
- **默认值**: `[]`
- **说明**: 要禁用的快捷键列表

```javascript
const vimKeys = new VimKeys({ 
    disabledKeys: ['x', 'f'] // 禁用关闭页面和搜索功能
})
```

### language
- **类型**: `string`
- **默认值**: `'cn'`
- **可选值**: `'cn'` | `'en'`
- **说明**: 界面语言

```javascript
const vimKeys = new VimKeys({ language: 'en' })
```

## 🎨 样式自定义

VimKeys.js 自动创建所需的样式，但您仍可以通过CSS覆盖默认样式：

```css
/* 自定义状态显示器样式 */
.vim-status {
    background: #007cba !important;
    font-size: 14px !important;
}

/* 自定义搜索框样式 */
.search-overlay {
    top: 50px !important;
    width: 400px !important;
}

/* 自定义搜索高亮样式 */
.search-highlight {
    background-color: #ffeb3b !important;
    border: 1px solid #fbc02d !important;
}
```

> **提示**: 由于样式是通过JavaScript动态添加的，可能需要使用 `!important` 来覆盖默认样式。

## 🔍 搜索功能

搜索功能支持：
- 实时文本搜索
- 高亮显示匹配项
- 自动滚动到第一个匹配项
- 按ESC或Enter键关闭搜索

## 🌐 浏览器兼容性

- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- 支持所有现代浏览器

## 📦 安装

### NPM
```bash
npm install vim-keys
```

### CDN
```html
<script src="https://unpkg.com/vim-keys/vim-keys.min.js"></script>
```

### 直接下载
下载 `vim-keys.min.js` 文件并在HTML中引入。

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/your-username/vim-keys.git

# 安装依赖
npm install

# 构建压缩文件
npm run build

# 启动开发服务器
npm run dev
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 Vim 编辑器提供的灵感
- 感谢所有贡献者的努力

## 📞 联系

如有问题或建议，请提交Issue或发送邮件。

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
