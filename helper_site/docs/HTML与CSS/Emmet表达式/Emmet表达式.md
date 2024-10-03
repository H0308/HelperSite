# Emmet表达式
## Emmet语法简介

Emmet语法的前身是Zen coding,它使用缩写,来提高HTML/CSS的编写速度, vscode内部已经集成该语法。

## Emmet作用

1. 快速生成HTML结构语法
2. 快速生成CSS样式语法

## Emmet在HTML中的使用

- 生成标签 直接输入标签名 按 ++tab++ 键即可比如`div`然后 ++tab++ 键，就可以生成 `<div></div>`

<img src="Emmet表达式.assets\image.png">

- 如果想要生成多个相同标签加上 `*` 就可以了 比如   `div*3`  就可以快速生成3个div

<img src="Emmet表达式.assets\image1.png">

- 如果有父子级关系的标签，可以用 `>`  比如`ul > li`就可以了

<img src="Emmet表达式.assets\image2.png">

<img src="Emmet表达式.assets\image3.png">

- 如果有兄弟关系的标签，用`+`就可以了 比如`div+p`  

<img src="Emmet表达式.assets\image4.png">

<img src="Emmet表达式.assets\image5.png">

- 如果生成带有类名或者`id`名字的，直接写`.类名`或者`#id名`再按 ++tab++ 键就可以了

<img src="Emmet表达式.assets\image6.png">

- 如果生成的标签中的内容或类带有编号（从1开始）， 可以用自增符号`$` 

<img src="Emmet表达式.assets\image7.png">

<img src="Emmet表达式.assets\image8.png">

- 如果想要在生成的标签内部写内容可以用`{}`表示

<img src="Emmet表达式.assets\image9.png">

上面图片中的代码结果如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emmet语法</title>
    <style>
        .red {
            color: red;
        }

        #box {
            width: 200px;
            height: 200px;
            background-color: red;
        }
    </style>
</head>

<body>
    <!-- 标签名＋Tab键快速生成标签 -->
    <span></span>
    <!-- 快速生成3个同类标签（内部不包含内容） -->
    <p></p>
    <p></p>
    <p></p>
    <!-- 快速生成3个同类标签（内部包含某一类选择器） -->
    <p class="red"></p>
    <p class="red"></p>
    <p class="red"></p>
    <!-- 快速生成3个同类标签（内部包含某一id选择器及内容） -->
    <p id="box">这是一段文本</p>
    <p id="box">这是一段文本</p>
    <p id="box">这是一段文本</p>
    <!-- 快速生成1个父子类型，内部3个孩子标签（内部包含同样的内容） -->
    <ul>
        <li>这是一段内容</li>
        <li>这是一段内容</li>
        <li>这是一段内容</li>
    </ul>
    <!-- 快速生成3个父子类型，内部1个孩子标签（内部包含同样的内容） -->
    <ol>
        <li>这是一段内容</li>
    </ol>
    <ol>
        <li>这是一段内容</li>
    </ol>
    <ol>
        <li>这是一段内容</li>
    </ol>
    <!-- 快速生成3个同级不同类的标签，两个不同标签为一组（内部包含相同的内容） -->
    <span>这是一段内容</span>
    <p>这是一段内容</p>
    <span>这是一段内容</span>
    <p>这是一段内容</p>
    <span>这是一段内容</span>
    <p>这是一段内容</p>
    <!-- 快速生成3个同级不同类的标签，同标签为一组（内部包含相同的内容） -->
    <span>这是一段内容</span><span>这是一段内容</span><span>这是一段内容</span>
    <p>这是一段内容</p>
    <p>这是一段内容</p>
    <p>这是一段内容</p>
    <!-- 快速生成3个同级的内容按顺序的标签（内部除编号以外包含相同内容） -->
    <span>这是一段内容1</span><span>这是一段内容2</span><span>这是一段内容3</span>
    <!-- 快速生成3个同级的内容按顺序的标签并包含有编号的类（内部除编号以外包含相同内容） -->
    <span class="red1">这是一段内容1</span><span class="red2">这是一段内容2</span><span class="red3">这是一段内容3</span>
</body>

</html>
```

## Emmet在CSS中的使用

CSS基本采取简写形式即可

1. 对于没有连接符（即只有一个单词）的属性，直接输入首字母＋值按 ++tab++ 键即可
    - 比如`w200`按 ++tab++ 可以生成`width: 200px;`
2. 对于有连接符（即有两个单词）的属性，需要输入两个单词的首字母+值按 ++tab++ 键即可
    - 比如`lh26px`按 ++tab++ 可以生成`line-height: 26px;`