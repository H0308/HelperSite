// 在 docs/javascripts/theme-switch.js
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.createElement('div');
    themeSwitch.className = 'theme-switch';
    
    // 获取保存的主题
    const savedTheme = localStorage.getItem('preferred-theme') || 'theme1';
    
    themeSwitch.innerHTML = `
        <select onchange="switchTheme(this.value)">
            <option value="theme1" ${savedTheme === 'theme1' ? 'selected' : ''}>新版主题</option>
            <option value="theme2" ${savedTheme === 'theme2' ? 'selected' : ''}>旧版主题</option>
        </select>
    `;
    
    // 获取搜索框元素
    const searchEl = document.querySelector('.md-search');
    // 将主题切换器插入到搜索框前面
    searchEl.parentNode.insertBefore(themeSwitch, searchEl);

    // 页面加载时应用保存的主题
    applyTheme(savedTheme);
});

function applyTheme(theme) {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href.includes('theme')) {
            link.disabled = !link.href.includes(theme);
        }
    });
}

function switchTheme(theme) {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    const ANIMATION_DURATION = 800;

    // 创建并添加蒙版
    const overlay = document.createElement('div');
    overlay.className = 'theme-overlay';
    document.body.appendChild(overlay);

    // 激活蒙版
    requestAnimationFrame(() => {
        overlay.classList.add('active');
        document.body.style.transition = `opacity ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        document.body.style.opacity = '0';
    });

    setTimeout(() => {
        // 切换主题并保存选择
        applyTheme(theme);
        localStorage.setItem('preferred-theme', theme);

        // 移除过渡效果
        setTimeout(() => {
            document.body.style.opacity = '1';
            overlay.classList.remove('active');
            
            // 清理蒙版
            setTimeout(() => overlay.remove(), 800);
        }, 100);
    }, ANIMATION_DURATION / 2);
}