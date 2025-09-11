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

| 类型 | 解释 |
|------|------|
| `string` | 字符串类型，用于文本数据 |
| `number` | 数字类型，用于表示浮点数 |
| `integer` | 整数类型，用于表示整数 |
| `boolean` | 布尔类型，值为`true`或`false` |
| `object` | 对象类型，用于嵌套的JSON对象 |
| `array` | 数组类型，用于列表或集合 |
| `null` | 空值类型 |

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

