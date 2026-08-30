/**
 * KAVACH — Personal Digital Safety & Scam Prevention Assistant
 * 
 * Instructions for connecting your Python Backend:
 * Look for the functions:
 *  1. checkURL(url)
 *  2. checkSMS(messageText)
 *  3. askAssistant(question)
 * 
 * Replace the mock response logic with your fetch() calls to your FastAPI/Flask server.
 */

// =============================================================================
// 1. Placeholder Backend Integration Functions
// =============================================================================

/**
 * Check a URL for phishing, malicious redirects, or lookalike domain patterns.
 * 
 * @param {string} url - The URL to inspect.
 * @returns {Promise<Object>} Object containing status, confidence, reason, and advice.
 */
async function checkURL(url) {
  const response = await fetch("https://kavach-fooy.onrender.com/check-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url })
  });
  const data = await response.json();

  const isSuspicious = data.suspicious;
  return {
    status: isSuspicious ? "dangerous" : "safe",
    confidence: isSuspicious ? "High Risk" : "Safe",
    badgeText: isSuspicious ? "Suspicious Link" : "Safe Verified Domain",
    reason: isSuspicious
      ? "This URL shows patterns commonly used in phishing or scam links."
      : "No red flags were detected in this URL.",
    indicators: data.reasons || [],
    recommendation: isSuspicious
      ? "Avoid clicking this link or entering any personal information."
      : "No active threats identified. Safe to browse.",
    checkId: data.check_id
  };
}


/**
 * Check an SMS or chat message for fraud, impersonation, or social engineering.
 * 
 * @param {string} messageText - The message content.
 * @returns {Promise<Object>} Object containing status, confidence, reason, and advice.
 */
async function checkSMS(messageText) {
  const response = await fetch("https://kavach-fooy.onrender.com/check-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messageText })
  });
  const data = await response.json();

  const isSpam = data.spam;
  return {
    status: isSpam ? "dangerous" : "safe",
    confidence: isSpam ? "High Risk" : "Safe",
    badgeText: isSpam ? "Spam / Scam Detected" : "Safe Message",
    reason: isSpam
      ? "This message matches patterns commonly seen in scam or spam texts."
      : "This message doesn't show common scam patterns.",
    indicators: data.matched_keywords && data.matched_keywords.length
      ? data.matched_keywords.map(k => `Matched keyword: "${k}"`)
      : [`Model classification: ${data.label}`],
    recommendation: isSpam
      ? "Do not click any links or share personal/OTP details from this message."
      : "Looks like a normal message.",
    checkId: data.check_id
  };
}

/**
 * Ask the AI Security Assistant a question.
 * 
 * @param {string} question - User question or query.
 * @returns {Promise<string>} Assistant's plain text response.
 */
async function askAssistant(question) {
  const response = await fetch("https://kavach-fooy.onrender.com/ask-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: question })
  });
  const data = await response.json();
  return data.explanation;
}


// =============================================================================
// 2. UI Event Handlers & Rendering Logic
// =============================================================================

// Tab Switching
function switchTab(tab) {
  const urlBtn = document.getElementById("tab-url-btn");
  const smsBtn = document.getElementById("tab-sms-btn");
  const urlPanel = document.getElementById("panel-url");
  const smsPanel = document.getElementById("panel-sms");

  if (tab === "url") {
    urlBtn.classList.add("active");
    urlBtn.setAttribute("aria-selected", "true");
    smsBtn.classList.remove("active");
    smsBtn.setAttribute("aria-selected", "false");

    urlPanel.hidden = false;
    urlPanel.classList.add("active");
    smsPanel.hidden = true;
    smsPanel.classList.remove("active");
  } else {
    smsBtn.classList.add("active");
    smsBtn.setAttribute("aria-selected", "true");
    urlBtn.classList.remove("active");
    urlBtn.setAttribute("aria-selected", "false");

    smsPanel.hidden = false;
    smsPanel.classList.add("active");
    urlPanel.hidden = true;
    urlPanel.classList.remove("active");
  }
}

// URL Scanner Form Submission
async function handleURLSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("url-input");
  const submitBtn = document.getElementById("btn-check-url");
  const resultBox = document.getElementById("url-result");
  const urlValue = input.value.trim();

  if (!urlValue) return;

  setButtonLoading(submitBtn, true);
  resultBox.hidden = true;

  try {
    const result = await checkURL(urlValue);
    renderResult(resultBox, result);
  } catch (error) {
    console.error("Error checking URL:", error);
    renderError(resultBox, "Unable to analyze URL. Please check your connection or backend server.");
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// SMS Scanner Form Submission
async function handleSMSSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("sms-input");
  const submitBtn = document.getElementById("btn-check-sms");
  const resultBox = document.getElementById("sms-result");
  const messageText = input.value.trim();

  if (!messageText) return;

  setButtonLoading(submitBtn, true);
  resultBox.hidden = true;

  try {
    const result = await checkSMS(messageText);
    renderResult(resultBox, result);
  } catch (error) {
    console.error("Error checking message:", error);
    renderError(resultBox, "Unable to analyze message. Please check your connection or backend server.");
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// Render Result Card with Color Coding & Details
function renderResult(container, data) {
  const status = (data.status || "safe").toLowerCase();
  container.className = `result-box status-${status}`;
  container.dataset.checkId = data.checkId || "";

  let iconSvg = "";
  if (status === "safe") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
  } else if (status === "suspicious") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  const indicatorItems = (data.indicators || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  container.innerHTML = `
    <div class="result-header">
      <span class="result-badge">
        ${iconSvg}
        ${escapeHtml(data.badgeText || status.toUpperCase())}
      </span>
      <span class="confidence-meter">${escapeHtml(data.confidence || "Confidence High")}</span>
    </div>
    <div class="result-reason">
      <strong>Analysis:</strong> ${escapeHtml(data.reason || "")}
    </div>
    ${
      data.indicators && data.indicators.length
        ? `<div class="result-details">
            <h4>Key Indicators</h4>
            <ul>${indicatorItems}</ul>
          </div>`
        : ""
    }
    ${
      data.recommendation
        ? `<div class="result-details">
            <h4>Recommended Action</h4>
            <p style="font-size: 0.88rem; color: var(--text-primary);">${escapeHtml(data.recommendation)}</p>
          </div>`
        : ""
    }
    <div class="feedback-section" id="feedback-${data.checkId}">
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Was this assessment correct?</p>
      <button type="button" class="btn chip" onclick="submitFeedback(${data.checkId}, 'scam', this)">Yes, it's a scam</button>
      <button type="button" class="btn chip" onclick="submitFeedback(${data.checkId}, 'safe', this)">No, it's safe</button>
    </div>
  `;

  container.hidden = false;
}

// Render Error
function renderError(container, message) {
  container.className = "result-box status-dangerous";
  container.innerHTML = `
    <div class="result-header">
      <span class="result-badge">⚠️ Error</span>
    </div>
    <div class="result-reason">${escapeHtml(message)}</div>
  `;
  container.hidden = false;
}

// Set Button Loading State
function setButtonLoading(btn, isLoading) {
  const textSpan = btn.querySelector(".btn-text");
  const spinnerSpan = btn.querySelector(".btn-spinner");
  btn.disabled = isLoading;

  if (isLoading) {
    if (textSpan) textSpan.style.display = "none";
    if (spinnerSpan) spinnerSpan.hidden = false;
  } else {
    if (textSpan) textSpan.style.display = "inline";
    if (spinnerSpan) spinnerSpan.hidden = true;
  }
}

// =============================================================================
// 3. AI Assistant Chat Handling
// =============================================================================

async function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  // Add User Message to UI
  appendChatMessage("user", message);
  input.value = "";

  // Add temporary assistant placeholder
  const placeholderId = appendAssistantTyping();

  try {
    const reply = await askAssistant(message);
    updateAssistantMessage(placeholderId, reply);
  } catch (error) {
    console.error("Chat error:", error);
    updateAssistantMessage(placeholderId, "Sorry, I had trouble reaching the security assistant backend.");
  }
}

function sendQuickPrompt(el) {
  const text = el.innerText.replace(/^"|"$/g, "");
  document.getElementById("chat-input").value = text;
  document.getElementById("chat-form").dispatchEvent(new Event("submit"));
}

function appendChatMessage(sender, text) {
  const messagesContainer = document.getElementById("chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message message-${sender}`;

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="message-bubble">
      <p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>
    </div>
    <span class="message-time">${timeString}</span>
  `;

  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function appendAssistantTyping() {
  const messagesContainer = document.getElementById("chat-messages");
  const id = "typing-" + Date.now();
  const msgDiv = document.createElement("div");
  msgDiv.className = "message message-assistant";
  msgDiv.id = id;

  msgDiv.innerHTML = `
    <div class="message-bubble" style="color: var(--text-muted); font-style: italic;">
      Analyzing...
    </div>
    <span class="message-time">Just now</span>
  `;

  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return id;
}

function updateAssistantMessage(id, text) {
  const target = document.getElementById(id);
  if (!target) return;

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  target.innerHTML = `
    <div class="message-bubble">
      <p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>
    </div>
    <span class="message-time">${timeString}</span>
  `;

  const messagesContainer = document.getElementById("chat-messages");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Quick Demo Fills (for instant test)
function fillAndCheckURL(url) {
  switchTab('url');
  const input = document.getElementById("url-input");
  input.value = url;
  document.getElementById("url-form").dispatchEvent(new Event("submit"));
}

function fillAndCheckSMS(message) {
  switchTab('sms');
  const input = document.getElementById("sms-input");
  input.value = message;
  document.getElementById("sms-form").dispatchEvent(new Event("submit"));
}

// Utility: Escape HTML strings for safety
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
async function submitFeedback(checkId, actualLabel, buttonEl) {
  const feedbackDiv = document.getElementById(`feedback-${checkId}`);
  try {
    await fetch("https://kavach-fooy.onrender.com/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ check_id: checkId, actual_label: actualLabel })
    });
    feedbackDiv.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-primary);">✅ Thanks! Feedback recorded.</p>`;
  } catch (error) {
    console.error("Feedback error:", error);
    feedbackDiv.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Couldn't record feedback right now.</p>`;
  }
} 