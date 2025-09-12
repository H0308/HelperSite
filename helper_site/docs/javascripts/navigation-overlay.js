/**
 * 导航栏动态覆盖动画效果
 * 实现悬浮元素的浅灰色透明盒子覆盖效果
 * 包含从一个元素挤压到另一个元素的平滑动画
 * 当前激活的导航项不显示覆盖背景
 */
document.addEventListener('DOMContentLoaded', function() {
    const tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return;

    const tabItems = tabsList.querySelectorAll('.md-tabs__item');
    if (tabItems.length === 0) return;

    // 更新覆盖背景的位置和大小
    function updateOverlayPosition(targetItem) {
        if (!targetItem) return;
        
        const rect = targetItem.getBoundingClientRect();
        const listRect = tabsList.getBoundingClientRect();
        
        const left = rect.left - listRect.left;
        const width = rect.width;
        
        // 创建或更新样式
        let styleElement = document.getElementById('navigation-overlay-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'navigation-overlay-styles';
            document.head.appendChild(styleElement);
        }
        
        // 更新样式
        styleElement.textContent = `
            .md-tabs__list::before {
                left: ${left}px !important;
                width: ${width}px !important;
            }
        `;
    }

    // 显示覆盖背景并触发初始动画
    function showOverlayWithAnimation() {
        tabsList.classList.add('show-hover-overlay');
        // 初始显示不需要特殊动画，只需要基础的透明度过渡
    }

    // 获取元素在列表中的位置索引
    function getItemIndex(item) {
        return Array.from(tabItems).indexOf(item);
    }

    // 触发移动动画（根据方向选择动画）
    function triggerMoveAnimation(fromItem, toItem) {
        if (isAnimating) return;
        
        const fromIndex = getItemIndex(fromItem);
        const toIndex = getItemIndex(toItem);
        
        // 清除所有动画类
        tabsList.classList.remove('animating-left', 'animating-right');
        
        isAnimating = true;
        
        // 根据移动方向选择动画
        if (toIndex > fromIndex) {
            // 向右移动
            tabsList.classList.add('animating-right');
        } else {
            // 向左移动
            tabsList.classList.add('animating-left');
        }
        
        // 动画结束后清理
        setTimeout(() => {
            tabsList.classList.remove('animating-left', 'animating-right');
            isAnimating = false;
        }, 600);
    }

    // 隐藏覆盖背景
    function hideOverlay() {
        tabsList.classList.remove('show-hover-overlay', 'animating-left', 'animating-right');
        isAnimating = false;
    }

    // 处理鼠标悬浮事件
    let isAnimating = false;
    let currentHoverItem = null;
    
    tabItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const activeItem = tabsList.querySelector('.md-tabs__item--active');
            
            // 只有当悬浮的不是激活项时才显示覆盖背景
            if (this !== activeItem) {
                // 如果是新的悬浮目标，触发动画
                if (currentHoverItem !== this && !isAnimating) {
                    updateOverlayPosition(this);
                    showOverlayWithAnimation();
                    currentHoverItem = this;
                } else if (currentHoverItem !== this && currentHoverItem !== null) {
                    // 如果是从一个非激活项移动到另一个非激活项，触发移动动画
                    updateOverlayPosition(this);
                    triggerMoveAnimation(currentHoverItem, this);
                    currentHoverItem = this;
                }
            }
        });
        
        item.addEventListener('mouseleave', function() {
            // 鼠标离开时隐藏覆盖背景
            hideOverlay();
            currentHoverItem = null;
        });
    });

    // 处理点击事件（如果导航项被点击激活）
    tabItems.forEach(item => {
        const link = item.querySelector('.md-tabs__link');
        if (link) {
            link.addEventListener('click', function() {
                // 点击后隐藏覆盖背景
                hideOverlay();
            });
        }
    });

    // 监听窗口大小变化，重新计算位置
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // 窗口大小变化时隐藏覆盖背景
            hideOverlay();
        }, 100);
    });
});