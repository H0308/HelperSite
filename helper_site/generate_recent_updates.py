import os
import json
from datetime import datetime
from pathlib import Path
import yaml

def get_file_modification_time(file_path):
    """获取文件的最后修改时间"""
    try:
        timestamp = os.path.getmtime(file_path)
        return datetime.fromtimestamp(timestamp)
    except OSError:
        return None

def get_file_creation_time(file_path):
    """获取文件的创建时间"""
    try:
        timestamp = os.path.getctime(file_path)
        return datetime.fromtimestamp(timestamp)
    except OSError:
        return None

def extract_title_from_md(file_path):
    """从markdown文件中提取标题"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 检查是否有YAML front matter
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                try:
                    front_matter = yaml.safe_load(parts[1])
                    if isinstance(front_matter, dict) and 'title' in front_matter:
                        return front_matter['title']
                except yaml.YAMLError:
                    pass
                content = parts[2]
        
        # 查找第一个Markdown格式的标题
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('# '):
                return line[2:].strip()
            elif line.startswith('## '):
                return line[3:].strip()
        
        # 如果没找到Markdown格式的标题，尝试查找HTML h1标签
        import re
        h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content, re.IGNORECASE)
        if h1_match:
            return h1_match.group(1).strip()
        
        # 如果都没找到标题，使用文件名
        return Path(file_path).stem.replace('-', ' ').replace('_', ' ').title()
    except Exception:
        return Path(file_path).stem.replace('-', ' ').replace('_', ' ').title()

def get_nav_structure():
    """从mkdocs.yml获取导航结构"""
    try:
        with open('mkdocs.yml', 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        return config.get('nav', [])
    except Exception:
        return []

def find_page_in_nav(file_path, nav_structure, current_path=""):
    """在导航结构中查找页面路径"""
    for item in nav_structure:
        if isinstance(item, dict):
            for key, value in item.items():
                if isinstance(value, str):
                    if value == file_path:
                        return current_path + key if current_path else key
                elif isinstance(value, list):
                    result = find_page_in_nav(file_path, value, current_path + key + " > ")
                    if result:
                        return result
        elif isinstance(item, str):
            if item == file_path:
                return current_path.rstrip(" > ")
    return None

def generate_recent_updates(docs_dir='docs', max_items=10):
    """生成最近更新的文档列表"""
    docs_path = Path(docs_dir)
    if not docs_path.exists():
        return []
    
    nav_structure = get_nav_structure()
    recent_files = []
    
    # 遍历所有markdown文件
    for md_file in docs_path.rglob('*.md'):
        # 跳过index.md文件
        if md_file.name == 'index.md' and md_file.parent == docs_path:
            continue
            
        mod_time = get_file_modification_time(md_file)
        created_time = get_file_creation_time(md_file)
        if mod_time and created_time:
            # 获取相对于docs目录的路径
            relative_path = md_file.relative_to(docs_path).as_posix()
            
            # 获取标题
            title = extract_title_from_md(md_file)
            
            # 在导航中查找页面路径
            nav_path = find_page_in_nav(relative_path, nav_structure)
            
            # 生成URL路径
            url_path = relative_path.replace('.md', '.html')
            
            recent_files.append({
                'title': title,
                'relative_path': relative_path,
                'url': url_path,
                'nav_path': nav_path,
                'created_time': created_time,
                'modified_time': mod_time,
                'created_str': created_time.strftime('%Y-%m-%d'),
                'modified_str': mod_time.strftime('%Y-%m-%d')
            })
    
    # 按修改时间排序，最新的在前
    recent_files.sort(key=lambda x: x['modified_time'], reverse=True)
    
    return recent_files[:4]

def generate_html_list(recent_updates):
    """生成HTML格式的最近更新列表"""
    if not recent_updates:
        return '<p>暂无最近更新</p>'
    
    html = '<div class="recent-updates-list">\n'
    
    for update in recent_updates:
        nav_info = f' <span class="nav-path">({update["nav_path"]})</span>' if update['nav_path'] else ''
        html += f'''    <div class="recent-update-item">
        <div class="update-title">
            <a href="{update['url']}">{update['title']}</a>{nav_info}
        </div>
        <div class="update-date">{update['modified_str']}</div>
    </div>\n'''
    
    html += '</div>'
    return html

if __name__ == '__main__':
    # 生成最近更新列表
    recent_updates = generate_recent_updates()
    
    # 生成HTML
    html_content = generate_html_list(recent_updates)
    
    # 保存到文件
    with open('recent_updates.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # 也保存JSON格式供其他用途
    json_data = [{
        'title': item['title'],
        'url': item['url'],
        'nav_path': item['nav_path'],
        'created_str': item['created_str'],
        'modified_str': item['modified_str']
    } for item in recent_updates]
    
    with open('recent_updates.json', 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f"生成了 {len(recent_updates)} 个最新文档（按修改时间排序）")
    print("HTML文件已保存到: recent_updates.html")
    print("JSON文件已保存到: recent_updates.json")