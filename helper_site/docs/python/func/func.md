<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Python函数

## 定义函数

在Python中，定义函数可以使用`def`关键字，基本格式如下：

```python
def 函数名(形参): 
    函数体
```

如果函数有返回值，则可以在函数体内使用`return`关键字将返回值返回

例如下面的代码：

```python
# 定义add函数实现两数之和
def add(a, b):
    return a + b

print(add(1, 2)) # 3
```

在上面的代码中，实参1传递给形参`a`，实参2传递给形参`b`，这种实参和形参一一对应时的形参也被称为位置参数

## 默认参数

默认参数即为缺省参数，与C++一样，Python允许指定形参变量是否有初始值，同样，在Python中，如果想使用默认参数也必须遵循从右向左使用默认参数的原则，除非使用Python中的关键字参数

例如下面的代码：

```python
# 参数默认值

def add(a, b=1, c=2):
    return a + b + c

ret = add(1)
```

但是与C++不同的是，Python中的默认参数可以使用变量作为初始值，这个默认参数的值只有在函数定义时计算，例如下面的代码：

```python
i = 10
def func(a = i):
    print(a)

i = 5
func()  # 10
```

在上面的代码中，尽管在函数后将`i`的值改变为5，但是在函数定义时，因为已经将10作为形参`a`的默认参数值，所以函数调用而不传递实参时`a`的值依旧还是10而不是5

需要注意的是，由于默认值只会在函数定义时计算，所以只会计算一次，如果形参的默认参数值是可变数据类型例如列表时，则后续修改默认参数（例如列表）都会生效，例如下面的代码：

```python
def func(a, L=[]):
    L.append(a)
    return L

print(func(1))  # [1]
print(func(2))  # [1, 2]
print(func(3))  # [1, 2, 3]
```

在上面的代码中，因为形式参数`L`的默认参数值为列表，并且因为只会计算一次默认值，所以`L`参数的值被固定为了一个空参列表，在函数体内对这个列表进行改变也会影响到这个默认值而不会出现多次调用都是空列表

为了防止出现上面的问题，可以考虑使用不可变类型作为参数的默认值或者使用`None`

## 可变类型和不可变类型

在Python中，数据类型可以分为**可变类型**（Mutable Types）和**不可变类型**（Immutable Types）。

**可变类型（Mutable Types）**：

- 表示对象的内容可以在创建后被修改
- 可以在原地改变对象的内容，而不需要创建新的对象
- 在函数内修改外部对象的内容会影响到外部对象
  
**不可变类型（Immutable Types）**：

- 表示对象的内容在创建后不能被修改
- 任何试图修改对象内容的操作都会创建一个新的对象，而不影响原始对象
- 在函数内修改外部对象的内容不会影响到外部对象

在Python中，有下面常见的可变类型：

1. **列表（`list`）**
2. **字典（`dict`）**
3. **集合（`set`）**
4. **字节数组（`bytearray`）**

例如下面的代码：

```python
# 创建一个列表
fruits = ["苹果", "香蕉", "樱桃"]

# 添加元素
fruits.append("橙子")
print(fruits)  # 输出: ['苹果', '香蕉', '樱桃', '橙子']

# 修改元素
fruits[1] = "蓝莓"
print(fruits)  # 输出: ['苹果', '蓝莓', '樱桃', '橙子']

# 删除元素
del fruits[2]
print(fruits)  # 输出: ['苹果', '蓝莓', '橙子']
```

在Python中，有下面几种不可变类型

1. **所有基本数据类型（整数、浮点数、布尔值和字符串）**
4. **元组（`tuple`）**
6. **范围对象（`range`）**
7. **冻结集合（`frozenset`）**

例如下面的代码：

```python
# 创建一个字符串
message = "Hello"

# 尝试修改字符会导致错误
# message[0] = "h"  # 抛出 TypeError: 'str' object does not support item assignment

# 创建一个新的字符串
new_message = "h" + message[1:]
print(new_message)  # 输出: "hello"

# 创建一个元组
coordinates = (10, 20, 30)

# 尝试修改元素会导致错误
# coordinates[1] = 25  # 抛出 TypeError: 'tuple' object does not support item assignment

# 创建一个新的元组
new_coordinates = coordinates + (40,)
print(new_coordinates)  # 输出: (10, 20, 30, 40)
```

**不可变类型和可变类型比较**

| 特性           | 可变类型（Mutable）           | 不可变类型（Immutable）          |
| -------------- | ----------------------------- | --------------------------------- |
| **修改内容**   | 可以直接修改、添加、删除元素   | 一旦创建后内容不能修改            |
| **常见类型**   | `list`，`dict`，`set`，`bytearray` | `int`，`float`，`str`，`tuple`，`bool`，`range`，`frozenset` |
| **内存分配**   | 动态分配，灵活                 | 固定分配，内存优化                 |
| **使用场景**   | 需要频繁修改数据时使用         | 数据不变或需要作为字典键、集合元素时使用 |
| **方法支持**   | 丰富的修改方法，如`append`、`remove` | 仅支持查询和访问方法               |
| **安全性**     | 较低，可能引入数据一致性问题   | 较高，数据更加稳定和安全           |

## 关键字参数

前面提到，默认参数只可以遵循从右往左的方式使用，为了更方便传递参数，可以考虑使用关键字参数

所谓关键字参数，就是指定函数形参的值，例如下面的代码：

```python
def func(a, b = 1, c = 2):
    return a + b + c

# 使用默认的位置参数指定a、b、c的值
print(func(1, 2, 3))  # 6
# 使用关键字参数指定c的值，b的值使用默认值
print(func(1, c = 3))  # 5
```

需要注意，关键字参数必须在位置参数后面，否则会编译报错，例如下面的代码：

```python
def func(a, b = 2, c = 2):
    return a + b + c

# 关键字参数先于位置参数，编译报错
# SyntaxError: positional argument follows keyword argument
print(func(a = 2, 2, 3))  # 5
```

## 可变参数

在Python中，有两种可变参数：

1. `*args`：用于接收多个参数，在函数内部会使用实参传递的多个参数形成一个元组
2. `**kwargs`：用于接收字典

!!! note

    如果传递的实参是一个序列对象，则需要使用`*`修饰该序列对象，如果传递的实现是一个字典，则需要使用`**`修饰该字典对象

例如下面的代码：

```python
# *args
def func(*args):
    for arg in args:
        print(arg, end=" ")

# 传入3个参数
func(1, 2, 3)  # 1 2 3
# 传入一个列表对象
li = [1, 2, 3]
func(*li)  # 1, 2, 3

# **kwargs
def func(**kwargs):
    for key, value in kwargs.items():
        print(key, value, end=" ")
    print()

# 传入3个键值对
func(name = "zhangsan", b = 2, c = 3)  # name zhangsan b 2 c 3
# 传入一个字典对象
dic = {"a": 1, "b": 2, "c": 3}
func(**dic)  # a 1 b 2 c 3
```

需要注意的是，如果可变参数与其它参数混合使用时，需要注意可变参数必须在最后，如果既需要使用`*args`又要使用`**kwargs`，那么建议的顺序是`*args`在前，`**kwargs`在后

## 回调函数和返回函数

在Python中，实现回调函数的方式和JavaScript一致，只需要在函数调用时传递一个函数即可，例如下面的代码：

```python
# 回调函数
def add(a, b):
    return a + b

def sub(a, b):
    return a - b

def calc(a, b, op):
    return op(a, b)

# 传入add函数，add函数就是回调函数
print(calc(1, 2, add))  # 3
# 传入sub函数，sub函数就是回调函数
print(calc(1, 2, sub))  # -1
```

同样，除了可以将函数作为函数参数传递，也可以将函数作为函数返回值返回，例如下面的代码：

```python
# 返回函数
def get_math_func(type):
    # 定义一个加法函数
    def add(a, b):
        return a + b

    # 定义一个减法函数
    def sub(a, b):
        return a - b

    # 返回加法函数
    if type == "add":
        return add
    # 返回减法函数
    else:
        return sub

# 调用get_math_func，返回一个函数
func = get_math_func("add")
# 调用返回的函数
print(func(1, 2))  # 3
```

## Python中的作用域

在Python中，**作用域**（Scope）指的是变量可以被访问的范围。理解作用域对于编写正确、高效的代码至关重要。Python采用**LEGB规则**来解析变量的作用域，这四个字母分别代表：

1. **L（Local）——局部作用域**
2. **G（Global）——全局作用域**
3. **E（Enclosing）——嵌套函数的外部作用域**
4. **B（Built-in）——内置作用域**

### 局部作用域（Local Scope）

**定义：**

局部作用域是指在函数或方法内部定义的作用域。函数内部定义的变量只能在函数内部访问

**示例：**

```python
def greet():
    message = "Hello, World!"  # 局部变量
    print(message)

greet()          # 输出: Hello, World!
print(message)   # 抛出 NameError: name 'message' is not defined
```

### 全局作用域（Global Scope）

**定义：**
全局作用域指的是在模块级别定义的变量，这些变量可以在模块的任何地方访问，包括函数内部。但在函数内部修改全局变量时，需要使用`global`关键字声明。

**示例：**

```python
counter = 10  # 全局变量

def increment():
    global counter # 修改全局变量
    counter += 1
    print(counter)

increment()  # 输出: 11
print(counter)  # 输出: 11
```

### 嵌套函数的外部作用域（Enclosing Scope）

**定义：**

当一个函数嵌套在另一个函数内部时，内层函数可以访问外层函数的变量，但是这种访问不会影响全局作用域。这种情况下，外层函数的作用域称为嵌套作用域

**示例：**

```python
def outer():
    outer_var = "I'm outside!"

    def inner():
        print(outer_var)  # 访问外层函数的变量

    inner()

outer()  # 输出: I'm outside!
```

如果内部的函数需要外层函数的变量，则可以使用`nonlocal`关键字用于声明变量来自外层（非全局）作用域，例如下面的代码：

```python
def outer():
    count = 0

    def inner():
        nonlocal count
        count += 1
        print(count)

    inner()  # 输出: 1
    print(count) # 输出: 1

outer()
```

### 内置作用域（Built-in Scope）

**定义：**

内置作用域包含Python解释器内置的名称，如`len()`、`range()`等。这些名称在任何地方都可以访问，内置作用域的名称在所有其他作用域之前被搜索

**示例：**

```python
print(len("Hello"))  # 输出: 5
```

## 闭包

在Python中，闭包是一种允许函数访问其外部作用域中变量的机制，即使这个外部函数已经执行完毕。闭包通常由一个内部函数和一个外部函数组成，其中内部函数会引用外部函数中的局部变量。当外部函数返回内部函数时，这些局部变量不会被垃圾回收，因为内部函数仍然持有对它们的引用

实现闭包一般需要满足下面的三个条件：

1. 嵌套函数：必须有一个内部函数（或称为嵌套函数），即一个定义在另一个函数内的函数。这个内部函数可以访问外部函数的局部变量
2. 非全局作用域的变量引用：内部函数必须引用至少一个在其外部作用域中定义的变量。这些变量不是全局变量，而是外部函数中的局部变量
3. 返回内部函数：外部函数必须返回其内部函数。这样，当外部函数执行完毕后，内部函数仍然能够通过闭包机制访问那些已经不在活动作用域中的变量

例如下面的代码：

```python
# 闭包
def outer():
    count = 0 # 非全局作用的变量（外部函数的变量）

    # 嵌套函数（内层函数）
    def inner():
        nonlocal count 
        count += 1 # 非全局作用域的变量引用
        return count

    return inner # 返回内层函数

# 调用outer函数，返回inner函数
func = outer()
# 调用inner函数
print(func())  # 1
```

注意，不可以在闭包的内层函数中返回循环变量，因为闭包捕获的是变量的引用，而不是变量的当前值。这意味着当闭包在以后执行时，它们访问的是变量的最终值，而不是创建闭包时的值

例如下面的代码：

```python
# 闭包示例
def create_funcs():
    funcs = []
    for i in range(3):
        def func():
            return i
        funcs.append(func)
    return funcs

functions = create_funcs()
for f in functions:
    print(f())  # 输出: 2, 2, 2
```

注意上面的代码结果并不是`0, 1, 2`，如果需要解决这个问题，可以通过默认参数解决，例如下面的代码：

```python
# 使用默认参数解决闭包问题
def create_funcs():
    funcs = []
    for i in range(3):
        def func(i=i):
            return i
        funcs.append(func)
    return funcs

functions = create_funcs()
for f in functions:
    print(f())  # 输出: 0, 1, 2
```

## Lambda表达式与相关使用

在Python中，可以按照下面的格式定义Lambda表达式（也称匿名函数）：

```python
lambda 形式参数: 函数体
```

需要注意，Python中的Lambda函数体不可以是复杂的表达式，比如循环等

例如下面的代码：

```python
# Lambda表达式
# 正常定义函数
def add(a, b = 1):
    return a + b

# 使用Lambda表达式定义函数
add_lambda = lambda a, b = 1: a + b

# 调用add函数
print(add(1))  # 2
# 调用add_lambda函数
print(add_lambda(1))  # 2
```

如果Lambda函数体中不需要使用参数，使用`_`来表示忽略它，这是Python社区推荐的写法，表示“这个参数我不关心，但语法上需要它”

在上面的例子中，Lambda表达式并没有发挥其比较实际的作用，下面结合三个高阶函数进行演示：

1. `map(回调函数, 可迭代对象)`：表示将回调函数中对元素的处理映射到可迭代对象中的每一个元素，该函数返回一个迭代器对象
2. `filter(回调函数, 可迭代对象)`：表示根据回调函数中的规则筛选出满足条件的可迭代对象中的每一个元素，该函数返回一个迭代器对象
3. `reduce(回调函数, 可迭代对象)`：表示根据回调函数中的规则对可迭代对象中的每个元素进行累积，该函数返回一个迭代器对象
4. `sorted(可迭代对象, 回调函数, 是否反向排序)`：表示可迭代对象根据指定的函数对其中的元素进行排序，默认是升序，可以通过第三个参数是否是`true`决定是否是降序，默认是`false`

例如下面的代码：

```python
# map函数
li = [1,2,3,4,5]
# 使用map函数计算每个元素的平方
result = map(lambda x: x * x, li)
# 转换为列表
print(list(result))  # [1, 4, 9, 16, 25]

# filter函数
li = [1,2,3,4,5]
# 使用filter函数过滤偶数
result = filter(lambda x: x % 2 == 0, li)
# 转换为列表
print(list(result))  # [2, 4]

# reduce函数
from functools import reduce
li = [1,2,3,4,5]
# 使用reduce函数计算所有元素的和
result = reduce(lambda x, y: x + y, li)
print(result)  # 15

# sorted函数
li = [36, 5, -12, 9, -21]
# 使用sorted函数对列表排序
result = sorted(li)
print(result)  # [-21, -12, 5, 9, 36]
# 按照元素的绝对值进行排序
result = sorted(li, key = lambda x: abs(x))
print(result)  # [5, 9, -12, -21, 36]
# 对字典元素进行排序——按照value排序
dic = {"a": 1, "c": 3, "b": 2}
result = sorted(dic, key = lambda x: dic[x])
print(result)  # ['a', 'b', 'c']
```

## 注解

在Python中，注解（Annotations），也称为类型提示或类型注释，是一种给函数参数和返回值添加元数据的方式。它们允许开发者指定预期的数据类型，但并不强制执行这些类型检查。类型注释的主要目的是提高代码的可读性和支持开发工具如IDE进行更智能的代码分析、自动补全等功能

在Python中，可以对下面的内容使用注解：

1. 函数参数注解：直接在参数名后加上冒号`:`，然后是类型
2. 返回值注解：使用`->`符号，接着写上返回值的类型
3. 变量注解：可以在变量声明时添加注解，例如`age: int = 20`

例如下面的代码：

```python
def add(a: int, b: int) -> int:
    return a + b

print(add(1, 2))  # 3
```

需要注意，类型注解在Python中主要用于静态类型检查工具（如mypy）进行类型检查，而不会在运行时强制执行类型限制，所以在上面的代码中，尽管使用注解说明了变量`a`、`b`和返回值都是`int`，但是依旧可以传递非整型的实参，例如下面的代码：

```python
def add(a: int, b: int) -> int:
    return a + b

print(add(1.2, 2)) # 3.2

def add(li : list[int]) -> None :
    for e in li:
        print(e, end=" ")

print([1,2,True, "hello"])  # [1, 2, True, 'hello']
```

## 装饰器

在Python中，因为函数也是一个对象，所以可以将函数赋值给一个变量再通过该变量进行调用，在前面返回函数已经演示过，本次不再演示。因为函数也是对象，所以函数也有自己的属性，在函数中有一个属性被称为`__name__`，这个属性可以获取到当前函数对象的函数名，例如下面的代码：

```python
def add(a, b):
    return a + b

# 获取add函数的名称
print(add.__name__)  # add
```

在Python中，装饰器是一种特殊类型的函数，它可以修改其他函数的功能或行为。装饰器本质上是一个接受一个函数作为参数的函数，并返回一个新的函数。装饰器提供了一种简洁的方式来扩展已有函数的功能，而无需修改其内部代码。这使得代码更加模块化和可重用

装饰器的基本语法是使用`@decorator_name`语法糖，放在被装饰函数定义之前，例如下面的代码：

```python
# 定义装饰器
def log(func):
    def toWrap(a, b):
        print("Something is happening before the function is called.")
        ret = func(a, b)
        print("Something is happening after the function is called.")

        return ret
    return toWrap

# 使用装饰器
@log
def add(a, b):
    print("加法运算")
    return a + b

print(add(1, 2)) 

输出结果：
Something is happening before the function is called.
加法运算
Something is happening after the function is called.
3
```

在上面的代码中，定义函数`log`就是定义一个装饰器，其接收一个参数，该参数代表修饰的函数（例如本例中的`add`），在`log`函数内部定义了一个函数`toWrap`，这个函数就是为`add`函数新添加功能的实际函数，其参数就是被修饰的函数的参数（例如本例中`add`函数的`a`和`b`），在`toWrap`内部就是新增功能，因为原`add`函数存在返回值，所以考虑接收`func`的返回值并返回，最后返回`toWrap`函数。在使用时，使用`@`使用注解，此时会默认将`add`函数作为实参传递给`log`函数，所以在调用`add(1, 2)`实际上就是在调用`toWrap(1, 2)`

如果需要创建一个有参数的装饰器，则需要再使用一个函数包裹，例如下面的代码：

```python
# 定义带参数的装饰器
def log(prefix = "RUN: "):
    def log_decorator(func):
        def toWrap(a, b):
            print(prefix + "Something is happening before the function is called.")
            ret = func(a, b)
            print(prefix + "Something is happening after the function is called.")

            return ret # toWrap函数返回
        return toWrap # log_decorator函数返回
    return log_decorator # log函数返回

# 使用装饰器
@log()
def add(a, b):
    print("加法运算")
    return a + b

print(add(1, 2))

输出结果：
RUN: Something is happening before the function is called.
加法运算
RUN: Something is happening after the function is called.
3
```

需要注意，如果装饰器有参数，则使用装饰器时一定要加上`()`，例如`@log()`

如果定义了多个装饰器，则装饰器是从内到外依次应用的，即靠近函数定义的装饰器先被应用，使用时就是自上而下使用，例如下面的代码：

```python
def decor1(func):
    def wrap1():
        print("Inside decor1")
        func()
    return wrap1

def decor2(func):
    def wrap2():
        print("Inside decor2")
        func()
    return wrap2

@decor1
@decor2
def hello():
    print("Hello World")

hello()

输出结果：
Inside decor1
Inside decor2
Hello World
```

在上面的代码中，`hello`函数先被`decor2`装饰，然后再被`decor1`装饰，因为`decor1`最后修饰，所以最先打印，接着就是`decor2`，最后就是`hello`函数
