import React from 'react';

interface InputSectionProps {
    jobDescription: string;
    setJobDescription: (value: string) => void;
    resume: string;
    setResume: (value: string) => void;
    onAnalyze: () => void;
    onTryExample: () => void;
    isLoading: boolean;
    agreedToTerms: boolean;
    setAgreedToTerms: (value: boolean) => void;
    setView: (view: 'terms') => void;
}

const InputSection: React.FC<InputSectionProps> = ({
    jobDescription,
    setJobDescription,
    resume,
    setResume,
    onAnalyze,
    onTryExample,
    isLoading,
    agreedToTerms,
    setAgreedToTerms,
    setView
}) => {
    return (
        <div className="animate-fade-in space-y-8 p-6 sm:p-8 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label htmlFor="job-description" className="block text-base font-semibold text-light-heading dark:text-dark-heading">
                        Job Description
                    </label>
                    <textarea
                        id="job-description"
                        rows={20}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-light-border dark:border-dark-border rounded-md shadow-sm focus:ring-primary focus:border-primary text-light-text dark:text-dark-text placeholder-light-subtle dark:placeholder-dark-subtle transition"
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                     <label htmlFor="resume" className="block text-base font-semibold text-light-heading dark:text-dark-heading">
                        Resume Content
                    </label>
                    <textarea
                        id="resume"
                        rows={20}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-light-border dark:border-dark-border rounded-md shadow-sm focus:ring-primary focus:border-primary text-light-text dark:text-dark-text placeholder-light-subtle dark:placeholder-dark-subtle transition"
                        placeholder="Paste your resume content here..."
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-500/30 text-yellow-800 dark:text-yellow-200 text-sm">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 8.25c0-.414-.336-.75-.75-.75h-1.5a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75v-3zM10 1.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1.25zM2 9.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM10 18.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM3.204 4.87a.75.75 0 011.06.05l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 01.05-1.06zM14.94 15.18a.75.75 0 01.05 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06-.05zM4.254 14.94a.75.75 0 011.06-.05l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 01.05-1.06zM15.18 4.254a.75.75 0 011.06.05l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 01.05-1.06zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-yellow-900 dark:text-yellow-100">Privacy & Security Notice</h4>
                        <p className="mt-1">
                            Your data is sent directly to Google's Gemini API for processing. <strong>We do not store your resume or job description.</strong> By clicking "Analyze Resume," you agree to this temporary data handling for analysis purposes.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-light-border dark:border-dark-border">
                <div className="flex items-start space-x-3 mb-6">
                    <input
                        id="terms-agreement"
                        type="checkbox"
                        className="h-5 w-5 rounded border-light-border dark:border-dark-border text-primary focus:ring-primary mt-0.5 accent-primary"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <div className="text-sm">
                        <label htmlFor="terms-agreement" className="font-medium text-light-text dark:text-dark-text">
                            I have read and agree to the{' '}
                            <button onClick={() => setView('terms')} className="text-primary hover:underline font-bold">
                                Terms of Service
                            </button>.
                        </label>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4">
                    <button
                        onClick={onTryExample}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 font-semibold py-3 px-5 rounded-md border border-slate-300 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 disabled:opacity-50"
                    >
                        Use Example
                    </button>
                    <button
                        onClick={onAnalyze}
                        disabled={!jobDescription || !resume || isLoading || !agreedToTerms}
                        className="w-full sm:flex-1 bg-primary text-white font-bold py-3 px-5 rounded-md hover:bg-primary-hover disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform active:scale-95 flex justify-center items-center gap-2"
                    >
                        {isLoading ? 'Analyzing...' : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                                </svg>
                                Analyze Resume
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputSection;