# C语言的标准输入函数`scanf`及标准输出函数`printf`

## `printf`函数

### 基本用法

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

`printf`函数作用是将函数的内容打印输出到控制台，但是`printf`本身不带有换行符\n，故此时`printf`执行完后，光标会停留在结束输出的位置

可以对上面的代码进行改进：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{    
    printf("Hello world!\n");
    return 0;
}
输出结果：
Hello world!
```

此时光标会停留在下一行的开头

若文本内部有换行，同样可以使用换行符

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{    
    printf("Hello\nworld!\n");
    return 0;
}
输出结果：
Hello
world!
```

### `printf`的返回值

`printf`函数返回的是成功打印在屏幕上的字符的个数

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int ret = printf("This is a test function.\n%s\n", "Hello world");//转义字符算1个字符，返回成功打印的字符个数，如果有占位符，则将对应的内容的字符个数代替占位符后计算总个数
    printf("%d\n", ret);

    return 0;
}
输出结果：
This is a test function.
Hello world
37
```

- 在字符串中的转义字符依旧算作1个字符

```C
#include<stdio.h>
#include<string.h>

int main()
{ 
    char s[] = "\\123456\123456\t";//共十二个字符，三个转义字符，分别为\\、\123、\t，以及剩下的字符
    printf("%d\n", strlen(s));
    return 0;
}
```

### 占位符

`printf`可以在输出的文本中指定占位符

占位符表示当前占位符所在位置可以被参数代替

代码实例：

```C
//输出：这里有3棵树
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{    
    printf("There are %d trees.", 3);
    return 0;
}
输出结果：
There are 3 trees.
```

输出文本可以用多个占位符

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{    
    printf("%s says it is %d o'clock.", "Lisi", 12);
    return 0;
}
输出结果：
Lisi says it is 12 o'clock.
```

`printf` 参数与占位符是一一对应关系，如果有 n 个占位符， `printf` 的参数就应该有 n + 1 个。如果参数个数少于对应的占位符， `printf` 可能会输出内存中的任意值

`printf`函数常见的占位符：

- `%a` ：十六进制浮点数，字母输出为小写
- `%A` ：十六进制浮点数，字母输出为大写
- `%c` ：字符
- `%d` ：十进制有符号整数
- `%e` ：使用科学计数法的浮点数，指数部分的 e 为小写
- `%E` ：使用科学计数法的浮点数，指数部分的 E 为大写
- `%i` ：整数，基本等同于 `%d` 
- `%f` ：小数（包含 `float` 类型和 `double` 类型）
- `%g` ：6个有效数字的浮点数。整数部分⼀旦超过6位，就会自动转为科学计数法，指数部分的 e为小写
- `%G` ：等同于` %g` ，唯⼀的区别是指数部分的 E 为大写
- `%hd` ：十进制`short int`类型
- `%ho` ：八进制`short int`类型
- `%hx` ：十六进制`short int`类型
- `%hu` ：`unsigned short int`类型
- `%ld` ：十进制`long int`类型
- `%lo` ：八进制`long int`类型
- `%lx` ：十六进制`long int`类型
- `%lu` ：`unsigned long int`类型
- `%lld` ：十进制`long long int`类型
- `%llo `：八进制`long long int`类型
- `%llx` ：十六进制`long long int`类型
- `%llu` ：`unsigned long long int`类型
- `%Le` ：科学计数法表示的`long double`类型浮点数
- `%Lf` ：`long double`类型浮点数
- `%n` ：已输出的字符串数量。该占位符本身不输出，只将值存储在指定变量之中
- `%o` ：八进制整数
- `%p `：指针
- `%s` ：字符串
- `%u` ：无符号整数（`unsigned int`）
- `%x` ：十六进制整数
- `%zd` ： `size_t` 类型
- `%%` ：输出⼀个百分号

### `printf`输出格式

#### 限定宽度

`printf`允许限定占位符的最小宽度

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    //对于整数
    printf("%5d\n", 123);//限定打印字符为5个宽度，输出为"  123"
    printf("%-5d\n", 123);//限定打印字符为5个宽度，但是会左对齐，输出为"123  "
    printf("%5d\n", 12345);//若输出的数据刚好五个字符则不会做任何改变
    printf("%5d\n", 123456);//若输出的数据超出5个字符则会按照有多少打多少
    //对于小数，计算宽度时会计算小数点，并且小数点后默认打印6位
    printf("%12f\n", 123.45);//输出为"  123.450000"
    printf("%-12f\n", 123.45);//输出为"123.450000  "
    printf("%5f\n", 123.45);//若输出的数据超出5个字符则会按照有多少打多少
    printf("%10f\n", 123.45);//若输出的数据刚刚好等于指定宽度，则不做任何改变

    return 0;
}
输出结果：
  123
123
12345
123456
  123.450000
123.450000
123.450000
123.450000
```

#### 显示数值正负号

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    printf("%+d\n", 123);//对于正数，默认不显示正号，若需要显示则在%后加+
    //对于负数，默认显示负号，所以%+d与%d效果相同
    printf("%+d\n", -123);
    printf("%d\n", -123);
    
    return 0;
{
输出结果：
+123
-123
-123
```

#### 限定小数位数

```C
//由于小数点后面默认6位，所以可以通过限定小数位数限制输出小数位数
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    printf("%.2f\n", 123.45);
    printf("%.1f\n", 123.45);//注意，小数点后有两位数值，若指定小数位数为1位会进行四舍五入
    printf("%d\n", (int)3.65);//但是强制类型转换不会进行四舍五入
    //限定小数位数和限定宽度同时使用
    printf("%8.2f\n", 123.45);//输出为"  123.45"

    return 0;
}
输出结果：
123.45
123.5
3
  123.45
```

最小宽度和小数位数可以用`*`代替，通过参数传入

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    printf("%*.*f\n", 9, 2, 123.456);//输出为"   123.46"
    //相当于printf("%9.2f", 123.456);    
    
    return 0;
}
```

#### 输出部分字符串

`%s` 占位符用来输出字符串，默认是全部输出。如果只想输出开头的部分，可以用 `%.[m]s` 指定输出的长度，其中 `[m] `代表⼀个数字，表示所要输出的长度

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    printf("%s\n", "hello world");//默认全部输出
    printf("%.7s\n", "hello world");//输出前七个字符

    return 0;
}
输出结果：
hello world
hello w
```

#### 为输出数值填充前导0

printf函数中可以使用`%0`格式控制符，输出数值时，当输出的数值位数小于指定的位数时，将在左侧不使用的空位置自动填0

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    printf("%02d\n", 1);
    printf("%04d\n", 22);

    return 0;
}
输出结果：
01
0022
```

## `scanf`函数

### 基本用法

`scanf`函数用于读取用户的输入

当用户按下`Enter`键后，`scanf`会处理用户的输入，并将其存入变量中

`scanf`定义在头文件`stdio.h`中

```C
scanf("%d", &a);//等待用户输入一个值并存储到变量a所在地址处的空间中
```

在`scanf`中，变量前面需要加`&`（取地址符），指针变量（例如字符串变量）不需要，因为`scanf` 传递的不是值，而是地址，即将变量` i` 的地址指向用户输入的值

`scanf`函数可以同时处理多个输入

```C
scanf("%d%d%f%f", &i, &j, &x, &y);
```

`scanf` 处理数值占位符时，会自动过滤空白字符，包括空格、制表符、换行符等

例如输入如下数据：

```C
1
-20
3.4
-4.0e3
```

故，上面的处理多个输入的实例代码中，用户分成四行输入，得到的结果与一行输入是完全⼀样的。每次按下`Enter`键以后，`scanf` 就会开始解读，如果第一行匹配第一个占位符，那么下次按下`Enter`，就会从第二个占位符开始解读

`scanf`处理用户输入的原理是，用户的输入先放入缓存，等到按下`Enter`键后，按照占位符对缓存

进行解读。解读用户输入时，会从上⼀次解读遗留的第⼀个字符开始，直到读完缓存，或者遇到第⼀个不符合条件的字符为止

代码实例：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int x;
    float y;//若是double类型的小数，需要用lf

    // ⽤⼾输⼊ "    -13.45e12# 0" 
    scanf("%d", &x);//首先scanf会忽略起始的空格，又由于.不是整数的有效字符，scanf会在小数点处停止读取
    printf("%d\n", x);//输出-13
    scanf("%f", &y);//由于上一次输入缓冲区中余下了.45e12# 0，故本次读取将继续读取后面的内容，由于.45e12相当于小数点后12位，而由于#不属于浮点数的有效字符，此时scanf会停止读取
    printf("%f\n", y);

    return 0;
}
输出结果：
-13
449999994880.000000
```

### `scanf`的返回值

`scanf`的返回值是一个整数，表示成功读取的变量个数

如果没有读取任何项，或者匹配失败，则返回 0 。如果在成功读取任何数据之前，发生了读取错误或

者遇到读取到文件结尾，则返回常量`EOF`

代码实例：

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int a = 0;
    int b = 0;
    float f = 0.0f;
    int r = scanf("%d %d %f", &a, &b, &f);//输入过程中需要保证与占位符的格式一致
    printf("a=%d b=%d f=%f\n", a, b, f);
    printf("r = %d\n", r);
    
    return 0;
}
输入：
2 3 1.0
输出结果：
2 3 1.0
a=2 b=3 f=1.000000
r = 3
```

### 占位符

- `%c` ：字符
- `%d `：整数
- `%f` ： `float` 类型浮点数
- `%lf` ：`double` 类型浮点数
- `%Lf` ：`long double` 类型浮点数
- `%s` ：字符串
- `%[]`：**针对字符串输入**，在方括号中指定⼀组匹配的字符（例如` %[0-9]` ），遇到不在集合之中的字符，匹配将会停止，读取第一个不在集合之中的字符之前的有效字符

```C
#include <stdio.h>

int main() {
    char str[100];// 字符串数组
    printf("请输入一串数字：\n");
    scanf("%[0-9]", str);
    printf("你输入的数字是：%s\n", str);
    return 0;
}
输入：
52496554876465678*46
输出结果：
你输入的数字是：52496554876465678
```

!!! note

    除了 `%c` 以外，都会自动忽略起首的空白字符。 `%c` 不忽略空白字符，总是返回当前第⼀个字符，无论该字符是否为空格

    如果要强制跳过字符前的空白字符，可以写成 `scanf(" %c", &ch)` ，即 `%c` 前加上⼀个空格，表示跳过零个或多个空白字符（可以用来处理多次连续读取时上一次输入中的空白字符被读入），对于`%s`也是同样的效果

对于占位符`%s`，规则是从当前第⼀个非空白字符开始读起，直到遇到**空白字符（即空格、换行符、制表符等）为止**。因为 `%s` 不会包含空白字符，所以无法用来读取多个单词，**如果需要读取多个字符串，可以使用多个`%s`**。另外， `scanf()` 遇到 `%s` 占位符，会在字符串变量末尾存储⼀个空字符 `\0` 

`scanf()` 将字符串读入**字符数组**时，**不会检测字符串是否超过了数组长度**。所以，储存字符串时，对于可能存在数组的输入越界问题：使用 `%s` 占位符时，可以指定读⼊字符串的最大长度，即写成 `%ms` ，其中的 `m` 是⼀个整数，例如`scanf("%10s", name)`，表示读取字符串的最大长度，后面的字符将被丢弃。

代码实例：

```C
#include <stdio.h>
int main()
{
    char name[11];
    scanf("%10s", name);//数组是11个元素，由于为了要保存\0，故限制用户输入10个字符
    // 对于字符数组也可以加上&
    // scanf("%10s", &name);
    
    return 0;
}
```

### 赋值忽略符

当用户的输入可能不符合预定的格式。

```C
#include <stdio.h>
int main()
{
    int year = 0;
    int month = 0;
    int day = 0;
    scanf("%d-%d-%d", &year, &month, &day);//固定格式为xx-xx-xx，一旦用户输入xx/xx/xx等不符合固定格式的时候，scanf会解析失败
    printf("%d %d %d\n", year, month, day);
    return 0;
}
```

此时使用赋值忽略符可以解决这个问题

只要把 `*` 加在任何占位符的百分号后面，该占位符就不会返回值，解析后将被丢弃

```C
#include <stdio.h>
int main()
{
    int year = 0;
    int month = 0;
    int day = 0;
    scanf("%d%*c%d%*c%d", &year, &month, &day);//%*c就是在占位符的百分号后⾯，加入了赋值忽略符*，表示这个占位符没有对应的变量，解读后不必返回
    return 0;
}
```

### 指定输入域宽

在`scanf`函数输入中，使用`%m`格式控制指定输入域宽，输入数据域宽（列数），按此宽度截取所需数据

```C
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

int main()
{
    int year = 0;
    int month = 0;
    int date = 0;
    int temp = 0;//检查缓冲区剩余的内容
    scanf("%4d%2d%2d", &year, &month, &date);
    printf("year=%d\nmonth=%2d\ndate=%2d\n", year, month, date);
    scanf("%d", &temp);
    printf("缓冲区剩余的数值为：%d", temp);
    return 0;
}

输出结果：
202301312022
year=2023
month= 1
date=31
缓冲区剩余的数值为：2022
```