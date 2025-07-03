const express = require('express');
const router = express.Router();
let data = [];

const funcData = function (url) {
  if (!data.includes(url)) {
    data.push(url);
  }
};

router.get('/admin/data', (req, res) => {
  res.json({ data });
});

module.exports = { router, funcData };
