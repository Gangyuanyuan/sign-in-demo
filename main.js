myButton.addEventListener('click', (e)=>{
    let request = new XMLHttpRequest()
    request.open('get', '/xxx') // 初始化request
    request.send()
    request.onreadystatechange = ()=>{
      if(request.readyState === 4){ // 请求响应都完毕了
        if(request.status >= 200 && request.status < 300){
          console.log('请求成功')
          let string = request.responseText // 把符合JSON语法的字符串转换成JS对应的值
          let object = window.JSON.parse(string)  // JSON.parse是浏览器提供的
        }else if(request.status >= 400){
          console.log('请求失败') 
        }
      }
    }
})