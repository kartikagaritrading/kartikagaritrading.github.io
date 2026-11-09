/* Kartik Agari: daily lesson + streak (self-contained, bilingual) */
(function(){
'use strict';
var T=[
["Stop-loss: decide your exit first","स्टॉप-लॉस: पहले बाहर निकलना तय करो","A stop-loss is the price where you accept you were wrong and exit. Decide it BEFORE you enter the trade, not after the price moves against you.","स्टॉप-लॉस वह भाव है जहाँ तुम मान लेते हो कि अंदाज़ा गलत था और निकल जाते हो। ट्रेड लेने से पहले ही तय करो, भाव उल्टा चलने के बाद नहीं।"],
["The 1% rule","1% का नियम","Risk only about 1% of your account on one trade. With ₹10,000 that is ₹100. Even 10 losses in a row will not finish you.","एक ट्रेड में खाते का सिर्फ़ लगभग 1% जोखिम लो। ₹10,000 में यह ₹100 है। लगातार 10 घाटे भी तुम्हें खत्म नहीं करेंगे।"],
["Risk : reward","जोखिम : फ़ायदा","If you risk ₹100 to try to make ₹200, that is 1:2. At 1:2 you can be right only 4 times out of 10 and still come out ahead (before fees).","अगर ₹100 जोखिम पर ₹200 कमाने की कोशिश करते हो, तो यह 1:2 है। 1:2 में 10 में से सिर्फ़ 4 बार सही होकर भी तुम आगे रह सकते हो (फ़ीस से पहले)।"],
["What one candle tells you","एक कैंडल क्या बताती है","A candle shows the open, high, low and close of one period. A long wick means price went there but was pushed back.","एक कैंडल एक अवधि का ओपन, हाई, लो और क्लोज़ दिखाती है। लंबी बाती का मतलब है कि भाव वहाँ तक गया पर वापस धकेल दिया गया।"],
["Read the trend","ट्रेंड पढ़ना","Higher highs and higher lows is an uptrend. Lower highs and lower lows is a downtrend. Trade with the trend until it clearly breaks.","ऊँचे हाई और ऊँचे लो यानी तेज़ी का ट्रेंड। नीचे हाई और नीचे लो यानी मंदी का ट्रेंड। जब तक ट्रेंड साफ़ टूटे नहीं, उसके साथ चलो।"],
["Support and resistance are zones","सपोर्ट और रेज़िस्टेंस ज़ोन हैं","Support is where falling price often paused before. Resistance is where rising price often stalled. Think of them as zones, not exact lines.","सपोर्ट वह जगह है जहाँ गिरता भाव पहले अक्सर रुका। रेज़िस्टेंस वह जगह है जहाँ चढ़ता भाव अक्सर अटका। इन्हें सटीक रेखा नहीं, इलाका समझो।"],
["RSI is not a buy or sell button","RSI खरीदने-बेचने का बटन नहीं है","RSI above 70 is called overbought and below 30 oversold. In a strong trend RSI can stay there for a long time. It shows momentum, not a command.","RSI 70 के ऊपर हो तो ओवरबॉट और 30 के नीचे हो तो ओवरसोल्ड कहते हैं। तेज़ ट्रेंड में RSI वहीं लंबे समय तक रह सकता है। यह रफ़्तार दिखाता है, हुक्म नहीं।"],
["What an EMA is","EMA क्या है","An EMA is a moving average that gives more weight to recent prices. Price staying above the 50 EMA often goes with an uptrend.","EMA एक मूविंग एवरेज है जो हाल के भावों को ज़्यादा वज़न देता है। भाव का 50 EMA के ऊपर टिके रहना अक्सर तेज़ी के ट्रेंड के साथ चलता है।"],
["Leverage cuts both ways","लीवरेज दोनों तरफ़ काटता है","Leverage lets you control a bigger position with less money, but losses grow the same way. Beginners should use very little or none.","लीवरेज से कम पैसे में बड़ी पोज़ीशन चलती है, पर घाटा भी उसी तरह बढ़ता है। नए लोग बहुत कम लीवरेज लें या बिल्कुल न लें।"],
["More trades is not more profit","ज़्यादा ट्रेड मतलब ज़्यादा मुनाफ़ा नहीं","Overtrading eats money in fees and mistakes. Sitting out is also a decision. Wait for a setup that fits your rules.","ज़्यादा ट्रेड करने से फ़ीस और गलतियों में पैसा जाता है। बैठे रहना भी एक फ़ैसला है। अपने नियमों वाला मौका आने का इंतज़ार करो।"],
["Revenge trading","बदला लेने वाला ट्रेड","After a loss, the urge to win it back fast leads to bigger losses. Set a daily loss limit. When you hit it, close the screen for the day.","घाटे के बाद उसे जल्दी वापस पाने की इच्छा और बड़ा घाटा कराती है। रोज़ का घाटा-सीमा तय करो। वहाँ पहुँचो तो उस दिन स्क्रीन बंद कर दो।"],
["Big timeframe first","पहले बड़ा टाइमफ्रेम","Check the 1-hour, 4-hour or daily chart first to see the direction. Then use the smaller chart to time your entry.","पहले 1 घंटे, 4 घंटे या डेली चार्ट से दिशा देखो। फिर छोटे चार्ट से एंट्री का समय चुनो।"],
["Fees and spread are real","फ़ीस और स्प्रेड असली खर्च हैं","Every trade pays fees and spread. Many small trades can eat all your profit. Always count the cost before you enter.","हर ट्रेड में फ़ीस और स्प्रेड लगता है। बहुत सारे छोटे ट्रेड सारा मुनाफ़ा खा सकते हैं। एंट्री से पहले खर्च गिन लो।"],
["Paper trade first","पहले पेपर ट्रेडिंग","Practise with fake money until you can follow your own rules for 20 trades in a row. Only then think about real money, and start small.","नकली पैसे से तब तक अभ्यास करो जब तक लगातार 20 ट्रेड अपने नियमों पर न चलो। फिर असली पैसे की सोचो, और छोटी रकम से शुरू करो।"],
["Keep a journal","जर्नल रखो","Write why you took each trade and how it ended. After a month you will see your repeated mistakes, and that is where you improve fastest.","हर ट्रेड क्यों लिया और कैसे खत्म हुआ, लिखो। एक महीने बाद तुम्हें अपनी बार-बार होने वाली गलतियाँ दिखेंगी, और सबसे तेज़ सुधार वहीं से होता है।"],
["Big news moves price fast","बड़ी खबर से भाव तेज़ भागता है","Events like interest-rate decisions can move price in seconds. Many beginners stay out a few minutes before and after. That is why we send news alerts early.","ब्याज दर जैसी खबरों पर भाव सेकंडों में भाग सकता है। कई नए ट्रेडर खबर से कुछ मिनट पहले और बाद में बाहर रहते हैं। इसीलिए हम खबर के अलर्ट पहले भेजते हैं।"],
["What a pip is","पिप क्या है","In forex, a pip is the usual smallest price step: 0.0001 for most pairs, 0.01 for pairs with the Japanese yen.","फॉरेक्स में पिप भाव का सबसे छोटा आम कदम है: ज़्यादातर जोड़ियों में 0.0001 और जापानी येन वाली जोड़ियों में 0.01।"],
["Lots: standard, mini, micro","लॉट: स्टैंडर्ड, मिनी, माइक्रो","A standard lot is 100,000 units of currency, a mini lot 10,000 and a micro lot 1,000. Beginners should start with micro lots.","एक स्टैंडर्ड लॉट 100,000 करेंसी इकाई, मिनी लॉट 10,000 और माइक्रो लॉट 1,000 होता है। नए लोग माइक्रो लॉट से शुरू करें।"],
["Long and short","लॉन्ग और शॉर्ट","Long means you gain if price goes up. Short means you gain if price goes down. Both can lose if you are wrong.","लॉन्ग यानी भाव बढ़ने पर फ़ायदा। शॉर्ट यानी भाव गिरने पर फ़ायदा। अंदाज़ा गलत हो तो दोनों में घाटा होता है।"],
["Volume adds weight","वॉल्यूम से वज़न आता है","Volume shows how much was traded. A breakout on high volume is taken more seriously than one on low volume.","वॉल्यूम बताता है कि कितना कारोबार हुआ। ज़्यादा वॉल्यूम पर हुआ ब्रेकआउट, कम वॉल्यूम वाले से ज़्यादा गंभीर माना जाता है।"],
["Breakouts can be fakeouts","ब्रेकआउट नकली भी होता है","Price can break a level and snap back. Waiting for a candle to close beyond the level is safer than jumping in on the first touch.","भाव किसी स्तर को तोड़कर वापस आ सकता है। पहले छूते ही कूदने से बेहतर है कि कैंडल के उस स्तर के पार बंद होने का इंतज़ार करो।"],
["Bull and bear","बुल और बियर","A bull market is a rising market and a bear market is a falling one. Both end sooner or later, and both have sharp moves against the trend.","बुल मार्केट चढ़ता बाज़ार है और बियर मार्केट गिरता बाज़ार। दोनों कभी न कभी खत्म होते हैं, और दोनों में ट्रेंड के उलट तेज़ चालें आती हैं।"],
["Size your position by the stop","पोज़ीशन का साइज़ स्टॉप से तय करो","Position size = money you are willing to risk divided by the distance to your stop-loss. It is a calculation, not a guess. Use the calculator on this site.","पोज़ीशन साइज़ = जो रकम जोखिम में डालने को तैयार हो, उसे स्टॉप-लॉस की दूरी से भाग दो। यह हिसाब है, अंदाज़ा नहीं। इस साइट का कैलकुलेटर इस्तेमाल करो।"],
["Do not average down blindly","आँख बंद करके औसत मत घटाओ","Adding to a losing trade with no plan can turn a small loss into a big one. If your idea was wrong, accept the small loss.","बिना योजना के घाटे वाले ट्रेड में और पैसा लगाने से छोटा घाटा बड़ा बन सकता है। अगर अंदाज़ा गलत था तो छोटा घाटा मान लो।"],
["FOMO: the chase","FOMO: पीछे भागना","When price has already run far, jumping in late is a classic beginner mistake. Another setup usually comes. There is no need to catch every move.","जब भाव पहले ही बहुत भाग चुका हो, तब देर से कूदना नए लोगों की पुरानी गलती है। दूसरा मौका आमतौर पर आता है। हर चाल पकड़ना ज़रूरी नहीं।"],
["Your state matters","अपनी हालत देखो","Do not trade when tired, angry or in urgent need of money. Never trade with money you cannot afford to lose.","थके हो, गुस्से में हो या पैसे की सख्त ज़रूरत हो, तब ट्रेड मत करो। जो पैसा खोना तुम्हें भारी पड़े, उससे कभी ट्रेड मत करो।"],
["Win rate is not everything","जीत का प्रतिशत सब कुछ नहीं","A 70% win rate can still lose money if your losses are bigger than your wins. Look at the size of wins and losses, not just the count.","70% जीत भी घाटे में जा सकती है अगर घाटे जीत से बड़े हों। सिर्फ़ गिनती नहीं, जीत और घाटे का आकार भी देखो।"],
["Protect your capital first","पहले पूँजी बचाओ","Small steady gains add up, but losses add up too, and a 50% loss needs a 100% gain to recover. Protect your money before you try to grow it.","छोटे और लगातार फ़ायदे जुड़ते हैं, पर घाटे भी जुड़ते हैं, और 50% का घाटा पूरा करने को 100% फ़ायदा चाहिए। बढ़ाने से पहले पैसा बचाओ।"],
["Practice is not real money","अभ्यास असली पैसा नहीं है","Paper trading feels easy because nothing is at stake. With real money your hands will shake, so start with a very small amount.","पेपर ट्रेडिंग आसान लगती है क्योंकि कुछ दांव पर नहीं होता। असली पैसे में हाथ काँपते हैं, इसलिए बहुत छोटी रकम से शुरू करो।"],
["No one can promise profit","मुनाफ़े का वादा कोई नहीं कर सकता","Nobody can predict the market for sure. Anyone selling guaranteed profit or asking for your exchange password or API key is a warning sign. This site is for learning only.","बाज़ार का पक्का अंदाज़ा कोई नहीं लगा सकता। जो पक्का मुनाफ़ा बेचे या तुमसे एक्सचेंज का पासवर्ड या API की माँगे, वह खतरे की निशानी है। यह साइट सिर्फ़ सीखने के लिए है।"]
];
var L={
 head:["Today's lesson","आज की सीख"],
 btn:["I learned this ✓","मैंने सीख लिया ✓"],
 done:["Done for today. Come back tomorrow for the next one.","आज का हो गया। अगला पाठ कल मिलेगा।"],
 none:["Start your streak today","आज से लगातार सीखना शुरू करो"],
 note:["Education only, not advice to buy or sell.","सिर्फ़ शिक्षा, खरीदने-बेचने की सलाह नहीं।"]
};
function sk(n){return ["🔥 "+n+" day streak","🔥 "+n+" दिन लगातार"]}
function tot(n){return [n+" lessons learned",n+" पाठ सीखे"]}
var KEY='kdaily',mem=null;
function load(){try{var s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return mem||{last:-9,streak:0,best:0,total:0}}
function save(o){mem=o;try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function dayNum(){return Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5)}
function lang(){return window.KLANG?window.KLANG.get():'hi'}
function pick(a,l){return l==='en'?a[0]:l==='hi'?a[1]:null}
function both(a,l,cls){
  if(l==='both')return '<span class="dl-en">'+a[0]+'</span><span class="dl-hi">'+a[1]+'</span>';
  return pick(a,l);
}
var css='.dly{margin:0;padding:20px}.dly-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}'+
'.dly-tag{display:inline-block;background:#ffb02e;color:#1a1200;font:700 13px Inter,Hind,sans-serif;padding:4px 10px;border-radius:99px}'+
'.dly-st{color:#e9eef8;font:600 15px Inter,Hind,sans-serif}.dly-st small{color:#93a1bd;font-weight:400;margin-left:8px}'+
'.dly h3{font-size:22px;margin:6px 0}.dly p{color:#cdd6ea;font-size:17px;line-height:1.6;max-width:70ch}'+
'.dl-en{display:block}.dl-hi{display:block;margin-top:4px;color:#ffd48a}.dly p .dl-hi{color:#9fb0d6}.dly-tag .dl-hi,.dly .btn.gold .dl-hi{color:#4a3200;margin-top:0}.dly .btn.gold .dl-en,.dly-tag .dl-en{display:inline}.dly .btn.gold .dl-hi,.dly-tag .dl-hi{display:inline;margin-left:6px}'+
'.dly-act{margin-top:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}.dly-note{color:#93a1bd;font-size:14px}'+
'.dly .btn[disabled]{opacity:.6;cursor:default}';
var sec=null;
function render(){
  if(!sec)return;
  var l=lang(),st=load(),dn=dayNum(),t=T[((dn%T.length)+T.length)%T.length];
  var doneToday=st.last===dn;
  var live=(st.last===dn||st.last===dn-1)?st.streak:0;
  var s1=live>0?sk(live):L.none, s2=tot(st.total);
  sec.innerHTML='<div class="wrap"><div class="panel dly"><div class="dly-top"><span class="dly-tag">'+both(L.head,l)+'</span>'+
   '<span class="dly-st">'+both(s1,l)+(st.total?'<small>'+pick(s2,l===('both')?'hi':l)+'</small>':'')+'</span></div>'+
   '<h3>'+both([t[0],t[1]],l)+'</h3><p>'+both([t[2],t[3]],l)+'</p>'+
   '<div class="dly-act"><button class="btn gold" type="button" id="dly-btn"'+(doneToday?' disabled':'')+'>'+(doneToday?both(["Done ✓","हो गया ✓"],l):both(L.btn,l))+'</button>'+
   '<span class="dly-note">'+(doneToday?both(L.done,l):both(L.note,l))+'</span></div></div></div>';
  var b=document.getElementById('dly-btn');
  if(b&&!doneToday)b.addEventListener('click',function(){
    var o=load(),d=dayNum();
    if(o.last===d)return;
    o.streak=(o.last===d-1)?o.streak+1:1;
    o.last=d;o.total=(o.total||0)+1;if(o.streak>(o.best||0))o.best=o.streak;
    save(o);render();
  });
}
function init(){
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  sec=document.createElement('section');sec.id='daily';sec.setAttribute('data-nolang','');sec.style.padding='22px 0 0';
  var ref=document.getElementById('path');
  if(ref&&ref.parentNode)ref.parentNode.insertBefore(sec,ref);else{var m=document.getElementById('top');if(!m)return;m.insertBefore(sec,m.firstChild)}
  render();
  var prev=window.__onLang;
  window.__onLang=function(l){if(prev){try{prev(l)}catch(e){}}render()};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
