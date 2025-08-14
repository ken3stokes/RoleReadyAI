import React, { useState, useCallback, useEffect } from 'react';
import AnalysisDisplay from './components/AnalysisDisplay';
import RewriteModal from './components/RewriteModal';
import JobSuggestionsModal from './components/JobSuggestionsModal';
import RoadmapPage from './components/RoadmapPage';
import ProgressTracker from './components/ProgressTracker';
import InputSection from './components/InputSection';
import HomePage from './components/HomePage';
import Sidebar from './components/Sidebar';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PremiumFeatureModal from './components/PremiumFeatureModal';
import PitchGeneratorModal from './components/PitchGeneratorModal';
import LinkedInProfileGeneratorModal from './components/LinkedInProfileGeneratorModal';
import { analyzeResume, rewriteResumeForJob, findBetterJobs, generatePitch, generateLinkedInProfile } from './services/geminiService';
import { samples } from './components/sampleData';
import type { AnalysisResult, JobSuggestion, LinkedInGeneratorResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'app' | 'roadmap' | 'privacy' | 'terms'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('roleready-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return 'light';
  });

  const [jobDescription, setJobDescription] = useState<string>('');
  const [resume, setResume] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const [isRewriting, setIsRewriting] = useState<boolean>(false);
  const [rewrittenResume, setRewrittenResume] = useState<string>('');
  const [isRewriteModalOpen, setIsRewriteModalOpen] = useState<boolean>(false);

  const [isFindingJobs, setIsFindingJobs] = useState<boolean>(false);
  const [jobSuggestions, setJobSuggestions] = useState<JobSuggestion[] | null>(null);
  const [jobSuggestionsError, setJobSuggestionsError] = useState<string | null>(null);
  const [isJobSuggestionsModalOpen, setIsJobSuggestionsModalOpen] = useState<boolean>(false);

  const [isGeneratingPitch, setIsGeneratingPitch] = useState<boolean>(false);
  const [generatedPitch, setGeneratedPitch] = useState<string>('');
  const [pitchError, setPitchError] = useState<string | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);

  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState<boolean>(false);
  const [linkedInGeneratorResult, setLinkedInGeneratorResult] = useState<LinkedInGeneratorResult | null>(null);
  const [linkedInGeneratorError, setLinkedInGeneratorError] = useState<string | null>(null);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  const [premiumModalFeatureName, setPremiumModalFeatureName] = useState('');
  const [premiumModalFeatureDescription, setPremiumModalFeatureDescription] = useState('');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    localStorage.setItem('roleready-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription || !resume) {
      setError("Please provide both a job description and a resume.");
      return;
    }
    if (!agreedToTerms) {
        setError("You must agree to the Terms of Service to proceed.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(jobDescription, resume);
      setAnalysisResult(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during analysis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, resume, agreedToTerms]);

  const handleTryExample = useCallback(() => {
    let availableSamples = samples;
    if (samples.length > 1 && jobDescription) {
      const currentSample = samples.find(s => s.jobDescription === jobDescription);
      if (currentSample) {
        availableSamples = samples.filter(s => s.name !== currentSample.name);
      }
    }

    const randomIndex = Math.floor(Math.random() * availableSamples.length);
    const selectedSample = availableSamples[randomIndex];

    setJobDescription(selectedSample.jobDescription);
    setResume(selectedSample.resume);
    setAnalysisResult(null);
    setError(null);
    setAgreedToTerms(true); // Pre-agree for example
    setView('app');
  }, [jobDescription]);
  
  const handleStartOver = useCallback(() => {
      setJobDescription('');
      setResume('');
      setAnalysisResult(null);
      setError(null);
      setAgreedToTerms(false);
  }, []);
  
  const handleStartNewSession = useCallback(() => {
      handleStartOver();
      setView('app');
  }, [handleStartOver]);

  const handleRewriteRequest = useCallback(async () => {
    if (!resume || !jobDescription || !analysisResult) {
      setError("Cannot rewrite without a resume, job description, and a completed analysis.");
      return;
    }
    setIsRewriting(true);
    let rewriteError: string | null = null;

    try {
      const rewrittenText = await rewriteResumeForJob(
        resume,
        jobDescription,
        analysisResult.modernizationSuggestions
      );
      setRewrittenResume(rewrittenText);
      setIsRewriteModalOpen(true);
    } catch (e) {
      if (e instanceof Error) {
        rewriteError = e.message;
        console.error(rewriteError);
      } else {
        console.error("An unknown error occurred during resume rewrite.");
      }
    } finally {
      setIsRewriting(false);
    }
  }, [resume, jobDescription, analysisResult]);

  const handleFindJobsRequest = useCallback(async () => {
    if (!resume) {
      setJobSuggestionsError("A resume is required to find job suggestions.");
      setJobSuggestions(null);
      setIsJobSuggestionsModalOpen(true);
      return;
    }
    setIsFindingJobs(true);
    setJobSuggestionsError(null);
    setJobSuggestions(null);
    setIsJobSuggestionsModalOpen(true);

    try {
      const suggestions = await findBetterJobs(resume);
      setJobSuggestions(suggestions);
    } catch (e) {
      if (e instanceof Error) {
        setJobSuggestionsError(e.message);
      } else {
        setJobSuggestionsError("An unknown error occurred while finding jobs.");
      }
    } finally {
      setIsFindingJobs(false);
    }
  }, [resume]);

  const handleGeneratePitchRequest = useCallback(async () => {
    if (!resume || !jobDescription) {
        setPitchError("A resume and job description are required to generate a pitch.");
        setGeneratedPitch('');
        setIsPitchModalOpen(true);
        return;
    }
    setIsGeneratingPitch(true);
    setPitchError(null);
    setGeneratedPitch('');
    setIsPitchModalOpen(true);

    try {
      const pitch = await generatePitch(resume, jobDescription);
      setGeneratedPitch(pitch);
    } catch (e) {
        if (e instanceof Error) {
            setPitchError(e.message);
        } else {
            setPitchError("An unknown error occurred while generating your pitch.");
        }
    } finally {
        setIsGeneratingPitch(false);
    }
  }, [resume, jobDescription]);
  
  const handleGenerateLinkedInRequest = useCallback(async () => {
    if (!resume || !jobDescription) {
        setLinkedInGeneratorError("A resume and job description are required to generate LinkedIn profile content.");
        setLinkedInGeneratorResult(null);
        setIsLinkedInModalOpen(true);
        return;
    }
    setIsGeneratingLinkedIn(true);
    setLinkedInGeneratorError(null);
    setLinkedInGeneratorResult(null);
    setIsLinkedInModalOpen(true);

    try {
        const result = await generateLinkedInProfile(resume, jobDescription);
        setLinkedInGeneratorResult(result);
    } catch (e) {
        if (e instanceof Error) {
            setLinkedInGeneratorError(e.message);
        } else {
            setLinkedInGeneratorError("An unknown error occurred while generating your profile content.");
        }
    } finally {
        setIsGeneratingLinkedIn(false);
    }
  }, [resume, jobDescription]);


  const handleShowPremiumFeature = (featureName: string, featureDescription: string) => {
    setPremiumModalFeatureName(featureName);
    setPremiumModalFeatureDescription(featureDescription);
    setIsPremiumModalOpen(true);
  };

  const renderAppContent = () => {
    const showResults = analysisResult || isLoading || error;
    const isAnalysisDone = !!(analysisResult || error) && !isLoading;
    
    return (
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <header className="text-center">
                 <h1 className="text-2xl sm:text-3xl font-extrabold text-light-heading dark:text-dark-heading">
                    RoleReady AI
                </h1>
                <p className="text-light-text dark:text-dark-text mt-1">Evaluate your resume against a job description to identify strengths and weaknesses.</p>
            </header>
            <ProgressTracker currentStep={showResults ? 'analysis' : 'input'} isComplete={isAnalysisDone} />
            
            <div className="flex-1 flex flex-col">
              {showResults ? (
                  <AnalysisDisplay
                      result={analysisResult}
                      isLoading={isLoading}
                      error={error}
                      onRewrite={handleRewriteRequest}
                      isRewriting={isRewriting}
                      onFindJobs={handleFindJobsRequest}
                      isFindingJobs={isFindingJobs}
                      onStartOver={handleStartOver}
                      onGeneratePitch={handleGeneratePitchRequest}
                      isGeneratingPitch={isGeneratingPitch}
                      onGenerateLinkedIn={handleGenerateLinkedInRequest}
                      isGeneratingLinkedIn={isGeneratingLinkedIn}
                      onShowPremiumFeature={handleShowPremiumFeature}
                  />
              ) : (
                  <InputSection 
                      jobDescription={jobDescription}
                      setJobDescription={setJobDescription}
                      resume={resume}
                      setResume={setResume}
                      onAnalyze={handleAnalyze}
                      onTryExample={handleTryExample}
                      isLoading={isLoading}
                      agreedToTerms={agreedToTerms}
                      setAgreedToTerms={setAgreedToTerms}
                      setView={setView}
                  />
              )}
            </div>
        </div>
    );
  }
  
  const renderContent = () => {
    switch (view) {
        case 'home':
            return <HomePage setView={setView} onTryExample={handleTryExample} />;
        case 'app':
            return renderAppContent();
        case 'roadmap':
            return <RoadmapPage />;
        case 'privacy':
            return <PrivacyPolicyPage />;
        case 'terms':
            return <TermsOfServicePage />;
        default:
            return <HomePage setView={setView} onTryExample={handleTryExample} />;
    }
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text font-sans flex">
       <style>{`
          .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-fast { animation: fadeInFast 0.2s ease-in-out; }
          @keyframes fadeInFast {
              from { opacity: 0; }
              to { opacity: 1; }
          }
       `}</style>
      
      <Sidebar view={view} setView={setView} theme={theme} toggleTheme={toggleTheme} onStartNewSession={handleStartNewSession} />

      <main className="flex-1 flex flex-col pl-20">
        {renderContent()}
      </main>

      <RewriteModal
        isOpen={isRewriteModalOpen}
        onClose={() => setIsRewriteModalOpen(false)}
        content={rewrittenResume}
      />
      <JobSuggestionsModal
        isOpen={isJobSuggestionsModalOpen}
        onClose={() => setIsJobSuggestionsModalOpen(false)}
        suggestions={jobSuggestions}
        isLoading={isFindingJobs}
        error={jobSuggestionsError}
      />
      <PitchGeneratorModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        pitch={generatedPitch}
        isLoading={isGeneratingPitch}
        error={pitchError}
      />
       <LinkedInProfileGeneratorModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        isLoading={isGeneratingLinkedIn}
        result={linkedInGeneratorResult}
        error={linkedInGeneratorError}
      />
      <PremiumFeatureModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        featureName={premiumModalFeatureName}
        featureDescription={premiumModalFeatureDescription}
      />
    </div>
  );
};

export default App;
