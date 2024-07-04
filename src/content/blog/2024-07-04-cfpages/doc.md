---
title: "使用CloudFlare的Pages服务部署自己的前端项目"
description: "使用CloudFlare的Pages服务部署自己的前端项目"
pubDate: "2024-07-04 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-07-04-cfpages/02.png"
tags:
  - CloudFlare
  - Pages
  - 前端进阶
---


因为最近在折腾SSR项目，看上了Cloudflare的Worker可以部署Node项目，所以打算写几篇CloudFlare利用的文章。之前也有写过使用利用CloudFlare进行反向代理

[CloudFlare Worker 反向代理 github 给静态博客做图床](https://blog.loli.wang/blog/2023-8-21-cfworkerproxy/doc/index.html)

### 使用Cloudflare的Pages部署自己的前端静态项目


先给自己项目安装 Wrangler ,Wrangler 需要 Node 版本大于 16.17.0+ 才能够正常运行。

```bash
#npm 
npm install wrangler --save-dev 
#pnpm
pnpm add wrangler --save-dev 
```

先登录并授权项目

```bash
npx wrangler login
```


![4](http://img.blog.loli.wang/2024-07-04-cfpages/04.png)
![5](http://img.blog.loli.wang/2024-07-04-cfpages/05.png)

给项目安装好**Wrangler**并授权后，可以执行**npx wrangler pages project create**  帮忙快速建立配置。可以看到我们建立的是名为mw-blog的项目名称，并且给了一个测试地址，在Cloudflare Workers管理页面也可以看到有新增相关的项目
```bash
npx wrangler pages project create
```
![1](http://img.blog.loli.wang/2024-07-04-cfpages/01.png)
![2](http://img.blog.loli.wang/2024-07-04-cfpages/02.png)

然后自己手动创建**wrangler.toml**文件自行配置。

目前写了个简单的配置 

```bash

name = "mw-blog"  # 对应 Cloudflare Workers 刚刚创建的项目名
compatibility_date = "2024-07-04"    # 变更兼容日期
pages_build_output_dir = "./docs"  # 你需要上传打包的目录
send_metrics = false

```
![3](http://img.blog.loli.wang/2024-07-04-cfpages/03.png)

然后编写我们的前端项目的指令，修改package.json, 增加新的指令

```json
{
  "deploy": "npx wrangler pages deploy"
}
```
![7](http://img.blog.loli.wang/2024-07-04-cfpages/07.png)


### 执行发布 

```bash
# npm
npm run deploy

#pnpm 
pnpm run deploy
```

![8](http://img.blog.loli.wang/2024-07-04-cfpages/08.png)

打开给我们的测试页面

![9](http://img.blog.loli.wang/2024-07-04-cfpages/09.png)

成功

### 总结
 
 CloudFlare Pages  还有很多部署方式，比如和github关联，通过插件，通过流水线等等都可以进行一个非常快速的部署。 这只是介绍最简单最轻松的一种。看自己的个人灵活利用咯。

### 相关资料

[CloudFlare Pages ](https://developers.cloudflare.com/pages/)