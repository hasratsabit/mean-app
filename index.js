const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');


const app = express();

// Use ES6 Promise
mongoose.Promise = global.Promise;
// Database setup
mongoose.connect(config.uri, (err) => {
	if(err){
		console.log('Could not connect to database: ', err);
	}else {
		console.log('Connected to database ' + config.db);
	}
});

// Static data
app.use(express.static(__dirname + '/client/dist'));

// All routes to Angular client
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});






const port = process.env.port || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
})
