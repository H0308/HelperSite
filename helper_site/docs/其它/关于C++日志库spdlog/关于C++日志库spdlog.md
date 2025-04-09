# 关于C++日志库spdlog

`spdlog` 是一个高性能、易于使用的C\+\+日志库，广泛应用于现代C\+\+项目中。它支持多线程、异步日志记录、多种日志格式、以及灵活的输出方式（如控制台、文件、甚至自定义输出）。下面将详细介绍 `spdlog` 的安装、配置和使用方法

## 在Ubuntu下安装spdlog库



## 基本用法

### 包含头文件

在代码中引入 `spdlog` 头文件：
```cpp
#include "spdlog/spdlog.h"
#include "spdlog/sinks/basic_file_sink.h" // 文件日志
#include "spdlog/sinks/stdout_color_sinks.h" // 控制台彩色日志
```

### 创建日志记录器

`spdlog` 提供了多种日志记录器（logger），可以根据需求选择不同的类型：

1. 控制台日志
2. 文件日志
3. 混合日志（控制台 + 文件）

#### 控制台日志

```cpp
#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

int main() {
    // 创建一个控制台日志记录器
    auto console = spdlog::stdout_color_mt("console");

    // 记录日志
    console->info("Welcome to spdlog!");
    console->error("This is an error message.");
    console->warn("This is a warning message.");

    return 0;
}
```

在上面的代码中，`stdout_color_mt`函数的参数表示日志记录器的名称标识符，这是一个字符串标识符，用于唯一标识这个特定的日志记录器实例

如果想取出这个实例，可以通过下面的方式：

```cpp
auto console = spdlog::get("console");
```

例如：

```cpp
// 通过名称获取已注册的记录器
auto logger = spdlog::get("console");
if(logger) {
    logger->info("Got existing logger");
}
```

#### 文件日志

```cpp
#include "spdlog/spdlog.h"
#include "spdlog/sinks/basic_file_sink.h"

int main() {
    // 创建一个文件日志记录器
    auto file_logger = spdlog::basic_logger_mt("file_logger", "logs/basic-log.txt");

    // 记录日志
    file_logger->info("Log message to file.");
    file_logger->error("Error message to file.");

    return 0;
}
```

#### 混合日志（控制台 + 文件）

可以同时向多个目标输出日志：

```cpp
#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"
#include "spdlog/sinks/basic_file_sink.h"

int main() {
    // 创建控制台和文件日志记录器
    auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
    auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>("logs/mixed-log.txt", true);

    // 组合多个 sink
    spdlog::sinks_init_list sink_list = {console_sink, file_sink};
    auto combined_logger = std::make_shared<spdlog::logger>("multi_sink", sink_list.begin(), sink_list.end());

    // 注册日志记录器
    spdlog::register_logger(combined_logger);

    // 记录日志
    combined_logger->info("This message will appear in both console and file.");
    combined_logger->error("Error message to both outputs.");

    return 0;
}
```

### 日志级别

`spdlog` 支持以下几种日志级别（从低到高）：

- `trace`: 最详细的调试信息。
- `debug`: 调试信息。
- `info`: 一般信息。
- `warn`: 警告信息。
- `error`: 错误信息。
- `critical`: 致命错误信息。
- `off`: 关闭日志。

可以通过以下方式设置全局日志级别：

```cpp
spdlog::set_level(spdlog::level::debug); // 设置为 debug 级别
```

## 格式化日志

`spdlog` 支持丰富的日志格式化功能，可以通过 `set_pattern` 方法自定义日志格式

### 自定义日志格式

```cpp
#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

int main() {
    auto console = spdlog::stdout_color_mt("console");

    // 自定义日志格式
    console->set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%^%l%$] %v");

    // 记录日志
    console->info("Custom format log message.");

    return 0;
}
```

对于上面的代码，格式说明如下：

- `%Y-%m-%d %H:%M:%S.%e`: 时间戳（年-月-日 时:分:秒.毫秒）
- `%^%l%$`: 日志级别（带颜色）
- `%v`: 日志消息内容

## 异步日志

`spdlog` 支持异步日志记录，可以显著提高性能。需要在初始化时启用异步模式。

### 启用异步日志
```cpp
#include "spdlog/async.h"
#include "spdlog/sinks/basic_file_sink.h"

int main() {
    // 初始化异步日志队列（建议大小为 8192）
    spdlog::init_thread_pool(8192, 1);

    // 创建异步文件日志记录器
    auto async_file = spdlog::basic_logger_mt<spdlog::async_factory>("async_file_logger", "logs/async-log.txt");

    // 记录日志
    async_file->info("Asynchronous log message.");
    async_file->error("Asynchronous error message.");

    // 刷新日志队列
    spdlog::flush_on(spdlog::level::info);

    return 0;
}
```

## 高级特性

### 日志轮转

日志轮转（Log Rotation）是一种日志管理技术，主要用于解决日志文件不断增长导致的问题，当日志文件达到特定条件（如大小限制或时间间隔）时，自动创建新的日志文件，同时归档或删除旧的日志文件。需要日志轮转的原因：

1. 防止单个日志文件过大
2. 自动归档历史日志
3. 节省磁盘空间
4. 便于日志管理和分析

常见轮转策略有下面两种：

1. **基于大小的轮转**：当日志文件达到指定大小时创建新文件
2. **基于时间的轮转**：按固定时间间隔(如每天)创建新文件

日志轮转过程模拟，假设配置为保留3个文件，文件名为`mylog.txt`：
- 初始：`mylog.txt`（当前日志）
- 第一次轮转：
  - `mylog.txt.1`（最新备份）
  - 新建空`mylog.txt`
- 第二次轮转：
  - `mylog.txt.2`
  - `mylog.txt.1`
  - `mylog.txt`
- 第三次轮转：
  - 删除`mylog.txt.3`
  - `mylog.txt.2`
  - `mylog.txt.1 `
  - `mylog.txt`

日志轮转的实际应用场景一般有：

- 长期运行的服务程序
- 高频率日志记录的应用
- 磁盘空间有限的系统
- 需要长期保存历史日志的场景

在spdlog中，轮转是自动完成的，开发者只需配置轮转策略即可。`spdlog` 支持基于文件大小或时间的日志轮转功能

#### 基于文件大小的轮转

```cpp
#include "spdlog/sinks/rotating_file_sink.h"

int main() {
    // 创建一个轮转文件日志记录器（最大 5MB，保留 3 个文件）
    auto rotating_logger = spdlog::rotating_logger_mt("rotating_logger", "logs/rotate-log.txt", 1048576 * 5, 3);

    // 记录日志
    for (int i = 0; i < 10; ++i) {
        rotating_logger->info("Log message {}", i);
    }

    return 0;
}
```


#### 基于时间的轮转

```cpp
#include "spdlog/sinks/daily_file_sink.h"

int main() {
    // 创建一个每日轮转日志记录器（每天凌晨 0 点轮转）
    auto daily_logger = spdlog::daily_logger_mt("daily_logger", "logs/daily-log.txt", 0, 0);

    // 记录日志
    daily_logger->info("Daily log message.");

    return 0;
}
```

### Sink与内置Sink

在spdlog中，**sink（接收器）** 是一个核心概念，它决定了日志消息最终输出到哪里，每个日志对象可以关联一个或多个sink，其决定了日志的物理存储位置或显示方式

常见sink类型有如下几种：

- 控制台输出：`stdout_color_sink_mt`（彩色）、`stdout_sink_mt`
- 文件输出：`basic_file_sink_mt`、`rotating_file_sink_mt`
- 系统日志：`syslog_sink_mt`（Linux）、`win_eventlog_sink_mt`（Windows）
- 其他：UDP网络、数据库等（需自定义）

!!! note

    在spdlog中，命名后缀含义如下：
    - `_mt`：多线程安全版本（mutex protected）
    - `_st`：单线程版本（无锁，性能更高）

例如下面的代码：

```cpp:c:\HelperSite\HelperSite\helper_site\src\example.cpp
// 创建控制台彩色sink（多线程安全）
auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();

// 创建文件sink（自动创建文件）
auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>("logs/app.log");
```

spdlog中的sink工作原理如下：

- 当调用`logger->info()`时，消息会传递给所有关联的sink
- 每个sink独立处理消息（格式化、过滤、输出）
- sink之间互不影响

在实际应用中，sink的组合使用可以实现多种复杂的日志输出需求，例如：

- 同时输出到控制台和文件
- 不同级别日志输出到不同文件
- 关键错误同时发送到邮件/短信

### 自定义Sink

如果需要将日志输出到其他目标（如网络、数据库等），可以实现自定义Sink，例如下面的示例：

```cpp
#include "spdlog/sinks/base_sink.h"

// 自定义 Sink 类
template<typename Mutex>
class MySink : public spdlog::sinks::base_sink<Mutex> {
protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        // 将日志消息转换为字符串
        spdlog::memory_buf_t formatted;
        this->formatter_->format(msg, formatted);

        // 输出到自定义目标（例如网络）
        std::cout << fmt::to_string(formatted);
    }

    void flush_() override {
        // 刷新操作
    }
};

using MySinkMT = MySink<std::mutex>;

int main() {
    auto my_sink = std::make_shared<MySinkMT>();
    auto logger = std::make_shared<spdlog::logger>("custom_logger", my_sink);

    // 记录日志
    logger->info("Custom sink log message.");

    return 0;
}
```