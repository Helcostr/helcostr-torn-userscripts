// ==UserScript==
// @name         Territory War Report
// @version      3.2.0
// @icon64       data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImUiIHgxPSIxODAzLjgiIHgyPSIxODAzLjgiIHkxPSIyMzY1LjYiIHkyPSIyNDc1LjQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIuMjk4MDQiIG9mZnNldD0iMCIvPgo8c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii4wOTgwMzkiIG9mZnNldD0iMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIxNzIwLjIiIHgyPSIxNzIwLjIiIHkxPSIyNDE3LjgiIHkyPSIyMzY1LjYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0JDQkVDMCIgb2Zmc2V0PSIwIi8+CjxzdG9wIHN0b3AtY29sb3I9IiNFNkU3RTgiIG9mZnNldD0iMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8ZyBpZD0iaiIgdHJhbnNmb3JtPSJtYXRyaXgoLjQ1NTggMCAwIC40NTU2OSAtNzcyLjE1IC0xMDc4KSI+CjxwYXRoIGQ9Im0xOTEzLjUgMjM3NS4ycTAtMy45NS0yLjgtNi44LTIuOC0yLjgtNi43NS0yLjhoLTE1Ny42NWwtMTguNjUgMzMuNTUtMzMuNTUgMTguN3YxNTcuNnEwIDQgMi44IDYuOCAyLjg1IDIuOCA2LjggMi44aDIwMC4yNXEzLjk1IDAgNi43NS0yLjggMi44LTIuODUgMi44LTYuOHYtMjAwLjI1eiIvPgo8L2c+CjxtYXNrIGlkPSJjIj4KPHBhdGggZD0ibTk4Ljc1IDEuMjVxLTEuMy0xLjI1LTMuMS0xLjI1aC03MS44NWwtOC41IDE1LjI1LTE1LjMgOC41NXY3MS44cTAgMS44NSAxLjMgMy4xIDEuMyAxLjMgMy4xIDEuM2g5MS4yNXExLjggMCAzLjEtMS4zIDEuMjUtMS4zIDEuMjUtMy4xdi05MS4yNXEwLTEuOC0xLjI1LTMuMXoiIGZpbGw9IiNmZmYiLz4KPC9tYXNrPgo8ZyBpZD0iZCIgdHJhbnNmb3JtPSJtYXRyaXgoLjQ1NTggMCAwIC40NTU2OSAtNzcyLjE1IC0xMDc4KSI+CjxwYXRoIGQ9Im0xOTEwLjcgMjM2OC40cS0yLjgtMi44LTYuNzUtMi44aC0xNTcuNjVsLTE4LjY1IDMzLjU1LTMzLjU1IDE4Ljd2NTcuNWgyMTkuNHYtMTAwLjE1cTAtMy45NS0yLjgtNi44eiIgZmlsbD0idXJsKCNlKSIvPgo8L2c+CjxnIGlkPSJoIiB0cmFuc2Zvcm09InNjYWxlKC40NTU4IC40NTU2OSkiPgo8cGF0aCBkPSJtMCA1Mi4yNXYzMS4xNWw4My4zNS04My40aC0zMS4xNWwtMjAuNiAzMS42NS0zMS42IDIwLjZ6IiBmaWxsLW9wYWNpdHk9Ii4yOTgwNCIvPgo8L2c+CjxnIGlkPSJnIiB0cmFuc2Zvcm09Im1hdHJpeCguNDU1OCAwIDAgLjQ1NTY5IC03NzIuMTUgLTEwNzgpIj4KPHBhdGggZD0ibTE3NDMuNSAyNDE1cTIuOC0yLjggMi44LTYuOHYtNDIuNjVsLTUyLjIgNTIuMjVoNDIuNjVxMy45NSAwIDYuNzUtMi44eiIgZmlsbD0idXJsKCNmKSIvPgo8L2c+CjxsaW5lYXJHcmFkaWVudCBpZD0iaSIgeDI9IjAiIHkyPSIxIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzgwODA4MCIgb2Zmc2V0PSIwIi8+CjxzdG9wIG9mZnNldD0iMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8ZyBpZD0iYiIgdHJhbnNmb3JtPSJzY2FsZSgzLjcwMzcpIHRyYW5zbGF0ZSgtMS41IC0xLjUpIj4KPHBhdGggZD0iTTI1LjUgMTAuNWgzdjRoLTN6bS0yMCAwaDl2NGgtOXptMTAgMGg5djRoLTl6bTUgNWg4djRoLTh6bS0xOSAwaDh2NGgtOHptOS0xMGg5djRoLTl6bTAgMTBoOXY0aC05em01IDVoOXY0aC05em0tMTEgMGgtM1YyNGMwIC4zLjIuNS41LjVoMi41di00em0xIDBoOXY0aC05em0yMCA0SDI4Yy4zIDAgLjUtLjIuNS0uNXYtMy41aC0zdjR6bS0xNi0xNXYtNEgyYy0uMyAwLS41LjItLjUuNXYzLjVoOHptLTggMWgzdjRoLTN6bTE5LTFoOFY2YzAtLjMtLjItLjUtLjUtLjVoLTcuNXY0eiIvPgo8L2c+CjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDI9IjAiIHkyPSIxIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgb2Zmc2V0PSIwIi8+CjxzdG9wIHN0b3AtY29sb3I9IiNlNWVmZjkiIG9mZnNldD0iMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjx1c2UgZmlsbD0idXJsKCNpKSIgeGxpbms6aHJlZj0iI2oiLz4KPGcgbWFzaz0idXJsKCNjKSI+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwIDUwKSBzY2FsZSguNikgdHJhbnNsYXRlKC01MCAtNTApIj4KPHVzZSBmaWxsPSJ1cmwoI2EpIiB4bGluazpocmVmPSIjYiIvPgo8L2c+CjwvZz4KPHVzZSB4bGluazpocmVmPSIjaCIvPgo8dXNlIHhsaW5rOmhyZWY9IiNnIi8+Cjx1c2UgeGxpbms6aHJlZj0iI2QiLz4KPC9zdmc+Cg==
// @description  Parse the Torn Territory War Report
// @supportURL   https://www.torn.com/messages.php?p=compose&XID=1934501
// @updateURL    https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/echo_ter_report.user.js
// @author       Helcostr [1934501]
// @run-at       document-end
// @match        https://www.torn.com/war.php?step=warreport*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      yata.alwaysdata.net
// ==/UserScript==

(function() {
    'use strict';
        // parse cookie
    const getCookie = (s)=>{
        let parse=RegExp(""+s+"[^;]+").exec(document.cookie);
        return decodeURIComponent(!!parse ? parse.toString().replace(/^[^=]+./,"") : "");
    };
    if (typeof $ != "function") {
        alert("JQuery Missing. This is a critical error.");
        return;
    }
    // Msgbox
    const msgbox = (msg)=>{
        $("#HCS_WarReport_Status").html(msg);
        $("#HCS_WarReport > div").removeClass("green red").addClass("blue");
    };

    // Response OK
    const valid = (msg)=>{
        msgbox("<b>" + msg +"</b>");
        $("#HCS_WarReport > div").removeClass("blue red").addClass("green");
    };

    // API Key
    const error_key = (msg,good)=>{
        let key = GM_getValue("key","");
        if (key == "") {
            key = "Insert API Key";
            msg = "No API Key stored";
            good = false;
        }
        if (good)
            msgbox("Here is your stored API key:");
        else
            msgbox("An error has occured: <b>"+msg+"</b>.<br>Please retype in your API key.");
        let input = $("<input id='api_key'>")
        if (good)
            input.val(key);
        else
            input.attr("placeholder",key);
        let button = $("<button>");
        button.text("Store");
        button.click(()=>{
            let key = $("#api_key").val();
            GM_setValue("key",key);
            if (!key_valid(key))
                return error_key("API Key is not the correct length.");
            msgbox("Your key has been stored. Ready to Submit.")
        });
        $("#HCS_WarReport_Status").append(input).append(button);
        if (good)
            $("#HCS_WarReport > div").removeClass("red green").addClass("blue");
        else
            $("#HCS_WarReport > div").removeClass("blue green").addClass("red");
    }
    const key_valid = (key)=>{
        return key.length == 16;
    };

    // Response Error
    const error = (msg)=>{
        msgbox("An error has occured: <b>" +msg+"</b>.<br>Please contact <a href='https://www.torn.com/profiles.php?XID=1934501'>Helcostr [1934501]</a> if you need help with this error message.");
        $("#HCS_WarReport > div").removeClass("blue green").addClass("red");
    };

    // Startup function
    const startup = ()=>{
        //Display box
        let infobox = '<div id="HCS_WarReport"><div class="info-msg-cont blue border-round m-top10 r2895"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p id="HCS_WarReport_Buttons"><a href="https://yata.alwaysdata.net/" target="_blank" style="float:right; margin-right: 5px; margin-top: 8px; font-weight: bold;">YATA</a></p><p id="HCS_WarReport_Status" style="margin-top: 10px;"></p></div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10 r2895"></div>';
        $(".content-title").after(infobox);

        //Set up buttons
        const buttonSetup = (text,cb)=>{
            let button = $('<button style="margin-right: 5px">');
            button.text(text);
            button.click(cb);
            $("#HCS_WarReport_Buttons").append(button);
        };
        buttonSetup("Copy To Clipboard",()=>{
            let report = genReport();
            GM_setClipboard(report.map(e => e.join("\t")).join("\n"), "text");
        });
        buttonSetup("Export As CSV",()=>{
            let report = genReport();

            //Convert to CSV String
            let csvContent = "data:text/csv;charset=utf-8," + report.map(e => e.join(",")).join("\n");
            saveFile(csvContent, $(".title-black").text()+".csv");
        });
        buttonSetup("Export As JSON",()=>{
            let report = createJSON();

            //Convert to JSON String
            let jsonContent = "data:text/json;charset=utf-8," + JSON.stringify(report);
            saveFile(jsonContent,$(".title-black").text()+".json");
        });
        buttonSetup("Export To YATA",sendJSON);
        buttonSetup("API Storage",()=>{error_key("",true)});
    };

    // Generate Report
    const genReport = ()=>{
        let report = []; //Prepare 2D array
        let focus = $(".enemy-faction,.your-faction"); //Grab both tables

        //Clone logic for result determination
        let resText = $(".faction-war-info").find("span.t-block > .text > a").parent().text();
        let result;
        if (resText.search("failed") != -1 || resText.search("truce") != -1)
            result = false;
        else if (resText.search("claimed") != -1)
            result = true;

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
                row.push($(f).hasClass('your-faction') == result ?"Attacker":"Defender"); //Determine if the user is att or def

                $(e).find("div:not(.clear)").each((i,e)=>{
                    let focus = $(e);

                    if (focus.hasClass("member")) {//Player info (name, xid)
                        focus = focus.find("a.name");
                        let name = focus.data("placeholder");

                        if (typeof name == "undefined") { //Parser for plaintext
                            row.push(focus.text());
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
        return report;
    };

    const createJSON = ()=>{
        let players = [];
        let gen = genReport();
        let head = gen.shift();
        let focus = $(".faction-war-info");
        let links = focus.find("span.t-block > .text > a");
        let lazy = "(\\d{2})-(\\d{2})-(\\d{4}) (\\d{2}):(\\d{2}):(\\d{2})";
        let ts = (new RegExp(lazy+" to "+lazy)).exec(focus.find("span.t-block:eq(1)").text().trim());
        let resText = links.parent().text();
        let result;
        if (resText.search("failed") != -1)
            result = -1;
        else if (resText.search("claimed") != -1)
            result = 1;
        else if (resText.search("truce") != -1)
            result = 0;
        let report = {
            author:parseInt(getCookie("uid")),
            id:parseInt(/(\d+)/.exec($(".title-black").text())[1]),
            att_fac:parseInt(/ID=(\d+)/.exec(links.eq(0).attr("href"))[1]),
            att_fac_name:links.eq(0).text(),
            def_fac:parseInt(/ID=(\d+)/.exec(links.eq(1).attr("href"))[1]),
            def_fac_name:links.eq(1).text(),
            result:result,
            terr:links.eq(2).text(),
            ts_start:Date.UTC(ts[3], ts[1]-1, ts[2], ts[4], ts[5], ts[6]) / 1000,
            ts_end:Date.UTC(ts[3+6], ts[1+6]-1, ts[2+6], ts[4+6], ts[5+6], ts[6+6]) / 1000,
            participants:gen.map(e=>{
                let obj = {};
                head.forEach((f,i)=>{
                    obj[f] = e[i];
                });
                return obj;
            })
        };
        return report;
    };

    // Send to server
    const sendJSON = ()=>{
        msgbox();
        let report = createJSON();
        let key = GM_getValue("key","");
        if (key.length != 16) {
            error_key("Please insert your API key");
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://yata.alwaysdata.net/chain/importWall/",
            data: JSON.stringify(report),
            headers: {
                "key":key
            },
            onload: resp=> {
                try {
                    let obj = JSON.parse(resp.responseText);
                    if ("message" in obj) {
                        if ("type" in obj && obj.type>0)
                            valid(obj.message);
                        else if (obj.type == -1) {
                            switch(obj.message.apiErrorCode) {
                                case 1:
                                case 2:
                                case 10:
                                    error_key(obj.message.apiError);
                                    break;
                                default:
                                    error(obj.message.apiError);
                            }
                        } else
                            error(obj.message);
                    } else if (obj.status == 200)
                        error("Everything seems to be ok???");
                    else
                        error("No message received from the server");
                } catch (e) {
                    error("Failed to parse response from server");
                }
            },
            ontimeout: ()=>{
                error("Request has timed out");
            },
            onerror: ()=>{
                error("Unknown error has occured when trying to send the data");
            },
            onabort: ()=>{
                error("Upon sending the data, the request was canceled");
            }
        });
    };
    const saveFile = (content,filename)=>{
        let encodedUri = encodeURI(content); //Encode as URI
        let link = document.createElement("a"); //Create DL link
        link.setAttribute("href", encodedUri); //Set data
        link.setAttribute("style", "display:none"); //Don't show
        link.setAttribute("download", filename); //Set the filename to download as
        document.body.appendChild(link); //Embed (for FF)
        link.click(); //Open DL Link
        document.body.removeChild(link); //Cleanup
    };
    startup();
})();
