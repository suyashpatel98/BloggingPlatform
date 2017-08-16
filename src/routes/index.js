var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Blog = require('../models/blog');
/*
var posts = require('../mock/posts.json');
var blogs = require('../mock/blogs.json');
var blogs_crap = require('../mock/blogs_crap.json');
*/

router.get('/logout',function(req,res,next){
  if(req.session){
    req.session.destroy(function(err){
      if(err){
        return next(err);
      }
      else{
        res.redirect('/');
      }
    });
  }
  else{

  }
});


function getBlogTitle(callback){
  Blog.find({},function(err,obj){
    if(err) console.log('Errorn in retrieving data');
    else{
      console.log(obj);
      callback(obj);
    }
  });
}

function getBlogContent(title,callback){
  Blog.find({title : title},function(err,obj){
    if(err) console.log('Errorn in retrieving data');
    else{
      console.log(obj);
      callback(obj);
    }
  });
}

router.get('/blogs/:title?',function(req,res,next){
  var title = req.params.title;
  if(title === undefined){
    getBlogTitle(function(data){
      res.render('blogs',{post_name : data});
    });
  }
  else{
    if (! req.session.userId ) {
      var err = new Error("You are not authorized to view this page.");
      err.status = 403;
      return next(err);
    }
    getBlogContent(title,function(data){
      res.render('post',{post_name : data});
    });
  }
});

//GET /create 
router.get('/create',function(req,res,next){
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('create');
        }
      });
});

//POST /create
router.post('/create',function(req,res,next){
  if(req.body.title && req.body.content){
      // var userName;
      User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
          console.log('User not logged in');
          return next(error);
        } else {
          console.log('maybe you cannot return user.name');
          console.log(user.name);
          // userName = user.name;
          // console.log(userName);/*works*/
        }
      });//executes asyncly
      var blogData = {
        title: req.body.title,
        content: req.body.content,
        // name: 'suyash' /*works*/
        name : req.body.name
      };
      Blog.create(blogData, function (error, blog) {
        if (error) {
          return next(error);
        } else {
          console.log('blog data received');
          return res.redirect('/blogs');
        }
      });
  }
  else{
    var err = new Error('All fields required');
    err.status=400;
    return next(err);
  }
});

// GET /profile
router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile'/*, { title: 'Profile', name: user.name, favorite: user.favoriteBook }*/);
        }
      });
});

router.get('/',(req,res,next)=>{
	return res.render('about',{title : 'Blog Template for Bootstrap'});
});

router.get('/signin',(req,res,next)=>{
	return res.render('signin',{heading : 'Please sign in'});
});

router.post('/signin',(req,res,next)=>{
	if (req.body.email && req.body.password){
		User.authenticate(req.body.email, req.body.password, function (error, user) {
      	if (error || !user) {
        	var err = new Error('Wrong email or password.');
        	err.status = 401;
        	return next(err);
      	}  else {
        	req.session.userId = user._id;
          // console.log(user.name); /*works*/
        	return res.redirect('/profile');
      		}
    	});
	}
	else{
		var err = new Error('Email and password are required.');
   		err.status = 401;
    	return next(err);
	}
});

router.get('/signup',(req,res,next)=>{
	console.log('Signup delivered');
	return res.render('signup',{heading : 'Please sign up'});
});

router.post('/signup',(req,res,next)=>{
	if(req.body.email && req.body.password && req.body.name){
		//All fields filled
		// create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      };

      console.log('receiving Credentials...');
      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
         	return next(error);
        } else {
        	console.log('Credentials received');
         	return res.redirect('/profile');
        }
      });
	}
	else{
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
});
/*
router.get('/blog/:title?',function(req,res,next){
	var title = req.params.title;
	if(title === undefined){
		//res.status(503);
		//res.send("Render the blog page");
		return res.render('blogs',{post_name : blogs});
	}
	else{
		var post = posts[title] || {};
		console.log(post);
		console.log(post.title);
		return res.render('post',{post_name : post});
	}
});
*/
module.exports=router;