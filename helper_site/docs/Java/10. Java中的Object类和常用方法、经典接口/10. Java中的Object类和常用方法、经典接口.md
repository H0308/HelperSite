# Java中的`Object`类介绍及常用方法

## `Object`类介绍

`Object`类是Java中所有类的父类，位于`Java.lang`包中，默认创建的所有对象都继承自`Object`类

## `Object`类常用方法

### `toString()`方法

默认情况下，如果直接打印对象名（等于调用`对象名.toString()`），则打印出的内容是对象的包名+类名+地址，例如下面的代码：

```java
public class Person {
    private String name = "zhangsan";
    private int age = 16;
}

// 测试
public class Test {
    public static void main(String[] args) {
        Person person = new Person();

        System.out.println(person);
        System.out.println(person.toString());
    }
}

输出结果：
com.epsda.advanced.test_Object.Person@154617c
com.epsda.advanced.test_Object.Person@154617c
```

如果看`toString()`方法的源码可以发现`toString()`实际实现的方式：

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

为了打印的是对象的内容而不是对象的地址，需要重写`toString()`方法

```java
@Override
public String toString() {
    return "Person{" +
            "name='" + name + '\'' +
            ", age=" + age +
            '}';
}
```

有了重写的`toString()`方法，直接打印对象名或者调用`toString()`方法就可以直接打印对象中的内容

```java
public class Person {
    private String name = "zhangsan";
    private int age = 16;

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        Person person = new Person();

        System.out.println(person);
        System.out.println(person.toString());
    }
}

输出结果：
Person{name='zhangsan', age=16}
Person{name='zhangsan', age=16}
```

### `equals()`方法

默认情况下，如果使用`==`比较基本数据类型，比较的是对应变量中的值，如果使用`==`比较引用数据类型，则比较的是对应的地址值，此时如果需要比较引用数据类型中的内容，就需要使用`equals()`方法。但是如果是自定义的类类型，没有重写`equals()`方法时，比较的结果依旧与`==`相同

```java
public class Test {
    public static void main(String[] args) {
        Person person1 = new Person();
        Person person2 = new Person();

        System.out.println(person1 == person2);
        System.out.println(person1.equals(person2));
    }
}

输出结果：
false
false
```

之所以出现这个情况，是因为在自定义的类类型没有重写`equals`时会默认调用父类Object中的`equals`，该`equals`方法比较方式依旧是按照地址比较

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

所以为了不按照地址比较，需要在自定义的类类型中重写`equals`方法

!!! note
    需要注意，一般情况下，建议是重写`equals`方法的同时也需要重写`hashCode()`方法，这是为了保持对象一致性，并且确保数据结构（如哈希表实现的集合类`HashMap`、`HashSet`等）能够正确地工作。下面以仅重写`equals`方法为例

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Person person = (Person) o;
    return age == person.age && Objects.equals(name, person.name);
}
```

此时再进行比较时，使用`equals`方法就会调用重写的`equals`方法，从而比较的是对象中的内容

```java
public class Test {
    public static void main(String[] args) {
        Person person1 = new Person();
        Person person2 = new Person();

        System.out.println(person1 == person2);
        System.out.println(person1.equals(person2));
    }
}

输出结果：
false
true
```

## 经典接口

### `Comparable`接口

在Java中基本数据类型的数据（除`boolean`类型外）需要比较大小的话，之间使用比较运算符即可，但是引用数据类型是不能直接使用比较运算符来比较大小的

Java给所有引用数据类型的大小比较，指定了一个标准接口，就是`java.lang.Comparable`接口：

```java
package java.lang;

public interface Comparable<T> {
    int compareTo(T obj);
}
```

使用步骤如下：

第一步：哪个类的对象要比较大小，哪个类就实现`java.lang.Comparable`接口，并重写方法，方法体就是指定两个对象的大小比较方式

第二步：对象比较大小时，通过对象调用`compareTo`方法，根据方法的返回值决定谁大谁小。

1. `this`对象（调用`compareTo`方法的对象）减指定对象（传入`compareTo()`的参数对象）大于0，返回正整数
2. `this`对象（调用`compareTo`方法的对象）减指定对象（传入`compareTo()`的参数对象）小于0，返回负整数
3. `this`对象（调用`compareTo`方法的对象）减指定对象（传入`compareTo()`的参数对象）等于0，返回零

代码示例：

实现了`Comparable`接口的`Student`类

```java
public class Student implements Comparable<Student> {
    private String name;
    private int score;

    public Student() {

    }

    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", score=" + score +
                '}';
    }

    /*
      this:代表students[i]
      o:代表students[i+1]

      如果students[i].getScore()-students[i+1].getScore()>0
         证明数组中的前面一个对象比后面一个对象的分数高
     */
    @Override
    public int compareTo(Student o) {
        return this.getScore()- s.getScore();
    }
}
```

测试代码如下：

```java
public class Test01 {
    public static void main(String[] args) {
        //创建一个数组
        Student[] students = new Student[3];
        Student s1 = new Student("张三", 100);
        Student s2 = new Student("李四", 60);
        Student s3 = new Student("王五", 80);
        students[0] = s1;
        students[1] = s2;
        students[2] = s3;

        for (int j = 0; j<students.length-1;j++){
            for (int i = 0;i<students.length-1-j;i++){
                //如果students[i]比students[i+1]大,就排序换位置
                if (students[i].compareTo(students[i+1])>0){
                    Student temp = students[i];
                    students[i] = students[i+1];
                    students[i+1] = temp;
                }
            }
        }

        //遍历
        for (int i = 0; i < students.length; i++) {
            System.out.println(students[i]);
        }
    }
}

输出结果如下：
Student{name='李四', score=60}
Student{name='王五', score=80}
Student{name='张三', score=100}
```

### `Comparator`接口

当一个类无法被随意修改时，就没有办法再添加其他内容，但是该类又没有实现前面的`Comparable`接口，此时就需要使用`Comparator`接口（`java.util.Comparator`）自定义比较方式

```java
package java.util;
 
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

使用步骤如下：

第一步：编写一个类，我们称之为比较器类型，实现`java.util.Comparator`接口，并重写方法，方法体就是指定两个对象的大小比较方式

第二步：比较大小时，通过比较器类型的对象调用`compare()`方法，将要比较大小的两个对象作为`compare`方法的实参传入，根据方法的返回值决定谁大谁小。

- `o1`对象减`o2`大于0返回正整数
- `o1`对象减`o2`小于0返回负整数
- `o1`对象减`o2`等于0返回零

例如

??? note "固定不变的`Person`代码"
    
    ```java
    // Person固定假设不能修改增加Comparable接口以及Comparator接口
    public class Person {
        private String name;
        private int age;
    
        public Person() {
        }
    
        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
    
        public String getName() {
            return name;
        }
    
        public void setName(String name) {
            this.name = name;
        }
    
        public int getAge() {
            return age;
        }
    
        public void setAge(int age) {
            this.age = age;
        }
    
        @Override
        public String toString() {
            return "Person{" +
                    "name='" + name + '\'' +
                    ", age=" + age +
                    '}';
        }
    
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Person person = (Person) o;
            return age == person.age && Objects.equals(name, person.name);
        }
    
        @Override
        public Object clone() throws CloneNotSupportedException{
            return super.clone();
        }
    }
    ```

自定义新的类实现`Comparator`接口

```java
public class ToCmp implements Comparator<Person> {
    @Override
    public int compare(Person o1, Person o2) {
        return o1.getAge() - o2.getAge();
    }

    // 因为继承自Object，所以当前类已经存在了equals方法
    // 故实现了Comparator的类不需要强制实现equals方法
}
```

测试代码：

```java
// 测试
public class Test {
    public static void main(String[] args) {
        //创建一个数组
        Person[] persons = new Person[3];
        Person p1 = new Person("张三", 100);
        Person p2 = new Person("李四", 60);
        Person p3 = new Person("王五", 80);
        persons[0] = p1;
        persons[1] = p2;
        persons[2] = p3;
        
        // 使用冒泡排序为例
        for (int j = 0; j<persons.length-1;j++){
            for (int i = 0;i<persons.length-1-j;i++){
                //如果Persons[i]比Persons[i+1]大,就排序换位置
                if (new ToCmp().compare(persons[i],persons[i+1])>0){
                    Person temp = persons[i];
                    persons[i] = persons[i+1];
                    persons[i+1] = temp;
                }
            }
        }

        //遍历
        for (int i = 0; i < persons.length; i++) {
            System.out.println(persons[i]);
        }
    }
}

输出结果：
Person{name='李四', age=60}
Person{name='王五', age=80}
Person{name='张三', age=100}
```

### `Clonable`接口

如果想根据一个已经存在的对象创建一个成员相同的同类型对象（彼此地址不同），则可以使用`clone()`方法，使用`clone`方法前先确保当前类实现了`Clonable`接口，接着在当前类中重写`clone`方法，此时即可实现克隆对象的效果

=== "`Person`类"

    ```java
    public class Person implements Cloneable{
        // ...
    
        @Override
        public Object clone() throws CloneNotSupportedException{
            return super.clone(); // 调用父类Object中的clone方法
        }
    }
    ```

=== "测试类"

    ```java
    // 测试
    public class Test {
        public static void main(String[] args) {
            Person person = new Person("张三", 20);
    
            try {
                Person person1 = (Person) person.clone();
            } catch (CloneNotSupportedException e) {
                System.out.println("无法克隆");
            }
        }
    }
    ```

!!! note

    需要注意的是，如果不实现`Clonable`接口而直接重写`clone()`方法，那么无法正确达到克隆的效果，依旧会抛出`CloneNotSupportedException`异常

查看源码可以发现`Clonable`接口实际上是一个空接口，内部没有任何方法，也称为标记接口。此时意味着只有实现了这个接口的类才具有克隆功能，否则不具备

但是，直接使用`Clonable`中的`clone()`方法实际上实现的这是**浅拷贝**，例如下面的情况：

=== "`Money`类"

    ```java
    public class Money {
        public int money = 100;
    }
    ```

=== "`Person`类"

    ```java
    public class Person implements Cloneable{
        private String name;
        private int age;
        private Money money = new Money();
    
        // ...
    }
    ```

=== "测试类"

    ```java
    public class Test {
        public static void main(String[] args) {
            Person person = new Person("张三", 20);
    
            try {
                Person person1 = (Person) person.clone();
            } catch (CloneNotSupportedException e) {
                System.out.println("无法克隆");
            }
        }
    }
    ```

此时再次执行`main`方法得到的`person1`对象实际上只是在`person`基础上的浅拷贝，如下图所示：

<img src="10. Java中的Object类和常用方法、经典接口.assets/image-20250705180320702.png">

此时，如果`person1`修改`money`的值，也会影响到`person`，为了解决这个问题，还需要让`Money`类实现`Clonable`接口并且重写`clone()`方法：

```java
public class Money implements Cloneable{
    public int money = 100;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

接着，修改`Money`类的`clone()`方法确保`Money`对象也可以进行拷贝，如下：

```java
@Override
public Object clone() throws CloneNotSupportedException{
    Person tmp = (Person) super.clone();
    tmp.money = (Money) money.clone();
    return tmp;
}
```

此时就可以实现深拷贝，如下图所示：

<img src="10. Java中的Object类和常用方法、经典接口.assets/image-20250705180633677.png">
