import type { AnalysisResult, ModernizationSuggestion, JobSuggestion, LinkedInGeneratorResult } from '../types';

// The base path for your Netlify function.
const API_BASE_PATH = '/.netlify/functions/gemini-proxy';

// A generic helper to handle fetch requests to your function.
async function callApi<T>(action: string, payload: unknown): Promise<T> {
    const response = await fetch(API_BASE_PATH, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        // Try to parse the error message from the backend, otherwise throw a generic error.
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred on the server.' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
}

export function analyzeResume(jobDescription: string, resume: string): Promise<AnalysisResult> {
    return callApi<AnalysisResult>('analyze', { jobDescription, resume });
}

export async function rewriteResumeForJob(originalResume: string, jobDescription: string, modernizationSuggestions: ModernizationSuggestion[]): Promise<string> {
    const result = await callApi<{ rewrittenResume: string }>('rewrite', { originalResume, jobDescription, modernizationSuggestions });
    return result.rewrittenResume;
}

export function findBetterJobs(resume: string): Promise<JobSuggestion[]> {
    return callApi<JobSuggestion[]>('find_jobs', { resume });
}

export async function generatePitch(resume: string, jobDescription: string): Promise<string> {
    const result = await callApi<{ pitch: string }>('generate_pitch', { resume, jobDescription });
    return result.pitch;
}

export function generateLinkedInProfile(resume: string, jobDescription: string): Promise<LinkedInGeneratorResult> {
    return callApi<LinkedInGeneratorResult>('generate_linkedin', { resume, jobDescription });
}