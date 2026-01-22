<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java面向对象与继承

## 实现继承

在Java中，使用`extends`关键字进行继承，基本格式如下：

```java
class 子类 extends 父类 {

}
```

例如下面的代码：

```java
// 父类
public class Base {
}

// 子类
public class Derived extends Base{
}
```

在上面的代码中`Base`类为父类，`Derived`类为子类

当子类继承父类时，子类会拥有父类所有的成员，包括私有和公有的成员，但是子类只能使用父类公有的成员，例如下面的代码：

```java
public class Base {
    public String str;
    private int num;
}
```

此时子类继承`Base`类时，会拥有成员变量`str`和`num`，但是子类只能使用`str`

## 方法重写

不同于方法重载，方法重写需要满足函数名相同、返回值（或是被继承类的所有子类（也称为[协变](https://www.help-doc.top/cpp/polymorphic/polymorphic.html#_2)））和形参列表相同，并且方法重写的前提是继承，如果子类重写了父类方法，则子类优先访问重写后的父类方法，例如下面的代码

```java
// 父类
public class Base {
    public void base() {
        System.out.println("父类中的方法");
    }
}

// 子类
public class Derived extends Base{
    @Override
    public void base() {
        System.out.println("子类重写父类方法");
    }
}

public class Test {
    public static void main(String[] args) {
        Base base = new Base();
        Derived derived = new Derived();

        base.base(); // 父类访问自己的方法
        derived.base(); // 子类访问重写父类的方法
    }
}

输出结果：
父类中的方法
子类重写父类方法
```

子类重写父类方法，子类重写的方法权限不可以比父类被重写方法权限低，方法权限一共有四种（访问权限依次降低）：

1. `public`
2. `protected`
3. 默认（`default`，不显式写）
4. `private`

例如，父类定义的是`public`的方法，则子类继承的方法不可以是被`public`以下的权限修饰符修饰，否则属于权限降低

需要注意，重写方法不能对下面的父类方法进行重写：

1. 父类中的私有方法
2. 父类中的静态方法
3. 父类中的构造方法

在Java中，可以使用注解`@Override`判断该方法是否是重写了父类方法，如果不是，则使用该注解会报错

## 继承中成员变量和成员方法访问的特点

### 访问成员变量

当子类继承父类时，子类对象可以访问到父类中的非私有成员变量和自己的成员变量，但是父类对象只能访问父类自己的成员变量，无法访问子类中的成员变量，例如下面的代码：

```java
// 父类
public class Base {
    public String str;
    private int num;
}

// 子类
public class Derived extends Base{
    String newAdded; // 子类新增成员
}

public class Test {
    public static void main(String[] args) {
        Base base = new Base();
        base.str = "父类";
        // base.newAdded; // 父类不能访问子类中新增的成员
        Derived derived = new Derived();
        // 子类可以访问父类的非私有成员，也可以访问子类自己的成员
        derived.str = "子类";
        derived.newAdded = "子类新增成员";
    }
}
```

如果出现父类的成员变量与子类新增的成员变量重名时，子类依旧访问的自己的成员变量而不是与其重名的父类成员变量，父类已经访问自己的成员变量

```java
// 父类
public class Base {
    public int num = 100;
}

// 子类
public class Derived extends Base{
    public int num = 1000;
}

public class Test {
    public static void main(String[] args) {
        Base base = new Base();
        Derived derived = new Derived();

        System.out.println(base.num);
        System.out.println(derived.num);
    }
}

输出结果：
100
1000
```

### 访问成员方法

当子类继承父类时，子类对象可以访问到子类自己的方法，也可以访问到父类方法；父类对象可以访问到自己的方法，也可以通过接收子类对象访问子类重写父类的方法（见多态），例如下面的代码：

```java
// 父类
public class Base {
    public String str;
    private int num;

    public void base() {
        System.out.println("父类中的方法");
    }
}

// 子类
public class Derived extends Base{
    String newAdded; // 子类新增成员

    public void derived() {
        System.out.println("子类方法");
    }
}

public class Test {
    public static void main(String[] args) {
        Base base = new Base();
        Derived derived = new Derived();
        base.base(); // 父类访问自己的方法
        derived.base(); // 子类访问父类的方法
        derived.derived();// 子类访问自己的方法
    }
}
```

### 访问特点总结

- 访问成员变量：关注创建对象时赋值符号的左侧是子类还是父类。如果是父类，则访问的是父类成员变量，如果是子类，则访问的是父类非私有成员和子类自身的成员变量
- 访问成员方法：关注创建对象时赋值符号的右侧是调用子类构造函数和父类构造函数。如果是父类，则访问的是父类中的成员方法，如果是子类，则访问的是父类中非私有的成员方法、子类重写的父类的方法和子类自身的成员方法

## `super`和`this`关键字

### `super`关键字

在继承中，默认情况下，子类则访问的是自己的成员，如果此时子类需要访问父类的成员，则需要使用到`super`关键字

在Java中，`super`关键字其作用有以下三种：

1. 在子类构造方法中访问父类的构造方法（使用方式与`this`关键字类似，但是不能和`this`调用构造函数的方式同时出现）
2. 在子类中访问父类的非私有非静态成员变量
3. 在子类中访问父类的非私有非静态成员方法

当在子类构造方法中访问父类的构造方法时，一般是用于构造属于父类的成员，而因为父类比子类在创建子类对象时先创建，所以必须写在子类构造方法中的第一行，基本格式如下：

```java
public 子类() {
    super();
    // super(形参); 使用父类中有参构造时使用
}
```

默认情况下，子类如果没有构造方法，那么默认提供的构造方法会调用父类的无参构造，即子类会隐含着下面的构造方法：

```java
public 子类() {
    super();
}
```

当子类需要访问父类的成员时，使用下面的格式：

```java
super.父类非私有非静态成员
```

!!! note

    不建议将`super`理解为父类对象的引用，因为在使用`super`时并没有直接创建出父类对象

### `this`关键字

前面在介绍方法时，为了防止方法中出现局部变量与类成员变量重名导致优先访问局部变量的问题，使用`this`来指代使用类成员变量，下面主要介绍`this`关键字

`this`关键字指代当前调用的对象的引用，即哪个对象调用了成员，`this`就是哪个对象的引用，同`super`一样，`this`关键字的作用一共有三种：

1. 在当前类的一个构造方法中访问当前类的其他构造方法
2. 在当前类中调用当前类的成员变量
3. 在当前类中调用当前类的成员方法

当使用`this`在当前类的一个构造方法中访问当前类的其他构造方法时，需要与`super`一样，将相关语句放在构造方法的第一行，基本格式同`super`关键字。但是需要注意，如果当前构造方法中已经有了`super`调用父类构造方法则不能再写`this`调用其他构造方法，二者会冲突

当使用`this`访问当前类的成员时，使用方法同`super`一样

!!! note
    注意，不能在静态成员方法中使用`this`

## Java继承的特点

在Java中，子类一次只能继承一个父类，但是父类可以被多个子类继承，并且存在多层继承关系

- 父类被多个子类继承

    ```java
    // 父类
    public class Base {
    }

    // 子类
    public class Derived01 extends Base{
    }
    public class Derived02 extends Base{
    }
    ```

    在上述代码中`Base`作为父类有两个子类

- 多层继承关系

    ```java
    // 父类
    public class BaseTop {
    }
    // 继承自BaseTop
    public class Base extends BaseTop{
    }
    // 继承自Base
    public class Derived extends Base{
    }
    ```

    在多层继承关系中，每一个子类都包含其祖先的所有成员

## 为父类成员赋值

在继承出现后，当子类对象需要为父类成员赋值时，可以使用两种方法：

1. 子类构造方法中使用`super`调用父类构造方法
2. 父类提供相关成员变量的`set`方法

## 继承案例

某IT公司有多名员工，按照员工负责的工作不同，进行了部门的划分（研发部、维护部）

研发部(Developer)根据所需研发的内容不同，又分为 JavaEE工程师 、Android工程师

维护部(Maintainer)根据所需维护的内容不同，又分为 网络维护工程师(Network) 、硬件维护工程师(Hardware) 

公司的每名员工都有他们自己的员工编号、姓名，并要做它们所负责的工作

工作内容:

- JavaEE工程师： 员工号为xxx的xxx员工，正在研发电商网站
- Android工程师：员工号为xxx的xxx员工，正在研发电商的手机客户端软件
- 网络维护工程师：员工号为xxx的xxx员工，正在检查网络是否畅通
- 硬件维护工程师：员工号为xxx的xxx员工，正在修复电脑主板

请根据描述，完成员工体系中所有类的定义，并指定类之间的继承关系。进行XX工程师类的对象创建，完成工作方法的调用

!!! note
    此处提供一种思路，`Employee`作为抽象父类，其他员工均作为子类，重写父类中的`work`方法

实现代码如下：

=== "父类"

    ```java
    // 父类
    package com.epsda.advanced.extends_exercise;

    /**
     * ClassName: Employee
     * Description:
     *
     * @author 憨八嘎
     * @version 1.0
     */
    public abstract class Employee {
        private String id;
        private String name;
        private String department;

        public Employee(String id, String name, String department) {
            this.id = id;
            this.name = name;
            this.department = department;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public abstract void work();
    }
    ```

=== "子类1"

    ```java
    // 子类1
    public class JavaEE_Engineer extends Employee{
        public JavaEE_Engineer(String id, String name, String department) {
            super(id, name, department);
        }

        @Override
        public void work() {
            System.out.println("员工号为"+getId()+"的"+getDepartment()+"的"+getName()+"员工"+"，正在研发电商网站");
        }
    }
    ```

=== "子类2"

    ```java
    // 子类2
    public class Android_Engineer extends Employee{
        public Android_Engineer(String id, String name, String department) {
            super(id, name, department);
        }

        @Override
        public void work() {
            System.out.println("员工号为"+getId()+"的"+getDepartment()+"的"+getName()+"员工"+"，正在研发电商的手机客户端软件");
        }
    }
    ```

=== "子类3"

    ```java
    // 子类3
    public class Network_Engineer extends Employee{
        public Network_Engineer(String id, String name, String department) {
            super(id, name, department);
        }

        @Override
        public void work() {
            System.out.println("员工号为"+getId()+"的"+getDepartment()+"的"+getName()+"员工"+"，正在检查网络是否畅通");
        }
    }
    ```

=== "子类4"

    ```java
    // 子类4
    public class Hardware_Engineer extends Employee{
        public Hardware_Engineer(String id, String name, String department) {
            super(id, name, department);
        }

        @Override
        public void work() {
            System.out.println("员工号为"+getId()+"的"+getDepartment()+"的"+getName()+"员工"+"，正在修复电脑主板");
        }
    }
    ```

!!! note
    如果考虑将开发的两个部门继承自`Employee`，则需要注意，两个部门类不需要重写方法，自然也就定义成`abstract`类，直到最后一个作为子类的类重写`work`方法即可