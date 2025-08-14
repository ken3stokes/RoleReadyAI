export interface Alignment {
    theme: string;
    jdKeyword: string;
    resumeEvidence: string;
    match: '✔️' | '⚠️' | '❌' | string;
}

export interface RewriteSuggestion {
    originalBullet: string;
    suggestedBullet: string;
}

export interface ModernizationSuggestion {
    item: string;
    category: 'Outdated Skill' | 'Buzzword';
    reason: string;
    suggestion?: string;
}

export interface FormattingIssue {
    issue: string;
    suggestion: string;
    severity: 'Critical' | 'Warning';
}

export interface KeywordGap {
    keyword: string;
    priority: 'Critical' | 'Important' | 'Recommended';
    suggestion: string;
}

export interface SectionAnalysis {
    sectionName: string;
    score: number; // score 1-10 for that section
    feedback: string;
}

export interface InsightItem {
    item: string;
    explanation: string;
}

export interface JDInsight {
    hardSkills: InsightItem[];
    softSkills: InsightItem[];
    complianceRequirements: InsightItem[];
    hiddenRequirements: InsightItem[];
}

export interface SuccessFactor {
    name: 'Skill Match' | 'Seniority Match' | 'Industry Alignment' | 'Location Compatibility';
    score: number; // Percentage score 0-100
    justification: string;
}

export interface SuccessLikelihood {
    overallScore: number; // Percentage score 0-100
    summary: string;
    factors: SuccessFactor[];
}

export interface QuickSummary {
    topStrength: string;
    topImprovement: string;
    finalVerdict: string;
}

export interface InDemandSkill {
    skill: string;
    reason: string;
    evidence: string;
}

export interface AnalysisResult {
    score: number;
    scoreMeaning: string;
    quickSummary: QuickSummary;
    successLikelihood: SuccessLikelihood;
    alignmentTable: Alignment[];
    opportunitiesForImprovement: string[];
    rewriteSuggestions: RewriteSuggestion[];
    modernizationSuggestions: ModernizationSuggestion[];
    keywordGaps: KeywordGap[];
    sectionAnalysis: SectionAnalysis[];
    jdInsights: JDInsight;
    formattingIssues: FormattingIssue[];
    inDemandSkills: InDemandSkill[];
}

export interface JobSuggestion {
    title: string;
    justification: string;
}

export interface LinkedInGeneratorResult {
    suggestedHeadlines: string[];
    generatedAboutSection: string;
    reasoning: string[];
}