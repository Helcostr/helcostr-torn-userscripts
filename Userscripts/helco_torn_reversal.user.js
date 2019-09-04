// ==UserScript==
// @name         Torn Reversal
// @version      1.0
// @description  Flip any userlists in Torn so that the bottom appears at the top (disable the script to turn off)
// @author       Helcostr
// @include      https://www.torn.com/*
// @grant        GM_addStyle
// ==/UserScript==

(()=>{
    'use strict';

    GM_addStyle("ul.users-list {display: flex;flex-direction: column-reverse;}");
})();