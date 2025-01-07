(function() {
    // 配置允许的域名列表
    const allowedDomains = [
        'www.help-doc.top',
        'h0308.github.io/HelperSite/'
    ];

    // 验证当前域名
    function validateDomain() {
        const currentDomain = window.location.hostname;
        if (!allowedDomains.includes(currentDomain)) {
            // 如果域名不在白名单中，重定向到正确域名
            window.location.href = `${allowedDomains[0]}${window.location.pathname}`;
        }
    }

    // 禁止iframe嵌入
    if (window.top !== window.self) {
        window.top.location.href = window.self.location.href;
    }

    // 添加点击劫持保护
    if (typeof window.orientation === 'undefined') {
        const style = document.createElement('style');
        style.innerHTML = 'html { display: none !important; }';
        document.head.appendChild(style);
        
        if (document.body) {
            document.body.style.display = 'block';
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                document.body.style.display = 'block';
            });
        }
    }

    // 启动安全检查
    validateDomain();
})();
