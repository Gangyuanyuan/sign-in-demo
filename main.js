window.jQuery = function(nodeOrSelector){
  let nodes = {}
  nodes.addClass = function(){}
  nodes.html = function(){}
  return nodes
}
window.$ = window.jQuery

window.jQuery.ajax = function({url, method, body, headers}){
  return new Promise(function(resolve, reject){   // 全局属性 window.Promise
    let request = new XMLHttpRequest()
    request.open(method, url) // 初始化request
    for(let key in headers){ // 设置请求头必须放在open和send之间
      let value = headers[key]
      request.setRequestHeader(key, value)
    }
    request.onreadystatechange = ()=>{
      if(request.readyState === 4){ // 证明请求响应都完毕了
        if(request.status >= 200 && request.status < 300){
          resolve.call(undefined, request.responseText) // 成功则调用resolve
        }else if(request.status >= 400){
          reject.call(undefinde, request) // 失败则调用reject
        }
      }
    }
    request.send(body) // 设置请求第四部分（请求体）
  }) 
}

myButton.addEventListener('click', (e)=>{
  window.jQuery.ajax({ // 调用ajax函数
    url: '/xxx',
    method: 'get',
    body: 'a=1&b=2',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'gang': '18'
    }
  }).then(
    (text) => {console.log(text)},
    (request) => {console.log(request)}
  )
})