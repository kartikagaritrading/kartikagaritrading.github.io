(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff';
function atr(d,i,n){var s=0,k;for(k=Math.max(1,i-n+1);k<=i;k++)s+=Math.max(d[k].h-d[k].l,Math.abs(d[k].h-d[k-1].c),Math.abs(d[k].l-d[k-1].c));return s/Math.min(n,i)}
function trail(d){var t=[],m=-1e9;for(var i=0;i<d.length;i++){var v=d[i].c-2*atr(d,i,14);if(i>=S&&v>m)m=v;t.push(i<S?v:m)}return t}
/* styles */
EX.styles=[
{spec:[[100,30,.4],[104,6,.3],[103,4,.3],[112,40,.5],[108,12,.4]],seed:401,panel:null,
 over:function(d){var a=d[36].c;return [{t:'box',i1:36,i2:38,v1:a-1,v2:a+1.2,col:'rgba(255,176,46,.35)'},{t:'box',i1:45,i2:66,v1:d[45].l-.5,v2:d[66].h+.5,col:'rgba(56,189,248,.12)'},{t:'line',pts:[[S+1,d[S+1].c],[d.length-1,d[d.length-1].c]],col:CG,dash:1}]},
 marks:function(d){return [{i:37,nov:1},{i:56,nov:1},{i:S+12,nov:1}]},
 title:['One chart, three ways to trade it','एक चार्ट, ट्रेड करने के तीन तरीके'],
 leg:[['Scalping: a few candles, minutes. Many trades, costs matter.','स्कैल्पिंग: कुछ ही कैंडल, मिनट। ट्रेड बहुत, लागत मायने रखती है।'],['Swing: days to weeks, the blue box. Fewer trades, bigger target.','स्विंग: दिन से हफ़्ते, नीला डिब्बा। ट्रेड कम, टारगेट बड़ा।'],['Position: months, the green line. Almost no daily watching.','पोज़िशन: महीने, हरी लाइन। रोज़ देखने की ज़रूरत लगभग नहीं।']],
 take:['The best style is the one that fits your free time and nerves, not the one that looks exciting.','सबसे अच्छा स्टाइल वह है जो तुम्हारे खाली समय और मन के हिसाब से बैठे, वह नहीं जो रोमांचक लगे।']},
{type:'bars',items:[{lab:'Scalp',v:5,txt:'many',col:CY},{lab:'Day',v:2,txt:'some',col:CB},{lab:'Swing',v:1,txt:'few',col:CG},{lab:'Position',v:.3,txt:'rare',col:'#a78bfa'}],title:['Trades per week, roughly','हर हफ़्ते लगभग कितने ट्रेड'],
 leg:[['Scalping: many trades, screen time all day.','स्कैल्पिंग: बहुत ट्रेड, दिन भर स्क्रीन।'],['Day trading: a few each day, closed before night.','डे ट्रेडिंग: रोज़ कुछ, रात से पहले बंद।'],['Swing: a few a week, hold for days.','स्विंग: हफ़्ते में कुछ, दिनों तक रखो।'],['Position: a few a year.','पोज़िशन: साल में कुछ।']],
 take:['A job or study usually fits swing better than scalping. Start slower, learn first.','नौकरी या पढ़ाई के साथ आम तौर पर स्विंग स्कैल्पिंग से ज़्यादा जमता है। धीमे शुरू करो, पहले सीखो।']}];
FAQ.styles=[
[['Which style should a beginner pick?','नए ट्रेडर को कौन सा स्टाइल चुनना चाहिए?'],['Many start with swing on the 4-hour or daily chart: time to think, fewer costs. Scalping needs speed and low fees.','कई लोग 4 घंटे या डेली चार्ट पर स्विंग से शुरू करते हैं: सोचने का समय, कम लागत। स्कैल्पिंग में तेज़ी और कम फ़ीस चाहिए।']],
[['Can I mix styles?','क्या स्टाइल मिला सकता हूँ?'],['Yes, but keep one main style first. Use the big chart for direction, the small one for entry (see Multi-timeframe).','हाँ, पर पहले एक मुख्य स्टाइल रखो। दिशा के लिए बड़ा चार्ट, एंट्री के लिए छोटा (मल्टी-टाइमफ़्रेम देखो)।']],
[['Which makes the most money?','किससे सबसे ज़्यादा कमाई होती है?'],['None by itself. Results come from your edge, risk control and discipline.','अपने आप कोई नहीं। नतीजा तुम्हारी बढ़त, रिस्क कंट्रोल और अनुशासन से आता है।']]];
/* slip */
EX.slip=[
{spec:[[100,30,.3],[103,12,.3],[96,12,.4]],seed:411,panel:null,patch:function(d){var e=36,s=d[e].c-2,o=s-3;d[43]={o:o,c:o-.4,h:o+.4,l:o-1.4,v:200}},
 over:function(d){var e=36,s=d[e].c-2;return [{t:'h',v:d[e].c,label:'Entry',col:W},{t:'h',v:s,label:'Your stop',col:CR},{t:'h',v:s-3,label:'Real fill',col:CY,left:1}]},
 marks:function(d){return [{i:36},{i:43}]},
 title:['The price jumped over your stop','भाव तुम्हारे स्टॉप के ऊपर से कूद गया'],
 leg:[['Entry long, stop set just below.','लॉन्ग एंट्री, स्टॉप ठीक नीचे।'],['Bad news hits at night. Price opens far below your stop. You are filled at the first available price, not at your stop.','रात में बुरी ख़बर आई। भाव तुम्हारे स्टॉप से बहुत नीचे खुला। तुम्हारा सौदा स्टॉप पर नहीं, पहले उपलब्ध भाव पर कटा।']],
 take:['That gap between your stop and the real fill is slippage. A stop limits risk, but does not guarantee the exact price.','स्टॉप और असली भाव का यह फ़र्क स्लिपेज है। स्टॉप रिस्क घटाता है, पर सटीक भाव की गारंटी नहीं देता।']},
{type:'bars',items:[{lab:'Planned',v:-2,txt:'-2',col:CB},{lab:'Calm fill',v:-2.1,txt:'-2.1',col:CY},{lab:'Gap fill',v:-5,txt:'-5',col:CR}],title:['Same stop, different fills (example)','वही स्टॉप, अलग भराव (उदाहरण)'],
 leg:[['The loss you planned.','जो घाटा तुमने सोचा था।'],['Normal market: tiny slippage.','सामान्य बाज़ार: बहुत छोटा स्लिपेज।'],['After a gap or news: a much bigger loss.','गैप या ख़बर के बाद: कहीं बड़ा घाटा।']],
 take:['So keep position size small enough that even a bigger-than-planned loss will not hurt.','इसलिए साइज़ इतना छोटा रखो कि योजना से बड़ा घाटा भी चोट न पहुँचाए।']}];
FAQ.slip=[
[['What is slippage?','स्लिपेज क्या है?'],['The difference between the price you expected and the price you actually got. It happens in fast markets.','जिस भाव की उम्मीद थी और जिस पर असल में सौदा हुआ, उसका फ़र्क। तेज़ बाज़ार में होता है।']],
[['How do I reduce it?','इसे कैसे घटाऊँ?'],['Avoid big news, trade liquid markets, and use limit orders when you can.','बड़ी ख़बर से बचो, ज़्यादा कारोबार वाले बाज़ार में ट्रेड करो, और जहाँ हो सके लिमिट ऑर्डर लगाओ।']],
[['What is a gap?','गैप क्या है?'],['When a market closes at one price and opens at a very different one, leaving an empty space on the chart. Common after weekends and big news.','जब बाज़ार एक भाव पर बंद होकर बहुत अलग भाव पर खुलता है और चार्ट पर खाली जगह बनती है। वीकेंड और बड़ी ख़बर के बाद आम है।']]];
/* trail */
EX.trail=[
{spec:[[100,30,.4],[130,45,.7],[117,15,.6]],seed:421,panel:null,
 over:function(d){return [{t:'ma',arr:trail(d),col:CR}]},
 marks:function(d){var t=trail(d),e=S+4,k=H.fi(d.length,function(i){return d[i].l<=t[i]},e+8);return [{i:e},{i:k<0?d.length-1:k},{i:d.length-1}]},
 title:['The stop follows price up, never down','स्टॉप भाव के साथ ऊपर चलता है, नीचे कभी नहीं'],
 leg:[['Red line = trailing stop. It sits below price and only moves up.','लाल लाइन = ट्रेलिंग स्टॉप। भाव के नीचे रहती है और सिर्फ़ ऊपर खिसकती है।',CR],['Entry long in a rising trend.','बढ़ते ट्रेंड में लॉन्ग एंट्री।'],['Price turns down and touches the red line: exit, with most of the profit kept.','भाव पलटा और लाल लाइन छू गया: बाहर, ज़्यादातर मुनाफ़ा बचा।'],['Without a trail, you would have given back much more.','ट्रेल न होता तो काफ़ी मुनाफ़ा लौटा देते।']],
 take:['A trailing stop lets winners run while protecting gains. Here it is set 2 x ATR below price.','ट्रेलिंग स्टॉप जीत को चलने देता है और मुनाफ़ा बचाता है। यहाँ यह भाव से 2 x ATR नीचे है।']},
{spec:[[100,30,.4],[108,15,.8],[104,25,.8],[120,20,.6]],seed:422,panel:null,
 over:function(d){return [{t:'ma',arr:trail(d),col:CR}]},
 marks:function(d){var t=trail(d),e=S+4,k=H.fi(d.length,function(i){return d[i].l<=t[i]},e+8);return [{i:e},{i:k<0?d.length-1:k,up:0},{i:d.length-1,up:1}]},
 title:['The cost: a pullback can stop you out','कीमत: एक पुलबैक आपको बाहर कर सकता है'],
 leg:[['Entry.','एंट्री।'],['A normal dip touches the trail. You are out, with a small gain.','सामान्य गिरावट ने ट्रेल छू लिया। छोटे मुनाफ़े पर बाहर।'],['Price later rallies much higher. No method is perfect.','बाद में भाव काफ़ी ऊपर गया। कोई तरीका पूरा परफ़ेक्ट नहीं।']],
 take:['A tight trail protects profit but exits early. A loose trail holds longer but gives back more. Choose what suits you.','पास का ट्रेल मुनाफ़ा बचाता है पर जल्दी निकालता है। दूर का ट्रेल देर तक रखता है पर ज़्यादा लौटाता है। अपने हिसाब से चुनो।']}];
FAQ.trail=[
[['When do I start trailing?','ट्रेल कब शुरू करूँ?'],['Many wait until price has moved in profit by about the size of the risk (1R), then trail.','कई लोग तब तक रुकते हैं जब तक भाव रिस्क जितना (1R) मुनाफ़े में न चला जाए, फिर ट्रेल करते हैं।']],
[['Trail or fixed target?','ट्रेल या तय टारगेट?'],['A fixed target takes profit at a known spot. A trail lets a big move run. Test both on a demo.','तय टारगेट जानी-पहचानी जगह मुनाफ़ा लेता है। ट्रेल बड़ी चाल को चलने देता है। दोनों डेमो में परखो।']],
[['Can I trail by hand?','क्या हाथ से ट्रेल कर सकता हूँ?'],['Yes: move the stop below each new higher low. That is a structure-based trail.','हाँ: हर नए हायर लो के नीचे स्टॉप खिसकाओ। यह स्ट्रक्चर वाला ट्रेल है।']]];
/* regime */
EX.regime=[
{spec:[[100,30,.4],[127,50,.5]],seed:431,panel:null,over:function(d,I){return [{t:'ma',arr:I.e50,col:CB}]},marks:function(d){return [{i:S+6,up:1},{i:S+30,up:1},{i:d.length-1,up:1}]},
 title:['Trending market','ट्रेंड वाला बाज़ार'],
 leg:[['Blue line = 50-candle average. It slopes clearly upward.','नीली लाइन = 50 कैंडल का औसत। साफ़ ऊपर की ढलान।',CB],['Price stays above it.','भाव उसके ऊपर रहता है।'],['Dips are shallow and bounce.','गिरावट उथली और उछलने वाली।'],['Higher highs and higher lows continue.','ऊँची चोटियाँ और ऊँचे निचले स्तर चलते रहे।']],
 take:['In a trend, use trend tools: moving averages, pullbacks, breakouts, trailing stops.','ट्रेंड में ट्रेंड वाले औज़ार: मूविंग एवरेज, पुलबैक, ब्रेकआउट, ट्रेलिंग स्टॉप।']},
{spec:[[100,30,.4],[103,6,.3],[97,6,.3],[103,6,.3],[97,6,.3],[103,6,.3],[97,6,.3],[103,6,.3],[100,6,.3]],seed:432,panel:null,over:function(d,I){return [{t:'ma',arr:I.e50,col:CB}]},marks:function(d){return [{i:S+6,up:1},{i:S+12},{i:S+18,up:1}]},
 title:['Ranging market','रेंज वाला बाज़ार'],
 leg:[['Blue line is almost flat.','नीली लाइन लगभग सपाट।',CB],['Price crosses it again and again.','भाव उसे बार-बार काटता है।'],['Highs and lows stay in the same band.','ऊँचे और नीचे एक ही पट्टी में रहते हैं।'],['Each push up fades.','हर चढ़ाई ठंडी पड़ती है।']],
 take:['In a range, trend tools lose. Use support and resistance, or stay out.','रेंज में ट्रेंड के औज़ार हारते हैं। सपोर्ट-रेज़िस्टेंस इस्तेमाल करो, या बाहर रहो।']}];
FAQ.regime=[
[['How do I tell trend from range quickly?','ट्रेंड और रेंज जल्दी कैसे पहचानूँ?'],['Look at the slope of the 50 average and whether highs and lows keep stepping the same way. Flat and tangled means range.','50 औसत की ढलान देखो और क्या ऊँचे-नीचे एक ही दिशा में सीढ़ी बना रहे हैं। सपाट और उलझा हुआ यानी रेंज।']],
[['Why do my strategies stop working?','मेरी रणनीतियाँ चलना क्यों बंद कर देती हैं?'],['Often the market switched between trend and range, and the strategy suits only one.','अक्सर बाज़ार ट्रेंड से रेंज में बदल गया और रणनीति सिर्फ़ एक के लिए बनी थी।']],
[['What if I cannot tell?','अगर पहचान न पाऊँ तो?'],['Then skip it. Not trading is a valid trade.','तो छोड़ दो। ट्रेड न करना भी सही ट्रेड है।']]];
/* corr */
EX.corr=[
{type:'lines',series:function(){var r=H.rng(5),a=[100],b=[100],c=[100],k,g;for(k=1;k<=40;k++){g=H.gauss(r)*1.2;a.push(a[k-1]*(1+g/100));b.push(b[k-1]*(1+(g*.9+H.gauss(r)*.4)/100));c.push(c[k-1]*(1+H.gauss(r)*1.2/100))}return [{v:a,col:CY,end:'Coin A'},{v:b,col:CB,end:'Coin B'},{v:c,col:'#93a1bd',end:'Unrelated'}]},base:100,
 title:['Two assets that move together','दो एसेट जो साथ-साथ चलते हैं'],
 leg:[['Yellow and blue rise and fall almost together (correlated).','पीली और नीली लगभग साथ चढ़ती-गिरती हैं (कोरिलेटेड)।',CY],['Grey line moves on its own (unrelated).','धूसर लाइन अपनी अलग चलती है (असंबंधित)।','#93a1bd']],
 take:['Buying both yellow and blue is almost one trade twice.','पीली और नीली दोनों ख़रीदना लगभग एक ही ट्रेड दो बार करना है।']},
{type:'bars',items:[{lab:'1 trade',v:-1,txt:'-1%',col:CB},{lab:'3 together',v:-3,txt:'-3%',col:CR},{lab:'3 split',v:-1,txt:'-1%',col:CG}],title:['If all trades go wrong at once','अगर सारे ट्रेड एक साथ ग़लत जाएँ'],
 leg:[['One trade risking 1%.','एक ट्रेड, 1% रिस्क।'],['Three trades, 1% each, all on coins that move together: a 3% hit in one move.','तीन ट्रेड, हर एक 1%, सब साथ चलने वाले कॉइन पर: एक चाल में 3% की चोट।'],['Same three, but each risks only 0.33%: back to about 1%.','वही तीन, पर हर एक सिर्फ़ 0.33% रिस्क: फिर करीब 1%।']],
 take:['Count correlated trades as one when you add up your risk.','रिस्क जोड़ते समय साथ चलने वाले ट्रेडों को एक गिनो।']}];
FAQ.corr=[
[['Which things are correlated?','कौन सी चीज़ें साथ चलती हैं?'],['Most crypto coins follow Bitcoin. EUR/USD and GBP/USD often move alike because both are against the dollar.','ज़्यादातर क्रिप्टो कॉइन बिटकॉइन के पीछे चलते हैं। EUR/USD और GBP/USD अक्सर एक जैसे चलते हैं क्योंकि दोनों डॉलर के ख़िलाफ़ हैं।']],
[['Is correlation always the same?','क्या कोरिलेशन हमेशा एक जैसा रहता है?'],['No. It changes, and in a panic many things fall together.','नहीं। यह बदलता रहता है, और घबराहट में बहुत सारी चीज़ें साथ गिरती हैं।']],
[['How do I use this?','इसका इस्तेमाल कैसे करूँ?'],['Before a new trade, ask: do I already hold something that moves like this? If yes, cut the size.','नया ट्रेड लेने से पहले पूछो: क्या मेरे पास पहले से ऐसा कुछ है जो इसके जैसा चलता है? हाँ तो साइज़ घटाओ।']]];
/* jrnl */
function jr(skip){var r=[1,-1,2,-1,1,-1,2,1,-1,2,-1,1,-1,2,-1,1,2,-1,1,2],bad=[3,7,12,16],a=[100],k;for(k=0;k<r.length;k++){var v=r[k];if(bad.indexOf(k)>=0)v=skip?0:-1.5;a.push(a[k]*(1+v/100))}return a}
EX.jrnl=[
{type:'bars',items:[{lab:'Early entry',v:6,txt:'6',col:CR},{lab:'FOMO',v:4,txt:'4',col:CY},{lab:'Moved stop',v:3,txt:'3',col:CB},{lab:'No plan',v:2,txt:'2',col:'#a78bfa'}],title:['What a journal can show (example)','जर्नल क्या दिखा सकता है (उदाहरण)'],
 leg:[['Entered before the signal: 6 times.','सिग्नल से पहले घुसे: 6 बार।'],['Chased a jump: 4 times.','उछाल के पीछे दौड़े: 4 बार।'],['Moved the stop: 3 times.','स्टॉप खिसकाया: 3 बार।'],['Traded without a plan: 2 times.','बिना प्लान ट्रेड: 2 बार।']],
 take:['You cannot fix what you do not count. After 20 trades the same mistake usually stands out.','जो गिना नहीं, उसे सुधार नहीं सकते। 20 ट्रेड बाद वही ग़लती अक्सर सामने आ जाती है।']},
{type:'lines',series:function(){return [{v:jr(true),col:CG,end:'No mistakes'},{v:jr(false),col:CR,end:'As traded'}]},base:100,
 title:['The same 20 trades, with and without 4 mistakes','वही 20 ट्रेड, 4 ग़लतियों के साथ और बिना'],
 leg:[['Red: your real results, with 4 trades that broke the plan.','लाल: असली नतीजे, जिनमें 4 ट्रेड प्लान के ख़िलाफ़ थे।',CR],['Green: the same trades with those 4 simply skipped.','हरा: वही ट्रेड, उन 4 को छोड़कर।',CG]],
 take:['Fixing a few repeated mistakes can matter more than finding a new strategy. Example numbers only.','कुछ बार-बार होने वाली ग़लतियाँ ठीक करना नई रणनीति ढूँढने से ज़्यादा काम आ सकता है। सिर्फ़ उदाहरण के आँकड़े।']}];
FAQ.jrnl=[
[['What do I write in the journal?','जर्नल में क्या लिखूँ?'],['Date, market, why you entered, stop, target, result, and one line on how you felt. Use the Journal on this site.','तारीख़, बाज़ार, एंट्री का कारण, स्टॉप, टारगेट, नतीजा, और एक लाइन कि कैसा महसूस हुआ। इस साइट का जर्नल इस्तेमाल करो।']],
[['When do I review it?','इसे कब देखूँ?'],['Every Sunday, and after every 20 trades. Look for repeated mistakes, not single losses.','हर रविवार, और हर 20 ट्रेड के बाद। बार-बार की ग़लतियाँ देखो, अकेले घाटे नहीं।']],
[['Do I need to log demo trades?','क्या डेमो ट्रेड भी लिखूँ?'],['Yes. Habits form on demo too.','हाँ। आदतें डेमो में भी बनती हैं।']]];
})();
