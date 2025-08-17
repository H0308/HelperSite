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