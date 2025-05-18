const express = require('express');
const router = express.Router();
const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com/repos/ModularGroup/Backend-DB/contents/codes.json';

router.get('/verification/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(GITHUB_API_URL, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    // GitHub returns file content base64 encoded
    const content = response.data.content;
    const buff = Buffer.from(content, 'base64');
    const codes = JSON.parse(buff.toString('utf8'));

    if (!codes[id]) {
      return res.status(404).json({ error: 'Code not found' });
    }

    res.json({
      [id]: {
        user: codes[id].user,
        timestamp: codes[id].timestamp,
        redirect: codes[id].redirect,
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch data from GitHub' });
  }
});

module.exports = router;
