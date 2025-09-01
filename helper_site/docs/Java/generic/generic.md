<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java中的泛型

## 泛型介绍

泛型：不明确具体类型，直到接收到具体类型再进行推导

使用泛型有两个原因：

1. 统一数据类型，防止使用时出现的数据类型转换异常
2. 定义带泛型的类，方法等，使用的时候给泛型确定什么类型，泛型就会自动推导为对应类型，使代码更灵活

## 定义泛型

定义泛型一共有三个位置：

1. 定义泛型的类：在类名后面添加`<T>`，其中`<>`表示泛型，`T`为泛型名，类似于变量名，对于类泛型来说，当该类实例化出对象时，泛型就会被替代为指定类型，格式如下：

    ```java
    public class 类名 <T> {
        // 成员
    }
    ```

    基本使用如下：

    === "简单实现`ArrayList`"

        ```java
        public class MyArrayList <E> {
            //定义一个数组，充当ArrayList底层的数组,长度直接规定为10
            Object[] obj = new Object[10];
            //定义size,代表集合元素个数
            int size;
    
            public boolean add(E e) {
                obj[size] = e;
                size++;
                return true;
            }
    
            public E get(int index) {
                return (E) obj[index];
            }
    
            @Override
            public String toString() {
                return Arrays.toString(obj);
            }
        }
        ```

    === "测试类"

        ```java
        // 测试
        public class Test {
            public static void main(String[] args) {
                MyArrayList<String> list1 = new MyArrayList<>();
                list1.add("aaa");
                list1.add("bbb");
                System.out.println(list1); //直接输出对象名,默认调用toString
    
                System.out.println("===========");
    
                MyArrayList<Integer> list2 = new MyArrayList<>();
                list2.add(1);
                list2.add(2);
                Integer element = list2.get(0);
                System.out.println(element);
                System.out.println(list2);
            }
        }
        ```

    需要注意，之所以定义元素`Object`类型的数组是为了便于做强制类型转换，因为泛型不是具体类型，对于`get`方法来说，当泛型作为一个方法的返回值时，返回值需要进行强制转换，此时因为`Object`是所有类的父类，所以此时可以强制转换，例如源码迭代器中的`next`方法返回值

    ```java
    public E next() {
        // ...
        return (E) elementData[lastRet = i];
    }
    ```

    由于泛型不是具体类型，在定义数组时**不可以使用泛型**表示数组内元素的具体类型，也就是说下面的代码是不被允许的：

    ```java
    T[] arr = new T[5]; // 报错
    ```

    但是，有一种写法可以绕过上面的编译错误：

    ```java
    T[] arr = (T[])new Object[5];
    ```

    但是这种写法虽然可以通过编译，但是本质上这个`arr`的类型是`Object[]`，如果现在提供一个方法用于获取到这个数组的引用，如下：

    ```java
    public T[] getArr() {
        return arr;
    }
    ```

    在使用时如果想转换为具体的类型就会抛出`ClassCastException`，例如：

    ```java
    MyArrayList<String> list = new MyArrayList<>();
    String[] strArr = (String[]) list.getArr(); // ClassCastException
    ```

    本质就是在Java中数组类型是一种单独的类型，而虽然`String`是`Object`的子类，但是`String[]`并不是`Object[]`的子类，所以此时转换就是失败的

2. 定义泛型方法：泛型方法在方法被调用时泛型被推导为具体类型。基本格式如下：

    ```java
    权限修饰符 其他修饰符 <T> 方法返回值 方法名(泛型形参列表) {
        // 方法体
    }
    ```

    基本使用如下：

    === "简单添加方法"

        ```java
        public class ListUtils {
            //定义一个静态方法addAll,添加多个集合的元素
            public static <E> void addAll(ArrayList<E> list, E...e){
                for (E element : e) {
                    list.add(element);
                }
            }
        }
        ```

    === "测试类"

        ```java
        // 测试
        public class Test01 {
            public static void main(String[] args) {
                ArrayList<String> list1 = new ArrayList<>();
                ListUtils.addAll(list1,"a","b","c");
                // 也可以写成如下形式
                // ListUtils.<String>addAll(list1,"a","b","c");
                System.out.println(list1);
    
                System.out.println("================");
    
                ArrayList<Integer> list2 = new ArrayList<>();
                ListUtils.addAll(list2,1,2,3,4,5);
                System.out.println(list2);
            }
        }
        ```

3. 定义泛型接口：泛型接口在实现类实例化对象时或者实现类本身指定了具体类型，泛型才会被推导为具体类型。基本格式如下，与定义泛型类基本一致：

    ```java
    public interface 接口名 <T> {
        // 成员
    }
    ```

    基本使用可以分为两种情况：

    1. 实现类实例化对象时确定类型

        === "接口"

            ```java
            // 泛型接口
            public interface MyList <E> {
                public boolean add(E e);
            }
            ```

        === "实现类"

            ```java
            // 接口实现类
            public class MyArrayList1<E> implements MyList<E> {
                //定义一个数组,充当ArrayList底层的数组,长度直接规定为10
                Object[] obj = new Object[10];
                //定义size,代表集合元素个数
                int size;
        
                /**
                * 定义一个add方法,参数类型需要和泛型类型保持一致
                *
                * 数据类型为E  变量名随便取
                */
                public boolean add(E e) {
                    obj[size] = e;
                    size++;
                    return true;
                }
        
                /**
                * 定义一个get方法,根据索引获取元素
                */
                public E get(int index) {
                    return (E) obj[index];
                }
        
                @Override
                public String toString() {
                    return Arrays.toString(obj);
                }
            }
            ```

        === "测试类"

            ```java
            // 测试
            public class Test02 {
                public static void main(String[] args) {
                    MyArrayList1<String> list1 = new MyArrayList1<>();
                    list1.add("张三");
                    list1.add("李四");
                    System.out.println(list1.get(0));
        
                }
            }
            ```

    2. 实现类已经指定了具体的类型

        === "接口"

            ```java
            // 接口
            public interface MyIterator <E> {
                E next();
            }
            ```

        === "实现类"

            ```java
            // 实现类指定了具体类型为String
            public class MyScanner implements MyIterator<String> {
                @Override
                public String next() {
                    return "实现类指定具体类型时推导泛型";
                }
            }
            ```

        === "测试类"

            ```java
            // 测试
            public class Test03 {
                public static void main(String[] args) {
                    MyScanner myScanner = new MyScanner();
                    String result = myScanner.next();
                    System.out.println("result = " + result);
                }
            }
            ```

## 裸类型

在早期的JDK版本中是没有泛型的概念的，而后来的版本推出泛型还需要兼容之前没有泛型的写法，所以在有了泛型之后就出现了裸类型，所谓裸类型就是一个泛型类但是没有带类型实参，例如下面的代码：

```java
MyArrayList list = new MyArrayList();
```

其中，`MyArrayList`就是一个裸类型，但是在现在的实际开发中，不推荐使用裸类型

## 泛型编译原理

实际上，在Java中，泛型并不会在编译时推导为指定的类型，而是统一转换为`Object`类型，例如针对前面写的`MyArrayList`类来说，将其字节码进行反汇编可以看到下面的结果：

<img src="21. Java中的泛型.assets/image-20250709160712213.png" style="width: 50%;">

像这种在编译过程中，将所有的`T`替换成`Object`的机制称为**擦除机制**

## 类型限定符

在Java中，可以通过`extends`关键字限制方法或类时传递给泛型的类型

`extends`：限制传递给模版的具体类型为`extends`关键字后的本类或者其子类类型，也被称为**泛型上界**，基本语法如下：

```java
模版参数类型 extends 具体类型

// 例如
// 类
public class Test04 <T extends String>{
}

// 方法
public <T extends String> void test(T t) {
    System.out.println(t);
}
```

通过泛型上界也可以限定某一个类必须实现某一种接口，例如：

```java
// 类
public class Test05 <T extends Comparable<T>>{
}
```

上面这个类表示传递的类型必须实现了`Comparable<T>`接口，否则编译报错

## 泛型通配符

如果需要确保传递给泛型的具体类型为任意引用数据类型，可以在`<>`中使用`?`占位，表示泛型通配符，例如：

```java
public class Test05 {
    public static void main(String[] args) {
        ArrayList<String> list1 = new ArrayList<>();
        list1.add("张三");
        list1.add("李四");

        ArrayList<Integer> list2 = new ArrayList<>();
        list2.add(1);
        list2.add(2);
        
        method(list1);
        method(list2);
    }
    
    public static void method(ArrayList<?> list){
        for (Object o : list) {
            System.out.println(o);
        }
    }

}
```

## 泛型上界和下界

通配符上界：`? extends 类`，表示指定类型及其子类。通配符的上界，**不能进行写入数据，只能进行读取数据**，因为子类可能有很多，无法确定具体是哪一个子类

通配符下界：`? super 类`，表示指定类型及其父类。通配符的下界，**不能进行读取数据，只能写入数据**，因为需要调用指定类型或者父类自己的方法

例如下面的代码：

```java
public class Test06 {
    public static void main(String[] args) {
        ArrayList<Integer> list1 = new ArrayList<>();
        ArrayList<String> list2 = new ArrayList<>();
        ArrayList<Number> list3 = new ArrayList<>();
        ArrayList<Object> list4 = new ArrayList<>();

        get1(list1);
        //get1(list2);错误
        get1(list3);
        //get1(list4);错误

        System.out.println("=================");

        //get2(list1);错误
        //get2(list2);错误
        get2(list3);
        get2(list4);
    }

    //上限  ?只能接收extends后面的本类类型以及子类类型
    public static void get1(Collection<? extends Number> collection){

    }

    //下限  ?只能接收super后面的本类类型以及父类类型
    public static void get2(Collection<? super Number> collection){

    }
}
```
