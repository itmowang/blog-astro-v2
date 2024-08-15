---
title: "快速更换npm镜像源的几种方法"
description: "快速更换npm镜像源的几种方法"
pubDate: "2024-08-14 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-08-14-nrmcenter/01.png"
tags:
  - 快速更换npm镜像源的几种方法
  - 前端开发 
  - 前端进阶
---


在思考使用原生应用还是使用混合开发的时候，准备拿fullter和React Native做对比，发现官方文档有个推荐的切换镜像源的方式**nrm** ，故此来记录一下。写下我一般是怎样切换镜像的 (想到什么记录什么)


## 常用镜像源

npm   https://registry.npmjs.org/       默认官方镜像

yarn  https://registry.yarnpkg.com/       yarn官方镜像

taobao ~~https://registry.npm.taobao.org/ 已废弃~~  https://registry.npmmirror.com/  taobao镜像

tencen https://mirrors.cloud.tencent.com/npm/ tencent镜像

cnpm  https://r.cnpmjs.org/               cnpm镜像



## nrm 命令

nrm 命令是一个用来管理npm镜像的命令行工具，可以方便的切换镜像源，使用起来非常方便。

安装nrm

``` bash
npm install -g nrm
```

```bash
$ nrm ls

* npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
```

切换镜像源

```bash
$ nrm use taobao # 切换为淘宝镜像
```

添加镜像源
```bash
$ nrm add newNpm https://registry.npmjs.org/
```
删除镜像源
```bash
$ nrm del newNpm
```

更多命令参考官方文档 [nrm](https://www.npmjs.com/package/nrm)


## .npmrc

.npmrc 是一个配置文件，用来配置npm的镜像源，可以通过修改这个文件来切换镜像源。

创建一个 .npmrc 文件，并添加以下内容：

```bash
registry=https://registry.npmmirror.com/
```

修改 .npmrc 文件，将 registry 的值改为你想要的镜像源。这样就可以切换镜像源了。

或者使用指令 

```bash
npm config set registry https://registry.npmmirror.com/
```
![1](http://img.blog.loli.wang/2024-08-14-nrmcenter/01.png)