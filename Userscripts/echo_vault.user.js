// ==UserScript==
// @name         Torn Property Vault Tracker
// @version      1.0
// @description  Infinitly Increase Memory of Vault
// @author       Echoblast53
// @match        https://www.torn.com/properties.php
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(()=>{
	"use strict";
	$(document).ready(()=>{
		$(document).ajaxComplete((event,xhr,settings) => {
			if (settings.url.search("properties.php") != -1) {
				try {
					console.log(JSON.parse(xhr.responseText));
				} catch (err) {
					onLoad();
					clear();
					display();
				}
			}
		});
	});
	function onLoad(cb) {
		var history = JSON.parse(GM_getValue("history","{}"));
		$(".transaction").each((i,e)=>{
			if (!$(e).parent().hasClass("title")) {
				var day = $(e).find(".date .transaction-date").text().match(/(\d{4})\/(\d{2})\/(\d{2})/);
				var time = $(e).find(".date .transaction-time").text().match(/(\d{2}):(\d{2}):(\d{2}) (AM|PM)/);
				var date = Date.UTC(day[1],day[2]-1,day[3],(()=>{
					if (time[4] === "PM")
						time[1]+=12;
					if (time[1] === 24)
						return 12;
					if (time[1] === 12)
						return 0;
					return time[1];
				})(),time[2],time[3])/1000;
				if (typeof history[date] === 'undefined')
					history[date] = {
						username: $.trim($($(e).find(".user a")[0]).text()),
						userlink: $($(e).find(".user a")[0]).attr("href"),
						type: $.trim($(e).find(".type").text()),
						amount: $.trim((()=>{
							var clone = $(e).find(".amount").clone();
							clone.find(".type-sign").remove();
							return clone.text();
						})()),
						type_sign: $.trim($(e).find(".amount .type-sign").text()),
						balance: $.trim($(e).find(".balance").text())
					};
			}
		});
		GM_setValue("history",JSON.stringify(history));
	}
	function display() {
		var history = JSON.parse(GM_getValue("history","{}"));
		var temp_history = {};
		Object.keys(history).sort((a, b) => {return parseInt(b)-parseInt(a);}).forEach((key)=>{
			$(".vault-trans-list").append(htmlTrans(key,history[key]));
		});
	}
	function clear(cb) {
		$(".transaction").each((i,e)=>{
			if (!$(e).parent().hasClass("title")) {
				$(e).parent().remove();
			}
		});
	}
	function htmlTrans(key,obj){
		var date = new Date(key*1000);
		return `<li><ul class="transaction"><li class="date"><span class="transaction-date">${pad(date.getUTCFullYear(),2)}/${pad(date.getUTCMonth()+1,2)}/${pad(date.getUTCDate(),2)}</span>
		<span class="transaction-time">${pad((()=>{
			var calc = date.getUTCHours()%12;
			if (calc === 0)
				return 12;
			return calc;
		})(),2)}:${pad(date.getUTCMinutes(),2)}:${pad(date.getUTCSeconds(),2)} ${(()=>{
			if (date.getUTCHours()/12 >= 1)
				return "PM";
			return "AM";
		})()}</span></li>
		<li class="user t-overflow"><span class="t-hide"><a class="user name" href="${obj.userlink}">${obj.username}</a></span>
		<span class="d-hide"><a class="user name" href="${obj.userlink}">${obj.username}</a></span></li>
		<li class="type">${obj.type}</li><li class="amount t-overflow"><span class="type-sign">${obj.type_sign}</span> ${obj.amount}</li><li class="balance t-overflow">${obj.balance}</li><li class="clear"></li></ul></li>`;
	}
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
})();