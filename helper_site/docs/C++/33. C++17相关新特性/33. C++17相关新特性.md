# C++17相关新特性

## filesystem库

### 概述

C\+\+17引入的[`filesystem`库](https://en.cppreference.com/w/cpp/filesystem)提供了跨平台的文件系统操作功能，使开发者能够以统一的方式处理路径、文件和目录操作，而不必担心不同操作系统间的差异。这个库最初源自`Boost.Filesystem`，现已成为C++标准的一部分

下面是基于官方文档对`filesystem`的介绍：

**Classes：**

定义在头文件`<filesystem>`，定义在命名空间`std::filesystem`：

| 类名                                     | 描述                           | 类型    |
| ---------------------------------------- | ------------------------------ | ------- |
| **path** (C++17)                         | 表示一个路径                   | class   |
| **filesystem_error** (C++17)             | 文件系统错误时抛出的异常       | class   |
| **directory_entry** (C++17)              | 一个目录项                     | class   |
| **directory_iterator** (C++17)           | 目录内容的迭代器               | class   |
| **recursive_directory_iterator** (C++17) | 目录及其子目录内容的迭代器     | class   |
| **file_status** (C++17)                  | 表示文件类型和权限             | class   |
| **space_info** (C++17)                   | 文件系统上可用和空闲空间的信息 | class   |
| **file_type** (C++17)                    | 文件的类型                     | enum    |
| **perms** (C++17)                        | 标识文件系统权限               | enum    |
| **perm_options** (C++17)                 | 指定权限操作的语义             | enum    |
| **copy_options** (C++17)                 | 指定复制操作的语义             | enum    |
| **directory_options** (C++17)            | 遍历目录内容的选项             | enum    |
| **file_time_type** (C++17)               | 表示文件时间值                 | typedef |

**非成员函数：**

定义在头文件`<filesystem>`，定义在命名空间`std::filesystem`

| 函数名                               | 描述                                   | 类型     |
| ------------------------------------ | -------------------------------------- | -------- |
| **absolute** (C++17)                 | 组合成一个绝对路径                     | function |
| **canonical** (C++17)                | 组合成一个规范路径                     | function |
| **weakly_canonical** (C++17)         | 组合成一个弱规范路径                   | function |
| **relative** (C++17)                 | 组合成一个相对路径                     | function |
| **proximate** (C++17)                | 组合成一个邻近路径                     | function |
| **copy** (C++17)                     | 复制文件或目录                         | function |
| **copy_file** (C++17)                | 复制文件内容                           | function |
| **copy_symlink** (C++17)             | 复制符号链接                           | function |
| **create_directory** (C++17)         | 创建新目录                             | function |
| **create_directories** (C++17)       | 创建多级目录                           | function |
| **create_hard_link** (C++17)         | 创建硬链接                             | function |
| **create_symlink** (C++17)           | 创建符号链接                           | function |
| **create_directory_symlink** (C++17) | 创建目录符号链接                       | function |
| **current_path** (C++17)             | 返回或设置当前工作目录                 | function |
| **exists** (C++17)                   | 检查路径是否引用现有的文件系统对象     | function |
| **equivalent** (C++17)               | 检查两个路径是否引用相同的文件系统对象 | function |
| **file_size** (C++17)                | 返回文件大小                           | function |
| **hard_link_count** (C++17)          | 返回指向特定文件的硬链接数量           | function |
| **last_write_time** (C++17)          | 获取或设置最后一次数据修改的时间       | function |
| **permissions** (C++17)              | 修改文件访问权限                       | function |
| **read_symlink** (C++17)             | 获取符号链接的目标                     | function |
| **remove** (C++17)                   | 移除文件或空目录                       | function |
| **remove_all** (C++17)               | 递归地移除文件或目录及其所有内容       | function |
| **rename** (C++17)                   | 移动或重命名文件或目录                 | function |
| **resize_file** (C++17)              | 通过截断或零填充更改常规文件的大小     | function |
| **space** (C++17)                    | 确定文件系统上的可用空闲空间           | function |
| **status** (C++17)                   | 确定文件属性                           | function |
| **symlink_status** (C++17)           | 确定文件属性，检查符号链接目标         | function |
| **temp_directory_path** (C++17)      | 返回一个适合临时文件的目录             | function |

**文件类型：**

| 函数名                        | 描述                             | 类型     |
| ----------------------------- | -------------------------------- | -------- |
| **is_block_file** (C++17)     | 检查给定路径是否引用块设备       | function |
| **is_character_file** (C++17) | 检查给定路径是否引用字符设备     | function |
| **is_directory** (C++17)      | 检查给定路径是否引用目录         | function |
| **is_empty** (C++17)          | 检查给定路径是否引用空文件或目录 | function |
| **is_fifo** (C++17)           | 检查给定路径是否引用命名管道     | function |
| **is_other** (C++17)          | 检查参数是否引用其他类型的文件   | function |
| **is_regular_file** (C++17)   | 检查参数是否引用常规文件         | function |
| **is_socket** (C++17)         | 检查参数是否引用命名 IPC 套接字  | function |
| **is_symlink** (C++17)        | 检查参数是否引用符号链接         | function |
| **status_known** (C++17)      | 检查文件状态是否已知             | function |

### 包含方式

```cpp
#include <filesystem>
namespace fs = std::filesystem; // 常用的命名空间别名
```

### 核心组件

#### 路径类 (path)

`std::filesystem::path`是该库的核心类，用于表示文件系统路径：

```cpp
// 直接使用string进行构造
fs::path p1 = "C:/Users/Documents/file.txt";  // Windows路径
fs::path p2 = "/home/user/documents/file.txt"; // Unix路径
```

**主要特性**：

- 自动处理不同平台的路径分隔符
- 提供路径组合、分解和规范化功能
- 支持Unicode

**常用操作**：
```cpp
fs::path p = "/home/user/documents/file.txt";

p.filename();    // "file.txt"
p.extension();   // ".txt"
p.stem();        // "file"
p.parent_path(); // "/home/user/documents"
p.root_name();   // 返回根名称
p.is_absolute(); // 是否是绝对路径
p.is_relative(); // 是否是相对路径
p.string(); // 返回当前路径字符串"/home/user/documents/file.txt"
```

**路径连接**：
```cpp
fs::path dir = "/home/user";
fs::path full = dir / "documents" / "file.txt"; // 使用/操作符连接路径
```

#### 文件状态和属性

```cpp
fs::file_status status = fs::status(path);
bool isDir = fs::is_directory(path);
bool isFile = fs::is_regular_file(path);
bool exists = fs::exists(path);
uintmax_t size = fs::file_size(path);
fs::file_time_type time = fs::last_write_time(path);
```

#### 文件和目录操作

**创建目录**：
```cpp
fs::create_directory(path);
fs::create_directories(path); // 创建多级目录
```

**复制、移动和删除**：
```cpp
fs::copy(from, to, fs::copy_options::recursive);
fs::rename(from, to);
fs::remove(path);
fs::remove_all(path); // 递归删除
```

**目录遍历**：

目录遍历使用两种迭代器，分别是只遍历当前目录的`directory_iterator`和遍历当前位置开始的所有目录的`recursive_directory_iterator`，`directory_iterator`和`recursive_directory_iterator`返回的都是`directory_entry`对象，调用`directory_entry`类中的`path`方法可以获取到`path`类对象：

```cpp
// 遍历单个目录
for (const auto& entry : fs::directory_iterator(path)) 
{
    // 显式将entry转换为path对象
    std::cout << entry.path() << std::endl;
}

// 递归遍历目录
for (const auto& entry : fs::recursive_directory_iterator(path)) 
{
    // 显式将entry转换为path对象
    std::cout << entry.path() << std::endl;
}
```

另外，`directory_entry`还提供了`operator const std::filesystem::path& () const noexcept;`，意味着这个类的对象都可以隐式类型转换为`path`类对象，例如前面判断文件类型的函数`is_regular_file`就可以直接传递`directory_entry`类对象：

```cpp
// 遍历单个目录
for (const auto& entry : fs::directory_iterator(path)) 
{
    if(fs:is_regular_file(entry))
    {
        // 判断是否是普通文件
    }
}

// 递归遍历目录
for (const auto& entry : fs::recursive_directory_iterator(path)) 
{
    if(fs:is_regular_file(entry))
    {
        // 判断是否是普通文件
    }
}
```

`directory_entry`可以理解为一个目录中的一个条目（例如可以是普通文件、目录、符号链接等），这个类的对象保存了当前路径，因为是目录所以其中还有一些有关当前面目录中的文件信息，所以这个类还提供了判断文件类型的函数：

```cpp
// entry是一个directory_entry对象
// 例如is_regular_file
entry.is_regular_file();
entry.is_directory();
```

### 实用功能

#### 空间查询

```cpp
fs::space_info info = fs::space("/home");
std::cout << "可用空间: " << info.available << " 字节\n";
std::cout << "总空间: " << info.capacity << " 字节\n";
std::cout << "空闲空间: " << info.free << " 字节\n";
```

#### 当前路径操作

```cpp
fs::path current = fs::current_path(); // 获取当前工作目录
fs::current_path(newPath); // 修改当前工作目录
```

### 返回当前路径字符串操作

```cpp
std::string path_str = current.string();
```

#### 临时目录

```cpp
fs::path temp = fs::temp_directory_path(); // 获取临时目录
```

### 完整示例

```cpp
#include <iostream>
#include <filesystem>
namespace fs = std::filesystem;

int main() 
{
    // 创建目录
    fs::path dir = "example_directory";
    fs::create_directory(dir);
    
    // 创建文件
    std::ofstream(dir / "file1.txt") << "Hello, filesystem!";
    std::ofstream(dir / "file2.txt") << "Another file";
    
    // 创建子目录
    fs::create_directory(dir / "subdir");
    
    // 递归遍历并显示所有条目
    std::cout << "目录内容:\n";
    for (const auto& entry : fs::recursive_directory_iterator(dir)) 
    {
        std::cout << entry.path() << " - ";
        if (fs::is_regular_file(entry.path()))
            std::cout << fs::file_size(entry.path()) << " 字节";
        else if (fs::is_directory(entry.path())) 
            std::cout << "目录";
        std::cout << std::endl;
    }
    
    // 复制文件
    fs::copy(dir / "file1.txt", dir / "file1_copy.txt");
    
    // 删除整个目录
    fs::remove_all(dir);
    
    std::cout << "操作完成" << std::endl;

    
    return 0;
}
```

## string_view库

### 概述

C++17引入的`std::string_view`是一个轻量级的、非拥有型（non-owning）的字符串引用类型，它提供了一个只读视图，指向已经存在的字符序列（如字符数组、`std::string`等）。`string_view`定义在`<string_view>`头文件中，属于`std`命名空间

### 本质

#### 核心实现结构

`std::string_view` 本质上是对字符串的**轻量级引用视图**，其内部实现极其简单，通常只包含两个成员变量：

```cpp
class string_view 
{
private:
    const char* _data;   // 指向字符序列的指针
    size_t _size;        // 序列的长度
};
```

#### 基本特征

1. **指针语义**：

      - 本质上是一个"智能指针+长度"的组合
      - 不会复制字符串内容，只维护引用关系
      - 可以理解为对C风格字符串概念的现代化改进

2. **轻量级结构**：

      - 通常只占16字节内存（一个指针和一个`size_t`）
      - 拷贝和传递成本极低，等同于传递两个基本类型值

3. **视图特性**：

      - 只提供观察窗口，不拥有底层数据
      - 视图可调整（`remove_prefix`/`remove_suffix`），但底层数据不变
      - 不保证字符串以`\0`结尾

#### 与C字符串的对比

传统C字符串有两种表示方式：

- `char*`（需要手动管理内存，依赖`\0`结尾）
- `char[]`（大小固定，无法动态调整）

而`string_view`结合了两者优点：

- 不需要尾部结束符
- 知道确切长度
- 可以引用任何字符序列的子串（无需复制）

!!! note "`string_view`的设计哲学"

    `string_view`体现了现代C\+\+的一个核心设计理念：**分离所有权和视图**。当只需要读取访问时，借用视图比拥有副本更有效率

### 设计目的

`string_view`的主要设计目的是提高字符串处理的性能，特别适用于以下场景：

- 函数参数中需要接受各种形式的字符串（如C风格字符串、`std::string`等）
- 需要处理字符串子串而不希望产生内存分配
- 只需要读取而不需要修改字符串内容的场景

### 主要特性

- **零拷贝**：不会复制原始字符串数据
- **轻量级**：只保存指针和长度（通常为16字节）
- **只读接口**：不能修改底层字符串内容
- **跨平台兼容**：支持各种字符类型

### 基本用法

#### 创建string_view

```cpp
#include <string_view>
#include <iostream>
#include <string>

int main() 
{
    // 从字符串字面量创建
    std::string_view sv1 = "Hello, string_view!";
    
    // 从std::string创建
    std::string str = "Hello, string!";
    std::string_view sv2 = str;
    
    // 从字符数组创建
    char arr[] = {'H', 'e', 'l', 'l', 'o'};
    std::string_view sv3(arr, 5);  // 必须指定长度
    
    std::cout << "sv1: " << sv1 << std::endl;
    std::cout << "sv2: " << sv2 << std::endl;
    std::cout << "sv3: " << sv3 << std::endl;
    
    return 0;
}
```

#### 常用操作

```cpp
#include <string_view>
#include <iostream>

int main() 
{
    std::string_view sv = "Hello, string_view world!";
    
    // 基本属性
    std::cout << "长度: " << sv.size() << std::endl;  // 或 sv.length()
    std::cout << "是否为空: " << (sv.empty() ? "是" : "否") << std::endl;
    
    // 访问元素
    std::cout << "首字符: " << sv[0] << std::endl;
    std::cout << "末字符: " << sv.back() << std::endl;
    
    // 子串操作（不产生新内存分配）
    std::string_view sv_sub = sv.substr(7, 11);  // "string_view"
    std::cout << "子串: " << sv_sub << std::endl;
    
    // 查找操作
    size_t pos = sv.find("world");
    if (pos != std::string_view::npos) 
        std::cout << "'world'在位置: " << pos << std::endl;
    
    // 移除前缀和后缀
    std::string_view sv2 = sv;
    sv2.remove_prefix(7);  // 移除"Hello, "
    std::cout << "移除前缀后: " << sv2 << std::endl;
    
    sv2.remove_suffix(7);  // 移除" world!"
    std::cout << "移除后缀后: " << sv2 << std::endl;
    
    return 0;
}
```

### 性能优势

`string_view`相比`std::string`的主要优势在于避免了不必要的内存分配和复制操作。下面是一个性能对比示例：

```cpp
#include <string>
#include <string_view>
#include <iostream>
#include <chrono>

int main() 
{
    const int iterations = 1000000;
    std::string str = "这是一个测试字符串，用于演示string_view和string的性能差异";
    
    // 测试std::string
    auto start1 = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < iterations; ++i) 
        std::string substring = str.substr(5, 10);  // 创建新字符串，分配内存

    auto end1 = std::chrono::high_resolution_clock::now();
    
    // 测试std::string_view
    auto start2 = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < iterations; ++i) 
        std::string_view substring = std::string_view(str).substr(5, 10);  // 无内存分配

auto end2 = std::chrono::high_resolution_clock::now();
    
    auto duration1 = std::chrono::duration_cast<std::chrono::milliseconds>(end1 - start1).count();
    auto duration2 = std::chrono::duration_cast<std::chrono::milliseconds>(end2 - start2).count();
    
    std::cout << "std::string 耗时: " << duration1 << " 毫秒" << std::endl;
    std::cout << "std::string_view 耗时: " << duration2 << " 毫秒" << std::endl;
    std::cout << "性能提升: " << (float)duration1 / duration2 << "倍" << std::endl;
    
    return 0;
}
```

### 注意事项和最佳实践

#### 生命周期问题

`string_view`不拥有数据，所以必须确保它引用的字符串在使用期间保持有效：

```cpp
std::string_view get_dangerous_view() 
{
    std::string local_str = "临时字符串";
    return local_str;  // 危险！返回了引用临时对象的视图
}  // local_str被销毁，string_view变为无效

void safer_usage() 
{
    std::string stored_str = "安全的字符串";
    std::string_view sv = stored_str;  // 安全，只要stored_str存在
    // 使用sv...
}
```

#### 与C风格API的交互

`string_view`不保证以`'\0'`结尾，所以不能直接用于C风格API：

```cpp
std::string_view sv = "Hello";
sv.remove_suffix(2);  // 现在sv指向"Hel"

// 错误用法
printf("%s", sv.data());  // 可能不以'\0'结尾！

// 正确用法
std::string temp(sv);  // 转换为std::string
printf("%s", temp.c_str());
```

需要注意，尽管`data`函数返回的是`const char*`，但是这个返回结果可能不包含`\0`，也就是说`Hello`可能并不是`Hello\0`，这就可能造成使用`%s`无法找到结尾的位置

#### 适合传递参数，不适合返回值

```cpp
// 好的用法 - 参数使用string_view
void process_data(std::string_view data) 
{
    // 处理数据...
}

// 避免的用法 - 返回string_view
std::string_view get_data() 
{
    static std::string data = "持久数据";  // 必须确保数据比view生命周期长
    return data;
}
```

需要注意，如果一个函数的返回值为string类型，并且需要将局部的`string_view`成员返回，一定要先构造出string对象才能返回，因为string_view不允许隐式类型构造为一个string，例如：

```cpp
std::string get_data(std::string_view data) 
{
    return data; // 错误，不允许隐式构造为string
}

std::string get_data(std::string_view data) 
{
    return std::string(data); // 正确
}
```

## 通用类型`any`

### 标准库中`any`的介绍

在C++中，定义一个变量需要指定该变量的具体类型，如果不确定类型，但是又需要这个变量，就可以使用`any`类型，基本使用如下：

```cpp
#include <any>

int main()
{
    std::any a = 10;
    // 转换为指定类型的数据
    int b = std::any_cast<int>(a);
    std::cout << b << std::endl;

    a = "hello world";
    std::string s = std::any_cast<std::string>(a);
    std::cout << s << std::endl;

    return 0;
}
```

关于`any`类型更多的用法参考[官方文档](https://en.cppreference.com/w/cpp/utility/any.html)

### `any`的实现原理

要实现任意类型，那么少不了的就是用到模版，如果直接写成模版，那么就是下面的写法：

```cpp
template<class T>
class Any
{

};
```

但是这种写法存在一个问题，因为所谓的任意类型，实际上在创建对象时就无法确定具体类型，而使用模板就意味着定义对象时需要指定类型，这一做法与设计这个类的初衷就是不一致的。基于**创建对象时就无法确定具体类型**这个问题，那么`Any`类就不应该使用模版，但是为了存储任意类型，那么就需要在类内创建一个模版类，如下：

```cpp
class Any
{

private:
    template <class T>
    class PlaceHolder
    {
    
    };
};
```

但是上面的写法还有一个问题，既然`PlaceHolder`是一个模版类，那么在创建对象时需要指定具体类型，也就是说，在`Any`类就需要存在下面的成员：

```cpp
PlaceHolder<T> _holder;
```

但是，类成员要使用模板，那么为了确定类型，类同样需要使用到模板，现在又回到了最开始的问题，`Any`类不能为模板类，此时可以考虑使用多态来解决，即让`PlaceHolder`这个模版类继承自一个基类，然后让`Any`类的成员为基类的指针，这样就可以实现任意类型的存储，如下：

```cpp
class Any
{
private:
    class Holder
    {
    public:

    };

    template <class T>
    class PlaceHolder : public Holder
    {
       
    };

    Holder *content_; // Any类保存的数据
};
```

在父类的`Holder`中，需要提供一系列纯虚函数，本次提供下面的函数：

```cpp
class Holder
{
public:
    virtual ~Holder() = default;
    // 获取保存内容的类型
    virtual const std::type_info &getType() = 0;
    // 克隆当前对象，用于拷贝构造和赋值
    virtual Holder *clone() = 0;
};
```

接着，子类中实现这些函数，并提供对应的构造函数：

```cpp
template <class T>
class PlaceHolder : public Holder
{
public:
    PlaceHolder(const T &val)
        : val_(val)
    {
    }

    // 获取数据类型
    virtual const std::type_info &getType() override
    {
        return typeid(val_);
    }

    // 根据具体值构造一个新的父类对象
    virtual Holder *clone() override
    {
        return new PlaceHolder(val_);
    }

    T val_;
};
```

接着，在`Any`类中，分别实现下面的函数：

=== "无参构造"

    ```cpp
    // 无参构造
    Any()
        : content_(nullptr)
    {
    }
    ```

=== "基于值的构造"

    ```cpp
    // 指定类型数据
    template <class T>
    Any(const T &val)
        : content_(new PlaceHolder(val))
    {
    }
    ```

=== "基于当前类对象的拷贝构造"

    ```cpp
    // 拷贝构造
    // 注意，不能直接通过外部的Any对象content_构造当前的content_
    // 此时可能会产生野指针问题
    Any(const Any &other)
        : content_(!other.content_ ? nullptr : other.content_->clone())
    {
    }
    ```

=== "移动构造"

    ```cpp
    // 移动构造
    Any(Any &&other)
    {
        swap(other);
    }
    ```

=== "基于值的赋值重载"

    ```cpp
    // 重载赋值运算符——针对具体数据
    template <class T>
    Any &operator=(const T &val)
    {
        // 构造一个匿名对象，直接调用交换函数
        // 此时外部对象就会与临时对象进行数据交换，交换完成后匿名对象会销毁
        Any(val).swap(*this);
        return *this;
    }
    ```

=== "基于当前类对象的赋值"

    ```cpp
    // 重载赋值运算符——针对当前类对象
    Any &operator=(const Any &other)
    {
        Any(other).swap(*this);
        return *this;
    }
    ```

=== "基于当前类对象的移动赋值"

    ```cpp
    // 移动赋值
    Any &operator=(Any &&other)
    {
        Any(std::move(other)).swap(*this);
        return *this;
    }
    ```

=== "析构函数"

    ```cpp
    ~Any()
    {
        delete content_;
    }
    ```

=== "获取保存的内容"

    ```cpp
    // 获取数值
    template <class T>
    T *getVal()
    {
        assert(typeid(T) == content_->getType());
        // 转换为子类对象访问其中的成员
        return &(dynamic_cast<PlaceHolder<T> *>(content_)->val_);
    }
    ```

=== "交换函数"

    ```cpp
    Any &swap(Any &other)
    {
        std::swap(content_, other.content_);
        return *this;
    }
    ```

测试代码如下：

```cpp
class Test
{
public:
    Test() { std::cout << "构造" << std::endl; }
    Test(const Test &t) { std::cout << "拷贝" << std::endl; }
    ~Test() { std::cout << "析构" << std::endl; }
};
int main()
{

    my_any::Any a;
    {
        Test t;
        a = t;
    }

    a = 10;
    int *pa = a.getVal<int>();
    std::cout << *pa << std::endl;
    a = std::string("nihao");
    std::string *ps = a.getVal<std::string>();
    std::cout << *ps << std::endl;

    while (1)
        sleep(1);
    return 0;
}

输出结果：
构造
拷贝
析构
析构
10
nihao
```