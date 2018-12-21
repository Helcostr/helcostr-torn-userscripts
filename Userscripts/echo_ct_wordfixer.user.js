// ==UserScript==
// @name        Word Fixer Assist
// @description Pull up solutions to the word fixer game. (102 Unique Words)
// @match       https://www.torn.com/christmas_town.php
// @author      echoblast53 [1934501], Ahab [1735214]
// @version     1.6.0
// @updateURL   https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/echo_ct_wordfixer.user.js
// @grant       none
// @require     https://script.google.com/macros/s/AKfycbzwjAoCVLTO43eL-WXHToLLdE4zdFF7DkXfdEBE6X-ZledsobyV/exec?script
// @run-at      document-start
// ==/UserScript==
const original_fetch = fetch;
const sleepText = '<font color="gray">Awaiting Word...</font>';
const contact = 'https://www.torn.com/forums.php#/p=threads&f=67&t=16073974&b=0&a=0'
let gameStart = false;
console.log(library);

window.fetch = async (input, init) => {
    const response = await original_fetch(input, init);
    if (response.url.search('christmas_town.php?') != -1) {
        const clone = response.clone();
        if (response.url.search('q=miniGameAction') != -1)
            clone.json().then(miniGameAction);
        else if (gameStart)
            closeGame();
    }
    return response;
}

function miniGameAction(json) {
    /*Patch job, replace later*/
    if (json.miniGameType == "WordFixer") {
        updateGame(gameLogic(json.progress.word));
        openGame();
    }
    if(gameStart == true) {
        if (json.finished)
            updateGame('<font color="gray">What was my purpose?... Oh my god.</font>');
        else if (typeof json.message != "undefined")
            updateGame(`<font color="gray">I hope you enjoy my existance. Leave a <a href="${contact}">comment</a> if you feel like it.</font>`);
        else if (json.success) {
            updateGame(sleepText);
            setTimeout(()=>{
                updateGame(gameLogic(json.progress.word));
            },5000);
        }
    }
};

function openGame() {
    gameStart = true;
    $("#christmastownroot").after(`
        <div class="m-top10 m-bottom10" id="wordFixSolve" style="width:324px; float: left; text-transform: capitalize; padding: 7px 0px;">
            <div aria-level="5" class="title-red top-round" role="heading">
                <i class="ct-christmastown-icon">
                </i>
                <span>
                    Word Fixer Solution
                </span>
            </div>
            <div class="bottom-round cont-gray p10" id="wordFixSolution">
                ${sleepText}
            </div>
        </div>
    `);
}
function updateGame(text) {
    $("#wordFixSolution").html(text);
}
function closeGame() {
    gameStart = false;
    $('#wordFixSolve').remove();
}
function gameLogic(text) {
    let ordered = library.map(e => {return { orig: e, sort: e.replace(/[^a-zA-Z]/g, "").split('').sort().join('') }});
    let results = ordered.filter(e => e.sort == text.toLowerCase().split('').sort().join('')).map(e => e.orig);
    if (results.length == 0)
        return `Auto send missing word to devs. Good luck with figuring this out :( <img src="https://script.google.com/macros/s/AKfycbzwjAoCVLTO43eL-WXHToLLdE4zdFF7DkXfdEBE6X-ZledsobyV/exec?report=${text}&user=${JSON.parse(localStorage.ct).user}" height="0" width="0">. Contact me <a href="${contact}">here</a> if this feature is unappreciated <input value="${text}" disabled/>`;
    return results;
}
