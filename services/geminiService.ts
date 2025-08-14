import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, ModernizationSuggestion, JobSuggestion, LinkedInGeneratorResult, InDemandSkill } from '../types';

// Initialize the Google AI client.
// The API key is sourced from the environment variable `process.env.API_KEY`
// as a hard requirement.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- Schemas for structured JSON responses ---
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "The final score out of 10.0, can be a float." },
        scoreMeaning: { type: Type.STRING, description: "A brief description of what the score means (e.g., 'Good match, minor issues')." },
        quickSummary: {
            type: Type.OBJECT,
            description: "A concise, actionable summary of the analysis.",
            properties: {
                topStrength: { type: Type.STRING, description: "A single sentence describing the candidate's biggest strength for this specific role." },
                topImprovement: { type: Type.STRING, description: "The single most impactful improvement the candidate can make to their resume for this role." },
                finalVerdict: { type: Type.STRING, description: "A final, encouraging summary sentence about the overall match." }
            },
            required: ["topStrength", "topImprovement", "finalVerdict"]
        },
        successLikelihood: {
            type: Type.OBJECT,
            description: "A detailed breakdown of the candidate's likelihood of success for the role.",
            properties: {
                overallScore: { type: Type.NUMBER, description: "A confidence score from 0-100% on how well the resume aligns with the job." },
                summary: { type: Type.STRING, description: "A brief summary explaining the overall success likelihood score." },
                factors: {
                    type: Type.ARRAY,
                    description: "A breakdown of the factors contributing to the success score.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The name of the factor: 'Skill Match', 'Seniority Match', 'Industry Alignment', or 'Location Compatibility'." },
                            score: { type: Type.NUMBER, description: "The score for this factor, from 0-100." },
                            justification: { type: Type.STRING, description: "A brief justification for the factor's score." }
                        },
                        required: ["name", "score", "justification"]
                    }
                }
            },
            required: ["overallScore", "summary", "factors"]
        },
        jdInsights: {
            type: Type.OBJECT,
            description: "A detailed breakdown of the job description into different skill categories.",
            properties: {
                hardSkills: {
                    type: Type.ARRAY,
                    description: "List of specific, teachable technical abilities (e.g., 'Python', 'AWS', 'SQL'). For the `explanation`, provide its context in the role.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING, description: "The hard skill (e.g., 'Python')." },
                            explanation: { type: Type.STRING, description: "Context or specific requirement related to the skill." }
                        },
                        required: ["item", "explanation"]
                    }
                },
                softSkills: {
                    type: Type.ARRAY,
                    description: "List of interpersonal skills required.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING, description: "The soft skill (e.g., 'Communication')." },
                            explanation: { type: Type.STRING, description: "The quote or phrase from the JD that implies this skill." }
                        },
                        required: ["item", "explanation"]
                    }
                },
                complianceRequirements: {
                    type: Type.ARRAY,
                    description: "List of compliance-related requirements like certifications or clearances.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING, description: "The compliance item (e.g., 'CISSP Certification')." },
                            explanation: { type: Type.STRING, description: "Details about the compliance requirement." }
                        },
                        required: ["item", "explanation"]
                    }
                },
                hiddenRequirements: {
                    type: Type.ARRAY,
                    description: "List of inferred requirements from vague phrases.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING, description: "The inferred skill (e.g., 'Stakeholder Management')." },
                            explanation: { type: Type.STRING, description: "The phrase from the JD and the reasoning for the inference." }
                        },
                        required: ["item", "explanation"]
                    }
                }
            },
            required: ["hardSkills", "softSkills", "complianceRequirements", "hiddenRequirements"]
        },
        alignmentTable: {
            type: Type.ARRAY,
            description: "Table comparing job description keywords to resume evidence.",
            items: {
                type: Type.OBJECT,
                properties: {
                    theme: { type: Type.STRING, description: "Category of the requirement (e.g., 'Tools & Systems')." },
                    jdKeyword: { type: Type.STRING, description: "Specific keyword/phrase from the job description." },
                    resumeEvidence: { type: Type.STRING, description: "Evidence found in the resume, or 'Not found'." },
                    match: { type: Type.STRING, description: "Match status: '✔️', '⚠️', or '❌'." },
                },
                required: ["theme", "jdKeyword", "resumeEvidence", "match"]
            }
        },
        opportunitiesForImprovement: {
            type: Type.ARRAY,
            description: "List of potential opportunities for improvement or concerns a recruiter might have (e.g., career gaps, lack of specific degree).",
            items: { type: Type.STRING }
        },
        rewriteSuggestions: {
            type: Type.ARRAY,
            description: "Suggestions for rewriting weak bullet points.",
            items: {
                type: Type.OBJECT,
                properties: {
                    originalBullet: { type: Type.STRING, description: "The original bullet point from the resume." },
                    suggestedBullet: { type: Type.STRING, description: "The improved version of the bullet point." }
                },
                required: ["originalBullet", "suggestedBullet"]
            }
        },
        modernizationSuggestions: {
            type: Type.ARRAY,
            description: "Suggestions for modernizing the resume, including replacing outdated skills and removing cliché buzzwords.",
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING, description: "The outdated skill or cliché buzzword found in the resume." },
                    category: { type: Type.STRING, description: "The category of the item: 'Outdated Skill' or 'Buzzword'." },
                    reason: { type: Type.STRING, description: "An explanation of why the item is flagged, including industry context." },
                    suggestion: { type: Type.STRING, description: "A suggested modern equivalent or alternative phrasing." }
                },
                required: ["item", "category", "reason"]
            }
        },
        keywordGaps: {
            type: Type.ARRAY,
            description: "A prioritized list of critical keywords missing from the resume.",
            items: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING, description: "The missing keyword from the job description." },
                    priority: { type: Type.STRING, description: "The importance of the keyword: 'Critical', 'Important', or 'Recommended'." },
                    suggestion: { type: Type.STRING, description: "A concrete suggestion on where and how to integrate this keyword." }
                },
                required: ["keyword", "priority", "suggestion"]
            }
        },
        sectionAnalysis: {
            type: Type.ARRAY,
            description: "A section-by-section score heatmap of the resume.",
            items: {
                type: Type.OBJECT,
                properties: {
                    sectionName: { type: Type.STRING, description: "The name of the resume section (e.g., 'Professional Summary', 'Experience at Acme Inc')." },
                    score: { type: Type.NUMBER, description: "A score from 1-10 for this specific section." },
                    feedback: { type: Type.STRING, description: "Brief feedback explaining the score for this section." }
                },
                required: ["sectionName", "score", "feedback"]
            }
        },
        formattingIssues: {
            type: Type.ARRAY,
            description: "A list of formatting or structural issues that could harm ATS parsing or professional appearance.",
            items: {
                type: Type.OBJECT,
                properties: {
                    issue: { type: Type.STRING, description: "A brief description of the formatting issue found." },
                    suggestion: { type: Type.STRING, description: "A concrete suggestion on how to fix the issue." },
                    severity: { type: Type.STRING, description: "The severity of the issue: 'Critical' (likely to break ATS parsing) or 'Warning' (unprofessional or hurts readability)." }
                },
                required: ["issue", "suggestion", "severity"]
            }
        },
        inDemandSkills: {
            type: Type.ARRAY,
            description: "A list of the candidate's most valuable, in-demand skills found in the resume, with justification for why they are relevant in the current job market.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The in-demand skill identified from the resume." },
                    reason: { type: Type.STRING, description: "A detailed explanation of why this skill is currently valuable in the job market, referencing industry trends." },
                    evidence: { type: Type.STRING, description: "The specific quote or bullet point from the resume that demonstrates this skill." }
                },
                required: ["skill", "reason", "evidence"]
            }
        }
    },
    required: ["score", "scoreMeaning", "quickSummary", "successLikelihood", "jdInsights", "alignmentTable", "opportunitiesForImprovement", "rewriteSuggestions", "modernizationSuggestions", "keywordGaps", "sectionAnalysis", "formattingIssues", "inDemandSkills"]
};
const jobSuggestionsSchema = {
    type: Type.ARRAY,
    description: "A list of 3-5 job suggestions based on the user's resume.",
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "The suggested job title." },
            justification: { type: Type.STRING, description: "A brief justification explaining why this job is a good fit based on the resume's themes and skills." },
        },
        required: ["title", "justification"]
    }
};
const linkedInGeneratorSchema = {
    type: Type.OBJECT,
    properties: {
        suggestedHeadlines: {
            type: Type.ARRAY,
            description: "A list of 3-5 compelling, keyword-rich headline suggestions for a LinkedIn profile, generated from the resume and job description.",
            items: { type: Type.STRING }
        },
        generatedAboutSection: {
            type: Type.STRING,
            description: "A completely new, impactful 'About' section for LinkedIn, generated from scratch using a professional and engaging tone based on the user's resume."
        },
        reasoning: {
            type: Type.ARRAY,
            description: "A bulleted list of 3-4 key reasons explaining why the generated headlines and about section are effective, referencing keywords and strategies from the resume and job description.",
            items: { type: Type.STRING }
        }
    },
    required: ["suggestedHeadlines", "generatedAboutSection", "reasoning"]
};

export async function analyzeResume(jobDescription: string, resume: string): Promise<AnalysisResult> {
    const prompt = `
You are RoleReady AI, a world-class resume analyzer. Your task is to evaluate the provided Resume against the Job Description with extreme rigor and accuracy. Your entire output MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text before or after the JSON object.

**Job Description:**
\`\`\`
${jobDescription}
\`\`\`

**Resume:**
\`\`\`
${resume}
\`\`\`

**Your Analysis Steps:**

1.  **Parse Job Description for Themes:** Identify 6-10 critical requirement themes from the JD. Group them into logical categories like "Tools & Technologies", "Core Responsibilities", "Domain Knowledge", or "Leadership". Extract the exact keywords for each theme.

2.  **Job Description Intelligence Analysis:** Populate the \`jdInsights\` object.
    *   **\`hardSkills\`**: Identify specific, teachable technical abilities (e.g., 'Python', 'AWS', 'SQL'). For the \`explanation\`, provide its context in the role.
    *   **\`softSkills\`**: Identify interpersonal qualities (e.g., 'Communication', 'Teamwork'). For the \`explanation\`, provide the phrase from the JD that implies this skill.
    *   **\`complianceRequirements\`**: Identify non-negotiable qualifications like certifications, degrees, or security clearances (e.g., 'CISSP Certification', 'US Citizenship'). For the \`explanation\`, provide any specific details mentioned.
    *   **\`hiddenRequirements\`**: Infer underlying expectations. For example, if the JD says 'work in a fast-paced environment', the \`item\` should be 'Adaptability' and the \`explanation\` should be 'Inferred from the need to "work in a fast-paced environment".' If it says 'work cross-functionally', the \`item\` is 'Stakeholder Management' and the \`explanation\` is 'Inferred from "work cross-functionally with product and design teams".'

3.  **Evaluate Resume for Alignment:** For each JD theme from step 1, search the resume for evidence.
    *   Award '✔️' for a direct match or strong, relevant synonym.
    *   Award '⚠️' for a partial match, weak verb, or unquantified claim.
    *   Award '❌' if the keyword is missing.
    *   Be strict: if a critical tool (e.g., 'Kubernetes', 'Oracle Cloud') is missing, it's an '❌'.

4.  **Score the Resume:** Calculate a total score out of 10.0, weighted precisely as follows:
    *   **Keyword & Theme Match (35%):** How well do resume keywords align with JD themes?
    *   **Domain & Role Relevance (35%):** Does the resume's experience genuinely fit the industry and seniority of the role?
    *   **Language & Impact (20%):** Strength of action verbs and use of quantifiable metrics.
    *   **Gaps & Omissions (10%):** Penalty for missing critical requirements.
    *   Based on the final score, determine the \`scoreMeaning\`.

5.  **Calculate Success Likelihood Score:** Populate the \`successLikelihood\` object with meticulous detail.
    *   **\`overallScore\`**: Calculate a holistic confidence score from 0-100% representing the candidate's likelihood of success. This should be a weighted average of the factors below.
    *   **\`summary\`**: Write a concise summary explaining the overall score.
    *   **\`factors\`**: Populate the array with four distinct factor objects:
        *   **Skill Match**: Analyze the alignment of technical and soft skills. Provide a score from 0-100 and a \`justification\`.
        *   **Seniority Match**: Compare years of experience, job titles (e.g., Senior, Lead, Staff), and management duties against the role's requirements. Provide a score from 0-100 and a \`justification\`.
        *   **Industry Alignment**: Evaluate how well the candidate's industry background (e.g., FinTech, Healthcare, SaaS) matches the company's domain. Provide a score from 0-100 and a \`justification\`.
        *   **Location Compatibility**: Score 0-100. Score 100 for 'Remote' roles or if location is not specified. If a specific city/state is required and the resume shows a different location without mentioning 'Open to relocation' or 'Remote', assign a lower score. Provide a \`justification\`.

6.  **Create Keyword Alignment Table:** Populate the \`alignmentTable\` array based on your analysis in step 3. **Crucially, ensure the first letter of every string in the \`jdKeyword\` and \`resumeEvidence\` fields is capitalized.**

7.  **Analyze Keyword Gaps & Prioritize:** Identify keywords from the JD that are completely missing from the resume. Populate the \`keywordGaps\` array. For each missing keyword:
    *   Assign a \`priority\`: 'Critical' (for must-have skills/tech), 'Important' (for core responsibilities), or 'Recommended' (for nice-to-haves).
    *   Provide a concrete \`suggestion\` on how to integrate this keyword.

8.  **Create Section-by-Section Heatmap:** Analyze the resume's main sections. Populate the \`sectionAnalysis\` array. For each section:
    *   Assign a \`sectionName\` (e.g., "Professional Summary", "Experience at Globex Corp").
    *   Give it a \`score\` from 1 to 10 based on its relevance and impact.
    *   Provide brief, actionable \`feedback\`.

9.  **Identify Opportunities for Improvement:** Populate the \`opportunitiesForImprovement\` array with potential weaknesses or concerns a recruiter might have (e.g., employment gaps, job hopping, lack of specified degree). Frame these as constructive points.

10. **Suggest Bullet Rewrites:** Identify 2-3 of the weakest bullet points and rewrite them in \`rewriteSuggestions\`.

11. **Resume Modernization Scan:** Populate the \`modernizationSuggestions\` array. Analyze for 'Outdated Skill' or 'Buzzword' categories.

12. **ATS Friendliness & Formatting Scorecard:** Populate the \`formattingIssues\` array with a comprehensive and strict audit for Applicant Tracking System (ATS) compatibility and professional formatting. Be extremely thorough.
    *   **\`severity: 'Critical'\`** for issues that will likely break ATS parsing.
    *   **\`severity: 'Warning'\`** for issues that hurt professionalism or readability.
    *   **Scan for the following \`Critical\` issues:**
        *   **Columns or Tables:** Detect if the resume uses a multi-column layout or tables for formatting. **Issue:** "Resume uses a multi-column or table-based layout." **Suggestion:** "Reformat the resume into a single-column layout. ATS parsers read left-to-right, top-to-bottom, and can jumble content from columns or tables."
        *   **Images, Icons, or Graphics:** Detect any non-text elements (e.g., skill-rating bars, logos). **Issue:** "Resume contains graphics or icons." **Suggestion:** "Remove all images, logos, and graphical elements. ATS cannot read them, and they can cause parsing errors. Represent skills with text only."
        *   **Text in Header/Footer:** Check for contact info or other text in the document's header or footer sections. **Issue:** "Text found in document header or footer." **Suggestion:** "Move all text, especially contact information, out of the header/footer and into the main body of the document, as some ATS skip these sections."
    *   **Scan for the following \`Warning\` issues:**
        *   **Non-Standard Section Headers:** Check for unconventional titles instead of standard ones. **Issue:** "Uses non-standard section headers (e.g., 'My Story')." **Suggestion:** "Replace creative titles with standard ATS-friendly headers like 'Professional Experience', 'Skills', 'Education', and 'Professional Summary'."
        *   **Unprofessional Email:** Check the email address format. **Issue:** "Unprofessional email address found." **Suggestion:** "Use a professional email address like 'firstname.lastname@email.com'."
        *   **Resume Length:** Check if the resume exceeds recommended length based on experience. **Issue:** "Resume is longer than recommended." **Suggestion:** "Condense the resume to one page if you have less than 10 years of experience, or a maximum of two pages for more extensive careers. Be concise."
        *   **Non-Standard Fonts:** Check for script, decorative, or very uncommon fonts. **Issue:** "Uses non-standard fonts." **Suggestion:** "Use a classic, readable, sans-serif font like Arial, Helvetica, or Calibri, or a serif font like Times New Roman or Georgia."
        *   **File Format Reminder (Static Check):** Add this issue to every analysis. **Issue:** "Incorrect file format can cause errors." **Suggestion:** "Always save and submit your resume as a PDF or .docx file as specified in the job application. PDF is usually preferred to preserve formatting."

13. **Create Quick Summary:** Populate the \`quickSummary\` object. This should distill the entire analysis into the most critical, actionable advice.
    *   **\`topStrength\`**: A single sentence highlighting the candidate's biggest strength for this specific role (e.g., "Your extensive experience with React and TypeScript is a perfect match for the core responsibilities.").
    *   **\`topImprovement\`**: The single most impactful improvement the candidate can make (e.g., "Quantifying the achievements in your bullet points with specific metrics would significantly strengthen your resume.").
    *   **\`finalVerdict\`**: A final, encouraging summary sentence about the overall match (e.g., "Overall, you are a strong candidate for this role with a few key areas for improvement.").

14. **Identify In-Demand Skills**: Populate the \`inDemandSkills\` array. Scan the resume for 3-5 skills that are highly valuable in the current job market, even if they aren't explicitly in the job description. For each skill, provide the skill name, a detailed reason for its market value, and the direct evidence from the resume that demonstrates this skill.

Produce only the JSON object based on your analysis.
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: analysisSchema },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Error analyzing resume:", e);
        if (e instanceof Error) {
            throw new Error(`Failed to get a valid analysis from the AI. Reason: ${e.message}`);
        }
        throw new Error("An unknown error occurred during analysis.");
    }
}

export async function rewriteResumeForJob(originalResume: string, jobDescription: string, modernizationSuggestions: ModernizationSuggestion[]): Promise<string> {
    let modernizationInstructions = "";
    if (modernizationSuggestions && modernizationSuggestions.length > 0) {
        const suggestionsText = modernizationSuggestions.map(s => `- ${s.category}: "${s.item}". Reason: ${s.reason}. Suggestion: ${s.suggestion || 'Remove it.'}`).join('\n');
        modernizationInstructions = `
**Modernization Instructions (Crucial):**
The original resume contained some outdated skills or cliché buzzwords. You MUST modernize the resume based on the following analysis. Do not include the flagged "items" in your final rewrite; instead, replace them or rephrase them as suggested.

**Analysis of Items to Modernize:**
\`\`\`
${suggestionsText}
\`\`\`
`;
    }
    const prompt = `
You are an expert resume writer. Your task is to rewrite the provided resume to be powerfully aligned with the provided job description.
${modernizationInstructions}
**Job Description:**
\`\`\`
${jobDescription}
\`\`\`

**Original Resume:**
\`\`\`
${originalResume}
\`\`\`

**Rewrite Instructions:**

1.  **Integrate Keywords:** Seamlessly weave in critical keywords, technologies, and skills mentioned in the job description.
2.  **Use Strong Verbs:** Replace passive or weak verbs ("assisted with," "responsible for") with strong, action-oriented verbs ("architected," "spearheaded," "quantified," "streamlined").
3.  **Emphasize Impact:** Reframe bullet points to focus on achievements and measurable outcomes, not just duties.
4.  **Add Quantifiable Placeholders:** This is critical. Where a bullet point describes an achievement, insert a placeholder to prompt the user to add a specific metric. Use placeholders like \`[Quantify impact, e.g., reduced latency by X%]\`, \`[Specify metric, e.g., managed a budget of $Y]\`, or \`[Add number, e.g., led a team of Z engineers]\`. Add these to several key bullet points.
5.  **Maintain Format:** Preserve the overall structure (e.g., contact info, summary, experience, education sections) of the original resume.
6.  **Tone:** The tone should be professional, confident, and highly competent.

Produce ONLY the full text of the rewritten resume. Do not include any headers, titles, or commentary like "Here is the rewritten resume:".
`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text.trim();
}

export async function findBetterJobs(resume: string): Promise<JobSuggestion[]> {
    const prompt = `
You are a highly experienced career advisor and recruiter. Your task is to analyze the provided resume and suggest 3-5 alternative job titles that would be a strong fit for the candidate's skills and experience themes.

**Resume:**
\`\`\`
${resume}
\`\`\`

**Instructions:**

1.  **Analyze Core Competencies:** Identify the primary themes, hard skills (e.g., 'Python', 'AWS', 'Project Management'), and soft skills ('Leadership', 'Cross-functional Communication') from the resume.
2.  **Identify Career Trajectory:** Determine the seniority level of the candidate (e.g., Junior, Mid-level, Senior, Principal).
3.  **Suggest Diverse Roles:** Based on the competencies and trajectory, suggest 3-5 specific, modern job titles. Think beyond the obvious. For example, if the resume is for a "Software Engineer" with strong data skills, you might suggest "Data Engineer" or "MLOps Engineer." If it's a "Project Manager" with compliance experience, you could suggest "GRC Analyst" or "Technical Program Manager, Security."
4.  **Provide Justification:** For each suggested job title, provide a concise but compelling justification (2-3 sentences) explaining *why* it's a good fit, directly referencing skills or experiences from the resume.

Your entire output MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text before or after the JSON object.
`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: jobSuggestionsSchema },
    });
    return JSON.parse(response.text.trim());
}

export async function generatePitch(resume: string, jobDescription: string): Promise<string> {
    const prompt = `
You are an expert career coach and storyteller. Your task is to generate a concise, compelling, and professional "Tell me about yourself" pitch for a job interview. The pitch should be approximately 60-90 seconds when spoken (around 150-200 words).

**Job Description:**
\`\`\`
${jobDescription}
\`\`\`

**Candidate's Resume:**
\`\`\`
${resume}
\`\`\`

**Instructions:**

1.  **Start with the Present:** Begin by stating the candidate's current role and a summary of their core expertise, connecting it directly to the target role.
2.  **Connect to the Past:** Select 1-2 of the most relevant and impactful achievements from the resume. Briefly describe these accomplishments, using quantifiable results where possible. Frame them as evidence of the skills required in the job description.
3.  **Finish with the Future:** Conclude by expressing genuine enthusiasm for this specific role and company. Explain *why* the candidate is interested and how their skills and experience will benefit the company.
4.  **Tone:** The tone must be confident, authentic, and professional. Avoid jargon and clichés.
5.  **Output:** Produce ONLY the text of the pitch. Do not include any headers, titles, or commentary like "Here is the generated pitch:".
`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text.trim();
}

export async function generateLinkedInProfile(resume: string, jobDescription: string): Promise<LinkedInGeneratorResult> {
    const prompt = `
You are a world-class LinkedIn branding expert and career coach. Your task is to analyze the user's resume and their target job description to generate powerful, ready-to-use content for their LinkedIn profile.

**Candidate's Resume:**
\`\`\`
${resume}
\`\`\`

**Target Job Description:**
\`\`\`
${jobDescription}
\`\`\`

**Generation Instructions:**

1.  **Analyze Keywords & Themes:** Identify the most critical keywords, skills, and themes from the job description that are also present in the user's resume. These are the core concepts to highlight.
2.  **Generate Headlines:** Create 3-5 diverse and compelling headline suggestions. They should be rich with relevant keywords and clearly state the user's value proposition for the target role.
3.  **Generate 'About' Section:** Write a new, impactful "About" section from scratch. It should be written in the first person, tell a concise professional story, highlight key achievements from the resume, and end with a call to action or statement of professional interests related to the target job.
4.  **Provide Reasoning:** Explain *why* your suggestions are effective. Create a bulleted list of 3-4 key strategic reasons for your generated content. For example: "The suggested headlines incorporate critical keywords like 'SaaS' and 'Growth' which align directly with the job description." or "The 'About' section uses a storytelling format to make your experience more engaging."

Your entire output MUST be a single, valid JSON object that conforms to the provided schema. Do not add any text before or after the JSON object.
`;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: linkedInGeneratorSchema },
    });
    return JSON.parse(response.text.trim());
}
