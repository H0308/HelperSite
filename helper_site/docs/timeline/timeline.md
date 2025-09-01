---
changelog: True
glightbox: false
---
<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 网站时间线

<div class="time-indicator">
  <div class="indicator-header" onclick="toggleTimeView()">
    <div class="indicator-pill">
      <span id="runtime-display-short">加载中...</span>
      <svg class="indicator-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 0C794.770286 0 1024 229.229714 1024 512S794.770286 1024 512 1024 0 794.770286 0 512 229.229714 0 512 0z m259.900952 447.000381a28.623238 28.623238 0 0 0-39.984762 0l-221.476571 217.331809-218.258286-214.211047a28.623238 28.623238 0 0 0-40.033523 0 27.452952 27.452952 0 0 0 0 39.302095l238.250666 233.862095a28.623238 28.623238 0 0 0 40.033524 0l241.468952-236.982857a27.40419 27.40419 0 0 0 0-39.302095z" fill="currentColor"/>
      </svg>
    </div>
  </div>
  <div class="time-details">
    <div class="time-grid">
      <div class="time-cell">
        <div class="cell-value" id="hours">00</div>
        <div class="cell-label">时</div>
      </div>
      <div class="time-cell">
        <div class="cell-value" id="minutes">00</div>
        <div class="cell-label">分</div>
      </div>
      <div class="time-cell">
        <div class="cell-value" id="seconds">00</div>
        <div class="cell-label">秒</div>
      </div>
    </div>
    <div class="time-info">
      <div id="date-display" class="date-display">星期一，1月1日</div>
      <div id="runtime-display" class="runtime-display">加载中...</div>
    </div>
  </div>
</div>

!!! abstract

    本部分主要提示网站的结构更新，并不会对网站具体内容进行展示和描述

<script>
  document.addEventListener('DOMContentLoaded', function() {
    updateRuntime();
    updateDigitalClock();
    
    setInterval(function() {
      updateRuntime();
      updateDigitalClock();
    }, 1000);
  });
  
  function toggleTimeView() {
    const timeDetails = document.querySelector('.time-details');
    const icon = document.querySelector('.indicator-icon');
    
    if (timeDetails.classList.contains('expanded')) {
      timeDetails.classList.remove('expanded');
      icon.style.transform = 'rotate(0deg)';
    } else {
      timeDetails.classList.add('expanded');
      icon.style.transform = 'rotate(180deg)';
    }
  }

  // 计算网站运行时间
  function calculateRuntime() {
      const start = new Date('2024-08-08T00:00:00+08:00'); // 中国时间2024年8月8日00:00:00
      const now = new Date();
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `本站已运行 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
  }
  
  function updateRuntime() {
    const runtimeDisplay = document.getElementById('runtime-display');
    const shortDisplay = document.getElementById('runtime-display-short');
    const runtime = calculateRuntime();
    
    if(runtimeDisplay) {
      runtimeDisplay.textContent = runtime;
    }
    
    if(shortDisplay) {
      const days = runtime.match(/(\d+)\s*天/);
      if(days && days[1]) {
        shortDisplay.textContent = `网站已运行 ${days[1]} 天`;
      } else {
        shortDisplay.textContent = '网站运行时间';
      }
    }
  }
  
  function updateDigitalClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    const month = now.getMonth() + 1;
    const date = now.getDate();
    document.getElementById('date-display').textContent = `${weekday}，${month}月${date}日`;
  }
</script>

<style>
  .time-indicator {
    margin: 0.5rem 0 2.5rem;
  }
  
  .indicator-header {
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
  }
  
  .indicator-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    background: rgba(77, 166, 218, 0.1);
    border: 1px solid rgba(77, 166, 218, 0.2);
    font-size: 0.85rem;
    color: var(--md-typeset-color);
    transition: all 0.2s ease;
  }
  
  .indicator-pill:hover {
    background: rgba(77, 166, 218, 0.15);
    transform: translateY(-1px);
  }
  
  .indicator-icon {
    margin-left: 0.5rem;
    width: 14px;
    height: 14px;
    color: #4A90E2;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  .time-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    margin-top: 0.5rem;
    border-radius: 8px;
    background: var(--md-default-bg-color);
  }
  
  .time-details.expanded {
    max-height: 220px;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  }
  
  .time-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .time-cell {
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    background: rgba(77, 166, 218, 0.05);
  }
  
  .cell-value {
    font-family: "MaokenZhuyuanTi";
    font-size: 1.8rem;
    font-weight: 600;
    color: rgba(77, 166, 218, 0.9);
    line-height: 1;
  }
  
  .cell-label {
    font-size: 0.75rem;
    color: var(--md-default-fg-color--light);
    margin-top: 5px;
  }
  
  .time-info {
    text-align: center;
    padding-top: 10px;
    border-top: 1px dashed rgba(0, 0, 0, 0.05);
  }
  
  .date-display {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
  
  .runtime-display {
    font-size: 0.85rem;
    color: var(--md-typeset-a-color);
  }
</style>

## 2025年

{{ 2025 }}

## 2024年

{{ 2024 }}
