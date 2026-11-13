(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff';
function mx(d,a,b){var m=-1e9;for(var k=a;k<=b;k++)if(d[k].h>m)m=d[k].h;return m}
/* engulf */
EX.engulf=[
{spec:[[100,30,.3],[90,12,.4],[99,12,.4]],seed:501,panel:null,
 patch:function(d){var p=d[39].c,v=(d[39].v||100)*1.6;d[40]={o:p,c:p-.9,h:p+.3,l:p-1.2,v:v};d[41]={o:p-1.3,c:p+2,h:p+2.3,l:p-1.6,v:v*1.5}},
 over:function(d){return [{t:'box',i1:40,i2:41,v1:d[40].l-.5,v2:d[41].h+.5,col:'rgba(255,176,46,.3)'}]},
 marks:function(d){return [{i:40},{i:41},{i:46,up:1}]},
 title:['Bullish engulfing after a fall','गिरावट के बाद बुलिश एंगल्फिंग'],
 leg:[['A small red candle at the end of a fall.','गिरावट के अंत में एक छोटी लाल कैंडल।'],['A big green candle opens below and closes above it. Its body covers the red one. Buyers took over.','एक बड़ी हरी कैंडल नीचे खुली और उसके ऊपर बंद हुई। उसका बॉडी लाल को ढक लेता है। ख़रीदारों ने क़ब्ज़ा किया।'],['Price turns up, but nobody can promise it will.','भाव ऊपर मुड़ा, पर इसका वादा कोई नहीं कर सकता।']],
 take:['An engulfing candle is a clue that sellers lost control. It works best at a support level. Wait for the close.','एंगल्फिंग कैंडल इशारा है कि बेचने वालों का क़ाबू गया। सपोर्ट पर सबसे अच्छा काम करती है। बंद होने का इंतज़ार करो।']},
{spec:[[100,30,.3],[90,12,.4],[99,12,.4]],seed:502,panel:null,
 patch:function(d){var p=d[39].c,v=(d[39].v||100)*1.8;d[40]={o:p,c:p+.4,h:p+.8,l:p-3.8,v:v}},
 over:function(d){return [{t:'h',v:d[40].l,label:'Low of the wick',col:CY}]},
 marks:function(d){return [{i:40},{i:46,up:1}]},
 title:['Pin bar (hammer) at the low','निचले स्तर पर पिन बार (हैमर)'],
 leg:[['A long lower wick: sellers pushed price far down, but buyers pushed it all the way back.','लंबी निचली विक: बेचने वालों ने भाव बहुत नीचे धकेला, पर ख़रीदार उसे वापस ऊपर ले आए।'],['Price then rises from there. Often, not always.','भाव वहाँ से चढ़ा। अक्सर, हमेशा नहीं।']],
 take:['A long wick shows a rejected price. Put your stop just beyond the wick tip, and keep the size small.','लंबी विक बताती है कि वह भाव ठुकरा दिया गया। स्टॉप विक की नोक के ठीक पार रखो, और साइज़ छोटा।']}];
FAQ.engulf=[
[['Do candle patterns always work?','क्या कैंडल पैटर्न हमेशा चलते हैं?'],['No. They are clues, not promises. Many fail, so use a stop-loss and look for them at support or resistance.','नहीं। ये इशारे हैं, वादे नहीं। कई फ़ेल होते हैं, इसलिए स्टॉप-लॉस रखो और इन्हें सपोर्ट या रेज़िस्टेंस पर देखो।']],
[['Which timeframe is best?','कौन सा टाइमफ्रेम सबसे अच्छा है?'],['Bigger timeframes like 4-hour and daily give fewer but more reliable patterns than 1-minute charts.','4 घंटे और डेली जैसे बड़े टाइमफ्रेम 1 मिनट के चार्ट से कम पर ज़्यादा भरोसेमंद पैटर्न देते हैं।']],
[['Should I enter before the candle closes?','क्या कैंडल बंद होने से पहले घुसूँ?'],['A candle can change shape until it closes. Waiting for the close avoids many false signals.','कैंडल बंद होने तक शक्ल बदल सकती है। बंद होने का इंतज़ार कई झूठे संकेतों से बचाता है।']]];
/* fakeout */
EX.fakeout=[
{spec:[[100,30,.3],[103,10,.3],[101,8,.3],[103,6,.3],[93,14,.5]],seed:511,panel:null,
 patch:function(d){var l=mx(d,30,51),v=(d[51].v||100)*2;d[52]={o:l-.6,c:l-1.4,h:l+2.2,l:l-1.8,v:v}},
 over:function(d){return [{t:'h',v:mx(d,30,51),label:'Resistance',col:CY,left:1}]},
 marks:function(d){return [{i:52},{i:58,up:1}]},
 title:['Price pokes above, then falls back','भाव ऊपर निकला, फिर लौट आया'],
 leg:[['The wick goes above resistance. Early buyers jump in. But the candle closes back below the line.','विक रेज़िस्टेंस के ऊपर गई। जल्दी वाले ख़रीदार कूद पड़े। पर कैंडल लाइन के नीचे ही बंद हुई।'],['Price falls. The trapped buyers sell in panic and push it down further.','भाव गिरा। फँसे ख़रीदार घबराकर बेचते हैं और उसे और नीचे धकेलते हैं।']],
 take:['Wait for a candle to close beyond the level. If price returns inside, get out fast.','स्तर के पार कैंडल बंद होने का इंतज़ार करो। भाव अंदर लौटे तो जल्दी निकलो।']},
{type:'bars',items:[{lab:'Early entry',v:-2,txt:'-2',col:CR},{lab:'Wait for close',v:-.4,txt:'-0.4',col:CY},{lab:'Wait + retest',v:1.5,txt:'+1.5',col:CG}],title:['Average result per trade (example)','हर ट्रेड का औसत नतीजा (उदाहरण)'],
 leg:[['Entering on the first touch gets trapped often.','पहले ही छूने पर घुसना अक्सर फँसाता है।'],['Waiting for the close removes many traps.','बंद होने का इंतज़ार कई जाल हटाता है।'],['Adding a retest filters more, at the cost of missing some moves.','रीटेस्ट जोड़ने से और छनता है, पर कुछ चालें छूट जाती हैं।']],
 take:['Patience costs a few missed moves but avoids many traps. Example numbers only.','सब्र से कुछ चालें छूटती हैं पर कई जाल बचते हैं। सिर्फ़ उदाहरण के आँकड़े।']}];
FAQ.fakeout=[
[['How do I know if a breakout is real?','कैसे जानूँ कि ब्रेकआउट असली है?'],['You cannot be sure. A strong close beyond the level, rising volume and a successful retest all help.','पक्का नहीं जान सकते। स्तर के पार मज़बूत क्लोज़, बढ़ता वॉल्यूम और सफल रीटेस्ट मदद करते हैं।']],
[['Why do fakeouts happen?','फेकआउट क्यों होते हैं?'],['Many stop-loss orders sit just beyond obvious levels. Price sweeps through them, then returns.','कई स्टॉप-लॉस साफ़ दिखते स्तरों के ठीक पार रखे होते हैं। भाव उन्हें झाड़कर वापस आ जाता है।']],
[['Can I trade the fakeout itself?','क्या फेकआउट को ही ट्रेड कर सकते हैं?'],['Some traders do, entering opposite after price falls back inside. It needs strict stops and practice on a demo.','कुछ ट्रेडर करते हैं, भाव अंदर लौटने पर उल्टी तरफ़ घुसकर। इसमें सख़्त स्टॉप और डेमो का अभ्यास चाहिए।']]];
/* orders */
EX.orders=[
{spec:[[100,30,.3],[102,10,.3],[100,10,.3],[105,10,.3]],seed:521,panel:null,
 over:function(d){var n=d[41].c;return [{t:'h',v:n,label:'Price now',col:W},{t:'h',v:n-2.5,label:'Limit buy',col:CG,left:1},{t:'h',v:n+2.5,label:'Stop buy',col:CB,left:1}]},
 marks:function(){return []},
 title:['Three orders around the price now','अभी के भाव के आसपास तीन ऑर्डर'],
 leg:[['White: a market order fills right here, right now.','सफ़ेद: मार्केट ऑर्डर ठीक यहीं, अभी भरता है।',W],['Green: a limit buy waits below. It fills only if price falls to it.','हरा: लिमिट बाय नीचे इंतज़ार करता है। भाव वहाँ तक गिरे तभी भरता है।',CG],['Blue: a stop buy waits above. It fires when price breaks up through it.','नीला: स्टॉप बाय ऊपर इंतज़ार करता है। भाव ऊपर तोड़े तो चल पड़ता है।',CB]],
 take:['Market = sure fill. Limit = sure price. Stop = a trigger. Pick by what matters more now.','मार्केट = भराव पक्का। लिमिट = भाव पक्का। स्टॉप = ट्रिगर। देखो अभी क्या ज़्यादा ज़रूरी है।']},
{type:'bars',items:[{lab:'Market',v:10,txt:'fills',col:CY},{lab:'Limit',v:4,txt:'maybe',col:CG},{lab:'Stop',v:8,txt:'on touch',col:CB}],title:['Chance the order gets filled (idea)','ऑर्डर भरने की संभावना (विचार)'],
 leg:[['Market: almost always fills, at whatever price is there.','मार्केट: लगभग हमेशा भरता है, जो भाव मिले उसी पर।'],['Limit: you get your price, but price may never come.','लिमिट: तुम्हारा भाव मिलता है, पर भाव शायद आए ही नहीं।'],['Stop: fills once touched, but may slip in a fast market.','स्टॉप: छूते ही भरता है, पर तेज़ बाज़ार में खिसक सकता है।']],
 take:['Bar heights are only an idea to compare, not real statistics.','डंडों की ऊँचाई सिर्फ़ तुलना का विचार है, असली आँकड़े नहीं।']}];
FAQ.orders=[
[['Which order should a beginner use?','नए ट्रेडर को कौन सा ऑर्डर इस्तेमाल करना चाहिए?'],['Use limit orders for entries when you can, and always a stop-loss. Market orders when speed matters.','एंट्री के लिए जहाँ हो सके लिमिट ऑर्डर, और स्टॉप-लॉस हमेशा। जब रफ़्तार ज़रूरी हो तब मार्केट।']],
[['Is a stop-loss a market order?','क्या स्टॉप-लॉस मार्केट ऑर्डर होता है?'],['Usually a stop becomes a market order once touched, so it can slip. A stop-limit sets a worst price but may not fill.','आम तौर पर स्टॉप छूते ही मार्केट ऑर्डर बन जाता है, इसलिए खिसक सकता है। स्टॉप-लिमिट में सबसे बुरा भाव तय होता है पर भर न भी सकता है।']],
[['Do orders cost different fees?','क्या ऑर्डर के हिसाब से फ़ीस अलग होती है?'],['On many exchanges limit orders pay lower fees than market orders. Check your exchange.','कई एक्सचेंज पर लिमिट ऑर्डर की फ़ीस मार्केट से कम होती है। अपने एक्सचेंज पर देखो।']]];
/* funding */
EX.funding=[
{type:'bars',items:[{lab:'00:00',v:.01,txt:'+.01',col:CG},{lab:'08:00',v:.01,txt:'+.01',col:CG},{lab:'16:00',v:.03,txt:'+.03',col:CY},{lab:'00:00',v:.05,txt:'+.05',col:CR},{lab:'08:00',v:-.02,txt:'-.02',col:CB}],title:['Funding rate every 8 hours, % (example)','हर 8 घंटे का फंडिंग रेट, % (उदाहरण)'],
 leg:[['Positive bars: longs pay shorts. The crowd is leaning long.','पॉज़िटिव डंडे: लॉन्ग शॉर्ट को देते हैं। भीड़ लॉन्ग की तरफ़ झुकी है।'],['Taller bar = a more crowded side, and a bigger fee.','ऊँचा डंडा = ज़्यादा भीड़, और बड़ी फ़ीस।'],['Negative bar: shorts pay longs.','नेगेटिव डंडा: शॉर्ट लॉन्ग को देते हैं।']],
 take:['Funding shows which side is crowded. It is not a buy or sell signal by itself. Example numbers only.','फंडिंग दिखाती है कि किस तरफ़ भीड़ है। यह अकेले ख़रीदने-बेचने का सिग्नल नहीं। सिर्फ़ उदाहरण के आँकड़े।']},
{type:'bars',items:[{lab:'1 day',v:.09,txt:'0.09%',col:CG},{lab:'1 week',v:.63,txt:'0.63%',col:CY},{lab:'1 month',v:2.7,txt:'2.7%',col:CR}],title:['Cost of holding a long at +0.03% (example)','+0.03% पर लॉन्ग रखने की लागत (उदाहरण)'],
 leg:[['Three payments a day: 3 x 0.03% = 0.09% of position size.','दिन में तीन भुगतान: 3 x 0.03% = पोज़िशन साइज़ का 0.09%।'],['A week: 0.63%.','एक हफ़्ता: 0.63%।'],['A month: about 2.7%. At 10x leverage that is about 27% of your margin.','एक महीना: लगभग 2.7%। 10x लीवरेज पर यह मार्जिन का लगभग 27% है।']],
 take:['Small fees add up when you hold a leveraged position for long. Check the rate before holding.','लीवरेज वाली पोज़िशन लंबे समय रखो तो छोटी फ़ीस जुड़ती जाती है। रखने से पहले रेट देखो।']}];
FAQ.funding=[
[['Who gets the funding money?','फंडिंग का पैसा किसे मिलता है?'],['Other traders, not the exchange. Longs pay shorts when funding is positive, shorts pay longs when it is negative.','दूसरे ट्रेडर्स को, एक्सचेंज को नहीं। पॉज़िटिव होने पर लॉन्ग शॉर्ट को देते हैं, नेगेटिव पर शॉर्ट लॉन्ग को।']],
[['Do I pay if I close before the funding time?','अगर फंडिंग समय से पहले बंद करूँ तो क्या देना पड़ता है?'],['Usually no. Funding is charged only to positions open at the funding time. Check your exchange.','आम तौर पर नहीं। फंडिंग सिर्फ़ उस समय खुली पोज़िशन पर लगती है। अपने एक्सचेंज पर देखो।']],
[['Does spot trading have funding?','क्या स्पॉट ट्रेडिंग में फंडिंग होती है?'],['No. Funding exists only in perpetual futures.','नहीं। फंडिंग सिर्फ़ परपेचुअल फ्यूचर्स में होती है।']]];
/* drawdown */
EX.drawdown=[
{type:'bars',items:[{lab:'-10%',v:11,txt:'+11%',col:CG},{lab:'-20%',v:25,txt:'+25%',col:CG},{lab:'-33%',v:50,txt:'+50%',col:CY},{lab:'-50%',v:100,txt:'+100%',col:CR},{lab:'-75%',v:300,txt:'+300%',col:CR}],title:['Gain needed to get back to even','बराबरी पर लौटने के लिए चाहिए मुनाफ़ा'],
 leg:[['Each bar: the loss on the label, and the gain needed to recover it.','हर डंडा: लेबल पर घाटा, और उसे पूरा करने के लिए ज़रूरी मुनाफ़ा।'],['A 20% loss needs 25%. Still reachable.','20% घाटे को 25% चाहिए। अभी पहुँच में है।'],['A 50% loss needs 100%. Double your money.','50% घाटे को 100% चाहिए। पैसा दोगुना करना।'],['A 75% loss needs 300%. Almost out of reach.','75% घाटे को 300% चाहिए। लगभग पहुँच से बाहर।']],
 take:['The formula is gain = loss / (1 - loss). Protect capital first. Profit comes second.','सूत्र: मुनाफ़ा = घाटा / (1 - घाटा)। पहले पूंजी बचाओ। मुनाफ़ा बाद में।']},
{type:'bars',items:[{lab:'Risk 1%',v:-9.6,txt:'-9.6%',col:CG},{lab:'Risk 2%',v:-18.3,txt:'-18.3%',col:CY},{lab:'Risk 5%',v:-40.1,txt:'-40.1%',col:CR},{lab:'Risk 10%',v:-65.1,txt:'-65.1%',col:CR}],title:['Account after 10 losses in a row','लगातार 10 घाटों के बाद अकाउंट'],
 leg:[['Risking 1% per trade: ten losses cost about 9.6%. You are still in the game.','हर ट्रेड में 1% जोखिम: दस घाटे लगभग 9.6% खाते हैं। तुम अब भी खेल में हो।'],['Risking 10% per trade: the same streak cost about 65%.','हर ट्रेड में 10% जोखिम: वही सिलसिला लगभग 65% खा गया।']],
 take:['Losing streaks happen to everyone. Small risk per trade makes them survivable.','घाटे का सिलसिला सबके साथ होता है। हर ट्रेड में छोटा जोखिम उसे सहने लायक़ बनाता है।']}];
FAQ.drawdown=[
[['What is a normal drawdown?','सामान्य ड्रॉडाउन कितना होता है?'],['It depends on the strategy, but many traders aim to keep it under 10 to 20% and stop or reduce size if it goes beyond.','यह रणनीति पर निर्भर है, पर कई ट्रेडर इसे 10 से 20% के नीचे रखना चाहते हैं और उससे आगे जाए तो रुकते हैं या साइज़ घटाते हैं।']],
[['What should I do in a drawdown?','ड्रॉडाउन में क्या करूँ?'],['Reduce size or pause, review your journal, and do not try to win it back fast.','साइज़ घटाओ या रुक जाओ, जर्नल देखो, और उसे जल्दी वापस जीतने की कोशिश मत करो।']],
[['Is the formula the same for all assets?','क्या सूत्र हर एसेट के लिए एक है?'],['Yes. It is plain arithmetic: gain needed = loss divided by (1 minus loss).','हाँ। यह सीधा गणित है: ज़रूरी मुनाफ़ा = घाटा भाग (1 घटा घाटा)।']]];
/* overtrade */
EX.overtrade=[
{type:'bars',items:[{lab:'2 trades',v:.2,txt:'0.2%',col:CG},{lab:'10 trades',v:1,txt:'1%',col:CY},{lab:'30 trades',v:3,txt:'3%',col:CR},{lab:'100 trades',v:10,txt:'10%',col:CR}],title:['Cost per day at 0.1% per trade (example)','हर ट्रेड 0.1% पर, रोज़ की लागत (उदाहरण)'],
 leg:[['Each trade pays a fee and spread. Here, 0.1% of the position.','हर ट्रेड पर फ़ीस और स्प्रेड लगता है। यहाँ पोज़िशन का 0.1%।'],['10 trades a day: 1% gone before any move.','रोज़ 10 ट्रेड: कोई चाल आने से पहले ही 1% गया।'],['100 trades: 10% of the position size paid as cost.','100 ट्रेड: पोज़िशन साइज़ का 10% लागत में गया।']],
 take:['More trades means more cost. Your strategy must first beat the fees. Example numbers only.','ज़्यादा ट्रेड मतलब ज़्यादा लागत। तुम्हारी रणनीति को पहले फ़ीस को हराना होगा। सिर्फ़ उदाहरण के आँकड़े।']},
{type:'bars',items:[{lab:'A-setups',v:6,txt:'+6',col:CG},{lab:'B-setups',v:1,txt:'+1',col:CY},{lab:'Bored trades',v:-5,txt:'-5',col:CR}],title:['Result by trade type, one month (example)','ट्रेड के प्रकार से नतीजा, एक महीना (उदाहरण)'],
 leg:[['Trades that matched the plan fully: the profit came from here.','जो ट्रेड प्लान से पूरे मेल खाते थे: मुनाफ़ा यहीं से आया।'],['Half-matching trades: about even.','आधे मेल वाले ट्रेड: लगभग बराबर।'],['Trades taken out of boredom or to win back a loss: they ate the profit.','ऊब में या घाटा वापस जीतने को लिए गए ट्रेड: इन्होंने मुनाफ़ा खा लिया।']],
 take:['Cutting the bored trades alone would have raised the result. Your journal shows which type you take.','सिर्फ़ ऊब वाले ट्रेड काटने से नतीजा बढ़ जाता। तुम्हारा जर्नल दिखाता है कि तुम कौन सा प्रकार लेते हो।']}];
FAQ.overtrade=[
[['How many trades a day is too many?','दिन में कितने ट्रेड ज़्यादा हैं?'],['It depends on your plan. Write a maximum in your plan, for example 3 trades, and stop when you hit it.','यह प्लान पर निर्भर है। प्लान में अधिकतम लिखो, जैसे 3 ट्रेड, और वहाँ पहुँचकर रुक जाओ।']],
[['What is revenge trading?','रिवेंज ट्रेडिंग क्या है?'],['Taking a quick, bigger trade right after a loss to win it back. It usually makes the loss larger.','घाटे के तुरंत बाद उसे वापस जीतने के लिए जल्दी में बड़ा ट्रेड लेना। इससे आम तौर पर घाटा और बढ़ता है।']],
[['How do I stop overtrading?','ओवरट्रेडिंग कैसे रोकूँ?'],['Set a daily trade and loss limit, take breaks, and log every trade in the journal.','रोज़ के ट्रेड और घाटे की सीमा तय करो, ब्रेक लो, और हर ट्रेड जर्नल में लिखो।']]];
})();
