/**
 * dialog-anim.js — Enhanced dialog with typewriter effect
 */
const DialogAnim = (() => {
  let typewriterTimer = null;
  let currentText = '';
  let currentIdx = 0;
  let targetEl = null;
  let onComplete = null;
  let speed = 30; // ms per character

  function typeText(element, text, callback) {
    if (typewriterTimer) clearInterval(typewriterTimer);

    targetEl = element;
    currentText = text;
    currentIdx = 0;
    onComplete = callback;
    element.textContent = '';

    typewriterTimer = setInterval(() => {
      if (currentIdx < currentText.length) {
        element.textContent += currentText[currentIdx];
        currentIdx++;

        // Play subtle click sound every few chars
        if (currentIdx % 3 === 0) {
          // tiny click
        }
      } else {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
        if (onComplete) onComplete();
      }
    }, speed);
  }

  function skip() {
    if (typewriterTimer) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      if (targetEl) targetEl.textContent = currentText;
      if (onComplete) onComplete();
    }
  }

  function isTyping() {
    return typewriterTimer !== null;
  }

  function setSpeed(ms) {
    speed = ms;
  }

  return { typeText, skip, isTyping, setSpeed };
})();
