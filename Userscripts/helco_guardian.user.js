// ==UserScript==
// @name         Guardian
// @version      0.1
// @description  Silently watch stuff. (And Log to console, and add a button to quick attack)
// @author       Helcostr [1934501]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	const original_fetch = fetch;
	window.fetch = async (input, init) => {
		const response = await original_fetch(input, init);

		if (response.url.search(/loader.php\?sid=attackData/) != -1) {
			const clone = response.clone();
            /*
	    	let payload = {};
	        if (typeof init.body != 'undefined')
	        	payload = JSON.parse(init.body);
            */
			clone.json().then(json=>action(json));
		}
		return response;
	}
	function action(json,payload) {
        let hist = json.DB.currentFightHistory;
        let hits = json.hitsLog;
        if (hist) {
            console.log("Hist",hist);
        }
        if (hits) {
            console.log("Hits",hits);
        }
	}
	const myObj = $("<a/>").attr("class","t-clear h c-pointer  m-icon line-h24 right last").css("width","auto").text("Attack").on('click',()=>{
		attack(3);//Melee
	});
	function attack(item) {
		$.post("loader.php?sid=attackData&mode=json",{
			step: "attack",
			user2ID: window.location.search.substring(window.location.search.indexOf("user2ID")).substring(8),
			user1EquipedItemID: item
		});
	}
	const init = ()=>{
		$("h4").after(myObj);
	};
	init();
})();
