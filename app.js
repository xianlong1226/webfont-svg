const webfont = require('./webfont/dist/index.js').default



	const express = require('express');
	const path = require('path');
	const fs = require('fs');
	const favicon = require('serve-favicon');
	const logger = require('morgan');
	const cookieParser = require('cookie-parser');
	const bodyParser = require('body-parser');
	const ejs = require('ejs');
	
	let app = express();
	
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(cookieParser());
	
	//template engine
	// app.set('views', path.join(__dirname, 'views')); //设置res.render函数查找的目录
	// app.engine('.html', ejs.__express); //设置模板引擎为html
	// app.set('view engine', 'html');
	
	//static file
	app.use('/page',express.static(__dirname + '/static/page'));
	app.use('/js',express.static(__dirname + '/static/js'));
	app.use('/css',express.static(__dirname + '/static/css'));
	app.use('/images',express.static(__dirname + '/static/images'));
	app.use('/fonts',express.static(__dirname + '/static/fonts'));

	var unicodeArray = [
		{a: '&#xEA0F;', b: 0xEA0F}, 
	{a: '&#xEA0A;', b: 0xEA0A},
	{a: '&#xEA01;', b: 0xEA01},
	{a: '&#xEA04;', b: 0xEA04},
	{a: '&#xEA09;', b: 0xEA09},
	{a: '&#xEA06;', b: 0xEA06},
	{a: '&#xEA0B;', b: 0xEA0B},
	{a: '&#xEA02;', b: 0xEA02},
	{a: '&#xEA05;', b: 0xEA05},
	{a: '&#xEA03;', b: 0xEA03},
]

function shuffle(a) {
  return a.concat().sort(function(a, b) {
    return Math.random() - 0.5;
  });
}

	app.get('/index/getnumber', function(req, res) {
		var phone = "13691168141";

		let arr = [];
		for(let i = 0; i < phone.length; i++) {
			let n = phone[i];
			arr.push(unicodeArray[n].a)
		}

		res.json({ "status": "success", "data": arr.join(""), "message": "" });
	})

	app.get('/change', function(req, res) {
		unicodeArray = shuffle(unicodeArray);
		
		var arr = [];
		unicodeArray.forEach(item => {
			arr.push(item.b);
		})

		webfont({
			files: 'svgs/*.svg',
			fontName: 'my-font-name',
			template: 'css',
			unicodeArray: arr
		})
		.then((result) => {
			console.log(result);
			fs.writeFileSync('./static/fonts/my-font.svg', result.svg, 'utf8')
			fs.writeFileSync('./static/fonts/my-font.ttf', result.ttf)
			fs.writeFileSync('./static/fonts/my-font.eot', result.eot)
			fs.writeFileSync('./static/fonts/my-font.woff', result.woff)
			fs.writeFileSync('./static/fonts/my-font.woff2', result.woff2)
	
			fs.writeFileSync('./static/fonts/my-font.css', result.styles)

			res.json({ "status": "success", "data": "", "message": "" });
		});
	})
	
	// 处理404
	app.use(function(req, res, next) {
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	
	// 这里处理所有传递给next()的err
	// 开发环境处理
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			console.error(err.stack);
			res.status(err.status || 500);
			res.json({"result":"error","message":err.stack});
		});
	} else {
		// 生产环境处理
		app.use(function(err, req, res, next) {
			console.error(err.stack);
			res.status(err.status || 500);
			res.json({"result":"error","message":err.stack});
		});
	}
	
	//监听端口
	let port = process.env.PORT || 3021;
	app.listen(port, function(req, res) {
		console.log('listen http://127.0.0.1:' + port);
	});