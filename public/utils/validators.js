/**
 * Validation Utilities
 * Provides input validation functions for the donation portal
 */

/**
 * Validates Indian mobile phone numbers
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid 10-digit number starting with 6-9
 * @example
 * validatePhone('9876543210') // returns true
 * validatePhone('5876543210') // returns false (doesn't start with 6-9)
 */
export function validatePhone(phone) {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}

/**
 * Validates email addresses
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 * @example
 * validateEmail('user@example.com') // returns true
 * validateEmail('invalid.email') // returns false
 */
export function validateEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates donation amount
 * @param {number|string} amount - Amount to validate
 * @returns {boolean} True if valid positive number
 * @example
 * validateAmount(100) // returns true
 * validateAmount(-50) // returns false
 */
export function validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
}

/**
 * Validates text input (non-empty after trimming)
 * @param {string} text - Text to validate
 * @returns {boolean} True if non-empty
 * @example
 * validateRequired('John Doe') // returns true
 * validateRequired('   ') // returns false
 */
export function validateRequired(text) {
    return typeof text === 'string' && text.trim().length > 0;
}

/**
 * Validation object containing all validators
 */
export const validators = {
    phone: validatePhone,
    email: validateEmail,
    amount: validateAmount,
    required: validateRequired
};
