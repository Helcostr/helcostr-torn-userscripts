// ==UserScript==
// @name         Tissue Assist
// @version      0.1
// @description  Prevent tissues being used if you won't gain anything.
// @author       Helcostr [1934501]
// @run-at       document-start
// @match        https://www.torn.com/item.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let happy_ready = false;
    XMLHttpRequest.prototype.oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(payload) {

        let obj = {};
        for (let [key,data] of payload.split("&").map(e=>e.split("="))){
            obj[key] = data;
        }
        console.log(happy_ready);
        if (obj.item==403 && !happy_ready) {
            return;
        }
        this.oldSend(payload);
    };
    const original_fetch = window.fetch;
    window.fetch = async (input, init) => {
        const response = await original_fetch(input, init);
        if (response.url.search('sidebarAjaxAction.php') != -1) {
            const clone = response.clone();
            let payload = typeof init.body != 'undefined' ? JSON.parse(init.body) : {};
            clone.json().then(data => {
                if (response.url.search('q=getSidebarData') != -1) {
                    data = data.bars;
                }
                if (response.url.search('q=getBars') != -1 || response.url.search('q=getSidebarData') != -1) {
                    happy_ready = (data.happy.amount / data.happy.max < .2);
                }
            });
        }
        return response;
    };
})();
