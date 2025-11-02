/**
 * DOM Utilities
 * مسؤول فقط عن: عمليات DOM
 * ISP: Interface Segregation - DOM operations only
 */

import { SELECTORS } from '../core/constants.js';

/**
 * Get icon URL from card element
 */
export function getCardIcon(card) {
    const imgElement = card.querySelector(SELECTORS.ICON_IMAGE);
    if (imgElement?.src) {
        return imgElement.src;
    }
    return 'https://via.placeholder.com/32x32?text=?';
}

/**
 * Query selector with null check
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Query selector all with array return
 */
export function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

/**
 * Create element with attributes
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * Remove all children from element
 */
export function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Insert element after another element
 */
export function insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

/**
 * Wrap element with another element
 */
export function wrapElement(element, wrapper) {
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
}

/**
 * Get element position
 */
export function getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
    };
}

/**
 * Check if element is visible in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add multiple event listeners
 */
export function addEventListeners(element, events, handler) {
    events.split(' ').forEach(event => {
        element.addEventListener(event, handler);
    });
}

/**
 * Remove multiple event listeners
 */
export function removeEventListeners(element, events, handler) {
    events.split(' ').forEach(event => {
        element.removeEventListener(event, handler);
    });
}

/**
 * Get closest parent with selector
 */
export function closest(element, selector) {
    return element.closest(selector);
}

/**
 * Check if element matches selector
 */
export function matches(element, selector) {
    return element.matches(selector);
}

/**
 * Get or set attribute
 */
export function attr(element, name, value) {
    if (value === undefined) {
        return element.getAttribute(name);
    }
    element.setAttribute(name, value);
    return element;
}

/**
 * Toggle class
 */
export function toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
}

/**
 * Has class
 */
export function hasClass(element, className) {
    return element.classList.contains(className);
}

export default {
    getCardIcon,
    $,
    $$,
    createElement,
    removeChildren,
    insertAfter,
    wrapElement,
    getPosition,
    isInViewport,
    addEventListeners,
    removeEventListeners,
    closest,
    matches,
    attr,
    toggleClass,
    hasClass
};
