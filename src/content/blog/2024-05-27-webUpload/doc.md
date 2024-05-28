---
title: "前端大文件切片上传以及使用webWorker"
description: "前端大文件切片上传以及使用webWorke"
pubDate: "2024-05-28 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-05-27-webUpload/01.png"
tags:
    - 前端大文件上传
    - 跨域解决
    - 前端进阶
---

常规项目日常开发的时候我们经常用到上传这个功能,一般日常的话不会有很大的文件上传，但是就是有不长眼的需求过来。 == 
 
## 切片上传优点

 - 大文件分割，切片后分批上传，减轻服务器压力
 - 断点续传，可以记录上传位置，方便上次上传未结束的操作
 - 上传进度控制的功能，不然无法知道文件是否上传的进度。
  
为什么使用web worker

 - 让线程不阻塞 ，切片 和 上传大文件是一个比较耗费时间的操作，如果在主要线程直行这个操作，容易卡死和卡顿，影响体验和效果
 - 提高性能充分利用处理器 
  



### 切片主要代码演示 

```jsx
import React, { useEffect } from "react";

const Login: React.FC = () => {
  const chunkSize = 1 * 1024 * 1024; // 1M
  // 将文件切片
  const sliceFile = (file: File) => {
    // 切片的内容存放
    const chunks = [];
    // 切片的位置
    let offset = 0;

    while (offset < file.size) {
      // 分割切片位置以及每次切片的大小
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push(chunk);
      // 切片的位置计算
      offset = offset + chunkSize;
    }
    return chunks;
  };

  // 上传的切片
  const uploadChunks = async (chunks: any) => {
    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData();
      formData.append("fileChunk", chunks[i]);

      // 发送切片上传请求
      await fetch("/update", {
        method: "POST",
        body: formData,
      });
    }
  };

  // 上传的主函数
  const uploadFile = async (file: File) => {
    const chunks = await sliceFile(file);

    await uploadChunks(chunks);
  };

  const click = () => {
    document.getElementById("upload")?.click();
  };

  useEffect(() => {
    document.getElementById("upload")?.addEventListener("change", (e) => {
      // 获得当前上传的文件
      const files = (e.target as HTMLInputElement).files?.[0];
      if (files) {
        uploadFile(files);
      }
    });
  }, []);

  return (
    <div className="login">
      <h1>大文件上传</h1>
      <button onClick={click}> 选择上传文件</button>
      <input type="file" id="upload" style={{ display: "none" }} />
    </div>
  );
};

export default Login;

```
效果如下
![1](http://img.blog.loli.wang/2024-05-27-webUpload/01.png)
![2](http://img.blog.loli.wang/2024-05-27-webUpload/02.png)



成功切片上传 但是会影响到页面卡顿 使用webworker




```jsx
//worker.ts

// 上传的切片
const uploadChunks = async (chunks: any) => {
  for (let i = 0; i < chunks.length; i++) {
    const formData = new FormData();
    formData.append("fileChunk", chunks[i]);

    // 发送切片上传请求
    await fetch("/update", {
      method: "POST",
      body: formData,
    });
  }
};

// 创建接收消息通知
this.addEventListener("message", async (event) => {
  const chunkSize = 1 * 1024 * 1024; // 1M
  const file = event.data.payload.file;
  // 切片的内容存放
  const chunks = [];
  // 切片的位置
  let offset = 0;

  while (offset < file.size) {
    // 分割切片位置以及每次切片的大小
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    // 切片的位置计算
    offset = offset + chunkSize;
  }

  //   上传切片
  await uploadChunks(chunks);

  // 通知完成
  postMessage({ type: "uploadComplete" });
});

```

主页面
```jsx
import React, { useEffect } from "react";

const Login: React.FC = () => {
  const click = () => {
    document.getElementById("upload")?.click();
  };

  useEffect(() => {
    // 创建Worker的实例，并启动实例
    const worker = new Worker("src/pages/login/worker.ts");

    document.getElementById("upload")?.addEventListener("change", (e) => {
      // 获得当前上传的文件
      const files = (e.target as HTMLInputElement).files?.[0];

      // 接收消息
      worker.addEventListener("message", (event) => {
        const { type } = event.data;
        if (type === "uploadComplete") {
          console.log("文件上传完成！");
        }
      });
      if (files) {
        // 向worker发送消息
        worker.postMessage({ type: "upload", payload: { file: files } });
      }
    });
  }, []);

  return (
    <div className="login">
      <h1>大文件上传</h1>
      <button onClick={click}> 选择上传文件</button>
      <input type="file" id="upload" style={{ display: "none" }} />
    </div>
  );
};

export default Login;

```

完成配合使用webWorker

![1](http://img.blog.loli.wang/2024-05-27-webUpload/03.png)
![2](http://img.blog.loli.wang/2024-05-27-webUpload/04.png)




# 最近状态不好。。。看上去不能写的太细节，当作demo预览吧