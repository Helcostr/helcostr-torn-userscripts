// ==UserScript==
// @name         Mission Assist
// @version      1.1
// @description  Give user generated hints for Missions
// @supportURL   https://www.torn.com/messages.php#/p=compose&XID=1934501
// @updateURL    https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/echo_mission_assist.user.js
// @author       Helcostr [1934501]
// @match        https://www.torn.com/loader.php?sid=missions
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    //FUNCTIONS AWAY FROM THE MAIN BODY OF THE CODE

    //Hint Function
    function hint(observer,known) {
        $("#missionsMainContainer > .giver-cont-wrap > div[id^=mission]").each((i,e)=>{
            let titObj = $(e).find(".title-black").clone();
            titObj.find(".task-difficulty").remove();
            let reduct = known.filter(e=>e[0]==titObj.text().trim());
            if (reduct.length != 0) {
                $(e).find(".perfect-scrollbar-content").append("<span class='hint'><br><br><b>Task:</b> "+ reduct[0][1] + "<br><br><b>Hint:</b> " + reduct[0][2] +"</span>");
            }
        });
        observer.observe(targetNode, config);
    }
    //JQuery Replace Link With (p) text.
    function linkStrip(e) {
        let focus = $(e).clone();
        focus.find("a").text("(P)");
        return focus.text().trim();
    }

    //Outputs visual error
    function error(text) {
		console.log("There has been an error: " + text);
	}
    //Source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    //MAIN BODY OF CODE!!!!
    const key = "HCS_MissAssHash";
    if (typeof $ != "function") {
        error("JQuery Missing. This is a critical error");
        return;
    }
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('missionsMainContainer');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
        observer.disconnect();
        observer.takeRecords();
        let focus = $("#missionsMainContainer > .giver-cont-wrap > div[id^=mission]");
        let load = [];
        focus.each((i,e)=>{
            let titObj = $(e).find(".title-black").clone();
            let diff = titObj.find(".task-difficulty").remove();
            let tasks = $(e).find("ul.tasks-list > li").toArray().map((e,i)=> (i+1)+". " + linkStrip(e));
            let id = $(e).find("input[name=missionID]").attr("value");
            let flavor = linkStrip($(e).find(".perfect-scrollbar-content"));
            let status = $(e).find(".mission-stamp").attr("class");
            if ($(e).find(".perfect-scrollbar-content .hint").length == 0)
                load.push({
                    "User":parseInt(/XID=(\d+)/.exec($("[class^=menu-name]").next().attr("href"))[1]),
                    "Mission Name": titObj.text().trim(),
                    "Difficulty": diff.text().trim(),
                    "Requirements": tasks.join("\n"),
                    "ID": id,
                    "Status":status?status.replace('mission-stamp','').trim():"intro",
                    "Flavor":flavor
                });
        });
        let stor = window.localStorage;
        let test = stor.getItem(key);
        if (test==null)
            sendTo(load).then(e=>{
                if (e.success) {
                    hint(observer,e.known);
                    stor.setItem(key,JSON.stringify(e.completed));
                } else {
                    error(e);
                }
            }).catch(e=>{
                error(e);
            });
        else if (load.length > 0)
            sendTo(load).then(e=>{
                if (e.success) {
                    hint(observer,e.known);
                    stor.setItem(key,JSON.stringify(test.concat(e.completed).filter((e,i,s)=>s.indexOf(e) === i)));
                } else {
                    error(e);
                }
            }).catch(e=>{
                error(e);
            });
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the whole document for mutations
    observer.observe(targetNode, config);

    const sendTo = load=>{
        return new Promise((res,rej)=>{
            const url = "https://script.google.com/macros/s/AKfycbzWwniOcp8M1q-3xMhIym-KAw3gJqHSvuObGDkAeHUPbzcTOyg/exec";
            GM_xmlhttpRequest({
                method:"POST",
                data:JSON.stringify({
                    pwd:"k4S%_'.aSYm3`5w*",
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
    callback(null,observer);
})();
