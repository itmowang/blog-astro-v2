---
title: "[记录] Ubuntu 安装 dify"
description: "[记录] Ubuntu 安装 dify"
pubDate: "2026-01-11 23:27:29"
heroImage: "http://img.blog.loli.wang/2026-01-11-installdify/01.png"
tags:
  - 大模型学习
  - 大模型
---



#### 安装Dify 前需要做的准备
```bash
  # 安装Git 
  sudo apt install git -y
  # 检查是否安装成功
  git --version
  # 安装 Docker
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  # 安装 Docker Engine
  sudo apt update
  sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
  # 检查docker 安装
  docker --version
  docker compose version

 


```


#### 安装dify

```bash
 # 拉取 Dify 官方仓库 
  cd /opt
  sudo git clone https://github.com/langgenius/dify.git
  # 复制环境变量并改名
  cp .env.example .env
  # 拉取镜像并启动
  docker compose up -d 
```


http://服务器IP  直接可访问 


### 常用维护指令
```bash
# 停止服务
docker compose down
# 重新启动
docker compose up -d
# 更新 Dify
cd /opt/dify
git pull

cd docker
docker compose pull
docker compose up -d

# 完全重置
docker compose down -v

```


![1](http://img.blog.loli.wang/2026-01-11-installdify/01.png)

![2](http://img.blog.loli.wang/2026-01-11-installdify/02.png)