const express = require('express');
const router = express.Router();
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');


router.post('/newBlog', (req, res) => {
	// Check if blog title was provided
	if (!req.body.title) {
		res.json({ success: false, message: 'Blog title is required.' }); // Return error message
	} else {
		// Check if blog body was provided
		if (!req.body.body) {
			res.json({ success: false, message: 'Blog body is required.' }); // Return error message
		} else {
			// Check if blog's creator was provided
			if (!req.body.createdBy) {
				res.json({ success: false, message: 'Blog creator is required.' }); // Return error
			} else {
				// Create the blog object for insertion into database
				const blog = new Blog({
					title: req.body.title, // Title field
					body: req.body.body, // Body field
					createdBy: req.body.createdBy // CreatedBy field
				});
				// Save blog into database
				blog.save((err) => {
					// Check if error
					if (err) {
						// Check if error is a validation error
						if (err.errors) {
							// Check if validation error is in the title field
							if (err.errors.title) {
								res.json({ success: false, message: err.errors.title.message }); // Return error message
							} else {
								// Check if validation error is in the body field
								if (err.errors.body) {
									res.json({ success: false, message: err.errors.body.message }); // Return error message
								} else {
									res.json({ success: false, message: err }); // Return general error message
								}
							}
						} else {
							res.json({ success: false, message: err }); // Return general error message
						}
					} else {
						res.json({ success: true, message: 'Blog saved!' }); // Return success message
					}
				});
			}
		}
	}
});

router.get('/allBlogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			res.json({ success: false, message: err});
		}else {
			if(!blogs){
				res.json({ success: false, message: err});
			}else {
				res.json({ success: true, blogs: blogs});
			}
		}
	}).sort({'_id': -1}); // This sorts blogs based on date. The newest first. 
})


module.exports = router;
