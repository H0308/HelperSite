<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# JavaScript面向对象

## 类

前面创建对象时，会遇到下面的可能的问题：

1. 无法区分出不同类型的对象
2. 不方便批量创建对象
3. 不方便管理对象中的属性

为了解决上面的问题，JavaScript中也可以通过使用`class`关键字创建类，语法如下：

```JavaScript
class 类名 {
    // 属性
} // 类名要使用大驼峰命名

// 也可以使用下面的语法
const 类名 = class {
    // 属性
}
```

使用类创建对象就需要使用到`new`关键字，语法如下：

```JavaScript
let 变量 = new 类();
```

如果需要判断一个对象是否属于某一个类，可以使用`instanceof`关键字查看，代码如下：

```JavaScript
class Person {

}

class Dog {

}

let person = new Person();
let dog = new Dog();

console.log((dog instanceof Person)); // false
console.log((person instanceof Person)); // true
```

如果需要在类中创建属性，可以写为下面的代码：

```JavaScript
class Person {
    // 定义属性
    name;
    age;

    // 定义函数
    show() {
        console.log(this.name, this.age);
    }
}
```

在JavaScript中，也可以直接给属性默认值

```JavaScript
class Person {
    name = "mark";
    age = 18;

    show() {
        console.log(this.name, this.age);
    }

}

let person = new Person();
person.show(); // mark 18
```

如果需要创建静态属性，则可以使用`static`关键字，但是静态属性不可以被对象调用，只能使用类名调用，如果要在类内的方法中访问也需要使用`static`关键字修饰对应的方法：

```JavaScript
class Person {
    name = "mark";
    age = 18;

    show() {
        console.log(this.name, this.age);
    }

    static nation = "China";

    static showNation() {
        console.log(this.nation);
    }
}

let person = new Person();

person.show(); // mark 18
Person.showNation(); // China
```

需要注意，在类中，对于普通的方法而言，其`this`为调用方法的对象，而静态方法的`this`是当前类

## 构造函数

为了给每一个对象中的属性赋值，在创建对象时可以调用其构造函数为每一个属性赋值，在JavaScript中，构造函数格式如下：

```JavaScript
constructor(形参列表) {
    this.属性 = 形参1;
    // ...
}
```

同其他面向对象语言一样，如果不显式写构造函数，则会生成一个默认的无参构造函数

```JavaScript
constructor(){} // 无参构造
```

在JavaScript中，如果没有给属性赋值，除非该属性为私有，否则就可以在类内省略声明该属性，上面的代码也可以修改为如下：

```JavaScript
class Person {
    // name = "mark";
    // age = 18;

    constructor(name = "mark", age = "18") {
        this.name = name;
        this.age = age;
    }

    show() {
        console.log(this.name, this.age);
    }

    static nation = "China";

    static showNation() {
        console.log(this.nation);
    }
}

let person = new Person();

person.show();
Person.showNation();
```

## 封装

前面的类存在一个问题：类中的属性可以被外部随意访问，这一点违反了面向对象的三大特性，所以为了使属性私有化，在JavaScript中，可以使用`#`修饰指定的属性，此时的属性就是类中的私有属性，例如下面的代码：

```JavaScript
class Person {
    #name;
    #age;

    constructor(name = "mark", age = 18) {
        this.#name = name;
        this.#age = age;
    }

    show() {
        console.log(this.#name, this.#age);
    }

    static #nation = "China";

    static showNation() {
        console.log(this.#nation);
    }
}

let person = new Person();
person.show();
Person.showNation();
// 访问私有成员报错
person.#age = 20; // Private field '#age' must be declared in an enclosing class
```

!!! note
    注意，此处不要使用`person.age`，因为此时的`person.age`代表向`Person`类中添加一个`age`属性，而不是访问私有成员`#age`

此时为了保证外部能够修改和访问到私有变量，需要向外部提供`getter`和`setter`，可以直接按照传统定义函数的方式定义`getter`和`setter`，但是JavaScript提供了一个更方便的语法定义这两个函数：

!!! note
    注意，对于getter和setter来说，其函数名是私有属性名去掉`#`后的名称

```JavaScript
// getter
get 私有属性名(){
    return 私有属性;
}

// setter
set 私有属性名(形参){
    this.私有属性 = 形参;
}
```

例如下面的代码：

```JavaScript
class Person {
    #name;
    #age;

    constructor(name = "mark", age = 18) {
        this.#name = name;
        this.#age = age;
    }

    show() {
        console.log(this.#name, this.#age);
    }

    static #nation = "China";

    static showNation() {
        console.log(this.#nation);
    }


    // getter和setter
    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get age() {
        return this.#age;
    }

    set age(value) {
        this.#age = value;
    }
}
```

对于简化形式的getter和setter来说，就可以直接使用访问`.`访问和修改私有成员

```JavaScript
class Person {
    #name;
    #age;

    constructor(name = "mark", age = 18) {
        this.#name = name;
        this.#age = age;
    }

    show() {
        console.log(this.#name, this.#age);
    }

    static #nation = "China";

    static showNation() {
        console.log(this.#nation);
    }


    // getter和setter
    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get age() {
        return this.#age;
    }

    set age(value) {
        this.#age = value;
    }
}

let person = new Person();
person.show();
Person.showNation();
person.age = 20;
person.show();

输出结果：
mark 18
China
mark 18
```

!!! note
    需要注意，此时`person.age`不是创建新的属性，而是访问私有成员`#age`

## 多态

因为JavaScript是动态弱类型语言，所以多态本质就是使变量指向其他对象，例如下面的代码：

```JavaScript
class Person {
    #name;
    #age;

    constructor(name = "mark", age = 18) {
        this.#name = name;
        this.#age = age;
    }

    // getter和setter
    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get age() {
        return this.#age;
    }

    set age(value) {
        this.#age = value;
    }
}

class Dog {
    #name

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }
}

function fn(obj) {
    console.log(obj.name);
}

let person = new Person();
let dog = new Dog("dog");
fn(person);
fn(dog);

输出结果：
mark
dog
```

## 继承

与其他面向对象的语言一样，JavaScript也存在继承，与Java类似，JavaScript通过`extends`关键字实现继承，基本语法与Java类似

实现继承后，子类也可以重写父类方法，对于子类的构造函数来说，如果要初始化父类成员就需要在子类构造函数第一行使用super调用父类构造函数并传入指定的值

如果子类需要在自己的方法中调用父类的方法同Java一样，也需要通过`super`关键字调用

下面是一个示例：

```JavaScript
class Animal{
    #name;
    #age;

    constructor(name, age) {
        this.#name = name;
        this.#age = age;
    }

    show() {
        console.log(this.#name + " " + this.#age);
    }
}

class Dog extends Animal {
    // 子类特有成员
    #id;

    constructor(name, age, id) {
        // 初始化父类成员
        super(name, age);
        this.#id = id;
    }

    // 重写父类方法
    show() {
        // 调用父类方法
        super.show();
        console.log(this.#id);
    }
}

let dog = new Dog("dog", 2, 1);
dog.show();
```

!!! note
    同样，因为父类中的成员都是私有化的，所以子类无法直接访问父类的成员

## 对象的结构与原型对象

### 对象的结构

在JavaScript中，对象属性一共有两个存储位置：

1. 对象自身：存在于实例对象空间中，这种属性一般都是通过赋值的方式进行创建
2. 原型对象：对于类中的一些方法以及静态属性来说，这些内容会存储在原型对象中。如果主动向原型对象中添加属性，则该属性也存在于原型对象中

在JavaScript中，原型对象也是一个对象，而为了让已有的对象能够访问到原型对象，已有的对象中会有一个`__proto__`属性，该属性是一个对象引用，指向的就是该对象对应的原型对象

有了原型对象后，对象需要访问器属性时就会按照先访问自身进行查找，如果自身没有找到需要的属性，就会到其原型对象中寻找。例如下面的代码：

```javascript
class Animal{
    #name;
    #age;

    constructor(name, age) {
        this.#name = name;
        this.#age = age;
    }

    show() {
        console.log(this.#name + " " + this.#age);
    }
}

let animal = new Animal("dog", 18);
```

其对象结构示意图如下：

<img src="4. JavaScript面向对象.assets\Snipaste_2024-11-04_23-10-05.png">


需要注意的是，前面提到了两种添加方法的方式：

```javascript
class Person {
    #name
    #age

    constructor(name, age) {
        this.#name = name;
        this.#age = age;
    }

    // 使用赋值形式添加方法
    print = function show()  {
    }

    // 直接创建函数
    print1() {
    }
}
```

对于赋值形式添加的方法来说，其不能访问类内的私有成员，并且他是作为类对象成员属性而不是原型对象的成员属性，而对于直接创建的函数来说，其可以访问类内的私有成员，并且会存在于原型对象中

### 访问原型对象

在JavaScript中，访问原型对象一共有三种方式：

1. 对象访问：因为对象中存在一个`__proto__`属性，并且该属性并不是私有属性，所以可以通过`.`直接访问
2. 方法访问：`Object.getPrototypeOf(实例对象)`
3. 类属性：`Person.prototype`

!!! note
    尽管JavaScript提供了两种访问对象的原型对象的方式，但是不推荐使用第一种方式，如果真的要访问原型对象，就使用第二种方式

在JavaScript中，原型对象一般有下面的内容：

1. 对象中的方法和静态属性，或者手动向对象对应的原型对象中添加的属性
2. 对象的类构造方法`constructor`

例如下面的代码可以看到指定类对象的原型对象：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<script>
    class Person {
        #name
        #age

        constructor(name, age) {
            this.#name = name;
            this.#age = age;
        }

        // 使用赋值形式添加方法
        print = function show()  {
        }

        // 直接创建函数
        print1() {
        }
    }

    let person = new Person();

    console.log(Object.getPrototypeOf(person));
</script>
<body>

</body>
</html>
```

在控制台打印的结果如下：

<img src="4. JavaScript面向对象.assets\Snipaste_2024-11-04_23-19-15.png">

当可以访问原型对象后，就会产生一个原型链，对于由类创建的对象来说，其原型链如下：

对象 -> 对应类的原型对象 -> Object类对应的原型对象 -> `null`

如果是下面的方式创建的对象：

```javascript
const obj = {};
console.log(obj.__proto__);
```

则其原型链就是：

`obj` -> Object类对应的原型对象 -> `null`

原型链的作用就是决定对象查找属性的方式：

在当前对象中查找 -> 在当前对象对应的原型对象中查找 -> 在Object类对象对应的原型对象中查找 -> 找到`null`为止

如果在找到`null`时依旧没找到指定的属性，就会返回`undefined`

对比一下作用域链和原型链：

- 作用域链：决定查找变量的方式，找不到就报错
- 原型链：决定查找属性的方式，找不到返回`undefined`

### 原型对象的作用

原型对象存在的意义可以理解为C++和Java中的常量区、代码区等，因为对象中有些属性是不需要多次重复创建的，重复创建也只会浪费空间，对于这种情况下的属性来说，就只需要放在一个位置便于所有同类的对象访问。在JavaScript中，同一个类对象的原型对象都是同一个，根据原型链决定查找方式，对象自身中没有的属性就都会去对应的原型对象中，所以原型对象也就相当于一个公共区域

在JavaScript中，继承也是通过原型对象实现的，继承的本质就是子类可以访问父类中可以访问的内容，而根据原型链，尽管子类对象中没有父类中的属性，但是只需要满足子类的原型链有父类的对象就可以实现子类访问到父类中的属性。例如下面的代码：

```javascript
class Animal{

}

class Cat extends Animal{

}

class TomCat extends Cat{

}

const cat = new Cat()

console.log(cat.__proto__) // Animal实例对象
console.log(cat.__proto__.__proto__) // Animal类的原型对象 -> Object
console.log(cat.__proto__.__proto__.__proto__) // Object类的原型对象
console.log(cat.__proto__.__proto__.__proto__.__proto__) // null
```

### 修改原型对象

因为JavaScript允许用户访问对应对象的原型对象，所以理论上也是可以修改原型对象的内容，但是在现代的JavaScript编程中，不建议修改原型对象的内容，前面提到JavaScript中的继承就是通过原型对象实现的，所以之所以可以修改原型对象的内容，就是因为早期为了实现继承就是通过修改原型对象

修改原型对象的方式与修改普通对象的方式一致，此处不再赘述

## `instanceof`和`hasOwn`

在前面已经使用过一次`instanceof`，其使用方式与Java中一致，现在将其与`hashOwn`方法进行对比

- `instanceof`关键字：`instanceof`检查的是对象的原型链上是否有该类实例，只要原型链上有该类实例，就会返回`true`。有了原型对象的基础，实际上对于`instanceof`关键字来说，其原理就是利用原型对象，而因为`Object`是所有对象的原型，所以任何对象和`Object`进行`instanceof`运算都会返回`true`
- `hasOwn`方法：`hasOwn`方法是Object类的静态方法，其需要传递两个参数，第一个是指定被查找的对象，第二个参数是指定要查找的属性，如果属性再对象自身，返回`true`，否则返回`false`

!!! note
    
    除了`hasOwn`方法外，还有一个`hasOwnProperty`方法，但是这个方法是一个对象方法，其参数只需要传递要查找的属性即可，也可以使用`in`关键字，第一个操作符是要查找的属性，第二个操作符就是被查找的对象

例如下面的代码：

```c++
class Person {
    name = "孙悟空"
    age = 18

    sayHello() {
        console.log("Hello，我是", this.name)
    }
}

const p = new Person()

console.log(p instanceof Person) // true

console.log("sayHello" in p) // true
console.log(p.hasOwnProperty("sayHello")) // false
console.log(p.__proto__.__proto__.hasOwnProperty("hasOwnProperty")) // true
console.log(Object.hasOwn(p, "sayHello")) // false
```

## 旧版本创建类的方式（了解）

在ES6版本之前JavaScript创建类是通过函数来进行创建的，一个函数如果通过函数调用的方式调用就是「调用函数」，例如无参函数`show`调用即为`show()`，而如果函数是通过`new关键字＋函数名()`调用，则此时就是创建类对象，此时函数就相当于一个类的构造函数

例如下面的代码：

```javascript
function Person(name, age) {
    // 在构造函数中，this表示新建的对象
    this.name = name;
    this.age = age;

    this.sayHello = function(){
        console.log(this.name);
    }
}

const p = new Person("Mark", 18);
```

但是上面创建类的方式没有封装性，并且为了保证类不会被重复创建，可以将其放在一个立即执行函数中，代码如下：

```javascript
var Person = function () {
    function Person(name, age) {
        // 在构造函数中，this表示新建的对象
        this.name = name;
        this.age = age;

        this.sayHello = function(){
            console.log(this.name);
        }
    }

    // 向原型中添加属性（方法）
    Person.prototype.sayHello = function () {
        console.log(this.name);
    }

    // 静态属性
    Person.staticProperty = "xxx";
    // 静态方法
    Person.staticMethod = function () {}

    return Person;
})();
```

为了使外界可以接受到这个立即执行函数的返回值，常会通过一个变量来接受，例如上面的`Person`变量，此时如果通过new关键字按照下面的方式，就是在创建一个`Person`类对象

```javascript
var Person = (function () {
    function Person(name, age) {
        // 在构造函数中，this表示新建的对象
        this.name = name;
        this.age = age;

        this.sayHello = function(){
            console.log(this.name);
        }
    }

    // 为了保证所有对象共用一个方法，减少空间消耗，考虑向函数原型中添加属性（方法）
    Person.prototype.sayHello = function () {
        console.log(this.name);
    }

    // 静态属性
    Person.staticProperty = "xxx";
    // 静态方法
    Person.staticMethod = function () {}

    return Person;
})();

let person = new Person("Mark", 18);
```

在这种创建对象的方式中，如果想实现继承，就必须修改原型对象，例如下面的代码：

```javascript
var Animal = (function(){
    function Animal(){

    }

    return Animal;
})();


var Cat = (function(){
    function Cat(){

    }

    // 继承Animal
    Cat.prototype = new Animal();

    return Cat;
})();

var cat = new Cat();

console.log(cat);
```

在控制台查看输出结果如下：

<img src="4. JavaScript面向对象.assets\Snipaste_2024-11-05_22-26-40.png">

## 了解new运算符的过程

资料来源：[new operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)

当使用`new`去调用一个函数时，这个函数将会作为构造函数调用，使用`new`调用函数时，将会执行下面的过程：

1. 创建一个普通的JavaScript对象（Object对象：`{}`）, 为了方便，称其为新对象
2. 将构造函数的`prototype`属性设置为新对象的原型
3. 使用实参来执行构造函数，并且将新对象设置为函数中的`this`
4. 如果构造函数返回的是一个非原始值，则该值会作为`new`运算的返回值返回（此时相当于没有创建类对应的对象），如果构造函数的返回值是一个原始值或者没有指定返回值，则新的对象将会作为返回值返回，所以通常不会为构造函数指定返回值