---
title: "Node版本管理fnm的使用体验"
description: "Node版本管理fnm的使用体验"
pubDate: "2025-03-28 23:27:24"
heroImage: "http://img.blog.loli.wang/2025-03-28-nodeManageFnm/02.png"
tags:
  - 前端进阶
  - 操作
---

##

之前有一篇文章介绍过 node 版本管理工具 volta 的使用 [Node 版本管理 Volta 的使用](https://blog.loli.wang/blog/2023-11-27-volatsetup/doc/index.html) 这次偶然发现nodejs官方使用的示例变为了 fnm，用来体验下。


## fnm 的介绍

fnm 是使用 Rust 编写的 Node 版本管理工具，它允许您安装多个版本的 Node，并轻松切换它们。

优势：

    - 🌎 跨平台支持（macOS、Windows、Linux）
    - ✨ 单文件，轻松安装，即时启动
    - 🚀 以速度为中心
    - 📂 适用于.node-version和.nvmrc文件

## 安装

```bash
# mac/linux
  curl -fsSL https://fnm.vercel.app/install | bash

# Winget (Windows)
  winget install Schniz.fnm

# scoop (Windows)
  scoop install fnm
```


![0](http://img.blog.loli.wang/2025-03-28-nodeManageFnm/01.png)


## 简单使用

```bash
# 安装 node 22版本最新版本
fnm install 22 
```
下载速度很快，只需要12秒。就可以下载完成。

![0](http://img.blog.loli.wang/2025-03-28-nodeManageFnm/03.png)


```bash
# 
>@FOR /f "tokens=*" %i IN ('fnm env') DO @%i

# 切换版本
fnm use v22.14.0

# 查看版本

node -v

```
![0](http://img.blog.loli.wang/2025-03-28-nodeManageFnm/04.png)


这样就切换成了22.14.0版本。


## 高阶使用 (Monorepo 使用方案)

1. 在项目的根目录（或任意子目录）添加 .node-version 或 .nvmrc 文件


```bash

monorepo/
├── .node-version （指定整个仓库的 node 版本）
├── package.json
├── packages/
│   ├── app1/
│   │   └── .node-version ← 子项目 app1 的 Node 版本
│   └── app2/
│       └── .node-version ← 子项目 app2 的 Node 版本

```
当你写好配置文件后  

```bash
# 
@FOR /f "tokens=*" %i IN ('fnm env') DO @%i


# 切换版本
fnm use 
```

可以看到 我们当前是切换成功了，我们然后切换到到子项目看看

![0](http://img.blog.loli.wang/2025-03-28-nodeManageFnm/05.png)

子项目也切换成功。

![0](http://img.blog.loli.wang/2025-03-28-nodeManageFnm/06.png)


## 总结


fnm 是一个非常不错的 Node 版本管理工具，它允许您安装多个版本的 Node，并轻松切换它们。 它具有许多优点，如跨平台支持、单文件安装、快速速度和适用于 .node-version 和 .nvmrc 文件的兼容性。
