const express = require('express');
const router = express.Router();

// Local and exported codes object
const codes = {};
module.exports.codes = codes;

function generateRandom() {
  let number = '';
  while (number.length < 20) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

router.post('/api/auth', (req, res) => {
  const { user, redirect } = req.body;

  const id = generateRandom();
  const timestamp = Date.now();

  codes[id] = { user, redirect, timestamp };

  module.exports.codes = codes;
  res.status(200).json({ id });
});

module.exports.router = router;
