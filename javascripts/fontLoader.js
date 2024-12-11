// 字体加载管理器 (新建 fontLoader.js)
class FontLoader {
    constructor() {
        this.fonts = {
            'OPPOSans': '../assets/fonts/OPPOSans-Regular.woff2',
            'LXGWZhenKai': '../assets/fonts/LXGWZhenKai-Regular.woff2'
        };
    }

    async loadFonts() {
        const fontPromises = Object.entries(this.fonts).map(async ([family, url]) => {
            const font = new FontFace(family, `url(${url})`, {
                display: 'swap',
                unicodeRange: 'U+4E00-9FFF, U+0000-007F'
            });

            // 预加载字体
            await font.load();
            document.fonts.add(font);
            
            // 缓存字体到 localStorage
            try {
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                localStorage.setItem(`font_${family}`, buffer);
            } catch (e) {
                console.warn('字体缓存失败:', e);
            }
        });

        await Promise.all(fontPromises);
    }

    async loadFromCache() {
        for (const [family] of Object.entries(this.fonts)) {
            const cached = localStorage.getItem(`font_${family}`);
            if (cached) {
                const font = new FontFace(family, cached);
                await font.load();
                document.fonts.add(font);
            }
        }
    }
}

// 初始化字体加载
const fontLoader = new FontLoader();
fontLoader.loadFromCache().then(() => {
    fontLoader.loadFonts();
});