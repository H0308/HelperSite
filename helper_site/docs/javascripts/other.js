// 将复制按钮移动到代码块容器下，使其不随内容滚动，并添加点击炫光效果
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".highlight").forEach((highlight) => {
        const nav = highlight.querySelector(".md-code__nav");
        if (nav && nav.parentElement !== highlight) {
            // 将按钮容器移动到.highlight下
            highlight.appendChild(nav);
            // 设置定位样式
            nav.style.position = "absolute";
            nav.style.top = "0.2rem";
            nav.style.right = "0.5rem";
            nav.style.left = "auto";
            nav.style.zIndex = "10";
        }
    });

    // 为复制按钮添加点击炫光效果
    document.querySelectorAll(".md-code__button").forEach((button) => {
        button.addEventListener("click", function () {
            const codeBlock = this.closest(".highlight");
            if (!codeBlock) return;

            // 移除已存在的炫光元素
            const oldFlash = codeBlock.querySelector(".copy-flash");
            if (oldFlash) {
                oldFlash.remove();
            }

            // 创建新的炫光元素
            const flash = document.createElement("div");
            flash.className = "copy-flash";
            codeBlock.appendChild(flash);

            // 动画结束后移除元素
            flash.addEventListener("animationend", () => {
                flash.remove();
            });
        });
    });
});
// 动态调整 tooltip 位置以防止溢出
function adjustTooltipPosition() {
    const tooltips = document.querySelectorAll('.custom-tooltip');

    tooltips.forEach(tooltip => {
        // 移除之前的定位类
        tooltip.classList.remove('tooltip-left', 'tooltip-right');

        // 获取元素位置信息
        const rect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // 计算 tooltip 的预期宽度（最大 300px）
        const tooltipWidth = Math.min(300, viewportWidth - 20);

        // 检查是否会溢出右边
        const rightOverflow = (rect.left + tooltipWidth / 2) > (viewportWidth - 10);

        // 检查是否会溢出左边
        const leftOverflow = (rect.left - tooltipWidth / 2) < 10;

        if (rightOverflow) {
            tooltip.classList.add('tooltip-right');
        } else if (leftOverflow) {
            tooltip.classList.add('tooltip-left');
        }
        // 如果都不溢出，保持默认居中
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', adjustTooltipPosition);

// 窗口大小改变时重新调整
window.addEventListener('resize', adjustTooltipPosition);

// 在移动设备上，当用户点击 tooltip 时也重新调整
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('custom-tooltip')) {
        setTimeout(adjustTooltipPosition, 10);
    }
});

// 为激活目录添加竖线
function updateActiveBorder() {
    // 移除所有现有的边框样式
    document.querySelectorAll('.active-border').forEach(el => {
        el.classList.remove('active-border');
    });
    
    let actives = document.querySelectorAll('.md-nav--secondary .md-nav__link--active');
    
    // 取到激活元素
    let active = actives[1];
    // 为激活元素的父元素添加svg边框
    let active_parent = active && active.parentNode;
    if(active && active_parent) {
        // 为激活元素的父元素添加左侧边框样式
        active_parent.classList.add('active-border');
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', updateActiveBorder);

// 监听滚动事件，实时更新激活边框
window.addEventListener('scroll', function() {
    // 使用节流来优化性能
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(updateActiveBorder, 5);
});

// 监听导航点击事件，立即更新边框
document.addEventListener('click', function(e) {
    if (e.target.closest('.md-nav__link')) {
        setTimeout(updateActiveBorder, 5);
    }
});