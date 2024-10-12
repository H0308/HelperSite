# Visual Studio Code中添加自定义代码片段

## 基本操作

1. 打开Visual Studio Code设置，选择Snippets

    <img src="vscode中添加代码片段.assets\image.png">

2. 在弹出的窗口中选择新建全局片段文件

    <img src="vscode中添加代码片段.assets\image1.png">

    !!! note
        如果只想为当前工作目录设置片段文件则选择第二个

3. 输入新全局片段文件的名称

    <img src="vscode中添加代码片段.assets\image2.png">

    !!! note
        这个文件名称与将来的快捷名称没有关系

4. 在生成的文件中输入下面的内容：

    ```json
    "Print to console": {
            "scope": "javascript,typescript",
            "prefix": "log",
            "body": [
                "console.log('$1');",
                "$2"
            ],
            "description": "Log output to console"
        }
    ```

    内容解释：

    1. `"Print to console"`：引号中填写当前代码片段的描述文字
    2. `"scope"`：值的引号中填语言类型文件的后缀，例如C++源文件就输入`cpp`，Java字节文件就输入`java`
    3. `"prefix"`：值的引号中填写当前代码片段的提示词
    4. `"body"`：`[]`中填写由双引号包裹、逗号结尾的字符串
    5. `"description"`：值的引号中填写代码片段的作用描述

5. 输入需要生成的内容，以下面的内容为例：

    ```json
    {
        "Print to console": {
            "scope": "cpp",
            "prefix": "merge-sort",
            "body": [
                "void _MergeSort(int* data, int* tmp, int left, int right)",
                "{",
                "    //确定递归结束条件",
                "    if (left == right)",
                "    {",
                "        return;",
                "    }",
                "",
                "    //分割数组，首先确定当前数组的中间位置",
                "    int mid = (left + right) / 2;",
                "    _MergeSort(data, tmp, left, mid);",
                "    _MergeSort(data, tmp, mid + 1, right);",
                "",
                "    //取小的数值尾插到tmp数组中",
                "    int begin1 = left;",
                "    int end1 = mid;",
                "    int begin2 = mid + 1;",
                "    int end2 = right;",
                "    int i = left;",
                "    while (begin1 <= end1 && begin2 <= end2)",
                "    {",
                "        if (data[begin1] < data[begin2])",
                "        {",
                "            tmp[i++] = data[begin1++];",
                "        }",
                "        else",
                "        {",
                "            tmp[i++] = data[begin2++];",
                "        }",
                "    }",
                "    //存在一个数组先走完的情况",
                "    while (begin1 <= end1)",
                "    {",
                "        tmp[i++] = data[begin1++];",
                "    }",
                "",
                "    while (begin2 <= end2)",
                "    {",
                "        tmp[i++] = data[begin2++];",
                "    }",
                "",
                "    //排序完之后将tmp数组中的数据拷贝回原来的数组",
                "    memcpy(data + left, tmp + left, sizeof(int) * (right - left + 1));",
                "}",
                "",
                "//归并排序递归版",
                "void MergeSort(int* data, int sz)",
                "{",
                "    //因为需要将排序好的数据重新拷贝到原来的数组中，所以需要开辟数组",
                "    int* tmp = (int*)malloc(sizeof(int) * sz);",
                "    assert(tmp);",
                "    //防止主函数递归导致每次都会重新开辟空间，所以使用子函数",
                "    _MergeSort(data, tmp, 0, sz - 1);",
                "    free(tmp);",
                "}",

            ],
            "description": "归并排序"
        }
    }
    ```

    上面的代码主要生成了一个描述文字为「归并排序」，代码片段适用的文件范围为后缀为`.cpp`的文件，代码片段提示为「merge-sort」，内容为归并排序的代码，描述为「归并排序」的代码片段

    根据适用范围创建一个文件，后缀名为`.cpp`，使用效果如下：

    <img src="vscode中添加代码片段.assets\image3.png">

    输入后按下Tab或者Enter即可生成`"body"`的内容，效果如下：

    <img src="vscode中添加代码片段.assets\image4.png" style="zoom: 80%;" >

## 辅助工具

因为`"body"`中需要生成用双引号包裹，逗号结尾的字符串，如果代码片段内容过多则手动添加双引号和逗号比较麻烦，为了简化这个步骤，可以适用下面的两个代码快速根据已有的代码生成指定的用双引号包裹，逗号结尾的字符串

=== "C++"
    ```c++
    #include <fstream>
    #include <string>

    int main() {
        std::ifstream inputFile("引号内部填写源代码文件路径");
        std::ofstream outputFile("引号内部填写目标代码文件路径（注意不要与源代码文件路径一致）");

        std::string line;
        while (std::getline(inputFile, line)) {
            outputFile << "\"" << line << "\",\n";
        }

        return 0;
    }
    ```
=== "C++ 11"
    ```c++
    #include <fstream>
    #include <string>

    int main() {
        // 使用原始字符串
        const std::string _if = R"(括号内部填写源代码文件路径)";
        const std::string _of = R"(括号内部填写目标代码文件路径（注意不要与源代码文件路径一致）)";
        std::ifstream inputFile(_if);
        std::ofstream outputFile(_of);

        std::string line;
        while (std::getline(inputFile, line)) {
            outputFile << "\"" << line << "\",\n";
        }

        return 0;
    }
    ```
=== "Java"
    ```java
    public class Test {
        public static void main(String[] args) throws Exception{
            BufferedReader bufferedReader = new BufferedReader(new FileReader("引号内部填写源代码文件路径"));
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("引号内部填写目标代码文件路径（注意不要与源代码文件路径一致）"));
            String s = null;
            while ((s = bufferedReader.readLine()) != null) {
                bufferedWriter.write("\"" + s + "\",\n");
            }

            bufferedWriter.close();
            bufferedReader.close();
        }
    }
    ```