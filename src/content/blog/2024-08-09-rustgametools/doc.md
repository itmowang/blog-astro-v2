---
title: "让浏览器重新支持玩耍Flash游戏！！（Ruffle）"
description: "让浏览器重新支持玩耍Flash游戏！！（Ruffle） "
pubDate: "2024-08-10 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-07-18-semver/01.png"
tags:
  - Rust
  - Flash游戏 
  - 前端进阶
---

平时就有去各种平台找各种大佬博客的习惯并学习一二，一次偶然的机会看到一个博客文章很有趣，《重拾 flash 小游戏，给博客用上 Ruffle》 - J.F’s Blog  ，因为从我的记忆里**FLASH**是个淘汰过时并且淘汰的东西，前些年也开始各个大的浏览器都不再支持**FLASH**这个技术了，并且现在想让浏览器重新运行**FLASH**的动画网页也特别费劲。0看到这个插件让我折腾的心又恢复了。

![1](http://img.blog.loli.wang/2024-08-09-rustgametools/01.png)

### 介绍

著名的 Ruffle项目使用 Rust 语言将 flash 移植到了 Windows、Mac、Android 等主流操作系统，当然也包括基于 Javascript 的 web 环境。事实上，你可以直接在 web achieve 打开 flash🕹️，比如刚刚提到的拼命玩三郎的博客，因为时光机已经贴心地内嵌了 Ruffle 脚本。简单搜索会发现，目前众多资源大站都用它作为前端引擎，可见兼容性是不错的。作为最简单的方法之一，用它复活 swf 文件是再合适不过了。于是，花了点时间在博客下面增加了小游戏子页面，并且制作了简单的游戏列表，以及功能按钮，包括重载、本地上传、字体加载和全屏模式。默认 swf 是二进制时钟。

![2](http://img.blog.loli.wang/2024-08-09-rustgametools/02.png)


### 使用方式

# 如何在前端项目中使用 Ruffle.rs

Ruffle 是一个用 Rust 编写的 Flash Player 播放器，允许你在现代浏览器中运行 Flash 内容

## 1. 添加 Ruffle 到项目

你可以通过以下几种方式将 Ruffle 添加到你的前端项目中：

### 使用 CDN

你可以通过 CDN 直接加载 Ruffle 的 JavaScript 文件。将以下代码添加到你的 HTML 文件中：

```html
<script src="https://unpkg.com/@ruffle-rs/ruffle"></script>

```
### 使用embed 或 object 加载资源 

```html

<object data="your-flash-file.swf" width="800" height="600"></object>

```

### 我的打算

我尝到甜头后，因为小时候对4399游戏也特别上瘾，正好最近也给自己做了个工具站模板，看来对这个也适用，准备用来做一个同年怀旧小游戏的网站。顺便找个机会记录游戏过程

![3](http://img.blog.loli.wang/2024-08-09-rustgametools/03.png)



### 文档相关
[ruffle官方文档](https://ruffle.rs)

[J.F’s Blog](https://blog.zzbd.org/)