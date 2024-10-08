---
title: "[问题记录] 使用 cloudflare wrangler 使用代理导致 Invalid URL"
description: "[问题记录] 使用 cloudflare wrangler 使用代理导致 Invalid URL"
pubDate: "2024-10-08 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-10-08-cfworkersbughttpPorxy/01.png"
tags:
  - 问题记录
  - 前端
  - cloudflare
---

# 因为白嫖 cloudflare 的无服务器服务 ，  开了代理导致启动一直   Invalid URL

![2](http://img.blog.loli.wang/2024-10-08-cfworkersbughttpPorxy/01.png)

同样的我去官方找了文档,也同样的，没有找到相关的说明，去官方看issues有相关的提问，但是都不了了之，最后在隔壁看到了解决方案。。。

![3](http://img.blog.loli.wang/2024-10-08-cfworkersbughttpPorxy/02.png)

![3](http://img.blog.loli.wang/2024-10-08-cfworkersbughttpPorxy/03.png)

删除 http_proxy ，再执行 wrangler dev 就可以了。

