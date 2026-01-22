<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Vue的基本结构

## 基本结构

<img src="3. vue的基本结构.assets/download.png">

## 目前推荐结构

在前期因为只需要用到vue的基本特性，所以可以删除`src`目录下的`assets`和`componets`文件夹及其所有文件，并保留`App.vue`文件下的所有根标签，其余内容清除：

```vue
<script setup>
// 此处编写JavaScript代码
</script>

<template>
<!-- 此处编写HTML代码 -->
</template>

<!-- style标签处添加scoped属性可以确保当前style的样式只影响到当前vue文件中的标签 -->
<style scoped>
/* 此处编写CSS代码 */
</style>
```

接着修改`main.js`文件中的内容，即删除导入默认样式文件一行，其余不变：

```javascript
// 从第三方模块vue中导入createApp而不是像之前从Vue对象中解构，确保可以使用createApp函数创建应用
import { createApp } from "vue";

// 引入App.vue文件作为vue的入口文件
import App from "./App.vue";

// 将App的内容放置到id为app的容器中
createApp(App).mount("#app");
```

在之后，除了特殊说明外，都会默认采用上面的结构进行代码编写

## 三个重要的入口文件

在Vue项目结构中，三个重要的入口文件以及作用分别是：

1. `main.js`：创建应用的入口（即项目打包的入口）
2. `App.vue`：Vue代码的入口
3. `index.html`：项目的入口网页

一般情况下，除了`App.vue`以外，其他的`.vue`文件都是通过相互导入的方式直接或间接得放在`App.vue`文件中，所以如果要新增页面，一般也是新增子页面，再在`App.vue`文件中导入该子页面