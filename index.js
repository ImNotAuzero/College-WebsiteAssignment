/* jshint esversion: 9 */

// Imports
const config = require('config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose'); // Module for MongoDB
mongoose.connect(config.get('database.url'), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log('Connected to mongo'))
  .catch(console.log);
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes for endpoints
const reviewRoutes = require('./routes/review');
const roomRoutes = require('./routes/room');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const dashboardRoutes = require('./routes/dashboard');

// Middlewear for endpoints
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); // Allow static content in specified directory

// Log all requests
app.all('*', (req, res, next) => {
    console.log(`${req.path} Requested`);
    return next();
});

app.get('/', (req, res) => { res.status(200).sendFile(path.join(__dirname, 'public/home/index.html')); }); // Homepage
app.get('/about', (req, res) => { res.status(200).sendFile(path.join(__dirname, 'public/home/about.html')); }); // About page
app.use('/auth', authRoutes); // Authentication routes
app.use('/rooms', roomRoutes); // Room routes
app.use('/reviews', reviewRoutes); // Review routes
app.use('/contact', contactRoutes); // Contact routes
app.use('/dashboard', dashboardRoutes); // Dashboard routes

let port = config.get("app.port");
app.listen(port, () => console.log(`App listening on Port: ${port}`));