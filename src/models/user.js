var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
	email : {
		type: String,
     	unique: true,
     	required: true,
     	trim: true
	},
	password : {
		type: String,
     	required: true,
	},
	name : {
		type: String,
     	required: true,
     	trim: true
	}
});
// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          console.log('Error during the process of finding the user');
          return callback(error);
        } else if ( !user ) {
          console.log('User not found.');
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            console.log('passwords did not match');
            return callback();
          }
        });
      });
}
// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
var User = mongoose.model('User', UserSchema);
module.exports = User;