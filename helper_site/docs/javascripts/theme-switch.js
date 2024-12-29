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
    
    // 立即应用保存的主题，避免闪烁
    const theme1Link = document.querySelector('link[href*="theme1"]');
    const theme2Link = document.querySelector('link[href*="theme2"]');
    
    if (savedTheme === 'theme1') {
        theme1Link.removeAttribute('disabled');
        theme2Link.setAttribute('disabled', 'true');
    } else {
        theme2Link.removeAttribute('disabled');
        theme1Link.setAttribute('disabled', 'true');
    }
});

function switchTheme() {
    const currentTheme = localStorage.getItem('preferred-theme') || 'theme1';
    const newTheme = currentTheme === 'theme1' ? 'theme2' : 'theme1';
    
    // 更新主题样式
    const theme1Link = document.querySelector('link[href*="theme1"]');
    const theme2Link = document.querySelector('link[href*="theme2"]');
    
    if (newTheme === 'theme1') {
        theme1Link.removeAttribute('disabled');
        theme2Link.setAttribute('disabled', 'true');
    } else {
        theme2Link.removeAttribute('disabled');
        theme1Link.setAttribute('disabled', 'true');
    }
    
    // 保存主题选择
    localStorage.setItem('preferred-theme', newTheme);
    
    // 更新按钮文本
    const themeBtn = document.querySelector('.theme-btn');
    themeBtn.textContent = newTheme === 'theme1' ? '旧版主题' : '新版主题';
}