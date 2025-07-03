const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes from src/npm
const route1 = require('./src/npm/auth');
const route2 = require('./src/npm/verification');
const { router: saveDetailsRouter } = require('./src/npm/saveDetails');
const { router: dataRouter } = require('./src/npm/data');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the imported routes
app.use(route1);               // Auth routes
app.use(route2);               // Verification routes
app.use(saveDetailsRouter);   // SaveDetails routes
app.use(dataRouter);          // Data routes

// Serve static files
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'lib')));

// Start server
app.listen(3000, () => {
  console.log('Server Listening on port 3000!');
});
