# 关于JSONCPP库

## 介绍

Jsoncpp是一个用于处理JSON数据的C\+\+库。它提供了将JSON数据序列化为字符串以及从字符串反序列化为C\+\+数据结构的功能。Jsoncpp是开源的，广泛用于各种需要处理JSON数据的C++项目中。其有如下的特性：

1. 简单易用：Jsoncpp提供了直观的API,使得处理JSON数据变得简单
2. 高性能：Jsoncpp的性能经过优化，能够高效地处理大量JSON数据
3. 全面支持：支持JSON标准中的所有数据类型，包括对象、数组、字符串、数字、布尔值和`null`
4. 错误处理：在解析JSON数据时，Jsoncpp提供了详细的错误信息和位置，方便开发者调试。当使用Jsoncpp库进行JSON的序列化和反序列化时，确实存在不同的做法和工具类可供选择

以下是对Jsoncpp中序列化和反序列化操作的详细介绍

## 安装

在Ubuntu中，执行下面的命令进行安装：

```shell
sudo apt-get install libjsoncpp-dev
```

在CentOS中，执行下面的命令进行安装：

```shell
sudo yum install jsoncpp-devel
```

## 什么是`Json::Value`

`Json::Value`是Jsoncpp库中的一个重要类，用于表示和操作JSON数据结构。以下是一些常用的`Json::Value`操作列表：
 
### 构造函数
1. `Json::Value()`：默认构造函数，创建一个空的`Json::Value`对象
2. `Json::Value(ValueType type,bool allocated=false)`：根据给定的`ValueType`（如`nullValue`，`intValue`，`stringValue`等）创建一个`Json:Value`对象

### 访问元素
1. 访问元素`Json::Value&operator[](const chari*key)`：通过键（字符串）访问对象中的元素。如果键不存在，则创建一个新的元素
2. `Json:Value&operator[](const std:string&key)`：同上，但使用`std:string`类型的键
3. `Json::Value&operator[](ArrayIndex index)`：通过索引访问数组中的元素。如果索引超出范围，则创建一个新的元素
4. `Json::Value&at(const char*key)`：通过键访问对象中的元素，如果键不存在则抛出异常
5. `Json::Value&at(const std::string&key)`：同上，但使用`std::string`类型的键

### 类型检查

1. `bool isNull()`：检查值是否为`null`
2. `bool isBool()`：检查值是否为布尔类型
3. `bool isInt()`：检查值是否为整数类型
4. `bool isInt64()`：检查值是否为64位整数类型
5. `bool isUInt()`：检查值是否为无符号整数类型
6. `bool isUInt64()`：检查值是否为64位无符号整数类型
7. `bool isIntegral()`：检查值是否为整数或可转换为整数的浮点数
8. `bool isDouble()`：检查值是否为双精度浮点数
9. `bool isNumeric()`：检查值是否为数字（整数或浮点数）
10. `bool isString()`：检查值是否为字符串
11. `bool isArray()`：检查值是否为数组
12. `bool isObject()`：检查值是否为对象（即键值对的集合）

### 赋值和类型转换

1. `Json::Value&operator=(bool value)`：将布尔值赋给`Json::Value`对象
2. `Json::Value&operator=(int value)`：将整数赋给`Json::Value`对象
3. `Json::Value&operator=(unsigned int value)`：将无符号整数赋给`Json::Value`对象
4. `Json::Value&operator=(Int64 value)`：将64位整数赋给`Json::Value`对象
5. `Json::Value&operator=(UInt64 value)`：将64位无符号整数赋给`Json::Value`对象
6. `Json::Value&operator=(double value)`：将双精度浮点数赋给`Json::Value`对象
7. `Json::Value&operator=(const char* value)`：将C语言形式的字符串赋给`Json::Value`对象
8. `Json::Value&operator=(const std::string& value)`：将`std::string`赋给`Json::Value`对象
9. `bool asBool()`：将值转换为布尔类型（如果可能）
10. `int asInt()`：将值转换为整数类型（如果可能）
11. `Int64 asInt64()`：将值转换为64位整数类型（如果可能）
12. `unsigned int asUInt()`：将值转换为无符号整数类型（如果可能）
13. `UInt64 asUInt64()`：将值转换为64位无符号整数类型（如果可能）
14. `double asDouble()`：将值转换为双精度浮点数类型（如果可能）
15. `std::string asString()`：将值转换为字符串类型（如果可能）

### 数组和对象操作

1. `size_t size()`：返回数组或对象中的元素数量
2. `bool empty()`：检查数组或对象是否为空
3. `void resize(ArrayIndex newSize)`：调整数组的大小
4. `void clear()`：删除数组或对象中的所有元素
5. `void append(const Json::Value& value)`：在数组末尾添加一个新元素
6. `Json::Value& operator[](const char* key, const Json::Value& defaultValue=Json::nullValue)`：在对象中插入或访问一个元素，如果键不存在则使用默认值
7. `Json::Value& operator[](const std::string& key, const Json::Value& defaultValue=Json::nullValue)`：同上，但使用`std::string`类型的键

## 序列化函数

序列化指的是将数据结构或对象转换为一种格式，以便在网络上传输或存储到文件中。Jsoncpp提供了多种方式进行序列化：

### 使用`toStyledString`函数

例如下面的代码：

```c++ 
#include <iostream>
#include <string>
#include <jsoncpp/json/json.h>
int main()
{
    // 定义Json字符串对象
    Json::Value root;
    // 对基本类型提供了[]运算符重载，[]内部是key，=后是value
    root["name"] = "joe";
    root["sex"] = "男";
    std::string s = root.toStyledString();
    std::cout << s << std::endl;
    return 0;
}

输出结果：
{
    "name" : "joe",
    "sex" : "男"
}
```

### 使用`StreamWriter`函数

例如下面的代码：

```c++ 
#include <iostream>
#include <string>
#include <sstream>
#include <memory>
#include <jsoncpp/json/json.h>
int main()
{
    Json::Value root;
    root["name"] = "joe";
    root["sex"] = "男";
    Json::StreamWriterBuilder wbuilder; // StreamWriter的工厂
    std::unique_ptr<Json::StreamWriter> writer(wbuilder.newStreamWriter());
    std::stringstream ss;
    writer->write(root, &ss);
    std::cout << ss.str() << std::endl;
    
    return 0;
}

输出结果：
{
    "name" : "joe",
    "sex" : "男"
}
```

### 使用`FastWriter`函数

```c++ 
#include <iostream>
#include <string>
#include <sstream>
#include <memory>
#include <jsoncpp/json/json.h>
int main()
{
    Json::Value root;
    root["name"] = "joe";
    root["sex"] = "男";
    Json::FastWriter writer;
    std::string s = writer.write(root);
    std::cout << s << std::endl;
    
    return 0;
}

输出结果：
{"name":"joe","sex":"男"}
```

`FastWriter`函数在使用上也类似于`StyledWriter`，使用如下：

```c++ 
#include <iostream>
#include <string>
#include <sstream>
#include <memory>
#include <jsoncpp/json/json.h>
int main()
{
    Json::Value root;
    root["name"] = "joe";
    root["sex"] = "男";
    Json::StyledWriter writer;
    std::string s = writer.write(root);
    std::cout << s << std::endl;
    
    return 0;
}

输出结果：
{
    "name" : "joe",
    "sex" : "男"
}
```

## 反序列化函数

### 使用`Reader`函数

例如下面的代码：

```c++ 
#include <iostream>
#include <string>
#include <jsoncpp/json/json.h>
int main() {
    // JSON 字符串
    std::string json_string = "{\"name\":\"张三\",\"age\":30, \"city\":\"北京\"}";
    // 解析 JSON 字符串
    Json::Reader reader;
    Json::Value root;
    // 从字符串中读取 JSON 数据
    bool parsingSuccessful = reader.parse(json_string,root);
    if (!parsingSuccessful) 
    {
        // 解析失败，输出错误信息
        std::cout << "Failed to parse JSON: " <<reader.getFormattedErrorMessages() << std::endl;
        return 1;
    }
    // 访问 JSON 数据
    std::string name = root["name"].asString();
    int age = root["age"].asInt();
    std::string city = root["city"].asString();
    // 注意转换char数据类型时需要使用asInt()，因为没有asChar()

    // 输出结果
    std::cout << "Name: " << name << std::endl;std::cout << "Age: " << age << std::endl;std::cout << "City: " << city << std::endl;
    
    return 0;
}

输出结果：
Name: 张三
Age: 30
City: 北京
```