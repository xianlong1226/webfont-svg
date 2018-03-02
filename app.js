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
app.use('/page', express.static(__dirname + '/static/page'));
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/css', express.static(__dirname + '/static/css'));
app.use('/images', express.static(__dirname + '/static/images'));
app.use('/fonts', express.static(__dirname + '/static/fonts'));

var unicodeArray = [{
		a: '&#x0030;',
		b: 0x0030
	}, // 0
	{
		a: '&#x0031;',
		b: 0x0031
	}, // 1
	{
		a: '&#x0032;',
		b: 0x0032
	}, // 2
	{
		a: '&#x0033;',
		b: 0x0033
	}, // 3
	{
		a: '&#x0034;',
		b: 0x0034
	}, // 4
	{
		a: '&#x0035;',
		b: 0x0035
	}, // 5
	{
		a: '&#x0036;',
		b: 0x0036
	}, // 6
	{
		a: '&#x0037;',
		b: 0x0037
	}, // 7
	{
		a: '&#x0038;',
		b: 0x0038
	}, // 8
	{
		a: '&#x0039;',
		b: 0x0039
	}, // 9
]

var firstPhoneNumber = [{
		a: '&#x0031;',
		b: 0x0031
	}, // 1
]

var secondPhoneNumber = [{
		a: '&#x0033;',
		b: 0x0033
	}, // 3
	{
		a: '&#x0035;',
		b: 0x0035
	}, // 5
	{
		a: '&#x0037;',
		b: 0x0037
	}, // 7
	{
		a: '&#x0038;',
		b: 0x0038
	}, // 8
]

var otherPhoneNumber = [{
		a: '&#x0030;',
		b: 0x0030
	}, // 0
	{
		a: '&#x0032;',
		b: 0x0032
	}, // 2
	{
		a: '&#x0034;',
		b: 0x0034
	}, // 4
	{
		a: '&#x0036;',
		b: 0x0036
	}, // 6
	{
		a: '&#x0039;',
		b: 0x0039
	}, // 9
]

var fontName = 'my-font-' + new Date().getTime();
var style = '';

function shuffle(a) {
	return a.concat().sort(function (a, b) {
		return Math.random() - 0.5;
	});
}

function random(min, max) {
	var x = Math.floor(Math.random() * (max - min + 1)) + min;
	return x;
}

app.get('/index/getnumber', function (req, res) {
	var phone = "13691168141";

	let arr = [];
	for (let i = 0; i < phone.length; i++) {
		let n = phone[i];
		arr.push(unicodeArray[n].a)
	}

	res.json({
		"status": "success",
		"data": {
			phone: arr.join(""),
			className: fontName,
			style: style
		},
		"message": ""
	});
})

app.get('/change', function (req, res) {
	// 重组0-9对应的unicode
	var firstPhoneNumber = [{
			a: '&#x0031;',
			b: 0x0031
		}, // 1
	]
	var secondPhoneNumber = [{
			a: '&#x0033;',
			b: 0x0033
		}, // 3
		{
			a: '&#x0035;',
			b: 0x0035
		}, // 5
		{
			a: '&#x0037;',
			b: 0x0037
		}, // 7
		{
			a: '&#x0038;',
			b: 0x0038
		}, // 8
	]
	var otherPhoneNumber = [{
			a: '&#x0030;',
			b: 0x0030
		}, // 0
		{
			a: '&#x0032;',
			b: 0x0032
		}, // 2
		{
			a: '&#x0034;',
			b: 0x0034
		}, // 4
		{
			a: '&#x0036;',
			b: 0x0036
		}, // 6
		{
			a: '&#x0039;',
			b: 0x0039
		}, // 9
	]
	unicodeArray.length = 0;
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
		if (item == 3 || item == 5 || item == 7 || item == 8) {
			var index1 = random(0, secondPhoneNumber.length - 1);
			unicodeArray.push(secondPhoneNumber.splice(index1, 1)[0]);
		} else if (item == 1) {
			unicodeArray.push(firstPhoneNumber[0])
		} else {
			var index1 = random(0, otherPhoneNumber.length - 1);
			unicodeArray.push(otherPhoneNumber.splice(index1, 1)[0]);
		}
	})

	var arr = [];
	unicodeArray.forEach(item => {
		arr.push(item.b);
	})

	fontName = 'my-font-' + new Date().getTime();

	webfont({
			files: 'svgs/*.svg',
			fontName: fontName,
			cssTemplateFontPath: '/fonts/',
			template: 'css',
			unicodeArray: arr
		})
		.then((result) => {
			console.log(result);
			fs.writeFileSync(`./static/fonts/${fontName}.svg`, result.svg, 'utf8')
			fs.writeFileSync(`./static/fonts/${fontName}.ttf`, result.ttf)
			fs.writeFileSync(`./static/fonts/${fontName}.eot`, result.eot)
			fs.writeFileSync(`./static/fonts/${fontName}.woff`, result.woff)
			fs.writeFileSync(`./static/fonts/${fontName}.woff2`, result.woff2)

			fs.writeFileSync(`./static/fonts/${fontName}.css`, result.styles)
			style = result.styles

			res.json({
				"status": "success",
				"data": "",
				"message": ""
			});
		});
})

// 处理404
app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 这里处理所有传递给next()的err
// 开发环境处理
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		console.error(err.stack);
		res.status(err.status || 500);
		res.json({
			"result": "error",
			"message": err.stack
		});
	});
} else {
	// 生产环境处理
	app.use(function (err, req, res, next) {
		console.error(err.stack);
		res.status(err.status || 500);
		res.json({
			"result": "error",
			"message": err.stack
		});
	});
}

//监听端口
let port = process.env.PORT || 3021;
app.listen(port, function (req, res) {
	console.log('listen http://127.0.0.1:' + port);
});