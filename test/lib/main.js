var travel = require('./travel');
var http = require('./http');

console.log("hello world");
travel.travel("d:/nodejs/app/",function(pathname){console.log(pathname);});

console.log("服务器已开启");
http.testHttp;
http.printHttp;
http.getPage;
