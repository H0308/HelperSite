// 页面阅读进度条
document.addEventListener("DOMContentLoaded", () => {
    // 创建阅读进度条
    const progress = document.createElement("div");
    progress.className = "reading-progress";
    document.body.appendChild(progress);

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
    const indicator = document.createElement("div");
    indicator.className = "scroll-indicator";
    document.body.appendChild(indicator);

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

document.getElementsByClassName("md-top")[0].innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8z"></path></svg>';

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
// 添加内容
document.addEventListener("DOMContentLoaded", () => {
    const copyright = document.querySelector(".md-copyright");
    const social = document.querySelector(".md-social");

    const loveDiv = document.createElement("div");
    loveDiv.className = "md-footer-love md-typeset";
    loveDiv.innerHTML = getContent(); // 使用innerHTML渲染HTML标签

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

    copyright.parentNode.insertBefore(loveDiv, social);
});