const express = require('express');
const router = express.Router();
const axios = require('axios');

const GITHUB_OWNER = 'ModularGroup';
const GITHUB_REPO = 'Backend-DB';
const FILE_PATH = 'codes.json';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function generateRandom() {
  let number = '';
  while (number.length < 20) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

router.post('/api/auth', async (req, res) => {
  const { user, redirect } = req.body;

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "Server misconfiguration: missing GitHub token" });
  }

  try {
    const getResponse = await axios.get(GITHUB_API_URL, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const currentContent = Buffer.from(getResponse.data.content, 'base64').toString('utf-8');
    const codes = JSON.parse(currentContent);

    const id = generateRandom();
    const timestamp = Date.now();

    codes[id] = { user, redirect, timestamp };

    const updatedContentBase64 = Buffer.from(JSON.stringify(codes, null, 2)).toString('base64');

    await axios.put(GITHUB_API_URL, {
      message: `Update codes.json - add id ${id}`,
      content: updatedContentBase64,
      sha: getResponse.data.sha,
      committer: {
        name: 'Some Bot',
        email: 'emailll-pls@example.com'
      }
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update codes on GitHub' });
  }
});

module.exports = { router };
