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