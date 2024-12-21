// 在 docs/javascripts/theme-switch.js
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.createElement('div');
    themeSwitch.className = 'theme-switch';
    
    // 获取保存的主题
    const savedTheme = localStorage.getItem('preferred-theme') || 'theme1';
    
    // 创建单个切换按钮
    themeSwitch.innerHTML = `
        <button class="theme-btn" onclick="switchTheme()">
            ${savedTheme === 'theme1' ? '旧版主题' : '新版主题'}
        </button>
    `;
    
    // 获取搜索框元素
    const searchEl = document.querySelector('.md-search');
    searchEl.parentNode.insertBefore(themeSwitch, searchEl);

    // 页面加载时应用保存的主题
    applyTheme(savedTheme);
});

function switchTheme() {
    const currentTheme = localStorage.getItem('preferred-theme') || 'theme1';
    const newTheme = currentTheme === 'theme1' ? 'theme2' : 'theme1';
    const btn = document.querySelector('.theme-btn');
    
    // 更新按钮文字
    btn.textContent = newTheme === 'theme1' ? '旧版主题' : '新版主题';
    
    // 添加过渡动画
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
    
    // 应用主题
    applyTheme(newTheme);
    
    // 保存主题选择
    localStorage.setItem('preferred-theme', newTheme);
}

function applyTheme(theme) {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href.includes('theme')) {
            link.disabled = !link.href.includes(theme);
        }
    });
}