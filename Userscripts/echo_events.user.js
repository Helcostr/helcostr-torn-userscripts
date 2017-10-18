// ==UserScript==
// @name         Torn Event Modifier
// @version      0.4b
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
                $(obj).attr("title","(worth $" + calc.toFixed(3).replace(".000","").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " each)");
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
            var arr_obj = [];
            $(".mail-link").each((i,obj) => {
                arr_obj.push(obj);
            });
            arr_obj.reverse();
            for (var i = 0; i < arr_obj.length-1; i++) {
                var obj1 = $(arr_obj[i]).clone();
                obj1.find(".echcount").remove();
                if (obj1.text() == $(arr_obj[i+1]).text()) {
                    var time;
                    if ($(arr_obj[i]).parent().find(".echcount").length === 0){
                        $(arr_obj[i+1]).append('<span class="echcount" data-value="2">x2 </span>');
                        time = $(arr_obj[i]).parent().find(".date-time");
                        $(arr_obj[i+1]).parent().find(".date-time").after(time);
                    } else {
                        var value = $(arr_obj[i]).find(".echcount").data("value");
                        $(arr_obj[i+1]).append('<span class="echcount" data-value="' + (++value) + '">x' + value + ' </span>');console.warn("No");
                        time = $(arr_obj[i]).parent().find(".date-time")[1];
                        $(arr_obj[i+1]).parent().find(".date-time").after(time);
                    }
                    $(arr_obj[i]).parent().parent().parent().remove();
                    $(arr_obj[i+1]).parent().find(".mail-action-icon").remove();
                }
            }
            $(".mail-link").each((i,obj) => {
                search.regex.forEach((regex) => {
                    search.func(obj,regex);
                });
            });
        }
    });
})();
