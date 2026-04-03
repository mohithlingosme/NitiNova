const askBtn = document.getElementById("askBtn");
const queryEl = document.getElementById("query");
const resultEl = document.getElementById("result");
const answerEl = document.getElementById("answer");
const casesEl = document.getElementById("cases");
const verificationEl = document.getElementById("verification");
const statusEl = document.getElementById("status");

const API_BASE = window.API_BASE || "http://localhost:8000";

async function askQuery() {
  const query = queryEl.value.trim();
  if (!query) {
    statusEl.textContent = "Enter a question first.";
    return;
  }
  statusEl.textContent = "Working…";
  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json();
    renderResult(data);
    statusEl.textContent = "Done.";
  } catch (err) {
    statusEl.textContent = err.message;
  }
}

function renderResult(data) {
  resultEl.classList.remove("hidden");
  answerEl.textContent = data.answer || "No answer.";
  casesEl.innerHTML = "";
  data.supporting_cases.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.case_name} (${(c.citations || []).join(", ")}) — ${c.held}`;
    casesEl.appendChild(li);
  });
  verificationEl.textContent = data.verification.verified ? "✅ Verified" : "❌ Not Verified";
  verificationEl.className = data.verification.verified ? "verified" : "unverified";
}

askBtn.addEventListener("click", askQuery);
