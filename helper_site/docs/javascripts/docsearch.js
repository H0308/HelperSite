// Algolia DocSearch 初始化脚本
document.addEventListener('DOMContentLoaded', function() {
    // 等待 docsearch 库加载完成
    if (typeof docsearch !== 'undefined') {
        initializeDocSearch();
    } else {
        // 如果库还没加载完成，等待一下再尝试
        setTimeout(function() {
            if (typeof docsearch !== 'undefined') {
                initializeDocSearch();
            } else {
                console.error('DocSearch library not loaded');
            }
        }, 1000);
    }
});

function initializeDocSearch() {
    try {
        docsearch({
            appId: 'SDEU4ZQ2OW',
            apiKey: '57fa46cd9411b8431d55daeb5ae52b77',
            indexName: '柯懒不是柯南',
            container: '#docsearch',
            placeholder: '搜索文档...',
            // 中文翻译配置
            translations: {
                button: {
                    buttonText: '搜索',
                    buttonAriaLabel: '搜索'
                },
                modal: {
                    searchBox: {
                        resetButtonTitle: '清除查询条件',
                        resetButtonAriaLabel: '清除查询条件',
                        cancelButtonText: '取消',
                        cancelButtonAriaLabel: '取消'
                    },
                    startScreen: {
                        recentSearchesTitle: '搜索历史',
                        noRecentSearchesText: '没有搜索历史',
                        saveRecentSearchButtonTitle: '保存至搜索历史',
                        removeRecentSearchButtonTitle: '从搜索历史中移除',
                        favoriteSearchesTitle: '收藏',
                        removeFavoriteSearchButtonTitle: '从收藏中移除'
                    },
                    errorScreen: {
                        titleText: '无法获取结果',
                        helpText: '你可能需要检查你的网络连接'
                    },
                    footer: {
                        selectText: '选择',
                        selectKeyAriaLabel: '回车键',
                        navigateText: '切换',
                        navigateUpKeyAriaLabel: '向上箭头',
                        navigateDownKeyAriaLabel: '向下箭头',
                        closeText: '关闭',
                        closeKeyAriaLabel: 'Escape键',
                        searchByText: '搜索提供'
                    },
                    noResultsScreen: {
                        noResultsText: '无法找到相关结果',
                        suggestedQueryText: '你可以尝试查询',
                        reportMissingResultsText: '你认为这个查询应该有结果？',
                        reportMissingResultsLinkText: '点击反馈'
                    }
                }
            },
            // 移除可能干扰导航的自定义配置
            debug: false
        });
        console.log('DocSearch initialized successfully');
    } catch (error) {
        console.error('Error initializing DocSearch:', error);
    }
}

// 为了兼容性，也可以在 window.onload 时再次尝试初始化
window.addEventListener('load', function() {
    if (typeof docsearch !== 'undefined' && !document.querySelector('.DocSearch')) {
        initializeDocSearch();
    }
});