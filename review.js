/* Kartik Agari: Trade Review (photo + checklist). The photo never leaves the phone. Answers are checked by simple rules, not by AI. */
(function(){
'use strict';
function lang(){return window.KLANG?window.KLANG.get():'hi'}
function t(a){var l=lang();return l==='en'?a[0]:l==='hi'?a[1]:a[0]+' · '+a[1]}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var T={
 open:["Check my trade with a photo","फोटो से अपना ट्रेड जाँचो"],
 title:["Trade review","ट्रेड रिव्यू"],
 priv:["Your photo stays on this phone. It is not uploaded and nobody reads it. The review below is made from your answers by simple rules, not by AI.","तुम्हारी फोटो इसी फ़ोन में रहती है। वह कहीं भेजी नहीं जाती और उसे कोई नहीं पढ़ता। नीचे की जाँच तुम्हारे जवाबों से सीधे नियमों से बनती है, AI से नहीं।"],
 pick:["📷 Choose photo or screenshot","📷 फोटो या स्क्रीनशॉट चुनो"],
 opt:["(optional, to look at while you answer)","(ज़रूरी नहीं, जवाब देते समय देखने के लिए)"],
 side:["Direction","दिशा"],buy:["Buy (long)","खरीदा (लॉन्ग)"],sell:["Sell (short)","बेचा (शॉर्ट)"],
 en:["Entry price","एंट्री भाव"],sl:["Stop-loss price (blank if none)","स्टॉप-लॉस भाव (नहीं था तो खाली)"],tg:["Target price (optional)","टारगेट भाव (ज़रूरी नहीं)"],
 go:["Check my trade","मेरा ट्रेड जाँचो"],close:["Close","बंद करो"],again:["Check another","दूसरा जाँचो"],
 good:["What was fine","क्या ठीक था"],bad:["Look at these","इन पर ध्यान दो"],
 learn:["Learn","सीखो"],none:["Nothing stands out from your answers. Keep logging trades in the journal.","तुम्हारे जवाबों में कुछ ख़ास गड़बड़ नहीं दिखी। जर्नल में ट्रेड लिखते रहो।"],
 edu:["For learning only. This is not advice to buy or sell, and a good plan can still lose.","सिर्फ़ सीखने के लिए। यह ख़रीदने-बेचने की सलाह नहीं है, और अच्छा प्लान भी हार सकता है।"]
};
var Q=[
 ['kind',["What kind of trade was it?","यह किस तरह का ट्रेड था?"],[['pull',"Entered on a pullback in a trend","ट्रेंड में पुलबैक पर घुसा"],['brk',"Breakout of a level","किसी स्तर का ब्रेकआउट"],['rev',"Reversal at support or resistance","सपोर्ट या रेज़िस्टेंस से पलटाव"],['news',"Around news","ख़बर के आसपास"],['chase',"Price was running, I jumped in","भाव भाग रहा था, मैं कूद पड़ा"],['idk',"Not sure","पक्का नहीं पता"]]],
 ['trend',["Was it with the bigger trend?","क्या यह बड़े ट्रेंड के साथ था?"],[['with',"Yes, with it","हाँ, साथ में"],['against',"No, against it","नहीं, उल्टा"],['idk',"I did not check","मैंने देखा ही नहीं"]]],
 ['stop',["Stop-loss","स्टॉप-लॉस"],[['before',"Placed before entering","एंट्री से पहले लगाया"],['late',"Placed after entering","एंट्री के बाद लगाया"],['moved',"I moved it away when price came close","भाव पास आया तो दूर खिसका दिया"],['none',"No stop-loss","स्टॉप-लॉस नहीं था"]]],
 ['candle',["When did you enter?","तुमने कब एंट्री ली?"],[['closed',"After the candle closed","कैंडल बंद होने के बाद"],['during',"While the candle was still moving","कैंडल चलते-चलते"]]],
 ['risk',["How much of your money was at risk?","पूँजी का कितना हिस्सा जोखिम में था?"],[['low',"1% or less","1% या कम"],['mid',"About 2%","लगभग 2%"],['high',"More than 2%","2% से ज़्यादा"],['idk',"I did not calculate","हिसाब नहीं लगाया"]]],
 ['nw',["Was big news due within 30 minutes?","क्या 30 मिनट में कोई बड़ी ख़बर थी?"],[['no',"No","नहीं"],['yes',"Yes","हाँ"],['idk',"I did not check","देखा नहीं"]]],
 ['mood',["How did you feel before entering?","एंट्री से पहले कैसा महसूस हो रहा था?"],[['calm',"Calm, followed my plan","शांत, प्लान पर चला"],['fomo',"Afraid of missing the move","चाल छूट जाने का डर"],['rev',"Wanted to win back a loss","घाटा वापस जीतना था"],['bored',"Bored, wanted action","ऊब गया था, कुछ करना था"]]],
 ['plan',["Did you have a written plan for this trade?","क्या इस ट्रेड का लिखा हुआ प्लान था?"],[['yes',"Yes","हाँ"],['no',"No","नहीं"]]],
 ['res',["Result","नतीजा"],[['win',"Profit","मुनाफ़ा"],['loss',"Loss","घाटा"],['open',"Still open","अभी खुला है"]]]
];
var css='#kxrev{position:fixed;inset:0;z-index:1000;background:#070c18;overflow-y:auto;-webkit-overflow-scrolling:touch;display:none}#kxrev.on{display:block}'+
'#kxrev .in{max-width:620px;margin:0 auto;padding:16px 16px 60px;color:#e9eef8;font:16px/1.6 Inter,Hind,sans-serif}'+
'#kxrev h2{margin:6px 0 4px;font-size:22px}#kxrev .p{color:#93a1bd;font-size:14px;margin:0 0 12px}'+
'#kxrev label{display:block;font:600 14px Inter,Hind,sans-serif;color:#93a1bd;margin:12px 0 4px}'+
'#kxrev input[type=number],#kxrev select{width:100%;box-sizing:border-box;background:#0b1220;color:#e9eef8;border:1px solid #1f2b45;border-radius:9px;padding:11px 12px;font:16px Inter,Hind,sans-serif;min-height:46px}'+
'#kxrev .seg{display:flex;gap:8px}#kxrev .seg button,#kxrev .b{min-height:46px;border-radius:9px;border:1px solid #1f2b45;background:#0b1220;color:#e9eef8;font:600 15px Inter,Hind,sans-serif;cursor:pointer;padding:8px 12px}'+
'#kxrev .seg button{flex:1}#kxrev .seg button[aria-pressed=true],#kxrev .b.gold{background:#ffb02e;color:#1a1200;border-color:#ffb02e}'+
'#kxrev img{display:block;max-width:100%;max-height:260px;margin:10px auto 0;border-radius:10px;border:1px solid #1f2b45}'+
'#kxrev .r{border-radius:10px;padding:10px 12px;margin:8px 0;background:rgba(255,255,255,.04);border-left:4px solid #ffb02e}#kxrev .r.g{border-left-color:#2bd98a}#kxrev .r.x{border-left-color:#ff5c6c}'+
'#kxrev .r button{margin-top:6px;background:none;border:1px solid #ffb02e;color:#ffb02e;border-radius:8px;padding:6px 10px;font:600 14px Inter,Hind,sans-serif;cursor:pointer;min-height:36px}'+
'#kxrev .row{display:flex;gap:10px;margin-top:16px}#kxrev .row .b{flex:1}'+
'.kxcam{min-width:46px;padding:0 10px;font-size:20px;background:#0b1220;border:1px solid #1f2b45;border-radius:9px;cursor:pointer;color:#e9eef8}';
var st={side:'buy',url:null,a:{}},box;
function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstChild}
function form(){
 var h='<div class="in"><h2>📋 '+t(T.title)+'</h2><p class="p">'+t(T.priv)+'</p>'+
 '<button type="button" class="b" id="kxpick">'+t(T.pick)+'</button> <small class="p">'+t(T.opt)+'</small>'+
 '<input id="kxf" type="file" accept="image/*" hidden><div id="kxprev"></div>'+
 '<label>'+t(T.side)+'</label><div class="seg"><button type="button" data-s="buy" aria-pressed="'+(st.side==='buy')+'">'+t(T.buy)+'</button><button type="button" data-s="sell" aria-pressed="'+(st.side==='sell')+'">'+t(T.sell)+'</button></div>'+
 '<label>'+t(T.en)+'</label><input id="kxe" type="number" inputmode="decimal" step="any">'+
 '<label>'+t(T.sl)+'</label><input id="kxs" type="number" inputmode="decimal" step="any">'+
 '<label>'+t(T.tg)+'</label><input id="kxt" type="number" inputmode="decimal" step="any">';
 Q.forEach(function(q){h+='<label>'+t(q[1])+'</label><select id="kxq_'+q[0]+'">'+q[2].map(function(o){return '<option value="'+o[0]+'">'+esc(lang()==='en'?o[1]:lang()==='hi'?o[2]:o[1]+' · '+o[2])+'</option>'}).join('')+'</select>'});
 h+='<div class="row"><button type="button" class="b gold" id="kxgo">'+t(T.go)+'</button><button type="button" class="b" id="kxx">'+t(T.close)+'</button></div><p class="p" style="margin-top:12px">'+t(T.edu)+'</p></div>';
 return h;
}
function item(txt,les){return {t:txt,l:les||[]}}
function check(){
 var a={};Q.forEach(function(q){a[q[0]]=document.getElementById('kxq_'+q[0]).value});
 var e=parseFloat(document.getElementById('kxe').value),s=parseFloat(document.getElementById('kxs').value),g=parseFloat(document.getElementById('kxt').value);
 var good=[],bad=[],buy=st.side==='buy';
 var hasS=!isNaN(s)&&!isNaN(e);
 if(a.stop==='none'||(!hasS&&a.stop!=='before'&&a.stop!=='late'&&a.stop!=='moved')){bad.push(item(["There was no stop-loss. One bad move can cost far more than planned.","स्टॉप-लॉस नहीं था। एक बुरी चाल योजना से कहीं ज़्यादा घाटा दे सकती है।"],['sl','risk']))}
 else if(a.stop==='before')good.push(item(["Stop-loss was placed before entering. This is the habit that protects you.","स्टॉप-लॉस एंट्री से पहले लगाया। यही आदत तुम्हें बचाती है।"]));
 if(a.stop==='late')bad.push(item(["The stop came after the entry. Decide it before you click buy or sell.","स्टॉप एंट्री के बाद लगा। ख़रीदने या बेचने से पहले तय करो।"],['sl','plan']));
 if(a.stop==='moved')bad.push(item(["You moved the stop away when price came close. That turns a small loss into a big one.","भाव पास आया तो स्टॉप दूर खिसका दिया। इससे छोटा घाटा बड़ा बन जाता है।"],['sl','psy']));
 if(hasS){
  var wrong=buy?s>=e:s<=e;
  if(wrong)bad.push(item(["The stop is on the wrong side of the entry price. For a buy it must be below entry, for a sell above.","स्टॉप एंट्री के ग़लत तरफ़ है। ख़रीद में एंट्री से नीचे, बिक्री में ऊपर होना चाहिए।"],['sl']));
  else if(!isNaN(g)){
   var rr=Math.abs(g-e)/Math.abs(e-s),right=buy?g>e:g<e;
   if(!right)bad.push(item(["The target is on the wrong side of the entry price.","टारगेट एंट्री के ग़लत तरफ़ है।"],['rr']));
   else if(rr<1.5)bad.push(item(["Reward to risk is about 1:"+rr.toFixed(1)+". Most plans want at least 1:2 so that wins can pay for losses.","रिवॉर्ड-टू-रिस्क लगभग 1:"+rr.toFixed(1)+" है। ज़्यादातर प्लान कम से कम 1:2 चाहते हैं ताकि जीत घाटे की भरपाई कर सके।"],['rr','expect']));
   else good.push(item(["Reward to risk is about 1:"+rr.toFixed(1)+". That gives wins room to pay for losses.","रिवॉर्ड-टू-रिस्क लगभग 1:"+rr.toFixed(1)+" है। इससे जीत को घाटे की भरपाई की जगह मिलती है।"]));
  }
 }
 if(a.kind==='chase')bad.push(item(["Jumping into a running price usually means a bad entry and a far stop. Waiting for a pullback is often cheaper.","भागते भाव में कूदने से अक्सर एंट्री ख़राब और स्टॉप दूर बनता है। पुलबैक का इंतज़ार अक्सर सस्ता पड़ता है।"],['pullback','psy']));
 if(a.kind==='pull'&&a.trend==='with')good.push(item(["A pullback with the trend is one of the cleaner setups.","ट्रेंड के साथ पुलबैक सबसे साफ़ सेटअप में से एक है।"]));
 if(a.kind==='news')bad.push(item(["Trading around news brings wide spreads and slippage. Beginners often do better waiting for the first candles.","ख़बर के आसपास स्प्रेड चौड़ा और स्लिपेज होता है। नए ट्रेडर अक्सर पहली कुछ कैंडल देखकर बेहतर करते हैं।"],['news','slip']));
 if(a.kind==='rev'&&a.trend==='against')bad.push(item(["Catching a reversal against the bigger trend is hard. Many such trades keep going the old way.","बड़े ट्रेंड के उल्टे पलटाव पकड़ना कठिन है। ऐसे कई ट्रेड पुरानी दिशा में ही चलते रहते हैं।"],['trend','regime']));
 if(a.trend==='against'&&a.kind!=='rev')bad.push(item(["You traded against the bigger trend. That needs a smaller size and a clear reason.","तुमने बड़े ट्रेंड के उल्टे ट्रेड लिया। इसके लिए छोटा साइज़ और साफ़ कारण चाहिए।"],['trend','mtf']));
 if(a.trend==='idk')bad.push(item(["You did not check the bigger chart. Look at the 4-hour or daily direction first.","बड़ा चार्ट नहीं देखा। पहले 4 घंटे या डेली की दिशा देखो।"],['mtf','structure']));
 if(a.kind==='brk'&&a.candle==='during')bad.push(item(["You bought a breakout before the candle closed. This is how fakeouts catch people.","कैंडल बंद होने से पहले ब्रेकआउट पर घुसे। फेकआउट ऐसे ही लोगों को फँसाते हैं।"],['fakeout','breakout']));
 else if(a.candle==='during')bad.push(item(["You entered while the candle was still moving. It can change shape before it closes.","कैंडल चलते-चलते एंट्री ली। बंद होने से पहले उसकी शक्ल बदल सकती है।"],['candle','engulf']));
 else good.push(item(["You waited for the candle to close.","कैंडल बंद होने का इंतज़ार किया।"]));
 if(a.risk==='high'||a.risk==='idk')bad.push(item(a.risk==='high'?["More than 2% at risk is heavy. A few losses in a row can hurt badly.","2% से ज़्यादा जोखिम भारी है। लगातार कुछ घाटे गहरी चोट दे सकते हैं।"]:["You did not calculate risk. Work out your size from the stop distance first.","जोखिम का हिसाब नहीं लगाया। पहले स्टॉप की दूरी से साइज़ निकालो।"],['possize','drawdown']));
 else if(a.risk==='low')good.push(item(["Risk of 1% or less keeps losing streaks survivable.","1% या कम जोखिम लगातार घाटों को सहने लायक़ रखता है।"]));
 if(a.nw==='yes')bad.push(item(["Big news was close. Spread and slippage can hit stops hard.","बड़ी ख़बर पास थी। स्प्रेड और स्लिपेज स्टॉप पर भारी पड़ सकते हैं।"],['news','slip']));
 if(a.nw==='idk')bad.push(item(["You did not check the news calendar. Make it a habit before every trade.","ख़बर का कैलेंडर नहीं देखा। हर ट्रेड से पहले यह आदत बनाओ।"],['news']));
 if(a.mood==='fomo')bad.push(item(["Fear of missing out is a poor reason. There is always another setup.","चाल छूटने का डर ख़राब कारण है। अगला सेटअप हमेशा आता है।"],['psy','overtrade']));
 if(a.mood==='rev')bad.push(item(["Trading to win back a loss usually makes the loss bigger. Stop for the day instead.","घाटा वापस जीतने के लिए ट्रेड करने से घाटा अक्सर बढ़ता है। बेहतर है उस दिन रुक जाओ।"],['overtrade','psy']));
 if(a.mood==='bored')bad.push(item(["Boredom trades are rarely in the plan and often lose. Set a daily trade limit.","ऊब के ट्रेड शायद ही प्लान में होते हैं और अक्सर हारते हैं। रोज़ के ट्रेड की सीमा रखो।"],['overtrade','plan']));
 if(a.mood==='calm')good.push(item(["You were calm and followed your plan.","तुम शांत थे और प्लान पर चले।"]));
 if(a.plan==='no')bad.push(item(["There was no written plan. Write entry, stop, target and reason before each trade.","लिखा प्लान नहीं था। हर ट्रेड से पहले एंट्री, स्टॉप, टारगेट और कारण लिखो।"],['plan','jrnl']));
 else good.push(item(["You had a written plan.","लिखा प्लान था।"]));
 if(a.res==='loss'&&bad.length===0)bad.push(item(["Your process looks fine. A good trade can still lose. Judge by many trades, not one.","तुम्हारी प्रक्रिया ठीक दिखती है। अच्छा ट्रेड भी हार सकता है। एक नहीं, कई ट्रेड देखकर परखो।"],['expect','jrnl']));
 return {good:good,bad:bad.slice(0,6)};
}
function lessonBtn(id){
 var n=(window.HI_LESSONS&&window.HI_LESSONS[id]&&lang()!=='en')?window.HI_LESSONS[id].t:null;
 return '<button type="button" data-l="'+id+'">'+t(T.learn)+': '+esc(n||id)+'</button>';
}
function show(r){
 var h='<div class="in"><h2>📋 '+t(T.title)+'</h2>';
 if(st.url)h+='<img src="'+st.url+'" alt="">';
 if(!r.bad.length)h+='<p class="p" style="margin-top:12px">'+t(T.none)+'</p>';
 if(r.bad.length){h+='<h3>'+t(T.bad)+'</h3>';r.bad.forEach(function(x){h+='<div class="r x">'+t(x.t)+'<div>'+x.l.map(lessonBtn).join(' ')+'</div></div>'})}
 if(r.good.length){h+='<h3>'+t(T.good)+'</h3>';r.good.forEach(function(x){h+='<div class="r g">'+t(x.t)+'</div>'})}
 h+='<div class="row"><button type="button" class="b gold" id="kxagain">'+t(T.again)+'</button><button type="button" class="b" id="kxx">'+t(T.close)+'</button></div><p class="p" style="margin-top:12px">'+t(T.edu)+'</p></div>';
 box.innerHTML=h;box.scrollTop=0;wire2();
}
function closeIt(){box.classList.remove('on');box.innerHTML='';if(st.url){try{URL.revokeObjectURL(st.url)}catch(e){}st.url=null}document.body.style.overflow=''}
function wire2(){
 var x=box.querySelector('#kxx');if(x)x.onclick=closeIt;
 var ag=box.querySelector('#kxagain');if(ag)ag.onclick=open;
 box.querySelectorAll('[data-l]').forEach(function(b){b.onclick=function(){var id=b.getAttribute('data-l');closeIt();if(window.askGuru){window.askGuru(id);var m=document.getElementById('msgs');if(m&&m.scrollIntoView)m.scrollIntoView({block:'center'})}}});
}
function open(){
 box.innerHTML=form();box.classList.add('on');box.scrollTop=0;document.body.style.overflow='hidden';
 var f=box.querySelector('#kxf');
 box.querySelector('#kxpick').onclick=function(){f.click()};
 f.onchange=function(){var fl=f.files&&f.files[0];if(!fl)return;if(st.url){try{URL.revokeObjectURL(st.url)}catch(e){}}st.url=URL.createObjectURL(fl);box.querySelector('#kxprev').innerHTML='<img src="'+st.url+'" alt="">'};
 box.querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){st.side=b.getAttribute('data-s');box.querySelectorAll('[data-s]').forEach(function(c){c.setAttribute('aria-pressed',String(c===b))})}});
 box.querySelector('#kxgo').onclick=function(){show(check())};
 wire2();
 if(st.url)box.querySelector('#kxprev').innerHTML='<img src="'+st.url+'" alt="">';
}
function init(){
 var ask=document.getElementById('ask');if(!ask||ask.querySelector('.kxcam'))return;
 var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
 box=el('<div id="kxrev" role="dialog" aria-modal="true"></div>');document.body.appendChild(box);
 var b=document.createElement('button');b.type='button';b.className='kxcam';b.textContent='📷';
 b.setAttribute('aria-label',T.open[0]);b.title=T.open[1];
 b.onclick=function(){st.url=null;open()};
 ask.insertBefore(b,ask.querySelector('button[type=submit]'));
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('on'))closeIt()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
