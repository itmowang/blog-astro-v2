---
title: "[学习] 大语言模型到底在干什么"
description: "[学习] 大语言模型到底在干什么"
pubDate: "2026-01-06 23:27:24"
heroImage: "http://img.blog.loli.wang/2026-01-06-Agent001/01.png"
tags:
  - 大模型学习
  - 大模型
---

# 大语言模型到底在干什么

在开发 Agent 之前，我们需要先理解一个最核心的组件：大语言模型（Large Language Model, LLM）。
早期的模型只是“复读机”，经历了从“统计概率”到“深度学习”，再到“通用人工智能”原型的三次跨越后，现在的 LLM 具备了世界模型（World Model）的雏形。

主要发展过程如下：

#### **1. 萌芽期：统计与神经网络（2013 - 2017）**

* **关键技术**：Word2Vec, RNN, LSTM。
* **特征**：这一时期的模型主要用于翻译和情感分析。虽然能处理序列，但“记性”不好，难以理解长文本，更无法进行复杂的逻辑推理。
* **局限**：模型规模小，且必须针对特定任务（如下棋、翻译）进行专项训练。

#### **2. 转折点：Transformer 的诞生（2017 - 2019）**

* **里程碑**：Google 发布论文 *Attention is All You Need*，提出了 **Transformer** 架构。
* **特征**：引入了“自注意力机制（Self-Attention）”，让模型能够并行处理数据并捕捉长距离的语义联系。
* **代表作**：BERT（理解力强）和 GPT-1/2（生成能力初现）。

#### **3. 爆发期：大规模预训练与涌现能力（2020 - 2022）**

* **里程碑**：GPT-3 的发布。
* **特征**：人们发现，当模型参数达到千亿级别时，会产生**“涌现能力（Emergent Abilities）”**——模型开始具备零样本学习（Zero-shot）和上下文学习（In-context Learning）能力，不再需要为每个小任务微调。
* **社会化**：ChatGPT 的出现标志着 LLM 正式具备了强大的指令遵循和多轮对话能力。

#### **4. 现状：从 ChatBot 迈向 Agent（2023 至今）**

* **核心逻辑**：模型不再仅仅是“聊天工具”，而是作为**推理引擎**。
* **特征**：随着推理能力（Reasoning，如 OpenAI o1, DeepSeek-R1）和多模态能力（Vision）的突破，模型可以自主规划步骤、调用工具、观察反馈并修正行为。
* **趋势**：长文本支持（Long Context）、低延迟流式输出以及与现实世界接口的深度整合。

下面将从开发者的视角出发，了解和学习LLM相关的知识

## 一、什么是 LLM（大语言模型）

简单来说，LLM 是一种通过在海量文本数据上进行训练，学会了“预测下一个Token”的深度学习模型。

### 1. 从三个维度理解 LLM

#### **“大” (Large)**

这里的“大”通常指两个方面：

* **参数量大**：模型内部拥有数十亿甚至上万亿个可调节的参数（如 GPT-4, Llama 3）。
* **数据量大**：训练数据涵盖了互联网上的书籍、代码、论文、对话等几乎人类所有的公开知识。

#### **“语言” (Language)本**

对于 LLM 来说，语言不仅是人类的谈话，还包括：

* **程序代码**（逻辑的体现）
* **数学公式**（严谨性的体现）
* **结构化数据**（如 JSON、XML，是 Agent 调用工具的基石）

#### **“模型” (Model)**

LLM 本质上是一个极其复杂的概率模型。当你给它一个开头（Prompt）时，它在计算：**“基于我读过的所有书，接下来的哪一个字最合理？”**

### 2. LLM 的核心技术：Transformer 架构

目前几乎所有主流的 LLM（GPT, Claude, Gemini, DeepSeek）都基于 **Transformer** 架构。它最核心的创新是 **自注意力机制 (Self-Attention)**。

* **并行处理**：不同于早期的模型必须逐字阅读，Transformer 可以同时“观察”整句话。
* **上下文联系**：它能理解长句子中不同词语之间的深层关联。例如在“苹果公司发布了新手机，它很受欢迎”中，模型能准确知道“它”指的是“手机”还是“苹果公司”。

### 3.大语言模型的本质
从本质看，**LLM 是一个在给定上下文条件下，预测下一个 token 概率分布的函数。**
当你向 LLM 输入一段文本时，例如：

> “今天北京的天气很……”

模型并不是在“理解天气”，而是在内部执行这样一件事：

`P(下一个 token | 已有的所有 token)`

它会对词表中的所有 token 计算一个概率分布，例如：

| token | 概率      |
| ----- | ------- |
| 冷     | 0.31    |
| 好     | 0.27    |
| 热     | 0.18    |
| 不错    | 0.12    |
| 🍎    | 0.00001 |

然后根据采样策略（temperature、top-p 等），**选出一个 token**，拼接到已有文本后面，再继续预测下一个。

```python
from IPython.display import HTML, display

display(HTML("""
<figure>
  <video width="600" controls>
    <source src="./raw/transformer.mp4" type="video/mp4">
  </video>
  <figcaption style="font-size: 12px; color: gray; margin-top: 4px;">
    （来源：3Blue1Brown）
  </figcaption>
</figure>
"""))
```

### 实战：观察token粒度

```python
import tiktoken

def analyze_tokens(model_name, text_list):
    # 加载对应的编码器
    enc = tiktoken.encoding_for_model(model_name)
    
    print(f"--- 使用模型: {model_name} ---")
    print(f"{'文本内容':<30} | {'字符数':<5} | {'Token数':<5} | {'切分结果'}")
    print("-" * 80)
    
    for text in text_list:
        tokens = enc.encode(text)
        # 将 token id 转换回文字，方便查看切分细节
        token_strings = [enc.decode([t]) for t in tokens]
        
        print(f"{text:<30} | {len(text):<8} | {len(tokens):<8} | {token_strings}")

# 准备测试样本
samples = [
    "你好，今天天气不错。",        # 普通中文句子
    "深度学习卷积神经网络",        # 专业术语
    "Using LangChain 部署 Agent", # 中英混合
    "龘龘靐齉爩"                  # 生僻字（极端情况）
]

analyze_tokens("gpt-4o", samples)
```

运行上述代码，你会发现：

* **中文句子**：通常 1 个汉字占据 1 个 Token，但标点符号也占 1 个。
* **专业术语**：由于“卷积”、“神经”等词承载频率极高，它们有时会被合并为一个 Token，或者切分得非常整齐。
* **中英混合**：英文单词通常按空格或子词（Subword）切分。比如 `Using` 是 1 个 Token，但复杂的英文单词可能被拆分。

## 二、「预测下一个 token」的真实含义

### 什么是 token

首先，需要知道的是，token 不是字、词或者句子。

而是模型词表中的**最小计算单位**。

例如，“人工智能”的token是 人 / 工 / 智能，unbelievable的token是unbelievable | un / believe / able。

模型从不“看到句子”，它只看到 **token 序列**。


### 预测的不是“内容”，而是概率

模型真正输出的是：

```text
{
  token_A: 0.42,
  token_B: 0.31,
  token_C: 0.09,
  ...
}
```

最终的“回答”，只是从这个分布中**采样**出来的结果。

## 实战: 模拟一个“假模型”

```python
context = "北京是中国的"

fake_next_token_probs = {
    "首都": 0.55,
    "城市": 0.15,
    "中心": 0.10,
    "经济": 0.05,
    "苹果": 0.01
}

fake_next_token_probs
```

```python
## 简单采样实验

import random

tokens = list(fake_next_token_probs.keys())
probs = list(fake_next_token_probs.values())

def sample_once():
    return random.choices(tokens, probs)[0]

[sample_once() for _ in range(10)]
```

这就是为什么同一个问题每次回答略有不同

## 三、为什么一个“预测器”能产生看起来像智能的行为

**关键原因语言本身就高度压缩了人类的知识、逻辑和行为模式**,LLM学到**人类在什么情况下会说什么样的话**。

LLM学到了在语料中反复出现的**问题 → 解决步骤 → 结论**, 在代码中大量存在的**代码 → 注释 → 修复**等等。

但LLM没有学的事实、规则等人类拥有的这些东西

### 实战: 破坏“智能感”

提出一个“人类觉得毫无难度”的问题，比如“现在是什么时间？”, 在**没有任何外部工具（如系统时间、浏览器、函数调用）**的情况下，LLM 往往会：

* 给出一个**模糊或泛化的回答**

  > “我无法获取实时时间，但你可以查看设备上的时间。”

* 或给出一个**看起来合理但本质回避的问题转移**

  > “时间取决于你所在的时区，目前可以通过系统时钟确认。”

* 在部分场景中，甚至会**直接“猜一个时间”**




[原文链接 Agent-100-Days 大语言模型到底在干什么](https://github.com/flingjie/Agent-100-Days/blob/main/week1/01.%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E5%88%B0%E5%BA%95%E5%9C%A8%E5%B9%B2%E4%BB%80%E4%B9%88.ipynb)
