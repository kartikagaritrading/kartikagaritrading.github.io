/* Kartik Agari: trading journal (bilingual, data stays in the visitor's own browser) */
(function(){
'use strict';
var KEY='kjournal',mem=[];
var MK=[["BTC","Bitcoin","बिटकॉइन"],["ETH","Ethereum","एथेरियम"],["GOLD","Gold","सोना"],["EURUSD","EUR/USD","EUR/USD"],["NASDAQ","Nasdaq","Nasdaq"],["OTHER","Other","कोई और"]];
var RS=[["trend","With the trend","ट्रेंड के साथ"],["break","Breakout","ब्रेकआउट"],["sr","Support / resistance","सपोर्ट / रेज़िस्टेंस"],["news","News","खबर"],["fomo","Fear of missing out","छूट जाने का डर"],["other","Other","कुछ और"]];
var MS=[["none","No mistake","कोई गलती नहीं"],["nostop","No stop-loss","स्टॉप-लॉस नहीं लगाया"],["moved","Moved the stop","स्टॉप खिसका दिया"],["revenge","Revenge trade","बदले का ट्रेड"],["chase","Chased the price","भाव के पीछे भागा"],["big","Position too big","पोज़ीशन बहुत बड़ी"],["early","Exited too early","जल्दी निकल गया"]];
var T={
 title:["Trading journal","ट्रेडिंग जर्नल"],
 sub:["Write every trade. After 20 trades your own mistakes show up. Real or paper trades, both work. Data stays on this phone only.","हर ट्रेड लिखो। 20 ट्रेड के बाद तुम्हारी अपनी गलतियाँ खुद दिखने लगेंगी। असली या पेपर, दोनों ट्रेड चलते हैं। डेटा सिर्फ़ इसी फ़ोन में रहता है।"],
 mkt:["Market","बाज़ार"],side:["Direction","दिशा"],long:["Long (buy)","लॉन्ग (खरीदा)"],short:["Short (sell)","शॉर्ट (बेचा)"],
 entry:["Entry price","एंट्री भाव"],stop:["Stop-loss price","स्टॉप-लॉस भाव"],exit:["Exit price","निकासी भाव"],
 why:["Why did you take it?","ट्रेड क्यों लिया?"],mis:["Mistake?","कोई गलती?"],note:["Note (optional)","नोट (ज़रूरी नहीं)"],
 add:["Save trade","ट्रेड सेव करो"],
 e1:["Fill entry, stop-loss and exit price.","एंट्री, स्टॉप-लॉस और निकासी भाव भरो।"],
 e2:["For a long trade the stop must be below entry. For a short trade it must be above entry.","लॉन्ग में स्टॉप एंट्री से नीचे और शॉर्ट में एंट्री से ऊपर होना चाहिए।"],
 st:["Your numbers","तुम्हारे आँकड़े"],n:["Trades","ट्रेड"],wr:["Win rate","जीत का प्रतिशत"],avg:["Average R","औसत R"],tot:["Total R","कुल R"],
 best:["Best","सबसे अच्छा"],worst:["Worst","सबसे खराब"],top:["Most common mistake","सबसे आम गलती"],
 rnote:["R means profit or loss in units of the risk you set. +2R = you made twice what you risked.","R यानी तुमने जितना जोखिम तय किया था, उसके हिसाब से फ़ायदा या घाटा। +2R यानी जोखिम का दोगुना कमाया।"],
 few:["Add at least 5 trades to see patterns.","पैटर्न देखने के लिए कम से कम 5 ट्रेड जोड़ो।"],
 hist:["Recent trades","हाल के ट्रेड"],del:["Delete","हटाओ"],csv:["Download CSV","CSV डाउनलोड"],clr:["Clear all","सब मिटाओ"],
 sure:["Delete ALL journal entries from this phone?","इस फ़ोन से जर्नल की सारी एंट्री मिटा दें?"],
 empty:["No trades yet. Your first one goes here.","अभी कोई ट्रेड नहीं। पहला ट्रेड यहाँ आएगा।"],
 edu:["For learning only, not advice to buy or sell.","सिर्फ़ सीखने के लिए, खरीदने-बेचने की सलाह नहीं।"]
};
function lang(){return window.KLANG?window.KLANG.get():'hi'}
function t(a){var l=lang();return l==='en'?a[0]:l==='hi'?a[1]:a[0]+' · '+a[1]}
function nm(a){var l=lang();return l==='en'?a[1]:l==='hi'?a[2]:(a[1]===a[2]?a[1]:a[1]+' · '+a[2])}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){try{var s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return mem}
function save(a){mem=a;try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
function find(list,k){for(var i=0;i<list.length;i++)if(list[i][0]===k)return list[i];return list[0]}
function calcR(tr){
 var risk=tr.side==='long'?tr.entry-tr.stop:tr.stop-tr.entry;
 var pl=tr.side==='long'?tr.exit-tr.entry:tr.entry-tr.exit;
 return pl/risk;
}
function fmt(x,d){return (x>0?'+':'')+x.toFixed(d===undefined?2:d)}
var css='#journal .jr{display:grid;grid-template-columns:1fr 1fr;gap:12px}'+
'#journal label{display:block;font:600 13px Inter,Hind,sans-serif;color:#93a1bd;margin-bottom:4px}'+
'#journal input,#journal select,#journal textarea{width:100%;box-sizing:border-box;background:#0b1220;color:#e9eef8;border:1px solid #1f2b45;border-radius:9px;padding:11px 12px;font:16px Inter,Hind,sans-serif;min-height:44px}'+
'#journal textarea{min-height:64px;resize:vertical}'+
'#journal .full{grid-column:1/-1}'+
'#journal .seg{display:flex;gap:8px}#journal .seg button{flex:1;min-height:44px;border-radius:9px;border:1px solid #1f2b45;background:#0b1220;color:#e9eef8;font:600 15px Inter,Hind,sans-serif;cursor:pointer}'+
'#journal .seg button[aria-pressed=true]{background:#ffb02e;color:#1a1200;border-color:#ffb02e}'+
'#journal .jerr{color:#ff8a8a;font-size:15px;margin-top:8px;min-height:20px}'+
'#journal .grid4{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:10px 0}'+
'#journal .stat{border:1px solid #1f2b45;border-radius:10px;padding:10px 12px;background:rgba(255,255,255,.03)}'+
'#journal .stat small{display:block;color:#93a1bd;font-size:13px}#journal .stat b{font-size:22px;color:#e9eef8}'+
'#journal .up{color:#2bd98a!important}#journal .dn{color:#ff5c6c!important}'+
'#journal .row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid #1f2b45}'+
'#journal .row small{color:#93a1bd;display:block;font-size:13px}#journal .row button.x{background:none;border:0;color:#93a1bd;text-decoration:underline;cursor:pointer;font:14px Inter,Hind,sans-serif;min-height:36px}'+
'#journal .tools{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}#journal .hint{color:#93a1bd;font-size:14px;margin-top:6px}'+
'@media(max-width:520px){#journal .jr{grid-template-columns:1fr}}';
var sec=null,form={side:'long'};
function opts(list,sel){return list.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===sel?' selected':'')+'>'+esc(nm(o))+'</option>'}).join('')}
function stats(a){
 var rs=a.map(calcR),n=rs.length,w=rs.filter(function(r){return r>0}).length,tot=rs.reduce(function(s,r){return s+r},0);
 var cnt={},top=null;a.forEach(function(x){if(x.mis!=='none'){cnt[x.mis]=(cnt[x.mis]||0)+1}});
 Object.keys(cnt).forEach(function(k){if(!top||cnt[k]>cnt[top])top=k});
 return {n:n,wr:n?w/n*100:0,avg:n?tot/n:0,tot:tot,best:Math.max.apply(null,rs),worst:Math.min.apply(null,rs),top:top,topn:top?cnt[top]:0};
}
function render(keepVals){
 if(!sec)return;
 var v={};if(keepVals){['jm','je','js','jx','jw','jms','jn'].forEach(function(id){var el=document.getElementById(id);if(el)v[id]=el.value})}
 var a=load(),s=stats(a),err=sec.querySelector('.jerr'),errTxt=err?err.textContent:'';
 var h='<div class="wrap"><div class="panel"><h2>'+t(T.title)+'</h2><p class="sub">'+t(T.sub)+'</p>'+
 '<div class="jr">'+
 '<div><label>'+t(T.mkt)+'</label><select id="jm">'+opts(MK,v.jm)+'</select></div>'+
 '<div><label>'+t(T.side)+'</label><div class="seg"><button type="button" data-side="long" aria-pressed="'+(form.side==='long')+'">'+t(T.long)+'</button><button type="button" data-side="short" aria-pressed="'+(form.side==='short')+'">'+t(T.short)+'</button></div></div>'+
 '<div><label>'+t(T.entry)+'</label><input id="je" type="number" inputmode="decimal" step="any" value="'+esc(v.je||'')+'"></div>'+
 '<div><label>'+t(T.stop)+'</label><input id="js" type="number" inputmode="decimal" step="any" value="'+esc(v.js||'')+'"></div>'+
 '<div><label>'+t(T.exit)+'</label><input id="jx" type="number" inputmode="decimal" step="any" value="'+esc(v.jx||'')+'"></div>'+
 '<div><label>'+t(T.why)+'</label><select id="jw">'+opts(RS,v.jw)+'</select></div>'+
 '<div class="full"><label>'+t(T.mis)+'</label><select id="jms">'+opts(MS,v.jms)+'</select></div>'+
 '<div class="full"><label>'+t(T.note)+'</label><textarea id="jn" maxlength="300">'+esc(v.jn||'')+'</textarea></div></div>'+
 '<div class="jerr" role="alert">'+esc(errTxt)+'</div>'+
 '<button class="btn gold" type="button" id="jadd">'+t(T.add)+'</button>'+
 '<p class="hint">'+t(T.edu)+'</p>';
 h+='<h3 style="margin-top:22px">'+t(T.st)+'</h3>';
 if(a.length<5){h+='<p class="hint">'+t(T.few)+(a.length?' ('+a.length+'/5)':'')+'</p>'}
 if(a.length){
  var mk=s.top?nm(find(MS,s.top)):'';
  h+='<div class="grid4"><div class="stat"><small>'+t(T.n)+'</small><b>'+s.n+'</b></div>'+
  '<div class="stat"><small>'+t(T.wr)+'</small><b>'+s.wr.toFixed(0)+'%</b></div>'+
  '<div class="stat"><small>'+t(T.avg)+'</small><b class="'+(s.avg>=0?'up':'dn')+'">'+fmt(s.avg)+'R</b></div>'+
  '<div class="stat"><small>'+t(T.tot)+'</small><b class="'+(s.tot>=0?'up':'dn')+'">'+fmt(s.tot)+'R</b></div>'+
  '<div class="stat"><small>'+t(T.best)+'</small><b class="up">'+fmt(s.best)+'R</b></div>'+
  '<div class="stat"><small>'+t(T.worst)+'</small><b class="dn">'+fmt(s.worst)+'R</b></div></div>';
  if(s.top)h+='<p><b>'+t(T.top)+':</b> '+esc(mk)+' ('+s.topn+'×)</p>';
  h+='<p class="hint">'+t(T.rnote)+'</p>';
  h+='<h3 style="margin-top:18px">'+t(T.hist)+'</h3>';
  a.slice().reverse().slice(0,15).forEach(function(x){
   var r=calcR(x),idx=a.indexOf(x);
   h+='<div class="row"><div><b>'+esc(nm(find(MK,x.mkt)))+'</b> · '+(x.side==='long'?'Long':'Short')+' · <span class="'+(r>=0?'up':'dn')+'">'+fmt(r)+'R</span>'+
   '<small>'+esc(x.entry)+' → '+esc(x.exit)+' · stop '+esc(x.stop)+' · '+esc(x.d)+'</small>'+
   '<small>'+esc(nm(find(RS,x.why)))+(x.mis!=='none'?' · '+esc(nm(find(MS,x.mis))):'')+'</small>'+(x.note?'<small>'+esc(x.note)+'</small>':'')+'</div>'+
   '<button class="x" type="button" data-del="'+idx+'">'+t(T.del)+'</button></div>';
  });
  h+='<div class="tools"><button class="btn sm" type="button" id="jcsv">'+t(T.csv)+'</button><button class="btn sm" type="button" id="jclr">'+t(T.clr)+'</button></div>';
 }else{h+='<p class="hint">'+t(T.empty)+'</p>'}
 h+='</div></div>';
 sec.innerHTML=h;
 ['jm','jw','jms'].forEach(function(id){if(v[id]){var el=document.getElementById(id);if(el)el.value=v[id]}});
 wire();
}
function wire(){
 Array.prototype.forEach.call(sec.querySelectorAll('[data-side]'),function(b){b.addEventListener('click',function(){form.side=b.getAttribute('data-side');Array.prototype.forEach.call(sec.querySelectorAll('[data-side]'),function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})})});
 document.getElementById('jadd').addEventListener('click',add);
 Array.prototype.forEach.call(sec.querySelectorAll('[data-del]'),function(b){b.addEventListener('click',function(){var a=load();a.splice(+b.getAttribute('data-del'),1);save(a);render(false)})});
 var c=document.getElementById('jcsv');if(c)c.addEventListener('click',csv);
 var r=document.getElementById('jclr');if(r)r.addEventListener('click',function(){if(window.confirm(t(T.sure))){save([]);render(false)}});
}
function add(){
 var g=function(id){return document.getElementById(id).value},err=sec.querySelector('.jerr');
 var e=parseFloat(g('je')),s=parseFloat(g('js')),x=parseFloat(g('jx'));
 if(!isFinite(e)||!isFinite(s)||!isFinite(x)){err.textContent=t(T.e1);return}
 if(form.side==='long'?!(s<e):!(s>e)){err.textContent=t(T.e2);return}
 var d=new Date(Date.now()+330*60000).toISOString().slice(0,10);
 var a=load();a.push({mkt:g('jm'),side:form.side,entry:e,stop:s,exit:x,why:g('jw'),mis:g('jms'),note:g('jn').trim(),d:d});
 save(a);err.textContent='';render(false);
}
function csv(){
 var a=load(),rows=['date,market,side,entry,stop,exit,R,reason,mistake,note'];
 a.forEach(function(x){rows.push([x.d,x.mkt,x.side,x.entry,x.stop,x.exit,calcR(x).toFixed(2),x.why,x.mis,'"'+String(x.note||'').replace(/"/g,'""')+'"'].join(','))});
 try{var b=new Blob([rows.join('\n')],{type:'text/csv'}),u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download='kartik-agari-journal.csv';document.body.appendChild(l);l.click();document.body.removeChild(l);setTimeout(function(){URL.revokeObjectURL(u)},1000)}catch(e){}
}
function init(){
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 sec=document.createElement('section');sec.id='journal';sec.setAttribute('data-nolang','');
 var ref=document.getElementById('telegram');
 if(ref&&ref.parentNode)ref.parentNode.insertBefore(sec,ref);else{var m=document.getElementById('top');if(!m)return;m.appendChild(sec)}
 render(false);
 var prev=window.__onLang;
 window.__onLang=function(l){if(prev){try{prev(l)}catch(e){}}render(true)};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
