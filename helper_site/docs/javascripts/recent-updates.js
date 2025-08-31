// 最近更新功能
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('recent-updates-container');
    if (!container) return;
    
    // 尝试加载最近更新数据
    fetch('/recent_updates.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载最近更新数据');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                renderRecentUpdates(container, data);
            } else {
                container.innerHTML = '<p class="recent-updates-empty">暂无最近更新</p>';
            }
        })
        .catch(error => {
            console.warn('加载最近更新失败:', error);
            // 降级到静态内容
            loadStaticRecentUpdates(container);
        });
});

function renderRecentUpdates(container, updates) {
    const html = `
        <ul class="recent-updates-list">
            ${updates.map(update => `
                <li class="recent-update-item">
                    <div class="recent-update-content">
                        <a href="${update.url}" class="recent-update-title">${update.title}</a>
                        ${update.nav_path ? `<div class="recent-update-nav">${update.nav_path}</div>` : ''}
                    </div>
                    <div class="recent-update-date">${update.modified_str}</div>
                </li>
            `).join('')}
        </ul>
    `;
    container.innerHTML = html;
}

function loadStaticRecentUpdates(container) {
    // 如果动态加载失败，显示一些静态的最近更新
    const staticUpdates = [
        {
            title: 'C++并发支持库',
            url: 'cpp/multi-thread/multi-thread.html',
            nav_path: '编程语言 > C++',
            modified_str: '2024-01-15'
        },
        {
            title: 'Java中的JDK8及后续的重要新特性',
            url: 'Java/new-jdk8-and-after/new-jdk8-and-after.html',
            nav_path: '编程语言 > Java',
            modified_str: '2024-01-10'
        }
    ];
    
    renderRecentUpdates(container, staticUpdates);
}

// 添加刷新最近更新的功能
function refreshRecentUpdates() {
    const container = document.getElementById('recent-updates-container');
    if (!container) return;
    
    container.innerHTML = '<p class="recent-updates-loading">正在刷新最近更新...</p>';
    
    // 重新加载数据
    fetch('/recent_updates.json?t=' + Date.now()) // 添加时间戳避免缓存
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载最近更新数据');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                renderRecentUpdates(container, data);
            } else {
                container.innerHTML = '<p class="recent-updates-empty">暂无最近更新</p>';
            }
        })
        .catch(error => {
            console.warn('刷新最近更新失败:', error);
            loadStaticRecentUpdates(container);
        });
}

// 暴露刷新函数到全局作用域，方便调试
window.refreshRecentUpdates = refreshRecentUpdates;