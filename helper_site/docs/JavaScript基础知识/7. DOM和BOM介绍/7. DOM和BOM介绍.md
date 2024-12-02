# DOM和BOM介绍

## DOM

前面学习了JavaScript的语法基础知识。但是在学习过程中会发现，似乎感觉JavaScript和网页并没有太大的关系。换句话说，所编写的JavaScript代码，除了是写在网页中以外，并没有和网页产生任何实质的联系。如果JavaScript不能操作网页，那么对于程序员来说它任何的使用价值。所以就需要一个新的技术，一个可以让我们使用JavaScript来操作网页的技术，这个技术就是DOM

DOM，全称Document Object Model，中文翻译为文档对象模型。DOM属于Web API的一部分。Web API中定义了非常多的对象，通过这些对象可以完成对网页的各种操作（添加删除元素、发送请求、操作浏览器等）

DOM中的D意为Document，即文档。所谓文档就是指整个网页，换言之，DOM是用来操作网页的。O意为Object，即对象。DOM将网页中的每一部分内容都转换为了对象，`div`有`div`的对象，`input`有`input`的对象，甚至一段文本，一段注释也有其所对应的对象。转换对象以后，就可以按照面向对象的方式去操作网页，想要操作哪个元素就获取哪个元素的对象，然后通过调用其方法或属性完成各种操作。M意为Model，即模型。模型用来表示对象之间的关系，也就是父子元素、祖先后代、兄弟元素等，明确关系后我们便可以通过任意一个对象去获取其他的对象

例如下面的代码：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <title>My Title</title>
</head>
<body>
    <h1>A Heading</h1>
    <a href="#">Link Text</a>
</body>
</html>
```

对应的DOM结构如下图所示：

<img src="7. DOM和BOM介绍.assets\20220808135838431.png">

## DOM中的概念

### 节点

在DOM标准下，网页中的每一个部分都会转换为对象。这些对象有一个共同的称呼——节点（Node）。一个页面将会由多个节点构成，虽然都称为节点，但是它们却有着不同的类型：

1. 文档节点
2. 元素节点
3. 文本节点
4. 属性节点
...

每一个节点都有其不同的作用，文档节点表示整个网页，元素节点表示某个标签，文本节点表示网页中的文本内容，属性节点表示标签中的各种属性。如果从对象的结构上来讲，这些对象都有一个共同的父类`Node`。总的来说，都是属于节点，但是具体类型不同

### 关系

DOM中，对于HTML中的元素有以下的几种关系：

1. 祖先：包含后代元素的元素是祖先元素
2. 后代：被祖先元素包含的元素是后代元素
3. 父：直接包含子元素的元素是父元素
4. 子：直接被父元素包含的元素是子元素
5. 兄弟：拥有相同父元素的元素是兄弟元素

## BOM

BOM是Browser Object Model的缩写，简称浏览器对象模型。BOM提供了独立于内容而与浏览器窗口进行交互的对象，由于BOM主要用于管理窗口与窗口之间的通讯，因此其核心对象是`window`

BOM由一系列相关的对象构成，并且每个对象都提供了很多方法与属性。但是BOM缺乏标准，而JavaScript语法的标准化组织是ECMA，DOM的标准化组织是W3C（WHATWG,WebHypertextApplicationTechnologyWorkingGroup——网页超文本应用程序技术工作组目前正在努力促进BOM的标准化）。BOM最初是Netscape浏览器标准的一部分

BOM提供了一些访问窗口对象的一些方法，我们可以用它来移动窗口位置，改变窗口大小，打开新窗口和关闭窗口，弹出对话框，进行导航以及获取客户的一些信息如：浏览器品牌版本，屏幕分辨率。但BOM最强大的功能是它提供了一个访问HTML页面的一入口——`document`对象，以使得可以通过这个入口来使用DOM的强大功能

`window`对象是BOM的顶层(核心)对象，所有对象都是通过它延伸出来的，也可以称为`window`的子对象。由于`window`是顶层对象，因此调用它的子对象时可以不显示的指明`window`对象，关于`window`对象的具体内容见[JavaScript语法基础部分](https://www.help-doc.top/JavaScript%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/3.%20JavaScript%E5%87%BD%E6%95%B0/3.%20JavaScript%E5%87%BD%E6%95%B0.html#window)

现在简单认识一下`window`有哪些子对象：

1. `document`对象
2. `frames`对象
3. `history`对象
4. `location`对象
5. `navigator`对象
6. `screen`对象

在BOM中，常用的`window`子对象有`navigator`、`location`和`history`对象，后续会针对这三个对象进行讨论