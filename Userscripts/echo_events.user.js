// ==UserScript==
// @name         Torn Event Modifier
// @version      0.3
// @description  Tweak Events Page
// @author       echoblas53[1934501]
// @match        https://www.torn.com/events.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const search = {
        func: (obj,regex) => {
            if (regex.test($(obj).text())) {
                var arr = regex.exec($(obj).text());
                var calc = parseInt(arr[2].replace(/,/g, ''))/parseInt(arr[1].replace(/,/g, ''));
                $(obj).attr("title","(worth $" + Math.floor(calc).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " each)");
            }
        },
        regex: [
            /.* bought ([0-9,]+) x .* from your bazaar for \$([0-9,]+)\./,
            /([0-9,]+) shares in [A-Z]+ have been sold for \$([0-9,]+)\. You can withdraw your check from the bank, or wait for it to be credited to your account in 24 hours\./,
            /.* bought ([0-9,]+) of your points that were on the market for \$([0-9,]+)\./
        ]
    };
    $(document).ajaxComplete((e,x,s) => {
        if (s.url.search("events.php") != -1) {
            $(".mail-link").each((i,obj)=>{
                search.regex.forEach((regex) => {
                    search.func(obj,regex);
                });
            });
        }
    });
})();
