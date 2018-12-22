// ==UserScript==
// @name        Word Fixer Assist
// @description Pull up solutions to the word fixer game.
// @match       https://www.torn.com/christmas_town.php
// @author      echoblast53 [1934501], Ahab [1735214]
// @version     1.8.1
// @updateURL   https://github.com/Echoblast53/echoblast53-torn-userscripts/raw/master/Userscripts/echo_ct_wordfixer.user.js
// @grant       none
// @run-at      document-start
// ==/UserScript==
const original_fetch = fetch;
window.fetch = async (input, init) => {
    const response = await original_fetch(input, init);

    if (response.url.search('christmas_town.php?') != -1) {
        if (response.url.search('q=miniGameAction') != -1) {
            const clone = response.clone();
            let payload = {};
            if (typeof init.body != 'undefined')
                payload = JSON.parse(init.body);
            clone.json().then((json)=>{miniGameAction(json,payload)});
        }
        else if (gameStart)
            closeGame();
    }
    return response;
}
const sleepText = '<font color="gray">Awaiting Word...</font>';
const contact = 'https://www.torn.com/forums.php#/p=threads&f=67&t=16073974&b=0&a=0'
let gameStart = false;
let library = [];

fetch('https://script.google.com/macros/s/AKfycbzwjAoCVLTO43eL-WXHToLLdE4zdFF7DkXfdEBE6X-ZledsobyV/exec?script').then(async res=>{
    library = await res.json();
    console.log("Word Fixer Assist -",library.length,`word${library.length>1?'s':''} loaded!`);
});

function miniGameAction(json,payload) {
    if (json.miniGameType == "WordFixer") {
        openGame();
        updateGame(gameLogic(json.progress.word));
    }
    if(gameStart == true) {
        if (json.finished)
            if (json.success)
                updateGame(ping(`solve=${payload.result.word}&user=${getID()}`));
            updateGame('<font color="gray">What was my purpose?... Oh my god.</font>');
        else if (typeof json.message != "undefined" && json.message != "game")
            updateGame(`<font color="gray">I hope you enjoy my existance. Leave a <a href="${contact}">comment</a> if you feel like it.</font>`);
        else if (json.success) {
            updateGame(sleepText + ping(`solve=${payload.result.word}&user=${getID()}`));
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
a
function updateGame(text) {
    $("#wordFixSolution").html(text);
}

function closeGame() {
    gameStart = false;
    $('#wordFixSolve').remove();
}

function gameLogic(text) {
    let ordered = library.map(e => {return { orig: e, sort: e.replace(/[^ a-zA-Z]/g, "").split('').sort().join('') }});
    let results = ordered.filter(e => e.sort == text.toLowerCase().split('').sort().join('')).map(e => e.orig);
    if (results.length == 0)
        return `Auto send missing word to devs. Good luck with figuring this out :(. Contact me <a href="${contact}">here</a> if this feature is unappreciated <input value="${text}" disabled/>` + ping(`report=${payload.result.word}&user=${getID()}`);
    return results;
}
function ping(text) {
    return `<img src="https://script.google.com/macros/s/AKfycbzwjAoCVLTO43eL-WXHToLLdE4zdFF7DkXfdEBE6X-ZledsobyV/exec?${text}" style="display:none;"/>`;
}

function getID() {
    return decodeURIComponent(document.cookie).split(';').filter(e=>e.search("uid=")!=-1)[0].split("=")[1];
}
