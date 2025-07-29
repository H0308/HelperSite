# Python类和对象进阶

## 限制属性绑定

因为Python属于动态类型语言，所以允许创建一个没有任何属性和方法的类，在创建该类的实例后使用对象单独添加属性和方法，例如下面的代码：

```python
# 创建一个空类
class Person:
    pass

# 创建一个对象
p = Person()
# 单独添加属性
p.name = 'Tom'
print(p.name) # Tom
# 创建另外一个对象
p1 = Person()
print(p1.name) # AttributeError: 'Person' object has no attribute 'name'
```

如果使用这种方式添加方法，那么这个方法就属于单个对象而不是所有对象共有，所以一般使用这种方式添加方法会考虑给类添加方法：

```python
# 创建对象
p = Person()
p1 = Person()

# 定义方法
def say_hello(self):
    print('Hello')
# 给类添加方法
Person.say_hello = say_hello
# 创建对象
# 调用方法
p1.say_hello() # Hello
p.say_hello() # Hello
```

但是，这种添加属性的方式并不会限制对象总共有哪些属性，也就是说，对象可以创建任意的属性。为了限制这种行为，在Python中可以在类中使用`__slots__()`属性，其值为一个存储着本类对象可以添加的属性的元组，例如下面的代码：

```python
class Person:
    __slots__ = ('name', 'age', 'say_hello')
    pass
```

此时`Person`类对象就只能添加`name`和`age`属性，例如下面的代码：

```python
# 创建对象
p = Person()
# 添加属性
p.name = 'Tom'
p.age = 18
print(p.name, p.age) # Tom 18
# p.gender = 19
# print(p.gender) # AttributeError: 'Person' object has no attribute 'gender'
```

使用`__slots__`要注意，`__slots__`定义的属性仅对当前类实例起作用，对继承的子类是不起作用的，也就是说子类对象可以添加`__slots__`指向的元组中不存在的属性：

```python
# 父类
class Person:
    __slots__ = ('name', 'age')
    pass

# 子类
class Teacher(Person):
    pass

t = Teacher()
t.name = 'Tom'
t.age = 18
print(t.name, t.age) # Tom 18
t.gender = "male"
print(t.gender) # male
```

## 使用`@property`装饰器

前面在[类和对象基础：封装性](https://www.help-doc.top/Python%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/7.%20Python%E7%B1%BB%E5%92%8C%E5%AF%B9%E8%B1%A1%E5%9F%BA%E7%A1%80/7.%20Python%E7%B1%BB%E5%92%8C%E5%AF%B9%E8%B1%A1%E5%9F%BA%E7%A1%80.html#_5)中提到为了满足封装性需要提供`getter`和`setter`方法，而在通过对象获取对应的属性以及设置对应的属性就需要调用这两个方法，这个过程就会存在割裂感。为了简化这个过程，就可以使用`@property`装饰器，该装饰器的作用就是将原来通过方法调用获取对应的属性的方式转换为正常访问属性的方式（即`对象.属性名`），将原来通过方法调用设置对应的属性的方式转换为给属性赋值的方式（即`对象.属性名 = 值`）

例如下面的代码：

```python
class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age

    # 提供getter
    @property
    def name(self):
        return self._name

    @property
    def age(self):
        return self._age

    # 提供setter
    @name.setter
    def name(self, name):
        self._name = name

    @age.setter
    def age(self, age):
        self._age = age
```

此时使用时，就只需要使用常规方式即可：

```python
p = Person('Tom', 18)
print(p.name, p.age) # Tom 18 相当于调用了getter方法
p.name = 'Jerry' # 相当于调用了setter方法
p.age = 20 # 相当于调用了setter方法
print(p.name, p.age) # Jerry 20
```

在上面的代码中，使用`@property`给类添加`getter`方法，两个方法分别获取到类的保护属性`_name`和`_age`，使用`属性名（不带下划线）.setter`给类添加`setter`方法，分别设置类的两个保护属性。这两种拥有了装饰器的方法的方法名和属性名相同

需要注意，`getter`和`setter`的使用是在有保护属性或者私有属性的情况下使用，一般在属性是开放的时候不使用，而上面说到「两种拥有了装饰器的方法的方法名和属性名相同」，如果属性不是保护的也不是私有的，那么此时方法名就和属性名相同，此时再使用`@property`就会出现循环递归调用最后导致栈溢出

## 多重继承

本部分在本文档中不会具体介绍，详细内容见[官方教程](https://docs.python.org/zh-cn/3/tutorial/classes.html#multiple-inheritance)

## 魔法方法

### 介绍

在Python中，魔法方法是类中的一种特殊方法（special method），这些特殊方法的最大特点就是方法名前后都有`__`，下面介绍常用的魔法方法：

1. 基础魔术方法
   
      1. `__new__()`方法
      2. `__del__()`方法
      3. `__str__()`方法

2. 比较魔术方法

      1. `__eq__()`方法：类似与C++的`operator==`
      2. `__ne__()`方法：类似于C++的`operator!=`
      3. `__gt__()`方法：类似于C++的`operator>`
      4. `__lt__()`方法：类似于C++的`operator<`
      5. `__ge__()`方法：类似于C++的`operator>=`
      6. `__le__()`方法：类似于C++的`operator<=`
      7.  `__hash__()`方法：决定如何计算当前类对象的`hash`值
      8.  `__bool__()`方法：决定`bool(对象)`的结果，类似于C++的`operator bool()`

3. 算术运算魔术方法

      1.  `__add__()`方法：类似于C++的`operator+`
      2.  `__sub__()`方法：类似于C++的`operator/`
      3.  `__mul__()`方法：决定两个同类对象相乘的行为
      4.  `__truediv__()`方法：决定一个对象除以另外一个同类对象的行为
      5.  `__floordiv__()`方法：决定一个对象整除以另外一个同类对象的行为
      6.  `__mod__()`方法：决定一个对象对另外一个同类对象取模的行为

4.  `__len__()`方法：当调用`len(对象)`时会调用该对象的`__len__()`方法

### 基础魔术方法

#### `__new__()`方法

对于`__new__()`方法来说，其与`__init__()`方法很类似，都是在创建对象时调用，但是更具体来说，`__new__()`是创建对象，即从内存中为对象申请空间，而`__init__()`方法是初始化对象中的内容

!!! note

    注意，因为`__new__()`是类方法，所以其第一个参数一定是`cls`

例如下面的代码演示了实例化一个对象时`__new__()`和`__init__()`都会被调用：

```python
class Person:
    def __new__(cls):
        print('new方法被调用')
        return super().__new__(cls)

    def __init__(self):
        print('init方法被调用')

p = Person() # new方法被调用 init方法被调用
```

在上面的代码中可以看到，`__new__()`方法对比`__init__()`方法，除了参数的不同外，还有返回值的不同，`__init__()`方法默认是没有返回值的，但是`__new__()`必须写返回值，并且返回调用其父类的`__new__()`方法的返回值，因为创建对象的本质就是创建`object`类对象，再根据其他内容进行对对象进行初始化

实际上，上面的两个方法执行步骤是：

```python
obj = Person.__new__(Person)
obj.__init__()
```

如果是有属性的对象，那么在`__new__()`方法中和`__init__()`方法中都需要写上参数，不可以只给`__new__()`方法或者`__init__()`方法设置参数，例如下面的代码：

```python
class Person:
    def __new__(cls, x):
        print('new方法被调用')
        return super().__new__(cls, x)

    def __init__(self, x):
        print('init方法被调用')

p = Person(10) # new方法被调用 init方法被调用
```

在上面的代码中，假定类`Person`有个`x`属性，那么为了在创建对象时可以指定对象属性值，就需要通过实参传递给形参，此时就必须要有个形参进行接收，这里假定就是`x`（形参），此时在创建`Person`类对象时，就等价于下面的步骤：

```python
obj = Person.__new__(Person, 10)
obj.__init__(10)
```

但是，一般情况下一个类只需要写`__init__()`，而不需要写`__new__()`，既然如此，`__new__()`方法的意义何在？实际上，`__new__()`在例如需要判断该类当前已经创建了多少个实例可以使用，比如使用`__new__()`实现单例模式：

```python
# 单例模式：饿汉模式
class Singleton:
    _instance = None
    def __new__(cls, x):
        print('new方法被调用')
        if not cls._instance:
            cls._instance = super().__new__(cls, x)
        return cls._instance

    def __init__(self, x):
        self.x = x
        print('init方法被调用')

s = Singleton(10)
# 第二次传参只是修改了x的值，但是返回的是同一个对象
s1 = Singleton(20)
print(s is s1)
print(s.x) # 20
print(s1.x) # 20
```

#### `__del__()`方法

在Python中，`__del__()`是一个特殊的方法，也称为析构函数。它的主要目的是定义当一个对象即将被垃圾回收时应该执行的操作。当Python的垃圾收集器检测到某个对象不再有引用，并决定销毁它以释放资源时，就会调用这个对象的`__del__()`方法

但是由于垃圾收集的时间点是不确定的，因此`__del__()`方法的具体执行时间也是不可预测的，这使得它不适合那些需要立即执行的任务

下面是一个使用`__del__()`方法的例子：

```python
class Person:
    def __init__(self):
        print("init方法被调用")

    def __del__(self):
        print("del方法被调用")

p = Person()
p1 = p
del p # 第一次调用时，因为还存在p1指向同一个对象，所以不会调用del方法
del p1 # 第二次调用时，因为没有其他变量指向这个对象，所以会调用del方法

输出结果：
init方法被调用
del方法被调用
```

#### `__str__()`方法

在Python中，`__str__()`是一个特殊方法（也称为魔术方法或双下划线方法），它定义了当使用`str()`函数或`print()`函数打印对象时应该返回的字符串表示形式。这个方法的主要目的是提供一个对用户友好的、可读性强的对象描述

下面是`__str__()`方法使用示例：

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"Person: {self.name}, Age: {self.age}"

# 创建一个 Person 对象
p = Person("Alice", 30)

# 使用 print() 函数输出对象
print(p)  # 输出: Person: Alice, Age: 30

# 使用 str() 函数转换对象
person_str = str(p)
print(person_str)  # 输出: Person: Alice, Age: 30
```

在Python中，有一个魔法方法`__repr__()`与`__str__()`非常类似，但是`__repr__()`更多用于开发者的调试目的，期望得到一个更详细的、准确的表示，以便于开发者理解对象的具体状态，在调用`repr()`函数会调用类的`__repr__()`方法

### 比较魔术方法

#### `__eq__()`方法

其他用于比较的魔术方法（不包括`__hash__()`和`__bool__()`）和`__eq__()`非常类似，不再一一举例，下面以`__eq__()`为例具体解释

在Python中，如果一个类实现了`__eq__()`方法就可以使用`==`进行类对象是否相等判断，例如下面的代码：

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    # 定义__str__方法
    def __str__(self):
        return f"{self.year}/{self.month}/{self.day}"

    # 定义__eq__方法
    def __eq__(self, other):
        return self.year == other.year and self.month == other.month and self.day == other.day

d1 = Date(2021, 1, 1)
d2 = Date(2021, 1, 1)

print(d1 == d2) # True
```

在上面的代码中，`__eq__()`方法有两个参数，第一个参数代表当前对象（赋值运算符左侧对象），第二个参数代表其他同类对象（赋值运算符右侧对象），对二者进行相等比较的逻辑就是比较年月日是否都想吐

注意，如果一个类没有重写`__eq__()`方法，则使用`==`时默认就是使用`is`进行判断

与`__eq__()`方法相对的就是`__ne__()`方法，但是如果不想写`__ne__()`也可以，因为Python会根据类的`__eq__()`结果进行取反，这个规律同样也适用于小于和大于以及小于等于和大于等于

!!! note

    对于剩余的比较魔术方法就没有像`__eq__()`方法一样有默认的比较方式，所以如果当前类没有写其他比较魔术方法就会报错

需要注意，如果比较的两个对象存在继承关系，则默认调用的是子类的比较魔术方法，如果子类没有，则调用父类的比较魔术方法，但是`self`是子类对象，而不是父类对象，例如下面的代码：

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    # 定义__str__方法
    def __str__(self):
        return f"{self.year}/{self.month}/{self.day}"

    # 定义__eq__方法
    def __eq__(self, other):
        print(self, other)
        return self.year == other.year and self.month == other.month and self.day == other.day

class NewDate(Date):
    pass

d1 = Date(2021, 1, 1)
d2 = NewDate(2022, 1, 1)

print(d1 == d2)

输出结果：
2022/1/1 2021/1/1
False
```

#### `__hash__()`方法

在Python中，`__hash__()`是一个特殊方法，用于定义对象的哈希值。哈希值是一个整数，它由对象的内容生成，并且对于相同内容的对象应该是相同的。哈希值主要用于实现快速查找和比较，特别是在字典（`dict`）和集合（`set`）等数据结构中。这些数据结构依赖于哈希值来高效地存储和检索元素

在Python中，默认可以使用`hash()`函数计算指定的类对象的哈希值，但是如果当前类定义了`__eq__()`方法，那么`hash()`就会失效，此时就需要重写`__hash__()`方法，本质就是因为写了`__eq__()`方法改变了默认`hash()`的行为

注意，实现__hash__()方法需要遵循下面两点：

1. `__hash__()`必须返回一个整数
2. 对于两个相同的对象来说，它们必须具有相等的哈希值

根据Python官方文档的建议，可以将对象的每一个属性组成一个元组，再将这个元组作为`hash()`函数的参数

下面是使用`__hash__()`方法的一个例子：

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    # 定义__str__方法
    def __str__(self):
        return f"{self.year}/{self.month}/{self.day}"

    # 定义__eq__方法
    def __eq__(self, other):
        print(self, other)
        return self.year == other.year and self.month == other.month and self.day == other.day

    # 定义__hash__方法
    def __hash__(self):
        return hash((self.year, self.month, self.day))

d1 = Date(2021, 1, 1)
d2 = Date(2021, 1, 1)
d3 = Date(2022, 1, 1)

# 相同对象的哈希值是相同的，不同对象的哈希值是不同的
print(hash(d1), hash(d2), hash(d3))

输出结果：
3713081631934410656 3713081631934410656 3713081631934410657
```

#### `__bool__()方法`

在 Python 中，`__bool__()`是一个特殊方法，它定义了当对象被用作布尔上下文时的行为。这个方法应该返回`True`或`False`。如果一个类没有定义`__bool__()`方法，Python 会尝试调用`__len__()`方法，并且如果`__len__()`返回 0，则对象被视为`False`；否则，对象被视为`True`。如果 `__len__()`也没有定义，那么对象默认为`True`

例如下面的代码：

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    # 定义__bool__方法
    def __bool__(self):
        return self.year != 0 or self.month != 0 or self.day != 0

d1 = Date(2021, 1, 1)
d2 = Date(0,0,0)

if d1:
    print("d1 is True")

if not d2:
    print("d2 is False")

输出结果：
d1 is True
d2 is False
```

### 算术运算魔术方法

涉及到算术运算魔法方法的根据前面的使用经验就可以直接看[官方文档](https://docs.python.org/zh-cn/3/reference/datamodel.html#emulating-numeric-types)对这些魔法方法解释了，这里就不再赘述了

### `__len__()`方法

在Python中，`__len__()`是一个特殊方法，它定义了当使用内置函数`len()`来获取对象的长度时应该返回什么。这个方法通常用于容器类型（如列表、字典、集合等）中，以返回容器中元素的数量。如果一个类实现了`__len__()`方法，那么该类的实例就可以被`len()`函数处理。一般情况下，`__len__()`方法应当返回一个非负整数，表示对象中元素的数量。如果对象不包含任何元素，应返回0。

例如下面的代码：

```python
class MyList:
    def __init__(self, initial_items=None):
        self.items = initial_items if initial_items is not None else []

    def __len__(self):
        # 返回列表中元素的数量
        return len(self.items)

    def add(self, item):
        self.items.append(item)

# 创建一个 MyList 对象
my_list = MyList([1, 2, 3])

# 使用 len() 函数获取对象的长度
print(len(my_list))  # 输出: 3

# 添加更多元素
my_list.add(4)
my_list.add(5)

# 再次获取长度
print(len(my_list))  # 输出: 5
```