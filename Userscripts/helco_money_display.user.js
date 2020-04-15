// ==UserScript==
// @name         Money Display
// @version      1.2
// @description  Display Live Cash Anywhere
// @author       Helcostr [1934501]
// @match        https://www.torn.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// ==/UserScript==

(function() {
	'use strict';
	//API Key Processing
	const getKey = ()=>GM_getValue("key","");
	const setKey = key=>GM_setValue("key",key);
	const updateKey = ()=>{
		let key = prompt("Money Display Script:\nPlease entery your API key", getKey());
		if (key === null)
			return;
		setKey(key);
		getCash();
	};

	//Object Setup
	const myObj = $("<a/>").attr("class","t-clear h c-pointer  m-icon line-h24 right last").css("width","auto").on('click',updateKey);
	const updateObj = cash=>intPretty(cash)!=="-"?myObj.text(`$${intPretty(cash)}`):myObj.text("(ノಠ益ಠ)ノ彡┻━┻");
	const init = ()=>{
		$("#top-page-links-list > a.last").removeClass("last")
		$("#top-page-links-list > div.links-footer").before(myObj);
	};

	//Pretty Numbers
	const intPretty = int=>{
		if (typeof int !== "number")
			int = parseFloat(int);
		console.log(int);
		if (isNaN(int))
			return "-";
		let neg = false;
		if (int < 0) {
			int *= -1;
			neg = true;
		}
		for (let i = 3; i>=0; i--) {
			let solve = int/Math.pow(10,i*3);
			if (Math.floor(solve)>0)
				return (neg?"-":"")+ solve.toFixed(1).toString() + ["","k","m","b"][i];
		}
		return 0;
	};

	//Get Cash via API
	const getCash = ()=>{
		updateObj(NaN);
		let key = getKey();
		if (key.length !== 16)
			return;
		GM_xmlhttpRequest({
			url:`https://api.torn.com/user/?key=${key}&selections=money`,
			onload:res=>{
				let data = JSON.parse(res.responseText);
				if ("money_onhand" in data)
					updateObj(data.money_onhand);
			}
		});
	};

	const firstRun = ()=>{
		init();
		getCash();
		unsafeWindow.commonCoreWebsocketHandler.addEventListener("sidebar","updateMoney",(t)=>updateObj(t.money));
		$(document).ajaxComplete((e,x,s)=>{
			if (x.responseText.includes("top-page-links-list")) init();
		});
	};

	firstRun();
})();
