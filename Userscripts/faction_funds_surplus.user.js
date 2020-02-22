// ==UserScript==
// @name         Faction Funds Surplus
// @version      1.1.0
// @description  Display's faction funds surplus written by nym (branch off of 0.3 https://greasyfork.org/en/scripts/376805-faction-funds-surplus)
// @author       Helcostr
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/faction_funds_surplus.user.js
// ==/UserScript==

(() => {
	let $ = window.jQuery;

	//Trigger on ajax complete
	$(document).ajaxComplete((event,xhr,settings)=>{
		if (settings.url.search("factions.php") != -1)
			appendSurplus();
	});

	const appendSurplus = ()=>{
		//Inject HTML Once
		if ($('#surplusInfo').size() == 0) $('.money-depositors').append('<li class="depositor" id="surplusInfo"><div class="clearfix"><div class="user name" style="width: 147px;">Deposit: <span class="money" id="deposited"></span></div><div class="amount"><div class="show">Surplus: <span class="money" id="surplusValue"></span></div></div></div></li>');

		//Set Values
		let total_money = parseInt($('span[data-faction-money]').attr('data-faction-money'));
		let total_positive = $(".money-depositors a+.amount .money").get().reduce((total,e)=>{
			let val = parseInt($(e).attr("data-value"));
			return (val>0) ? total + val : total;
		},0);

		//Set output value
		$("#deposited").text('$' + formatMoney(total_positive));
		$("#surplusValue").text('$'+ formatMoney(total_money - total_positive));
	}

	function formatMoney (amt, delim = ",") {
		const negativeSign = amt < 0 ? "-" : "";
		let val = Math.abs(amt).toString();
		return negativeSign + val.replace(/(?<=\d)(?=(\d{3})+$)/g,",");//
	};
})();
