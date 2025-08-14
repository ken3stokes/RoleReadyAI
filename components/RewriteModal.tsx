import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface RewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const RewriteModal: React.FC<RewriteModalProps> = ({ isOpen, onClose, content }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
  const [editedContent, setEditedContent] = useState(content);
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
    if (isOpen) {
        setEditedContent(content);
        setCopyButtonText('Copy to Clipboard');
    }
  }, [isOpen, content]);
  
  useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            onClose();
         }
      };
      if (isOpen) {
        window.addEventListener('keydown', handleEsc);
      }

      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }, [isOpen, onClose]);

  if (!isOpen || !modalRoot) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
          <h2 className="text-xl font-bold text-light-heading dark:text-dark-heading">AI-Powered Resume Rewrite</h2>
          <button onClick={onClose} aria-label="Close" className="text-light-subtle dark:text-dark-subtle hover:text-light-heading dark:hover:text-dark-heading transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-dark-background">
            <p className="text-light-text dark:text-dark-text mb-4">
                Your resume has been rewritten to better match the job description. Review the text below, fill in the placeholders (e.g., <code className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded px-1 text-sm font-medium">[Quantify impact...]</code>) with your specific achievements, and then copy it.
            </p>
          <textarea
            className="w-full h-[50vh] p-4 bg-white dark:bg-slate-900 border border-light-border dark:border-dark-border rounded-md text-light-text dark:text-dark-text font-mono text-sm whitespace-pre-wrap focus:ring-primary focus:border-primary"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </div>

        <footer className="flex justify-end gap-4 p-4 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-card rounded-b-lg flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md border border-slate-300 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors w-40 text-center disabled:bg-blue-300"
            disabled={copyButtonText === 'Copied!'}
          >
            {copyButtonText}
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default RewriteModal;