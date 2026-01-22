<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 关于YAML文件

YAML（YAML Ain't Markup Language）是一种人类可读的数据序列化标准，常用于配置文件和数据交换。以下是YAML的主要语法规则：

## 基本语法规则

- 缩进：使用空格缩进表示层次结构，不能使用Tab键
- 大小写敏感：YAML区分大小写
- 冒号分隔：键值对使用`:`分隔，冒号后必须有空格
- 注释：使用`#`表示注释，从`#`开始到行尾都是注释

## 数据类型

### 标量

```yaml
# 字符串
name: "张三"
title: 'YAML教程'
description: 这是一个字符串  # 可以不加引号

# 数字
age: 25
pi: 3.14159

# 布尔值
is_student: true
is_teacher: false

# null值
parent: null
parent: ~  # 另一种null表示方式
```

### 数组

```yaml
# 使用短横线表示数组
fruits:
  - apple
  - banana
  - orange

# 行内数组写法
colors: [red, green, blue]

# 嵌套数组
matrix:
  - [1, 2, 3]
  - [4, 5, 6]
  - [7, 8, 9]
```

### 对象

```yaml
# 基本对象
person:
  name: 李四
  age: 30
  city: 北京

# 行内对象写法
address: {street: "长安街", number: 100}

# 嵌套对象
company:
  name: 科技公司
  location:
    country: 中国
    city: 上海
    district: 浦东新区
```

## 多行字符串
```yaml
# 保留换行符（|）
description: |
  这是第一行
  这是第二行
  这是第三行

# 折叠换行符（>）
summary: >
  这是一段很长的文字，
  会被折叠成一行，
  换行符会被替换为空格。
```

## 引用和锚点
```yaml
# 定义锚点
defaults: &defaults
  timeout: 30
  retries: 3

# 引用锚点
api_config:
  <<: *defaults
  url: "https://api.example.com"

database_config:
  <<: *defaults
  host: "localhost"
```

## 文档分隔

```yaml
# 第一个文档
---
name: 文档1
version: 1.0

# 第二个文档
---
name: 文档2
version: 2.0

# 文档结束标记
...
```

## Python与YAML

在Python中存在第三方库可以快速读取YAML文件和写入YAML文件，安装`PyYAML`即可。常用的接口如下：

1. `safe_dump(data, stream=None, **kwds)`：将Python对象转换并写入到YAML文件中
2. `safe_load(stream)`：读取YAML文件并转换为Python对象

例如写入下面的内容：

```py
data = {
    "name": "zhangsan",
    "age": 18,
    "hobbies": {
        "water": [ "swimming", "diving" ],
        "land": [ "running", "playing" ]
    },
    "properties": [
        { "job": "engineer", "likes": "game" }
    ]
}
```

编写读取代码和写入代码：

=== "读取"

    ```py
    def write_yaml():
        with open("test.yml", "w", encoding="utf-8") as f:
            yaml.safe_dump(data, f)
    ```

=== "写入"

    ```py
    def read_yaml():
        with open("test.yml", "r", encoding="utf-8") as f:
            data1 = yaml.safe_load(f)
            print(data1)
    ```

测试代码：

```py
def test_yaml():
    write_yaml()
    read_yaml()
```

得到输出结果：

```
cases/test12.py::test_yaml {'age': 18, 'hobbies': {'land': ['running', 'playing'], 'water': ['swimming', 'diving']}, 'name': 'zhangsan', 'properties': [{'job': 'engineer', 'likes': 'game'}]}
PASSED
```

对应的YAML文件`test.yml`内容如下：

```yaml
age: 18
hobbies:
  land:
    - running
    - playing
  water:
    - swimming
    - diving
name: zhangsan
properties:
  - job: engineer
    likes: game
```