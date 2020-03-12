// ==UserScript==
// @name         Historical API Loader
// @version      0.1
// @description  Provide IDs of any active entity (faction/player) to Helcostr's tracker
// @author       Helcostr [1934501]
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// ==/UserScript==

setTimeout(()=> {
    'use strict';
    const sendTo = load=>{
        console.log(load);
        return new Promise((res,rej)=>{
            const url = "https://script.google.com/macros/s/AKfycbyiBCWAdzkzTG5oZxOzE5ZFZCQPIb-uqvH0UYI32l2fqoDtjPI/exec";
            GM_xmlhttpRequest({
                method:"POST",
                data:JSON.stringify({
                    pwd:"@6m)E7ukFCQ*RTT8",
                    data:load
                }),
                onload:(r)=>{
                    try {
                        let data = JSON.parse(r.responseText);
                        res(data);
                    } catch (e) {
                        rej(e.toString() + "\n" + r.responseText);
                    }
                },
                ontimeout:(r)=>{
                    rej("Knock knock? Something slowed down (timeout error).\n" + r.responseText);
                },
                onerror:(r)=>{
                    rej("OUCH! ERROR!\n" + r.responseText);
                },
                onabort:(r)=>{
                    rej("Huh, you managed to quit my send (abort error).\n" + r.responseText);
                },
                url:url
            });
        });
    }
    let data = $('a[href*="factions.php?step=profile&ID="], a[href*="profiles.php?XID="]').get()
        .map(e=>[e.pathname[1],parseInt(/(\d+)/.exec(e.search)[1]),true])
        .filter((curr, index, thisArray) => thisArray.findIndex(each => each[0] == curr[0] && each[1] == curr[1]) === index);
    sendTo(data).then(console.log).catch(console.warn);
},10000);
