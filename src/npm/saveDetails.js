const express = require('express');
const router = express.Router();

// Local and exported codes object
const codes = {};
const ips = [];

module.exports.codes = codes;
module.exports.ips = ips;

function generateRandom() {
  let number = '';
  while (number.length < 20) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

router.post('/api/auth', (req, res) => {
  const { user, redirect, ip } = req.body;

  const id = generateRandom();
  const timestamp = Date.now();
  
  codes[id] = { user, ip, redirect, timestamp };

  // Save IP to list
  if (ip && !ips.includes(ip)) {
    ips.push(ip);
  }

  res.status(200).json({ id });
});

module.exports.router = router;
