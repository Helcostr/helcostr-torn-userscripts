// ==UserScript==
// @name         Shop Buy
// @version      0.1
// @description  Simplify Buying to 1 Click
// @author       Helcostr [1934501]
// @match        https://www.torn.com/shops.php*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	//Object Setup
	const lookup = {
		"step=pharmacy":{
			id:731,
			name:"Empty Blood Bag"
		},
		"step=bitsnbobs":{
			id:180,
			name:"Beer"
		}
	};
	const short = {
		"You have already purchased the maximum of 100 items today.":"Max Purchase",
		"There is not enough stock left to buy <b>100</b> of this item.":"Not 100 Stocked"
	}
	const look = val=>{
		let key = Object.keys(lookup).find(key=>location.search.search(key)!=-1);
		return lookup[key][val];
	}
	const buyBeer = function() {
		$.post("/shops.php?rfcv="+getCookie("rfc_v"),"step=buyShopItem&ID="+look("id")+"&amount=100",data=>$(this).text(look("name")+" "+(short[data.text]||data.text)),"json")
	};
	const myObj = $("<a/>",{
		class:"t-clear h c-pointer  m-icon line-h24 right last",
		css:{
			width:"auto"
		},
		text:"Buy "+look("name"),
		click:buyBeer
	});
	const init = ()=>{
		$("#top-page-links-list > a.last").removeClass("last")
		$("#top-page-links-list > div.links-footer").before(myObj);
	};

	//Functions
	const getCookie = name=>{
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    };

	const firstRun = ()=>{
		init();
	};

	firstRun();
})();
