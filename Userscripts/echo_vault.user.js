// ==UserScript==
// @name         Torn Property Vault Tracker
// @version      1.3b2
// @description  Infinitly Increase Memory of Vault
// @author       Echoblast53
// @match        https://www.torn.com/properties.php
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
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
					}));
					preLoad();
					onLoad();
					clear();
					display();
				}
			}
		});
	});
	let imgArch = {};
	function preLoad() {
		$(".user img").each((i,e)=>{
			let imgExp = $(e).attr("src").match(/awardimages\.torn\.com\/(\d+)-(\d+)/);
			if (typeof imgArch[imgExp[1]] === 'undefined')
				imgArch[imgExp[1]] = imgExp[2];
		});
	}
	function onLoad() {
		//Load Previous History
		let hist = JSON.parse(GM_getValue("history2","{}"));
		let tid_counter = tidMax(hist);
		//Temp storage
		let temp = [];

		//For each Transaction
		$(".transaction").each((i,e)=>{
			if (!$(e).parent().hasClass("title")) {
				//Record Date and Time and Concat
				let day = $(e).find(".date .transaction-date").text().match(/(\d{4})\/(\d{2})\/(\d{2})/);
				let time = $(e).find(".date .transaction-time").text().match(/(\d{2}):(\d{2}):(\d{2}) (AM|PM)/);
				let ts = day[1] + day[2] + day[3] + time[1] + time[2] + time[3];

				//Record Everything Else
				let username = ($(e).find(".user a img").length > 0) ? ($(e).find(".user a img").attr("alt").match(/(.+) \[\d+\]/)[1]) : ($.trim($($(e).find(".user a")[0]).text()));
				let uid = $($(e).find(".user a")[0]).attr("href").match(/XID=(\d+)/)[1];
				let type = $.trim($(e).find(".type").text());
				let amount = $.trim((()=>{
						var clone = $(e).find(".amount").clone();
						clone.find(".type-sign").remove();
						return clone.text();
					})());
				let type_sign = $.trim($(e).find(".amount .type-sign").text());
				let balance = $.trim($(e).find(".balance").text());
				temp.push({
					ts: ts,
					username: username,
					uid: uid,
					type: type,
					amount: amount,
					type_sign: type_sign,
					balance: balance
				});
			}
		});
		let mfd = [];
		for (let i in temp)
			if (typeof hist[temp[i].ts + temp[i].balance] !== 'undefined')
				mfd.push(i);
		for (let i in mfd)
			temp.splice(mfd.pop(),1);
		for (let i = temp.length-1; i >=0; i--) {
			temp[i].tid = ++tid_counter;
			hist[temp[i].ts + temp[i].balance] = temp[i];
		}
		console.log(hist);
		GM_setValue("history2",JSON.stringify(hist));
	}
	function display() {
		let hist = JSON.parse(GM_getValue("history2","{}"));
		let temp = [];
		for(let each in hist)
			temp.push(hist[each]);
		temp.sort((a, b) => {return parseInt(b.tid)-parseInt(a.tid);}).forEach((e,i)=>{
			$(".vault-trans-list").append(htmlTrans(e,i));
		});
	}

	function clear() {
		$(".transaction").each((i,e)=>{
			if (!$(e).parent().hasClass("title")) {
				$(e).parent().remove();
			}
		});
	}

	function htmlTrans(obj,i){
		let timestamp = obj.ts.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
		return `<li><ul class="transaction" ${(i > 9) ? 'style="opacity: 0.9;"' : ''}><li class="date"><span class="transaction-date">${timestamp[1]}/${timestamp[2]}/${timestamp[3]}</span><span class="transaction-time">${timestamp[4]}:${timestamp[5]}:${timestamp[6]} ${
			((timestamp[4]/12 >= 1) ? ("PM") : ("AM"))
		}</span></li><li class="user t-overflow"><span class="t-hide"><a class="user name" href="/profiles.php?XID=${obj.uid}">${
			(typeof imgArch[obj.uid] !== 'undefined') ? (`<img src="https://awardimages.torn.com/${obj.uid}-${imgArch[obj.uid]}-large.png" border="0" alt="${obj.username} [${obj.uid}]" title="${obj.username} [${obj.uid}]">`) : (obj.username)
		}</a></span><span class="d-hide"><a class="user name" href="/profiles.php?XID=${obj.uid}">${
			(typeof imgArch[obj.uid] !== 'undefined') ? (`<img src="https://awardimages.torn.com/${obj.uid}-${imgArch[obj.uid]}-small.png" border="0" alt="${obj.username} [${obj.uid}]" title="${obj.username} [${obj.uid}]">`) : (obj.username)
		}</a></span></li><li class="type">${obj.type}</li><li class="amount t-overflow"><span class="type-sign">${obj.type_sign}</span> ${obj.amount}</li><li class="balance t-overflow">${obj.balance}</li><li class="clear"></li></ul></li>`;
	}

	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}

	function purge() {
		if (confirm("Do you wish to purge all stored data?")) {
			GM_deleteValue("history2");
			location.reload();
		}
	}

	function tidMax(obj) {
		let max = 0;
		for(let each in obj)
			if (typeof obj[each].tid !== 'undefined' && obj[each].tid > max)
				max = obj[each].tid;
		return max;
	}

	function oldDisplay() {
		var history = JSON.parse(GM_getValue("history","{}"));
		Object.keys(history).sort((a, b) => {return parseInt(b)-parseInt(a);}).forEach((key,i)=>{
			$(".vault-trans-list").append(oldHtmlTrans(key,history[key],i));
		});
	}

	function oldPurge() {
		if (confirm("Do you wish to purge all stored data?")) {
			GM_deleteValue("history");
			location.reload();
		}
	}

	function oldHtmlTrans(key,obj,i){
		var date = new Date(parseInt(key));
		return `<li><ul class="transaction" ${(()=>{if(i>9)return 'style="opacity: 0.9;"';})()}><li class="date"><span class="transaction-date">${date.getUTCFullYear()}/${pad(date.getUTCMonth()+1,2)}/${pad(date.getUTCDate(),2)}</span><span class="transaction-time">${pad(date.getUTCHours(),2)}:${pad(date.getUTCMinutes(),2)}:${pad(date.getUTCSeconds(),2)} ${(()=>{
			if (date.getUTCHours()/12 >= 1)
				return "PM";
			return "AM";
		})()}</span></li><li class="user t-overflow"><span class="t-hide"><a class="user name" href="/profiles.php?XID=${obj.uid}">${(()=>{
			if (typeof imgArch[obj.uid] !== 'undefined')
				return `<img src="https://awardimages.torn.com/${obj.uid}-${imgArch[obj.uid]}-large.png" border="0" alt="${obj.username} [${obj.uid}]" title="${obj.username} [${obj.uid}]">`;
			return obj.username;
		})()}</a></span><span class="d-hide"><a class="user name" href="/profiles.php?XID=${obj.uid}">${(()=>{
			if (typeof imgArch[obj.uid] !== 'undefined')
				return `<img src="https://awardimages.torn.com/${obj.uid}-${imgArch[obj.uid]}-small.png" border="0" alt="${obj.username} [${obj.uid}]" title="${obj.username} [${obj.uid}]">`;
			return obj.username;
		})()}</a></span></li><li class="type">${obj.type}</li><li class="amount t-overflow"><span class="type-sign">${obj.type_sign}</span> ${obj.amount}</li><li class="balance t-overflow">${obj.balance}</li><li class="clear"></li></ul></li>`;
	}

})();
