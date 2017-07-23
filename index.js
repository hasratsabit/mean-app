const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const mainRoute = require('./routes/index');


const app = express();

// Use ES6 Promise
mongoose.Promise = global.Promise;
// Database setup
mongoose.connect(config.uri, { useMongoClient: true }, (err) => {
	if(err){
		console.log('Could not connect to database: ', err);
	}else {
		console.log('Connected to database ' + config.db);
	}
});

// MIDDLEWARES
//
// Cross Origin permission.
app.use(cors({ origin: 'http://localhost:4200' }));

// Static data
app.use(express.static(__dirname + '/client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// // Gives access control to the http requests
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//     next();
// });

// API Routes
app.use('/', mainRoute);

// All routes to Angular client
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});



const port = process.env.port || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
})
