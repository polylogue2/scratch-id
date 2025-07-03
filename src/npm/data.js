const express = require('express');
const router = express.Router();

const funcData = function () {} 
router.get('/admin/data', (req, res) => {
  res.json({ data });
});

module.exports = router;
