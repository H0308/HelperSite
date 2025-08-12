# Java双列集合

## Java双列集合体系介绍

在Java中，双列集合的顶级接口是`Map`接口，该类没有继承自`Collection`，该类中存储的是`<K,V>`结构的键值对，并且K一定是唯一的，不能重复

在`Map`接口中有下面的分类：

1. `HashMap`类
2. `LinkedHashMap`类
3. `TreeMap`类
4. `HashTable`类
5. `Properties`类

其体系及特点如下图所示：

<img src="15. Java双列集合.assets\image.png">

## `Map.Entry<K, V>`接口介绍

`Map.Entry<K, V>`是Map内部实现的用来存放`<key, value>`键值对映射关系的内部类，该内部类中主要提供了`<key, value>`的获取、`value`的设置以及`key`的比较方式，其下有下面几个常用的方法：

1. `K getKey()`：返回`entry`的键`key`
2. `V getValue()`：返回`entry`的值`value`
3. `V setValue(V value)`：将指定键值对中的`value`替换为参数的`value`

!!! note

    需要注意，`Map.Entry<K,V>`并没有提供设置`key`的方法

## `TreeMap`类

### 介绍

`TreeMap`类是`Map`接口的实现类，其特点如下：

1. 默认会对插入的数据进行排序，所以存储的类型必须实现`Comparable`接口，或者提供实现了`Comparator`的比较器
2. 没有索引的方式操作元素
3. `key`唯一，`value`不唯一
4. 不可以存`null`值
5. 相同元素不重复出现
6. 线程不安全

底层数据结构为红黑树

### 构造方法

常用构造方法：

1. 无参构造方法：`TreeMap()`，默认按照ASCII码对元素进行比较
2. 使用传递比较器作为参数的有参构造方法：`TreeMap(Comparator<? super E> comparator)`

### 常用方法

1. `V get(Object key)`：返回指定键`key`的值`value`
2. `V getOrDefault(Object key, V defaultValue)`：返回指定键`key`的值`value`，如果没有该键`key`，则返回默认值`defaultValue`
3. `V put(K key, V value)`：插入键值对，返回被参数`value`覆盖的`value`
4. `V remove(Object key)`：根据`key`值移除`TreeMap`中指定的元素，返回被删除的键值对对应的`value`
5. `Set<K> keySet()`：返回`TreeMap`中所有`key`值的集合（`key`不可以重复）
6. `Collection<V> values()`：返回`TreeMap`中所有`value`值的集合（`value`可以重复）
7. `Set<Map.Entry<K, V>> entrySet()`：返回`TreeMap`中所有键值对的集合
8. `boolean containsKey(Object key)`：判断`TreeMap`中是否还有指定`key`元素
9. `boolean containsValue(Object value)`：判断`TreeMap`中是否还有指定`value`元素
10. `int size()`：返回`TreeMap`中键值对的数量

基本使用如下：

```java
public class Test07 {
    public static void main(String[] args) {
        Map<String, String> map = new TreeMap<>();
        map.put("1", "张三");
        map.put("13", "王五");
        map.put("112", "李四");

        System.out.println(map.get("1"));
        System.out.println(map.remove("13"));
        System.out.println(map.size());

        Set<String> strings = map.keySet();
        System.out.println(strings);

        Collection<String> values = map.values();
        System.out.println(values);

        Set<Map.Entry<String, String>> entries = map.entrySet();
        System.out.println(entries);
    }
}
```

### 遍历集合

`HashMap`遍历方式有以下两种：

1. 通过`key`值获取到对应的`value`，通过`Set<K> keySet()`方法将获取到的`key`存入到`Set`中，再使用`Set`集合的迭代器获取对应的`value`
2. 通过`Set<Map.Entry<K,V>> entrySet()`获取到`HashMap`中的键值对存入到`Set`中，再通过`Map`的内部静态接口`Map.Entry`中的`getKey`方法和`getValue`方法分别获取到`Map`中对应的键值对

例如下面的代码：

```java
public class Test07 {
    public static void main(String[] args) {
        Map<String, String> map = new TreeMap<>();
        map.put("1", "张三");
        map.put("13", "王五");
        map.put("112", "李四");

        // 使用entrySet遍历
        Set<Map.Entry<String, String>> entries = map.entrySet();

        for (Map.Entry<String, String> entry : entries) {
            System.out.println(entry.getKey() + " : " + entry.getValue());
        }

        System.out.println();
    }
}
```

## `HashMap`类

### 介绍

`HashMap`类是`Map`接口的实现类，其特点如下：

1. `key`唯一但`value`不唯一
2. 插入顺序与存储顺序不一定相同
3. 没有索引方式操作元素的方法
4. 线程不安全
5. 可以存`null`值

对应的数据结构为哈希表

!!! note
    需要注意，如果出现`key`重复会保留最后一个键值对的`value`，即「发生`value`覆盖」

### 构造方法

常用构造方法：

1. 无参构造方法：`HashMap()`，默认初始容量为16，负载因子为0.75
2. 传递初始容量的有参构造方法：`HashMap(int initialCapacity)`，默认负载因子为0.75
3. 传递初始容量和负载因子的有参构造方法：`HashMap(int initialCapacity, float loadFactor)`

### 常用方法

1. `V get(Object key)`：根据`key`值获取对应的`value`
2. `V getOrDefault(Object key, V defaultValue)`：根据`key`值获取对应的`value`，如果没有该键`key`，则返回默认值`defaultValue`
3. `V put(K key, V value)`：向`HashMap`中插入元素，返回被参数`value`覆盖的`value`
4. `V remove(Object key)`：根据`key`值移除`HashMap`中指定的元素，返回被删除的键值对对应的`value`
5. `Set<K> keySet()`：返回`HashMap`中所有`key`值的集合（`key`不可以重复）
6. `Collection<V> values()`：获取`HashMap`中所有的`value`，将其值存储到单列集合中（`value`可以重复）
7. `Set<Map.Entry<K, V>> entrySet()`：返回`HashMap`中所有键值对的集合
8. `boolean containsKey(Object key)`：判断`HashMap`中是否还有指定`key`元素
9. `boolean containsValue(Object value)`：判断`HashMap`中是否还有指定`value`元素
10. `int size()`：返回`HashMap`中键值对的数量

使用与`TreeMap`类似，此处不再演示

### 遍历集合

`HashMap`遍历方式有以下两种：

1. 通过`key`值获取到对应的`value`，通过`Set<K> keySet()`方法将获取到的`key`存入到`Set`中，再使用`Set`集合的迭代器获取对应的`value`
2. 通过`Set<Map.Entry<K,V>> entrySet()`获取到`HashMap`中的键值对存入到`Set`中，再通过`Map`的内部静态接口`Map.Entry`中的`getKey`方法和`getValue`方法分别获取到`Map`中对应的键值对

例如下面的代码：

```java
public class Test02 {
    public static void main(String[] args) {
        HashMap<String, String> map = new HashMap<>();
        map.put("老大", "张三");
        map.put("老二", "李四");
        map.put("老三", "王五");

        // 根据key获取value遍历
        Set<String> strings = map.keySet();
        for (String string : strings) {
            System.out.println(string+"="+map.get(string));
        }
        System.out.println();
        // 使用entrySet遍历
        Set<Map.Entry<String, String>> entries = map.entrySet();
        for (Map.Entry<String, String> entry : entries) {
            System.out.println(entry.getKey()+"="+entry.getValue());
        }

    }
}
```

## `LinkedHashMap`类

### 介绍

1. `key`唯一但`value`不唯一
2. 插入顺序与存储顺序相同
3. 没有索引方式操作元素的方法
4. 线程不安全
5. 可以存`null`值

对应的数据结构为哈希表+双向链表

### 常用方法

`LinkedHashMap`类常用方法与`HashMap`类常用方法相同，此处不再演示

### 遍历集合

`LinkedHashMap`类遍历集合与`HashMap`类遍历集合的方式相同，此处不再演示

## `Map`接口自定义类型去重的方式

以下面的自定义类为例：

```java
public class Person {
    private int age;
    private String name;

    public Person(int age, String name) {
        this.age = age;
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

以下面的测试为例：

```java
public class Test05 {
    public static void main(String[] args) {
        LinkedHashMap<Person, String> personHashMap = new LinkedHashMap<>();
        personHashMap.put(new Person(18, "张三"), "老大");
        personHashMap.put(new Person(19, "李四"), "老二");
        personHashMap.put(new Person(20, "王五"), "老三");
        personHashMap.put(new Person(20, "王五"), "老三");

        // 遍历
        Set<Map.Entry<Person, String>> entries = personHashMap.entrySet();
        for (Map.Entry<Person, String> entry : entries) {
            System.out.println(entry.getKey()+"="+entry.getValue());
        }

    }
}
```

前面在`Set`部分提到`HashSet`的去重方式：

1. 先计算元素的哈希值（重写`hashCode`方法），再比较内容（重写`equals`方法）
2. 先比较哈希值，如果哈希值不一样，存入集合中
3. 如果哈希值一样,再比较内容
    1. 如果哈希值一样，内容不一样，直接存入集合
    2. 如果哈希值一样，内容也一样，去重复内容，留一个存入集合

在`Map`接口中也是同样的方式去重，所以对于自定义类型来说，一样需要重写`equals`和`hashCode`方法

如果`Person`类没有重写`hashCode`和`equals`方法，此时`Person`对象比较方式是按照地址比较，所以对于第三个元素和第四个元素来说是两个元素，此时输出结果就会是下面的情况：

```java
Person{age=18, name='张三'}=老大
Person{age=19, name='李四'}=老二
Person{age=20, name='王五'}=老三
Person{age=20, name='王五'}=老三
```

而重写了`hashCode`和`equals`方法后，就可以避免上面的问题：

```java
Person{age=18, name='张三'}=老大
Person{age=19, name='李四'}=老二
Person{age=20, name='王五'}=老三
```

## `Set`接口和`Map`接口无索引操作原因分析

哈希表中虽然有数组，但是`Set`和`Map`却没有索引，因为存数据的时候有可能在同一个索引下形成链表，如果1索引上有一条链表，根据`Set`和`Map`的遍历方式：「依次遍历每一条链表」，那么要是按照索引1获取，此时就会遇到多个元素，无法确切知道哪一个元素是需要的，所以就取消了按照索引操作的机制

<img src="15. Java双列集合.assets\image1.png">

## `HashMap`无序但`LinkedHashMap`有序原因分析

`HashMap`底层的哈希表是数组+单向链表+红黑树，因为单向链表只有一个节点引用执行下一个节点，此时只能保证当前链表上的节点元素可能与插入顺序相同，但是如果使用双向链表就可以解决这个问题，过程如下：

<img src="15. Java双列集合.assets\image2.png">

## 哈希表结构存储过程分析

`HashMap`底层的数据结构是哈希表，但是不同的JDK版本，实现哈希表的方式有所不同：

- JDK7时的哈希表：数组+单链表
- JDK8及之后的哈希表：数组+链表+红黑树

以JDK8及之后的版本为例，存储过程如下：

- 先计算哈希值，此处哈希值会经过两部分计算：1. 对象内部的`hashCode`方法计算一次 2. `HashMap`底层再计算一次
- 如果哈希值不一样或者哈希值一样但内容不一样（哈希冲突），直接存入`HashMap`
- 如果哈希值一样且内容也一样，则发生`value`覆盖现象

在Java中，`HashMap`在实例化对象时，如果不指定大小，则默认会开辟一个长度为16的数组。但是该数组与`ArrayList`一样，只有在第一次插入数据时才会开辟容量

而哈希表扩容需要判断加载因子`loadfactor`，默认负载因子`loadfactor`大小为0.75，如果插入过程中加载因子`loadfactor`超过了0.75，就会发生扩容

存储数据的过程中，如果出现哈希值一样，内容不一样的情况，就会在数组同一个索引位置形成一个链表，依次链接新节点和旧节点。如果链表的长度超过了8个节点并且数组的长度大于等于64，此时链表就会转换为红黑树，同样，如果后续删除节点导致元素个数小于等于6，红黑树就会降为链表

## 哈希表结构源码分析

查看源码时可能会使用到的常量：

```java
static final float DEFAULT_LOAD_FACTOR = 0.75f; // 默认加载因子
static final int TREEIFY_THRESHOLD = 8; // 转化为红黑树的节点个数
static final int MIN_TREEIFY_CAPACITY = 64; // 转化为红黑树时最小的数组长度
static final int UNTREEIFY_THRESHOLD = 6; // 红黑树退化为链表的节点个数
static final int MAXIMUM_CAPACITY = 1 << 30; // 最大容量
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // 最小容量
```

查看源码时会看到的底层节点结构：

```java
static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;

        Node(int hash, K key, V value, Node<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    // ...
}
```

### 使用无参构造创建`HashMap`对象

测试代码：

```java
HashMap<String, String> map = new HashMap<>();
```

对应源码：

```java
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}
```

### 第一次插入元素

测试代码：

```java
HashMap<String, String> map = new HashMap<>();
map.put("1", "张三");
```

对应源码：

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    
    // ...

    ++modCount;
    if (++size > threshold)
        resize();
    // ...
    return null;
}

// 创建新节点
Node<K,V> newNode(int hash, K key, V value, Node<K,V> next) {
    return new Node<>(hash, key, value, next);
}

// 扩容
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        // ... 
    }
    else if (oldThr > 0)
        // ...
    else {               
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    // ...
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    // ...
    return newTab;
}
```

!!! note
    `threshold`代表扩容边界，是`HashMap`中的成员变量，由容量和负载因子相乘计算得到

在上面的代码中，插入数据调用`put`方法，底层会调用`putVal`方法，进入`putVal`后，首先会判断当前表是否为空，而此时因为是第一次插入元素，元素还没有进入表中，当前表为空，所以会走第一个`if`语句，进入内部执行`n = (tab = resize()).length;`会执行`resize`方法为当前的`tab`扩容

进入`resize`方法中，当前的成员`table`即为`HashMap`底层的哈希表，因为不存在元素，所以为空，从而`oldTab`也为空，执行后面的代码后`oldCap`和`oldThr`均为0，直接进入`else`语句中，将`newCap`置为16，同时将`newThr`赋值为12，执行完毕后，将成员`threshold`更新为`newThr`的值，将新容量16作为数组长度创建一个新的数组`newTab`，将`newTab`给成员变量`table`返回给调用处继续执行

!!! note
    此处需要注意，对于`Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];`来说，因为Java不支持创建泛型数组，所以先创建原始类型数组再通过强制转换将其转换为泛型数组

回到调用处`n = (tab = resize()).length;`，此时`tab`即为成员变量`table`的值，获取其长度即为16。接着执行第二个`if`语句，此处的`i = (n - 1) & hash`用于计算哈希表的映射位置，即数组索引，进入`if`语句，创建节点并插入到指定索引位置，改变`size`并比较是否超过`threshold`，此处未超过不用扩容，改变并发修改控制因子，返回被覆盖的`null`

### 使用有参构造创建`HashMap`对象

测试代码：

```java
HashMap<String, String> map1 = new HashMap<>(5)
```

对应源码：

```java
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    // ... 
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}

static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

当执行有一个参数的构造时，底层调用内部的有两个参数的构造，第一个参数即为初始容量大小，第二个参数传递默认的加载因子

在有两个参数的构造中，首先判断初始容量`initialCapacity`是否小于0，如果小于则抛出异常，再判断初始容量`initialCapacity`是否大于最大值，如果大于则修正为最大值。

在执行完所有判断后，将加载因子赋值给成员变量`loadfactor`，再根据初始容量计算扩容前最大的容量

### 哈希值相同时比较源码

```java
Node<K,V> e; K k;
if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
    e = p;
```

首先比较哈希值，如果哈希值相同，则比较`key`对应的`value`，为了防止出现`key`为空导致的空指针问题，先判断`key`不为空，再比较`key`

上面过程即「先比较哈希值（重写`hashCode`方法），相同再比较内容（重写`equals`方法）」，所以插入元素的过程如下

1. 先比较哈希值，如果哈希值不一样，存入集合中
2. 如果哈希值一样,再比较内容
    1. 如果哈希值一样，内容不一样，直接存入集合
    2. 如果哈希值一样，内容也一样，去重复内容，留一个存入集合

所以前面之所以重写了`equals`方法的同时还需要重写`hashCode`就是为了尽可能保证内容比较和去重的可靠性

总结：对于自定义类型来说，如果不需要打印对象的地址而是打印对象的内容就重写`toString`方法，而需要比较对象是否相同除了内容比较还需要进行`hashCode`比较，所以需要重写`equals`和`hashCode`方法

## `HashTable`与`Vector`

`HashTable`类是`Map`接口的实现类，其特点如下：

1. `key`唯一，`value`可重复
2. 插入顺序与存储顺序不一定相同
3. 没有索引的方式操作元素
4. 线程安全
5. 不能存储`null`值

底层数据结构：哈希表

`Vector`类是`Collection`接口的实现类，其特点如下：

1. 元素插入顺序与存储顺序相同
2. 有索引的方式操作元素
3. 元素可以重复
4. 线程安全

底层数据结构：数组

因为`HashTable`和`Vector`现在已经不经常使用了，所以使用及特点自行了解即可

## `Properties`类

### `Properties`类介绍

`Properties`类是`HashTable`类的子类，其特点如下：

1. `key`唯一，`value`可重复
2. 插入顺序与存储顺序不一定相同
3. 没有索引的方式操作元素
4. 线程安全
5. 不能存储`null`值
6. `Properties`类不是泛型类，默认元素是`String`类型

底层数据结构：哈希表

### `Properties`类特有方法

常用方法与`HashMap`等类似，此处主要考虑特有方法：

1. `Object setProperty(String key, String value)`：存键值对
2. `String getProperty(String key)`：根据`key`获取对应的`value`
3. `Set<String> stringPropertyNames()`：将所有`key`对应的`value`存储到`Set`中，类似于`HashMap`中的`KeySet`方法
4. `void load(InputStream inStream)`：将流中的数据加载到`Properties`类中（具体见IO流部分）

基本使用如下：

```java
public class Test08 {
    public static void main(String[] args) {
        Properties properties = new Properties();
        //Object setProperty(String key, String value)
        properties.setProperty("username","root");
        properties.setProperty("password","1234");
        System.out.println(properties);
        //String getProperty(String key)
        System.out.println(properties.getProperty("username"));
        //Set<String> stringPropertyNames()
        Set<String> set = properties.stringPropertyNames();
        for (String key : set) {
            System.out.println(properties.getProperty(key));
        }
    }
}
```

## `Map`练习案例

### 案例1：统计字符串每一个字符出现的次数

统计字符串：`abcdsaasdhubsdiwb`中每一个字符出现的次数

思路：

遍历字符串依次插入`HashMap<String, Integer>`（或者`LinkedHashMap<String, Integer>`）中，这个过程中会出现两种情况：

1. 字符不存在与`HashMap`中，属于第一次插入，将计数器记为1
2. 字符存在于`HashMap`中，代表非第一次插入，将计数器加1重新插入到`HashMap`中

代码实例：

```java
public class Test01 {
    public static void main(String[] args) {
        String str = "abcdsaasdhubsdiwb";
        HashMap<Character, Integer> counter = new HashMap<>();

        // 将字符串存入数组中，注意存入的是字符，而不是字符对应的ASCII码
        char[] chars = str.toCharArray();
        for (char c : chars) {
            // 遍历HashMap，如果不存在字符就插入，存在就将value值加1
            if (!counter.containsKey(c)) {
                counter.put(c, 1);
            } else {
                counter.put(c, counter.get(c) + 1);
            }
        }

        // 打印结果
        Set<Character> characters = counter.keySet();
        for (Character character : characters) {
            System.out.println(character + "=" + counter.get(character));
        }

    }
}
```

### 案例2：斗地主案例`HashMap`版本

思路：

使用`HashMap`存储每一张牌（包括值和样式），`key`存储牌的序号（从0开始），`value`存储牌面，使用前面同样的方式组合牌并存入`HashMap`中，存储过程中每存一张牌，key位置的数值加1。为了保证可以打乱牌，需要将牌面对应的序号存入一个单列容器，再调用`shuffle`方法。打乱后的牌通过序号从`HashMap`中取出，此时遍历`HashMap`通过`key`获取`value`即可

其中，有些一小部分可以适当修改，例如每一个玩家的牌面按照序号排序，查看玩家牌可以通过调用一个函数完成相应的行为等

!!! note
    此处当`key`是有序数值，会出现插入顺序与存储数据相同

<img src="15. Java双列集合.assets\image3.png">

示例代码：

```java
public class Test_Poker02 {
    public static void main(String[] args) {
        // 创建花色
        String[] color = "黑桃-红心-梅花-方块".split("-");
        // 创建号牌
        String[] number = "2-3-4-5-6-7-8-9-10-J-Q-K-A".split("-");

        HashMap<Integer, String> count_poker = new HashMap<Integer, String>();

        int key = 2;// 从2开始，保留两张牌给大王和小王
        // 组合牌
        for (String c : color) {
            for (String n : number) {
                // 插入到HashMap中
                count_poker.put(key++, c+n);
            }
        }

        count_poker.put(0, "大王");
        count_poker.put(1, "小王");
        // 创建一个ArrayList专门存牌号，便于打乱牌面
        ArrayList<Integer> count = new ArrayList<>();
        Set<Integer> integers = count_poker.keySet();
        for (Integer integer : integers) {
            count.add(integer);
        }

        // 打乱牌号，从而实现打乱牌面
        Collections.shuffle(count);

        // 创建玩家
        ArrayList<Integer> player1 = new ArrayList<>();
        ArrayList<Integer> player2 = new ArrayList<>();
        ArrayList<Integer> player3 = new ArrayList<>();
        // 创建底牌
        ArrayList<Integer> last = new ArrayList<>();

        // 发牌
        for (int i = 0; i < count.size(); i++) {
            if(i >= 51) {
                last.add(count.get(i));
            } else if(i % 3 == 0) {
                player1.add(count.get(i));
            } else if(i % 3 == 1) {
                player2.add(count.get(i));
            } else if(i % 3 == 2) {
                player3.add(count.get(i));
            }
        }

        // 对玩家的牌进行排序
        Collections.sort(player1);
        Collections.sort(player2);
        Collections.sort(player3);

        // 显示玩家牌
        show("玩家1", player1, count_poker);
        show("玩家2", player2, count_poker);
        show("玩家3", player3, count_poker);
        show("底牌", last, count_poker);
    }

    public static void show(String name, ArrayList<Integer> any, HashMap<Integer, String> poker) {
        System.out.print(name + "：" +"[ ");
        for (Integer i : any) {
            System.out.print(poker.get(i)+" ");
        }
        System.out.println("]");
    }
}
```