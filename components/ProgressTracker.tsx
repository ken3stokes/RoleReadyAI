import React from 'react';

const STEPS = [
  { id: 'input', name: 'Input Details' },
  { id: 'analysis', name: 'AI Analysis Report' },
];

interface ProgressTrackerProps {
  currentStep: 'input' | 'analysis';
  isComplete?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, isComplete = false }) => {
  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);

  return (
    <nav aria-label="Progress" className="pb-8">
      <ol role="list" className="flex items-center">
        {STEPS.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
            {stepIdx < currentStepIndex || isComplete ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                   <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-light-heading dark:text-dark-heading whitespace-nowrap">{step.name}</span>
              </>
            ) : stepIdx === currentStepIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-light-border dark:bg-dark-border" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-light-card dark:bg-dark-card border-2 border-primary rounded-full">
                  <span className="h-2.5 w-2.5 bg-primary rounded-full" aria-hidden="true" />
                </div>
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-primary whitespace-nowrap">{step.name}</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-light-border dark:bg-dark-border" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-light-card dark:bg-dark-card border-2 border-light-border dark:border-dark-border rounded-full" />
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-light-subtle dark:text-dark-subtle whitespace-nowrap">{step.name}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressTracker;
