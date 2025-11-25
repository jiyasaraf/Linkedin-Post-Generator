export const Config = {
    /**
     * Retrieves the Gemini API key from local storage.
     * @returns {string} The API key or an empty string.
     */
    getGeminiKey: () => localStorage.getItem('gemini_api_key') || '',

    /**
     * Saves the Gemini API key to local storage.
     * @param {string} key - The API key to save.
     */
    setGeminiKey: (key) => localStorage.setItem('gemini_api_key', key),

    /**
     * Checks if the Gemini API key is present.
     * @returns {boolean} True if the key is set.
     */
    hasKeys: () => {
        return !!localStorage.getItem('gemini_api_key');
    }
};
