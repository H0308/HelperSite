(function() {
    // 配置允许的域名列表
    const allowedDomains = [
        'www.help-doc.top',
        'help-doc.top',
        'h0308.github.io',
        'localhost',
        '127.0.0.1'
    ];

    // 验证当前域名
    function validateDomain() {
        const currentDomain = window.location.hostname;
        
        // 本地开发环境直接允许
        if (currentDomain.includes('localhost') || currentDomain.includes('127.0.0.1')) {
            return;
        }

        // 检查是否是允许的域名
        const isAllowed = allowedDomains.some(domain => 
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );

        // 仅在域名不允许时重定向
        if (!isAllowed) {
            window.location.href = `https://www.help-doc.top${window.location.pathname}`;
        }
    }

    // 延迟执行域名验证
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(validateDomain, 1000));
    } else {
        setTimeout(validateDomain, 1000);
    }

    // 禁止iframe嵌入
    if (window.top !== window.self) {
        window.top.location.href = window.self.location.href;
    }
})();
