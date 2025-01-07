import express from 'express';
import helmet from 'helmet';
import rateLimit, { Options } from 'express-rate-limit';
import { redirectSecurityMiddleware } from './middleware/redirectSecurityMiddleware';

const app = express();

// 基础安全头部
app.use(helmet());

// 速率限制
const limiterOptions: Partial<Options> = {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制每个IP 15分钟内最多100个请求
};
const limiter = rateLimit(limiterOptions);
app.use(limiter);

// 增强的 CSP 配置
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", "'nonce-{NONCE}'"], // 需要在路由中生成nonce
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []  // 修改这里
    },
    reportOnly: false
}));

// 防止点击劫持
app.use(helmet.frameguard({ action: 'deny' }));

// 禁用 X-Powered-By 头
app.disable('x-powered-by');

// CORS 配置
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://www.help-doc.top');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// 重定向安全中间件
app.use(redirectSecurityMiddleware);

// 全局错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});

// ...existing code...