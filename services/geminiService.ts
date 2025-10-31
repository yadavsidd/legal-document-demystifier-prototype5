import { GoogleGenAI, Chat, Type, GenerateContentResponse, Part } from "@google/genai";
import type { AnalysisResult }  from '../types';

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for document analysis
const analysisResultSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise summary of the document's purpose and key terms, written in simple, clear language."
        },
        keyDates: {
            type: Type.ARRAY,
            description: "A list of important dates or deadlines mentioned in the document.",
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { type: Type.STRING, description: "The specific date, e.g., '2024-12-31'." },
                    description: { type: Type.STRING, description: "What the date signifies, e.g., 'Contract expiration date'." }
                },
                required: ['date', 'description']
            }
        },
        redFlags: {
            type: Type.ARRAY,
            description: "A list of potentially problematic, ambiguous, or risky clauses.",
            items: {
                type: Type.OBJECT,
                properties: {
                    clause: { type: Type.STRING, description: "The exact text or a summary of the clause in question." },
                    explanation: { type: Type.STRING, description: "A simple explanation of why this clause is a potential red flag." },
                    risk: { type: Type.STRING, description: "The potential risk associated with the clause, e.g., 'High', 'Medium', 'Low'." }
                },
                required: ['clause', 'explanation', 'risk']
            }
        },
        actionableNextSteps: {
            type: Type.ARRAY,
            description: "A list of recommended next steps for the user to take.",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "The category of the action, e.g., 'Consultation', 'Clarification', 'Action Required'." },
                    step: { type: Type.STRING, description: "A clear, actionable step for the user, e.g., 'Consult a lawyer to review the indemnity clause'." }
                },
                required: ['category', 'step']
            }
        },
        acceptanceScore: {
            type: Type.NUMBER,
            description: "A score from 1 to 100 representing the document's fairness and safety for the user. 1 is extremely risky, 100 is perfectly safe."
        },
        scoreJustification: {
            type: Type.STRING,
            description: "A brief, one-sentence justification for the given score."
        },
        potentialScore: {
            type: Type.NUMBER,
            description: "An estimated score from 1 to 100 representing what the score could be if the actionable next steps are successfully implemented."
        },
        potentialScoreJustification: {
            type: Type.STRING,
            description: "A brief, one-sentence justification for the potential score improvement."
        }
    },
    required: ['summary', 'keyDates', 'redFlags', 'actionableNextSteps', 'acceptanceScore', 'scoreJustification', 'potentialScore', 'potentialScoreJustification']
};


/**
 * Analyzes a document to extract a summary, key dates, red flags, and next steps.
 * @param content The base64 encoded content of the file or plain text.
 * @param mimeType The MIME type of the file.
 * @returns A structured analysis result.
 */
export const analyzeDocument = async (content: string, mimeType: string): Promise<AnalysisResult> => {
    
    const parts: Part[] = [];
    if (mimeType.startsWith('text/')) {
        parts.push({ text: `Analyze the following document:\n\n${content}` });
    } else {
        // Handle images, PDFs, etc., that are passed as base64
        parts.push({
            inlineData: {
                data: content,
                mimeType: mimeType
            }
        });
        parts.push({ text: "Analyze the provided document. Extract key information based on the requested JSON schema." });
    }
    
    const systemInstruction = `You are an expert legal assistant named Demystify. Your task is to analyze the provided document and return a structured JSON object. 
    Your entire analysis must be extremely clear, simple, and easy for a non-lawyer to understand. Avoid legal jargon at all costs.

    **Crucially, first identify the specific roles of the parties involved (e.g., "Landlord and Tenant", "Seller and Buyer", "Client and Freelancer"). Use these specific roles instead of generic terms like "Party A" or "Person 1" throughout your entire response.**

    Follow these steps for the analysis:
    - **Summary:** Write a summary of the document's main purpose as if you were explaining it to a friend. It must be in simple phrases and use the identified roles of the parties. For example, instead of "This agreement delineates the terms of service...", say "This is an agreement between the Client and the Freelancer about the work to be done."
    - **Key Dates:** Identify all critical dates and deadlines.
    - **Red Flags:** Highlight any clauses that are potentially problematic, ambiguous, one-sided, or high-risk. Explain the risk in simple terms.
    - **Actionable Next Steps:** Provide clear, actionable next steps for the user.
    - **Acceptance Score:** Based on the number and severity of red flags and one-sided clauses, provide an "Acceptance Score" from 1 to 100. A score of 1 means "Do not sign this under any circumstances." A score of 100 means "This document is perfectly fair and safe to sign." Also, provide a brief 'scoreJustification' explaining the reason for your score in one sentence. For example: "The score is low due to several one-sided clauses favoring the other party."
    - **Potential Score:** After the initial score, estimate a 'potentialScore'. This score represents what the acceptance score could become if the user successfully resolves the issues outlined in your 'Actionable Next Steps'. Also provide a 'potentialScoreJustification' explaining why the score improved. For example: "If the ambiguous clauses are clarified, the score could improve significantly as the main risks would be mitigated."

    Do not add any commentary outside of the JSON structure. Your response must be only the JSON object.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: analysisResultSchema
            }
        });
        
        const jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("Received an empty or invalid response from the AI model.");
        }
        const result = JSON.parse(jsonText);
        
        // Basic validation to ensure the result matches the expected structure
        if (!result.summary || !result.keyDates || !result.redFlags || !result.actionableNextSteps || !result.acceptanceScore || !result.scoreJustification || !result.potentialScore || !result.potentialScoreJustification) {
            throw new Error("Analysis result is missing required fields.");
        }

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing document:", error);
        throw new Error("Failed to analyze the document. The AI model may have returned an invalid format or an error occurred.");
    }
};

/**
 * Creates a new chat session for follow-up questions about a document analysis.
 * @param docContent The original document content.
 * @param mimeType The document's MIME type.
 * @param initialAnalysis The initial analysis result.
 * @returns A Chat instance.
 */
export const createDocumentAnalysisChat = (docContent: string, mimeType: string, initialAnalysis: AnalysisResult): Chat => {
    const systemInstruction = `You are Demystify, an AI legal assistant. You have just analyzed a document for a user.
    The document's content is provided below. You will now answer follow-up questions from the user based on this document and your initial analysis.
    Be helpful, clear, and concise. Refer back to the document content when necessary.

    --- DOCUMENT CONTENT (MIME Type: ${mimeType}) ---
    ${docContent}
    --- END DOCUMENT CONTENT ---
    
    --- YOUR INITIAL ANALYSIS ---
    ${JSON.stringify(initialAnalysis, null, 2)}
    --- END INITIAL ANALYSIS ---
    
    Your first message to the user is already provided. Wait for their question.`;

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        }
    });

    return chat;
};

const getContractPrompt = (contractType: string, formData: Record<string, string>): string => {
    const details = Object.entries(formData).map(([key, value]) => `- ${key}: ${value}`).join('\n');
    let instructions = '';

    switch (contractType) {
        case 'Freelance Agreement':
            instructions = `
**Required Clauses to Include:**
1.  **Parties:** Clearly identify the Client and the Freelancer.
2.  **Services:** Detail the scope of work to be performed.
3.  **Payment:** Specify the total compensation and payment schedule. Assume payment is due net 30 upon completion unless specified otherwise.
4.  **Term and Termination:** Define the start and end of the agreement and conditions under which either party can terminate it.
5.  **Intellectual Property:** Clarify that upon full payment, the ownership of the final work product transfers to the Client.
6.  **Confidentiality:** Include a standard clause requiring both parties to keep sensitive information confidential.
7.  **Independent Contractor Status:** State clearly that the Freelancer is an independent contractor, not an employee.
8.  **Governing Law:** Include a placeholder for the governing state law (e.g., "State of [State]").
9.  **Signatures:** Provide signature lines for both parties.`;
            break;
        case 'Simple Rental Lease':
            instructions = `
**Required Clauses to Include:**
1.  **Parties:** Clearly identify the Landlord and the Tenant.
2.  **Property:** State the full address of the rental property.
3.  **Term:** Specify the lease start and end dates.
4.  **Rent:** Detail the monthly rent amount and the due date.
5.  **Security Deposit:** Mention the security deposit amount and conditions for its return.
6.  **Use of Premises:** State that the property is for residential use only.
7.  **Landlord's Access:** Include a clause allowing the landlord to enter the property with reasonable notice.
8.  **Governing Law:** Include a placeholder for the governing state law (e.g., "State of [State]").
9.  **Signatures:** Provide signature lines for both Landlord and Tenant.`;
            break;
        case 'Bill of Sale':
             instructions = `
**Required Clauses to Include:**
1.  **Parties:** Clearly identify the Seller and the Buyer.
2.  **Item Description:** Provide a detailed description of the item being sold.
3.  **Sale Price:** State the full purchase price.
4.  **Date of Sale:** The date the transaction occurs.
5.  **"As-Is" Warranty:** Include a clause stating the item is sold "as-is," without any warranties of condition or fitness. This is a critical component.
6.  **Signatures:** Provide signature lines for both the Seller and the Buyer.`;
            break;
        default:
            instructions = "**Instructions:** Ensure all key details provided by the user are included in a clear and logical format."
    }

    return `You are an expert legal assistant named Demystify. Your task is to draft a professional and clear "${contractType}".
The document should be comprehensive and include standard clauses appropriate for such an agreement, while remaining easy for a non-lawyer to understand.

Based on the following user-provided details, generate the full contract text.

**User Details:**
${details}

${instructions}

**Formatting and Final Instructions:**
- Use clear headings for each section (e.g., "1. Services", "2. Payment").
- Format as a plain text document.
- Do not include any commentary or explanation before or after the contract text itself.
- Conclude the entire document with the following disclaimer on a new line:
"Disclaimer: This document was generated by an AI assistant. It is intended for informational purposes and does not constitute legal advice. It is recommended to consult with a legal professional before using or signing this agreement."
`;
}


/**
 * Drafts a contract based on a template and user-provided data, returning a stream.
 * @param contractType The name of the contract to draft.
 * @param formData The user-filled data for the contract.
 * @returns A streaming response of the drafted contract.
 */
export const draftContractStream = async (contractType: string, formData: Record<string, string>) => {
    const prompt = getContractPrompt(contractType, formData);

    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-pro', // Use a more capable model for drafting
            contents: prompt
        });
        return responseStream;
    } catch (error) {
        console.error("Error drafting contract:", error);
        throw new Error("Failed to draft the contract. Please try again.");
    }
};

/**
 * Rewrites a potentially problematic clause to be more fair and balanced.
 * @param clause The problematic clause text.
 * @param explanation The explanation of why it's a red flag.
 * @returns The suggested rewritten clause as a string.
 */
export const suggestClauseRewrite = async (clause: string, explanation: string): Promise<string> => {
    const prompt = `A user has identified a problematic clause in a legal document. 
    Your task is to rewrite it to be more fair, balanced, and clear for a non-lawyer.

    **Original Problematic Clause:**
    "${clause}"

    **Reason it's a problem:**
    "${explanation}"

    **Instructions:**
    1.  Rewrite the clause to mitigate the identified problem.
    2.  The new clause should be clear, professional, and easy to understand.
    3.  Provide only the rewritten clause text, without any introductory phrases like "Here is the rewritten clause:" or any explanations.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text?.trim() ?? '';
    } catch (error) {
        console.error("Error suggesting clause rewrite:", error);
        throw new Error("Failed to generate a suggestion. Please try again.");
    }
};


/**
 * Creates a new chat session for the Document Guide feature.
 * @returns A Chat instance.
 */
export const createDocumentGuideChat = (): Chat => {
    const systemInstruction = `You are Demystify's "Document Guide". Your role is to provide clear, step-by-step guidance on official procedures and documents.
    For example, users might ask about getting a passport, applying for a visa, or registering a business.
    Provide helpful, accurate, and easy-to-understand information. Use formatting like lists and bold text to improve readability.
    Start the conversation by introducing yourself and asking how you can help.`;
    
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        },
    });

    return chat;
};

/**
 * Translates a document into a specified target language.
 * @param content The text or base64 content of the document.
 * @param mimeType The MIME type of the document.
 * @param targetLanguage The language to translate the document into.
 * @returns The translated document text.
 */
export const translateDocument = async (content: string, mimeType: string, targetLanguage: string): Promise<string> => {
    
    const parts: Part[] = [];
    if (mimeType.startsWith('text/')) {
        parts.push({ text: `Translate the following document to ${targetLanguage}. Preserve the original formatting and tone.\n\n---\n\n${content}` });
    } else {
        // Handle images, PDFs etc.
        parts.push({
            inlineData: {
                data: content,
                mimeType: mimeType
            }
        });
        parts.push({ text: `Translate the text in this document to ${targetLanguage}. Preserve the original formatting as much as possible.` });
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts }
        });
        return response.text?.trim() ?? '';
    } catch (error) {
        console.error("Error translating document:", error);
        throw new Error("Failed to translate the document. Please try again.");
    }
};