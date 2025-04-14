# 关于Git

## Git介绍

Git是一个版本控制器，用于记录电脑上所有文件的变化，并且可以看到修改的各个版本

对于一个文本文件来说，Git可以跟踪到文件的某一行的改动

对于一个二进制文件（例如图片、视频等），Git无法直接读取到文件修改的内容，但是可以获取到该文件属性的变化，例如大小的改变、文件是否存在等

## Git安装

安装前可以使用下面的命令查看当前系统是否已经安装Git

```bash
git --version
```

如果可以正常显示Git版本，则代表当前系统已经安装Git，否则没有安装

### 在CentOS下安装Git

使用下面的指令在CentOS系统下安装Git

```bash
sudo yum install git -y
```

!!! note

    需要注意，如果当前用户为非root用户，则使用`sudo`命令需要确保当前用户在白名单中

安装完成后，可以再次使用版本查看命令查看是否安装成功

### 在Ubuntu下安装Git

使用下面的指令在Ubuntu系统下安装Git

```bash
sudo apt-get install git -y
```

安装完成后，可以再次使用版本查看命令查看是否安装成功

### 在Windows下安装Git

在官网[Git (git-scm.com)](https://git-scm.com/)上下载对应Windows版本的Git，安装即可

## 初始化本地仓库

Git可以管理仓库，但是前提是当前目录可以被管理，为了使普通目录变为可以被Git管理的仓库，需要使用下面的命令对当前目录进行初始化，这个过程也称为初始化本地仓库

```bash
git init
```

命令执行完毕后，查看当前目录时可以发现一个隐藏文件`.git`，该文件中会保存与Git相关的文件，一般情况下不要去修改，例如在CentOS下的目录结构

```
.git
├── branches
├── config
├── description
├── HEAD
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── prepare-commit-msg.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```

## Git中的`name`和`email`配置

为了能够正确将指定文件提交到远程仓库，需要先对Git中的信息进行配置，在Git中需要配置与远端代码仓库所属账号相同的`name`和`email`。具体配置方式如下：

```bash
git config user.name "name"
git config user.email "email"
```

配置完成后，可以使用下面的命令查看是否已经将`name`和`email`信息存储到配置文件中

```bash
git config -l
```

如果配置成功，则会在原有配置信息的最后两行显示`name`和`email`，否则不显示

如果需要删除已经配置的信息，可以使用下面的命令进行删除

```bash
git config --unset user.name
git config --unset user.email
```

上面的方式会在当前本地仓库下配置一个`name`和`email`，并且只作用于当前仓库，如果需要一个可以作用于全局的配置，则需要使用`--global`选项

```bash
git config --global user.name "name"
git config --global user.email "email"
```

配置完成后，可以使用下面的命令查看是否已经将`name`和`email`信息存储到配置文件中

```bash
git config -l
```

如果配置成功，则会在原有配置信息的开始两行显示`name`和`email`，否则不显示

需要注意，如果使用了全局配置，则直接使用前面的删除命令是无法对全局配置信息进行删除。对于全局配置删除同样需要加上`--global`选项，如下：

```bash
git config --global --unset user.name
git config --global --unset user.email
```

## Git中的工作区、暂存区和版本库

工作区：当前电脑的目录（包含了`.git`目录和本地文件）
暂存区：对工作区中有改变的文件（新增、修改和删除）进行存储的位置。在`.git`目录中存在着对应的`index`文件，所以暂存区也可以称为索引区
版本库：也称本地仓库，即`.git`目录。其中包含了所有文件的修改内容和对应的版本信息

三者关系如下：

<img src="关于Git.assets/download.png">

在上图中，对于版本库来说，存在一个`HEAD`指针，指向当前分支的最新一次提交。默认情况下，Git会自动将`HEAD`指针指向`master`分支，该分支是Git默认创建的分支。当对工作区中的文件进行修改后，需要使用`git add`命令将修改的文件添加到暂存区，然后使用`git commit`命令将暂存区中的文件提交到版本库中

从上面的过程可以看出，如果在工作区修改了文件，该文件不会被Git管理，只有在使用`git add`命令+`git commit`命令之后，文件才会被Git管理

## 添加文件到暂存区

使用下面的命令可以将工作区中的文件添加到暂存区中，该命令可以添加指定文件，也可以添加所有文件：

```bash
# 添加指定文件
git add <file>
# 添加指定目录
git add <directory>
# 添加所有文件
git add .
```

例如：

```bash
# 添加指定文件
git add test.txt
```

默认直接使用`git init`命令创建的`.git`目录下是没有`index`文件的，一旦第一次使用`git add`命令添加文件，Git会自动创建`index`文件

## 提交文件到版本库

使用下面的命令可以将暂存区中的文件提交到版本库中，该命令需要添加提交信息：

```bash
git commit -m "提交信息"
```

注意，`-m`选项不能省略，建议是给出较为精确且具体的提交信息，便于后续查看

例如：

```bash
git commit -m "add test.txt"
```

当然，也可以将暂存区的指定文件提交到版本库中，该命令需要添加提交信息：

```bash
# 提交指定文件
git commit <file> -m "提交信息" 
```

一旦使用`git commit`命令提交文件，会看到类似下面的信息：

```bash
[master (root-commit) 4ef19d7] add test.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 test.txt
 ```

如果要查看提交记录，可以使用下面的命令：

```bash
git log
```

当前情况下会看到类似下面的信息：

```bash
commit 4ef19d7c8d4ed8be5e84057dc476c43e368f6a85 (HEAD -> master)
Author: EPSDA <1848312235@qq.com>
Date:   Mon Apr 14 10:42:44 2025 +0800

    add test.txt
```

如果想要查看较为简短的日志信息，可以带上`--pretty=oneline`选项：

```bash
git log --pretty=oneline
```

当前情况下会看到类似下面的信息：

```bash
4ef19d7c8d4ed8be5e84057dc476c43e368f6a85 (HEAD -> master) add test.txt
```

日志中的长数字代表的就是日志标识符，是一个哈希值

下面进入`.git`目录查看其中的内容可以看到类似下面的结构：

```
.git
├── branches
├── COMMIT_EDITMSG
├── config
├── description
├── HEAD
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── prepare-commit-msg.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── push-to-checkout.sample
│   ├── sendemail-validate.sample
│   └── update.sample
├── index
├── info
│   └── exclude
├── logs
│   ├── HEAD
│   └── refs
│       └── heads
│           └── master
├── objects
│   ├── 4e
│   │   └── f19d7c8d4ed8be5e84057dc476c43e368f6a85
│   ├── 5e
│   │   └── fb9bc29c482e023e40e0a2b3b7e49cec842034
│   ├── e6
│   │   └── 9de29bb2d1d6434b8b29ae775ad8c2e48c5391
│   ├── info
│   └── pack
└── refs
    ├── heads
    │   └── master
    └── tags

16 directories, 26 files
```

其中使用`git add`命令会在`objects`目录下创建一个对象，`objects`目录是Git的对象库，在使用`git log`命令查看日志信息中看到的长数字就是当前对象的具体标识，前两位表示目录名称，后面38位表示文件名称



## 附录：Git常用命令

1. 初始化本地仓库：

    ```bash
    git init <directory>
    ```

2. 克隆一个远程仓库：

    ```bash
    git clone <url>
    ```

3. 添加文件到暂存区：

    ```bash
    git add <file>
    ```

4. 提交更改：

    ```bash
    git commit -m "<message>"
    ```

5. 从远程存储库中拉取更改：

    ```bash
    git pull <remote name> <branch>
    ```

6. 将更改推送到远程存储库：

    ```bash
    git push <remote name> <branch>
    ```

7. 从暂存区删除一个文件：

    ```bash
    git reset <file>
    ```

8. 移动或重命名文件：

    ```bash
    git mv <current path> <new path>
    ```

9. 从存储库中删除文件：

    ```bash
    git rm <file>
    ```

10. 显示分支：

    ```bash
    git branch
    ```

11. 创建一个分支：

    ```bash
    git branch <branch>
    ```

12. 切换到一个分支：

    ```bash
    git checkout <branch>
    ```

13. 删除一个分支：

    ```bash
    git branch -d <branch>
    ```

14. 合并分支：

    ```bash
    git merge <branch to merge into HEAD>
    ```

15. 查看之前的提交：

    ```bash
    git checkout <commit id>
    ```

16. 恢复提交：

    ```bash
    git revert <commit id>
    ```

17. 重置提交：

    ```bash
    git reset <commit id>
    ```

18. 查看存储库的状态：

    ```bash
    git status
    ```

19. 显示提交历史：

    ```bash
    git log
    ```

20. 显示对未暂存文件的更改：

    ```bash
    git diff
    ```

21. 显示两次提交之间的变化：

    ```bash
    git diff <commit id> <commit id>
    ```

22. 列出存储：

    ```bash
    git stash list
    ```

23. 删除一个藏匿处：

    ```bash
    git stash drop <stash id>
    ```

24. 删除所有藏匿处：

    ```bash
    git stash clear
    ```

25. 应用和删除存储：

    ```bash
    git stash pop <stash id>
    ```

26. 显示存储中的更改：

    ```bash
    git stash show <stash id>
    ```

27. 添加远程仓库：

    ```bash
    git remote add <remote name> <url>
    ```

28. 显示远程仓库：

    ```bash
    git remote
    ```

29. 删除远程仓库：

    ```bash
    git remote remove <remote name>
    ```

30. 重命名远程存储库：

    ```bash
    git remote rename <old name> <new name>
    ```

31. 从远程存储库中获取更改：

    ```bash
    git fetch <remote name>
    ```

32. 从特定分支获取更改：

    ```bash
    git fetch <remote name> <branch>
    ```

33. 将更改推送到特定分支：

    ```bash
    git push <remote name> <branch>
    ```
