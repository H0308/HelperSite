<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 读者写者问题与读写锁

## 何为读者写者问题

读者写者问题是并发编程中的一个经典问题，它描述了如何在多个线程（或进程）同时访问共享资源时，允许多个读者并发读取但要求写者独占访问的情况。也就是说，在没有写操作时，多个线程可以同时读取共享数据，而写操作则必须保证在写入期间没有其他读者或写者在访问共享资源

## 读者写者问题与生产消费模型

读者写者问题非常类似于前面的生产消费模型，其也存在「321」原则：

1. 3种关系：读者与读者、写者与写者和读者与写者
2. 2种角色：读者和写者
3. 1个交易场所

其中写者和写者之间的的关系与读者和写者之间的关系与生产消费模型一致，分别是互斥与互斥和同步，唯一不同的就是读者和读者之间的关系并不同于生产消费模型中消费者和消费者之间的关系

在生产消费模型中，每一个消费者都会对交易场所存在的数据进行取出，如果不使用互斥，那么肯定会存在两个线程访问到同一个数据导致同一个数据被多次取出的问题，所以需要使用互斥来避免。但是在读者写者问题中，读者仅仅是读交易场所的数据，这个行为并不会影响已有数据的个数，所以可以允许多个读者并发访问共享资源。这就是生产消费模型和读者写者问题二者最主要的区别

## 读者和写者如何完成同步与互斥

读者和写者之间的配合可以按照下面的伪代码去理解：

=== "公共资源"

    ```c++
    int reader_count = 0; // 读者计数器
    lock_t count_lock; // 读者锁——用于保护更改计数器的临界区
    lock_t writer_lock; // 写者锁
    ```

=== "读者"

    ```c++
    // 加锁
    lock(count_lock); // 修改读者计数器前先申请锁

    // 只要有一个读者过来，那么此时写者就不可以再写
    if(reader_count == 0)
        lock(writer_lock); // 拿走写者的锁
    ++reader_count;
    unlock(count_lock); // 释放读者锁

    // 读取

    //解锁
    lock(count_lock);
    --reader_count;

    // 当最后一个读者离开时，释放写者锁，此时写者可以继续写
    if(reader_count == 0)
        unlock(writer_lock);

    unlock(count_lock);
    ```

=== "写者"

    ```c++
    // 写入之前先申请锁
    lock(writer_lock);
    // 写入
    unlock(writer_lock);
    ```

## 读写锁

在编写多线程的时候，有一种情况是十分常见的：有些公共数据修改的机会比较少。相比较改写，它们读的机会反而高的多。通常而言，在读的过程中，往往伴随着查找的操作，中间耗时很长。给这种代码段加锁，会极大地降低当前程序的效率，所以此时就需要用到读者写者问题的逻辑，即读写锁。在读者写者问题中，读写锁有下面的几种行为：

| 当前锁状态 | 读锁请求 | 写锁请求 |
| ---------- | -------- | -------- |
| 无锁       | 可以     | 可以     |
| 读锁       | 可以     | 阻塞     |
| 写锁       | 阻塞     | 阻塞     |

在上面的表格中，如果没有锁，那么读者和写者就是正常的访问共享资源，此时肯定会涉及到线程安全问题；如果当前是读锁，那么根据读者写者问题的特点：读者可以并发访问，所以就算有多个读者，这些读者也不会因为有一个读者已经正在读而被阻塞在获取锁的部分；如果当前是写锁，那么为了保证同一个时刻只有一个线程可以写入，就必须保证一旦有一个线程持有写者锁，其他线程必须阻塞等待，这样才可以防止并发写入导致数据出现问题

在实际开发中，因为`pthread`库本身已经封装了相关的接口，所以不需要程序员手动实现读写锁的逻辑，常见的接口如下：

**设置读者和写者优先权**

在读者写者问题中，如果写者先写，那么如果写者多，读者少，就会有极大概率出现读者饥饿问题。同样地，如果读者先读，那么如果读者多，写者少，就会有极大概率出现写者饥饿问题。可见，不论是那一方优先，总会有一方可能存在饥饿问题，所以读者写者问题中，「有一方可能存在饥饿问题」是读者写者问题的特性而不是一个明显问题

在Linux中想指定哪一方优先，就可以使用`pthread_rwlockattr_setkind_np`接口，该接口原型如下：

```c
int pthread_rwlockattr_setkind_np(pthread_rwlockattr_t *attr, int pref);
```

在上面的接口中，第一个参数表示读写锁属性，第二个参数表示标记，有3种选择：

1. `PTHREAD_RWLOCK_PREFER_READER_NP`：读者优先，也是Linux系统的默认值
2. `PTHREAD_RWLOCK_PREFER_WRITER_NP`：写者优先（但是可能存在问题，导致与第一种情况一样）
3. `PTHREAD_RWLOCK_PREFER_WRITER_NONRECURSIVE_NP`：写者优先，但是写者不能递归加锁

**初始化读写锁**

在Linux中，初始化读写锁可以使用`pthread_rwlock_init`，其原型如下：

```c
int pthread_rwlock_init(pthread_rwlock_t * rwlock,
              const pthread_rwlockattr_t * attr);
```

该接口第一个参数表示读写锁类型，第二个参数表示读写锁属性

**读者加锁**

在Linux中，使用`pthread_rwlock_rdlock`接口对读者进行加锁，其原型如下：

```c
int pthread_rwlock_rdlock(pthread_rwlock_t *rwlock);
```

**写者加锁**

在Linux中，使用`pthread_rwlock_wrlock`接口对写者进行加锁，其原型如下：

```c
int pthread_rwlock_wrlock(pthread_rwlock_t *rwlock);
```

**解锁**

虽然读者加锁和写者加锁是两个接口，但是解锁只有一个接口：`pthread_rwlock_unlock`，其原型如下：

```c
int pthread_rwlock_unlock(pthread_rwlock_t *rwlock);
```

**销毁读写锁**

使用`pthread_rwlock_destroy`接口对读写锁进行销毁，其原型如下：

```c
int pthread_rwlock_destroy(pthread_rwlock_t *rwlock);
```

## 使用示例

读写锁使用示例参考下面的代码：

```c++
#include <iostream>
#include <pthread.h>
#include <unistd.h>
#include <vector>
#include <cstdlib>
#include <ctime>

// 共享资源
int shared_data = 0;

// 读写锁
pthread_rwlock_t rwlock;

// 读者线程函数
void *Reader(void *arg)
{
    //sleep(1); //读者优先，一旦读者进入&&读者很多，写者基本就很难进入了
    int number = *(int *)arg;
    while (true)
    {
        pthread_rwlock_rdlock(&rwlock); // 读者加锁
        std::cout << "读者-" << number << " 正在读取数据, 数据是: " << shared_data << std::endl;
        sleep(1);                       // 模拟读取操作
        pthread_rwlock_unlock(&rwlock); // 解锁
    }
    delete (int*)arg;
    return NULL;
}

// 写者线程函数
void *Writer(void *arg)
{
    int number = *(int *)arg;
    while (true)
    {
        pthread_rwlock_wrlock(&rwlock); // 写者加锁
        shared_data = rand() % 100;     // 修改共享数据
        std::cout << "写者- " << number << " 正在写入. 新的数据是: " << shared_data << std::endl;
        sleep(2);                       // 模拟写入操作
        pthread_rwlock_unlock(&rwlock); // 解锁
    }
    delete (int*)arg;
    return NULL;
}

int main()
{
    srand(time(nullptr)^getpid());
    pthread_rwlock_init(&rwlock, NULL); // 初始化读写锁

    // 可以更改读写数量配比
    const int reader_num = 2;
    const int writer_num = 2;
    const int total = reader_num + writer_num;
    pthread_t threads[total]; // 假设读者和写者数量相等

    // 创建读者线程
    for (int i = 0; i < reader_num; ++i)
    {
        int *id = new int(i);
        pthread_create(&threads[i], NULL, Reader, id);
    }

    // 创建写者线程
    for (int i = reader_num; i < total; ++i)
    {
        int *id = new int(i - reader_num);
        pthread_create(&threads[i], NULL, Writer, id);
    }

    // 等待所有线程完成
    for (int i = 0; i < total; ++i)
    {
        pthread_join(threads[i], NULL);
    }

    pthread_rwlock_destroy(&rwlock); // 销毁读写锁

    return 0;
}
```

上面的代码直接运行会发现读者一直在读，而写者一直没有机会写导致出现饥饿问题，这也符合Linux默认读者优先的特点

## 读者优先与写者优先

**读者优先(Reader-Preference)**

在这种策略中，系统会尽可能多地允许多个读者同时访问资源（比如共享文件或数据），而不会优先考虑写者。这意味着当有读者正在读取时，新到达的读者会立即被允许进入读取区，而写者则会被阻塞，直到所有读者都离开读取区。读者优先策略可能会导致写者饥饿（即写者长时间无法获得写入权限），特别是当读者频繁到达时

**写者优先(Vriter-Preference)**

在这种策略中，系统会优先考虑写者。当写者请求写入权限时，系统会尽快地让写者进入写入区，即使此时有读者正在读取。这通常意味着一旦有写者到达，所有后续的读者都会被阻塞，直到写者完成写入并离开写入区。写者优先策略可以减少写者等待的时间，但可能会导致读者饥饿（即读者长时间无法获得读取权限），特别是当写者频繁到达时