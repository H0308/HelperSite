<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Linux信号

## 信号介绍

在前面的[进程状态与进程优先级](https://www.help-doc.top/Linux/signals-os-principles/signals-os-principles.html#runningsleeping)部分提到，如果想要终止一个进程可以使用++ctrl+c++，其本质就是进程收到一个终止的信号

所谓信号，就是一种用户、操作系统或者其他进程向目标进程发送异步事件的一种方式，而其中的异步事件表示不会立即处理的事件，因为进程收到信号之前一直在执行其代码，收到信号的那一刻之前进程并不知道自己会收到信号，当进程收到信号时，就需要做出对应的操作，此时进程可能并不是立即去完成对应的操作

知道了何为信号，接下来就需要了解产生信号的方式

## 信号产生与信号捕捉

在Linux中，产生信号的方式可以有下面五种：

1. 键盘产生，通过触发指定按键发出对应的信号
2. 系统指令，通过系统指令向进程发出信号
3. 系统调用，通过系统调用向进程发送特定的信号
4. 软件条件，当某种软件条件被触发时，进程就会收到对应的信号
5. 程序异常，当程序出现异常时，进程会收到对应的信号

为了验证上面的五种方式，需要先了解一个接口`signal`，该接口可以将信号的默认行为指定为用户自定义的行为，这个动作也被称为信号捕捉：

```c
sighandler_t signal(int signum, sighandler_t handler);
```

该接口的第一个参数表示信号编号，可以通过`kill -l`指令查看，其中前31个信号是用户可以指定的信号，如下图所示：

<img src="18. Linux信号与操作系统原理.assets/image-20250117174042205.png" alt="image-20250117174042205" />

第二个参数表示自定义的行为，其中`sighandler_t`是一个函数指针，定义如下：

```c
// 返回值为void，参数为int
typedef void (*sighandler_t)(int);
```

该接口如果存在自定义的行为函数，就会返回该函数，否则返回`SIG_DFL`（表示信号默认行为）或者`SIG_IGN`（表示信号忽略行为）

其中，`SIG_DFL`和`SIG_IGN`为预定的宏，分别为0和1：

```c
#define	SIG_DFL	 ((__sighandler_t)  0)	/* Default action.  */
#define	SIG_IGN	 ((__sighandler_t)  1)	/* Ignore signal.  */
```

其中的`__sighandler_t`就是`sighandler_t`类型：

```c
typedef void (*__sighandler_t) (int);
```

### 键盘产生

接下来以下面的代码进行演示：

```c++
#include <iostream>
#include <unistd.h>

int main()
{
    while (true)
    {
        std::cout << "Hello, World!" << std::endl;
        sleep(1);
    }

    return 0;
}
```

如果程序正常运行时会不断打印，但是如果按下键盘的++ctrl+c++就会终止进程，实际上这个过程中是进程收到了2号信号，为了验证就可以将2号信号的默认行为改为自定义行为，自定义行为的函数如下：

```c++
void handler(int signal)
{
    std::cout << "Signal: " << signal << "号信号的默认行为被修改为自定义行为" << std::endl;
}
```

上面的函数中，参数表示收到的信号编号

在主程序中使用`siganl`将默认行为修改为自定义行为：

```c++
// ...
#include <signal.h>

int main()
{
    // 将信号2的默认行为修改为自定义行为
    signal(2, handler);
    // ...
}
```

需要注意，`signal`接口不要放在循环里，因为这个接口只需要在一开始将2号信号的默认行为修改为自定义行为即可，只要修改过就会生效，也就是说，**一切信号的行为在信号产生前就需要准备好**

此时再运行程序并按下++ctrl+c++就会看到对应的「2号信号的默认行为被修改为自定义行为」语句被打印，如下图所示：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-17_18-02-58.png">

由于更改了2号信号的默认行为，所以此时就无法使用++ctrl+c++终止进程，但是可以使用++ctrl+backslash++终止

上面的过程就演示了如何使用键盘向一个进程发送信号，但是实际上，并不是键盘直接向进程发送信号，而是键盘触发事件被操作系统捕捉，再有操作系统识别到对应按键对应的事件转换为信号发送给对应的进程

所以现在的问题就转化为：操作系统为什么知道键盘触发了事件，操作系统不会一直等待键盘触发事件，而是由CPU的控制器收到了键盘的数据并触发了中断，再通知操作系统需要从键盘上读取对应的数据，通过这个操作就可以做到硬件和操作系统并行执行，操作系统也不需要一直等待某一个硬件，其中此处提到的中断就是硬件中断，其是计算机体系结构中的一个重要概念，它允许外部设备或内部硬件组件在CPU执行程序的过程中插入一个信号，请求CPU暂停当前任务并转向处理特定的事件

对比硬件中断和信号可以发现，信号本质也可以算是一种中断，只不过信号是在软件层面上模拟硬件中断，二者的共同点都是通过指定的方式告诉某一方可以进行某行为

从上面的过程中，了解了进程收到信号执行对应的行为，其中的默认行为可以通过`signal`接口进行修改，但是如何知道一个信号的默认行为，对于这个问题，可以使用下面的指令查看信号的默认行为以及事件：

```shell
man 7 signal
```

在终端中输入上面的指令即可看到下面这张表：

<img src="18. Linux信号与操作系统原理.assets\screenshot-20250117-181757.png">

其中2号信号对应的字段是`SIGINT`，对应的事件就是`Interrupt from keyboard`，表示键盘中断。同样，++ctrl+backslash++表示3号信号，对应的字段为`SIGQUIT`，事件就是`Quit from keyboard`，表示键盘退出

### 系统指令

在Linux中，如果想向一个进程发送信号，可以使用`kill`指令，实际上在前面[Linux进程基础](https://www.help-doc.top/Linux/process-basic/process-basic.html#_2)部分已经提到过该指令，其中`-9`就表示信号编号为9号，对应的行为查表就是`SIGKILL`，对应的事件就是`Kill signal`

需要注意的是，9号信号的默认行为是无法被自定义行为给替换的，也就是说，无法使用`signal`接口将9号信号的默认行为替换为自定义行为：

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>

void handler(int signal)
{
    std::cout << "Signal: " << signal << "号信号的默认行为被修改为自定义行为" << std::endl;
}

int main()
{
    // 将信号9的默认行为修改为自定义行为
    signal(9, handler);

    while (true)
    {
        std::cout << "Hello, World!" << std::endl;
        sleep(1);
    }

    return 0;
}
```

运行上面的程序，并向对应的进程发送9号信号可以看到并没有打印自定义行为中的语句，并且进程被终止：

<img src="18. Linux信号与操作系统原理.assets/image-20250117183403208.png">

### 系统调用

在Linux中，如果想通过代码的方式向进程发送信号就可以通过发送信号相关的系统调用，下面是常见的系统调用接口用于向进程发送信号：

1. `kill`：`int kill(pid_t pid, int sig);`，该接口作用是向指定的进程发送指定的信号，其中第一个参数就是进程的`pid`，通过`getpid`接口获取，第二个参数表示信号编号。如果发送成功，接口返回0，否则返回-1
2. `raise`：`int raise(int sig);`，该接口作用是向当前调用该接口的进程发送指定的信号，其中的参数表示信号编号。如果发送成功，接口返回0，否则返回非0
3. `abort`：`void abort(void);`，该接口作用是终止当前调用该接口的进程，这个接口比较固定，因为他固定了是当前进程并且固定了信号是`SIGABRT`，即6号信号
4. `alarm`：`unsigned int alarm(unsigned int seconds);`，该接口作用是创建一个定时器，当定时器设定的时间截止时，会向当前进程发送固定信号`SIGALRM`，其中的参数表示定时器的秒数。该接口的返回值表示定时器剩余秒数，如果定时器的时间自动截止时，则该接口返回0，否则返回剩余秒数
5. `pause`：`int pause(void)`，该接口作用是让进程睡眠直到被某个信号唤醒

下面是上面提到的接口的基本使用：

对于`kill`来说，可以设计需求：当进程中的计数器加到5时，向当前进程发送2号信号，并且2号信号的默认行为修改为自定义行为，当计数器加到10时，向当前进程发送3号信号结束进程，代码如下：

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>

void handler(int signal)
{
    std::cout << "Signal: " << signal << "号信号的默认行为被修改为自定义行为" << std::endl;
}

int main()
{
    signal(2, handler);

    int count = 0;

    while (true)
    {
        // 当count为5时，向当前进程发送2号信号
        if (count == 5)
            kill(getpid(), 2);

        // 当count为10时，向当前进程发送3号信号
        if (count == 10)
            kill(getpid(), 3);

        std::cout << "Hello, World!" << std::endl;

        count++;
        sleep(1);
    }

    return 0;
}
```

运行结果如下：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-18_17-34-25.png">

因为`raise`接口的作用是向当前进程发送指定的信号，所以其作用等同于`kill(getpid(), signal)`，所以上面的代码中`kill`的部分可以分别替换为：

```c++
if (count == 5)
    raise(2);

if (count == 10)
    raise(3);
```

6号信号的作用比较固定，对于`SIGABRT`信号的效果实际上类似于`exit`，但是`abort`接口更确切得说是非正常终止进程，也就是说进程退出码不为0，例如下面的的代码：

```c
#include <iostream>
#include <unistd.h>
#include <signal.h>

int main()
{
    abort();

    return 0;
}
```

运行该程序，程序结束时查看其退出码如下图：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-18_17-42-24.png">

最后是关于`alarm`接口，因为`alarm`表示设计定时器，所以可以设计需求：设计一个5秒的定时器，当定时器时间到时触发对应的自定义行为

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>

void handler(int signal)
{
    std::cout << "Signal: " << signal << "号信号的默认行为被修改为自定义行为" << std::endl;
}

int main()
{
    signal(SIGALRM, handler);

    alarm(5);

    int count = 0;
    while (true)
    {
        if (count == 10)
            kill(getpid(), 9);
        std::cout << "Hello, World!" << std::endl;

        count++;
        sleep(1);
    }

    return 0;
```

运行上面的程序即可看到下面的结果：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-18_17-57-04.png">

实际上操作系统就是一个定时器，如果某一个定时器设定的时间截止时，就触发对应的任务，此处可以用`alarm`进行模拟：

设定一个1秒的定时器，执行下面的三种任务

1. 内核刷新
2. 进程根据时间片切换
3. 清理操作系统内部的内存碎片

每一种任务执行完后因为定时器会被清理，所以需要重新设置定时器，示例代码如下：

```c
#include <iostream>
#include <unistd.h>
#include <vector> // 记录任务
#include <functional>
#include <signal.h>

using task = std::function<void()>;

std::vector<task> tasks{
    []()
    { std::cout << "内核刷新任务" << std::endl; },
    []()
    { std::cout << "进程根据时间片切换" << std::endl; },
    []()
    { std::cout << "清理操作系统内部的内存碎片" << std::endl; },
};

void handler(int signal)
{
    for (auto &t : tasks)
        t();

    // 重新设置定时器
    alarm(1);
}

int main()
{
    // 1秒定时器
    alarm(1);

    signal(SIGALRM, handler);

    while (true)
    {
        // 当有信号唤醒时才执行任务
        pause();
        std::cout << "任务执行完成" << std::endl;
    }

    return 0;
}
```

运行结果如下：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-18_18-17-17.png">

另外，进行一个拓展，在Linux下如果想创建一个更加细致的定时器，则可以使用`timerfd_create`接口创建一个基于文件描述符的定时器，该接口的原型如下：

```c
int timerfd_create(int clockid, int flags);
```

该接口的第一个参数表示时钟类型，常见的设置有两种：

1. `CLOCK_REALTIME`：表示基于系统实时时间的定时器，会受到系统时间调整的影响
2. `CLOCK_MONOTONIC`：单调时钟，从系统启动开始计时，不受系统时间调整影响（推荐）

第二个参数表示控制定时器文件描述符的行为，可以是以下值进行按位或：

1. `TFD_CLOEXEC`：在执行`exec`时自动关闭文件描述符
2. `TFD_NONBLOCK`：设置文件描述符为非阻塞模式
3. 0：默认行为（阻塞模式，不设置`CLOEXEC`）

对于此处的阻塞模式和非阻塞模式与普通的文件描述符理解是一致的，即`read`函数在从这个文件描述符中读取数据时会阻塞，对应的非阻塞模式就不会阻塞。在Linux下，如果使用`read`函数从定时器文件描述符中读取数据时，读取到的是一个8字节的无符号整数（`uint64_t`类型），这个数值表示**自上次读取以来**定时器过期的次数。例如，如果定时器间隔为3秒，两次读取之间经过了30秒，那么读取到的值就是10

该函数如果创建成功会返回该定时器对应的文件描述符，否则返回-1并设置对应的错误码

创建完对应的定时器文件描述符就需要设置对应的时间，此处就需要使用到`timerfd_settime`接口，该接口的原型如下：

```c
int timerfd_settime(int fd, int flags, const struct itimerspec *new_value, struct itimerspec * old_value);
```

该接口的第一个参数表示定时器文件描述符，第二个参数控制时间模式，它决定了如何解释定时器的触发时间，一共有两种模式：

1. 相对时间模式`flags = 0`：表示从当前时刻开始的延迟时间
2. 绝对时间模式`flags = TFD_TIMER_ABSTIME`：表示具体的时间点

常见情况下使用相对时间模式即可

第三个参数表示定时器的触发间隔时间（新的定时器配置），其中`struct itimerspec`定义如下：

```c
struct itimerspec 
{
    struct timespec it_interval;  // 重复间隔时间
    struct timespec it_value;     // 初始到期时间
};

struct timespec 
{
    time_t tv_sec;   // 秒
    long tv_nsec;    // 纳秒 (0-999,999,999)
};
```

其中`it_value`控制定时器第一次什么时候触发，如果为0，定时器被禁用/停止；`it_interval`控制定时器后续每隔多长时间重复触发，如果为0，定时器只触发一次（一次性定时器）

第四个参数表示上一次的定时器配置，是一个输出型参数，可以传入`NULL`如果不需要获取旧值

该函数如果设置成功返回0，否则返回-1并设置对应的错误码

示例代码：

```cpp
#include <iostream>
#include <unistd.h>
#include <sys/timerfd.h>
#include <cstdint>

using namespace std;

// 设置定时器，每间隔1秒
void per_1_timer(int timer_fd)
{
    // 设置定时器
    struct itimerspec timer;
    // 初始时间
    timer.it_interval.tv_sec = 1;
    timer.it_interval.tv_nsec = 0; // 纳秒为0，防止随机值
    // 间隔时间
    timer.it_value.tv_sec = 1;
    timer.it_value.tv_nsec = 0;

    timerfd_settime(timer_fd, 0, &timer, NULL);

    // 每隔1秒读取
    while (true)
    {
        uint64_t gap = 0;
        read(timer_fd, &gap, 8);
        std::cout << "距离上次读取定时器超时次数：" << gap << std::endl;
    }
}

int main()
{
    // 创建定时器描述符
    int timer_fd = timerfd_create(CLOCK_MONOTONIC, 0);

    per_1_timer(timer_fd);

    return 0;
}
```

### 软件条件

所谓软件条件触发信号，就是当某个软件条件满足时，就向进程发送对应的信号，例如上面系统调用中的`alarm`接口利用的就是软件条件，当定时器设定的时间截止时满足软件条件，此时向进程发送对应的`SIGALRM`信号

因为操作系统底层不止一个定时器，所以操作系统本身也需要对创建的定时器进行管理，如果直接使用链表，那么就会出现每一次都需要遍历一遍定时器链表找出截止的定时器节点执行其中的操作，再对其进行销毁，此时的时间复杂度就会比较高，所以操作系统会考虑使用更优秀的方法来完成这个动作，例如可以考虑使用小堆结构，**注意操作系统底层并不一定使用堆**。除了使用小堆以外，还可以考虑**时间轮**思想，具体见[仿Muduo库的高并发服务器](#)

因为软件条件无法一一列举，所以此处只是介绍进程收到的信号来源可能是软件条件

### 异常

异常是比较常见的进程收到信号的方式，例如除0异常、野指针异常等，在Linux中，除0时进程会收到`SIGFPE`信号从而终止进程，野指针时进程会收到`SIGSEGV`信号从而终止进程，对于这两种异常，下面主要考虑为什么进程会收到这两种异常对应的信号

前面提到，进程收到的信号都是由操作系统发送的，但是操作系统为什么知道哪一个进程出现了何种异常

首先是除0异常，对应的代码如下：

```c
#include <iostream>
#include <unistd.h>
#include <signal.h>

void handler(int signal)
{
    std::cout << "除0异常" << std::endl;
}

int main()
{
    // 将除0异常的默认行为修改为自定义行为
    signal(SIGFPE, handler);
    // 除0异常
    int a = 1;
    a /= 0;

    return 0;
}
```

注意上面的代码没有任何退出进程的接口，例如`exit`接口，运行上面的代码就会发现：终端一直循环打印「除0异常」，根据这个现象，下面的问题就是：

1. 操作系统如何知道当前进程出现了除0异常
2. 为什么程序一直循环打印「除0异常」

对于第一个问题，直观的理解可能认为是操作系统一直在监测当前进程的运行，一旦进程出现异常就向进程发送信号，但是这个理解并不准确，因为如果操作系统管理的进程非常多时，就需要监测非常多的进程，此时操作系统的负载就非常高，另外操作系统除了要监测进程，还需要处理其他的业务逻辑，所以这个理解并不实际。实际上，操作系统并不需要监测任何一个进程，只需要执行当前进程的CPU告诉操作系统，操作系统收到CPU的反馈后就向该进程发送信号即可

对于除0异常来说，在进程的代码被CPU执行时，会有对应的状态寄存器Eflags，其中存在溢出标记位，如果进行了除0，那么此时这个标记位就会由0变为1，当前CPU监测到这一位变为1后，就会出现硬件错误从而提醒操作系统需要将这个进程从运行队列中移除，此时操作系统就会给对应的进程发送信号，这就是为什么「操作系统如何知道当前进程出现了除0异常」

对于第二个问题，因为进程离开运行队列时，只要`task_struct`结构体没有被销毁，那么其中一定就存在着上下文数据，同时也包括Eflags为1的标记，而在上面的代码中将`SIGFPE`信号的默认行为修改为自定义行为，所以上面程序对应的进程并不会被终止，而是回到了等待队列，当进程再次进入就绪队列时就会回到上一次执行的位置，但是因为上一次在计算`a/=0`时出错，所以这行代码并没有执行完毕，再次调度又会执行这一行导致再次出现除0异常，如此往复就会一直循环打印「除0异常」

接着是野指针异常，对应的代码如下：

```c
#include <iostream>
#include <unistd.h>
#include <signal.h>

void handler(int signal)
{
    std::cout << "野指针异常" << std::endl;
}

int main()
{
    // 将野指针异常的默认行为修改为自定义行为
    signal(SIGSEGV, handler);

    int *ptr = nullptr;
    *ptr = 10;

    return 0;
}
```

注意上面的代码没有任何退出进程的接口，例如`exit`接口，运行上面的代码就会发现：终端一直循环打印「野指针异常」，根据这个现象，下面的问题就是：

1. 操作系统如何知道当前进程出现了除0异常
2. 为什么程序一直循环打印「野指针异常」

对于第一个问题，与上面除0异常非常类似，只是CPU并不是通过Eflags标记错误，而是MMU无法在对应页表中查找到有效的物理地址从而引发错误通知操作系统，后面的过程与除0异常一致。对于第二个问题和除0异常一致

## 核心转储

在使用`man 7 signal`查看信号表格时，有一列`Action`，表示信号触发时对应的行为，其中的值有：`Core`、`Term`、`Ign`、`Stop`和`Cont`。对于`Core`和`Term`来说，二者表面上都是结束当前进程，而`Ign`表示进程做出的行为是忽略

本次主要考虑`Core`和`Term`，二者更细致的区别如下：

- `Term`表示正常退出进程，并且不需要进行debug
- `Core`表示核心转储，即当进程退出时，会在进程代码所在的目录下生成一个`core.pid`或者`core`文件，当进程崩溃时，这个文件中会保存在内存中的部分信息，以便后续debug

!!! info "关于`core.pid`或者`core`文件"

    不论是`core.pid`或者`core`文件，二者作用和内容都是一样的，只是文件名不同，在较老内核的操作系统一般使用`core.pid`，较新的操作系统是直接使用`core`，二者的区别就是一个带进程`pid`，一个不带，本质原因就是因为进程`pid`每一次运行都有可能不一样，导致可能多次出错就多次创建这个文件，最后可能这个文件的占用会非常高，所以后续就使用`core`代替，这样就可以做到每次都是覆盖写。但是当代Linux操作系统为了保证系统性能和稳定，一般会关闭核心转储功能

如果想查看当前操作系统是否开启核心转储这个功能，可以使用下面的指令：

```shell
ulimit -a
```

查看`core file size`是否为0，如果为0表示当前操作系统已经关闭当前功能，否则就是表示核心转储文件的大小，如果想要打开这个功能，可以使用下面的命令：

```shell
ulimit -c 文件大小
```

一旦存在核心转储文件，在使用`GDB`调试时就可以使用`core-file 核心转储文件名`快速跳到出现错误的代码

如果子进程出现异常，为了保证可以看到异常位置，在进程的退出信息中的第8位比特位存在一个core dump标志，只要父进程查看这个标记位为1，就说明子进程出现了异常

## 信号保存

前面介绍了进程在收到一个信号时会如何进行处理，但是一个进程收到对应的信号并不会立即做出处理，而是在合适的时机才会去处理，此时就涉及到进程需要保存收到的信号。在信号部分涉及到下面的概念：

1. 信号递达：表示信号的实际处理动作被执行
2. 信号未决：表示信号从产生到信号递达之间的状态
3. 信号阻塞：一个信号处于阻塞时，该信号就会在产生时一直处于未决状态，直到进程解除对指定信号的阻塞才会进行递达动作

在Linux中，一个进程可以选择阻塞某个信号，但是阻塞并不等同于`SIG_IGN`的忽略行为，忽略本质也是信号递达的动作，而阻塞是未递达

一个进程保存自己的数据就是在其对应的`task_struct`中，所以一个进程想保存对应的信号也是在`task_struct`中保存，在其中，有下面的三种结构：

1. 信号`block`表：表示信号阻塞位图
2. 信号`pending`表：表示信号未决位图
3. 信号`handler`数组：表示信号行为数组

注意，前两个都是位图，而只有最后一个是数组，因为信号的有无可以用两种状态：有或者无，所以只需要用二进制的0和1表示即可，所以一个信号是否被阻塞与一个信号是否未决就都可以使用位图

在信号`block`表中，位图的每一位的位置就代表信号的编号，从右向左（不包含最左侧高位）的第一位即为编号为1的信号，在信号`pending`表中也是如此

在Linux内核中，这三张表对应的结构如下：

```c
struct task_struct {
    // ...
	struct sighand_struct *sighand; // handler表

	sigset_t blocked, real_blocked; // block表
	struct sigpending pending; // pending表

    // ...
};

// handler表类型
struct sighand_struct {
	atomic_t		count;
	struct k_sigaction	action[_NSIG];
	spinlock_t		siglock;
};

// pending表类型
struct sigpending {
	struct list_head list;
	sigset_t signal;
};

其中 sigset_t 类型为 unsigned long 类型
```

在内核代码中，`sigset_t`类型的变量称为信号集（注意不是信号量集），对应的阻塞信号集也称为当前进程的信号屏蔽字

根据对应的结构，操作系统也提供了相应的操作接口：

1. `sigprocmask`：用于操作`block`表
2. `sigpending`：用于检测`pending`表
3. `signal`：用于操作`handler`表

除了上面的操作三个表的方式外，还有用于读取和修改前两个位图表中内容的接口：

1. `sigemptyset`：用于将指定表全设置为0
2. `sigfillset`：用于将指定表全设置为1
3. `sigaddset`：用于将指定表的某一个信号对应的标记设为1
4. `sigdelset`：用于将指定表的某一个信号对应的标记设为0
5. `sigismember`：判断某一个信号是否在指定表中为1

下面是所有接口的详细介绍：

**`sigprocmask`**

```c
int sigprocmask(int how, const sigset_t *set, sigset_t * oldset);
```

其中的三个参数分别表示如下：

1. 第一个参数表示操作标记：有三种选择：

    1. `SIG_BLOCK`：相当于`mask = mask | set`，表示将新的`set`与原始的`mask`进行或操作，即添加阻塞标记位
    2. `SIG_UNBLOCK`：相当于`mask = mask & (~set)`，表示根据新的`set`和原始的`mask`进行取反相与，做到解除阻塞标记位
    3. `SIG_SETMASK`：相当于`mask = set`，直接赋值表示将新的`set`覆盖原始的`mask`

2. 第二个参数表示新的`set`表，其为输入型参数
3. 第三个参数表示旧的`set`表，其为输出型参数，当函数用新的`set`表替换旧的`set`表时，会将旧的`set`表存储到该变量中

**`sigpending`**

```c
int sigpending(sigset_t *set);
```

用于查看`pending`表，接口的参数为输出型参数，该接口会将指定的表存储到参数变量中

=== "`sigemptyset`"

    ```c
    int sigemptyset(sigset_t *set);
    ```

=== "`sigfillset`"

    ```c
    int sigfillset(sigset_t *set);
    ```

=== "`sigaddset`"

    ```c
    int sigaddset(sigset_t *set, int signum);
    ```

=== "`sigdelset`"

    ```c
    int sigdelset(sigset_t *set, int signum);
    ```

=== "`sigismember`"

    ```c
    int sigismember(const sigset_t *set, int signum);
    ```

上面的接口中，除了最后一个接口在指定信号存在于指定表中会返回1，不存在返回0，失败返回-1，其他均是成功返回1，失败返回-1

根据上面的接口介绍，可以设计需求：屏蔽2号信号，获取`pending`表并打印该表的内容，接着发送2号信号查看打印结果，一段时间过后取消屏蔽再查看打印结果：

```c
#include <iostream>
#include <unistd.h>
#include <signal.h>

void handler(int sig)
{
    std::cout << "Catch signal " << sig << std::endl;
}

int main()
{
    // 将2号信号的默认行为修改
    signal(SIGINT, handler);

    // 先屏蔽2号信号
    sigset_t set, oldSet;
    sigemptyset(&set);
    sigemptyset(&oldSet);

    sigaddset(&set, 2);

    // 为了只看到2号为1，直接覆盖
    sigprocmask(SIG_SETMASK, &set, &oldSet);

    int count = 0;

    while (true)
    {
        // 打印pending表
        sigset_t pending;

        sigpending(&pending);

        // 逆向打印31位
        for (int i = 31; i >= 1; i--)
        {
            // 判断信号是否存在于pending表中，存在打印1，否则打印0
            if (sigismember(&pending, i))
                std::cout << 1;
            else
                std::cout << 0;
        }

        std::cout << std::endl;

        sleep(1);

        count++;

        // 发送2号信号
        if (count == 5)
            raise(2);

        // 恢复2号信号
        if (count == 10)
        {
            std::cout << "恢复2号信号" << std::endl;
            // 将原来的旧表作为新表恢复
            sigprocmask(SIG_SETMASK, &oldSet, NULL);
        }

        // 发送3号信号退出进程
        if (count == 15)
            raise(3);
    }

    return 0;
}
```

对应的运行结果如下：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-18_22-56-31.png">

因为信号本质是会被操作系统进行保存，所谓的操作系统发送信号实际上就是更改`pending`表中对应位为1，所以操作系统发送信号本质是写入信号

## 信号捕捉与操作系统运行原理

前面已经基本了解了信号对应的处理行为和信号如何在进程中保存，为了更细致地了解信号，接下来需要了解信号是如何被进程捕捉到的

所谓信号捕捉，就是信号的递达时执行，在Linux中，信号捕捉的方式有三种：

1. 默认行为
2. 忽略行为
3. 自定义行为

对于这三种方式，其捕捉方式都是一致的，但是第一种方式和第二种方式的执行方式却有所不同，首先考虑整体的捕捉流程，如下图所示：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-21_19-12-25.png">

针对自定义行为，就会走完上述的5个步骤，但是对于第一种和第二种行为就会直接处理而不需要在执行时回到用户态，在上面的步骤中的第二步中，进程会检查对应的`pending`表和`block`表，确保存在需要递达的信号

简化上面的过程图如下图所示：

<img src="18. Linux信号与操作系统原理.assets\download.png">

在上图中，一共四个交点，代表着四次用户态和内核态的切换，注意，检查`pending`表和`block`表的步骤一定在内核态中，所以其位置一定在用户态和内核态的分界线之下

所以，进程收到信号时并不是立即处理该信号，而是在一个「合适」的时候，这里的「合适」就是在内核态准备切换回用户态之前（即上图中的第二步）

**硬件中断**

在上面讨论信号捕捉时提到了「用户态」和「内核态」，为了更好得理解这两个名词，需要对操作系统运行的原理进行了解

操作系统，作为计算机启动时可以说是第一个启动的软件，其必须要做好管理所有设备的准备，前面提到每一个硬件有数据时就会触发硬件中断通过CPU通知操作系统，但是外设是如何通知CPU的、操作系统又是如何协助CPU处理中断的就是接下来需要考虑的问题

以下图为例：

<img src="18. Linux信号与操作系统原理.assets\download1.png">

当某一个外部设备有数据时，外部设备会向中断控制器发送中断，中断控制器此时就会通知CPU存在外部设备有数据准备进行处理，CPU此时收到中断通知就会向中断控制器获取中断号为后面的中断服务做准备，但是因为CPU在处理中断之前不可能是闲置的，所以在执行中断的流程之前需要先保存当前执行的一些寄存器数据以便执行完中断流程后可以继续当前的任务

在保存好数据后，CPU根据获取到的中断号在操作系统提供的中断向量表中查找相关的中断行为处理方案执行对应的逻辑，等到执行完毕后，CPU会恢复中断前的任务继续执行

在上面整个流程下来，操作系统实际上就是给CPU提供中断向量表，以便CPU知道如何处理对应的中断，所以也可以理解为操作系统实际上就是「躺在」中断向量表上的程序

其中，中断向量表（Interrupt Descriptor Table）就是一个函数指针数组，每一个元素都是函数指针类型指向着对应的用于中断处理的函数，而中断号就是对应函数指针数组的下标

**时钟中断**

上面的过程就是用户操作外部设备，外部设备再给CPU发送中断进而提醒操作系统有对应的数据需要进行处理，但是操作系统本身也需要运行，例如操作系统还需要调度进程，如果只是外部设备有数据时操作系统才进行处理，那么进程就无法实现调度，所以现在就会存在第二个问题，操作系统本身又是如何被控制的，此时就需要一个定期可以触发中断的设备，该设备会在每隔一段时间向CPU发送一次中断，提示操作系统需要进行特定的任务，例如进程调度，这个也就是时钟中断

实现时钟中断同样需要硬件，而这个硬件在当前CPU中是继承在CPU内部的，这个硬件被称为时钟源，有了这个硬件就可以实现每隔一段时间向CPU发送一次中断，根据对应的中断号查找中断向量表执行对应的操作，示意图如下：

<img src="18. Linux信号与操作系统原理.assets\download2.png">

!!! note

    注意，时钟源也属于硬件，所以时钟中断也属于硬件中断

根据上面的原理，现在理解为什么CPU主频越高，性能越好，首先，主频表示CPU时钟源在单位时间内可以向CPU发送的中断次数，如果这个中断次数很多，那么操作系统就会执行很多次对应的任务，例如进程调度，如果进程调度被多次执行，此时就会更加快速得切换进程从而达到更高的操作响应速度

根据这个原理，现在来理解一下什么是时间片切换

实际上，时间片切换可以理解为计数器+时钟源，在进程的`task_struct`中存在一个成员表示一个计数器，这个计数器用于判断进程是否时间片已到，当进程在被调度时就会一直更新这个变量，如果这个变量减到了0，此时就会让进程进入等待队列等待下一次调度，所以所谓的时间片切换，就是利用每一次时钟源触发中断通知操作系统进行进程调度时判断进程的计数器是否为0

上面的提到的时钟中断可以在Linux第一版本的源码中查找到对应的内容：

```c
void main(void)		
{
    // ...
	sched_init();
    // ...
}

void sched_init(void)
{
    // ...
	set_intr_gate(0x20,&timer_interrupt); // 设置时钟中断
    // ...
}

// 其中timer_interrupt对应的是下面的汇编代码，为了简短，只保留调用时钟源的部分：
_timer_interrupt:
    // ...
	call _do_timer		# 'do_timer(long CPL)' does everything from
	// ...

// 进程调度——时间片切换判断
void do_timer(long cpl)
{
	// ...
    // 如果时间片没到，就不调度
	if ((--current->counter)>0) return;
	current->counter=0;

    // ...
    // 否则就调度
	schedule();
}

void schedule(void)
{
    // ...
    // 切换进程
	switch_to(next);
}
```

**死循环与软中断**

有了上面的理解后，既然操作系统需要一直等待CPU收到中断时执行对应的任务，就需要处于循环等待的状态，但是因为操作系统并不能确定CPU何时会处理何种中断，所以就需要循环等待，这也就是操作系统为什么是死循环的原因，对应在Linux第一版源码如下：

```c
void main(void)	
{		
    // ...
    // 操作系统就是一个死循环
	for(;;) pause();
}
```

上面提到的中断是需要硬件进行触发，但是有些行为可能并不需要硬件但是有需要触发中断，例如因为软件原因，对于这种情况就需要使用软中断，利用软中断就可以实现系统调用，CPU也有对应的汇编指令（在之前的操作系统下是int（interrupt） 0x80，在现在的操作系统下是syscall）用于触发中断的逻辑

同样，类似于硬件中断的步骤，在操作系统的中断向量表中根据软中断处理逻辑的中断号找到对应的系统调用函数，在该函数中根据系统调用号（系统调用数组的下标）找到对应系统调用函数进行参数传递从而执行系统调用

在[关于函数栈帧](https://www.help-doc.top/other/func-stack-c/func-stack-c.html#c)中提到每一个函数都有自己的栈帧空间，而系统调用本质也是也是一个函数，不同的函数之间传递数据就需要利用到寄存器，此时就需要用户层的函数通过寄存器将对应的数据，例如系统调用号传递给操作系统，对应的系统调用如果有返回值也需要通过寄存器将该返回值返回给用户

所以，实际上用户层使用的系统调用是通过标准库对系统调用数组进行的封装，整个系统调用的过程就是通过软中断的过程实现的，对应的源码如下：

```c
// 封装系统调用
extern int sys_setup();
extern int sys_exit();
extern int sys_fork();
extern int sys_read();
extern int sys_write();
extern int sys_open();
extern int sys_close();
extern int sys_waitpid();
extern int sys_creat();
extern int sys_link();
extern int sys_unlink();
extern int sys_execve();
extern int sys_chdir();
extern int sys_time();
extern int sys_mknod();
extern int sys_chmod();
extern int sys_chown();
extern int sys_break();
extern int sys_stat();
extern int sys_lseek();
extern int sys_getpid();
extern int sys_mount();
extern int sys_umount();
extern int sys_setuid();
extern int sys_getuid();
extern int sys_stime();
extern int sys_ptrace();
extern int sys_alarm();
extern int sys_fstat();
extern int sys_pause();
extern int sys_utime();
extern int sys_stty();
extern int sys_gtty();
extern int sys_access();
extern int sys_nice();
extern int sys_ftime();
extern int sys_sync();
extern int sys_kill();
extern int sys_rename();
extern int sys_mkdir();
extern int sys_rmdir();
extern int sys_dup();
extern int sys_pipe();
extern int sys_times();
extern int sys_prof();
extern int sys_brk();
extern int sys_setgid();
extern int sys_getgid();
extern int sys_signal();
extern int sys_geteuid();
extern int sys_getegid();
extern int sys_acct();
extern int sys_phys();
extern int sys_lock();
extern int sys_ioctl();
extern int sys_fcntl();
extern int sys_mpx();
extern int sys_setpgid();
extern int sys_ulimit();
extern int sys_uname();
extern int sys_umask();
extern int sys_chroot();
extern int sys_ustat();
extern int sys_dup2();
extern int sys_getppid();
extern int sys_getpgrp();
extern int sys_setsid();

// 系统调用数组
fn_ptr sys_call_table[] = { sys_setup, sys_exit, sys_fork, sys_read,
sys_write, sys_open, sys_close, sys_waitpid, sys_creat, sys_link,
sys_unlink, sys_execve, sys_chdir, sys_time, sys_mknod, sys_chmod,
sys_chown, sys_break, sys_stat, sys_lseek, sys_getpid, sys_mount,
sys_umount, sys_setuid, sys_getuid, sys_stime, sys_ptrace, sys_alarm,
sys_fstat, sys_pause, sys_utime, sys_stty, sys_gtty, sys_access,
sys_nice, sys_ftime, sys_sync, sys_kill, sys_rename, sys_mkdir,
sys_rmdir, sys_dup, sys_pipe, sys_times, sys_prof, sys_brk, sys_setgid,
sys_getgid, sys_signal, sys_geteuid, sys_getegid, sys_acct, sys_phys,
sys_lock, sys_ioctl, sys_fcntl, sys_mpx, sys_setpgid, sys_ulimit,
sys_uname, sys_umask, sys_chroot, sys_ustat, sys_dup2, sys_getppid,
sys_getpgrp,sys_setsid};

// 调用系统调用
void sched_init(void)
{
    // ...
	set_system_gate(0x80,&system_call);
}

// 进入汇编通过系统调用号调用对应的系统调用
_system_call:
    // ...
	call _sys_call_table(,%eax,4)
    // ...
```

在CPU中软中断的int 0x80或者syscall称为陷阱，而对应的一些问题，例如除0、野指针等被称为异常，所以当某个程序出现了异常时，就会触发软中断通知操作系统执行对应的中断处理逻辑

**用户态和内核态**

有了上面的知识铺垫，下面就可以深入理解用户态和内核态

前面在[Linux进程地址空间](https://www.help-doc.top/Linux/process-address-space/process-address-space.html#_1)中提到过，一个进程的虚拟地址空间分为两部分：

1. 内核空间，在总大小为4GB的情况下，内核空间大小一般为1GB
2. 用户空间，在总大小为4GB的情况下，用户空间大小一般为3GB

对于每一个进程来说，用户空间彼此并不相同，但是对于内核空间来说，为了能保证每一个进程都可以找到同一个操作系统，就需要保证每一个进程的虚拟地址空间中内核空间的页表映射到的是同一个操作系统，所以实际上对于不同的进程来说，只要是运行在同一个操作系统上，那么其虚拟地址空间中的内核空间一定是相同的

如果进程需要调用系统调用，就会通过在自己的虚拟地址空间中从用户空间进入内核空间执行对应的系统调用，此时就会从用户态转换为内核态，当系统调用执行完毕后，就会从内核态恢复到用户态，这就是两态之间的转化过程，但是这个过程存在一个问题，如果用户并不是通过封装好的系统调用进入内核态，而是直接调用操作系统的底层接口，此时就会对操作系统造成威胁，所以为了避免这种情况的发生，除了判断是否调用系统调用表示进入内核态外，CPU中还有一个CS段寄存器，这个寄存器中存在一个标记位，该标记位是两位2进制，其中在Linux中，0表示内核态，3表示用户态，这个标记位只能通过操作系统来修改，而不允许用户进行修改，在调用操作系统底层的系统接口时会先检查这个标记位是否为0，再决定是否进入内核态，此时就可以防止用户自行调用操作系统底层接口

根据上面的内容，对用户态和内核态的总结如下表所示：

| 特性    | 用户态（User Mode）  | 内核态（Kernel Mode）    |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **定义**           | 用户态是操作系统中的一种执行模式，在这种模式下运行的程序具有受限权限。它为每个进程提供了一个隔离的环境，确保一个进程的操作不会影响到其他进程或系统的稳定性。                                                                                             | 内核态是另一种执行模式，允许程序无限制地访问所有系统资源和执行任何指令。操作系统的核心部分——即内核，在这种模式下运行，负责诸如进程管理、内存管理和设备驱动等功能。                                                                                       |
| **地址空间**       | 在32位Linux系统中，每个进程拥有独立的3GB用户空间虚拟地址。这意味着各个进程的用户空间彼此之间是完全隔离的，从而增强了安全性和稳定性。                                                                                                           | 对于所有的进程来说，1GB的内核空间是相同的，并且映射到同一个物理地址空间。这使得所有进程都能找到并使用相同的操作系统服务，而不需要各自维护一份副本。                                                                                     |
| **限制与保护**     | 用户态下的代码不能直接访问硬件资源或使用特权指令。如果需要执行特权操作，如I/O操作或修改内存映射，则必须通过系统调用来请求内核的帮助。                                                                                                         | 在内核态中，可以执行包括但不限于修改寄存器内容、控制硬件设备、更改内存映射等特权指令。这些操作对于维持系统的正常运作至关重要，但同时也伴随着潜在的风险，因此只有经过特别授权的代码（如内核本身）才能在此模式下运行。                |
| **系统调用接口**   | 当用户态程序需要操作系统的服务时，它会发出系统调用请求，这将触发CPU从用户态切换到内核态以执行必要的任务。一旦完成，CPU状态会被恢复，继续以用户态运行。                                                                                          | 为了防止未经授权的应用程序滥用内核态的能力，CPU内部有一个段选择子寄存器（CS），其中包含两个二进制位来表示当前的特权级别。在Linux中，0代表内核态，而3代表用户态。这个标记位只能由操作系统修改，不允许普通用户程序改变。在尝试进入内核态之前，会检查该标记位是否为0，以此决定是否允许转换。这样的设计有效阻止了恶意用户程序绕过系统调用接口直接访问底层操作系统功能的可能性，从而提高了系统的安全性。 |

理解了用户态和内核态后，现在再看为什么在信号捕捉过程中执行用户自定义的行为函数需要进行状态切换，本质就是为了防止自定义行为函数中涉及对内核的操作，如果在用户态，因为其权限为用户，也就无法使用系统的底层接口

**信号捕捉接口**

除了可以使用前面的`signal`接口进行设置信号捕捉的自定义行为以外，还可以使用`sigaction`接口，这个接口与`sigprocmask`的函数定义非常像：

```c
int sigaction(int signum, const struct sigaction * act, struct sigaction * oldact);
```

该接口的第一个参数传递信号编号，第二个参数和第二个参数都表示行为结构，但是第二个参数为输入型参数，第三个参数为输出型参数，对应的`sigaction`结构体原型如下：

```c
struct sigaction 
{
    void     (*sa_handler)(int);
    void     (*sa_sigaction)(int, siginfo_t *, void *);
    sigset_t   sa_mask;
    int        sa_flags;
    void     (*sa_restorer)(void);
};
```

!!! note

    注意，在C/C++中，结构体的名称允许与函数名称同名

在`sigaction`结构体中，第一个成员表示自定义行为函数，与`signal`的第二个参数一致，第二个成员表示实时信号行为函数，此处不做介绍，第三个成员是阻塞列表，即用于替换`block`表，第四个成员和第五个成员不做介绍

使用`sigaction`接口时，需要创建一个新的结构体，可以指定自定义行为函数和阻塞表替换当前系统中已有的，并且函数可以通过第三个参数将原有的函数和阻塞表保存

如果新的结构体只设置了第一个成员，其余的成员保持默认，则效果与`signal`一致，此处不再演示，接下来主要考虑使用第一个成员和第三个成员

首先了解操作系统在处理信号时具体做了哪些事情，当信号的处理函数被调用时，操作系统会自动将对应进程的`block`表中当前信号的位置设置为1，这样就可以确保在执行信号行为时不会多次重复调用信号行为函数导致的栈溢出风险，在Linux中，除了当前信号会被设置屏蔽外，可能存在相关其他的信号也被屏蔽，如果需要同时设置其他不同的信号在执行信号行为函数时被屏蔽就可以设置`sigaction`结构中的第三个成员，设置方式与`sigprocmask`处提到的方式一致，一旦信号行为函数处理完毕，所有被屏蔽的信号就会自动解除屏蔽

另外需要注意的是，前面提到当进程收到信号时不会立即执行信号，而是会对信号进行保存，信号既然会被保存那么也会被释放，现在的问题是信号是何时从`pending`表中移除的，对于这个问题存在两种可能性：

1. 在信号执行信号行为函数之前解除
2. 在信号执行信号行为函数之后解除

实际上，信号在**在信号执行信号行为函数之前解除**，之所以是「之前」是因为可以确保信号在执行行为函数时可以继续收到信号，并且如果是「之后」就会出现无法区分`pending`表对应的信号是已经执行的1还是新修改的1

所以，基于上面的两点，可以使用下面的代码进行验证：

1. 验证当前信号在执行自定义行为函数时会被阻塞：向进程发送2号信号，并设置`sa_mask`中3、4号信号在处理自定义行为函数时被阻塞，观察`block`表中对应的信号位是否为1
2. 验证当前信号在信号行为函数之前解除：执行信号行为函数时打印`pending`表，如果`pending`表中对应的信号已经不存在，就说明是在信号行为函数之前解除，否则就是之后解除

对应的代码如下：

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>

void printPending()
{
    sigset_t pending;
    sigpending(&pending);

    for (int i = 31; i > 0; i--)
    {
        if (sigismember(&pending, i))
            std::cout << 1;
        else
            std::cout << 0;
    }

    std::cout << std::endl;
}

void printBlock()
{
    sigset_t block;

    sigprocmask(SIG_BLOCK, NULL, &block);

    for (int i = 31; i > 0; i--)
    {
        if (sigismember(&block, i))
            std::cout << 1;
        else
            std::cout << 0;
    }

    std::cout << std::endl;
}

void handler(int signal)
{
    while (true)
    {
        std::cout << "Block：" << std::endl;

        printBlock();

        std::cout << "Pending：" << std::endl;

        printPending();

        sleep(1);
    }
}

int main()
{
    struct sigaction newSiga, oldSiga;

    // 设置2号信号的自定义行为
    newSiga.sa_handler = handler;
    sigaction(2, &newSiga, &oldSiga);

    sigemptyset(&newSiga.sa_mask);

    // 屏蔽3号信号和4号信号
    sigaddset(&newSiga.sa_mask, 3);
    sigaddset(&newSiga.sa_mask, 4);

    sigset_t oldBlock;

    sigprocmask(SIG_SETMASK, &newSiga.sa_mask, &oldBlock);

    while (true)
    {
        pause();
    }

    return 0;
}
```

## 可重入函数

有了信号之后，就存在着两个执行流：

1. 用户的代码：第一执行流
2. 信号处理代码：第二执行流

这两个执行流彼此完成自己的行为，互不干扰

根据这个特点，此时就会出现一个问题，例如链表插入节点的例子：

<img src="18. Linux信号与操作系统原理.assets\download3.png">

存在两个待插入的节点`node1`和`node2`，当主函数插入节点`node1`时（对应步骤1）收到信号需要执行`sighandler`函数中的逻辑，该函数中又存在着插入节点的逻辑，因为需要将当前信号的行为处理函数执行完毕才会返回到内核态，最后回到用户态，所以此时如果在与插入`node1`节点的位置（注意，此时`node1`还没有插入完成）插入`node2`节点（对应步骤2和3）。当信号行为函数执行完毕返回用户态时，CPU会继续执行上次未完成的任务（对应步骤4），此时就会出现`head`本来已经指向了新的`node2`，但是因为进入信号处理之前还没有更改头指针指向`node1`，导致现在由指向`node2`修改为指向`node1`，此时就出现了`node2`节点丢失从而造成内存泄漏问题

像这种会出现问题的函数就称为不[可重入](https://zh.wikipedia.org/wiki/%E5%8F%AF%E9%87%8D%E5%85%A5)函数，相反就是可重入函数，在标准库中，实际上绝大部分的函数都是不可重入函数，一般来说，如果满足下面的条件之一的就是不可重入函数：

1. 调用了`malloc`或者`free`的
2. 调用了标准I/O库函数的

## `volatile`关键字

在[C++中的类型转换](https://www.help-doc.top/cpp/type-cast/type-cast.html#const_cast)中提到过`volatile`关键字，当时只是描述一下`volatile`的作用，实际上，`volatile`关键字更多的应用场景是确保某一个关键字在当前执行流之外的位置被改变依旧可以正确读取到对应的值从而阻止编译器对该关键字修饰的变量进行优化，因为当前信号的产生会出现两个执行流，所以可以考虑使用`volatile`

假设有应用场景：存在一个全局变量`flag`，在2号信号的自定义行为中对该变量进行修改，但是主函数中不修改，在主函数中通过判断该变量的值执行对应的语句。如果不使用`volatile`关键字，并且使用`GCC`的`O1`到`O3`优化，观察没有优化的结果`O0`和`O1`到`O3`的优化结果，再对比使用`volatile`关键字下观察对应的结果

!!! info "关于`GCC`优化"

    `GCC`编译器提供了不同的优化级别，从 `-O0`（无优化）到 `-O3`（高级别优化），以及更激进的 `-Ofast` 等。每个优化级别都会启用一组特定的优化选项，默认情况下随着优化级别的提高，编译时间会增加，同时可能会导致代码体积增大，但目标是生成更快、更高效的可执行文件。以下是`-O1`到`-O3`三种优化的具体优化内容：

    以下是关于`-O1` 到 `-O3`优化级别的概述：

    **`-O1`（基本优化）：**

    - 内联小函数：将一些简单的小函数直接插入调用点，以减少函数调用开销
    - 常量和寄存器分配：尽可能使用寄存器存储局部变量，并且合并冗余的常量表达式计算
    - 死代码消除：移除不会被执行或没有效果的代码段
    - 循环优化：例如，简化循环条件，提升循环内的不变表达式等
    - 跳转优化：通过重组控制流结构来减少不必要的跳转指令

    **`-O2`（中级优化）：**

    除了包含 `-O1` 的所有优化外，还增加了更多积极的优化措施：

    - 函数内联：不仅限于小函数，还会考虑更大范围内的内联机会，特别是那些被频繁调用的函数
    - 跨函数优化：对跨越多个函数的情况进行优化，如全局值编号、过程间分析等
    - 更好的寄存器使用：改进寄存器分配算法，尝试让更多的变量驻留在寄存器中
    - 向量化：尝试将循环转换为 SIMD 指令集可以处理的形式，以利用现代 CPU 的并行处理能力
    - 代码布局调整：优化函数和数据的排列顺序，以改善缓存命中率
    - 延迟槽填充：对于 RISC 架构，优化分支指令后的延迟槽以充分利用流水线
    - 其他性能优化：包括但不限于展开部分循环、优化内存访问模式等

    **`-O3`（高级优化）：**

    在 `-O2` 的基础上进一步增强了优化力度，引入了一些更为激进的技术：

    - 激进的内联：更加广泛地应用函数内联，即使这可能导致代码膨胀
    - 预测性公共子表达式消除：识别并移除重复出现的计算，即使它们可能看起来不同
    - 浮点精度放松：允许某些数学运算不符合严格的 IEEE 标准，以便换取速度上的优势（注意这可能会改变数值结果）
    - 自动并行化：尝试自动检测和转换适合多线程执行的代码区域
    - 轮廓指导优化 (Profile-Guided Optimization, PGO)：如果提供了运行时性能数据，则根据这些信息做出更智能的优化决策
    - 额外的向量化：增强对循环和其他代码结构的向量化尝试
    - 全程序优化：考虑整个程序范围内更广泛的优化可能性，比如跨文件边界的过程间优化

=== "未使用`volatile`关键字"

    ```c
    #include <stdio.h>
    #include <unistd.h>
    #include <signal.h>

    int flag = 0;

    void handler(int signal)
    {
        printf("Signal: %d\n", signal);
        flag = 1;
    }

    int main()
    {
        signal(2, handler);

        while (!flag)
            ;

        printf("我退出了\n");

        return 0;
    }

    // 没有优化下输出结果：
    ^CSignal: 2
    我退出了

    // O1到O3优化
    ^CSignal: 2
    ^CSignal: 2
    ^CSignal: 2
    ^CSignal: 2
    ^CSignal: 2
    ...

    /*
    * 在O1及之后的优化开始，尽管在信号自定义函数中修改了flag，但是while循环被编译器优化为固定while(!0)，即while(1)，所以会一直死循环，但如果是没有优化，那么一旦发送2号信号，就会打印对应的信息
    */
    ```

=== "使用`volatile`关键字"

    ```c
    // ...
    volatile int flag = 0;
    // ...

    // 没有优化下输出结果：
    ^CSignal: 2
    我退出了

    // O1到O3优化
    ^CSignal: 2
    我退出了

    /*
    * 因为flag被volatile关键字修饰，所以编译器就会知道这个关键字会一直发生改变从而无法只从寄存器中取数据，而是需要从内存中不断取新的数据，所以编译器就不会对这个变量进行优化
    */
    ```

## `SIGCHLD`信号（了解）

在父进程创建子进程时，如果子进程退出就会给父进程发送`SIGCHLD`信号，代表子进程已经退出，因为该信号的默认行为是`IGN`，所以并没有实际的效果展现，实际上，如果利用这个信号就可以做到在不影响父进程的执行流的同时回收子进程

在前面[Linux进程控制](https://www.help-doc.top/Linux/process-control/process-control.html#_3)提到，可以使用`wait`系列函数回收子进程，所以可以在父进程收到`SIGCHLD`时才回收对应的子进程，其他时刻父进程执行自己的任务，对应的代码如下：

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/types.h>

void handler(int signal)
{
    // 使用-1表示等待任意一个进程
    int rid = waitpid(-1, nullptr, 0);

    if (rid > 0)
        printf("正常回收进程：%d\n", rid);
}

int main()
{
    signal(SIGCHLD, handler);

    pid_t pid = fork();

    if (pid == 0)
    {
        // 子进程
        exit(0);
    }

    while (true)
    {
        printf("父进程在执行\n");
        sleep(1);
    }

    return 0;
}
```

上面的代码就可以确保父进程执行自己的代码，一旦收到`SIGCHLD`信号，就回收子进程。但是这个代码存在一个很大的问题，就是一旦有多个子进程同时结束，因为当某个信号的信号行为函数还没有执行完时，`pending`表可以记录一次，但是有超过两个以上的子进程结束时就只会保存一次，所以就会出现子进程没有回收导致的内存泄漏，例如下面的代码：

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/types.h>

void handler(int signal)
{
    // 使用-1表示等待任意一个进程
    int rid = waitpid(-1, nullptr, 0);

    if (rid > 0)
        printf("正常回收进程：%d\n", rid);
}

int main()
{
    signal(SIGCHLD, handler);

    // pid_t pid = fork();

    // 创建多个子进程
    for (int i = 0; i < 10; i++)
    {
        pid_t pid = fork();

        if (pid == 0)
        {
            // 子进程
            exit(0);
        }
    }

    while (true)
    {
        printf("父进程在执行\n");
        sleep(1);
    }

    return 0;
}
```

运行代码查看可以发现只回收了6个子进程，还有4个子进程没有回收（具体回收数量取决于对应的系统）：

<img src="18. Linux信号与操作系统原理.assets\Snipaste_2025-01-22_21-04-17.png">

为了解决这个问题，就需要使用死循环等待，对应的如果等待失败，就退出：

```c++
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/types.h>

void handler(int signal)
{
    while (true)
    {
        int rid = waitpid(-1, nullptr, 0);

        if (rid > 0)
            printf("正常回收进程：%d\n", rid);
        else if (rid < 0)
        {
            printf("子进程回收完毕\n");
            break;
        }
    }
}

int main()
{
    signal(SIGCHLD, handler);

    // pid_t pid = fork();

    for (int i = 0; i < 10; i++)
    {
        pid_t pid = fork();

        if (pid == 0)
        {
            // 子进程
            exit(0);
        }
    }

    while (true)
    {
        printf("父进程在执行\n");
        sleep(1);
    }

    return 0;
}
```

可以看到此时就已经解决了上面出现的问题，但是因为此时还是阻塞式等待，结合信号可以知道，一旦子进程退出就会有信号产生，所以可以考虑结合非阻塞式等待：

```c
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/types.h>

void handler(int signal)
{
    while (true)
    {
        // 非阻塞式等待，一旦有信号就说明有进程退出
        int rid = waitpid(-1, nullptr, WNOHANG);

        if (rid > 0)
            printf("正常回收进程：%d\n", rid);
        else if (rid < 0)
        {
            printf("子进程回收完毕\n");
            break;
        }
    }
}

int main()
{
    signal(SIGCHLD, handler);

    // pid_t pid = fork();

    for (int i = 0; i < 10; i++)
    {
        pid_t pid = fork();

        if (pid == 0)
        {
            // 子进程
            exit(0);
        }
    }

    while (true)
    {
        printf("父进程在执行\n");
        sleep(1);
    }

    return 0;
}
```

尽管可以实现回收所有的子进程，但是还是有概率会出现某些进程没有被回收，所以可以考虑使用最后一种方案，这种方案是Linux对`SIGCHLD`信号的`SIG_IGN`的忽略行为的一种特殊处理，这种情况下可以得到效果：子进程一旦退出就自动销毁，不需要等待父进程回收。所以对应的代码如下：

```c
#include <iostream>
#include <unistd.h>
#include <signal.h>

int main()
{
    // signal(SIGCHLD, handler);
    signal(SIGCHLD, SIG_IGN);

    // pid_t pid = fork();

    for (int i = 0; i < 10; i++)
    {
        pid_t pid = fork();

        if (pid == 0)
        {
            // 子进程
            exit(0);
        }
    }

    while (true)
    {
        printf("父进程在执行\n");
        sleep(1);
    }

    return 0;
}
```