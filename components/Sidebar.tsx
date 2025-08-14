import React from 'react';

interface SidebarProps {
  view: 'home' | 'app' | 'roadmap' | 'privacy' | 'terms';
  setView: (view: 'home' | 'app' | 'roadmap' | 'privacy' | 'terms') => void;
  onStartNewSession: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 relative group
      ${isActive
        ? 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary'
        : 'text-light-subtle dark:text-dark-subtle hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
  >
    {children}
    <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
      {label}
    </div>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ view, setView, onStartNewSession, theme, toggleTheme }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-20 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border flex flex-col items-center justify-between py-5 z-10">
      <div className="flex flex-col items-center space-y-4">
        <NavButton label="Home" isActive={view === 'home'} onClick={() => setView('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NavButton>
         <NavButton label="Start Analysis" isActive={view === 'app'} onClick={onStartNewSession}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
            </svg>
        </NavButton>
        <NavButton label="Roadmap" isActive={view === 'roadmap'} onClick={() => setView('roadmap')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </NavButton>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <NavButton label="Terms of Service" isActive={view === 'terms'} onClick={() => setView('terms')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </NavButton>
        <NavButton label="Privacy Policy" isActive={view === 'privacy'} onClick={() => setView('privacy')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        </NavButton>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex items-center justify-center w-12 h-12 rounded-lg text-light-subtle dark:text-dark-subtle hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;