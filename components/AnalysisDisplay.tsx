import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { AnalysisResult, Alignment, RewriteSuggestion, KeywordGap, ModernizationSuggestion, InsightItem, SuccessLikelihood, FormattingIssue, InDemandSkill } from '../types';

const TABS = ['Overview', 'Keyword Analysis', 'Content & Style', 'JD Insights'];

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  const getColor = () => {
    if (score >= 9) return 'text-green-500';
    if (score >= 7) return 'text-sky-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="relative flex items-center justify-center w-40 h-40 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`${getColor()} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-extrabold ${getColor()}`}>{score.toFixed(1)}</span>
        <span className="text-light-subtle dark:text-dark-subtle text-sm">/ 10</span>
      </div>
    </div>
  );
};

const Tooltip: React.FC<{ children: React.ReactNode, content: string, widthClass?: string }> = ({ children, content, widthClass = 'w-72' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRoot = document.getElementById('tooltip-root');

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = 80; // Estimated height of tooltip for flipping logic
      
      let top = rect.top - tooltipHeight;
      if (top < 10) { // Not enough space above, flip below
          top = rect.bottom + 10;
      } else { // Position above
          top = rect.top - 10;
      }
      
      setPosition({
        top: top,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!tooltipRoot) return null;

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {children}
      </div>
      {isOpen && createPortal(
        <div 
          style={{ top: position.top, left: position.left }} 
          className={`absolute ${position.top < (triggerRef.current?.getBoundingClientRect().top ?? 0) ? 'transform -translate-x-1/2 -translate-y-full' : 'transform -translate-x-1/2'} z-50`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className={`p-3 bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-600 rounded-lg text-sm text-slate-200 shadow-lg animate-fade-in-fast ${widthClass}`}>
              {content}
            </div>
        </div>,
        tooltipRoot
      )}
    </>
  );
};

const QuestionMarkIcon = () => (
    <button
        className="flex items-center justify-center text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text transition-colors"
        aria-label="More information"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 2.224V14a1 1 0 11-2 0v-1.776c-1.396-.264-2.5-1.51-2.5-2.95V8.5a3.5 3.5 0 117 0v.774c0 1.44-1.104 2.686-2.5 2.95z" clipRule="evenodd" />
        </svg>
    </button>
)

const AnalysisSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; tooltipText?: string }> = ({ title, children, icon, tooltipText }) => (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-light-border dark:border-dark-border pb-4">
             <h3 className="flex items-center gap-3 text-xl font-bold text-light-heading dark:text-dark-heading">
                {icon}
                {title}
            </h3>
            {tooltipText && <Tooltip content={tooltipText}><QuestionMarkIcon /></Tooltip>}
        </div>
        {children}
    </div>
);

const InsightList: React.FC<{ title: string; items: InsightItem[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-light-border dark:border-dark-border">
            <h4 className={`flex items-center gap-2 text-lg font-bold mb-3 ${color}`}>
                {icon}
                {title}
            </h4>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="text-light-text dark:text-dark-text border-l-2 border-light-border dark:border-dark-border pl-3">
                        <strong className="block text-light-heading dark:text-dark-heading font-semibold">{item.item}</strong>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{item.explanation}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SuccessLikelihoodSection: React.FC<{ data: SuccessLikelihood }> = ({ data }) => {
    const { overallScore, summary, factors } = data;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (overallScore / 100) * circumference;

    const getColor = (score: number) => {
        if (score >= 85) return 'text-green-500'; if (score >= 70) return 'text-sky-500'; if (score >= 50) return 'text-yellow-500'; return 'text-red-500';
    };
    const getBgColor = (score: number) => {
        if (score >= 85) return 'bg-green-500'; if (score >= 70) return 'bg-sky-500'; if (score >= 50) return 'bg-yellow-500'; return 'bg-red-500';
    };

    const factorIcons: { [key: string]: React.ReactNode } = {
        'Skill Match': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m5 10v4m-2-2h4M5 11h14M5 11a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 11a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2" /></svg>,
        'Seniority Match': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        'Industry Alignment': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
        'Location Compatibility': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    };

    return (
        <AnalysisSection 
            title="Success Likelihood" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            tooltipText="This score estimates your chance of landing an interview based on how well your skills, experience, and background align with the role."
        >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="relative flex-shrink-0 flex items-center justify-center w-44 h-44">
                    <svg className="w-full h-full" viewBox="0 0 140 140">
                        <circle className="text-slate-200 dark:text-slate-700" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" />
                        <circle className={`${getColor(overallScore)} transition-all duration-1000 ease-out`} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" transform="rotate(-90 70 70)" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-5xl font-extrabold ${getColor(overallScore)}`}>{overallScore}<span className="text-3xl">%</span></span>
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                     <p className="text-light-text dark:text-dark-text text-lg">{summary}</p>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {factors.map(factor => (
                    <div key={factor.name} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-light-border/80 dark:border-dark-border/80">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className={`flex items-center gap-2 font-bold text-light-heading dark:text-dark-heading`}>{factorIcons[factor.name]} {factor.name}</h4>
                            <span className={`font-bold text-sm ${getColor(factor.score)}`}>{factor.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2"><div className={`${getBgColor(factor.score)} h-2 rounded-full`} style={{ width: `${factor.score}%` }}></div></div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{factor.justification}</p>
                    </div>
                ))}
            </div>
        </AnalysisSection>
    );
};

const analysisSteps = [
    'Parsing documents',
    'Performing keyword analysis',
    'Scoring resume sections',
    'Checking for formatting issues',
    'Identifying opportunities',
    'Finalizing your report',
];

const AnalysisStatusTracker: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= analysisSteps.length - 1) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 1800);

        return () => clearInterval(timer);
    }, []);

    const getStatusIcon = (stepIndex: number) => {
        if (stepIndex < currentStep) {
            return <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
        }
        if (stepIndex === currentStep) {
            return <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
        }
        return <div className="h-6 w-6 flex items-center justify-center"><div className="h-3 w-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div></div>;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-light-heading dark:text-dark-heading text-center mb-8">Generating Your Analysis...</h3>
            <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                    <div key={step} className={`flex items-center gap-4 transition-opacity duration-500 ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}>
                        <div className="flex-shrink-0">
                            {getStatusIcon(index)}
                        </div>
                        <p className={`text-lg font-medium ${index <= currentStep ? 'text-light-heading dark:text-dark-heading' : 'text-light-text dark:text-dark-text'}`}>
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onRewrite: () => void;
  isRewriting: boolean;
  onFindJobs: () => void;
  isFindingJobs: boolean;
  onStartOver: () => void;
  onGeneratePitch: () => void;
  isGeneratingPitch: boolean;
  onGenerateLinkedIn: () => void;
  isGeneratingLinkedIn: boolean;
  onShowPremiumFeature: (featureName: string, featureDescription: string) => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
    result, 
    isLoading, 
    error, 
    onRewrite, 
    isRewriting, 
    onFindJobs, 
    isFindingJobs, 
    onStartOver,
    onGeneratePitch,
    isGeneratingPitch,
    onGenerateLinkedIn,
    isGeneratingLinkedIn,
    onShowPremiumFeature,
}) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  useEffect(() => {
      if (result) {
          setActiveTab(TABS[0]);
      }
  }, [result]);

  if (isLoading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <AnalysisStatusTracker />
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg m-4">
        <div className="w-12 h-12 text-red-500 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Analysis Failed</h3>
        <p className="text-red-600 dark:text-red-300 mt-2 max-w-md">{error}</p>
         <button onClick={onStartOver} className="mt-6 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-md transition flex items-center justify-center gap-2">
            Try Again
        </button>
      </div>
    );
  }
  
  if (!result) {
    return <div className="flex-1"></div>;
  }

  const { score, scoreMeaning, quickSummary, successLikelihood, alignmentTable, opportunitiesForImprovement, rewriteSuggestions, modernizationSuggestions, keywordGaps, sectionAnalysis, jdInsights, formattingIssues, inDemandSkills } = result;
  const getMatchIcon = (match: string) => { if (match.includes('✔️')) return <span className="text-green-500 text-xl">✔️</span>; if (match.includes('⚠️')) return <span className="text-yellow-500 text-xl">⚠️</span>; if (match.includes('❌')) return <span className="text-red-500 text-xl">❌</span>; return match; };
  const getPriorityPill = (priority: KeywordGap['priority']) => { switch (priority) { case 'Critical': return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/30'; case 'Important': return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-500/30'; case 'Recommended': return 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-500/30'; default: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'; } };
  const getCategoryPill = (category: ModernizationSuggestion['category']) => { switch (category) { case 'Outdated Skill': return 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-500/30'; case 'Buzzword': return 'bg-violet-100 text-violet-800 border border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-500/30'; default: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'; } };
  const getHeatmapColor = (score: number) => { if (score >= 8) return 'bg-green-500'; if (score >= 5) return 'bg-yellow-500'; return 'bg-red-500'; };
  const getSeverityPill = (severity: FormattingIssue['severity']) => { switch (severity) { case 'Critical': return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/30'; case 'Warning': return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-500/30'; default: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'; } };
  const getSeverityIcon = (severity: FormattingIssue['severity']) => { switch (severity) { case 'Critical': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>; case 'Warning': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l5.362 10.243c.636 1.21-.26 2.658-1.503 2.658H4.398c-1.243 0-2.139-1.448-1.503-2.658L8.257 3.099zM10 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>; } };

  const renderTabContent = () => {
      switch(activeTab) {
          case 'Overview':
              return (
                  <div className="space-y-8 animate-fade-in">
                        <AnalysisSection
                            title="Quick Summary"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            tooltipText="This is the most important information from your analysis, giving you immediate, actionable advice."
                        >
                            <div className="space-y-5">
                                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-light-heading dark:text-dark-heading">Your Biggest Strength</h4>
                                        <p className="text-light-text dark:text-dark-text mt-1">{quickSummary.topStrength}</p>
                                    </div>
                                </div>
                                 <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.86 6.3c-.36.27-.77.41-1.2.41H3.1c-1.66 0-2.34 2.16-1.08 3.21l2.56 2.08c.32.26.47.68.34 1.07l-.95 3.52c-.52 1.92 1.58 3.42 3.24 2.34l2.81-1.8c.39-.25.88-.25 1.27 0l2.81 1.8c1.66 1.08 3.77-.42 3.24-2.34l-.95-3.52c-.13-.39.02-.81.34-1.07l2.56-2.08c1.26-1.05.58-3.21-1.08-3.21H12.7c-.43 0-.84-.14-1.2-.41L10.51 3.17z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-light-heading dark:text-dark-heading">Top Priority for Improvement</h4>
                                        <p className="text-light-text dark:text-dark-text mt-1">{quickSummary.topImprovement}</p>
                                    </div>
                                </div>
                            </div>
                        </AnalysisSection>

                      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                         <ScoreGauge score={score} />
                         <div className="flex-1 text-center md:text-left">
                             <h4 className="text-lg font-bold text-light-heading dark:text-dark-heading">Overall Alignment Score</h4>
                             <p className="text-lg font-medium text-light-text dark:text-dark-text mt-1">{scoreMeaning}</p>
                             <p className="text-light-text dark:text-dark-text mt-2">{quickSummary.finalVerdict}</p>
                         </div>
                      </div>
                      {successLikelihood && <SuccessLikelihoodSection data={successLikelihood} />}

                      {inDemandSkills && inDemandSkills.length > 0 && (
                          <AnalysisSection 
                              title="Your Marketable Skills"
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                              tooltipText="These are skills from your resume that are highly valuable in the current job market, making you a strong candidate."
                          >
                              <div className="space-y-4">
                                  {inDemandSkills.map((item, index) => (
                                      <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-light-border dark:border-dark-border">
                                          <h4 className="font-bold text-lg text-light-heading dark:text-dark-heading">{item.skill}</h4>
                                          <p className="text-sm text-light-text dark:text-dark-text mt-2"><span className="font-semibold text-sky-600 dark:text-sky-400">Why it's valuable: </span>{item.reason}</p>
                                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">"{item.evidence}"</p>
                                      </div>
                                  ))}
                              </div>
                          </AnalysisSection>
                      )}
                  </div>
              );
          case 'Keyword Analysis':
              return (
                   <div className="space-y-8 animate-fade-in">
                       {sectionAnalysis && sectionAnalysis.length > 0 && (
                          <AnalysisSection 
                            title="Resume Section Heatmap" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>}
                            tooltipText="We score each section of your resume to show you which parts are strong and which need more focus for this specific job."
                          >
                              <div className="space-y-5">{sectionAnalysis.map((section, index) => (<div key={index}><div className="flex justify-between items-center mb-1"><p className="font-semibold text-light-heading dark:text-dark-heading">{section.sectionName}</p><span className="text-sm font-bold text-light-text dark:text-dark-text">{section.score.toFixed(1)}/10</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className={`${getHeatmapColor(section.score)} h-2 rounded-full transition-all duration-500 ease-out`} style={{ width: `${section.score * 10}%` }}></div></div><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{section.feedback}</p></div>))}</div>
                          </AnalysisSection>
                       )}
                       {keywordGaps && keywordGaps.length > 0 && (
                          <AnalysisSection 
                            title="Prioritized Keyword Gaps" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0zM12 6v1.5M12 16.5V18" /></svg>}
                            tooltipText="These are important keywords from the job description that we couldn't find in your resume. Adding them can significantly improve your match."
                          >
                              <div className="space-y-4">{keywordGaps.map((gap, index) => (<div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-light-border dark:border-dark-border"><div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2"><p className="font-semibold text-light-heading dark:text-dark-heading text-lg">{gap.keyword}</p><span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityPill(gap.priority)}`}>{gap.priority}</span></div><p className="text-light-text dark:text-dark-text"><span className="text-primary font-medium">Suggestion: </span>{gap.suggestion}</p></div>))}</div>
                          </AnalysisSection>
                       )}
                       <AnalysisSection 
                        title="Keyword Alignment" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                        tooltipText="This table shows a detailed breakdown of how your resume's content matches the key requirements of the job description."
                       >
                          <div className="overflow-x-auto"><table className="w-full text-left"><thead className="border-b border-light-border dark:border-dark-border"><tr><th className="p-3 text-sm font-semibold text-light-subtle dark:text-dark-subtle w-1/4">Theme</th><th className="p-3 text-sm font-semibold text-light-subtle dark:text-dark-subtle w-1/4">JD Keyword</th><th className="p-3 text-sm font-semibold text-light-subtle dark:text-dark-subtle w-2/4">Resume Evidence</th><th className="p-3 text-sm font-semibold text-light-subtle dark:text-dark-subtle text-center">Match</th></tr></thead><tbody>{alignmentTable.map((item, index) => (<tr key={index} className="border-b border-light-border dark:border-dark-border last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"><td className="p-3 text-light-text dark:text-dark-text font-medium align-top">{item.theme}</td><td className="p-3 text-light-text dark:text-dark-text align-top">{item.jdKeyword}</td><td className="p-3 text-slate-500 dark:text-slate-400 align-top">{item.resumeEvidence}</td><td className="p-3 text-center align-middle">{getMatchIcon(item.match)}</td></tr>))}</tbody></table></div>
                       </AnalysisSection>
                   </div>
              );
          case 'Content & Style':
              return (
                  <div className="space-y-8 animate-fade-in">
                       <AnalysisSection 
                        title="Bullet Rewrite Suggestions" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                        tooltipText="Strong, action-oriented bullet points with measurable results are more impactful. Here are some suggestions to improve yours."
                       >
                          <div className="space-y-6">{rewriteSuggestions.map((s, i) => (<div key={i} className="border-l-4 border-primary pl-4"><p className="text-slate-500 dark:text-slate-400 italic">"{s.originalBullet}"</p><p className="text-light-text dark:text-dark-heading mt-2 font-semibold"><span className="text-green-500 mr-2">→</span>{s.suggestedBullet}</p></div>))}</div>
                      </AnalysisSection>
                      {modernizationSuggestions && modernizationSuggestions.length > 0 && (
                          <AnalysisSection 
                            title="Resume Modernization" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13l.648 1.938a3.375 3.375 0 002.672 2.672L21.75 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" /></svg>}
                            tooltipText="This scan looks for outdated skills or cliché buzzwords that can weaken your resume and suggests modern alternatives."
                          >
                              <div className="space-y-5">{modernizationSuggestions.map((item, index) => (<div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-light-border dark:border-dark-border"><div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3"><p className="font-semibold text-light-heading dark:text-dark-heading text-lg">{item.item}</p><span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getCategoryPill(item.category)}`}>{item.category}</span></div><p className="text-slate-500 dark:text-slate-400 mb-3"><span className="font-semibold text-amber-700 dark:text-amber-400">Reason: </span>{item.reason}</p>{item.suggestion && (<div className="text-light-text dark:text-green-200 bg-green-100/60 dark:bg-green-500/10 border-l-4 border-green-500 pl-4 py-2 rounded-r-md"><p><span className="font-semibold text-green-700 dark:text-green-300">Suggestion: </span>{item.suggestion}</p></div>)}</div>))}</div>
                          </AnalysisSection>
                      )}
                      {formattingIssues && formattingIssues.length > 0 && (
                        <AnalysisSection 
                            title="ATS Friendliness & Formatting" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2-2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>}
                            tooltipText="A strict audit of your resume's format against common Applicant Tracking System (ATS) requirements. Fixing these issues is critical to ensure your resume is parsed correctly and read by a recruiter."
                        >
                            <div className="space-y-4">
                                {formattingIssues.map((item, index) => (
                                    <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border-l-4 border-slate-300 dark:border-slate-600">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 pt-1">{getSeverityIcon(item.severity)}</div>
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                                    <p className="font-semibold text-light-heading dark:text-dark-heading">{item.issue}</p>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getSeverityPill(item.severity)}`}>{item.severity}</span>
                                                </div>
                                                <p className="text-light-text dark:text-dark-text"><span className="text-primary font-medium">Suggestion: </span>{item.suggestion}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnalysisSection>
                      )}
                      <AnalysisSection 
                        title="Opportunities for Improvement" 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        tooltipText="This section highlights potential concerns a recruiter might have, such as career gaps or lack of specific qualifications mentioned in the job description."
                      >
                          <ul className="space-y-2 list-disc list-inside text-light-text dark:text-dark-text">{opportunitiesForImprovement.map((flag, index) => <li key={index}>{flag}</li>)}</ul>
                      </AnalysisSection>
                  </div>
              );
          case 'JD Insights':
              return (
                  <div className="space-y-8 animate-fade-in">
                      {jdInsights && (
                          <AnalysisSection 
                            title="Job Description Intelligence" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                            tooltipText="This breaks down the job description into different types of requirements to help you understand what the employer is truly looking for."
                          >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <InsightList title="Hard Skills" items={jdInsights.hardSkills} color="text-sky-600 dark:text-sky-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} />
                                  <InsightList title="Soft Skills" items={jdInsights.softSkills} color="text-teal-600 dark:text-teal-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                                  <InsightList title="Compliance Requirements" items={jdInsights.complianceRequirements} color="text-amber-600 dark:text-amber-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                                  <InsightList title="Hidden Requirements" items={jdInsights.hiddenRequirements} color="text-violet-600 dark:text-violet-400" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} />
                              </div>
                          </AnalysisSection>
                      )}
                  </div>
              )
          default:
              return null;
      }
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-1 shadow-sm">
        <div className="border-b border-light-border dark:border-dark-border px-4 sm:px-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                 {TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-light-text dark:text-dark-text hover:text-light-heading dark:hover:text-dark-heading hover:border-slate-300 dark:hover:border-slate-600'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors`}
                    >
                      {tab}
                    </button>
                ))}
            </nav>
        </div>

        <div className="flex-grow p-4 sm:p-6 bg-slate-50/50 dark:bg-dark-background/20 rounded-b-lg overflow-y-auto">
            {renderTabContent()}
        </div>
       
       <div className="text-center p-4 border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card rounded-b-lg">
          <h4 className="text-base font-semibold text-light-heading dark:text-dark-heading mb-4">What's Next?</h4>
          <div className="flex flex-wrap justify-center items-center gap-4">
               <button onClick={onStartOver} className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-md transition flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                New Analysis
              </button>
              <button onClick={onRewrite} disabled={isRewriting} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-md transition flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-wait">
                {isRewriting ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Rewriting...</span></>) : (<>Rewrite For Role</>)}
              </button>
              <button onClick={onGeneratePitch} disabled={isGeneratingPitch} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-md transition flex items-center justify-center gap-2 disabled:bg-teal-300 disabled:cursor-wait">
                {isGeneratingPitch ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Generating...</span></>) : ("Generate Your Pitch")}
              </button>
               <button onClick={onGenerateLinkedIn} disabled={isGeneratingLinkedIn} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-md transition flex items-center justify-center gap-2 disabled:bg-sky-300 disabled:cursor-wait">
                {isGeneratingLinkedIn ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Generating...</span></>) : ("LinkedIn Profile Generator")}
              </button>
              <button onClick={() => onShowPremiumFeature('Interview Prep Simulator', 'Get a list of likely interview questions based on your resume and the job description, helping you prepare with confidence.')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2 border border-slate-300 dark:border-dark-border">
                Generate Interview Questions
                <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">PREMIUM</span>
              </button>
              <button onClick={onFindJobs} disabled={isFindingJobs} className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-wait border border-slate-300 dark:border-dark-border">
                {isFindingJobs ? (<><svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Finding...</span></>) : ("Suggest Other Roles")}
              </button>
          </div>
           <p className="text-xs text-light-subtle dark:text-dark-subtle mt-6">
            Disclaimer: This analysis is AI-generated and should be used as a guide. Always review and tailor suggestions to your unique experience.
          </p>
      </div>
    </div>
  );
};

export default AnalysisDisplay;