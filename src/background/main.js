'use strict';

const extension = window.browser ? window.browser : window.chrome;
const snippetsContext = {
  id: 'snippets',
  title: 'View snippets',
  contexts: ['all'],
};

// Create the context menu item
extension.contextMenus.create(snippetsContext);
// Listen for context menu clicks
extension.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === snippetsContext.id) {
    extension.tabs.sendMessage(tab.id, { type: 'view_snippets' });
  }
});
