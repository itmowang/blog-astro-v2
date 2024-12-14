---
title: "如何将U盘拷录后进行格式化"
description: "如何将U盘拷录后进行格式化"
pubDate: "2024-11-05 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-12-14-usbkaolurest/03.png"
tags:
  - u盘拷录
  - 重置
  - 格式化
---

因为前一阵子装linux的时候，拷录了一个镜像，但是后续发现没办法在win中直接格式化。导致状态不符, 原本16gb的U盘就剩余几百M容量了。

![0](http://img.blog.loli.wang/2024-12-14-usbkaolurest/03.png)

## 步骤

1. 打开CMD(命令指示符) ，输入 `diskpart` 命令，进入磁盘管理。


![0](http://img.blog.loli.wang/2024-12-14-usbkaolurest/01.png)


2. 输入 `list disk` 命令，查看磁盘列表，找到要格式化的磁盘，输入 `select disk x` x为磁盘序号，例如我的是0，输入 `clean` 命令。

![1](http://img.blog.loli.wang/2024-12-14-usbkaolurest/02.png)


![1](http://img.blog.loli.wang/2024-12-14-usbkaolurest/04.png)

3. 创建卷 `create partition primary` ,查看 `list partition`, 最后选择卷`select partition`


4.  最后进行格式化 U盘恢复正常
![1](http://img.blog.loli.wang/2024-12-14-usbkaolurest/05.png)


