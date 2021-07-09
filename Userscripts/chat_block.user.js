// ==UserScript==
// @name         TORN : Chat Blocker & Highlighter
// @namespace    chatblocker
// @version      0.1beta
// @description  Chat Blocker. Add spammer/scammer/troller to block them appear in all chat(company/faction/global/trade). And Highlighter
// @author       Mafia[610357] (modified by Helcostr [1934501] off of 4.5)
// @match        https://www.torn.com/*
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==
//https://greasyfork.org/scripts/39353-torn-chat-blocker-highlighter/code/TORN%20:%20Chat%20Blocker%20%20Highlighter.user.js
jQuery.expr[':'].highlight = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};

GM_addStyle(`.licolor input { width: 15px; height: 18px; margin: 7px; background-color: transparent; cursor: pointer;} span.hel_hidden {background:#333;} span.hel_hidden:hover {background:#eee;}`);

(function () {
    'use strict';
    var chatblocklist = JSON.parse(localStorage.chatblocklist || '[]');
    var chatcolor = JSON.parse(localStorage.chatcolor || '{"selfcolor":"#0080c0","highlight":"#ffffbf"}');
    var uid = $("script[src*='builds/chat/']").attr("uid");
    var name = $("script[src*='builds/chat/']").attr("name");

    if(!chatcolor.uid || chatcolor.name != name){
        chatcolor.uid = uid;
        chatcolor.name = name;
    }

    var highlight = function() {
        $("div[class^='chat-box_'] div[class^='message'] a[href$='"+chatcolor.uid+"']").css("color", chatcolor.selfcolor);
        var arr = (!chatcolor.txthighlight ? chatcolor.name : (chatcolor.name + "," + chatcolor.txthighlight).replace(/,\s*$/, "")).split(",");
        $.each(arr, function() {
            var item = $.trim(this);
            $("div[class^='chat-box_'] div[class^='message'] span:highlight("+item+")").parent().css({"background-color": chatcolor.highlight, "border-top": "1px dashed #000", "border-bottom": "1px dashed #000", "padding": "0px 5px"});
        });
        $("div[class^='chat-box_'] div[class^='message'] span:highlight("+chatcolor.name+")").parent().css({"background-color": chatcolor.highlight, "border-top": "1px dashed #000", "border-bottom": "1px dashed #000", "padding": "0px 5px"});

        if(chatcolor.users) {
            $.each(chatcolor.users, function(id){
                $("div[class^='chat-box_'] div[class^='message'] a[href$='="+id+"']").css("color", this);
            });
        }
    }

    var observerTarget = $("#chatRoot")[0];
    var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    var observer = new MutationObserver(function(mutations) {

        highlight();

        if($("a:contains('Blocked')").closest("li").is("[class*='active']")) {
            chatblocklist = [];
            $.each($("ul[class^='people-list_'] li a[class^='user-name-id_']"), function(){
                var id = parseInt($(this).attr("href").match(/\d+/));
                chatblocklist.push(id);
            });

            localStorage.chatblocklist = JSON.stringify(chatblocklist);
        }

        if($("a:contains('Friends')").closest("li").is("[class*='active']") || $("a:contains('Faction')").closest("li").is("[class*='active']") || $("a:contains('Faction')").closest("li").is("[class*='active']")) {

            if($(".viewport .overview ul.ui-autocomplete li").length && !$(".viewport .overview ul.ui-autocomplete li input").length) {
                observer.disconnect();
                GM_addStyle('.viewport .overview ul.ui-autocomplete li a { display: contents !important; } .viewport .overview ul.ui-autocomplete li input { cursor: crosshair; }');
                $.each($(".viewport .overview ul.ui-autocomplete li"), function(){
                    $(this).append('<input type="color" style=" width: 14px; height: 18px; background-color: transparent; float: right; vertical-align: middle;">');
                });

                if(chatcolor.users) {
                    $.each(chatcolor.users, function(id){
                        // console.log($(".viewport .overview ul.ui-autocomplete li a:contains(["+id+"])").length);
                        $(".viewport .overview ul.ui-autocomplete li a:contains(["+id+"])").parent().css("color", this).find("input").val(this);
                    });
                }

                $(".viewport .overview ul.ui-autocomplete li input").change(function(){
                     if(!chatcolor.users) chatcolor.users = {};
                     var id = parseInt($(this).closest("li").find("a").text().match(/([0-9]*?)\]/)[0]);
                     console.log($(this).closest("li").find("a").text(),id);
                     chatcolor.users[id] = $(this).val();
                     $("ul[class^='people-list_'] li a[href$='"+id+"']").css("color", $(this).val());
                     $("ul[class^='people-list_'] li a[href$='"+id+"']").parent().find(".licolor input").val($(this).val());
                     localStorage.chatcolor = JSON.stringify(chatcolor);
                     highlight();
                     return 0;
                });
                observer.observe(observerTarget, observerConfig);
            }

            if($("ul[class^='people-list_'] li").length) {
                if(!$("span.licolor").length) {
                    GM_addStyle('span.' + $("span[class^='ellipsis']").attr("class") + ' {max-width: 160px !important;}');
                    observer.disconnect();


                    $.each($("ul[class^='people-list_'] li"), function(){
                        $(this).append('<span class="'+$("ul[class^='people-list_'] li span[class^='i-wrap']").attr("class")+' licolor"><input type="color"/></span>');
                    });


                    if(chatcolor.users) {
                        $.each(chatcolor.users, function(id){
                            $("ul[class^='people-list_'] li a[href$='"+id+"']").css("color", this).parent().find(".licolor input").val(this);
                        });
                    }

                    $(".licolor input").change(function(){
                         if(!chatcolor.users) chatcolor.users = {};
                         chatcolor.users[parseInt($(this).closest("li").find("a").attr("href").match(/\d+/)[0])] = $(this).val();
                         $(this).closest("li").find("a").css("color", $(this).val());
                         localStorage.chatcolor = JSON.stringify(chatcolor);
                         highlight();
                    });
                }
                observer.observe(observerTarget, observerConfig);
            }
        }

        if($("div[class^='chat-box-settings_']").length) {
            if(!$("div:contains(Name Color)").length) {
                $("div[class^='chat-opt-label']:contains(Private sound)").parent().append(`
                <div>
                    <div class="${$("div[class^='chat-opt-label']:contains(Private sound)").attr("class")}">Name Color</div>
                    <div class="${$("div[class^='chat-opt-value_'").attr("Faction")}">
                        <div class="${$("div[class^='dropdown-root_']").attr("class")}">
                            <input type="color" id="selfcolor" value="${chatcolor.selfcolor}" />
                            <i class="top-page-icon refresh-icon" title="Reset colors" id="iresetc"></i>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>

                <div>
                    <div class="${$("div[class^='chat-opt-label']:contains(Private sound)").attr("class")}">Highlight</div>
                    <div class="${$("div[class^='chat-opt-value_'").attr("class")}">
                        <div class="${$("div[class^='dropdown-root_']").attr("class")}">
                            <input type="color" id="highlight" value="${chatcolor.highlight}" title="your name permanently highlighted" />
                            <input id="txthighlight" type="text" title="add some words to highlight (in comma seperated) like xanax, vico, etc.." placeholder="xanax, vico, edvd" style="width: 88px;height: 24px;padding: 0px 7px;" value="${chatcolor.txthighlight || ""}">
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>`);

                $("#selfcolor,#highlight").change(function(){
                    chatcolor[$(this).attr("id")] = $(this).val();
                    localStorage.chatcolor = JSON.stringify(chatcolor);
                    highlight();
                });

                $("#txthighlight").change(function(){
                    chatcolor.txthighlight = $(this).val();
                    localStorage.chatcolor = JSON.stringify(chatcolor);
                    $("div[class^='message']").removeAttr("style");
                    highlight();
                });

                $("#iresetc").css("cursor", "pointer").click(function(){
                    if(confirm("Are you sure to reset all color settings ? (all names colors and highlight settings)")) {
                        localStorage.removeItem("chatcolor");
                        location.reload();
                    }
                });
            }
        }

        $.each($("div[class^='message_'] a"), function() {
            if(chatblocklist.indexOf(parseInt($(this).attr("href").match(/\d+/))) != -1 && !$(this).next().hasClass("hel_hidden")) {
                $(this).next().addClass("hel_hidden");
            }

            if(chatblocklist.indexOf(parseInt($(this).attr("href").match(/\d+/))) == -1 && $(this).next().hasClass("hel_hidden")) {
                $(this).next().removeClass("hel_hidden");
            }

        });


    });
    observer.observe(observerTarget, observerConfig);
    highlight();
})();
