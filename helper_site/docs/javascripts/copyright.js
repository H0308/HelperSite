// 在脚本最后部分添加，switchTheme函数后面

// 替换现有的版权提示代码块

document.addEventListener('DOMContentLoaded', function () {
    // 检查用户是否是首次访问
    const hasSeenCopyright = localStorage.getItem('has-seen-copyright');

    if (!hasSeenCopyright) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.75);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            animation: copyrightFadeIn 0.4s ease-out;
        `;

        // 创建版权提示框
        const copyrightBox = document.createElement('div');
        copyrightBox.style.cssText = `
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 16px;
            padding: 32px 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
            position: relative;
            animation: copyrightSlideIn 0.5s cubic-bezier(0.17, 0.84, 0.44, 1);
            border-left: 6px solid #4da6da;
        `;

        // 添加版权内容
        copyrightBox.innerHTML = `
            <h2 style="
                color: #275796; 
                margin-top: 0; 
                font-family: var(--md-header-font);
                font-size: 28px;
                margin-bottom: 20px;
                border-bottom: 2px solid rgba(77, 166, 218, 0.2);
                padding-bottom: 12px;
            ">版权提示</h2>
            
            <p style="
                font-size: 18px;
                line-height: 1.6;
                margin-bottom: 16px;
                color: #333;
            ">版权声明：本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" style="
                color: #4da6da;
                text-decoration: none;
                border-bottom: 1px solid rgba(77, 166, 218, 0.3);
                transition: all 0.2s;
                font-weight: bold;
            ">CC BY-NC-SA 4.0</a> 许可协议。</p>
            
            <p style="
                font-size: 18px;
                line-height: 1.6;
                margin-bottom: 20px;
                color: #333;
            ">转载请注明来自<a href="https://www.help-doc.top/%E4%BD%9C%E8%80%85/%E4%BD%9C%E8%80%85.html" style="
                color: #4da6da;
                text-decoration: none;
                border-bottom: 1px solid rgba(77, 166, 218, 0.3);
                transition: all 0.2s;
                font-weight: bold;
            ">柯懒不是柯南</a>的个人网站！</p>
            
            <div style="
                background-color: rgba(77, 166, 218, 0.08);
                border-radius: 12px;
                padding: 16px 20px;
                margin-top: 20px;
                margin-bottom: 25px;
                display: flex;
                align-items: flex-start;
                border-left: 4px solid rgba(77, 166, 218, 0.6);
            ">
                <svg viewBox="0 0 1024 1024" width="24" height="24" style="
                    min-width: 24px;
                    fill: #4da6da;
                    margin-right: 12px;
                    margin-top: 3px;
                ">
                    <path d="M512 64C264.597333 64 64 264.597333 64 512s200.597333 448 448 448 448-200.597333 448-448S759.402667 64 512 64z m-32 232c0-4.394667 3.605333-8 8-8h48c4.394667 0 8 3.605333 8 8v272a8.021333 8.021333 0 0 1-8 8h-48a8.021333 8.021333 0 0 1-8-8v-272zM512 736a48 48 0 1 1 0.021333-96.021333A48 48 0 0 1 512 736z"></path>
                </svg>
                <span style="
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                ">本网站的内容不具有权威性，请注意对信息进行甄别。如发现错误，欢迎指正。</span>
            </div>
            
            <button id="copyright-confirm" style="
                background: linear-gradient(135deg, #4da6da 0%, #275796 100%);
                color: white;
                border: none;
                padding: 12px 28px;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                font-family: var(--md-text-font);
                transition: all 0.3s;
                display: block;
                margin: 0 auto;
                font-weight: 500;
                box-shadow: 0 4px 10px rgba(77, 166, 218, 0.2);
            ">我已了解</button>
        `;

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes copyrightFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes copyrightSlideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-30px); 
                }
                to { 
                    opacity: 1;
                    transform: translateY(0); 
                }
            }
            
            @keyframes copyrightFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes copyrightSlideOut {
                from { 
                    opacity: 1;
                    transform: translateY(0); 
                }
                to { 
                    opacity: 0;
                    transform: translateY(30px); 
                }
            }
            
            #copyright-confirm:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 15px rgba(77, 166, 218, 0.35);
            }
            
            #copyright-confirm:active {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(77, 166, 218, 0.25);
            }
            
            /* 适配移动设备 */
            @media (max-width: 768px) {
                #copyright-box h2 {
                    font-size: 24px !important;
                }
                
                #copyright-box p {
                    font-size: 16px !important;
                }
                
                #copyright-box {
                    padding: 24px 25px !important;
                }
            }
        `;

        // 添加元素到DOM
        document.head.appendChild(style);
        overlay.appendChild(copyrightBox);
        document.body.appendChild(overlay);

        // 添加确认按钮点击事件
        document.getElementById('copyright-confirm').addEventListener('click', function () {
            // 记录用户已看过提示
            localStorage.setItem('has-seen-copyright', 'true');

            // 添加淡出动画
            overlay.style.animation = 'copyrightFadeOut 0.4s ease-out forwards';
            copyrightBox.style.animation = 'copyrightSlideOut 0.4s ease-out forwards';

            // 动画结束后移除元素
            setTimeout(function () {
                document.body.removeChild(overlay);
            }, 400);
        });

        // 添加链接悬停效果
        const links = copyrightBox.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('mouseover', function () {
                this.style.borderBottomColor = 'rgba(77, 166, 218, 0.8)';
                this.style.color = '#275796';
            });
            link.addEventListener('mouseout', function () {
                this.style.borderBottomColor = 'rgba(77, 166, 218, 0.3)';
                this.style.color = '#4da6da';
            });
        });
    }
});