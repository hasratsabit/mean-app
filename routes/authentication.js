const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.post('/register', (req, res) => {
	if(!req.body.email){
		res.json({ success: false, message: 'You must provide a valid email'});
	}else {
		if(!req.body.username){
			res.json({ success: false, message: 'You must provide a username'});
		}else {
			if(!req.body.password){
				res.json({ success: false, message: 'You must provide a password'});
			}else {
				const user = new User();
				user.email = req.body.email.toLowerCase();
				user.username = req.body.username.toLowerCase();
				user.password = req.body.password;
				user.save((err, newUser) => {
					if(err){
						if(err.code === 11000){
							res.json({ success: false, message: 'Username or email already exist'});
							return;
						}else {
							if(err.errors){
								if(err.errors.email){
									res.json({ success: false, message: err.errors.email.message });
								}else {
									if(err.errors.username){
										res.json({ success: false, message: err.errors.username.message });
									}else {
										if(err.errors.password){
											res.json({ success: false, message: err.errors.password.message });
										}
									}
								}
							}else {
								res.json({ success: false, message: 'Could not save user. Erorr', err});
							}
						}
					}else {
						res.json({ success: true, message: 'User Successfully registered'});
					}
				});
			}
		}
	}
});

// This route checks if the E-mail user entered in register form is exist in the system.
router.get('/checkUsername/:username', (req, res) => {
	// Check if username was provided in paramaters
	if (!req.params.username) {
		res.json({ success: false, message: 'Username was not provided' }); // Return error
	} else {
		// Look for username in database
		User.findOne({ username: req.params.username }, (err, user) => {
			// Check if connection error was found
			if (err) {
				res.json({ success: false, message: err }); // Return connection error
			} else {
				// Check if user's username was found
				if (user) {
					res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
				} else {
					res.json({ success: true, message: 'Username is available' }); // Return as vailable username
				}
			}
		});
	}
});

// This route checks if the Username user entered in register form is exist in the system.
router.get('/checkEmail/:email', (req, res) => {
	// Check if email was provided in paramaters
	if (!req.params.email) {
		res.json({ success: false, message: 'E-mail was not provided' }); // Return error
	} else {
		// Search for user's e-mail in database;
		User.findOne({ email: req.params.email }, (err, user) => {
			if (err) {
				res.json({ success: false, message: err }); // Return connection error
			} else {
				// Check if user's e-mail is taken
				if (user) {
					res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
				} else {
					res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
				}
			}
		});
	}
});

module.exports = router;
