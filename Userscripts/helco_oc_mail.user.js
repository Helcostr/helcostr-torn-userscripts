// ==UserScript==
// @name         Torn OC Mail Template
// @version      0.2
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

	// Start observing the target node for configured mutations
	observer.observe(document, {childList: true, subtree: true});
	// Callback function to execute when mutations are observed
	function callback(mutationsList, observer) {
		// Use traditional 'for loops' for IE 11
		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(e=>{
					if (e.id == "mailcompose_ifr") {//MAIL DETECTION
						mail();
					} else if ('classList' in e && e.classList.contains("crime-result") && e.dataset.crime == 8) {
						let amt = parseInt($(".make-wrap p:contains(made)").text().replace(/[^\d]/g,""));
						let crimeID = getUrlVars().crimeID;
						$(".t-blue-cont b:contains(Participants: ) a").each((i,e)=>{
							let user = getUrlVars($(e).attr("href"));
							let percent = (i==0)?.3:.2;
							$(e).attr("href",`messages.php#/p=compose&XID=${user.XID}&username=${$(e).text()}&cut=${percent*amt}&crimeID=${crimeID}&template=oc_mail`);
						});
					}
				});
			}
		}
	}

	function getUrlVars(url = window.location.href) {
		let vars = {};
		let parts = url.matchAll(/(&|#\/|\?)+([^=&]+)=([^&]*)/gi);
		for (const [m,t,key,value] of parts) {
			vars[key] = value;
		}
		return vars;
	}
	function mail() {
		let template = null;
		switch (urlParam.template) {
			case "oc_mail":
				template = oc_mail(urlParam.username,urlParam.crime_id,urlParam.cut)
		}
		if (template === null)
			return
		$(document.getElementById("mailcompose_ifr").contentDocument.getElementById("tinymce")).html(template.body);
		$("input.subject").val(template.subject);
	}
	function oc_mail(username,crimeID,cut) {
		return {
			subject:"PA Payout",
			body:`<p>Hello ${username},</p><p>The <a href="https://www.torn.com/factions.php?step=your#/tab=crimes&crimeID=${crimeID}" target="_blank">PA OC</a> you participated in was a success. Your cut of $${cut.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")} has been credited to your faction bank account, and can be withdrawn from the faction by checking with a banker.</p>`
		}
	}
	window.addEventListener('popstate', mail);
})();
