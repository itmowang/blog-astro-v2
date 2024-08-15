---
title: "[记录] React Native 搭建跑起第一个APP"
description: "React Native 搭建跑起第一个Demo"
pubDate: "2024-08-15 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-08-14-reactNativeSetup/09.png"
tags:
  - React Native 搭建跑起第一个Demo
  - 前端开发 
  - 前端进阶
---

尝试了下 React Native 搭建跑起第一个Demo (第一次跑React Native是会比较花时间的，耐心去一步一步去解决就好)

### 准备工作

安装所需的工具

[JDK 17](https://www.oracle.com/cn/java/technologies/downloads/#java17)  版本必须要大于等于17 和 小于等于20

[Android Studio](https://developer.android.google.cn/studio/install?hl=zh-cn) 最新版即可

[Node.js](https://nodejs.org/en/download/)  版本必须要大于等于18

安卓模拟器 用android studio自带的，或者第三方的


### 创建React Native项目

```bash
  npx react-native init AwesomeProject
```
建立出来后的项目结构

![1](http://img.blog.loli.wang/2024-08-14-reactNativeSetup/02.png)


### 检查环境

中途必须配置好 JDK 和 Android SDK 和ADB 详情可以看中文网的文档

[React Native 中文网] (https://reactnative.cn/docs/environment-setup)


```bash
npx react-native doctor  # 检查环境
```
环境如果全部检查通过，可以开始启动项目了 

![1](http://img.blog.loli.wang/2024-08-14-reactNativeSetup/07.png)

### 启动项目

```bash
#启动android
npx react-native run-android
#启动ios
npx react-native run-ios
```

![08](http://img.blog.loli.wang/2024-08-14-reactNativeSetup/08.png)

![09](http://img.blog.loli.wang/2024-08-14-reactNativeSetup/09.png)


### 总结

跑起这一个demo花了我一天的时间，我觉着这一天我可以做很多东西了，这里面各种编译，各种网络问题拉不下来依赖。编译看了下语法，还是和React有很大不同的，编译出来的代码是kotlin的，是调用的原生平台的组件，性能方面比Webview的性能要好很多，但是估计熟悉还是要话一点时间。

