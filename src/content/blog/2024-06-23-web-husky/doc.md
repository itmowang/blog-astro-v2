---
title: "husky 的安装和使用"
description: "husky的使用"
pubDate: "2024-06-23 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-06-23-web-husky/01.png"
tags:
    - husky的使用
    - 跨域解决
    - 前端进阶
---


## 什么是husky

    Husky 是一个用于 Git hooks 的工具，它能够在特定的 Git 操作（如 commit、push 等）之前或之后自动运行脚本，从而帮助开发者保持代码质量、执行代码检查、自动化任务等。将白了，用来约束git的。

## 安装并使用husky

1. 安装

``` bash
# npm 安装
npm install husky -D
# yarn 安装
yarn add husky -D
#pnpm 安装 
pnpm add husky -D
```

2. 配置husky

在给前端项目配置husky的之前一定要给项目建立版本控制

```bash
# 建立 git 版本控制
git init

```

使用指令创建husky配置, 会自动创建.husky文件夹，里面会包含git hooks的配置等。

```bash
# 指令创建 (老版本是这样)
npx husky install
# 指令创建 (新版本)
npx husky init

```

![1](http://img.blog.loli.wang/2024-06-23-web-husky/01.png)


测试配置是否成功

``` bash
git commit -m "Keep calm and commit"
```
 
可以看到我们提交命令被拦截了，不能被自由的正常使用git commit

![2](http://img.blog.loli.wang/2024-06-23-web-husky/02.png)


3. 创建husky钩子

创建一个husky钩子，让我们使用 npm test 的时候执行 .husky/pre-commit 的提交规则

```bash
echo "npm test" > .husky/pre-commit
```

可以看到.husky 文件夹中增加了一个 pre-commit的文件

![3](http://img.blog.loli.wang/2024-06-23-web-husky/03.png)

里面会有一个 npm test 的指令代表 你每次执行 git commit 的时候就会先执行 npm test 指令，然后再走正常的git commit

![4](http://img.blog.loli.wang/2024-06-23-web-husky/4.png)


-------- 剩下的交给下个文章再写 《使用husky提交代码时使用eslint检测代码》