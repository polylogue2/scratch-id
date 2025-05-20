const express = require('express');
const axios = require('axios');
const router = express.Router();

const DEFAULT_REDIRECT = 'https://scratch-id.onrender.com/';

async function handleVerification(match, username, redirect, res) {
  try {
    const authResponse = await axios.post('/api/auth', {
      username,
      redirect: redirect || DEFAULT_REDIRECT
    });

    return res.json({
      message: "success",
      id: authResponse.data.id
    });
  } catch (error) {
    return res.json({ message: "failed" });
  }
}

router.post('/auth/comments', async (req, res) => {
  const { code, username, redirect } = req.body;

  try {
    const response = await axios.get('https://api.scratch.mit.edu/users/kRxZy_kRxZy/projects/1177550927/comments');
    const data = response.data;

    const match = data.find(comment => comment.content === code);
    if (match) {
      return await handleVerification(match, username, redirect, res);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.json({ message: "failed" });
  }
});

router.post('/auth/cloud', async (req, res) => {
  const { code, username, redirect } = req.body;

  try {
    const response = await axios.get('https://clouddata.scratch.mit.edu/logs?projectid=1177550927&limit=100&offset=0');
    const data = response.data;

    const match = data.find(cloud => cloud.value === code);
    if (match) {
      return await handleVerification(match, username, redirect, res);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.json({ message: "failed" });
  }
});

module.exports = router;
