# 关于JSON Schema

## 基本介绍

JSON Schema一个用来定义和校验JSON的Web规范。简而言之，JSON Schema是用来校验JSON是否符合预期

例如针对下面的JSON数据：

```json
{
    "code": "SUCCESS",
    "errMsg": "",
    "data": false
}
```

示例的JSON Schema为：

```json
{
    "type": "object"
    "properties": {
        "code": {
            "type": "string" // 校验code字段是否为string类型
        },
        "errMsg": {
            "type": "string" // 校验errMsg字段是否为string类型
        },
        "data": {
            "type": "boolean" // 校验data字段是否为boolean类型
        }
    }
}
```

得到JSON对应的JSON Schema可以借用一些线上工具，例如[在线JSON转Schema工具](https://tooltt.com/json2schema/)，但是需要注意的是，**工具生成的结果可能存在错误，需要进行手动校验**

## JSON Schema支持检测的类型

在JSON Schema中，可以检测如下类型：

| 类型      | 解释                          |
| --------- | ----------------------------- |
| `string`  | 字符串类型，用于文本数据      |
| `number`  | 数字类型，用于表示浮点数      |
| `integer` | 整数类型，用于表示整数        |
| `boolean` | 布尔类型，值为`true`或`false` |
| `object`  | 对象类型，用于嵌套的JSON对象  |
| `array`   | 数组类型，用于列表或集合      |
| `null`    | 空值类型                      |

需要校验某一个对象之中的属性类型可以使用`"type"`进行类型指定，例如：

```json
"type": "string" // 校验类型是否为string类型
```

一个JSON对象可能包含多个字段，可以通过`"properties"`来存储当前对象中的属性，例如：

```json
{
    "name": "zhangsan"
}
```

对应的JSON Schema为：

```json
{
    "type": "object", 
    "properties": {
        "name": {
            "type": "string"
        }
    }
}
```

## 最大值和最小值

在JSON Schema中，有两种方式表示最大值和最小值：

1. `maximum`和`minimum`：指定类型的最大值和最小值（包含`maximum`和`minimum`值）
2. `exclusiveMaximum`和`exclusiveMinimum`：指定类型的最大值和最小值（不包含`exclusiveMinimum`和`exclusiveMaximum`值）

例如有下面的JSON：

```json
{
    "age": 10
}
```

假设`age`不能低于0（不能为0），不能高于120（可以为120），可以表示为：

```json
{
    "type": "object",
    "properties": {
        "type": "integer",
        "maximum": 120,
        "exclusiveMinimum": 0
    }
}
```

## 字符串校验

前面提到了针对类型的校验，但是使用`"type": "string"`只能检测是否是字符串类型，不能判断字符串具体的内容是否符合需求。为了解决这个问题，在JSON Schema中支持使用正则表达式对字符串进行校验，对应的键为`pattern`。关于正则表达式的语法介绍见[关于正则表达式](https://www.help-doc.top/other/regex/regex.html)

例如下面的代码：

```json
{
    "type": "string",
    "pattern": "^\d+$", // 表示匹配纯数字字符串，注意处理转义字符
}
```

## 数组约束

在JSON Schema中，可以对JSON数组进行下面的规则约束：

1. `minItems`和`maxItems`：约定数组的最小元素个数和最大元素个数
2. `uniqueItems`：约定数组中的元素必须唯一，取值为真或假。默认值为假
3. `item`：约束数组中每一个元素类型

例如：

```json
{
    "type": "array",
    "minItems": 1,
    "maxItems": 10,
    "uniqueItems": true, // 具体值取决于具体语言中对布尔值的规定
    "item": {
        "type": "object", // 约束数组每一个元素为对象类型
        "properties": { 
            "id": {
                "type": "string" // 每一个对象中的id属性必须为string类型
            }
        }
    },
}
```

## 对象约束

对象约束一般有：

1. `minProperties`和`maxProperties`：表示对象最少具备的属性个数和最多具备的属性个数
2. `additionalProperties`：表示是否允许对象存在JSON Schema中没有校验的属性，取值为真或假。默认值为真

例如：

```json
{
    "type": "object",
    "minProperties": 1,
    "maxProperties": 10,
    "additionalProperties": false, // 具体值取决于具体语言中对布尔值的规定
    "properties": {
        // 属性和约束
    }
}
```

## 必需属性

有时需要保证指定在JSON Schema中的属性必须存在于被校验的JSON中，此时可以使用`required`，值为数组。例如：

```json
{
    "type": "object",
    "required": ["id", "name", "password"], // 表示对象必须具备id、name和password属性
    "properties": {
        // 属性和约束
    }
}
```

## 依赖关系

有时需要确保某一个属性的前置属性必须存在，此时可以通过`dependentRequired`定义属性之间的依赖关系。例如：

```json
{
    "type": "object",
    "properties": {
        "id": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
    },
    "dependentRequired": {
        "id": ["name"] // 表示id属性依赖name属性
    }
}
```

## Python与JSON Schema

Python中存在一个第三方库`jsonschema`，可以使用Python通过`jsonschema`中的`validate(instance, schema, cls=None, *args, **kwargs)`方法进行校验。例如下面的代码：

```py
def test_json_schema():
    json = {
        "password": "564231aaaa"
    }

    json_schema = {
        "type": "object",
        "properties": {
            "password": {
                "type": "string",
                "pattern": r"^\d+$"
            }
        }
    }

    # 第一个参数表示待校验的JSON
    # 第二个参数表示用于校验的JSON Schema
    jsonschema.validate(json, json_schema)
```