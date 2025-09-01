<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java面向对象与接口

## 抽象类与抽象方法

有些情况下，父类中的方法并没有实现的意义，此时可以将这种方法修饰为抽象方法，使用`abstract`关键字，当一个类中定义了抽象方法，则该类也必须被修饰为`abstract`，对于这种类，称为抽象类。格式如下：

```java
public abstract 类名 {
    public abstract 返回值类型 函数名(形参列表) {
    }
}
```

抽象类有下面的几个特点：

1. 抽象类中可以有抽象方法，也可以有非抽象方法
2. 抽象类不可以实例化出对象
3. 抽象类的抽象方法必须被子类重写，否则编译报错
4. 抽象类虽然没有办法实例化出对象，但是依旧可以有对应的成员变量、构造方法和成员方法，对于构造方法来说，是为了子类可以在子类的构造函数初始化父类的成员变量

## 接口介绍

在Java中，除了有抽象类，还有与抽象类类似的特殊类型，称为接口，接口有以下几种特点：

1. 实现了接口，必须有对应的实现类，因为接口本身不可以实例化对象
2. 接口中的成员方法在JDK7及之前只有抽象方法，即`public abstract`，如果不显式写`public abstract`，默认成员方法也会有该修饰；在JDK8时，新增了默认方法和静态方法，即`public default`和`public static`，在接口中可以显式写`default`，但是在实现类中不可以显示写`default`
3. 在JDK9及之后，新增了私有成员方法，但是不常用
4. 接口中的成员变量在JDK7及之前只有`public static final`，被`final`修饰的成员变量相当于是常量，不可以修改和二次赋值，所以必须在初始化时给定初始值。被`final`修饰的成员变量的变量名建议全大写，因为一般被当做常量
5. 接口可以被多个实现类实现，一个实现类可以实现多个接口，即`public class InterfaceImpl implements InterfaceA，InterfaceB{}`
6. 接口可以实现继承多个接口，此时实现类必须重写所有的抽象方法，即`public interface InterfaceA extends InterfaceB，InterfaceC{}`
7. 一个子类可以在继承一个父类的同时实现一个或者多个接口，即`public class Derived extends Base implements InterfaceA，InterfaceB{}`，但是必须保证继承在前，接口实现在后，满足**先继承再实现接口**

## 定义接口和实现类

在Java中，接口和类一样，只是将`class`替换成`interface`，基本格式如下：

```java
public interface 接口名{
    接口体
}
```

创建了接口之后，就需要有对应的实现类，否则该接口就没有存在的意义

实现接口的类需要使用`implements`关键字，基本格式如下：

```java
public class 类名 implements 接口名{
    重写接口方法
}
```

例如下面的代码实例：

```java
// 定义接口
public interface test_interface {
    public abstract void method();
}

// 实现接口 
public class test_interfaceImpl implements test_interface{
    @Override
    public void method() {

    }
}
```

## 接口中的成员

### 抽象方法

JDK7开始默认情况下，接口中的所有方法都是抽象方法，即默认带有`public abstract`修饰，在定义时可以显式写`public abstract`，也可以不显式写

当接口创建了抽象方法，则实现类必须要重写接口的抽象方法，否则编译报错。实现类重写了接口中的方法后，可以通过创建对象调用重写接口的方法

```java
// 定义接口
public interface test_interface {
    public abstract void method();
}

// 实现接口 
public class test_interfaceImpl implements test_interface{
    @Override
    public void method() {
        System.out.println("实现类重写的方法");
    }
}

// 测试
public class test {
    public static void main(String[] args) {
        // 实现类创建对象
        test_interfaceImpl testInterface = new test_interfaceImpl();
        // 调用重写的方法
        testInterface.method();
    }
}
```

### 默认方法

在JDK8及之后出现的方法，该方法存在方法体，实现类可以选择不重写，也可以选择重写

```java
// 接口
public interface test_interface {
    public default void method01(){
        System.out.println("接口中的默认方法");
    }
}

// 测试
public class test {
    public static void main(String[] args) {
        test_interfaceImpl testInterface = new test_interfaceImpl();
        // 调用接口类的默认方法
        testInterface.method01();
    }
}
```

但是如果一个实现类实现了多个接口，并且多个接口中均有一个完全相同（函数名、形参、返回值类型）的默认方法，此时实现类必须要重写默认方法，但是只需要重写一个，并且实现类重写的默认方法不可以显式写`default`

```java
// 接口1
public interface test_interface {
    public abstract void method();
    public default void method01(){
        System.out.println("接口中的默认方法");
    }
}

// 接口2
public interface test_interface_1 {
    public default void method01(){
        System.out.println("接口1中的默认方法");
    }
}

// 实现类
public class test_interfaceImpl implements test_interface, test_interface_1{
    // 子类必须重写一个default方法，并且重写方法不能带default
    @Override
    public void method01() {
        System.out.println("实现类重写的默认方法");
    }
}

// 测试
public class test {
    public static void main(String[] args) {
        test_interfaceImpl testInterface = new test_interfaceImpl();
        // 调用重写后的默认方法
        testInterface.method01();
    }
}
```

### 静态方法

静态方法因为不需要创建对象，直接使用类名调用，所以只需要使用接口直接调用即可，并且因为静态方法不能重写，所以实现类实现了多个接口也不需要重写，例如：

```java
// 接口
public interface test_interface {
    public static void method02(){
        System.out.println("接口中的静态方法");
    }
}

// 测试
public class test {
    public static void main(String[] args) {
        // 接口直接调用静态方法
        test_interface.method02();
    }
}
```

### 成员变量

默认被修饰为`public static final`，可以显式写`public static final`，也可以不显式写

```java
// 接口
public interface test_interface {
    public static final int NUM1 = 100;
}

// 测试
public class test {
    public static void main(String[] args) {
        // 接口调用静态变量
        System.out.println(test_interface.NUM1);
    }
}
```

## 接口和抽象类的区别

相同点:

1. 都位于继承体系的顶端，用于被其他类实现或者继承
2. 都不能`new`
3. 都包含抽象方法，其子类或者实现类都必须重写这些抽象方法

不同点:

1. 抽象类：一般作为父类使用，可以有成员变量、构造方法、成员方法、抽象方法等
2. 接口：成员单一，一般抽取接口，抽取的都是方法，视为功能的大集合
3. 类不能多继承，但是接口可以

实际应用：一般接口用于定义常用的方法，被实现类实现，从而实现对应满足需要使用的方法，而继承抽象类一般是继承共有的属性，可以使子类拥有成员变量等属性

## 适当重写接口中需要的方法

在接口中，方法默认都是`public abstract`，这也就意味着所有的实现类都必须实现接口中定义的抽象方法。但是有时并不是所有的抽象方法在实现类中都需要用得到，所以此时可以考虑先让一个类实现接口并重写所有的抽象方法，但是可以不用具体实现，接着通过继承的方式来重写需要的方法，即如下代码：

=== "接口类"

    ```java
    package com.epsda.advanced.test_interface;

    public interface TestInterface {
        void method();
        void method01();
    }
    ```

=== "父类（实现类）"

    ```java
    package com.epsda.advanced.test_interface;

    public class Test1 implements TestInterface {
        @Override
        public void method() {

        }

        @Override
        public void method01() {

        }
    }
    ```

=== "子类"

    ```java
    package com.epsda.advanced.test_interface;

    public class Test2 extends Test1{
        // 按需重写
        @Override
        public void method01() {
            super.method01();
        }

        // 不需要重写method()
    }
    ```