---
title: "UNIAPP离线打包plus.runtime.install无法调起安装的解决方法"
description: "记录一次UniAPP项目离线打包后项目无法调起安装包的问题"
pubDate: "2024-05-13 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-05-13-padandroidStudio01/02.png"
tags:
    - UniApp
    - 解决困惑
    - 前端进阶
---

### 起因

公司项目出现问题了，业务人员说设备APP升级了无法安装，我想了想最近除了改过业务类的代码，也没有动过其他代码啊，为什么会出现问题 ？

### 判断问题

1.  测试环境测试，云打包测试，打包后安装，可以安装。
2.  离线打包测试，打包后升级出现问题，无法出现问题，自从前一阵子切换成离线打包后就出现这个问题了。

### 发现问题。

![切1](http://img.blog.loli.wang/2024-05-13-padandroidStudio01/02.png)

下载完最新的安装包后，无法调起最新的安装包，而我又是最新的SDK。

看官方文档

 [针对plus.runtime.install在安卓9.0+上无法执行的解决方案](https://ask.dcloud.net.cn/article/35703)

使用**云打包**的话，只用在UNIAPP的manifest.json中添加相关的**权限**配置就好，但是离线打包的话，需要自己手动在 **Android Studio** 进行权限配置。

![切1](http://img.blog.loli.wang/2024-05-13-padandroidStudio01/03.png)

既然知道问题了，就进行修改吧。打开**Android Studio**，在**AndroidManifest.xml**中，找到**manifest**标签，在里面添加如下代码：

``` xml
  <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>
```

![切1](http://img.blog.loli.wang/2024-05-13-padandroidStudio01/04.png)

重新打包运行，成功安装。


### 相关文章
 [UNIAPP离线打包配置](https://blog.loli.wang/blog/2023-12-28-uniapppackage/doc/index.html)
