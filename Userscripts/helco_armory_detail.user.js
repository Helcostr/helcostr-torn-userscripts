// ==UserScript==
// @name         Proxima's Armory Detailed
// @version      0.3
// @description  Highlight weapons that is missing details (to be sent to Sulsay's database via his ArsonWarehouse addon) BETA
// @author       Helcostr [1934501]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      arsonwarehouse.com
// ==/UserScript==

(function() {
    'use strict';

	/*
    const mutationEach = e=>{
		if (e.nodeName !== "#text" && e.hasAttribute('data-armoryid'))
			GM_xmlhttpRequest({
				url:"https://arsonwarehouse.com/api/v1/armouries/" + e.getAttribute("data-armoryid"),
				onload:xhr=>{
					let data = JSON.parse(xhr.responseText);
					if ("reason" in data && data.reason == "HTTP 404")
						$(e).css({backgroundColor: "rgba(229, 76, 25, 0.10)"})
				}
			});
    }*/
	///api/v1/armouries?ids=3733993,12737659,1550027047
	const lookup = list=>{
		let chunk = 100;
		for (let i=0; i<list.length; i+=chunk) {
			let focus = list.slice(i,i+chunk);
			if (focus.length > 0)
				GM_xmlhttpRequest({
					url:"https://arsonwarehouse.com/api/v1/armouries?ids="+focus.join(","),
					onload:xhr=>{
						let data = JSON.parse(xhr.responseText);
						focus.forEach(id=>{
							if (data.findIndex(e=>e.armoury_id==id) == -1) {
								$('[data-armoryid='+id+'],[data-armoury='+id+']').css({backgroundColor: "rgba(229, 76, 25, 1)"}).on('click',function(){
									$(this).css({backgroundColor:""});
								});
								$('[armouryid='+id+']').parent().css({backgroundColor: "rgba(229, 76, 25, 1)"}).on('click',function(){
									$(this).css({backgroundColor:""});
								});
							}
						});
					}
				});
		}
	};
    const observer = new MutationObserver(list=>{
		let accum = list.map(mutation=>Array.prototype.filter.call(mutation.addedNodes,e=>!e.nodeName.startsWith("#") && (e.hasAttribute('data-armoryid') || $(e).find('[data-armoury]').length>0 || $(e).find('[armouryid]').length>0)).map(e=>e.hasAttribute("data-armoryid")?[e.getAttribute("data-armoryid")]:$(e).find('[data-armoury],[armouryid]').get().map(e=>e.getAttribute('data-armoury')||e.getAttribute('armouryid'))));
		let search = [].concat(...([].concat(...accum))).filter((e,i,a)=>i===a.indexOf(e) && e != 0);
		if (search.length > 0)
			lookup(search);
    });
	observer.observe(document, { childList: true, subtree: true});
	/*
	let total = [];
	let oFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (input, init) => {
        const response = await oFetch(input, init);
        if (response.url.includes("bazaar.php?sid=bazaarData&step=getBazaarItems")) {
            const clone = response.clone();
            let payload = typeof init.body != 'undefined' ? JSON.parse(init.body) : {};
            clone.json().then(data => {
				let start = data.start;
				let focus = data.list.map(e=>e.armoryID).filter(e=>e!=0);
				if (focus.length > 0)
					GM_xmlhttpRequest({
						url:"https://arsonwarehouse.com/api/v1/armouries?ids="+focus.join(","),
						onload:xhr=>{
							let sulsay = JSON.parse(xhr.responseText);
							console.log(sulsay);
							focus.forEach(id=>{
								if (sulsay.findIndex(e=>e.armoury_id==id) == -1) {
									total.push(data.list.findIndex(e=>e.armoryID==id)+start);
								}
								total.forEach((e,i)=>{
									$("[class^=React] [class^='item_']").eq(e).css({backgroundColor: "rgba(229, 76, 25, 0.10)"}).on('click',function(){
										$(this).css({backgroundColor:""});
										total.splice(i,1);
									});
								})
							});
						}
					});
			});
        }
        return response;
    };*/
})();
