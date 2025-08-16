import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
}

const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({ isOpen, onClose, featureName, featureDescription }) => {
  const modalRoot = document.getElementById('modal-root');

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
  
  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-xl w-full max-w-lg text-center" onClick={e => e.stopPropagation()}>
        <div className="p-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-light-heading dark:text-dark-heading mt-5">
                <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-2 py-1 rounded-full mr-2">PREMIUM</span>
                {featureName}
            </h3>
            <p className="text-2xl font-bold text-light-heading dark:text-dark-heading mt-2">Coming Soon!</p>
            <p className="mt-4 text-light-text dark:text-dark-text">
                {featureDescription}
            </p>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-dark-background/50 border-t border-light-border dark:border-dark-border">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default PremiumFeatureModal;
