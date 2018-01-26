var http = require('http');

var testHttp = http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type':'text-plain'});
	response.end('hello world\n');
}).listen(3000);

var printHttp = http.createServer(function (request, response) {
    var body = [];

    console.log(request.method);
    console.log(request.headers);

    request.on('data', function (chunk) {
        body.push(chunk);
    });

    request.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
}).listen(8000);

var getPage = http.get('http://www.baidu.com/', function (response) {
    var body = [];

    console.log(response.statusCode);
    console.log(response.headers);

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
});

exports.testHttp = testHttp;
exports.printHttp = printHttp;
exports.getPage = getPage;