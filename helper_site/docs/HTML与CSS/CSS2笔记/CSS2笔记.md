# CSS2笔记

## CSS三种写法及优先级

### 行内样式

```html
<p style="color: red;">文字</p>
```

### 内部样式

```html
<style>
    p {
        color: red;
    }
</style>

<body>
    <p>
        文字
    </p>
</body>
```

### 外部样式

=== "CSS文件"

    ```css
    p {
        color: red;
    }
    ```

=== "HTML文件"

    ```html
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    <body>
        <p>
            文字
        </p>
    </body>
    ```

### 优先级

行内样式 > 内部样式 = 外部样式

## 基础选择器

选择器：负责选择元素定向设置样式，所有选择器都有自己的特点，根据需要选择即可，不需要太纠结选择哪一种选择器

### 通配选择器

选中所有HTML元素，一般用于清除样式

```css
* {
    /* 样式 */
}
```

### 元素选择器

选择页面中的某一个HTML标签（元素）设置样式

```css
h1 {
    /* 为h1标签设置样式 */
}
```

### 类选择器

使用全局属性`class`为元素指定值，选择相同`class`值的元素设置样式。设置样式时，对应的`class`名需要带`.`

```html
<style>
    /* class名前需要带. */
    .box {
        /* 为class名为box的元素设置样式 */
    }
</style>

<body>
    <!-- 选择下面的盒子 -->
    <div class="box">
        内容
    </div>
    <!-- 不选择下面的盒子 -->
    <div>
        内容
    </div>
</body>
```

注意：一个标签不可以有多个`class`，但是一个`class`可以有多个值，不同的值以空格分隔，最后样式会合并

### ID选择器

使用全局属性`id`为标签指定值，选择指定的`id`值单独为元素设置样式。设置样式时，对应的`id`值前需要带`#`

与`class`不同的是，同一个`id`值只能出现一次

```html
<style>
    #box {
        /* 为id为box的元素设置样式 */
    }
</style>

<body>
    <!-- 为下面的盒子设置样式 -->
    <div id="box">
        内容
    </div>
</body>
```

需要注意，一个标签既可以有`id`属性，也可以有`class`属性，同样只能有一个`id`属性

## 复合选择器

本部分共有两种：

1. 基于基础选择器，多个基础选择器之间的组合，包括：交集选择器、并集选择器、后代选择器、子代选择器和兄弟选择器
2. 在基础选择器之上进行拓展，包括：属性选择器、伪类选择器和伪元素选择器

!!! note

    需要注意，因为第二种是在基础选择器之上对已有的基础选择器进行拓展，所以第一种复合选择器对于第二种也是可以使用的

### 基于基础选择器

#### 交集选择器

不同的基础选择器之间用`.`连接，表示既满足……又满足……：

```css
/* 选择类名为box的p元素 */
p.box {
    /* 样式 */
}

/* 选择类名包含box1和box2的元素 */
.box1.box2 {
    
}
```

#### 并集选择器（分组选择器）

基础选择器之间用`,`分隔，表示满足其中之一：

```css
/* 选择有box1或者box2的元素 */
.box1, .box2 {
    /* 样式 */
}
```

并集选择器，通常用于集体声明，可以缩小样式表体积

#### 后代选择器

选择当前元素所有的后代元素，父元素和后代元素之间用空格` `隔开：

```html
<style>
    /* 选择ul中的li */
    ul li {

    }

    /* 选择ul中的li中的span */
    ul li span {

    }
</style>

<body>
    <ul>
        <!-- 下面的所有li和span都会被选中 -->
        <li>
            内容
        </li>
        <li>
            <span>内容</span>
        </li>
    </ul>
</body>
```

#### 子代选择器

选择当前元素的所有子代元素，父元素和子元素之间使用`>`分隔：

```html
<style>
    /* 选择ul的孩子li元素 */
    ul>li {
        /* 样式 */
    }
</style>

<body>
    <ul>
        <!-- 只会设置li中的内容样式，span的内容不会改变 -->
        <li>
            内容
            <span>内容</span>
        </li>
    </ul>
</body>
```

需要注意，如果对`li`设置背景颜色等其他整体样式，那么`span`的背景也会跟着改变，因为`span`是嵌套在li内部，如果单独为`span`设置背景，就不会出现`li`和`span`的背景相同

#### 单兄弟选择器（后兄弟元素）

选择与当前元素相邻的下一个元素，两个元素之间使用`+`进行分隔：

```html
<style>
    /* 选择div后的兄弟p元素 */
    div+p {

    }
</style>
<body>
    <div>
        <!-- 不会选择下面的p标签 -->
        <p>

        </p>
    </div>
    <!-- 选择下面的p标签 -->
    <p></p>
    <!-- 不会选择下面的p标签 -->
    <p></p>
</body>
```

#### 多兄弟选择器（后兄弟元素）

选择当前元素的所有兄弟元素，兄弟元素之间用`~`分隔：

```html
<style>
    /* 选择div后所有的p兄弟元素 */
    div~p{

    }
</style>

<body>
    <div>

    </div>
    <!-- 选择下面所有的p元素 -->
    <p></p>
    <p></p>
    <p></p>
    <p></p>
</body>
```

### 拓展基础选择器

#### 属性选择器

选择存在满足条件属性的元素，元素属性使用`[]`包裹，有下面几种使用：

1. `[属性名]` 选中**含有**某个属性的元素
2. `[属性名="值"]` 选中包含某个属性，且属性值**等于**指定值的元素
3. `[属性名^="值"]` 选中包含某个属性，且属性值以指定的值**开头**（或者第一个值的开头字母为指定值）的元素
4. `[属性名$="值"]` 选中包含某个属性，且属性值以指定的值**结尾**（或者最后一个值的最后一个字母为指定值）的元素
5. `[属性名*="值"]` 选中包含某个属性，属性值**包含**指定值（或者某一个值中含有指定值）的元素

```html
<style>
    /* 属性有title */
    div[title] {
        color: red;
    }
    /* 属性值以a开头 */
    div[title^="a"] {
        color: green;
    }
    /* 属性值为e结尾 */
    div[title$="e"] {
        color: blue;
    }
    /* 属性值为包含e的元素 */
    div[title*="e"] {
        color: lightblue;
    }
</style>

<body>
    <div title="apple orange">内容</div>
    <div title="a">内容</div>
    <div title="e">内容</div>
</body>
```

#### 伪类选择器

伪类选择器主要作用是选择拥有特殊效果的元素，因为这个特殊效果在DOM中不存在，所以称为「伪类」。常见的伪类有下面几种：

1. 动态伪类选择器
2. 结构伪类选择器
3. 否定伪类选择器
4. UI伪类选择器
5. 目标伪类选择器（不重点介绍，了解）
6. 语言伪类选择器（不重点介绍，了解）

**动态伪类选择器：**

动态伪类一般有：

1. `:link`：超链接未被访问的状态
2. `:visited`：超链接被访问过的状态
3. `:hover`：鼠标悬浮在该元素时的状态
4. `:active`：元素<a href="javascript:;" class="custom-tooltip" data-title="按下鼠标不松开">被激活<span style="color: grey;">（鼠标悬浮/手指点击时显示更多信息）</span></a>的状态
5. `:focus`：元素获取焦点的状态，一般用于表单元素

!!! note

    需要注意，如果需要同时使用前4伪类选择器，一定要按照`LVHA`的顺序，因为前两种用在超链接上，所以这四个伪类一起用一般都是用在超链接上

=== "伪类选择器用在超链接上"

    ```html
    <style>
        /* 设置链接本身的样式 */
        a:link {
            color: red;
        }

        /* 设置链接悬浮样式 */
        a:hover {
            color: green;
        }

        /* 设置链接访问过后的样式 */
        a:visited {
            color: gray;
        }

        /* 设置链接激活的样式 */
        a:active {
            color: darkcyan;
        }
    </style>

    <body>
        <p>
            <a href="https://www.baidu.com">百度一下</a>
        </p>
    </body>
    ```

=== "伪类用在表单上"

    ```html
    <style>
        /* 输入框没有焦点时内容颜色为灰色 */
        input {
            color: grey;
        }

        /* 输入框获取焦点时内容颜色为红色 */
        input:focus {
            color: red;
        }
    </style>

    <body>
        请输入信息：<input type="text">
    </body>
    ```

**结构伪类选择器**

结构伪类一般有：

1. `:first-child`：选择作为第一个后代的指定元素
2. `:last-child`：选择作为最后一个后代的指定元素
3. `:nth-child(n)`：选择作为第`n`后代的指定元素
4. `:first-of-type`：选择作为第一个同类型的后代元素
5. `:last-of-type`：选择作为最后一个同类型的后代元素
6. `:nth-of-type(n)`：选择作为第`n`个同类型的后代元素
7. `:root`：选择根元素

其他伪类元素：

1. `:nth-last-child(n)`：选择作为倒数第`n`个子代元素
2. `:nth-last-of-type(n)`：所有倒数第`n`个同类型的元素
3. `:only-child`：选择没有兄弟（指定元素作为其父元素的唯一后代元素）的元素
4. `:only-of-type`：选择没有同类型兄弟（指定元素作为其父元素的唯一同类型元素）的元素

在上面的选择器中，`n`可以写的内容有：

1. 0或者不写：不选中任何内容
2. `n`：选中所有
3. `正整数`：选择指定序号的子元素，第一个子元素序号为1
4. `2n`或者`even`：选择偶数序号的子元素
5. `2n+1`或者`odd`：选择奇数序号的子元素
6. `-n+i`：选择前`i`个元素

```html
<style>
    /* 选择div中的第一个p元素中的后代元素 */
    div p:first-child span{
        color: red;
    }

    /* 选择div中的前6个p元素和其后代元素 */
    div p:nth-of-type(-n+6) {
        color: blue;
    }
</style>

<body>
    <div>
        <p>
            内容
            <span>内容</span>
        </p>
        <p>内容</p>
        <p>内容</p>
        <p>内容</p>
        <p>内容</p>
        <span>内容</span>
        <span>内容</span>
        <span>内容</span>
        <span>内容</span>
    </div>
</body>
```

**否定伪类选择器**

使用`:not(基础选择器)`选择不包括`基础选择器指定的元素`的元素

```html
<style>
    /* 选择div中不是p元素的元素 */
    div :not(p) {
        color: red;
    }
</style>

<body>
    <div>
        <p>
            <!-- p中的内容不变红 -->
            内容
            <!-- 下面span元素变红 -->
            <span>内容</span>
        </p>
        <p>
            内容
        </p>
        <p>内容</p>
        <!-- 下面span元素变红 -->
        <span>内容</span>
    </div>
</body>
```

**UI伪类选择器**

常见的UI伪类选择器有：

1. `:checked`：选择被选中的复选框或者单选框
2. `:enable`：选择可用的表单元素（没有使用`disabled`属性）
3. `:disabled`：选择不可用的表单元素（使用`disabled`属性）

```html
<style>
    /* 修改选中元素的选中效果 */
    /* 注意不能使用color修改单选框或者复选框的文本样式 */
    input:checked {
        accent-color: red;
    }
</style>
<body>
    <input type="checkbox" name="alpha" value="a">a
    <input type="checkbox" name="alpha" value="a">b
    <input type="checkbox" name="alpha" value="a">c

    <input type="radio" name="alpha-t">d
    <input type="radio" name="alpha-t">e
</body>
```