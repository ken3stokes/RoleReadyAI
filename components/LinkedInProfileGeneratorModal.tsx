import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { LinkedInGeneratorResult } from '../types';

interface LinkedInProfileGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: LinkedInGeneratorResult | null;
  error: string | null;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            disabled={copied}
            className="absolute top-2 right-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold py-1 px-2 rounded-md transition-all disabled:opacity-70"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const LinkedInProfileGeneratorModal: React.FC<LinkedInProfileGeneratorModalProps> = ({ isOpen, onClose, isLoading, result, error }) => {
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="mt-4 text-light-text dark:text-dark-text">Generating your profile content...</p>
        </div>
      );
    }

    if (error) {
      return (
         <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-4">
            <div className="w-12 h-12 text-red-500 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Generation Failed</h3>
            <p className="text-red-600 dark:text-red-300 mt-2 max-w-sm">{error}</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-light-heading dark:text-dark-heading mb-2">Suggested Headlines:</h4>
                <div className="space-y-3">
                    {result.suggestedHeadlines.map((h, i) => (
                        <div key={i} className="relative bg-slate-100 dark:bg-slate-900/80 p-3 pr-16 rounded-md text-sm text-light-text dark:text-dark-text border border-light-border dark:border-dark-border">
                           {h}
                           <CopyButton textToCopy={h} />
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-bold text-light-heading dark:text-dark-heading mb-2">Generated "About" Section:</h4>
                 <div className="relative bg-slate-100 dark:bg-slate-900/80 p-3 pr-16 rounded-md text-sm text-light-text dark:text-dark-text border border-light-border dark:border-dark-border whitespace-pre-wrap leading-relaxed">
                   {result.generatedAboutSection}
                   <CopyButton textToCopy={result.generatedAboutSection} />
                </div>
            </div>
             <div>
                <h4 className="font-bold text-light-heading dark:text-dark-heading mb-2">Why This Content Works:</h4>
                <ul className="space-y-2 list-disc list-inside text-light-text dark:text-dark-text text-sm">
                    {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            </div>
        </div>
      )
    }

    return null;
  };
  
  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-bold text-light-heading dark:text-dark-heading flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            LinkedIn Profile Generator
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-light-subtle dark:text-dark-subtle hover:text-light-heading dark:hover:text-dark-heading transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto bg-slate-50/50 dark:bg-dark-background/50 flex-grow">
          {renderContent()}
        </div>

        <footer className="flex justify-end gap-4 p-4 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-card">
          <button onClick={onClose} className="bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md border border-slate-300 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Close
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default LinkedInProfileGeneratorModal;