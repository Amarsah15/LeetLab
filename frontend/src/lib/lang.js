function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
    54: "C++",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TypeScript: 74,
    CPP: 54,
  };
  return languageMap[language.toUpperCase()];
}
