// ==UserScript==
// @name         Torn Travel Bounties
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A one click turn on script to hide the people without bounties on their heads while overseas.
// @author       Helcostr [1934501]
// @match        https://www.torn.com/index.php?page=people*
// @grant        none
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';
    // Select the node that will be observed for mutations
const targetNode = document;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    $("ul#iconTray:not(.singleicon)").toArray().forEach(e=>{
        if ($(e).find("#icon13").length==0) $(e).parent().parent().hide();
    });
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

})();
