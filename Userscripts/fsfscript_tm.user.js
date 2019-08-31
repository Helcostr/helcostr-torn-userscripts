// ==UserScript==
// @name         Faction Steadfast Tracker (Tampermonkey)
// @author       Helcostr [1934501]
// @version      2.1
// @description  Track steadfast changes for the good of the faction
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(()=>{
    'use strict';
    function successParse(r) {
		try {
			let reply = JSON.parse(r.responseText);
			if (reply.success)
				$("#FSFStatus").text("Update successful");
			else
				if (reply.error == 'password')
					$("#FSFStatus").html($("<span>Unknown password. <input type='text' id='pwdin'></span>").append($("<button title='Save Password'>Save Password</button>").click(()=>{
						GM_setValue("pwd",$("#pwdin").val());
						$("#FSFStatus").text("Password saved. Ready to update");
					})));
		} catch (err) {
			$("#FSFStatus").text("Unknown error code. Spitting to console.");
			console.error(r.responseText);
		}
	}
	var infobox = '<div id="fsteadfast"><div class="info-msg-cont green border-round m-top10 r2895"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p><strong>Strength</strong>: <span id="FSFStrength">Not Loaded</span></p><p><strong>Defense</strong>: <span id="FSFDefense">Not Loaded</span></p><p><strong>Speed</strong>: <span id="FSFSpeed">Not Loaded</span></p><p><strong>Dexterity</strong>: <span id="FSFDexterity">Not Loaded</span></p><div class="btn-wrap silver" id="FSFExport"><div class="btn"><span style="padding:10px">Send To Server</span></div></div><p id="FSFStatus"></p></div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10 r2895"></div>';
	var log = {};

	$("#factions").before(infobox);
	$(document).ajaxComplete((event,xhr,settings)=>{
		if (settings.url.search("factions.php") != -1) {
			if ($(".contributions-list").length !== 0) {
				$(".contributions-list > li").each((i,e)=>{
					var member = true;
					if($(e).hasClass("ex-member")) {
						member = false;
					}
					var user = $(e).find(".player").html().match(/<a href="\/profiles\.php\?XID=(\d+)">(.+)<\/a>/);
					if ($.isEmptyObject(log[user[1]]))
						log[user[1]] = {uid:user[1],username:user[2],member:member,stats:{}};
					var type = $("#stu-confirmation .name").text().split(" ")[0];
					log[user[1]].stats[type] = $(e).find(".contribution").text().trim().replace("(","").replace(")","").replace(",","");
					var time = $("div.date").text().replace(/\r?\n|\r/g," ").replace(/\s+/g,' ').trim();
					$("#FSF"+type).text("Logged " + time);
					$("#FSFStatus").text("I just recorded " + type + " at this time: " + time);
				});
			}
		}
	});
	$("#FSFExport").click(()=>{
		if ($("#FSFStrength").text() == "Not Loaded" || $("#FSFSpeed").text() == "Not Loaded" || $("#FSFDefense").text() == "Not Loaded" || $("#FSFDexterity").text() == "Not Loaded") {
			$("#FSFStatus").text("No, no, no! At this state, I refuse to export your data. Please make sure all four categories are exported. Please open steadfast branch and open either Str, Spd, Def, or Dex (any level will work)");
		} else {
			$("#FSFStatus").text("[BEEP] SENDING AND PROCESSING CODE (takes about 2 seconds to process)");
			for(var user in log) {
				var total = 0;
				for (var stat in log[user].stats) {
					total+=parseInt(log[user].stats[stat]);
				}
				log[user].stats.total = total;
			}
			console.log(log);
			var log_sorted = [];
			Object.keys(log).sort((a,b)=>{return log[b].stats.total - log[a].stats.total;}).forEach((e)=>{
				log_sorted.push(log[e]);
			});
			var greatOutput = [];
			log_sorted.forEach((item)=>{
				let output = [];
				output.push(`=hyperlink("https://www.torn.com/profiles.php?XID=${item.uid}","${item.username}")`);

				if (item.stats.Strength === undefined)
					output.push("0");
				else
					output.push(item.stats.Strength);
				if (item.stats.Defense === undefined)
					output.push("0");
				else
					output.push(item.stats.Defense);
				if (item.stats.Speed === undefined)
					output.push("0");
				else
					output.push(item.stats.Speed);
				if (item.stats.Dexterity === undefined)
					output.push("0");
				else
					output.push(item.stats.Dexterity);
				output.push(item.stats.total);
				output.push(item.member);
				greatOutput.push(output);
			});

			GM_xmlhttpRequest({
				method:"POST",
				data:JSON.stringify({
					pwd:GM_getValue("pwd","password"),
					data:greatOutput
				}),
				onload:(r)=>{
					successParse(r);
				},
				ontimeout:(r)=>{
					$("#FSFStatus").text("Knock knock? Something slowed down (timeout error).\n" + r.responseText);
				},
				onerror:(r)=>{
					$("#FSFStatus").text("OUCH! ERROR!\n" + r.responseText);
				},
				onabort:(r)=>{
					$("#FSFStatus").text("Huh, you managed to quit my send (abort error).\n" + r.responseText);
				},
				url:"https://script.google.com/macros/s/AKfycbx_TQ1g5NoETZUMMNntGXMhtEmWSuFvBJtEVoPRapJTOCLNF5mf/exec"
			});

		}
	});
	console.log("Running FSF -Helcostr");
})();