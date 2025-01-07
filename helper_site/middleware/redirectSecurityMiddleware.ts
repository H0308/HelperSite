import { NextFunction, Request, Response } from 'express';

declare module 'express' {
    interface Request {
        originalRedirectUrl?: string;
    }
}

const ALLOWED_DOMAINS = ['www.help-doc.top'];
const ALLOWED_PROTOCOLS = ['https:', 'http:'];
const MAX_URL_LENGTH = 2083; // 标准 URL 最大长度

export const redirectSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const redirectUrl = req.query.redirect as string;
    
    if (!redirectUrl) {
        return next();
    }

    // 检查 URL 长度
    if (redirectUrl.length > MAX_URL_LENGTH) {
        return res.status(400).json({ error: 'URL 长度超出限制' });
    }

    try {
        const url = new URL(redirectUrl);
        
        // 验证协议
        if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
            return res.status(403).json({ error: '不允许的协议类型' });
        }

        // 验证域名
        if (!ALLOWED_DOMAINS.includes(url.hostname)) {
            return res.status(403).json({ error: '不允许重定向到未授权的域名' });
        }

        // 检查 URL 是否包含危险字符
        const dangerousChars = /[<>'";&()]|javascript:/i;
        if (dangerousChars.test(redirectUrl)) {
            return res.status(403).json({ error: 'URL 包含非法字符' });
        }

        // 存储原始重定向URL以供后续验证
        req.originalRedirectUrl = redirectUrl;
        return next();
    } catch {
        return res.status(400).json({ error: '无效的重定向 URL' });
    }
};
