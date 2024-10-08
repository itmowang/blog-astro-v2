---
title: "[白嫖] Lade 免费白嫖应用部署容器 1核心 128MB内存 1GB数据库 1GB磁盘 100GB流量"
description: "[白嫖] Lade 免费白嫖应用部署容器 1核心 128MB内存 1GB数据库 1GB磁盘 100GB流量"
pubDate: "2024-09-14 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-09-14-lade/06.png"
tags:
  - 白嫖
  - Lade
  - 部署容器
---

### 最近

最近没有因为身体原因没咋更新，并且也没啥写的，今天逛社区看见一个新的应用部署平台，有免费额度。毕竟白嫖。折腾个玩玩

### Lade

Lade 的使命是构建一个简单、可靠且易于扩展的云平台。我们很高兴能够让开发人员和公司更轻松地管理生产中的应用程序。

[Lade](https://lade.io/)

在价格表中可以看到，Lade 的免费额度有 1 核心 128MB 内存 1GB 数据库 1GB 磁盘 100GB 流量。感觉可以满足一个普通 blog 的需求， 尝试着部署个 WordPress 吧

Lade 支持 Go , Nodejs, PHP, Python ,Ruby 这几种语言。同样的支持 MariaDB，Memcached，MongoDB，Mysql，PostgreSQL，Redis 这几种不同的数据库

1. 注册并登录 **Lade**

<img src="http://img.blog.loli.wang/2024-09-14-lade/01.png" width="600" />

2. **windows** 客户端下载 并且配置环境变量 （当然如果是 Linux 就不用了，或者说你win电脑上有**wsl2**也行）

[https://github.com/lade-io/lade/releases/download/v0.1.7/lade-darwin-amd64.tar.gz](https://github.com/lade-io/lade/releases/download/v0.1.7/lade-darwin-amd64.tar.gz)

3. 下载好后配置将压缩包中的 **lade.exe** 放入 D 盘，然后配置环境变量 **D:\lade** , 并且执行指令 **lade** 看看否可以正常执行。

<img src="http://img.blog.loli.wang/2024-09-14-lade/02.png" width="600" />

<img src="http://img.blog.loli.wang/2024-09-14-lade/03.png" width="600" />

4. 创建一个应用

执行命令 **lade apps create 项目名称**

```bash
# 创建一个应用
lade apps create lade_blog

```

会提示输入账号密码 ，按照我们注册的输入，会让我们选择存储服务器的节点，我们中国离新加坡最近，所以选择 **Singapore**，这样会让我们网站对自己访问速度更快。


<img src="http://img.blog.loli.wang/2024-09-14-lade/04.png" width="600" />

这样代表应用就建立完成了

<img src="http://img.blog.loli.wang/2024-09-14-lade/05.png" width="600" />

执行 **lade apps list** 可以看到我们创建的应用

```bash
lade apps list
```

<img src="http://img.blog.loli.wang/2024-09-14-lade/06.png" width="600" />

5. 执行 lade apps deploy 命令 , 进行部署

```bash 
# 部署应用
lade apps deploy lade_blog

# 查看部署状态
lade apps show lade_blog
```

<img src="http://img.blog.loli.wang/2024-09-14-lade/07.png" width="600" />

查看我们部署的测试文件 

<img src="http://img.blog.loli.wang/2024-09-14-lade/08.png" width="600" />


接下来我们将 Wordpress 部署到 Lade 上 ，将我们的wordpress 源码放置在lade创建的根目录下

<img src="http://img.blog.loli.wang/2024-09-14-lade/09.png" width="600" />

虽然这样能够正常跑起 PHP 的程序，但是他有一些问题，一些wordpress所需要用到的拓展没有安装，所以不能用这种单纯上传文件的方式去使用。

<img src="http://img.blog.loli.wang/2024-09-14-lade/10.png" width="600" />

<img src="http://img.blog.loli.wang/2024-09-14-lade/11.png" width="600" />


## 配置 Composer

可以看到，他的介绍是如果想支持其他的拓展，需要用到 composer 的支持， composer 是 PHP的包管理器，类似于node中的npm。 

安装好composer 后，执行 **composer --version** 查看是否安装成功。

<img src="http://img.blog.loli.wang/2024-09-14-lade/12.png" width="600" />

配置好 composer 后，我们执行 **composer init** 命令，生成一个 composer.json 文件。

<img src="http://img.blog.loli.wang/2024-09-14-lade/13.png" width="600" />