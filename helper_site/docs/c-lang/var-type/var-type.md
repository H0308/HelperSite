<!-- 添加对Katex的支持 -->
<script defer src="/javascripts/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"></script>

<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# C语言数据类型和变量

## C语言中的数据类型

<img src="images\image.png">

### 字符类型

```C
char
unsigned char
[signed] char
```

### 整型

```C
//短整型 
short [int]
[signed] short [int]（也是short类型默认的形式）
unsigned short [int]
//整型 
int
[signed] int（也是int类型默认的形式，所有整数默认为int类型）
unsigned int（也可以写成unsigned，即省略int）
//⻓整型 
long [int]
[signed] long [int]（也是long类型默认的形式）
unsigned long [int]
//更⻓的整型 
//C99中引⼊
long long [int]
[signed] long long [int]（也是long long类型默认的形式）
unsigned long long [int]
```

### 浮点型

```C
float
double （小数默认为double类型，若需要定义成float类型，需要在小数数值后加上f，例如3.14f）
long double
```

### 布尔类型

C语言默认0为假，1为真，而在布尔类型中也是如此，0表示false，1表示true

```C
_Bool
```

使用布尔类型需要包含头文件`stdbool.h`

而布尔类型的取值为

```C
true
false
```

### C语言中的字符串

#### 字符串与`\0`

在C语言中，使用双引号括起来的一串字符称为字符串

字符串的打印格式可以使用`%s`指定，或者直接当常量打印

```C
#include <stdio.h>
int main()
{
    printf("%s\n", "hello C");//使用%s指定
    printf("hello c");//直接当常量打印
    return 0;
}
```

在C语言中，字符串默认以`\0`字符作为结尾标志

`\0 `是字符串的结束标志。所以我们在使用库函数 `printf()` 打印字符串或者`strlen()` 计算字符串长度的时候，遇到 `\0` 的时候就自动停止了

```C
#include <stdio.h>
int main()
{
    char arr1[] = {'a', 'b', 'c'};//arr1数组中存放3个字符 
    char arr2[] = "abc"; //arr2数组中存放字符串 
    printf("%s\n", arr1);//由于arr1数组中没有\0，导致%s找不到\0结束标志，导致出现乱码
    printf("%s\n", arr2);//由于字符串默认以\0结尾，所以arr2中有\0，故%s可以找到结束标志，正常打印
    
    return 0;
}
输出结果：
abc烫烫烫烫烫烫烫烫烫烫烫烫烫烫蘟bc
abc
```

但若在`arr1`数组中加入`\0`字符时，效果就与`arr2`数组相同

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
int main()
{
    char arr1[] = { 'a', 'b', 'c', '\0' };
    char arr2[] = "abc";
    printf("%s\n", arr1);
    printf("%s\n", arr2);
    printf("%s\n", "abc\0def");//遇到\0不再打印

    return 0;
}
输出结果：
abc
abc
abc
```

### 各类型的长度

#### C语言各类型的长度(环境：编译器VS2022，x64)

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
int main()
{
    printf("%zd\n", sizeof(char));
    printf("%zd\n", sizeof(_Bool));
    printf("%zd\n", sizeof(short));
    printf("%zd\n", sizeof(int));
    printf("%zd\n", sizeof(long));
    printf("%zd\n", sizeof(long long));
    printf("%zd\n", sizeof(float));
    printf("%zd\n", sizeof(double));
    printf("%zd\n", sizeof(long double));
    return 0;
}
输出结果：
1（char）
1（_Bool）
2（short）
4（int）
4（long）
8（long long）
4（float）
8（double）
8（long double）
```

### signed和unsigned关键字

在C语言中使用`signed`和`unsigned`表示有符号和无符号数修饰字符类型和整数类型

- `signed`表示有符号数，即有正负之分的数值
- `unsigned`表示无符号数，即最小值为0，无负值

整数变量声明为 `unsigned` 的好处是，同样长度的内存能够表示的最大整数值，增大了⼀倍。

比如，16位的 `signed short int` 的取值范围是：-32768~32767，最大是32767；而

`unsigned short int` 的取值范围是：0~65535，最大值增大到了65535。

字符类型也可以用`signed`和`unsigned`修饰

```C
signed char c; // 范围为 -128 到 127 
unsigned char c; // 范围为 0 到 255
```

!!! note

    C语言规定 `char` 类型默认是否带有正负号，由当前系统决定

    也就是说`char` 不等同于 `signed char` ，它有可能是 `signed char` ，也有可能是`unsigned char`

各数据类型可以表示的数据的范围

在C语言中，头文件`limits.h` 文件中说明了整型类型的取值范围，`float.h` 这个头⽂件中说明浮点型类型的取值范围

在头文件中定义了类似以下内容的常量

```C
SCHAR_MIN ， SCHAR_MAX ：signed char的最⼩值和最⼤值。
SHRT_MIN ， SHRT_MAX ：short的最⼩值和最⼤值。
INT_MIN ， INT_MAX ：int的最⼩值和最⼤值。
LONG_MIN ， LONG_MAX ：long的最⼩值和最⼤值。
LLONG_MIN ， LLONG_MAX ：long long的最大值和最小值
UCHAR_MAX ：unsigned char的最⼤值。
USHRT_MAX ：unsigned short的最⼤值。
UINT_MAX ：unsigned int的最⼤值。
ULONG_MAX ：unsigned long的最⼤值。
ULLONG_MAX ：unsigned long long的最⼤值。
```

### 数据类型的最大值和最小值分析

!!! note
    以`char`类型为例进行分析

有符号的`char`类型

| 一个字节（加上最高位的符号位总共八位，内存中按照补码存储） |         |            |
| ---------------------------------------------------------- | ------- | ---------- |
| 符号位                                                     | 数值位  | 对应十进制 |
| 0                                                          | 0000000 | 0          |
| 0                                                          | 0000001 | 1          |
| 0                                                          | 0000010 | 2          |
| 0                                                          | 0000011 | 3          |
| 0                                                          | 0000100 | 4          |
| ...                                                        | ...     | ...        |
| 1                                                          | 0000000 | -128       |
| 1                                                          | 0000001 | -127       |
| ...                                                        | ...     | ...        |
| 1                                                          | 1111110 | -2         |
| 1                                                          | 1111111 | -1         |

轮回图

<img src="images\image1.png">

!!! note

    特殊规定：有符号的数据类型，当最高位的符号位为1，数值位全为0时，将自动将该值解析为在当前补码前添加1后的补码（虚拟地将8位变9位，第9位为符号位，剩余8位为符号位），仅限于“当最高位的符号位为1，数值位全为0”才可以使用。例如10000000，最高位添加1变为110000000，因为是有符号数的补码，故取反+1得到原码，反码为：101111111，+1得补码为110000000，即-128

无符号的`char`类型

| 一个字节（最高位也为数值位，总共八位，内存中按照补码存储） |            |
| ---------------------------------------------------------- | ---------- |
| 数值位                                                     | 对应十进制 |
| 00000000                                                   | 0          |
| 00000001                                                   | 1          |
| 00000010                                                   | 2          |
| 00000011                                                   | 3          |
| 00000100                                                   | 4          |
| ...                                                        | ...        |
| 10000000                                                   | 128        |
| 10000001                                                   | 129        |
| ...                                                        | ...        |
| 11111110                                                   | 254        |
| 11111111                                                   | 255        |

<img src="images\image2.png">

## C语言中的变量

在C语言中，把不变的量称为常量，把可以改变的量称为变量

### 变量的创建

```C
type name;
type对应数据类型
name对应变量名称

例如：
int age;
char ch;
double float;
```

!!! note
    注意如果将多个变量名放在一个声明语句中，指针类型的*标识需要放在每个变量前，例如`int *a, b`意味着a是指针类型，而b是`int`类型，因为`*`只结合a变量，不结合b变量，正确的写法是`int *a, *b`

### 变量的初始化

```C
int age = 18;
char ch = 'w';
double weight = 48.0;
unsigned int height = 100;
```

### C语言中变量的分类

全局变量：

在一对`{}`外部定义的变量即为全局变量，在C语言中一个全局变量可以在整个项目中使用

局部变量：

在一对`{}`内部定义的变量即为局部变量，在C语言中一个局部变量只可以在该变量所在花括号内部使用

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int grand_variable = 10;//全局变量

int main()
{
    int narrow_variable = 10;//局部变量
    while (narrow_variable--)
    {
        int i = 0;
        printf("%d ", ++i);//i变量只可以在本循环中使用
    }
    printf("\n");
    printf("%d\n", narrow_variable);
    printf("%d\n", grand_variable);

    return 0;
}
输出结果：
1 1 1 1 1 1 1 1 1 1
-1
10
```

当局部变量和全局变量重名时，优先局部变量

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int num = 10;

int main()
{
    int num = 5;
    printf("%d", num);//优先局部变量
    return 0;
{
输出结果：
5
```

## C语言数组

在C语言中，数组表示一组相同类型数据的集合，常见的有一维数组和二维数组（多维数组中的一种）

### 一维数组

#### 一维数组的创建和初始化

一维数组的创建

```C
type name[常量值];
type对应一维数组中各个元素的类型
name对应一维数组的名字，默认是首元素的地址
常量值对应一维数组元素个数
```

!!! note
    注意，在C语言中，数组下标可以是整型常量（例如1，2，3，4……）或整型表达式（只要算出来的值为整型的表达式，但是注意不可以是有变量的整型表达式，例如`a + 1`，`a > 2`，`a > 10 ? 5 : 10`）

一维数组的初始化

```C
//整型数组初始化
//完全初始化——元素个数与实际内容个数相同
int days[7] = {1, 2, 3, 4, 5, 6, 7};
int days[] = {1, 2, 3, 4, 5, 6, 7};//不指定数组的大小时，编译器会根据元素个数确定数组大小
//不完全初始化——元素个数少于实际内容个数
int days[7] = {1, 2, 3, 4, 5};//从第一个位置开始将实际内容放入的对应的地址，无实际内容的默认赋值为0
//错误初始化——元素个数小于实际内容个数
int days[5] = {1, 2, 3, 4, 5, 6, 7};//元素个数为5个，实际个数有7个
```

#### 数组类型

数组属于自定义类型，将数组名去除即为数组的类型

```C
int days[7] = {0}; 
数组days的类型就是int [7]
```

#### 数组下标及访问

在C语言中，数组下标从0开始

例如：

```C
int arr[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
```

| 数组元素 | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   |
| -------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 下标     | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    |

而在C语言中，访问数组时将使用下标引用操作符获取当前下标对应的值

```C
arr[0] = 1;
arr[1] = 2;
arr[2] = 3;
arr[3] = 4;
arr[4] = 5;
arr[5] = 6;
arr[6] = 7;
arr[7] = 8;
arr[8] = 9;
arr[9] = 10;
```

#### 数组元素打印

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int num[10] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

    //打印数组元素
    for (int i = 0; i < 10; i++)
    {
        printf("%d ", num[i]);
    }

    return 0;
}
输出结果：
1 2 3 4 5 6 7 8 9 10
```

#### 数组元素输入

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int num[10] = { 0 };

    //输入数组元素
    for (int i = 0; i < 10; i++)
    {
        scanf("%d", &num[i]);
    }

    for (int i = 0; i < 10; i++)
    {
        printf("%d ", num[i]);
    }

    return 0;
}
输入：
2 4 6 8 10 12 14 16 18 20
输出结果：
2 4 6 8 10 12 14 16 18 20
```

#### 一维数组在内存中的存储

```C
#include <stdio.h>
int main()
{
    int arr[10] = {1,2,3,4,5,6,7,8,9,10}; 
    int i = 0;
    for(i=0; i<10; i++)
    {
        printf("&arr[%d] = %p\n", i, &arr[i]);
    }
    return 0;
}
输出结果：
&arr[0] = 000000C838D4F798
&arr[1] = 000000C838D4F79C
&arr[2] = 000000C838D4F7A0
&arr[3] = 000000C838D4F7A4
&arr[4] = 000000C838D4F7A8
&arr[5] = 000000C838D4F7AC
&arr[6] = 000000C838D4F7B0
&arr[7] = 000000C838D4F7B4
&arr[8] = 000000C838D4F7B8
&arr[9] = 000000C838D4F7BC
```

相邻的两个数组元素地址大小相差4（一个`int`类型在内存中占用的字节数），并且地址大小随着下标的增长而变大，故可知数组元素在内存中是连续存放数据的，并且首元素的地址最小

#### 数组大小与数组元素个数的计算

##### 使用`sizeof`关键字计算数组大小

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };//计算数组所占内存空间的总⼤⼩，单位是字节

    printf("%zd\n", sizeof(arr));

    return 0;
}
输出结果：
40
```

##### 使用`sizeof`关键字计算数组元素个数

思路：使用`sizeof`关键字先计算出数组总大小，再除以数组中一个元素的大小即为数组元素个数

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
 
    printf("%zd\n", sizeof(arr));//数组总大小
    printf("%zd\n", sizeof(int));//数组一个元素的大小
    printf("%zd\n", sizeof(arr) / sizeof(int));//数组元素个数

    return 0;
}
输出结果：
40
4
10
```

### 二维数组

二维数组，又可以称作一维数组的数组

<img src="images\image3.png">

对比一维数组，可以发现二维数组由若干个一维数组组成

#### 二维数组的创建

```C
type name[常量值][常量值]
type对应二维数组中元素的类型
name对应二维数组的名字
第一个常量值对应二维数组的行数（行数即一维数组的个数）
第二个常量值对应二维数组的列数（列数即每个一维数组内的元素个数）
```

#### 二维数组的类型

同一维数组，二维数组的类型即去掉数组名

```C
int arr[3][5];
二维数组类型为int [3][5]
```

#### 二维数组初始化

##### 不完全初始化

```C
int arr[3][5] = { 1,2 };//按顺序初始化，未指定元素的以0填充
int arr[3][5] = {0};//全为0填充
```

<img src="images\image4.png">

<img src="images\image5.png">

##### 完全初始化

```C++
int arr[3][5] = {1,2,3,4,5, 2,3,4,5,6, 3,4,5,6,7};//按顺序依次填充，一行填满换下一行
```

<img src="images\image6.png">

##### 按行初始化

```C
int arr[3][5] = {{1,2},{3,4},{5,6}};//指定每一行的前两个数据，其余填0
```

<img src="images\image7.png">

!!! note
    初始化二维数组时，可以省略行，但是不可以省略列，若省略行，则在初始化中除非使用完全初始化和按行初始化，否则编译器无法确定行数

#### 二维数组的下标及元素访问

在C语言中，⼆维数组的行从0开始，列也从0开始

```C
int arr[3][5] = {1,2,3,4,5, 2,3,4,5,6, 3,4,5,6,7};
```

<img src="images\image8.png">

通过下标找到对应的元素

```C
例如：
arr[0][1] = 2;
arr[2][2] = 5;
```

#### 二维数组的输入和输出

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    //二维数组的输入
    int arr[3][5] = { 0 };
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            scanf("%d", &arr[i][j]);
        }
    }

    //二维数组的输出
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            printf("%d ", arr[i][j]);
        }
        printf("\n");
    }
    return 0;
}
输入：
1 2 3 4 5 3 4 5 6 7 4 5 6 7 8
输出结果：
1 2 3 4 5 
3 4 5 6 7 
4 5 6 7 8
```

#### 二维数组在内存中的存储

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int arr[3][5] = { 0 };
    int i = 0;
    int j = 0;
    for (i = 0; i < 3; i++)
    {
        for (j = 0; j < 5; j++)
        {
            printf("&arr[%d][%d] = %p\n", i, j, &arr[i][j]);
        }
    }

    return 0;
}
输出结果：
&arr[0][0] = 0000005067BAF5B8
&arr[0][1] = 0000005067BAF5BC
&arr[0][2] = 0000005067BAF5C0
&arr[0][3] = 0000005067BAF5C4
&arr[0][4] = 0000005067BAF5C8
&arr[1][0] = 0000005067BAF5CC
&arr[1][1] = 0000005067BAF5D0
&arr[1][2] = 0000005067BAF5D4
&arr[1][3] = 0000005067BAF5D8
&arr[1][4] = 0000005067BAF5DC
&arr[2][0] = 0000005067BAF5E0
&arr[2][1] = 0000005067BAF5E4
&arr[2][2] = 0000005067BAF5E8
&arr[2][3] = 0000005067BAF5EC
&arr[2][4] = 0000005067BAF5F0
```

同一维数组一样，二维数组每⼀行内部的每个元素都是相邻的，地址之间相差4个字节，跨行位置处的两个元素（如：`arr[0][4]`和`arr[1][0]`）之间也是差4个字节，所以二维数组中的每个元素都是连续存放

### 变长数组

变长数组新特性，允许我们可以使用变量指定数组大小

```C
int n = a+b;
int arr[n];//数组 arr 就是变⻓数组，因为它的⻓度取决于变量 n 的值，编译器没法事先确定，只有运⾏时才能知道 n 是多少
```

变长数组的根本特征，就是数组长度只有运行时才能确定，所以变长数组不能初始化。它的好处是程

序员不必在开发时，随意为数组指定⼀个估计的长度，程序可以在运行时时为数组分配精确的长度。

!!! note
    变长数组的意思是数组的大小是可以使用变量来指定的，在程序运行的时候，根据变量的大小来指定数组的元素个数，但不是说数组的大小是可变的。因为数组的大小⼀旦确定就不能再变化了

### 二分查找算法

前提：在一个有序的数组中

作用：在数组中找某一个数字

例如：

对于数组

```C
int arr[10] = { 1,5,9,10,15,20,21,30,35,45 };
```

基本原理：由于数组是升序，故每一次找出该范围中的中间值，判断中间值是否小于或者大于需要查找的数值，如果中间值小于需要查找的数值，此时代表中间值左边的值均比需要查找的数值小，只需要在右边的范围内找需要查找的数值，以此类推最后找到需要找的数值

<img src="images\image9.png">

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    //折半查找/二分查找
    int arr[10] = { 1,5,9,10,15,20,21,30,35,45 };
    int find_num = 0;
    int sz = sizeof(arr) / sizeof(int);
    printf("请输入要查找的数值：");
    scanf("%d", &find_num);

    //定义初始下标
    int left = 0;
    int right = sz - 1;

    while (left <= right)//left和right自始自终向中间靠拢，如果交错，说明无此数
    {
        int mid = (left + right) / 2;//找到中间下标
        if (arr[mid] == find_num)//如果中间下标对应的元素是需要找的数值，则进入分支
        {
            printf("下标为%d", mid);
            break;
        }
        else if (arr[mid] < find_num)//如果中间值比需要找的数值小，则该中间值及其左边所有数值中均无需要找的数值
        {
            left = mid + 1;//更改下标为原中间值下标后面的一个下标
        }
        else//相反，如果中间值比需要找的数值大，则该中间值及其右边所有数值中均无需要找的数值
        {
            right = mid - 1;//更改下标为原中间值下标前面的一个下标
        }
    }
    if (left > right)//出现交错则代表找不到该数值
    {
        printf("无此数\n");
    }

    return 0;
}
输入：
21
输出结果：
请输入要查找的数值：21
下标为6
```

## C语言结构体

### 结构体类型及声明

#### 结构体类型

结构体是⼀些值的集合，这些值称为成员变量。结构体的每个成员可以是不同类型的变量，如：变量、数组、指针，或者是其他结构体

#### 结构体声明

```C
struct 结构体名称
{
    成员变量
}结构体变量;//不要遗忘分号

或者不加结构体变量
struct 结构体名称
{
    成员变量
};//不要遗忘分号
```

- 结构体也是一种类型，同样遵循作用域和生命周期

### 结构体变量的定义和初始化

```C
结构体变量的定义
struct Point
{
    //成员变量
    int x;
    int y;
}p1;//结构体变量，声明类型同时定义变量p1
也可以单独定义
struct Point p2;

//结构体变量初始化，与数组类似
struct Point p3 = { 10,20 };//struct 结构体名称 属于一种类型，类别int类型（int a = 0），在定义和初始化变量时需要写全
struct Point ptr_p = { 20 };//结构体成员变量部分初始化

struct Student
{
    char name[20];
    int age;   
};

struct Student s1 = {"zhangsan", 20};//默认初始化，按照结构体成员变量的顺序进行初始化
struct Student s2 = {.age = 20, .name = "zhangsan"};//按照指定顺序进行初始化，使用.操作符进行成员变量访问

//嵌套结构体初始化
struct Node
{
    int data;
    struct Point p;
    struct Node* next;//结构体指针，类比int类型指针（int* a = NULL）
}n1 = {20, {3, 5}, NULL};//Node结构体中含有Point结构体，使用{}对Point结构体的成员变量初始化
struct Node n2 = {30, {4, 6}, NULL};
```

- 结构体变量在未给初始值时会为成员变量赋初始值为0

```C
#define _CRT_SECURE_NO_WARNINGS 1
//x64环境
#include <stdio.h>

struct Point
{
    //成员变量
    int x;
    int y;
}p1;

//嵌套结构体初始化
struct Node
{
    int data;
    struct Point p;
    struct Node* next;
};
struct Node n3;

int main()
{
    //结构体在未赋初始值时会默认给初始值为0
    printf("%d %d\n", p1.x, p1.y);
    printf("%d %d %d %p\n", n3.data, n3.p.x, n3.p.y, n3.next);

    return 0;
}
输出结果：
0 0
0 0 0 0000000000000000
```

- 结构体中若存在字符数组（其余数组类似）时，注意不可以直接赋值，当使用结构体变量访问字符数组成员变量时访问的是字符数组首元素地址（首元素地址不可修改），会出现表达式必须是可修改的左值问题 

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

struct test
{
    int age;
    char name[20];
}x;

struct test_1
{
    int age;
    char* name;//将字符数组改为字符类型指针后可以直接赋值
}s;

struct test_2
{
    int age;
    char name[20];
}p = {40, "lisi"};//也可以在声明结构体的同时为字符数组赋值

int main()
{
    printf("%d %s\n", x.age = 20, strcpy(x.name, "lisi"));//不可以使用对成员变量name进行赋值x.name = "lisi"
                                                         //因为name是数组名，代表首元素地址，是不可修改的
                                                        //使用strcpy函数进行字符串拷贝至name字符数组中
    printf("%d %s\n", s.age = 30, s.name = "lisi");//将字符数组改为字符类型指针后直接赋值
    printf("%d %s\n", p.age, p.name);
    return 0;
}
输出结果：
20 lisi
30 lisi
40 lisi
```

### 结构体成员变量的访问

#### 结构体成员直接访问操作符`.`

使用方法：结构体类型变量 `.`  成员变量名

```C
struct Point
{
    int x;
    int y;
}
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    struct stu s = {0, 0};//结构体类型变量创建与初始化
    printf("%d %d", s.x, s.y);//使用结构体类型变量直接访问成员变量x和y
    return 0;
}
输出结果：
0 0
```

#### 结构体成员间接访问操作符`->`

使用方法：结构体类型指针变量`->`成员变量名

```C
struct Point
{
    int x;
    int y;
}
#include <stdio.h>

int main()
{
    struct stu s = {0, 0};//结构体类型变量创建与初始化
    struct stu *p = &s;//将结构体类型变量地址赋值给结构体类型指针变量
    printf("%d %d", p->x, p->y);//使用结构体类型指针变量间接访问成员变量
    return 0;
}
输出结果：
0 0
```

### 结构体的特殊声明（匿名结构体）

匿名结构体：在C语言中，存在一种无名结构体，这种结构体在未重命名时只能使用一次

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

struct
{
    int age;
    char name[20];
}x;//匿名结构体需要在声明的同时创建结构体变量，否则将无法使用该结构体

struct
{
    int age;
    char name[20];
}ptr;

struct
{
    int age;
    char name[20];
}*ptr_1;//不可以使用ptr_1 = &x将第一个匿名结构体变量的地址给第二个匿名结构体，否则会出现类型不兼容问题

int main()
{  
    printf("%d %s\n", x.age = 20, strcpy(x.name, "lisi"));

    //两个匿名结构体尽管类型相同时，编译器都会当做两个类型
    printf("%d %s\n", s.age = 20, strcpy(s.name, "lisi"));
    printf("%d %s\n", ptr.age, ptr.name);

    return 0;
}
输出结果：
20 lisi
0
20 lisi
```

- 可以使用`typedef`关键字对匿名结构体进行重命名，之后便可以多次使用

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

typedef struct
{
    int age;
    char name[20];
}S;//使用typedef关键字对匿名结构体进行重命名

int main()
{
    S s1 = { 20, "lisi" };//使用typedef关键字对匿名结构体进行重命名后仍然可以创建结构体变量
    printf("%d %s\n", s1.age, s1.name);
    return 0;
}
输出结果：
20 lisi
```

### 结构体的自引用

结构体自引用：在结构中包含⼀个类型为该结构体类型的指针，该指针指向下一个同类型的结构体

```C
struct Node
{
    int data;//数据域
    struct Node* next;//指针域，Node结构体中包含了一个Node结构体类型的指针next
};
```

- 在结构体的自引用中，不要使用匿名结构体，也不要使用`typedef`对匿名结构体重命名后再进行结构体自引用

```C
//不要使用匿名结构体以及使用typedef重命名后的匿名结构体进行结构体自引用
typedef struct
{
    int data;
    Node* next;//匿名结构体类型名称的出现晚于使用，无法通过编译
}Node;//匿名结构体只有在重命名时才出现名称

typedef struct Node
{
    int data;
    struct Node* next;//此处亦不可以直接用重命名后的名称Node
}Node;
```

### 结构体的大小

#### 结构体内存对齐规则

- 结构体的第一个成员对齐到和结构体变量起始位置偏移量为0的地址处，其他成员变量要对齐到某个数字（对齐数）的整数倍的地址处

    !!! info "对齐数计算"
        $对齐数=min\{编译器默认对齐数，该成员变量大小\}$
        
        VS2022中默认的值为8
        
        Linux中gcc没有默认对齐数，对齐数就是成员自身的大小

- 结构体总大小为最大对齐数（结构体中每个成员变量都有一个对齐数，所有对齐数中最大的）的整数倍
- 如果嵌套了结构体的情况，嵌套的结构体成员对齐到自己的成员中最大对齐数的整数倍处，结构体的整体大小就是所有最大对齐数（含嵌套结构体中成员的对齐数）的整数倍

#### 结构体的大小计算

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//练习1 
struct S1
{
    char c1;
    int i;
    char c2;
};

//练习2 
struct S2
{
    char c1;
    char c2;
    int i;
};

//练习3 
struct S3
{
    double d;
    char c;
    int i;
};

//练习4-结构体嵌套问题 
struct S4
{
    char c1;
    struct S3 s3;
    double d;
};

int main()
{
    //练习1
    printf("%zd\n", sizeof(struct S1));

    //练习2
    printf("%zd\n", sizeof(struct S2));
    
    //练习3
    printf("%zd\n", sizeof(struct S3));

    //练习4
    printf("%zd\n", sizeof(struct S4));

    return 0;
}
输出结果：
12
8
16
32
```

计算分析：

<img src="images\image10.png">

##### 结构体指针类型访问的本质

结构体指针访问结构体中的成员变量使用`->`进行访问，而`->`第一个操作数是结构体指针类型，第二个操作数是成员变量，对于第一个操作数来说，常规访问即为结构体类型的指针，该指针指向结构体的地址，也是结构体第一个成员变量的地址

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

struct test
{
    int i;
    int a[10];
};

int main()
{
    struct test p1 = { 0 };
    struct test* p = &p1;
    printf("%p\n", p);
    printf("%p\n", &(p1.i));

    return 0;
}
输出结果：
0000007CB4EFF528
0000007CB4EFF528
```

本质上结构体指针可以理解为类似数组的数组名（首元素地址），当结构体指针需要指向第二个及之后的成员变量，只需要在地址后加上偏移量即可，即成员变量首地址+偏移量访问每一个成员变量

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>
#include <stddef.h>

struct test
{
    int i;
    int a[3];
};

int main()
{
    int a = 0;
    int arr[3] = { 1,2,3 };
    struct test p1 = { 0 };
    struct test* p = &p1;
    printf("%p\n", &(p1.a));

    printf("%p\n", (char*)&(p->i) + offsetof(struct test, a));//注意要强制转换p->i的地址为char*类型，否则+1将跳过四个字节，因为p->i是int*类型的地址

    return 0;
}
输出结果：
0000007C875EFC4C
0000007C875EFC4C
```

将其他类型的指针强制转换为结构体指针类型（以数组名指针为例）

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

struct test
{
    int i;
    int a[3];
};

int main()
{
    int a = 0;
    int arr[3] = { 1,2,3 };

    struct test* p = (struct test*)arr;//将数组的地址交给了p指针，使得当前p指针指向的结构体的地址即为当前数组的地址
                                    //因为结构体指针是将当前地址加上对应结构体成员对应偏移量进行成员变量的访问，并且结构体地址即为结构体第一个成员的地址                    
                                    //故有结构体的第一个成员变量的地址即为数组第一个元素的地址，依次类推，因为结构体成员在内存中是连续的，依次用数组中的值填充结构体的空间
    printf("%d\n", p->i);//故&(p->i) == arr， 故i的值为arr[0] = 1
    printf("%d\n", p->a[0]);//此时后面的内容依次填充结构体中的数组成员
    printf("%d\n", p->a[2]);//但是最后一个元素为随机值

    return 0;
}
输出结果：
1
2
-858993460
```

##### `offsetof`宏

使用`offsetof`宏计算结构体成员变量偏移量

!!! note
    需要包含头文件`stddef.h`

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stddef.h>

//练习1 
struct S1
{
    char c1;
    int i;
    char c2;
};

//练习2 
struct S2
{
    char c1;
    char c2;
    int i;
};

//练习3 
struct S3
{
    double d;
    char c;
    int i;
};

//练习4-结构体嵌套问题 
struct S4
{
    char c1;
    struct S3 s3;
    double d;
};


int main()
{
    //练习1
    printf("%zd\n", sizeof(struct S1));
    printf("%zd ", offsetof(struct S1, c1));
    printf("%zd ", offsetof(struct S1, i));
    printf("%zd\n", offsetof(struct S1, c2));
    putchar('\n');

    //练习2
    printf("%zd\n", sizeof(struct S2));
    printf("%zd ", offsetof(struct S2, c1));
    printf("%zd ", offsetof(struct S2, c2));
    printf("%zd\n", offsetof(struct S2, i));
    putchar('\n');

    //练习3
    printf("%zd\n", sizeof(struct S3));
    printf("%zd ", offsetof(struct S3, d));
    printf("%zd ", offsetof(struct S3, c));
    printf("%zd\n", offsetof(struct S3, i));
    putchar('\n');


    //练习4
    printf("%zd\n", sizeof(struct S4));
    printf("%zd ", offsetof(struct S4, c1));
    printf("%zd ", offsetof(struct S4, s3));
    printf("%zd\n", offsetof(struct S4, d));
    putchar('\n');

    return 0;
}
输出结果：
12
0 4 8

8
0 1 4

16
0 8 12

32
0 8 24
```

##### `offsetof`宏的理解

```C
#define _CRT_SECURE_NO_WARNINGS 1
#include <stdio.h>

#define offsetof(s,m) ((size_t)&(((s*)0)->m))
//对于offsetof宏参数，第一个参数为结构体类型，第二个参数为结构体成员变量
//对于表达式中，首先(s*)0的意思是将数值0强制转换为结构体类型的指针
//因为0是常量，故可以理解为存在一个指针，把这个指针强制转换为结构体类型，再给这个指针赋值为0地址，类似于(s*)p = 0
//由于结构体指针访问结构体成员时是按照当前地址+对应成员的偏移量
//根据结构体内存对齐规则，结构体第一个成员变量总是对齐在偏移量为0的地址处
//因为偏移量在结构体创建并实例化后已经固定，所以此时偏移量加上0地址还是偏移量本身，故可以简化得到对应成员变量的偏移量
//将该数值转化成size_t类型即得出每个结构体成员变量的偏移量

struct test
{
    int i;
    int a[10];
};

int main()
{
    printf("%zd\n", offsetof(struct test, a));
    //在预编译后会替换为printf("%zd\n", (size_t)&(((struct test*)0)->a));
    //注意在显式写强制转换时不可以直接写(struct test*)0，因为0地址一般都是由操作系统管理，用户不可以直接访问或操作，这样写会被编译器理解为访问0地址处的值，相当于非法访问

    return 0;
}
```

#### 进行内存对齐的原因

1. 平台原因(移植原因)：

    不是所有的硬件平台都能访问任意地址上的任意数据的；某些硬件平台只能在某些地址处取某些特定类型的数据，否则抛出硬件异常

2. 性能原因：

    数据结构(尤其是栈)应该尽可能地在自然边界上对齐。原因在于，为了访问未对齐的内存，处理器需要作两次内存访问；而对齐的内存访问仅需要一次访问。假设一个处理器总是从内存中取8个字节，则地址必须是8的倍数。如果我们能保证将所有的`double`类型的数据的地址都对齐成8的倍数，那么就可以用一个内存操作来读或者写值了。否则，我们可能需要执行两次内存访问，因为对象可能被分放在两个8字节内存块中

!!! note
    结构体的内存对齐是拿空间来换取时间的做法

在设计结构体时，如果既需要节省空间又满足对齐，则考虑将占用内存较小的类型放置更加集中

```C
//不集中时大小为12
struct S1
{
    char c1;
    int i;
    char c2;
};
//集中时大小为8
struct S2
{
    char c1;
    char c2;
    int i;
};
```

#### 修改默认对齐数

`#pragma` 这个预处理指令，可以改变编译器的默认对齐数

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#pragma pack(1)//设置默认对齐数为1 
struct S
{
    char c1;
    int i;
    char c2;
};
#pragma pack()//取消设置的对齐数，还原为默认，只针对上面的结构体进行默认对齐数更改 
int main()
{
    //输出的结果是什么？ 
    printf("%d\n", sizeof(struct S));
    return 0;
}
```

### 结构体变量地址差值

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>
#include <stddef.h>

struct st
{
    int x;
    int y;
    char c;
    double d;
}data[2] = { {1, 10, 'a', 2.0}, {2, 20, 'b', 3.0} };//定义一个结构体数组

int main()
{
    struct st* p = data;
    printf("%p %p %p %p\n", &(p->x), &(p->y), &(p->c), &(p->d));//结构体内部变量的地址为对应的对齐数
    printf("%zd %zd %zd %zd\n", offsetof(struct st, x), offsetof(struct st, y), offsetof(struct st, c), offsetof(struct st, d));
    ++p;//数组中的两个结构体类型的变量，地址是连续的，指针向前移动大小即为结构体类型本身的大小
    printf("%p %p %p %p\n", &(p->x), &(p->y), &(p->c), &(p->d));

    return 0;
}
输出结果：
00007FF62757C000 00007FF62757C004 00007FF62757C008 00007FF62757C010
0 4 8 16
00007FF62757C018 00007FF62757C01C 00007FF62757C020 00007FF62757C028
```

### 结构体传参

```C
struct S
{
    int data[1000];
    int num;
};
struct S s = {{1,2,3,4}, 1000};

//结构体传参 
void print1(struct S s)
{
    printf("%d\n", s.num);
}

//结构体地址传参 
void print2(struct S* ps)
{
    printf("%d\n", ps->num);
}

int main()
{
    print1(s);//传结构体 
    print2(&s);//传地址 

    return 0;
}
输出结果：
1000
1000
```

尽管可以向函数传入结构体，但是结构体传参的时候，还是选择传结构体的地址

!!! note

    函数传参的时候，参数是需要压栈，会有时间和空间上的系统开销

    如果传递一个结构体对象的时候，结构体过大，参数压栈的的系统开销比较大，所以会导致性能的下降

### 结构体实现位段

#### 位段

位段，也称为位域，是C语言中的一种数据结构，它允许以位（`bit`）为单位来存储数据。

这种数据结构可以使数据以位的形式紧凑地存储，并允许程序员对此结构的位进行操作。这种特性使得位段在某些情况下非常有用，例如在定义一次性使用的数据结构或者在`union`中简化成员的写法

位段的使用：

- 位段的成员必须是整型家族的成员（`char`、`int`、`unsigned int`、`signed int`等），或者枚举类型，注意不能是浮点类型、复合类型（结构体类型和联合体类型）或者指针类型
- 位段的成员后面有一个冒号和一个数字，这个数字代表该成员在内存中占用的二进制位大小

代码实例

```C
//位段类型A
struct A
{
    int _a:2;
    int _b:5;
    int _c:10;
    int _d:30;
};
```

#### 位段的内存分配

- 位段的成员可以是 `int` 、`unsigned int`、`signed int` 或者是` char` 等类型
- 位段的空间上是按照需要以4个字节（ `int` ）或者1个字节（ `char` ）的方式来开辟的

!!! note
    位段涉及很多不确定因素，位段是不跨平台的，注重可移植的程序应该避免使用位段

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

struct S
{
    char a : 3;
    char b : 4;
    char c : 5;
    char d : 4;
};

int main()
{
    struct S s = { 0 };
    s.a = 10;
    s.b = 12;
    s.c = 3;
    s.d = 4;
    
    printf("%zd\n", sizeof(s));
    printf("%d %d %d %d\n", s.a, s.b, s.c, s.d);//打印对应位段数据时，仍然会打印每一个位段空间中成功存储的数据，因为原来是char类型，每个位段对应数值的原码需要进行整形提升再转换为补码
//例如s.b中的1100，整型提升为11111111111111111111111111111100
//反码为10000000000000000000000000000011
//补码为10000000000000000000000000000100，即-4的补码
//转回十进制原码即为输出结果
    return 0;
}
输出结果：
3
2 -4 3 4
```

对于位段的内存分配有以下两种不确定性：

1.一种数据类型对应的空间内，从左开始划分比特位还是从右开始划分比特位不确定

<img src="images\image11.png">

2.一种数据类型对应的空间内，如果剩余的空间不够下一个位段是否会使用剩余的空间与新空间结合不确定

<img src="images\image12.png">

对于Visual Studio 2022编译器x32环境下：

<img src="images\image13.png">

按照十六进制小端字节序存储则最后结果为：`0x620304cc`（一共只开辟了3个字节，故最后一个字节为随机值）

<img src="images\image14.png">

通过上述描述可知Visual Studio 2022编译器x64环境下：

1. 一个数据类型对应的空间内，从右开始划分比特位
2. 一种数据类型对应的空间内，如果剩余的空间不够下一个位段不会使用剩余的空间与新空间结合

#### 位段跨平台问题

-  `int`位段被当成有符号数还是无符号数是不确定的。
- 位段中最大位的数目不能确定。（16位机器最大16位比特位，32位机器最大32位比特位，写成27，在16位机器会出问题）
- 位段中的成员在内存中从左向右分配，还是从右向左分配标准尚未定义。
- 当一个结构包含两个位段，第二个位段成员比较大，无法容纳于第一个位段剩余的位时，是舍弃剩余的位还是利用，这是不确定的

#### 位段的应用

IP数据报

<img src="images\image15.png">

#### 位段使用的注意事项

位段中存在多个成员共有同一个字节，使得有些成员的起始位置并不是某个字节的起始位置，那么这些位置处是没有地址的。内存中的每个字节分配一个地址，但是一个字节内部的`bit`位没有地址

所以不能对位段的成员使用`&`操作符，这样就不能使用`scanf`直接给位段的成员输入值，只能是先输入放在一个变量中，然后赋值给位段的成员

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

struct A
{
    int _a : 2;
    int _b : 5;
    int _c : 10;
    int _d : 30;
};

int main()
{
    struct A sa = { 0 };
    //scanf("%d", &sa._b);//这是错误的 

    //正确的⽰范 
    int b = 0;
    scanf("%d", &b);
    sa._b = b;//使用变量将变量中的值赋值给位段

    return 0;
}
```

## C语言联合体

### 联合体

像结构体⼀样，联合体也是由⼀个或者多个成员构成，这些成员可以不同的类型。

但是编译器只为最大的成员分配足够的内存空间。联合体的特点是所有成员共用同一块内存空间。所以联合体也叫：共用体，即给联合体其中一个成员赋值，其他成员的值也跟着变化

```C
#include <stdio.h>
//联合类型的声明 
union Un
{
    char c;
    int i;
};
int main()
{
    //联合变量的定义 
    union Un un = {0};
    //计算连个变量的⼤⼩ 
    printf("%d\n", sizeof(un));//只为最大的成员变量，即int分配足够的内存空间

    return 0;
}
输出结果：
4
```

### 联合体的特点

联合的成员是共用同⼀块内存空间的，这样⼀个联合变量的大小，至少是最大成员的大小

```C
#define _CRT_SECURE_NO_WARNINGS 1
//x64环境下
#include <stdio.h>
//联合类型的声明 
union Un
{
    char c;
    int i;
};
int main()
{
    //联合变量的定义 
    union Un un = { 0 };
    //因为联合体所用成员共用一个地址空间，故所有成员变量起始地址均相同
    printf("%p\n", &(un.i));
    printf("%p\n", &(un.c));
    printf("%p\n", &un);
    return 0;
}
输出结果：
000000EB4DEFF8C4
000000EB4DEFF8C4
000000EB4DEFF8C4
```

如下图所示：

<img src="images\image16.png" >

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
//联合类型的声明 
union Un
{
    char c;
    int i;
};
int main()
{
    union Un un = { 0 };
    un.i = 0x11223344;
    un.c = 0x55;//c占1个字节，处于int类型的最低地址处，改变最低地址的内容，同时i中的内容也跟着改变
    printf("%x\n", un.i);

    return 0;
}
输出结果：
11223355
```

<img src="images\image17.png">

改变`un.c`中的值同时也改变了`un.i`的值

### 相同成员变量下联合体和结构体对比

```C
//结构体
struct S
{
    char c;
    int i;
};

//联合体
union Un
{
    char c;
    int i;
};
```

<img src="images\image18.png">

### 联合体的大小计算

- 联合的大小至少是最大成员的大小
- 当最大成员大小不是最大对齐数的整数倍的时候，就要对齐到最大对齐数的整数倍

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
union Un1
{
    char c[5];
    int i;
};
union Un2
{
    short c[7];
    int i;
};

int main()
{
    printf("%d\n", sizeof(union Un1));
    printf("%d\n", sizeof(union Un2));

    return 0;
}
输出结果：
8
16
```

<img src="images\image19.png">

## C语言枚举

### 枚举类型

枚举：把可能的取值一一列举

```C
//星期
enum Day
{
    Mon,//以逗号分隔
    Tues,
    Wed,
    Thur,
    Fri,
    Sat,
    Sun//最后一个枚举常量不需要逗号
};

//性别
enum Sex
{
    MALE,
    FEMALE,
    SECRET
};

//颜色
enum Color
{
    RED,
    GREEN,
    BLUE
};
```

以上定义的 `enum Day` ， `enum Sex` ， `enum Color` 都是枚举类型

`{}`中的内容是枚举类型的可能取值，也叫枚举常量

### 枚举类型的初始化

枚举类型未初始化时默认从第一个枚举常量开始，从0开始每次递增1，依次为每一个枚举常量赋值

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

enum Color
{
    RED,
    GREEN,
    BLUE
};

int main()
{
    printf("%d %d %d\n", RED, GREEN, BLUE);

    return 0;
}
输出结果：
0 1 2
```

声明枚举类型的同时为常量赋值

!!! note
    不可以在枚举声明之外的位置为枚举常量赋值

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

enum Color
{
    //为枚举类型赋初始值，不代表该整型数值即为对应的枚举常量
    RED = 2,
    GREEN = 4,
    BLUE = 8,
    BLACK//紧跟着上一个初始值递增1
};

int main()
{
    printf("%d %d %d %d\n", RED, GREEN, BLUE, BLACK);

    return 0;
}
输出结果：
2 4 8 9
```

- 尽量不要用整数为枚举变量赋值

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

enum Color
{
    RED = 2,
    GREEN = 4,
    BLUE = 8,
    BLACK
};

int main()
{
    enum Color clr = GREEN;//使用枚举常量为枚举变量赋值
    enum Color clr = 4;//不建议这样使用

    return 0;
}
```

### 枚举类型的优点

对比`#define`：

- 增加代码的可读性和可维护性
- 枚举对比`#define`定义的标识符有类型检查，更加严谨
- 便于调试，预处理阶段会删除 `#define` 定义的符号
- 使用方便，一次可以定义多个常量
- 枚举常量是遵循作用域规则的，枚举声明在函数内，只能在函数内使用