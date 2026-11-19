(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff';
function mx(d,a,b){var m=-1e9;for(var k=a;k<=b;k++)if(d[k].h>m)m=d[k].h;return m}
function mn(d,a,b){var m=1e9;for(var k=a;k<=b;k++)if(d[k].l<m)m=d[k].l;return m}
function setH(d,ix,lv){ix.forEach(function(i){d[i].h=Math.max(lv,d[i].o,d[i].c)})}
function setL(d,ix,lv){ix.forEach(function(i){d[i].l=Math.min(lv,d[i].o,d[i].c)})}
function put(d,i,o,c,h,l,v){d[i]={o:o,c:c,h:h,l:l,v:v||(d[i]&&d[i].v)||100}}
var ZY='rgba(255,176,46,.16)',ZB='rgba(56,189,248,.16)',ZR='rgba(255,92,108,.14)';
/* liqwhat */
EX.liqwhat=[
{spec:[[100,30,.3],[101,5,.22],[99.7,5,.22],[101,5,.22],[99.7,5,.22],[101,5,.22],[99.7,5,.22]],seed:701,panel:null,
 patch:function(d){var HI=Math.max(d[34].h,d[44].h,d[54].h)+.1,LO=Math.min(d[39].l,d[49].l,d[59].l)-.1;setH(d,[34,44,54],HI);setL(d,[39,49,59],LO)},
 over:function(d){var HI=d[34].h,LO=d[39].l;return [{t:'zone',v1:HI,v2:HI+.9,col:ZY},{t:'zone',v1:LO-.9,v2:LO,col:ZB},{t:'h',v:HI,label:'Equal highs',col:CY,left:1},{t:'h',v:LO,label:'Equal lows',col:CB,left:1}]},
 marks:function(d){return [{i:44,up:1},{i:49}]},
 title:['Where orders wait in a range','रेंज में ऑर्डर कहाँ इंतज़ार करते हैं'],
 leg:[['Above the equal highs: stop-losses of sellers and buy orders of breakout traders.','बराबर ऊँचाई के ऊपर: बेचने वालों के स्टॉप-लॉस और ब्रेकआउट ट्रेडरों के ख़रीद ऑर्डर।'],['Below the equal lows: stop-losses of buyers and sell orders of breakdown traders.','बराबर नीचाई के नीचे: ख़रीदारों के स्टॉप-लॉस और ब्रेकडाउन ट्रेडरों के बिक्री ऑर्डर।'],['Orange and blue bands: the two crowded areas, called liquidity.','नारंगी और नीली पट्टी: भीड़ वाले दो इलाक़े, जिन्हें लिक्विडिटी कहते हैं।',CY]],
 take:['Orders gather at obvious highs and lows. Those crowded areas are what traders call liquidity.','ऑर्डर साफ़ दिखती ऊँचाई-नीचाई पर जमा होते हैं। भीड़ वाले उन इलाक़ों को ही ट्रेडर लिक्विडिटी कहते हैं।']},
{type:'bars',items:[{lab:'Above highs',v:9,txt:'9',col:CY},{lab:'Below lows',v:9,txt:'9',col:CB},{lab:'Round no.',v:6,txt:'6',col:CG},{lab:'Mid-range',v:2,txt:'2',col:CR}],title:['How crowded each place is (relative, example)','हर जगह कितनी भीड़ है (तुलनात्मक, उदाहरण)'],
 leg:[['Just beyond obvious highs and lows: the most stop orders.','साफ़ ऊँचाई-नीचाई के ठीक पार: सबसे ज़्यादा स्टॉप ऑर्डर।'],['Round numbers also attract orders.','राउंड नंबर भी ऑर्डर खींचते हैं।'],['The middle of a range has few orders waiting.','रेंज के बीच में कम ऑर्डर इंतज़ार करते हैं।']],
 take:['Think of orders like a crowd. They gather at landmarks, not evenly. Made-up numbers to show the idea.','ऑर्डरों को भीड़ की तरह सोचो। वे निशानियों पर जमा होते हैं, बराबर नहीं। विचार समझाने के लिए बनावटी संख्याएँ।']}];
FAQ.liqwhat=[
[['What is the difference between liquidity and volume?','लिक्विडिटी और वॉल्यूम में क्या फ़र्क़ है?'],['Volume is how much traded. Liquidity is how easily you can trade without moving the price. High volume usually means good liquidity, but not always.','वॉल्यूम यानी कितना ट्रेड हुआ। लिक्विडिटी यानी भाव हिलाए बिना कितनी आसानी से ट्रेड हो सकता है। ज़्यादा वॉल्यूम का मतलब आम तौर पर अच्छी लिक्विडिटी है, पर हमेशा नहीं।']],
[['Why does liquidity matter to a small trader?','छोटे ट्रेडर के लिए लिक्विडिटी क्यों मायने रखती है?'],['In thin markets you pay a wider spread and your stop can fill at a worse price. Liquid markets cost less to trade.','पतले बाज़ार में स्प्रेड ज़्यादा देना पड़ता है और स्टॉप बदतर भाव पर भर सकता है। लिक्विड बाज़ार में ट्रेड सस्ता पड़ता है।']],
[['Is smart money a real thing?','क्या स्मार्ट मनी सच में कुछ है?'],['It is a popular name for large traders. Nobody outside can see their orders, so treat these ideas as a way to read charts, not a promise.','यह बड़े ट्रेडरों के लिए लोकप्रिय नाम है। बाहर का कोई उनके ऑर्डर नहीं देख सकता, इसलिए इन विचारों को चार्ट पढ़ने का तरीका मानो, वादा नहीं।']]];
/* liqpool */
EX.liqpool=[
{spec:[[100,30,.3],[103,8,.3],[101.5,5,.22],[103,6,.22],[101.5,5,.22],[103,6,.22],[102,6,.22]],seed:711,panel:null,
 patch:function(d){var HI=Math.max(d[37].h,d[48].h,d[59].h)+.1;setH(d,[37,48,59],HI)},
 over:function(d){var HI=d[37].h;return [{t:'zone',v1:HI,v2:HI+1,col:ZY},{t:'h',v:HI,label:'Equal highs',col:CY,left:1}]},
 marks:function(d){return [{i:37,up:1},{i:48,up:1},{i:59,up:1}]},
 title:['Equal highs: a liquidity pool above','बराबर ऊँचाई: ऊपर लिक्विडिटी पूल'],
 leg:[['First touch of the high.','ऊँचाई की पहली छुअन।'],['Second touch at almost the same price. Traders now see a clear level.','लगभग उसी भाव पर दूसरी छुअन। ट्रेडरों को अब साफ़ स्तर दिखता है।'],['Third touch. More stops are now stacked just above.','तीसरी छुअन। अब ठीक ऊपर और ज़्यादा स्टॉप जमा हैं।'],['Orange band: where the stop and buy orders sit.','नारंगी पट्टी: जहाँ स्टॉप और ख़रीद ऑर्डर बैठे हैं।',CY]],
 take:['The more often a level is touched, the more orders pile up beyond it.','स्तर जितनी बार छुआ जाता है, उसके पार उतने ही ज़्यादा ऑर्डर जमा होते हैं।']},
{spec:[[100,30,.3],[107,8,.3],[109.4,6,.2],[108,4,.2],[109.5,5,.2],[108,4,.2],[109.4,5,.2]],seed:712,panel:null,
 patch:function(d){for(var i=S;i<d.length;i++){if(d[i].h>109.85)d[i].h=109.85;if(d[i].c>109.8)d[i].c=109.8;if(d[i].o>109.8)d[i].o=109.8}},
 over:function(d){return [{t:'zone',v1:110,v2:110.8,col:ZY},{t:'h',v:110,label:'Round number 110',col:CY,left:1}]},
 marks:function(d){var a=H.maxI(d,S,45),b=H.maxI(d,46,53),c=H.maxI(d,54,d.length-1);return [{i:a,up:1},{i:b,up:1},{i:c,up:1}]},
 title:['A round number attracts orders','राउंड नंबर ऑर्डर खींचता है'],
 leg:[['Price rises toward 110 and stalls just below it.','भाव 110 की तरफ़ चढ़ता है और उससे ठीक नीचे रुक जाता है।'],['Many traders place sell limits and stops at the round number.','कई ट्रेडर राउंड नंबर पर बिक्री लिमिट और स्टॉप रखते हैं।'],['Each touch fails near the same area. Orders are crowded there.','हर छुअन एक ही इलाक़े के पास नाकाम होती है। वहाँ ऑर्डरों की भीड़ है।']],
 take:['Round numbers like 100 or 50,000 are watched by many people. That makes them crowded.','100 या 50,000 जैसे राउंड नंबरों पर बहुत लोगों की नज़र रहती है। इसलिए वहाँ भीड़ होती है।']}];
FAQ.liqpool=[
[['How do I find equal highs?','बराबर ऊँचाई कैसे ढूँढूँ?'],['Look for two or three highs within a tiny distance of each other. Check on 1 hour or 4 hour charts. An older level watched by many is more important.','दो-तीन ऊँचाइयाँ देखो जो एक-दूसरे के बहुत पास हों। 1 घंटे या 4 घंटे के चार्ट पर जाँचो। पुराना स्तर, जिसे बहुत लोग देखते हैं, ज़्यादा मायने रखता है।']],
[['Are pools always swept?','क्या पूल हमेशा स्वीप होते हैं?'],['No. Sometimes price turns before touching them, and sometimes it breaks through and keeps going.','नहीं। कभी भाव उन्हें छूने से पहले ही पलट जाता है, और कभी तोड़कर आगे चलता रहता है।']],
[['Can I see how many stop orders are there?','क्या दिख सकता है कि वहाँ कितने स्टॉप ऑर्डर हैं?'],['Not exactly. In forex there is no public data. Crypto heatmaps give estimates. Mostly it is a guess from the chart.','ठीक-ठीक नहीं। फॉरेक्स में सार्वजनिक आँकड़े नहीं होते। क्रिप्टो हीटमैप अंदाज़ देते हैं। ज़्यादातर यह चार्ट से लगाया अंदाज़ है।']]];
/* liqsweep */
EX.liqsweep=[
{spec:[[100,30,.3],[103,8,.3],[101.6,5,.22],[103,6,.22],[101.6,5,.22],[102.6,3,.2],[99.4,8,.35]],seed:721,panel:'vol',
 patch:function(d){var HI=Math.max(d[37].h,d[48].h)+.15;setH(d,[37,48],HI);put(d,57,102.6,102.1,104.4,101.9,(d[57].v||100)*2.4);d[58].o=102.1},
 over:function(d){var HI=d[37].h;return [{t:'h',v:HI,label:'Equal highs',col:CY,left:1}]},
 marks:function(d){return [{i:37,up:1},{i:48,up:1},{i:57,up:1},{i:63}]},
 title:['Sweep above equal highs, then a fall','बराबर ऊँचाई के ऊपर स्वीप, फिर गिरावट'],
 leg:[['First high of the pool.','पूल की पहली ऊँचाई।'],['Second high at almost the same price. Buy stops pile up above.','लगभग उसी भाव पर दूसरी ऊँचाई। ऊपर ख़रीद स्टॉप जमा हो गए।'],['A long wick pokes above the pool, triggers the buy stops, but the candle closes back below. Volume jumps.','एक लंबी विक पूल के ऊपर निकलती है, ख़रीद स्टॉप चलाती है, पर कैंडल वापस नीचे बंद होती है। वॉल्यूम उछलता है।'],['Buyers who chased the breakout are trapped. Price falls.','ब्रेकआउट के पीछे दौड़े ख़रीदार फँस गए। भाव गिरता है।']],
 take:['The tell is a long wick and a close back inside the range. You only know after the candle closes.','पहचान है लंबी विक और रेंज के अंदर वापस क्लोज़। यह कैंडल बंद होने के बाद ही पता चलता है।']},
{spec:[[100,30,.3],[97,8,.3],[98.4,5,.22],[97,6,.22],[98.4,5,.22],[97.4,3,.2],[100.6,8,.35]],seed:722,panel:'vol',
 patch:function(d){var LO=Math.min(d[37].l,d[48].l)-.15;setL(d,[37,48],LO);put(d,57,97.4,97.9,98.1,95.6,(d[57].v||100)*2.4);d[58].o=97.9},
 over:function(d){var LO=d[37].l;return [{t:'h',v:LO,label:'Equal lows',col:CB,left:1}]},
 marks:function(d){return [{i:37},{i:48},{i:57},{i:63,up:1}]},
 title:['Sweep below equal lows, then a rise','बराबर नीचाई के नीचे स्वीप, फिर चढ़ाई'],
 leg:[['First low of the pool.','पूल की पहली नीचाई।'],['Second low at almost the same price. Sell stops pile up below.','लगभग उसी भाव पर दूसरी नीचाई। नीचे बिक्री स्टॉप जमा हो गए।'],['A long wick dips below the pool, triggers the sell stops, then the candle closes back above. Volume jumps.','एक लंबी विक पूल के नीचे जाती है, बिक्री स्टॉप चलाती है, फिर कैंडल वापस ऊपर बंद होती है। वॉल्यूम उछलता है।'],['Sellers who chased the breakdown are trapped. Price rises.','ब्रेकडाउन के पीछे दौड़े बेचने वाले फँस गए। भाव चढ़ता है।']],
 take:['It is the same picture mirrored. A wick beyond the level and a close back inside.','यह वही तस्वीर उल्टी तरफ़ की है। स्तर के पार विक और अंदर वापस क्लोज़।']},
{type:'bars',items:[{lab:'Reversed',v:6,txt:'6',col:CG},{lab:'Chopped',v:2,txt:'2',col:CY},{lab:'Kept going',v:2,txt:'2',col:CR}],title:['10 made-up spikes through a level','स्तर के पार 10 बनावटी उछाल'],
 leg:[['Many spikes return and reverse.','कई उछाल लौटकर पलट जाते हैं।'],['Some return and just go sideways.','कुछ लौटकर बस साइडवेज़ चलते हैं।'],['Some are real breakouts and keep going. Your stop protects you here.','कुछ असली ब्रेकआउट होते हैं और आगे चलते रहते हैं। यहाँ तुम्हारा स्टॉप बचाता है।']],
 take:['No pattern works every time. Waiting for the close and using a stop keeps the losses small. Made-up counts.','कोई भी पैटर्न हर बार नहीं चलता। कैंडल बंद होने का इंतज़ार और स्टॉप नुकसान छोटा रखते हैं। बनावटी गिनती।']}];
FAQ.liqsweep=[
[['How do I tell a sweep from a real breakout?','स्वीप और असली ब्रेकआउट में फ़र्क़ कैसे करूँ?'],['Look at the close and the time. A sweep closes back inside quickly. A breakout closes beyond and holds, often with a retest. Wait for the candle to close.','क्लोज़ और समय देखो। स्वीप जल्दी अंदर लौटकर बंद होता है। ब्रेकआउट पार बंद होकर टिकता है, अक्सर रीटेस्ट के साथ। कैंडल बंद होने का इंतज़ार करो।']],
[['Can I trade the sweep itself?','क्या स्वीप को ही ट्रेड कर सकते हैं?'],['Some traders do after the candle closes back inside. It needs a strict stop and demo practice. Guessing early is how many beginners lose.','कुछ ट्रेडर कैंडल के अंदर वापस बंद होने के बाद करते हैं। इसमें सख़्त स्टॉप और डेमो का अभ्यास चाहिए। जल्दी अंदाज़ा लगाना ही कई नए ट्रेडरों के नुकसान की वजह है।']],
[['Is someone hunting my stop?','क्या कोई मेरा स्टॉप हंट कर रहा है?'],['Large traders do not aim at you personally. Stops simply cluster at obvious levels, so price passing there fills them. Use a wider stop with a smaller position.','बड़े ट्रेडर तुम्हें निजी तौर पर निशाना नहीं बनाते। स्टॉप बस साफ़ स्तरों पर जमा होते हैं, इसलिए भाव वहाँ से गुज़रे तो वे भर जाते हैं। चौड़ा स्टॉप और छोटी पोज़िशन रखो।']]];
/* liqtrade */
EX.liqtrade=[
{spec:[[100,30,.3],[103,6,.22],[101,5,.22],[103,5,.22],[97.3,9,.3],[98.4,3,.2],[97.2,3,.2],[100.5,9,.3]],seed:731,panel:null,
 patch:function(d){setH(d,[35,45],Math.max(d[35].h,d[45].h)+.15);setL(d,[54,60],Math.min(d[54].l,d[60].l)-.1);put(d,61,97.2,97.5,97.7,95.9,(d[61].v||100)*2.2);put(d,62,97.5,98.2,98.4,97.4,(d[62].v||100)*1.4);d[63].o=98.2},
 over:function(d){var e=d[62].c,s=d[61].l-.3,t=mx(d,35,45);return [{t:'h',v:t,label:'Target: opposite pool',col:CG,left:1},{t:'h',v:e,label:'Entry',col:W},{t:'h',v:s,label:'Stop below the wick',col:CR,left:1}]},
 marks:function(d){return [{i:61},{i:62,up:1},{i:68,up:1}]},
 title:['A plan after a sweep of equal lows','बराबर नीचाई के स्वीप के बाद की योजना'],
 leg:[['Price sweeps below the equal lows and closes back inside.','भाव बराबर नीचाई के नीचे स्वीप करके अंदर वापस बंद होता है।'],['The next candle closes higher. Entry only after this confirmation. The stop sits under the wick.','अगली कैंडल ऊपर बंद होती है। एंट्री इसी पुष्टि के बाद। स्टॉप विक के नीचे।'],['The target is the opposite pool, the equal highs. Reward is about twice the risk.','टारगेट उल्टी तरफ़ का पूल, यानी बराबर ऊँचाई। रिवॉर्ड जोखिम का लगभग दोगुना।']],
 take:['Confirmation, a stop beyond the wick, and a target at the next pool. In this made-up example price reached the target. It will not every time.','पुष्टि, विक के पार स्टॉप, और अगले पूल पर टारगेट। इस बनावटी उदाहरण में भाव टारगेट तक पहुँचा। हर बार नहीं पहुँचेगा।']},
{type:'bars',items:[{lab:'Obvious stop',v:-.3,txt:'-0.3',col:CR},{lab:'Beyond zone',v:.1,txt:'+0.1',col:CY},{lab:'Plus close',v:.4,txt:'+0.4',col:CG}],title:['Average result per trade, in R (example)','हर ट्रेड का औसत नतीजा, R में (उदाहरण)'],
 leg:[['Stop right at the obvious level: it gets swept often.','स्टॉप ठीक साफ़ स्तर पर: वह अक्सर स्वीप हो जाता है।'],['A stop beyond the zone survives more sweeps.','क्षेत्र के पार का स्टॉप ज़्यादा स्वीप झेल लेता है।'],['Waiting for the close back inside filters many fake moves.','रेंज के अंदर वापस क्लोज़ का इंतज़ार कई झूठी चालें छाँट देता है।']],
 take:['Small improvements in stop placement and patience add up. Example numbers only.','स्टॉप की जगह और सब्र में छोटे सुधार जुड़कर बड़ा फ़र्क़ बनाते हैं। सिर्फ़ उदाहरण की संख्याएँ।']}];
FAQ.liqtrade=[
[['Does a wider stop mean a bigger loss?','क्या चौड़े स्टॉप का मतलब बड़ा नुकसान है?'],['No. A wider stop with a smaller position keeps the money at risk the same. The position size is what you change.','नहीं। चौड़ा स्टॉप और छोटी पोज़िशन जोखिम की रक़म वही रखते हैं। बदलना पोज़िशन का आकार है।']],
[['What if price never reverses?','अगर भाव कभी न पलटे तो?'],['Then the idea was wrong and you exit at your stop with a small loss. That is part of trading.','तब विचार गलत था और तुम स्टॉप पर छोटे नुकसान के साथ निकल जाते हो। यह ट्रेडिंग का हिस्सा है।']],
[['Should I use this on a 1 minute chart?','क्या इसे 1 मिनट के चार्ट पर इस्तेमाल करूँ?'],['Beginners should start on 1 hour or 4 hour charts. Small charts have many fake sweeps and higher costs.','नए ट्रेडर 1 घंटे या 4 घंटे के चार्ट से शुरू करें। छोटे चार्ट पर झूठे स्वीप ज़्यादा और लागत ज़्यादा होती है।']]];
/* liqsess */
EX.liqsess=[
{type:'bars',items:[{lab:'5:30a',v:35,txt:'35',col:CB},{lab:'9:30a',v:30,txt:'30',col:CB},{lab:'1:30p',v:70,txt:'70',col:CY},{lab:'6:30p',v:100,txt:'100',col:CG},{lab:'10:30p',v:65,txt:'65',col:CY},{lab:'3:30a',v:20,txt:'20',col:CR}],title:['Typical forex activity, 4-hour blocks from the time shown, Indian time (example)','फॉरेक्स की आम सरगर्मी, दिखाए समय से 4-4 घंटे के हिस्से, भारतीय समय (उदाहरण)'],
 leg:[['Asian hours: usually quieter.','एशियाई घंटे: आम तौर पर शांत।'],['London opens about 1:30 PM: activity rises.','लंदन लगभग दोपहर 1:30 बजे खुलता है: सरगर्मी बढ़ती है।'],['London and New York overlap about 6:30 to 10:30 PM: usually the busiest.','लंदन और न्यूयॉर्क का ओवरलैप लगभग शाम 6:30 से रात 10:30: आम तौर पर सबसे व्यस्त।'],['Late night: thin, spreads can widen.','देर रात: पतला बाज़ार, स्प्रेड चौड़ा हो सकता है।']],
 take:['Rough pattern with relative numbers, not exact data. Each day differs. Summer time shifts it by an hour.','मोटा पैटर्न है, तुलनात्मक संख्याओं के साथ, ठीक आँकड़े नहीं। हर दिन अलग होता है। गर्मी का समय इसे एक घंटा खिसका देता है।']},
{spec:[[100,30,.3],[100.4,12,.14],[99.8,12,.14],[98.8,16,.35]],seed:741,panel:'vol',
 patch:function(d){put(d,54,99.9,100.1,101.3,99.7,(d[54].v||100)*2.6);d[55].o=100.1},
 over:function(d){var h=mx(d,30,53),l=mn(d,30,53);return [{t:'box',i1:30,i2:53,v1:l,v2:h,col:ZB},{t:'v',i:54,label:'London open',col:CY}]},
 marks:function(d){return [{i:41},{i:54},{i:60}]},
 title:['The quiet range gets swept at the open','शांत रेंज खुलते ही स्वीप होती है'],
 leg:[['Quiet Asian-hours range. Stops sit above and below it.','शांत एशियाई घंटों की रेंज। उसके ऊपर और नीचे स्टॉप जमा हैं।'],['At the London open, volume jumps and a wick pokes above the range.','लंदन खुलते ही वॉल्यूम उछलता है और विक रेंज के ऊपर निकलती है।'],['Price returns inside and falls. A common pattern, never guaranteed.','भाव अंदर लौटकर गिरता है। आम पैटर्न है, पक्का कभी नहीं।']],
 take:['Liquidity arrives with the sessions. Quiet ranges are often tested when the busy hours begin. Made-up prices.','लिक्विडिटी सेशन के साथ आती है। व्यस्त घंटे शुरू होते ही शांत रेंज अक्सर परखी जाती हैं। बनावटी भाव।']}];
FAQ.liqsess=[
[['Which time is best for a beginner?','नए ट्रेडर के लिए कौन सा समय सबसे अच्छा है?'],['The overlap has the most liquidity but also fast moves. Choose a time you can watch calmly, practise on a demo, and stay away from the news minute until you are experienced.','ओवरलैप में सबसे ज़्यादा लिक्विडिटी होती है पर चालें भी तेज़। ऐसा समय चुनो जब तुम शांति से देख सको, डेमो पर अभ्यास करो, और अनुभव आने तक ख़बर के मिनट से दूर रहो।']],
[['Is crypto really open 24/7?','क्या क्रिप्टो सच में 24/7 खुला रहता है?'],['Yes, but weekends and late nights are thinner, so moves can be sharper.','हाँ, पर वीकेंड और देर रात पतले होते हैं, इसलिए चालें तीखी हो सकती हैं।']],
[['Does summer time change these hours?','क्या गर्मी का समय इन घंटों को बदलता है?'],['Yes, by about an hour when the UK and US change their clocks. Check the current opening times.','हाँ, लगभग एक घंटा, जब UK और US अपनी घड़ियाँ बदलते हैं। मौजूदा खुलने का समय जाँच लो।']]];
/* liqcrypto */
EX.liqcrypto=[
{spec:[[100,30,.3],[106,14,.3],[107,4,.25],[99,7,.5]],seed:751,panel:'vol',
 patch:function(d){for(var i=49;i<d.length;i++)d[i].v*=3;d[44].l=Math.min(d[44].l,105.4)},
 over:function(d){var L=mn(d,44,48);return [{t:'zone',v1:L-1.2,v2:L,col:ZR},{t:'h',v:L,label:'Liquidation zone',col:CR,left:1}]},
 marks:function(d){return [{i:40,up:1},{i:49},{i:52}]},
 title:['A liquidation cascade (made-up prices)','लिक्विडेशन कैस्केड (बनावटी भाव)'],
 leg:[['A long rally. Many traders open leveraged longs.','लंबी चढ़ाई। कई ट्रेडर लीवरेज वाले लॉन्ग खोलते हैं।'],['Price slips through support. The first leveraged longs hit their liquidation level.','भाव सपोर्ट के नीचे फिसलता है। पहले लीवरेज वाले लॉन्ग अपने लिक्विडेशन स्तर पर पहुँचते हैं।'],['Forced selling and a volume spike push price lower, which liquidates the next group.','ज़बरदस्ती की बिकवाली और वॉल्यूम का उछाल भाव को और नीचे धकेलते हैं, जिससे अगला समूह लिक्विडेट होता है।'],['Red band: where many liquidations are estimated to sit.','लाल पट्टी: जहाँ बहुत लिक्विडेशन होने का अंदाज़ा है।',CR]],
 take:['Forced orders feed on themselves. That is why leveraged markets can fall or rise very fast.','ज़बरदस्ती के ऑर्डर ख़ुद को ही हवा देते हैं। इसीलिए लीवरेज वाले बाज़ार बहुत तेज़ी से गिर या चढ़ सकते हैं।']},
{type:'bars',items:[{lab:'5x',v:20,txt:'~20%',col:CG},{lab:'10x',v:10,txt:'~10%',col:CG},{lab:'20x',v:5,txt:'~5%',col:CY},{lab:'50x',v:2,txt:'~2%',col:CR},{lab:'100x',v:1,txt:'~1%',col:CR}],title:['About how far price can move against you (approx.)','भाव तुम्हारे ख़िलाफ़ लगभग कितना जा सकता है (अंदाज़)'],
 leg:[['Low leverage leaves a lot of room.','कम लीवरेज बहुत जगह छोड़ता है।'],['At 50x, a normal 2% wobble can wipe you out.','50x पर सामान्य 2% का हिलना भी तुम्हें साफ़ कर सकता है।']],
 take:['Rough numbers before fees and margin rules. The higher the leverage, the closer your liquidation.','फ़ीस और मार्जिन नियमों से पहले के मोटे आँकड़े। लीवरेज जितना ऊँचा, लिक्विडेशन उतना पास।']}];
FAQ.liqcrypto=[
[['What is a short squeeze?','शॉर्ट स्क्वीज़ क्या है?'],['Price rises, short sellers hit their stops or liquidation, and their forced buying pushes price even higher.','भाव चढ़ता है, शॉर्ट बेचने वाले अपने स्टॉप या लिक्विडेशन पर पहुँचते हैं, और उनकी ज़बरदस्ती की ख़रीदारी भाव को और ऊपर धकेलती है।']],
[['How can I avoid being liquidated?','लिक्विडेट होने से कैसे बचूँ?'],['Use low leverage, place your stop well before the liquidation level, and keep spare margin. Never risk more than 1% of capital on a trade.','कम लीवरेज रखो, स्टॉप लिक्विडेशन स्तर से काफ़ी पहले रखो, और अतिरिक्त मार्जिन रखो। एक ट्रेड में पूँजी का 1% से ज़्यादा जोखिम मत लो।']],
[['Are liquidation heatmaps reliable?','क्या लिक्विडेशन हीटमैप भरोसेमंद हैं?'],['They are estimates built on assumptions about leverage and margin. Use them only as a hint.','ये लीवरेज और मार्जिन के अनुमानों पर बने अंदाज़ हैं। इन्हें सिर्फ़ इशारा मानो।']]];
})();
