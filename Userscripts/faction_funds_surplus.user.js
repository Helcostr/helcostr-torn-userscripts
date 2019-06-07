// ==UserScript==
// @name         Faction Funds Surplus
// @version      0.0.3
// @description  Display's faction funds surplus written by nym (branch off of 0.3 https://greasyfork.org/en/scripts/376805-faction-funds-surplus)
// @author       Helcostr
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/faction_funds_surplus.user.js
// ==/UserScript==

(() => {
	var $ = window.jQuery;

	$(document).ajaxComplete((event,xhr,settings)=>{
		if (settings.url.search("factions.php") != -1) {
			appendSurplus();
		}
	});

	function appendSurplus() {
		if ($('#surplusInfo').size() == 0) $('.money-depositors').append('<div class="info" id="surplusInfo"><li>Deposited: <span id="deposited"></span></li><li>Surplus: <span id="surplusValue"</span> </li></div>');
		var total_money = parseInt($('span[data-faction-money]').attr('data-faction-money'));
		var total_deposited = 0;
		var total_borrowed = 0;
		var list_deposited = $(".money-depositors .money").map(function(){return parseInt($(this).attr("data-value"));}).get();
		console.log(list_deposited);
		list_deposited.forEach((val) => {
			if (val < 0) total_borrowed += val;
			else total_deposited += val;
		});

		console.log('Total money = ' + total_money);
		console.log('Total deposited = ' + total_deposited);
		console.log('Total borrowed = ' + total_borrowed);
		$("#deposited").text('$' + formatMoney(total_deposited));
		$("#surplusValue").text('$'+ formatMoney(total_money - total_deposited));

	}

	function formatMoney(amount, thousands = ",") {

			const negativeSign = amount < 0 ? "-" : "";

			let i = amount.toString();
			let j = (i.length > 3) ? i.length % 3 : 0;

			return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands);
	};


})();
