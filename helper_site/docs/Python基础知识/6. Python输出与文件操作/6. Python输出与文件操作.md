# Python输出与文件操作

## 复杂的输出格式控制

前面提到在Python中可以使用`print`函数进行格式化输出，常见的有三种方式：

1. 直接输出变量
2. 输出格式化字符串
3. 输出`f-string`

除了上述提到的方式以外，还可以使用字符串对象的方法`format()`进行格式化，例如下面的代码：

```python
yes_votes = 42_572_654
total_votes = 85_705_149
percentage = yes_votes / total_votes
print('{:-9} YES votes  {:2.2%}'.format(yes_votes, percentage))

输出结果：
 42572654 YES votes  49.67%
```

!!! note

    关于字符串的格式化操作可以参考[格式化字符串语法](https://docs.python.org/zh-cn/3/library/string.html#format-string-syntax)

## 格式化字符串字面值

在Python中，格式化字符串字面值也被称为`f-string`，前面简单介绍了`f-string`，下面再对一些其他内容进行讲解

`f-string`在字符串前加前缀`f`或`F`，通过`{expression}`表达式，把`Python表达式的值添加到字符串内

除了直接写`expression`以外，还可以添加格式说明符，例如下面的代码：

```python
import math
print(f'The value of pi is approximately {math.pi:.3f}.')

输出结果：
The value of pi is approximately 3.142.
```

上面的代码中，将数学模块中的`pi`值保留了3位小数并使用`f-string`进行打印

## 文件操作

### 打开文件

在Python中，需要进行文件操作先需要使用函数`open()`打开文件，`open`函数的原型如下：

```python
open(filename, mode, encoding=None)
```

其中：

1. 第一个参数代表需要打开的文件路径字符串
2. 第二个参数代表打开方式字符串，其值包括`'r'`，表示文件只能读取；`'w'`表示只能写入（现有同名文件会被覆盖，如果文件中有内容会先清空原文件的内容）；`'a'`表示打开文件并追加内容，任何写入的数据会自动添加到文件末尾。`'r+'`表示打开文件进行读写。默认情况下，这个参数的值为`'r'`
3. 第三个参数表示打开文件时的编码

!!! note

    根据官方文档对第三个参数的描述：通常情况下，文件是以文本模式打开的，也就是说，当从文件中读写字符串，这些字符串是以特定的`encoding`编码的。如果没有指定`encoding`，默认的是与平台有关的。因为`UTF-8`是现代事实上的标准，除非你知道你需要使用一个不同的编码，否则建议使用 `encoding="utf-8"`。在模式后面加上一个`'b'`，可以用二进制模式打开文件。二进制模式的数据是以`bytes`对象的形式读写的。需要注意，在二进制模式下打开文件时，不能指定第三个参数

!!! info "关于文件换行符"

    在文本模式下读取文件时，默认把平台特定的行结束符（Unix上为`\n`, Windows上为`\r\n`）转换为`\n`。在文本模式下写入数据时，默认把`\n`转换回平台特定结束符。这种操作方式在后台修改文件数据对文本文件来说没有问题，但会破坏JPEG或EXE等二进制文件中的数据。注意，在读写此类文件时，一定要使用二进制模式

基本使用如下：

```python
# 使用open打开文本文件
f = open("test.txt", "w")
# 使用open打开二进制文件
f1 = open("test.txt", "wb")
```

## 文件对象方法

在Python中，文件对象有下面几种常用的方法：

1. `read(size)`：用于读取文件中的内容，有一个`size`参数，当不传递实参（省略`size`）或者传递负数时，表示读取并返回整个文件的内容；当传递`size`是其他值时，则读取并返回最多`size`个字符（文本模式，注意还需要考虑换行符`\n`的个数）或`size`个字节（二进制模式）。方法返回字符串（文本模式）或字节串对象（在二进制模式下），如果读取到文件结尾，则返回空字符串`""`
2. `readline()`：用于从文件中读取一行内容，字符串末尾保留换行符`\n`，只有在文件不以换行符结尾时，文件的最后一行才会省略换行符。空行使用`\n`表示，该字符串只包含一个换行符。如果读取到文件结尾，则返回空字符串`""`
3. `write(string)`：把参数`string`的内容写入文件，并返回写入的字符数。如果需要写入其他内容，要先把它们转化为字符串（文本模式）或字节对象（二进制模式）
4. `tell()`：返回整数，给出文件对象（光标）在文件中的当前位置
5. `seek(offset, whence)`：可以改变文件对象的位置。通过向参考点`whence`添加`offset`计算位置，第二个参数有下面的取值：

    1. 0，表示从文件开头计算（默认值）
    2. 1，表示使用当前文件位置
    3. 2，表示使用文件末尾作为参考点

6. `close()`：关闭文件，注意如果不调用`close()`函数可能导致`write`函数写的内容没有从缓冲区到文件中

    !!! note

        在文本文件（模式字符串未使用`b`时打开的文件）中，只允许相对于文件开头搜索，唯一有效的`offset`值是能从`tell()`函数中返回的或者0。其他 `offset`值都会产生未定义的行为

例如下面的代码：

```python
# test.txt
Hello World
Hello World
Hello World

Hello World
Hello World

# test.py
# 打开文件
f = open("test.txt", "r")
# 读取文件
str1 = f.read(13)
print(str1)
# 关闭文件
f.close()

输出结果：
Hello World
H
```

使用上面的方法可以实现文件的复制操作：

```python
# 文件复制
f = open(r"C:\Users\18483\Music\conan-1.mp3", "rb")
f1 = open(r"conan-2.mp3", "wb")
for line in f:
    f1.write(line)
```

上面的`for`循环等价于下面的`while`循环：

```python
while True:
    line = f.readline()
    if not line:
        break
    f1.write(line)
```

## `with`打开文件

与Java中的`trywith-resources`的特性类似，Python中也提供了管理资源的优雅方式：`with`语句。它确保了即使在代码块执行过程中发生异常，相关的清理工作（比如关闭文件）也会被正确执行。这种方式通常被称为“上下文管理器”，因为`with`语句创建了一个执行上下文，在这个上下文中自动处理资源的设置和清理

使用`with`打开文件的方式如下：

```python
with open('filename', 'mode') as file:
    # 在这里执行文件操作
```

例如下面的代码：

```python
# test.txt
Hello Python

# test.py
with open('test.txt', 'r') as f:
    for l in f:
        print(l)
```
