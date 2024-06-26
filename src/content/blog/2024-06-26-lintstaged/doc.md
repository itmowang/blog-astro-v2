---
title: "husky + eslint + lint-staged 进行代码规范检测并修复代码"
description: "husky + eslint + lint-staged 进行代码规范检测并修复代码"
pubDate: "2024-06-24 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-06-26-lintstaged/01.png"
tags:
    - Husky配合ESLint
    - 跨域解决
    - 前端进阶
---

上次配置好了eslint ，在我们每次提交代码的时候就进行代码检测，这次我们写上配置lint-staged 进行代码修复。

### 安装 lint-staged

```bash
# 安装指令
pnpm add lint-staged -D
```

### 在package.json中添加lint-staged的配置


```json
"lint-staged":{
    "*.js":"eslint --fix",
    "*.ts":"eslint --fix"
}
```

修改 git hooks 钩子，每次提交的时候让他执行 **eslint --fix**


```bash
echo "npx eslint --fix" > .husky/pre-commit
```

## 测试一下

![2](http://img.blog.loli.wang/2024-06-26-lintstaged/01.png)


可以看到我们错误的代码格式已经帮我们解决了，并且严格按照规则给我们编写修复了代码。 （上面有test警告单纯是插件未安装问题 无关紧要）

![2](http://img.blog.loli.wang/2024-06-26-lintstaged/02.png)