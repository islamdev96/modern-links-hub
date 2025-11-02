/**
 * UI Utilities
 * مسؤول فقط عن: عمليات واجهة المستخدم
 * ISP: Interface Segregation - UI operations only
 */

import { TOAST_ICONS, SELECTORS, ANIMATIONS } from '../core/constants.js';
import { APP_CONFIG } from '../core/config.js';

/**
 * Show a toast notification
 */
export function showToast(type = 'info', message = '', duration = APP_CONFIG.defaults.toastDuration) {
    const container = document.querySelector(SELECTORS.TOAST_CONTAINER);
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${TOAST_ICONS[type] || TOAST_ICONS.info}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Animate element with CSS class
 */
export function animate(element, animation, callback) {
    element.classList.add(animation);
    
    function handleAnimationEnd() {
        element.classList.remove(animation);
        element.removeEventListener('animationend', handleAnimationEnd);
        if (callback) callback();
    }
    
    element.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Open a link safely in a new tab
 */
export function openLink(url) {
    if (!url) return false;

    try {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) {
            win.opener = null;
            return true;
        }
        return false;
    } catch (error) {
        showToast('error', 'غير قادر على فتح الرابط');
        return false;
    }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('success', 'تم النسخ بنجاح');
        return true;
    } catch (error) {
        showToast('error', 'فشل النسخ');
        return false;
    }
}

/**
 * Show loading indicator
 */
export function showLoading(element) {
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
}

/**
 * Hide loading indicator
 */
export function hideLoading(element) {
    element.classList.remove('loading');
    element.setAttribute('aria-busy', 'false');
}

/**
 * Fade in element
 */
export function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    const start = performance.now();
    
    function update() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Fade out element
 */
export function fadeOut(element, duration = 300, callback) {
    const start = performance.now();
    const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
    function update() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        element.style.opacity = initialOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.style.display = 'none';
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(update);
}

export default {
    showToast,
    animate,
    openLink,
    copyToClipboard,
    showLoading,
    hideLoading,
    fadeIn,
    fadeOut
};
