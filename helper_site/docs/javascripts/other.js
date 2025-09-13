document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".md-clipboard").forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const codeBlock = this.closest(".highlight");

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
// 获取内容
function getContent() {
    // 使用HTML标记增强显示效果
    return `一闪一闪亮晶晶，不及<span class="love-highlight">小亮</span><span class="love-heart">♥</span>照我心。To Li Liang`;
}

// 为已存在的爱心元素添加交互效果
document.addEventListener("DOMContentLoaded", () => {
    const loveDiv = document.querySelector(".md-footer-love");
    if (!loveDiv) return;

    // 添加交互效果
    loveDiv.addEventListener("mouseenter", () => {
        const heart = loveDiv.querySelector(".love-heart");
        if (heart) {
            heart.style.animationDuration = "0.8s";
        }
    });

    loveDiv.addEventListener("mouseleave", () => {
        const heart = loveDiv.querySelector(".love-heart");
        if (heart) {
            heart.style.animationDuration = "1.5s";
        }
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

// 动态调整返回顶部按钮位置
// function adjustBackToTopPosition() {
//     const footer = document.querySelector('.md-footer');
//     if (footer) {
//         const footerHeight = footer.offsetHeight;
//         document.documentElement.style.setProperty('--footer-height', footerHeight + 'px');
//     }
// }

// 页面加载完成后调整按钮位置
// document.addEventListener('DOMContentLoaded', function() {
//     adjustBackToTopPosition();
    
//     window.addEventListener('resize', adjustBackToTopPosition);
    
//     const observer = new MutationObserver(adjustBackToTopPosition);
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//         attributes: true,
//         attributeFilter: ['class', 'style']
//     });
// });