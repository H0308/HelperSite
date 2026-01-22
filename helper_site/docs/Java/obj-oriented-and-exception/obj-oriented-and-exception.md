<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java异常类

## Java中的异常体系

在Java中，异常类的父类为`Throwable`类，在`Throwable`下，存在两个子类：

1. `Error`类：错误类，一般错误类中的错误都是致命错误，例如栈溢出错误`StackOverflowError`
2. `Exception`类：异常类，一般是小型错误，例如数组越界`ArrayIndexOutofBoundException`

一般情况下`Exception`类是编译时异常，但是其中有一个特殊的异常`RuntimeException`，该异常为运行时异常，例如数组越界异常就属于`RuntimeException`

上面的体系可以参考下图：

<img src="9. Java异常类.assets\image.png">

区分一个异常类属于编译时异常还是运行时异常可以看该异常类是否直接继承`Exception`类，如果是则是编译时异常，否则继承自`RuntimeException`代表运行时异常

## 抛出异常

在Java中，使用`throw`关键字抛出异常对象，基本格式如下：

```java
throw new 异常类(<可选打印信息>);
```

例如下面的代码：

```java
public class Test {
    public static void main(String[] args) {
        String s = "test.txt";
        method(s);
    }

    public static void method(String s) {
        if(!s.endsWith(".txt")) {
            throw new FileNotFoundException("文件不存在");
        }
        else {
            System.out.println("文件存在");
        }
    }
}
```

!!! note

    需要注意的是，如果抛出的异常属于编译时异常，那么必须在方法形参后使用`throws`关键字抛出，否则编译不通过

## 处理异常

### 处理异常的两种方式

在Java中一共有两种处理异常的方式：

1. 使用`throws`关键字抛出当前方法中的异常，如果一个方法有多个异常抛出，可以使用`,`分隔不同的异常类，使用格式如下：

    ```java
    方法(形参列表) throws 异常类名1, 异常类2... {
        // 方法体
        throw new 异常对象名();
    }

    // 例如
    public static void method(String s) throws FileNotFoundException {
        if(!s.endsWith(".txt")) {
            throw new FileNotFoundException("文件不存在");
        }
        else {
            System.out.println("文件存在");
        }
    }
    ```

2. 使用`try...catch`捕获异常，使用`try`包裹可能出现异常的语句，`catch`捕获异常对象，`catch`语句可以不止一个，基本格式如下：

    ```java
    try{
        // 可能出现异常的语句
    }
    catch(异常类 异常对象名)
    {
        // 处理语句
    }
    // 可以有多个catch语句
    ```

    例如下面的代码：

    ```java
    public class Test {
        public static void main(String[] args) {
            String s = "test.txt1";
            try {
                method(s);
            } catch (FileNotFoundException e) {
                System.out.println(e);
                // 也可以使用下面的方式打印完整信息
                // e.printStackTrace();
            }
        }

        public static void method(String s) throws FileNotFoundException {
            if (!s.endsWith(".txt")) {
                throw new FileNotFoundException("文件不存在");
            } else {
                System.out.println("文件存在");
            }
        }
    }
    ```

    或者使用一个`catch`，在`catch`中捕获多个异常类，使用`|`分隔，但是不推荐，例如：

    ```java
    try{
        // 可能出现异常的语句
    }
    catch(异常类1 | 异常类2 | ... 异常类n 异常对象名)
    {
        // 处理语句
    }
    ```

在处理异常时，如果抛出的异常类是另一个异常类的子类，那么可以使用`throws`向上抛出对应父类异常类，例如上面的`FileNotFoundException`属于父类`IOException`，所以可以抛出`IOException`或者`Exception`

同样，对于`try...catch`语句也是如此

```java
public class Test {
    public static void main(String[] args) {
        String s = "test.txt1";
        try {
            method(s);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public static void method(String s) throws IOException {
        if (!s.endsWith(".txt")) {
            throw new FileNotFoundException("文件不存在");
        } else {
            System.out.println("文件存在");
        }
    }
}
```

如果可能出现的异常语句在`try`中确实出现了异常，则当前`try`中出现异常的语句之后的语句不会再执行，否则正常执行，例如下面的代码：

```java
public class Test {
    public static void main(String[] args) {
        String s = "test.txt1";
        try {
            method(s);
            System.out.println("出现异常时我不会出现");
        } catch (FileNotFoundException e) {
            System.out.println(e);
        }
    }

    public static void method(String s) throws IOException {
        if (!s.endsWith(".txt")) {
            throw new FileNotFoundException("文件不存在");
        } else {
            System.out.println("文件存在");
        }
    }
}

输出结果：
java.io.FileNotFoundException: 文件不存在
```

### `try...catch`和`throws`的区别

使用`throws`处理异常时，第一个出现异常的位置开始抛出异常，此时该方法不再执行剩余的代码，将异常向方法调用处抛，如果方法调用处依旧没有处理异常，则继续向上抛出，以此类推，如果最后一个调用处依旧没有处理，则此时JVM就会报错，打印对应的异常信息

使用`try...catch`处理异常时，如果`catch`可以捕获到`try`中的异常，则代表异常被正常处理，此时其他的`catch`将不会被执行（即从上而下依次匹配直到遇到合适的），但是不可以将父类异常放在子类异常前，否则编译报错，当正常处理完异常后，`try...catch`后面的语句将正常执行

### `finally`关键字

`finally`关键字用于一定要执行的代码，放在最后一个`catch`之后，有了`finally`后，不论是否出现了异常，都会走`finally`中的语句，除非在可以捕获到对应异常的`catch`语句中使用了`System.exit(0)`（结束JVM虚拟机运行），例如下面的代码：

=== "未添加`System.exit(0)`"

    ```java
    public class Test {
        public static void main(String[] args) {
            String s = "test.txt1";
            try {
                method(s);
                System.out.println("出现异常时我不会出现");
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                System.out.println("必须要执行我");
            }
        }

        public static void method(String s) throws IOException {
            if (!s.endsWith(".txt")) {
                throw new FileNotFoundException("文件不存在");
            } else {
                System.out.println("文件存在");
            }
        }
    }

    输出结果：
    java.io.FileNotFoundException: 文件不存在
        at com.epsda.advanced.test_exception.Test.method(Test.java:30)
        at com.epsda.advanced.test_exception.Test.main(Test.java:18)
    必须要执行我
    ```

=== "添加了`System.exit(0)`"
    
    ```java
    // 如果加了System.exit(0)
    public class Test {
        public static void main(String[] args) {
            String s = "test.txt1";
            try {
                method(s);
                System.out.println("出现异常时我不会出现");
            } catch (IOException e) {
                e.printStackTrace();
                System.exit(0); 使用 System.exit(0) 退出程序，此时finally也不会执行
            } finally {
                System.out.println("必须要执行我");
            }
        }

        public static void method(String s) throws IOException {
            if (!s.endsWith(".txt")) {
                throw new FileNotFoundException("文件不存在");
            } else {
                System.out.println("文件存在");
            }
        }
    }

    输出结果：
    java.io.FileNotFoundException: 文件不存在
        at com.epsda.advanced.test_exception.Test.method(Test.java:30)
        at com.epsda.advanced.test_exception.Test.main(Test.java:18)
    ```

一般使用`finally`在关闭资源时，因为部分情况下GC（垃圾回收器）无法回收堆内存中的文件，从而无法释放内存，此时需要在`finally`中手动关闭资源

## 抛出异常注意事项

1. 如果父类方法已经抛出了异常，子类重写父类对应的方法就可以不再抛出异常
2. 如果父类方法没有抛出异常，子类重写父类对应的方法就不要抛出异常

例如下面的代码：

```java
// 父类方法不抛出异常，但子类对应的重写方法抛出异常
public class Test1 {
    public static void main(String[] args) {

    }

    class A {
        public void method() {

        }
    }

    class B extends A {
        @Override
        public void method() throws Exception{

        }
    }
}

输出结果：
overridden method does not throw java.lang.Exception
```

## 自定义异常类

如果想要自定义一个异常类，则自定义的类就必须继承自`Exception`，否则编译器不会将其当作异常类，格式如下：

```java
public class 自定义异常类名 extends Exception {
    // 内容
}
```

例如下面的代码：

=== "自定义异常类"

    ```java
    // 自定义异常类
    public class LoginFailException extends Exception{
    }
    ```

=== "测试类"

    ```java
    // 测试
    public class Test2 {
        public static void main(String[] args) {
            String name = "admin";
            String password = "123456";
            try {
                login(name, password);
            } catch (LoginFailException e) {
                e.printStackTrace();
            }
        }

        public static void login(String name, String password) throws LoginFailException{
            if(!name.equals("admin") || !password.equals("123456")){
                throw new LoginFailException();
            }
        }
    }
    ```

如果想添加自定义异常信息，需要提供一个有参构造函数，该构造函数使用一个`String`类型的`message`构造对象，此时会调用父类的构造函数，因为`Exception`类中存在对应的构造函数

=== "自定义异常类"

    ```java
    // 自定义异常类
    public class LoginFailException extends Exception{
        public LoginFailException() {
        }

        public LoginFailException(String message) {
            super(message);
        }
    }
    ```

=== "测试类"

    ```java
    // 测试
    public class Test2 {
        public static void main(String[] args) {
            String name = "admin";
            String password = "123456";
            try {
                login(name, password);
            } catch (LoginFailException e) {
                e.printStackTrace();
            }
        }

        public static void login(String name, String password) throws LoginFailException{
            if(!name.equals("admin") || !password.equals("123456")){
                throw new LoginFailException("登录失败");
            }
        }
    }
    ```