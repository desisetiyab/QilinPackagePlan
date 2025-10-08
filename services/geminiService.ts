import { GoogleGenAI } from "@google/genai";
import type { Feature } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for development. In a real environment,
  // the key should be securely managed.
  // console.warn("API_KEY environment variable not set. Using a placeholder.");
  process.env.API_KEY = "YOUR_API_KEY_HERE"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(featureData: Omit<Feature, 'id' | 'status'>): string {
  const { name, description, packageDetails, checkpoints } = featureData;

  let prompt = `You are an AI assistant tasked with creating a detailed scoring prompt for evaluating customer service or sales interactions. Based on the following structured data, generate a single, comprehensive "Scoring Prompt". This prompt will be used by another AI to analyze and score a conversation transcript.

**High-Level Feature: ${name}**
*Description: ${description}*

---

**CONTEXT: PRODUCT/PACKAGE DETAILS**
The agent is selling or discussing the following package. The evaluation AI must understand this context.

- **Package Name:** ${name}
- **Target Market:** ${packageDetails?.targetMarket}
- **Price and Duration:** ${packageDetails?.price} ${packageDetails?.currency} for ${packageDetails?.duration}
- **Benefits:**
${packageDetails?.benefits.split('\n').filter(b => b.trim() !== '').map(b => `  - ${b.trim()}`).join('\n')}
- **Key Selling Points to Emphasize:**
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


export const generateScoringPrompt = async (featureData: Omit<Feature, 'id' | 'status'>): Promise<string> => {
  if (process.env.API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("Using mock Gemini API response. Please provide a real API key.");
    return new Promise(resolve => setTimeout(() => resolve(`This is a mock scoring prompt generated for "${featureData.name}". It is based on evaluating checkpoints such as ${featureData.checkpoints?.map(c => c.category).join(', ')}. The context is the sale of the "${featureData.name}" package. Please provide a real Google Gemini API key in geminiService.ts to get a real AI-generated response.`), 1000));
  }
  
  const prompt = buildPrompt(featureData);
  
  try {
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