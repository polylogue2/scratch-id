const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes from src/npm
const route1 = require('./src/npm/auth');
const route2 = require('./src/npm/verification');
const { router } = require('./src/npm/saveDetails');

const app = express();

// Middleware
app.use(cors());                 // Enable CORS for all routes
app.use(express.json());         // Parse incoming JSON bodies

// Use the imported routes
app.use(route1);  // Use auth routes
app.use(route2);  // Use verification routes
app.use(router);  // Use saveDetails routes

const router = '';
const { router } = require('./src/npm/data');
app.use(router);

// Serve static files from src/public
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'lib')));

// Start the server
app.listen(3000, () => {
  console.log('Server Listening on port 3000!');
});
