# webRecorder

### 浏览器录频

## 使用
- 引用
> `import webRecorder from (path)`
> `let webRecorder = new webRecorder()` // 录制浏览器
> `let webRecorder = new webRecorder('video')` // 录制浏览器中默认第一个video的视频
> `let webRecorder = new webRecorder('.video')` // 录制浏览器中默认第一个.video的视频
- 开始
> `webRecorder.start()`
- 结束 
> `webRecorder.stop()`

## 注意
- 录频结束后，会自动保存文件下载
- 录制浏览器需要用户同意录屏的部分，如果提前点击停止录频，则录频也会停止。
  
## 后续开发
- [ ] 通过配置实现更多视频格式
- [x] 增加video获取并转录视频
- [ ] 增加截图功能