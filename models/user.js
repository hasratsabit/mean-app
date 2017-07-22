const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Stop empty input fields for email
let emailLenghtChecker = function(email){
	if(!email){
		return false;
	}else {
		if(email.length < 5 || email.lenght > 30){
			return false;
		}else {
			return true;
		}
	}
};

// Check for Valid email format
let validEmailChecker = function(email){
	if(!email){
		return false;
	}else {
		const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		return regExp.test(email);
	}
}

// Array for email
const emailValidators = [
	{
		validator: emailLenghtChecker,
		message: 'Email must be five charactars and no more than 30 charactars',
	},
	{
		validator: validEmailChecker,
		message: 'Must be a valid email'
	}
]

// Stop empty field for Username
let usernameLenghtChecker = function(username) {
	if(!username){
		return false;
	}else {
		if(username.length < 3 || username.length > 15){
			return false
		}else {
			return true;
		}
	}
}

// Check for valid username;
let validUsername = function(username) {
	if(!username){
		return false;
	}else {
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/); // Usernaem should be numbers and letters
		return regExp.test(username); // Return regular expression
	}
}

// Array
let usernameValidator = [
	{
		validator: usernameLenghtChecker,
		message: 'Username should longer than than 3 charactars and less than 15',
	},
	{
		validator: validUsername,
		message: 'Username should be only letters and numbers'
	}
]

// The password length
let passwordLengthChecker = function(password) {
	if(!password){
		return false;
	}else {
		if(password.length < 8 || password.length > 35){
			return false;
		}else {
			return true;
		}
	}
};

// Valid Password
let validPassword = function(password) {
	if(!password){
		return false;
	}else {
		 const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		 return regExp.test(password);
	}
}

// Password Array
const passwordValidators = [
	{
		validator: passwordLengthChecker,
		message: 'Password should be more than 8 and less than 35 charactars'
	},
	{
		validator: validPassword,
		message: 'Password Must have at least one uppercase, lowercase, special character, and number'
	}
]

const UserSchema = new Schema({
	email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
	username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidator },
	password: { type: String, required: true, validate: passwordValidators }
});

// Encrypts the password
UserSchema.pre('save', function(next) {
	if(!this.isModified('password'))
	return next();

	bcrypt.hash(this.password, null, null, (err, hash) => {
		if(err) return next(err);
		this.password = hash;
		next();
	});
});

// Dcrypt password and match it with database
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}





const User = mongoose.model('User', UserSchema);
module.exports = User;
