// ==UserScript==
// @name         Torn Banker Listener
// @version      0.4
// @description  Audio notification for mentions of banker in Faction chat
// @author       Helcostr [1934501]
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* eslint-disable no-proto */
/* eslint-disable accessor-pairs */
/* eslint-disable no-global-assign */

/* wsHook.js
 * https://github.com/skepticfx/wshook
 * Reference: http://www.w3.org/TR/2011/WD-websockets-20110419/#websocket
 * Minified for compactness
 */
let wsHook={};!function(){function e(e){this.bubbles=e.bubbles||!1,this.cancelBubble=e.cancelBubble||!1,this.cancelable=e.cancelable||!1,this.currentTarget=e.currentTarget||null,this.data=e.data||null,this.defaultPrevented=e.defaultPrevented||!1,this.eventPhase=e.eventPhase||0,this.lastEventId=e.lastEventId||"",this.origin=e.origin||"",this.path=e.path||new Array(0),this.ports=e.parts||new Array(0),this.returnValue=e.returnValue||!0,this.source=e.source||null,this.srcElement=e.srcElement||null,this.target=e.target||null,this.timeStamp=e.timeStamp||null,this.type=e.type||"message",this.__proto__=e.__proto__||MessageEvent.__proto__}var t=wsHook.before=function(e,t,n){return e},n=wsHook.after=function(e,t,n){return e},s=wsHook.modifyUrl=function(e){return e};wsHook.resetHooks=function(){wsHook.before=t,wsHook.after=n,wsHook.modifyUrl=s};var r=WebSocket;WebSocket=function(t,n){var s;t=wsHook.modifyUrl(t)||t,this.url=t,this.protocols=n;var o=(s=this.protocols?new r(t,n):new r(t)).send;return s.send=function(e){arguments[0]=wsHook.before(e,s.url,s)||e,o.apply(this,arguments)},s._addEventListener=s.addEventListener,s.addEventListener=function(){var t,n=this;return"message"===arguments[0]&&(arguments[1]=(t=arguments[1],function(){arguments[0]=wsHook.after(new e(arguments[0]),s.url,s),null!==arguments[0]&&t.apply(n,arguments)})),s._addEventListener.apply(this,arguments)},Object.defineProperty(s,"onmessage",{set:function(){var t=this,n=arguments[0];s._addEventListener.apply(this,["message",function(){arguments[0]=wsHook.after(new e(arguments[0]),s.url,s),null!==arguments[0]&&n.apply(t,arguments)},!1])}}),s}}();
let keywords = ["banker",
				"lipsum"];//Add your own words!
wsHook.after = function(event, url, wsObject) {
	if (url.includes("ws-chat.torn.com")) {
		let jsonObject = JSON.parse(event.data);
		try {
			jsonObject.data.forEach(e=> {
				if ('roomId' in e && e.roomId.includes('Faction:') && 'messageText' in e && keywords.some(word=>e.messageText.toLowerCase().includes(word)) ) {
					speak(e.senderName + " typed. " + e.messageText,"helco_bank_watcher");//Current sentence: "Sender typed: insert_message_here"
					//speak(e.messageText.match(new RegExp('('+keywords.join('|')+')', 'i'))[1],"helco_bank_watcher")//Key word msg
				}
			});
		} catch (err) {
			console.error(err);
			console.error("OBJ:",jsonObject);
			return event;
		}
	}
	return event;
}
function speak(text,overlap_key) {
	let time = localStorage.getItem(overlap_key);
	if (time == null || parseInt(time)+2500<Date.now()) {
		let msg = new SpeechSynthesisUtterance();
		let voices = window.speechSynthesis.getVoices();
		msg.voice = voices[0]; // Note: some voices don't support altering params
		msg.voiceURI = 'native';
		msg.volume = 1; // 0 to 1
		msg.rate = 1.5; // 0.1 to 10
		msg.pitch = 1; //0 to 2

		msg.lang = 'en-US';
		msg.text = text;
		speechSynthesis.speak(msg);
		localStorage.setItem(overlap_key,(new Date).getTime());
	}
}
