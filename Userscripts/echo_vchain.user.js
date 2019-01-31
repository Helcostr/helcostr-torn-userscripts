// ==UserScript==
// @name         Torn Vocal Chainerz
// @version      0.3
// @description  Speak up when 1 minute is left on the Torn Chain
// @author       Helcostr
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at      document-start
// @updateURL   https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/echo_vchain.user.js
// ==/UserScript==
(function() {
    'use strict';

    const original_fetch = fetch;
    let warning = false;
    window.fetch = async (input, init) => {
        const response = await original_fetch(input, init);
        if (response.url.search('faction_wars.php') != -1) {
            if (response.url.search('step=getwardata') != -1) {
                const clone = response.clone();
                let payload = typeof init.body != 'undefined' ? JSON.parse(init.body) : {};

                clone.json().then((response) => {
                    if (response.wars[0].data.chain.factionID == 8500) {
                        var seconds = response.wars[0].data.chainBar.end;
                        if (seconds < 70) {
                            warning = true;
                            speak(secToTime(seconds));
                        } else if (warning) {
                            warning = false;
                            speak('Hit Confirmed');
                        }

                    }
                });
            }
        }
        return response;
    }

    function speak(text) {
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[0]; // Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 1.5; // 0.1 to 10
        msg.pitch = 1; //0 to 2

        msg.lang = 'en-US';
        msg.text = text;

        speechSynthesis.speak(msg);
    }

    function secToTime(duration) {
        var seconds = parseInt((duration) % 60),
            minutes = parseInt((duration / (60)) % 60),
            hours = parseInt((duration / (60 * 60)) % 24);

        return (hours != 0 ? hours + ' hours ' : '') + (minutes != 0 ? minutes + ' minutes ' : '') + (seconds != 0 ? seconds : '');
    }
})();
