<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Vue的响应式基础

## 基本使用Vue

本章以传统开发为主，使用Vue显示消息的代码如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<!-- 引入Vue3的CDN -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<body>
    <!-- 容器，用于渲染vue的内容 -->
    <div id="app">
        {{ msg }}
    </div>
</body>
<script>
    // 引入CDN后可以看到一个Vue对象
    // console.log(Vue);
    
    // 使用对象的解构赋值引入两个对象：createApp和ref
    const { createApp, ref } = Vue;

    // 通过createApp创建Vue应用
    // 相当于Vue.createApp，会返回一个Vue对象
    createApp({
        // 对象内部函数简写
        setup() {
            const msg = "hello world";
            return {
                msg // 返回一个与变量同名的对象，简写为变量名
            }
        }
    }).mount("#app"); // 在id为app的容器内渲染而不在其他容器内部渲染
</script>
</html>
```

## `setup`函数

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        {{ mesg }}
    </div>
</body>
<script>
    // setup函数是Vue3的入口函数，并且是Vue3特有的
    // 任何在setup函数中使用的数据或者函数，都需要在setup中声明并且作为对象属性返回，否则外界无法使用
    // 在setup函数中不存在this实例，所以其默认指向window对象
    Vue.createApp({
        setup() {
            console.log(this); // window对象
            
            // 在app的div中使用下面的变量
            const mesg = "你好";
            // 需要以对象形式返回mesg
            return {
                mesg
            }
        }
    }).mount("#app");
</script>
</html>
```

## 插值表达式

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <p>变量：{{ i }}</p>
        <p>常量：{{ pi }}</p>
        <p>对象属性：{{ obj.name }}</p>
        <p>运算结果：{{ i + pi }}</p>
        <p>三元表达式：{{ i > 1 ? "yes" : "no"}}</p>
        <p>函数返回值：{{ func() }}</p>
        <p>方法（统计对象obj的name属性值有多少个单词）：{{ obj.name.split(" ").length }}</p>
    </div>
</body>
<script>
    // 插值表达式就是形如{{ 表达式 }}形式的内容，并且插值表达式只能放在双标签内部，单标签不可以使用
    // 插值表达式的{{和}}彼此两个大括号之间不能有空格
    // 其中“表达式”部分可以放置所有有结果的表达式，常见的可以放下面的内容：
    // 1. 变量或者常量
    // 2. 对象.属性
    // 3. 算术运算或者三元运算结果
    // 4. 函数
    // 5. 方法

    Vue.createApp({
        setup() {
            let i = 10; // 变量
            const pi = 3.14; // 常量
            const obj = { name: "zhang san" }; // 对象
            function func() {
                return "函数返回值";
            }// 函数

            return {
                i,
                pi,
                obj,
                func
            }
        }
    }).mount("#app");
</script>
</html>
```

渲染结果：

<img src="2. vue的响应式基础.assets/image-20250307215451559.png">

## 实现响应式

### `reactive`函数实现对象响应式

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>

<body>
    <div id="app">
        我是{{obj.name}}，我今年{{ obj.age }}岁了
    </div>
</body>
<script>
    // 从Vue中解构出reactive
    const {createApp, reactive} = Vue;
    createApp({
        setup() {
            // 默认情况下在setup函数中声明的内容是不具备响应式特点的
            // 可以使用reactive函数使得对象具有响应式
            // 但是注意，reactive只能接收对象，其他原始类型一律不行
            const obj = reactive({
                name: "zhangsan",
                age: 19
            })

            return {
                obj
            }
        }
    }).mount("#app")
</script>

</html>
```

### `ref`函数实现数据响应式

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        {{ mesg }}

    我是{{ obj.name }}，我今年{{ obj.age }}岁了

    {{ func() }}
    </div>
</body>
<script>
    // 解构出createApp和ref
    const { createApp, ref } = Vue;

    createApp({
        setup() {
            // ref既可以将原始类型转换为响应式
            const mesg = ref("hello world")
            // 也可以将对象声明为响应式
            const obj = ref({
                name: "zhangsan",
                age: 19
            })

            // 需要注意，ref声明的数据如果需要再原生JavaScript中访问必须要带.value
            // 但是reactive不需要
            function func() {
                // 访问原始类型中的内容
                console.log(mesg.value);
                // 访问对象的内容
                console.log(obj.value.name + obj.value.age);
            }

            return {
                mesg,
                obj,
                func
            }
        }
    }).mount("#app");
</script>
</html>
```

渲染结果：

<img src="2. vue的响应式基础.assets/image-20250307215626481.png">

### `ref`还是`reactive`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app"></div>    
</body>
<script>
    const { reactive, ref, createApp } = Vue;
    createApp({
        setup() {
            // 对于一个对象，且对象的成员是确定的，可以考虑使用reactive
            // 例如对于一个只有用户名和密码的表单：
            const loginForm = reactive({
                userName: '',
                password: ''
            })

            // 其余情况都用ref，例如：
            // 1. 初始为空，后续需要添加字段的对象
            const obj = ref('');
            // 2. 基本类型
            const num = ref(10);
        }
    })
    
</script>
</html>
```