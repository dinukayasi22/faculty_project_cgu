/**
 * Validate and parse integer ID from request parameters
 * @param {string} id - The ID to validate
 * @param {string} paramName - Name of the parameter for error messages
 * @returns {number|null} Parsed integer or null if invalid
 */
export const validateId = (id, paramName = 'ID') => {
    const parsed = parseInt(id);
    if (isNaN(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
};

/**
 * Extract file ID from Google Drive URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} File ID or null if not found
 */
export const extractFileIdFromUrl = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
};
