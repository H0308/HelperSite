<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# C语言动态内存管理

## 动态内存管理的优点

变量和数组创建的空间固定，有时候需要的空间大小在程序运行的时候才能知道，那数组的编译时开辟空间的方式就不能满足动态内存管理，而动态内存管理可以灵活地申请和释放空间

## C/C++中程序内存区域划分

- 栈区（stack）：在执行函数时，函数内局部变量的存储单元都可以在栈上创建，函数执行结束时这些存储单元自动被释放。栈内存分配运算内置于处理器的指令集中，效率很高，但是分配的内存容量有限。栈区主要存放运行函数而分配的局部变量、函数参数、返回数据、返回地址等
- 堆区（heap）：一般由程序员分配释放，若程序员不释放，程序结束时可能由OS回收。分配方式类似于链表
- 数据段（静态区）：（static）存放全局变量、静态数据，程序结束后由系统释放
- 代码段：存放函数体（类成员函数和全局函数）的二进制代码

```C
int globalVariable = 0;
static int staticGlobalVariable = 0;

void test()
{
    static int staticVariable = 0;
    int localVariable = 0;
    int num1[10] = { 1,2,3,4 };
    char char2[] = "abcd";
    char* pChar3 = "abcd";
    int* ptr1 = (int*)malloc(4 * sizeof(int));
    int* ptr2 = (int*)calloc(4, sizeof(int));
    int* ptr3 = (int*)realloc(ptr2, 4 * sizeof(int));
    
    free(ptr1);
    free(ptr3);
}
```

上述代码中对应的内容所在空间如下图：

<img src="images\image.png">

## `malloc`函数与`free`函数

!!! note
    使用`malloc`函数和`free`函数需要包含头文件`stdlib.h`

### `malloc`函数

函数作用：向内存申请一块连续可用的空间，并返回指向这块空间的指针

```C
函数原型
void* malloc (size_t size);

参数说明
参数为size_t类型的变量，表示需要开辟的空间的大小，注意size = 数据类型个数*sizeof(数据类型)

返回类型
函数返回void*指针，该指针指向成功开辟的空间的地址
```

- 如果开辟成功，则返回⼀个指向开辟好空间的指针。
- 如果开辟失败，则返回⼀个` NULL `指针，因此`malloc`的返回值⼀定要做检查
- 返回值的类型是 `void*` ，所以`malloc`函数并不知道开辟空间的类型，具体在使用的时候使用者来决定
- 如果参数 `size` 为0，`malloc`的行为是标准是未定义的，取决于编译器，注意`malloc(0)`是允许的，也会返回一个指针，只是没有空间所以不可使用而已
- `malloc`函数开辟的空间没有初始值

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
int main()
{
    //固定开辟个数
    int* p = (int*)malloc(10 * sizeof(int));//使用malloc开辟10个int类型大小的空间
    assert(p);//使用断言对p是否是空指针进行判断，如果p为空指针则表达式为假，终止程序继续运行
    //使用变量决定开辟个数
    int num = 0;
    scanf("%d", &num);
    int* p1 = (int*)malloc(num * sizeof(int));//使用malloc开辟num个int类型大小的空间
    assert(p1);

    for (int i = 0; i < 10; i++)
    {
        printf("%x ", p[i]);//malloc函数开辟的空间没有赋初始值
    }

    putchar('\n');

    for (int i = 0; i < 10; i++)//访问开辟的10个int类型大小的空间
    {
        p[i] = i;
        printf("%d ", *(p + i));
    }

    putchar('\n');

    for (int i = 0; i < num; i++)//访问开辟的num个int类型大小的空间
    {
        p1[i] = i;
        printf("%d ", *(p1 + i));
    }

    //使用free函数将动态开辟的内存释放
    free(p);
    p = NULL;
    free(p1);
    p1 = NULL;

    return 0;
}
输入：
15
输出结果：
cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd cdcdcdcd
0 1 2 3 4 5 6 7 8 9
0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
```

### `free`函数

函数作用：用来进行动态内存的释放和回收

```C
函数原型
void free (void* ptr);

参数说明
参数为一个void*类型的指针，该指针指向动态内存开辟函数返回的地址
```

- 如果参数 `ptr` 指向的空间不是动态开辟的，那`free`函数的行为是未定义的
- 如果参数 `ptr` 是`NULL`指针，则函数不处理任何事务

!!! note
    注意`free`函数不会将接收动态内存开辟函数成功开辟空间后返回的地址的指针置为空，仅仅只是将开辟的空间释放

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
int main()
{
    //固定开辟个数
    int* p = (int*)malloc(10 * sizeof(int));//使用malloc开辟10个int类型大小的空间
    assert(p);//使用断言对p是否是空指针进行判断，如果p为空指针则表达式为假，终止程序继续运行
    //使用变量决定开辟个数
    int num = 0;
    scanf("%d", &num);
    int* p1 = (int*)malloc(num * sizeof(int));//使用malloc开辟num个int类型大小的空间
    assert(p1);

    //使用free函数将动态开辟的内存释放
    free(p);
    p = NULL;//一定要将未使用的指针置为空，避免野指针
    free(p1);
    p1 = NULL;

    return 0;
}
```

## `calloc`函数与`realloc`函数

!!! note
    使用`calloc`函数和`realloc`函数需要包含头文件`stdlib.h`

### `calloc`函数

函数作用：向内存申请一块连续可用的空间，并返回指向这块空间的指针，与`malloc`不同的是，`calloc`函数会为开辟的空间赋初始值为0

```C
函数原型
void* calloc (size_t num, size_t size);

参数说明
第一个参数是size_t类型的变量，表示需要开辟的内存块的大小
第二个参数是size_t 类型的变量， 表示每个空间占用的大小，即 sizeof(数据类型)，单位为字节

返回类型
函数返回一个void*类型的指针，该指针指向成功开辟后的空间的地址
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
int main()
{
    //固定开辟个数
    int* p = (int*)calloc(10, sizeof(int));
    assert(p);//使用断言对p是否是空指针进行判断
    //使用变量决定开辟个数
    int num = 0;
    scanf("%d", &num);
    int* p1 = (int*)calloc(num, sizeof(int));
    
    for (int i = 0; i < 10; i++)
    {
        printf("%x ", p[i]);//calloc函数开辟的空间有初始值为0
    }

    putchar('\n');

    for (int i = 0; i < 10; i++)//访问开辟的10个int类型大小的空间
    {
        p[i] = i;
        printf("%d ", *(p + i));
    }

    putchar('\n');

    for (int i = 0; i < num; i++)//访问开辟的num个int类型大小的空间
    {
        p1[i] = i;
        printf("%d ", *(p1 + i));
    }

    //使用free函数将动态开辟的内存释放
    free(p);
    p = NULL;
    free(p1);
    p1 = NULL;

    return 0;
}
输入：
15
输出结果：
0 0 0 0 0 0 0 0 0 0
0 1 2 3 4 5 6 7 8 9
0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
```

### `realloc`函数

函数作用：对动态开辟内存大小的调整

```C
函数原型
void* realloc (void* ptr, size_t size);

参数说明
第一个参数为void*类型的指针，该指针指向动态内存函数成功开辟的空间的原始地址
第二个参数为size_t类型的变量，表示需要的新的空间的大小，注意size = 数据类型个数*sizeof(数据类型)

返回类型
函数返回一个void*类型的指针，该指针指向成功开辟的空间的地址
```

- 该函数调整原内存空间大小的基础上，还会将原来内存中的数据移动到新的空间
- 尽量不要使用已经指向有`malloc`或者`calloc`函数开辟的空间的地址的指针作为接收`realloc`函数开辟空间的地址的指针，如果`realloc`开辟失败将会导致原来由`malloc`或者`calloc`函数开辟的空间丢失找不到的情况

```C
int* p = (int*)malloc(10 * sizeof(int));
assert(p);

p = (int*)realloc(p, 10 * sizeof(int));//不要这样做，否则可能导致malloc开辟的空间丢失并且无法free进而导致内存泄漏
```

!!! note
    使用`realloc`函数时不需要对指向原来的`malloc`函数和`calloc`函数开辟的空间的指针进行释放操作，`realloc`会对原来`malloc`函数和`calloc`函数开辟的空间进行管理

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

int main()
{
    int* p = (int*)calloc(10, sizeof(int));
    assert(p);

    int* p1 = (int*)realloc(p, 10 * sizeof(int));
    assert(p1);
    
    //使用realloc后，不需要再对malloc或者calloc开辟的空间进行释放，因为已经由realloc来管理，只需要将原来的指针进行置为空，或者直接用临时指针中的地址覆盖
    //free(p);
    p = NULL;//可以不需要此步
    p = p1;
    p1 = NULL;

    for (int i = 0; i < 10; i++)
    {
        p[i] = i;
        printf("%d ", p[i]);
    }

    free(p);
    p = NULL;

    return 0;
}
输出结果：
0 1 2 3 4 5 6 7 8 9
```

- `realloc`在调整内存空间的是存在两种情况：
    - 情况1：原有空间之后有足够大的空间
    - 情况2：原有空间之后没有足够大的空间

对于情况1：

`realloc`函数要扩展内存就直接原有内存之后直接追加空间，原来空间的数据不发生变化

对于情况2：

`realloc`函数在堆空间上另找一个合适大小的连续空间来使用，函数返回的是一个新的内存地址

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

int main()
{
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

int main()
{
    //情况1，原空间后有足够大的空间
    int* p = (int*)calloc(10, sizeof(int));
    assert(p);
    printf("%p\n", p);

    int* p1 = (int*)realloc(p, 10 * sizeof(int));
    assert(p1);
    printf("%p\n", p1);
    
    p = p1;

    for (int i = 0; i < 10; i++)
    {
        p[i] = i;
        printf("%d ", p[i]);
    }
    putchar('\n');

    //情况2，原空间后无足够大的空间
    int* p2 = (int*)calloc(10, sizeof(int));
    assert(p2);
    printf("%p\n", p2);

    int* p3 = (int*)realloc(p2, 100 * sizeof(int));
    assert(p3);
    printf("%p\n", p3);

    p2 = p3;

    for (int i = 0; i < 10; i++)
    {
        p2[i] = i;
        printf("%d ", p2[i]);
    }

    //使用free函数将动态开辟的内存释放
    free(p);
    p = NULL;
    p1 = NULL;//p1指向的空间已由p接管，故free只需要对p进行操作，p1直接置为空即可
    free(p2);
    p2 = NULL;
    p3 = NULL;//p3指向的空间已由p接管，故free只需要对p2进行操作，p3直接置为空即可

    return 0;
}
输出结果：
000001B3132AA500
000001B3132AA500
0 1 2 3 4 5 6 7 8 9
000001B3132B3150
000001B3132B3600
0 1 2 3 4 5 6 7 8 9
```

!!! note
    当`realloc`函数的第一个参数为空指针`NULL`时，实现的效果与`malloc`函数相同

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

int main()
{
    int* p = (int*)malloc(10 * sizeof(int));
    assert(p);
    for (int i = 0; i < 10; i++)
    {
        p[i] = i;
        printf("%d ", p[i]);
    }

    putchar('\n');

    int* p1 = (int*)realloc(NULL, 10 * sizeof(int));
    assert(p1);
    for (int i = 0; i < 10; i++)
    {
        p1[i] = i;
        printf("%d ", p1[i]);
    }

    free(p);
    p = NULL;
    free(p1);
    p1 = NULL;

    return 0;
}
输出结果：
0 1 2 3 4 5 6 7 8 9
0 1 2 3 4 5 6 7 8 9
```

## 常见的动态内存管理的错误

### 对NULL指针的解引用操作

```C
void test()
{
    int *p = (int *)malloc(INT_MAX/4);
    *p = 20;//如果p的值是NULL，就会有问题 
    free(p);
}
```

!!! note
    无法保证`malloc`函数一定能成功开辟空间，所以在对`p`指针解引用操作之前一定要先判断是否是空指针

### 对动态开辟空间的越界访问

```C
void test()
{
    int i = 0;
    int *p = (int *)malloc(10*sizeof(int));
    if(NULL == p)
    {
        exit(EXIT_FAILURE);
    }
    for(i=0; i<=10; i++)
    {
        *(p+i) = i;//当i是10的时候越界访问 
    }
    free(p);
}
```

!!! note
    上述代码中的`malloc`函数只开辟了10个空间，而在`for`循环中循环执行了11次，对`malloc`开辟的空间进行了越界访问

### 对非动态开辟内存使用`free`释放

```C
void test()1
{
    int a = 10;
    int *p = &a;
    free(p);
}
```

!!! note
    `p`指向的空间是由变量创建开辟的空间，而不是由动态内存管理函数开辟的空间，不可以用`free`进行释放

### 使用`free`释放一块动态开辟内存的一部分

```C
void test()
{
    int *p = (int *)malloc(100);
    p++;
    free(p);//p不再指向动态内存的起始位置 
}
```

!!! note
    `p++`使得`p`指针不再指向动态内存的起始位置，此时进行`free`操作只对一部分空间进行了释放

### 对同一块动态内存多次释放

```C
void test()
{
    int *p = (int *)malloc(100);
    free(p);
    free(p);//重复释放 
}
```

!!! note
    使用`free`函数对`p`指向的空间进行了两次释放，但是因为第一个`free`函数调用就已经释放了`malloc`开辟的空间，此时不可以使用`free`对`p`指向的空间进行释放

### 动态开辟内存忘记释放（内存泄漏）

```C
void test()
{
    int *p = (int *)malloc(100);
    if(NULL != p)
    {
        *p = 20;
    }
}
 
int main()
{
    test();
    while(1);
}
```

!!! note
    动态内存管理函数开辟的空间在内存的堆空间上，故如果不对该空间进行手动释放，只能等到程序终止后才会释放，若程序运行时间太长，将会导致内存泄露，故动态内存管理函数开辟的内存空间一定要及时释放，防止内存泄漏

## 柔性数组

在C语言C99标准中，结构体中的最后一个元素允许是未知大小的数组，这就叫做柔性数组成员变量

```C
typedef struct st_type
{
    int i;
    int a[0];//柔性数组成员 
    //int a[];//或者不写0
}type_a;
```

### 柔性数组的特点

- 结构中的柔性数组成员前面必须有至少一个其他成员
- `sizeof`返回的这种结构大小不包括柔性数组的内存
- 包含柔性数组成员的结构用`malloc`函数进行内存的动态分配，并且分配的内存应该大于结构的大小，以适应柔性数组的预期大小

```C
typedef struct st_type
{
    int i;
    int a[0];//柔性数组成员 
}type_a;

int main()
{
    printf("%d\n", sizeof(type_a));//输出的是int类型的大小，即4
    return 0;
}
输出结果：
4
```

### 柔性数组的使用

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <assert.h>
#include <stdlib.h>

struct st_type
{
    int i;
    int a[0];
};

int main()
{
    struct st_type* p = (struct st_type*)malloc(sizeof(struct st_type) + 10 * sizeof(int));//计算出结构体的大小后再加上柔性数组需要的空间，确保开辟的空间适应柔性数组的预期大小
                                                                                    //此处的10 * sizeof(int)即为柔性数组的空间大小
    assert(p);
    p->i = 100;//为结构体成员变量赋值

    for (int i = 0; i < 10; i++)//访问柔性数组
    {
        p->a[i] = i;
        printf("%d ", p->a[i]);
    }
    //释放结构体指针
    free(p);
    p = NULL;

    return 0;
}
输出结果：
0 1 2 3 4 5 6 7 8 9
```

### 柔性数组的优点

对比结构体中的指针成员变量指向`malloc`开辟的空间

```C
//代码2 
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <assert.h>
#include <stdlib.h>

struct st_type
{
    int i;
    int* p_a;
};

int main()
{
    struct st_type* p = (struct st_type*)malloc(sizeof(struct st_type));
    assert(p);
    
    p->i = 10;
    p->p_a = (int*)malloc(p->i * sizeof(int));
    assert(p->p_a);

    for (int i = 0; i < 10; i++)
    {
        p->p_a[i] = i;//通过结构体的指针成员变量访问malloc开辟的空间
    }

    //释放空间 
    //既需要将结构体类型的指针指向的malloc开辟的空间释放
    //还需要释放结构体中的指针成员变量指向的malloc开辟的空间
    //并且需要优先释放结构体中的指针成员变量指向的malloc开辟的空间
    free(p->p_a);
    p->p_a = NULL;
    free(p);
    p = NULL;

    return 0;
}
```

- 第一个好处是：方便内存释放（不会遗漏需要释放的空间）

    如果我们的代码是在一个给别人用的函数中，你在里面做了二次内存分配，并把整个结构体返回给用户。用户调用`free`可以释放结构体，但是并不知道这个结构体内的成员也需要free。所以，如果我们把结构体的内存以及其成员要的内存⼀次性分配好，并返回给用户一个结构体指针，用户做一次free就可以把所有的内存也给释放掉

- 第二个好处是：有利于访问速度

    连续的内存有益于提高访问速度，也在一定程度上有益于减少内存碎片