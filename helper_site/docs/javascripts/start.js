// 字体配置
const fontConfig = {
    "dongguanti": {
        name: "上图东观体",
        id: "font-dongguanti"
    },
    "oppoti": {
        name: "OPPO Sans",
        id: "font-oppoti"
    },
    "jiangchengti": {
        name: "江城黑体",
        id: "font-jiangchengti"
    },
    "lxgw": {
        name: "霞鹜臻楷",
        id: "font-lxgw"
    }
};

// 代码字体配置
const codeFontConfig = {
    "google-sans-code": {
        name: "Google Sans Code",
        id: "code-font-google-sans-code"
    },
    "dejavu": {
        name: "DejaVu Sans Mono",
        id: "code-font-dejavu-sans-mono"
    },
    "zsft": {
        name: "JetBrains Mono",
        id: "code-font-zsft-hk"
    }
};

// 立即应用保存的字体设置（与主题初始化方式一致）
(function initFont() {
    const savedFont = localStorage.getItem("preferred-font") || "dongguanti";

    // 禁用所有字体样式表
    Object.values(fontConfig).forEach(font => {
        const link = document.getElementById(font.id);
        if (link) {
            link.setAttribute("disabled", "true");
        }
    });

    // 启用选中的字体样式表
    const selectedFontLink = document.getElementById(fontConfig[savedFont].id);
    if (selectedFontLink) {
        selectedFontLink.removeAttribute("disabled");
    }
})();

// 立即应用保存的代码字体设置
(function initCodeFont() {
    const savedCodeFont = localStorage.getItem("preferred-code-font") || "dejavu";

    // 禁用所有代码字体样式表
    Object.values(codeFontConfig).forEach(font => {
        const link = document.getElementById(font.id);
        if (link) {
            link.setAttribute("disabled", "true");
        }
    });

    // 启用选中的代码字体样式表
    const selectedCodeFontLink = document.getElementById(codeFontConfig[savedCodeFont].id);
    if (selectedCodeFontLink) {
        selectedCodeFontLink.removeAttribute("disabled");
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("preferred-theme") || "theme2";
    const savedFont = localStorage.getItem("preferred-font") || "dongguanti";
    const savedCodeFont = localStorage.getItem("preferred-code-font") || "dejavu";

    // 初始化功能条字体下拉菜单和字体设置
    updateFontDropdownToolbar(savedFont);
    applyFont(savedFont);

    // 初始化功能条代码字体下拉菜单和代码字体设置
    updateCodeFontDropdownToolbar(savedCodeFont);
    applyCodeFont(savedCodeFont);

    // 初始化功能条状态
    initToolbarState();

    // 初始化桌面端主题
    initDesktopTheme();

    // 添加加载完成后的检测
    setTimeout(() => {
        const hiddenElements = document.querySelectorAll('.md-content article>*[style*="opacity: 0"]');
        hiddenElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 2000); // 2秒后强制显示所有隐藏元素
});

// 初始化桌面端主题
function initDesktopTheme() {
    const savedTheme = localStorage.getItem("preferred-theme") || "theme2";
    const theme1Link = document.getElementById("theme1-desktop");
    const theme2Link = document.getElementById("theme2-desktop");

    if (theme1Link && theme2Link) {
        if (savedTheme === "theme1") {
            // 新版主题：同时加载theme1和theme2
            theme1Link.removeAttribute("disabled");
            theme2Link.removeAttribute("disabled");
        } else {
            // 旧版主题：只加载theme2
            theme1Link.setAttribute("disabled", "true");
            theme2Link.removeAttribute("disabled");
        }
    }
}

(function initTheme() {
    // 立即初始化桌面端主题，避免闪烁
    const savedTheme = localStorage.getItem("preferred-theme") || "theme2";
    const theme1Link = document.getElementById("theme1-desktop");
    const theme2Link = document.getElementById("theme2-desktop");

    if (theme1Link && theme2Link) {
        if (savedTheme === "theme1") {
            // 新版主题：同时加载theme1和theme2
            theme1Link.removeAttribute("disabled");
            theme2Link.removeAttribute("disabled");
        } else {
            // 旧版主题：只加载theme2
            theme1Link.setAttribute("disabled", "true");
            theme2Link.removeAttribute("disabled");
        }
    }
})();

// 通用下拉菜单切换函数
function toggleDropdown(targetSelector, otherSelector) {
    const dropdown = document.querySelector(targetSelector);
    const otherDropdown = document.querySelector(otherSelector);
    const isActive = dropdown.classList.contains('active');

    if (isActive) {
        dropdown.classList.remove('active');
        return;
    }

    // 如果其他下拉菜单打开，先关闭并等待过渡完成
    if (otherDropdown && otherDropdown.classList.contains('active')) {
        const handleTransitionEnd = (event) => {
            if (event.target === otherDropdown && (event.propertyName === 'opacity' || event.propertyName === 'transform')) {
                otherDropdown.removeEventListener('transitionend', handleTransitionEnd);
                dropdown.classList.add('active');
            }
        };

        otherDropdown.addEventListener('transitionend', handleTransitionEnd);
        otherDropdown.classList.remove('active');

        // 超时保护
        setTimeout(() => {
            otherDropdown.removeEventListener('transitionend', handleTransitionEnd);
            if (!dropdown.classList.contains('active')) {
                dropdown.classList.add('active');
            }
        }, 350);
    } else {
        dropdown.classList.add('active');
    }
}

// 字体下拉菜单功能
function toggleFontDropdownToolbar() {
    toggleDropdown('.font-dropdown-toolbar', '.code-font-dropdown-toolbar');
}

// 代码字体下拉菜单功能
function toggleCodeFontDropdownToolbar() {
    toggleDropdown('.code-font-dropdown-toolbar', '.font-dropdown-toolbar');
}

// 通用字体应用函数
function applyFontStyle(config, fontKey, storageKey) {
    // 禁用所有字体样式表
    Object.values(config).forEach(font => {
        const link = document.getElementById(font.id);
        if (link) link.setAttribute("disabled", "true");
    });

    // 启用选中的字体样式表
    const selectedLink = document.getElementById(config[fontKey].id);
    if (selectedLink) selectedLink.removeAttribute("disabled");

    // 保存设置
    localStorage.setItem(storageKey, fontKey);
}

// 通用下拉菜单更新函数
function updateDropdownDisplay(config, fontKey, nameSelector, optionSelector, dataAttr) {
    const nameEl = document.querySelector(nameSelector);
    const options = document.querySelectorAll(optionSelector);

    if (nameEl) nameEl.textContent = config[fontKey].name;

    options.forEach(option => {
        const key = option.getAttribute(dataAttr);
        option.classList.toggle('selected', key === fontKey);
    });
}

// 字体选择
function selectFontToolbar(fontKey) {
    applyFontStyle(fontConfig, fontKey, "preferred-font");
    updateDropdownDisplay(fontConfig, fontKey, ".current-font-name-toolbar", ".font-option-toolbar", "data-font");
    document.querySelector('.font-dropdown-toolbar').classList.remove('active');
}

// 代码字体选择
function selectCodeFontToolbar(codeFontKey) {
    applyFontStyle(codeFontConfig, codeFontKey, "preferred-code-font");
    updateDropdownDisplay(codeFontConfig, codeFontKey, ".current-code-font-name-toolbar", ".code-font-option-toolbar", "data-code-font");
    document.querySelector('.code-font-dropdown-toolbar').classList.remove('active');
}

// 应用字体（保持向后兼容）
function applyFont(fontKey) {
    applyFontStyle(fontConfig, fontKey, "preferred-font");
}

// 应用代码字体（保持向后兼容）
function applyCodeFont(codeFontKey) {
    applyFontStyle(codeFontConfig, codeFontKey, "preferred-code-font");
}

// 更新字体下拉菜单显示（保持向后兼容）
function updateFontDropdownToolbar(currentFontKey) {
    updateDropdownDisplay(fontConfig, currentFontKey, ".current-font-name-toolbar", ".font-option-toolbar", "data-font");
}

// 更新代码字体下拉菜单显示（保持向后兼容）
function updateCodeFontDropdownToolbar(currentCodeFontKey) {
    updateDropdownDisplay(codeFontConfig, currentCodeFontKey, ".current-code-font-name-toolbar", ".code-font-option-toolbar", "data-code-font");
}

// 返回顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 功能条切换功能
function toggleToolbar() {
    const toolbar = document.getElementById('floatingToolbar');
    const toggleBtn = document.getElementById('toolbarToggleBtn');

    if (!toolbar || !toggleBtn) {
        console.error('无法找到功能条或切换按钮元素');
        return;
    }

    const isHidden = toolbar.classList.contains('hidden');

    if (isHidden) {
        // 显示功能条
        toolbar.classList.remove('hidden');
        toggleBtn.classList.remove('toolbar-hidden');
        localStorage.setItem('toolbar-visible', 'true');
    } else {
        // 隐藏功能条
        toolbar.classList.add('hidden');
        toggleBtn.classList.add('toolbar-hidden');
        localStorage.setItem('toolbar-visible', 'false');
    }
}

// 初始化功能条状态
function initToolbarState() {
    const toolbar = document.getElementById('floatingToolbar');
    const toggleBtn = document.getElementById('toolbarToggleBtn');
    const isVisible = localStorage.getItem('toolbar-visible');

    if (!toolbar || !toggleBtn) {
        return;
    }

    // 如果之前设置为隐藏，则保持隐藏状态
    if (isVisible === 'false') {
        toolbar.classList.add('hidden');
        toggleBtn.classList.add('toolbar-hidden');
    } else {
        // 默认显示
        toolbar.classList.remove('hidden');
        toggleBtn.classList.remove('toolbar-hidden');
    }
}

// 隐藏所有子菜单的通用函数
function hideAllSubmenus() {
    const fontDropdown = document.querySelector('.font-dropdown-toolbar');
    if (fontDropdown) {
        fontDropdown.classList.remove('active');
    }

    const codeFontDropdown = document.querySelector('.code-font-dropdown-toolbar');
    if (codeFontDropdown) {
        codeFontDropdown.classList.remove('active');
    }
    // 如果将来有其他子菜单，可以在这里添加
}

// 点击外部关闭下拉菜单
document.addEventListener('click', function (event) {
    const fontDropdown = document.querySelector('.font-dropdown-toolbar');
    const codeFontDropdown = document.querySelector('.code-font-dropdown-toolbar');
    const historyDropdown = document.querySelector('.history-dropdown-toolbar');

    // 如果点击的不是字体下拉菜单内部，则关闭字体下拉菜单
    const fontSwitcher = document.querySelector('.font-switcher');
    if (fontSwitcher && fontDropdown && !fontSwitcher.contains(event.target)) {
        fontDropdown.classList.remove('active');
    }

    // 如果点击的不是代码字体下拉菜单内部，则关闭代码字体下拉菜单
    const codeFontSwitcher = document.querySelector('.code-font-switcher');
    if (codeFontSwitcher && codeFontDropdown && !codeFontSwitcher.contains(event.target)) {
        codeFontDropdown.classList.remove('active');
    }

    // 如果点击的不是历史记录相关元素，则隐藏下拉菜单
    const historyViewer = document.querySelector('.history-viewer');
    if (historyViewer && historyDropdown && !historyViewer.contains(event.target) && !historyDropdown.contains(event.target)) {
        historyDropdown.classList.remove('show');
    }
}); 

// 为功能区的其他功能添加点击和悬浮事件监听器
document.addEventListener('DOMContentLoaded', function () {
    const toolbarItems = document.querySelectorAll('.toolbar-item:not(.font-switcher):not(.code-font-switcher)');

    toolbarItems.forEach(item => {
        // 点击其他功能时隐藏子菜单
        item.addEventListener('click', function () {
            hideAllSubmenus();
        });

        // 鼠标悬浮在其他功能时隐藏子菜单
        item.addEventListener('mouseenter', function () {
            hideAllSubmenus();
        });
    });

    // 延迟隐藏的定时器
    let fontDropdownTimer = null;
    let codeFontDropdownTimer = null;

    // 为字体切换器添加鼠标事件监听器
    const fontSwitcher = document.querySelector('.font-switcher');
    if (fontSwitcher) {
        fontSwitcher.addEventListener('mouseleave', function () {
            // 清除之前的定时器
            if (fontDropdownTimer) {
                clearTimeout(fontDropdownTimer);
            }

            // 设置延迟隐藏
            fontDropdownTimer = setTimeout(function () {
                const fontDropdown = document.querySelector('.font-dropdown-toolbar');
                if (fontDropdown) {
                    fontDropdown.classList.remove('active');
                }
            }, 50); // 300ms延迟
        });

        // 鼠标重新进入时取消隐藏
        fontSwitcher.addEventListener('mouseenter', function () {
            if (fontDropdownTimer) {
                clearTimeout(fontDropdownTimer);
                fontDropdownTimer = null;
            }
        });
    }

    // 为代码字体切换器添加鼠标事件监听器
    const codeFontSwitcher = document.querySelector('.code-font-switcher');
    if (codeFontSwitcher) {
        codeFontSwitcher.addEventListener('mouseleave', function () {
            // 清除之前的定时器
            if (codeFontDropdownTimer) {
                clearTimeout(codeFontDropdownTimer);
            }

            // 设置延迟隐藏
            codeFontDropdownTimer = setTimeout(function () {
                const codeFontDropdown = document.querySelector('.code-font-dropdown-toolbar');
                if (codeFontDropdown) {
                    codeFontDropdown.classList.remove('active');
                }
            }, 50); // 300ms延迟
        });

        // 鼠标重新进入时取消隐藏
        codeFontSwitcher.addEventListener('mouseenter', function () {
            if (codeFontDropdownTimer) {
                clearTimeout(codeFontDropdownTimer);
                codeFontDropdownTimer = null;
            }
        });
    }

    // 初始化历史记录功能
    initHistoryFeature();
    
    // 记录当前页面访问
    recordPageVisit();
});

function switchTheme() {
    // 获取当前和目标主题信息
    const currentTheme = localStorage.getItem("preferred-theme") || "theme2";
    const newTheme = currentTheme === "theme1" ? "theme2" : "theme1";
    const targetThemeText = newTheme === "theme1" ? "新版主题" : "原生主题";

    // 获取桌面端主题样式链接
    const theme1Link = document.getElementById("theme1-desktop");
    const theme2Link = document.getElementById("theme2-desktop");

    if (!theme1Link || !theme2Link) {
        console.error("无法找到桌面端主题样式链接");
        return;
    }

    // 创建和添加过渡覆盖层
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    overlay.innerHTML = `
        <div class="theme-transition-content">
            <div class="theme-transition-spinner"></div>
            <div class="theme-transition-text">正在切换到：${targetThemeText}</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 确保DOM已更新后再添加active类
    requestAnimationFrame(() => {
        // 激活蒙版
        overlay.classList.add("active");

        // 添加适当的延迟以确保蒙版已完全显示
        setTimeout(() => {
            // 切换桌面端主题样式
            if (newTheme === "theme1") {
                // 新版主题：同时加载theme1和theme2
                theme1Link.removeAttribute("disabled");
                theme2Link.removeAttribute("disabled");
            } else {
                // 旧版主题：只加载theme2
                theme1Link.setAttribute("disabled", "true");
                theme2Link.removeAttribute("disabled");
            }

            // 保存主题设置
            localStorage.setItem("preferred-theme", newTheme);

            // 给予足够的时间加载主题
            setTimeout(() => {
                // 平滑淡出效果
                fadeOutOverlay(overlay);
            }, 2500); // 主题加载时间
        }, 250); // 蒙版显示时间
    });
}

// 平滑淡出蒙版
function fadeOutOverlay(overlay) {
    // 先改变背景色，制造渐变效果
    overlay.style.backgroundColor = "rgba(255, 255, 255, 0.85)";

    // 短暂延迟后淡出
    setTimeout(() => {
        overlay.classList.remove("active");

        // 等待淡出动画完成后移除元素
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }, 150);
}

// 历史记录功能
function initHistoryFeature() {
    const historyViewer = document.querySelector('.history-viewer');
    const historyDropdown = document.querySelector('.history-dropdown-toolbar');
    
    if (historyViewer && historyDropdown) {
        historyViewer.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleHistoryDropdown();
        });
        
        // 阻止历史记录下拉菜单内部点击事件冒泡
        historyDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // 记录当前页面访问
    recordPageVisit();
    
    // 加载并显示历史记录
    loadHistoryList();
    
    // 监听页面变化，自动刷新历史记录
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.classList.contains('md-content')) {
                // 页面内容发生变化时自动刷新历史记录
                setTimeout(() => {
                    loadHistoryList();
                }, 100);
            }
        });
    });
    
    const content = document.querySelector('.md-content');
    if (content) {
        observer.observe(content, { childList: true, subtree: true });
    }
}

function toggleHistoryDropdown() {
    const historyDropdown = document.querySelector('.history-dropdown-toolbar');
    if (historyDropdown) {
        historyDropdown.classList.toggle('show');
        if (historyDropdown.classList.contains('show')) {
            loadHistoryList();
        }
    }
}

// 全局变量用于跟踪当前页面的最后访问锚点
let lastVisitedAnchor = '';
let currentPageUrl = '';
let isPageFullyLoaded = false;
let isRestoringAnchor = false;
let isNavigatingFromHistory = false;

// 跟踪用户在页面上的锚点访问
function trackAnchorVisit() {
    // 如果页面未完全加载或正在恢复锚点，不进行跟踪
    if (!isPageFullyLoaded || isRestoringAnchor) {
        return;
    }
    
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const currentViewCenter = scrollTop + viewportHeight / 2;
    
    let closestAnchor = null;
    let minDistance = Infinity;
    
    headings.forEach(heading => {
        const headingTop = heading.offsetTop;
        
        // 计算标题到当前视口中心的距离
        const distance = Math.abs(headingTop - currentViewCenter);
        
        // 只考虑已经滚动过的标题（在当前视口中心之上或附近）
        if (headingTop <= currentViewCenter + viewportHeight / 4 && distance < minDistance) {
            minDistance = distance;
            closestAnchor = heading.id;
        }
    });
    
    // 如果没有找到合适的锚点，使用当前视口内最上方的标题
    if (!closestAnchor) {
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= viewportHeight && heading.id) {
                if (!closestAnchor || rect.top < document.getElementById(closestAnchor).getBoundingClientRect().top) {
                    closestAnchor = heading.id;
                }
            }
        });
    }
    
    if (closestAnchor && closestAnchor !== lastVisitedAnchor) {
        lastVisitedAnchor = closestAnchor;
        // 更新当前页面的锚点记录
        updateCurrentPageAnchor(closestAnchor);
    }
}

// 更新当前页面的最后访问锚点
function updateCurrentPageAnchor(anchor) {
    if (!currentPageUrl) return;
    
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    const baseUrl = currentPageUrl.split('#')[0];
    
    // 查找当前页面的记录（不包含锚点的基础URL）
    const pageIndex = history.findIndex(item => item.url.split('#')[0] === baseUrl);
    
    if (pageIndex !== -1) {
        // 获取锚点对应的标题
        let anchorTitle = '';
        if (anchor) {
            const anchorElement = document.getElementById(anchor);
            if (anchorElement) {
                const headingText = anchorElement.textContent || anchorElement.innerText;
                if (headingText && headingText.trim()) {
                    anchorTitle = headingText.trim();
                }
            }
        }
        
        // 更新记录中的锚点信息
        history[pageIndex].lastVisitedAnchor = anchor;
        history[pageIndex].lastVisitedAnchorTitle = anchorTitle;
        history[pageIndex].lastVisitedTime = new Date().toLocaleString('zh-CN');
        
        localStorage.setItem('pageHistory', JSON.stringify(history));
    }
}

function recordPageVisit() {
    // 延迟执行以确保页面标题和内容已完全加载
    setTimeout(() => {
        const currentUrl = window.location.href;
        const currentTitle = document.title;
        const currentTime = new Date().toLocaleString('zh-CN');
        
        // 更新全局变量
        currentPageUrl = currentUrl;
        
        // 获取当前页面的锚点信息
        const hash = window.location.hash;
        const anchor = hash ? hash.substring(1) : '';
        
        // 获取锚点对应的标题
        let anchorTitle = '';
        if (anchor) {
            const anchorElement = document.getElementById(anchor);
            if (anchorElement) {
                const headingText = anchorElement.textContent || anchorElement.innerText;
                if (headingText && headingText.trim()) {
                    anchorTitle = headingText.trim();
                }
            }
        }
        
        const pageInfo = {
            url: currentUrl,
            title: currentTitle,
            time: currentTime,
            anchor: anchor,
            anchorTitle: anchorTitle,
            lastVisitedAnchor: anchor, // 初始设置为当前锚点
            lastVisitedAnchorTitle: anchorTitle,
            lastVisitedTime: currentTime,
            displayUrl: currentUrl.replace(window.location.origin, '')
        };
        
        // 从localStorage获取历史记录
        let history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
        
        // 检查是否已存在相同的URL和锚点
        const existingIndex = history.findIndex(item => 
            item.url === pageInfo.url && item.anchor === pageInfo.anchor
        );
        
        if (existingIndex !== -1) {
            // 如果存在，更新时间并移到最前面
            history[existingIndex].time = currentTime;
            const updatedItem = history.splice(existingIndex, 1)[0];
            history.unshift(updatedItem);
        } else {
            // 如果不存在，添加到最前面
            history.unshift(pageInfo);
        }
        
        // 限制历史记录数量（最多保存50条）
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        // 保存到localStorage
        localStorage.setItem('pageHistory', JSON.stringify(history));
        
        // 立即刷新历史记录列表
        loadHistoryList();
        
        // 初始化锚点跟踪
        lastVisitedAnchor = anchor;
        
        // 设置滚动监听器来跟踪锚点访问
        setupAnchorTracking();
    }, 50);
}

// 设置锚点跟踪功能
function setupAnchorTracking() {
    // 移除之前的监听器（如果存在）
    window.removeEventListener('scroll', trackAnchorVisit);
    
    // 添加滚动监听器
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // 使用防抖来避免过于频繁的调用
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackAnchorVisit, 150);
    });
    
    // 页面离开时保存最后访问的锚点
    window.addEventListener('beforeunload', function() {
        if (lastVisitedAnchor && currentPageUrl) {
            updateCurrentPageAnchor(lastVisitedAnchor);
        }
    });
    
    // 页面可见性变化时也保存锚点
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && lastVisitedAnchor && currentPageUrl) {
            updateCurrentPageAnchor(lastVisitedAnchor);
        }
    });
    
    // 延迟设置页面加载完成标志和初始锚点检查
    setTimeout(() => {
        isPageFullyLoaded = true;
        // 再延迟一点进行初始锚点检查，确保页面完全稳定
        setTimeout(trackAnchorVisit, 300);
    }, 1000);
}

function loadHistoryList() {
    const historyList = document.querySelector('.history-list-toolbar');
    if (!historyList) return;
    
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty-toolbar">暂无浏览记录</div>';
        return;
    }
    
    let historyHTML = '';
    history.forEach((item, index) => {
        // 获取显示标题：如果有锚点标题则显示锚点标题，否则显示完整页面标题
        let displayTitle = item.title;
        let lastVisitInfo = '';
        
        if (item.anchor) {
            // 优先使用存储的锚点标题
            if (item.anchorTitle && item.anchorTitle.trim()) {
                displayTitle = item.anchorTitle;
            } else {
                // 如果没有存储的锚点标题，尝试从当前页面获取（兼容旧数据）
                const anchorElement = document.getElementById(item.anchor);
                if (anchorElement) {
                    const headingText = anchorElement.textContent || anchorElement.innerText;
                    if (headingText && headingText.trim()) {
                        displayTitle = headingText.trim();
                    }
                }
            }
        }
        
        // 显示最后访问的锚点信息（如果与当前锚点不同）
        if (item.lastVisitedAnchor && item.lastVisitedAnchor !== item.anchor) {
            if (item.lastVisitedAnchorTitle) {
                lastVisitInfo = `<div class="history-last-visit">最后访问: ${item.lastVisitedAnchorTitle}</div>`;
            } else {
                lastVisitInfo = `<div class="history-last-visit">最后访问: #${item.lastVisitedAnchor}</div>`;
            }
        }
        
        historyHTML += `
            <div class="history-item-toolbar">
                <div class="history-content" data-url="${item.url}">
                    <div class="history-title-toolbar">${displayTitle}</div>
                    <div class="history-time-toolbar">${item.time}</div>
                    ${lastVisitInfo}
                    <div class="history-url-toolbar">${item.displayUrl}</div>
                </div>
                <div class="history-delete" data-index="${index}" title="删除此记录">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = historyHTML;
    
    // 为历史记录项添加点击事件监听器
    const historyItems = historyList.querySelectorAll('.history-content');
    historyItems.forEach(item => {
        let touchStartTime = 0;
        let hasMoved = false;
        
        // 触摸开始
        item.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            hasMoved = false;
        }, { passive: true });
        
        // 触摸移动
        item.addEventListener('touchmove', function(e) {
            hasMoved = true;
        }, { passive: true });
        
        // 触摸结束
        item.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            if (!hasMoved && touchDuration < 500) {
                e.preventDefault();
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                if (url) {
                    navigateToHistory(url);
                }
            }
        });
        
        // 鼠标点击（桌面端）
        item.addEventListener('click', function(e) {
            // 检查是否是触摸设备触发的点击事件
            if (e.detail === 0 || e.pointerType === 'mouse') {
                e.preventDefault();
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                if (url) {
                    navigateToHistory(url);
                }
            }
        });
    });
    
    // 为删除按钮添加点击事件监听器
    const deleteButtons = historyList.querySelectorAll('.history-delete');
    deleteButtons.forEach(button => {
        let touchStartTime = 0;
        let hasMoved = false;
        
        // 触摸开始
        button.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            hasMoved = false;
        }, { passive: true });
        
        // 触摸移动
        button.addEventListener('touchmove', function(e) {
            hasMoved = true;
        }, { passive: true });
        
        // 触摸结束
        button.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            if (!hasMoved && touchDuration < 500) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                if (!isNaN(index)) {
                    deleteHistoryItem(index);
                }
            }
        });
        
        // 鼠标点击（桌面端）
        button.addEventListener('click', function(e) {
            // 检查是否是触摸设备触发的点击事件
            if (e.detail === 0 || e.pointerType === 'mouse') {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                if (!isNaN(index)) {
                    deleteHistoryItem(index);
                }
            }
        });
    });
}

function navigateToHistory(url) {
    // 设置历史记录导航标志
    isNavigatingFromHistory = true;
    
    // 从历史记录中找到对应的项目，获取最后访问的锚点信息
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    const historyItem = history.find(item => item.url === url);
    
    if (historyItem && historyItem.lastVisitedAnchor) {
        // 如果有最后访问的锚点，导航到该锚点
        const baseUrl = url.split('#')[0];
        const targetUrl = `${baseUrl}#${historyItem.lastVisitedAnchor}`;
        window.location.href = targetUrl;
    } else {
        // 否则导航到原始URL
        window.location.href = url;
    }
}

function deleteHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('pageHistory', JSON.stringify(history));
    // 立即刷新历史记录列表
    loadHistoryList();
}

function clearHistory() {
    if (confirm('确定要清空所有浏览历史记录吗？')) {
        localStorage.removeItem('pageHistory');
        // 立即刷新历史记录列表
        loadHistoryList();
    }
}

// 恢复用户最后访问的锚点位置
function restoreLastVisitedAnchor() {
    const currentUrl = window.location.href.split('#')[0];
    const currentHash = window.location.hash.substring(1);
    
    // 如果URL中已经有锚点，说明用户手动导航到特定位置，不需要恢复
    if (currentHash) {
        // 清除历史记录导航标志
        isNavigatingFromHistory = false;
        return;
    }
    
    // 只有通过历史记录导航时才恢复锚点
    if (!isNavigatingFromHistory) {
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('pageHistory') || '[]');
    
    // 查找当前页面的历史记录
    const pageHistory = history.find(item => item.url.split('#')[0] === currentUrl);
    
    if (pageHistory && pageHistory.lastVisitedAnchor) {
        // 设置恢复状态标志
        isRestoringAnchor = true;
        
        // 延迟执行，确保页面内容已完全加载
        setTimeout(() => {
            const targetElement = document.getElementById(pageHistory.lastVisitedAnchor);
            if (targetElement) {
                // 平滑滚动到目标位置
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // 更新当前跟踪的锚点
                lastVisitedAnchor = pageHistory.lastVisitedAnchor;
                
                // 更新URL中的锚点（不触发页面跳转）
                if (window.history.replaceState) {
                    const newUrl = `${currentUrl}#${pageHistory.lastVisitedAnchor}`;
                    window.history.replaceState(null, null, newUrl);
                }
                
                // 恢复完成后，延迟清除恢复状态标志和历史记录导航标志
                setTimeout(() => {
                    isRestoringAnchor = false;
                    isNavigatingFromHistory = false;
                }, 1000);
            } else {
                // 如果目标元素不存在，立即清除恢复状态标志和历史记录导航标志
                isRestoringAnchor = false;
                isNavigatingFromHistory = false;
            }
        }, 800);
    } else {
        // 如果没有找到历史记录或锚点，清除历史记录导航标志
        isNavigatingFromHistory = false;
    }
}

// 监听锚点变化
    window.addEventListener('hashchange', function() {
        recordPageVisit();
    });
    
    // 监听页面导航变化
    window.addEventListener('popstate', function() {
        // 重置页面加载状态
        isPageFullyLoaded = false;
        isRestoringAnchor = false;
        // 重置历史记录导航标志（popstate不是通过历史记录列表触发的）
        isNavigatingFromHistory = false;
        
        recordPageVisit();
        // 延迟恢复锚点和设置加载状态
        setTimeout(() => {
            restoreLastVisitedAnchor();
            setTimeout(() => {
                isPageFullyLoaded = true;
            }, 500);
        }, 200);
    });
    
    // 监听页面加载完成事件
    window.addEventListener('load', function() {
        // 重置历史记录导航标志（直接加载页面不是通过历史记录列表触发的）
        isNavigatingFromHistory = false;
        
        recordPageVisit();
        // 延迟恢复锚点和设置加载状态
        setTimeout(() => {
            restoreLastVisitedAnchor();
            setTimeout(() => {
                isPageFullyLoaded = true;
            }, 500);
        }, 300);
    });
    
    // 监听MkDocs的页面切换事件
    document.addEventListener('DOMContentLoaded', function() {
        // 监听所有链接点击事件
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
                // 延迟记录页面访问，等待页面跳转完成
                setTimeout(() => {
                    recordPageVisit();
                }, 300);
            }
        });
        
        const observer = new MutationObserver(function(mutations) {
            let pageChanged = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的页面内容加载
                    const addedNodes = Array.from(mutation.addedNodes);
                    if (addedNodes.some(node => node.nodeType === 1 && (node.classList.contains('md-content__inner') || node.querySelector('.md-content__inner')))) {
                        pageChanged = true;
                    }
                }
            });
            
            if (pageChanged) {
                // 重置页面加载状态
                isPageFullyLoaded = false;
                isRestoringAnchor = false;
                // 重置历史记录导航标志（页面内容变化不是通过历史记录列表触发的）
                isNavigatingFromHistory = false;
                
                recordPageVisit();
                
                // 延迟恢复锚点，确保新页面内容完全加载
                setTimeout(() => {
                    restoreLastVisitedAnchor();
                    // 设置页面加载完成标志
                    setTimeout(() => {
                        isPageFullyLoaded = true;
                    }, 500);
                }, 300);
            }
        });
        
        const content = document.querySelector('.md-main');
        if (content) {
            observer.observe(content, { childList: true, subtree: true });
        }
    });