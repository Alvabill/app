const express = require("express");
const app = express();
const router = express.Router();

const charset = require('superagent-charset');
const request = charset(require('superagent'));
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const mail = require('./mail.js');

router.get('/',function(req,res){
	var url_data = [];
	fs.readFile(path.join(__dirname,'../doc','movies.txt'),'utf-8',(err, data)=>{
		if(err)throw err;
		url_data = data.split('\n').filter(function(n){
			return n != '';
		});//console.log(url_data);
		var str = '<div style="width:50%;margin:auto;">';
        str += '<h4 style="padding-left:10px;">(温馨提示：复制ftp开头的路径到‘迅雷极速版’自动下载电影, 最新免费电影节目单不定时更新)</h4>'
        item.forEach(m => {
            str += '<h3 style="padding-left:10px;">' + m.name + '</h3>';
            m.data.forEach((n) => {
                url_data.forEach(j => {
                    var name = j.split('~~')[0];
					name = name.split('.')[0];
                    if (n.title.indexOf(name) > -1) {
						n.download_url = j.split('~~')[1];
						n.download_url = n.download_url.replace(/磁力链下载点击这里/, '');
                    }
				});
				if(n.download_url != null){
					str += '<div style="">' +
						'<a href="' + n.href + '" style="height:30px;display:inline-block;vertical-align: middle;text-decoration:none;margin-left:6px;" target="_blank">' + n.title + '</a>' +
						'<span style="height:30px;display:inline-block;vertical-align: middle;color: red;float:right;">' + n.date + '</span>' +
						'</div>';
					str += '<div style="background:#fdfddf;border:1px solid #ccc;padding:3px 10px;margin-bottom:10px;">点击全选：<input onClick="this.setSelectionRange(0, this.value.length)" style="border:none; outline:none" value="' + n.download_url + '"></div>';
				}
			});
        });
		str += '</div>';
        fs.writeFile(path.join(__dirname,'../doc','movies.html'),str,function(){});
        res.send(str);
	});
});

router.get('/mail',function(req, res){
	mail.send();
	res.send("邮件已发送！");
});

app.use('/getMovie',router);
app.listen(port, ()=>{
	getMovies();
	console.log('Magic happens on port ' + port);
});


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
		//console.log(item);
		fs.writeFile(path.join(__dirname,'../doc','movies.txt'),'', function(){});
		item.forEach(n=>{
			n.data.forEach((m,i)=>{
				if(m.href != 'http://www.dytt8.netundefined'){
					request.get(m.href).charset().end((err, cres)=>{
						if(err){
							throw err;
						}
						var _$ = cheerio.load(cres.text);
						var download_url = _$('#Zoom table a').text();
						var title = _$('.bd3r .title_all').text();
						title = title.substring(title.indexOf('《')+1,title.indexOf('》'));
						var total_movie = title + '~~' + download_url +'\n';
						//console.log(total_movie);
						var buff = new Buffer(total_movie);
						fs.appendFile(path.join(__dirname,'../doc','movies.txt'),buff,function(){});
					});
				}
				
			});
		});
	});
}