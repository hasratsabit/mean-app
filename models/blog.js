const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Title length Checker
let titleLengthChecker = function(title) {
	if(!title){
		return false;
	}else {
		if(title.length < 5 || title.length > 50) {
			return false;
		}else {
			return true;
		}
	}
}

// Title charactor type checker is set to number and letters
let alphaNumericTitleChecker = function(title) {
	if(!title) {
		return false;
	}else {
		const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
		return regExp.test(title);
	}
}

// Title validator array
const titleValidators = [
	{
		validator: titleLengthChecker,
		message: 'Title must be more than 5 charactars but no more than 50',
	},
	{
		validator: alphaNumericTitleChecker,
		message: 'Title must be alphanumeric'
	}
]

// Body length Checker
let bodyLengthChecker = function(body) {
	if(!body){
		return false;
	}else {
		if(body.length < 5 || body.length > 500) {
			return false;
		}else {
			return true;
		}
	}
}


// Body validator array
const bodyValidators = [
	{
		validator: bodyLengthChecker,
		message: 'Body must be more than 5 charactars but no more than 500',
	}
]

// Comment length Checker
let commentLengthChecker = function(comment) {
	if(!comment[0]){
		return false;
	}else {
		if(comment[0].length < 1 || comment[0].length > 200) {
			return false;
		}else {
			return true;
		}
	}
}


// Comment validator array
const commentValidators = [
	{
		validator: commentLengthChecker,
		message: 'Comments must not exceed 200 letters',
	}
]




const BlogSchema = new Schema({
	title: { type: String, required: true, validate: titleValidators },
	body: { type: String, required: true, validate: bodyValidators },
	createdBy: { type: String },
	createdAt: { type: Date, default: Date.now() },
	likes: { type: Number, default: 0 },
	likedBy: { type: Array },
	dislikes: { type: Number, default: 0 },
	dislikedBy: { type: Array },
	comments: [
		{
			comment: { type: String, validate: commentValidators },
			commentator: { type: String }
		}
	]

});


const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog;
