---
title: "Husky配合ESLint保证提交代码前的提交规范"
description: "Husky配合ESLint"
pubDate: "2024-06-24 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-06-24-eslint/05.png"
tags:
    - Husky配合ESLint
    - 跨域解决
    - 前端进阶
---

之前说过了husky的简单安装和使用，而我们需要在每次代码提交前做一些代码检测和代码修复，一般有很多种方式，可以依赖于cicd自动化的时候进行代码检测等工作，但是我们也可以在开发的情况下避免这些情况的发生。

ESLint 是用来检查我们写的 js 代码是否满足指定规则的静态代码检查工具。 通过用 ESLint 来检查一些规则,我们可以用来统一代码风格规则

# ESLint  的安装和使用

安装eslint
```bash
pnpm add eslint  -D
```

初始化eslint
```bash
npx eslint --init
```
根据指示选择项目配置，生成eslint的项目配置文件 **eslint.config.mjs** 

![1](http://img.blog.loli.wang/2024-06-24-eslint/01.png)


## 给项目添加 eslint的 git hooks 

上一篇文章说过如何使用Husky， 先写一个提交 **pre-commit** 的钩子，在每次提交之前进行一次检查下整个项目代码


```bash

echo "npx eslint ." > .husky/pre-commit

```

![2](http://img.blog.loli.wang/2024-06-24-eslint/02.png)


## 配置eslint

可以通过修改 **eslint.config.mjs** 文件修改你的代码的风格和规则

我给出一个我自己常用的eslint规则

``` js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-var': 'error', // 不能使用var声明变量
    'no-extra-semi': 'error',
    '@typescript-eslint/indent': ['error', 2],
    'import/extensions': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    indent: ['error', 2, { SwitchCase: 1 }], // error类型，缩进2个空格
    'space-before-function-paren': 0, // 在函数左括号的前面是否有空格
    'eol-last': 0, // 不检测新文件末尾是否有空行
    semi: ['error', 'always'], // 在语句后面加分号
    quotes: ['error', 'single'], // 字符串使用单双引号,double,single
    'no-console': ['error', { allow: ['log', 'warn'] }], // 允许使用console.log()
    'arrow-parens': 0,
    'no-new': 0, //允许使用 new 关键字
    'comma-dangle': [2, 'never'], // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，always-multiline多行模式必须带逗号，单行模式不能带逗号
    'no-undef': 0,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
};
```

## 执行测试

我们估计在我们的测试代码中写一个错误的示例，并且写上禁止使用var作为声明变量

![3](http://img.blog.loli.wang/2024-06-24-eslint/03.png)

执行代码

``` bash 
git add . 
git commit -m "Love is lonely"
```

执行结果，发现被禁止了提交 ，完成了eslint的语法规范 

![4](http://img.blog.loli.wang/2024-06-24-eslint/04.png)


### 相关文档

[eslint相关配置](https://zh-hans.eslint.org/docs/latest/use/configure/ignore)

明天写利用 husky + eslint + lint-staged 进行代码规范检测并修复代码