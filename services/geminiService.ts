import { GoogleGenAI } from "@google/genai";
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