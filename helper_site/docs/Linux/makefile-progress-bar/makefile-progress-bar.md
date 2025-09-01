<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Linux下的Makefile与进度条程序

## `Makefile`与`make`

### `Makefile`与`make`介绍

在Linux中，`Makefile`是一个文件，`make`是一个指令，当使用`make`指令时，该指令会在当前目录下找`Makefile`文件从而执行内部的内容

### 创建第一个`Makefile`并使用`make`

首先，在当前目录下创建一个`Makefile`文件（也可以写成`makefile`），例如：

<img src="5. Linux下的Makefile与进度条程序.assets\image.png">

接下来在同级目录下创建一个`code.c`文件

使用vim编辑器输入下面的内容：

```C
#include <stdio.h>

int main()
{
    printf("hello linux\n");
    return 0;
}
```

保存`code.c`文件后退出当前vim，使用vim打开`Makefile`文件，输入下面的内容：

```makefile
code:code.c
    gcc -o code code.c
.PHONY:clean
clean:
    rm -rf code
```

!!! note
    需要注意，`gcc -o code code.c`和`rm -rf code`前方是一个Tab键的大小，而不是4个或者8个空格

保存`Makefile`文件后退出当前vim，在当前目录下输入`make`指令即可在当前目录下创建`code.c`对应的可执行文件（具有可执行权限并且文件本身可执行）`code`，例如下图：

<img src="5. Linux下的Makefile与进度条程序.assets\image1.png">

通过常规方式运行该可执行文件`./code`即可看到打印输出的内容：

<img src="5. Linux下的Makefile与进度条程序.assets\image2.png">

接着使用`make clean`指令清理刚才生成的可执行文件`code`：

<img src="5. Linux下的Makefile与进度条程序.assets\image3.png">

### `Makefile`文件基本格式介绍

以前面例子中的`Makefile`为例：

```Makefile
code:code.c
    gcc -o code code.c
.PHONY:clean
clean:
    rm -rf code
```

- 第一行中的`code:code.c`代表依赖关系，`code`表示目标文件，`code.c`表示依赖文件列表中的文件，第二行的`gcc -o code code.c`代表依赖方法（指令）
- 第三行中的`.PHONY`表示生成一个伪目标，`clean`表示伪目标的名字（可以类比变量名）
- 第四行及第五行与第一行及第二行含义一致，表示依赖关系和依赖方法，而因为`clean`没有需要依赖的文件，所以`clean:`后没有任何依赖文件列表文件

<div style="border-bottom:2px solid #cdcdcd;"></div>

依赖关系：表示两个文件之间构成的一定关系，比如父子关系

依赖方法：通过依赖方法可以执行的对应的指令

依赖文件列表：`code.c`所处的位置即为依赖文件列表，为了生成目标文件`code`而需要的文件称为依赖文件，依赖文件列表可以含有不止一个文件

!!! note
    注意：理论上来说，依赖文件列表中的`code.c`在当前情况下可以不写，但是如果不写，在第一次执行`make`指令后，不论之后`code.c`是否修改，再执行`make`指令都无法执行对应的依赖方法，因为`code`文件已经存在，所以为了保证可以修改，需要加上`code.c`

从上面的运行结果可以看出，每一次执行make时都会在控制台回显出对应的依赖方法，如果将编译指令改为`echo "测试"`，则效果如下：

<img src="5. Linux下的Makefile与进度条程序.assets\image4.png">

可以看到先回显了对应的依赖方法，再执行依赖方法，如果不希望出现这种情况，可以在执行的指令前加上`@`使指令不再回显，所以上面的`Makefile`可以修改为：

```Makefile
code:code.c
    @echo "测试"
```

运行结果如下：

<img src="5. Linux下的Makefile与进度条程序.assets\image5.png">

所以原始的`Makefile`可以修改为：

```Makefile
code:code.c
    @echo "Start Compiling..."
    @gcc -o code code.c
    @echo "End Compiling..."
.PHONY:clean
clean:
    @echo "Cleaning code..."
    @rm -rf code
    @echo "End Cleaning..."
```

!!! note
    一个依赖集中可以有多个依赖方法

此时正常运行结果如下：

<img src="5. Linux下的Makefile与进度条程序.assets\image6.png">

如果代码出现错误，则`gcc`会中断编译，所以此时运行结果如下：

<img src="5. Linux下的Makefile与进度条程序.assets\image7.png">

<div style="border-bottom:2px solid #cdcdcd;"></div>

使用`.PHONY`可以生成一个指定名字的伪目标，伪目标的作用是：清除依赖方法执行时进行的文件时间对比，下面是具体介绍：

首先，在Linux中可以使用`stat+文件名`查看文件当前的属性，对于`code.c`有：

<img src="5. Linux下的Makefile与进度条程序.assets\image8.png">

执行结果中，主要关注三个部分：`Access`、`Modify`和`Change`，这三个部分分别表示文件最近一次的访问时间、文件内容被修改的时间和文件属性被修改的时间

- `Access`时间：一般不是特别精确，因为如果一个文件访问一次就需要更新一次访问时间，那么对于多个文件来说，这种操作的消耗对于CPU来说是很大的
- `Modify`时间：`Modify`时间只表示文件内容被修改的时间，如果文件属性时间修改，则不影响`Modify`时间，但是需要注意，`Modify`时间一旦改变一般伴随着`Change`时间改变，因为修改文件内容有时会影响到文件的相关属性（例如文件大小等）
- `Change`时间：`Change`时间只表示文件属性被修改的时间，修改文件属性时间不会影响`Modify`时间

接着，观察对于没有添加伪目标的`Makefile`第一部分依赖集，如果`code`文件已经存在，再一次进行`make`的效果：

```Makefile
code:code.c
    @echo "Start Compiling..."
    @gcc -o code code.c
    @echo "End Compiling..."
```

<img src="5. Linux下的Makefile与进度条程序.assets\image9.png">

如果此时对`code.c`文件进行修改，那么执行结果会有所不同：

<img src="5. Linux下的Makefile与进度条程序.assets\image10.png">

那么指令是如何知道文件是否被修改呢？就是通过前面提到的`Modify`时间和`Change`时间，过程如下图所示：

<img src="5. Linux下的Makefile与进度条程序.assets\image11.png">

因为`code.c`创建的时间早于`code.c`编译的时间，所以开始时不存在`code`文件，所以第一次执行`make`指令时正常执行。

当`code.c`文件未修改时，第二次执行`make`指令会发现`code.c`的`Modify`时间和`Change`时间依旧在`make`之前，因为第一次已经满足了`code.c`的两个时间在`code`文件的两个时间之前，所以`gcc`就不会再进行一次编译。

当修改`code.c`文件后，`code.c`的`Modify`时间和`Change`时间改变，导致`code.c`的两个时间在`code`文件的两个时间之后，此时`gcc`就可以正常执行，从而`make`指令不受影响

而如果再`Makefile`中为这一部分添加一个伪目标，则可以清除指令中文件时间的对比过程：

```Makefile
.PHONY:code
code:code.c
    @echo "Start Compiling..."
    @gcc -o code code.c
    @echo "End Compiling..."
```

此时无论执行多少次`make`指令，都不会出现`make`指令中`gcc`因为文件时间对比而导致执行结果不同：

<img src="5. Linux下的Makefile与进度条程序.assets\image12.png">

!!! note
    `make`指令虽然结果完全相同，但是不代表依赖方法没有执行，即文件确实每一次都重新编译

<div style="border-bottom:2px solid #cdcdcd;"></div>

执行完编译部分的`make`指令，想要执行删除`code`文件对应的`make`指令需要在`make`后加上`clean`，这个`clean`代表伪目标名，之所以前面直接使用`make`就可以执行编译指令，是因为`make`指令在读取`Makefile`文件时是从上至下顺序查找，而直接使用`make`，就会执行第一个依赖集对应的依赖方法，执行完毕后就不会再继续往下读；而对于删除`code`文件的指令来说，其所在位置时`Makefile`中的第二个依赖集，所以需要告诉`make`指令找哪一部分

所以，此处可以看出`.PHONY`的第二个作用就是声明一个伪目标，通过该伪目标帮助`make`指令快速定位需要执行的依赖集

如果细心可以发现，对于`clean`依赖集来说，不论是否有`.PHONY`都可以无限制执行`rm -rf`依赖方法，所以可以推断出`rm -rf`指令本身不会考虑文件的时间属性，但是为什么此处还需要加`.PHONY`？一方面是为了声明伪目标，另一方面是为了当前依赖集中的其他指令会有时间对比

### `Makefile`依赖方法执行过程

前面学习到，当执行gcc -o code code.c实际上是分成了四步，即：

1. `code.c`文件编译生成`code.i`文件
2. `code.i`文件编译生成`code.s`文件
3. `code.s`文件编译生成`code.o`文件
4. `code.o`文件编译生成`code`可执行文件

将对应的指令写入`Makefile`中，代码如下：

```Makefile
code:code.o
    gcc -o code code.o
code.o:code.s
    gcc -c code.s -o code.o
code.s:code.i
    gcc -S code.i -o code.s
code.i:code.c
    gcc -E code.c -o code.i

.PHONY:clean
clean:
    @rm -rf code
```

根据`make`从上至下的运行顺序，首先执行`gcc -o code code.o`，但是，因为code.o不存在，并且`code.o`文件依赖于`code.s`文件，所以继续执行`code.o:code.s`对应的依赖方法，以此类推直到最后一条依赖方法`gcc -E code.c -o code.i`执行向上返回执行前面未执行的依赖方法。整个过程可以理解为在一个栈中操作：

!!! note
    假设此处执行的依赖方法同样进栈

<img src="5. Linux下的Makefile与进度条程序.assets\image13.png">

所以执行的结果如下图所示：

<img src="5. Linux下的Makefile与进度条程序.assets\image14.png">

实际上，在真正开发中，只需要用到两个部分，如下：

```Makefile
code:code.o
    gcc -o code code.o
code.o:code.c
    gcc -c code.c -o code.o
```

此时运行结果如下：

<img src="5. Linux下的Makefile与进度条程序.assets\image15.png">

### `Makefile`通用写法

在前面的Makefile中，每一个依赖方法都需要在前面的依赖关系部分的文件重新写一遍，为了简化过程，可以使用下面的写法：

```Makefile
TARGET=code
SRC=code.o

$(TARGET):$(SRC)
    $(CC) -o $@ $<
%.o:%.c
    $(CC) -c $< -o $@

.PHONY:clean
clean:
    @rm -rf $(TARGET) $(SRC)
```

上面的代码中，首先创建了两个变量分别代表生成的目标文件`code`以及第一个依赖集中的依赖文件列表中的文件，在依赖方法中使用了两个自动变量（一般建议大写），分别是`$@`和`$<`

在`Makefile`中，`$@`表示生成的目标文件，`$<`表示从依赖文件列表中取出一个文件，对应的还有`$^`表示依赖文件列表中的所有文件。如果想表示当前目录下的所有相同后缀的文件，可以使用`%`通配符，例如上面的`Makefile`中使用`%.c`代表匹配当前目录下所有后缀为`.c`的文件

而对于`gcc`来说，在`Makefile`中可以使用内置变量`CC`（表示C编译器的名字）代替

如果涉及到多个文件编译，则在`SRC`和`%.c`处使用空格分隔每一个文件

但是，上面的Makefile并没有完全实现通用性，主要的问题还是「每一次创建新的文件就要修改`Makefile`文件」，如果文件比较多一个一个写也不利于添加，所以考虑结合变量以及指令让`Makefile`批量添加文件

在Makefile中，可以使用shell命令，例如可以使用`ls *.c`表示展示当前目录下的`.c`后缀文件，如果结合变量，就是`SRC=$(shell ls *.c)`，这个做法也可以使用Makefile的内置函数`wildcard`实现，所以也可以写成`SRC=$(wildcard *.c)`。在这两个变量创建语法中，`$()`表示调用，也可以写成`${}`，二者没有区别

所以上面的`Makefile`可以修改为：

```makefile
TARGET=code
SRC=$(wildcard *.o)

$(TARGET):$(SRC)
    $(CC) -o $@ $<
%.o:%.c
    $(CC) -c $< -o $@

.PHONY:clean
clean:
    @rm -rf $(TARGET) $(SRC)
```

如果想对文件名中的指定内容进行简单的替换，也可以结合变量和`$()`，语法为：`变量名=$(原始内容=替换内容)`，例如将当前目录下所有的`.c`文件替换为`.o`文件，就可以写成：

```Makefile
SRC=$(wildcard *.c)
# 替换
OBJ=$(SRC:.c=.o)
```

此处用到的`$(SRC:.c=.o)`表示引用或计算变量`SRC`的值，并将结果中的`.c`替换为`.o`

!!! note

    上面的替换规则不会改变原始文件中的内容，也就是说，在上面的例子中，`.c`文件的内容不会真正被替换为使用编译器生成的`.o`的文件内容

<div style="border-bottom:2px solid #cdcdcd;"></div>

至此，一个基本的`Makefile`文件编写语法就这么多，如果需要更详细了解`Makefile`文件，请移步至此->[Makefile教程](https://liaoxuefeng.com/books/makefile/introduction/index.html)

## 进度条程序

### 实现效果

<img src="5. Linux下的Makefile与进度条程序.assets\image.gif">

### 前置知识

#### 回车(`\r`)与换行(`\n`)

在C语言或者其他高级语言中，换行(`\n`)表示回到下一行的开始处，实际上换行的效果并不如此

回车（`\r`）：回到当前光标所在行的开始

换行（`\n`）：前往光标所在行的下一行，但是光标是平行向下移动

<img src="5. Linux下的Makefile与进度条程序.assets\image16.png">

#### 输出缓冲区

观察下面程序运行的结果：

```C
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf("hello linux\n");
    sleep(2);
    return 0;
}
```

如果在Linux终端运行该程序，可以看到程序先打印了`hello linux`，然后等待了2秒才显示`prompt`提示

!!! note
    这里的`sleep`函数不是Windows下的`Sleep`函数，但是效果基本一致

将上面的程序修改为下面的程序，再观察效果：

```C
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf("hello linux");
    sleep(2);
    return 0;
}
```

可以看到程序先等待了2秒，然后才打印`hello linux`

C语言程序默认从上往下顺序执行代码，所以不可能是先执行了`sleep(2)`才执行`printf("hello linux");`，出现这种现象的原因就是因为缓冲区的存在，程序在输出时并不会直接将内容输出到显示器上，而是先输出到输出缓冲区，再通过刷新/结束缓冲区将内容打印到屏幕上，而之所以在有`\n`时会显示再等待就是因为`\n`刷新了缓冲区，导致内容打印到了屏幕上

如果使用将`\n`替换为`\r`则同样会先等待再打印，因为`\r`也不具备刷新缓冲区的效果，如果在当前情况下想刷新缓冲区但又不想使用`\n`，则可以使用`fflush()`函数，传递参数为标准输出`stdout`，代码如下：

```C
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf("hello linux");
    fflush(stdout);
    sleep(2);
    return 0;
}
```

### 实现进度条

#### 基础版本

思路：首先创建3个文件，分别是测试文件`main.c`、头文件`process.h`和实现文件`process.c`。对于进度条，实际上就是先打印原数组内容，再填充数组然后刷新缓冲区，对于百分比，只需要使用循环变量控制即可，对于最右侧闪烁的符号，实际上就是四个动画帧符号，每一次循环加载一个动画帧即可，但是为了循环加载，需要使下标在指定范围内循环，可以考虑循环队列（数组版）下标轮回的思路，所以基本代码如下：

```c
// 实现文件
#include "process.h"

void process()
{
    char bar[NUM] = {0};// 进度条数组
    int count = 0;
    const char *label = "|/-\\";//控制进度条最右侧的闪烁符号（| 顺时针旋转）
    size_t len = strlen(label);
    while(count <= 100) 
    {
        // [%-100s]预留100个字符的位置，每一次打印数组bar中的字符，因为初始化为0，所以数组中全是'\0'，当遇到第一个'\0'就停止，加上-表示从右往左（默认从左往右）打印
        // 使用count控制进度条百分比，百分号%需要额外转义
        // label闪烁符号，使用count%4使下标循环在0-3，思路可以联想循环队列数组版控制下标轮回的方式
        printf("[%-100s][%d%%][%c]\r", bar, count, label[count%len]);
        fflush(stdout); // 先刷新缓冲区，打印出停留在缓冲区的内容
        bar[count++] = STYLE; // 向数组中添加字符
        usleep(20000);// 睡眠时间单位为微秒，1秒 = 6000毫秒=60000000微秒
    }
    printf("\n");
}

// 头文件
#include <stdio.h>
#include <unistd.h>
#include <string.h>

#define NUM 101 // 定义进度条字符的个数
#define STYLE '#' // 定义进度条的样式

void process();

// 测试文件
#include "process.h"

int main()
{
    process();
    return 0;
}
```

对应的`Makefile`如下：

```makefile
TARGET=process
SRC=process.c main.c

$(TARGET):$(SRC)
    $(CC) $^ -o $@

.PHONY:clean
clean:
    rm -rf $(TARGET)
```

#### 改进版本

前面的进度条只是根据100进行依次填充，并没有达到进度条的实用性「根据下载进度更新进度条」，所以可以通过下面的思路对上面的代码进行优化：

首先，定义一个函数`download`，该函数用于定义下载任务

假设需要下载的文件`FILE`大小为2048MB，定义一个带宽`BASE`为1MB，为了模拟出网络波动，可以使用`(rand()%BASE+1)/10`计算出增量，用增量乘以`BASE`计算出下载速度`speed`，但是需要注意，因为`rand()%BASE+1`计算出的值为整数，整数除以10依旧为整数，所以此时值只会为0，为了解决这个问题可以将`rand()%BASE+1`强转为`double`再除法运算

定义两个变量分别为`current`和`total`，分别代表当前下载量和总下载量，因为需要根据百分比显示更新进度条，所以这两个变量需要使用`double`类型定义，百分比计算公式：`current / total * 100`

模拟下载效果可以使用一个循环，循环体内使`current`不断根据速`speed`进行更新，但是这里可能最后计算出的`current`不一定刚好等于`double`，为了防止出现进度条计算出的百分比大于1，可以使用一个矫正「当`current`大于等于`total`时，就将`total`赋值给`current`」，当`current`大于或等于`total`时结束循环

前面的进度条只是单纯根据100进行填充，所以需要使用循环。但是此处更新进度条不可以再使用循环，否则会出现「更新一次`current`，进度条就跑满一次的问题」，正确的思路是「更新一次`current`，进度条更新一次」

进度条的设计分成两部分：

1. 进度条填充图案及动画
2. 进度条加载图案及动画（这个不是必须的，但是如果出现进度条卡住等问题，该图案可以用于辨别是系统卡住还是下载卡住）

对于「进度条填充图案及动画」来说，主要思路是根据下载百分比更新进度条，所以可以使用变量`rate`存储百分比，根据该百分比进行数组图案循环填充，但是需要注意，因为百分比为`double`类型，存在精度损失问题，所以在作为循环结束条件比较运算符的右操作数时需要强转为`int`，同样的思路打印进度条填充图案及显示动画即可

对于「进度条加载图案及动画」来说，这里使用`.`作为加载图案，重点考虑如何实现依次打印「.」「..」「...」「....」「.....」「......」并循环往复。每一次调用进度条可以考虑更新一次符号，和填充图案类似，但是需要每一次更新指定数量的`.`，可以定义一个静态变量，每一次调用更新一次，但是必须确保不超过设计的数量，这里假设数量`PNUM`为6，即一共6个`.`，在循环中根据`PNUM`进行循环，如果i小于`num`，就打印`.`（通过`num`控制`.`的个数），否则打印空格进行占位，使用打印进度条的思路打印加载动画即可

最后，可以考虑使用一个`count`变量降低加载动画的速度

示例代码：

```c
// 头文件
#include <unistd.h>
#include <string.h>
#include <time.h>
#include <stdlib.h>

#define NUM 101 // 定义进度条字符的个数
#define STYLE '#' // 定义进度条的样式

#define FILE 2048.0
#define BASE 1
#define LOAD '.'
#define PNUM 6

void process(double current, double total);
void download(pro proc);

// 实现文件
 download()
{
    double speed = BASE * (((double)(rand() % BASE + 1)) / 10);
    double current = 0.0;
    double total = FILE;
    while(current < total) 
    {
        current+=speed;
        if(current >= total) {
            current = total;
        }
        process(current, total);
        usleep(1000);
    }
    printf("\n");
}

// Version 2：根据下载百分比更新进度条
void process(double current, double total)
{
    char bar[NUM] = {0};
    double rate = (current / total) * 100;
    for(int i = 0; i < (int) rate; i++) {
        bar[i] = STYLE;
    }
    
    char points[PNUM+1] = {0};
    static int count = 0; 
    count++;
    if(count >= 100) {
        count = 0;
        static int num = 0;
        num++;
        num %= PNUM;
        for(int i = 0; i < PNUM; i++) {
            if(i < num) {
                points[i] = LOAD; // 根据num填充符号
            } else {
                points[i] = ' '; // 剩余按照空格填充
            }
        }    
    }
    printf("[%-100s][%.1lf%%]%s\r", bar, rate, points);
    fflush(stdout);
}
```

#### 最终版本

为了使下载函数更加具有通用性，可以使用函数指针，将进度条的函数声明使用`typedef`声明为`pro`，使用该函数指针在下载函数形参位置声明一个变量，在下载函数内部使用形参调用对应形参指向的进度条函数，之后如果有多个进度条代码，只要进度条代码的函数声明于形参函数指针执行的函数类型相同，就可以更换为其他的进度条代码执行

```c
//头文件
// ...
typedef void(*pro)(double current, double total);
// ...

void process(double current, double total);
void download(pro proc);

// 实现文件
void download(pro proc)
{
    double speed = BASE * (((double)(rand() % BASE + 1)) / 10);
    double current = 0.0;
    double total = FILE;
    while(current < total) 
    {

        current+=speed;
        if(current >= total) {
            current = total;
        }
        proc(current, total);
        usleep(1000);
    }
    printf("\n");
}

// Version 2：根据下载百分比更新进度条
void process(double current, double total)
{
    char bar[NUM] = {0};
    double rate = (current / total) * 100;
    for(int i = 0; i < (int) rate; i++) {
        bar[i] = STYLE;
    }
    
    char points[PNUM+1] = {0};
    static int count = 0; 
    count++;
    if(count >= 100) {
        count = 0;
        static int num = 0;
        num++;
        num %= PNUM;
        for(int i = 0; i < PNUM; i++) {
            if(i < num) {
                points[i] = LOAD; // 根据num填充符号
            } else {
                points[i] = ' '; // 剩余按照空格填充
            }
        }    
    }
    printf("[%-100s][%.1lf%%]%s\r", bar, rate, points);
    fflush(stdout);
}
```