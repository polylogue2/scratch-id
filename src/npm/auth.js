const express = require('express');
const axios = require('axios');
const router = express.Router();

const DEFAULT_REDIRECT = 'https://scratch-id.onrender.com/';

// Utility function to handle verification and post to /api/auth
async function handleVerification(username, redirect, res) {
  try {
    const payload = {
      redirect: redirect || DEFAULT_REDIRECT
    };
    if (username) payload.user = username;

    const authResponse = await axios.post('/api/auth', payload);
    const { id } = authResponse.data;

    return res.json({
      message: "success",
      id
    });
  } catch (error) {
    return res.status(500).json({ message: "failed", error: "Failed to authorize user" });
  }
}

router.post('/auth/comments', async (req, res) => {
  const { code, username, redirect } = req.body;

  if (!code) {
    return res.status(400).json({ message: "failed", error: "Missing code" });
  }

  try {
    const response = await axios.get(
      'https://api.scratch.mit.edu/users/kRxZy_kRxZy/projects/1177550927/comments'
    );
    const data = response.data;

    const match = data.find(comment => comment.content === code);
    if (match) {
      return await handleVerification(username, redirect, res);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "failed", error: "Comment verification failed" });
  }
});

router.post('/auth/cloud', async (req, res) => {
  const { code, username, redirect } = req.body;

  if (!code) {
    return res.status(400).json({ message: "failed", error: "Missing code" });
  }

  try {
    const response = await axios.get(
      'https://clouddata.scratch.mit.edu/logs?projectid=1177550927&limit=100&offset=0'
    );
    const data = response.data;

    const match = data.find(cloud => cloud.value === code);
    if (match) {
      return await handleVerification(username, redirect, res);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "failed", error: "Cloud verification failed" });
  }
});

module.exports = router;
