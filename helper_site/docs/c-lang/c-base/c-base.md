# C语言基础知识

## C语言介绍 

C语言是一门编译型语言，C语言源代码都是文本文件，但文本文件本身不能运行，必须通过编译器翻译和链接器的链接，生成二进制的可执行文件才可以执行

在Windows平台下，C语言代码放在后缀为`.c`文本文件中，通过编译器编译生成后缀为`.obj`的目标文件，再通过链接器链接目标文件和链接库链接生成后缀为`.exe`可执行的二进制文件

在C语言中，把后缀为`.h`的文件称为头文件

## C语言基础代码分析

C语言代码实例：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{    
    printf("Hello world!");
    return 0;
}
输出结果：
Hello world!
```

### main函数

`main`函数形式：

```C
int main()
{
    //语句
}
```

每个C语言程序不管有多少行代码，都是从 `main` 函数开始执行的， `main` 函数是程序的入口`main` 函数也被叫做：主函数。 `main` 前面的 `int` 表示`main` 函数执行结束的时候返回⼀个整型类型的值。所以在 `main` 函数的最后写` return 0;` 正好前后呼应

- `main`函数是程序的入口
- `main`函数有且仅有⼀个
- 即使⼀个项目中有多个`.c`文件，但是只能有一个`main`函数（因为程序的入口只能有一个）

另外，除了上面`main`函数的写法外，还有下面两种常见的写法：

=== "写法1"

    ```c
    int main(int argc, char* argv[])
    {
        //语句
    }
    ```

=== "写法2"

    ```c
    int main(void)
    {
        //语句
    }
    ```

对于写法1，见[Linux命令行参数与环境变量](https://www.help-doc.top/Linux/command-line-env/command-line-env.html)

对于写法2，当在函数定义或声明中的参数列表指定为`void`时，它明确表示该函数不接受任何参数。这是一种明确定义的方式，告诉编译器和程序员这个函数是无参的。在ANSI C（C89/C90）之前的版本中，没有写`void`表示函数可以接受任意数量和类型的参数，在ANSI C（C89/C90）和更新的标准之后，与空括号被解释为函数没有参数的作用是相同的，但是为了保持向后兼容性，也允许没有参数时写`void`的形式存在。尽管最新的标准已经摒弃了无参需要写`void`的方式，但是在现代编程实践中，一般推荐显式地使用`void`来声明无参函数，以提高代码的可读性和避免潜在的混淆。所以如果一个函数没有参数，可以写`void`，也可以不写

### 库函数简介

```C
printf("Hello world!");
```

在上面的实例代码中，使用了`printf();`打印输出函数，使用库函数中函数需要包含特定的头文件，而`printf();`定义在头文件`stdio.h`，将该函数中需要打印的内容打印在控制台中，C语言相关函数头文件可在网站中查询：[C语言头文件查询](https://cplusplus.com/reference/clibrary/)

### C语言关键字介绍

```C
C语言中的关键字
auto  break   case  char  const   continue  default  do   double else  enum 
extern
float  for   goto  if   int   long  register    return   short  signed  
sizeof  static
struct  switch  typedef union  unsigned   void  volatile  while
C99标准新增的关键字
inline 、 restrict 、 _Bool 、 _Comploex 、 _Imaginary等
```

- C语言中关键字都有特殊的意义，程序员在创建标识符时不可单独使用和关键字重名的名称，并且关键字不可自己创建

C语言关键字介绍网站：[C语言关键字](https://zh.cppreference.com/w/c/keyword)

## 字符与ASCII编码

在C语言中，将各种单独的符号成为字符，而这些字符在表示时需要用单引号`''`，例如：`'a'`，`'b'`等

由于计算机中的数据都是以二进制的形式存储，而字符在计算机中以二进制序列存储，这个过程叫做编码，而C语言遵循ASCII编码

<img src="images\image.png">

注：在新的ASCII表共有256个字符

ASCII表查询：[ASCII编码表](https://zh.cppreference.com/w/cpp/language/ascii)

在ASCII中需要记忆的特殊位置的内容

- 数字0-9对应ASCII编码位置为：48-57
- 大写字母A-Z对应ASCII编码位置为：65-90
- 小写字符a-z对应ASCII编码位置为：97-122，其中小写字母与对应大写字母对应的ASCII编码值相差32
- 打印中不可见的字符对应ASCII编码位置为：0-32

ASCII字符打印代码实例：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    //因为0-32字符是不可见字符，故循环变量从32开始
    for (int i = 32; i < 128; i++)
    {
        printf("%c ", i);
        if (i % 16 == 15)
        {
            printf("\n");
        }
    }
    return 0;
}
输出结果：
! " # $ % & ' ( ) * + , - . /
0 1 2 3 4 5 6 7 8 9 : ; < = > ?
@ A B C D E F G H I J K L M N O
P Q R S T U V W X Y Z [ \ ] ^ _
` a b c d e f g h i j k l m n o
p q r s t u v w x y z { | } ~
```

## 转义字符

C语言中的转义字符：

- `\?` ：在书写连续多个问号时使⽤，防⽌他们被解析成三字母词，在新的编译器上没法验证了。
- `\'` ：用于表示字符常量`'`
- `\"` ：用于表示⼀个字符串内部的双引号
- `\\` ：用于表示⼀个反斜杠，防止它被解释为⼀个转义序列符。
- `\a` ：警报，这会使得终端发出警报声或出现闪烁，或者两者同时发⽣。
- `\b` ：退格键，光标回退⼀个字符，但不删除字符。
- `\f` ：换页符，光标移到下一页。在现代系统上，这已经反映不出来了，行为改成类似于` \v `。
- `\n` ：换行符。
- `\r` ：回车符，光标移到同⼀行的开头。
- `\t` ：制表符，光标移到下⼀个水平制表位，通常是下⼀个8的倍数。
- `\v` ：垂直分隔符，光标移到下⼀个垂直制表位，通常是下⼀行的同⼀列。

C语言中的特殊转义字符：

- `\ddd` ：ddd中的每一个d表示1~3个八进制（0-7）的数字。如：\130表示字符X
- `\xdd` ：dd中的每一个d表示2个十六进制（0-F）数字（x为固定内容代表十六进制）。如：\x30表示字符0
- `\0` ：null字符，代表没有内容， `\0`就是`\ddd`这类转义字符的⼀种，用于字符串的结束标志，其ASCII码值是0

!!! note
    其中注意转义字符\b，具体效果见博客：[转义字符\b解析博客](https://blog.csdn.net/m0_73281594/article/details/133838696?spm=1001.2014.3001.5501)

C语言中的转义字符参考：[转义字符参考网址](https://zh.cppreference.com/w/c/language/escape)

## C语言语句分类

### 空语句

只有一个分号的语句即为空语句

```C
#include <stdio.h>

int main()
{
    ;//空语句
    return 0;
}
```

### 表达式语句

表达式后面加上`;`即为表达式语句

```C
#include <stdio.h>

int main()
{
    int a = 10;
    int b = 5;
    b = a + b;//表达式语句
    return 0;
}
```

### 函数调用语句

函数调用时需要加上分号，称为函数调用语句

```C
#include <stdio.h>

int Add(int a, int b)
{
    return (a + b);
}

int main()
{
    int a = 20;
    int b = 4;
    int ret = Add(a + b);//函数调用语句
    return 0;
}
```

### 复合语句

在C语言中成对的花括号`{}`中的语句构成一个代码块，亦称为复合语句

```C
#include <stdio.h>

int main()//函数{}中的代码构成复合语句
{
    for(int i = 0; i < 10; i++)//循环的{}中的代码构成复合语句
    {
        printf("%d ", i);
    }
    return 0;
}
```

### 控制语句

在C语言中用于控制程序的执行流程的语句成为控制语句，从而实现不同的结构方式

#### 条件判断语句（分支语句）

`if`语句、`switch`语句

#### 循环执行语句

`do while`语句、`while`语句、`for`语句

#### 跳转语句

`break`语句、`goto`语句、`continue`语句、`return`语句

## C语言中注释

注释：对代码的说明，编译器会忽略注释

### 块注释/**/的形式

将注释放在`/**/`中，从第一个`/*`开始到后面的`*/`结束

```C
块注释
/*
*
*
*/
```

块注释可以插在行内

```C
int fopen(char* s /* file name */, int mode);
/* file name */ 用来对函数参数进行说明，跟在它后面的代码依然会有效执行
```

!!! note
    块注释不支持嵌套注释， `/*` 开始注释后，遇到后面的第⼀个 `*/` 就认为注释结束了

### 行注释//的形式

将注释放在双斜杠 `//` 后面，从双斜杠到行尾都属于注释

行注释只能是单行，可以放在行首，也可以放在一行语句的结尾

```C
printf("// hello /* world */ ");//行注释和块注释均失效
```

!!! note
    不管是哪⼀种注释，都不能放在双引号里面。双引号里面的注释符号，会成为字符串的⼀部分，解释为普通符号，失去注释作用

!!! note
    编译时，注释会被替换成⼀个空格，所以` min/* 这里是注释*/Value` 会变成 `min Value`（`min`和`Value`中间有空格） ，而不是 `minValue`（`min`和`Value`中无空格） 

