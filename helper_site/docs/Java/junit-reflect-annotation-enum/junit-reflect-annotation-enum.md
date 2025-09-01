<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java中的Junit、类加载时机与机制、反射、注解及枚举

## Junit

### Junit介绍与使用

在Java中，Junit是一个单元测试框架,可以代替`main`方法去执行其他的方法，其可以单独执行一个方法,测试该方法是否能跑通

因为Junit是一个第三方工具包，与Lombok一样需要先导入对应的jar包并进行解压，不同的是，Junit有两个包，并且相互依赖，所以都需要进行解压。这里可以使用一个文件夹名为`lib`，将两个解压包放在`lib`文件下，再对`lib`文件夹进行整体Add as Library

使用时，在需要进行测试的方法上方写上`@Test`注解，此时就会在对应方法所在行左侧显示运行按钮，点击即可运行对应的方法而不会执行其他方法

例如下面的代码：

```java
public class Test01 {
    @Test
    public void method() {
        System.out.println("测试Junit");
    }
}
```

一个类中可以有多个有`@Test`方法：

```java
public class Test01 {
    @Test
    public void method() {
        System.out.println("测试Junit");
    }

    @Test
    public void method01() {
        System.out.println("测试Junit-2");
    }
}
```

如果有多个`@Test`方法，想要运行所有的`@Test`方法，就可以点击类名所在行的运行按钮

### Junit注意事项

1. `@Test`不能修饰静态方法
2. `@Test`不能修饰带参数的方法
3. `@Test`不能修饰带返回值的方法    

例如：

```java
public class Test01 {
    @Test
    public static void method02() {
        System.out.println("测试Junit-3");
    }
}

// 报错：Method 'method02' annotated with '@Test' should be non-static 
```

### Junit其他注解

1. `@Before`：被`@Before`修饰的方法会在每一个`@Test`方法执行前执行，但是本身不可以单独执行。特点：有多个`@Test`修饰的方法时会执行多次
2. `@After`：被`@Before`修饰的方法会在每一个`@Test`方法执行后执行，但是本身不可以单独执行。特点：有多个`@Test`修饰的方法时会执行多次
3. `@BeforeClass`：被`@BeforeClass`修饰的方法会在所有`@Test`方法执行前执行，但是本身不可以单独执行。特点：不论是否有多个`@Test`修饰的方法，该方法始终只会执行一次，并且被修饰的方法必须为静态方法
4. `@AfterClass`：被`@AfterClass`修饰的方法会在所有`@Test`方法执行后执行，但是本身不可以单独执行。特点：不论是否有多个`@Test`修饰的方法，该方法始终只会执行一次，并且被修饰的方法必须为静态方法

例如：

```java
public class Test01 {
    @Test
    public void method() {
        System.out.println("测试Junit");
    }

    @Test
    public void method01() {
        System.out.println("测试Junit-2");
    }

    @Before
    public void before() {
        System.out.println("before");
    }

    @After
    public void after() {
        System.out.println("after");
    }

    @BeforeClass
    public static void beforeClass() {
        System.out.println("beforeClass");
    }

    @AfterClass
    public static void afterClass() {
        System.out.println("afterClass");
    }
}

输出结果：
beforeClass
before
测试Junit
after
before
测试Junit-2
after
afterClass
```

## 类加载时机与机制

### 类加载时机

在Java中，以下五种情况中的一种情况出现，JVM就会将`class`文件加载进入内存：

1. 实例化对象
2. 实例化子类对象或者接口实现类对象（此时创建子类对象会初始化父类）
3. 执行`main`方法
4. 直接使用类名调用静态成员
5. 使用反射创建`class`对象

因为`class`也属于文件，所以JVM也需要使用IO流中的操作将`class`文件读取到内存，但并不是JVM直接加载，而是使用一个名为`ClassLoader`的类加载器进行加载

### 类加载器介绍

!!! note
    下面的类加载器将基于JDK8分析

JVM会使用`ClassLoader`的类加载器加载类，在Java中，类加载器有以下三种：

1. `BootStrapClassLoader`：根类加载器，也称为引导类加载器，主要加载Java中的核心类，例如`System`类、`String`类等（在路径`jre/lib/rt.jar`下）
2. `ExtClassLoader`：扩展类加载器，负责`jre`的扩展目录中的`jar`包的加载（在路径`jdk\jre\lib\ext`下）
3. `AppClassLoader`：系统类加载器，负责在JVM启动时加载来自Java命令的`class`文件（可以理解为自定义类），以及`classPath`环境变量所指定的`jar`包（可以理解为第三方`jar`包）

在Java中，三种不同的类加载器会加载不同的类，而其三者的关系「从类加载机制层面」如下：

```
AppClassLoader`的父类加载器是`ExtClassLoader
ExtClassLoader`的父类加载器是`BootStrapClassLoader
```

!!! note
    需要注意，他们从代码级别上来看，没有子父类继承关系，但是他们都有一个共同的父类，即`ClassLoader`

    并且`BootStrapClassLoader`是无法直接获取到的，因为其底层是C语言编写的

```java
// AppClassLoader类声明
public class AppletClassLoader extends URLClassLoader
// ExtClassLoader类声明
static class ExtClassLoader extends URLClassLoader

// 拥有共同的父类
public class URLClassLoader extends SecureClassLoader implements Closeable
public class SecureClassLoader extends ClassLoader
```

### 获取类加载器对象

在Java代码中，可以通过下面的两个方法获取类加载器对象：

1. `Class`对象中的方法：`getClassLoader()`，使用时：`类名.class.getClassLoader()`，作用是获取某一个使用的类加载器
2. `ClassLoader`类中的方法：`getParent()`，使用时：`ClassLoader对象.getParent()`，作用是获取指定类加载器的父类加载器

```java
public class Test {
    public static void main(String[] args) {
        // 自定义类
        ClassLoader classLoader = Test.class.getClassLoader();
        System.out.println(classLoader);
        // 第三方类
        ClassLoader classLoader1 = IOUtil.class.getClassLoader();
        System.out.println(classLoader1);
        // 获取二者的父类
        System.out.println(classLoader.getParent());
        if (classLoader1 != null) {
            System.out.println(classLoader1.getParent());
        } else {
            System.out.println("父类加载器无法获取");
        }
        // 系统类
        ClassLoader classLoader2 = Scanner.class.getClassLoader();
        System.out.println(classLoader2);
    }
}

输出结果：
sun.misc.Launcher$AppClassLoader@18b4aac2
null
sun.misc.Launcher$ExtClassLoader@4554617c
父类加载器无法获取
null
```

### 双亲委派机制和缓存机制

双亲委派机制，也称为全盘负责委托机制，表示类加载器在加载类时，首先不会自己去尝试加载这个类，而是把请求交给父类加载器来完成，每一层的类加载器都会遵循这样的规则。

类加载器的缓存机制：一个类加载到内存之后，缓存中也会保存一份儿，后面如果再使用此类，如果缓存中保存了这个类，就直接返回他；如果没有才加载这个类，下一次如果有其他类在使用的时候就不会重新加载了，直接去缓存中拿

类加载器加载类的过程图如下：

<img src="19. Java中的Junit、类加载时机与机制、反射、注解及枚举.assets\image.png">

图解析：

一个类准备加载进内存时，首先遇到的类加载器就是`AppClassLoader`，如果`AppClassLoader`中的缓存已经存在该类，则直接返回该类，否则向上找类加载器`ExtClassLoader`，同样，如果`ExtClassLoader`的缓存已经存在该类，则直接返回，否则向上找类加载器`BootStrapClassLoader`，如果`BootStrapClassLoader`缓存依旧没有该类，则判断类是否是该类加载需要加载的，不是继续向下直到遇到属于加载该类的类加载器

所以，类加载器的双亲委派和缓存机制共同造就了加载类的特点：保证了类在内存中的唯一性

## 反射

在Java中，反射的作用是获取类对象，通过这个类对象获取对应类中的成员属性（重新赋值）、成员方法（调用方法）和构造方法（实例化对象）

类对象：在Java中，一切皆是对象，而`class`文件加载进内存就会生成对应的对象，该对象就被称为`class`对象

`Class`类：描述`Class`对象就是`Class`类

同样，对于成员变量、成员方法和构造方法来说也有对应的对象和类：

1. 成员变量：对应的成员变量对象为`Field`对象，描述`Field`对象的类称为`Field`类
2. 成员方法：对应的成员方法对象为`Method`对象，描述`Method`对象的类称为`Method`类
3. 构造方法：对应的构造方法对象为`Constructor`对象，描述`Constructor`对象的类称为`Constructor`类

### 获取类对象

获取类对象是反射成立的第一步，常见的有三种方式获取类对象：

1. 调用`Object`中的方法：`Class <?> getClass()`，该方法返回一个类对象。该方法依赖于一个具体类的对象
2. 通过`class`成员获取类对象：`基本数据类型/引用数据类型.class`
3. `Class`类中的静态方法：`static Class<?> forName(String className)`，该方法的参数为类的全限定名，该方法返回一个类对象。该方法需要知道类的全限定名

!!! note
    类的全限定名即为类所在的包名，即`package`后面的内容+指定类名

例如，下面的代码：

```java
public class Test {
    public static void main(String[] args) throws Exception{
        // 1. 调用Object中的方法：Class <?> getClass()，该方法返回一个类对象
        Scanner scanner = new Scanner(System.in);
        Class<? extends Scanner> aClass = scanner.getClass();
        System.out.println(aClass);
        // 2. 通过class成员获取类对象：基本数据类型/引用数据类型.class
        Class<Scanner> scannerClass = Scanner.class;
        System.out.println(scannerClass);
        // 3. Class类中的静态方法：static Class<?> forName(String className)，该方法的参数为类的全限定名，该方法返回一个类对象
        Class<?> aClass1 = Class.forName("com.epsda.advanced.test_reflect.Test");
        System.out.println(aClass1);
    }
}

输出结果：
class java.util.Scanner
class java.util.Scanner
class com.epsda.advanced.test_reflect.Test
```

在IDEA中获取类的全限定名：

1. 右键需要全限定名的类->选择`Copy Path/Reference...`->选择`Copy Reference`
2. 在`forName`方法中输入需要全限定名的类名，按下`Tab`或者`Enter`

!!! tips
    如果按住 ++ctrl++ + ++left-button++ 点击类的全限定名可以跳转到指定类时，说明全限定名正确

在实际开发中最常用的获取类对象的方式是第二种，但是最通用的方式是第三种，因为第三种的参数是`String`类型，后面可以结合配置文件`xxx.properties`和`Properties`集合中的`load`方法加载类的全限定名

### 获取类对象的构造方法

获取类对象的构造方法一共有四种方法：

1. 获取类对象中所有`public`构造方法：使用`Class`类中的方法：`Constructor<?>[] getConstructors()`，该方法返回一个构造方法类的对象
2. 获取类对象中指定的`public`构造方法：`Class`类中的方法：`Constructor<T> getConstructor (Class<?>... parameterTypes)`，该方法的参数为指定的`public`构造方法参数类型对应的类对象，返回一个构造方法类的对象。如果指定的`public`构造方法没有参数，则可以不传递任何内容
3. 获取类对象中所有构造方法（包括`public`和`private`）：`Constructor<?>[] getDeclaredConstructors()`，该方法返回一个构造方法类的对象
4. 获取类对象中指定的构造方法（包括`public`和`private`）：`Constructor<T> getDeclaredConstructor (Class<?>... parameterTypes)`，该方法的参数为指定的构造方法的参数，返回一个构造方法类的对象。如果指定的构造方法没有参数，则可以不传递任何内容

下面示例使用的类：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    private String name;
    public Integer age;

    private Person(String name) {
        this.name = name;
    }
}
```

使用如下：

```java
public class Test01 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;

        // 获取所有public构造方法
        Constructor<?>[] constructors = personClass.getConstructors();
        for (Constructor<?> constructor : constructors) {
            System.out.println(constructor);
        }

        // 获取指定public构造方法
        Constructor<Person> constructor = personClass.getConstructor(String.class, Integer.class);
        System.out.println(constructor);

        // 获取所有构造方法
        Constructor<?>[] declaredConstructors = personClass.getDeclaredConstructors();
        for (Constructor<?> declaredConstructor : declaredConstructors) {
            System.out.println(declaredConstructor);
        }

        // 获取指定的构造方法
        Constructor<Person> declaredConstructor = personClass.getDeclaredConstructor(String.class);
        System.out.println(declaredConstructor);
    }
}
```

### 使用反射获取的构造方法创建对象

使用`Constructor`类中的方法： `T newInstance(Object...initargs)`，参数传递对应对象初始值，如果获取到的是无参构造，则参数不传递，否则传递对应的值，该方法返回一个对应类的对象

```java
public class Test02 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        Constructor<Person> declaredConstructor = personClass.getDeclaredConstructor(String.class, Integer.class);
        Person person = declaredConstructor.newInstance("张三", 16);
        System.out.println(person);
    }
}
```

如果获取到的是无参构造，则可以直接使用`Class对象.newInstance()`，简写为如下的代码：

```java
public class Test03 {
    public static void main(String[] args) throws Exception{
        // 无参构造默认反射方式
        Class<Person> personClass = Person.class;
        Constructor<Person> constructor = personClass.getConstructor();
        Person person = constructor.newInstance();
        System.out.println(person);

        // 简写为
        Person person1 = personClass.newInstance();
        System.out.println(person);
    }
}
```

!!! note

    但是，上面的简写形式已经被弃用（修饰为`@Deprecated`），不过依旧可以使用

如果获取到的是私有构造方法，则需要使用`Constructor`的父类`AccessibleObject`中的方法`void setAccessible(boolean flag)`将私有构造方法的权限修改为`public`，参数有两个值：`true`代表修改，`false`表示不修改

```java
public class Test04 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        Constructor<Person> personConstructor = personClass.getDeclaredConstructor(String.class);
        // 修改权限
        personConstructor.setAccessible(true);
        Person person = personConstructor.newInstance("张三");
        System.out.println(person);
    }
}
```

上面获取私有构造方法并创建对象也被称为**暴力反射**

### 获取类对象的成员方法

获取类对象的成员方法一共有四种方法：

1. 获取类对象中所有`public`成员方法：使用`Class`类中的方法：`Method[] getMethods()`，该方法返回一个成员方法类的对象
2. 获取类对象中指定的`public`成员方法：`Class`类中的方法：`Method getMethod (String name, Class<?>... parameterTypes)`，该方法的第一个参数为指定的`public`成员方法名，第二个参数为指定的`public`成员方法参数类型对应的类对象，返回一个成员方法类的对象。如果指定的`public`成员方法没有参数，则第二个参数可以不传递任何内容
3. 获取类对象中所有成员方法（包括`public`、`private`和`protected`）：`Method[] getDeclaredMethods()`，该方法返回一个成员方法类的对象
4. 获取类对象中指定的成员方法（包括`public`和`private`）：`Method getDeclaredMethod (String name, Class<?>... parameterTypes)`，该方法的参数为指定的成员方法的参数，返回一个成员方法类的对象。如果指定的`public`成员方法没有参数，则第二个参数可以不传递任何内容

!!! note
    需要注意，`getMethods`方法会获取到本类和其父类的所有`public`方法，但是`getDeclaredMethods`方法只会获取到本类中的`private`、`public`和`protected`方法

例如下面的代码：

```java
public class Test05 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        // 获取所有public方法
        Method[] methods = personClass.getMethods();
        for (Method method : methods) {
            System.out.println(method);
        }

        // 获取指定的public方法
        Method method = personClass.getMethod("setName", String.class);
        System.out.println(method);

        // 获取所有的方法
        Method[] declaredMethods = personClass.getDeclaredMethods();
        for (Method declaredMethod : declaredMethods) {
            System.out.println(declaredMethod);
        }

        // 获取指定的方法
        Method walk = personClass.getDeclaredMethod("walk");
        System.out.println(walk);
    }
}
```

### 使用反射获取的成员方法

使用成员方法类对象调用`Object`类中的方法`Object invoke(Object obj, Object... args)`可以使用获取到的成员方法，第一个参数传递成员方法所在类的对象，第二个参数传递获取到的成员方法参数对应的值，该方法返回一个`Object`对象。该方法的返回值根据调用对象对应的方法是否有返回值决定，如果调用对象对应的方法有返回值，则与调用对象对应的方法的值相同，否则为`null`

```java
public class Test06 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        Person person = personClass.newInstance();
        Method setName = personClass.getDeclaredMethod("setName", String.class);
        Method getName = personClass.getDeclaredMethod("getName");
        Object set = setName.invoke(person, "张三");
        Object get = getName.invoke(person);
        System.out.println(get);
    }
}
```

如果需要操作类对象中的私有方法，与私有构造方法一样，需要使用`AccessibleObject`中的方法`void setAccessible(boolean flag)`将私有构造方法的权限修改为`public`

```java
public class Test06 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        Person person = personClass.newInstance();

        Method declaredMethod = personClass.getDeclaredMethod("walk");
        declaredMethod.setAccessible(true);
        declaredMethod.invoke(person);
    }
}
```

### 获取类对象的成员属性

获取类对象的构造方法一共有四种方法：

1. 获取类对象中所有`public`成员属性：使用`Class`类中的方法：`Field[] getFields()`，该方法返回一个成员属性类的对象
2. 获取类对象中指定的`public`成员属性：`Class`类中的方法：`Field getField(String name)`，该方法的参数为指定的`public`成员属性名，返回一个成员属性类的对象
3. 获取类对象中所有成员属性（包括`public`和`private`）：`Field[] getDeclaredFields()`，该方法返回一个成员属性类的对象
4. 获取类对象中指定的成员属性（包括`public`、`private`和`protected`）：`Field getDeclaredField(String name)`，该方法的参数为指定的`public`成员属性名，返回一个成员属性类的对象

例如：

```java
public class Test07 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;

        // 获取所有public成员属性
        Field[] fields = personClass.getFields();
        for (Field field : fields) {
            System.out.println(field);
        }

        // 获取指定的public成员属性
        Field age = personClass.getField("age");
        System.out.println(age);

        // 获取所有成员属性
        Field[] declaredFields = personClass.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            System.out.println(declaredField);
        }

        // 获取指定成员属性
        Field declaredField = personClass.getDeclaredField("name");
        System.out.println(declaredField);
    }
}
```

### 使用反射获取的成员属性

使用成员属性类对象调用`Object`中的方法：`void set(Object obj, Object value)`为获取到的成员属性赋值，第一个参数传递成员属性所在类的对象，第二个参数传递属性值

使用成员属性类对象调用`Object`中的方法：`Object get(Object obj)`获取指定成员属性的值，参数传递成员属性所在类的对象，该方法返回一个`Object`对象，该对象中的值即为成员属性的值

```java
public class Test08 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        Person person = personClass.newInstance();
        Field age = personClass.getField("age");
        age.set(person, 18);
        Object o = age.get(person);
        System.out.println(o);
    }
}
```

同样，如果是私有成员，则需要使用`AccessibleObject`中的方法`void setAccessible(boolean flag)`将私有构造方法的权限修改为`public`

```java
public class Test08 {
    public static void main(String[] args) throws Exception{
        Class<Person> personClass = Person.class;
        Person person = personClass.newInstance();

        Field declaredField = personClass.getDeclaredField("name");
        declaredField.setAccessible(true);
        declaredField.set(person, "张三");
        Object o1 = declaredField.get(person);
        System.out.println(o1);
    }
}
```

### 反射实用案例

在配置文件中，配置类的全限定名，以及配置一个方法名，通过解析配置文件，让配置好的方法执行起来，配置文件的内容如下：

```properties
className=包名.Person
methodName=walk
```

步骤:

1. 创建`properties`配置文件，配置信息，需要注意，这个配置文件不能直接放到模块或者项目下，否则在`out`文件夹中不存在该文件，最常见的做法是在指定目录下创建一个名为`resources`文件夹，并将这个文件夹标记为`Resources Root`，然后将配置文件放在这个文件夹内部
2. 读取配置文件，解析配置文件。读取配置文件可以使用`properties`集合中的`load`方法，解析配置文件时不建议直接在创建IO流对象时传递`properties`文件的地址，这样导致该地址为死地址，而且`out`文件夹下不会存在`resources`文件夹。推荐方法：因为配置文件也属于文件，在Java中加载该文件时会产生对应的对象，使用`ClassLoader`获取当前类的类加载器对象，再使用该对象调用`getResourceAsStream ("配置文件名")`方法获取`InputStream`对象。这种方式会自动扫描`resources`下的文件，可以简单理解为扫描`out`路径下的配置文件
3. 根据解析出来的`className`，创建`Class`对象
4. 根据解析出来的`methodName`，获取对应的方法
5. 执行方法

IDEA中「将这个文件夹标记为`Resources Root`」的步骤图：

<img src="19. Java中的Junit、类加载时机与机制、反射、注解及枚举.assets\image1.png">

如果上面的方式中没有显示`Resources Root`，则可以考虑下面的步骤：

<img src="19. Java中的Junit、类加载时机与机制、反射、注解及枚举.assets\image2.png">

参考代码如下：

```properties
// 配置文件
className=com.epsda.advanced.test_reflect_exercise.Person
methodName=walk
```

测试：

```java
// 自定义类
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    private String name;
    private Integer age;

    public void walk() {
        System.out.println("人在行走");
    }
}

// 测试
package com.epsda.advanced.test_reflect_exercise;

import org.junit.Test;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.Properties;

/**
 * ClassName: Test09
 * Description: 测试
 *
 * @author 憨八嘎
 * @version 1.0
 */
public class Test09 {
    @Test
    public void method () throws Exception{
        ClassLoader classLoader = Test09.class.getClassLoader();
        InputStream resourceAsStream = classLoader.getResourceAsStream("test.properties");
        // 读取配置文件
        Properties properties = new Properties();
        properties.load(resourceAsStream);
        // 根据key取出其中的值
        String methodName = properties.getProperty("methodName");
        String className = properties.getProperty("className");
        // 创建Class对象
        Class<?> aClass = Class.forName(className);
        Object o = aClass.newInstance();
        Method declaredMethod = aClass.getDeclaredMethod(methodName);
        declaredMethod.invoke((Person)o);
    }
}

输出结果：
人在行走
```

目录结构：

<img src="19. Java中的Junit、类加载时机与机制、反射、注解及枚举.assets\image3.png">

## 注解

### 介绍

在Java中，注解也是一种引用数据类型，与类、接口、枚举和`Record`类同层次

注解常见的作用如下：

1. 说明:对代码进行说明，生成doc文档(API文档)
2. 检查:检查代码是否符合条件，例如：`@Override`、`@FunctionalInterface `
3. 分析:对代码进行分析，起到了代替配置文件的作用

JDK中常见的注解：

1. `@Override`：检测此方法是否为重写方法
    - JDK5版本,支持父类的方法重写
    - JDK6版本,支持接口的方法重写
2. `@Deprecated`：表示方法已经过时，不推荐使用，但是依旧可以使用
3. `@SuppressWarnings`：消除警告，例如消除所有警告：`@SuppressWarnings("all") `

在IDEA中，一般被警告的方法默认会有黄色底色，例如下图：

<img src="19. Java中的Junit、类加载时机与机制、反射、注解及枚举.assets\image4.png">

### 定义注解和属性

在Java中，可以使用下面的格式定义注解：

```java
public @Interface 注解名 {
    // 属性
}
```

在注解体内的属性，本质是抽象方法，但是在使用时，与成员属性相同，使用`成员属性名=值`的方式

属性的定义有两种方式：

1. `数据类型 属性名()`：定义一个没有默认值的属性，使用注解时就必须赋值
2. `数据类型 属性名() default 值`：定义一个有默认值的属性，使用注解时可以不需要赋值

可以作为属性的类型：

1. 所有基本数据类型
2. `String`类型
3. 枚举类型
4. 注解类型
5. `Class`类型
6. 上面所有类型的一维数组（不可以是二维数组）

例如：

```java
public @interface Book {
    //书名
    String bookName();
    //作者
    String[] author();
    //价格
    int price();
    //数量
    int count() default 10;
}
```

### 注解的使用

使用注解本质就是为每一个属性（抽象方法）赋值，一般使用位置有下面几种：

1. 类名上
2. 方法上
3. 成员变量上
4. 局部变量上
5. 参数位置

使用格式如下：

1. 普通属性：`@注解名(属性名 = 值, 属性名 = 值...)`
2. 属性中有数组：`@注解名(属性名 = {元素1,元素2...})`

注解使用时需要注意：

1. 空注解（注解中没有任何的属性）可以直接使用
2. 不同的位置可以使用一样的注解，但是同样的位置不能使用一样的注解
3. 使用注解时，如果此注解中有属性没有默认值，则注解中对应的属性一定要赋值。如果有多个属性，用`,`隔开；如果注解中的属性值有默认值，那么不用显示写，也不用重新赋值
4. 如果注解中的属性有数组，使用`{}`
5. 如果注解中只有一个属性，并且属性名叫`value`，那么使用注解的时候，属性名不用写，直接写值（包括普通类型和数组）

例如：

```java
// 自定义注解
public @interface Book {
    //书名
    String bookName();
    //作者
    String[] author();
    //价格
    int price();
    //数量
    int count() default 10;
}

// 测试
@Book(bookName = "寓言故事",author = {"张三","李四"},price = 10,count = 20)
public class BookShelf {
}
```

### 解析注解

解析注解即为取出注解对应属性的值，注解涉及的接口是：`AnnotatedElement`接口，实现类有： `AccessibleObject`、`Class`、`Constructor`、`Executable`、`Field`、`Method`、`Package`、`Parameter` 

解析思路如下：

1. 判断指定位置上有没有使用指定的注解：使用方法：`boolean isAnnotationPresent(Class<? extends Annotation> annotationClass)`，如果存在注解则返回为`true`，否则返回`false`
2. 如果有，则获取指定的注解：使用方法：`getAnnotation(Class<T> annotationClass)`
3. 通过注解获取指定的值

例如：

```java
// 自定义注解
public @interface Book {
    //书名
    String bookName();
    //作者
    String[] author();
    //价格
    int price();
    //数量
    int count() default 10;
}

// 自定义类
@Book(bookName = "寓言故事",author = {"张三","李四"},price = 10,count = 20)
public class BookShelf {
}

// 测试
public class Test01 {
    public static void main(String[] args) {
        //1.获取BookShelf的class对象
        Class<BookShelf> bookShelfClass = BookShelf.class;
        //2.判断bookShelf上有没有Book注解
        boolean b = bookShelfClass.isAnnotationPresent(Book.class);
        //3.判断，如果b为true就获取
        if (b) {
            Book book = bookShelfClass.getAnnotation(Book.class);
            System.out.println(book.bookName());
            System.out.println(Arrays.toString(book.author()));
            System.out.println(book.price());
            System.out.println(book.count());
        }
    }
}
```

上面的代码没有在控制台中打印运行结果，原因是注解并没有在内存中出现，而`class`文件在内存中运行，所以导致方法无法获取到对应的注解

### 元注解

元注解也是注解，这个注解用来管理其他注解，一般管理下面的方面：

1. 控制注解的使用位置
    1. 控制注解是否能在类上使用
    2. 控制注解是否能在方法上使用
    3. 控制注解是否能在构造上使用等
2. 控制注解的生命周期（加载位置）
    - 控制注解是否能在源码中出现
    - 控制注解是否能在`class`文件中出现
    - 控制注解是否能在内存中出现

使用元注解：

1. 注解`@Target`：控制注解的使用位置，其属性是个枚举数组`ElementType[] value();`，枚举的成员可以类名直接调用。常见的成员有：
    - `TYPE`：控制注解能使用在类上
    - `FIELD`：控制注解能使用在属性上
    - `METHOD`：控制注解能使用在方法上
    - `PARAMETER`：控制注解能使用在参数上
    - `CONSTRUCTOR`：控制注解能使用在构造上
    - `LOCAL_VARIABLE`：控制注解能使用在局部变量上 
2. 注解`@Retention`：控制注解的生命周期（加载位置），其属性是一个枚举对象`RetentionPolicy`，常见的成员有：
    - `SOURCE`:控制注解能在源码中出现（默认）
    - `CLASS`:控制注解能在`class`文件中出现
    - `RUNTIME`:控制注解能在内存中出现    

!!! note
    需要注意，`@Target`如果不指定属性，默认是全部可用

使用元注解就可以解决前面解析注解部分无法读取到注解的问题：

```java
@Target({ElementType.TYPE,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Book {
    //书名
    String bookName();
    //作者
    String[] author();
    //价格
    int price();
    //数量
    int count() default 10;
}

// 测试
public class Test01 {
    public static void main(String[] args) {
        //1.获取BookShelf的class对象
        Class<BookShelf> bookShelfClass = BookShelf.class;
        //2.判断bookShelf上有没有Book注解
        boolean b = bookShelfClass.isAnnotationPresent(Book.class);
        //3.判断,如果b为true,就获取
        if (b){
            Book book = bookShelfClass.getAnnotation(Book.class);
            System.out.println(book.bookName());
            System.out.println(Arrays.toString(book.author()));
            System.out.println(book.price());
            System.out.println(book.count());
        }
    }
}

输出结果：
寓言故事
[张三, 李四]
10
20
```

## 枚举

### 基本使用

枚举属于五大引用数据类型中的一种：类、数组、接口、注解、枚举

定义枚举格式如下：

```java
public enum 枚举类名{
  
}
```

在Java中，所有枚举的父类都是`Enum`

枚举的特点如下：

1. 每一个枚举都是`static final`，但是定义枚举是不能显示写出
2. 每一个枚举由逗号分隔
3. 写完所有的枚举值之后，最后一个枚举后方需要加`;`
4. 枚举值名字最好大写
5. 使用时使用枚举类名直接调用枚举成员
6. 枚举中的成员都是当前枚举类类型的对象
7. 枚举类中的构造方法都是`private`修饰

基本使用如下：

```java
public enum Status {
    RUNNING,
    WAITING,
    STOPPED;
}
```

如果想为每一个枚举赋值，可以在枚举类中定义成员和构造方法，并对外提供获取方法就可以获取到每一个枚举值对应的值

```java
public enum Status {
    RUNNING("运行"),
    WAITING("等待"),
    STOPPED("暂停");

    private String name;

    private Status(String name) {
        this.name = name;
    }
}
```

测试如下：

```java
public class Test {
    public static void main(String[] args) {
        System.out.println(Status.RUNNING);
        System.out.println(Status.RUNNING.getName());
    }
}

输出结果：
RUNNING
运行
```

### 枚举类构造方法与反射

实际上，在`Enum`类中也提供了一个构造方法，如下：

```java
protected Enum(String name, int ordinal) {
    this.name = name;
    this.ordinal = ordinal;
}
```

因为所有的枚举类都默认继承自`Enum`类，所以在自定义枚举类中使用显式提供的构造方法时理论上需要显式调用父类的构造方法初始化父类的成员，但是在枚举部分不需要是因为编译器已经自动提供了，例如可以理解`Status`枚举类的构造方法如下：

```java
// 编译器生成的实际构造函数
private Status(String enumName, int ordinal, String name) {
    super(enumName, ordinal);  // 调用父类Enum的构造函数
    this.name = name;
}
```

对应的，在反射时获取该构造方法就需要显式指定并且保证用于初始化父类成员的类型在子类成员类型之前：

```java
// 获取Status枚举类的构造方法
Constructor<Status> constructor = Status.class.getDeclaredConstructor(String.class, int.class, String.class);
```

因为构造方法是私有的，接下来为了能够访问还需要设置访问权限：

```java
constructor.setAccessible(true);
```

接下来，通过反射创建一个自定义枚举类对象：

```java
Status status2 = constructor.newInstance("WAITING", 1, "警告");
```

此时运行代码就会看到编译器给出异常信息：

```java
Exception in thread "main" java.lang.IllegalArgumentException: Cannot reflectively create enum objects
	at java.base/java.lang.reflect.Constructor.newInstanceWithCaller
	at java.base/java.lang.reflect.Constructor.newInstance
	at com.epsda.advanced.test_Enum.Test01.main
```

出现这个问题的原因就是在`Constructor`类的`newInstance()`方法中，源码如下：

```java
public T newInstance(Object ... initargs)
    throws InstantiationException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException
{
    Class<?> caller = override ? null : Reflection.getCallerClass();
    return newInstanceWithCaller(initargs, !override, caller);
}

T newInstanceWithCaller(Object[] args, boolean checkAccess, Class<?> caller)
    throws InstantiationException, IllegalAccessException,
            InvocationTargetException
{
    if (checkAccess)
        checkAccess(caller, clazz, clazz, modifiers);

    if ((clazz.getModifiers() & Modifier.ENUM) != 0)
        throw new IllegalArgumentException("Cannot reflectively create enum objects");

    ConstructorAccessor ca = constructorAccessor;   // read volatile
    if (ca == null) {
        ca = acquireConstructorAccessor();
    }
    @SuppressWarnings("unchecked")
    T inst = (T) ca.newInstance(args);
    return inst;
}
```

在`newInstance()`方法中调用了`newInstanceWithCaller()`，而该方法中抛出异常的逻辑为：

```java
if ((clazz.getModifiers() & Modifier.ENUM) != 0)
    throw new IllegalArgumentException("Cannot reflectively create enum objects");
```

在这个逻辑中的`(clazz.getModifiers() & Modifier.ENUM) != 0`就是表示如果当前枚举类的修饰符中包含`ENUM`，就抛出异常

所以，在Java中，**不能使用反射获取到枚举类的构造方法创建枚举类对象**

### 枚举中的常用方法

| 方法名                | 说明                     |
| --------------------- | ------------------------ |
| `String toString()`   | 返回枚举值的名字         |
| `values()`            | 返回所有与的枚举值       |
| `valueOf(String str)` | 将一个字符串转成**已有的**枚举类型 |
| `ordinal()` | 获取枚举成员的索引位置 |
| `compareTo(E o)` | 比较两个枚举成员在定义时的顺序 |

!!! note

    需要注意的是，`values()`方法实际上是由Java编译器自动生成的，而不是在`Enum`类中定义的

例如下面的代码：

=== "自定义枚举类"

    ```java
    // 枚举
    public enum Status {
        RUNNING("运行"),
        WAITING("等待"),
        STOPPED("暂停");

        private String name;

        private Status(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
    ```

=== "测试类"

    ```java
    // 测试
    public class Test01 {
        public static void main(String[] args) {
            Status status = Status.RUNNING;

            System.out.println(status.toString());
            System.out.println(status);

            Status[] values = Status.values();
            for (Status value : values) {
                System.out.println(value);
            }

            Status status1 = Status.valueOf("RUNNING");
            System.out.println(status1);
        }
    }
    ```