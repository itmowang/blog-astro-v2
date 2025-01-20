---
title: "【记录】旧版 Dart Sass 中已经移除 @import 引入方式的问题"
description: "Deprecation Warning: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0."
pubDate: "2025-01-20 23:27:24"
heroImage: "http://img.blog.loli.wang/2025-01-20-sasserrorupd/01.png"
tags:
  - 前端进阶
  - 操作
---


## 将公司的项目项目升级sass版本的时候发现了项目警告

提示如下

```bash
Deprecation Warning: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import
```


![0](http://img.blog.loli.wang/2025-01-20-sasserrorupd/01.png)

官方提示了，使用新的引入方式 @use，如下已经不让使用 @import 引入方式了


在vite里面修改下配置文件即可

```bash
# 
 css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "./node_modules/swiper/swiper.scss";`,
        additionalData: `@use "./node_modules/swiper/swiper.scss";`,
      },
    },
  }
```
