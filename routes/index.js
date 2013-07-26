
/*
 * GET home page.
 */

var crypto = require('crypto');
var User = require('../models/user'); 
 
module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: '首页'
    });
  });
  app.get('/reg', function(req, res) {
    res.render('reg', {
      title: '用户注册',
    });
  });
  
  //////////
  //用户注册
  app.post('/reg', function(req, res) {
    if (req.body['password-repeat'] != req.body['password']) {
	    req.flash('error', '两次输入的口令不一致');
		return res.redirect('/reg');
	}
    //生成口令的散列值
	var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    var newUser = new User({
        name: req.body.username,
	    password: password,
    });
    //检查用户名是否存在
    User.get(newUser.name, function(err, user) {
        if (user) 
	        err = 'Username already exists.';
	    if (err) {
	        req.flash('error', err);
		    return res.redirect('/reg');
		}
	    //如果不存在则新增用户
	    newUser.save(function(err) {
	        if (err) {
		        req.flash('error', err);
			    return res.redirect('/reg');
		    }
		    req.session.user = newUser;
		    req.flash('success', '注册成功');
		    res.redirect('/');
	    });
    });
});

  //用户登入
  app.get('/login', function(req, res) {
      res.render('login', {
	      title: '用户登入',
		});
	});
	
  app.post('/login', function(req, res) {
	  //生成口令的散列值
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('base64');
		
	  User.get(req.body.username, function(err, user) {
		  if (!user) {
			  req.flash('error', '用户不存在');
		      return res.redirect('/login');
		  }
		  if (user.password != password) {
			  req.flash('error', '用户口令错误');
			  return res.redirect('/login');
		  }
		  req.session.user = user;
		  req.flash('success', '登入成功');
		  res.redirect('/');
	  });
  });
	//登出可以
  app.get('/logout', function(req, res) {
	  req.session.user = null;
	  req.flash('success', '登出成功');
	  res.redirect('/');
  });
};



/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

/*
exports.hello = function(req, res) {
    res.send('The time is ' + new Date().toString());
};
*/
/*
exports.user = function(req, res) {
    res.send('user');
};

exports.post = function(req, res) {
    res.send('post');
};

exports.reg = function(req, res) {
    res.send('reg');
};

exports.doReg = function(req, res) {
    res.send('doReg');
};

exports.login = function(req, res) {
    res.send('login');
};

exports.doLogin = function(req, res) {
    res.send('doLogin');
};

exports.logout = function(req, res) {
    res.send('logout');
};*/