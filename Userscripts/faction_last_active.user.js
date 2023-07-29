// ==UserScript==
// @name         Faction Last Active
// @namespace    namespace
// @version      0.5.0
// @description  Faction Last Active script written by tos (branch off of 0.8. Source: https://greasyfork.org/en/scripts/370102-faction-last-active)
// @author       Helcostr [1934501] (maintainer), tos [1976582], LordBusiness [2052465]
// @updateURL    https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/faction_last_active.user.js
// @downloadURL  https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/faction_last_active.user.js
// @connect      api.torn.com
// @match        *.torn.com/factions.php*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const apiKey = '';
let sortOrder = "des";
let listener = false;

GM_addStyle(`
  .last_action_icon {
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    background-image: url(/images/v2/sidebar_icons_desktop_2017.png);
    background-repeat: no-repeat;
    background-position-y: -785px;
    width: 34px;
    height: 30px;
  }

  .table-body.hide-icons > li .member-icons > #iconTray,
  .table-body:not(.hide-icons) > li .member-icons > .last-action {
    display: none !important;
  }
`)

// Gets Faction Info via Faction Warfare link
function getFactionInfo() {
    const input = $("#view-wars").parent().attr('href');
    let regex = /\/page\.php\?sid=factionWarfare#\/ranked\/(\d+)/i;
    return regex.exec(input)?.[1]||'';
}

const factionID = getFactionInfo();

const myFetch = url => {
    return new Promise((resolve, reject) => {
        let ret = GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'json',
            onload: response => resolve(response.response),
            onerror: err => reject(err)
        })
        })
}

const get_api = async (fac = factionID, key = apiKey) => {
    return await myFetch(`https://api.torn.com/faction/${fac}?selections=basic&key=${key}`)
}

const toggleLastAction = (iconsTitle, memberUL) => {
    if (iconsTitle.innerText === 'Icons') {
        iconsTitle.childNodes[0].nodeValue = 'Last Action'
        get_api().then(res => {
            if (res.error && res.error.code === 2) alert(`Invalid API key found in ${GM.info.script.name} script. Please update it on line 16.`)
            let index = 0;
            for (const li of memberUL.children) {
                const lastActionDIV = li.querySelector('.last-action')
                if (lastActionDIV) {
                    const memberID = lastActionDIV.getAttribute('data-member-id'),
                          lastAction = res.members[memberID].last_action.relative
                    li.setAttribute("last_stamp", res.members[memberID].last_action.timestamp.toString());

                    li.setAttribute("indexelem", index.toString());
                    lastActionDIV.innerText = lastAction
                    if (lastAction.includes('minute')) lastActionDIV.classList.add('ftGreen')
                    else if (lastAction.includes('hour')) lastActionDIV.classList.add(parseInt(lastAction.split(' ')[0]) < 12 ? 't-green' : 'ftGold')
                    else if (lastAction.includes('day')) lastActionDIV.classList.add(parseInt(lastAction.split(' ')[0]) < 7 ? 'ftDarkGold' : 't-red')
                }
                index += 1;
            }
            if (!listener) {
                iconsTitle.addEventListener('click', (e) => {
                    if (iconsTitle.innerText !== "Icons") {
                        if (!e.target.classList.contains("last_action_icon")) {
                            sort();
                        }
                    }
                });
                listener = true;
            }
        })
            .catch(err => console.log(err))
    } else {
        iconsTitle.childNodes[0].nodeValue = 'Icons'
    }
    memberUL.classList.toggle('hide-icons')
    iconsTitle.classList.toggle("c-pointer");
}

const add_toggle = node => {
    const iconsTitle = node.querySelector('.table-cell.member-icons'),
          memberUL = node.querySelector('.table-body')
    iconsTitle.insertAdjacentHTML('beforeend', `<i class="last_action_icon right"></i>`)
    node.querySelector('.last_action_icon').addEventListener('click', () => {
        toggleLastAction(iconsTitle, memberUL);
    })
    for (const li of memberUL.children) {
        const memberID = /XID=(\d+)/.exec(li.querySelector('div[class*=" userWrap"],div[class^="userWrap"] a').getAttribute('href'))[1];
        li.querySelector('.member-icons #iconTray').insertAdjacentHTML('afterend', `<div class="last-action" data-member-id="${memberID}"></div>`)
    }
}

const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.className && node.querySelector('.f-war-list')) {
                add_toggle(node)
            }
        }
    }
})

const otherFactionUL = document.querySelector('.f-war-list')
if (otherFactionUL) {
    add_toggle(otherFactionUL)
} else {
    const wrapper = document.getElementById('factions')
    observer.observe(wrapper, {
        subtree: true,
        childList: true
    })
}
function sort() {
    let ulNode = document.querySelector(".f-war-list .table-body");
    let liList = ulNode.children;
    let array = [];
    for (const li of liList) {
        let index = parseFloat(li.getAttribute("indexelem"));
        array.push([index, parseFloat(li.getAttribute("last_stamp"))]);
    }
    if (sortOrder === "asc") {
        sortOrder = "des";
        array.sort(function(a, b) {
            return a[1] - b[1];
        });
    } else {
        sortOrder = "asc";
        array.sort(function(a, b) {
            return b[1] - a[1];
        });
    }
    let indexOfLast = array[array.length - 1][0];
    let last = ulNode.querySelector(`li[indexelem="${indexOfLast}"]`);
    ulNode.appendChild(last);
    array.splice(-1);
    for (const sub of array) {
        let num = sub[0].toString();
        ulNode.insertBefore(ulNode.querySelector(`li[indexelem="${num}"]`), last);
    }
}
