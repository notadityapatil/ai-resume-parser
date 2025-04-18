import { GoogleGenerativeAI } from "@google/generative-ai";
import { SummarySections } from "@/lib/types";

export async function generateStructuredSummary(
  text: string,
  apiKey: string
): Promise<SummarySections> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze this resume and return STRUCTURED JSON DATA ONLY with these EXACT keys:
  {
    "name": string,
    "contactInfo": string,
    "skills": string[],
    "experience": string[],
    "education": string[],
    "projects": string[],
    "yearsOfExperience": number,
"educationLevel": string (highschool, bachelors, masters, phd),
    "location": string,
  }
  
  Resume text:
  ${text}
  
  Return ONLY valid JSON. Do NOT include any explanations, markdown, or text outside the JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Raw summary:", response.text());
    const jsonString = response.text()
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/^[\s\S]*?\{/, '{') // Remove any text before the first {
    .replace(/\}[\s\S]*$/g, '}'); // Remove any text after the last }
    console.log("Structured summary:", jsonString);
    return JSON.parse(jsonString) as SummarySections;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate structured summary");
  }
}