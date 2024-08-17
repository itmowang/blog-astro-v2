---
title: "2024年了居然有人还不会搭建FRP做内网穿透"
description: "2024年了居然有人还不会搭建FRP做内网穿透"
pubDate: "2024-08-17 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-08-17-frpinit/06.png"
tags:
  - FRP
  - 内网穿透 
  - 前端进阶
---

最近不少人问我内网穿透的问题，我觉着作为一个开发者，正常可能经常会有些这种需求， 一般直接推荐 **花生壳** 、**NATAPP**等产品，但是直到问我，想要映射的端口太多怎么办，想绑定域名怎么办，不想备案怎么办，等等等这些问题。。。 我就会推荐自己搭建服务。但是纠结的是。很多人连听都没听过。


## 搭建前提

一台带有公网ip的外网服务器(VPS)



## 什么是FRP

frp 是一个专注于内网穿透的高性能的反向代理应用，支持 TCP、UDP、HTTP、HTTPS 等多种协议，且支持 P2P 通信。可以将内网服务以安全、便捷的方式通过具有公网 IP 节点的中转暴露到公网。



## 安装服务端 

去github找到最新的发布的版本,并在服务器上使用使用**uname -m**命令检查当前系统架构

https://github.com/fatedier/frp/releases/tag/v0.59.0

![1](http://img.blog.loli.wang/2024-08-17-frpinit/01.png)

```bash
# 使用wget命令下载服务端压缩包
wget https://github.com/fatedier/frp/releases/download/v0.59.0/frp_0.59.0_linux_amd64.tar.gz

# 解压到 /usr/local
tar -zxvf frp_0.59.0_linux_amd64.tar.gz -C /usr/local
```

![2](http://img.blog.loli.wang/2024-08-17-frpinit/02.png)


进入 **/etc/systemd/system/** 目录建立新的文件 **frps.service** 配置成Systemd服务

```bash
# frps.service 
[Unit]
Description=frps service
After=network.target syslog.target
Wants=network.target
[Service]
Type=simple
#Restart=always
Restart=on-failure
RestartSec=5s
#启动服务的命令
ExecStart=/usr/local/frp_0.59.0_linux_amd64/frps -c /usr/local/frp_0.59.0_linux_amd64/frps.toml
[Install]
WantedBy=multi-user.target

```
![3](http://img.blog.loli.wang/2024-08-17-frpinit/03.png)

保存 切换回我们原来的 **/usr/local/frp_0.59.0_linux_amd64** 目录，修改文件 **frps.toml** 文件

```bash

[common]
bind_addr = xx.xx.xx.xx # 你的服务器ip地址
bind_port = 7000
kcp_bind_port = 7000
vhost_https_port = 7001
dashboard_addr = xx.xx.xx.xx
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin
log_file = ./frps.log
log_level = info
log_max_days = 3
authentication_timeout = 900
token=mowangmowang
allow_ports = 2000-3000,3001,3003,4000-50000,3362
max_pool_count = 50
max_ports_per_client = 0

```

[服务端配置详情 - gofrp](https://gofrp.org/zh-cn/docs/reference/server-configures/)

![4](http://img.blog.loli.wang/2024-08-17-frpinit/04.png)

这样就差不多配置完成了。

在服务器上启动frp服务端

``` bash
# 设为开机自启
sudo systemctl enable frps
# 启动frp
sudo systemctl start frps
# 查看启动日志 
sudo systemctl status frps 
# 重启frp服务
sudo systemctl restart frps 
# 关闭frp服务
sudo systemctl stop frps 
```

![5](http://img.blog.loli.wang/2024-08-17-frpinit/05.png)

然后去网页上访问我们刚刚配置的 **ip:7500** 管理面板是否正常 ，输入我们刚刚配置文件里设置的账号密码 **admin**

![6](http://img.blog.loli.wang/2024-08-17-frpinit/06.png)

这样服务端就配置成功了 


## 客户端的使用 (WIN)

事实上服务端安装成客户端就很简单了，只不过是玩法问题，这里只告诉如何使用

下载windows包 解压到你的硬盘里

![7](http://img.blog.loli.wang/2024-08-17-frpinit/07.png)

编辑 **frpc.toml** 文件 ，并且配置简单映射下**4321**端口到外网的**2000**去


``` bash
[common]
server_addr = "你的服务器ip"
server_port = 7000
token = "mowangmowang"

[[proxies]]
name = "web"
type = "tcp"
local_ip = "127.0.0.1"
local_port  = 4321
remote_port  = 2000
```

执行命令行命令

```bash
frpc -c frpc.toml
```

![8](http://img.blog.loli.wang/2024-08-17-frpinit/08.png)

![8](http://img.blog.loli.wang/2024-08-17-frpinit/09.png)


![8](http://img.blog.loli.wang/2024-08-17-frpinit/10.png)

映射成功 


#### 相关资料

[服务端配置详情 - gofrp](https://gofrp.org/zh-cn/docs/reference/server-configures/)

[官方GITHUB - frp](https://github.com/fatedier/frp)