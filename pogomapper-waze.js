// ==UserScript==
// @name         PogoMapper - Waze button
// @namespace    pogomapper-waze
// @version      1.3.1
// @description  Add Waze beside Google Maps links, using the same exact coordinates.
// @license      MIT
// @homepageURL  https://github.com/toomdev1/Pogomapper-Waze
// @supportURL   https://github.com/toomdev1/Pogomapper-Waze/issues
// @match        https://pogomapper.co.uk/*
// @match        https://*.pogomapper.co.uk/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Script code: MIT, Copyright (c) 2026 Toom.
// The embedded Font Awesome Waze icon is separately licensed CC BY 4.0 (see below).

(() => {
    'use strict';

    const buttons = new Map();
    const linkSelector = 'a[href*="google."]:not([data-pogomapper-waze])';
    const coordinatePair = /^([+-]?\d+(?:\.\d+)?),\s*([+-]?\d+(?:\.\d+)?)$/;

    const style = document.createElement('style');
    style.textContent = `
        .MuiGrid-root:has(> a[data-pogomapper-waze]) {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
        a[data-pogomapper-waze] {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            vertical-align: middle;
            text-decoration: none;
            box-sizing: border-box;
            border-radius: 50%;
        }
        a[data-pogomapper-waze]:focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 2px;
        }
        a[data-pogomapper-waze] .pogomapper-waze-icon {
            display: block;
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            fill: currentColor;
        }
    `;
    document.head.append(style);

    function destination(href) {
        try {
            const url = new URL(href, document.baseURI);
            if (!['https:', 'http:'].includes(url.protocol)) return null;
            if (!['maps.google.com', 'www.google.com', 'google.com'].includes(url.hostname)) return null;

            // PogoMapper uses /maps/place/LAT,LON. Do not use map viewport
            // coordinates (/@LAT,LON), which can differ from the destination.
            const place = decodeURIComponent(url.pathname).match(/^\/maps\/place\/([^/]+)\/?$/);
            const value = place ? place[1] :
                url.searchParams.get('destination') ??
                url.searchParams.get('query') ?? url.searchParams.get('q');
            const pair = value && value.trim().match(coordinatePair);
            if (!pair || Math.abs(Number(pair[1])) > 90 || Math.abs(Number(pair[2])) > 180) return null;

            // Keep the original strings: converting to numbers could lose precision.
            return `${pair[1]},${pair[2]}`;
        } catch {
            return null;
        }
    }

    function refresh() {
        for (const [source, button] of buttons) {
            if (!source.isConnected || !destination(source.getAttribute('href'))) {
                button.remove();
                buttons.delete(source);
            }
        }

        for (const source of document.querySelectorAll(linkSelector)) {
            const coordinates = destination(source.getAttribute('href'));
            if (!coordinates) continue;

            let button = buttons.get(source);
            if (!button) {
                // Create a fresh anchor so Google Maps click handlers, IDs and
                // framework internals are never copied onto the Waze button.
                button = document.createElement('a');
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                icon.setAttribute('class', 'pogomapper-waze-icon');
                icon.setAttribute('viewBox', '0 0 512 512');
                icon.setAttribute('aria-hidden', 'true');
                icon.setAttribute('focusable', 'false');
                // Font Awesome Free 6.7.2 by @fontawesome, Copyright 2024 Fonticons, Inc.
                // Waze brand icon: CC BY 4.0 - https://creativecommons.org/licenses/by/4.0/
                // https://github.com/FortAwesome/Font-Awesome/blob/6.7.2/svgs/brands/waze.svg
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M502.17 201.67C516.69 287.53 471.23 369.59 389 409.8c13 34.1-12.4 70.2-48.32 70.2a51.68 51.68 0 0 1-51.57-49c-6.44.19-64.2 0-76.33-.64A51.69 51.69 0 0 1 159 479.92c-33.86-1.36-57.95-34.84-47-67.92-37.21-13.11-72.54-34.87-99.62-70.8-13-17.28-.48-41.8 20.84-41.8 46.31 0 32.22-54.17 43.15-110.26C94.8 95.2 193.12 32 288.09 32c102.48 0 197.15 70.67 214.08 169.67zM373.51 388.28c42-19.18 81.33-56.71 96.29-102.14 40.48-123.09-64.15-228-181.71-228-83.45 0-170.32 55.42-186.07 136-9.53 48.91 5 131.35-68.75 131.35C58.21 358.6 91.6 378.11 127 389.54c24.66-21.8 63.87-15.47 79.83 14.34 14.22 1 79.19 1.18 87.9.82a51.69 51.69 0 0 1 78.78-16.42zM205.12 187.13c0-34.74 50.84-34.75 50.84 0s-50.84 34.74-50.84 0zm116.57 0c0-34.74 50.86-34.75 50.86 0s-50.86 34.75-50.86 0zm-122.61 70.69c-3.44-16.94 22.18-22.18 25.62-5.21l.06.28c4.14 21.42 29.85 44 64.12 43.07 35.68-.94 59.25-22.21 64.11-42.77 4.46-16.05 28.6-10.36 25.47 6-5.23 22.18-31.21 62-91.46 62.9-42.55 0-80.88-27.84-87.9-64.25z');
                icon.append(path);
                button.append(icon);
                button.className = source.className;
                button.style.cssText = source.style.cssText;
                button.style.marginInlineStart = '0';
                button.style.whiteSpace = 'nowrap';
                if (!source.classList.contains('MuiIconButton-root')) {
                    button.style.padding = '8px';
                }
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
                button.dataset.pogomapperWaze = 'true';
                // Avoid triggering popup/map click handlers; keep native navigation.
                button.addEventListener('click', event => event.stopPropagation());
                buttons.set(source, button);
            }

            const href = `https://www.waze.com/ul?ll=${encodeURIComponent(coordinates)}&navigate=yes&utm_source=pogomapper_userscript`;
            if (button.getAttribute('href') !== href) button.setAttribute('href', href);
            const title = `Navigate with Waze to ${coordinates}`;
            if (button.title !== title) {
                button.title = title;
                button.setAttribute('aria-label', title);
            }
            if (source.nextSibling !== button) source.after(button);
        }
    }

    let scheduled = false;
    function relevantChange(record) {
        if (record.type === 'attributes') {
            return buttons.has(record.target) || record.target.matches(linkSelector);
        }
        for (const node of record.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                (node.matches(linkSelector) || node.querySelector(linkSelector))) return true;
        }
        // Only removals containing a tracked link/button need cleanup or repair.
        for (const node of record.removedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            for (const [source, button] of buttons) {
                if (node.contains(source) || node.contains(button)) return true;
            }
        }
        return false;
    }

    const observer = new MutationObserver(records => {
        if (scheduled) return;
        if (!records.some(relevantChange)) return;
        scheduled = true;
        setTimeout(() => {
            scheduled = false;
            refresh();
        }, 40);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href'],
    });
    refresh();
})();
