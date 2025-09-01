<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# C语言字符函数、字符串函数与内存函数

## 字符函数

!!! note
    使用时字符函数需要包含头文件`ctype.h`

### 字符类型函数

| 函数       | 需要满足的条件返回真                                         |
| ---------- | ------------------------------------------------------------ |
| `iscntrl`  | 任何控制字符                                                 |
| `isspace`  | 空白字符：空格、换页符、换行、回车、制表符或垂直制表符       |
| `isdigit`  | 十进制数字字符0~9                                            |
| `isxdigit` | 十六进制数字，包括所有十进制数字字符，小写字母a~f或大写字母A~F |
| `islower`  | 小写字母a~z                                                  |
| `isupper`  | 大写字母A~Z                                                  |
| `isalpha`  | 字母                                                         |
| `isalnum`  | 字母或者数字，a~z，A~Z，0~9                                  |
| `ispunct`  | 标点符号，任何不属于数字或者字母的图形字符（可打印在控制台） |
| `isgraph`  | 任何图形字符                                                 |
| `isprint`  | 任何可打印字符，包括图形字符和空白字符                       |

### 字符转换函数

| 函数      | 函数作用               |
| --------- | ---------------------- |
| `tolower` | 将大写字母转成小写字母 |
| `toupper` | 将小写字母转成大写字母 |

## 字符串函数

!!! note
    字符串函数使用需要包含头文件`string.h`

### `strlen`函数

函数作用：计算一个字符串有多少个字符，但是不包含`\0`

```C
函数原型
size_t strlen ( const char * str );

参数说明
char*指针str指向需要计算字符的字符串
```

- 字符串以 `\0` 作为结束标志，strlen函数返回的是在字符串中 `\0` 前面出现的字符个数（不包含 `\0` )
- 参数指向的字符串必须要以 `\0` 结束
- 函数的返回类型为`size_t`

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>//包含头文件string.h

int main()
{
    const char* p = "hello world";

    size_t sz = strlen(p);//返回类型为size_t

    printf("%zd\n", sz);

    return 0;
}
输出结果：
11
```

### `strcpy`函数

函数作用：将源数组中的内容拷贝到目标数组，包括`\0`

```C
函数原型
char* strcpy(char * destination, const char * source );

参数说明
第一个参数char*类型的指针表示目标数组（拷贝的内容放置于此）
第二个参数char*类型的指针表示源头数组（需要从此数组中拷贝）

返回类型
函数返回char*类型的指针，该指针指向目标空间的起始地址
```

- 源字符串必须以 `\0` 结束
- 会将源字符串中的 `\0` 拷贝到目标空间
- 目标空间必须足够大，以确保能存放源字符串
- 目标空间必须可修改

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "hello world";//字符串长度为11，包括\0时长度为12，目标数组必须大于等于12
    
    char arr[20] = { 0 };//
    const char arr1[20] = { 0 };//尽管使用了const指针对数组进行了修饰限制，但是只是限制数组不能被直接修改
                                //但是仍然可以通过指针间接修改，而strcpy函数的第一个参数恰好是一个指针，故此时用const修饰的数组仍可以被修改，但是这种做法不安全

    char* str = "aaaaaaaaaaaaa";//此时str指针指向的是常量字符串所在的空间，与数组空间对比，常量字符串所在空间无法被修改，故此时会拷贝失败
    
    char* p1 = strcpy(arr1, p);
    //char* p2 = strcpy(str, p);

    printf("%s\n", p1);
    printf("%s\n", arr1);//也可以直接使用数组名进行输出而不进行函数返回值接受
    return 0;
}
输出结果：
hello world
hello world
```

### `strcat`函数

函数作用：在一个目标空间中出现`\0`的位置开始追加新的字符

```C
函数原型
char * strcat ( char * destination, const char * source );

参数说明
第一个参数是char*类型的指针，指向被追加的目标空间的地址
第二个参数是char*类型的指针，指向需要追加的字符的源空间的地址

返回类型
函数返回char*类型的指针，该指针指向目标空间的起始地址
```

- 源字符串必须以`\0`结束
- 目标字符串中也得有 `\0` ，否则没办法知道追加开始的位置（`strcat`函数从目标空间的`\0`位置开始追加，并且会覆盖目标空间的`\0`）
- 目标空间必须有足够的大，能容纳下源字符串的内容
- 目标空间必须可修改

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "hello world";
    char arr[20] = { 0 };
    char* str = "aaaaaaaaaaaaa";
    char arr2[20] = "abc";
    char arr3[20] = { 'x' };//尽管在目标数组空间中没有显式得写出\0，但是数组在初始化时，如果给了内容，那么其余没有给内容的空间将默认以0（\0）填充，但是注意源空间必须包含\0

    char* p3 = strcat(arr2, p);
    strcat(arr, p);//当目标空间没有字符串，则strcat函数实现的效果与strcpy函数类似
    strcat(arr3, p);
    //strcat(str, p);//无法追加，目标空间不可修改

    printf("%s\n", p3);
    printf("%s\n", arr);
    printf("%s\n", arr3);

    return 0;
}
输出结果：
abchello world
hello world
xhello world
```

!!! note

    尽量不要使用`strcat`函数自己给自己追加，即目标空间和源空间尽量不要是同一空间，可能会导致未定义的行为

    因为`strcat`函数在执行时，会首先找到目标字符串的结束位置（即`\0`字符的位置），然后从这个位置开始，将源字符串的内容复制过来。如果源字符串和目标字符串是同一个字符串，那么在复制过程中，源字符串的内容可能会被目标字符串的新内容覆盖，这就导致了源字符串的内容在复制过程中被改变，从而引发未定义的行为

### `strcmp`函数

函数作用：比较两个字符串的大小

!!! note
    注意此处比较的不是两个字符串的长度，而是两个字符串中的对应字符两两比较

```C
函数原型
int strcmp ( const char * str1, const char * str2 );

参数说明
第一个参数是char*类型的指针，指向需要比较的第一个字符串
第二个参数是char*类型的指针，指向需要比较的第二个字符串

返回类型
函数返回int类型，有以下三种情况：
第⼀个字符串⼤于第二个字符串，则返回⼤于0的正整数数值
第⼀个字符串等于第二个字符串，则返回0
第⼀个字符串⼩于第二个字符串，则返回小于0的负整数数值
```

- 根据每个字符在ASCII表中对应的数值进行字符大小比较

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "abcdef";
    char* p1 = "abd";

    int ret = strcmp(p, p1);
    if (ret)
    {
        printf("第一个字符串比第二个字符串大");
    }
    else if(ret < 0)
    {
        printf("第一个字符串比第二个字符串小");
    }
    else
    {
        printf("两个字符串相等");
    }

    return 0;
}
输出结果：
第一个字符串比第二个字符串大
```

### `strncpy`函数

函数作用：与`strcpy`基本相同，但是多了一个拷贝字符数量限制

```C
函数原型
char * strncpy ( char * destination, const char * source, size_t num );

参数说明
第一个参数是char*类型的指针，指向拷贝的目标空间的地址
第二个参数是char*类型的指针，指向需要拷贝的源空间的地址
第三个参数是size_t类型的变量，代表需要拷贝的字符的数量（最大数量），注意此处的num表示字符个数*char类型在内存中占用的大小，即字符个数*1

返回类型
函数返回类型是一个char*类型的指针，该指针指向目标空间的起始位置
```

- 拷贝`num`个字符从源字符串到目标空间
- 如果源字符串的长度小于`num`，则拷贝完源字符串之后，在目标的后边追加0，直到`num`个

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "hello world";
    char arr[20] = { 0 };
    char arr1[6] = "xxxxxx";
    char arr2[15] = "xxxxxxxxxxxxxxx";

    strncpy(arr, p, 5);//由于arr数组初始化时已经有了0（\0），故可以不用手动添加\0
    strncpy(arr1, p, 5);//注意strncpy函数在拷贝的字符个数小于源字符串字符个数并且目标空间进行了完全初始化时，需要手动添加\0，否则会打印出随机值
    strncpy(arr2, p, 15);//源字符串长度小于最大字符串长度时，会在目标空间中写入\0，一直写到总共字符串数量长度达到最大字符串长度

    printf("%s\n", arr);
    printf("%s\n", arr1);
    arr1[5] = '\0';//为最后一个元素添加'\0'
    printf("%s\n", arr1);
    printf("%s\n", arr2);

    return 0;
}
输出结果：
hello
hellox烫烫烫烫烫烫烫烫烫烫烫烫烫烫烫hello world
hello
hello world
```

### `strncat`函数

函数作用：与`strcat`函数类似，多了一个参数表示需要向目标空间中追加的字符个数

```C
函数原型
char * strncat ( char * destination, const char * source, size_t num );

参数说明
第一个参数是char*类型的指针，指向被追加的目标空间的地址
第二个参数是char*类型的指针，指向需要追加的字符的源空间的地址
第三个参数是size_t类型的变量，表示需要追加的字符个数（最大字符个数），注意此处的num表示字符个数*char类型在内存中占用的大小，即字符个数*1

返回类型
函数返回一个char*类型的指针，该指针指向目标空间的起始地址
```

- 将`source`指向字符串的前`num`个字符追加到`destination`指向的字符串末尾，再追加⼀个 `\0` 字符
- 如果`source`指向的字符串的长度小于`num`的时候，只会将字符串中到`\0` 的内容追加到`destination`指向的字符串末尾

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "hello world";
    char arr[20] = { 0 };
    char arr2[20] = "abc";

    strncat(arr2, p, 5);

    printf("%s\n", arr2);

    return 0;
}
输出结果：
abchello
```

### `strncmp`函数

函数作用：与`strcmp`函数类似，但是多了一个参数表示需要比较的字符的个数

```C
函数原型
int strncmp ( const char * str1, const char * str2, size_t num );

参数说明
第一个参数为char*类型的指针，指向需要比较的第一个字符串
第二个参数为char*类型的指针，指向需要比较的第二个字符串
第三个参数为size_t类型的变量，表示需要比较的字符串的个数（最大字符个数），注意此处的num表示字符个数*char类型在内存中占用的大小，即字符个数*1

返回类型
函数返回int类型的值，需要满足的条件与strcmp相同
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "abcdef";
    char* p1 = "abd";

    int ret = strncmp(p, p1, 2);
    if (ret)
    {
        printf("第一个字符串比第二个字符串大");
    }
    else if(ret < 0)
    {
        printf("第一个字符串比第二个字符串小");
    }
    else
    {
        printf("两个字符串相等");
    }

    return 0;
}
输出结果：
两个字符串相等
```

### `strstr`函数

函数作用：在一个字符串中找与第二个字符串相同的字符

```C
函数原型
char * strstr ( const char * str1, const char * str2);

参数说明
第一个参数为char*类型的指针，指向需要进行检索的字符串
第二个参数为char*类型的指针，指向需要查找的字符串

返回类型
函数返回一个char*类型的指针，表示找到完全匹配的字符后返回成功找到后的第一个字符的地址
```

- 函数返回字符串`str2`在字符串`str1`中第⼀次出现的位置
- 字符串的比较匹配不包含 `\0` 字符，以 `\0` 作为结束标志

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char* p = "abcdef";
    char* str = "abbbcdef";
    char* str1 = "abdbcdef";
    char* p1 = "abd";
    char* p2 = "bcd";

    char* ptr = strstr(p, p1);//找不到时返回null，注意不是NULL，尽管都是表示值为0
    char* ptr1 = strstr(str, p2);//返回找到后的第一个字符的地址，即str指向的空间的第三个'b'的地址
    char* ptr2 = strstr(str1, p2);//返回找到后的第一个字符的地址，即str指向的空间的第二个'b'的地址

    printf("%s\n", ptr);
    printf("%s\n", ptr1);
    printf("%s\n", ptr2);

    return 0;
}
输出结果：
(null)
bcdef
bcdef
```

### `strtok`函数

函数作用：将字符串按照字符集中的字符进行分割

```C
函数原型
char * strtok ( char * str, const char * sep);

参数说明
第一个参数为char*类型的指针，指向需要进行分割的字符串
第二个参数为char*类型的指针，指向分割字符集合的字符串

返回类型
函数返回char*类型的指针，指向分割后的字符串的起始地址
```

- `strtok`函数找到`str`中的标记，并将其用 `\0` 结尾，返回一个指向这个标记的指针。（注：`strtok`函数会改变被操作的字符串，所以在使用`strtok`函数切分的字符串一般都是临时拷贝的内容并且可修改）
- `strtok`函数的第一个参数不为 `NULL` ，函数将找到`str`中第一个标记，`strtok`函数将保存它在字符串中的位置
- `strtok`函数的第⼀个参数为 `NULL` ，函数将在同⼀个字符串中被保存的位置开始，查找下一个标记。如果字符串中不存在更多的标记，则返回 `NULL` 指针

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    char str[] = "zhangsan@gmail.com";//待分隔字符串
    char* p = "@.";//分隔符集合字符串

    for (char* p4 = strtok(str, p)/*先使用strtok进行第一次分割，如果分割完成则返回非空指针给p4*/; p4 != NULL/*当p4是空指针时，说明已经分割完毕*/; p4 = strtok(NULL, p)/*当传入NULL时代表在同一个字符串中从上次分割后成功替换为\0的位置开始*/)
    {
        printf("%s\n", p4);
    }

    return 0;
}
输出结果：
zhangsan
gmail
com
```

### `strerror`函数

函数作用：返回参数部分错误码对应的错误信息的字符串地址

!!! note
    在不同的系统和C语言标准库的实现中都规定了一些错误码，一般是放在 `errno.h` 这个头文件中说明的，C语言程序启动的时候就会使用一个全面的变量`errno`来记录程序的当前错误码，只不过程序启动的时候`errno`是0，表示没有错误，当我们在使用标准库中的函数的时候发生了某种错误，就会讲对应的错误码，存放在`errno`中，而一个错误码的数字是整数很难理解是什么意思，所以每一个错误码都是有对应的错误信息的。

```C
函数原型
char * strerror ( int errnum );

参数说明
int类型变量，代表错误码

返回类型
函数会返回char*类型的指针，该指针指向错误码对应的错误信息的字符串的地址
```

代码实例

```C
#include <stdio.h>
#include <string.h>
#include <errno.h>
int main ()
{
    FILE * pFile;
    pFile = fopen ("unexist.ent","r");
    if (pFile == NULL)
        printf ("Error opening file unexist.ent: %s\n", strerror(errno));//传入错误码变量，函数返回错误码对应的错误信息字符串起始地址
    return 0;
}
输出结果：
Error opening file unexist.ent: No such file or directory
```

#### perror函数

函数作用：将错误信息字符串打印在控制台

```C
函数原型
void perror ( const char * str );

参数说明
函数接收一个char*类型的指针，该指针默认优先指向用户指定需要打印的内容，再指向错误信息；如果没有用户指定需要打印的内容，则只打印错误信息
```

- perror函数打印完参数部分的字符串后，再打印一个冒号和一个空格，再打印错误信息

代码实例

```C
#include <stdio.h>
#include <string.h>
#include <errno.h>
int main ()
{
    FILE * pFile;
    pFile = fopen ("unexist.ent","r");
    if (pFile == NULL)
        perror("Error opening file unexist.ent");//先打印用户指定的信息，再打印错误信息，并且二者之间会有冒号:和一个空格
    return 0;
}
输出结果：
Error opening file unexist.ent: No such file or directory
```

## 内存函数

!!! note
    使用内存函数需要包含头文件`string.h`

### memcpy函数

函数作用：将一个空间中的任意类型的数据复制指定大小到另一个空间

```C
函数原型
void * memcpy ( void * destination, const void * source, size_t num );

参数说明：
第一个参数为void*指针，指向复制至的目标空间
第二个参数为void*指针，指向需要复制的内容的源空间
第三个参数为size_t类型的变量，表示需要复制数据个数，注意此处的num表示字符个数*对应数据类型在内存中占用的大小，即字符个数*sizeof(数据类型)

返回类型
函数返回类型为void*指针，指向目标空间的起始位置
```

- 如果`source`和`destination`有任何的重叠，复制的结果都是未定义的

!!! note
    与`strcpy`函数不同的是，`memcpy`函数在遇到 `\0` 的时候并不会停下来

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    int arr[] = { 1,2,3,4,5,6,7,8,9,10 };
    int arr1[20] = { 0 };

    memcpy(arr1, arr, 10 * sizeof(int));

    for (int i = 0; i < 10; i++)
    {
        printf("%d ", arr1[i]);
    }

    return 0;
}
输出结果：
1 2 3 4 5 6 7 8 9 10
```

### `memmove`函数

函数作用：与`memcpy`函数类似，区别就是`memmove`函数大多数用于目标空间和源空间有重叠

```C
函数原型
void * memmove ( void * destination, const void * source, size_t num );

参数说明
第一个参数为void*指针，指向复制至的目标空间
第二个参数为void*指针，指向需要复制的内容的源空间
第三个参数为size_t类型的变量，表示需要复制数据个数，注意此处的num表示字符个数*对应数据类型在内存中占用的大小，即字符个数*sizeof(数据类型)

返回类型
函数返回类型为void*指针，指向目标空间的起始位置
```

!!! note
    如果源空间和目标空间出现重叠，尽量使用`memmove`函数处理

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    int arr2[15] = { 1,2,3,4,5,6,7,8,9,10 };

    memmove(arr2+2, arr2, 10 * sizeof(int));//从arr2数组的第三个元素开始拷贝，目标空间和源空间有重叠

    for (int i = 0; i < 15; i++)
    {
        printf("%d ", arr2[i]);

    }
    return 0;
}
输出结果：
1 2 1 2 3 4 5 6 7 8 9 10 0 0 0
```

### `memset`函数

函数作用：将内存中的值以字节为单位设置成想要的内容

```C
函数原型
void * memset ( void * ptr, int value, size_t num );

参数说明
第一个参数为void*类型的指针，指向需要更改的目标空间
第二个参数为int类型的变量，表示需要修改为的内容，并且是一个字节一个字节进行设置，即将每个字节都设置该值（包括char类型的字符类型）
第三个参数为size_t类型的变量，表示需要修改的内容的个数，单位是字节

返回类型
函数返回void*类型的指针，指向目标空间的起始位置
```

代码实例

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>
int main ()
{
    char str[] = "hello world";
    memset (str,'x',6);
    printf(str);

    int arr2[15] = { 1,2,3,4,5,6,7,8,9,10 };

    memset(arr2, 6, 1);//整型是4个字节，如果在第三个参数中传4并不是代表第一个数据只改最后一位字节，而是4个字节每一个字节都会更改
                        //而需要改变第一个数值，则只需要改变第一个字节就行，即第三个参数传入1

    for (int i = 0; i < 15; i++)
    {
        printf("%d ", arr2[i]);

    }

    return 0;
}
    return 0;
}
输出结果：
xxxxxxworld
6 2 3 4 5 6 7 8 9 10 0 0 0 0 0
```

### `memcmp`函数

函数作用：以字节为单位比较两个空间中的内容

```C
函数原型
int memcmp ( const void * ptr1, const void * ptr2, size_t num );

参数说明
第一个参数为void*类型的指针，指向需要比较的第一个空间
第二个参数为void*类型的指针，指向需要比较的第二个空间
第三个参数为size_t类型的变量，表示需要比较的字节数

返回类型
函数返回int类型的数值，满足下面三种情况
第⼀个空间内容⼤于第二个空间内容，则返回⼤于0的正整数数值
第⼀个空间内容等于第⼆个空间内容，则返回0
第⼀个空间内容⼩于第⼆个空间内容，则返回⼩于0的负整数数值
```

代码实例：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <string.h>

int main()
{
    int arr2[15] = { 1,2,3,4,5,6,7,8,9,10 };
    int arr3[10] = { 1,2,3,4,6 };

    int ret = memcmp(arr2, arr3, 16);//比较前16个字节（4个整型数值）
    int ret1 = memcmp(arr2, arr3, 17);//比较前17个字节（4个整型数值+下一个整型的最低位）

    if (ret)
    {
        printf("第一个空间内容大于第二个空间内容\n");
    }
    else if (ret < 0)
    {
        printf("第一个空间内容小于第二个空间内容\n");
    }
    else
    {
        printf("两个空间内容相同\n");
    }

    if (ret1)
    {
        printf("第一个空间内容大于第二个空间内容\n");
    }
    else if (ret1 < 0)
    {
        printf("第一个空间内容小于第二个空间内容\n");
    }
    else
    {
        printf("两个空间内容相同\n");
    }

    return 0;
}
输出结果：
两个空间内容相同
第一个空间内容大于第二个空间内容
```