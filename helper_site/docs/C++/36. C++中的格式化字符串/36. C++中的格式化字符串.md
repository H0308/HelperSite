# C++中的格式化字符串

## fmt库简介

`{fmt}`是一个开源的、现代化的C++格式化库，由Victor Zverovich创建。它提供了一种安全、快速且方便的字符串格式化方式，其设计理念受到了Python的`str.format()`的启发

### fmt库的主要特点

1. **易用性**：使用简洁的语法，基于花括号`{}`的占位符
2. **类型安全**：在编译时检查格式字符串和参数类型匹配
3. **高性能**：比标准库的`printf`和`iostream`更快
4. **可扩展**：支持自定义类型的格式化
5. **丰富的格式化选项**：对齐、填充、精度等控制

### Ubuntu下安装fmt库

使用下面的命令进行安装：

```bash
sudo apt install libfmt-dev
```

安装完成后，可以检查`fmt`库是否正确安装。例如，查看头文件是否存在：
```bash
ls /usr/include/fmt
```
如果目录存在且包含相关头文件，则说明安装成功

也可以通过下面的命令查看fmt库版本：

```bash
fmt --version
```

### 基本格式化

fmt库提供了简单直观的基本格式化功能，使用花括号`{}`作为参数占位符：

```cpp
#include <fmt/core.h>
#include <string>

int main() 
{
    int number = 42;
    double pi = 3.14159;
    std::string name = "C++";
    
    // 基本格式化
    std::string result = fmt::format("数字是 {}", number);
    // 结果: "数字是 42"
    
    // 多个参数按顺序替换，类似于printf
    std::string result2 = fmt::format("{} 的值约为 {}", name, pi);
    // 结果: "C++ 的值约为 3.14159"
    
    // 直接输出
    fmt::print("程序运行结果: {}\n", "成功");
    // 输出: "程序运行结果: 成功"
}
```

基本格式化遵循参数与占位符按位置一一对应的原则，简单易用且类型安全

### 带索引的参数

fmt库支持通过索引指定参数顺序，索引从0开始，可以重复使用同一参数：

```cpp
#include <fmt/core.h>
#include <string>

int main() 
{
    int x = 10;
    int y = 20;
    std::string language = "C++";
    
    // 使用索引指定参数
    std::string result = fmt::format("{0} + {1} = {2}", x, y, x + y);
    // 结果: "10 + 20 = 30"
    
    // 重复使用同一参数
    std::string result2 = fmt::format("{0}真是太强大了！我爱{0}！", language);
    // 结果: "C++真是太强大了！我爱C++！"
    
    // 改变参数顺序
    // 即0代表第一个参数，1代表第二个参数
    // 用下标位置代表替换位置
    std::string result3 = fmt::format("坐标：（{1}, {0}）", x, y);
    // 结果: "坐标：（20, 10）"
    
    // 混合使用索引和自动位置
    // 注意: 一旦使用了索引，所有占位符都应使用索引
    std::string result4 = fmt::format("{0}的值是{1}", "π", 3.14159);
    // 结果: "π的值是3.14159"
}
```

带索引的参数格式化使代码更灵活，特别是在需要重复使用某个参数或调整参数顺序时非常有用

### 格式说明符

#### 基本介绍

格式说明符让您可以控制数据的呈现方式，语法为`{[参数位置]:[格式说明]}`：

```cpp
#include <fmt/core.h>
#include <string>

int main() 
{
    int number = 42;
    double pi = 3.14159265359;
    
    // 数值进制表示
    std::string hex = fmt::format("十六进制: {:#x}", number);  // "十六进制: 0x2a"
    std::string oct = fmt::format("八进制: {:#o}", number);    // "八进制: 052"
    std::string bin = fmt::format("二进制: {:#b}", number);    // "二进制: 0b101010"
    
    // 浮点数精度
    std::string precise = fmt::format("π值保留两位小数: {:.2f}", pi);  // "π值保留两位小数: 3.14"
    std::string scientific = fmt::format("科学计数法: {:.2e}", pi);     // "科学计数法: 3.14e+00"
    
    // 宽度和对齐
    std::string right = fmt::format("右对齐:|{:10}|", "文本");     // "右对齐:|      文本|"
    std::string left = fmt::format("左对齐:|{:<10}|", "文本");     // "左对齐:|文本      |"
    std::string center = fmt::format("居中:|{:^10}|", "文本");     // "居中:|   文本   |"
    
    // 填充字符
    // 中文占两个字符，剩余11个字符用*填充，总共15个字符
    std::string fill = fmt::format("|{:*^15}|", "标题");          // "|*****标题******|"
    
    // 符号控制
    std::string always_sign = fmt::format("{:+d}", 42);           // "+42"
    std::string space_sign = fmt::format("{: d}", 42);            // " 42"
    
    // 千位分隔符
    std::string grouped = fmt::format("{:L}", 1000000);           // "1,000,000" (依赖地区设置)
    
    // 多种格式组合
    std::string combined = fmt::format("{:*^+10.2f}", 42.1234);   // "**+42.12**"
    
    return 0;
}
```

#### 常用格式说明符

格式说明符的完整语法是：`{[参数索引]:[填充字符][对齐][符号][#][0][宽度][.精度][类型]}`

- **填充和对齐**：

    - `<`：左对齐
    - `>`：右对齐（默认）
    - `^`：居中

- **符号**：

    - `+`：总是显示正负号
    - `-`：只对负数显示负号（默认）
    - 空格：正数前加空格，负数前加负号

- **类型**：

    - `d`：十进制整数
    - `x`/`X`：小写/大写十六进制
    - `o`：八进制
    - `b`/`B`：小写/大写二进制
    - `f`/`F`：固定小数点
    - `e`/`E`：科学计数法
    - `g`/`G`：通用格式（自动选择 f 或 e）
    - `s`：字符串

- **特殊标记**：

    - `#`：显示前缀（0x、0b 等）或小数点
    - `0`：用零填充数字

fmt库的格式说明符系统非常强大且灵活，可以满足各种复杂的字符串格式化需求

### fmt的高级特性

1. **自定义类型格式化**：

    ```cpp
    struct Point {
        int x, y;
    };

    template <> 
    struct fmt::formatter<Point> {
        constexpr auto parse(format_parse_context& ctx) { return ctx.begin(); }
        
        template <typename FormatContext>
        auto format(const Point& p, FormatContext& ctx) {
            return fmt::format_to(ctx.out(), "({}, {})", p.x, p.y);
        }
    };

    // 使用
    Point p{10, 20};
    fmt::print("点坐标： {}", p);  // 输出: 点坐标： (10, 20)
    ```

2. **颜色支持**：

    ```cpp
    #include <fmt/color.h>

    fmt::print(fg(fmt::color::red), "这段文字是红色的\n");
    fmt::print(bg(fmt::color::blue) | fg(fmt::color::white), "蓝底白字\n");
    ```

3. **格式化到容器或内存**：

    ```cpp
    std::vector<char> out;
    fmt::format_to(std::back_inserter(out), "Hello, {}!", "world");

    char buffer[100];
    auto result = fmt::format_to_n(buffer, 100, "The answer is {}.", 42);
    ```

## std::format（C++20）

`std::format`是C++20引入的标准库功能，其设计和API直接基于`{fmt}`库

### 基本用法

```cpp
#include <format>
#include <string>

int main()
{
    int answer = 42;
    std::string name = "C++";

    // 基本格式化
    std::string s = std::format("Hello, {}! The answer is {}", name, answer);

    // 带格式说明符
    std::string s2 = std::format("十进制: {0:d}, 十六进制: {0:#x}, 八进制: {0:#o}", answer);

    // 对齐和填充
    // Unicode编码，中文占3个字符
    std::string s3 = std::format("{:*^10}", "居中"); // **居中**

    return 0;
}
```

### 常用格式说明符

格式说明符的语法为：`{[参数位置]:[填充][对齐][符号][#][0][宽度][.精度][类型]}`

- **填充和对齐**：`<` (左对齐)，`>` (右对齐)，`^` (居中)

    ```cpp
    std::format("{:<10}", "左对齐");   // "左对齐 "
    std::format("{:>10}", "右对齐");   // " 右对齐"
    std::format("{:^10}", "居中");     // "  居中  "
    std::format("{:*^10}", "居中");    // "**居中**"
    ```

- **符号**：`+` (总是显示符号)，`-` (仅负数显示符号)，` ` (空格，正数前加空格)

    ```cpp
    std::format("{:+}", 42);    // "+42"
    std::format("{: }", 42);    // " 42"
    ```

- **数值格式**：

    ```cpp
    std::format("{:d}", 42);    // 十进制: "42"
    std::format("{:#x}", 42);   // 十六进制带前缀: "0x2a"
    std::format("{:.2f}", 3.14159); // 浮点数保留2位小数: "3.14"
    ```

## fmt与std::format的对比

### 相似点

1. **语法**：两者使用相同的基于`{}`的格式语法
2. **类型安全**：都在编译时进行类型检查
3. **API设计**：std::format直接基于fmt库设计

### 不同点

1. **可用性**：fmt可用于任何C++版本，而std::format需要C\+\+20
2. **功能集**：fmt提供更多高级功能（颜色、I/O 等）
3. **性能**：由于不同的实现，性能可能有细微差异
4. **命名空间**：fmt使用`fmt::`命名空间，标准库使用`std::`

### 代码兼容性示例

可以编写同时支持两种库的代码：

```cpp
#if __cplusplus >= 202002L && defined(__cpp_lib_format)
  #include <format>
  namespace fmt_ns = std;
#else
  #include <fmt/core.h>
  namespace fmt_ns = fmt;
#endif

std::string message = fmt_ns::format("值: {}", 42);
```

## 实际应用场景

1. **日志系统**：格式化各类日志消息
2. **用户界面**：生成格式化的显示文本
3. **配置文件生成**：创建具有特定格式的配置
4. **报告生成**：生成格式化的数据报告
5. **错误信息**：创建详细的错误描述