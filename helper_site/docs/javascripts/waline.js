// 确保DOM完全加载后再初始化Waline
document.addEventListener('DOMContentLoaded', async function () {
    // 检查waline容器是否存在
    const walineContainer = document.getElementById('waline');

    const { init } = await import('https://unpkg.com/@waline/client@v3/dist/waline.js');

    const locale = {
        placeholder: "欢迎评论（登录后才可发布评论）",
        oldest: "最早评论",
        latest: "最新评论",
        hottest: "点赞量最多",
    };

    // 添加延迟确保页面完全渲染
    init({
        el: '#waline',
        serverURL: 'https://waline-ten-swart.vercel.app/',
        emoji: [
            '//unpkg.com/@waline/emojis@1.2.0/bilibili',
            '//unpkg.com/@waline/emojis@1.2.0/bmoji',
            '//unpkg.com/@waline/emojis@1.2.0/qq',
            'https://unpkg.com/@waline/emojis@1.2.0/tw-emoji',
            '//unpkg.com/@waline/emojis@1.2.0/weibo',
        ],
        lang: 'zh-CN',
        comment: true,
        search: false,
        meta: [],
        requiredMeta: [],
        locale,
        // 添加错误处理
        onError: function (error) {
            console.error('Waline initialization error:', error);
        }
    });
});