# Java多线程

!!! note
    本章中的概念部分都只是为了后面的程序执行更好理解，更深层的概念移步到[Linux进程部分](https://www.help-doc.top/Linux/process-basic/process-basic.html)

## 线程与进程基本介绍

进程：在内存中运行的程序实例，一般一个程序代表一个进程

线程：进程中最小的执行单元，一般线程负责进程中程序的运行，一个线程至少存在一个线程，也可以有多个线程，当存在多个线程时，一般称为多线程程序

!!! note
    可以简单理解为：当一个程序加载到内存中后就会开启一个进程，当程序需要执行某一个功能时就会开辟一个线程，该线程就是程序与CPU交流的通道，一个功能对应着一个线程，一个线程对应着一个通道

## 并发和并行基本介绍

并行：在同一个时刻，多个CPU（多核CPU）同时执行指令任务

并发：在同一个时刻，一个CPU执行多个指令任务

!!! note

    在CPU是单核时，CPU看似在同一时刻执行多个任务，实际上是CPU在执行任务中进行的高速切换，因为速度快所以人很难感知到任务执行的先后顺序
    
    现在CPU基本上都是多核，可以理解为多个CPU，所以可以同一时间处理多个任务，每一个CPU管一个任务，但是依旧存在着高速切换，只是频率相对于单核CPU会变小，所以现在的CPU在执行指令时一般都是并行和并发同时存在

## CPU调度基本介绍

CPU调用一般分为两种：

1. 分时调度：让所有线程轮流获取到CPU的调度权，并且相对平均分配每个线程占用的CPU时间片
2. 抢占式调度：多个线程轮流抢占CPU的使用权（哪个线程抢到了CPU的使用权，哪个线程先执行），一般都是优先级高的线程抢到的概率大，但不代表使用权一定属于优先级高的线程

!!! note
    Java程序都是抢占式调用

## 主线程基本介绍

主线程：CPU和内存之间专门为Java中的`main`函数服务开辟的线程

## 创建线程对象与相关方法

在Java中，创建线程对象常见的有两种方式：

1. 普通类继承`Thread`类，重写`Thread`中的`run`方法
2. 普通类实现`Runnable`接口，重写接口中的`run`方法

### （一）继承`Thread`类创建线程对象

继承`Thread`类后重写`Thread`中的`run`方法，该方法用于线程中执行的任务，例如循环等。创建完自定义线程类后就可以通过自定义类创建一个线程对象，使用该对象调用`start()`方法启动线程，例如：

=== "自定义线程类"

    ```java
    public class Thread01 extends Thread {
        @Override
        public void run() {
            for (int i = 0; i < 10; i++) {
                System.out.println("Thread01..." + i);
            }
        }
    }
    ```

=== "主线程"

    ``` java
    public class Test {
        public static void main(String[] args) {
            // 创建自定义线程类对象
            Thread01 t1 = new Thread01();
            // 调用start方法启动线程
            t1.start();

            // 在主线程中执行其他任务
            for (int i = 0; i < 10; i++) {
                System.out.println("main..." + i);
            }
        }
    }
    ```

因为Java程序都是抢占式调用，所以会出现交替执行的情况，也会出现主线程先执行完，再执行自定义线程的任务

!!! note
    需要注意，不要对同一个线程对象多次调用`start`方法，也不要显式调用`run`方法，直接调用`run`方法就不会被认为是线程启动执行任务

### `Thread`类中常用的方法

1. `void start()`方法：启动进程，JVM会自动调用对应线程的`run`方法
2. `void run()`方法：设置线程中的任务，该方法是`Thread`类实现了`Runnable`接口后重写的方法
3. `String getName()`方法：获取调用对象的线程名称，默认情况下线程名称组成为：`Thread+编号`
4. `void setName(String name)`方法：设置调用对象的线程名称
5. `static Thread currentThread()`：获取当前已经获取到CPU使用权的线程
6. `static void sleep(long millis)`：设置线程睡眠，参数表示睡眠毫秒数

!!! note

    需要注意，`Thread`中的`sleep`方法会抛出异常，如果在自定义线程类中使用`sleep`方法时，不可以使用`throws`处理异常，只能使用`try...catch`，但是如果在主线程则可以直接使用

基本使用实例：

```java
// 自定义线程
public class Thread01 extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(getName() + "..." + i);
        }
    }
}

// 主线程
public class Test {
    public static void main(String[] args) throws InterruptedException {
        // 创建自定义线程类对象
        Thread01 t1 = new Thread01();
        // 调用start方法启动线程
        t1.start();

        // 在主线程中执行其他任务
        for (int i = 0; i < 10; i++) {
            Thread.sleep(1000L);
            System.out.println(Thread01.currentThread().getName() + "..." + i);
        }
    }
}
```

### `Thread`类中关于线程优先级的方法

1. `void setPriority(int newPriority)`：设置调用对象的线程优先级，线程优先级越高，抢到CPU使用权的概率越大，但是概率大不代表一定可以抢到。Java中线程优先级有10个等级，其中1表示最小优先级，10表示最大优先级，默认优先级为5
2. `int getPriority()`：获取调用对象的线程优先级

基本使用示例：

```java
// 自定义线程类
public class Thread01 extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(getName() + "..." + i);
        }
    }
}

// 主线程
public class Test {
    public static void main(String[] args) throws InterruptedException {
        // 创建自定义线程类对象
        Thread01 t1 = new Thread01();
        Thread01 t2 = new Thread01();
        // 设置/获取线程优先级
        t1.setPriority(1);
        t2.setPriority(10);
        System.out.println("t1.getPriority() = " + t1.getPriority());
        System.out.println("t2.getPriority() = " + t2.getPriority());
        // 调用start方法启动线程
        t1.start();
        t2.start();
    }
}
```

### 守护线程与`Thread`类中关于守护线程的方法

守护进程：守护线程表示当前线程的任务会随着所有非守护线程结束而结束，但是在非守护线程结束时，守护线程一般不会是立即结束，因为在非守护线程结束时需要与守护线程进行结束信号的通信，这段时间中守护线程依旧在执行

!!! note
    需要注意，当出现一个守护线程，多个非守护线程时，守护线程会等到所有非守护线程结束才会结束

在Java中，可以使用`void setDaemon(boolean on)`将调用对象所在的线程设置为守护线程或者取消设置守护线程，参数取值只有两种：`true`（开启守护线程）和`false`（关闭守护线程）

基本使用实例：

```java
// 自定义线程
public class Thread01 extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {

            System.out.println(getName() + "..." + i);
        }
    }
}

// 主线程
public class Test {
    public static void main(String[] args) throws InterruptedException {
        // 创建自定义线程类对象
        Thread01 t1 = new Thread01();
        Thread01 t2 = new Thread01();

        // 设置t1进程为守护进程
        t1.setDaemon(true);
        // 调用start方法启动线程
        t1.start();
        t2.start();

        // 在主线程中执行其他任务
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread01.currentThread().getName() + "..." + i);
        }
    }
}
```

### 礼让线程与`Thread`类中关于礼让线程的方法

礼让线程：默认情况下Java的线程对CPU使用权是抢占式，而礼让线程是为了让正在抢夺使用权的线程尽可能相对平衡（不是绝对平衡），从而达到二者交替执行

在Java中，设置礼让线程的方法为：`static void yield()`

基本使用实例：

=== "自定义线程"

    ```java
    public class Thread01 extends Thread {
        @Override
        public void run() {
            for (int i = 0; i < 10; i++) {
                // 设置礼让线程
                Thread.yield();
                System.out.println(getName() + "..." + i);
            }
        }
    }
    ```

=== "主线程"

    ```java
    public class Test {
        public static void main(String[] args) throws InterruptedException {
            // 创建自定义线程类对象
            Thread01 t1 = new Thread01();
            Thread01 t2 = new Thread01();
            // 调用start方法启动线程
            t1.start();
            t2.start();
        }
    }
    ```

### 插入线程与`Thread`类中关于插入线程的方法

插入线程：让调用对象所在线程尽可能优先执行完，再执行其他进程

在Java中对应插入线程的方法为：`void join()`

基本使用实例：

=== "自定义线程"

    ```java
    public class Thread01 extends Thread {
        @Override
        public void run() {
            for (int i = 0; i < 10; i++) {
                System.out.println(getName() + "..." + i);
            }
        }
    }
    ```

=== "主线程"

    ```java
    public class Test {
        public static void main(String[] args) throws InterruptedException {
            // 创建自定义线程类对象
            Thread01 t1 = new Thread01();
            Thread01 t2 = new Thread01();

            // 调用start方法启动线程
            t1.start();
            // 阻塞当前线程，等待t1线程执行完毕
            t1.join();

            // 在主线程中执行其他任务
            for (int i = 0; i < 10; i++) {
                System.out.println(Thread01.currentThread().getName() + "..." + i);
            }
        }
    }
    ```

### （二）实现`Runnable`接口创建线程对象

本方法创建线程对象与继承`Thread`方式类似，但因为`Runnable`是接口，所以必须重写对应的`run`方法，使用实现类创建对象（目前不是线程对象），将该对象使用`Thread`中的构造方法：`Thread(Runnable target)`创建线程对象

=== "自定义线程"

    ```java
    public class Runnable01 implements Runnable{
        @Override
        public void run() {
            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName() + "..." + i);
            }
        }
    }
    ```

=== "主线程"

    ```java
    public class Test01 {
        public static void main(String[] args) {
            // 创建实现类对象
            Runnable01 r = new Runnable01();
            // 实现类通过Thread构造函数创建线程类对象
            Thread t1 = new Thread(r);

            t1.start();

            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName()+"..."+i);
            }
        }
    }
    ```

如果想为线程设置名字，可以使用`void setName(String name)`方法，也可以使用构造函数，例如：

```java
public class Test01 {
    public static void main(String[] args) {
        // 创建实现类对象
        Thread02 t = new Thread02();
        // 实现类通过Thread构造函数创建线程类对象
        Thread t1 = new Thread(t, "线程1");

        t1.start();

        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread().getName()+"..."+i);
        }
    }
}
```

### 使用匿名内部类创建线程对象

基本使用方式如下：

```java
public class Test02 {
    public static void main(String[] args) {
        // 使用对象名调用start方法
        Runnable r = new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    System.out.println(Thread.currentThread().getName() + "..." + i);
                }
            }
        };

        Thread t1 = new Thread(r);
        t1.start();

        // 使用匿名内部类
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    System.out.println(Thread.currentThread().getName() + "..." + i);
                }
            }
        }).start();

        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread().getName()+"..."+i);
        }
    }
}
```

### 使用继承还是实现`Runnable`接口创建线程对象

如果当前自定义线程类已经继承了其他类，则选择通过实现`Runnable`接口创建线程对象，否则使用继承创建线程对象，因为Java不支持多继承

如果需要多个线程对象使用共享同一个资源时，可以考虑使用实现`Runnable`接口的方式创建线程对象

### （三）实现`Callable`接口创建线程对象

`Callable<T>`接口类似于`Runnable`接口，都可以用于创建线程对象。

在该接口中，有一个`call()`方法，与`Runnable`接口中的`run()`类似，但是`call()`方法存在返回值，该返回值有`Callable<T>`接口的泛型`<T>`决定，并且`call()`方法在接口`Callable<T>`中抛出了异常，则实现类重写的`call()`方法也可以抛异常

!!! note
    需要注意，Java中的泛型只能写引用类型，具体会在[Java中的泛型](https://www.help-doc.top/Java/generic/generic.html)章节介绍

当需要接收`call()`方法的返回值时，需要使用到`FutureTask<T>`（实现`Future<T>`接口）中的`get()`方法（重写`Future<T>`接口中的`get()`方法），该方法返回值也是泛型`<T>`

创建线程时，使用`Thread`中的`Thread(Runnable target)` ，因为`FutureTask<T>`也是`Runnable`的实现类

基本使用如下：

```java
// 自定义线程类
public class Thread08 implements Callable<String> {
    @Override
    public String call() throws Exception {
        System.out.println("重写Callable接口中的call方法");
        return "重写Callable接口中的call方法";
    }
}

// 主线程
public class Test06 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Thread08 thread08 = new Thread08();
        FutureTask<String> stringFutureTask = new FutureTask<>(thread08);
        Thread t = new Thread(stringFutureTask);
        t.start();

        // 打印call方法返回值
        System.out.println(stringFutureTask.get());
    }
}
```

### （四）使用线程池创建线程对象

#### 线程池引入

之所以需要线程池，是因为前面每一次使用线程时就需要创建一次线程对象，多次创建对象会有时间和空间的消耗，为了尽量减少这种消耗，可以提前创建好线程对象，使用时在其中获取即可，而创建好的线程对象所在位置就称为线程池

使用线程池中的对象时遵循特点：当线程池有足够的线程对象使用时，可以正常获取到线程对象使用，使用完后归还给线程池，而当线程池中没有线程对象可用，则新线程进入等待，直到有新线程对象在线程池中并处于空闲状态

#### 创建线程池

使用工具类Executors中的静态方法：`static ExecutorService newFixedThreadPool(int nThreads)`获取线程池对象，返回值`ExecutorService`就是管理线程池的对象，参数代表线程池中的线程对象个数

#### 执行线程池任务

使用`ExecutorService`中的两个方法可以提交线程任务，使用`ExecutorService`对象调用：

1. 提交`Runnable`线程任务：`Future<?> submit(Runnable task)`
2. 提交`Callable`线程任务：`Future<T> submit(Callable<T> task)`

上面的两个`submit`方法只有「提交`Callable`线程任务」的方法有返回值，该返回值由`FutureTask<T>`类对象接收

使用`FutureTask<T>`中的`get`方法可以接收「提交`Callable`线程任务」的方法的返回值

#### 关闭线程池

使用`ExecutorService`中的`void shutdown()`方法，可以依次关闭线程池，如果有任务执行，会等待所有任务执行完毕后关闭线程池，不再接收任何线程任务

#### 基本使用实例

```java
// 主线程
public class Test07 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // Callable接口实现类对象
        Thread08 t1 = new Thread08();
        // Runnable接口实现类对象
        Thread07 t2 = new Thread07();

        // 创建线程池
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        // 提交线程池任务
        Future<String> submit = executorService.submit(t1);
        executorService.submit(t2);

        // 获取Callable实现类对象的返回值
        System.out.println(submit.get());
    }
}
```

## 线程安全

### 线程安全引入

当同一个数据被多个线程获取到时，就会出现线程安全问题

例如，在买票的过程中，一共有三个人一起买票，如果至少两个人同时拿到同一张票就代表出现了线程不安全

```java
// 自定义线程类
public class Thread03 extends Thread{
    static int tickets = 10;

    @Override
    public void run() {
        while (tickets > 0) {
            System.out.println("线程" + Thread.currentThread().getName() + "获取到第" + tickets + "张票");
            tickets--;
        }
    }
}

// 主线程
public class Test03 {
    public static void main(String[] args) {
        Thread03 t1 = new Thread03();
        Thread03 t2 = new Thread03();
        Thread03 t3 = new Thread03();

        t1.start();
        t2.start();
        t3.start();
    }
}
```

例如下面的情况：

<img src="13. Java多线程.assets\image1.png">

### 解决线程安全

在Java中，解决线程安全的方式就是给有线程不安全的代码加锁，并且必须是同一把锁，否则该锁无效。给线程加锁的方式有两种：

1. 使用同步代码块，使用格式如下：

    ```java
    synchronized (唯一任意对象){
        // 出现线程不安全的代码
    }
    ```

2. 同步方法：包括静态同步方法和非静态同步方法，使用格式如下：

    ```java
    // 静态方法
    权限修饰符 static synchronized 返回值类型 方法名 {
        // 方法体
    }
    
    // 非静态方法
    权限修饰符 synchronized 返回值类型 方法名 {
        // 方法体
    }
    ```

给线程不安全的代码加锁后，当一个线程进入后就会「加锁」，此时其他线程无法再进入对应的代码，当前面的线程执行完毕后离开，该锁就会「解锁」，此时其他线程就会进入重复上面的过程，在此过程中，哪一个线程先执行取决于哪一个线程先抢到CPU的使用权

#### 同步代码块解决线程不安全

以前面的买票为例，解决方案如下：

```java
// 修改后的自定义线程类（使用继承+同步代码块）
public class Thread03 extends Thread {
    static int tickets = 100;
    // 任意对象加锁
    static Object obj = new Object();

    @Override
    public void run() {
        while (true) {
            synchronized (obj) {
                if (tickets > 0) {
                    System.out.println(Thread.currentThread().getName() + "..." + tickets);
                    tickets--;
                }
                else {
                    break;
                }
            }
        }
    }
}

// 主线程
public class Test03 {
    public static void main(String[] args) {
        Thread03 t1 = new Thread03();
        Thread03 t2 = new Thread03();
        Thread03 t3 = new Thread03();

        t1.start();
        t2.start();
        t3.start();
    }
}
```

修改后的代码就可以解决线程不安全的问题

上面的代码也可以通过实现`Runnable`类的方式创建线程对象实现，例如下面的代码：

```java
// 使用接口实现+同步代码块
public class Thread04 implements Runnable{
    int tickets = 100;
    Object obj = new Object();
    @Override
    public void run() {
        while (true) {
            synchronized (obj) {
                if(tickets > 0) {
                    System.out.println(Thread.currentThread().getName() + "..." + tickets);
                    tickets--;
                }
                else {
                    break;
                }
            }
        }
    }
}

// 主进程
public class Test03 {
    public static void main(String[] args) {
        // 使用实现+同步代码块
        Thread04 tickets = new Thread04();
        new Thread(tickets).start();
        new Thread(tickets).start();
        new Thread(tickets).start();
    }
}
```

使用接口实现与继承的不同的是，锁对象和票成员不需要使用`static`修饰，因为此时三个线程共用一个`tickets`和`obj`成员，示意图如下：

<img src="13. Java多线程.assets\image2.png">

#### 同步方法解决线程不安全

- 静态同步方法

!!! note
    以继承+同步方法为例

对于静态同步方法来说，其默认锁是对象类

```java
// 使用继承+静态同步方法
public class Thread05 extends Thread{
    static int tickets = 100;

    // 静态方法
    public static synchronized void sale() {
        if(tickets > 0) {
            System.out.println(Thread.currentThread().getName() + "..." + tickets);
            tickets--;
        }
    }
    @Override
    public void run() {
        while (true) {
            sale();
            if(tickets <= 0) {
                break;
            }
        }
    }
}
```

- 非静态同步方法

!!! note
    非静态同步方法只能使用接口的方式创建线程对象，因为使用继承无法保证`this`只指向一个对象

对于非静态同步方法，其默认锁是`this`

```java
// 使用实现+非静态同步方法
public class Thread06 implements Runnable{
    static int tickets = 100;

    // 非静态同步方法
    public synchronized void sale() {
        if(tickets > 0) {
            System.out.println(Thread.currentThread().getName() + "..." + tickets);
            tickets--;
        }
    }

    @Override
    public void run() {
        while (true) {
            sale();
            if (tickets <= 0) {
                break;
            }
        }
    }
}
```

#### 使用`lock`锁解决线程不安全

前面使用`synchronized`同步代码块和使用`synchronized`修饰方法的方式都有一个比较明显的缺点：不够灵活

- 对于同步代码块来说，只有在执行完同步代码块后才会释放锁对象
- 对于方法来说，调用该方法执行完才会释放锁

为了解决这个问题，引入了`lock`锁

在标准中，`lock`是一个接口，对应有一个实现类`ReentrantLock`，在该实现类中有两个方法，通过这两个方法控制同步代码块：

1. 无参构造：`lock()`
2. 无参方法释放锁：`unlock()`

使用时，使用`lock()`放在出现线程不安全问题的代码块开始处加锁，执行完线程不安全问题的代码块后在最后一句代码后方添加`unlock()`方法释放锁

!!! note
    使用需要导包`util.concurrent.locks.Lock`和`util.concurrent.locks.ReentrantLock`

使用示例：

```java
public class Thread07 implements Runnable{
    int tickets = 100;
    // 创建共用锁对象
    Lock lock = new ReentrantLock();
    @Override
    public void run() {
        while (true) {
            // 加锁
            lock.lock();
            if(tickets > 0) {
                System.out.println(Thread.currentThread().getName() + "..." + tickets);
                tickets--;
            }
            // 释放锁
            lock.unlock();
        }
    }
}

// 主线程
public class Test05 {
    public static void main(String[] args) {
        Thread07 tickets = new Thread07();
        new Thread(tickets).start();
        new Thread(tickets).start();
        new Thread(tickets).start();
    }
}
```

!!! note
    使用细节：如果出现了`try...catch`，可以考虑将`unlock()`方法放入`finally`中

## 死锁

前面解决线程安全时涉及到加锁，但是如果出现锁嵌套，就容易出现死锁问题，例如下图：

<img src="13. Java多线程.assets\image3.png">

代码实现：

```java
// 锁1
public class LockA {
    public static LockA lockA = new LockA();
}

// 锁2
public class LockB {
    public static LockB lockB = new LockB();
}

// 死锁
public class DieLock implements Runnable{
    private boolean flag;

    public DieLock(boolean flag) {
        this.flag = flag;
    }

    @Override
    public void run() {
        if (flag){
            synchronized (LockA.lockA){
                System.out.println("if...lockA");
                synchronized (LockB.lockB){
                    System.out.println("if...lockB");
                }
            }
        }else{
            synchronized (LockB.lockB){
                System.out.println("else...lockB");
                synchronized (LockA.lockA){
                    System.out.println("else...lockA");
                }
            }
        }
    }
}

// 主线程
public class Test05 {
    public static void main(String[] args) {
        DieLock dieLock1 = new DieLock(true);
        DieLock dieLock2 = new DieLock(false);

        new Thread(dieLock1).start();
        new Thread(dieLock2).start();
    }
}
```

## 线程状态

在Java中，并不是所有进程都在开始运行之后直接进入运行状态，常见的状态有6种，见下面表格：

| 线程状态                  | 导致状态发生条件                                             |
| ------------------------- | ------------------------------------------------------------ |
| `NEW`(新建)               | 线程刚被创建，但是并未启动。还没调用`start`方法。            |
| `Runnable`(可运行)        | 线程可以在Java虚拟机中运行的状态，可能正在运行自己代码，也可能没有，这取决于操作系统处理器。 |
| `Blocked`(锁阻塞)         | 当一个线程试图获取一个对象锁，而该对象锁被其他的线程持有，则该线程进入`Blocked`状态；当该线程持有锁时，该线程将变成`Runnable`状态。 |
| `Waiting`(无限等待)       | 一个线程在等待另一个线程执行一个（唤醒）动作时，该线程进入`Waiting`状态。进入这个状态后是不能自动唤醒的，必须等待另一个线程调用`notify`或者`notifyAll`方法才能够唤醒。 |
| `Timed Waiting`(计时等待) | 同`waiting`状态，有几个方法有超时参数，调用他们将进入`Timed Waiting`状态。这一状态将一直保持到超时期满或者接收到唤醒通知。带有超时参数的常用方法有`Thread.sleep`、`Object.wait`。 |
| `Terminated`(被终止)      | 因为`run`方法正常退出而死亡，或者因为没有捕获的异常终止了`run`方法而死亡，也可以调用过时方法`stop()` |

对应状态图如下：

<img src="13. Java多线程.assets\image4.png">

### 线程状态常用方法

1. 无参线程释放锁等待：`void wait()`，注意，本方法会抛异常
2. 随机唤醒一个正在等待的线程：`void notify()`
3. 唤醒所有正在等待的线程：`void notifyAll()`
4. 有参线程释放锁等待：`void wait(long timeout)`，参数为等待毫秒值

!!! note
    上面的方法所在类都是`Object`，但是因为所有类都继承自`Object`，所以所有子类都可以使用上面的方法

### 线程状态常用方法使用实例（线程间的通信）

在前面的线程程序中，如果涉及到多个线程，就会根据「哪一个线程先抢到CPU使用权哪一个线程先执行」的原则，而不是线程之间相互交替执行。当需要线程之间的相互交替执行，可以使用`wait()`方法和`notify()`方法相互协调控制线程的执行，而多个线程之间协调控制线程的执行则称为线程间的通信

#### 实例实现（使用同步代码块）

例如下面的使用实例：

在一个程序中生产和消费产品，两个行为分别对应着两个线程，一个线程负责生产，一个线程负责消费，并且消费模式为：生产一个产品紧接着消费一个产品，不可以产生同时生产和同时消费，使用代码实现对应的效果

首先分析本题的要求：

1. 因为要两个线程分别生产产品和消费产品，所以需要两个线程对象，但是这两个线程对象均访问一个产品资源
2. 接着考虑产品中的属性，首先是产品当前的数量，定义为`count`，接着是标记生产或者消费，定义为`flag`（假设`flag`为`true`时代表当前存在产品，不需要生产，可以进行消费；否则不存在为`false`，不可以消费，需要生产）

    !!! note
        需要注意，数量和消费成员可以不需要使用`static`

3. 考虑生产产品和消费产品的逻辑，为了保证两个线程不会出现同一时刻访问到同一个数据或者一个线程进行中，因为切换导致另一个线程执行，需要使用锁对象，此时需要使用到同步代码块：
    1. 对于生产产品线程来说：当`flag`为`true`的时候证明当前存在产品，本线程不可以再执行，需要等待；当`flag`为`false`时，`count`加1，并将`flag`标记为`true`。最后唤醒正在等待的消费线程，生产产品线程退出同步代码块
    2. 对于消费产品线程来说：当`flag`为`true`的时候证明当前存在产品，本线程需要执行，直接打印当前`count`的值（表示消费第几个产品），并将`flag`标记为`false`，唤醒正在等待的消费线程，生产产品线程退出同步代码块；当`flag`为`false`时，说明不存在产品，不可以执行消费，本线程需要等待。

    !!! note
        因为需要确保两个线程使用同一个锁对象，所以可以在创建线程对象时传递同一个锁对象，此时需要为两个自定义线程类提供对象成员以及构造函数
        此处需要注意，与前面线程共享资源不完全相同，这里通过同一个锁对象实现两个线程访问同一个锁对象中的资源，而前面的共享资源是通过同一个类对象创建三个线程，所以每个线程都是访问同一个类对象的空间

4. 为了便于观察，可以通过`sleep`方法降低运行速度

示例代码：

```java
// 产品类
public class Product {
    // 产品数量
    private int count;
    // 标记是否需要生产
    private boolean flag;

    public void getCount() {
        System.out.println("消费了" + count);
    }

    public void setCount() {
        count++;
        System.out.println("生产了" + count);
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }
}

// 消费线程
public class Consume implements Runnable{
    // 锁对象引用
    private Product product;

    public Consume(Product product) {
        this.product = product;
    }

    @Override
    public void run() {
        while (true) {
            // 降低运行速度
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (product) {
                // 如果没有产品，则不消费
                if(!product.isFlag()) {
                    // 调用父类Object中的wait()
                    try {
                        product.wait();
                    } catch (InterruptedException e) {
                        System.out.println("生产线异常");
                    }
                }

                // 如果有产品，则消费
                product.getCount();
                // 更改标志
                product.setFlag(false);
                // 唤醒其他线程
                product.notify();
            }
        }
    }
}

// 生产线程
public class Create implements Runnable{
    // 锁对象
    private Product product;

    public Create(Product product) {
        this.product = product;
    }

    @Override
    public void run() {
        while (true) {
            // 降低运行速度
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (product) {
                // 如果有产品，则不生产
                if(product.isFlag()) {
                    // 调用父类Object中的wait()
                    try {
                        product.wait();
                    } catch (InterruptedException e) {
                        System.out.println("生产线异常");
                    }
                }

                // 如果没有产品，则生产
                product.setCount();
                // 更改标志
                product.setFlag(true);
                // 唤醒其他线程
                product.notify();
            }
        }
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        // 锁对象
        Product product = new Product();
        // 创建线程对象
        Create create = new Create(product);
        Consume consume = new Consume(product);
        // 启动线程
        new Thread(create).start();
        new Thread(consume).start();
    }
}
```

效果如下：

<img src="13. Java多线程.assets\image5.png">

但是，上面的代码只实现了两个线程之间的通信，如果涉及到多个生产线程和消费线程，此时就打破了前面实现的消费模式平衡，考虑出现问题的原因：

1. 原因1：在前面只有两个线程进行通信时，只会出现一个线程运行一个线程等待交替进行，根据`notify`方法的特性「每一次随机唤醒一个等待的进程」可以确保一定唤醒另一个正在等待的线程；但是如果出现多个生产线程和消费线程，则此时`notify`方法的特性中的「随机」就会导致此处出现问题「多次生产或者多次消费」，因为`notify`无法保证下一次唤醒的一定是正在等待的生产线程（消费运行）或者正在等待的消费线程（生产运行）。假设开始一个生产线程运行，当该线程运行完毕释放锁后，下一次还是生产线程时，就会产生多次生产，同样对于消费线程也是如此

    !!! info
        针对原因1，提出解决方案：当一个线程结束后，唤醒其他所有线程一起抢锁，此时需要使用`notifyAll()`方法

2. 原因2：原因2出现在原因1之后，尽管使用了`notifyAll()`方法依旧没有解决问题，假设开始运行的线程为生产线程，其他线程均处于等待状态，如果使用`notifyAll()`唤醒了所有的线程，此时所有线程开始抢锁，若抢到锁的依旧是生产线程，上面的代码就会因为是`if`语句，而走完`if`语句之后就继续向下走，走到生产产品部分导致出现连续生产

    !!! info
        针对原因2，提出解决方案：将if语句换成`while`语句，此时对于原因2中的情况来说，走完`while`内部的语句后会因为是while继续判断是否执行`while`内部的语句，而因为第一次线程生产产品已经将`flag`设置为`true`，所以此时`flag`为`true`，`while`判断为真，第二个抢到锁的生产线程就会继续进入`while`内部执行等待

根据前面的两个解决方案修改代码如下：

```java
// 生产线程
public class Create implements Runnable{
    // 锁对象
    private Product product;

    public Create(Product product) {
        this.product = product;
    }

    @Override
    public void run() {
        while (true) {
            // 降低运行速度
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (product) {
                // 如果有产品，则不生产
                while (product.isFlag()) {
                    // 调用父类Object中的wait()
                    try {
                        product.wait();
                    } catch (InterruptedException e) {
                        System.out.println("生产线异常");
                    }
                }

                // 如果没有产品，则生产
                product.setCount();
                // 更改标志
                product.setFlag(true);
                // 唤醒所有线程
                product.notifyAll();
            }
        }
    }
}

// 消费线程
public class Consume implements Runnable{
    // 锁对象引用
    private Product product;

    public Consume(Product product) {
        this.product = product;
    }

    @Override
    public void run() {
        while (true) {
            // 降低运行速度
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (product) {
                // 如果没有产品，则不消费
                while (!product.isFlag()) {
                    // 调用父类Object中的wait()
                    try {
                        product.wait();
                    } catch (InterruptedException e) {
                        System.out.println("生产线异常");
                    }
                }

                // 如果有产品，则消费
                product.getCount();
                // 更改标志
                product.setFlag(false);
                // 唤醒所有线程
                product.notifyAll();
            }
        }
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        // 锁对象
        Product product = new Product();
        // 创建线程对象
        Create create = new Create(product);
        Consume consume = new Consume(product);
        // 启动线程
        new Thread(create).start();
        new Thread(create).start();
        new Thread(create).start();

        new Thread(consume).start();
        new Thread(consume).start();
        new Thread(consume).start();
    }
}
```

#### 实例实现（使用同步方法）

基本逻辑与前面一致，基于非静态同步方法修改，需要注意，同步方法不需要使用锁对象，对于非静态同步方法来说，锁对象默认是`this`

!!! note
    注意，不可以使用静态同步方法，因为如果是静态同步方法，就需要在静态同步方法中使用静态的`wait`和`notify`，但是二者并没有对应的静态版本

- 非静态同步方法

!!! note
    为了保证`this`指向同一个对象，依旧需要使用构造函数将产品对象传入，确保锁唯一

```java
// 产品类
public class Product01 {
    private int count;
    private boolean flag;

    public synchronized void getCount() {
        while (!isFlag()) {
            try {
                wait();
            } catch (InterruptedException e) {
                System.out.println("消费异常");
            }
        }
        System.out.println("消费了"+count);
        setFlag(false);
        notifyAll();
    }

    public synchronized void setCount() {
        while (isFlag()) {
            try {
                wait();
            } catch (InterruptedException e) {
                System.out.println("生产异常");
            }
        }

        count++;
        System.out.println("生产了"+count);
        setFlag(true);
        notifyAll();
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }
}

// 消费线程
public class Consume01 implements Runnable{
    Product product;
    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            product.getCount();
        }
    }
}

// 生产线程
public class Create01 implements Runnable{
    Product product;

    public Create01(Product product) {
        this.product = product;
    }

    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            product.setCount();
        }
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        // 同步方法
        Product product = new Product();
        // 创建线程对象
        Create create = new Create(product);
        Consume consume = new Consume(product);
        // 启动线程
        new Thread(create).start();
        new Thread(create).start();
        new Thread(create).start();

        new Thread(consume).start();
        new Thread(consume).start();
        new Thread(consume).start();
    }
}
```

## 定时器（了解）

使用定时器可以规定间隔多长时间执行一次线程任务

创建定时器可以使用`Timer()`构造方法

在`Timer`中存在一个方法`void schedule(TimerTask task, Date firstTime, long period)`可以对给定的线程进行执行时间设置，第一个参数为线程任务，`TimeTask`是一个抽象类，该类实现自`Runnable`接口，所以也存在一个抽象方法`run()`，实现了`TimerTask`的类需要重写`run()`重写，第二个参数表示开始时间，第三个参数表示间隔时间，单位为毫秒

使用实例：

```java
public class Test08 {
    public static void main(String[] args) {
        Timer timer = new Timer();
        // 使用匿名内部类实现TimerTask()接口
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                System.out.println("重写Runnable方法");
            }
        }, new Date(), 1000L);
    }
}
```