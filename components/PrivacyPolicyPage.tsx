import React from 'react';

const PrivacySection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="space-y-3">
        <h2 className="text-xl font-bold text-light-heading dark:text-dark-heading border-b border-light-border dark:border-dark-border pb-2">{title}</h2>
        <div className="space-y-2 text-light-text dark:text-dark-text">
            {children}
        </div>
    </div>
);

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
            <header className="text-left">
                 <h1 className="text-3xl sm:text-4xl font-extrabold text-light-heading dark:text-dark-heading">Privacy Policy</h1>
                 <p className="text-light-text dark:text-dark-text mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>
            
            <main className="space-y-8">
                <PrivacySection title="Introduction">
                    <p>Welcome to RoleReady AI. We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our application. Your trust is important to us, and we are dedicated to being transparent about our practices.</p>
                </PrivacySection>

                <PrivacySection title="Information We Handle">
                    <p>To provide our service, we process the following information that you voluntarily provide:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>The text content of the Job Description you are targeting.</li>
                        <li>The text content of your Resume.</li>
                    </ul>
                    <p><strong>We do not ask for, collect, or store any other personally identifiable information such as your name, email address (unless it's in your resume text), or IP address.</strong></p>
                </PrivacySection>

                <PrivacySection title="How We Use Information">
                    <p>The sole purpose of handling the information you provide is to perform the analysis. Specifically:</p>
                     <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Your resume and job description text are sent securely over HTTPS to Google's Gemini API.</li>
                        <li>Google's API processes this information to generate the analysis and suggestions you see in the report.</li>
                        <li>The information is used only for the duration of your session to perform the analysis and is not used for any other purpose.</li>
                    </ul>
                </PrivacySection>

                <PrivacySection title="Data Storage and Security">
                    <p><strong>RoleReady AI is designed to be stateless and privacy-first. We do not have a database and we do not store your resume or job description content on any servers or logs after your session ends.</strong> All processing is done in-memory for the request and then discarded.</p>
                    <p>We use your browser's `localStorage` for one thing only: to save your light/dark mode theme preference for a better experience on your next visit. This preference is stored locally on your device and is not transmitted to us.</p>
                </PrivacySection>

                <PrivacySection title="Third-Party Services">
                    <p>We use Google's Gemini API as our third-party AI service provider. When you request an analysis, your data is subject to Google's Privacy Policy. We encourage you to review their policy to understand how they handle data.</p>
                </PrivacySection>

                <PrivacySection title="Your Rights">
                    <p>Since we do not store your personal data, there is no data to access, correct, or delete from our systems. You have complete control over your data as it resides only on your local device until you initiate an analysis.</p>
                </PrivacySection>

                <PrivacySection title="Changes to This Privacy Policy">
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                </PrivacySection>
            </main>

            <footer className="text-center py-6 border-t border-light-border dark:border-dark-border">
                <p className="text-light-subtle dark:text-dark-subtle">&copy; {new Date().getFullYear()} RoleReady AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PrivacyPolicyPage;
