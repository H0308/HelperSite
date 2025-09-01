<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Linux线程池

## 线程池介绍

线程池是一种线程使用模式。线程过多会带来调度开销，进而影响缓存局部性和整体性能。而线程池维护着多个线程，等待着监督管理者分配可并发执行的任务。这避免了在处理短时间任务时创建与销毁线程的代价。线程池不仅能够保证内核的充分利用，还能防止过分调度。可用线程数量应该取决于可用的并发处理器、处理器内核、内存、网络套接字等的数量

在实际开发中，线程池一般会用在一些特定的应用场景，例如：

1. 需要大量的线程来完成任务，且完成任务的时间比较短。比如Web服务器完成网页请求这样的任务，使用线程池技术是非常合适的。因为单个任务小，而任务数量巨大，你可以想象一个热门网站的点击次数。但对于长时间的任务，比如一个Telnet连接请求，线程池的优点就不明显了。因为Telnet会话时间l比线程的创建时间大多了
2. 对性能要求苛刻的应用，比如要求服务器迅速响应客户请求
3. 接受突发性的大量请求，但不至于使服务器因此产生大量线程的应用。突发性大量客户请求，在没有线程池情况下，将产生大量线程，虽然理论上大部分操作系统线程数目最大值不是问题，短时间内产生大量线程可能使内存到达极限，出现错误

线程池种类一般有下面两种：

1. 创建固定数量线程池，循环从任务队列中获取任务对象，获取到任务对象后，执行任务对象中的任务接口
2. 浮动线程池，即线程池个数不固定，其他操作方式与固定数量线程池一致

本次线程池的设计考虑设计固定数量的线程池

## 设计线程池

线程池本质就是一个接收任务并执行任务的结构，所以主要功能就是实现接收任务和执行任务，基本示意图如下：

<img src="8. Linux线程池.assets\download.png">

根据前面对生产消费模型的学习可以发现，线程池的本质就是一个生产消费模型，所以基本思路可以参考生产消费模型，即提供一个接口负责接收任务，对应地将任务存储到单独的一个容器（本次称任务队列）中，之后线程池中的线程只需要从任务队列中取出任务并执行即可

本次设计线程池主要先实现基础版本，再在基础版本之上修改为单例版

## 实现基础线程池

注意，实现线程池的代码会涉及到前面封装的[线程库](https://www.help-doc.top/Linux/linux-thread/thread-lib/thread-lib.html#_4)、[互斥锁](https://www.help-doc.top/Linux/linux-thread/thread-sync/thread-sync.html#_6)、[条件变量](https://www.help-doc.top/Linux/linux-thread/thread-sync/thread-sync.html#_10)以及实现的[日志系统](https://www.help-doc.top/Linux/linux-thread/log/log.html#_1)

### 创建线程

既然是线程池，那么其内部肯定需要维护一定数量的线程个数，所以在设计上考虑设置一个参数允许用户指定线程池中的线程个数，并且也提供一个默认值允许用户指定使用而不需要手动提供个数，对应地需要一个成员变量用来保存线程池中的线程个数

线程池中有多个线程，那么在线程池内部就需要对这些线程进行管理，本次考虑使用vector容器对这些线程进行管理

有了线程个数和线程管理结构，接下来就是创建线程。本次考虑在构造线程池时就创建指定个数个线程，因为创建线程需要指定其指定的任务，并且便于接受多种任务类型，所以本次考虑将任务类型设置为模版类型。因为任务肯定不止一个，所以也需要一个结构对任务进行管理，本次考虑使用queue容器进行管理

线程池基本结构如下：

```c++
const int d_num = 5; // 默认线程个数

void test()
{
}

template <class T>
class ThreadPool
{
public:
    ThreadPool(int num = d_num)
        : _num(num)
    {
        // 创建指定个数个线程
        for (int i = 0; i < _num; i++)
        {
            _threads.push_back(Thread(test)); // 创建并组织线程，假设当前线程的任务为test

            LOG(LogLevel::INFO) << "创建线程：" << _threads.back().getName();
        }
    }

private:
    std::vector<Thread> _threads; // 组织所有线程
    size_t _num;                  // 线程个数
    std::queue<T> _tasks;         // 任务队列
};
```

### 启动线程

启动线程首先要做的就是检查线程池是否是启动状态，所以此时需要添加一个成员`_isRunning`用于表示线程池当前的运行状态，`true`表示正常运行，`false`表示结束运行

在启动线程前首先要做的就是检查当前线程池是否是处于运行状态，如果是，则直接返回，否则就启动所有线程

启动所有线程之前先设置`_isRunning`为`true`表示当前线程池开始运行

!!! note

    需要注意，不要在启动完线程之后再更改`_isRunning`值，具体原因见实现线程[获取并执行任务](https://www.help-doc.top/Linux/linux-thread/thread-pool/thread-pool.html#_isrunning)部分

参考代码：

```c++
// 启动线程
void startThreads()
{
    // 如果当前线程池已经处于运行状态，则不再重复启动
    if (_isRunning)
        return;

    // 否则启动线程池中的所有线程
    _isRunning = true;

    for (auto &thread : _threads)
    {
        thread.start();
        
        LOG(LogLevel::INFO) << "当前线程：" << thread.getName() << "启动";
    }
}
```

### 回收线程

回收线程就是简单的等待逻辑，参考代码如下：

```c++
// 回收线程
void waitThreads()
{
    for (auto &thread : _threads)
    {
        thread.join();

        LOG(LogLevel::INFO) << "当前线程：" << thread.getName() << "被回收";
    }
}
```

### 插入任务

插入任务本质就是生产消费模型中的生产，所以基本思路与生产消费模型非常类似，为了防止有多个线程同时向任务队列中插入数据导致线程安全问题，在插入任务之前需要先申请锁，再执行任务插入。为了提高任务插入的效率，可以考虑在将任务作为参数传递给容器时使用`move`函数将左值转换为右值，对应的参数部分的类型也设置为右值引用，减少不必要的拷贝操作：

```c++
// 插入任务
void pushTasks(T &&task)
{
    MutexGuard guard(_lock);

    // 插入任务
    _tasks.push(std::move(task));
}
```

基本逻辑实现完毕后，下面考虑细节问题：

如果线程池当前已经将`_isRunning`设定为了`false`，那么就代表当前线程池已经结束运行，既然线程池已经结束运行，就不可能还支持插入任务，所以插入任务之前还需要判断`_isRunning`是否为`true`，所以完整的代码如下：

```c++
// 插入任务
void pushTasks(T &&task)
{
    MutexGuard guard(_lock);

    // 线程池结束，不允许插入任务
    if (!_isRunning)
        return;

    // 插入任务
    _tasks.push(std::move(task));
}
```

!!! note

    剩余逻辑补充见[获取并执行任务](https://www.help-doc.top/Linux/linux-thread/thread-pool/thread-pool.html#_10)部分

### 获取并执行任务

#### 基本逻辑

因为线程池中的线程本身的目的就是执行任务，所以用户只需要向线程池中插入任务而不需要考虑任务具体如何执行的，所以插入任务作为开放接口，而获取并执行任务就设置为私有接口供线程池内部的线程访问：

```c++
private:
    // 获取并执行任务
    void get_executeTasks()
    {
    }
```

执行任务的逻辑与生产消费模型中的消费逻辑非常类似，即从任务队列中取出数据执行，如果没有任务就等待，所以为了保证一次只会有一个线程访问任务队列，还需要对获取任务部分进行加锁。同样，除了加锁以外，还需要让线程在没有任务的时候等待任务保证有序和高效

需要注意的是，加锁只需要考虑获取任务的时候，而不需要考虑在线程得到任务后加锁（即线程开始执行任务时不需要加锁），所以函数基本逻辑如下：

```c++
private:
    // 判断任务队列是否为空
    bool isEmpty()
    {
        return _tasks.empty();
    }

    // 获取并执行任务
    void get_executeTasks()
    {
        while (true)
        {
            T t;
            {
                // 申请锁
                MutexGuard guard(_lock);
                while (isEmpty())
                {
                    _wait_num++;
                    _cond.wait(_lock);
                    _wait_num--;
                }

                // 此时存在任务，取出任务
                t = _tasks.front();
                _tasks.pop();
            }

            // 执行任务之前确保已经释放互斥锁
            t();
        }
    }
```

#### 补充插入任务部分的逻辑

既然没有任务时线程会进入等待，那么一旦插入任务成功，此时任务队列肯定有任务，根据生产消费模型的经历，此时就需要唤醒一个线程进行任务的执行：

```c++
// 插入任务
void pushTasks(T &&task)
{
    // ...

    // 插入任务
    // ...

    // 有任务时唤醒指定线程执行任务
    if (_wait_num > 0)
        _cond.notify();
}
```

#### 细节问题

实现完基本逻辑后，下面考虑细节问题：

从前面的生产消费模型的消费逻辑来看，上面代码并没有明显问题，但是本次实现中使用到了一个变量`_isRunning`，那么如果线程池的`_isRunning`为`false`时代表线程池已经结束，那么既然线程池已经结束，就没有必要再进入`while`逻辑中等待任务，所以除了判断任务队列是否为空以外还需要判断`_isRunning`是否为`true`才让线程进入等待逻辑，所以代码修改如下：

```c++
// 获取并执行任务
void get_executeTasks()
{
    while (true)
    {
        // ...
        {
            // ...
            while (isEmpty() && _isRunning)
            {
                _wait_num++;
                _cond.wait(_lock);
                _wait_num--;
            }

            // ...
        }
    }

    // ...
}
```

如果当前`_isRunning`为`false`，说明线程池已经结束，根据插入任务函数中的逻辑，如果`_isRunning`为`false`就不会继续向任务队列插入任务，那么如果线程发现当前任务队列为空并且`_isRunning`为`false`就没有必要再继续执行循环了，因为继续等待也不会有任务进来，所以在取出任务之前还需要判断当前任务队列是否为空且线程池已经结束作为线程不需要再获取任务的判断：

```c++
// 获取并执行任务
void get_executeTasks()
{
    while (true)
    {
        {
            // ... 
            while (isEmpty() && _isRunning)
            {
                // ...
            }

            // 任务队列为空且线程池已经结束直接退出
            if (isEmpty() && !_isRunning)
                break;

            // ...
        }

        // ...
    }
}
```

#### 为什么启动线程时需要将`_isRunning`放在启动线程之前

因为默认情况下`_isRunning`是`false`，如果一个线程启动完成，那么该线程必定会进入获取并执行任务函数`get_executeTasks`，当`_isRunning`为`false`时，`while (isEmpty() && _isRunning)`中的判断就是`false`，此时线程就不会进入等待队列，而是执行下面的`if (isEmpty() && !_isRunning)`，此时就直接跳出了循环并结束了运行，但是此时并不符合逻辑，因为线程池一旦运行起来后，只要没有任务，所有线程就必须要处于等待直到有任务来时执行任务，所以启动线程时需要将`_isRunning`放在启动线程之前

#### 修改线程默认执行函数

线程池中的线程本质就是生产消费模型中的消费者，所以执行函数就是获取任务并执行，即执行函数为`get_executeTasks`，但是这个函数存在一个参数`this`，而在封装的线程库中的任务类型为`void()`，此时可以考虑使用`bind`将`this`参数绑定到`get_executeTasks`中，而不是通过额外的方式传递：

!!! note

    注意`bind`函数中指定函数需要取地址

```c++
ThreadPool(int num = d_num)
    // ...
{
    // 创建指定个数个线程
    for (int i = 0; i < _num; i++)
    {
        _threads.push_back(Thread(std::bind(&ThreadPool<T>::get_executeTasks, this))); // 创建并组织线程，假设当前线程的任务为test

        // ...
    }
}
```

### 结束线程池

结束线程池首先就是要判断当前线程池是否在运行，如果没有运行就直接返回。结束线程池首先就是先结束线程，在前面学习线程时，结束线程都是不考虑线程是否执行完任务或者线程是否处于等待就强行结束线程，但是在线程池部分必须要考虑到这两点，另外所以结束线程池的基本步骤是：

1. 检查线程池是否处于运行状态，即`_isRunning`
2. 修改线程池的`_isRunning`为`false`
3. 唤醒所有线程执行完任务队列中剩余的函数

因为在上面插入任务的逻辑中，一旦`_isRunning`为`false`，那么就不会再插入新的任务，而在获取并执行任务函数中只有任务队列为空且`_isRunning`为`false`线程才会退出，所以此时唤醒所有的线程去执行任务队列中的任务就达到了线程执行完任务后才退出的效果

所以基本代码如下：

```c++
// 结束线程
void stopThreads()
{
    // 确保线程池处于运行状态
    if (_isRunning)
    {
        // 修改线程池运行状态，确保不会再有任务插入
        _isRunning = false;

        // 唤醒所有线程
        if (_wait_num > 0)
            _cond.notifyAll();
    }
}
```

## 测试基础线程池

首先创建一个任务，以下面的任务为主：

```c++
using task_t = std::function<void()>;

void check()
{
    LOG(LogLevel::DEBUG) << "测试check函数";
}
```

测试主函数如下：

```c++
#include "ThreadPool.hpp"
#include "tasks.hpp"

using namespace ThreadPoolModule;

int main()
{
    ThreadPool<task_t> thread_pool;

    thread_pool.startThreads();

    int count = 10;
    while (count--)
    {
        thread_pool.pushTasks(check);
        sleep(1);
    }

    thread_pool.stopThreads();

    thread_pool.waitThreads();

    return 0;
}
```

对应的控制台输出如下：

```c++
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [73] - 创建线程：Thread0
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [73] - 创建线程：Thread1
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [73] - 创建线程：Thread2
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [73] - 创建线程：Thread3
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [73] - 创建线程：Thread4
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [109] - 当前线程：Thread0启动
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [109] - 当前线程：Thread1启动
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [109] - 当前线程：Thread2启动
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [109] - 当前线程：Thread3启动
[2025-02-20 22-03-30] [INFO] [6866] [ThreadPool.hpp] [109] - 当前线程：Thread4启动
[2025-02-20 22-03-30] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-31] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-32] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-33] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-34] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-35] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-36] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-37] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-38] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-39] [DEBUG] [6866] [tasks.hpp] [12] - 测试check函数
[2025-02-20 22-03-40] [INFO] [6866] [ThreadPool.hpp] [119] - 当前线程：Thread0被回收
[2025-02-20 22-03-40] [INFO] [6866] [ThreadPool.hpp] [119] - 当前线程：Thread1被回收
[2025-02-20 22-03-40] [INFO] [6866] [ThreadPool.hpp] [119] - 当前线程：Thread2被回收
[2025-02-20 22-03-40] [INFO] [6866] [ThreadPool.hpp] [119] - 当前线程：Thread3被回收
[2025-02-20 22-03-40] [INFO] [6866] [ThreadPool.hpp] [119] - 当前线程：Thread4被回收
```

## 线程安全的单例模式

在[特殊类设计](https://www.help-doc.top/cpp/special-class-design/special-class-design.html#_6)部分提到单例模式，主要分为饿汉模式和懒汉模式。但是当前的单例模式并没有考虑到多线程情况下的线程安全问题，下面以懒汉模式为例：

基本的懒汉模式设计如下：

```c++
// 懒汉模式
class Singleton
{
public:
    Singleton()
    {}

    static Singleton& getInstance()
    {
        if (_p == nullptr)
            _p = new Singleton;
        return *_p;
    }

    Singleton(const Singleton& s) = delete;
    Singleton& operator=(const Singleton& s) = delete;
private:
    static Singleton* _p;
};

// 确保指针只能被初始化一次
Singleton* Singleton::_p = nullptr;
```

首先就是在访问单例对象指针之前进行加锁，确保同一时刻只有一个线程正在访问该指针：

```c++
class Singleton
{
public:
    Singleton()
    {}

    static Singleton& getInstance()
    {
        {
            MutexGuard guard(_lock);
            if (!_p)
                _p = new Singleton;
        }
        
        return *_p;
    }

    // ...
private:
    static Singleton* _p;

    static Mutex _lock;
};

// 初始化单例锁
Mutex Singleton::_lock;
```

但是，如果已经存在一个单例对象，那么有很多个线程再进入判断就需要先抢锁，此时就会导致效率降低，所以为了在一定程度上提高效率可以在抢锁之前先判断单例对象指针是否为空：

```c++
static Singleton& getInstance()
{
    if(!_p)
    {
        MutexGuard guard(_lock);
        if (!_p)
            _p = new Singleton;
    }
    
    return *_p;
}
```

这样做哪怕在一开始判断`_p`时存在线程安全问题，甚至考虑极端情况所有线程都进入了第一个`if`也不会直接创建对象，而是依旧要抢锁，这样做既保证了线程安全也保证了一定的效率

## 单例线程池

在实际开发中主要还是以懒汉模式为主，所以本次修改的单例线程池也是基于懒汉模式

根据前面对懒汉模式的介绍，需要有一个静态的当前类对象指针指向创建出的对象实例，并且不允许外部通过多次创建、拷贝、赋值的方式创建对象，所以需要对线程池的构造函数进行私有化，并且禁用拷贝和赋值构造函数，既如下代码：

```c++
template <class T>
class ThreadPool
{
private:
    // 私有构造函数
    ThreadPool(int num = d_num)
        : _num(num), _isRunning(false)
    {
        // 创建指定个数个线程
        for (int i = 0; i < _num; i++)
        {
            _threads.push_back(Thread(std::bind(&ThreadPool<T>::get_executeTasks, this))); // 创建并组织线程，假设当前线程的任务为test

            // 打印相关日志
            LOG(LogLevel::INFO) << "创建线程：" << _threads.back().getName();
        }
    }

    // 禁用拷贝和赋值
    ThreadPool(const ThreadPool &tp) = delete;
    ThreadPool &operator=(ThreadPool &tp) = delete;

public:

    // ...

private:
    // ...
    static Mutex _s_lock;                          // 静态单例锁
    static std::shared_ptr<ThreadPool<T>> _tp_ptr; // 单例线程池对象指针
};

// 初始化指针
template <typename T>
std::shared_ptr<ThreadPool<T>> ThreadPool<T>::_tp_ptr = nullptr;

// 初始化单例锁
template <typename T>
Mutex ThreadPool<T>::_s_lock;
```

根据上面对线程安全的单例模式的介绍，可以考虑下面的设计步骤：

首先就是判断单例线程池对象指针不为空之前需要加锁，确保一次只有一个线程访问单例线程池对象指针，所以基本逻辑如下：

!!! note

    注意不要使用`make_shared`，因为`make_shared`会调用构造函数，此时构造函数是私有的，所以会报错

```c++
// 获取线程池对象
static std::shared_ptr<ThreadPool<T>> getInstance(int num = d_num)
{
    {
        MutexGuard guard(_s_lock);
        if (!_tp_ptr)
        {
            _tp_ptr = std::shared_ptr<ThreadPool<T>>(new ThreadPool<T>(num));
        }
    }
    return _tp_ptr;
}
```

但是，如果是多次创建线程池对象，那么也需要先抢锁才能知道不能创建对象，那么此时就会存在性能消耗，所以为了尽可能保证效率，可以考虑在抢锁之前判断一次单例线程池对象指针是否为空，如果为空，那么才开始抢锁，否则直接返回已有的指针：

```c++
// 获取线程池对象
static std::shared_ptr<ThreadPool<T>> getInstance(int num = d_num)
{
    if (!_tp_ptr)
    {
        MutexGuard guard(_s_lock);
        // ...
    }
    return _tp_ptr;
}
```

对应的测试函数修改如下：

```c++
#include "ThreadPool.hpp"
#include "tasks.hpp"

using namespace ThreadPoolModule;

int main()
{
    ThreadPool<task_t>::getInstance()->startThreads();


    int count = 10;
    while (count--)
    {
        ThreadPool<task_t>::getInstance()->pushTasks(check);
        sleep(1);
    }

    ThreadPool<task_t>::getInstance()->stopThreads();

    ThreadPool<task_t>::getInstance()->waitThreads();

    return 0;
}
```