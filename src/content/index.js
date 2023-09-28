import { SnippetID } from '../shared';
import { getClickupChecklist } from './getClickupChecklist';
import { clearLocalStorage } from './clearLocalStorage';

const snippetMap = {
  [SnippetID.GET_CLICK_UP_CHECKLISTS]: getClickupChecklist,
  [SnippetID.CLEAR_LOCAL_STORAGE]: clearLocalStorage,
};
const extension = typeof browser === 'undefined' ? chrome : browser;
// Begin listening for extension messages
extension.runtime.onMessage.addListener(handleRuntimeMessage);

function handleRuntimeMessage(message, _, sendResponse) {
  // These errors will silently get eaten without an intentional catch
  try {
    if (message.type === 'run_snippet') {
      const { id } = message.payload;
      const response = { type: 'run_result', payload: null };

      try {
        if (snippetMap[id]) {
          response.payload = snippetMap[id]();
        } else {
          response.payload = `Unknown snippet id: ${id}`;
        }
      } catch (error) {
        response.payload = `An error occurred: ${error}`;
      }

      sendResponse(response);
    }
  } catch (error) {
    console.error(`Could not read message: ${error}`);
  }
}
