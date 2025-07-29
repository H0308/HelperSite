# C语言预处理（部分）

## 预定义符号

在C语言中，设置了⼀些预定义符号，可以直接使用，预定义符号同样在预处理期间处理，直接进行替换操作

```C
__FILE__      //进⾏编译的源文件 
__LINE__     //⽂件当前的行号 
__DATE__    //⽂件被编译的日期 
__TIME__    //⽂件被编译的时间 
__STDC__    //如果编译器遵循ANSI C，其值为1，否则未定义（VS2022不遵循）
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{

    printf("文件位置:%s\n当前代码所在行数：%d\n代码编译日期：%s\n代码编译时间：%s\n", __FILE__, __LINE__, __DATE__, __TIME__);

    return 0;
}
输出结果：
文件位置:E:\C_language\c_-language\test\test.c
当前代码所在行数：8
代码编译日期：Jan 16 2024
代码编译时间：20:34:25
```

## `#define`定义常量

```C
使用方法
#define name content
```

!!! note
    `#define`定义中content后面不要带`;`避免不必要的错误

!!! note
    `#define`定义的表达式在替换过程中不会进行计算

```C
#define PLUS 50 + 5
//在替换过程中，不会替换为50 + 5之后的值55，而是直接替换为50 + 5
```

代码实例

```C
//#define定义常量
#define MAX 100 //定义一个MAX常量，其值为100
#define RES register //为register关键字定义一个更简短的名字
#define cycle_forever for(;;) //为死循环的实现定义一个只管的符号
#define CASE break;case //在case语句后自动加上break，使用CASE:时，将替换为break;case:
//如果定义的content过⻓，可以分成多行写，除了最后一⾏外，每行的后⾯都加一个反斜杠(续⾏符)
#define DEBUG_PRINT printf("file: %s\tline:%d\t \
                            date:%s\ttime:%s\n", \
                           __FILE__,__LINE__, __DATE__,__TIME__)
```

## `#define`定义宏

`#define`机制包括了⼀个规定，允许把参数替换到文本中，这种实现通常称为宏（macro）或定义宏（define macro）

```C
使用方法
#define name( parament-list ) content
其中的 parament-list是⼀个由逗号隔开的符号表（类似于函数参数列表，但是没有类型书写和限制，只有符号），它们可能出现在content中
```

!!! note
    参数列表的左括号必须与`name`紧邻，如果两者之间有任何空白存在，参数列表就会被解释为`content`的一部分

!!! note
    在使用`#define`定义宏时，需要考虑到宏content部分运算符、parament-list部分的运算符以及使用宏时邻近的运算符的优先级和表达式的副作用

!!! quote
    表达式副作用：运算符本身不仅仅是计算出两个操作数的运算结果，而是既会计算出结果，也会改变本身操作数的值，例如`a + 1`，此时只是计算出`a`变量加上1之后的值，但是`a++`不但会计算出`a + 1`的值，还会改变`a`本身的值

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//#define MAX 100
#define DOUBLE(x) x * x //定义一个宏实现一个数值的平方，未考虑到宏定义表达式不计算以及parament-list部分的运算符和宏定义content部分的运算符优先级
#define DOUBLE1(y) (y) * (y) //考虑到宏定义中的表达式不计算以及parament-list部分的运算符和宏定义content部分的运算符优先级
#define DOUBLE2(z) (z) * (z) + 1 //未考虑到宏定义content部分的优先级与宏使用宏时邻近的运算符的优先级
#define DOUBLE3(n) ((n) * (n) + 1) //考虑到宏定义content部分的优先级与宏使用宏时邻近的运算符的优先级

#define MAX(a, b) (((a) > (b)) ? (a) : (b)) //定义宏求两个数之间的较大数

int main()
{
    //运算符优先级
    printf("%d\n", DOUBLE(5));
    printf("%d\n", DOUBLE(5 + 1));//因为宏定义中的表达式5 + 1不会进行计算，在代入宏中时，将直接替换，即5 + 1 * 5 + 1，而不是(5 + 1) * (5 + 1)
    printf("%d\n", DOUBLE1(5 + 1));//正常输出36，即(5 + 1) * (5 + 1)
    printf("%d\n", 2 * DOUBLE2(5));//直接替换时为2 * (5) * (5) + 1，而不是2 * ((5) * (5) + 1)
    printf("%d\n", 2 * DOUBLE3(5));//正常输出52，即2 * ((5) * (5) + 1)

    putchar('\n');

    //表达式副作用
    int a = 3;
    int b = 5;

    int ret = MAX(a, b);//直接比较没有副作用
    
    printf("%d\n", ret);
    //不改变a和b中的值
    printf("%d\n", a);
    printf("%d\n", b);
    
    int ret1 = MAX(a++, b++);//存在使操作数本身发生改变的副作用

    printf("%d\n", ret1);
    //a和b中的值发生改变
    //(((a++) > (b++)) ? (a++) : (b++))
    //因为是后置++，故先使用再+1，故有3 > 5，此时再改变a和b中的值，此时a为4， b为6
    //因为三目操作符表达式的值即为满足条件的表达式的值，故即为b的值6，使用完b后进行++。此时b中的值为7，但是a++表达式并未计算，故a还是4
    //故此时a为4，b为7
    printf("%d\n", a);
    printf("%d\n", b);

    return 0;
}
输出结果：
25
11
36
51
52

5
3
5
6
4
7
```

### 宏命名约定

- 把宏名全部大写
- 函数名不要全部大写

!!! note
    存在部分例外，例如宏`offsetof`

### 宏替换规则

在程序中扩展`#define`定义符号和宏时，需要涉及下面的步骤。

1. 在调用宏时，首先对参数进行检查，看看是否包含任何由`#define`定义的符号。如果是，它们首先被替换。
2. 替换文本随后被插入到程序中原来文本的位置。对于宏，参数名被他们的值所替换。
3. 最后，再次对结果文件进行扫描，看看它是否包含任何由`#define`定义的符号。如果是，就重复上述处理过程

!!! note

    宏参数和`#define`定义中可以出现其他`#define`定义的符号。但是对于宏，不能出现递归

    当预处理器搜索`#define`定义的符号的时候，字符串常量的内容并不被搜索

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

#define MAX 100

int main()
{
    printf("MAX is %d\n", MAXN);//由于MAXN在字符串常量"MAX is %d\n"中，故不会被替换为100

    return 0;
}
输出结果：
MAX is 100
```

### 宏与函数对比

在C语言中，宏通常被用于执行简单的计算，例如找两个数中的较大数

```C
宏实现
#define MAX(a, b) (((a) > (b)) ? (a) : (b))

函数实现
int max(int a, int b)
{
    return ((a > b) ? a : b);
}
```

- 上面两种方式比较中宏的优势：

1. 用于调用函数和从函数返回的代码可能比实际执行这个小型计算⼯作所需要的时间更多。所以宏比函数在程序的规模和速度方面更胜一筹
2. 宏与类型无关。函数的参数必须声明为特定的类型，所以函数只能在类型合适的表达式上使用。而宏可以适用于整型、长整型、浮点型等可以用 `>` 来比较的类型。

- 上面两种方式比较中宏的劣势：
- 每次使用宏的时候，宏定义的代码将插入到程序中。除非宏比较短，否则可能大幅度增加程序的长度
- 宏没法调试，因为在预编译过程中已经发生了替换
- 宏由于类型无关，也就不够严谨
- 宏可能会带来运算符优先级的问题，导致程容易出现错误

宏可以做到函数做不到的事情：

- 宏的参数可以为类型

```C
#define MALLOC(num, type) (type*)malloc(num, sizeof(type))

MALLOC(10, int);//int类型名作为参数
替换后为
(int*)malloc(10, sizeof(int))

代码实例
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <assert.h>
#include <stdlib.h>

#define MALLOC(num, type) (type*)malloc(num, sizeof(type))

int main()
{
    int* p = MALLOC(10, int);
    assert(p);

    for (int i = 0; i < 10; i++)
    {
        p[i] = i;
        printf("%d ", p[i]);
    }

    return 0;
}
```

| 属性             | `#define`定义宏                                              | 函数                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 代码长度         | 每次使用时，宏代码都会被插入到程序中。除了非常小的宏之外，程序的长度会大幅度增长 | 函数代码只出现一个地方，而每次使用函数时，都调用同一份代码   |
| 执行速度         | 更快                                                         | 存在函数的调用和返回的额外时间和空间开销，所以相对可能慢一些 |
| 操作符优先级     | 宏参数的求值是在所有周围表达式的上下文环境中，除非加上括号改变优先级，否则运算符优先级可能影响最后的计算结果 | 函数参数只在函数调用的时候进行求值，并且进行一次，求值后的结果传递给函数，表达式的结果更容易预测 |
| 带有副作用的参数 | 参数可能被替换到宏中的多个位置，如果宏的参数被多次使用，带有副作用的参数可能导致最后结果出错 | 函数参数只在传参时计算一次，结果更容易控制                   |
| 参数类型         | 宏的参数与类型无关，只要对参数的操作是合法的，则可以使用任何参数类型 | 函数的参数与类型有关，如果参数的类型不同，则需要不同的函数，即使函数执行的任务不同 |
| 调试             | 宏无法调试                                                   | 函数可以逐语句进行调试                                       |
| 递归             | 宏无法递归                                                   | 函数可以递归                                                 |

## `#`与`##`运算符

### `#`运算符

`#`运算符将宏的一个参数转换为字符串字面量。它仅允许出现在带参数的宏的替换列表中

!!! note
    `#`运算符所执行的操作可以理解为“字符串化”

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

#define PRINT(n, type) printf(#n" = "type"\n", n) //printf语句支持有多个""的字符串构成一句字符串，例如printf("hello world");相当于printf("hello""world");

int main()
{
    int a = 10;
    int b = 10;
    float f = 10.5f;

    //常规做法
    printf("a = %d\n", a);
    printf("b = %d\n", b);
    printf("f = %f\n", f);

    //使用#运算符与#define定义宏
    PRINT(a, "%d");
    PRINT(b, "%d");
    PRINT(f, "%f");

    return 0;
}
输出结果：
a = 10
b = 10
f = 10.500000
a = 10
b = 10
f = 10.500000
```

### `##`运算符

`##` 可以把位于它两边的符号合成一个符号，它允许宏定义从分离的文本片段创建标识符。 `##` 被称为记号粘合

代码实例

```C
//求int类型数据的两个数中较大数
int int_max(int x, int y)
{
    return (x>y?x:y);
}

//求float类型数据的两个数中较大数
float float_max(float x, float y)
{
    return (x>y? x:y);
}

//使用##运算符以及#define定义宏
#define GENERIC_MAX(type)\
type type##_max1(type x, type y)\
{\
    return (x > y ? x : y);\
}

GENERIC_MAX(int)
GENERIC_MAX(float)
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//求int类型数据的两个数中较大数
int int_max(int x, int y)
{
    return (x > y ? x : y);
}

//求float类型数据的两个数中较大数
float float_max(float x, float y)
{
    return (x > y ? x : y);
}

#define GENERIC_MAX(type)\
type type##_max1(type x, type y)\
{\
    return (x > y ? x : y);\
}

GENERIC_MAX(int)
GENERIC_MAX(float)

int main()
{

    int a = 10;
    int b = 20;
    float f = 10.5f;
    float f1 = 20.5f;

    //两个类型写两个函数
    int ret_i = int_max(a, b);
    float ret_f = float_max(f, f1);
    printf("%d\n", ret_i);
    printf("%f\n", ret_f);

    //##运算符和#define定义宏，只需要写一个函数
    ret_i = int_max1(a, b);
    ret_f = float_max1(f, f1);
    printf("%d\n", ret_i);
    printf("%f\n", ret_f);

    return 0;
}
输出结果：
20
20.500000
20
20.500000
```

## `#undef`预处理指令

作用：移除一个宏定义

```C
#undef NAME
//如果现存的一个名字需要被重新定义，那么它的旧名字首先要被移除。
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

#define MAXNUM 100

int main()
{
    printf("%d\n", MAXNUM);
#undef MAXNUM //移除MAXNUM定义
    //printf("%d\n", MAXNUM);//未重新定义之前不可以再使用
#define MAXNUM 100 //重新定义可以使用
    printf("%d\n", MAXNUM);

    return 0;
}
输出结果：
100
100
```

## 命令行定义（Linux）

许多C的编译器提供了⼀种能力，允许在命令行中定义符号。用于启动编译过程

例如：

当我们根据同一个源文件要编译出一个程序的不同版本的时候，这个特性有点用处。（假定某个程序中声明了一个某个长度的数组，如果机器内存有限，我们需要一个很小的数组，但是另外一个机器内存大，我们需要一个数组能够大）

```C
#include <stdio.h>
int main()
{
    int array [ARRAY_SIZE];
    int i = 0;
    for(i = 0; i< ARRAY_SIZE; i ++)
    {
        array[i] = i;
    }
    for(i = 0; i< ARRAY_SIZE; i ++)
    {
        printf("%d " ,array[i]);
    }
    printf("\n" );
    return 0;
}
```

使用`gcc`命令

```C
gcc -D ARRAY_SIZE=10 programe.c
//-D ARRAY_SIZE=10为ARRAY_SIZE指定大小
```

## 条件编译

所谓条件编译，即满足指定条件时进行编译，不满足时不编译

常见的条件编译指令

```C
1.
#if  常量表达式
        //语句
#endif
//常量表达式由预处理器求值，并且不能使用变量，因为变量在预处理过程中并没有具体值
如：
#define __DEBUG__ 1
#if __DEBUG__ //如果DEBUG值为非0值，则编译语句，为0则不编译
        //语句
#endif

#if 1==2 //1==2为假，不编译语句
        //语句
#endif

2.多个分⽀的条件编译（只会走其中一个条件，与if-else-if逻辑相同）
#if 常量表达式
        //语句
#elif 常量表达式
        //语句
#else
        //语句
#endif

3.判断是否被定义（只关注是否被定义，不会关注具体值大小）
#if defined(symbol) //定义了symbol就编译，否则不编译
        //语句
#endif

#ifdef symbol //定义了symbol就编译，否则不编译
        //语句
#endif

#if !defined(symbol) //未定义symbol就编译，否则不编译
        //语句
#endif 

#ifndef symbol //未定义symbol就编译，否则不编译
        //语句
#endif

4.嵌套指令
#if defined(OS_UNIX)//定义了OS_UNIX则编译if内的内容
        #ifdef OPTION1 //定义了OPTION1，则编译
                unix_version_option1();
        #endif
        #ifdef OPTION2 //定义了OPTION2，则编译
                unix_version_option2();
        #endif
#elif defined(OS_MSDOS)//定义了OS_UNIX则编译elif内的内容
        #ifdef OPTION2 //定义了OPTION2，则编译
                msdos_version_option2();
        #endif
#endif
```

## 头文件包含指令`#include`

双引号`""`引用的头文件查找策略：先在源文件所在目录下查找，如果该头文件未找到，编译器就像查找库函数头文件一样在标准位置查找头文件，如果找不到就提示编译错误

双箭头`<>`引用的头文件查找策略：查找头文件直接去标准路径下去查找，如果找不到就提示编译错误

!!! note
    对于库文件也可以使用`""`的形式，但是这样做查找的效率就低些，因为库文件一般都不在源文件所在目录，但是有需要再原文件所在目录进行查找，浪费一定的时间，并且这样也不容易区分是库文件还是本地文件

### 嵌套文件包含

在使用`#include`指令时，预处理器先删除`#include`，并用包含文件的内容替换。如果一个头文件被包含10次，那就实际被编译10次，如果重复包含，对编译的压力就比较大

可以使用条件编译防止头文件被多次包含

```C
//头文件中的#ifndef/#define/#endif用于防止头文件被重复引入
#ifndef __TEST_H__//在第二次之后，查找发现文件中定义了__TEST_H__，则不进行编译后面的语句
#define __TEST_H__//在原来的头文件中第一次未定义__TEST_H__，则会编译本条语句以及头文件的内容
//头⽂件的内容 
#endif   //__TEST_H__

或者
#pragma once
```