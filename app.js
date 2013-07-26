
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  
var app = express();

var partials = require('express-partials');//调用layout.ejs模板
var MongoStore = require('connect-mongo')(express);//120
var settings = require('./settings');//120
var flash = require('connect-flash');//no methods 'flash'

// all environments
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
	app.use(partials());//调用layout.ejs模板
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(express.cookieParser());//118
	app.use(express.session({
	    secret: settings.cookieSecret,
		store: new MongoStore({
		   db: settings.db
		})
	}));//118
	
    app.use(flash());
    //app.dynamicHelpers  开发指南里面的dynamicHelpers用法过时了
    app.use(function(req, res, next){
        var error = req.flash('error');
        var success = req.flash('success');
        res.locals.user = req.session.user;
        res.locals.error = error.length ? error : null;
        res.locals.success = success ? success : null;
        next();
    });

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));//配置静态服务器文件服务器
});

routes(app);//120

// development only
app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});	
/*
//创建动态视图助手  注：在express3.x中是没有dynamicHelpers方法的
app.dynamicHelpers({
    user: function(req, res) {
	    return req.session.user;
	},
	error: function(req, res) {
	    var err = req.flash('error');
		if (err.length)
		    return err;
		else
		    return null;
		},
		success: function(req, res) {
		    var succ = req.flash('success');
			if (succ.length)
			    return succ;
			else
			    return null;
		},
});
	*/
//Routes
//app.get('/', routes.index);//将'/'路径映射到exports.index函数下。默认情况下所有的模板都继承自layout.ejs
/*app.get('/hello', routes.hello);//www.localhost:3000/hello
app.get('/users', user.list);
app.get('/user/:username', function(req, res, next) {
    console.log('all methods captured');
	next();
});*/
/*app.get('/user/:username', function(req, res) {
    res.send('user: ' + req.params.username);
});//www.localhost:3000/xxx(xxx为你想输入的姓名)*/
//片段视图
/*app.get('/list', function(req, res) {
    res.render('list', {
	    title: 'List',
		items: [1991, 'byvoid', 'express', 'Node.js']
	});
});*/
/*
app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
