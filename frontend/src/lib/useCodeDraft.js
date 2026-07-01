import { useState, useEffect, useRef, useCallback } from "react";

const DRAFT_KEY_PREFIX = "leetlab_draft_";

function getDraftKey(problemId, language) {
  return `${DRAFT_KEY_PREFIX}${problemId}_${language}`;
}

/**
 * Custom hook for auto-saving code drafts to localStorage.
 *
 * @param {string} problemId - The ID of the current problem
 * @param {string} language - The selected language (e.g., "JAVASCRIPT")
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 1000)
 * @returns {{ draft: string|null, saveDraft: (code: string) => void, clearDraft: () => void, isDraftSaved: boolean }}
 */
export function useCodeDraft(problemId, language, debounceMs = 1000) {
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const timerRef = useRef(null);
  const draftKey = getDraftKey(problemId, language);

  // Load draft on mount or when key changes
  const draft = (() => {
    try {
      return localStorage.getItem(draftKey);
    } catch {
      return null;
    }
  })();

  // Save draft with debouncing
  const saveDraft = useCallback(
    (code) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setIsDraftSaved(false);

      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(draftKey, code);
          setIsDraftSaved(true);

          // Reset the "saved" indicator after 2 seconds
          setTimeout(() => setIsDraftSaved(false), 2000);
        } catch {
          // localStorage full or unavailable
        }
      }, debounceMs);
    },
    [draftKey, debounceMs],
  );

  // Clear draft (e.g., after successful submission)
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setIsDraftSaved(false);
  }, [draftKey]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { draft, saveDraft, clearDraft, isDraftSaved };
}
