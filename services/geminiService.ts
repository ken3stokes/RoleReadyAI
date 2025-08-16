import type { AnalysisResult, ModernizationSuggestion, JobSuggestion, LinkedInGeneratorResult } from '../types';

async function callApi<T>(action: string, payload: unknown): Promise<T> {
  try {
    const response = await fetch('/.netlify/functions/gemini-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(`API Error: ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }

    return await response.json();
  } catch (e) {
    console.error(`Error calling action "${action}":`, e);
    if (e instanceof Error) {
        throw new Error(`Failed to get a valid response from the AI. Reason: ${e.message}`);
    }
    throw new Error("An unknown error occurred during the API call.");
  }
}


export async function analyzeResume(jobDescription: string, resume: string): Promise<AnalysisResult> {
  return callApi<AnalysisResult>('analyze', { jobDescription, resume });
}

export async function rewriteResumeForJob(originalResume: string, jobDescription: string, modernizationSuggestions: ModernizationSuggestion[]): Promise<string> {
    const result = await callApi<{ rewrittenResume: string }>('rewrite', { originalResume, jobDescription, modernizationSuggestions });
    return result.rewrittenResume;
}

export async function findBetterJobs(resume: string): Promise<JobSuggestion[]> {
  return callApi<JobSuggestion[]>('find_jobs', { resume });
}

export async function generatePitch(resume: string, jobDescription: string): Promise<string> {
    const result = await callApi<{ pitch: string }>('generate_pitch', { resume, jobDescription });
    return result.pitch;
}

export async function generateLinkedInProfile(resume: string, jobDescription: string): Promise<LinkedInGeneratorResult> {
  return callApi<LinkedInGeneratorResult>('generate_linkedin', { resume, jobDescription });
}