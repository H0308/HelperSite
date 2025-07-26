// 页面阅读进度条
document.addEventListener("DOMContentLoaded", () => {
    // 获取已存在的阅读进度条元素
    const progress = document.querySelector(".reading-progress");
    if (!progress) return;

    // 阅读进度条逻辑
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const docHeight =
                    document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (window.scrollY / docHeight) * 100;
                progress.style.setProperty(
                    "--scroll-percent",
                    `${scrollPercent}%`
                );
                ticking = false;
            });
            ticking = true;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // 获取已存在的滚动指示器元素
    const indicator = document.querySelector(".scroll-indicator");
    if (!indicator) return;

    const updateScrollIndicator = () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercent = (scrolled / (docHeight - viewHeight)) * 100;

        indicator.style.setProperty("--scroll-percent", `${scrollPercent}%`);
        indicator.style.height = `${scrollPercent}%`;
    };

    window.addEventListener("scroll", updateScrollIndicator);
    updateScrollIndicator();
});
// 代码块复制炫光效果
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