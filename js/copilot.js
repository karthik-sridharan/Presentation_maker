/**
 * copilot.js - AI Copilot Integration
 * 
 * Chat UI, prompt assembly, and API dispatch.
 */

export function initCopilot() {
  setupCopilotUI();
  console.log('✓ Copilot initialized');
}

function setupCopilotUI() {
  // TODO: Setup copilot chat interface
  const chatBtn = document.getElementById('copilotChatBtn');
  if (chatBtn) {
    chatBtn.addEventListener('click', sendChatMessage);
  }
}

async function sendChatMessage() {
  // TODO: Implement AI chat
  console.log('Send chat message to AI');
}
