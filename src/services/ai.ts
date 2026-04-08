import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMotivationLetter(details: { name: string, role: string, skills: string, goals: string }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional motivation letter for ${details.name} applying for the role of ${details.role}. 
      Key skills: ${details.skills}. 
      Career goals: ${details.goals}. 
      The letter should be tailored for a Holberton student mindset - focused on peer learning, problem-solving, and the "Holberton way".`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Failed to generate motivation letter. Please try again.";
  }
}

export async function getCareerRecommendations(profile: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this student profile/resume: "${profile}", provide 3-5 career recommendations and specific skills to focus on. Return the response in a structured format.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return "Failed to get recommendations.";
  }
}

export async function startMockInterview(role: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a technical interviewer for a ${role} position. Provide a challenging first question for a Holberton student.`,
    });
    return response.text;
  } catch (error) {
    console.error("Interview Error:", error);
    return "Hello! I'm your AI interviewer. Let's start with a basic question: Can you explain how a pointer works in C?";
  }
}
