<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Python类和对象基础

## Python作用域和命名空间

namespace（命名空间）是从名称到对象的映射。现在，大多数命名空间都使用Python字典实现，但除非涉及到性能优化，一般不会关注这方面的事情，而且将来也可能会改变这种方式。在Python中，常见的命名空间例子有：

1. 内置名称集合（包括`abs()`函数以及内置异常的名称等）
2. 一个模块的全局作用域
3. 一个函数调用中的局部作用域
4. 对象的属性集合（实例的命名空间）

与C++命名空间的作用类似，定义在不同的命名空间中的名称彼此之间互不冲突。例如，两个不同的模块都可以定义`maximize()`函数，且不会造成混淆。用户使用函数时必须要在函数名前面加上模块名指定是哪一个模块中的函数

前面已经使用过很多次对象的方法，每一次调用方法都是通过`对象.方法名`的方式，实际上，点号之后的名称被称为属性，例如表达式`z.real`中，`real`是对象`z`的属性。同样，使用模块中的名称也被称为属性：表达式`modname.funcname`中，`modname`是模块对象，`funcname` 模块的属性

命名空间是在不同时刻创建的，且拥有不同的生命周期。内置名称的命名空间是在Python解释器启动时创建的，永远不会被删除。模块的全局命名空间在读取模块定义时创建，通常，模块的命名空间也会持续到解释器退出。从脚本文件读取或交互式读取的，由解释器顶层调用执行的语句是`__main__`模块调用的一部分，也拥有自己的全局命名空间。内置名称实际上也在模块里，即`builtins`

函数的局部命名空间在函数被调用时被创建，并在函数返回或抛出未在函数内被处理的异常时被删除。对于递归调用来说，每次递归调用都有自己的局部命名空间

在Python中，作用域虽然是被静态确定的，但会被动态使用。执行期间的任何时刻，都会有3或4个“命名空间可直接访问”的嵌套作用域：

1. 最内层作用域，包含局部名称，并首先在其中进行搜索（局部作用域）
2. 那些外层闭包函数的作用域，包含“非局部、非全局”的名称，从最靠内层的那个作用域开始，逐层向外搜索（嵌套函数的内部作用域）
3. 倒数第二层作用域，包含当前模块的全局名称（全局作用域）
4. 最外层（最后搜索）的作用域，是内置名称的命名空间（内置作用域）

!!! note

    “可直接访问”的意思是，该文本区域内的名称在被非限定引用（不需要使用`.`进行访问）时，查找名称的范围，是包括该命名空间在内的

## 类和对象

### 创建类和实例化对象

在Python中，创建类的格式如下：

```python
class ClassName:
    <语句-1>
    .
    .
    .
    <语句-N>
```

当进入类定义时，将创建一个新的命名空间，并将其用作局部作用域，因此，所有对局部变量的赋值都是在这个新命名空间之内

例如有下面的类：

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def say_hello(self):
        print('Hello, my name is', self.name)
```

在上面的类中，为了创建类的实例对象，需要使用到魔法方法`__init__`（这个方法也被称为类的构造方法），类中所有的成员方法第一个参数表示调用本方法的对象的引用（相当于C++、Java中的`this`），一般情况下将其命名为`self`，也可以命名为其他名称（但是不推荐）

!!! note

    注意，因为`__init__`是构造函数，所以创建对象时会自动调用，如果需要传递实参，对于`self`来说不需要传递，传递的实参分别对应于第二个参数开始的后面的形参

在构造方法`__init__`中，第二个参数开始都是为成员属性赋值的变量，注意，在Python中，类的成员属性不可以定义在`__init__`方法外，在该方法内部，使用`self.成员属性 = 形式参数`新增成员属性并使用形参进行赋值，例如上述例子中的`name`和`age`

接着在类内定义了一个方法`say_hello`，这个方法属于成员方法，需要类的实例对象去调用

在Python中，创建类的实例对象可以使用下面的方法：

```python
变量名 = 类名()
```

例如对于前面定义的`Person`类来说，创建其对象的方式如下：

```python
person = Person("Marry", 20)
```

注意，因为在`__init__`方法中给了参数，所以在创建对象时就需要传递实参，如果想创建一个空对象，可以不写`__init__`方法，或者给`__init__`方法中的参数默认值创建一个由默认值实例化的对象，所以可以将类修改为如下：

```python
# 创建一个空类对象
class Person:
    pass

person = Person()

# 构造方法中的参数赋予默认值
class Person:
    def __init__(self, name = "zhangsan", age = 19):
        self.name = name
        self.age = age

    def say_hello(self):
        print("Hello, my name is", self.name)

# 创建一个名字为zhangsan，年龄为19岁的person对象
person = Person()

# 创建一个名字为lisi，年龄为18岁的person1对象
person1 = Person("lisi", 18)
```

有了类对象后，就可以通过该对象去调用其中的方法，例如同样是前面的`Person`类：

```python
person.say_hello()

输出结果：
Hello, my name is zhangsan
```

### 类属性和类方法

所谓类属性就是属于整个类的变量，其数据供所有当前类对象共享，一般定义在`__init__`方法的上面（实际上可以写在类的任何位置），例如下面的代码：

```python
lass Person:
    # 类属性
    number = 0

    def __init__(self, name = "zhangsan", age = 19):
        self.name = name
        self.age = age

    def say_hello(self):
        print('Hello, my name is', self.name)
```

当需要访问类属性时，需要用类名进行调用，例如需求：每创建一个`Person`类对象，`number`就加1：

```python
class Person:
    # 类属性
    number = 0

    def __init__(self, name = "zhangsan", age = 19):
        self.name = name
        self.age = age
        # 创建一次对象，类属性number加1
        Person.number += 1

    def say_hello(self):
        # 在方法中访问类属性需要使用类名调用
        print(f'Hello, my name is {self.name}, I am No.{Person.number}')
```

因为是类属性，所以在类外访问时也需要通过类名来调用而不建议使用对象调用，例如下面的代码：

```python
person = Person()

# 可以使用对象访问类属性，但是不推荐
print(person.number)  # 1
# 可以使用类名访问类属性，推荐
print(Person.number)  # 1
```

除了有类属性外，还有类方法，与对象方法不同，类方法默认第一个参数传递的是`cls`，代表当前类，并且在定义类方法时，需要使用到装饰器`@classmethod`，例如下面的代码：

```python
class Person:
    number = 0

    def __init__(self, name = "zhangsan", age = 19):
        self.name = name
        self.age = age
        # 创建一次对象，类属性number加1
        Person.number += 1

    def say_hello(self):
        print(f'Hello, my name is {self.name}, I am No.{Person.number}')

    # 类方法
    @classmethod
    def get_number(cls):
        return cls.number
```

在上面的代码中，定义了一个`get_number`方法，该方法因为使用了装饰器`@classmethod`，所以是属于整个类的方法，第一个参数是`cls`，因为其代表的是当前类，所以调用类属性时就只需要用该参数调用即可

在使用类方法时，需要使用类进行调用，也可以使用类对象调用，同样不推荐，例如下面的代码：

```python
person = Person()
# 可以使用对象访问类方法，但是不推荐
print(person.get_number()) # 1
# 可以使用类名访问类方法，推荐
print(Person.get_number()) # 1
```

### 类的静态方法

在Python中，除了有类方法以外，还有静态方法，与类方法非常类似，但是不同的是，其使用装饰器`@staticmethod`，并且默认情况下没有参数，例如下面的代码：

```python
class Person:
    number = 0

    def __init__(self, name = "zhangsan", age = 19):
        self.name = name
        self.age = age
        # 创建一次对象，类属性number加1
        Person.number += 1

    def say_hello(self):
        print(f'Hello, my name is {self.name}, I am No.{Person.number}')

    @classmethod
    def get_number(cls):
        return cls.number

    # 静态方法
    @staticmethod
    def print_info():
        print("这是一个静态方法")
```

调用类方法时，同样可以使用类或者该类对象调用，但是不推荐使用类对象进行调用，一般情况下静态方法且该类不创建对象时可以使该类成为一个工具类，所以大部分情况下都是使用类名调用静态方法，例如下面的代码：

```python
Person.print_info()

输出结果：
这是一个静态方法
```

### 封装性

面向对象三大特性：封装、继承和多态，Python作为面向对象的编程语言，同样具有该三大特性，下面介绍Python中的封装性

在Python中，虽然不像Java或C++那样严格地支持访问控制修饰符（如`public`, `private`, `protected`），但仍然可以通过一些约定来实现封装性，一般情况下使用下面的习惯：

1. 使用单下划线前缀`_`来表示该成员变量或方法是受保护的，但是这种方法依旧可以在类外访问，不会出现运行报错，但是不建议外部直接访问
2. 使用双下划线前缀`__`来表示该成员变量是私有的，这种方法会产生名称改写，在类外访问类中的某私有变量就会报错，这使得属性难以从类外部直接访问到

例如下面的代码：

```python
class Person:
    # 类属性
    number = 0

    def __init__(self, name = "zhangsan", age = 19, money = 100):
        # 保护属性
        self._name = name
        self._age = age
        # 私有属性
        self.__money = money
        # 创建一次对象，类属性number加1
        Person.number += 1

    def say_hello(self):
        print(f'Hello, my name is {self._name}, I am No.{Person.number}')

    # 类方法
    @classmethod
    def get_number(cls):
        return cls.number

    # 静态方法
    @staticmethod
    def print_info():
        print("这是一个静态方法")
```

对于命名前有`_`的保护属性来说，访问时依旧不会受到限制，但是不推荐在类外直接访问保护属性，而对于命名前有`__`的私有属性来说，访问会报错`AttributeError`：

```python
person = Person()

print(person._name) # zhangsan
print(person.__money) # AttributeError: 'Person' object has no attribute '__money'
```

之所以访问不到`__money`是因为Python对私有属性进行了名称改写，通过实例对象的`__dict__`属性可以查看到当前类对象所有的成员，如下：

```python
print(person.__dict__)

输出结果：
{'_name': 'zhangsan', '_age': 19, '_Person__money': 100}
```

可以看到除了保护属性以外，私有属性被改写为了`_Person__money`，如果访问这个名称就可以访问到类中的私有属性（不推荐），例如下面的代码：

```python
print(person._Person__money) # 100
```

注意，因为类中`__money`被Python进行了名称改写，如果这种情况下直接对`__money`进行赋值相当于相当于向类中添加了一个变量`__money`，而不是访问其中的`__money`属性，这一点和JavaScript是一致的

既然对变量进行了保护或者私有，那么根据封装性，除了私有成员还需要对外提供相应的获取和修改接口，这也就是`getter`和`setter`，所以上面的类可以修改为：

```python
class Person:
    number = 0

    def __init__(self, name = "zhangsan", age = 19, money = 100):
        # 保护属性
        self._name = name
        self._age = age
        # 私有属性
        self.__money = money
        Person.number += 1

    # getter方法
    def get_name(self):
        return self._name
    def get_age(self):
        return self._age

    # setter方法
    def set_name(self, name):
        self._name = name
    def set_age(self, age):
        self._age = age

    def say_hello(self):
        print(f'Hello, my name is {self._name}, I am No.{Person.number}')

    @classmethod
    def get_number(cls):
        return cls.number

    @staticmethod
    def print_info():
        print("这是一个静态方法")
```

注意，有时可以看到一些变量`__变量名__`（不但前面有双下划线，后面也有双下划线），这种不是私有变量，而是特殊变量

### 继承性

在Python中，要表示一个类继承自另外一个类，可以在类名后使用`(父类)`表示当前类继承自括号中的父类，例如下面的代码：

```python
# 父类
class Person:
    # 类属性
    number = 0

    def __init__(self, name = "zhangsan", age = 19, money = 100):
        # 保护属性
        self._name = name
        self._age = age
        # 私有属性
        self.__money = money
        # 创建一次对象，类属性number加1
        Person.number += 1

    # getter方法
    def get_name(self):
        return self._name
    def get_age(self):
        return self._age

    # setter方法
    def set_name(self, name):
        self._name = name
    def set_age(self, age):
        self._age = age

    def say_hello(self):
        print(f'Hello, my name is {self._name}, I am No.{Person.number}')

    # 类方法
    @classmethod
    def get_number(cls):
        return cls.number

    # 静态方法
    @staticmethod
    def print_info():
        print("这是一个静态方法")

# 子类
class Teacher(Person):
    pass
```

在上面的代码中，创建了一个Teacher对象并继承自Person类

在Python中，默认情况下所有类继承自`object`，只是在继承自`object`类时可以省略不写，既然说`Teacher`类是`Person`类的子类，那么肯定有办法判断Teacher对象就是`Person`类的子类对象，这时就需要使用到`isinstance`函数：

```python
teacher = Teacher()
print(isinstance(teacher, Teacher)) # True
print(isinstance(teacher, Person)) # True
```

可以看到，`teacher`类对象根据`isinstance`函数的返回值可以判断出，其既是`Teacher`类的本类对象，也是`Person`类的子类对象，所以二者都返回`True`

除了使用`isinstance`以外，还可以使用`issubclass()`函数来判断类是否是某个类的子类：

```python
print(issubclass(Teacher, Person)) # True
```

既然是继承，就代表子类对象可以访问父类中所有的方法和属性，Python中的继承也不例外，但是对于私有属性和保护属性来说，尽管子类拥有，但是同样不推荐直接访问

除了拥有父类的属性和方法外，子类也可以定义自己的属性和方法或者重写父类的方法，如果子类需要访问父类的方法或者属性时，可以使用`super()`，例如下面的代码：

```python
class Teacher(Person):
    def __init__(self, name = "zhangsan", age = 19, money = 100, salary = 2000):
        # 调用父类的构造方法，初始化父类的属性
        super().__init__(name, age, money)
        # 初始化子类的属性
        self._salary = salary

    # 重写父类的方法
    def say_hello(self):
        print(f'Hello, my name is {self._name}, I am No.{Person.number}, I am a teacher')

    # 子类的方法
    def teach(self):
        print(f'{self._name} is teaching')
```

### 多态性

有了继承，就可以考虑实现多态，实现多态的前提条件如下：

1. 当前类继承另外一个类
2. 重写父类的方法
3. 父类引用指向子类对象

但是，由于Python中没有变量类型限制，所以多态性更多还是体现在传递参数上，例如下面的代码：

```python
class Dog:
    pass

# 多态性
def who_am_i(person):
    person.say_hello()

# 本类
person = Person()
# 子类
teacher = Teacher()
# 其他类
dog = Dog()

who_am_i(person) # Hello, my name is zhangsan, I am No.2
who_am_i(teacher) # Hello, my name is zhangsan, I am No.2, I am a teacher
who_am_i(dog) # AttributeError: 'Dog' object has no attribute 'say_hello'
```

如果`Dog`类中存在`say_hello()`方法，那么尽管函数中的`person.say_hello()`可以被调用，但是此时并不是多态，为了保证是多态，可以将函数改成：

```python
def who_am_i(person):
    if(isinstance(person, Person)):
        person.say_hello()
    else:
        print("不是Person类的对象或者子类的对象")
```

此时再执行上面的代码，结果就会不一样：

```python
# 本类
person = Person()
# 子类
teacher = Teacher()
# 其他类
dog = Dog()

who_am_i(person)
who_am_i(teacher)
who_am_i(dog)

输出结果：
Hello, my name is zhangsan, I am No.2
Hello, my name is zhangsan, I am No.2, I am a teacher
不是Person类的对象或者子类的对象
```

### 迭代器

前面多次提到可迭代对象，也对可迭代对象作了介绍，但是可能还是不清楚为什么可以实现`for`循环的那种遍历方式，实际上这就是因为迭代器的存在。回顾一下前面使用`for`循环遍历可迭代对象：

```python
for element in [1, 2, 3]:
    print(element)
for element in (1, 2, 3):
    print(element)
for key in {'one':1, 'two':2}:
    print(key)
for char in "123":
    print(char)
for line in open("myfile.txt"):
    print(line, end='')
```

在Python中，这种`for`的底层就是调用`iter()`函数，这个方法返回一个定义了`__next__()`方法的迭代器对象，这个方法将逐一访问容器中的元素，当遍历完最后一个元素时，`__next__()`将引发`StopIteration`异常来通知终止`for`循环

!!! note

    所谓可迭代对象就是实现了`__iter__()`魔法方法的对象，当调用`iter()`函数时，会转向调用对象的`__iter__()`方法，如果对象没有实现该方法会报错为`'type' object is not iterable`，如果对象实现了`__getitem__()`方法，Python会尝试创建一个迭代器来按索引访问元素

在Python中，可以通过`next()`内置函数，让该函数调用`__next__()`方法来了解其运作过程：

```python
li = [1,2,3,4,5]
it = iter(li)
print(next(it)) # 1
print(next(it)) # 2
print(next(it)) # 3
print(next(it)) # 4
print(next(it)) # 5
try:
    print(next(it)) # StopIteration
except StopIteration:
    print("迭代结束")

输出结果：
1
2
3
4
5
迭代结束
```

而使用`for`循环直接遍历可迭代对象就可以模拟为：

```python
err = 1
while(err):
    try:
        print(next(it))
    except StopIteration:
        err = 0

输出结果：
1
2
3
4
5
```

接下来，为了更细致的了解`__iter__()`方法和`__next__()`方法分别在做什么，就需要看看官方是如何对他们进行定义的：

!!! info "**`__iter__()`**"

    返回`iterator`对象本身。这是同时允许容器和迭代器配合`for`和`in`语句使用所必须的

!!! info "**`__next__()`**"

    `iterator`中返回下一项。 如果已经没有可返回的项，则会引发`StopIteration`异常

从上面的概念可以得知，`__iter__()`方法本质就是返回迭代器对象本身，也就是说，如果当前类是个迭代器类，那么就直接返回`self`即可，而对于`__next__()`方法来说，因为其返回的是`iterator`的下一项，也就是说获取到下一个内容

根据上面的概念，下面实现一个链表来详细描述这两个方法：

```python
# 单链表头结点
class LinkedListNode:
    def __init__(self, val):
        self.val = val
        self.next = None

# 单链表迭代器
class LinkedListNodeIterable:
    def __init__(self, node):
        self._node = node

    def __next__(self):
        if self._node is None:
            raise StopIteration
        cur = self._node
        self._node = self._node.next
        return cur

# 单链表
class LinkedList:
    def __init__(self, head:LinkedListNode = None):
        self._head = head

    # 插入元素
    def push_back(self, val):
        # 创建新节点
        new_node = LinkedListNode(val)
        # 如果头结点的下一个位置为空，链接到头结点的后方
        if self._head.next is None:
            self._head.next = new_node
            return None

        # 如果不为空，则链接到最后一个节点的下一个位置
        cur:LinkedListNode = self._head.next
        while cur.next is not None:
            cur = cur.next
        # 尾部插入新节点
        cur.next = new_node

    # 创建迭代器对象
    def __iter__(self):
        return LinkedListNodeIterable(self._head.next)
```

重点看上面代码中涉及到迭代器的部分：

```python
# 单链表迭代器类
class LinkedListNodeIterable:
    def __init__(self, node):
        self._node = node

    def __next__(self):
        if self._node is None:
            raise StopIteration
        cur = self._node
        self._node = self._node.next
        return cur

# 单链表类
class LinkedList:
    ...

    # 创建迭代器对象
    def __iter__(self):
        return LinkedListNodeIterable(self._head.next)
```

在单链表中，实现了`__iter__()`方法，将头结点的下一个节点作为第一个节点创建单链表迭代器对象，因为最后遍历的是单链表，所以单链表类一定要实现`__iter__()`方法，接着进入单链表迭代器类中，因为需要一个节点记录下一次需要走向的位置，所以在`__init__()`方法中传入了一个参数`node`，接着要使单链表能够正常向后遍历，就需要使用到`__next__()`方法用于获取到下一个节点，使用`cur`变量记录当前节点并作为返回值，返回之前更新`node`到下一个节点的位置，如果`node`变量变为`None`，说明走到了链表结尾，此时就触发`StopIteration`异常即可

上面的代码在下面的测试用例下是没有问题的：

```python
head = LinkedListNode(0)
linked_list = LinkedList(head)
linked_list.push_back(1)
linked_list.push_back(2)
linked_list.push_back(3)
linked_list.push_back(4)

for node in linked_list:
    print(node.val)

输出结果：
1
2
3
4
```

但是如果使用下面的测试用例，就会出现报错：

```python
head = LinkedListNode(0)
linked_list = LinkedList(head)
linked_list.push_back(1)
linked_list.push_back(2)
linked_list.push_back(3)
linked_list.push_back(4)
# 创建迭代器对象
lni = LinkedListNodeIterable(head.next)
it = iter(lni)
for node in it:
    print(node.val)

输出结果：
TypeError: 'LinkedListNodeIterable' object is not iterable
```

可以看到，提示`LinkedListNodeIterable`并不是一个可迭代对象，原因就是`LinkedListNodeIterable`没有实现`__iter__()`方法，而因为`LinkedListNodeIterable`本身就是迭代器类，所以对于`__iter__()`方法来说直接返回当前类对象`self`即可，即：

```python
class LinkedListNodeIterable:
    ...

    def __iter__(self):
        return self

    ...
```

再次测试即可得到正常遍历结果，此处不再演示

通过上面的例子，可以说明如果一个类想要是可迭代对象，就必须实现`__init__()`方法，而为了可以获取到下一个元素，就需要实现`__next__()`方法，至于这个方法是否需要实现到一个单独的迭代器类中就完全取决于每个人的习惯

### 生成器

前面在设计迭代器时，既需要实现`__iter__()`方法，也需要实现`__next__()`方法，为了简化这个过程，可以使用生成器辅助创建迭代器

Python中的生成器是一种特殊的迭代器，它允许程序员声明一个函数，该函数可以保存其状态并在多次调用之间保持这个状态。生成器是通过使用`yield`语句来实现的，而不是传统的`return`语句，即在一个函数体内使用`yield`表达式会使这个函数变成一个生成器函数

例如下面的代码：

```python
def simple_generator():
    yield 1
    yield 2
    yield 3

# 使用生成器
gen = simple_generator()
print(next(gen))  # 输出 1
print(next(gen))  # 输出 2
print(next(gen))  # 输出 3
# print(next(gen))  # 这里会抛出 StopIteration 异常
```

在这个例子中，`simple_generator`函数是一个生成器函数，每次调用`next()`都会从上次离开的地方继续执行，直到没有更多的`yield`语句为止

现在考虑使用生成器简化前面的链表迭代器的实现：

```python
# 单链表头结点
class LinkedListNode:
    def __init__(self, val):
        self.val = val
        self.next = None

# 单链表
class LinkedList:
    def __init__(self, head:LinkedListNode = None):
        self._head = head

    # 插入元素
    def push_back(self, val):
        # 创建新节点
        new_node = LinkedListNode(val)
        # 如果头结点的下一个位置为空，链接到头结点的后方
        if self._head.next is None:
            self._head.next = new_node
            return None

        # 如果不为空，则链接到最后一个节点的下一个位置
        cur:LinkedListNode = self._head.next
        while cur.next is not None:
            cur = cur.next
        # 尾部插入新节点
        cur.next = new_node

    # 创建迭代器对象
    # def __iter__(self):
    #     return LinkedListNodeIterable(self._head.next)

    # 生成器函数
    def genertor(self):
        cur = self._head.next
        while cur is not None:
            yield cur
            cur = cur.next
```

有了生成器函数`generator`就只需要用类对象调用这个生成器函数就可以创建一个可迭代对象，执行步骤如下：

1. 初始化：方法开始时，`cur`被设置为`_head.next`，即链表的第一个实际节点
2. 循环遍历：通过`while cur is not None:`循环，从第一个实际节点开始遍历整个链表
3. `yield`语句：每当遇到`yield cur`时，当前的`cur`节点被返回给调用者，并且生成器函数会暂停执行。这意味着每次调用`next()`或在`for`循环中迭代时都会得到下一个节点
4. 状态保存：生成器在每次`yield`后会保存其内部状态，包括`cur`变量的值。当下一次需要继续迭代时，它将从上次暂停的地方继续执行
5. 移动到下一个节点：在`yield`之后，`cur = cur.next`将指针移到下一个节点，准备下一次迭代