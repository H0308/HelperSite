# Linux线程库与线程库封装

## 何为线程`id`

在线程操作部分提到了使用`pthread_self()`接口获取到当前线程的`id`，例如下面的代码：

```c++
#include <iostream>
#include <cstring>
#include <unistd.h>
#include <pthread.h>

void *routine(void *arg)
{
    printf("%ld\n", pthread_self());

    return NULL;
}

int main()
{
    pthread_t thid;

    // 创建线程
    int n = pthread_create(&thid, NULL, routine, (void *)"thread-1");

    int ret = pthread_join(thid, NULL);

    return 0;
}
```

运行后结果如下：

```
123897116624576
```

这个结果不够直观，使用下面的代码将该数值转换为16进制输出：

```c
// ...
std::string toHex(pthread_t num)
{
    char buffer[1024];
    snprintf(buffer, sizeof(buffer), "0x%lx", num);

    return buffer;
}

void *routine(void *arg)
{
    std::cout << toHex(pthread_self()) << std::endl;

    return NULL;
}
// ...
```

此时再运行上面的代码即可看到下面的结果：

```
0x7df688c006c0
```

这个结果实际上就是一个地址值，所以所谓的线程`id`实际上就是一个地址值而并不是LWP值，具体原因在接下来介绍线程库时即可解释

## 线程库

### 前置知识

在前面提到，因为Linux本身只有轻量级进程的概念，所以只有操作轻量级进程的接口，为了用户更加方便创建操作系统概念层面的线程，存在着一个用户级线程库`libpthread.so`，而因为是动态库，所以在编译链接时需要加上`-lpthread`，使用`ldd`命令查看对应的运行程序可以看到链接的动态库

!!! note

    某些版本的操作系统使用`ldd`命令不会显示动态链接的`libpthread.so`，如果线程运行是正常的，就不需要再考虑

当程序运行时，加载动态库到内存，建立虚拟地址和物理地址的映射，此时当前进程中的所有线程就都可以看到链接的`pthread`动态库并使用该动态库

既然线程可以被用户创建，线程在Linux下又是轻量级进程，那么一定也有其对应的属性，如果用户想要获取一些线程属性，而不是轻量级进程的属性，那么用户级线程库依旧需要对这些属性进行封装，所以实际上，线程库除了封装操作线程的接口外，还需要封装一些线程的属性，此时就需要一个结构体来维护这些属性。在glibc中，这个结构叫`struct pthread`，其中一些属性，例如线程`id`，线程栈大小，线程局部存储

!!! abstract "回顾"

    在前面文件部分也提到过语言库对系统底层的文件属性进行封装，即`struct FILE`

在创建线程时，操作系统会创建对应的物理内存空间用于动态库，并将该空间通过`mmap`接口映射到当前进程的虚拟地址空间，接着就会在这个动态库所在的空间开辟对应的线程结构以及线程需要的空间，例如线程栈和线程局部存储，此时线程就拥有了自己独立的线程栈，如下图所示：

<img src="2. Linux线程库与线程库封装.assets/image-20250208182626614.png">

整体示意图如下：

<img src="2. Linux线程库与线程库封装.assets\download.png">

而所谓的线程id就是在动态库空间中的`struct pthread`结构的起始地址，即：

```c
struct pthread* pd = ...;
pthread_t tid = (pthread_t)pd;
```

此时，在进程地址空间中，从逻辑上看，存在两种栈：一种是进程启动时创建的，用于支持`main`函数执行的栈，可以称之为主线程栈。另一种是在`libpthread.so`动态库加载后，由线程库为每个新创建的线程分配的栈，这些栈位于动态库管理的内存区域内，可以称之为线程栈

有了上面的理解，下面就可以进入用户级线程库源代码理解创建线程所经历的过程

### 线程结构体`pthread`

在glibc源代码中，下面是对应的线程结构：

```c
/* Thread descriptor data structure.  */
struct pthread
{
    // ...
    /* This descriptor's link on the `stack_used' or `__stack_user' list.  */
    list_t list;

    // 线程id
    pid_t tid;

    // 当前进程pid
    pid_t pid;

    // ...

    // 判断用户是否传入自定义栈
    bool user_stack;

    // ...

    // 存储线程执行函数的返回值
    void *result;

    // 线程执行函数和参数
    void *(*start_routine) (void *);
    void *arg;

    // 线程栈指针
    void *stackblock;
    // 线程栈大小
    size_t stackblock_size;
    
    // ...
} __attribute ((aligned (TCB_ALIGNMENT)));
```

其中的`result`就是用于一些需要获取到线程执行函数返回值的位置，例如前面提到的`pthread_join`获取到函数返回值就是通过这个`result`变量，另外前面提到过`clone`函数，这个函数的原型如下：

```c
int clone(int (*fn)(void *), void *stack, int flags,
            void * arg, ...  /* pid_t * parent_tid, void * tls,
                                pid_t * child_tid */ );
```

其中，第一个参数就是需要执行的函数，第二个参数表示创建的栈空间，第三个参数表示标记位，用于标记是创建子进程还是轻量级进程，第四个参数就是需要执行的函数的指针，后面的参数可以不用考虑，但是其中的`void* tls`就是表示线程局部存储的空间

在上面的`pthread`的结构中，一些属性就是传递到`clone`接口中，例如线程栈指针`stackblock`

### 线程创建函数`pthread_create`

```c
int __pthread_create_2_1 (pthread_t *newthread, const pthread_attr_t *attr,
		      void *(*start_routine) (void *), void *arg)
{
    // ...

    // 线程属性，就是pthread_create函数的第二个参数，默认情况下传递NULL
    const struct pthread_attr *iattr = (struct pthread_attr *) attr;
    // 创建默认属性
    struct pthread_attr default_attr;

    // ...

    // 如果iattr为NULL，就使用默认属性
    if (iattr == NULL)
    {
        // ...

        // 使用默认属性
        iattr = &default_attr;
    }

    // 创建线程结构体
    struct pthread *pd = NULL;

    // 调用ALLOCATE_STACK申请struct pthread对象
    int err = ALLOCATE_STACK(iattr, &pd);

    // ...

    // 设置线程执行函数和对应的参数到线程结构体对象中
    pd->start_routine = start_routine;
    pd->arg = arg;

    // ...

    // 设置参数pthread* newthread为线程结构体对象的地址，即设置线程id为结构体对象的地址
    *newthread = (pthread_t) pd;

    // ...

    if (__glibc_unlikely (report_thread_creation (pd)))
    {
        // ...

        // 创建线程
        retval = create_thread(pd, iattr, STACK_VARIABLES_ARGS);
        
        // ...
    }
    
    // ...
}
// 版本确认信息，如果用的库是GLIBC_2_1，则使用__pthread_create_2_1
versioned_symbol (libpthread, __pthread_create_2_1, pthread_create, GLIBC_2_1);
```

在上面的函数中，首先该函数会接收四个参数，分别表示新线程的`id`值、新线程的属性、新线程的执行函数和执行函数的参数

在函数内部，首先会判断用户是否传递了自定义的线程属性，如果没有就使用默认的线程属性，所以对于`pthread_create`函数来说，第二个参数设置为`NULL`就可以保证线程使用默认属性，线程属性结构体如下：

```c
struct pthread_attr
{
    // ...

    // 线程栈空间指针
    void *stackaddr;
    // 线程栈大小
    size_t stacksize;

    // ...
};
```

接着就是描述线程，创建线程结构体指针，调用相关的函数为结构体指针创建对象，对应的`ALLOCATE_STACK`函数如下：

```c
// 创建一个宏，通过属性和struct pthread指针调用allocate_stack函数
# define ALLOCATE_STACK(attr, pd) allocate_stack (attr, pd, &stackaddr)

static int allocate_stack (const struct pthread_attr *attr, struct pthread **pdp,
		ALLOCATE_STACK_PARMS)
{
    struct pthread *pd;
    size_t size;

    // ...

    // 设置线程栈大小，如果用户已经指定，则使用用户指定的大小，否则使用默认大小
    if (attr->stacksize != 0)
        size = attr->stacksize;
    else
    {
        // ...
        size = __default_pthread_attr.stacksize;
        // ...
    }

    if (__glibc_unlikely (attr->flags & ATTR_FLAG_STACKADDR))
    {
        // ...
    }
    else
    {
        // ...

        // 先从pthread缓存中申请空间
        reqsize = size;
        pd = get_cached_stack (&size, &mem);
        if (pd == NULL)
        {
            // ...

            // 缓存申请失败，就到堆空间中申请私有的匿名内存空间
            mem = __mmap (NULL, size, (guardsize == 0) ? prot : PROT_NONE,
                    MAP_PRIVATE | MAP_ANONYMOUS | MAP_STACK, -1, 0);

            // ...
        
            /* Remember the stack-related values.  */
            // 使用线程对象记录创建的空间和大小
            pd->stackblock = mem;
            pd->stackblock_size = size;
            
            // ...
        }
    }

    // 二级指针，用于返回struct pthread的地址
    *pdp = pd;

    // ...

    return 0;
}
```

从这个函数中可以看出，线程栈虽然是动态申请的，但是其大小在申请的那一刻就已经固定好了，所以对于新线程来说，其栈大小是不会改变的，一旦用完就不会再扩容

回到`__pthread_create_2_1`，申请完线程栈后，就开始设置线程执行函数和对应的参数到线程结构体对象中，便于后续读取和调用，接着设置线程`id`为线程结构体对象的地址，这也就解释了为什么线程`id`是地址值

当所有属性设置完毕后，开始创建线程，调用`create_thread`接口，代码如下：

```c
static int create_thread(struct pthread *pd, const struct pthread_attr *attr,
STACK_VARIABLES_PARMS)
{
    int clone_flags = (CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGNAL |
        CLONE_SETTLS | CLONE_PARENT_SETTID | CLONE_CHILD_CLEARTID | CLONE_SYSVSEM
    
    // ...

    if (__builtin_expect(THREAD_GETMEM(THREAD_SELF, report_events), 0))
    {
        // ...
        int res = do_clone(pd, attr, clone_flags, start_thread, STACK_VARIABLES_ARGS, 1);
        
        // ...
    }
    
    // ...
    return res;
}
```

在`create_thread`接口中，调用`do_clone`接口创建线程：

```c
static int do_clone(struct pthread *pd, const struct pthread_attr *attr,
int clone_flags, int (*fct)(void *), STACK_VARIABLES_PARMS,int stopped)
{
    // ...

    // 调用当前操作系统下的`clone`函数
    if (ARCH_CLONE(fct, STACK_VARIABLES_ARGS, clone_flags, pd, &pd->tid, TLS_VALUE, &pd->tid) == -1)
    {
        // ...
    }

    //...

    return 0;
}
```

对应的`ARCH_CLONE`也是一个宏，代表当前操作系统的`clone`，在glibc中对应的是一段汇编封装的调用clone系统调用的函数：

```assembly
/* Sanity check arguments. */
movq    $-EINVAL,%rax
testq   %rdi,%rdi   /* no NULL function pointers */
jz      SYSCALL_ERROR_LABEL
testq   %rsi,%rsi   /* no NULL stack pointers */
jz      SYSCALL_ERROR_LABEL


/* Insert the argument onto the new stack. */
subq    $16,%rsi
movq    %rcx,8(%rsi)


/* Save the function pointer. It will be popped off in thechild in the ebx frobbing below. */
movq    %rdi,0(%rsi)


/* Do the system call. */
movq    %rdx, %rdi
movq    %r8, %rdx
movq    %r9, %r8
movq    8(%rsp), %r10
movl    $SYS_ify(clone),%eax // 获取系统调⽤号


/* End FDE now, because in the child the unwind info will bewrong. */
cfi_endproc;
syscall // 陷⼊内核(x86_32是int 80)，要求内核创建轻量级进程
testq   %rax,%rax
jl      SYSCALL_ERROR_LABEL
jz      L(thread_start)
```

在上面的汇编中`$SYS_ify(clone)`就是调用系统调用`clone`

至此，创建线程的整个过程就已经基本结束了，所以本质`pthread_create`函数就是在做空间分配、属性填充和调用`clone`系统调用创建线程

### 使用指令查看创建线程时使用的系统调用

阅读源码之后可以知道`pthread_create`底层调用了`clone`接口，除了这种方式以外，还可以使用指令的方式查看一个程序中调用的系统接口，以下面的代码为例：

```c++
#include <iostream>
#include <cstring>
#include <unistd.h>
#include <pthread.h>

void *routine(void *arg)
{
    return NULL;
}

int main()
{
    pthread_t thid;

    // 创建线程
    int n = pthread_create(&thid, NULL, routine, (void *)"thread-1");

    return 0;
}
```

使用`strace`命令查看当前程序使用的系统调用可以看到：

```c
// ...

clone3({flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS|CLONE_PARENT_SETTID|CLONE_CHILD_CLEARTID, child_tid=0x7627b1200990, parent_tid=0x7627b1200990, exit_signal=0, stack=0x7627b0a00000, stack_size=0x7fff80, tls=0x7627b12006c0} => {parent_tid=[6010]}, 88) = 6010

// ...
```

从上面的结果可以看到调用了系统调用`clone3`（`clone`的升级版），在参数上可以传递一个结构体代替原来`clone`分别传递参数的形式，并且支持传递更多的属性，函数的作用一致

!!! info "关于`strace`命令"

    `strace` 是一个 Linux 下的命令行工具，用于跟踪进程执行过程中的系统调用和信号。 简单来说，它可以让你看到程序在运行时都做了哪些“事情”，例如：

    - 打开了哪些文件
    - 读取了哪些数据
    - 发送了哪些网络请求
    - 使用了哪些内存
    - 调用了哪些系统函数

    这对于调试程序、理解程序行为、以及排查性能问题非常有帮助。

    例如，如果想知道程序`thread`在运行时都调用了哪些系统调用，你可以在终端中运行 `strace ./thread`。 `strace` 会输出大量的文本，每一行都代表一个系统调用，以及它的参数和返回值。

    一些常用的 `strace` 选项包括：

    - `-p <pid>`: 跟踪指定的进程 ID。
    - `-o <file>`: 将 `strace` 的输出写入到指定的文件中。
    - `-f`: 跟踪由 `fork` 或 `clone` 创建的子进程。
    - `-c`: 统计每个系统调用的耗时和调用次数。

    在线程的上下文中，`strace -f ./thread` 可以用来观察线程的创建 (通常通过 `clone` 系统调用) 和线程相关的操作。

## 线程库封装

直接使用glibc的线程操作接口会略显麻烦，所以考虑使用C++面向对象的方式封装自己的线程库，本质就是对一些操作进行封装

首先考虑线程对象需要有哪些属性，本次设计主要考虑下面的属性：

1. 线程的名称（string类型）
2. 线程的`id`（`pthread_t`类型）
3. 线程的执行函数（无参函数）
4. 线程的状态（枚举类类型）
5. 线程是否是分离的，默认不是分离（布尔类型）

接着考虑本次设计的线程库需要包括的操作：

1. 创建线程操作（使用`pthread_create`函数）
2. 等待线程操作（使用`pthread_join`函数）
3. 分离线程操作（使用`pthread_detach`函数）
4. 终止线程操作（使用`pthread_cancel`函数）
5. 获取线程名称

另外，考虑使用一个枚举类来表示当前线程的运行状态：

```c++
// 线程状态
enum class ThreadStatus
{
    isNew,
    isRunning,
    isStopped,
    isDetached,
    isJoinable
};
```

基本实现如下：

```c++
#pragma once

#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <pthread.h>
#include <functional>

namespace ThreadModule
{
    // 线程执行的任务类型
    using func_t = std::function<void()>;
    // 计数器
    static int count = 0;

    // 线程状态
    enum class ThreadStatus
    {
        isNew,
        isRunning,
        isStopped,
        isDetached,
        isJoinable
    };

    class Thread
    {
    private:
        static void *routine(void *arg) // 线程执行函数
        {
            // 获取到this指针
            Thread *_t = static_cast<Thread *>(arg);
            // 更改线程状态为运行状态
            _t->_thStatus = ThreadStatus::isRunning;
            // 执行任务函数
            _t->_func();

            return NULL;
        }

    public:
        Thread(func_t func)
            : _func(func), _thStatus(ThreadStatus::isNew), _joinable(true)
        {
            _name = "Thread" + std::to_string(count++);
        }

        // 创建线程
        bool start()
        {
            if (_thStatus != ThreadStatus::isRunning)
            {
                int ret = pthread_create(&_tid, NULL, routine, (void *)this);

                if (!ret)
                    return false;

                return true;
            }

            return false;
        }

        // 终止线程
        bool cancel()
        {
            if (_thStatus == ThreadStatus::isRunning)
            {
                int ret = pthread_cancel(_tid);
                if (!ret)
                    return false;

                _thStatus = ThreadStatus::isStopped;

                return true;
            }

            return false;
        }

        // 等待线程
        bool join()
        {
            if (_thStatus != ThreadStatus::isDetached || _joinable)
            {
                int ret = pthread_join(_tid, NULL);
                if (ret)
                    return false;

                _thStatus = ThreadStatus::isStopped;

                return true;
            }
            return false;
        }

        // 分离线程
        bool detach()
        {
            if (_joinable)
            {
                pthread_detach(_tid);
                _joinable = false;
                return true;
            }

            return false;
        }

        // 获取线程名称
        std::string getName()
        {
            return _name;
        }

        ~Thread()
        {
        }

    private:
        std::string _name;
        pthread_t _tid;
        ThreadStatus _thStatus;
        bool _joinable;
        func_t _func;
    };
}
```

!!! note

    上面的代码需要注意，`routine`函数如果放在类内部，需要考虑到隐藏的`this`，可以考虑放置在类外，也可以考虑使用静态方法，但是为了能够调用任务函数，还是考虑放在类内，并且传递参数时显式传递`this`

测试运行代码如下：

```c++
#include "thread.hpp"

int main()
{
    ThreadModule::Thread t([&]()
                           {
        while (true)
        {
            std::cout << "我是新线程：" << t.getName() << "，我的线程id为：" << pthread_self() << std::endl;
            sleep(1);
        } });

    t.start();

    t.join();
    return 0;
}
```

输出结果如下：

```
我是新线程：Thread0，我的线程id为：128731471414976
我是新线程：Thread0，我的线程id为：128731471414976
我是新线程：Thread0，我的线程id为：128731471414976
我是新线程：Thread0，我的线程id为：128731471414976
我是新线程：Thread0，我的线程id为：128731471414976
我是新线程：Thread0，我的线程id为：128731471414976
我是新线程：Thread0，我的线程id为：128731471414976
...
```

如果需要创建多线程，此时就会非常方便：

```c
#define NUM 10

using thread_ptr = std::shared_ptr<ThreadModule::Thread>;

int main()
{
    // 使用哈希表建立线程名称和线程对象的映射
    std::unordered_map<std::string, thread_ptr> threads;

    for (int i = 0; i < NUM; i++)
    {
        thread_ptr t = std::make_shared<ThreadModule::Thread>([]()
                                                              {
        while (true)
        {
            std::cout << "我是新线程" << "，我的线程id为：" << pthread_self() << std::endl;
            sleep(1);
        } });

        threads[t->getName()] = t;
    }

    for (auto pair : threads)
        pair.second->start();

    for (auto pair : threads)
        pair.second->join();

    return 0;
}
```