// ==UserScript==
// @name         Torn Poker Mute
// @version      0.2
// @description  Mute the poker table on certain conditions
// @author       Helcostr [1934501]
// @match        https://www.torn.com/loader.php?sid=holdem
// @@updateURL   https://github.com/Helcostr/helcostr-torn-userscripts/edit/master/Userscripts/helco_torn_poker_mute.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	//const MUTED = "M14.72,5.69c-1.47-3.48-3.84-6.13-5-5.63C8.18.67,9.53,3,6.43,5.83L3,0H2L5.76,6.39A20.4,20.4,0,0,1,.89,9.06C0,9.42-.19,10.85.17,11.7s1.54,1.7,2.4,1.35c.15-.07.7-.25.7-.25.62.85,1.26.35,1.49.88l1.08,2.51c.2.48.67.92,1,.79l1.91-.74a.64.64,0,0,0,.4-.87c-.14-.34-.73-.44-.9-.83s-.71-1.64-.87-2,.24-1,.9-1l.44,0L12,17h1L9.71,11.42c3.33.18,4.16,2.34,5.53,1.78C16.44,12.7,16.19,9.17,14.72,5.69Zm-.51,5.65c-.27.11-2.06-1.33-3.21-4S10,2.13,10.27,2s2,1.62,3.16,4.33S14.47,11.23,14.21,11.34Z";
	const UNMUTED = "M14.72,5.69c-1.47-3.48-3.84-6.13-5-5.63-2,.84,1.21,4.88-8.79,9C0,9.42-.19,10.85.17,11.7s1.54,1.7,2.4,1.35c.15-.07.7-.25.7-.25.62.85,1.26.35,1.49.88s.88,2,1.08,2.51.67.92,1,.79l1.91-.74a.64.64,0,0,0,.4-.87c-.14-.34-.73-.44-.9-.83s-.71-1.64-.87-2,.24-1,.9-1c4.56-.48,5.41,2.38,7,1.74C16.44,12.7,16.19,9.17,14.72,5.69Zm-.51,5.65c-.27.11-2.06-1.33-3.21-4S10,2.13,10.27,2s2,1.62,3.16,4.33S14.47,11.23,14.21,11.34Z";
	const playerMute = ()=>$("[class^=playerMe]").find("[class^=state] span").get().filter(e=>["Waiting BB","Folded","Sitting out"].includes(e.innerText)).length > 0;
	const isMuted = ()=>$(".toggleSound path:last").attr("d") !== UNMUTED;
	const check = ()=>{
		if (playerMute() && !isMuted())
			$(".toggleSound span:first").click();
		else if (!playerMute() && isMuted())
			$(".toggleSound span:first").click();
	};
	const observer = new MutationObserver(check);
	observer.observe(document.querySelector("main"), { childList: true, subtree: true});

})();
