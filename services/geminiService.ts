import { GoogleGenAI, Type } from "@google/genai";
import type { Feature } from '../types';

// FIX: Initialize GoogleGenAI with API key from environment variables as per guidelines.
// Do not use placeholders or default values.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(featureData: Omit<Feature, 'id' | 'status' | 'enabled'>): string {
  const { name, description, packageDetails, checkpoints } = featureData;
  const { durationValue, durationUnit } = packageDetails;
  const durationText = `${durationValue} ${durationUnit}${durationValue !== 1 ? 's' : ''}`;


  let prompt = `You are an AI assistant tasked with creating a detailed scoring prompt for evaluating customer service or sales interactions. Based on the following structured data, generate a single, comprehensive "Scoring Prompt". This prompt will be used by another AI to analyze and score a conversation transcript.

**High-Level Feature: ${name}**
*Description: ${description}*

---

**CONTEXT: PRODUCT/PACKAGE DETAILS**
The agent is selling or discussing the following package. The evaluation AI must understand this context.

- **Package Name:** ${name}
- **Target Market:** ${packageDetails?.targetMarket.join(', ')}
- **Price and Duration:** ${packageDetails?.price} ${packageDetails?.currency} for ${durationText}
- **Benefits:**
${packageDetails?.benefits.split('\n').filter(b => b.trim() !== '').map(b => `  - ${b.trim()}`).join('\n')}
- **Key Selling Points to Emprehasize:**
${packageDetails?.sellingPoints.split('\n').filter(sp => sp.trim() !== '').map(sp => `  - ${sp.trim()}`).join('\n')}

---

**EVALUATION CHECKPOINTS**
The AI must evaluate the conversation based on these specific checkpoints.

`;

  checkpoints?.forEach(cp => {
    prompt += `**Checkpoint: "${cp.category}"**
*This checkpoint assesses the agent's ability to effectively communicate the category of "${cp.category}".*

Rating Criteria:
- **Very Good (Excellent Performance):** ${cp.criteria.veryGood}
- **Good (Competent Performance):** ${cp.criteria.good}
- **Bad (Poor Performance):** ${cp.criteria.bad}
- **Very Bad (Complete Failure):** ${cp.criteria.veryBad}

`;
  });

  prompt += `
---

**FINAL INSTRUCTION FOR EVALUATION AI:**
Synthesize all of the above information. Your output should be a single, detailed scoring prompt. This prompt should clearly instruct an AI on what to look for, how to score the conversation against each checkpoint using the provided criteria, and how to interpret the context of the product being sold. Be clear and direct.`;

  return prompt;
}


export const generateScoringPrompt = async (featureData: Omit<Feature, 'id' | 'status' | 'enabled'>): Promise<string> => {
  const prompt = buildPrompt(featureData);
  
  try {
    // FIX: Removed mock API response logic. Direct call to Gemini API.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};


const refineResponseSchema = {
    type: Type.OBJECT,
    properties: {
        refinedDescription: {
            type: Type.STRING,
            description: "An improved, professional, and engaging version of the package description.",
        },
        refinedBenefits: {
            type: Type.STRING,
            description: "A rewritten list of benefits, making them more impactful and appealing. Each benefit should be on a new line.",
        },
        refinedSellingPoints: {
            type: Type.STRING,
            description: "A rewritten list of key selling points, making them more persuasive. Each selling point should be on a new line.",
        },
    },
    required: ["refinedDescription", "refinedBenefits", "refinedSellingPoints"],
};


export const refinePackageDetails = async (featureData: Omit<Feature, 'id' | 'status' | 'enabled'>): Promise<{ refinedDescription: string; refinedBenefits: string; refinedSellingPoints: string; }> => {
  const { name, description, packageDetails } = featureData;

  const prompt = `You are an expert copywriter specializing in B2B marketing for HR and recruitment technology. Your task is to refine the marketing copy for a software package plan called "${name}".

Analyze the following user-provided details and rewrite them to be more professional, persuasive, and appealing to the target market of ${packageDetails.targetMarket.join(', ')}.

**Original Description:**
${description}

**Original Benefits (one per line):**
${packageDetails.benefits}

**Original Key Selling Points (one per line):**
${packageDetails.sellingPoints}

---

**Instructions:**
1.  **Refine the Description:** Make it concise, clear, and highlight the core value proposition.
2.  **Refine the Benefits:** Rephrase them to focus on outcomes and value for the customer, not just features.
3.  **Refine the Selling Points:** Sharpen them to be compelling and memorable.
4.  Maintain the original intent but enhance the language and tone.
5.  Return the response as a JSON object matching the provided schema. Ensure each benefit and selling point is on a new line within its respective string.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: refineResponseSchema,
      },
    });

    const jsonString = response.text.trim();
    // Gemini can sometimes wrap JSON in markdown backticks
    const cleanedJsonString = jsonString.replace(/^`{3}json\s*|\s*`{3}$/g, '');
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Error calling Gemini API for refinement:", error);
    throw new Error("Failed to generate refined content from Gemini API.");
  }
};
