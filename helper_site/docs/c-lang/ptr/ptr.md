# C语言指针

## C语言指针基础知识

在计算机中，内存被划分为一个个的内存单元，每个内存单元的大小取1个字节，内存单元的编号也成为地址，在C语言中又叫指针。即以下等式：

$$内存单元编号 == 地址 == 指针（三者等效）$$

### 地址总线与地址

地址总线：在计算机中，CPU需要地址总线在内存中找到需要的位置上的信息

假设计算机当前是32位机，那么就有32根地址总线，而因为每一根地址线有两种状态，表示电脉冲的有无（0，1），则1根线有2（$2^1$）种含义，两根线有4（$2^2$）种状态，以此类推，则32根地址线有$2^{32}$种状态或含义，每一种含义表示一个地址

### 指针变量操作与地址

#### 取地址操作符：`&`

在C语言中，创建变量其实是在向内存申请空间

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int a = 10;//十六进制为00 00 00 0a

    printf("%p", &a);

    return 0;
}
输出结果：
0x0000004C616FF734
```

在C语言中，`int`类型在内存中占用4个字节大小，而`&a`取出的是`a`所占4个字节中地址较小的字节的地址（即第一个字节地址）

<img src="images\image.png">

#### 指针变量和解引用操作符`*`

指针变量也是⼀种变量，这种变量就是用来存放地址的，存放在指针变量中的值都会理解为地址

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int a = 10;
    int* pa = &a;//取出a的地址并存储到指针变量pa中 

    return 0;
}
```

##### 指针变量类型解析

```C
int a = 10;
int* pa = &a;

因为a的类型是int，所以为了使指针知道应该访问多少字节，故指针变量类型设置为int*
即pa是指针变量，指向的对象是int类型，需要int*的指针接收
```

<img src="images\image1.png">

##### 解引用操作符：`*`

对一个指针变量进行解引用操作可以拿到指针变量所指向的变量中的内容

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int a = 100;
    int* pa = &a;//将a的地址给指针变量pa
    *pa = 0;//对pa进行解引用操作然后修改a中的内容

    return 0;
}
```

##### 指针变量的大小

在C语言中，指针变量的大小有以下特点：

- 32位平台下地址是32个bit位，指针变量大小是4个字节
- 64位平台下地址是64个bit位，指针变量大小是8个字节
- 注意指针变量的大小和类型是无关的，只要指针类型的变量，在相同的平台下，大小都是相同的。

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
//x64下运行
int main()
{
    printf("%zd\n", sizeof(char*));
    printf("%zd\n", sizeof(short*));
    printf("%zd\n", sizeof(int*));
    printf("%zd\n", sizeof(double*));

    return 0;
}
输出结果：
8
8
8
8
```

##### 指针变量大小和数据类型大小之间的关系

<img src="images\image2.png">

##### 指针类型的不同对变量访问的影响

```C
#include <stdio.h>
int main()
{
    int n = 0x11223344;
    int *pi = &n; //指向int类型的指针变量一次访问4个字节，将数值每个字节的地址上的内容均改为0
    *pi = 0;   
    return 0;
}
```
<img src="images\image3.png">
```C
#include <stdio.h>
int main()
{
    int n = 0x11223344;
    char *pc = (char *)&n;//指向char类型的指针变量一次访问1个字节，将数值的最低位上的内容（地址最小）改为0，其余内容不变
    *pc = 0;
    return 0;
}
```
<img src="images\image4.png">

对于一个指针变量一次能访问多少个字节取决于其指向的数据类型在内存中占用的字节大小，例如`int`类型在内存中占用4个字节，那么`int*`类型的指针变量一次访问4个字节，同理`char`类型在内存中占用1个字节，那么`char*`类型的指针变量一次访问1个字节，以此类推

### 指针变量的基础运算

#### 指针`+`、`-`正整数

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int n = 10;
    char* pc = (char*)&n;//一次访问1个字节
    int* pi = &n;//一次访问4个字节

    printf("%p\n", &n);//取出n的地址，并且为4个字节地址中的最小的地址
    printf("%p\n", pc);//pc中存的是n的地址，并且存的是n的4个字节中的最小的地址，尽管pc是指向char类型的指针变量，但是仍然是从最小的地址开始访问，所以与&n的值相同
    printf("%p\n", pc + 1);//pc指向的是char类型，+1一次向后访问1个字节，故地址+1
    printf("%p\n", pi);//pi中存的是n的地址，并且存的是n的4个字节中的最小的地址
    printf("%p\n", pi + 1);//pi指向的是int类型，+1一次向后访问4个字节，故地址+4

    return 0;
}
输出结果：
0000006A7B3BFAD4
0000006A7B3BFAD4
0000006A7B3BFAD5
0000006A7B3BFAD4
0000006A7B3BFAD8
```

#### 指针`*`与`++`运算符结合

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int arr[] = { 1,2,3,4,5,6,7,8,9,10 };
    int* p = arr;

    /*当前p指向数组首元素*/
    printf("p = %p\n", p);
    printf("arr = %p\n", arr);
    putchar('\n');

    //*p++与*(p++)
    printf("*p++与*(p++)\n");
    //由于++优先级比*优先级高，故先执行++运算符，但是因为++是后置，所以满足先使用再++
    //而在*p++中先使用意味着先取出p指向的地址，此时再进行++操作，但是*接收到的地址并不是++后的地址（因为“先使用”的缘故，使得*接收到了p一开始指向的地址）
    //故此时*p++意味着取出p中的地址后进行++操作，同时解引用p未++的地址
    //输出为1 1
    printf("%d\n", *p++);
    printf("p = %p\n", p);
    p = arr;
    printf("%d\n", *(p++));
    printf("p = %p\n", p);
    putchar('\n');

    //(*p)++
    p = arr;
    printf("(*p)++\n");
    //因为()的存在导致*与++优先级改变，故先进行*p操作，取出了p当前地址中的值
    //而因为有++的存在，并且是后置++，故满足先使用后++
    //在这个代码中，++影响的是数组第一个元素的值，此时printf先打印一开始第一个元素1，再进行对该元素中的值的改变
    printf("%d\n", (*p)++);
    printf("%d\n", arr[0]);
    printf("p = %p\n", p);
    printf("arr = %p\n", arr);
    putchar('\n');

    //*++p与*(++p)
    p = arr;
    printf("*++p与*(++p)\n");
    //因为*比++优先级低，故先执行++操作再使用，此时因为++是前置++，故满足先++再使用
    //p当前指向第一个元素的地址，++操作后，指向第二个元素的地址，完成++操作后进行使用，此时*接收到的即为++后的p中的地址，即第二个元素的地址
    //故printf打印2 2
    printf("%d\n", *++p);
    printf("p = %p\n", p);
    p = arr;
    printf("%d\n", *(++p));
    printf("p = %p\n", p);
    printf("arr[1] = %p\n", &arr[1]);
    putchar('\n');

    //++*p与++(*p)
    p = arr;
    p[0] = 1;
    printf("++*p与++(*p)\n");
    //因为++优先级比*高，故先执行++操作，而因为是前置++，故满足先++后使用
    //因为++接收的表达式是*p，故是对*p进行++操作，先++再使用，因为p当前指向数组的第一个元素，故*取出数组第一个元素的值，再进行++操作改变该值
    //故printf打印2 2，对应数组第一个元素
    printf("%d ", ++ * p);
    p = arr;
    p[0] = 1;
    printf("%d ", ++(*p));
    printf("%d\n", arr[0]);
    printf("p = %p\n", p);
    printf("arr = %p\n", arr);
    putchar('\n');

    //数组输出
    for (int i = 0; i < 10; i++)
    {
        printf("%d ", arr[i]);
    }

    return 0;
}
输出结果：
p = 000000EE101EFB88
arr = 000000EE101EFB88

*p++与*(p++)
1
p = 000000EE101EFB8C
1
p = 000000EE101EFB8C

(*p)++
1
2
p = 000000EE101EFB88
arr = 000000EE101EFB88

*++p与*(++p)
2
p = 000000EE101EFB8C
2
p = 000000EE101EFB8C
arr[1] = 000000EE101EFB8C

++*p与++(*p)
2 2 2
p = 000000EE101EFB88
arr = 000000EE101EFB88

2 2 3 4 5 6 7 8 9 10
```

#### 指针`-`指针

在C语言中，指针`-`指针的绝对值可以得到两个指针之间元素个数，但是前提指向的同一空间，若指向不同的两个空间的指针相减将得出随机值

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//模拟实现strlen函数
int my_strlen(char* s)
{
    char* p = s;
    while (*p != '\0')
        p++;
    return p - s;//两个指针相减的绝对值得到两个指针之间的元素个数
}

int main()
{
    printf("%d\n", my_strlen("abc"));

    return 0;
}
```

#### 指针关系运算

两个指针进行大小比较时，二者比较的是地址大小，小地址小于大地址

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
    int* p = &arr[0];
    int i = 0;
    int sz = sizeof(arr) / sizeof(arr[0]);
    while (p < arr + sz)//指针的⼤⼩⽐较
    {
        printf("%d ", *p);
        p++;
    }

    return 0;
}
```

### `void*`指针

在指针类型中有⼀种特殊的类型是 `void*` 类型的，可以理解为无具体类型的指针（或者叫泛型指针），**这种类型的指针可以用来接受任意类型地址**

!!! note
    `void*` 类型的指针不能直接进行指针的`+`、`-`整数和解引用的运算

```C
//void*类型指针可以接收任意类型地址
int a = 10;
char c = 'a';

void* pa = &a;
void* pc = &c;

//void*类型指针不可以直接进行解引用操作和+、-正整数操作
*pa = 0;//不被允许，因为void*类型的指针变量解引用无法确定一次访问多少字节的内容 
```

⼀般 `void*` 类型的指针是使用在函数参数的部分，用来接收不同类型数据的地址，这样的设计可以实现泛型编程的效果

### `const`关键字

#### `const`修饰变量

被`const`关键字修饰的变量无法通过赋值符进行赋值操作，只能在创建变量的同时对变量进行初始化

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int m = 0;
    m = 20;//m是可以修改的 
    const int n = 0;
    n = 20;//n是不能被修改的 
    return 0;
}
```

但是可以通过指针变量对`const`修饰的变量进行修改，例如：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int m = 0;
    m = 20;//m是可以修改的 
    const int n = 0;
    n = 20;//n是不能被修改的 
    int* pn = &n;
    *pn = 20;//可以通过指向const修饰的变量的指针修改该变量的值
    return 0;
}
```

#### `const`修饰指针

`const`修饰指针有下面两种情况：

- 指针常量：`const`如果放在`*`的左边，修饰的是指针指向的内容，保证指针指向的内容不能通过指针来改变。但是指针变量本身的内容可变，此时的`const`也称为底层`const`
- 常量指针：`const`如果放在`*`的右边，修饰的是指针变量本身，保证了指针变量的内容不能修改，但是指针指向的内容，可以通过指针改变，此时的`const`也称为顶层`const`

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//代码1 
void test1()
{
    int n = 10;
    int m = 20;
    int* p = &n;
    *p = 20;//指针p可以修改变量内容的指针，故可以使用p指针来修改n中的值
    p = &m;//指针p是可以被修改的指针，此时可以更改p中原来n的地址，存入m的地址
}
//代码2 
void test2()
{
    int n = 10;
    int m = 20;
    const int* p = &n;//const修饰*p
    *p = 20;//p指针变量被const修饰，并且修饰的是*p，即指针指向的内容，故不可以通过指针p修改n中的值
    p = &m;//p指针变量本身中存的地址可以被修改，因为当前const不影响p本身存的地址
}
//代码3
void test3()
{
    int n = 10;
    int m = 20;
    int* const p = &n;//const修饰p
    *p = 20;//p指针变量被const修饰，但是修饰的是p，即指针本身存的地址，故可以通过p来修改n中的值
    p = &m;//p指针变量被const修饰，由于修饰的是p，故此时不可修改p本身所存的地址
}
//代码4
void test4()
{
    int n = 10;
    int m = 20;
    int const* const p = &n;//const既修饰*p，又修饰p
    *p = 20;//由于有一个const修饰了*p，故此时不可通过p指针变量修改指向的变量n中的值
    p = &m;//由于有一个const修饰了p，故此是不可改变p指针变量本身存的值
}

int main()
{
    //测试⽆const修饰的情况 
    test1();
    //测试const放在*的左边情况 
    test2();
    //测试const放在*的右边情况 
    test3();
    //测试*的左右两边都有const 
    test4();

    return 0;
}
```

!!! note "巧妙区分顶层`const`和底层`const`"

    区分顶层`const`和底层`const`的方法：**先看`const`左边是什么，如果`const`左边没有东西，再看最接近`const`右边是什么**

    例如：

    ```c
    const int* p; // 看const左边，左边没有，再看右边，右边修饰的是int，故为底层const，注意修饰的不是int*
    int const* p; // 看const左边，左边修饰的是int，故为底层const
    int* const p; // 看const左边，左边修饰的是int*，故为顶层const
    const int* const p; // 看第一个const左边，左边没有，再看右边，右边修饰的是int，故为底层const；再看第二个const左边，左边修饰的是int*，故为顶层const
    const int const *p; // 看第一个const的左边，左边没有，再看右边，右边修饰的是int，故为底层const；再看第二个const的左边，左边是int，故也为底层const。但是这种写法不一定可以编译通过
    ```

### 野指针

在C语言中，野指针就是指针指向的位置是不可知的（随机的、不正确的、没有明确限制的）

##### 野指针出现的原因

- 指针未初始化
- 指针越界访问
- 指针指向的空间被释放并且指针未置为`NULL`

```C
//指针未初始化
#include <stdio.h>
int main()
{        
    int *p;//局部变量指针未初始化，默认为随机值，在检查严格的编译器将无法通过编译 
    *p = 20;//未初始化的指针不允许解引用操作
    return 0;
}

//指针越界访问
#include <stdio.h>

int main()
{
    int arr[10] = { 0 };
    int* p = &arr[0];
    int i = 0;
    for (i = 0; i <= 11; i++)
    {
        //当指针指向的范围超出数组arr的范围时，p就是野指针 
        *(p++) = i;
    }

    return 0;
}

//指针指向的空间被释放
#include <stdio.h>

int* test()
{
    int n = 100;
    return &n;//n属于test函数中的局部变量，当test函数执行完后变量n将会被销毁，此时n原来的地址空间将返回给操作系统，属于自由空间
}

int main()
{
    int* p = test();//此时p接收的不再是属于变量n的空间，而是一个自由空间
    printf("%d\n", *p);

    return 0;
}
```

##### 规避野指针的方法

- 指针创建的同时给指针初始化
- 注意指针的使用，防止指针出现越界的情况
- 指针不再使用时及时给指针置为`NULL`，并且在指针使用之前检查其是否是空指针
- 设计函数时不要返回局部变量的地址

!!! note
    `NULL` 是C语言中定义的⼀个标识符常量，值是0，0也是地址，这个地址是无法使用的，读写该地址会报错

```C
//给指针初始化，需要用的给地址，不需要的置为NULL
#include <stdio.h>
int main()
{
    int num = 10;
    int*p1 = &num;//需要使用的传入地址
    int*p2 = NULL;//不需要使用的置为NULL
    
    return 0;
}

//注意指针的使用防止越界
#include <stdio.h>

int main()
{
    int arr[10] = { 0 };
    int* p = &arr[0];
    int i = 0;
    for (i = 0; i < 10; i++)//数组是10个元素，在遍历时需要注意是否出现超过数组大小
    { 
        *(p++) = i;
    }

    return 0;
}

//使用指针之前对指针的有效性进行检查
p = &arr[0];//重新让p获得地址 
if(p != NULL) //判断指针p是否是NULL
{
//...
}

//不返回局部变量的地址
//可以将局部变量用static修饰
//也可以向函数传入实参的地址（更推荐）
#include <stdio.h>

void test(int* n)//传入地址直接通过地址对实参内容进行修改
{
    *n = 100;
}

int* test1()
{
    static int n = 0;//将局部变量设置为static
    return &n;
}

int main()
{
    int num = 0;
    test(&num);
    printf("%d\n", num);
    
    int *p = test1();
    printf("%d\n", num);
 
    return 0;
}
```

### 断言关键字：`assert`

`assert.h` 头文件定义了宏 `assert()` ，用于在运行时确保程序符合指定条件，如果不符合，就报错终止运行，这个宏常常被称为“断言”

`assert()` 宏接受⼀个表达式作为参数。如果该表达式为真（返回值非0）， `assert()` 不会产⽣

任何作用，程序继续运行。如果该表达式为假（返回值为零）， `assert()` 就会报错，在标准错误

流 `stderr` 中写入⼀条错误信息，显示没有通过的表达式，以及包含这个表达式的文件名和行号

```C
assert(p != NULL);//使用assert判断指针是否为空指针
```

#### 使用`assert`的好处

- 自动标识文件和出问题的行号
- 无需更改代码就能开启或关闭 `assert()` 的机制
    - 如果已经确认程序没有问题，不需要再做断言，就在 `#include <assert.h>` 语句的前面，定义⼀个宏 `NDEBUG` 

```C
#define NDEBUG
#include <assert.h>
```

重新编译程序，编译器就会禁用文件中所有的 `assert()` 语句。如果程序又出现问题，可以移除这条 `#define NDBUG` 指令（或者把它注释掉），再次编译，这样就重新启用了 `assert()` 语句

!!! note
    `assert()` 的缺点是，因为引入了额外的检查，增加了程序的运行时间

## C语言指针与数组

### 数组名与`sizeof`

#### 数组名与数组首元素地址

```C
int arr[10] = {1,2,3,4,5,6,7,8,9,10};
int *p = &arr[0];//将数组首元素地址传给指针变量p
```

其实数组名本来就是地址，而且是数组首元素的地址，所以上面的代码可以更改为

```C
int arr[10] = {1,2,3,4,5,6,7,8,9,10};
int *p = arr;//将数组名（首元素地址）传给指针变量p
```

代码实例：

```C
#include <stdio.h>
int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
    printf("&arr[0] = %p\n", &arr[0]);
    printf("arr     = %p\n", arr);

    return 0;
}
输出结果：
&arr[0] = 000000B82030F7E8
arr     = 000000B82030F7E8
```

#### sizeof中的数组名

在`sizeof`操作符中，数组名代表整个数组，此时`sizeof`关键字计算的是整个数组的大小，即每一个元素的数据类型占用内存大小`*`数组元素个数

```C
#include <stdio.h>
int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
    printf("%zd\n", sizeof(arr));//此时arr是整个数组的大小，即4（每个元素的数据类型占用的内存大小）* 10（数组元素个数为10）

    return 0;
}
输出结果：
40
```

#### 数组名的两种特殊情况

- `sizeof(数组名)`，当`sizeof`中单独放数组名，此时数组名表示整个数组，计算的是整个数组的大小，单位是字节
- `&`数组名，此时数组名表示整个数组，取出的是整个数组的地址

!!! note
    整个数组的地址不同于数组首元素的地址

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
    //数组首元素地址和整个数组的地址完全相同
    printf("&arr[0] = %p\n", &arr[0]);
    printf("arr     = %p\n", arr);
    printf("&arr    = %p\n", &arr);
    return 0;
}
输出结果：
&arr[0] = 0000001E50BAF5E8
arr     = 0000001E50BAF5E8
&arr    = 0000001E50BAF5E8
```

数组名代表数组首元素地址，故`&arr[0]`与`arr`相同，而因为整个数组的地址依旧是从首元素开始，所以记录所有地址中最小的地址，但是`&arr`与`&arr[0]`和`arr`访问空间大小不同

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
int main()
{
    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
    printf("&arr[0]   = %p\n", &arr[0]);//数组首元素地址
    printf("&arr[0]+1 = %p\n", &arr[0]+1);//数组首元素地址+1表示访问下一个中的元素
    printf("arr       = %p\n", arr);//数组名即为数组首元素地址
    printf("arr+1     = %p\n", arr+1);//数组首元素地址+1表示访问下一个数组中的元素
    printf("&arr      = %p\n", &arr);//&arr表示整个数组的地址，但是存储数组元素中的最小的地址，即数组首元素的地址
    printf("&arr+1    = %p\n", &arr+1);//由于&arr表示整个数组的地址，故+1操作后跳过整个数组，指向整个数组后的地址
    return 0;
}
输出结果：
&arr[0]   = 000000E9B86FFC58
&arr[0]+1 = 000000E9B86FFC5C
arr       = 000000E9B86FFC58
arr+1     = 000000E9B86FFC5C
&arr      = 000000E9B86FFC58
&arr+1    = 000000E9B86FFC80
```

<img src="images\image5.png">

### 指针访问数组

#### 使用指针`+`整数操作进行数组访问

```C
#include <stdio.h>
int main()
{
    int arr[10] = {0};
    //输⼊ 
    int sz = sizeof(arr)/sizeof(arr[0]);
    //输⼊ 
    int* p = arr;
    for(int i=0; i<sz; i++)
    {
        scanf("%d", p+i);//使用指针+整数操作对数组进行访问
        //scanf("%d", arr+i);//也可以这样写 
    }
    //输出 
    for(int i=0; i<sz; i++)
    {
        printf("%d ", *(p+i));//使用指针+整数操作对数组进行访问
    }
    return 0;
}
输入：
1 2 3 4 5 6 7 8 9 10
输出结果：
1 2 3 4 5 6 7 8 9 10
```

#### 使用下标引用操作符`[]`进行数组访问

```C
#include <stdio.h>
int main()
{
    int arr[10] = {0};
    //输⼊ 
    int i = 0;
    int sz = sizeof(arr)/sizeof(arr[0]);
    //输⼊ 
    int* p = arr;
    for(i=0; i<sz; i++)
    {
        scanf("%d", p[i]);//使用下标引用操作符对数组进行访问
        //scanf("%d", arr[i]);//也可以这样写 
        //scanf("%d", i[arr]);//也可以这样写，因为在arr + i等价于i + arr
    }
    //输出 
    for(i=0; i<sz; i++)
    {
        printf("%d ", p[i]);//使用下标引用操作符对数组进行访问
    }
    return 0;
}
输入：
1 2 3 4 5 6 7 8 9 10
输出结果：
1 2 3 4 5 6 7 8 9 10
```

### 数组和指针

数组在作为函数参数传递时，并不是将整个数组传递给函数，而是传入数组首元素的地址，故计算数组的元素个数的方法（数组总大小/每个元素的数据类型占用大小）在函数中无法得到预期结果。故数组传参本质上传递的是数组首元素的地址

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
void test(int arr[])
{
    int sz2 = sizeof(arr)/sizeof(arr[0]);//由于数组作为参数传递给函数时传递的是数组首元素地址，此时sizeof计算的是数组首元素地址的大小，在64位机种，地址大小为8个字节
                                        //故此时是计算数组首元素地址的大小/数组首元素的数据类型的大小，即8 / 4 = 2
    printf("sz2 = %d\n", sz2);
}
int main()
{
    int arr[10] = {1,2,3,4,5,6,7,8,9,10};
    int sz1 = sizeof(arr)/sizeof(arr[0]);//整个数组的大小/数组首元素的数据类型的大小
    printf("sz1 = %d\n", sz1);
    test(arr);
    return 0;
}
输出结果：
sz1 = 10
sz2 = 2
```

由于数组名是数组首元素的地址，在C语言中用指针来存地址，故当给函数传递数组时，可以将形参部分设计成指针，效果与写成数组形式相同

```C
test(int arr[]);
等价于
test(int* arr);
```

### 冒泡排序算法

基本思路：相邻两个元素相比较，不满足条件就交换

```C
//以下面的数组为例，将下面的数组按照升序排列
int arr[10] = { 9,8,7,6,5,4,3,2,1,0 };
```

思路拆解分析：

<img src="images\image6.png">

代码实现：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdbool.h>

void Bubble_sort(int* arr, int sz)
{
    for (int i = 0; i < sz - 1/*十个元素将进行九次冒泡排序*/; i++)
    {
        _Bool flag = false;//标记是否进行了交换，假设未进行交换
        for (int j = 0; j < sz - 1 - i; j++)//九次冒泡排序中，每一次将进行一定次数的交换，例如第1趟中进行9次交换，第2趟中进行8次交换，但是随着每次的趟数增加交换次数在减少
                                            //因为要求是升序排列，所以每一次交换后最大值都会到数组的最后一个元素的位置，故不需要考虑每次交换到后面的元素
        {
            if (arr[j] > arr[j + 1])//升序
            {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                flag = true;
            }
        }
        if (flag == false)
        {
            break;
        }
    }
}

int main()
{
    int arr[10] = { 9,8,7,6,5,4,3,2,1,0 };
    int sz = sizeof(arr) / sizeof(int);

    Bubble_sort(arr, sz);

    for (int i = 0; i < sz; i++)
    {
        printf("%d ", arr[i]);
    }

    return 0;
}
输出结果：
0 1 2 3 4 5 6 7 8 9
```

### 二级指针

在C语言中，指针也是变量，属于地址类型的变量，故指针本身也有地址，而指针本身的地址将存在指针的指针中，即二级指针

```C
int n = 0;
int* p = &n;//一级指针，存的是变量n的地址
int** pa = &p;//二级指针，存的是指针变量p的地址
```

<img src="images\image7.png">

### 二级指针的运算

#### 取地址操作符：`&`

```C
int n = 0;
int* p = &n;//一级指针，存的是变量n的地址
int** pa = &p;//二级指针，存的是指针变量p的地址

//取地址操作符
&pa;//取出pa本身的地址
pa本身存的是p的地址
```

#### 解引用操作符：`*`

```C
int n = 0;
int* p = &n;//一级指针，存的是变量n的地址
int** pa = &p;//二级指针，存的是指针变量p的地址

//解引用操作符
*pa = p = &n;//取出pa指向的地址中的内容，即p中存的变量n的地址
**pa = *(*pa) = *p = 0;//取出p指向的地址中的内容，即n变量中的值
```

#### 基础运算

与一级指针相同

### 指针数组

在C语言中，指针数组表示存放指针变量类型的数组

```C
int* p = NULL;
int* pa = NULL;
int* ptr = NULL:
//指针数组
int* arr[3] = {*p, *pa, *ptr};//存放着三个指针变量，每个元素的类型为指针变量类型
```

#### 使用指针数组模拟二维数组

基本思路：通过一维指针数组和一维基本数据类型数组模拟实现二维数组

优点：每一个一维基本数据类型数组元素个数可以不同

缺点：每两个基本数据类型数组之间的地址并不连续

```C
//三个基本数据类型的数组，每个一维数组元素个数不同
int arr[] = { 0,1 };
int arr1[] = { 1,2,3,4 };
int arr2[] = { 2,3,4 };

//一个指针类型的数组
int* array[] = {arr, arr1, arr2};//数组名也是指针
```

<img src="images\image8.png">

缺点分析：

```C
//模拟实现的二维数组
int arr[] = { 0 };
int arr1[] = { 0 };
int arr2[] = { 0 };

int* array[] = {arr, arr1, arr2};
```

<img src="images\image9.png">

模拟实现的二维数组中，三个被0初始化的一维数组两两之间的地址并不连续，中间存在随机值，并且每个一维基本数据类型数组元素个数不一样

```C
//实际的二维数组
int array_dual[3][4] = {0};
```

<img src="images\image10.png">

实际的二维数组三个一维基本数据类型数组两两之间地址连续，并且元素个数均等分布

### 传值调用和传址调用

传值调用：将变量中的内容传递给函数

传址调用：将变量本身的地址传递给函数

| 传值调用                                                     | 传址调用                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 将变量中的内容传递给函数，此时在函数中做的一切对该接收该变量的形参的操作不影响调用者传入的实参的内容 | 将变量的地址传递给函数，函数通过该地址找到实际参数的位置对其内容进行操作，此时可以直接修改调用者传入的实参的内容`` |

=== "传值调用"

    ```C
    #include <stdio.h>
    void Swap1(int x, int y)
    {
        int tmp = x;
        x = y;
        y = tmp;
    }
    int main()
    {
        int a = 0;
        int b = 0;
        scanf("%d %d", &a, &b);
        printf("交换前：a=%d b=%d\n", a, b);
        Swap1(a, b);
        printf("交换后：a=%d b=%d\n", a, b);
        return 0;
    }
    输入：
    1 2
    输出结果：
    交换前：a=1 b=2
    交换后：a=1 b=2
    ```

=== "传址调用"

    ```c
    #include <stdio.h>
    void Swap1(int* x, int* y)
    {
        int tmp = *x;
        *x = *y;
        *y = *tmp;
    }
    int main()
    {
        int a = 0;
        int b = 0;
        scanf("%d %d", &a, &b);
        printf("交换前：a=%d b=%d\n", a, b);
        Swap1(&a, &b);
        printf("交换后：a=%d b=%d\n", a, b);
        return 0;
    }
    输入:
    1 2
    输出结果:
    交换前：a=1 b=2
    交换后：a=2 b=1
    ```

<img src="images\image11.png">

- 改变`int`类型的变量中的值用一级指针`pa`，通过`*pa`（解引用`pa`）后拿到地址上的值进行修改（修改数值`a`变量中的数值`10`）
- 改变int*类型的变量中的值用二级指针`ppa`，通过`*ppa`（解引用`ppa`）拿到该地址上的值进行修改（修改`pa`变量中的地址`0x1001`），此时再解引用一次`**ppa`拿到该地址上的地址上的值进行修改（修改`pa`变量中的地址`0x1001`地址上的变量中的值，即`a`变量中的数值`10`）

!!! note
    在调用函数传参数时，之所以需要传地址，是为了方便在函数中通过指针进行解引用，从而修改在该地址上的变量中的值，如果只传值，那么修改的值就只在该函数内部有效。

!!! note
    注意，要修改目标中的值一定要解引用，否则就算是传地址也只是修改值

```C
#include <stdio.h>
void Swap(int* x, int* y)
{
    //定义指针类型接收x中的地址
    int* tmp = x;
    //修改x中的地址
    x = y;
    //修改y中的地址
    y = tmp;
}

//使用二级指针通过一次解引用修改一级指针中存的地址
void Swap1(int** x, int** y)
{
    //使用一级指针存入x解引用后的地址，即pa变量中的地址
    int* temp = *x;
    //将pa变量的地址改为pb变量中的地址
    *x = *y;
    //将pb变量中的地址改为temp存的pa变量的地址
    *y = temp;
}

int main()
{
    int a = 10;
    int b = 20;
    int* pa = &a;
    int* pb = &b;
    printf("交换前：pa=%p pb=%p\n", pa, pb);
    Swap(&a, &b);
    printf("交换后：pa=%p pb=%p\n", pa, pb);

    printf("交换前：pa=%p pb=%p\n", pa, pb);
    Swap1(&pa, &pb);
    printf("交换后：pa=%p pb=%p\n", pa, pb);

    return 0;
}
输出结果：
交换前：pa=000000697EAFFAB4 pb=000000697EAFFAD4
交换后：pa=000000697EAFFAB4 pb=000000697EAFFAD4

交换前：pa=000000B264AFFCA4 pb=000000B264AFFCC4
交换后：pa=000000B264AFFCC4 pb=000000B264AFFCA4
```

## C语言其他类型指针变量

### 字符指针变量

字符指针，即指向字符类型的指针变量

```C
char c = 'a';
char* p = &c;//字符指针指向字符类型的变量

char* pa = "Hello world";//字符指针指向字符串常量
//不同于指向字符类型的变量的字符指针，指向字符串常量的字符指针存入的是字符串第一个字符的地址，并且无法通过该指针对字符串进行修改，因为此时的字符串是常量放在常量区
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    //因为将字符串放入数组中相当于字符串的一个拷贝副本放入数组中，两个数组的地址不一样，此时字符串可以被修改，故str1和str2首元素地址不一样
    char str1[] = "hello bit.";
    char str2[] = "hello bit.";
    //因为字符串本身放在字符串常量区，并且相同的字符串只会创建一份，所以str3和str4存入的第一个字符的地址相同，并且此时不可通过指针修改字符串
    //可以将字符串看作一种由一个一个字符和\0组成的数组，只是不可修改内容
    const char* str3 = "hello bit.";
    const char* str4 = "hello bit.";
    if (str1 == str2)
        printf("str1 and str2 are same\n");
    else
        printf("str1 and str2 are not same\n");

    if (str3 == str4)
        printf("str3 and str4 are same\n");
    else
        printf("str3 and str4 are not same\n");

    return 0;
}
输出结果：
str1 and str2 are not same
str3 and str4 are same
```

### 数组指针变量

数组指针，即指向数组的指针

```C
int arr[10] = {0};
int (*pa)[10] = &arr;//数组指针，指向数组的指针，因为数组指针指向整个数组，故为了赋值符左右两边类型相同，此时需要赋值为整个数组的地址
int *pa[10] = {0};//指针数组，元素是指针变量的数组
```

!!! note
    因为下标引用操作符`[]`的优先级高于解引用操作符`*`，故在表示数组指针时需要带上括号，改变`*`的优先级

```C
int (*pa)[10];
其中
int表示指向的数组中的元素类型是int
*pa表示数组指针
[10]表示指向的数组有10个元素

数组指针类型
int (*pa)[10]
去掉数组名后即为数组指针类型
int (*)[10]//数组指针类型
```

#### 二维数组数组名的理解

```C
int arr[3][5] = {0};

二维数组数组名
arr表示数组首元素的地址，而在二维数组中数组首元素地址表示第一行的数组的地址，即&arr[0]
arr[0]、arr[1]、arr[2]是每个一行的一维数组的数组名，表示该行的一维数组首元素的地址，
即&arr[0][0]，&arr[1][0]，&arr[2][0]

而对上面的地址进行解引用操作时
*arr = arr[0]//取出的是第一行的一维数组
**arr = *arr[0] = arr[0][0]//取出的是第一行的一维数组的第一个元素
```

#### 二维数组传参

```C
int arr[3][5] = {0};//二维数组
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

void test(int a[3][5], int r, int c)
{
    int i = 0;
    int j = 0;

    for (i = 0; i < r; i++)
    {
        for (j = 0; j < c; j++)
        {
            printf("%d ", a[i][j]);
        }
        printf("\n");
    }
}

int main()
{
    int arr[3][5] = { {1,2,3,4,5}, {2,3,4,5,6},{3,4,5,6,7} };
    test(arr, 3, 5);

    return 0;
}
输出结果：
1 2 3 4 5
2 3 4 5 6
3 4 5 6 7
```

因为数组名即为数组首元素地址，而二维数组可以看做多个一维数组共同组成的数组，对每一行的访问`arr[0]`、`arr[1]`、`arr[2]`即为该行的一维数组的数组名

<img src="images\image12.png">

因为二维数组可以看做多个一维数组共同组成的数组，故可以用数组指针作为形参，将二维数组作为实参传给形参

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

void test(int (*p)[5], int r, int c)//使用数组指针作为形参，相当于int arr[][5]，其中arr[]表示数组指针，所以二维数组可以省略行但是不能省略列
{
    int i = 0;
    int j = 0;
    for(i=0; i<r; i++)
    {
        for(j=0; j<c; j++)
        {
            printf("%d ", *(*(p+i)+j));//相当于p[i][j]，其中p[i]代表每一行，即每一个一维数组，p[i][j]表示访问每一个一维数组中的元素
        }
        printf("\n");
    }
}

int main()
{
    int arr[3][5] = {{1,2,3,4,5}, {2,3,4,5,6},{3,4,5,6,7}};
    test(arr, 3, 5);
    return 0;
}
输出结果：
1 2 3 4 5
2 3 4 5 6
3 4 5 6 7
```

!!! note
    二维数组传参，形参的部分可以写成数组，也可以写成指针形式

### 函数指针变量

函数指针，即指向函数类型的指针变量

#### 函数名与函数地址

在C语言中，函数名就是函数的地址，当然也可以通过 `&函数名` 的方式获得函数的地址

!!! note
    函数名 == `&函数名`

    数组名 != `&数组名`

```C
void test()
{
    printf("hehe\n");
}
void (*pf1)() = &test;
void (*pf2)()= test;

int Add(int x, int y)
{
    return x+y;
}
int(*pf3)(int, int) = Add;//形式参数名可以省略不写
int(*pf3)(int x, int y) = &Add;
```

#### 函数指针类型

```C
int Add(int x, int y)
{
    return (x + y);
}
int (*pf)(int, int);//函数指针
其中
int表示函数的返回类型
(*pf)是函数指针
(int, int)表示指向的函数有两个形参

函数指针类型
去掉指针名即为函数指针类型
int (*)(int, int)//函数指针类型
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
int Add(int x, int y)
{
    return x+y;
}

int main()
{
    int(*pf3)(int, int) = Add;
    
    printf("%d\n", (*pf3)(2, 3));//通过对函数指针解引用进行函数调用
    printf("%d\n", pf3(3, 5));//通过函数指针直接调用，因为函数名 == &函数名，故两种调用方法等价
    return 0;
}
输出结果：
5
8
```

### 函数指针数组

函数指针数组，即数组中每个元素是函数指针类型

```C
//四个函数
int Add(int x, int y);
int Sub(int x, int y);
int times(int x, int y);
int by(int x, int y);

//四个函数指针
int (*pa)(int, int) = Add;
int (*ps)(int, int) = Sub;
int (*pt)(int, int) = times;
int (*pb)(int, int) = by;

//函数指针数组
int ((*arr)[4])(int, int) = {pa, ps, pt, pb};
//拆解为int (*)(int, int) pa[4]
其中
int (*)(int, int)表示数组每个元素是函数指针类型
arr表示数组名
[4]表示数组含有4个元素

//函数指针数组的访问
arr[0] = pa;
arr[1] = ps;
arr[2] = pt;
arr[3] = pb;
```

!!! note
    注意：函数的地址和函数指针数组中的地址不同，`&arr[0]`、`&arr[1]`、`&arr[2]`、`&arr[3]`表示数组四个元素的地址，但是不是函数本身的地址，函数本身的地址是函数名或者`&函数名`

### 转移表

在C语言中，转移表实际上是一个函数指针数组。转移表可以用来存储自定义函数的指针，然后通过数组下标来访问和调用这些函数

#### 常规实现计算器代码

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int add(int a, int b)//加法实现
{
    return a + b;
}

int sub(int a, int b)//减法实现
{
    return a - b;
}

int mul(int a, int b)//乘法实现
{
    return a * b;
}

int div(int a, int b)//除法实现
{
    return a / b;
}

int main()
{
    int x, y;
    int input = 1;
    int ret = 0;
    do
    {
        printf("*************************\n");
        printf("  1:add           2:sub  \n");
        printf("  3:mul           4:div  \n");
        printf("  0:exit                 \n");
        printf("*************************\n");
        printf("请选择：");
        scanf("%d", &input);
        //使用常规的函数调用方法
        switch (input)
        {
        case 1:
            printf("输⼊操作数：");
            scanf("%d %d", &x, &y);
            ret = add(x, y);
            printf("ret = %d\n", ret);
            break;
        case 2:
            printf("输⼊操作数：");
            scanf("%d %d", &x, &y);
            ret = sub(x, y);
            printf("ret = %d\n", ret);
            break;
        case 3:
            printf("输⼊操作数：");
            scanf("%d %d", &x, &y);
            ret = mul(x, y);
            printf("ret = %d\n", ret);
            break;
        case 4:
            printf("输⼊操作数：");
            scanf("%d %d", &x, &y);
            ret = div(x, y);
            printf("ret = %d\n", ret);
            break;
        case 0:
            printf("退出程序\n");
            break;
        default:
            printf("选择错误\n");
            break;
        }
    } while (input);
    return 0;
}
```

#### 使用转移表实现计算器代码

```C
#include <stdio.h>
int add(int a, int b)
{
    return a + b;
}
int sub(int a, int b)
{
    return a - b;
}
int mul(int a, int b)
{
    return a*b;
}
int div(int a, int b)
{
    return a / b;
}
int main()
{
    int x, y;
    int input = 1;
    int ret = 0;
    int(*p[5])(int x, int y) = { 0, add, sub, mul, div }; //转移表 
    do
    {
        printf("*************************\n");
        printf("  1:add           2:sub  \n");
        printf("  3:mul           4:div  \n");
        printf("  0:exit                 \n");
        printf("*************************\n");
        printf( "请选择：" );
        scanf("%d", &input);
        if ((input <= 4 && input >= 1))
        {
            printf( "输⼊操作数：" );
            scanf( "%d %d", &x, &y);
            ret = (*p[input])(x, y);//将输入值作为数组下标
            printf( "ret = %d\n", ret);
        }
        else if(input == 0)
        {
            printf("退出计算器\n");
        }
        else
        {
            printf( "输⼊有误\n" );        
        }
    }while (input);
    return 0;
}
```

### 类型重命名关键字：`typedef`

```C
//使用方法，以unsigned int为例
typedef unsigned int unit;
//将unsigned int类型重命名为unit

//typedef重命名指针类型
typedef int* ptr_i;
//注意在使用typedef重命名指针类型时，与直接使用int*创建指针变量存在区别（包括#define定义的int*）
ptr_i a, b;
//上面的代码本质a和b都是int*类型
int* a, b;
//对比第二种情况下，a是指针类型，而b是整型类型

//typedef重命名数组指针类型
typedef int(*parr_t)[5];
//注意新名字需要在*后面，而不是typedef int (*)[5] parr_t

//typedef重命名函数指针类型
typedef void(*pf_t)(int);
//注意新名字需要在*后面，而不是typedef void (*)(int) pf_t 
```

!!! note
    `typedef`对类型重命名也遵循作用域，`typedef`只会在对该语句后面的内容生效，`typedef`前面的内容不可以使用`typedef`重命名的内容

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

typedef unsigned int unit;//定义在花括号外面的与全局变量作用域相同

void test()
{
    typedef double d;//定义在花括号内部的作用域与局部变量相同
}

int main()
{

    d a = 0.0;//错误代码
    unit a = 0;//可行
    int arr[3][5] = { {1,2,3,4,5}, {2,3,4,5,6},{3,4,5,6,7} };
    test1(arr, 3, 5);

    return 0;
}
```

## C语言指针应用

### 回调函数

回调函数就是⼀个通过函数指针调用的函数

把函数的指针（地址）作为参数传递给另⼀个函数，当这个指针被用来调用其所指向的函数时，被调用的函数就是回调函数。回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应

=== "不使用回调函数"

    ```C
    #include <stdio.h>
    int add(int a, int b)
    {
        return a + b;
    }
    int sub(int a, int b)
    {
        return a - b;
    }
    int mul(int a, int b)
    {
        return a*b;
    }
    int div(int a, int b)
    {
        return a / b;
    }
    int main()
    {
        int x, y;
        int input = 1;
        int ret = 0;
        int(*p[5])(int x, int y) = { 0, add, sub, mul, div }; //转移表 
        do
        {
            printf("*************************\n");
            printf("  1:add           2:sub  \n");
            printf("  3:mul           4:div  \n");
            printf("  0:exit                 \n");
            printf("*************************\n");
            printf( "请选择：" );
            scanf("%d", &input);
            if ((input <= 4 && input >= 1))
            {
                printf( "输⼊操作数：" );
                scanf( "%d %d", &x, &y);
                ret = (*p[input])(x, y);//将输入值作为数组下标
                printf( "ret = %d\n", ret);
            }
            else if(input == 0)
            {
                printf("退出计算器\n");
            }
            else
            {
                printf( "输⼊有误\n" );        
            }
        }while (input);
        return 0;
    }
    ```

=== "使用回调函数"

    ```c
    #define _CRT_SECURE_NO_WARNINGS 1

    #include <stdio.h>

    int add(int a, int b)
    {
        return a + b;
    }

    int sub(int a, int b)
    {
        return a - b;
    }

    int mul(int a, int b)
    {
        return a * b;
    }

    int div(int a, int b)
    {
        return a / b;
    }

    //改造处
    void calc(int(*pf)(int, int))//参数是函数指针，通过函数指针调用函数
    {
        int ret = 0;
        int x, y;
        printf("输⼊操作数：");
        scanf("%d %d", &x, &y);
        ret = pf(x, y);
        printf("ret = %d\n", ret);
    }

    int main()
    {
        int input = 1;
        do
        {
            printf("*************************\n");
            printf("  1:add           2:sub  \n");
            printf("  3:mul           4:div  \n");
            printf("  0:exit                 \n");
            printf("*************************\n");
            printf( "请选择：" );
            scanf("%d", &input);
            switch (input)
            {
            case 1:
                calc(add);
                break;
            case 2:
                calc(sub);
                break;
            case 3:
                calc(mul);
                break;
            case 4:
                calc(div);
                break;
            case 0:
                printf("退出程序\n");
                break;
            default:
                printf("选择错误\n");
                break;
            }
        } while (input);
        return 0;
    }
    ```

### `qsort`函数介绍和使用

函数作用：将存放某种类型（包括自定义类型）的数组的元素进行排序。函数声明如下：

```c
void qsort (void* base, size_t num, size_t size,
            int (*compar)(const void*, const void*));
```

其中：第一个参数表示需要排序的数组，第二个参数表示数组元素个数，第三个参数表示数组每一个元素的数据类型的大小，第四个参数表示需要自行实现的比较函数。对于传递给第四个参数的比较函数来说，需要指定两个参数（下面以`p1`和`p2`为例）：

1. 指针`p1`比`p2`大时返回非0正值
2. 指针`p1`与`p2`相等时返回0
3. 指针`p1`比`p2`小时返回非0负值

当返回非0正值时进行交换，函数默认以从小到大的升序进行排列，如果想以从大到小的降序排列，调换函数指针指向的函数返回的两个指针参数`p1`和`p2`的计算顺序即可

基本使用如下：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//qosrt函数的使⽤者得实现⼀个⽐较函数 
int int_cmp(const void * p1, const void * p2)
{
     return (*( int *)p1 - *(int *) p2);// p1 - p2>0为真进行交换，否则不交换，默认从小到大排序
}

int main()
{
    int arr[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
    int i = 0;
    
    qsort(arr, sizeof(arr) / sizeof(arr[0]), sizeof (int), int_cmp);
    for (i = 0; i< sizeof(arr) / sizeof(arr[0]); i++)
    {
       printf( "%d ", arr[i]);
    }
    printf("\n");
    return 0;
}
输出结果：
0 1 2 3 4 5 6 7 8 9
```