import { useRef, useState } from 'react';
import { produce } from 'immer';

import { SnippetID } from '../../shared';
import { PlayIcon } from './PlayIcon';

if (import.meta.env.DEV) {
  await import('./extensionShim');
}

const snippetList = [
  {
    label: 'GetClickUpChecklists',
    description: 'Gets ClickUp ticket checklist as GitHub markdown.',
    id: SnippetID.GET_CLICK_UP_CHECKLISTS,
  },
];
const extension = typeof browser === 'undefined' ? chrome : browser;

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
    />
  </svg>
);

export const App = () => {
  const [runResults, setRunResults] = useState({});
  const [prevCopied, setPrevCopied] = useState(null);
  const copiedTimeout = useRef(null);

  const handleRun = (id) => {
    extension.tabs
      .query({ active: true, lastFocusedWindow: true })
      .then(([tab]) => {
        if (tab) {
          extension.tabs
            .sendMessage(tab.id, {
              type: 'run_snippet',
              payload: { id },
            })
            .then(({ payload }) => {
              setRunResults(
                produce((draft) => {
                  draft[id] = payload;
                })
              );
            });
        } else {
          console.warn('Could not run snippet; could not find active tab.');
        }
      });
  };

  const handleCopyResultsClick = async (id) => {
    try {
      await navigator.clipboard.writeText(runResults[id]);

      if (copiedTimeout.current) {
        clearTimeout(copiedTimeout.current);
        copiedTimeout.current = null;
      }

      setPrevCopied(id);

      // Remove the id after a short time
      copiedTimeout.current = setTimeout(() => {
        setPrevCopied(null);
      }, 2_000);
    } catch (error) {
      console.error(`Could not copy results: ${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-gray-400 text-xl">Web Snippets</div>
      <div className="max-h-[400px] overflow-auto border border-gray-600 rounded">
        {snippetList.map(({ label, description, id }) => (
          <div
            key={id}
            className="bg-gray-800 border-b border-gray-600 px-3 py-2 last:border-none flex flex-col gap-2"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <b>{label}</b>
                <div className="text-sm">{description}</div>
              </div>
              <button
                className="flex-grow-0 cursor-pointer text-sky-500 hover:text-sky-700 transition-colors"
                onClick={() => handleRun(id)}
              >
                <PlayIcon width="32" height="32" />
              </button>
            </div>
            {runResults[id] && (
              <div>
                <div className="text-gray-400 text-sm mb-1">Result:</div>
                <div className="bg-gray-700 px-2 py-1 rounded border border-gray-600 font-mono text-sm whitespace-pre-line relative">
                  {runResults[id]}
                  <div className="absolute right-0 top-0 p-1">
                    {prevCopied === id ? (
                      'copied!'
                    ) : (
                      <button
                        className="hover:opacity-50 transition-opacity"
                        onClick={() => handleCopyResultsClick(id)}
                      >
                        <CopyIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
