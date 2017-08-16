var mongoose = require('mongoose');
var BlogSchema = new mongoose.Schema({
	title : {
		type: String,
     	required: true,
     	trim: true
	},
	content : {
		type: String,
     	required: true,
	},
	name : {
		type: String,
     	required: true,
     	trim: true
	}
});
var Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;