# 从新结构再看响应式基础

## 传统开发转工程化开发

从本节开始，Vue的开发就不再是先前传统开发的方式，而是转变为工程化开发

使用工程化开发前需要确保当前设备安装了`Node.js`，确保是否安装可以使用下面的指令：

```shell
node -v # 查看Node.js版本
npm -v # 查看包管理器版本
```

一般情况下，下载第三方依赖默认使用的是国外镜像，所以可以考虑设置国内镜像，使用下面的指令：

```shell
npm config get registry # 查看当前镜像源
npm config set registry https://registry.npmmirror.com # 设置为淘宝镜像源
```

有的时候npm下载依赖会比较慢，可以考虑其他两种包管理器，分别是`yarn`和`pnpm`，安装二者的方式如下：

```shell
npm install yarn -g
npm install pnpm -g
```

一般情况下，三者的性能比较为：`yarn>pnpm>npm`，但这不是绝对的

检测是否安装完成可以使用下面的命令：

```shell
yarn -v # 查看yarn的版本

pnpm -v # 查看pnpm的版本
```

有了基本的环境之后，就需要创建一个Vue工程，可以在官网找到创建Vue工程的指令，例如：

```shell
npm create vue@latest
```

创建好工程后，进入工程目录，输入下面的命令安装依赖：

```shell
npm i # 等价于npm install
```

如果要在开发模式下启动当前项目，可以输入：

```shell
npm run dev
```

需要注意，`run`后面跟着的内容需要与`package.json`文件中`"scripts"`的`key`一致：

```json
"scripts": {
    "dev": "vite", // 开发环境
    "build": "vite build", // 构建
    "preview": "vite preview" // 预览
}
```

进入工程化模式后，前面的写法就可以进一步的缩减，以下是对前面的内容进行相对简化的写法，知识本身并没有区别，只是写法可能有不同

在前面想使用Vue的内容就需要执行两步：

1. 引入`Vue.js`文件
2. 从`Vue`对象中解构出需要用到的函数或者对象

但是因为是工程化，所以上面的两步就只需要合并为一步：从第三方模块中导入需要的函数或者对象即可，对于`createApp`函数来说，因为其在应用入口`main.js`中已经导入，所以在`.vue`文件中就不需要再导入了

## `setup`函数

在工程化模式下，使用`setup`函数默认是下面的写法：

```vue
<script>
export default {
    setup() {
        const msg = "hello world";

        return {
            msg
        }
    }
}
</script>

<template>
    {{ msg }}
</template>
```

但是上面的写法有些繁琐，所以更常见的写法是`setup`的简写方式：

```vue
<!-- 在script标签中带上setup属性 -->
<script setup>
const msg = "hello world";

// 不需要在手动返回数据就可以在插值表达式中使用
</script>

<template>
    {{ msg }}
</template>
```

## 插值表达式

根据上面的写法，所以之后的插值表达式可以写为：

```vue
<script setup>
let i = 10; // 变量
const pi = 3.14; // 常量
const obj = { name: "zhang san" }; // 对象
function func() {
    return "函数返回值";
}// 函数
</script>

<template>
    <p>变量：{{ i }}</p>
    <p>常量：{{ pi }}</p>
    <p>对象属性：{{ obj.name }}</p>
    <p>运算结果：{{ i + pi }}</p>
    <p>三元表达式：{{ i > 1 ? "yes" : "no" }}</p>
    <p>函数返回值：{{ func() }}</p>
    <p>方法（统计对象obj的name属性值有多少个单词）：{{ obj.name.split(" ").length }}</p>
</template>
```

实现的效果与前面章节是一样的，此处不再展示

## 响应式

同样，响应式可以修改为：

```vue
<script setup>
import { reactive, ref } from 'vue';
// reactive
const obj = reactive({
    name: "zhangsan",
    age: 19
})

// ref
// ref既可以将原始类型转换为响应式
const mesg = ref("hello world")
// 也可以将对象声明为响应式
const obj1 = ref({
    name: "lisi",
    age: 20
})

// 需要注意，ref声明的数据如果需要再原生JavaScript中访问必须要带.value
// 但是reactive不需要
function func() {
    // 访问原始类型中的内容
    console.log(mesg.value);
    // 访问对象的内容
    console.log(obj1.value.name + obj1.value.age);
}
</script>
<template>
    <p>{{ mesg }}</p>
    <p>我是{{ obj.name }}，我今年{{ obj.age }}岁了</p>
    <p>我是{{ obj1.name }}，我今年{{ obj1.age }}岁了</p>
    {{ func() }}
</template>
```

效果与前面一致，不再展示
