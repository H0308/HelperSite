// 页面阅读进度条
document.addEventListener('DOMContentLoaded', () => {
    // 创建阅读进度条
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    document.body.appendChild(progress);

    // 阅读进度条逻辑
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (window.scrollY / docHeight) * 100;
                progress.style.setProperty('--scroll-percent', `${scrollPercent}%`);
                ticking = false;
            });
            ticking = true;
        }
    });
});

// 标题动画效果
document.querySelectorAll('.md-content h1, .md-content h2, .md-content h3').forEach(heading => {
    // 添加交互动画
    heading.addEventListener('mouseenter', () => {
        heading.style.transform = 'translateX(10px)';
        requestAnimationFrame(() => {
            heading.style.transform = 'translateX(0)';
        });
    });
    
    // 添加点击波纹效果
    heading.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(77, 166, 218, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
        `;
        
        ripple.style.left = e.clientX - heading.getBoundingClientRect().left + 'px';
        ripple.style.top = e.clientY - heading.getBoundingClientRect().top + 'px';
        
        heading.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);

    const updateScrollIndicator = () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercent = (scrolled / (docHeight - viewHeight)) * 100;
        
        indicator.style.setProperty('--scroll-percent', `${scrollPercent}%`);
        indicator.style.height = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator();
});

document.getElementsByClassName("md-top")[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8z"></path></svg>';

// 页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
});
// 代码块复制炫光效果
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.md-clipboard').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const codeBlock = this.closest('.highlight');
            
            // 移除已存在的炫光元素
            const oldFlash = codeBlock.querySelector('.copy-flash');
            if (oldFlash) {
                oldFlash.remove();
            }
            
            // 创建新的炫光元素
            const flash = document.createElement('div');
            flash.className = 'copy-flash';
            codeBlock.appendChild(flash);
            
            // 动画结束后移除元素
            flash.addEventListener('animationend', () => {
                flash.remove();
            });
        });
    });
});

// 计算网站运行时间
function calculateRuntime() {
    const start = new Date('2024-08-08T00:00:00+08:00'); // 中国时间2024年8月8日00:00:00
    const now = new Date();
    const diff = now - start;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `本站已运行 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
}
// 添加运行时间到页脚
document.addEventListener("DOMContentLoaded", () => {
    const footerInner = document.querySelector(
        ".md-footer-meta__inner.md-grid"
    );
    const copyright = document.querySelector(".md-copyright");
    const social = document.querySelector(".md-social");

    const runtimeDiv = document.createElement("div");
    runtimeDiv.className = "md-footer-runtime md-typeset";

    copyright.parentNode.insertBefore(runtimeDiv, social);

    function updateRuntime() {
        runtimeDiv.textContent = calculateRuntime();
    }

    updateRuntime();
    setInterval(updateRuntime, 1000);
});