class VimKeys {
  constructor(config = {}) {
    // 默认配置
    const defaultConfig = {
      showStatus: true,        // 显示状态
      animationDuration: 100,  // 动画时长（毫秒）
      disabledKeys: [],        // 禁用的快捷键
      language: 'cn'           // 语言（cn/en）
    }
    
    // 合并配置
    this.config = { ...defaultConfig, ...config }
    
    // 初始化状态
    this.keyBuffer = ''
    this.keyTimeout = null
    this.isSearchActive = false
    
    // 初始化国际化
    this.initI18n()
    
    // 动态创建必要的HTML元素
    this.createElements()
    
    this.init()
  }

  // 初始化国际化
  initI18n() {
    this.i18n = {
      cn: {
        ready: '就绪',
        keys: '按键',
        execute: '执行',
        searchMode: '搜索模式',
        confirmClose: '确定要关闭当前页面吗？',
        searchPlaceholder: '输入搜索内容...',
        searchClose: '按 ESC 关闭搜索',
        found: '找到匹配项',
        notFound: '未找到',
        deleteLine: '删除行功能（演示）',
        copyLine: '复制行功能（演示）'
      },
      en: {
        ready: 'Ready',
        keys: 'Keys',
        execute: 'Execute',
        searchMode: 'Search Mode',
        confirmClose: 'Are you sure you want to close this page?',
        searchPlaceholder: 'Enter search term...',
        searchClose: 'Press ESC to close search',
        found: 'Found match',
        notFound: 'Not found',
        deleteLine: 'Delete line function (demo)',
        copyLine: 'Copy line function (demo)'
      }
    }
  }

  // 获取翻译文本
  t(key) {
    return this.i18n[this.config.language][key] || key
  }

  // 动态创建必要的HTML元素
  createElements() {
    // 创建状态显示元素
    this.createStatusElement()
    
    // 创建搜索覆盖层
    this.createSearchOverlay()
    
    // 添加必要的CSS样式
    this.addStyles()
  }

  // 创建状态显示元素
  createStatusElement() {
    // 检查是否已存在
    if (document.getElementById('vimStatus')) {
      this.statusElement = document.getElementById('vimStatus')
      return
    }

    this.statusElement = document.createElement('div')
    this.statusElement.id = 'vimStatus'
    this.statusElement.className = 'vim-status'
    this.statusElement.textContent = this.t('ready')
    
    document.body.appendChild(this.statusElement)
  }

  // 创建搜索覆盖层
  createSearchOverlay() {
    // 检查是否已存在
    if (document.getElementById('search-overlay')) {
      this.searchOverlay = document.getElementById('search-overlay')
      this.searchInput = document.getElementById('search-input')
      return
    }

    // 创建搜索覆盖层
    this.searchOverlay = document.createElement('div')
    this.searchOverlay.id = 'search-overlay'
    this.searchOverlay.className = 'search-overlay'
    this.searchOverlay.style.display = 'none'

    // 创建搜索框容器
    const searchBox = document.createElement('div')
    searchBox.className = 'search-box'

    // 创建搜索输入框
    this.searchInput = document.createElement('input')
    this.searchInput.id = 'search-input'
    this.searchInput.className = 'search-input'
    this.searchInput.type = 'text'
    this.searchInput.placeholder = this.t('searchPlaceholder')

    // 创建提示文本
    const helpText = document.createElement('p')
    helpText.style.margin = '8px 0 0 0'
    helpText.style.color = '#666'
    helpText.style.fontSize = '12px'
    helpText.textContent = this.t('searchClose')

    // 组装元素
    searchBox.appendChild(this.searchInput)
    searchBox.appendChild(helpText)
    this.searchOverlay.appendChild(searchBox)
    
    document.body.appendChild(this.searchOverlay)
  }

  // 添加必要的CSS样式
  addStyles() {
    // 检查是否已添加样式
    if (document.getElementById('vim-keys-styles')) {
      return
    }

    const style = document.createElement('style')
    style.id = 'vim-keys-styles'
    style.textContent = `
      .vim-status {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9998;
        user-select: none;
        pointer-events: none;
      }
      
      .search-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        z-index: 9999;
      }
      
      .search-box {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid #ddd;
      }
      
      .search-input {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: 2px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        outline: none;
      }
      
      .search-input:focus {
        border-color: #007cba;
      }
      
      .search-highlight {
        background-color: yellow;
        color: black;
        padding: 1px 2px;
        border-radius: 2px;
      }
    `
    
    document.head.appendChild(style)
  }

  init() {
    // 绑定键盘事件
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
    
    // 搜索相关事件
    this.searchInput.addEventListener('keydown', this.handleSearchKeyDown.bind(this))
    this.searchOverlay.addEventListener('click', this.handleOverlayClick.bind(this))
    
    // 根据配置设置状态显示
    if (this.config.showStatus) {
      this.updateStatus(this.t('ready'))
    } else if (this.statusElement) {
      this.statusElement.style.display = 'none'
    }
  }

  // 检测是否处于非交互模式
  isInNonInteractiveMode() {
    const activeElement = document.activeElement
    const tagName = activeElement.tagName.toLowerCase()
    
    // 检查是否是交互元素
    const interactiveElements = ['input', 'textarea', 'select', 'button']
    if (interactiveElements.includes(tagName)) {
      return false
    }
    
    // 检查是否是可编辑元素
    if (activeElement.contentEditable === 'true') {
      return false
    }
    
    // 检查input类型
    if (tagName === 'input') {
      const inputType = activeElement.type.toLowerCase()
      const interactiveInputTypes = [
        'text', 'password', 'email', 'number', 'search', 
        'tel', 'url', 'date', 'datetime-local', 'month', 
        'time', 'week', 'color'
      ]
      if (interactiveInputTypes.includes(inputType)) {
        return false
      }
    }
    
    // 如果搜索模式激活，也视为交互模式
    if (this.isSearchActive) {
      return false
    }
    
    return true
  }

  // 处理按键按下事件
  handleKeyDown(event) {
    // 如果不在非交互模式，不处理vim快捷键
    if (!this.isInNonInteractiveMode()) {
      return
    }

    // 处理ESC键（关闭搜索）
    if (event.key === 'Escape') {
      if (this.isSearchActive) {
        this.closeSearch()
        event.preventDefault()
        return
      }
    }

    // 防止在处理vim快捷键时触发默认行为
    const vimKeys = ['j', 'k', 'g', 'G', 'x', 'f', 'h', 'l', 'd', 'u']
    if (vimKeys.includes(event.key)) {
      event.preventDefault()
    }

    // 检查是否是禁用的快捷键
    if (this.config.disabledKeys.includes(event.key)) {
      return
    }

    // 添加按键到缓冲区
    this.addKeyToBuffer(event.key)
  }

  handleKeyUp(event) {
    // 在非交互模式下，清除一些可能的默认行为
    if (!this.isInNonInteractiveMode()) {
      return
    }
  }

  // 添加按键到缓冲区
  addKeyToBuffer(key) {
    this.keyBuffer += key
    this.updateStatus(`${this.t('keys')}: ${this.keyBuffer}`)

    // 清除之前的超时
    if (this.keyTimeout) {
      clearTimeout(this.keyTimeout)
    }

    // 尝试执行命令
    const result = this.executeCommand(this.keyBuffer)
    if (result === 'executed') {
      // 命令已执行，清除缓冲区
      this.clearBuffer()
      return
    } else if (result === 'waiting') {
      // 等待更多按键
      this.keyTimeout = setTimeout(() => {
        this.clearBuffer()
      }, 1000)
      return
    } else if (result === 'invalid') {
      // 无效命令，清除缓冲区
      this.clearBuffer()
      return
    }
  }

  // 执行命令
  executeCommand(command) {
    // 检查是否是禁用的快捷键
    if (this.config.disabledKeys.includes(command)) {
      return 'invalid'
    }
    
    // 定义所有命令
    const singleCharCommands = {
      'j': () => this.scrollSmooth(100),
      'k': () => this.scrollSmooth(-100),
      'h': () => this.scrollHorizontal(-50),
      'l': () => this.scrollHorizontal(50),
      'G': () => this.scrollToBottom(),
      'x': () => this.closePage(),
      'f': () => this.openSearch(),
      '/': () => this.openSearch(),
      'd': () => this.pageDown(),
      'u': () => this.pageUp(),
    }

    const multiCharCommands = {
      'gg': () => this.scrollToTop(),
    }

    const allCommands = { ...singleCharCommands, ...multiCharCommands }

    // 首先检查是否有完全匹配的命令
    if (allCommands[command]) {
      allCommands[command]()
      this.updateStatus(`${this.t('execute')}: ${command}`)
      return 'executed'
    }

    // 对于多字符命令，检查是否是开始部分
    const possibleMultiCommands = Object.keys(multiCharCommands).filter(cmd => 
      cmd.startsWith(command) && cmd.length > command.length
    )
    
    // 如果存在可能的多字符命令，等待更多按键
    if (possibleMultiCommands.length > 0) {
      return 'waiting'
    }
    
    // 如果没有匹配的命令也没有可能的多字符命令，视为无效命令
    return 'invalid'
  }

  // 清除按键缓冲区
  clearBuffer() {
    this.keyBuffer = ''
    this.updateStatus(this.t('ready'))
    if (this.keyTimeout) {
      clearTimeout(this.keyTimeout)
      this.keyTimeout = null
    }
  }

  // 更新状态显示
  updateStatus(message) {
    if (this.config.showStatus && this.statusElement) {
      this.statusElement.textContent = message
    }
  }

  // === 滚动相关功能 ===

  // 获取滚动行为
  getScrollBehavior() {
    return this.config.animationDuration > 0 ? 'smooth' : 'auto'
  }

  // 平滑滚动
  scrollSmooth(delta) {
    window.scrollBy({
      top: delta,
      behavior: this.getScrollBehavior()
    })
  }

  // 水平滚动
  scrollHorizontal(delta) {
    window.scrollBy({
      left: delta,
      behavior: this.getScrollBehavior()
    })
  }

  // 滚动到顶部
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: this.getScrollBehavior()
    })
  }

  // 滚动到底部
  scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: this.getScrollBehavior()
    })
  }

  // 向下翻页（一屏）
  pageDown() {
    const viewportHeight = window.innerHeight
    window.scrollBy({
      top: viewportHeight,
      behavior: this.getScrollBehavior()
    })
  }

  // 向上翻页（一屏）
  pageUp() {
    const viewportHeight = window.innerHeight
    window.scrollBy({
      top: -viewportHeight,
      behavior: this.getScrollBehavior()
    })
  }

  // === 页面操作功能 ===

  // 关闭页面
  closePage() {
    if (confirm(this.t('confirmClose'))) {
      window.close()
      // 如果无法关闭（现代浏览器限制），返回上一页
      setTimeout(() => {
        if (!window.closed) {
          window.history.back()
        }
      }, 100)
    }
  }

  // === 搜索功能 ===

  // 打开搜索
  openSearch() {
    this.isSearchActive = true
    this.searchOverlay.style.display = 'block'
    this.searchInput.focus()
    this.updateStatus(this.t('searchMode'))
  }

  // 关闭搜索
  closeSearch() {
    this.isSearchActive = false
    this.searchOverlay.style.display = 'none'
    this.searchInput.value = ''
    this.clearSearchHighlights()
    this.updateStatus(this.t('ready'))
    document.body.focus()
  }

  // 处理搜索输入框按键
  handleSearchKeyDown(event) {
    if (event.key === 'Escape') {
      this.closeSearch()
      event.preventDefault()
    } else if (event.key === 'Enter') {
      this.performSearch()
      event.preventDefault()
    }
  }

  // 处理搜索覆盖层点击（现在不需要模态关闭逻辑）
  handleOverlayClick(event) {
    // 右上角搜索框不需要点击外部关闭的逻辑
    // 保留方法以防将来需要
  }

  // 执行搜索
  performSearch() {
    const searchTerm = this.searchInput.value.trim()
    if (!searchTerm) {
      return
    }

    this.clearSearchHighlights()
    
    // 获取所有文本节点
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // 跳过搜索框本身
          if (node.parentElement.closest('.search-overlay')) {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        }
      }
    )

    const textNodes = []
    let node
    while (node = walker.nextNode()) {
      textNodes.push(node)
    }

    // 搜索并高亮
    let firstMatch = null
    textNodes.forEach(textNode => {
      const text = textNode.textContent
      const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi')
      
      if (regex.test(text)) {
        const parent = textNode.parentElement
        const highlightedHtml = text.replace(regex, '<mark class="search-highlight">$1</mark>')
        
        // 创建临时容器
        const temp = document.createElement('div')
        temp.innerHTML = highlightedHtml
        
        // 替换文本节点
        while (temp.firstChild) {
          parent.insertBefore(temp.firstChild, textNode)
        }
        parent.removeChild(textNode)
        
        // 记录第一个匹配项
        if (!firstMatch) {
          firstMatch = parent.querySelector('.search-highlight')
        }
      }
    })

    // 滚动到第一个匹配项
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: this.getScrollBehavior(), block: 'center' })
      this.updateStatus(`${this.t('found')}: ${searchTerm}`)
    } else {
      this.updateStatus(`${this.t('notFound')}: ${searchTerm}`)
    }
  }

  // 清除搜索高亮
  clearSearchHighlights() {
    const highlights = document.querySelectorAll('.search-highlight')
    highlights.forEach(highlight => {
      const parent = highlight.parentElement
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight)
      parent.normalize()
    })
  }

  // 转义正则表达式特殊字符
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

}