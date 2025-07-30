# Linux进程切换以及调度算法

## Linux进程切换介绍

前面提到，分时操作系统下，CPU会在多个进程中做高速切换以实现多个进程看似同时执行的，但是问题是为什么CPU可以做到多个进程来回切换而不会影响每一个进程的执行，这就是进程切换需要思考的问题

基本认知：CPU切换进程是根据每一个进程对应的时间片决定切换的时间，一旦时间片到了，CPU就会切换到另一个进程，如此往复。所以，在上面的过程中，就会出现一些进程并没有执行完毕但是CPU进行了切换

## 前置知识

在CPU中，有许多寄存器，每一种寄存器对应着自己的功能：

1. 通用寄存器（General-Purpose Registers）：
    - 这些寄存器可以用于多种用途，如存储中间计算结果、指针或整数数据等
2. 状态寄存器（Status Registers）或标志寄存器（Flag Registers）：
    - 存储条件码或其他状态信息，如零标志、进位标志、溢出标志等，这些标志常用于决定程序分支或中断处理
3. 程序计数器（Program Counter, PC）：
    - 也称为指令指针（Instruction Pointer），它指向当前正在执行或即将执行的指令的位置
4. 指令寄存器（Instruction Register, IR）：
    - 暂存当前正在执行的指令
5. 地址寄存器（Address Registers）：
    - 用于存储内存地址
6. 数据寄存器（Data Registers）：
    - 用于暂存从内存读取的数据或写入内存的数据
7. 段寄存器（Segment Registers）：
    - 在某些架构中用于存储内存段的基址
8. 控制寄存器（Control Registers）：
    - 用于配置处理器的工作模式和其他控制功能
9. 链接寄存器（Link Registers）或返回地址寄存器（Return Address Register）：
    - 用于保存返回地址，通常在函数调用期间使用

例如，下面的图中展示了部分寄存器的作用：

<img src="9. Linux进程切换以及调度算法.assets\image.png">

每一个CPU有自己的一套寄存器，而每一套寄存器并不会在进程切换时保存每一个进程切换前的数据，而正在被调度的进程在CPU寄存器里面的瞬时数据也被称为上下文数据

## 进程切换过程分析

以下面的图为例：

<img src="9. Linux进程切换以及调度算法.assets\image1.png">

当前CPU正在执行一个进程，假设现在继续出现一个新的进程如下，此时状态如下：

<img src="9. Linux进程切换以及调度算法.assets\image2.png">

如果下一刻操作系统切换进程为进程2执行，就会出现下面的情况：

<img src="9. Linux进程切换以及调度算法.assets\image3.png">

进程2因为要执行，导致进程1执行的记录被抹除，如果此时下一次进程1被切换为继续执行就会找不到上一次执行的数据，为了防止出现这种问题，在Linux中，每一个`PCB`结构中会存在一个`TSS`结构，该结构用于存储被切换前的最后一步对应的上下文数据

有了`TSS`结构，就可以实现每一次进程切换时，尽管CPU的寄存器中的数据被下一个寄存器抹除，但是下一次执行之前被切换的进程依旧可以从被切换的那一瞬间对应的数据开始继续执行，整体大致执行思路如下图所示：

<img src="9. Linux进程切换以及调度算法.assets\image4.png">

Linux最初源码中的`TSS`（任务状态段，Task Status Segment）结构：

```c
struct tss_struct {
    long    back_link;    /* 16 high bits zero */
    long    esp0;
    long    ss0;        /* 16 high bits zero */
    long    esp1;
    long    ss1;        /* 16 high bits zero */
    long    esp2;
    long    ss2;        /* 16 high bits zero */
    long    cr3;
    long    eip;
    long    eflags;
    long    eax,ecx,edx,ebx;
    long    esp;
    long    ebp;
    long    esi;
    long    edi;
    long    es;        /* 16 high bits zero */
    long    cs;        /* 16 high bits zero */
    long    ss;        /* 16 high bits zero */
    long    ds;        /* 16 high bits zero */
    long    fs;        /* 16 high bits zero */
    long    gs;        /* 16 high bits zero */
    long    ldt;        /* 16 high bits zero */
    long    trace_bitmap;    /* bits: trace 0, bitmap 16-31 */
    struct i387_struct i387;
};
```

## 调度算法

在Linux中，前面提到了每一个进程`PCB`是用双向链表链接的，但是如果只是使用双向链表结构作为调度队列，那么CPU在每一次调度时都需要从前往后遍历链表，其时间复杂度就是$O(N)$。实际上，在操作系统下，如果一个算法的时间复杂度超过了$O(N)$就已经算效率比较低的，所以为了降低时间复杂度，在调度队列中，除了有双向链表外，还使用一个类似于哈希表的结构，而每一个进程PCB就是哈希桶的节点，哈希表结构示意图如下：

<img src="9. Linux进程切换以及调度算法.assets\image5.png">

当用户创建一个进程后，就会链接到后面40个空间的其中一个空间下面，这里也就解释了为什么前面进程优先级部分`NI`值的区间为[-20, 19]，一共40个可选值，而根据进程优先级的计算公式：`PRI`=初始`PRI`+`NI`，可以得出，进程优先级`PRI`的区间为`[-60, 99]`，所以真实的链接位置下标计算公式可以理解为：进程优先级- 60 + 100

假设现在一个进程的优先级为61，则链接位置下标就是61-60+100=101，示意图如下：

<img src="9. Linux进程切换以及调度算法.assets\image6.png">

对于调度进程来说，如果只有一个调度队列，那么势必会出现优先级高的因为下标较小而一直被先执行，优先级低的可能一直不会被执行，所以为了保证调度尽量公平调度，在Linux底层的运行队列存在着两个调度队列，并且结构相同，对应运行队列中的结构如下：

```c
// task_t
typedef struct task_struct task_t;

// prio_array_t
struct prio_array {
    int nr_active;
    unsigned long bitmap[BITMAP_SIZE];
    struct list_head queue[MAX_PRIO];
};
typedef struct prio_array prio_array_t;
// list_head
struct list_head {
    struct list_head *next, *prev;
};
// BITMAP_SIZE
#define BITMAP_SIZE ((((MAX_PRIO+1+7)/8)+sizeof(long)-1)/sizeof(long))
// MAX_PRIO
#define MAX_USER_RT_PRIO    100
#define MAX_RT_PRIO        MAX_USER_RT_PRIO

#define MAX_PRIO        (MAX_RT_PRIO + 40)

struct runqueue {
    // ...
    task_t *curr, *idle;
    // ...
    prio_array_t *active, *expired, arrays[2];
    // ...
};
```

在`runqueue`结构中，`curr`即为前面提到过的`head`指针，`idle`即为前面提到的`tail`指针，本次主要关注`prio_array_t`类型的三个变量，分别代表CPU当前的调度队列结构、已经执行的进程所在的队列（过期队列）结构和包含两个调度队列结构的数组

`prio_array_t`本质是`prio_array`结构，以下是该结构的介绍：

`prio_array`结构中存在一个`nr_active`变量，该变量表示当前处于运行状态的进程数量，而`bitmap`是一个用于映射下标的数组，而`queue`即为调度队列，每一个`queue`元素即为一个有前驱指针和后驱指针的节点，`MAX_PRIO`即为140（前面提到的调度队列的大小），而`BITMAP_SIZE`通过计算后得到值为5

!!! note
    `long`类型在C语言中占4个字节，与`int`类型一致

所以上面结构可以转化为下面的直观形式：

```c
struct runqueue {
    // ...
    task_struct *curr, *idle;
    // ...
    prio_array *active, *expired, arrays[2];
    // ...
};

struct prio_array {
    int nr_active;
    unsigned long bitmap[5];
    struct list_head queue[140];
};
```

下面是结构的简化图：

<img src="9. Linux进程切换以及调度算法.assets\image7.png">

- 关于`active`和`expire`指针：

如果只有一个调度队列，那么就会出现因为优先级导致部分进程被调度后依旧会回到当前调度队列的同一位置，下一次CPU再调度，又会继续按照优先级先调度该进程，从而导致其他进程无法被调度，这个现象也被称为进程饥饿（Process Starvation）问题，所以就需要两个调度队列。在CPU调度进程时会调度`active`指针指向的`arrays`结构，此时被调度过的进程会从`active`指向的调度队列转移到`expired`指向的调度队列，如果`active`指针指向的`arrays`结构中的`nr_active`为0，则代表当前调度队列已经没有待调度的进程，此时`expired`指针的`arrays`结构中的`nr_active`一定不为0，所以此时再进行调度只需要交换`active`指针和`expired`指针的值即可实现`active`指针继续指向待被调度的进程所在的`arrays`结构，从而实现了每一个进程都被调度。

CPU调度进程的三种情况：

1. 进程状态为终止状态：直接退出调度队列
2. 到达时间片规定的时间：从`active`转移到`expired`
3. 新进程：默认插入到`expired`，防止因为优先级过高导致其他进程尽管先产生还是后执行的情况

- 关于`bitmap`映射数组下标：

使用`bitmap`目的是为了快速获取到`queue`数组中哪些位置有进程，基本思路如下：

在C语言中，`long`类型占4个字节，所以一共有32个二进制位，而`bitmap`数组的大小为5，所以有$5 \times 32 = 160$个二进制位，足以覆盖140个下标。因为有无进程刚好只有两个状态，所以用二进制表示再适合不过，对应的0在比特位中的位置表示对应的下标没有进程，1表示对应的下标有进程。如果`bitmap`的某一个元素为0，则其32个二进制位每一位一定为0，此时对应的调度队列下标一定没有进程，否则就代表存在进程，对应的判断方式如下：

```c
for(int i = 0; i < 5; i++) {
    if(bitmap[i] == 0) {
        continue;
    }
    else {    
        // ...
    }
}
```

例如，在一个整数的二进制中，获取其中有多少个1的方法（统计一共多少个进程）如下：

```c
while (x) {
    count++;
    x &= (x - 1);
}

// 例如10
// 1010 & 1001 = 1000
// 1000 & 0111 = 0
// 此时count为2
```

上面的方法中，因为每一个进程所在的调度队列遍历是$O(1)$级别，获取每一个进程也是$O(1)$级别，所以在Linux中也被称为内核O(1)调度算法，这个算法是Linux 2.6.x版本中引入的算法，后来引入了 Completely Fair Scheduler (CFS)，它是一种更加公平的调度算法，旨在为所有进程提供公平的 CPU 时间份额。CFS 已经成为现代 Linux 内核默认的调度算法之一，并且在许多方面优于O(1)调度算法

## 补充知识

每一个进程根据自己的状态不同会处于不同的队列，例如处于运行状态队列、处于等待队列等，为了保证可以在多个队列中，在Linux对应的进程PCB中不会直接使用双向链表的前驱指针和后继指针单独作为PCB的成员，而是将一个节点的结构作为成员，源码如下，其中`list_head`即为每一个节点的结构：

```c
struct task_struct {
    // ...
    struct list_head run_list;
    // ...

    struct list_head tasks;
    struct list_head ptrace_children;
    struct list_head ptrace_list;

    // ...

    struct list_head children;    /* list of my children */
    struct list_head sibling;    /* linkage in my parent's children list */
    // ...
};
```

进程PCB在链接时示意图如下：

<img src="9. Linux进程切换以及调度算法.assets\image8.png">

上面的结构不是直接链接下一个节点的地址，而是链接下一个节点的内部成员，这种做法最大的优势就是提供了更好的扩展性：当有多个节点结构时，就可以让当前进程PCB根据节点结构链接到对应的队列中。但是这种做法也有另外的问题：如果想通过当前PCB访问下一个PCB中的其他成员就不可以直接通过访问下一个PCB节点访问

对于上面的问题，提供解决思路：

因为可以访问到下一个PCB的节点结构，所以就获取到了下一个PCB中的节点地址，在C语言结构体中，结构体的成员对应的地址依次增大，对应的偏移量也在增大。利用这个特点，通过偏移量就可以获取到PCB的地址，再通过PCB的地址就可以访问每一个成员

以下面的结构为例：

```c
#include <stdio.h>

struct A {
    int a;
    char b;
    float c;
    double d;
};

int main()
{
    struct A t;
    printf("&t = %p\n", &t);
    printf("a = %p\n", &(t.a));
    printf("b = %p\n", &(t.b));
    printf("c = %p\n", &(t.c));
    printf("d = %p\n", &(t.d));
}

输出结果：
&t = 0x7ffd1ca8bc20
a = 0x7ffd1ca8bc20
b = 0x7ffd1ca8bc24
c = 0x7ffd1ca8bc28
d = 0x7ffd1ca8bc30
```

可以看到结构体起始地址与第一个成员的地址相同，假设现在只知道成员`d`的地址，那么想知道偏移量就必须知道结构体的起始地址，可以假设将0地址作为结构体`A`的起始地址，则有`(struct A*)0`，而通过这个方式获取`d`成员的地址就是`&((struct A*)0->d)`，此时获取到的`d`成员的地址就是`d`相对于地址0的偏移量，有了偏移量，就可以通过实际`d`成员的地址减去偏移量计算出结构体`A`的实际起始地址，获得了结构体的起始地址就可以通过`->`访问到其他成员的地址，上面的过程综合在一起：

```c
((struct A*)(&d - &(((struct A*)0)->d)))->其他成员

// 定义成宏使其更有通用性
#define getStart(type, x) ((type*)(&x - &(((type*)0)->x)))
```

上面的过程中，之所以可以将0地址作为结构体`A`的起始地址，是因为尽管结构体`A`的起始地址不在0位置，但是0位置假设作为`A`类型的一个成员，只要不写入，编译器就不会报错，自然也不会有非法访问的情况

在计算真实地址中的偏移量时，例如前面实际的地址中就是0x7ffd1ca8bc30（`d`的实际地址）-0x7ffd1ca8bc20（结构体A的起始地址）= 0x000000000010（是一个计算出的常量）

现在假设结构体`A`的起始地址为0，而因为0x000000000010是一个不变的量，所以当结构体`A`的起始地址为0时，自然d的地址就变为了0x000000000010。此时000000000010-0x0x000000000000也是`d`在结构体`A`的起始地址为0时的偏移量，简化为0x000000000010

使用`d`的实际地址减去偏移量就是0x7ffd1ca8bc30-0x000000000010=0x7ffd1ca8bc20，获取到的就是结构体`A`的实际起始地址

整个过程中将0地址作为结构体`A`的起始地址就是为了方便计算出偏移量，因为本身并不知道结构体`A`的实际起始地址