<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# JavaScript函数

## 函数定义

在JavaScript中，函数也属于对象，所以函数也具备一般对象所具有的功能，定义函数以及调用语法如下：

```JavaScript
// 定义函数语法如下
function 函数名(形参列表) {
    // 函数体
}

// 调用函数语法如下
函数名();
```

除了上面提到的最基本的定义函数的方式，JavaScript中还有两种定义函数的方式：

1. 匿名函数，一般需要使用变量接收匿名函数对象，调用时使用变量调用对应的函数对象
2. 箭头函数，匿名函数对象的变体，一般需要使用变量接收匿名函数对象，调用时使用变量调用对应的函数对象

基本语法如下：

```JavaScript
// 匿名函数
let/const 变量名 = function (形参列表) {
    // 函数体
}

// 箭头函数
let/const 变量名 = (形参列表) => {
    // 函数体
}
```

基本使用如下：

```JavaScript
function fn(){
    console.log("函数声明所定义的函数");
}

const fn2 = function(){
    console.log("函数表达式");
}

const fn3 = () => {
    console.log("箭头函数");
}

console.log(typeof fn);
console.log(typeof fn2);
console.log(typeof fn3);
```

一般情况下，函数对象不会被修改，也不希望被修改，所以推荐使用`const`变量接收匿名函数对象或者箭头函数对象

## 函数参数

因为JavaScript属于动态弱类型语言，所以函数的形式参数不需要指定具体的类型，例如下面的代码：

```JavaScript
function sum(a, b) {
    console.log(a + b);
}

sum(1, 2);
```

另外，与其他强类型语言不同的是，JavaScript中的函数可以在调用时，实参个数与形参个数不匹配，具体分为两种情况：

1. 实参多于形参：当实参多于形参时，多余的实参不会被使用
2. 实参少于形参：当实参少于形参时，依次按照传参顺序，没有实参对应的形参被设置为`undefined`

例如下面的代码：

```JavaScript
function fn(a, b) {
    console.log(a);
    console.log(b);
}

// 实参多于形参
fn(1,2,3);
// 实参少于形参
fn(1);

输出结果：
1
2
1
undefined
```

除了前面的原始值作为函数参数以外，还可以将对象作为函数参数，包括函数对象

在JavaScript中，所有对象传给函数形参的方式都是引用传递，所以在函数中对形参接收到的对象中的内容进行修改会影响到实参，例如下面的代码：

```JavaScript
function fn(a) {
    console.log(a);
    a.name = "lisi";
}

// 对象作为函数参数
let obj = {
    name: "zhangsan",
    age: 18
}

fn(obj);
console.log(obj);

输出结果：
{ name: 'zhangsan', age: 18 }
{ name: 'lisi', age: 18 }
```

当函数参数接收的是一个函数对象，此时一个作为参数传递给另一个函数的函数就称为回调函数。当外部函数完成某些操作后，它会回调这个传入的函数，以此来通知内部函数操作已经完成，例如下面的代码：

```JavaScript
function fn(a) {
    console.log("a = ", a);
    console.log("This is fn");
}

function fn1() {
    console.log("This is fn1");
}

// 函数对象作为参数，参数的函数称为回调函数
fn(fn1);

输出结果：
a =  [Function: fn1]
This is fn
```

在实际开发中，对应函数体比较简短的函数会直接使用箭头函数作为函数实际参数传递给形参，此时的箭头函数即为回调函数

## 函数返回值

因为JavaScript是动态弱类型语言，所以函数返回值不需要指定具体类型，函数体内部使用`return`关键字加上返回内容即可代表该函数具有返回值

!!! note
    `return`后面也可以不接内容，此时只是结束函数，但是如果使用变量接收这种函数的返回值时，变量此时为`undefined`，与默认情况下函数没有`return`语句效果一致

例如下面的代码：

```JavaScript
function sum(a, b){
    return a+b;
}

let sum1 = sum(1,2);
console.log(sum1);
```

## 箭头函数的特点

前面提到的都是普通函数的情况，接下来讨论箭头函数的特点

在JavaScript中，箭头函数也包括函数形式参数、函数体和函数返回值，与普通函数不同的是，箭头函数有以下几个特点：

1. 函数形式参数：如果箭头函数只有形式参数，则可以省略形参列表的括号
2. 函数体：如果箭头函数的函数体只有一条语句，则可以省略包裹函数体的大括号
3. 函数返回值：如果箭头函数的函数体只有一条语句，且这条语句是`return`语句，此时可以省略大括号和`return`关键字

例如下面的代码：

```JavaScript
// 只有一个函数形式参数且只有一条语句
let fn = a => console.log(a);
fn(1);

// 只有一个返回语句
let fn1 = b => b;
let ret = fn1(2);
console.log(ret);
```

需要注意的是，当箭头函数的返回值是用大括号包裹的对象且函数体只有一条`return`语句时，需要使用小括号包裹返回的对象，例如下面的代码：

```JavaScript
let fn2 = c => ({name:"lisi"});
console.log(fn2());

输出结果：
{ name: 'lisi' }
```

## 作用域

在JavaScript中，作用域分为两种：

1. 全局作用域：直接位于整个`script`标签或者`.js`后缀文件中
2. 局部作用域：位于代码块中，包括函数代码块和普通代码块

例如下面的代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>作用域</title>
</head>
<script>
    // a 和 b都位于全局作用域，任何位置都可以访问a和b
    let a = 1;
    var b = 2;

    {
        let c = 1; // c位于局部作用域
    }
    console.log(c);// 外部不能访问c

    function fn(){
        let d = 1; // d位于局部作用域
    }

    console.log(d);// 外部不能访问d
</script>
<body>

</body>
</html>
```

注意，如果在局部作用域中使用`var`声明变量，则该变量依旧可以访问，例如下面的代码：

```javascript
{
    var a = 1; // 使用var创建变量，尽管处于局部作用域也可以在外部访问
}

console.log(a);

输出结果：
1
```

在JavaScript中，多个`<script>`标签共享同一个全局作用域。因此，在一个`<script>`标签中声明的变量可以在后续的`<script>`标签中访问，例如下面的代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>测试多个script标签变量的作用域</title>
</head>
<script>
    // a 和 b都位于全局作用域，任何位置都可以访问a和b
    let a = 1;
    var b = 2;
</script>
<body>

</body>
<script>
    console.log(a); // 1
    console.log(b); // 2
</script>
</html>
```

## 作用域链

所谓作用域链，即当使用一个变量时，JS解释器会优先在当前作用域中寻找变量，如果找到了则直接使用，如果没找到，则去上一层作用域中寻找，找到了则使用，如果没找到，则继续去上一层寻找，以此类推。如果一直到全局作用域都没找到，则报错为变量未定义，例如下面的代码：

```JavaScript
let b = 33;

function fn(){
    let b = 44;

    function f1(){
    let b = 55;
    console.log(b); // 先访问最近的55，假设此时55不在，就找到44，假设44不在，就找到33，再往上就报错
    }

    f1(); // 打印55

}

fn(); // 打印55
```

## 对象的方法

对象的方法是函数的一种，只是这个函数属于对象中的一个成员，创建对象的方法的方式与创建对象属性基本一致，例如下面的代码：

```JavaScript
// 函数也可以成为一个对象的属性
obj.sayHello = function(){
    console.log("hello");
}

console.log(obj);

obj.sayHello();

输出结果：
{ sayHello: [Function (anonymous)] }
hello
```

## window对象

在JavaScript中，存在一个默认对象，这个对象存在于浏览器中，当浏览器启动时，该对象就会被创建，该对象为window对象

window对象可以被直接访问，通过window对象可以对浏览器窗口进行各种操作，也可以负责存储JavaScript中的内置对象和浏览器的宿主对象

在JavaScript中，window对象的属性可以通过window对象访问，也可以直接访问，而所有直接调用的函数就可以认为是window对象的方法

例如下面的代码：

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<script>
    alert("hello");
    // 相当于
    window.alert("hello");
</script>
<body>

</body>
</html>
```

如果直接向window对象中添加属性，则该属性会被作为全局属性，而因为window可以省略，所以当直接写一个属性时，默认就是全局属性

前面提到使用关键字`var`声明的变量也是全局变量，实际上`var`声明的变量不完全是全局变量，因为`var`声明的变量具有函数作用域，所以在全局作用域中，下面的代码二者是等价的：

```javascript
var a = 1; // 等价于window.a = 1; 也等价于a = 1
```

但是如果在函数中，则二者并不等价：

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<script>
    function fn() {
        var a = 10;
        b = 20;
        console.log(a);
    }

    // 必须先调用才能在下面访问到20
    fn();

    // console.log(a); // a is not defined
    console.log(b); // 20
</script>
<body>

</body>
</html>
```

## 提升规则

在JavaScript中，提升表示指定的内容会优先于普通的代码执行，提升一共分为两种：

1. 变量的提升：使用`var`声明的变量，它会在所有代码执行前被声明，所以可以在变量声明前就访问变量，但是注意访问到的变量没有具体的值（尽管可能在使用`var`创建时已经进行赋值）；变量的提升也会出现在函数的内部，如果是在函数内部使用`var`声明变量，则该变量会被提升为函数的第一条语句
2. 函数的提升：使用函数声明（创建函数的第一种方式）创建的函数，会在其他代码执行前被创建， 所以可以在函数声明前调用函数

!!! note
    同时出现函数和变量的提升时，函数提升的优先级比变量高

例如下面的代码：

```JavaScript
// 变量的提升
// 先访问a
console.log(a); // undefined
// 声明在之后
var a = 10;
console.log(a); // 10

// 函数中的变量提升
function fn() {
    console.log(a); // undefined
    var a = 10;
    console.log(a); // 10
}
// 上面的代码等价于
function fn() {
    var a;
    console.log(a); // undefined
    a = 10;
    console.log(a); // 10
}

// 函数的提升
// 声明前可以调用
fn(); // 函数的提升

function fn() {
    console.log("this is fn");
}

// 箭头函数和匿名函数不会提升
fn1(); // 报错
let fn1 = function () {
    console.log("this is fn1");
}

fn2(); // 报错
let fn2 = () => {
    console.log("this is fn2");
}
```

## window对象和提升练习

练习1：思考下面代码结果：

```JavaScript
var a = 1;

function fn() {
    a = 2;
    console.log(a);
}

fn();
console.log(a);

输出结果：
2
2
```

上面的代码中，因为使用`var`声明的变量会提升，此时变量`a`就已经被创建，此时`fn`中的`a`就不是在window对象中创建的变量`a`，所以两处访问的`a`都是同一个`a`（作用域链原则），所以函数内部修改`a`的值也会影响到外部的`a`，最后打印的值都是2

练习2：思考下面代码结果：

```JavaScript
var a = 1;
function fn(){
    console.log(a);
    var a = 2;
    console.log(a);
}
fn();
console.log(a);

输出结果：
undefined
2
1
```

根据函数中使用`var`关键字声明的变量也会出现变量提升，所以函数`fn`开始的第一句就是`var a`，此时根据作用域链原则，函数内第一条输出语句访问的就是函数内声明的`a`，接着给`a`赋值为2，所以第二条输出语句的结果为2，而因为函数内部有一个`a`，所以函数内部修改的`a`与外部的`a`不是同一个，所以最后一条语句打印的是1

练习3：思考下面代码结果：

```JavaScript
var a = 1;
function fn(a){
    console.log(a);
    a = 2;
    console.log(a);
}
fn();
console.log(a);

输出结果：
undefined
2
1
```

上面的代码中，因为调用函数时没有给形参传递实参，所以第一次输出形参`a`的值为`undefined`，接着给`a`赋值为2，此时就会打印2，而因为函数内部访问的是形参`a`，所以不会影响外部的输出语句打印1

练习4：思考下面代码结果：

```JavaScript
var a = 1;

console.log(a);

function a() {
}

console.log(a);

var a = 3;

console.log(a);

var a = function () {
}

console.log(a);

输出结果：
1
1
3
[Function: a]
```

在上面的代码中，因为函数的提升优先级会高于变量优先级，所以上面的代码转化为：

```JavaScript
// 提升
function a() {
}

var a;

// 赋值
a = 1;

console.log(a);

console.log(a);

// 赋值
a = 3;

console.log(a);

// 赋值
a = function () {
}

console.log(a);
```

## 立即执行函数

在JavaScript中，有时需要创建一个函数，满足执行一次，此时就可以使用到立即执行函数（IITE）

语法如下：

```JavaScript
(
    // 匿名函数
    function (){
    // 函数体
}
)
```

调用语法如下：

```JavaScript
(
    // 匿名函数
    function (){
    // 函数体
}
)();

// 或者
(
    // 匿名函数
    function (){
    // 函数体
}
());
```

例如下面的代码：

```JavaScript
(function (){
    let a = 10;
    console.log(a);
})();
```

## 函数中的`this`

在JavaScript中，函数在执行时，JavaScript解析器每次都会传递进一个隐含的参数，这个参数就叫做`this`，`this`会指向一个对象，这个对象有两种情况：

1. 如果调用方式为直接调用的函数，则`this`为window对象

    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <script>
        function fn() {
            console.log(this === window)
        }
    
        fn(); // true
    </script>
    <body>
    
    </body>
    </html>
    ```

2. 以方法的形式调用时，`this`指向的是调用方法的对象

    ```javascript
    const obj3 = {
        sayHello: function () {
            console.log("obj3");
            console.log(this);
        }
    }
    const obj4 = {
        sayHello: function(){
            console.log("obj4");
            console.log(this);
        }
    }
    
    // 为两个对象添加一个方法，可以打印自己的名字
    obj3.sayHello();
    obj4.sayHello();
    
    输出结果：
    obj3
    { sayHello: [Function: sayHello] }
    obj4
    { sayHello: [Function: sayHello] }
    ```

需要注意的是箭头函数的`this`，箭头函数的`this`从外部的作用域继承而来，因为箭头函数本身没有`this`，所以箭头函数的`this`和它的调用方式无关，例如下面的代码：

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<script>
    function fn() {
        console.log(this === window)
    }

    const fn2 = () => {
        console.log(this === window)
    }

    fn(); // true
    fn2(); // true
</script>
<body>

</body>
</html>
```

对于下面的代码，因为箭头函数外部的作用域为对象，所以此时`this`就是对象：

```JavaScript
const obj = {
    sayHello : function (){
        console.log(this);
        const t2 = () => {
            console.log("t2 -->", this);
        }

        t2(); // { sayHello: [Function: sayHello] }
    }
}

obj.sayHello(); //t2 --> { sayHello: [Function: sayHello] }
```

上面的代码也等价于下面的写法：

```JavaScript
const obj = {
    sayHello(){
        console.log(this);
        const t2 = () => {
            console.log("t2 -->", this);
        }

        t2(); // { sayHello: [Function: sayHello] }
    }
}

obj.sayHello(); //t2 --> { sayHello: [Function: sayHello] }
```

## 严格模式

JavaScript中代码运行的模式有两种：

1. 正常模式：默认情况下代码都运行在正常模式中，在正常模式，语法检查并不严格，它的原则是能不报错的地方尽量不报错，但是这种处理方式导致代码的运行性能较差
2. 严格模式：在严格模式下，语法检查变得严格，因为其禁止了一些语法，并且因为更加严格，所以更容易报错，但是这种模式可以提升性能

在实际开发中，也更推荐使用严格模式

在JavaScript中，开启严格模式可以在指定作用域开启，输入下面的内容开启严格模式：

```JavaScript
"use strict"
```

例如下面的代码：

```JavaScript
"use strict" // 全局的严格模式

a = 10 // a is not defined

function fn(){
    "use strict" // 函数的严格的模式
}
```

## 函数递归

与其他编程语言一样，JavaScript中的函数也可以递归，递归方式也一致，不再赘述
