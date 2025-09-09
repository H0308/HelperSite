<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 接口自动化测试

## 接口测试概念

接口测试是测试系统组件间接口的一种测试。接口测试主要用于检测外部系统与系统之间以及内部各个子系统之间的交互点。测试的重点是要检查数据的交换，传递和控制管理过程，以及系统间的相互逻辑依赖关系等

简而言之，所谓接口测试就是通过测试不同情况下的入参与之相应的出参信息来判断接口是否符合或满足相应的功能性、安全性要求

## 接口测试重要性

比如测试用户注册功能，规定用户名为[6, 18]个字符，包含字母（区分大小写）、数字、下划线。首先功能测试时肯定会对用户名规则进行测试时，比如输入20个字符、输入特殊字符等，但这些可能只是在前端做了校验，后端可能没做校验，如果有人通过抓包绕过前端校验直接发送到后端怎么办呢？试想一下，如果用户名和密码未在后端做校验，而有人又绕过前端校验的话，那用户名和密码不就可以随便输了吗？如果是登录可能会通过SQL注入等手段来随意登录，甚至可以获取管理员权限，那这样不是很恐怖？

所以，接口测试的必要性就体现出来了：

- 可以发现很多在页面上操作发现不了的bug
- 检查系统的异常处理能力
- 检查系统的安全性、稳定性
- 前端随便变，接口测好了，后端不用变

## 如何执行接口测试

接口测试分两步走：通过接口设计用例 + 结合业务逻辑来设计用例

接口测试用例一般可以进行下面几个方面：

1. 通过性验证：接口可以通过输入参数得到正确的输出结果
2. 参数组合：将多个输入参数的不同取值进行系统性组合，以验证系统在各种参数配置下的行为和功能正确性的测试方法。
3. 接口安全：通过身份验证、权限控制、数据加密、输入验证等技术手段，保护API接口免受未授权访问、数据泄露、恶意攻击等安全威胁的综合防护体系
4. 异常验证：通过输入非法数据、边界值、空值等异常情况来验证系统的错误处理机制和容错能力，确保系统在异常情况下能够正确响应并保持稳定运行

## 接口自动化测试概念

接口自动化是通过对接口进行测试和模拟，以确保软件系统内部的各个组件能够正确地相互通信和交换数据。接口自动化测试可以显著提高测试效率和准确性。因为接口测试专注于测试系统内部的逻辑和数据传输，而不是像UI测试那样关注用户的操作和交互。同时，由于接口测试直接针对系统内部的结构和功能，可以更容易地发现和定位问题，减少测试成本和时间

## 接口自动化测试流程

接口自动化测试流程一般包含：

1. 需求分析：通过分析接口文档、业务需求和系统架构，明确接口的功能、输入输出参数、数据格式、业务逻辑和异常处理等测试要求，为制定测试策略和设计测试用例提供准确依据
2. 挑选自动化接口：根据接口的稳定性、重要性、复杂度、执行频率等因素，筛选出适合进行自动化测试的接口，以最大化自动化测试的投入产出比和测试覆盖率
3. 设计自动化测试用例：根据接口需求和测试策略，设计包含正常场景、边界值、异常情况等多种测试场景的用例，明确输入数据、预期结果和断言条件，为自动化脚本编写提供详细的测试规范
4. 搭建自动化测试环境：配置和部署包含测试框架、工具库、数据库、服务器等必要组件的完整测试基础设施，为自动化测试脚本的开发、执行和维护提供稳定可靠的运行平台
5. 设计自动化执行框架：构建一个统一的测试执行平台，包含测试用例管理、执行调度、结果收集、报告生成等核心模块，实现测试脚本的批量执行、并行处理、失败重试和结果统计，提高测试执行效率和可维护性
6. 编写代码：根据测试用例设计和自动化框架架构，使用编程语言实现具体的测试脚本，包括接口调用、数据处理、断言验证、异常处理等功能模块，将测试逻辑转化为可执行的自动化测试程序
7. 执行用例：运行已编写完成的自动化测试脚本，通过测试框架按照预定的执行策略和顺序调用测试用例，验证接口功能是否符合预期，并收集测试结果和日志信息
8. 生产测试报告：将测试执行过程中收集的测试结果、通过率、失败用例、错误日志、性能数据等信息进行汇总分析，使用工具（例如Allure）生成结构化的测试报告文档，为项目质量评估和决策提供数据支撑

## `requests`模块介绍与基本操作

### 模块介绍与简单测试

`requests`库是Python中最流行的HTTP客户端库，提供简洁优雅的API接口，用于发送HTTP请求、处理响应数据、管理会话和认证，是进行API测试和网络编程的首选工具

例如，使用`requests`模块请求百度：

```py
# 对百度发起请求
import requests

ret = requests.get("https://www.baidu.com")
print(ret) # 返回Response对象<Response [200]>
```

### `requests`发起请求

在`requests`中可以通过专用的请求方法发起请求，例如`GET`和`POST`请求：

1. `GET`请求：使用`requests.get(url, params=None, **kwargs)`
2. `POST`请求：使用`reqeusts.post(url, data=None, json=None, **kwargs)`

也可以使用通用方法`requests.request(method, url, **kwargs)`：

```py
ret = requests.request(url="http://www.baidu.com", method="get")
```

`request`方法可以传递下面的参数：

参数名 | 描述 |
| --- | --- |
| `url` | 请求的接口 |
| `headers` | 一个字典，包含要发送的HTTP头 |
| `cookies` | 一个字典、列表或者`RequestsCookieJar`对象，包含要发送的Cookie |
| `files` | 一个字典，包含要上传的文件 |
| `data` | 一个字典、列表或者字节串，包含要发送的请求体数据 | 
| `json` | 一个字典，将被转换为JSON格式并发送，此时`Content-Type`会被设置为`application/json` |
| `params` | 一个字典、列表或者字节串，将作为查询字符串附加到URL上 |
| `auth` | 一个元组，包含用户名和密码，用于HTTP认证 |
| `timeout` | 一个浮点数或元组，指定请求的超时时间 |
| `proxies` | 一个字典，包含代理服务器的信息 |
| `verify` | 一个布尔值或字符串，指定是否验证SSL证书 |

例如：

```py
# 设置参数可以通过传递字典
param = {
    "参数1": "值1",
    "参数2": "值2",
}
ret = requests.request(url="http://www.baidu.com", method="get", params=param)
# 对于请求头、JSON数据和表单数据都可以通过字典设置
```

这些方法返回的都是`Repsonse`对象，在该对象的中可以获取到以下的信息（假设`r`为`Repsonse`实例）：

| 属性/方法 | 描述 |
|-----------|------|
| `r.status_code` | 响应状态码 |
| `r.content` | 字节方式的响应体，会自动解码gzip和deflate压缩 |
| `r.headers` | 以字典对象存储服务器响应头，若键不存在则返回None |
| `r.json()` | Requests内置的JSON解析方法，将响应体解析为JSON格式（需要注意，如果返回内容不是JSON的使用该方法会抛出异常） |
| `r.url` | 获取实际请求的URL |
| `r.encoding` | 编码格式，根据响应头部的字符编码确定 |
| `r.cookies` | 获取服务器设置的Cookie |
| `r.raw` | 返回原始响应体，不进行任何处理 |
| `r.text` | 字符串方式的响应体，会自动根据响应头部的字符编码进行解码 |
| `r.raise_for_status()` | 失败请求(非200响应)抛出异常 |

例如：

```py
ret = requests.get("https://www.baidu.com") 
print(ret.text) # 可以打印非JSON的数据，例如HTML网页
print(ret.status_code) # 返回响应状态码
```

## 自动化框架`pytest`介绍

`requests`库专注于HTTP请求的发送，而`pytest`框架则提供了测试的组织、执行和管理功能。`pytest`是一个非常流行且高效的Python测试框架，它提供了丰富的功能和灵活的用法，使得编写和运行测试用例变得简单而高效

`pytest`的优点如下：

- 简单易用：`pytest`的语法简洁清晰，对于编写测试用例非常友好，几乎可以在几分钟内上手
- 强大的断言库：`pytest`内置了丰富的断言库，可以轻松地进行测试结果的判断
- 支持参数化测试：`pytest`支持参数化测试，允许使用不同的参数多次运行同一个测试函数，这大大提高了测试效率
- 丰富的插件生态系统：`pytest`有着丰富的插件生态系统，可以通过插件扩展各种功能，比如覆盖率达到测试、测试报告生成（如`pytest-html`插件可以生成完美的HTML测试报告）、失败用例重复执行（如`pytest-rerunfailures`插件）等。此外，`pytest`还支持与selenium、requests、appium等结合，实现Web自动化、接口自动化、App自动化测试
- 灵活的测试控制：`pytest`允许跳过指定用例，或对某些预期失败的用例标记成失败，并支持重复执行失败的用例

## `pytest`基本使用

`pytest`支持自动识别项目中的测试用例，但是默认情况下需要满足下面的条件：

1. 文件名需要以`test_`开头或者以`_test`结尾
2. 类名需要以`Test`开头，并且类中不可以有构造函数`__init__`函数
3. 函数需要以`test`开头

例如下面的代码：

=== "文件名不符合，函数名符合"

    ```py
    # 文件名是test02，不符合Pytest的查找规则
    # 所以终端执行pytest命令无法查找到当前测试方法
    # 但是可以手动调用
    def test():
        print("测试")
    ```

=== "文件名符合，类名符合，且没有构造函数"

    ```py
    # 文件名和类名都符合要求
    class Test:
        # 测试类不可以有__init__方法
        def test(self):
            print("Test::test")
    # 终端执行pytest命令可以查找到当前测试方法
    ```

之所以测试类不能有`__init__`函数，是因为`pytest`采用自动发现机制来收集测试用例，它会自动实例化测试类并调用其所有以`test`开头的方法作为测试用例。如果测试类中定义了`__init__`方法，那么当`pytest`实例化该类时，`__init__`方法会被调用，这可能会掩盖测试类的实际测试逻辑，并引入额外的副作用，影响测试结果的准确性

## `pytest`命令行指令与配置文件

在`pytest`中提供了以下常用的命令：

| 命令 | 描述 |
|------|------|
| `pytest` | 在当前目录及其子目录中搜索并运行测试 |
| `pytest -v` | 增加输出的详细程度 |
| `pytest -s` | 显示测试中的`print`语句 |
| `pytest test_module.py` | 运行指定的测试模块 |
| `pytest test_dir/` | 运行指定目录下的所有测试 |
| `pytest -k <keyword>` | 只运行测试名包含指定关键字的测试 |
| `pytest -m <marker>` | 只运行标记为指定标记的测试 |
| `pytest -q` | 减少输出的详细程度 |
| `pytest --html=report.html` | 生成HTML格式的测试报告（需要安装`pytest-html`插件） |
| `pytest --cov` | 测量测试覆盖率（需要安装`pytest-cov`插件） | 

但是如果命令太多，多次写长命令会比较麻烦。在`pytest`中可以通过配置文件提前设置好命令参数

`pytest`能识别的配置文件名称为`pytest.ini`，常见的配置选项如下：

| 参数 | 解释 |
|------|------|
| `addopts` | 指定在命令行中默认包含的选项 |
| `testpaths` | 指定搜索测试的目录 |
| `python_files` | 指定发现测试模块时使用的文件匹配模式 |
| `python_classes` | 指定发现测试类时使用的类名前缀或模式 |
| `python_functions` | 指定发现测试函数和方法时使用的函数名前缀或模式 |
| `norecursedirs` | 指定在搜索测试时应该避免进入的目录模式 |
| `markers` | 定义测试标记，用于标记测试用例 |

!!! info

    在`pytest.ini`中，以`;`开头的是注释。注意注释不能写在配置信息之后，不然会被处理为配置信息

例如下面的配置内容：

```ini
[pytest]
; 在当前目录及其子目录中搜索并运行测试，显示详细测试信息
addopts = -vs
; 定义测试目录为cases
testpaths = cases
; 定义可识别的函数名为test_开头
python_functions = test_*
; 定义可识别的类名以Test_开头
python_classes = Test_*
; 定义可识别的文件名以test开头
python_files = test*
```

## `pytest`与断言

`pytest`中支持Python的原生断言方式，即使用`assert`：

```py
assert 条件表达式, 错误信息
```

例如，通过请求[免费API资源](https://jsonplaceholder.typicode.com/)判断结果：

```py
import requests

def test_api():
    ret = requests.get("https://jsonplaceholder.typicode.com/posts/1")

    expected_ret = {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    }

    assert ret.json() == expected_ret
```

## 前置与后置

前面提到，在测试类中不允许有`__init__`方法，但是如果要为对象中的资源进行初始化就需要通过其他方式

在`pytest`中提供了前置和后置：

- 前置：在测试开始之前执行的代码。类中的每个测试方法前置使用`setup_method`，整个测试类前置使用`setup_class`
- 后置：在执行完毕之后执行的代码。类中的每个测试方法后置使用`teardown_method`，整个测试类后置使用`teardown_class`

除了上面的方式以外，还可以使用`fixture`来实现前置和后置，这一点会在后面的`fixture`部分提及。本部分主要介绍如何使用上面提到的方式

=== "`setup_method`和`teardown_method`"

    ```py
    class Test_Method:
        def setup_method(self):
            print("初始化函数，每个函数都执行")

        def teardown_method(self):
            print("初始化函数，每个函数执行完成执行")

        def test_01(self):
            print("这是test_01测试函数")

        def test_02(self):
            print("这是test_02测试函数")
    ```

    输出结果如下：

    ```
    cases/test03.py::Test_Method::test_01 初始化函数，每个函数都执行
    这是test_01测试函数
    PASSED初始化函数，每个函数执行完成执行

    cases/test03.py::Test_Method::test_02 初始化函数，每个函数都执行
    这是test_02测试函数
    PASSED初始化函数，每个函数执行完成执行
    ```

=== "`setup_class`和`teardown_class`"

    ```py
    class Test_Method01:
        def setup_class(self):
            print("初始化函数，类初始化")

        def teardown_class(self):
            print("初始化函数，类释放")

        def test_01(self):
            print("这是test_01测试函数")

        def test_02(self):
            print("这是test_02测试函数")
    ```

    输出结果如下：

    ```
    cases/test03.py::Test_Method01::test_01 初始化函数，类初始化
    这是test_01测试函数
    PASSED
    cases/test03.py::Test_Method01::test_02 这是test_02测试函数
    PASSED初始化函数，类释放
    ```

## 参数化

在自动化测试过程中，有时需要向测试函数传递参数，这个时候就需要用到参数化。在`pytest`中可以使用`pytest.mark.parametrize`实现参数化，也可以通过`fixture`实现，具体会在`fixture`部分介绍

`pytest.mark.parametrize`可以使用方法和类上：

- 使用在方法上时，表示当前方法接收参数，其他方法不受影响
- 使用在类上时，表示当前类中的所有方法均会接收指定的参数

=== "使用在方法上"

```py
# 指定参数test接收三次值
@pytest.mark.parametrize("test", ["测试1", "测试2", "测试2"])
def test_01(test):
    print(test)

# 每一次测试接收多个参数
@pytest.mark.parametrize("num1, num2, expected", [(3, 5, 8), (2, 4, 6)])
def test_02(num1, num2, expected):
    assert (num1 + num2) == expected
```

输出结果如下：

```
cases/test04.py::test_01[\u6d4b\u8bd51] 测试1
PASSED
cases/test04.py::test_01[\u6d4b\u8bd52_0] 测试2
PASSED
cases/test04.py::test_01[\u6d4b\u8bd52_1] 测试2
PASSED
cases/test04.py::test_02[3-5-8] PASSED
cases/test04.py::test_02[2-4-6] PASSED
```

=== "使用在类上"

```py

```