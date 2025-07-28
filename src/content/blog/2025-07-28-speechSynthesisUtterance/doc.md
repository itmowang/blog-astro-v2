---
title: "让浏览器发出声音 SpeechSynthesisUtterance "
description: "让浏览器发出声音 SpeechSynthesisUtterance"
pubDate: "2025-07-28 23:27:24"
heroImage: "http://img.blog.loli.wang/2025-07-28-speechSynthesisUtterance/01.png"
tags:
  - 前端进阶
  - 操作
---

## Web Speech API

Web Speech API 是一个 JavaScript API，用于让你的语音数据集成到web应用中。

语音识别通过接口使用(语音转化文字)   [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)


语音合成通过接口使用(文本转换语音播报)   [SpeechSynthesisUtterance]   (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)


## 目前只使了文本转语音

因为目前有个需求是需要把文字转成语音，在以前我会考虑把一些云厂商的tts封装好加入到程序内，但是最近发现这个api已经很完善了，考虑直接用了。


但是在使用途中遇到一些坑，使用定时器的时候，发现发现抓取的时间是空的，最开始需要等待一段时间后才能正常被文字转换语音


在网上看了解决方案，使用借鉴的案例

```js
// 引用 SpeechSynthesisUtterance 讓瀏覽器說話 - Front-End - Let's Write
// https://www.letswrite.tw/speech-synthesis-utterance/#speechsynthesisutterance

var synth = window.speechSynthesis;
function setVoices() {
  return new Promise((resolve, reject) => {
  let timer;
  timer = setInterval(() => {
    if(synth.getVoices().length !== 0) {
      resolve(synth.getVoices());
      clearInterval(timer);
    }
  }, 10);
 })
}
setVoices().then(voices => console.log(voices));
```

感谢大佬解决我的问题。


测试效果视频

<video src="http://img.blog.loli.wang/2025-07-28-speechSynthesisUtterance/01.mp4" controls="controls" width="100%" height="100%"></video>



