import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PitchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitch: string;
  isLoading: boolean;
  error: string | null;
}

const PitchGeneratorModal: React.FC<PitchGeneratorModalProps> = ({ isOpen, onClose, pitch, isLoading, error }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
    if (isOpen) {
        setCopyButtonText('Copy to Clipboard');
    }
  }, [isOpen]);
  
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
    navigator.clipboard.writeText(pitch);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-light-text dark:text-dark-text">Generating your pitch...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <div className="w-12 h-12 text-red-500 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Could not generate pitch</h3>
            <p className="text-red-600 dark:text-red-300 mt-2 max-w-sm">{error}</p>
        </div>
      );
    }

    return (
        <>
            <p className="text-light-text dark:text-dark-text mb-4">
                Here is a draft for your "Tell me about yourself" pitch. Read it aloud to ensure it sounds natural, then customize it to match your voice and personality.
            </p>
            <textarea
                className="w-full h-[45vh] p-4 bg-white dark:bg-slate-900 border border-light-border dark:border-dark-border rounded-md text-light-text dark:text-dark-text font-sans text-base leading-relaxed whitespace-pre-wrap focus:ring-primary focus:border-primary"
                value={pitch}
                readOnly
            />
        </>
    );
  };
  
  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-bold text-light-heading dark:text-dark-heading">Your Elevator Pitch</h2>
          <button onClick={onClose} aria-label="Close" className="text-light-subtle dark:text-dark-subtle hover:text-light-heading dark:hover:text-dark-heading transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto bg-slate-50/50 dark:bg-dark-background/50">
          {renderContent()}
        </div>

        <footer className="flex justify-end gap-4 p-4 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
          <button
            onClick={onClose}
            className="bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md border border-slate-300 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
          {!isLoading && !error && (
            <button
                onClick={handleCopy}
                className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors w-40 text-center disabled:bg-blue-300"
                disabled={copyButtonText === 'Copied!'}
            >
                {copyButtonText}
            </button>
          )}
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default PitchGeneratorModal;