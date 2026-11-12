(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff',GR='#93a1bd';
function bb(d,I){var c=I.c,m=[],u=[],l=[];for(var i=0;i<c.length;i++){var a=Math.max(0,i-19),s=0,n=i-a+1,k;for(k=a;k<=i;k++)s+=c[k];var mu=s/n,v=0;for(k=a;k<=i;k++)v+=(c[k]-mu)*(c[k]-mu);var sd=Math.sqrt(v/n);m.push(mu);u.push(mu+2*sd);l.push(mu-2*sd)}return {m:m,u:u,l:l}}
function bbo(d,I){var b=bb(d,I);return [{t:'ma',arr:b.u,col:CB},{t:'ma',arr:b.l,col:CB},{t:'ma',arr:b.m,col:CY}]}
function atr(d,i,n){var s=0;for(var k=i-n+1;k<=i;k++)s+=Math.max(d[k].h-d[k].l,Math.abs(d[k].h-d[k-1].c),Math.abs(d[k].l-d[k-1].c));return s/n}
/* bollinger */
EX.bollinger=[
{spec:[[100,30,.4],[100,22,.15],[100,6,.15],[109,10,.7],[113,12,.4]],seed:301,panel:null,over:bbo,
 marks:function(d,I){var b=bb(d,I),k=H.fi(d.length,function(i){return d[i].c>b.u[i]},58);return [{i:50},{i:k<0?62:k,up:1},{i:d.length-1,up:1}]},
 title:['The squeeze: bands pinch, then price breaks out','स्क्वीज़: बैंड सिकुड़े, फिर भाव निकला'],
 leg:[['Blue lines = upper and lower band, yellow = 20-candle average.','नीली लाइनें = ऊपरी और निचला बैंड, पीली = 20 कैंडल का औसत।',CB],['Quiet market: bands are close together (a squeeze).','शांत बाज़ार: बैंड पास-पास (स्क्वीज़)।'],['Price closes above the upper band: a big move has started.','भाव ऊपरी बैंड के ऊपर बंद हुआ: बड़ी चाल शुरू हो गई।'],['The move continues. A squeeze does not say the direction, only that a move may be near.','चाल आगे चली। स्क्वीज़ दिशा नहीं बताता, बस इशारा करता है कि चाल नज़दीक हो सकती है।']],
 take:['Narrow bands = quiet. Quiet markets often get loud. Wait for the close outside the band to see which way.','पतले बैंड = शांति। शांत बाज़ार अक्सर शोर करता है। दिशा जानने के लिए बैंड के बाहर बंद भाव का इंतज़ार करो।']},
{spec:[[100,30,.4],[126,50,.6]],seed:302,panel:null,over:bbo,
 marks:function(d,I){var b=bb(d,I),o=[],last=-9;for(var i=S+4;i<d.length&&o.length<3;i++)if(d[i].h>=b.u[i]&&i-last>=8){o.push({i:i,up:1});last=i}return o},
 title:['Strong uptrend: price rides the upper band','मज़बूत अपट्रेंड: भाव ऊपरी बैंड पर चलता रहा'],
 leg:[['Price touches the upper band.','भाव ऊपरी बैंड को छूता है।'],['Touches it again and keeps rising.','फिर छूता है और चढ़ता रहता है।'],['Again. Selling at each touch would have meant selling a strong trend.','फिर से। हर टच पर बेचना मतलब मज़बूत ट्रेंड के ख़िलाफ़ बेचना होता।']],
 take:['Touching the upper band is not a sell signal. In a strong trend price can ride it for long.','ऊपरी बैंड को छूना बेचने का संकेत नहीं है। मज़बूत ट्रेंड में भाव उस पर देर तक चल सकता है।']}];
FAQ.bollinger=[
[['Does touching the upper band mean price will fall?','ऊपरी बैंड छूने का मतलब भाव गिरेगा?'],['No. See Chart 2. In a strong trend it just keeps riding the band. Check the trend first.','नहीं। चार्ट 2 देखो। मज़बूत ट्रेंड में भाव बैंड पर ही चलता रहता है। पहले ट्रेंड देखो।']],
[['What do the default numbers 20 and 2 mean?','डिफ़ॉल्ट 20 और 2 का क्या मतलब?'],['20 = average of the last 20 candles. 2 = bands sit 2 standard deviations away (a measure of how much price swings). Most traders keep these.','20 = पिछली 20 कैंडल का औसत। 2 = बैंड 2 स्टैंडर्ड डेविएशन (भाव कितना झूलता है इसका नाप) दूर रहते हैं। ज़्यादातर ट्रेडर यही रखते हैं।']],
[['Do Bollinger Bands work in a sideways market?','क्या साइडवेज़ बाज़ार में बोलिंगर बैंड चलते हैं?'],['Often better there: price tends to turn back from the bands. But a squeeze can break out any time, so use a stop.','वहाँ अक्सर बेहतर: भाव बैंड से पलटता है। पर स्क्वीज़ कभी भी टूट सकता है, इसलिए स्टॉप रखो।']]];
/* divergence */
function dv(d,I,dir){var a=dir?H.maxI(d,38,48):H.minI(d,38,48),b=dir?H.maxI(d,58,68):H.minI(d,58,68);return [a,b]}
EX.divergence=[
{spec:[[100,30,.4],[88,14,.5],[93,8,.4],[86,12,.3],[98,16,.4]],seed:2,panel:'rsi',
 over:function(d){var a=H.minI(d,38,48),b=H.minI(d,58,68);return [{t:'line',pts:[[a,d[a].l],[b,d[b].l]],col:CR,dash:1}]},
 marks:function(d){return [{i:H.minI(d,38,48)},{i:H.minI(d,58,68)},{i:d.length-1,up:1}]},
 title:['Bullish divergence: price lower low, RSI higher low','बुलिश डायवर्जेंस: भाव में लोअर लो, RSI में हायर लो'],
 leg:[['First low of the fall. RSI is very low here.','गिरावट का पहला निचला स्तर। यहाँ RSI बहुत नीचे।'],['Price makes a LOWER low, but RSI makes a HIGHER low. The fall has less force.','भाव ने और नीचा लो बनाया, पर RSI ने ऊँचा लो। गिरावट में ज़ोर कम है।'],['Price turned up afterwards.','बाद में भाव ऊपर मुड़ा।']],
 take:['Price says "lower", momentum says "weaker". That mismatch is a warning that sellers are tiring.','भाव कहता है "और नीचे", ज़ोर कहता है "कमज़ोर"। यह बेमेल चेतावनी है कि बेचने वाले थक रहे हैं।']},
{spec:[[100,30,.4],[112,14,.5],[107,8,.4],[114,12,.3],[102,16,.4]],seed:2,panel:'rsi',
 over:function(d){var a=H.maxI(d,38,48),b=H.maxI(d,58,68);return [{t:'line',pts:[[a,d[a].h],[b,d[b].h]],col:CR,dash:1}]},
 marks:function(d){return [{i:H.maxI(d,38,48),up:1},{i:H.maxI(d,58,68),up:1},{i:d.length-1}]},
 title:['Bearish divergence: price higher high, RSI lower high','बेयरिश डायवर्जेंस: भाव में हायर हाई, RSI में लोअर हाई'],
 leg:[['First high. RSI is high.','पहली चोटी। RSI ऊँचा।'],['Price makes a HIGHER high, but RSI a LOWER high. The rise is weakening.','भाव ने ऊँची चोटी बनाई, पर RSI ने नीची। चढ़ाई कमज़ोर हो रही है।'],['Price fell afterwards.','बाद में भाव गिरा।']],
 take:['Divergence is a hint, not a signal. Many divergences fail in strong trends. Wait for a break of structure.','डायवर्जेंस इशारा है, संकेत नहीं। मज़बूत ट्रेंड में कई फ़ेल होते हैं। स्ट्रक्चर टूटने का इंतज़ार करो।']}];
FAQ.divergence=[
[['Is divergence a buy signal?','क्या डायवर्जेंस खरीदने का संकेत है?'],['No, it is an early warning. Wait for price to confirm, for example a break of the last high, and use a stop.','नहीं, यह शुरुआती चेतावनी है। भाव की पुष्टि का इंतज़ार करो, जैसे पिछली चोटी का टूटना, और स्टॉप रखो।']],
[['Which indicators show divergence?','कौन से इंडिकेटर में डायवर्जेंस दिखता है?'],['RSI and MACD are the most common. Start with RSI, as in the charts.','RSI और MACD सबसे आम हैं। चार्ट की तरह RSI से शुरू करो।']],
[['Why does divergence fail so often?','डायवर्जेंस इतना फ़ेल क्यों होता है?'],['In a strong trend momentum can stay weak while price still pushes on. That is why a stop and confirmation matter.','मज़बूत ट्रेंड में ज़ोर कमज़ोर रहकर भी भाव आगे बढ़ सकता है। इसीलिए स्टॉप और पुष्टि ज़रूरी हैं।']]];
/* atr */
EX.atr=[
{spec:[[100,30,.25],[100,16,.25],[104,24,1.1]],seed:311,panel:null,
 marks:function(d){return [{i:S+10},{i:d.length-6,up:1}]},
 title:['The same market, calm then wild','वही बाज़ार, पहले शांत फिर तेज़'],
 leg:[['Calm period: candles are small. Average range is small.','शांत दौर: कैंडल छोटी। औसत रेंज छोटी।'],['Wild period: candles are several times bigger.','तेज़ दौर: कैंडल कई गुना बड़ी।']],
 take:['ATR = average candle range. It tells how much price normally moves, so you can place a stop that fits the market.','ATR = कैंडल की औसत रेंज। यह बताता है कि भाव आम तौर पर कितना हिलता है, ताकि स्टॉप बाज़ार के हिसाब से रखो।']},
{spec:[[100,30,.9],[106,40,.9]],seed:3,panel:null,
 over:function(d){var e=36,A=atr(d,e,14);return [{t:'h',v:d[e].c,label:'Entry',col:W},{t:'h',v:d[e].c-1,label:'Fixed stop',col:CR},{t:'h',v:d[e].c-2*A,label:'2 x ATR stop',col:CG}]},
 marks:function(d){var e=36,f=d[e].c-1,h=H.fi(d.length,function(i){return d[i].l<=f},e+1);return [{i:e},{i:h},{i:d.length-1,up:1}]},
 title:['A fixed stop vs an ATR stop','तय स्टॉप बनाम ATR वाला स्टॉप'],
 leg:[['Entry long in a jumpy market.','उछल-कूद वाले बाज़ार में लॉन्ग एंट्री।'],['A normal wiggle hits the fixed stop (red). Stopped out early.','सामान्य हिलने से तय स्टॉप (लाल) लग गया। जल्दी बाहर।'],['The green stop, set 2 x ATR away, was never touched, and price ended higher.','हरा स्टॉप, 2 x ATR दूर, कभी छुआ नहीं गया, और भाव ऊपर पहुँचा।']],
 take:['A wider stop means smaller position size (see Position sizing), but it lives through normal noise.','चौड़ा स्टॉप यानी छोटा साइज़ (पोज़िशन साइज़िंग देखो), पर वह सामान्य शोर झेल जाता है।']}];
FAQ.atr=[
[['What ATR multiplier should I use?','ATR का कितना गुना लूँ?'],['Many start with 1.5 to 2 times ATR for the stop. Test it on a demo, do not copy blindly.','कई लोग स्टॉप के लिए 1.5 से 2 गुना ATR से शुरू करते हैं। डेमो में परखो, आँख बंद कर नक़ल मत करो।']],
[['Does ATR give direction?','क्या ATR दिशा बताता है?'],['No. It only measures how big the moves are, not up or down.','नहीं। यह सिर्फ़ चाल का आकार नापता है, ऊपर या नीचे नहीं।']],
[['How is it different from a fixed stop?','यह तय स्टॉप से कैसे अलग है?'],['A fixed stop ignores the market mood. ATR adapts: wider when wild, tighter when calm. See Chart 2.','तय स्टॉप बाज़ार का मूड नहीं देखता। ATR ढल जाता है: तेज़ में चौड़ा, शांत में पास। चार्ट 2 देखो।']]];
/* plan */
EX.plan=[
{spec:[[100,30,.4],[104,8,.3],[101.5,7,.3],[104,3,.3],[111,22,.5]],seed:321,panel:null,
 over:function(d){var a=H.minI(d,44,54),e=a+2,p=d[e].c;return [{t:'zone',v1:d[a].l-.3,v2:d[a].l+.5,col:'rgba(43,217,138,.18)'},{t:'h',v:p-2,label:'Stop',col:CR},{t:'h',v:p+6,label:'Target',col:CG},{t:'h',v:p,label:'Entry',col:W}]},
 marks:function(d){var a=H.minI(d,44,54),e=a+2,t=d[e].c+6,k=H.fi(d.length,function(i){return d[i].h>=t},e+1);return [{i:a},{i:e,up:1},{i:k<0?d.length-1:k,up:1}]},
 title:['A trade written before it happens','ट्रेड होने से पहले लिखा हुआ प्लान'],
 leg:[['Setup: price pulls back to a support zone (green).','सेटअप: भाव सपोर्ट ज़ोन (हरा) तक पुलबैक में आया।'],['Entry after a candle shows buyers. Stop (red) below, target (green line) above, written down in advance.','खरीदारों को दिखाती कैंडल के बाद एंट्री। स्टॉप (लाल) नीचे, टारगेट (हरी लाइन) ऊपर, पहले से लिखा हुआ।'],['Target reached. The plan did the thinking, not your mood.','टारगेट पूरा हुआ। सोच प्लान ने की, तुम्हारे मूड ने नहीं।']],
 take:['Before you click buy, you should be able to answer: why, where is my stop, where is my target, how much size.','खरीदने से पहले ये जवाब तैयार हों: क्यों, स्टॉप कहाँ, टारगेट कहाँ, साइज़ कितना।']},
{type:'lines',series:function(){var r=[-1,-1,2,-1,2,-1,-1,2,2,-1,-1,2,-1,2,-1,-1,2,-1,2,2],a=[100],k;for(k=0;k<r.length;k++)a.push(a[k]*(1+r[k]/100));return [{v:a,col:CG,end:'~107'}]},base:100,
 title:['20 trades with a plan: 11 losses, still up','प्लान के साथ 20 ट्रेड: 11 घाटे, फिर भी खाता ऊपर'],
 leg:[['Risk 1% per trade, target twice the risk. 9 wins and 11 losses.','हर ट्रेड में 1% रिस्क, टारगेट रिस्क का दुगना। 9 जीत और 11 घाटे।',CG],['The account still ends around 7% higher. Example numbers, not a promise.','फिर भी खाता करीब 7% ऊपर। उदाहरण के आँकड़े हैं, वादा नहीं।']],
 take:['Losses are part of the plan. What matters is that each loss is small and each win is bigger.','घाटे प्लान का हिस्सा हैं। मायने यह रखता है कि हर घाटा छोटा हो और हर जीत बड़ी।']}];
FAQ.plan=[
[['What should a trading plan contain?','ट्रेडिंग प्लान में क्या होना चाहिए?'],['Which market and timeframe, your entry rule, your stop rule, your target, your risk per trade, and when you will not trade.','कौन सा बाज़ार और टाइमफ़्रेम, एंट्री का नियम, स्टॉप का नियम, टारगेट, हर ट्रेड का रिस्क, और कब ट्रेड नहीं करोगे।']],
[['Should I change the plan after a loss?','घाटे के बाद प्लान बदल दूँ?'],['Not right after one loss. Review after 20 or more trades with your Journal, then change one thing at a time.','एक घाटे के तुरंत बाद नहीं। जर्नल से 20 या ज़्यादा ट्रेड के बाद जाँचो, फिर एक बार में एक ही चीज़ बदलो।']],
[['Do I write it on paper?','क्या इसे काग़ज़ पर लिखूँ?'],['Yes. A written plan is much harder to break in a heated moment than one in your head.','हाँ। लिखा प्लान जोश के पल में तोड़ना सिर में रखे प्लान से कहीं मुश्किल है।']]];
/* spread */
EX.spread=[
{type:'lines',series:function(){var r=H.rng(9),b=[],a=[],p=100,k,s;for(k=0;k<40;k++){p+=H.gauss(r)*.12;s=(k>=22&&k<=27)?1.6:.2;b.push(p);a.push(p+s)}return [{v:a,col:CR,end:'Buy price'},{v:b,col:CG,end:'Sell price'}]},split:22,
 title:['The gap between buy and sell price','खरीद और बिक्री भाव के बीच का फ़र्क'],
 leg:[['Red = price you BUY at. Green = price you SELL at. The gap is the spread.','लाल = जिस भाव पर तुम ख़रीदते हो। हरा = जिस भाव पर बेचते हो। यह फ़र्क स्प्रेड है।',CR],['Normal time: gap is tiny.','सामान्य समय: फ़र्क बहुत छोटा।'],['Right after the dashed line (big news): the gap widens a lot, so entering costs more.','डैश लाइन के बाद (बड़ी ख़बर): फ़र्क बहुत बढ़ा, यानी एंट्री महँगी।']],
 take:['The moment you buy, you are already slightly down by the spread. It is a cost on every trade.','ख़रीदते ही तुम स्प्रेड जितना थोड़ा नीचे होते हो। यह हर ट्रेड पर लगने वाली लागत है।']},
{type:'bars',items:[{lab:'Gross win',v:100,txt:'+100',col:CG},{lab:'Spread',v:-20,txt:'-20',col:CR},{lab:'Fees',v:-20,txt:'-20',col:CR},{lab:'You keep',v:60,txt:'+60',col:CB}],title:['Costs eat the profit (example numbers)','लागत मुनाफ़े को खा जाती है (उदाहरण के आँकड़े)'],
 leg:[['Say you made 100 from many small trades.','मान लो कई छोटे ट्रेड से 100 कमाए।'],['Spread cost across those trades.','उन ट्रेडों में स्प्रेड की लागत।'],['Broker fees and commission.','ब्रोकर की फ़ीस और कमीशन।'],['What is left is only 60.','बचा सिर्फ़ 60।']],
 take:['The more often you trade, the more costs add up. Short-term scalping needs very low costs.','जितना ज़्यादा ट्रेड, उतनी ज़्यादा लागत। बहुत छोटे समय के स्कैल्पिंग में लागत बहुत कम होनी चाहिए।']}];
FAQ.spread=[
[['Why is my trade negative as soon as I enter?','एंट्री लेते ही मेरा ट्रेड नेगेटिव क्यों?'],['Because you pay the spread: you buy at the higher price but the position is valued at the lower sell price.','क्योंकि तुम स्प्रेड देते हो: ऊँचे भाव पर ख़रीदते हो पर पोज़िशन की क़ीमत नीचे वाले बिक्री भाव से लगती है।']],
[['When is the spread widest?','स्प्रेड सबसे ज़्यादा कब?'],['Around big news, at market open and close, and in thin markets late at night.','बड़ी ख़बरों के आसपास, बाज़ार खुलने-बंद होने के समय, और रात की सुस्त घड़ियों में।']],
[['How do I pick a broker or exchange?','ब्रोकर या एक्सचेंज कैसे चुनूँ?'],['Compare spread, fees, withdrawal rules and whether it is regulated. Use a demo first.','स्प्रेड, फ़ीस, पैसे निकालने के नियम और रेगुलेशन की जाँच करो। पहले डेमो इस्तेमाल करो।']]];
/* session */
EX.session=[
{type:'bars',items:[{lab:'Asia',v:1,txt:'low',col:CB},{lab:'London',v:2,txt:'mid',col:CY},{lab:'Overlap',v:3,txt:'high',col:CR},{lab:'NY late',v:2,txt:'mid',col:'#a78bfa'}],title:['Rough activity in forex through the day','दिन भर फॉरेक्स की मोटी हलचल'],
 leg:[['Asia (about 5:30 am to 1:30 pm IST): usually calmer for EUR/USD.','एशिया (भारतीय समय लगभग सुबह 5:30 से दोपहर 1:30): EUR/USD के लिए आम तौर पर शांत।'],['London (about 1:30 pm to 6:30 pm IST): activity picks up.','लंदन (लगभग दोपहर 1:30 से शाम 6:30): हलचल बढ़ती है।'],['London + New York together (about 6:30 pm to 10:30 pm IST): usually the busiest.','लंदन + न्यूयॉर्क साथ (लगभग शाम 6:30 से रात 10:30): आम तौर पर सबसे ज़्यादा हलचल।'],['New York late: slows down toward the close.','न्यूयॉर्क का आख़िर: बंद होने की ओर धीमा।']],
 take:['Rough idea only. Times shift by about an hour when US or UK clocks change. Crypto trades 24 hours, but also gets busier when the US is awake.','सिर्फ़ मोटा अंदाज़ा। अमेरिका या ब्रिटेन की घड़ी बदलने पर समय करीब एक घंटा खिसकता है। क्रिप्टो 24 घंटे चलता है, पर अमेरिका के जागने पर वह भी तेज़ होता है।']},
{spec:[[100,30,.2],[100,18,.2],[103,10,.5],[108,22,.8]],seed:331,panel:null,
 over:function(d){return [{t:'v',i:S+18,col:CY,label:'London'},{t:'v',i:S+28,col:CR,label:'New York'}]},
 marks:function(d){return [{i:S+8,nov:1},{i:S+23,up:1,nov:1},{i:d.length-1,up:1}]},
 title:['A quiet market wakes up with the sessions','सेशन के साथ शांत बाज़ार जागता है'],
 leg:[['Quiet hours: small candles, little movement.','शांत घंटे: छोटी कैंडल, कम हलचल।'],['London opens: candles get bigger.','लंदन खुला: कैंडल बड़ी होने लगीं।'],['New York joins: the biggest moves.','न्यूयॉर्क जुड़ा: सबसे बड़ी चाल।']],
 take:['Pick the hours when your market moves. Trading a sleepy hour with a fast strategy gives few good trades.','वे घंटे चुनो जब तुम्हारा बाज़ार चलता है। सुस्त घंटे में तेज़ रणनीति से अच्छे ट्रेड कम मिलते हैं।']}];
FAQ.session=[
[['Which time is best for a beginner?','नए ट्रेडर के लिए कौन सा समय अच्छा?'],['Many prefer the London session when moves are clear but not too wild. Avoid trading right at big news.','कई लोग लंदन सेशन पसंद करते हैं जब चाल साफ़ होती है पर ज़्यादा तेज़ नहीं। बड़ी ख़बर के ठीक समय ट्रेड से बचो।']],
[['Does crypto have sessions?','क्या क्रिप्टो में सेशन होते हैं?'],['It never closes, but activity still rises when the US and Europe are awake.','यह कभी बंद नहीं होता, फिर भी अमेरिका और यूरोप के जागने पर हलचल बढ़ती है।']],
[['Why is Sunday night gap/volatile?','रविवार रात उछल-कूद क्यों?'],['Forex reopens after the weekend, and spreads can be wide for the first minutes. Be patient.','वीकेंड के बाद फॉरेक्स खुलता है और शुरू के मिनटों में स्प्रेड चौड़ा हो सकता है। सब्र रखो।']]];
})();
