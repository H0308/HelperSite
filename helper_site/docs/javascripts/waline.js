// 确保DOM完全加载后再初始化Waline
document.addEventListener('DOMContentLoaded', async function () {
    // 检查waline容器是否存在
    const walineContainer = document.getElementById('waline');
    if (!walineContainer) {
        console.warn('Waline container not found');
        return;
    }

    try {
        const { init } = await import('https://unpkg.com/@waline/client@v3/dist/waline.js');

        // 添加延迟确保页面完全渲染
        setTimeout(() => {
            init({
                el: '#waline',
                serverURL: 'https://bejewelled-medovik-c829bd.netlify.app/.netlify/functions/comment',
                emoji: [
                    '//unpkg.com/@waline/emojis@1.2.0/bilibili',
                    '//unpkg.com/@waline/emojis@1.2.0/bmoji',
                    '//unpkg.com/@waline/emojis@1.2.0/qq',
                    'https://unpkg.com/@waline/emojis@1.2.0/tw-emoji',
                    '//unpkg.com/@waline/emojis@1.2.0/weibo',
                ],
                lang: 'zh-CN',
                comment: true,
                // 添加错误处理
                onError: function (error) {
                    console.error('Waline initialization error:', error);
                }
            });
        }, 100);
    } catch (error) {
        console.error('Failed to load Waline:', error);
    }
});