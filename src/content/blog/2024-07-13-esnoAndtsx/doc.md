---
title: "最简单运行TypeScript 的方法 esno 和 tsx"
description: "最简单运行TypeScript 的方法esno 和 tsx "
pubDate: "2024-07-13 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-07-13-esnoAndtsx/01.png"
tags:
  - Tsx
  - esno
  - 前端进阶
---

在现在很多项目中都使用ts来做为编程语言，而如果**没有编译器的支持下**执行ts会需要**tsc**或者**ts-node**这个库来进行编译，然后**nodejs**去执行我们的ts文件，会影响工作效率和带来心智负担，困扰的我无意中发现了个项目 **tsx**

## 先做下对比吧

在没有使用tsx的情况下，我们编写ts项目想执行是需要花费很大的代价的。

我们编写好相关的代码后 需要先 **tsc** 进行编译，编译成js后通过node去执行js文件能够运行我们的ts项目代码

![1](http://img.blog.loli.wang/2024-07-13-esnoAndtsx/02.png)
![2](http://img.blog.loli.wang/2024-07-13-esnoAndtsx/03.png)


### 如果使用Tsx
可以看到，如果我们使用tsc进行编译后再去运行js文件，他其实就是一个很繁琐的步骤。而**tsx**可以方便的帮我们解决这个问题


```bash
# 安装tsx
pnpm add tsx
```

安装好tsx后，使用tsx命令去运行我们的ts代码，可以看到不需要任何的编译，就能直接处理我们的ts代码

```bash
# tsx运行指令
npx tsx test1.ts
```

![2](http://img.blog.loli.wang/2024-07-13-esnoAndtsx/04.png)


### esno

esno和tsx是一样的，不过是tsx的别名，antfu旗下的库，我看不出区别。他介绍也是这么说的


### 文档
当然还有ts-node 也是可以做到我上面同样的事情，但是esno和tsx能够更好的支持es模块，并且是基于esbuild开发的，速度也比ts-node快了一个台阶

[tsx 文档](https://tsx.is/)
