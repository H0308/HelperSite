<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java中的JDK8及后续的重要新特性

## 函数式接口

### 介绍

函数式接口：接口中有且仅有一个抽象方法，但是可以有多个其他的方法。可以使用注解：`@FunctionalInterface`检测某个接口是否是函数式接口

例如下面的代码：

```java
@FunctionalInterface
public interface Person {
    // 只有一个抽象方法
    void eat();
    // 可以有多个默认方法
    default void run() {
        System.out.println("Person run");
    }
    // 可以有多个静态方法
    static void sleep() {
        System.out.println("Person sleep");
    }
}
```

### JDK8及之后的常见函数式接口

在使用函数式接口中最需要关注的就是唯一的抽象方法的参数和返回值，而抽象方法的具体实现可以考虑使用匿名内部类来完成，例如接下来提到的内置的常见函数式接口的使用

#### `Supplier`接口

`Supplier`接口：表示`java.util.function.Supplier<T>`接口，该接口的作用是通过重写的方法获取指定内容

`Supplier`接口中的抽象方法：`T get()`

基本使用如下（在重写的`get`方法中获取数组最大值）：

```java
public class Test {
    public static void main(String[] args) {
        int[] data = {54, 645, 211, 478, 24, 11, 555, 789};
        int max = getMax(new Supplier<Integer>() {
            @Override
            public Integer get() {
                Arrays.sort(data);
                return data[data.length - 1];
            }
        });

        System.out.println(max);
    }

    public static int getMax(Supplier<Integer> integer) {
        return integer.get(); // get()方法获取Supplier中的数据
    }
}
```

#### `Consumer`接口

`Consumer`接口：表示`java.util.function.Consumer<T>`接口，该接口的作用是在重写的方法体内操作重写方法的参数

`Consumer`接口中的抽象方法：`void accept(T t)`

基本使用如下（获取参数字符串的长度）：

```java
public class Test01 {
    public static void main(String[] args) {
        getLength(new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s.length());
            }
        });
    }

    public static void getLength(Consumer<String> consumer) {
        consumer.accept("Hello World");
    }
}
```

#### `Function`接口

`Function`接口：表示`java.util.function.Function<T, R>`接口，该接口作用是将一种类型的数据转换为另一种类型

`Function`接口中的抽象方法：`R apply(T t)`，参数表示需要转换的参数，返回值类型表示转换后的参数类型

基本使用如下（将整数转换为字符串类型）：

```java
public class Test02 {
    public static void main(String[] args) {
        System.out.println(alter(new Function<Integer, String>() {
            @Override
            public String apply(Integer integer) {
                return String.valueOf(integer) + 1;
            }
        }, 20));
    }

    public static String alter(Function<Integer, String> function, Integer integer) {
        return function.apply(integer);
    }
}
```

#### `Predicate`接口

`Predicate`接口：`java.util.function.Predicate<T>`接口，该接口的作用是在重写的方法体内判断

`Predicate`接口抽象方法：`boolean test(T t)`

基本使用如下（判断一个账号是否为手机号：1. 至少为11位 2. 第一位必须是1 3. 最后一位不能是0）：

```java
public class Test03 {
    public static void main(String[] args) {
        System.out.println(checkPhoneNumber(new Predicate<String>() {
            @Override
            public boolean test(String string) {
                return string.matches("[1]\\d{9}[1-9]");
            }
        }, "15964224230"));
    }

    public static boolean checkPhoneNumber(Predicate<String> predicate, String string) {
        return predicate.test(string);
    }
}
```

## 函数式编程思想和Lambda表达式

### 基本介绍与使用

面向对象思想与函数式编程思想：

1. 面向对象思想：强调对象如何完成任务
2. 函数式编程思想：强调是否完成任务

lambda表达式基本结构如下：

```java
(参数列表) -> {
    // 方法体
}
```

1. (参数列表)：表示重写的方法对应的参数，此位置可以省略参数类型保留参数名，如果只有一个参数，则还可以省去参数列表的括号`()`
2. `->`：将参数列表传入到方法体
3. `{}`：定义重写方法的方法体
    1. 如果方法体只有一句话，则可以去掉括号`{}`和尾部的分号`;`
    2. 如果方法体只有一个`return`语句，则可以省去`return`关键字

实际上，lambda表达式就是对匿名内部类的简化，可以理解为lambda表达式就是实现了一个函数式接口的匿名内部类，而参数列表就是重写的方法的参数，对应的方法体就是重写方法的方法体

以排序自定义对象`ArrayList`为例，基本使用如下：

=== "使用匿名内部类"

    ```java
    public class Test {
        public static void main(String[] args) {
            ArrayList<Person> people = new ArrayList<>();
            people.add(new Person("张三", 18));
            people.add(new Person("李四", 20));
            people.add(new Person("王五", 22));
            people.add(new Person("赵六", 24));

            // 使用匿名内部类实现Comparator接口
            Collections.sort(people, new Comparator<Person>() {
                @Override
                public int compare(Person o1, Person o2) {
                    return o1.getAge() - o2.getAge();
                }
            });

            for (Person person : people) {
                System.out.println(person);
            }
        }
    }
    ```

=== "使用lambda表达式"

    ```java
    public class Test {
        public static void main(String[] args) {
            ArrayList<Person> people = new ArrayList<>();
            people.add(new Person("张三", 18));
            people.add(new Person("李四", 20));
            people.add(new Person("王五", 22));
            people.add(new Person("赵六", 24));

            // 使用lambda表达式
            // 省略参数类型，省略return关键字，省略大括号和分号
            Collections.sort(people, (o1, o2) -> o1.getAge() - o2.getAge());

            for (Person person : people) {
                System.out.println(person);
            }
        }
    }
    ```

需要注意的是，除了匿名内部类中存在着变量捕获以外，在lambda中同样存在着变量捕获，但是在匿名内部类和lambda表达式中只能使用捕获到的外部变量或常量，而不能在内部修改变量，例如下面的代码，以lambda为例：

```java
@FunctionalInterface
interface NoParameterNoReturn {
    void test();
}

public static void main(String[] args) {
    int a = 10;
    NoParameterNoReturn noParameterNoReturn = ()->{
    // a = 99; 不可以修改
    System.out.println("捕获变量："+a);};
    noParameterNoReturn.test();
}
```

### lambda表达式与函数式接口

#### 结合`Supplier`接口

找出数组的最大值：

```java
public class Test01 {
    public static void main(String[] args) {
        System.out.println(getMax(() -> {
            int[] nums = {45, 64, 25, 12, 123, 42};
            Arrays.sort(nums);
            return nums[nums.length - 1];
        }));
    }

    public static int getMax(Supplier<Integer> integerSupplier) {
        return integerSupplier.get();
    }
}
```

#### 结合`Consumer`接口

获取参数字符串的长度：

```java
public class Test02 {
    public static void main(String[] args) {
        getLength(s -> System.out.println(s.length()), "shsudhbsnbxc");
    }

    public static void getLength(Consumer<String> consumer, String s) {
        consumer.accept(s);
    }
}
```

#### 结合`Function`接口

将整数类型转换为字符串类型：

```java
public class Test03 {
    public static void main(String[] args) {
        System.out.println(alter(integer -> integer + "" + 1, 123));
    }

    public static String alter(Function<Integer, String> function, Integer integer) {
        return function.apply(integer);
    }
}
```

#### 结合`Predicate`接口

判断一个账号是否为手机号：1. 至少为11位 2. 第一位必须是1 3. 最后一位不能是0

```java
public class Test04 {
    public static void main(String[] args) {
        System.out.println(isPhoneNumber(phone -> phone.matches("[1]\\d{9}[1-9]"), "1854125421"));
    }

    public static boolean isPhoneNumber(Predicate<String> string, String phone) {
        return string.test(phone);
    }
}
```

## `Stream`流

`Stream`流提供了一种新的编程思路：流式编程，这里的`Stream`流不是IO流

### `Stream`流对象获取

获取`Stream`流对象的方法有两种：

1. 对于集合来说：使用`Collection`中的方法：`Stream<E> stream()`
2. 对于数组来说：使用`Stream`接口中的静态方法：`static <T> Stream<T> of(T... values)`

基本使用如下：

```java
public class Test {
    public static void main(String[] args) {
        // 对于集合
        ArrayList<Integer> integers = new ArrayList<>();
        Collections.addAll(integers, 1, 2, 3, 4);
        // 通过集合创建Stream流对象
        Stream<Integer> stream = integers.stream();

        // 对于数组
        Stream<String> stringStream = Stream.of("a", "b", "cd", "asd");
    }
}
```

!!! note
    注意，`Stream`流并没有重写`toString`方法，所以直接打印对象名时`Stream`对象的地址

### `Stream`中的方法

#### `forEach`方法

`forEach`方法用于遍历流对象中的内容：`void forEach(Consumer<? super T> action);`，参数的函数式接口重写的方法中可以定义在遍历过程中的操作

遍历整型数组，并将数组中每一个元素加上对应下标：

```java
public class Test01 {
    public static void main(String[] args) {
        Stream.of(1,2,3,4,5).forEach(data -> System.out.println(data+1));
    }
}
```

上面的代码等价于：

```java
public class Test01 {
    public static void main(String[] args) {
        Stream<Integer> integerStream = Stream.of(1, 2, 3, 4, 5);
        integerStream.forEach(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) {
                System.out.println(integer.intValue() + 1);
                // 或者直接利用自动拆箱和装箱：System.out.println(integer + 1);
            }
        });
    }
}
```

需要注意，`forEach`方法是一个终结方法，一旦使用了`forEach`方法，就不可以再使用对应的流对象

#### `count`方法

`count`方法：`long count()`，该方法用于统计流对象中内容的个数

例如，统计一个集合中的元素：

```java
public class Test02 {
    public static void main(String[] args) {
        ArrayList<Integer> integers = new ArrayList<>();
        Collections.addAll(integers, 1,2,3,4,5);
        System.out.println(integers.stream().count()); // 5
    }
}
```

需要注意，`count`方法是一个终结方法，一旦使用了`count`方法，就不可以再使用对应的流对象

#### `filter`方法

`filter`方法：`Stream<T> filter(Predicate<? super T> predicate)`，该方法可以根据参数的函数式接口重写方法筛选流对象中的内容，该方法返回一个新的流对象

例如，找出字符串中以`a`开头并且以`d`结尾的字符串

```java
public class Test03 {
    public static void main(String[] args) {
        ArrayList<String> strings = new ArrayList<>();
        Collections.addAll(strings, "asd", "sdahihs", "asdiyd", "assdds");
        strings.stream().filter(
                string -> string.startsWith("a") && string.endsWith("d")).forEach(
                        string -> System.out.print(string + " ")); // asd asdiyd 
    }
}
```

#### `limit`方法

`limit`方法：`Stream<T> limit(long maxSize)`，该方法用于取出流对象中前`maxSize`个元素，该方法返回一个新的流对象

例如，取出数组中前3个元素：

```java
public class Test04 {
    public static void main(String[] args) {
        Stream.of(1,2,3,4,5).limit(3).forEach(data -> System.out.print(data + " ")); // 1 2 3
    }
}
```

#### `skip`方法

`skip`方法：`Stream<T> skip(long n)`，该方法用于跳过前`n`个元素，该方法返回一个新的流对象

例如，跳过数组中的前3个元素：

```java
public class Test04 {
    public static void main(String[] args) {
        Stream.of(1,2,3,4,5).skip(3).forEach(data -> System.out.print(data + " ")); // 4 5
    }
}
```

#### `concat`方法

`concat`方法：`static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b)`，该方法用于将两个流中的内容进行拼接存入到一个新流对象中，该方法返回一个新的流对象

例如，拼接两个数组的内容：

```java
public class Test05 {
    public static void main(String[] args) {
        Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);
        Stream<Integer> stream1 = Stream.of(6, 7, 8, 9);
        Stream.concat(stream, stream1).forEach(data -> System.out.println(data));
    }
}
```

#### `Stream`流对象转换为集合对象

使用`Stream`流中的接口方法`collect()`：

!!! note
    使用时通过编译器的提示进行选择，一般选择`Collectors.toxxx()`

```java
public class Test06 {
    public static void main(String[] args) {
        List<Integer> collect = Stream.of(1, 2, 3, 4, 5).collect(Collectors.toList());
        for (Integer i : collect) {
            System.out.println(i);
        }
    }
}
```

#### `dinstinct`方法

`distinct`方法：`Stream<T> distinct()`，将对应流对象中的内容去重，但是依赖流对象中内容对应的类重写`hashCode`方法和`equals`方法，该方法返回一个新的流对象

例如，对指定内容进行去重：

```java
public class Test07 {
    public static void main(String[] args) {
        Stream.of(1,2,3,2,2,2,3,3,5).distinct().forEach(data -> System.out.println(data));
    }
}
```

#### 转换流中的类型

使用`Stream`中的方法：`Stream<R> map(Function<T,R> mapper)`，可以将`T`数据类型通过函数式接口的重写方法转换为`R`类型放到新流对象中，该方法返回一个新的流对象

例如，将整数类型转换为字符串类型：

```java
public class Test08 {
    public static void main(String[] args) {
        Stream.of(1,2,3,4,5).map(
                data -> String.valueOf(data) + 1).forEach(
                        strings-> System.out.println(strings));
    }
}
```

#### `Stream`流小练习

1. 第一个队伍只要名字为3个字的成员姓名
2. 第一个队伍筛选之后只要前3个人
3. 第二个队伍只要姓张的成员姓名
4. 第二个队伍筛选之后不要前2个人
5. 将两个队伍合并为一个队伍
6. 打印整个队伍的姓名信息

示例代码：

```java
public class Test09 {
    public static void main(String[] args) {
        ArrayList<String> team1 = new ArrayList<>();
        team1.add("迪丽热巴");
        team1.add("宋远桥");
        team1.add("苏星河");
        team1.add("老子");
        team1.add("庄子");
        team1.add("孙子");
        team1.add("洪七公");

        ArrayList<String> team2 = new ArrayList<>();
        team2.add("古力娜扎");
        team2.add("张无忌");
        team2.add("张三丰");
        team2.add("赵丽颖");
        team2.add("张二狗");
        team2.add("张天爱");
        team2.add("张三");

        // 第一个队伍
        Stream<String> teamFirst = team1.stream().filter(name -> name.length() == 3).limit(3);
        // 第二个队伍
        Stream<String> teamSecond = team2.stream().filter(name -> name.startsWith("张")).skip(2);

        // 合并
        Stream.concat(teamFirst, teamSecond).forEach(team -> System.out.println(team));
    }
}
```

## 方法引用

### 基本规则

方法引用：对需要使用的方法使用引用的方式指代。主要作用是简化lambda表达式

使用方法引用的要求：

1. 被引用的方法要写在重写方法里面
2. 被引用的方法从参数上、返回值上要和所在重写方法一致
3. 引用的方法最好是操作重写方法的参数值的

更改为方法引用的步骤：

1. 去掉重写方法的参数
2. 去掉`->`
3. 去掉被引用方法的参数和括号
4. 将被引用方法的`.`改成`::`

例如下面的代码：

```java
public class Test {
    public static void main(String[] args) {
        // 匿名内部类正常表示
        Stream.of(1,2,3,4,5).forEach(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) {
                System.out.println(integer);
            }
        });
        // lambda表达式
        // Stream.of(1,2,3,4,5).forEach(integer -> System.out.println(integer));
        // 引用println
        // 前提：
        // System.out.println(integer)为重写方法的方法体
        // 参数为String类型，没有返回值，与forEach中的函数式接口Consumer的方法accept返回值相同
        // println打印参数值，属于操作参数
        // 更改：
        Stream.of(1, 2, 3, 4, 5).forEach(System.out::println);
    }
}
```

### 使用对象名引用成员方法

格式：`对象名::成员方法名`

例如：

```java
// 例1
public class Test01 {
    public static void main(String[] args) {
        method(() -> "    abc   ".trim());
        // 转化为
        method("    abc   "::trim);
    }

    public static void method(Supplier<String> supplier){
        String s = supplier.get();
        System.out.println("s = " + s);
    }
}

// 例2
public class Test02 {
    public static void main(String[] args) {
        System.out.println(isPhoneNumber(phone -> phone.equals("1848")));
        System.out.println(isPhoneNumber("18483"::equals));
    }

    public static boolean isPhoneNumber(Predicate<String> string) {
        return string.test("18483");
    }
}
```

### 使用类名引用静态方法

格式：`类名::静态成员方法`

例如：

```java
public class Test03 {
    public static void main(String[] args) {
        // 常规lambda
        method(d -> showDouble(d), 2.35);
        // 简化
        method(Test03::showDouble, 2.35);
    }

    public static void showDouble(double d) {
        System.out.println(d);
    }

    public static void method(Consumer<Double> consumer, double d){
        consumer.accept(d);
    }
}
```

### 使用类构造引用

格式：`构造方法名称::new`

例如：

```java
@ToString
public class Person {
    private String name;
    private Integer age;

    public Person (String name) {
        this.name = name;
        this.age = 18;
    }
}

public class Test04 {
    public static void main(String[] args) {
        // 常规lambda
        method(name -> new Person(name), "张三");
        // 简化
        method(Person::new, "张三");
    }
    public static void method(Function<String,Person> function, String name){
        Person person = function.apply(name);
        System.out.println(person);
    }
}
```

### 使用数组引用

格式：`数组的数据类型[]::new`

例如：

```java
public class Test05 {
    public static void main(String[] args) {
        // 常规lambda
        create(data -> new int[data], 15);
        // 简化
        create(int[]::new, 15);
    }

    public static void create(Function<Integer, int[]> function, Integer data) {
        int[] arr = function.apply(data);
        System.out.println(arr.length);
    }
}
```

## Java中的JDK9-17新特性

### 接口的私有方法

JDK8版本接口增加了两类成员：

- 公共的默认方法
- 公共的静态方法

JDK9版本接口又新增了一类成员：

- 私有的方法

```java
// 接口
public interface USB {
    private void open(){
        System.out.println("私有非静态方法");
    }

    private static void close(){
        System.out.println("私有静态方法");
    }

    //定义一个默认方法调用私有方法
    public default void methodDef(){
        open();
        close();
    }
}

// 实现类
public class UsbImpl implements USB{
}

// 测试类
public class Test01 {
    public static void main(String[] args) {
        new UsbImpl().methodDef();
    }
}
```

### 钻石操作符与匿名内部类结合

自Java 9之后我们将能够与匿名实现类共同使用钻石操作符`<>`，即匿名实现类也支持类型自动推断

```java
// 不使用lambda表达式排序自定义对象ArrayList
public class Test {
    public static void main(String[] args) {
        ArrayList<Person> people = new ArrayList<>();
        people.add(new Person("张三", 18));
        people.add(new Person("李四", 20));
        people.add(new Person("王五", 22));
        people.add(new Person("赵六", 24));

        // 使用匿名内部类实现Comparator接口
        Collections.sort(people, new Comparator<Person>() {
            @Override
            public int compare(Person o1, Person o2) {
                return o1.getAge() - o2.getAge();
            }
        });

        for (Person person : people) {
            System.out.println(person);
        }
    }
}

// 使用lambda表达式
public class Test {
    public static void main(String[] args) {
        ArrayList<Person> people = new ArrayList<>();
        people.add(new Person("张三", 18));
        people.add(new Person("李四", 20));
        people.add(new Person("王五", 22));
        people.add(new Person("赵六", 24));

        // 使用lambda表达式
        // 省略参数类型，省略return关键字，省略大括号和分号
        Collections.sort(people, (o1, o2) -> o1.getAge() - o2.getAge());

        for (Person person : people) {
            System.out.println(person);
        }
    }
}
```

### `try-with-resources`

之前提过JDK 1.7引入了`try-with-resources`的新特性，可以实现资源的自动关闭，此时要求：

- 该资源必须实现`java.io.Closeable`接口
- 在`try`子句中声明并初始化资源对象
- 该资源对象必须是`final`的

```java
try(IO流对象1声明和初始化;IO流对象2声明和初始化){
    可能出现异常的代码
}catch(异常类型 对象名){
    异常处理方案
}
```

JDK1.9又对`try-with-resources`的语法升级了

- 该资源必须实现`java.io.Closeable`接口
- 在`try`子句中声明并初始化资源对象，也可以直接使用已初始化的资源对象
- 该资源对象必须是`final`的

```java
IO流对象1声明和初始化;
IO流对象2声明和初始化;

try(IO流对象1;IO流对象2){
    可能出现异常的代码
}catch(异常类型 对象名){
    异常处理方案
}
```

例如：

```java
public class Test03 {
    public static void main(String[] args) throws IOException {
        //method01();
        method02();
    }

    /**
     * jdk9开始
     * 为了减轻try的压力,可以将对象放到外面去new,然后将对象名,放到 try中
     * 而且依然能自动刷新和关流
     */
    private static void method02() throws IOException {
        FileWriter fw = new FileWriter("module24\\io.txt");
        try(fw){
            fw.write("你好");
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * jdk8之前
     */
    private static void method01() {
        try(FileWriter fw = new FileWriter("module24\\io.txt")){
            fw.write("你好");
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```

### 局部变量类型自动推断

JDK10之前，定义局部变量都必须要明确数据的数据类型，但是到了JDK10，出现了一个最为重要的特性，就是局部变量类型推断，顾名思义，就是定义局部变量时，不用先确定具体的数据类型了，可以直接根据具体数据推断出所属的数据类型：

语法如下：

```java
var 变量名 = 值;
```

例如：

```java
public class Test04 {
    public static void main(String[] args) {
        var i = 10;
        System.out.println("i = " + i);

        var j = "helloworld";
        System.out.println("j = " + j);

        var arr = new int[]{1,2,3,4,5};
        for (var element : arr) {
            System.out.println(element);
        }
    }
}
```

!!! note

    需要注意，使用`var`创建局部变量，其值不可以为`null`，即下面的代码会报错：

    ```java
    var str = null; // error
    ```

### `switch`表达式

`switch`表达式在Java 12中作为预览语言出现，在Java 13中进行了二次预览，得到了再次改进，最终在Java 14中确定下来。另外，在Java17中预览了`switch`模式匹配

传统的`switch`语句在使用中有以下几个问题：

1. 匹配是自上而下的，如果忘记写`break`，那么后面的`case`语句不论匹配与否都会执行
2. 所有的`case`语句共用一个块范围，在不同的`case`语句定义的变量名不能重复
3. 不能在一个`case`语句中写多个执行结果一致的条件，即每个`case`语句后只能写一个常量值
4. 整个`switch`语句不能作为表达式返回值

#### Java12的`switch`表达式

Java 12对`switch`语句进行了扩展，将其作为增强版的`switch`语句或称为`switch`表达式，可以写出更加简化的代码

- 允许将多个`case`语句合并到一行，可以简洁、清晰也更加优雅地表达逻辑分支
- 可以使用`->`代替 :
    - `->`写法默认省略`break`语句，避免了因少写`break`语句而出错的问题。
    - `->`写法在标签右侧的代码段可以是表达式、代码块或`throw`语句。
    - `->`写法在标签右侧的代码块中定义的局部变量，其作用域就限制在代码块中，而不是蔓延到整个`switch`结构
- 同一个`switch`结构中不能混用`→`和`:`（`:`的写法表示继续使用传统`switch`语法），否则会有编译错误。使用字符`:`，这时`fall-through`规则（`case`穿透）依然有效，即不能省略原有的`break`语句。

!!! note

    需要注意，如果`->`写法在标签右侧的代码段如果是带返回值的表达式，那么一定要用一个变量接受`switch`表达式的结果，否则编译报错

案例需求：

请使用`switch-case`结构实现根据月份输出对应季节名称。例如，3～5月是春季，6～8月是夏季，9～11月是秋季，12～2月是冬季

=== "Java12之前写法"

    ```java
    public void test1() {
        int month = 3;
        switch (month) {
            case 3:
            case 4:
            case 5:
                System.out.println("春季");
                break;
            case 6:
            case 7:
            case 8:
                System.out.println("夏季");
                break;
            case 9:
            case 10:
            case 11:
                System.out.println("秋季");
                break;
            case 12:
            case 1:
            case 2:
                System.out.println("冬季");
                break;
            default:
                System.out.println("月份输入有误！");
        }
    }
    ```

=== "Java12之后写法"

    ```java
    private static void method02() {
        int month = 5;
        switch (month) {
            case 12, 1, 2 -> System.out.println("冬季");
            case 3, 4, 5 -> System.out.println("春季");
            case 6, 7, 8 -> System.out.println("夏季");
            case 9, 10, 11 -> System.out.println("秋季");
            default -> System.out.println("有毛病呀,没有这个月份");
        }
    }
    ```

#### Java13的switch表达式

Java 13提出了第二个`switch`表达式预览，引入了`yield`语句，用于返回值。这意味着，`switch`表达式（返回值）应该使用`yield`语句，`switch`语句（不返回值）应该使用`break`语句

案例需求：判断季节

```java
private static void method04() {
    int month = 5;
    var season = switch (month) {
        case 12, 1, 2: yield "冬季";
        case 3, 4, 5: yield "春季";
        case 6, 7, 8: yield "夏季";
        case 9, 10, 11: yield "秋季";
        default: yield "有毛病";
    };
    System.out.println("season = " + season);
}
```

### 文本块

预览的新特性文本块

JDK 12引入了Raw String Literals特性，但在其发布之前就放弃了这个特性。这个JEP与引入多行字符串文字（文本块）在意义上是类似的。Java 13中引入了文本块（预览特性），在Java 15中被最终确定下来，Java 15之后就可以放心使用该文本块了。这个新特性跟Kotlin中的文本块是类似的。

**现实问题**

在Java中，通常需要使用String类型表达HTML，XML，SQL或JSON等格式的字符串，在进行字符串赋值时需要进行转义和连接操作，然后才能编译该代码，这种表达方式难以阅读并且难以维护。

文本块就是指多行字符串，例如一段格式化后的XML、JSON等。而有了文本块以后，用户不需要转义，Java能自动搞定。因此，文本块将提高Java程序的可读性和可写性

**目标**

- 简化跨越多行的字符串，避免对换行等特殊字符进行转义，简化编写Java程序
- 增强Java程序中字符串的可读性

**举例**

会被自动转义，如有一段以下字符串：

```java
<html>
  <body>
      <p>Hello, 尚硅谷</p>
  </body>
</html>
```

将其复制到Java的字符串中，会展示成以下内容：

```java
"<html>\n" +
"    <body>\n" +
"        <p>Hello, 尚硅谷</p>\n" +
"    </body>\n" +
"</html>\n";
```

即被自动进行了转义，这样的字符串看起来不是很直观，在JDK 13中，就可以使用以下语法：

```java
"""
<html>
  <body>
      <p>Hello, world</p>
  </body>
</html>
""";
```

使用`"""`作为文本块的开始符和结束符，在其中就可以放置多行的字符串，不需要进行任何转义。看起来就十分清爽了。

文本块是Java中的一种新形式，它可以用来表示任何字符串，并且提供更多的表现力和更少的复杂性。

1. 文本块由零个或多个字符组成，由开始和结束分隔符括起来。
    - 开始分隔符由三个双引号字符表示，后面可以跟零个或多个空格，最终以行终止符结束。
    - 文本块内容以开始分隔符的行终止符后的第一个字符开始。
    - 结束分隔符也由三个双引号字符表示，文本块内容以结束分隔符的第一个双引号之前的最后一个字符结束。

    以下示例代码是错误格式的文本块：

    ```java
    String err1 = """""";//开始分隔符后没有行终止符,六个双引号最中间必须换行

    String err2 = """  """;//开始分隔符后没有行终止符,六个双引号最中间必须换行
    ```

    如果要表示空字符串需要以下示例代码表示：

    ```java
    String emp1 = "";//推荐
    String emp2 = """
    """;//第二种需要两行，更麻烦了
    ```

2. 允许开发人员使用`\n`、`\f`和`\r`来进行字符串的垂直格式化，使用“`\b`、`\t`进行水平格式化。如以下示例代码就是合法的：

    ```java
    String html = """
        <html>\n
        <body>\n
            <p>Hello, world</p>\n
        </body>\n
        </html>\n
        """;
    ```

3. 在文本块中自由使用双引号是合法的：

    ```java
    String story = """
    Elly said,"Maybe I was a bird in another life."

    Noah said,"If you're a bird , I'm a bird."
    """;
    ```

### `instanceof`模式匹配

`instanceof`的模式匹配在JDK14、15中预览，在JDK16中转正。有了它就不需要编写先通过`instanceof`判断再强制转换的代码

例如：

```java
// 父类
public abstract class Animal {
    public abstract void eat();
}

// 子类
public class Dog extends Animal{
    @Override
    public void eat() {
        System.out.println("狗啃骨头");
    }

    //特有方法
    public void lookDoor(){
        System.out.println("狗会看门");
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        Dog dog = new Dog();
        method(dog);
    }

    public static void method(Animal animal) {
        if(animal instanceof Dog dog) {
            dog.eat();
            dog.lookDoor();
        }
    }
}
```

### `Record`类

`Record`类在JDK14、15预览特性，在JDK16中转正。

`Record`是一种全新的类型，它本质上是一个 `final`类，同时所有的属性都是 `final`修饰，它会自动编译出`get`、`hashCode` 、比较所有属性值的`equals`、`toString` 等方法，减少了代码编写量。使用 `Record` 可以更方便的创建一个常量类。

注意:

1. `Record`只会有一个全参构造
2. 重写的`equals`方法比较所有属性值
3. 可以在`Record`声明的类中定义静态字段、静态方法或实例方法(非静态成员方法)
4. 不能在`Record`声明的类中定义实例字段(非静态成员变量)
5. 类不能声明为`abstract`
6. 不能显式的声明父类，默认父类是`java.lang.Record`类
7. 因为`Record`类是一个 `final`类，所以也没有子类等。

```java
public record Person(String name) {
    //int i;//不能声明实例变量

    static int i;//可以声明静态变量

    //不能声明空参构造
    /* public Person(){
    
        }*/

    //可以声明静态方法
    public static void method(){

    }

    //可以声明非静态方法
    public void method01(){

    }
}

// 测试
public class Test01 {
    public static void main(String[] args) {
        Person person = new Person("张三");
        Person person1 = new Person("张三");
        System.out.println(person);

        System.out.println(person.equals(person1));
    }
}
```

### 密封类

其实很多语言中都有密封类的概念，在Java语言中,也早就有密封类的思想，就是`final`修饰的类，该类不允许被继承。而从JDK15开始,针对密封类进行了升级。

Java 15通过密封的类和接口来增强Java编程语言，这是新引入的预览功能并在Java 16中进行了二次预览，并在Java17最终确定下来。这个预览功能用于限制超类的使用，密封的类和接口限制其他可能继承或实现它们的其他类或接口。

格式：

```java
【修饰符】 sealed class 密封类 【extends 父类】【implements 父接口】 permits 子类{
    
}
【修饰符】 sealed interface 接口 【extends 父接口们】 permits 实现类{
    
}
```

1. 密封类用 `sealed` 修饰符来描述
2. 使用 `permits` 关键字来指定可以继承或实现该类的类型有哪些
3. 一个类继承密封类或实现密封接口，该类必须是`sealed`、`non-sealed`、`final`修饰的
4. `sealed`修饰的类或接口必须有子类或实现类

例如：

```java
public sealed class Animal permits Dog, Cat{
}

public non-sealed class Dog extends Animal{
}

public non-sealed class Cat extends Animal{
}
```