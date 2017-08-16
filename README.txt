5/6 tabs : about , profile , blogs , create , login/logout , register

Name of the database : blog
2 collections : users, blogs 
email : suyashpatel98@gmail.com
password : suyash 

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
        name : userName
      };
      Blog.create(blogData, function (error, blog) {
        if (error) {
          return next(error);
        } else {
          console.log('blog data received');
          return res.redirect('/blog');
        }
      });
  }
  else{
    var err = new Error('All fields required');
    err.status=400;
    return next(err);
  }
});




Try to get the users name without having him enter his name 