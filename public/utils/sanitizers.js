/**
 * Sanitization Utilities
 * Provides input sanitization functions to prevent XSS and ensure data consistency
 */

/**
 * Sanitizes phone number to standard 10-digit Indian format
 * Removes non-numeric characters and handles +91 country code
 * @param {string} phone - Raw phone number input
 * @returns {string} Sanitized 10-digit number
 * @example
 * sanitizePhoneNumber('+91 98765 43210') // returns '9876543210'
 * sanitizePhoneNumber('(987) 654-3210') // returns '9876543210'
 */
export function sanitizePhoneNumber(phone) {
    if (!phone) return '';
    // Remove all non-numeric characters
    let sanitized = phone.replace(/\D/g, '');
    // Remove +91 country code if present
    if (sanitized.startsWith('91') && sanitized.length > 10) {
        sanitized = sanitized.substring(2);
    }
    return sanitized;
}

/**
 * Sanitizes text input to prevent XSS attacks
 * Escapes HTML special characters
 * @param {string} input - Raw text input
 * @returns {string} Sanitized text
 * @example
 * sanitizeInput('<script>alert("XSS")</script>') 
 * // returns '&lt;script&gt;alert("XSS")&lt;/script&gt;'
 */
export function sanitizeInput(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML.trim();
}

/**
 * Sanitizes and formats donation amount
 * @param {number|string} amount - Raw amount input
 * @returns {number} Parsed and validated amount
 * @example
 * sanitizeAmount('100.50') // returns 100.50
 * sanitizeAmount('100.5678') // returns 100.57 (rounded to 2 decimals)
 */
export function sanitizeAmount(amount) {
    const num = parseFloat(amount);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

/**
 * Trims whitespace from text input
 * @param {string} text - Text to trim
 * @returns {string} Trimmed text
 */
export function trimText(text) {
    return typeof text === 'string' ? text.trim() : '';
}
