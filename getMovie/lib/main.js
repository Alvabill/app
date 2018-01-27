const express = require("express");
const app = express();
const router = express.Router();

const port = process.env.PORT || 3000;

router.get('/',(req,res)=>{
	res.send('hello world');
});

app.use('/getMovie',router);
app.listen(port, ()=>{
	getMovies();
	console.log('Magic happens on port ' + port);
});


const charset = require('superagent-charset');
const request = charset(require('superagent'));
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

var item = [];
function getMovies(){
	item = [];
	var url = 'http://www.dytt8.net';
	request.get(url + '/index.htm').charset().end((err,sres)=>{
		if(err){
			throw err;
		}
		var $ = cheerio.load(sres.text);
		$('.bd3rl .co_area2').each(function(i, n){ // 遍历所有选中元素
			if(i>1)return;
			var $n = $(n);
			var obj = {
				name: $n.find('.title_all strong').text(),
				data: []
			};
			$n.find('tr').each(function(i,m){
				var $m = $(m);
				obj.data.push({
					title: $m.find('.inddline').eq(0).text(),
					href: url + $m.find('.inddline').eq(0).find('a').eq(1).attr('href'),
					date: $m.find('.inddline').eq(1).text(),
					download_url: ''
				});
				//console.log(obj.data);
			});
			item.push(obj);
		});
		fs.writeFile(path.join(__dirname,'../doc','movies.txt'),'', function(){});
		item.forEach(n=>{
			n.data.forEach((m,i)=>{
				request.get(m.href).charset().end((err, cres)=>{
					var _$ = cheerio.load(cres.text);
					var download_url = _$('#Zoom table a').text();
					var title = _$('.bd3r .title_all').text();
					title = title.substring(title.indexOf('《')+1,title.indexOf('》'));
					var total_movie = title + '~~' + download_url +'\n';
					//console.log(total_movie);
					var buff = new Buffer(total_movie);
					fs.appendFile(path.join(__dirname,'../doc','movies.txt'),buff,function(){});
				});
			});
		});
	});
}