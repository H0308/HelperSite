<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java面向对象与多态

## 多态介绍

在前面学习到的接口和继承中，如果父类只能使用父类的方法，子类可以使用父类和自己的方法，但是有时需要使用父类调用子类重写的父类方法，上面的思路就不再合适，此时就可以使用多态

多态的特点：使用父类引用指向子类的对象，此时父类可以调用子类重写父类的方法，但是调不到子类特有的成员

## 形成多态的前提

使用多态需要保证四点：

1. 保证存在继承（包括接口与实现类）关系
2. 子类重写了父类中非私有的方法
3. 父类引用指向子类对象
4. 父类引用调用子类重写的父类方法

例如下面的代码：

```Java
// 父类
public abstract class Base {
    public abstract void method();
}

// 子类
public class Derived extends Base{
    // 重写父类的抽象方法
    @Override
    public void method() {
        System.out.println("子类重写父类的方法");
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        // 父类引用指向子类对象
        Base base = new Derived();
        base.method();// 调用重写的方法
    }
}
```

## 多态下成员访问的特点

### 成员变量

实现多态后，因为是父类引用，所以只能访问到子类与父类共用的成员

```Java
// 父类
public abstract class Base {
    // 父类成员
    public int numBase;

    public Base(int numBase) {
        this.numBase = numBase;
    }
}

// 子类
public class Derived extends Base{
    public int numDerived;

    public Derived(int numBase, int numDerived) {
        super(numBase);
        this.numDerived = numDerived;
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        // 父类引用指向子类对象
        Base base = new Derived(10, 20);
        System.out.println(base.numBase);// 访问父类属性
//        System.out.println(base.numDeried); // 无法访问子类属性
    }
}
```

### 成员方法

多态出现的意义就是父类引用可以访问到子类的方法，但是只能访问到子类重写的父类方法

```Java
// 父类
public abstract class Base {
    public abstract void method();
}

// 子类
public class Derived extends Base{
    // 重写父类的抽象方法
    @Override
    public void method() {
        System.out.println("子类重写父类的方法");
    }

    // 子类特有方法
    public void methodDerived()
    {
        System.out.println("子类特有方法");
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        // 父类引用指向子类对象
        Base base = new Derived(10, 20);
        base.method();// 调用重写的方法
//        base.methodDerived(); // 无法访问子类特有方法
    }
}
```

### 访问特点总结

1. 访问成员变量时：看赋值符号左侧是子类还是父类，如果是父类，调用就是父类成员变量，否则调用的是子类成员变量
2. 访问成员方法时：看`new`的是哪一个对象，如果是子类，则访问的是子类中的成员方法（多态时访问的子类重写后的成员方法），否则访问的就是父类自己的成员方法

## 多态对比普通继承

### 普通继承优点与缺点

- 普通继承优点：

赋值符号左右两边类型相等，调用时父类只能访问自己的成员，子类可以访问和父类共有的成员以及自己特有的成员

- 普通继承的缺点：

可扩展性差

<div style="border-bottom:2px solid #cdcdcd;"></div>

例如下面的代码：

```Java
// 父类
public abstract class Base {
    public abstract void methodBase();
}

// 子类1
public class Derived1 extends Base{
    @Override
    public void methodBase() {
        System.out.println("Derived1重写父类方法");
    }
}

// 子类2
public class Derived2 extends Base{
    @Override
    public void methodBase() {
        System.out.println("Derived2重写父类的方法");
    }
}
```

在普通的继承中，当子类想调用自己重写后的方法需要按照下面的方式进行：

```Java
public class Test {
    public static void main(String[] args) {
        Derived1 derived1 = new Derived1();
        Derived2 derived2 = new Derived2();

        // 调用重写的方法
        derived1.methodBase();
        derived2.methodBase();
    }
}
```

如果此时需要将两个对象作为函数的参数，就需要写两个函数，例如：

```Java
// 测试
public static void test(Derived1 derived1)
{
    derived1.methodBase();
}

public static void test(Derived2 derived2)
{
    derived2.methodBase();
}
```

如果子类非常多，则需要覆盖的测试函数就会变多，从而导致可扩展性差

### 多态优点与缺点

- 多态优点：

因为父类可以访问到子类重写的方法，所以只需要在测试参数处写为父类引用即可，可扩展性强

- 多态缺点：

因为创建的是子类对象，所以只能访问子类和父类共有的成员以及子类重写父类的方法

!!! note
    实际上，多态出现的目的就是为了解决前面普通继承的缺点，所以多态自身的缺点可以忽略

例如，上面的测试代码就可以修改为：

```Java
public class Test {
    public static void main(String[] args) {
        Derived1 derived1 = new Derived1();
        Derived2 derived2 = new Derived2();

        test(derived1);
        test(derived2);
    }

    // 测试
    public static void test(Base base)
    {
        base.methodBase();
    }
}
```

此时因为参数的`base`是父类引用，而接收到的实参指向子类引用，所以实参传递给形参即父类引用指向子类引用

## 向上转型与向下转型

向上转型：父类引用指向子类对象，即多态

向下转型：指向子类对象的父类引用转换为子类引用，向下转型可以解决部分情况下需要调用子类特有的成员，使用强制转换的方式可以实现向下转型，例如下面的代码：

```Java
public class Test {
    public static void main(String[] args) {
        // 向上转型
        Base base = new Derived1();
        base.methodBase();

        // 向下转型
        Derived1 derived1 = (Derived1) base;
        derived1.methodDerived1(); // 调用子类特有的方法
        derived1.methodBase(); // 调用父类的方法
    }
}
```

## 向下转型存在的问题

向下转型之前的引用是父类引用，此时给对应的子类引用没有任何问题。但是如果给另一个子类就会出现`ClassCastException`

例如下面的代码，先展示正常情况下的向上转型：

```Java
// 父类
public abstract class Base {
    public abstract void methodBase();
}

// 子类1
public class Derived1 extends Base{
    @Override
    public void methodBase() {
        System.out.println("Derived1重写父类方法");
    }

    // 子类特有方法
    public void methodDerived1() {
        System.out.println("Derived1特有方法");
    }
}

// 子类2
public class Derived2 extends Base{
    @Override
    public void methodBase() {
        System.out.println("Derived2重写父类的方法");
    }

    // 子类特有方法
    public void methodDerived2() {
        System.out.println("Derived2特有方法");
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        Base base1 = new Derived1();
        Base base2 = new Derived2();
        // 向上转型
        test(base1);
        test(base2);
    }
    public static void test(Base base)
    {
        base.methodBase();
    }
}
```

接着展示向下转型：

```Java
public static void test(Base base)
{
    // 向下转型
    Derived1 derived1 = (Derived1) base;
    derived1.methodDerived1(); // 调用子类特有的方法
}
```

上面的代码当`base`接收的是`Derive1`的对象，则没有任何问题，因为引用也是`Derive1`类的引用，但是如果`base`是`Derive2`的对象，此时就会出现异常，下面是报错信息：

```Java
Exception in thread "main" java.lang.ClassCastException: com.epsda.advanced.cmp_extends_polymorphic.Derived2 cannot be cast to com.epsda.advanced.cmp_extends_polymorphic.Derived1
    at com.epsda.advanced.cmp_extends_polymorphic.Test.test(Test.java:33)
    at com.epsda.advanced.cmp_extends_polymorphic.Test.main(Test.java:17)
```

所以，为了避免出现这种问题，再进行向下转型前需要先判断当前类型是否与引用类型匹配，可以使用`instanceof`关键字，使用方式如下：

```Java
对象 instanceof 目标类
```

所以上面的测试代码可以修改为：

```Java
public static void test(Base base)
{
    // 向下转型+判断
    if(base instanceof Derived1) {
        Derived1 derived1 = (Derived1) base;
        derived1.methodDerived1(); // 调用子类特有的方法
    }
    else {
        Derived2 derived2 = (Derived2) base;
        derived2.methodDerived2(); // 调用子类特有的方法
    }
}
```

## 多态+接口练习

案例：

定义笔记本类，具备开机，关机和使用USB设备的功能。具体是什么USB设备，笔记本并不关心，只要符合USB规格的设备都可以。鼠标和键盘要想能在电脑上使用，那么鼠标和键盘也必须遵守USB规范，不然鼠标和键盘的生产出来无法使用

进行描述笔记本类，实现笔记本使用USB鼠标、USB键盘

-  USB接口，包含开启功能、关闭功能
-  笔记本类，包含运行功能、关机功能、使用USB设备功能
-  鼠标类，要符合USB接口
-  键盘类，要符合USB接口

参考代码：

```Java
// 笔记本类
public class Laptop{
    // 开机方法
    public void startCom() {
        System.out.println("笔记本开机");
    }

    // 关机方法
    public void shutdownCom() {
        System.out.println("笔记本关机");
    }

    public void setUsbStart(USB usb) {
        usb.startUSB();
    }

    public void setUsbShutdown(USB usb) {
        usb.shutdownUSB();
    }
}

// USB接口
public interface USB {
    // USB开机
    public abstract void startUSB();
    // USB关机
    public abstract void shutdownUSB();
}

// 鼠标类
public class Mouse implements USB{
    @Override
    public void startUSB() {
        System.out.println("鼠标插上");
    }

    @Override
    public void shutdownUSB() {
        System.out.println("鼠标拔下");
    }
}

// 键盘类
public class Keyboard implements USB{
    @Override
    public void startUSB() {
        System.out.println("键盘插上");
    }

    @Override
    public void shutdownUSB() {
        System.out.println("键盘拔下");
    }
}

// 测试类
public class Test {
    public static void main(String[] args) {
        USB mouse = new Mouse();
        USB keyboard = new Keyboard();
        Laptop laptop = new Laptop();
        laptop.startCom();
        laptop.setUsbStart(mouse);
        laptop.setUsbStart(keyboard);
        laptop.setUsbShutdown(mouse);
        laptop.setUsbShutdown(keyboard);
        laptop.shutdownCom();
    }
}

输出结果：
笔记本开机
鼠标插上
键盘插上
鼠标拔下
键盘拔下
笔记本关机
```

## 避免在构造方法中调用可被重写的方法

以下面的代码为例：

```java
class B {
    public B() {
        // 调用了被子类重写的方法
        func();
    }
    public void func() {
        System.out.println("B.func()");
    }
}

class D extends B {
    private int num = 1;
    @Override
    public void func() {
        System.out.println("D.func() " + num);
    }
}

public class Test {
    public static void main(String[] args) {
        D d = new D();
    }
}
```

在上面的代码中，首先执行父类的构造方法，在父类的构造方法中调用了被子类重写的`func`，而此时根据Java的多态机制，实际上调用的并不是父类的`func`而是子类的`func`，但是因为先执行的是父类构造方法，子类的初始化和构造都还没有执行，所以此时`num`的值也为0

所以最后输出结果为：

```
D.func() 0
```

!!! note

    此处需要注意，成员变量的默认值是在当前类的构造方法之前执行的，但是一旦有继承关系，那么要等到走完父类的构造方法，才会走子类成员的初始化和构造方法