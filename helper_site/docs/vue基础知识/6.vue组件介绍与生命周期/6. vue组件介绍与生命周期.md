# Vue组件介绍与生命周期

## 何为Vue组件和组件化

组件，就是将一套代码（JavaScript逻辑+HTML逻辑+CSS逻辑）放在单独的一个`.vue`文件中，当需要使用时使用导入的方式在指定位置引入该文件

有了组件之后，后续的开发就从单`.vue`文件中开发转换变为多`.vue`文件开发，这样可以确保不同的模块相互不影响，也便于同一段逻辑的多次复用

## 根组件

在Vue中，根组件就是`App.vue`文件，前面写的所有的代码也是在`App.vue`中编写。根组件最大的特点就是作为Vue渲染的入口

## 使用组件

使用组件一般需要进行下面的步骤：

1. 创建组件：即创建一个单独的`.vue`文件包裹指定的逻辑
2. 导入组件：在需要使用组件的`.vue`中导入文件，这里分为全局导入和部分导入
3. 注册组件：如果是部分导入的组件，就不需要注册组件，否则就需要对组件进行注册
4. 使用组件：像使用基本的HTML标签一样使用组件

导入组件时，使用默认导入的语法，因为组件都有默认导出，导入的名称一般考虑使用大驼峰的形式

使用组件时有两种使用方式：

1. 单闭合标签：`<组件名 />`
2. 双标签：`<组件名></组件名>`

需要注意的是，单标签一定不能省略最后的闭合标记`/`，否则会报错

使用组件时的组件名可以不和默认导入的名称格式一致，一般有两种写法：大驼峰和烤串法

=== "大驼峰"

    ```html
    <TestCom></TestCom>
    ```

=== "烤串法"

    ```html
    <test-com></test-com>
    ```

### 部分导入

=== "`test.vue`"

    ```vue
    <!-- 1. 创建组件 -->
    <script setup>
            
    </script>
    <template>
        <div>
            测试组件
        </div>
    </template>
    ```

=== "`App.vue`"

    ```vue
    <script setup>
        // 2. 部分导入
        import Test from './components/test.vue';
    </script>
    <template>
        <div>
            根组件
            <!-- 部分导入不需要注册即可使用，但是部分导入只能在当前组件中使用-->
            <!-- 3. 使用组件 -->
            <Test></Test>
        </div>
    </template>
    ```

### 全局导入

全局导入需要在`main.js`中完成导入和注册，一旦导入就可以在所有的`.vue`文件中使用

=== "`main.js`中导入和注册"

    ```javascript
    import { createApp } from 'vue'
    import App from './App.vue'
    // 1. 导入组件
    import TestVue from './components/TestVue.vue';
    // 2. 全局导入需要会获取到createApp函数的返回值，即Vue对象实例
    const app = createApp(App);
    // 3. 注册组件
    // 注册组件的第一个参数即为组件名，未来使用该名称使用该组件
    // 可以写为大驼峰和烤串法，但是需要注意的是，如果使用烤串法，在使用组件时就只能使用烤串法
    // 如果使用大驼峰，则使用组件时既可以是大驼峰也可以是烤串法
    // 推荐使用大驼峰
    app.component("TestVue", TestVue);
    // app.component("test-vue", TestVue);
    app.mount('#app')
    ```

=== "`App.vue`"

    ```vue
    <!-- 全局导入 -->
    <template>
        <div>
            <!-- 1. 大驼峰注册，两种使用 -->
            <TestVue />
            <test-vue />
    
            <!-- 2. 烤串法注册，一种使用 -->
            <test-vue />
            <!-- 大驼峰无法识别 -->
            <TestVue />
        </div>
    </template>
    ```

## 组件生命周期

### 介绍

组件声明周期表示一个组件从创建到销毁的过程，整个过程是**不可逆**的

在Vue中，组件的生命周期分为4个阶段：

1. 创建阶段：创建响应式数据和函数
2. 挂载阶段：将组件模板渲染到页面中（即将`template`标签中的内容插入到实际DOM中）
3. 更新阶段：当组件数据发生变化时，重新渲染页面
4. 销毁阶段：组件被移除时，执行清理操作（从DOM中移除）

在上面四个阶段中，每一个阶段对应着两个组件生命周期钩子函数，所谓生命周期钩子函数就每一个阶段自动执行的函数。所以钩子本质是一个函数，只是这个函数并不需要由开发者手动调用，而如果需要在某一个周期执行某一个行为，开发者可以将该行为写入到对应阶段的钩子函数中，等待Vue自动调用便可以实现对应的效果。每一个阶段对应的钩子函数如下：

1. 创建阶段：`beforeCreate()`和`created()`
2. 挂载阶段：`beforeMount()`和`mounted()`
3. 更新阶段：`beforeUpdate()`和`updated()`
4. 销毁阶段：`beforeUnmount()`和`unmounted()`

另外，还有一个特殊的钩子函数：`setup()`，该函数是Vue代码的入口

接下来为了便于演示钩子函数的执行，考虑先使用选项式API而再考虑使用组合式API

??? info "组合式API和选项式API"

      - 选项式API是Vue 2中的传统写法，也是Vue 3中仍然支持的一种编写组件的方式。它通过在组件对象中定义不同的选项（如`data`、`methods`、`computed`、`watch`等）来组织代码
      - 组合式API是Vue 3引入的新特性，通过`setup`函数来组织组件逻辑。它提供了更灵活的代码组织方式，特别适合复杂组件的逻辑复用

    === "选项式API写法"

        ```vue
        <script>
        export default {
            data() {
                return {
                    msg: "hello world",
                    count: 0
                }
            },
            methods: {
                increment() {
                    this.count++;
                }
            },
            computed: {
                doubleCount() {
                    return this.count * 2;
                }
            },
            mounted() {
                console.log('组件已挂载');
            }
        }
        </script>

        <template>
        <div>
            <p>{{ msg }}</p>
            <p>计数: {{ count }}</p>
            <p>双倍计数: {{ doubleCount }}</p>
            <button @click="increment">增加</button>
        </div>
        </template>
        ```

    === "组合式API写法"

        ```vue
        <script setup>
        import { ref, computed, onMounted } from 'vue';

        const msg = ref("hello world")
        const count = ref(0);

        const increment = () => {
            count.value++;
        }

        const doubleCount = computed(() => {
            return count.value * 2;
        })

        onMounted(() => {
            console.log('组件已挂载');
        })
        </script>

        <template>
        <div>
            <p>{{ msg }}</p>
            <p>计数: {{ count }}</p>
            <p>双倍计数: {{ doubleCount }}</p>
            <button @click="increment">增加</button>
        </div>
        </template>
        ```

组件生命周期过程示意图如下：

<img src="6. vue组件介绍与生命周期.assets/lifecycle.png">

### 创建阶段

### 挂载阶段

### 更新阶段

### 销毁阶段