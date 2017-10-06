// ==UserScript==
// @name         Torn Event Modifier
// @version      0.1
// @description  Tweak Events Page
// @author       echoblas53[1934501]
// @match        https://www.torn.com/events.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $(document).ajaxComplete((e,x,s) => {
        if (s.url.search("events.php") != -1) {
            $(".mail-link").each((e,t)=>{
                var regex = /.* bought (\d*) x .* from your bazaar for \$([0-9,]+)./;
                if (regex.test($(t).text())) {
                    var arr = regex.exec($(t).text());
                    var calc = parseInt(arr[2].replace(/,/g, ''))/parseInt(arr[1].replace(/,/g, ''));
                    $(t).attr("title","(worth $" + calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " each)");
                }
            });
        }
    });
})();
