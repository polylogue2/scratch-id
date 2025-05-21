// Get group name from URL or default
const params = new URLSearchParams(window.location.search);
const groupName = params.get("name") || "Modular Group";
const redirect = params.get("redirect") || null;
document.getElementById("group-name").textContent = groupName;
document.getElementById("login-msg").textContent = `${groupName} wants to login with your Scratch account.`;

const modal = document.getElementById("auth-modal");
const codeEl = document.getElementById("auth-code");
const instructionsEl = document.getElementById("auth-instructions");
const statusMsg = document.getElementById("status-msg");

let authMethod = null;
let generatedCode = null;

function startAuth(method) {
  authMethod = method;
  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  codeEl.textContent = generatedCode;
  statusMsg.textContent = "";

  if (method === "comments") {
    instructionsEl.innerHTML = `Go to <a href="https://scratch.mit.edu/projects/1177550927">this project</a> and comment this code:`;
  } else {
    instructionsEl.innerHTML = `Go to <a href="https://scratch.mit.edu/projects/1177550927">this project</a> and type this code in the project:`;
  }

  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
}

async function verifyCode() {
  const endpoint = authMethod === "comments" ? "/auth/comments" : "/auth/cloud";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: generatedCode, redirect: atob(redirect) })
    });

    const data = await res.json();
    if (data.message === "success") {
      statusMsg.textContent = "Login successful! Redirecting...";
      if (redirect) {
        window.location.href = `${atob(redirect)}?id=${data.id}`;
      }
    } else {
      statusMsg.textContent = data.error;
    }
  } catch (err) {
    statusMsg.textContent = "An error occurred. Please try again later.";
  }
}
