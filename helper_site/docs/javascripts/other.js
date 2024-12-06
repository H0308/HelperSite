// 页面加载进度条
document.addEventListener('DOMContentLoaded', () => {
    const bar = document.createElement('div');
    bar.className = 'loading-bar';
    document.body.appendChild(bar);

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => bar.remove(), 300);
        } else {
            width += Math.random() * 10;
            bar.style.width = `${Math.min(width, 100)}%`;
        }
    }, 100);
});

// 阅读进度条
document.addEventListener('DOMContentLoaded', () => {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (window.scrollY / docHeight) * 100;
        progress.style.setProperty('--scroll-percent', `${scrollPercent}%`);
    });
});

// 文字渐显效果
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.md-content p, .md-content h1, .md-content h2, .md-content h3').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease-out';
    observer.observe(el);
});

// 设置元素动画延迟
document.querySelectorAll('.md-content > *').forEach((el, i) => {
    el.style.setProperty('--animation-order', i);
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