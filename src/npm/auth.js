const express = require('express');
const axios = require('axios');
const router = express.Router();
const { funcData } = require('./data');

const DEFAULT_REDIRECT = 'https://scratch-id.onrender.com/';
let codes = [];

// Utility function to handle verification and post to /api/auth
async function handleVerification(username, redirect, res) {
  try {
    const payload = {
      user: username,
      redirect: redirect || DEFAULT_REDIRECT
    };
    funcData(redirect || DEFAULT_REDIRECT);
    const authResponse = await axios.post('http://localhost:3000/api/auth', payload);
    const { id } = authResponse.data;

    return res.json({
      message: "success",
      id
    });
  } catch (error) {
    return res.status(500).json({ message: "failed", error: error.message || "Unknown error" });
  }
}

router.post('/auth/comments', async (req, res) => {
  const { code, redirect } = req.body;
    if(codes.includes(code)) {
        return res.status(400).json({ message: "failed", error: "Code Already Used Before" });
  }
  
  codes.push(code);
  
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
      const username = match.author?.username;
      if (!username) {
        return res.status(500).json({ message: "failed", error: "Could not extract username from comment" });
      }
      return await handleVerification(username, redirect, res);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "failed", error: "Comment verification failed" });
  }
});

router.post('/auth/cloud', async (req, res) => {
  const { code, redirect } = req.body;
  
  if(codes.includes(code)) {
    return res.status(400).json({ message: "failed", error: "Code Already Used Before" });
  }
  
  codes.push(code);
  
  if (!code) {
    return res.status(400).json({ message: "failed", error: "Missing code" });
  }

  try {
    const response = await axios.get(
      'https://clouddata.scratch.mit.edu/logs?projectid=1177550927&limit=10&offset=0'
    );
    const data = response.data;

    const match = data.find(cloud => cloud.value === code);
    if (match) {
      const username = match.user;
      if (!username) {
        return res.status(500).json({ message: "failed", error: "Could not extract username from cloud log" });
      }
      return await handleVerification(username, redirect, res);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "failed", error: "Cloud verification failed" });
  }
});

module.exports = router;
