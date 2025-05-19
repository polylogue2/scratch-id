const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/auth/comments', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.get('https://api.scratch.mit.edu/users/kRxZy_kRxZy/projects/1177550927/comments');
    const data = response.data;

    // Check if any comment matches the code
    const match = data.find(comment => comment.content === code);
    if (match) {
      return res.json({ message: "success" });
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.json({ message: "failed" });
  }
});

router.post('/auth/cloud', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.get('https://clouddata.scratch.mit.edu/logs?projectid=1177550927&limit=100&offset=0');
    const data = response.data;

    // Check if any cloud data value matches the code
    const match = data.find(cloud => cloud.value === code);
    if (match) {
      return res.json({ message: "success" });
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.json({ message: "failed" });
  }
});

module.exports = router;
