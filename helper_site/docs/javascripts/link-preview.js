// 链接悬浮预览功能
(function() {
    let previewBox = null;
    let currentLink = null;
    let currentUrl = null;
    let justExpanded = false; // 标记是否刚刚展开
    let scrollPosition = 0; // 保存滚动位置

    // 创建预览框
    function createPreviewBox() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'link-preview-overlay';
        overlay.addEventListener('click', function() {
            // 只有在展开状态下点击遮罩层才关闭预览框
            if (previewBox && !previewBox.classList.contains('collapsed')) {
                hidePreview();
            }
        });
        document.body.appendChild(overlay);
        
        // 创建预览框
        const box = document.createElement('div');
        box.className = 'link-preview-box';
        box.innerHTML = `
            <div class="link-preview-resizer"></div>
            <div class="link-preview-expand-trigger">
                <button class="link-preview-expand-btn" aria-label="展开预览" title="展开预览">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            </div>
            <div class="link-preview-content">
                <div class="link-preview-header">
                    <span class="link-preview-title">页面预览</span>
                    <div class="link-preview-actions">
                        <button class="link-preview-open" aria-label="在新标签页打开" title="在新标签页打开">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </button>
                        <button class="link-preview-collapse" aria-label="收起预览" title="收起预览">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        <button class="link-preview-close" aria-label="关闭预览" title="关闭预览">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="link-preview-loading">加载中...</div>
                <iframe class="link-preview-iframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
            </div>
        `;
        document.body.appendChild(box);
        
        // 阻止预览框内的滚动冒泡（移动端）
        box.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: false });
        
        // 阻止预览框内容区域的滚动冒泡（移动端）
        const content = box.querySelector('.link-preview-content');
        content.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: false });
        
        // 阻止预览框的鼠标滚轮事件冒泡（桌面端）
        // 使用捕获阶段拦截，只阻止冒泡不阻止默认行为
        box.addEventListener('wheel', function(e) {
            e.stopPropagation();
        }, { passive: true, capture: true });
        
        // 关闭按钮事件
        box.querySelector('.link-preview-close').addEventListener('click', hidePreview);
        
        // 打开按钮事件
        box.querySelector('.link-preview-open').addEventListener('click', function() {
            if (currentUrl) {
                window.open(currentUrl, '_blank');
            }
        });
        
        // 收起/展开按钮事件
        const collapseBtn = box.querySelector('.link-preview-collapse');
        collapseBtn.addEventListener('click', function() {
            const isCollapsed = box.classList.contains('collapsed');
            if (isCollapsed) {
                box.classList.remove('collapsed');
                collapseBtn.setAttribute('aria-label', '收起预览');
                collapseBtn.setAttribute('title', '收起预览');
                collapseBtn.querySelector('svg').innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
            } else {
                box.classList.add('collapsed');
                collapseBtn.setAttribute('aria-label', '展开预览');
                collapseBtn.setAttribute('title', '展开预览');
                collapseBtn.querySelector('svg').innerHTML = '<polyline points="15 18 9 12 15 6"></polyline>';
            }
        });
        
        // 展开按钮事件（收起状态下显示的按钮）
        const expandTrigger = box.querySelector('.link-preview-expand-trigger');
        expandTrigger.addEventListener('click', function(e) {
            // 阻止事件冒泡和默认行为，避免触发下层元素的点击
            e.preventDefault();
            e.stopPropagation();
            
            box.classList.remove('collapsed');
            collapseBtn.setAttribute('aria-label', '收起预览');
            collapseBtn.setAttribute('title', '收起预览');
            collapseBtn.querySelector('svg').innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
            
            // 设置保护标记，防止立即响应 URL 变化
            justExpanded = true;
            setTimeout(() => {
                justExpanded = false;
            }, 500); // 500ms 保护期
        });
        
        // 初始化调整器
        initResizer(box);
        
        return box;
    }
    
    // 初始化宽度调整器
    function initResizer(box) {
        const resizer = box.querySelector('.link-preview-resizer');
        let isResizing = false;
        
        const handleMouseDown = function(e) {
            isResizing = true;
            
            // 禁用过渡动画，使拖拽更流畅
            box.style.transition = 'none';
            
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            
            // 禁用 iframe 的指针事件，防止干扰拖拽
            const iframe = box.querySelector('.link-preview-iframe');
            if (iframe) {
                iframe.style.pointerEvents = 'none';
            }
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        const handleMouseMove = function(e) {
            if (!isResizing) return;
            
            // 计算鼠标距离右边缘的距离，这就是新的宽度
            const newWidth = window.innerWidth - e.clientX;
            const minWidth = 200;
            const maxWidth = window.innerWidth * 0.9;
            
            // 限制宽度范围
            const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            box.style.width = clampedWidth + 'px';
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        const handleMouseUp = function(e) {
            if (!isResizing) return;
            
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // 恢复过渡动画
            box.style.transition = '';
            
            // 恢复 iframe 的指针事件
            const iframe = box.querySelector('.link-preview-iframe');
            if (iframe) {
                iframe.style.pointerEvents = '';
            }
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        resizer.addEventListener('mousedown', handleMouseDown);
        
        // 绑定到 document，确保在任意位置都能响应
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    // 显示预览
    function showPreview(url, linkElement) {
        if (!previewBox) {
            previewBox = createPreviewBox();
        }

        currentLink = linkElement;
        currentUrl = url;
        const iframe = previewBox.querySelector('.link-preview-iframe');
        const loading = previewBox.querySelector('.link-preview-loading');
        const overlay = document.querySelector('.link-preview-overlay');
        
        // 重置状态
        iframe.style.display = 'none';
        loading.style.display = 'flex';
        loading.className = 'link-preview-loading';
        loading.innerHTML = '加载中...';
        iframe.src = '';
        
        // 显示遮罩层和预览框（保持收起状态如果已经收起）
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // 只添加 active 类，不移除 collapsed 类
        previewBox.classList.add('active');
        
        // 禁止背景页面滚动（移动端）- 只在移动端应用
        if (window.innerWidth <= 768) {
            // 保存当前滚动位置
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // 固定页面位置
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
        }
        
        // 同时开始加载iframe
        setTimeout(() => {
            iframe.src = url;
        }, 50); // 短暂延迟确保动画开始
        
        // 设置超时检测
        let loadTimeout = setTimeout(() => {
            if (iframe.style.display === 'none') {
                showError(loading);
            }
        }, 15000); // 15秒超时
        
        // iframe加载完成
        iframe.onload = function() {
            clearTimeout(loadTimeout);
            
            // 简单检查：只要 onload 触发就认为加载成功
            // 不再尝试访问 iframe 内容，避免跨域问题
            setTimeout(() => {
                loading.style.display = 'none';
                iframe.style.display = 'block';
            }, 100);
        };
        
        // iframe加载失败
        iframe.onerror = function() {
            clearTimeout(loadTimeout);
            showError(loading);
        };
    }

    // 显示错误信息
    function showError(loadingElement) {
        loadingElement.className = 'link-preview-loading link-preview-error';
        loadingElement.innerHTML = `
            <svg class="error-icon" viewBox="0 0 24 24" width="48" height="48">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="error-text">网页无法访问或禁止嵌入预览</div>
            <div class="error-hint">请点击链接直接访问</div>
        `;
    }

    // 隐藏预览
    function hidePreview() {
        const overlay = document.querySelector('.link-preview-overlay');
        
        if (previewBox) {
            previewBox.classList.remove('active');
            previewBox.classList.remove('collapsed'); // 同时移除收起状态
        }
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // 恢复背景页面滚动（移动端）- 只在移动端应用
        if (window.innerWidth <= 768) {
            // 恢复样式
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // 恢复滚动位置
            window.scrollTo(0, scrollPosition);
        }
        
        currentLink = null;
        currentUrl = null;
        
        // 清空iframe
        setTimeout(() => {
            const iframe = previewBox && previewBox.querySelector('.link-preview-iframe');
            if (iframe) {
                iframe.src = '';
            }
        }, 400); // 等待动画完成
    }

    // 判断链接是否可以预览
    function isValidLink(link) {
        const href = link.getAttribute('href');
        if (!href) return false;
        
        // 排除锚点、javascript、邮件、电话等特殊链接
        if (href.startsWith('#') || 
            href.startsWith('javascript:') || 
            href.startsWith('mailto:') ||
            href.startsWith('tel:')) {
            return false;
        }
        
        // 允许所有 http/https 链接（包括外部链接）
        return true;
    }

    // 获取完整URL
    function getFullUrl(link) {
        const href = link.getAttribute('href');
        if (!href) return null;
        
        // 如果是完整URL，直接返回
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return href;
        }
        
        // 相对路径转换为绝对路径
        try {
            return new URL(href, window.location.href).href;
        } catch (e) {
            return null;
        }
    }

    // 初始化链接监听
    function initLinkListeners() {
        // 只监听内容区域的链接
        const contentArea = document.querySelector('.md-content');
        if (!contentArea) return;

        contentArea.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            // 检查是否在预览窗口内（防止嵌套预览）
            if (link.closest('.link-preview-box')) return;
            
            // 排除 tabbed-labels 和 tabbed-labels--linked 容器内的链接
            if (link.closest('.tabbed-labels') || link.closest('.tabbed-labels--linked')) return;
            
            // 排除 custom-tooltip 类的链接
            if (link.classList.contains('custom-tooltip')) return;
            
            // 排除 glightbox 图片链接
            if (link.classList.contains('glightbox')) return;
            
            // 检查是否为有效链接
            if (!isValidLink(link)) return;
            
            const url = getFullUrl(link);
            if (!url) return;
            
            // 移动端直接跳转，不显示预览
            if (window.innerWidth <= 768) {
                return; // 不阻止默认行为，让链接正常跳转
            }
            
            // 阻止默认跳转行为
            e.preventDefault();
            
            // 显示预览
            showPreview(url, link);
            
        }, true);
    }

    // 键盘ESC关闭预览
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && previewBox && previewBox.classList.contains('active')) {
            hidePreview();
        }
    });

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLinkListeners);
    } else {
        initLinkListeners();
    }

    // 监听页面导航变化（SPA应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            
            // 如果刚刚展开，忽略这次 URL 变化
            if (justExpanded) {
                return;
            }
            
            // 检查预览框是否还存在于 DOM 中
            if (previewBox && !document.body.contains(previewBox)) {
                previewBox = null;
                return;
            }
            
            // 只有在预览框处于完全展开状态时才关闭
            if (previewBox && previewBox.classList.contains('active') && !previewBox.classList.contains('collapsed')) {
                hidePreview();
            }
            
            // 重新初始化（如果需要）
            setTimeout(initLinkListeners, 100);
        }
    }).observe(document.body, { subtree: true, childList: true });

})();
