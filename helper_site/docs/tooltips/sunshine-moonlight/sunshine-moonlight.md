<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Sunshine+Moonlight实现屏幕内容串流

## 下载和配置Sunshine

进入Sunshine的Github发布页：[链接](https://github.com/LizardByte/Sunshine/releases/tag/v0.23.1)

下载需要的版本，当前是Windows就选择`installer`或者`zip`：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets/image-20250103181440114.png" alt="image-20250103181440114" />

本次选择`installer`，便于安装，下载完成后按照正常安装就行，可以考虑更改安装位置，没有任何影响

安装完成后，在右下角可以看到Sunshine的托盘图标：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-17-26.png">

右键该托盘图标，点击`Open Sunshine`，此时会弹出一个网页，可能会弹出告警，但是可以选择忽略并继续，根据具体浏览器而定，如下图所示：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-19-37.png">

第一次进入Sunshine时会提示输入用户名和密码，这里随意设置，但是要记住，后面登录Sunshine需要使用到，例如下面的登录提示：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-20-49.png">

登录Sunshine后，可以点击`Configuration`，在General选项卡下的`Locale`选择简体中文，并滑到对下面点击保存，再应用等待Sunshine自动重启再刷新网页就可以看到中文页面了

接下来，点击`Network`选项卡下按照下面进行配置，注意没有框选的表示不需要修改：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-25-08.png">

设置完成后保存再应用，等待Sunshine自动重启即可

## 下载和配置Moonlight

下载Moonlight可以到Github发布页下载：[链接](https://github.com/moonlight-stream/moonlight-qt/releases/tag/v6.1.0)

下载需要的版本，当前是Windows就选择`exe`或者`zip`：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-27-23.png">

在Moonlight中，点击左侧栏中的加号添加要显示的电脑的IP地址，一般情况下，Moonlight会自动搜索当前局域网中的电脑，所以也可以不需要手动输入需要显示的电脑的IP

如果需要查看需要显示的电脑的IP地址，可以在控制台中输入`ipconfig`

!!! note

    如果电脑的名字是中文，可能会搜索不到，建议还是将电脑的名称设置为英文

在中间的页面中选择需要链接的电脑，再选择`DESKTOP`即可链接，注意此时点击链接会Moonlight会弹出PIN码，在Sunshine的导航栏位置找到PIN码选项输入Moonlight中的PIN码即可完成链接

设置Moonlight可以点击左侧栏的齿轮进行相应的设置

## 将另一台电脑或者平板的屏幕作为扩展屏

上面的操作只是完成了当前电脑显示的内容在其他设备上显示，实用性并不高，所以可以考虑使用软件方式添加屏幕，可以使用parsecVDisplay软件添加，下载位置依旧在Github的发布页上：[链接](https://github.com/nomi-san/parsec-vdd/releases/tag/v0.45.1)

打开该软件后有下面常用的三个按钮：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-36-59.png">

按钮的作用从左往右依次是：打开系统显示设置、添加自定义分辨率和刷新率、添加显示器

如果目标显示器的分辨率比较特殊，可以考虑使用「添加自定义分辨率和刷新率」添加需要的分辨率和刷新率，添加后点击`ADD DISPLAY`，等待软件中央出现一个显示器后右键该显示器：

<img src="Sunshine+Moonlight实现屏幕内容串流.assets\Snipaste_2025-01-03_18-39-54.png">

其中的`Resolution`、`Refresh Rate`和`Orientation`分别设置目标显示器的分辨率、刷新率和屏幕方向，如果添加了自定义分辨率和刷新率就可以在设置`Resolution`和`Refresh Rate`看到，添加完成后打开系统显示设置就可以看到第二个显示器了

!!! warning

    上面的做法使用笔记本电脑，如果是台式机，请看[此视频中的内容](https://www.bilibili.com/video/BV13i421r7Ff?vd_source=8b669841dc8d649172d24d4754839fb4)，当前页面的内容也是截取自该视频

再次使用Moonlight连接即可