<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# C语言函数

在C语言中，函数就是一个完成某项特定的任务的一小段代码

C语言包括两类函数，一是库函数，二是自定义函数

## 库函数

### 标准库和头文件

C语言标准中规定了C语言的各种语法规则，C语言并不提供库函数；C语言的国际标准ANSIC规定了⼀些常用的函数的标准，被称为标准库。而不同的编译器厂商根据ANSI提供的C语言标准就给出了⼀系列函数的实现，这些函数就被称为库函数

库函数相关头文件：[库函数头文件查询](https://zh.cppreference.com/w/c/header)

### 库函数的查询

C/C++官方的链接：[https://zh.cppreference.com/w/c/header](https://zh.cppreference.com/w/c/header)

cplusplus.com：[https://legacy.cplusplus.com/reference/clibrary/](https://legacy.cplusplus.com/reference/clibrary/)

### 库函数文档中的一般格式（以`qsort`函数为例）

1.函数原型

<img src="images\image.png">

2.函数功能介绍

<img src="images\image6.png">

3.参数和返回类型说明

<img src="images\image1.png">

4.代码举例

<img src="images\image2.png">

5.代码输出

<img src="images\image3.png">

6.相关知识链接

<img src="images\image4.png">

## 自定义函数

### 自定义函数语法形式

```C
ReturnValueType name(Parameters)
{
    //语句
}

ReturnValueType对应函数的返回值类型
name对应函数的名称
Parameters对应函数的形式参数信息，并且需要指定参数的类型和参数名称
```

- `ReturnValueType` 是用来表示函数计算结果的类型，有时候返回类型可以是 `void` ，表示什么都不返回，如果不写任何返回类型（包括`void`），则默认返回类型是`int`，但是不建议不写返回类型
- `name` 是为了方便使用函数；函数有了名字方便调用，所以函数名尽量要根据函数的功能起的有意义。
- 函数的参数可以是 `void`（也可以不写任何内容） ，明确表示函数没有参数。如果有参数，要交代清楚参数的类型和名字，以及参数个数。
- `{}`括起来的部分被称为函数体，函数体就是完成计算的过程

### 形式参数和实际参数

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int Add(int x, int y)//x和y为形式参数
{
    return (x + y);
}

int main()
{
    int a = 3;
    int b = 4;
    int ret = Add(a, b);//a和b为实际参数
    printf("%d\n", ret);

    return 0;
}
```

#### 实际参数

实际参数就是真实传递给函数的参数

#### 形式参数

如果只是定义了`Add`函数，而不调用函数，`Add`函数的参数`x`和`y`只是形式上存在的，不会向内存申请空间，不会真实存在的，所以称为形式参数。形式参数只有在函数被调用的过程中为了存放实参传递过来的值，才向内存申请空间，这个过程就是形式的实例化

#### 形式参数和实际参数的关系

形参和实参各自是独立的内存空间，形参是实参的⼀份临时拷贝。所以对形参的修改不影响实参，并且实参和形参可以重名

### `return`语句

- `return`后边可以是⼀个数值，也可以是⼀个表达式，如果是表达式则先执行表达式，再返回表达式的结果
- `return`后边也可以什么都没有，直接写 `return;` 这种写法适合函数返回类型是`void`的情况
- `return`返回的值和函数返回类型不⼀致，系统会自动将返回的值隐式转换为函数的返回类型
- `return`语句执行后，函数就彻底返回，后边的代码不再执行
- 如果函数中存在`if`等分分支的语句，则要保证每种情况下都有`return`返回，否则会出现编译错误

### 数组类型作为函数形参

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

void set_arr(int arr[], int sz)//第一个形参是数组形式，传入数组的大小作为第二个形参
{
    for (int i = 0; i < sz; i++)
    {
        arr[i] = 1;
    }
}

void print_arr(int arr[], int sz)//第一个形参是数组形式，传入数组的大小作为第二个参数
{
    for (int i = 0; i < sz; i++)
    {
        printf("%d ", arr[i]);
    }
}

int main()
{
    int num[10] = { 0 };
    int sz = sizeof(num) / sizeof(int);
    set_arr(num, sz);//将数组元素全部置为1
    print_arr(num, sz);//打印数组元素

    return 0;
}
输出结果：
1 1 1 1 1 1 1 1 1 1
```

- 函数的形式参数要和函数的实参个数匹配
- 函数的实参是数组，形参也是可以写成数组形式的
- 形参如果是一维数组，数组大小可以省略不写
- 形参如果是二维数组，行可以省略，但是列不能省略
- 数组传参，形参是不会创建新的数组的，即可以使用`void`返回类型
- 形参操作的数组和实参的数组是同一个数组，即改变形参数组等于改变实参数组

## 嵌套调用和链式访问

### 嵌套调用

嵌套调用就是函数之间的互相调用

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int is_leap_year(int y)//返回类型是int类型，并且传入一个int类型形参
{
    if (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0))
        return 1;
    else
        return 0;
}
int get_days_of_month(int y, int m)//返回类型是int，传入两个类型均为int类型的形参
{
    int days[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    int day = days[m];
    if (is_leap_year(y) && m == 2)//调用is_leap_year函数判断闰年，形成嵌套调用
        day += 1;

    return day;
}

int main()
{
    int y = 0;
    int m = 0;
    scanf("%d %d", &y, &m);
    int d = get_days_of_month(y, m);
    printf("%d\n", d);

    return 0;
}
输入：
2023 5
输出结果：
31
```

### 链式访问

所谓链式访问就是将⼀个函数的返回值作为另外⼀个函数的参数就是函数的链式访问

代码实例

```C
#include <stdio.h>
int main()
{
    printf("%d", printf("%d", printf("%d", 43)));//优先打印43，由于43是两个字符，故此时最内层的printf返回值位2，此时被中间层的printf接收到返回的值2，将2打印在屏幕上，并返回1，最外层的printf函数接收到返回值1，将其打印在屏幕上，故打印4321
    return 0;
}
输出结果：
4321
```

## 函数定义与函数声明

函数的调用一定要满足，先声明后使用；

函数的定义也是一种特殊的声明，如果函数定义放在调用之前，那么则不需要再声明

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int is_leap_year(int);//函数声明，函数声明中参数可以只保留类型，省略掉变量名
int get_days_of_month(int y, int m);//函数声明

int main()
{
    int y = 0;
    int m = 0;
    scanf("%d %d", &y, &m);
    int d = get_days_of_month(y, m);
    printf("%d\n", d);

    return 0;
}

int is_leap_year(int y)//函数定义
{
    if (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0))
        return 1;
    else
        return 0;
}

int get_days_of_month(int y, int m)//函数定义
{
    int days[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    int day = days[m];
    if (is_leap_year(y) && m == 2)
        day += 1;

    return day;
}
```

!!! note
    一般情况下，函数的声明、类型的声明放在头文件（`.h`）中，函数的实现是放在源文件（`.c`）文件中

## 作用域和生命周期

### 作用域

作用域是程序设计概念，通常来说，一段程序代码中所用到的名字并不总是有效（可用）的，而限定这个名字的可用性的代码范围就是这个名字的作用域

- 局部变量的作用域是变量所在的局部范围
- 全局变量的作用域是整个工程（项目）

### 生命周期

生命周期指的是变量的创建(申请内存)到变量的销毁(收回内存)之间的⼀个时间段。

1. 局部变量的生命周期是：进入作用域变量创建，生命周期开始，出作用域生命周期结束
2. 全局变量的生命周期是：整个程序的生命周期，程序结束时，全局变量销毁

## `static`和`extern`关键字

### `static`关键字

`static`关键字用来：

- 修饰局部变量
- 修饰全局变量
- 修饰函数

```C
#define _CRT_SECURE_NO_WARNINGS 1
#include <stdio.h>
void test()
{
    int i = 0;
    i++;//i是test函数中的局部变量，不影响main函数中的i
    printf("%d ", i);
}
int main()
{
    int i = 0;
    for(i=0; i<5; i++)
    {
        test();//每一次调用都是重新调用，故每一次都打印1
    }
    return 0;
}
输出结果：
1 1 1 1 1
```

代码1的`test`函数中的局部变量`i`是每次进入`test`函数先创建变量（生命周期开始）并赋值为0，然后`++`，再打印，出函数的时候变量生命周期将要结束（释放内存）

```C
#define _CRT_SECURE_NO_WARNINGS 1
#include <stdio.h>
void test()
{
    static int i = 0;
    i++;//static修饰的静态i，出test函数后依旧有效，但是作用域依旧在test函数内
    printf("%d ", i);
}

int main()
{
    int i = 0;
    for(i=0; i<5; i++)//main函数中的i不影响test中的i，因为main中的i是局部变量，作用域只在main函数中
    {
        test();//第一次调用是1，第二次调用因为i未销毁，故打印2，以此类推
    }
    return 0;
}
输出结果：
1 2 3 4 5
```

代码2中，我们从输出结果来看，`i`的值有累加的效果，其实`test`函数中的`i`创建好后，**出函数的时候不会销毁，重新进入函数也就不会重新创建变量，直接上次累积的数值继续计算**

### `extern`关键字

`extern`是用来声明外部符号的，如果一个全局的符号在A源文件中定义的，在B源文件中想使用，就可以使用 `extern` 进行声明然后使用

```C
//未被static修饰的函数
int add(int a, int b)
{
    return (a + b);
}
```

函数默认是具有外部链接属性，具有外部链接属性，使得函数在整个工程中只要适当的声明就可以被使用

```C
//被static修饰的函数
static int add(int a, int b)
{
    return (a + b);
}
```

被 `static` 修饰后变成了内部链接属性，使得**函数只能在自己所在源文件内部使用，不可被同一工程中的其他文件访问**

!!! note

    若想在整个工程中使用`add`函数（变量也是如此），不能用`static`修饰，并且在其他文件中需要用`extern`修饰（**没有声明文件声明时**）

    如果想在整个工程中使用一个全局变量，当这个变量在头文件中，否则如果有多个文件包含时一定不要给初始值，否则会被报错为重定义；如果在一个源文件声明一个变量，在其他源文件中需要使用时，则可以使用`extern`实现只声明并且给初始值

```C
//add.c
int add(int a, int b)
{
    return (a + b);
}

//test.c
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

extern int add(int, int);//当没有.h文件声明当前使用的函数时，使用extern关键字修饰add函数使得add函数在同一工程下的不同文件中可以使用

int main()
{
    int a = 10;
    int b = 20;
    int ret = add(a, b);
    printf("%d\n", ret);
}
输出结果：
30
```

## 函数递归

函数递归中的递就是递推的意思，归就是回归的意思

### 递归限制条件

- 递归存在限制条件，当满足这个限制条件的时候，递归便不再继续。
- 每次递归调用之后越来越接近这个限制条件

代码实例：

```C
//求一个数的阶乘
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int Fact(int n)
{
    if (n <= 0)//终止递归条件
        return 1;
    else
        return n * Fact(n - 1);//函数递归
}

int main()
{

    int n = 0;
    scanf("%d", &n);
    int ret = Fact(n);
    printf("%d\n", ret);
    return 0;
}
输入：
3
输出结果：
6
```

### 递归过程解析

<img src="images/image5.png">

### 深入理解递归

见[算法：递归介绍](https://www.help-doc.top/algorithm/recursion-binary-tree/recursion-intro/recursion-intro.html)