import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log(process.env.RAPID_API_KEY);
console.log(process.env.RAPID_API_HOST);
console.log(process.env.JUDGE0_API_URL);

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    JAVA: 62,
    PYTHON: 71,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.request(
    {
      method: "POST",
      url: `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": process.env.RAPID_API_HOST,
      },
      data: {
        submissions,
      },
    }
  );

  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    //hitting end point and getting data
    const { data } = await axios.request(
      
      {
        method: "GET",
        url: `${process.env.JUDGE0_API_URL}/submissions/batch`,
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY,
          "x-rapidapi-host": process.env.RAPID_API_HOST,
        },
      }
    );
    const results = data.submissions;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;
    await sleep(1000);
  }
};

export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return LANGUAGE_NAMES[languageId] || "Unknown";
}
