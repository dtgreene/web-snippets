import { useState } from 'react';

import styles from './App.module.css';

export const App = () => {
  const [closed, setClosed] = useState(false);

  const handleCloseClick = () => {
    setClosed(true);
  };

  if (closed) return null;

  return (
    <>
      <div
        className={styles.backdrop}
        tabIndex={-1}
        onClick={handleCloseClick}
      />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div>Snippets</div>
          <div className="flex justify-end">
            <button className={styles.btn} onClick={handleCloseClick}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
