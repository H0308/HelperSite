# JavaScript对象基础

## 介绍

在前面学习到的基础数据类型都是原始值，原始值只能表示一些简单的数据，不能表示复杂数据，此时就需要使用到对象，在JavaScript中，对象是一种复合数据类型，它相当于一个容器，在对象中可以存储各种不同类型数据

在JavaScript中，对象的数据类型与`null`相同均为`object`

## 创建对象

在JavaScript中，创建对象一共有两种方式：

1. 使用`Object()`创建对象赋值给变量（如果不给变量就是一个匿名对象），本方式创建的对象中不含有任何成员，需要后面添加
2. 使用`{}`创建对象并赋值给变量，本方式可以在`{}`内给定对象的成员，每一个成员都是一个类似于CSS样式的键值对，除了最后一个成员属性可选，其他成员属性必须在结尾带上`,`

例如下面的代码：

```javascript
let obj = Object();
console.log(obj); // {}

let obj1 = {
    name: "Tom",
    age: 20
};

console.log(obj1); // { name: 'Tom', age: 20 }
```

对于第一种方式，如果需要添加成员属性，可以使用下面的方式：

```javascript
对象名.成员属性名（自定义） = 值;
// 也可以
对象名.[变量/字符串] = 值;
```

其中成员属性名理论上可以用任意符号，包括关键字，但是为了可读性不建议随便取成员属性名

!!! note
    并且如果是通过变量添加的属性，一定要用`[]`

例如下面的代码：

```javascript
// 接上面代码
obj.name = "Jerry";
obj.age = 18;
// 使用变量作为属性名
let symbol = Symbol("A Symbol");
obj[symbol] = "Object Symbol";
// 使用字符串作为属性名
obj["str"] = "Object String";
console.log(obj); 
// { name: 'Jerry', age: 18, [Symbol(A Symbol)]: 'Object Symbol', str: 'Object String' }
```

## 获取对象属性

获取对象属性的方式与前面使用第一种方式创建对象时添加属性的方式基本相同：

```javascript
对象名.对象已有成员属性名;
// 也可以
对象名.[对象已有变量/对象已有字符串];
```

!!! note
    需要注意，一定要用对象有的属性，否则就是添加属性，并且如果是通过变量添加的属性，获取时一定要用`[]`，如果是通过字符串添加的属性，则获取时直接使用字符串的内容。

    如果获取一个对象没有的属性，则返回`undefined`

例如下面的代码：

```javascript
// 接上面的代码
// 获取对象的属性值
console.log(obj.name); // Jerry
console.log(obj.age); // 18
console.log(obj[symbol]); // Object Symbol
console.log(obj.str); // Object String
```

## 遍历对象

在JavaScript中，可以使用`for-in`遍历对象，基本语法如下：

```javascript
for(let arg in 对象/指向对象的变量) // arg代表变量名
```

!!! note
    `for-in`中的`arg`就是每一个对象的属性名

例如下面的代码：

```javascript
// for-in变量
for (let key in obj) {
    console.log(key, obj[key]);
}
```

## 对象的内存特点

在JavaScript中，原始值都是不可变类型，一旦在内存中确定就无法更改，但是对象是可变类型，其在程序运行过程中可以修饰，原因如下：

<img src="2. JavaScript对象基础.assets/image-20241012115734199.png" alt="image-20241012115734199" />

本质修改对象的属性值，就是修改对象中的属性指向的原始值的地址，但是对于对象来说，其属性地址可以被修改，所以内容就可以改变，从而对象是可以改变的，但是对于原始值本身来说，其地址和内容不可以修改，所以原始值是不可变的

如果使用赋值运算符将一个指向对象的变量赋值给另一个变量，则两个变量同时指向同一个变量，即浅拷贝，所以此时一个变量修改了对象的内容，就会影响到另一个变量指向的对象