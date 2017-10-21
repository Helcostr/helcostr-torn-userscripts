// ==UserScript==
// @name         Torn Property Vault Tracker
// @version      1.1
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
			if (settings.url.search("properties.php") != -1 && window.location.href.search("tab=vault") != -1) {
				try {
					JSON.parse(xhr.responseText);
				} catch (err) {
					$(".vault-trans-wrap .title-black").append($('<button title="Remove Corrupted Data">Purge</button>').click(()=>{
						purge();
					}))
					onLoad();
					clear();
					display();
				}
			}
		});
	});
	function onLoad() {
		var history = JSON.parse(GM_getValue("history","{}"));
		$(".transaction").each((i,e)=>{
			if (!$(e).parent().hasClass("title")) {
				var day = $(e).find(".date .transaction-date").text().match(/(\d{4})\/(\d{2})\/(\d{2})/);
				var time = $(e).find(".date .transaction-time").text().match(/(\d{2}):(\d{2}):(\d{2}) (AM|PM)/);
				var date = Date.UTC(day[1],day[2]-1,day[3],time[1],time[2],time[3]);
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
		console.log(history);
		GM_setValue("history",JSON.stringify(history));
	}
	function display() {
		var history = JSON.parse(GM_getValue("history","{}"));
		Object.keys(history).sort((a, b) => {return parseInt(b)-parseInt(a);}).forEach((key,i)=>{
			$(".vault-trans-list").append(htmlTrans(key,history[key],i));
		});
	}
	function clear() {
		$(".transaction").each((i,e)=>{
			if (!$(e).parent().hasClass("title")) {
				$(e).parent().remove();
			}
		});
	}
	function htmlTrans(key,obj,i){
		var date = new Date(parseInt(key));
		return `<li><ul class="transaction" ${(()=>{if(i>9)return 'style="opacity: 0.9;"';})()}><li class="date"><span class="transaction-date">${date.getUTCFullYear()}/${pad(date.getUTCMonth()+1,2)}/${pad(date.getUTCDate(),2)}</span><span class="transaction-time">${pad(date.getUTCHours(),2)}:${pad(date.getUTCMinutes(),2)}:${pad(date.getUTCSeconds(),2)} ${(()=>{
			if (date.getUTCHours()/12 >= 1)
				return "PM";
			return "AM";
		})()}</span></li><li class="user t-overflow"><span class="t-hide"><a class="user name" href="${obj.userlink}">${obj.username}</a></span><span class="d-hide"><a class="user name" href="${obj.userlink}">${obj.username}</a></span></li><li class="type">${obj.type}</li><li class="amount t-overflow"><span class="type-sign">${obj.type_sign}</span> ${obj.amount}</li><li class="balance t-overflow">${obj.balance}</li><li class="clear"></li></ul></li>`;
	}
	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	function purge() {
		GM_setValue("history","{}");
		location.reload();
	}
})();
