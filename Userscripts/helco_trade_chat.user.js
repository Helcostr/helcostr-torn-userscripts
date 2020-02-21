// ==UserScript==
// @name         Trade Chat
// @version      1.0.2
// @description  Opens chat for trades (click on logs)
// @supportURL   https://www.torn.com/messages.php?p=compose&XID=1934501
// @updateURL    https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/helco_trade_chat.user.js
// @author       Helcostr [1934501]
// @include      https://www.torn.com/trade.php*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('#trade-container');

    // Options for the observer (which mutations to observe)
    const config = {
        attributes: false,
        childList: true,
        subtree: true
    };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        $("ul.log > li:not(.last) a").each((i, e) => {
            let id = parseInt(/XID=(\d+)/.exec($(e).attr("href"))[1]); //Plaintext parse
            $(e).parent().click(id, (event) => {
                if (parseInt(/XID=(\d+)/.exec($("[class^=menu-name]").next().attr("href"))[1]) != parseInt(event.data))
                    chat.r(event.data);
            });
        });
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
