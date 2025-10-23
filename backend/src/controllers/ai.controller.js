import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Helper function to call Gemini AI
async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export const analyzeComplexity = async (req, res) => {
  try {
    const { code, language } = req.body;
    const prompt = `
Analyze the following ${language} code and provide:
1. Time Complexity with explanation
2. Space Complexity with explanation
3. Keep it concise and educational

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response as:
**Time Complexity:** O(n) - [brief explanation]
**Space Complexity:** O(1) - [brief explanation]
`;
    const text = await generateContent(prompt);
    res.json({ analysis: text });
  } catch (error) {
    console.error("Analyze complexity error:", error);
    res.status(500).json({ error: "Failed to analyze complexity" });
  }
};

export const getHint = async (req, res) => {
  try {
    const { problemDescription, userCode = "", hintLevel = 1 } = req.body;
    const hintPrompts = {
      1: "Give a very subtle hint about the approach or data structure to use. Don't reveal the solution.",
      2: "Provide a moderate hint with the general algorithm or pattern. Still don't give the exact solution.",
      3: "Give a detailed hint with pseudocode or step-by-step approach, but without actual code implementation."
    };
    const prompt = `
Problem Description:
${problemDescription}

${userCode ? `User's current attempt:\n\`\`\`\n${userCode}\n\`\`\`` : ""}

${hintPrompts[hintLevel]}

Keep the hint concise (2-3 sentences max) and educational. Focus on helping the user think, not solving it for them.
`;
    const text = await generateContent(prompt);
    res.json({ hint: text });
  } catch (error) {
    console.error("Get hint error:", error);
    res.status(500).json({ error: "Failed to get hint" });
  }
};

export const getImprovementSuggestions = async (req, res) => {
  try {
    const { code, problemDescription, language = "javascript" } = req.body;
    const prompt = `
Problem: ${problemDescription}

User's Code:
\`\`\`${language}
${code}
\`\`\`

Provide constructive feedback on:
1. Code quality and readability
2. Potential bugs or edge cases they might have missed
3. Optimization opportunities (if any)
4. Best practices they could apply

DO NOT provide the complete solution. Guide them to improve their own code.
Keep feedback concise and actionable.
`;
    const text = await generateContent(prompt);
    res.json({ improvements: text });
  } catch (error) {
    console.error("Get improvements error:", error);
    res.status(500).json({ error: "Failed to get improvements" });
  }
};
