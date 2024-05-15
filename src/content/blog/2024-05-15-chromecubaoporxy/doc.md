---
title: "chrome浏览器暴力解决跨域的方案"
description: "chrome浏览器暴力解决跨域的方案"
pubDate: "2024-05-15 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/02.png"
tags:
    - chrome
    - 跨域解决
    - 前端进阶
---

### 为什么会知道这个 

一个群交流看见的。 有这么个解决方案，记录下。毕竟有时候真的需要很粗暴的解决方式。

原先随意请求一个非同源的接口。

![处理前](http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/01.png)
![处理后](http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/05.png)

可以看到，现在报错是提示403错误。代表没有权限，也就是我们能正常请求到接口了，跨域已经处理成功了

### 步骤

首先右键我们的google浏览器，选择**属性**,**打开文件所在位置**，右键发送一个快捷方式到桌面

![1](http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/02.png)

在鼠标右键刚刚新建的快捷方式，选择**属性**，在**目标**中**追加** 

 --disable-web-security 代表禁用同源策略
 --user-data-dir  代表用户缓存目录

``` bash

目标路径 --args --disable-web-security --user-data-dir=D:\MyChromeDevUserData

或

目标路径 --disable-web-security --user-data-dir=D:\MyChromeDevUserData

```
![2](http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/03.png)

关闭所有谷歌浏览器进程，重新运行一下这个快捷方式，就可以看到

![4](http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/04.png)

并且访问接口的时候，跨域也被解决掉了

![5](http://img.blog.loli.wang/2024-05-15-chromecubaoporxy/05.png)