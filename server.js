var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

// 跨域处理 tomcat输出界面的话不需要对java服务的接口做跨域处理，删掉这部分内容也没问题，为了少做改动，不必做调整
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	if (req.method === 'OPTIONS') {
		res.send('OK!');
		return;
	}
	next();
})

// 处理图片、js、css等静态资源地址，需要把 authentication 映射成 build文件夹的路径
app.use('/build', express.static(__dirname + '/build'));

// 处理路由，如果是 examination 开头的路由 输出build下的index.html文件
app.use('/along',function(req,res,next){
    var fileName="./build/index.html";
    fs.readFile(fileName,function(err,data){ // fs 是node读取文件的模块，这个方法的意思就是读取index文件内容，然后输出到页面上
        if(err)
        res.write("对不起，您所访问的路径出错");
        else{
            res.write(data);
        }
    })
})

// 处理 login 的路由，跳转到登录页，输出build下的index.html文件（静态资源只有一个入口，因为是单页应用，另外也为了保持前端版本一致）
app.get('/login',function(req,res,next){
    var fileName="./build/index.html";
    fs.readFile(fileName,function(err,data){
        if(err)
            res.write("对不起，您所访问的路径出错");
        else{
            res.write(data);
        }
    })
})

// 重定向到登录页面
app.get('/',function(req,res,next){
    res.redirect('/login');
})

app.listen(8082, function(){
	console.log('open on point 8082');
})
