---
title: "flutter安装到初始化搭建第一个Demo"
description: "flutter安装到初始化搭建第一个Demo"
pubDate: "2024-08-13 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/07.png"
tags:
  - 转载
  - 语义化版本 
  - 前端进阶
---

因为公司最近可能会APP开发的需求，并且手头工作已经接近尾声，身为一个前端，现在多端混合开发在国内是很常见的，首先第一时间考虑UNIAPP，但是在此之前给PDA设备开发了一套软件，性能给我的感觉极度糟糕，并且感觉问题杂乱差，文档甚至有时候还要去微信小程序开发者文档去找，给我的感觉是在写一个网页，没有写一个APP的体验， 所以我决定学习Flutter，以便用于下一个项目，作为一个充满实力的挑战者，我觉着我应该会很快就会熟悉。


### 编辑器推荐

1. VSCode (推荐)
2. Android Studio
3. IntelliJ IDEA

## 提前安装好的工具

1. [Git for Windows ](https://gitforwindows.org/)
2. [Android Studio](https://developer.android.com/studio/install#windows)
3. Java

## 安装Flutter的方式

1. 手动下载Flutter SDK 本地安装

官方下载地址
https://docs.flutter.cn/get-started/install/windows/mobile/

![1](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/01.png)

下载好后，将文件夹放到你的硬盘下，并且配置好环境变量，在cmd中输入flutter doctor，如果出现如下图所示，说明安装成功。

![2](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/02.png)


2. Vscode 插件安装 
 插件名称：[Flutter](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter) ，去VSCode插件市场安装。

 VScode 按下快捷键 **Ctrl + Shift + P** , 打开命令面板，输入 Flutter，选择 **Flutter: New Project** ，等待检查完成后会自动生成项目。

### 境内镜像问题

修改maven.google.com 改为阿里的镜像

进入  **D:\flutter\packages\flutter_tools\lib\src** 找到 **http_host_validator.dart** ,修改 kMaven 值为 **https://maven.aliyun.com/repository/google**

```dart
const String kMaven = 'https://maven.aliyun.com/repository/google/';
```

![3](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/03.png)


## 配置环境变量

打开系统环境变量，新建环境变量，找到Path ，增加一条，你的flutter安装路径，例如：D:\flutter\bin

##  执行 flutter doctor -v 命令 ， 检测Flutter环境是否正常

```bash
flutter doctor -v
```

检测完成结果如下：


![4](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/04.png)


## 创建项目

 VScode 按下快捷键 **Ctrl + Shift + P** , 打开命令面板，输入 Flutter，选择 **Flutter: New Project** ，等待检查完成后会自动生成项目。

![6](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/06.png)


## 启动测试成功

![8](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/08.png)

![9](http://img.blog.loli.wang/2024-08-13-flutterAPPSetup1/07.png)

