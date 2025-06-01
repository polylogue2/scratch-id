const express = require('express');
const axios = require('axios');
const router = express.Router();

const DEFAULT_REDIRECT = 'https://scratch-id.onrender.com/';

// Utility function to handle verification and post to /api/auth
async function handleVerification(username, redirect, res) {
  try {
    const payload = {
      user: username,
      redirect: redirect || DEFAULT_REDIRECT
    };

    const authResponse = await axios.post('http://localhost:3000/api/auth', payload);
    const { id } = authResponse.data;

    return res.json({
      message: "success",
      id
    });
  } catch (error) {
    return res.status(500).json({ message: "failed", error: error });
  }
}

router.post('/auth/comments', async (req, res) => {
  const { code, redirect } = req.body;

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

// Below is captcha stuff that is still WIP but not used yet

    // Get references to DOM elements
        const captchaCanvas = document.getElementById('captchaCanvas');
        const ctx = captchaCanvas.getContext('2d');
        const captchaInput = document.getElementById('captchaInput');
        const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
        const verifyCaptchaBtn = document.getElementById('verifyCaptchaBtn');
        const messageDiv = document.getElementById('message');

        // Variable to store the generated CAPTCHA text
        let captchaText = '';

        /**
         * Generates a random alphanumeric string for the CAPTCHA.
         * @param {number} length - The desired length of the CAPTCHA string.
         * @returns {string} The generated CAPTCHA string.
         */
        function generateCaptchaText(length = 6) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        /**
         * Draws the CAPTCHA text onto the canvas with distortion.
         * Adds random lines and dots for added complexity.
         */
        function drawCaptcha() {
            // Clear the canvas before drawing new CAPTCHA
            ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);

            // Set background color
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

            // Generate new CAPTCHA text
            captchaText = generateCaptchaText();

            // Set text properties
            ctx.font = 'bold 30px Inter, sans-serif'; // Use Inter font
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            // Draw each character with slight rotation and offset
            const charWidth = captchaCanvas.width / captchaText.length;
            for (let i = 0; i < captchaText.length; i++) {
                ctx.fillStyle = `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`; // Random color for each char
                ctx.save(); // Save the current canvas state

                const x = i * charWidth + charWidth / 2;
                const y = captchaCanvas.height / 2 + (Math.random() * 20 - 10); // Random vertical offset

                ctx.translate(x, y); // Move origin to character position
                ctx.rotate((Math.random() * 0.4 - 0.2)); // Random rotation (-0.2 to 0.2 radians)
                ctx.fillText(captchaText[i], 0, 0); // Draw character at new origin

                ctx.restore(); // Restore the canvas state
            }

            // Add random lines
            for (let i = 0; i < 5; i++) {
                ctx.strokeStyle = `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
                ctx.lineWidth = Math.random() * 2 + 1; // Random line width
                ctx.beginPath();
                ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
                ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
                ctx.stroke();
            }

            // Add random dots
            for (let i = 0; i < 50; i++) {
                ctx.fillStyle = `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
                ctx.beginPath();
                ctx.arc(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        /**
         * Verifies the user's input against the generated CAPTCHA text.
         * Displays a success or failure message.
         */
        function verifyCaptcha() {
            const userInput = captchaInput.value.trim();
            if (userInput.toLowerCase() === captchaText.toLowerCase()) {
                messageDiv.textContent = 'CAPTCHA Verified Successfully! You can now use the Done button.
                messageDiv.className = 'mt-6 text-center text-lg font-semibold text-green-600';
                const captchacompleted = "yes"
            } else {
                messageDiv.textContent = 'CAPTCHA Verification Failed. Please try again.';
                messageDiv.className = 'mt-6 text-center text-lg font-semibold text-red-600';
                const captchacompleted = "failed"
            }
            // Clear the input field after verification
            captchaInput.value = '';
            // Redraw CAPTCHA for a new attempt
            drawCaptcha();
        }

        // Event Listeners
        refreshCaptchaBtn.addEventListener('click', () => {
            drawCaptcha();
            captchaInput.value = ''; // Clear input on refresh
            messageDiv.textContent = ''; // Clear message on refresh
        });

        verifyCaptchaBtn.addEventListener('click', verifyCaptcha);

        // Allow pressing Enter key to verify
        captchaInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                verifyCaptcha();
            }
        });

        // Initial CAPTCHA draw when the page loads
        window.onload = drawCaptcha;
