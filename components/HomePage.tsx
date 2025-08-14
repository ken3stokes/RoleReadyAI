import React from 'react';

interface HomePageProps {
    setView: (view: 'app' | 'roadmap' | 'privacy' | 'terms') => void;
    onTryExample: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; isPremium?: boolean }> = ({ icon, title, children, isPremium = false }) => (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border text-center shadow-sm h-full flex flex-col">
        <div className="flex-shrink-0 flex justify-center items-center h-12 w-12 rounded-full bg-primary-light dark:bg-primary/20 text-primary mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-light-heading dark:text-dark-heading mb-2 flex items-center justify-center gap-2">
            {title}
            {isPremium && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">PREMIUM</span>}
        </h3>
        <p className="text-light-text dark:text-dark-text flex-grow">{children}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ setView, onTryExample }) => {
    return (
        <div className="animate-fade-in w-full">
            <main className="text-center py-16 sm:py-24 px-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                    Get Ready For Your Next Role
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-light-text dark:text-dark-text">
                    RoleReady AI analyzes your resume against any job description to give you a detailed breakdown of your alignment, highlight keyword gaps, and provide AI-powered suggestions to help you land the interview.
                </p>
                <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    <button
                        onClick={() => setView('app')}
                        className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-hover transition-all duration-300 shadow-lg transform active:scale-95 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                        </svg>
                        Analyze Your Resume
                    </button>
                    <button
                        onClick={onTryExample}
                        className="bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-md border border-slate-300 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                    >
                        Try an Example
                    </button>
                </div>
            </main>

            <section className="bg-light-card dark:bg-dark-card border-y border-light-border dark:border-dark-border py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-light-heading dark:text-dark-heading">A Full-Featured Career Copilot</h2>
                         <p className="mt-3 max-w-2xl mx-auto text-light-text dark:text-dark-text">Go beyond simple analysis with a suite of tools designed to get you interview-ready.</p>
                     </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                            title="In-Depth AI Analysis"
                        >
                            Get a detailed score and a section-by-section breakdown of your resume's strengths and weaknesses for a specific job.
                        </FeatureCard>
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                            title="AI Rewrite Suggestions"
                        >
                            Instantly improve your resume's impact with AI-powered suggestions for your bullet points and overall phrasing.
                        </FeatureCard>
                         <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m8-4H5a2 2 0 00-2 2v10a2 2 0 002 2h11l4 4V7a2 2 0 00-2-2z" /></svg>}
                            title="'Elevator Pitch' Generator"
                        >
                            Craft the perfect "Tell me about yourself" answer. Our AI generates a compelling pitch based on your resume and target role.
                        </FeatureCard>
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>}
                            title="LinkedIn Profile Generator"
                        >
                            Generate a compelling headline and 'About' section for your LinkedIn profile based on your resume and target job.
                        </FeatureCard>
                         <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10h.01" /></svg>}
                            title="Suggest Other Roles"
                        >
                            Discover alternative job titles and career paths where your skills would be a strong fit, expanding your job search horizons.
                        </FeatureCard>
                         <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            title="Interview Prep Simulator"
                            isPremium={true}
                        >
                            Generate a list of likely interview questions based on the job description so you can practice and prepare with confidence.
                        </FeatureCard>
                    </div>
                </div>
            </section>
             <footer className="text-center py-8">
                 <div className="flex justify-center items-center gap-4 text-sm flex-wrap">
                    <p className="text-light-subtle dark:text-dark-subtle">&copy; {new Date().getFullYear()} RoleReady AI. All rights reserved.</p>
                    <span className="text-light-subtle dark:text-dark-subtle hidden sm:inline">·</span>
                    <button onClick={() => setView('privacy')} className="text-light-subtle dark:text-dark-subtle hover:text-primary dark:hover:text-primary transition-colors font-medium">
                        Privacy Policy
                    </button>
                     <span className="text-light-subtle dark:text-dark-subtle">·</span>
                    <button onClick={() => setView('terms')} className="text-light-subtle dark:text-dark-subtle hover:text-primary dark:hover:text-primary transition-colors font-medium">
                        Terms of Service
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;