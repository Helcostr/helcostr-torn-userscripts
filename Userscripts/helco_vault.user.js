// ==UserScript==
// @name         Torn Property Vault Tracker
// @version      2.0
// @description  Track Entries 
// @author       Helcostr [1934501]
// @updateURL    https://github.com/Helcostr/helcostr-torn-userscripts/raw/master/Userscripts/helco_vault.user.js
// @match        https://www.torn.com/properties.php
// @require      https://unpkg.com/dexie/dist/dexie.js
// @grant        GM_registerMenuCommand
// ==/UserScript==
// @require      https://unpkg.com/vue@3/dist/vue.global.js

(()=>{
  "use strict";
  mainInit();
  let imgArch = {};

  function dbInit() {
    const db = new Dexie('HelcostrPropertyVaultTracker');
    db.version(1).stores({
      'vault-entry':'tid,uid,amt'
    });
    return db;
  }
  function mainInit() {
    const db = dbInit();
    $(document).ajaxComplete((event,{responseText},{url,type,data}) => {
      // Not properties Post
      if (url.search("properties.php") === -1 || type !== 'POST') return;
      // Not data post
      if (data !== "p=options&tab=vault&step=options" && data.search('step=getVaultTransactions') === -1) return;
      
      const myMap = $(responseText)
        .find('li[transaction_id]')
        .addBack('li[transaction_id]')
        .map(eachTransaction).get();
      db['vault-entry'].bulkAdd(myMap)
        .then(lKey=>{
          console.log("Last key:",lKey);
        })
        .catch(Dexie.BulkError, e=>{
          console.error('Failed:',e.failures.length,'/',myMap.length);
          console.group('Errors:');
          e.failures.forEach(e=>console.error(e));
          console.groupEnd();
        })
    });
    GM_registerMenuCommand('Display Total', async ()=>{
      const form = new Intl.NumberFormat();
      const users = await getTotal(db);
      const total = Object.values(users).reduce((a,b)=>a+b,0);
      let output = '';
      Object.entries(users).forEach(([uid,tot])=>output+=`${uid}:${form.format(tot)}\n`)
      output+='Total:'+form.format(total);
      alert(output);
    })
  }
  async function getTotal(db) {
    const kArr = await db['vault-entry'].orderBy('uid').uniqueKeys();
    const out = {};
    for (const uid of kArr) {
      if (!(uid in out)) out[uid] = 0;
      const uArr = await db['vault-entry'].where('uid').equals(uid).toArray();
      for (const {amt} of uArr)
        out[uid] += amt;
    }
    return out;
  }
  function eachTransaction() {
    const focus = $(this),
      tid = tidParse(focus),
      uid = uidParse(focus),
      amt = amtParse(focus);
    return {tid,uid,amt};
  }
  function tidParse(focus) {
    return parseInt(focus.attr('transaction_id'));
  }
  function timeParse(focus) {
    const mapInt = e=>parseInt(e),
      mapStr = e=>e.toString().padStart(2,'0'),
      date = focus.find('.transaction-date').text(),
      time = focus.find('.transaction-time').text(),
      [,hrs,min,sec] = time.match(/(\d\d):(\d\d):(\d\d)/).map(mapInt),
      [,day,mth,yrs] = date.match(/(\d\d)\/(\d\d)\/(\d\d)/).map(mapInt),
      [curCen,curYear] = (new Date()).getFullYear().toString()
        .split(/(?<=\d{2})(?=\d{2})/).map(mapInt);
    return new Date(`${yrs > curYear ? ''+(curCen-1)+yrs:''+curCen+yrs}-${
      mapStr(mth)}-${mapStr(day)
    }T${
      mapStr(hrs)}:${mapStr(min)}:${mapStr(sec)}.000Z`);
  }
  function uidParse(focus) {
    return parseInt(focus.find(".user a").eq(0).attr("href").match(/XID=(\d+)/)[1]);
  }
  function amtParse(focus) {
    return parseInt(focus.find(".amount").text().replace(/[^0-9+-]/g,''))
  }
})();
