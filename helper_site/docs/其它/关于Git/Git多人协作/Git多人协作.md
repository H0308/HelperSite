# Git多人协作

## 多人协作实例1

要求：以当前`master`分支的最新提交为基础，现在需要有两个人**在同一个分支**上同时进行开发，开发完成后，需要将各自的代码合并到`master`分支上

首先准备两个分支，本次考虑直接在远程仓库上创建一个分支`dev`，结果如下：

<img src="Git多人协作.assets/image-20250422102558645.png">

现在，使用下面的命令可以查看本地和远程的所有分支：

```bash
git branch -a
```

可以看到类似下面的结果：

```
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```

其中`remotes/origin/`表示的就是远程仓库中的分支

可以看到，尽管远程创建了一个`dev`分支，但是本地新创建的`dev`分支，所以需要使用下面的命令将远程的`dev`分支拉取到本地：

```bash
git pull
```

此时会看到类似下面的结果：

```
From gitee.com:EPSDA/test_git
 * [new branch]      dev        -> origin/dev
Already up to date.
```

再查看当前所有分支就可以得到类似下面的结果：

```
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
```

另外，再另外一个系统下克隆当前仓库，模拟第二个开发者，克隆完成后查看当前所有分支：

```
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
```

现在本地仓库中可以看到远程的`dev`分支，但是不可以直接在这个`dev`分支上进行开发，考虑下面的思路：

1. 在本地创建一个`dev`分支
2. 关联本地的`dev`分支与远程的`dev`分支

首先执行第一步：在本地创建一个`dev`分支

```bash
git branch dev
```

接着执行第二步：关联本地的`dev`分支与远程的`dev`分支

在执行关联操作之前，首先解释一下何为关联？在前面介绍过，不论是使用`git pull`还是使用`git push`都需要指定一个远程分支，这样做的目的就是建立本地的指定分支与远程分支的连接，而一旦建立了连接，就可以简写`git pull`和`git push`命令如下：

```bash
# 从远程仓库拉取
git pull
# 推送到远程仓库
git push
```

那么如何查看本地分支与远程分支的连接呢？可以使用下面的命令：

```bash
git branch -vv
```

可以看到类似下面的结果：

```
epsda@ham-carrier:~/test_git$ git branch -vv
  dev    6dbcbd3 update test.txt.
* master 6dbcbd3 [origin/master] update test.txt.
```

可以看到，当前只有`master`分支与远程的`master`分支建立了连接，而`dev`分支并没有与远程的`dev`分支建立连接，现在先不建立连接，直接切换到`dev`分支进行开发看看会发生什么：

首先切换到`dev`分支：

```bash
git checkout dev
```

接着，在`dev`分支上进行开发：

```bash
echo "this is dev" > test.txt
```

接着，执行下面的命令完成提交和推送：

```bash
git add .
git commit -m "change test.txt on dev: this is dev"
git push
```

可以看到类似下面的结果：

```
epsda@ham-carrier:~/test_git$ git push
fatal: The current branch dev has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin dev

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.
```

可以看到，因为当前`dev`分支并没有与远程的`dev`分支建立连接，所以提交时Git无法知道当前要提交到哪一个远程分支，所以需要使用下面的命令建立连接：

```bash
git push --set-upstream 远程仓库名 远程分支名
```

例如当前情况下执行下面的命令：

```bash
git push --set-upstream origin dev
```

执行完成后，就可以看到类似下面的结果：

```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 2 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 276 bytes | 276.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Powered by GITEE.COM [1.1.5]
remote: Set trace flag c44a8bab
To gitee.com:xxx/xxx.git
   6dbcbd3..f8b6ba4  dev -> dev
branch 'dev' set up to track 'origin/dev'.
```

接着，再使用查看已经连接的分支命令：

```bash
git branch -vv
```

可以看到类似下面的结果：

```
* dev    f8b6ba4 [origin/dev] change test.txt on dev: this is dev
  master 6dbcbd3 [origin/master] update test.txt.
```

此时，远程仓库和本地仓库的`dev`分支已经建立了连接，并且远程仓库的内容也与本地仓库保持一致，而远程仓库下的`master`分支并没有更新到最新版本，至此第一个开发者已经完成

接着，第二个开发者此时也执行上面的步骤进行开发，这里介绍另外一种方式：在创建分支的同时建立与远程分支的连接：

```bash
git checkout -b 新建分支名 远程仓库名/远程分支名
```

例如当前情况下执行下面的命令：

```bash
git checkout -b dev origin/dev
```

此时会看到类似下面的结果：

```
branch 'dev' set up to track 'origin/dev'.
Switched to a new branch 'dev'
```

现在假设第二个开发者并不知道第一个开发者已经对`test.txt`文件进行了修改，所以如果第二个开发者直接将开发结果推送给远程仓库，就会出现冲突出现下面类似的结果：

```
 ! [rejected]        dev -> dev (fetch first)
error: failed to push some refs to 'https://gitee.com/EPSDA/test_git.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

出现上面结果的原因就在于当前远程仓库的`dev`分支和当前本地的`dev`分支之间存在冲突，所以解决方案如下：

1. 将远程仓库的`dev`分支拉取到本地
2. 在本地的`dev`分支上进行冲突处理
3. 将处理后的结果推送到远程仓库

首先执行第一步可以得到类似下面的结果：

```
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (3/3), 256 bytes | 32.00 KiB/s, done.
From https://gitee.com/EPSDA/test_git
   6dbcbd3..f8b6ba4  dev        -> origin/dev
Auto-merging test.txt
CONFLICT (content): Merge conflict in test.txt
Automatic merge failed; fix conflicts and then commit the result.
```

此时在当前本地`dev`分支中的`test.txt`文件中就会出现类似下面的内容：

```
<<<<<<< HEAD
this is a test
this is a new test
this is dev2
=======
this is dev
>>>>>>> f8b6ba4b6208effd5f864ba319512a9e38367953
```

接着手动处理冲突，处理完成后，再提交到远程仓库：

```bash
git add.
git commit -m "merge remote dev and local dev"
git push
```

执行完成后，就可以看到类似下面的结果：

```
Enumerating objects: 10, done.
Counting objects: 100% (10/10), done.
Delta compression using up to 12 threads
Compressing objects: 100% (5/5), done.
Writing objects: 100% (6/6), 820 bytes | 820.00 KiB/s, done.
Total 6 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Powered by GITEE.COM [1.1.5]
remote: Set trace flag 6c41dd8b
To https://gitee.com/EPSDA/test_git.git
   f8b6ba4..5a885e1  dev -> dev
```

那么，为了尽可能避免上面的冲突，**在进行多人位于同一个分支上进行开发，执行前先进行拉取保证当前本地与远程保持同步**，回到第一个开发者，因为当前远程仓库的`dev`分支中的内容和本地`dev`分支中的内容还没有同步，所以先执行`git pull`确保一致

现在两个开发者都完成了开发，在实际开发中，一旦测试发现开发结果没有问题就可以考虑合并代码了，根据前面的介绍，现在有两种合并方式：

1. `dev`分支提出`Pull Request`请求合并到`master`分支
2. 在本地合并再提交到远程分支

本次考虑第二个方式，首先为了确保本地`master`分支和远程`master`分支保持一致，先执行`git pull`拉取远程`master`分支的内容，接着执行下面的命令：

```bash
# 切换到dev分支
git checkout dev
# 合并master分支
git merge master
```

之所以要在`dev`分支上合并`master`分支是为了确保如果存在冲突，能够在`dev`分支上解决，而不是在`master`分支上解决

执行完成后没有问题再将`dev`合并到`master`分支：

```bash
# 切换到master分支
git checkout master
# 合并dev分支
git merge dev
```

合并完成后，再将结果推送到远程仓库：

```bash
git push
```

执行完成后，就可以看到类似下面的结果：

```
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Powered by GITEE.COM [1.1.5]
remote: Set trace flag a04202b9
To gitee.com:EPSDA/test_git.git
   6dbcbd3..5a885e1  master -> master
```

回到远程仓库即可看到`master`分支已经更新到最新版本

开发完成后，如果需要将`dev`分支删除，执行下面的命令：

```bash
git branch -d dev
```

但是上面的命令只是删除了本地的`dev`分支，而远程的`dev`分支并没有删除，可以考虑在远程仓库的界面上直接删除，删除后再查看所有的分支如下：

```
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
```

可以看到，远程的`dev`分支依然存在，此时查看远程分支的状态可以使用下面的命令：

```bash
git remote show origin
```

可以看到类似下面的结果：

```
* remote origin
  Fetch URL: git@gitee.com:EPSDA/test_git.git
  Push  URL: git@gitee.com:EPSDA/test_git.git
  HEAD branch: master
  Remote branches:
    master                  tracked
    refs/remotes/origin/dev stale (use 'git remote prune' to remove)
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

可以看到，远程的`dev`分支已经标记为`stale`，表示已经过时，可以使用下面的命令删除：

```bash
git remote prune 远程仓库名
```

执行完成后，再查看远程分支的状态，就可以看到类似下面的结果：

```
$ git remote prune origin
Pruning origin
URL: git@gitee.com:EPSDA/test_git.git
 * [pruned] origin/dev
```

再次查看即可看到远程的`dev`分支已经被删除

## 多人协作实例2

要求：以当前`master`分支的最新提交为基础，现在需要有两个人**在两个不同的分支**上同时进行开发，开发完成后，需要将各自的代码合并到`master`分支上

同样，现在需要两个开发者有两个分支，但是本次不考虑在远程仓库上创建分支，而是让两个开发者在本地创建分支，首先让第一个开发者创建一个`dev1`分支：

```bash
git checkout -b dev1
```

接着，在该分支上创建一个`dev1.txt`文件并写入以下内容：

```
this is dev1
```

接着，执行下面的命令完成提交：

```bash
git add.
git commit -m "add dev1.txt"
```

但是，现在有个问题，`dev1`分支已经完成了本地开发，需要将结果提交到远程仓库的`dev1`分支，但是远程并不存在`dev1`分支，所以现在需要先创建一个远程分支`dev1`再建立连接，此时就需要执行完整版本的`git push`命令：

```bash
git push origin dev1
```

执行完成后，就可以看到类似下面的结果：

```

```