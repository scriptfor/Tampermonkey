// ==UserScript==
// @name         Kemono/Coomer Pagination Buttons
// @namespace    http://tampermonkey.net
// @version      2025-04-24_01-06
// @description  Adds pagination buttons '<' (on the left) and '>' (on the right) to the page, allowing for quick page changes. It also serves as an alternative to a bug that causes pagination to disappear due to blacklisting. This script is compatible with the sites kemono, coomer, and nekohouse.
// @match        *://*kemono.su/posts*
// @match        *://*coomer.su/posts*
// @match        *://*nekohouse.su/*
// @author       scriptfor
// @homepageURL  https://github.com/scriptfor
// @updateURL    https://github.com/scriptfor/-/blob/'/Kemono%20Coomer%20and%20Similar/Kemono%20Coomer%20Pagination%20Buttons.user.js
// @downloadURL  https://github.com/scriptfor/-/blob/'/Kemono%20Coomer%20and%20Similar/Kemono%20Coomer%20Pagination%20Buttons.user.js
// @icon         https://icons.duckduckgo.com/ip2/coomer.su.ico
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let prevContainer, nextContainer;

    function addPaginationButtons() {
        const cardList = document.querySelector('div.card-list.card-list--legacy');
        if (cardList) {
            const urlParams = new URLSearchParams(window.location.search);
            const offset = parseInt(urlParams.get('o')) || 0;
            const itemsPerPage = 50;

            const prevOffset = Math.max(0, offset - itemsPerPage);
            const nextOffset = offset + itemsPerPage;

            const prevButton = `<a class="fancy-link fancy-link--coomer" href="?o=${prevOffset}&tag=${urlParams.get('tag')}"><b>&lt</b></a>`;
            const nextButton = `<a class="fancy-link fancy-link--coomer" href="?o=${nextOffset}&tag=${urlParams.get('tag')}"><b>&gt</b></a>`;

            prevContainer = document.createElement('div');
            prevContainer.innerHTML = prevButton;
            prevContainer.style.position = 'fixed';
            prevContainer.style.top = '50%';
            prevContainer.style.left = '10px';
            prevContainer.style.transform = 'translateY(-50%)';
            prevContainer.style.zIndex = '1000';
            prevContainer.style.backgroundColor = 'transparent';
            prevContainer.style.padding = '10px';
            prevContainer.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.2)';
            prevContainer.style.border = '1px solid var(--colour0-tertirary)';

            nextContainer = document.createElement('div');
            nextContainer.innerHTML = nextButton;
            nextContainer.style.position = 'fixed';
            nextContainer.style.top = '50%';
            nextContainer.style.right = '10px';
            nextContainer.style.transform = 'translateY(-50%)';
            nextContainer.style.zIndex = '1000';
            nextContainer.style.backgroundColor = 'transparent';
            nextContainer.style.padding = '10px';
            nextContainer.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.2)';
            nextContainer.style.border = '1px solid var(--colour0-tertirary)';

            document.body.appendChild(prevContainer);
            document.body.appendChild(nextContainer);

            adjustPrevButtonPosition();
            observeSidebarChanges();
        } else {
            setTimeout(addPaginationButtons, 100);
        }
    }

    function adjustPrevButtonPosition() {
        const sidebar = document.querySelector('.global-sidebar');
        if (sidebar) {
            if (sidebar.classList.contains('expanded')) {
                prevContainer.style.left = '200px';
            } else if (sidebar.classList.contains('retracted')) {
                prevContainer.style.left = '10px';
            }
        }
    }

    function observeSidebarChanges() {
        const sidebar = document.querySelector('.global-sidebar');
        if (sidebar) {
            const observer = new MutationObserver(() => {
                adjustPrevButtonPosition();
            });

            observer.observe(sidebar, { attributes: true });
        }
    }

    addPaginationButtons();
})();
