---
title: "[学习] Token、Embedding 与向量空间"
description: "[学习] Token、Embedding 与向量空间"
pubDate: "2026-01-06 23:27:24"
heroImage: "http://img.blog.loli.wang/2026-01-06-Agent002/01.png"
tags:
  - 大模型学习
  - 大模型
---



# Token、Embedding 与向量空间

在上一节中讲到，LLM 的本质是**一个在给定上下文条件下，预测下一个 token 概率分布的函数**。那么 Token 到底是什么，为什么 LLM 要以 token 为单位，以及由此而来的 Embedding 和向量空间的概念。

## 一、什么是 Token，为什么 LLM 的基本单位是 Token

要真正理解 Token，必须回到计算机处理文字的底层逻辑。不能只停留在当下的 AI 浪潮中，而需要**回到一个更根本的问题**：**计算机究竟是如何“看到”文字的？**

### 1. 追根溯源：从二进制到字符

计算机的世界里，**唯一真实存在的只有二进制**。无论是文字、图片还是代码，最终都必须被表示为 0 和 1。因此，计算机并不能直接理解 `A`、`你`、`+` 等字符，它真正能处理的只有类似 `01000001` 这样的形式。

### 2. 编码（Encoding）：字符进入计算机的第一步

为了让计算机“识别”人类的文字，出现了 **编码（Encoding）** 的概念——**用数字去代表字符**。最早被广泛使用的是 **ASCII 编码**：每个字符用 8 位二进制数表示，覆盖英文字符、数字和少量符号。例如：`A` → 十进制 `65`，`B` → 十进制 `66`。ASCII 解决了英文世界的问题，但它无法表示中文、日文等非拉丁字符。

### 3. Unicode：让“所有字符”都能被编码

为了解决多语言问题，**Unicode** 体系诞生了（常见实现如 UTF-8）。它的目标很明确：**为世界上每一个字符分配一个唯一编号**。在这一阶段，计算机已经可以显示中文、存储多语言文本并正确传输字符序列。

### 4. Token 的出现：从“编码”走向“统计压缩”

Token 的意义，正是在这里发生了质变。与 ASCII / Unicode 不同，**Token 不再只是编码方案**，而是一种基于语料统计的 **压缩与建模方式**：**把经常一起出现的字符序列，打包成一个更高层级的单位**。

换句话说：编码关心的是“这个字符用哪个数字表示？”Token 关心的是：“哪些字符经常一起出现，值得被当成一个整体？”

### 5. 一个直观对比：同一句话在不同层级下的表示

比如“人工智能”这几个字在编码和 Token 的不同表示：

| 层级 | 表示方式 |
| :--- | :--- |
| ASCII / Unicode | `人` `工` `智` `能` |
| Token | `人工` `智能` |

可以看到，层级越低 → 越接近机器，序列越长；层级越高 → 越接近人类语义，结构越清晰。

### 6. 为什么 LLM 的基本单位是 Token

当前主流 LLM 的核心架构是 Transformer，而 Transformer 在底层本质上只支持 **加法、乘法和矩阵运算**。这意味着：**任何进入模型的东西，必须先被表示为数字**，模型无法直接理解或计算人类语言中的字符串、字符或词语。

因此，文本在进入模型之前，必须先被切分为 **Token**，再映射为对应的 **Token ID**，并进一步转换为向量表示（Embedding），才能参与注意力计算、矩阵运算以及梯度反向传播。在这一计算范式下，Token 不仅是一种文本表示方式，而是 Transformer **唯一能够感知和操作的语言单位**。模型所展现出的理解、推理与生成能力，全部涌现自 Token 级别的数值计算之上。

---

## 二、Embedding 是什么，它解决了什么问题

### 1. Embedding 是什么

在 LLM 中，Token 本身只是一个 **离散 ID（整数）**，例如 `12345`。这个数字对模型没有任何语义含义，ID 之间的大小、距离也毫无意义。Embedding 的作用，就是把这些离散、无序的 Token ID 映射到一个 **连续的高维向量空间** 中，使模型能够用数学方式刻画它们之间的**相似性、方向性和组合关系**。

在这个向量空间里，语义相近的 Token 会拥有相近的向量表示，不同语义则体现为不同的方向或距离，从而让注意力机制和矩阵运算“看见”语言结构与语义关系。简单来说，它是将离散的数字 ID 转化为一个**高维连续向量**（由数百或数千个实数组成的数组）的过程。

以“人工智能”为例，过程如下：
1. **原始文本**：“人工智能”
2. **Token 化**：切分为 `[人工, 智能]`
3. **Token ID**：转换为离散数字 `[3421, 5678]`
4. **Embedding 层**：
   * `3421` → `[0.12, -0.45, 0.88, ...]` (1536 个数字)
   * `5678` → `[0.34, 0.11, -0.92, ...]` (1536 个数字)

### 2. 它解决了什么核心问题？

在 Embedding 出现之前，计算机通过 **One-hot Encoding（独热编码）** 来处理文字。这种传统方式存在两个致命缺陷，而 Embedding 完美解决了它们：

#### A. 解决“语义孤岛”问题（语义关联性）
* **旧问题**：在独热编码中，任何两个词的向量乘积都为 0。计算机认为“猫”和“狗”的距离，与“猫”和“手机”的距离是一样远的。它无法理解词语之间的含义联系。
* **Embedding 方案**：它将词语映射到一个**语义空间**。在这个空间里，意思相近的词（如“猫”和“小猫”）在几何距离上会靠得很近，而无关的词则很远。

#### B. 解决“维度灾难”问题（存储效率）
* **旧问题**：如果词表有 10 万个词，每个词都需要一个 10 万维的向量，且里面全是 0，极度浪费空间。
* **Embedding 方案**：它通过“降维打击”，用一个固定长度（如 GPT-3 的 12288 维）的**稠密向量**来表达。这个向量不仅省空间，还能承载极其丰富的语义细节。

### 3. Embedding 的特性：语义运算

Embedding 最神奇的地方在于，它让语言具备了**数学运算**的可能性。在一个训练良好的 Embedding 空间中，你可以发现类似“类比”的逻辑关系。这说明模型已经“理解”了：**女王之于女性，等同于国王之于男性。** 这种性别、时态、甚至是逻辑上的关系，都被编码进了这些数字里。

*(注：此处 Notebook 中包含一段 3Blue1Brown 的视频展示代码)*

---

## 实战: 生成 Embedding

```python
from sentence_transformers import SentenceTransformer
import pandas as pd

# 选择模型
model = SentenceTransformer("all-MiniLM-L6-v2")

# 生成embedding
model.encode('dog')
```

**输出结果：**
```text
array([-5.31470478e-02,  1.41944205e-02,  7.14570703e-03,  6.86086714e-02,
       -7.84803182e-02,  1.01674581e-02,  1.02283150e-01, -1.20648630e-02,
        ...
        1.11444503e-01,  2.98568588e-02,  2.39054970e-02,  1.10093102e-01],
      dtype=float32)
```

---

## 三、相似性在向量空间中如何体现

LLM 里的“相似”是指**向量方向相近**。常用指标是 **Cosine Similarity（余弦相似度）**：
* `cos(θ) → 1`：非常相似
* `cos(θ) → 0`：无关
* `cos(θ) → -1`：相反

*(注：此处 Notebook 中包含一段关于词向量相似度的视频展示代码)*

---

## 实战: 计算相似度

```python
import numpy as np

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    
pairs = [
    ("北京", "上海"),
    ("北京", "东京"),
    ("北京", "苹果"),
    ("Python", "Java"),
    ("Python", "香蕉")
]

for a, b in pairs:
    sim = cosine_similarity(model.encode(a), model.encode(b))
    print(f"{a} vs {b}: {sim:.3f}")
```

**输出结果：**
```text
北京 vs 上海: 0.378
北京 vs 东京: 0.836
北京 vs 苹果: 0.173
Python vs Java: 0.450
Python vs 香蕉: 0.072
```

---

## 四、类比在向量空间中如何体现

Embedding 不仅能表示“相似”，还能隐式表达**关系本身**。在高维向量空间中，**两个词向量的差值，并不是随机噪声，而往往对应一种稳定的语义方向**。

经典例子是：`国王 - 男人 + 女人 ≈ 女王`

这并不是模型“会算术”，而是因为 `国王 - 男人` 抽取出了“**王权但不含性别**”的语义方向，再加上 `女人`，就把性别维度切换为女性，得到的向量自然靠近 `女王`。因此可以说明，关系本身可以被表示为向量方向，某些语义关系在不同词之间是**可迁移、可复用的**。

*(注：此处 Notebook 中包含一段关于词向量类比的视频展示代码)*

---

## 实战: 类比

```python
import numpy as np

# 假设这是从预训练模型中提取的 4 维 Embedding 向量（实际模型通常是 768 或 1536 维）
# 每一维可能隐含代表：[权力, 性别(男为正,女为负), 生物性, ... ]
embeddings = {
    "king":   np.array([0.9,  0.8,  1.0, 0.1]),
    "man":    np.array([0.1,  0.9,  1.0, 0.0]),
    "woman":  np.array([0.1, -0.9,  1.0, 0.0]),
    "queen":  np.array([0.9, -0.8,  1.0, 0.1]),
    "apple":  np.array([0.0,  0.0,  0.0, 0.9])  # 干扰项
}

def find_closest(target_vec, word_dict):
    best_word = None
    max_sim = -1
    for word, vec in word_dict.items():
        sim = np.dot(target_vec, vec) / (np.linalg.norm(target_vec) * np.linalg.norm(vec))
        if sim > max_sim:
            max_sim = sim
            best_word = word
    return best_word, max_sim

# 1. 执行向量运算：国王 - 男人 + 女人
result_vec = embeddings["king"] - embeddings["man"] + embeddings["woman"]

# 2. 在空间中寻找离结果最近的词
closest_word, similarity = find_closest(result_vec, embeddings)

print(f"运算结果向量指向的词是: {closest_word}")
print(f"相似度得分: {similarity:.4f}")
```

**输出结果：**
```text
运算结果向量指向的词是: queen
相似度得分: 0.9947
```

---

## 五、联想是如何发生的

当你向 LLM 输入一个词或一句话时，模型并不会像人类一样“联想到相关事物”，而是输入会把模型的注意力和概率分布推向某个高密度的语义区域。

例如，当你输入 `医院`，在向量空间中，与“医院”语义最接近、共现频率最高的 Token 会被优先激活，因此模型更容易继续生成：
* 医生
* 病人
* 手术
* 治疗

这看起来像是“联想”，但本质上并不是主动思考，而是在一个已经被大量语料反复强化的高密度区域中继续采样下一个 Token。换句话说，模型并不是在“想到医生”，而是在统计意义上，**“医生”是此刻概率最高的延续结果**。

---

## 实战: 联想

```python
import numpy as np

# 1. 定义词表与简化的 Embedding 向量
# 每一维可能代表 [生命健康, 科技, 生活琐事]
vocab = {
    "医院": np.array([0.9, 0.1, 0.2]),
    "医生": np.array([0.85, 0.2, 0.3]),
    "病人": np.array([0.8, 0.0, 0.4]),
    "手术": np.array([0.95, 0.3, 0.1]),
    "代码": np.array([0.1, 0.9, 0.1]),
    "咖啡": np.array([0.2, 0.1, 0.8])
}

def simulate_association(input_word):
    if input_word not in vocab:
        return "词不在词表中"
    
    input_vec = vocab[input_word]
    probabilities = {}

    # 2. 计算输入词与词表中所有词的相似度（激活强度）
    for word, vec in vocab.items():
        if word == input_word: continue
        similarity = np.dot(input_vec, vec) / (np.linalg.norm(input_vec) * np.linalg.norm(vec))
        # 将相似度转化为激活概率（简化版的 Softmax）
        probabilities[word] = np.exp(similarity * 10) 

    # 3. 归一化概率
    total_prob = sum(probabilities.values())
    for word in probabilities:
        probabilities[word] /= total_prob

    sorted_probs = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
    return sorted_probs

# 模拟输入“医院”
associations = simulate_association("医院")

print("--- 输入词：医院 ---")
print("模型后续 Token 的激活概率分布：")
for word, prob in associations:
    print(f"Token: [{word}] -> 出现概率: {prob:.4f}")
```

**输出结果：**
```text
--- 输入词：医院 ---
模型后续 Token 的激活概率分布：
Token: [医生] -> 出现概率: 0.3717
Token: [手术] -> 出现概率: 0.3290
Token: [病人] -> 出现概率: 0.2972
Token: [咖啡] -> 出现概率: 0.0018
Token: [代码] -> 出现概率: 0.0002
```


[原文链接 Agent-100-Days Token、Embedding 与向量空间](https://github.com/flingjie/Agent-100-Days/blob/main/week1/02.Token%E3%80%81Embedding%E4%B8%8E%E5%90%91%E9%87%8F%E7%A9%BA%E9%97%B4.ipynb)
