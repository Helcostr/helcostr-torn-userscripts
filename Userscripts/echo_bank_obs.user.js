// ==UserScript==
// @name         Banking Observer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @updateURL    https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/echo_bank_obs.user.js
// @supportURL   https://www.torn.com/messages.php#/p=compose&XID=1934501
// @description  Automatically contribute data to track bank APR
// @author       Helcostr [1934501]
// @match        https://www.torn.com/bank.php
// ==/UserScript==

(function() {
	'use strict';
	let infobox = '<div id="HCS_BankOb"><div class="info-msg-cont green border-round m-top10 r2895"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p id="HCS_BankOb_Status">Thank you for contributing. All contributions are now closed, and a visual update is soon to come Stay tuned, and feel free to contact me for more information. I will no longer to store your API.</p></div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10 r2895"></div>';
	$(".invest-wrap").before(infobox);
})();
