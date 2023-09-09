'use strict';

const extension = {
  runtime: window.browser ? browser.runtime : chrome.runtime,
};
const frameId = 'snippets-modal';
const frameStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none',
};

// Begin listening for messages
extension.runtime.onMessage.addListener(handleMessage);

function getStringStyles(styles) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}

function removeElement(id) {
  const element = document.getElementById(id);

  if (element) {
    element.parentNode.removeChild(element);
  }
}

function handleMessage(message) {
  // These errors will silently get eaten without an intentional catch
  try {
    if (message.type === 'view_snippets') {
      removeElement(frameId);

      const frame = document.createElement('iframe');
      frame.id = frameId;
      frame.style = getStringStyles(frameStyles);
      frame.src = extension.runtime.getURL('content/modal/index.html');

      document.body.appendChild(frame);
    } else if (message.type === 'hide_snippets') {
      removeElement(frameId);
    }
  } catch (error) {
    console.error(
      `[web-snippets]: Could not process message: ${error}`
    );
  }
}
