// ==UserScript==
// @name         Torn OC Mail Template
// @version      0.5
// @description  Auto fill mail with OC related contents
// @author       Helcostr [1934501]
// @match        https://www.torn.com/messages.php
// @match        https://www.torn.com/factions.php?step=your
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);
    // const modifyBal = (id,amt) => $.post('https://www.torn.com/factions.php?rfcv=undefined',`step=editMoneyBalance&userID=${id}&amount=${amt}`);

	// Start observing the target node for configured mutations
	observer.observe(document, {childList: true, subtree: true});
	// Callback function to execute when mutations are observed
	function callback(mutationsList) {
		// Use traditional 'for loops' for IE 11
		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(async e=>{
					if (e.id == "mailcompose_ifr") {//MAIL DETECTION
						mail();
					} else if ('classList' in e && e.classList.contains("crime-result")) {
						if (e.dataset.crime == 8) {
                            // const data = await fetch('https://api.torn.com/faction/?selections=donations&key=mnMhr2Vf7po60Tqw')
                            //     .then(e=>e.json()).then(e=>e.donations);
							let amt = parseInt($(".make-wrap p:contains(made)").text().replace(/[^\d]/g,""));
							let crimeID = getUrlVars().crimeID;
							$(".t-blue-cont b:contains(Participants: ) a").each((i,e)=>{
								const user = getUrlVars($(e).attr("href"));
								const percent = (i==0)?.3:.2;
                                const cut = percent*amt;
                                // modifyBal(user.XID,data[user.XID].money_balance+cut);
								$(e).attr("href",`messages.php#/p=compose&XID=${user.XID}&username=${$(e).text()}&cut=${cut}&crimeID=${crimeID}&template=oc_mail`);
							});
						} else if (e.dataset.crime == 7) {
							let amt = parseInt($(".make-wrap p:contains(made)").text().replace(/[^\d]/g,""));
							let percent = .2/8;
							let crimeID = getUrlVars().crimeID;
							$(".t-blue-cont b:contains(Participants: ) a").each((i,e)=>{
								let user = getUrlVars($(e).attr("href"));
								$(e).attr("href",`messages.php#/p=compose&XID=${user.XID}&username=${$(e).text()}&cut=${percent*amt}&crimeID=${crimeID}&template=oc_payout`);
							});
							let ids = $(".t-blue-cont b:contains(Participants: ) a").get().map(e=>getUrlVars($(e).attr("href"))["XID"]);
							console.log(`https://www.torn.com/factions.php?step=your#/tab=controls&option=pay-day&pay=${percent*amt}&select=${ids.join(',')}`);
						}
					}
				});
			}
		}
	}

	function getUrlVars(url = window.location.href) {
		let vars = {};
		let parts = url.matchAll(/(?:&|#\/|\?)+([^=&]+)=([^&]*)/gi);
		// eslint-disable-next-line no-unused-vars
		for (const [_,key,value] of parts) {
			vars[key] = decodeURIComponent(value);
		}
		return vars;
	}
	function mail() {
		let template = null;
		let urlParam = getUrlVars();
		switch (urlParam.template) {
			case "oc_mail":
				template = oc_mail(urlParam.username,urlParam.crimeID,urlParam.cut);
				break;
			case "bal_transfer":
				template = bal_transfer(urlParam.t_name,urlParam.a_name,urlParam.a_id,urlParam.amt);
				break;
			case "violation":
				template = violation(urlParam.username,urlParam.amount);
			case "oc_payout":
				template = payout(urlParam.username,urlParam.crimeID,urlParam.cut);
				break;
		}
		if (template === null)
			return
		$(document.getElementById("mailcompose_ifr").contentDocument.getElementById("tinymce")).html(template.body);
		$("input.subject").val(template.subject);
	}
	function oc_mail(username,crimeID,cut) {
		return {
			subject:"PA Payout",
			body:`<p>Hello ${username},</p><p>The <a href="https://www.torn.com/factions.php?step=your#/tab=crimes&crimeID=${crimeID}" target="_blank">PA OC</a> (#${crimeID}) you participated in was a success. Your cut of $${cut.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")} has been credited to your faction bank account, and your total amount of cash can be withdrawn from your faction bank account by checking with a banker. Please do not forget to tell the banker how much you wish to withdraw from your total balance.</p>`
		}
	}
	function payout(username,crimeID,cut) {
		return {
			subject:"OC Payout",
			body:`<p>Hello ${username},</p><p>The <a href="https://www.torn.com/factions.php?step=your#/tab=crimes&crimeID=${crimeID}" target="_blank">Organized Crime</a> (#${crimeID}) you participated in was a success. Your cut of $${cut.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")} has been paid out to you.</p>`
		}
	}
	function bal_transfer(t_name,a_name,a_id,amount) {
		return {
			subject:"Faction Balance Transfer",
			body:`<p>Hello ${t_name},</p><p>The faction member <a href="https://www.torn.com/profiles.php?XID=${a_id}" target="_blank">${a_name}</a> has transferred $${amount.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")} to your faction bank account (from their faction bank account), and can be withdrawn from the faction by checking with a banker.</p>`
		}
	}
	function violation(t_name,amount) {
		return {
			subject:"OC \"Violations\"",
			body:`<p>Hello ${t_name},</p><p>You have accumulated ${parseInt(amount.replace(/\D/g,'')).toLocaleString("en-US")} violation point(s) with us. Points are gained for every minute that you are flying overseas (multiplied by the severity of the OC you are in) or for every minute you are afk for 24 hours. So by that logic, you have wasted ${Math.floor(parseInt(amount.replace(/\D/g,''))/24/60)} days w/ us. Do you think one of these scenarios applies to you?</p><p>Please reply to let me know your thoughts.</p>`
		}
	}
	window.addEventListener('popstate', mail);
})();
