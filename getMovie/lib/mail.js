const nodemailer = require('nodemailer');
const utils = require('utility');
const fs = require('fs');
const path = require('path');

/*router send email*/
const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465, // SMTP 端口
    auth: {
        user: 'm13538489980@163.com',
        pass: 'clz123456'
    }
});
const mailOptions = {
  from: 'm13538489980@163.com', // 发件地址
  to: '1594546640@qq.com', // 收件列表
  subject: '最新电影资源', // 标题
  html: '', // html 内容
  attachments:[
  	{
  		filename:"movies.html",
  		path:"./getMovie/doc/movies.html"
  	}
  ]
};

exports.send = function(){
	transporter.sendMail(mailOptions,function(err, info){
		if(err){
		    console.log("错误：", err);
		    return;
		} else {
		    console.log('Message sent: ' + info.response);
		}
	});	
}
