<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java章节目录

## Java基础知识

本节首先介绍了JDK和JVM、入门的Java代码、Java中如何进行注释，接着介绍了Java中的关键字、对基本的输出函数

接着，介绍了Java中的基本语法特点，包括数据类型、类型转换问题、运算符及优先级。为了了解Java中如何进行输入，首先引入了包的概念，接着通过一个简单案例介绍了`Random`类

最后，本节还介绍了Java中的分支和循环语句

## Java数组类型

本节介绍了Java的一维数组和二维数组，同时简单介绍了JVM中的内存划分

## Java面向对象与方法

本节介绍了Java中的方法、方法重载。引出了Java中的类和对象，包括创建类和对象

## Java面向对象与封装

本节首先介绍了封装的概念以及在Java中如何实现封装，接着，在本节中引入了JavaBean的概念以及`static`关键字的作用。本节还介绍了Java方法中的可变参数以及传值和传址调用。最后，本节介绍了Java中命令行参数的作用

## Java面向对象与继承

本节介绍了Java中如何实现继承以及继承中成员变量和成员方法的访问特点，另外本节还介绍了`super`和`this`关键字，本节的末尾介绍了Java中继承的特点以及继承使用案例

## Java面向对象与接口

本节介绍了在Java中实现抽象类和接口，对比了二者的区别和使用场景。在抽象类部分中介绍了定义抽象类和抽象方法，在接口部分中介绍了定义接口和实现类，并且还介绍了在接口中允许的成员

另外，在本节介绍了如何实现「适当重写接口中需要的方法」

## Java面向对象与多态

本节介绍了在Java中如何实现多态以及Java中多态的特点，另外还通过一个案例介绍了多态的使用场景

最后，本节还介绍了一个Java多态的经典面试题目：「避免在构造方法中调用可被重写的方法」

## Java面向对象与权限修饰符、`final`、代码块及内部类

本节介绍了Java中的权限修饰符，结合前面的继承和包进一步说明了权限修饰符的作用，接着还介绍了Java中的代码块以及继承下的代码块的特点、内部类的定义和使用

## Java异常类

本节介绍了Java中的异常体系以及如何抛出异常、处理异常，最后还给出了一个自定义异常类的实现思路

## Java中的`Object`类和常用方法、经典接口

本节介绍了Java中所有类的父类`Object`类以及其中的常用方法`toString()`和`equals()`，另外还介绍了`Comparable`接口、`Comparator`接口、`Cloneable`接口，并通过实际案例展示这些接口的使用

## `Java.lang`中的`String`类和`StringBuilder`类介绍和常用方法

本节对之前经常使用的`String`类从偏底层的角度进行了介绍，并且还给出了两个经典的面试题以便更加熟悉`String`类，接着介绍了`String`类中常用的方法，最后介绍了`StringBuilder`类和`StringBuffer`类以及其中的常用方法

## Java中的常用类及包装类

本节介绍了Java中的常用类和常用的方法，包括：

1. [`Math`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#math)
2. [`BigInteger`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#biginteger)
3. [`BigDecimal`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#bigdecimal)
4. [`Date`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#date)
5. [`Calendar`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#calendar)
6. [`SimpleDateFormat`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#simpledateformat)
7. [`LocalDate`类和`LocalDateTime`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#localdatelocaldatetime)
8. [`Period`类和`Duration`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#periodduration)
9. [`DateTimeFormatter`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#datetimeformatter)
10. [`System`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#system)
11. [`Arrays`类](https://www.help-doc.top/Java/common-class-packed-class/common-class-packed-class.html#arrays)

接着，本节介绍了Java中针对基本数据类型的包装类以及基本使用，另外还介绍了包装类中的经典面试题。最后结合包装类，本节进一步完善了JavaBean实现

## Java中的泛型

本节介绍了Java中如何实现一个基础的泛型以及泛型的编译原理，另外还介绍了泛型中的类型限定付、通配符和上界与下界

## Java单列集合

本节首先介绍了Java中的集合概念，接着介绍了Java中的单列集合以及`Collection`接口。为了后续理解，本节还介绍了Java中的迭代器。另外，在本节中在介绍集合之前，先介绍了Java集合中存在的并发修改异常问题

有了上面的铺垫，本节依次介绍了下面的单列集合：

1. [`ArrayList`](https://www.help-doc.top/Java/collection/collection.html#arraylist)：这一部分包括对`ArrayList`的构造和使用以及源码分析
2. [`LinkedList`](https://www.help-doc.top/Java/collection/collection.html#linkedlist)：这一部分包括对`LinkedList`的构造和使用以及源码分析
3. [`Stack`](https://www.help-doc.top/Java/collection/collection.html#stack)：这一部分包括对`Stack`的构造和使用
4. [`Queue`](https://www.help-doc.top/Java/collection/collection.html#queue)：这一部分包括[基于`LinkedList`实现的队列](https://www.help-doc.top/Java/collection/collection.html#linkedlist_3)、[基于`LinkedList`以及`ArrayDeque`实现的双端队列](https://www.help-doc.top/Java/collection/collection.html#linkedlistarraydeque)以及`PriorityQueue`的基本使用和扩容方式
5. [`TreeSet`](https://www.help-doc.top/Java/collection/collection.html#treeset)：这一部分包括`TreeSet`的构造和使用
6. [`HashSet`](https://www.help-doc.top/Java/collection/collection.html#hashset)：这一部分包括`HashSet`的构造和使用
7. [`LinkedHashSet`](https://www.help-doc.top/Java/collection/collection.html#linkedhashset)：这一部分包括`LinkedHashSet`的构造和使用

除了上面的内容以外，本节还介绍了哈希值的概念以及Java中计算哈希值的方法。另外，本节介绍了Java中的增强`for`循环以及`Collections`工具类中的常用方法，并且通过一个案例演示了本节中部分集合的实际使用

## Java双列集合

本节首先介绍了Java中双列集合的体系以及`Map.Entry<K, V>`接口。接着介绍了下面的双列集合：

1. [`TreeMap`](https://www.help-doc.top/Java/map/map.html#treemap)：这一部分包括`TreeMap`的构造和使用
2. [`HashMap`](https://www.help-doc.top/Java/map/map.html#hashmap)：这一部分包括`HashMap`的构造和使用
3. [`LinkedHashMap`](https://www.help-doc.top/Java/map/map.html#linkedhashmap)：这一部分包括`LinkedHashMap`的构造和使用

接着，本节介绍了`Map`接口中自定义类型去重的方式、`Set`接口和`Map`接口无索引操作原因分析、`HashMap`无序但`LinkedHashMap`有序原因分析。除此之外，本节还对哈希表结构存储过程和源码进行了分析

另外，本节简单提到了`HashTable`和`Vector`这两个类作为了解，还介绍了`Properties`类的使用

为了更好得了解双列集合，本节最后还提供了`Map`练习案例

## Java中的`BitSet`类

本节介绍了Java中的`BitSet`类和常见方法

## 了解Java字符串常量池

本节介绍了池化技术和Java中字符串常量池的概念，并且还介绍了字符串常量池的底层实现原理

## Java多线程

## Java的IO流

## Java网络编程、正则表达式、设计模式与Lombok

## Java中的JDK8及后续的重要新特性

本节介绍了以下JDK8及以后版本的新特性：

1. [函数式接口](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_1)
2. [函数式编程思想和Lambda表达式](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#lambda)
3. [`Stream`流](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#stream)
4. [方法引用](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_5)
5. [接口中的私有方法](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_11)
6. [钻石操作符`<>`与匿名内部类结合](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_12)
7. [`try-with-resources`升级](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#trycatch)
8. [局部变量类型自动推断](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_13)
9. [新`switch`表达式](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#switch)
10. [文本块](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_14)
11. [`instanceof`模式匹配](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#instanceof)
12. [`Record`类](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#record)
13. [密封类](https://www.help-doc.top/Java/new-jdk8-and-after/new-jdk8-and-after.html#_15)

## Java中的Junit、反射、注解及枚举

本节首先介绍了Junit的基本使用，接着介绍了Java中的反射机制，最后介绍了Java中的注解及枚举

## （补充）JSON在后端的应用

本节介绍了在Java中如何实现JSON字符串和Java对象的相互转换