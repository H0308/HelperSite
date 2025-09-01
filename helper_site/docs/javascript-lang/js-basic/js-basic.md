<!-- 添加对Katex的支持 -->
<script defer src="/javascripts/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"></script>

<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

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

=== "HTML代码"

    ```html
    <!-- HTML文件中引入 -->
    <script src="./分离式.js"></script>
    ```

=== "JavaScript代码"

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

使用如下面的代码：

```JavaScript
let x = 80;
console.log(x);
```

也可以同时定义多个变量并赋值：

```JavaScript
let b = 80, c = 20, d = "hello";
console.log(b, c, d);
```

二者的区别：使用`var`关键字声明的变量没有块级作用域，而`let`有

例如下面的代码：

```javascript
for (let i = 0; i < 5; i++) {
}
console.log(i); // ReferenceError: i is not defined

for (var i = 0; i < 5; i++) {
}
console.log(i); // 5
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

## JavaScript中数据类型相互转换

在JavaScript中一共存在三种常用的数据类型转换：

1. 其他类型转换转换为String类型
2. 其他类型转换为Number类型
3. 其他数据类型转换为Boolean类型

### 其他类型转换为String类型

在JavaScript中，一共有三种方式将其他数据类型转换为String类型

1. 调用`toString()`方法
2. 调用`String()`函数
3. 使用已有内容`+""`

基本使用如下：

```javascript
let num = 100;

// 转换为字符串
console.log(typeof num, num); // 'number' 100
// let str = num.toString();
// let str = String(num);
let str = num + "";
console.log(typeof str, str); // '100'
```

上面三种方式中，需要注意`toString()`和`String`函数，如果转换的内容是`null`或者`undefined`，则不可以调用`toString()`方法，否则会报错为`null`或者`undefined`没有该成员属性，例如下面的代码：

```javascript
let num1 = null;
num1.toString(); // TypeError: Cannot read property 'toString' of null
```

但是可以使用`String()`函数

```javascript
let num1 = null;
console.log(String(num1)); // 'null'
```

### 其他数据类型转换为Number类型

在JavaScript中，使用`Number()`函数将指定类型转换为Number类型，转换为Number类型的数值类型一般有四种情况

1. String类型
    1. 字符串中存在属于有效数字：正常转换全部
    2. 字符串中存在非数字字符：转换为`NaN`
2. 空值类型：转换为0
3. 未定义类型：转换为`NaN`
4. Boolean类型：`true`转换为1，`false`转换为0

使用如下：

```javascript
let str = "100";
let str1 = "100.1";
let str2  = "100a";
let str3 = "a100";
let str4 = null;
let str5 = undefined;

// 转换为数字
console.log(Number(str)); // 100
console.log(Number(str1)); // 100.1
console.log(Number(str2)); // NaN
console.log(Number(str3)); // NaN
console.log(Number(str4)); // 0
console.log(Number(str5)); // NaN
```

除了上面的三种方式，在JavaScript中，针对String类型有一种特殊的方式：在指定字符串前加上`+`

```javascript
let str = "100";
console.log(+"100"); // 100
```

强制转换为特殊类型有两种方式（这两种特殊类型属于Number类型，但是没有单独列出）：

1. 强制转换为整数：使用`parseInt()`函数，如果转换的内容存在非数字字符（包括小数点），则转换到第一个非数字字符之前为止。如果转换的内容第一个就是非数字字符，则转换为`NaN`
2. 强制转换为浮点数：使用`parseFloat()`函数，如果转换的内容存在非数字字符（不包括小数点），则转换到第一个非数字字符之前为止。如果转换的内容第一个就是非数字字符，则转换为`NaN`

```javascript
let str = "100abc";
console.log(parseInt(str)); // 100
let str1 = "100.1asd";
console.log(parseFloat(str1)); // 100.1

let str2 = "abc100";
console.log(parseInt(str2)); // NaN
let str3 = "abc100.1";
console.log(parseFloat(str3)); // NaN
```

### 其他数据类型转换为Boolean类型

在JavaScript中，其他数据类型转换为Boolean类型可以使用`Boolean()`函数，一般下面的5种内容会被转换为`false`，其他均为`true`：

1. 数值0
2. 数值`NaN`
3. 空字符串
4. `null`
5. `undefined`

```javascript
console.log(Boolean(0)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
```

在JavaScript中，除了上面的类型和`false`，都是`true`，包括对象：

```javascript
console.log(Boolean(Object())); // true
```

## JavaScript中的运算符

### 算术运算符

JavaScript中，提供了下面的6种算术运算符：

1. 加法：`+`
2. 减法：`-`
3. 乘法：`*`
4. 除法（保留小数位）：`/`
5. 取模：`%`
6. 幂运算：`**`

因为JavaScript是弱类型语言，所以当非数值类型在做计算时会先转换为数值类型，转换规则见数值类型转换，再进行计算

!!! note
    需要注意，如果是String类型，直接使用`+`则代表字符串拼接

    ```javascript
    console.log(4 + '0'); // '40' 字符串拼接
    ```

```javascript
console.log(4 - '0'); // 4 数字相减 4 - 0
console.log(4 + null); // 4 null转换为数字0
console.log(4 + undefined); // NaN undefined转换为NaN
console.log(4 + true); // 5 true转换为1

console.log(4 / 3); // 1.3333333333333333
console.log(4 % 3); // 1
console.log(4 ** 3); // 64
```

需要注意，在JavaScript中，取模运算可以用于浮点数：

```javascript
console.log(14.2 % 3); // 2.2
```

计算方式即为余下的整数结合小数部分，$14.2 \mod 3 = 4......2.2$

### 赋值运算符

在JavaScript中，除了前面的算术运算符、位运算符与赋值运算符的结合和自增`++`与自减`--`以外还有`??=`

对于`??=`来说，会使赋值只进行一次，第二次之后的赋值全部无效

```javascript
let num = 100; // 第一次赋值
num ??= 200; // 第二次赋值失效
console.log(num); // 100

let num1;
num1 ??= 200; // 第一次赋值
num1 ??= 300; // 第二次赋值失效
console.log(num1); // 200
```

!!! note
    `??`是JavaScript中的空值合并运算符，如果该运算符左侧是`null`或者`undefined`，则返回该运算符右侧的值，否则返回该运算符左侧的值

### 逻辑运算符

JavaScript中提供了三种基本的逻辑运算符，分别是逻辑与、逻辑或和逻辑非，但是因为JavaScript是弱类型语言，所以判断时需要注意下面的问题：

1. 使用逻辑与则整个表达式的值取决于下面两种情况：
    1. 如果逻辑与左侧为`true`（包括根据转换规则转换为`true`），则不论右侧是`true`（包括根据转换规则转换为`true`）还是`false`（包括根据转换规则转换为`false`），取值都为右侧的值（类型：该值原类型）
    2. 如果逻辑与左侧为`false`（包括根据转换规则转换为`false`），取值为左侧的值（类型：该值原类型）

2. 使用逻辑或则整个表达式的值取决于下面两种情况：
    1. 如果逻辑与左侧为`true`（包括根据转换规则转换为`true`），取值都为左侧的值（类型：该值原类型）
    2. 如果逻辑与左侧为`false`（包括根据转换规则转换为`false`），则不论右侧是`true`（包括根据转换规则转换为`true`）还是`false`（包括根据转换规则转换为`false`），取值为右侧的值（类型：该值原类型）

```javascript
console.log(4 && 3); // 3
console.log(false && 3); // false

console.log(4 || 3); // 4
console.log(false || 0); // 0
```

### 关系运算符

在JavaScript中，提供了八种关系运算符：

1. 大于`>`
2. 小于`<`
3. 相等于`==`（两个等号）
4. 大于等于`>=`
5. 小于等于`<=`
6. 全等于`===`（三个等号）
7. 不相等于`!=`（感叹号+两个等号）
8. 不全等于`!==`（感叹号+三个等号）

下面主要介绍相等于、全等于、不相等于和不全等于：

相等于（或不相等于）：比较对象内容，不会比较对象地址，如果出现运算符两侧类型不匹配，则会根据类型转换规则进行类型转换

全等于（或不全等于）：比较对象内容和地址，不会进行类型转换

```javascript
console.log(4 == "4"); // true
console.log(4 === "4"); // false

console.log(4 != "4"); // false
console.log(4 !== "4"); // true
```

### 条件运算符

与Java相同，见[Java基础知识](https://www.help-doc.top/Java/java-basic/java-basic.html#_7)

### 位运算符

与Java相同，见[Java基础知识](https://www.help-doc.top/Java/java-basic/java-basic.html#_7)

### 运算符优先级

见下图：

<img src="JavaScript基础.assets\image-20240902085011404.png">

## JavaScript分支和循环语句

语法与Java相同，见[Java基础知识](https://www.help-doc.top/Java/java-basic/java-basic.html#_11)

此处开始涉及到块级作用域，需要注意`let`和`var`的使用区别
