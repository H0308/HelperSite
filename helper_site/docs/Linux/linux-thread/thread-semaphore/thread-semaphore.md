# Linux线程与信号量

## 信号量介绍

在[Linux进程通信部分](https://www.help-doc.top/Linux/com-process/com-message-queue-semaphore/com-message-queue-semaphore.html#_4)已经详细介绍过信号量，其本质就是一个表示资源剩余个数的计数器

计数信号量具备两种操作动作，称为`V`（`signal()`）与`P`（`wait()`）（常称为PV操作）。`V`操作会增加信号量的数值，`P`操作会减少它

运作方式：

1. 初始化，给与它一个非负数的整数值。
2. 执行`P`操作，信号量的值将被减少。企图进入临界区段的进程，需要先执行`P`操作。当信号标S减为负值时，进程会被挡住，不能继续；当信号量不为负值时，进程可以获准进入临界区段
3. 执行`V`操作，信号量的值会被增加。结束离开临界区段的进程，将会执行`V`操作。当信号标S不为负值时，先前被挡住的其他进程，将可获准进入临界区段

在上面的过程中，因为需要对信号量的值进行增加和减少，这个过程可能无法保证是原子性的，所以信号量操作本身也需要进行保护。对于这种信号量来说，同样需要前面的互斥锁和同步进行保护，所以信号量结构可以理解为：

```c
struct sem
{
    int count; // 资源计数器
    pthread_mutex_t lock; // 互斥锁
};
```

## 线程部分的信号量操作

### 基本介绍

因为在进程部分，让两个进程看到同一个资源比较麻烦，所以对应的接口也比较麻烦。但是在线程部分，当前进程的所有线程共享一个地址空间，所以想要看到同一个信号量也会很容易，下面是常见的步骤和对应接口：

1. 创建信号量结构对象并初始化对应的计数器，使用`sem_init`接口进行初始化
2. 在操作资源之前先申请信号量，如果资源不足时进行等待，使用`sem_wait`接口进行
3. 在离开资源时增加信号量，使用`sem_post`接口进行
4. 不再使用信号量时销毁信号量结构对象，使用`sem_destroy`接口进行

### 基本使用

本次使用依旧是以抢票程序的代码为例，只不过使用的是信号量，下面是基本代码框架：

!!! note

    注意下面的代码依旧使用了前面封装的线程库

```c++
#include <iostream>
#include <vector>
#include "thread.hpp"

using namespace ThreadModule;
#define NUM 4

int tickets = 1000;

void getTicket()
{
    while (true)
    {
        // 有票时，抢票，否则直接跳出循环
        if (tickets > 0)
        {
            usleep(1000);
            std::cout << "当前线程获取到一张票：" << tickets-- << std::endl;
        }
        else
        {
            break;
        }
    }
}

int main()
{
    // 创建多个线程
    std::vector<Thread> threads;

    for (int i = 0; i < NUM; i++)
        threads.emplace_back(getTicket);

    // 启动多个线程
    for (int i = 0; i < NUM; i++)
        threads[i].start();

    // 等待多个线程
    for (int i = 0; i < NUM; i++)
        threads[i].join();

    return 0;
}
```

#### 创建信号量

在Linux中，信号量本身是一个结构，所以创建信号量就是创建对应结构的对象，接着使用`sem_init`接口对对应的信号量对象进行初始化，接口原型如下：

```c
int sem_init(sem_t *sem, int pshared, unsigned int value);
```

该接口的第一个参数为信号量结构体，第二个参数为信号量类型，0表示线程信号量，非0表示进程信号量，第三个参数表示信号量计数器值，即上文提到的`count`的值

在抢票代码中，因为一次只有一张票，所以`value`的初始值为1，并且为了保证多个线程可以看到同一个信号量对象，需要将该对象定义为全局对象，如下：

```c++
#include <semaphore.h>

// ...

int tickets = 1000;
// 定义信号量结构对象
sem_t sem;

// ...
int main()
{
    // 初始化信号量对象
    sem_init(&sem, 0, 1);

    // ...
}
```

#### 有资源时申请信号量

在Linux中，有资源时申请信号量对应的`P`操作接口为`sem_wait`，其原型如下：

```c
int sem_wait(sem_t *sem);
```

该接口的参数表示需要修改的信号量结构体

在抢票代码中，因为抢票时只能有一个线程在访问资源，所以需要在抢票之前先抢到信号量，即如下：

```c++
void getTicket()
{
    while (true)
    {
        // 先申请信号量
        sem_wait(&sem);

        // 有票时，抢票，否则直接跳出循环
        if (tickets > 0)
        {
            usleep(1000);
            std::cout << "当前线程获取到一张票：" << tickets-- << std::endl;
        }
        else
        {
            break;
        }
    }
}
```

#### 使用完资源后释放信号量

在Linux中，使用完资源后释放信号量`V`操作对应的接口是`sem_post`，该接口原型如下：

```c
int sem_post(sem_t *sem);
```

该接口的参数表示需要修改的信号量结构体

在抢票代码中，有两处使用完资源，第一处是`if`语句中走完抢票逻辑后，第二处是`else`语句中走完`break`之前，所以对应的代码如下：

```c++
void getTicket()
{
    while (true)
    {
        // 先申请信号量
        sem_wait(&sem);

        // 有票时，抢票，否则直接跳出循环
        if (tickets > 0)
        {
            usleep(1000);
            std::cout << "当前线程获取到一张票：" << tickets-- << std::endl;

            // 释放信号量
            sem_post(&sem);
        }
        else
        {
            // 释放信号量
            sem_post(&sem);

            break;
        }
    }
}
```

#### 销毁信号量

在Linux中，销毁信号量可以使用`sem_destroy`接口，该接口原型如下：

```c
int sem_destroy(sem_t *sem);
```

在主线程中销毁信号量：

```c++
int main()
{
    // ...

    sem_destroy(&sem);

    return 0;
}
```

#### 信号量与互斥锁间的关系

在上面的抢票代码中可以发现信号量和互斥锁非常类似，本质是因为互斥就是信号量为1的情况，一旦信号量不为1，那么此时若有多个线程同时获取信号量，只要信号量不为0，那么该线程就可以进入临界区，此时就满足了多个线程并发执行，所以当信号量为1时，互斥锁和信号量可以互换使用，但是更推荐使用互斥锁；信号量不为1时，为了满足并发执行，但又不希望资源被多个线程访问导致数据不一致问题，通常会在线程获取到信号量之后再通过互斥锁控制是否能够访问共享资源，这一点在接下来的[基于信号量的生产消费模型](https://www.help-doc.top/Linux/19.%20Linux%E7%BA%BF%E7%A8%8B/5.%20%E7%94%9F%E4%BA%A7%E8%80%85%E6%B6%88%E8%B4%B9%E8%80%85%E6%A8%A1%E5%9E%8B%EF%BC%88Producer-Consumer%20Model%EF%BC%89/5.%20%E7%94%9F%E4%BA%A7%E8%80%85%E6%B6%88%E8%B4%B9%E8%80%85%E6%A8%A1%E5%9E%8B%EF%BC%88Producer-Consumer%20Model%EF%BC%89.html#_13)中会有所体现

需要注意，信号量虽然存在等待队列，但是这个等待队列不能保证在多线程的情况下线程会按照等待队列的先进先出顺序抢到信号量

### 信号量的封装

信号量的封装也是对其使用的接口进行封装，代码如下：

```c++
class Sem
{
public:
    Sem(int val = 1)
    {
        sem_init(&_sem, 0, val);
    }

    // P操作
    void wait()
    {
        sem_wait(&_sem);
    }

    // V操作
    void signal()
    {
        sem_post(&_sem);
    }

    ~Sem()
    {
        sem_destroy(&_sem);
    }

private:
    sem_t _sem;
};
```

同样的，对于信号量也可以采用RAII的思想：

```c++
class SemGuard
{
public:
    SemGuard(Sem &sem)
        : _sem(sem)
    {
        _sem.wait();
    }

    ~SemGuard()
    {
        _sem.signal();
    }

private:
    Sem &_sem;
};
```