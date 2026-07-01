import { GoogleGenerativeAI } from "@google/generative-ai";

const getModel = (req) => {
  const key = req?.headers?.["x-gemini-key"] || process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
};

// Helper function to call Gemini AI
async function generateContent(prompt, req) {
  const model = getModel(req);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Error handling helper
const handleGenerativeError = (error, req, res, actionName) => {
  const hasCustomKey = !!req.headers?.["x-gemini-key"];

  // Rate limit / Quota exceeded / Blocked
  if (
    error.status === 429 ||
    error.message?.includes("429") ||
    error.message?.includes("quota") ||
    error.message?.includes("exhausted") ||
    error.status === 403
  ) {
    const errMsg = hasCustomKey
      ? "AI service rate limit reached on your custom Gemini API key. Please wait a few seconds before trying again."
      : "AI service rate limit reached. Please configure your own Gemini API key or try again in a few seconds.";
    return res.status(429).json({ error: errMsg });
  }

  // Model not found
  if (
    error.status === 404 ||
    error.message?.includes("not found") ||
    error.message?.includes("NotFound")
  ) {
    const errMsg = hasCustomKey
      ? "The Gemini model was not found using your custom API key. Please verify your API key has correct access permissions."
      : "Default Gemini model not found. Please contact support or configure your own Gemini key.";
    return res.status(404).json({ error: errMsg });
  }

  console.error(`Error during ${actionName}:`, error);
  res.status(500).json({ error: `Failed to ${actionName}` });
};

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
    const text = await generateContent(prompt, req);
    res.json({ analysis: text });
  } catch (error) {
    handleGenerativeError(error, req, res, "analyze complexity");
  }
};

export const getHint = async (req, res) => {
  try {
    const { problemDescription, userCode = "", hintLevel = 1 } = req.body;
    const hintPrompts = {
      1: "Give a very subtle hint about the approach or data structure to use. Don't reveal the solution.",
      2: "Provide a moderate hint with the general algorithm or pattern. Still don't give the exact solution.",
      3: "Give a detailed hint with pseudocode or step-by-step approach, but without actual code implementation.",
    };
    const prompt = `
Problem Description:
${problemDescription}

${userCode ? `User's current attempt:\n\`\`\`\n${userCode}\n\`\`\`` : ""}

${hintPrompts[hintLevel]}

Keep the hint concise (2-3 sentences max) and educational. Focus on helping the user think, not solving it for them.
`;
    const text = await generateContent(prompt, req);
    res.json({ hint: text });
  } catch (error) {
    handleGenerativeError(error, req, res, "get hint");
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
    const text = await generateContent(prompt, req);
    res.json({ improvements: text });
  } catch (error) {
    handleGenerativeError(error, req, res, "get improvements");
  }
};
