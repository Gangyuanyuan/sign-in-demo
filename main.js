window.jQuery = function(nodeOrSelector){
  let nodes = {}
  nodes.addClass = function(){}
  nodes.html = function(){}
  return nodes
}
window.$ = window.jQuery

window.jQuery.ajax = function({url, method, body, successFn, failFn, headers}){
// window.jQuery.ajax = function(options){
//   let url
//   if(arguments.length === 1){ // 如果用户只传一个参数
//     url = options.url
//   }else if(arguments.length === 2){ // 如果用户传两个参数
//     url = arguments[0]
//     options = arguments[1]
//   }
//   let method = options.method
//   let body = options.body
//   let headers = options.headers
//   let successFn = options.successFn
//   let failFn = options.failFn
// }
  let request = new XMLHttpRequest()
  request.open(method, url) // 初始化request
  for(let key in headers){ // 设置请求头必须放在open和send之间
    let value = headers[key]
    request.setRequestHeader(key, value)
  }
  request.onreadystatechange = ()=>{
    if(request.readyState === 4){ // 证明请求响应都完毕了
      if(request.status >= 200 && request.status < 300){
        successFn.call(undefined, request.responseText)
      }else if(request.status >= 400){
        failFn.call(undefinde, request)
      }
    }
  }
  request.send(body) // 设置请求第四部分（请求体）
}

function f1(responseText){}
function f2(responseText){}

myButton.addEventListener('click', (e)=>{
  window.jQuery.ajax({ // 调用ajax函数
    url: '/xxx',
    method: 'get',
    body: 'a=1&b=2',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'gang': '18'
    },
    successFn: (x)=>{
      console.log('success')
      f1.call(undefined, x)
      f2.call(undefined, x)
    },
    failFn: (x)=>{
      console.log('fail')
      console.log(x)
    }
  })  
})