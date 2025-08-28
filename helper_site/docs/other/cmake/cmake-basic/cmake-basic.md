# CMake基础命令操作

!!! abstract

    本次演示均在Ubuntu系统环境下进行

## Ubuntu下安装CMake

在Ubuntu中，输入以下命令安装CMake：

```bash
sudo apt install cmake
```

安装完成后可以使用下面的命令验证CMake是否安装成功：

```bash
cmake --version
```

如果安装成功，会提示类似下面的版本信息：

```
cmake version 3.28.3

CMake suite maintained and supported by Kitware (kitware.com/cmake).
```

## CMake介绍

CMake（Cross-platform Make）是一个开源的构建系统，由Kitware公司开发和维护。它不直接构建程序，而是生成标准的构建文件（如Makefile、Visual Studio项目文件等），然后使用平台原生的构建工具进行实际的编译和链接

## CMake从构建到可执行程序

创建一个`hello_world`目录，在该目录中编写`main.cpp`和`CMakeLists.txt`，目录结构如下：

```
.
├── CMakeLists.txt
└── main.cpp
```

在CMake中，`CMakeLists.txt`是一个项目中的配置文件，由程序员手动编写，是使用CMake进行构建时需要查找的文件，所以在使用构建命令时，命令执行的目录或者手动指定的目录中一定要有`CMakeLists.txt`文件

在`main.cpp`中编写打印`hello world`的语句，在`CMakeLists.txt`中编写下面的内容：

```cmake
# 设置最低要求版本
cmake_minimum_required(VERSION 3.18)

# 设置项目名称
project(hello_world)

# 添加构建目标
add_executable(main main.cpp)
```

基于`CMakeLists.txt`的内容，下面做简单的介绍：

1. 设置最低要求版本：这个版本的设置可以通过`cmake_minimum_required`进行，`VERSION`关键字不能遗漏，`3.18`表示版本号，本次项目中会使用3.18版本的部分新特性，所以使用该版本。之所以要设置最低版本，是因为CMake是一个不断迭代的工具（目前最新4.x，历史有3.x），不同版本可能会引入新的语法、命令、模块或行为变更。如果项目中使用了高版本CMake才支特的特性（例如特定的函数、生成器表达式、目标属性等），而用户本地安装的CMake版本低于项目要求的版本，就会出现报错并提示最低要求的CMake版本，否则正常执行后续流程
2. 设置项目名称：这个项目名称通过`project`进行，其中的`hello_world`就是项目名称，可以自行决定
3. 添加构建目标：在CMake中，“目标（Target）”代表了一个需要被生成的实体，如可执行文件、静态库/动态库等，和`Makefile`里的目标是一个意思，他是现在CMake里最核心的3个概念之一

接着，在`hello_world`目录所在的路径下执行CMake的构建命令生成`Makefile`，这一步有两种构建方式：

1. 源文件所在目录原地构建（源内构建）：直接在源文件所在目录下执行CMake构建命令
2. 源文件所在目录外地构建（源外构建）：单独创建一个构建目录，在该构建目录中执行CMake构建命令

CMake构建命令有三种写法，根据官方文档的提示如下：

```bash
cmake [options] <path-to-source>
cmake [options] <path-to-existing-build>
cmake [options] -S <path-to-source> -B <path-to-build>
```

第一种方式和第二种方式都属于源内构建，二者不同的是，第一种方式是基于`CMakeLists.txt`文件进行构建，第二种方式是基于`CMakeCache.txt`文件进行构建

第三种方式属于源外构建，其中`-S`后面指定`CMakeLists.txt`文件所在的目录，`-B`表示自动生成文件所在的目录

??? note "关于`CMakeCache.txt`"

    `CMakeCache.txt`是使用CMake构建命令生成的临时缓存配置文件，其中包含了一写配置结果和变量缓存，一般不会去手动修改，基于`CMakeCache.txt`进行构建就是利用缓存的配置结果，跳过重复检测

下面是两种构建方式演示：

=== "源内构建"

    执行命令：

    ```bash
    # 当前目录./中存在CMakeLists.txt文件
    cmake ./
    ```

    结果如下：

    ```
    .
    ├── CMakeCache.txt
    ├── CMakeFiles/*
    ├── cmake_install.cmake
    ├── CMakeLists.txt
    ├── main.cpp
    └── Makefile
    ```

=== "源外构建"

    在当前目录下创建一个`build`目录，当前目录结构如下：

    ```
    .
    ├── build
    ├── CMakeLists.txt
    └── main.cpp
    ```

    接着，执行下面的命令：

    ```bash
    # 当前目录下存在CMakeLists.txt，生成的文件放置在当前目录下的build目录
    cmake -S ./ -B ./build
    ```

    结果如下：

    ```
    .
    ├── build/*
    ├── CMakeLists.txt
    └── main.cpp
    ```

可以看到源外构建生成的目录不会影响到源文件所在的目录，这样可以保证源文件目录的整洁，所以官方**推荐源外构建**

不论是哪种构建方式，最后都会基于`CMakeLists.txt`生成一个`Makefile`文件，在`Makefile`文件所在目录下执行`make`命令即可获得编译后的可执行程序，接下来运行可执行程序即可看到执行结果。可以得出CMake从构建到获得执行程序的整个流程如下：

<img src="./cmake-basic.assets/download.png" style="width: 70%">

在`CMakeCache.txt`所在的目录也可以使用下面的命令生成可执行程序：

```bash
cmake --build .
```

在`CMakeCache.txt`中存在一行：

```cmake
CMAKE_MAKE_PROGRAM:FILEPATH=/usr/bin/gmake
```

这一行就是执行`cmake --build`命令实际执行的程序，而`/usr/bin/gmake`实际上是一个软链接，指向的正是`make`：

```bash
lrwxrwxrwx 1 root root 4  4月  9  2024 /usr/bin/gmake -> make*
```

## CMake工程构建基本流程

### 基本介绍与配置准备

使用CMake构建一个工程基本流程如下：

```mermaid
sequenceDiagram
    participant IDE as IDE
    participant Dev as 开发工程师
    participant CMake1 as CMake(配置)
    participant CMake2 as CMake(生成)
    participant Make as make
    participant CTest as CTest
    participant Install as Install
    participant CPack as CPack
    
    IDE->>Dev: 编写工程代码
    Dev->>CMake1: CMakeLists.txt + Code
    
    Note over CMake1: 配置阶段
    CMake1->>CMake1: 配置检测
    CMake1->>CMake1: 自动检测
    CMake1->>CMake1: 查找依赖
    
    Note over CMake2: 生成阶段
    CMake1->>CMake2: 配置完成
    CMake2->>Make: Makefile
    
    Note over Make: 编译链接阶段
    Make->>Make: 编译链接
    Make->>CTest: exe so
    
    Note over CTest: 测试阶段
    CTest->>CTest: 测试
    CTest->>Install: 测试结果
    
    Note over Install: 安装阶段
    Install->>Install: 安装软件
    Install->>CPack: exe so
    
    Note over CPack: 打包阶段
    CPack->>CPack: 打包
    CPack->>CPack: 网络分发/startup
```

根据上面的过程，创建一个目录`cmake_tools`，在该目录下创建`main.cpp`和`CMakeLists.txt`文件，两个文件的内容分别如下：

=== "`main.cpp`"

    ```cpp
    #include <iostream>
    #include <cassert>

    int main()
    {
        assert(1 + 2 == 3);
        // assert(1 + 2 == 4);
        std::cout << "测试通过" << "\n";

        return 0;
    }
    ```

=== "`CMakeLists.txt`"

    ```cmake
    cmake_minimum_required(VERSION 3.18)
    project(cmake_tools)
    add_executable(main main.cpp)

    # 集成单元测试
    include(CTest)
    add_test(NAME test_add COMMAND main)

    # 本地安装
    include(GNUInstallDirs) # GNU标准安装路径
    install(TARGETS main) # 将main程序安装到GNU标准安装路径

    # 打包
    include(CPack)
    ```

在`CMakeLists.txt`中，除了前一节提到的三个配置以外，新增了三个配置，分别表示：

1. 使用CMake官方提供的单元测试工具CTest，使用`include`引入CTest，使用`add_test`指定测试名称和测试的命令，本次将`main.cpp`作为测试程序，所以使用`main.cpp`生成的可执行程序作为测试程序
2. 将程序安装到指定目录，安装使用`install`，其中`main`表示待安装的程序，而为了统一安装路径，一般用CMake标准路径，即`GNUInstallDirs`，使用`include`引入该路径配置。在Linux下，该路径默认为`/usr/local/bin`
3. 使用CMake官方提供的打包工具CPack，使用`include`引入CPack

使用源外构建在当前目录中的`build`中生成文件

### 使用CTest单元测试

在`build`目录所在的路径下执行下面的命令进行单元测试：

```bash
ctest
```

执行结果如下：

```
Test project /home/epsda/CmakeLearning_code/cmake_tools/build
    Start 1: test_add
1/1 Test #1: test_add .........................   Passed    0.00 sec

100% tests passed, 0 tests failed out of 1

Total Test time (real) =   0.01 sec
```

在输出结果中，`Start 1: test_add`和`Test #1: test_add`中的`test_add`都是在`CMakeLists.txt`文件中`add_test`的`NAME`值。同时，测试会在`build`目录中生成`Testing`目录，其中`LastTest.log`文件记录着最近的测试日志

如果取消注释`assert(1 + 2 == 4);`并重新构建项目运行测试可以看到下面的结果：

```
Test project /home/epsda/CmakeLearning_code/cmake_tools/build
    Start 1: test_add
1/1 Test #1: test_add .........................Subprocess aborted***Exception:   1.15 sec

0% tests passed, 1 tests failed out of 1

Total Test time (real) =   1.15 sec

The following tests FAILED:
          1 - test_add (Subprocess aborted)
Errors while running CTest
Output from these tests are in: /home/epsda/CmakeLearning_code/cmake_tools/build/Testing/Temporary/LastTest.log
```

对应的可以在`LastTest.log`看到测试错误的日志，**注意这个日志是覆盖写，即每一次执行测试都会清空上一次的日志**

除了执行上面的命令可以进行单元测试以外，还可以使用下面的命令：

```bash
make test
```

执行结果与直接执行`ctest`结果一样，实际上这一点是因为在`Makefile`中关于`test`的伪目标对应的依赖关系使用的就是`ctest`：

```makefile
test:
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --cyan "Running tests..."
	/usr/bin/ctest --force-new-ctest-process $(ARGS)
.PHONY : test
```

之所以可以通过`ctest`找到测试程序，原因就在于生成的`CTestTestfile.cmake`文件中的定义：

```cmake
add_test(test_add "/home/epsda/CmakeLearning_code/cmake_tools/build/main")
```

一旦运行`ctest`，就会通过这一行去查找可执行程序并执行

### 使用安装命令进行程序安装

安装当前临时构建目录`build`中的可执行程序到指定的目录中可以在`build`目录所在路径使用下面的命令：

```bash
cmake --install .
# 也可以使用make install，效果一致
```

但是，如果是普通用户直接执行该命令会出现权限不足的问题，这是因为`GNUInstallDirs`中对于Linux来说默认配置的路径是`/usr/local/bin`，这个目录只有`root`可以直接进入，所以普通用户需要加`sudo`：

```bash
sudo cmake --install .
# 也可以使用sudo make install，效果一致
```

输出的结果如下：

```
-- Install configuration: ""
-- Installing: /usr/local/bin/main
```

那么为什么执行`sudo make install`会得到同样的效果呢？实际上也是因为`Makefile`中关于`install`伪目标的依赖关系：

```makefile
install: preinstall
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --cyan "Install the project..."
	/usr/bin/cmake -P cmake_install.cmake
.PHONY : install
```

在CMake中，执行`cmake --install <dir>`命令时实际上执行的是脚本命令，而`-P`选项就表示执行指定的脚本，`cmake_install.cmake`就是安装时执行的脚本

执行安装命令后可以看到当前项目会生成一个`install_manifest.txt`的文件，其中的内容就是安装的程序清单：

```
/usr/local/bin/main
```

### 使用CPack进行打包

要进行安装可以在`build`目录中执行下面的命令：

```bash
cpack
```

执行结果如下：

```
CPack: Create package using STGZ
CPack: Install projects
CPack: - Run preinstall target for: cmake_tools
CPack: - Install project: cmake_tools []
CPack: Create package
CPack: - package: /home/epsda/CmakeLearning_code/cmake_tools/build/cmake_tools-0.1.1-Linux.sh generated.
CPack: Create package using TGZ
CPack: Install projects
CPack: - Run preinstall target for: cmake_tools
CPack: - Install project: cmake_tools []
CPack: Create package
CPack: - package: /home/epsda/CmakeLearning_code/cmake_tools/build/cmake_tools-0.1.1-Linux.tar.gz generated.
CPack: Create package using TZ
CPack: Install projects
CPack: - Run preinstall target for: cmake_tools
CPack: - Install project: cmake_tools []
CPack: Create package
CPack: - package: /home/epsda/CmakeLearning_code/cmake_tools/build/cmake_tools-0.1.1-Linux.tar.Z generated.
```

在当前的构建目录下就会多出四个文件：

```
cmake_tools-0.1.1-Linux.sh
cmake_tools-0.1.1-Linux.tar.gz
cmake_tools-0.1.1-Linux.tar.Z
install_manifest.txt
```

同时还会多出一个临时安装目录：`_CPack_Packages`

其中，`.tar.gz`和`tar.z`文件就是两个用于分发的压缩包，而`install_manifest.txt`表示安装的程序

而压缩包的命名和压缩包的格式在`CPackConfig.cmake`文件中可以看到定义：

```cmake
# 生成的压缩包后缀
set(CPACK_GENERATOR "STGZ;TGZ;TZ")
# 压缩包文件名称
set(CPACK_PACKAGE_FILE_NAME "cmake_tools-0.1.1-Linux")

# 包文件名称
set(CPACK_PACKAGE_NAME "cmake_tools")
# 版本组合
set(CPACK_PACKAGE_VERSION "0.1.1")
set(CPACK_PACKAGE_VERSION_MAJOR "0")
set(CPACK_PACKAGE_VERSION_MINOR "1")
set(CPACK_PACKAGE_VERSION_PATCH "1")
# 系统名称
set(CPACK_SYSTEM_NAME "Linux")
```

需要注意的是，这次打包之前没有执行安装命令，如果是先执行安装命令，再执行`cpack`，此时会出现权限不足问题：

```
CPack: Create package using STGZ
CPack: Install projects
CPack: - Run preinstall target for: cmake_tools
CPack: - Install project: cmake_tools []
CMake Error at /home/epsda/CmakeLearning_code/cmake_tools/build/cmake_install.cmake:69 (file):
  file failed to open for writing (Permission denied):

    /home/epsda/CmakeLearning_code/cmake_tools/build/install_manifest.txt


CPack Error: Error when generating package: cmake_tools
```

因为执行安装命令时会生成`install_manifest.txt`文件，这个文件此时是由`root`生成的，所以只有`root`用户可以访问，而执行`cpack`时也需要打开并覆写`install_manifest.txt`文件，直接执行`cpack`时除非是`root`用户，否则就会报错。对于普通用户解决方案就是使用`sudo`执行`cpack`

### 脚本模式

使用下面的代码即可执行脚本：

```bash
cmake -P 脚本文件
```

CMake脚本模式，不会生成构建产物，也不会生成中间过程。适合处理各种与构建系统无关的自动化任务，通过编写简洁的脚本文件，你可以实现环境检查、文件处理、部署打包等功能

例如前面提到的安装过程就使用到了脚本模式

### 调用外部命令

使用下面的代码即可调用外部命令：

```bash
cmake -E 命令
```

??? "可以调用的外部命令"

    ```
    Available commands: 
    capabilities              - Report capabilities built into cmake in JSON format
    cat [--] <files>...       - concat the files and print them to the standard output
    chdir dir cmd [args...]   - run command in a given directory
    compare_files [--ignore-eol] file1 file2
                                - check if file1 is same as file2
    copy <file>... destination  - copy files to destination (either file or directory)
    copy_directory <dir>... destination   - copy content of <dir>... directories to 'destination' directory
    copy_directory_if_different <dir>... destination   - copy changed content of <dir>... directories to 'destination' directory
    copy_if_different <file>... destination  - copy files if it has changed
    echo [<string>...]        - displays arguments as text
    echo_append [<string>...] - displays arguments as text but no new line
    env [--unset=NAME ...] [NAME=VALUE ...] [--] <command> [<arg>...]
                                - run command in a modified environment
    environment               - display the current environment
    make_directory <dir>...   - create parent and <dir> directories
    md5sum <file>...          - create MD5 checksum of files
    sha1sum <file>...         - create SHA1 checksum of files
    sha224sum <file>...       - create SHA224 checksum of files
    sha256sum <file>...       - create SHA256 checksum of files
    sha384sum <file>...       - create SHA384 checksum of files
    sha512sum <file>...       - create SHA512 checksum of files
    remove [-f] <file>...     - remove the file(s), use -f to force it (deprecated: use rm instead)
    remove_directory <dir>... - remove directories and their contents (deprecated: use rm instead)
    rename oldname newname    - rename a file or directory (on one volume)
    rm [-rRf] [--] <file/dir>... - remove files or directories, use -f to force it, r or R to remove directories and their contents recursively
    sleep <number>...         - sleep for given number of seconds
    tar [cxt][vf][zjJ] file.tar [file/dir1 file/dir2 ...]
                                - create or extract a tar or zip archive
    time command [args...]    - run command and display elapsed time
    touch <file>...           - touch a <file>.
    touch_nocreate <file>...  - touch a <file> but do not create it.
    create_symlink old new    - create a symbolic link new -> old
    create_hardlink old new   - create a hard link new -> old
    true                      - do nothing with an exit code of 0
    false                     - do nothing with an exit code of 1
    ```