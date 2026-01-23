# 链接悬浮预览功能说明

## 功能介绍

为网站添加了链接悬浮预览功能，用户在内容区域的链接上悬浮 3 秒后，会在右侧以长方形卡片形式从右边缘平滑滑入，同时压缩当前网页内容，显示目标页面的预览。

## 功能特性

1. **智能识别**：只对内容区域（`.md-content`）内的有效链接生效
2. **延迟触发**：鼠标悬浮 3 秒后才显示预览，避免误触
3. **保留原功能**：完全保留链接的点击跳转功能
4. **长方形卡片**：预览框以长方形卡片形式呈现，高度接近视口高度
5. **贴边设计**：卡片右侧紧贴浏览器右边缘，左侧圆角
6. **压缩布局**：预览窗口出现时，主内容区域向左压缩，而不是覆盖
7. **平滑动画**：使用 cubic-bezier 缓动函数实现流畅的动画效果
8. **轻量遮罩**：左侧显示轻量半透明遮罩
9. **iframe 预览**：使用 iframe 加载目标页面，实现真实预览
10. **支持外部链接**：内部和外部链接都可以预览
11. **防止嵌套**：预览窗口内的链接不会触发新的预览
12. **多种关闭方式**：
    - 点击关闭按钮
    - 点击左侧遮罩区域
    - 按 ESC 键
13. **响应式设计**：适配移动端和桌面端
14. **暗色主题支持**：自动适配暗色模式
15. **主题色适配**：使用网站的青色主题色
16. **错误提示**：加载失败时显示友好的错误提示

## 文件说明

### 新增文件

1. **docs/javascripts/link-preview.js**
   - 核心功能实现
   - 监听链接悬浮事件
   - 管理预览框的显示和隐藏
   - 处理 iframe 加载

2. **docs/stylesheets/link-preview.css**
   - 预览框样式
   - 动画效果
   - 响应式布局
   - 暗色主题适配

### 修改文件

1. **mkdocs.yml**
   - 添加了 `extra_css` 配置
   - 添加了 `link-preview.js` 到 `extra_javascript`
   - 更新了 minify 插件配置

## 使用方法

### 构建网站

```bash
# 本地预览
mkdocs serve

# 构建生产版本
mkdocs build
```

### 测试功能

1. 启动本地服务器：`mkdocs serve`
2. 打开浏览器访问网站
3. 在任意文档页面，将鼠标悬浮在内容区域的链接上
4. 等待 3 秒，预览框会自动弹出
5. 可以在预览框中浏览目标页面
6. 点击关闭按钮或按 ESC 键关闭预览

## 技术细节

### 链接过滤规则

预览功能会自动过滤以下类型的链接：
- 外部链接（不同域名）
- 锚点链接（`#xxx`）
- JavaScript 伪协议（`javascript:`）
- 邮件链接（`mailto:`）
- 电话链接（`tel:`）

### 安全性

iframe 使用了 `sandbox` 属性，限制了以下权限：
- `allow-same-origin`：允许同源访问
- `allow-scripts`：允许执行脚本
- `allow-popups`：允许弹窗
- `allow-forms`：允许表单提交

### 性能优化

1. 使用事件委托，只在内容区域添加一个监听器
2. 预览框采用懒加载，首次使用时才创建
3. 关闭预览后延迟清空 iframe，避免闪烁
4. 使用 CSS 动画而非 JavaScript 动画，性能更好

## 自定义配置

如需修改悬浮延迟时间，编辑 `docs/javascripts/link-preview.js`：

```javascript
const HOVER_DELAY = 3000; // 修改这个值（单位：毫秒）
```

### 样式自定义

如需修改卡片尺寸和位置，编辑 `docs/stylesheets/link-preview.css`：

```css
.link-preview-box {
    top: 60px;  /* 距离顶部距离 */
    right: 0;  /* 贴紧右边缘 */
    width: 45%;  /* 修改宽度百分比 */
    max-width: 700px;  /* 修改最大宽度 */
    min-width: 400px;  /* 修改最小宽度 */
}

.link-preview-box > div:first-child {
    height: calc(100vh - 120px);  /* 高度为视口高度减去上下边距 */
    border-radius: 12px 0 0 12px;  /* 左侧圆角，右侧直角 */
}
```

如需修改动画速度和缓动效果：

```css
.link-preview-box {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    /* 修改 0.4s 为其他值来改变动画速度 */
    /* cubic-bezier 控制缓动曲线 */
}
```

如需修改遮罩层透明度：

```css
.link-preview-overlay {
    background: rgba(0, 0, 0, 0.2);  /* 修改透明度，0-1之间 */
}
```

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器

## 注意事项

1. 某些页面可能设置了 `X-Frame-Options` 或 CSP 策略，会阻止在 iframe 中加载
2. 跨域页面可能无法正常预览
3. 建议在生产环境测试所有功能是否正常工作
