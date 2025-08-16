import React from 'react';

interface RoadmapPageProps {}

const RoadmapCategory: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6 shadow-sm">
        <h3 className="flex items-center gap-3 text-xl font-bold text-primary mb-5">
            {icon}
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const RoadmapItem: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="border-l-2 border-light-border dark:border-dark-border pl-4">
        <h4 className="font-bold text-light-heading dark:text-dark-heading">{title}</h4>
        <p className="text-light-text dark:text-dark-text text-sm mt-1">{description}</p>
    </div>
);


const RoadmapPage: React.FC<RoadmapPageProps> = () => {
    const roadmapData = [
        {
            category: 'APPLICATION & WRITING TOOLS',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>,
            items: [
                { title: 'Cover Letter Generator', description: 'Generates a cover letter that mimics the tone of the job description.' },
                { title: 'Interview Question Generator', description: 'Creates a list of likely interview questions based on the resume and job description.' },
                { title: 'Bullet Point Transformer', description: 'Turns lengthy sentences or vague job duties into concise, results-driven bullet points (using metrics when possible).' },
            ]
        },
        {
            category: 'CAREER & MARKET INTELLIGENCE',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            items: [
                { title: 'Tailored Job Suggestions Based on Resume Themes', description: 'Recommends career pivots or adjacent roles, filterable by growth sectors, remote options, and company type.' },
                { title: 'Market Demand Map for Your Skills', description: 'Shows a heatmap of where your skills are most in-demand by location, industry, and salary range to enable strategic career decisions.' },
            ]
        },
         {
            category: 'PLATFORM & UX ENHANCEMENTS',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            items: [
                { title: 'PDF Resume Parser & Auto-Tagger', description: 'Upload a PDF/DOCX resume to automatically extract and tag key achievements, metrics, and keywords.' },
            ]
        },
        {
            category: 'NEXT-GENERATION SIMULATIONS',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13l.648 1.938a3.375 3.375 0 002.672 2.672L21.75 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" /></svg>,
            items: [
                { title: 'ATS Simulation', description: 'Simulates how various Applicant Tracking Systems (Workday, Greenhouse, etc.) would parse and rank your resume, highlighting formatting issues.' },
                { title: 'Voice Input + Real-Time Coaching', description: 'A mobile-ready feature to update your resume via voice and get real-time coaching nudges.' },
                { title: '“Coach Mode” with Role Simulation', description: 'AI role-play that simulates a recruiter, hiring manager, or ATS to provide feedback from different points of view.' },
                { title: 'Career Transition Engine', description: 'Provides tailored guidance for users switching sectors or re-entering the workforce.' },
            ]
        }
    ];

    return (
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
            <header className="text-center">
                 <h1 className="text-2xl sm:text-3xl font-bold text-light-heading dark:text-dark-heading">Product Roadmap</h1>
                 <p className="text-light-text dark:text-dark-text mt-1 max-w-3xl mx-auto">
                    Here's a look at the exciting features we're planning for RoleReady AI. Our mission is to build the most powerful and comprehensive career intelligence platform to help you succeed.
                </p>
            </header>
            
            <main className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                {roadmapData.map(category => (
                    <RoadmapCategory key={category.category} icon={category.icon} title={category.category}>
                        {category.items.map(item => (
                            <RoadmapItem key={item.title} title={item.title} description={item.description} />
                        ))}
                    </RoadmapCategory>
                ))}
            </main>

             <footer className="text-center py-6 border-t border-light-border dark:border-dark-border">
                <p className="text-light-subtle dark:text-dark-subtle">&copy; {new Date().getFullYear()} RoleReady AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default RoadmapPage;