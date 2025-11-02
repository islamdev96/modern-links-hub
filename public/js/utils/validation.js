/**
 * Validation Utilities
 * مسؤول فقط عن: التحقق من صحة البيانات
 * ISP: Interface Segregation - Validation operations only
 */

/**
 * Validate email address
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate URL
 */
export function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate phone number
 */
export function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate Arabic text
 */
export function isArabicText(text) {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicRegex.test(text);
}

/**
 * Validate English text
 */
export function isEnglishText(text) {
    const englishRegex = /^[a-zA-Z\s]+$/;
    return englishRegex.test(text);
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(str) {
    return !str || str.trim().length === 0;
}

/**
 * Check if value is numeric
 */
export function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Check if date is valid
 */
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

/**
 * Check if array is empty
 */
export function isEmptyArray(arr) {
    return !Array.isArray(arr) || arr.length === 0;
}

/**
 * Check if object is empty
 */
export function isEmptyObject(obj) {
    return !obj || Object.keys(obj).length === 0;
}

/**
 * Validate JSON string
 */
export function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if value is between min and max
 */
export function isInRange(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Validate file extension
 */
export function hasValidExtension(filename, extensions) {
    const ext = filename.split('.').pop().toLowerCase();
    return extensions.includes(ext);
}

/**
 * Check if element exists in array
 */
export function existsInArray(array, element) {
    return array.includes(element);
}

export default {
    isValidEmail,
    isValidURL,
    isValidPhone,
    isArabicText,
    isEnglishText,
    isEmpty,
    isNumeric,
    isValidDate,
    isEmptyArray,
    isEmptyObject,
    isValidJSON,
    isInRange,
    hasValidExtension,
    existsInArray
};
