# nodejs-test

## 第一版
* 进入目录：<br>
`cd nodejs-test`<br>
* 启动应用：<br>
`node server.js 8888` 或 `node server 8888`<br>

## 第二版
frank.com 请求 jack.com 的内容，实现跨域请求。<br>
* 进入目录：<br>
`cd nodejs-test`<br>
* 启动应用：<br>
分别启动 `node server 8001` 和 `node server 8002`<br>
* 浏览器：<br>
分别打开 `frank.com:8001` 和 `jack.com:8002`<br>
在 frank.com:8001 页面点击按钮，请求 jack.com:8002 成功。
