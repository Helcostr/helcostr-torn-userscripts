// ==UserScript==
// @name        Word Fixer Assist
// @description Pull up solutions to the ct word fixer game.
// @match       https://www.torn.com/christmas_town.php
// @author      echoblast53 [1934501], Ahab [1735214]
// @version     0.0.1
// @grant       none
// @run-at      document-start
// ==/UserScript==
const original_fetch = fetch;
const sleepText = '<font color="gray">Awaiting Word...</font>';
let gameStart = false;

window.fetch = async (input, init) => {
    const response = await original_fetch(input, init);

    if (response.url.search('christmas_town.php?') != -1) {
        const clone = response.clone();
        if (response.url.search('q=miniGameAction') != -1)
            clone.json().then(miniGameAction);
        else
            closeGame();
    }

    return response;
}

function miniGameAction(json) {
    if (json.miniGameType == "WordFixer")
        openGame();
    if(gameStart == true) {
        if (json.finished)
            updateGame('<font color="gray">What was my purpose?... Oh my god.</font>');
        else if (typeof json.message != "undefined")
            updateGame('<font color="gray">I hope you enjoy my existance. Leave a comment if you feel like it.</font>');
        else if (json.success) {
            updateGame(sleepText);
            setTimeout(()=>{
                updateGame(json.progress.word);
            },5000);
        }
    }
};

function openGame() {
    gameStart = true;
    $("#christmastownroot").after(`
        <div class="m-top10 m-bottom10" id="wordFixSolve" style="width:324px; float: left; text-transform: capitalize; padding: 7px 0px;">
            <div aria-level="5" class="title-green top-round" role="heading">
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
    $("#wordFixSolution").text(text);
}
function closeGame() {
    gameStart = false;
    $('#wordFixSolve').remove();
}
