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



module.exports = router;
