// 动态调整返回顶部按钮位置
function adjustBackToTopPosition() {
    const footer = document.querySelector('.md-footer');
    if (footer) {
        const footerHeight = footer.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', footerHeight + 'px');
    }
}

// 页面加载完成后调整按钮位置
document.addEventListener('DOMContentLoaded', function() {
    adjustBackToTopPosition();
    
    // 监听窗口大小变化，重新调整位置
    window.addEventListener('resize', adjustBackToTopPosition);
    
    // 监听页面内容变化，重新调整位置
    const observer = new MutationObserver(adjustBackToTopPosition);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
});