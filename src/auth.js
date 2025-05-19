const express = require('express');
const router = express.Router();
const axios = require('axios');

app.post('/auth/comments', async (req, res) => { 
  const { code } = req.body; 
  const res = axios.get('https://api.scratch.mit.edu/users/kRxZy_kRxZy/projects/1177550927/comments');
  const data = res.json();
  if(!data.includes(code)) {
    return res.json({ "message": "failed" });
  data.forEach(comment => {
    if(comment.content === code) {
      res.json({ "message": "success" });
     } 
   } 
 });
