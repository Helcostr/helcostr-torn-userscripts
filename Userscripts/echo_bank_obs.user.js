// ==UserScript==
// @name         Banking Observer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @updateURL    https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/echo_bank_obs.user.js
// @supportURL   https://www.torn.com/messages.php#/p=compose&XID=1934501
// @description  Automatically contribute data to track bank APR
// @author       Helcostr [1934501]
// @match        https://www.torn.com/bank.php
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
	'use strict';
	function statusUpdate(text) {
		$("#HCS_BankOb_Status").html(text)
	}
	function error(text) {
		statusUpdate($(text).append("<br><br>Please contact <a href='https://www.torn.com/messages.php#/p=compose&XID=1934501'>Helcostr</a> for more information, and supply this error message."));
	}
	function keyIssue(reason) {
		error($("<span>"+reason+" <input type='text' id='keyIn' value='"+GM_getValue("key","")+"'></span>").append($("<button title='Save API Key'>Save API Key</button>").click(()=>{
			GM_setValue("key",$("#keyIn").val());
			statusUpdate("API Key saved. Refreshing page.");
			setTimeout(()=>{location.reload();},3000);
		})));
	}
	function banned(reason) {
		return 'You have been banned from this service. (Reason:"'+reason+'")'
	}
	function timeout(tick)  {
		return 'Please slow down from using this service. (<span class="HCS_Countdown" data-timeout="'+tick+'"></span>)'
	}
	let payload = {};
	let infobox = '<div id="HCS_BankOb"><div class="info-msg-cont green border-round m-top10 r2895"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p id="HCS_BankOb_Status"></p></div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10 r2895"></div>';
	$(".invest-wrap").before(infobox);
	$(".diagram-desc > li").each((i, e) => {
		let copy = $(e).clone();
		if (copy.hasClass("clear")) return;
		let name = copy.find("span.name").text();
		copy.find("span").remove();
		payload[name] = parseFloat(copy.text());
	});
	let key = GM_getValue("key",null);
	if (key == null)
		keyIssue("Please insert your API key.")
	else if (key < 16)
		keyIssue("Key is too short. Please insert your API key.")
	else if (Object.keys(payload).length > 0) {
		const url = "https://script.google.com/macros/s/AKfycbycX17dDk39v9-3ctbgWFWeJAAORyOC8zI1X9ohvxx4nCcmmIE/exec";
		payload.key = key;
		GM_xmlhttpRequest({
			method:"POST",
			data:JSON.stringify({
				pwd:"?3q@6GtauA!7&D-E",
				data:payload
			}),
			onload:(r)=>{
				try {
					let data = JSON.parse(r.responseText);
					if (data.success)
						statusUpdate("Thank you for your contribution.");
					else {
						switch(data.error) {
							case "banned":
								error(banned(data.reason));
								break;
							case "timeout":
								error(timeout(data.timeout));
							case "data":
								error("Critical error (data)");
								break;
							case "key":
								keyIssue("Invalid key. Please check your Key again.");
								break;
							case "api":
								let htmlString = "There is an issue with the API<br>Error:"+data.msg;
								if (data.timeout > Date.now())
									htmlString+="<br><br>"+timeout(data.timeout);
								if (data.banned != "")
									htmlString+="<br><br>"+banned(data.banned);
								error(htmlString);
								break;
							case "sharing":
								error("This browser was used for a different user.");
								break;
							case "done":
								error("State error (done).");
								break;
							case "password":
								error("Script error.");
								break;
							case "none":
								error("State error (none).");
								break;
						}
					}	
				} catch (e) {
					error(e)
				}
			},
			ontimeout:(r)=>{
				error("Knock knock? Something slowed down (timeout error).<br>" + r.responseText);
			},
			onerror:(r)=>{
				error("OUCH! ERROR!<br>" + r.responseText);
			},
			onabort:(r)=>{
				error("Huh, you managed to quit my send (abort error).<br>" + r.responseText);
			},
			url:url
		});
	}
})();
