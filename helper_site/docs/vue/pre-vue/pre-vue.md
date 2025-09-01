<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Vue前置知识

## 模块化

模块化的导入和导出语法。按照下面的命令创建目录：

1. 创建一个根目录
2. 安装`Node.js`并使用`npm init`初始化
3. 在根目录中创建一个`src`目录
4. 与`src`目录中创建一个`index.js`文件
5. 在`src`目录中创建一个`utils`目录
6. `utils`目录中创建一个`min.js`

所以项目基本结构如下：

```
- 根目录
    - src
        - utils
            - min.js
        - index.js
    - package.json
```

在每个文件中有下面的内容：

=== "`package.json`"

    ```json
    {
    "name": "es-module",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "description": "",
    "type": "module"
    }
    ```

=== "`min.js`"

    ```javascript
    // 默认导出
    export default function min(a, b){
        return a < b ? a : b;
    }

    // 默认导出只能有一个且导出变量时不能带变量声明修饰符
    // export default const pi = 1;

    // 按需导出
    // 导出变量时可以使用变量声明修饰符
    export let pi = 2;
    export let i = 3;
    ```

=== "`index.js`"

    ```javascript
    // 默认导入import + 默认导出的内容名称（可以任意） from "文件路径"
    import minFunc from "./utils/min.js";
    // 按需导入
    // 按需导入需要代上{}并且需要保证导入名称和导出名称相同
    import { i } from "./utils/min.js";

    console.log(minFunc(10, 20));

    console.log(i);
    ```

使用`node ./src/index.js`即可看到最后打印出的结果：

```
10
3
```