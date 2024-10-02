# JavaScript基本语法

## JavaScript编写位置

在JavaScript中，一共有三种常用的编写位置：

1. 内嵌式
2. 分离式
3. 内联式

内嵌式：像CSS一样使用对应的标签包裹，包裹JavaScript代码的标签为`<script></script>`，在标签内部写入JavaScript的代码

!!! note
    上面的标签原型是`<script type="text/javascript"></script>`，但是一般可以不写`type`属性，其默认值就是`type="text/javascript"`

例如下面的代码：

```html
<script>
    alert('提示文字');
</script>
```

分离式：将JavaScript代码写入一个后缀为`.js`的文件中，通过将`.js`代码引入的方式引入即可，引入时需要使用到`script`标签的属性`script:src`，例如下面的代码：

```html
<!-- HTML文件中引入 -->
<script src="./分离式.js"></script>
```

```javascript
// 外部的JavaScript文件
alert('外部的js文件');
```

内联式：也称行内式，直接写在标签内部，可以是在动作触发的属性值中，也可以是在链接`a:href`属性中，例如下面的代码：

```html
<!-- 动作触发的属性值 -->
<button onclick="alert('你点我干嘛！')">点我一下</button>
<!-- 链接中 -->
<a href="javascript:alert(123);">超链接</a>
```

## JavaScript注释

在JavaScript中一共有两种常用的注释：

1. 行内注释：使用`//`，可以嵌套使用

    ```javascript
    // 单行注释
    ```

2. 块注释：使用`/**/`，不可以嵌套使用，但是内部可以使用行注释

    ```javascript
    /*
        多行注释
    */
    ```

## JavaScript输出语句

在JavaScript中，有三种常见的输出语句：

1. 弹窗提示：使用函数`alert()`，参数传递需要打印的内容
2. 控制台输出：使用`console.log()`，参数传递需要打印的内容
3. 页面写入：使用`document.write()`，参数传递需要写的内容

例如下面的代码：

```html
<script>
    alert("哈哈哈哈");

    console.log('你猜我在哪？');

    document.write('你猜我在哪？');
</script>
```

需要注意，JavaScript中的语句规范是末尾带分号，如果没有带分号，JavaScript解释器会帮助添加分号，但是不推荐，并且在JavaScript中，字符串可以使用双引号`""`，也可以使用单引号`''`，后面还有模版字符串，具体见对应章节

## JavaScript字面量与变量

字面量：一个值，它所代表的含义就是它字面的意思，比如：1、2、3、4、100、`"hello"`、`true`、`null`等，在JavaScript中所有的字面量都可以直接使用，但是直接使用字面量并不方便，因为字面量没有具体的含义，比如给出一个数字1，没有任何背景下很难理解这个1的具体含义是表示什么

变量：可以用存储字面量，并且变量中存储的字面量可以随意的修改，通过变量可以对字面量进行描述，并且变量比较方便修改

在JavaScript中，定义变量有两种方式：

1. 使用`let`关键字
2. 使用`var`关键字

二者的区别：使用`var`关键字声明的变量没有块级作用域，而`let`有

例如下面的代码：

```JavaScript
let x = 80;
console.log(x);
```

也可以同时定义多个变量并赋值：

```JavaScript
let b = 80, c = 20, d = "hello";
console.log(b, c, d);
```

## JavaScript变量的特点

在JavaScript中，变量都是动态弱类型变量

- 弱类型变量和强类型变量：

强类型变量：不同类型之间的转换需要进行显示强制转换

弱类型变量：不同类型之间的转换不需要显示强制类型转换

```JavaScript
// 定义数值类型的变量
let num = 1;
console.log(num);
// 定义字符串类型的变量
let str = 'Hello World';
console.log(str);
// 将数值类型的变量转换为字符串类型
str = num;
console.log(str);
```

- 动态类型变量与静态类型变量：

动态类型变量：在运行时可以随意改变变量的类型

静态类型变量：在运行前确定变量的类型，运行时不可以修改变量的类型

```JavaScript
// 定义数值类型的变量
let num = 1;
console.log(typeof(num));
// 定义字符串类型的变量
let str = 'Hello World';
console.log(typeof(str));
// 将数值类型的变量转换为字符串类型
str = num;
console.log(typeof(str));
```

在JavaScript中可以使用`typeof()`操作符查看参数的数据类型，使用时可以不使用`()`，所以对于上面的代码来说，也可以使用`typeof num`，该操作符返回一个字符串，内容为对应值的类型名称

!!! note
    注意不是变量的类型名称，因为在JavaScript中，变量本质没有类型

## JavaScript变量在内存中存储的方式

在JavaScript中，变量与值会存在于内存中的一块表中，每当创建一个变量并赋予指定的值，在内存中就会进行存储，但是因为JavaScript中的变量是弱类型，所以JavaScript解释器也没有办法在变量创建时为其值分配一个确定内存空间大小。为了统一进行管理，JavaScript中每一个变量的值都会在内存的其他位置单独为其开辟一个空间，而对应的变量表值的部分就会存储对应值所在空间的地址，如下图所示：

<img src="JavaScript基础.assets/image-20241002190756993.png" alt="image-20241002190756993" />

但为一个值开辟一个空间时，如果已经存在一个新的变量的值与内存中已经存在的值相同，为了保证资源的重复利用，就会直接使用该值所对应的地址，而不会重复开辟空间

## JavaScript常量

常量：在JavaScript中，一个变量被`const`声明时，就是一个常量，该常量只可以被赋值一次，重复赋值会报错

例如下面的代码：

```JavaScript
// 第一次赋值（初始化）
const num = 10;
```

!!! note
    注意，在JavaScript中，不允许创建一个未初始化的常量，这与Java中被`final`修饰的常量不同

## JavaScript中的标识符

与Java相同

## JavaScript中的基本数据类型

在JavaScript中，有7种基本数据类型，这些基本数据类型也被称为原始值

1. 数值类型（Number）
2. 大整数类型（BigInt）
3. 字符串类型（String）
4. 布尔值类型（Boolean）
5. 空值（Null）
6. 未定义（Undefined）
7. 符号（Symbol）

在JavaScript中，原始值的内容一旦创建是无法被修改的，所以修改变量中的值本质是修改变量中存储的地址

### 数值类型

在JavaScript中，数值类型包括整数和浮点数，并且数值类型是有大小限制的，一旦超过了限制就会出现溢出导致数据不精准

例如下面的代码：

```JavaScript
let a = 10 // 10
a = 10.5 // 10.5
a = 3.14 // 3.14
a = 9999999999999991111111111111111111 // 1e+21，出现溢出
```

有三种特殊的数值类型：

1. `NaN`：非数值类型（Not a Number）
2. `Infinity`：无穷大
3. `-Infinity`：负无穷大

```JavaScript
// JavaScript中的特殊数值
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log("0" / 0); // NaN
```

在定义整数时，也可以使用其他进制的字面量表示，常见的有：

1. 二进制（表示：`0b`+二进制数值）
2. 八进制（表示：`0o`+八进制数值）
3. 十六进制（表示：`0x`+十六进制数值）

```JavaScript
let a = 0b1010 // 十进制：10
let b = 0o10 // 十进制：8
let c = 0xff // 十进制：255
```

!!! note
    需要注意，尽管在创建变量时赋值为不同的进制，但是在输出时依旧显示十进制数值

### 大整数类型

前面使用数值类型在超过限制时会出现溢出现象，为了解决这个问题，可以使用大整数类型，使用时在非常的数值末尾加上`n`

```JavaScript
let a = 99999999999999999999999999999999999999999999999999n;
```

需要注意，大整数类型不可以直接与整数类型进行计算，例如：

```JavaScript
console.log(1 + a);

//  Cannot mix BigInt and other types, use explicit conversions
```

### 字符串类型

#### 基本字符串

字符串类型（一串文本）：字符串的值必须用引号（单双均可，必须成对）括起来。可以使用`+`进行字符串拼接，并且可以使用`length`属性查看字符串长度

```JavaScript
let str = 'Hello World' + 'Hello World'; // string类型
console.log(str.length); // 获取字符串长度
```

字符串中也可以使用转义字符：

JavaScript中使用`\`作为转义字符，转义字符用以表示一些特殊的符号，比如：

| 转义字符 | 字符串      |
| -------- | ----------- |
| `\'`     | `'`         |
| `\"`     | `"`         |
| `\\`     | `\`         |
| `\n`     | 换行        |
| `\t`     | 制表符      |
| `\uxxxx` | Unicode编码 |

#### 模版字符串

- 模版字符串

在ES6之后，推出了一种特殊的字符串，使用反引号<span style="background-color:#f5f5f5; color:#36464e;">\` \`</span>包裹，称为模版字符串，该字符串有以下几个特点：

1. 字符串内容可以换行
2. 字符串中可以嵌入变量和表达式，使用`${}`包裹

例如下面的代码：

```JavaScript
// 模版字符串

let str = `模版字符串

可以换行`;
console.log(str);

// 嵌入变量
let username = '小明';
let age = 18;
console.log(`我叫${username}，今年${age}岁。`);
```

### 布尔值类型

布尔值用来进行逻辑判断，只有两个`true`和`false`。

!!! note
    在JavaScript中，布尔值本质也是数值类型，`true`表示1，`false`表示0，并且可以直接与数值类型参与运算

```JavaScript
let bool = true // 真
// bool = false // 假
let num = 1;
console.log(bool + num); // 2
```

### 空值和未定义

空值：表示空、不存在，只有一个值`null`，使用`typeof`检测时会返回`object`而不是`null`

未定义：作用和空值类似，同样只有一个值`undefined`，但是一般不会主动使用`undefined`

```JavaScript
let a = null; // object
let b; // undefined
```

### 符号

符号比较特殊，用以表示一个唯一标识，在一些特殊场景下会使用，定义如下：

```JavaScript
let a = Symbol();
```

