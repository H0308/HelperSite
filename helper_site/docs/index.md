---
statistics: True
hide:
  - navigation
  - toc
---

<style>
/* SVG容器样式保持不变 */
#container {
    width: 100%;
    margin: 50px auto;
}

#hello-svg {
    width: 100%;
    height: auto;
}

/* 定义渐变色 */
#hello-svg {
    --gradient-1: #FF6B6B, #4ECDC4, #45B7D1;
    --gradient-2: #96E6A1, #D4FC79;
    --gradient-3: #FFD93D, #FF6B6B;
}

/* 路径基础样式 */
.path {
    fill: none;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* 路径1动画和渐变 */
.path-1 {
    stroke: url(#gradient1);
    stroke-dasharray: 1800;
    stroke-dashoffset: 1800;
    animation: drawPath1 3s ease forwards;
}

/* 路径2动画和渐变 */
.path-2 {
    stroke: url(#gradient2);
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: drawPath2 2s ease forwards 3s;
}

/* 路径3动画和渐变 */
.path-3 {
    stroke: url(#gradient3);
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    animation: drawPath3 1.5s ease forwards 5s;
}

/* 动画关键帧保持不变 */
@keyframes drawPath1 {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes drawPath2 {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes drawPath3 {
    to {
        stroke-dashoffset: 0;
    }
}

/* 只保留主页特有的布局样式 */
.welcome-section {
    text-align: center;
    padding: 4rem 0;
    margin: 2rem auto;
    max-width: 800px;
    background: linear-gradient(120deg, rgba(77, 166, 218, 0.1), rgba(255, 255, 255, 0.1));
    border-radius: 16px;
}

.welcome-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-family: var(--md-header-font);
    animation: fadeInDown 1s ease-out;
}

.welcome-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease-out;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
    margin: 3rem auto;
    max-width: 1000px;
    padding: 0 1rem;
}

.feature-item {
    text-align: center;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.feature-item:hover {
    background: white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.qr-code-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem;
    height: calc(100% - 3.6rem); /* 减去标题和padding的高度 */
    justify-content: center;
}

.qr-code-section img {
    width: 140px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-code-section p {
    margin: 0;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.reference-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
}

.reference-links a {
    display: block;
    padding: 1rem;
    background: rgba(248, 249, 250, 0.9);
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
}

.reference-links a:hover {
    background: #4da6da;
    color: white;
}

/* 重置主页内容区域的样式 */
.md-content article {
    background: none;
    backdrop-filter: none;
    border-radius: 0;
    box-shadow: none;
    padding: 2rem 0;
    margin: 0;
    padding: 0rem 2rem !important;
    padding-bottom: 2rem !important;
}

.md-content h1,
.md-content h2,
.md-content h3 {
    background: none;
    -webkit-background-clip: unset;
    background-clip: unset;
    color: inherit;
}

.md-content h1::before,
.md-content h2::before,
.md-content h3::before,
.md-content h1::after,
.md-content h2::after,
.md-content h3::after {
    display: none;
}

.md-content {
    max-width: none;
    margin: 0 auto;
}

.md-content__inner {
    margin-right: auto !important;
}

/* 添加内容布局容器样式 */
.content-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    max-width: 100%;
    margin: 0;
}

.content-container {
    padding: 0rem !important;
}

.main-content-area {
    padding: 0rem !important;
}

/* 隐藏readmore-container的第一个直接子div */
#readmore-container > div:first-child {
    display: none;
}

/* 全屏容器布局 */
.main-content-area {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 2rem;
    padding: 2rem;
    max-width: 100%;
    margin: 0;
    overflow: hidden;
    margin-bottom: 0;
}

/* 左边栏布局 */
.main-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* 右边栏布局 */
.side-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* 欢迎区域调整 */
.welcome-section {
    text-align: left;
    padding: 3rem;
    margin: 0;
    max-width: none;
    background: rgba(77, 166, 218, 0.05);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
}

/* SVG容器调整 */
#container {
    position: absolute;
    top: 50%;
    right: 0%; /* 修改这里，将SVG向左移动 */
    transform: translateY(-50%);
    width: 50%; /* 调整宽度使其完整显示 */
    opacity: 0.3;
    pointer-events: none;
}

/* 特性网格调整 */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 0;
    padding: 0;
}

/* 卡片样式优化 */

.content-card {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.8rem;
    margin: 11px;
    border: 1px solid rgba(77, 166, 218, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
}

.content-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    border: 2px solid transparent;
    background-image: linear-gradient(45deg, 
        rgba(77, 166, 218, 0.5), 
        rgba(218, 77, 166, 0.5), 
        rgba(166, 218, 77, 0.5),
        rgba(77, 166, 218, 0.5)
    );
    background-size: 300% 300%;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.content-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(77, 166, 218, 0.1);
}
.content-card:hover::before {
    opacity: 1;
    animation: contendCardBorderGradient 3s linear infinite;
}
@keyframes contendCardBorderGradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
a {
    z-index: 100
}
/* 响应式调整 */
@media (max-width: 1024px) {
    .main-content-area {
        grid-template-columns: 1fr;
    }
    #container {
        display: none;
    }
    .welcome-section {
        text-align: center;
    }
}

/* 调整参考文档卡片样式 */
.reference-section {
    width: 100%;
    margin-top: 2rem;
}

.reference-section .content-card {
    max-width: none;
    margin: 0;
}

.reference-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.reference-grid a {
    display: block;
    padding: 1rem;
    background: rgba(248, 249, 250, 0.9);
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
    text-decoration: none;
}

.reference-grid a:hover {
    background: #4da6da;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(77, 166, 218, 0.15);
}

.disclaimer-section {
    width: 100%;
    margin-top: 1rem;
    text-align: center;
}

.disclaimer-section .content-card {
    margin: 0;
    padding: 1rem;
    background: rgba(255, 217, 61, 0.1);
    background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
    border: 1px solid rgba(255, 217, 61, 0.2);
}

.disclaimer-section p {
    margin: 0;
    color: #666;
}

/* 优化特性网格项样式 */
.feature-item {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(77, 166, 218, 0.15);
}

/* 优化欢迎区域 */
.welcome-section {
    background: linear-gradient(135deg, rgba(77, 166, 218, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 优化参考链接样式 */
.reference-grid a {
    background: rgba(248, 249, 250, 0.8);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reference-grid a:hover {
    background: linear-gradient(135deg, #4da6da 0%, #275796 100%);
    transform: translateY(-3px);
}

/* 优化免责声明样式 */
.disclaimer-section .content-card {
    background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
    border: 1px solid rgba(255, 217, 61, 0.2);
}

/* 优化动画效果 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* 添加布局动画 */
.main-section > *,
.side-section > * {
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
}

.main-section > *:nth-child(1) { animation-delay: 0.1s; }
.main-section > *:nth-child(2) { animation-delay: 0.2s; }
.main-section > *:nth-child(3) { animation-delay: 0.3s; }
.side-section > *:nth-child(1) { animation-delay: 0.2s; }
.side-section > *:nth-child(2) { animation-delay: 0.3s; }
.side-section > *:nth-child(3) { animation-delay: 0.4s; }

/* 优化响应式布局 */
@media (max-width: 1024px) {
    .main-content-area {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .feature-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .feature-grid {
        grid-template-columns: 1fr;
    }
    
    .reference-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<div class="content-container">
    <div class="main-content-area">
        <div class="main-section">
            <div class="welcome-section">
                <div id="container">
                    <svg id="hello-svg" data-name="hello" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 582 197">
                        <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#FF6B6B"/>
                                <stop offset="50%" style="stop-color:#4ECDC4"/>
                                <stop offset="100%" style="stop-color:#45B7D1"/>
                            </linearGradient>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#96E6A1"/>
                                <stop offset="100%" style="stop-color:#D4FC79"/>
                            </linearGradient>
                            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#FFD93D"/>
                                <stop offset="100%" style="stop-color:#FF6B6B"/>
                            </linearGradient>
                        </defs>
                        <path class="path path-1" d="M208,338c38-16.67,73.74-45.72,97.33-66,21.33-18.33,32.67-35.67,37.33-52.67C347.12,203.12,344,192,332,192c-11,0-21,10.33-24.94,27.68-4.52,19.89-22.06,107.82-29.39,149,15.67-72.33,36.33-81.33,53.67-81.33,22.33,0,24.67,18.67,19.42,39-5.43,21.07-7.42,44.32,17.91,44.32,18,0,35.53-8.17,52.67-20,14-9.67,23-24,23-40,0-13.42-8-23.33-20.67-23.33s-24.33,12-24.33,33.33c0,27,16.33,48,44,48,25.67,0,47.67-19.67,62-44.67,13.61-23.74,30.67-64.67,33.33-92.67s-5.33-36-18.67-36-24.67,17.33-28.67,43.33S486,302,491.33,330s28,37.67,46,37.67,38.17-15.67,52-37c16.54-25.51,35.87-67.45,38.67-102,2-24.67-8.67-33.33-20-33.33-14.67,0-23.33,13.33-28,38-4.5,23.81-8,64-2,94,4.64,23.21,25.33,40.33,44.67,40.33s32.67-19,36.67-42.33" transform="translate(-199 -183)"/>
                        <path class="path path-2" d="M697.33,287.33C672,287.33,661.33,305,659,327c-2.81,26.54,10.33,41.67,29.67,41.67,22,0,34.54-20.78,36.67-40.67,2-18.67-7.39-39.13-28-40.67" transform="translate(-199 -183)"/>
                        <path class="path path-3" d="M714.8,295.12c12.11,12.26,43.53,9.55,56.53-5.79" transform="translate(-199 -183)"/>
                        <line class="path path-4" x1="561" y1="181.67" x2="561" y2="181.67"/>
                    </svg>
                </div>
                <h1 class="welcome-title">欢迎来到学习档案</h1>
                <p class="welcome-subtitle">记录技术，分享知识</p>
            </div>
            
            <div class="content-card">
                <h2>字体说明</h2>
                <ul>
                    <li>导航栏标题：<a href="https://github.com/bytedance/fonts">抖音美好体</a></li>
                    <li>标题：<a href="https://github.com/lxgw/LxgwZhenKai">霞鹜臻楷</a></li>
                    <li>内容：<a href="https://github.com/adobe-fonts/source-han-sans">Adobe Source Han Sans 思源黑体 SC</a></li>
                    <li>代码：<a href="https://www.jetbrains.com/lp/mono/">JetBrains Mono</a></li>
                </ul>
            </div>
            
            <div class="content-card">
                <h2>使用指南</h2>
                <p>本网页提供两种主题：</p>
                <ul>
                    <li><strong>新版主题：</strong>包含动画和特效，建议在Chrome桌面端使用</li>
                    <li><strong>旧版主题：</strong>简化版本，适合移动端和性能较弱的设备</li>
                </ul>
                
                在新版网页中，对屏幕尺寸较小的设备默认使用旧版主题且不可更改，所以没有看到「切换主题」的按钮属于正常现象
                
                <p><span style="color:red">注意：切换主题只改变显示效果，不会改变网页本身的内存占用</span></p>
            </div>
        </div>
        
        <div class="side-section">
            <div class="feature-grid">
                <div class="feature-item">
                    <h3>📚 页面总数</h3>
                    <p>{{ pages }} 个页面</p>
                </div>
                <div class="feature-item">
                    <h3>📝 文字总数</h3>
                    <p>{{ words }} 个字</p>
                </div>
                <div class="feature-item">
                    <h3>💻 代码行数</h3>
                    <p>{{ codes }} 行代码</p>
                </div>
                <div class="feature-item">
                    <h3>🖼️ 图片数量</h3>
                    <p>{{ images }} 张图片</p>
                </div>
            </div>
            
            <div class="content-card">
                <h2>最近更新</h2>
                <p>查看<a href="https://www.help-doc.top/%E7%BD%91%E7%AB%99%E6%97%B6%E9%97%B4%E7%BA%BF/%E7%BD%91%E7%AB%99%E6%97%B6%E9%97%B4%E7%BA%BF.html">网站时间线</a>了解最新内容更新。</p>
            </div>
            
            <div class="content-card">
                <h2>网站验证码</h2>
                <div class="qr-code-section">
                    <p><strong>关注「阅读档案」微信公众号并回复「验证码」获取验证码</strong></p>
                    <img src="index.assets/qrcode_for_gh_166df3e5da8b_258.jpg" alt="微信公众号二维码">
                </div>
            </div>
        </div>
    </div>

    <div class="reference-section">
        <div class="content-card">
            <h2>参考文档</h2>
            <div class="reference-grid">
                <a href="https://legacy.cplusplus.com/">C/C++ 参考文档</a>
                <a href="https://docs.oracle.com/javase/8/docs/api/">Java 官方文档</a>
                <a href="https://developer.mozilla.org/en-US/">MDN Web 文档</a>
                <a href="https://docs.python.org/zh-cn/3/library/index.html">Python 标准库</a>
                <a href="https://quickref.cn/docs/git.html">Git 指令参考</a>
                <a href="https://quickref.cn/docs/github.html">Github 使用技巧</a>
                <a href="https://quickref.cn/docs/http-status-code.html">HTTP 状态码</a>
                <a href="https://quickref.cn/docs/latex.html">LaTeX 符号代码</a>
                <a href="https://quickref.cn/docs/emmet.html">Emmet 表达式</a>
                <a href="https://quickref.cn/docs/regex.html">正则表达式</a>
            </div>
        </div>
    </div>

    <div class="copyright-section">
        <div class="content-card">
            <h2>版权声明</h2>
            <div class="copyright-info">
                <p>版权声明：本博客所有文章除特别声明外，均采用 CC BY-NC-SA 4.0 许可协议。</p>
                <p>转载请注明来自怡晗★的个人网站！</p>
            </div>
        </div>
    </div>

    <div class="disclaimer-section">
        <div class="content-card">
            <p>⚠️ 本网站的内容不具有权威性，请注意对信息进行甄别</p>
        </div>
    </div>
</div>