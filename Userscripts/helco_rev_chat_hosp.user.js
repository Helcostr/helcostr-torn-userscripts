// ==UserScript==
// @name         Revive Chat Hosp
// @version      1.0
// @description  Opens chat for hospitalized people (click on reason)
// @supportURL   https://www.torn.com/messages.php?p=compose&XID=1934501
// @updateURL    https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/helco_rev_chat_hosp.user.js
// @author       Helcostr [1934501]
// @match        https://www.torn.com/hospitalview.php*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('ul.user-info-list-wrap');

    // Options for the observer (which mutations to observe)
    const config = {
        attributes: false,
        childList: true,
        subtree: true
    };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        console.log($("ul.user-info-list-wrap > li:not(.last)").length);
        $("ul.user-info-list-wrap > li:not(.last)").each((i, e) => {
            let focus = $(e).find("a.name");
            let name = focus.data("placeholder");
            let id;
            if (typeof name == "undefined")
                id = parseInt(/XID=(\d+)/.exec(focus.attr("href"))[1]); //Plaintext parse
            else
                id = parseInt(/(\S+)\s\[(\d+)\]/.exec(name)[2]); //Honorbar parse
            $(e).find(".reason").click(id, (event) => {
                chat.r(event.data);
            });
        });
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();