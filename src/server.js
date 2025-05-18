const express = require('express');
const cors = require('cors');
const route1 = require('./auth');
const route2 = require('./verification');

const app = express();

app.use(cors());
app.use(route1);
app.use(route2);

app.listen(3000, () => {
    console.log('Server Listening on port 3000!');
});
