var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var md5 = require('md5')

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

let sessions = {

}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('含查询字符串的路径:\n' + pathWithQuery)

  if(path === '/'){
    let string = fs.readFileSync('./index.html', 'utf8')
    let cookies = ''
    if(request.headers.cookie){
      cookies = request.headers.cookie.split('; ') // ['sign_in_email=1@', 'a=1', 'b=1']
    }
    let hash = {}
    for(let i=0; i<cookies.length; i++){
      let parts = cookies[i].split('=') // ['sign_in_email', '1@']
      let key = parts[0]
      let value = parts[1]
      hash[key] = value
    }
    let mySession = sessions[hash.sessionId]
    let email 
    if(mySession){
      email = mySession.sign_in_email
    }
    let users = fs.readFileSync('./db/users', 'utf8') // string
    users = JSON.parse(users) // array
    let foundUser
    for(let i=0; i<users.length; i++){
      if(users[i].email === email){
        foundUser = users[i]
        break
      }
    }
    if(foundUser){
      string = string.replace('__username__', foundUser.email)
      string = string.replace('__password__', foundUser.password)
    }else{
      string = string.replace('__username__', '请登录')
      string = string.replace('__password__', '登录后查看')
    }
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === 'GET'){
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === 'POST'){ // 注册
    readBody(request).then((body) => { // 读取第四部分
      let strings = body.split('&') // ['email=1', 'password=2', 'password_confirmation=3']
      let hash = {}
      strings.forEach((string) => { // string == 'email=1'
        let parts = string.split('=') // ['email', '1']
        let key = parts[0]
        let value = parts[1]
        hash[key] = decodeURIComponent(value) // {'email':'1'}
      }) 
      // hash = {'email':'1', 'password':'2', 'password_confirmation':'3'}
      let {email, password, password_confirmation} = hash // ES6语法
      if(email.indexOf('@') === -1){ // 若email中不含@
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json;charset=utf-8')
        response.write(`{
          "errors": {
            "email": "invalid"
          }
        }`) // 返回一段JSON
      }else if(password !== password_confirmation){
        response.statusCode = 400
        response.write('password not match')
      }else{
        var users = fs.readFileSync('./db/users', 'utf8') // string
        try{
          users = JSON.parse(users) // 转为array
        }catch(exception){
          users = [] // 出现错误即清空，不去储存
        }
        let inUse = false
        for(let i=0; i<users.length; i++){
          let user = users[i]
          if(user.email === email){
            inUse = true
            break;
          }
        }
        if(inUse){
          response.statusCode = 400
          response.write('email in use')
        }else{
          users.push({email: email, password: password})
          var usersString = JSON.stringify(users) // 转为字符串
          fs.writeFileSync('./db/users', usersString) // 存储
          response.statusCode = 200
        }
      }
      response.end()
    })
  }else if(path === '/sign_in' && method === 'GET'){
    let string = fs.readFileSync('./sign_in.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_in' && method === 'POST'){ // 登录
    readBody(request).then((body) => {
      let strings = body.split('&') 
      let hash = {}
      strings.forEach((string) => {
        let parts = string.split('=')
        let key = parts[0]
        let value = parts[1]
        hash[key] = decodeURIComponent(value)
      })
      let {email, password} = hash
      var users = fs.readFileSync('./db/users', 'utf8') // string
        try{
          users = JSON.parse(users) // 转为array
        }catch(exception){
          users = []
        }
        let found
        for(let i=0; i<users.length; i++){
          if(users[i].email === email && users[i].password === password){
            found = true
            break
          }
        }
        if(found){
          let sessionId = Math.random() * 100000
          sessions[sessionId] =  {sign_in_email: email}
          response.setHeader('Set-Cookie', `sessionId=${sessionId}`)
          response.statusCode = 200
        }else{
          response.statusCode = 401
        }
      response.end()
    })
  }else if(path === '/default.css'){
    let string = fs.readFileSync('./default.css', 'utf8')
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    // response.setHeader('Cache-Control', 'max-age=300000000') // Cache-Control
    // response.setHeader('Expires', 'Fri, 05 Jul 2019 04:47:35 GMT')
    response.write(string)
    response.end()
  }else if(path === '/main.js'){
    let string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    let fileMd5 = md5(string)
    response.setHeader('ETag', fileMd5) // ETag
    if(request.headers['if-none-match'] === fileMd5){
      // 没有响应体
      response.statusCode = 304
    }else{
      // 有响应体
      response.write(string)
    }
    response.end()
  }else if(path === '/xxx'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    // CORS跨域，允许frank.com:8001跨域请求
    response.setHeader('Access-Control-Allow-Origin', 'http://frank.com:8001')
    response.write(`
    {
      "note":{
        "to": "小谷",
        "from": "小刚",
        "heading": "打招呼",
        "content": "hi"
      }
    }
    `)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(`
        {
          "error": "not found"
        }
      `)
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

function readBody(request){
  return new Promise((resolve, reject) => {
    let body = [] // 请求体
    request.on('data', (chunk) => { // 监听data
      body.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(body).toString() // 将所有data连接起来（因为一段一段上传的）
      resolve(body)
    })
  })  
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请在空中转体720度然后用电饭煲打开 http://localhost:' + port)