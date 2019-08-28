// ==UserScript==
// @name         Territory War Report
// @version      1.0
// @description  Parse the Torn Territory War Report into a CSV File
// @supportURL   https://www.torn.com/messages.php#/p=compose&XID=1934501
// @updateURL    https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/echo_ter_report.user.js
// @author       Helcostr [1934501]
// @match        https://www.torn.com/war.php?step=warreport*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (typeof $ != "function") {
        alert("JQuery Missing. This is a critical error");
        return;
    }

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer)=>{
        let focus = $(".content-title");
        if (focus.length > 0) {
            observer.disconnect();
            let infobox = '<div id="HCS_WarReport"><div class="info-msg-cont green border-round m-top10 r2895"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p id="HCS_WarReport_Status"></p></div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10 r2895"></div>';
            focus.after(infobox);
            let button = $("<button>");
            button.text("Export As CSV");
            button.click(exportReport);
            $("#HCS_WarReport_Status").html(button);
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the whole document for mutations
    observer.observe(document, config);

    // Actual Logic for Export Report
    const exportReport = ()=>{
        let report = []; //Prepare 2D array
        let focus = $(".enemy-faction,.your-faction"); //Grab both tables

        //Header row
        let row = [];
        focus.first().find("div > div > div:not(.clear,.short)").each((i,e)=>{
            let focus = $(e).text();
            if (focus=="Members") {
                row.push("Position");
                row.push("Name");
                row.push("XID");
            } else
                row.push(focus);
        });
        report.push(row);

        //For Each Table (Both the att and def table)
        focus.each((i,f)=>{
            //For each Player
            $(f).find("div > ul.members-list > li").each((i,e)=>{
                let row = [];
                row.push($(f).hasClass('your-faction')?"Defender":"Attacker"); //Determine if the user is att or def

                $(e).find("div:not(.clear)").each((i,e)=>{
                    let focus = $(e);

                    if (focus.hasClass("member")) {//Player info (name, xid)
                        focus = focus.find("a.name");
                        let name = focus.data("placeholder");

                        if (typeof name == "undefined") { //Parser for plaintext
                            row.push(`="${focus.text()}"`);
                            row.push(parseInt(/XID=(\d+)/.exec(focus.attr("href"))[1]));
                        } else { //Parser for honor bar
                            let reg = /(\S+)\s\[(\d+)\]/.exec(name);
                            row.push(`="${reg[1]}"`);
                            row.push(parseInt(reg[2]));
                        }
                    } else //All other data (should be numbers)
                        row.push(parseInt(focus.text().replace(/\D/g,'')));
                });
                report.push(row);
            });
        });
        //Convert to CSV String
        let csvContent = "data:text/csv;charset=utf-8," + report.map(e => e.join(",")).join("\n");
        let encodedUri = encodeURI(csvContent); //Encode as URI
        let link = document.createElement("a"); //Create DL link
        link.setAttribute("href", encodedUri); //Set data
        link.setAttribute("style", "display:none"); //Don't show
        link.setAttribute("download", $(".title-black").text()+".csv"); //Set the filename to download as
        document.body.appendChild(link); //Embed (for FF)
        link.click(); //Open DL Link
    }
})();
