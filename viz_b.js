(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff',GR='#93a1bd';
function nz(a,f){var r=H.fi(a.length,f);return r<0?a.length-1:r}
function trade(e0,sd,td){return function(d){var p=d[e0].c,s=p-sd,t=p+td,n=d.length-1;return [{t:'box',i1:e0,i2:n,v1:p,v2:t,col:'rgba(43,217,138,.15)'},{t:'box',i1:e0,i2:n,v1:s,v2:p,col:'rgba(255,92,108,.15)'},{t:'h',v:p,label:'Entry',col:W},{t:'h',v:s,label:'Stop',col:CR},{t:'h',v:t,label:'Target',col:CG}]}}
function C(i,o,c,h,l){return function(d){var x=d[i];x.o=o;x.c=c;x.h=h;x.l=l}}
function GRc(){return GR}
function mx(d,a,b){return d[H.maxI(d,a,b)].h}
function mn(d,a,b){return d[H.minI(d,a,b)].l}
/* risk */
function ser(){var a=[100],b=[100];for(var k=1;k<=10;k++){a.push(a[k-1]*.99);b.push(b[k-1]*.9)}return [{v:a,col:CG,end:'1% risk: ~90'},{v:b,col:CR,end:'10% risk: ~35'}]}
EX.risk=[
{type:'lines',series:ser,base:100,title:['Same 10 losses in a row, two risk sizes','एक जैसे लगातार 10 घाटे, दो अलग रिस्क'],
 leg:[['Risking 1% per trade: account falls only from 100 to about 90.','हर ट्रेड में 1% रिस्क: खाता 100 से सिर्फ़ करीब 90 तक गिरा।',CG],['Risking 10% per trade: account falls from 100 to about 35.','हर ट्रेड में 10% रिस्क: खाता 100 से करीब 35 तक गिरा।',CR]],
 take:['Losing streaks happen to everyone. Small risk lets you survive one.','लगातार घाटे सबके साथ होते हैं। छोटा रिस्क तुम्हें इनसे बचा लेता है।']},
{type:'bars',items:[{lab:'lose 10%',v:11,txt:'+11%',col:CB},{lab:'lose 20%',v:25,txt:'+25%',col:CY},{lab:'lose 50%',v:100,txt:'+100%',col:'#f97316'},{lab:'lose 80%',v:400,txt:'+400%',col:CR}],title:['How much you need to earn back','वापस पाने के लिए कितना कमाना पड़ेगा'],
 leg:[['After a 10% loss you need +11%.','10% घाटे के बाद +11% चाहिए।'],['After 20%: +25%.','20% के बाद: +25%।'],['After 50%: +100%, the account must double.','50% के बाद: +100%, खाता दोगुना करना होगा।'],['After 80%: +400%. Almost no way back.','80% के बाद: +400%। लौटना लगभग नामुमकिन।']],
 take:['Big losses are far harder to repair than small ones. So protect the account first.','बड़े घाटे की भरपाई छोटे से कहीं मुश्किल है। इसलिए पहले खाता बचाओ।']}];
FAQ.risk=[
[['How much should I risk per trade?','हर ट्रेड में कितना रिस्क लूँ?'],['Many learners stay at 1% or less of the account. See Chart 1 for why. This is a common rule of thumb, not advice.','कई सीखने वाले खाते का 1% या कम रखते हैं। कारण चार्ट 1 में है। यह आम नियम है, सलाह नहीं।']],
[['Can I just risk more to grow faster?','ज़्यादा रिस्क लेकर जल्दी बढ़ा लूँ?'],['Higher risk grows losses faster too. Chart 2 shows how hard recovery gets.','ज़्यादा रिस्क से घाटा भी तेज़ी से बढ़ता है। चार्ट 2 में दिखता है कि भरपाई कितनी मुश्किल होती है।']],
[['What if I lose 5 trades in a row?','लगातार 5 ट्रेड हार जाऊँ तो?'],['At 1% risk you are down about 5%. Stop for the day, review your trades, trade small again.','1% रिस्क पर करीब 5% नीचे। उस दिन रुक जाओ, ट्रेड जाँचो, फिर छोटे साइज़ से करो।']]];
/* sl */
function slc(d,e){var p=d[e].c,s=p-3,t=p+6;return [{t:'box',i1:e,i2:d.length-1,v1:p,v2:t,col:'rgba(43,217,138,.15)'},{t:'box',i1:e,i2:d.length-1,v1:s,v2:p,col:'rgba(255,92,108,.15)'},{t:'h',v:p,label:'Entry',col:W},{t:'h',v:s,label:'Stop',col:CR}]}
EX.sl=[
{spec:[[100,30,.5],[101,6,.4],[93,25,.6]],seed:71,panel:null,over:function(d){return slc(d,S+6)},
 marks:function(d){var e=S+6,s=d[e].c-3,h=H.fi(d.length,function(i){return d[i].l<=s},e+1);return [{i:e},{i:h<0?d.length-1:h},{i:d.length-1}]},
 title:['Stop-loss cuts the loss','स्टॉप-लॉस घाटा काट देता है'],
 leg:[['Entry long. Stop set 3 below, so the planned loss is 3.','लॉन्ग एंट्री। स्टॉप 3 नीचे, यानी तय घाटा 3।'],['Price hits the stop: trade closes with the small loss.','भाव स्टॉप तक पहुँचा: ट्रेड छोटे घाटे पर बंद।'],['Without a stop, you would still be inside and the loss would be much bigger.','स्टॉप न होता तो तुम अब भी अंदर होते और घाटा काफ़ी बड़ा होता।']],
 take:['A stop-loss is decided BEFORE entry. It turns an unknown loss into a known one.','स्टॉप-लॉस एंट्री से पहले तय होता है। यह अनजान घाटे को जाना-पहचाना घाटा बना देता है।']},
{spec:[[100,30,.5],[101,6,.4],[98.5,8,.5],[112,28,.5]],seed:72,panel:null,
 over:function(d){var e=S+6,p=d[e].c,lo=H.minI(d,e+1,e+16)||0;return [{t:'h',v:p,label:'Entry',col:W},{t:'h',v:p-1.2,label:'Tight stop',col:CR},{t:'h',v:d[lo].l-.3,label:'Better stop',col:CG}]},
 marks:function(d){var e=S+6,s=d[e].c-1.2,h=H.fi(d.length,function(i){return d[i].l<=s},e+1);return [{i:e},{i:h<0?e+3:h},{i:d.length-1,up:1}]},
 title:['Stop too tight: stopped out, then price rallies','स्टॉप बहुत पास: स्टॉप लगा, फिर भाव चढ़ गया'],
 leg:[['Entry long.','लॉन्ग एंट्री।'],['A normal dip touches the tight stop. You are out with a loss.','सामान्य गिरावट ने पास वाला स्टॉप छू लिया। घाटे में बाहर।'],['Price then rises a lot. The trade idea was right, the stop was too close.','फिर भाव काफ़ी चढ़ा। ट्रेड का विचार सही था, स्टॉप बहुत पास था।']],
 take:['Put the stop beyond the recent low (green line), then shrink the position size to keep the risk small.','स्टॉप हाल के निचले स्तर के पार रखो (हरी लाइन), और रिस्क छोटा रखने के लिए साइज़ घटाओ।']}];
FAQ.sl=[
[['Can I move my stop-loss further away when price gets close?','भाव पास आए तो स्टॉप दूर कर दूँ?'],['No. That turns a small planned loss into a big one. You may move it in the direction of profit, never away.','नहीं। इससे छोटा तय घाटा बड़ा बन जाता है। स्टॉप मुनाफ़े की दिशा में खिसका सकते हो, दूर कभी नहीं।']],
[['Where should I place the stop?','स्टॉप कहाँ रखूँ?'],['Past a level that proves your idea wrong, like below a recent low (Chart 2), not at a random number.','ऐसे स्तर के पार जो तुम्हारा विचार ग़लत साबित करे, जैसे हाल के निचले स्तर के नीचे (चार्ट 2), कोई भी नंबर नहीं।']],
[['Why do I get stopped out and then price goes my way?','स्टॉप लगता है और फिर भाव मेरी तरफ़ चलता है, क्यों?'],['Usually the stop was too tight. Wider stop with a smaller size fixes it. Chart 2.','आम तौर पर स्टॉप बहुत पास था। चौड़ा स्टॉप और छोटा साइज़ इसे ठीक करता है। चार्ट 2।']]];
/* rr */
EX.rr=[
{spec:[[100,30,.5],[100,6,.4],[109,24,.5]],seed:81,panel:null,over:trade(S+6,2,6),
 marks:function(d){var e=S+6,t=d[e].c+6,h=H.fi(d.length,function(i){return d[i].h>=t},e+1);return [{i:e},{i:h<0?d.length-1:h,up:1}]},
 title:['Risk 2 to try to make 6 (1 : 3)','2 का रिस्क, 6 कमाने की कोशिश (1 : 3)'],
 leg:[['Entry. Red box = what you can lose (2). Green box = what you aim to gain (6).','एंट्री। लाल डिब्बा = जो गँवा सकते हो (2)। हरा डिब्बा = जो पाना चाहते हो (6)।'],['Price reaches the target.','भाव टारगेट तक पहुँचा।']],
 take:['The green box is 3 times the red box. That is 1:3.','हरा डिब्बा लाल से 3 गुना है। यही 1:3 है।']},
{type:'bars',items:[{lab:'40% win, 1:3',v:.6,txt:'+0.6R',col:CG},{lab:'50% win, 1:1',v:0,txt:'0',col:GRc()},{lab:'60% win, 1:0.5',v:-.1,txt:'-0.1R',col:CR},{lab:'30% win, 1:3',v:.2,txt:'+0.2R',col:CG}],title:['Average result per trade (R = amount risked)','हर ट्रेड का औसत नतीजा (R = जितना रिस्क लिया)'],
 leg:[['Wins only 4 of 10 but each win is 3x: positive.','10 में सिर्फ़ 4 जीत, पर हर जीत 3 गुना: फ़ायदा।'],['Wins half, 1:1: break-even before fees.','आधी जीत, 1:1: फ़ीस से पहले बराबरी।'],['Wins 6 of 10 but wins are tiny: slightly negative.','10 में 6 जीत पर जीत छोटी: थोड़ा घाटा।'],['Even a 30% win rate can be positive at 1:3.','1:3 पर 30% जीत भी फ़ायदे में हो सकती है।']],
 take:['Win rate alone means nothing. Win rate AND risk-reward together decide the result. Fees and slippage reduce it a bit.','सिर्फ़ जीत का प्रतिशत कुछ नहीं बताता। जीत प्रतिशत और रिस्क-रिवॉर्ड मिलकर नतीजा तय करते हैं। फ़ीस और स्लिपेज इसे थोड़ा घटाते हैं।']}];
FAQ.rr=[
[['What is a good risk-reward ratio?','अच्छा रिस्क-रिवॉर्ड कितना होता है?'],['Many traders look for at least 1:2. The right number depends on your win rate. See Chart 2.','कई ट्रेडर कम से कम 1:2 देखते हैं। सही संख्या तुम्हारे जीत प्रतिशत पर निर्भर है। चार्ट 2।']],
[['Can I win with only 40% winning trades?','सिर्फ़ 40% ट्रेड जीतकर कमा सकता हूँ?'],['Yes, if each win is bigger than each loss (1:3 gives +0.6R in Chart 2). This is example math, real results vary.','हाँ, अगर हर जीत हर घाटे से बड़ी हो (चार्ट 2 में 1:3 पर +0.6R)। यह उदाहरण का गणित है, असली नतीजे अलग हो सकते हैं।']],
[['Should I always set a far target?','टारगेट हमेशा दूर रखूँ?'],['A far target is hit less often. Place it at a real level like resistance, not a wish.','दूर टारगेट कम बार लगता है। उसे असली स्तर (जैसे रेज़िस्टेंस) पर रखो, इच्छा से नहीं।']]];
/* possize */
EX.possize=[
{spec:[[100,30,.5],[100,6,.4],[106,24,.5]],seed:91,panel:null,
 over:function(d){var p=d[S+6].c;return [{t:'h',v:p,label:'Entry',col:W},{t:'h',v:p-2,label:'Near stop',col:CY},{t:'h',v:p-4,label:'Wide stop',col:CR}]},
 marks:function(d){return [{i:S+6},{i:d.length-1,up:1}]},title:['Same idea, two stop distances','एक ही विचार, दो स्टॉप दूरी'],
 leg:[['Entry. Account 100,000, risk 1% = 1,000.','एंट्री। खाता 1,00,000, रिस्क 1% = 1,000।'],['Price rises. The stop distance changes only the SIZE, not the idea.','भाव चढ़ा। स्टॉप की दूरी सिर्फ़ साइज़ बदलती है, विचार नहीं।']],
 take:['Near stop (2 away): size = 1000 / 2 = 500 units. Wide stop (4 away): 1000 / 4 = 250 units. Wider stop means smaller size.','पास का स्टॉप (2 दूर): साइज़ = 1000 / 2 = 500 यूनिट। चौड़ा स्टॉप (4 दूर): 1000 / 4 = 250 यूनिट। चौड़ा स्टॉप यानी छोटा साइज़।']},
{type:'bars',items:[{lab:'stop 1',v:1000,txt:'1000',col:CY},{lab:'stop 2',v:500,txt:'500',col:CB},{lab:'stop 4',v:250,txt:'250',col:CG},{lab:'stop 8',v:125,txt:'125',col:'#a78bfa'}],title:['Units you can buy for a fixed risk of 1,000','1,000 के तय रिस्क पर कितने यूनिट ले सकते हो'],
 leg:[['Stop 1 away: 1000 units.','स्टॉप 1 दूर: 1000 यूनिट।'],['Stop 2 away: 500 units.','स्टॉप 2 दूर: 500 यूनिट।'],['Stop 4 away: 250 units.','स्टॉप 4 दूर: 250 यूनिट।'],['Stop 8 away: 125 units.','स्टॉप 8 दूर: 125 यूनिट।']],
 take:['Formula: units = money you risk / stop distance. If any stop is hit, the loss is always 1,000.','सूत्र: यूनिट = रिस्क की रकम / स्टॉप की दूरी। कोई भी स्टॉप लगे, घाटा हमेशा 1,000।']}];
FAQ.possize=[
[['How do I decide how many lots?','कितने लॉट लूँ, कैसे तय करूँ?'],['First fix the money you can lose (like 1%), then divide by your stop distance. Do not pick a lot size first.','पहले वह रकम तय करो जो गँवा सकते हो (जैसे 1%), फिर उसे स्टॉप की दूरी से भाग दो। पहले लॉट साइज़ मत चुनो।']],
[['Why does a wider stop mean a smaller size?','चौड़ा स्टॉप तो छोटा साइज़ क्यों?'],['Because each unit can lose more before the stop, so you take fewer units to keep the total loss the same.','क्योंकि स्टॉप तक हर यूनिट ज़्यादा गँवा सकती है, इसलिए कुल घाटा वही रखने को कम यूनिट लेते हो।']],
[['Is a small account different?','छोटे खाते के लिए अलग है?'],['Same formula. A small account just means smaller money at risk. Use micro lots.','सूत्र वही है। छोटे खाते में बस रिस्क की रकम छोटी होती है। माइक्रो लॉट इस्तेमाल करो।']]];
/* leverage */
EX.leverage=[
{type:'bars',items:[{lab:'1x',v:5,txt:'+5%',col:CG},{lab:'5x',v:25,txt:'+25%',col:CG},{lab:'20x',v:100,txt:'+100%',col:CG},{lab:'1x ',v:-5,txt:'-5%',col:CR},{lab:'5x ',v:-25,txt:'-25%',col:CR},{lab:'20x ',v:-100,txt:'-100%',col:CR}],title:['A 5% price move on your margin','5% भाव की चाल का तुम्हारे मार्जिन पर असर'],
 leg:[['First three bars: price rises 5%. Leverage multiplies your gain.','पहले तीन डंडे: भाव 5% चढ़ा। लीवरेज मुनाफ़ा गुणा करता है।'],['Last three bars: price falls 5%. It multiplies your loss the same way.','आख़िरी तीन डंडे: भाव 5% गिरा। यह घाटे को भी उसी तरह गुणा करता है।'],['At 20x a 5% fall wipes out the margin (liquidation).','20x पर 5% गिरावट पूरा मार्जिन उड़ा देती है (लिक्विडेशन)।']],
 take:['Leverage is a magnifier, not free money. It makes the same move 5 or 20 times bigger for you.','लीवरेज एक आवर्धक शीशा है, मुफ़्त पैसा नहीं। यह वही चाल तुम्हारे लिए 5 या 20 गुना बड़ी कर देता है।']},
{spec:[[100,30,.4],[100,6,.3],[96,8,.5],[104,18,.5]],seed:101,panel:null,
 patch:function(d){var q=d[S+6].c*.95;d[46].l=q-.4;d[46].o=Math.max(d[46].o,q+.8)},
 over:function(d){var p=d[S+6].c;return [{t:'h',v:p,label:'Entry',col:W},{t:'h',v:p*.95,label:'20x liquidation',col:CR}]},
 marks:function(d){var e=S+6,q=d[e].c*.95,h=H.fi(d.length,function(i){return d[i].l<=q},e+1);return [{i:e},{i:h<0?46:h},{i:d.length-1,up:1}]},title:['A small dip liquidates a 20x trade','छोटी गिरावट 20x ट्रेड को लिक्विडेट कर देती है'],
 leg:[['Entry long at 20x.','20x पर लॉन्ग एंट्री।'],['A short dip of about 5% touches the liquidation line. The position is closed by force.','करीब 5% की छोटी गिरावट लिक्विडेशन लाइन छू गई। पोज़िशन ज़बरदस्ती बंद।'],['Price then rises. Someone with no leverage was still holding and is in profit.','फिर भाव चढ़ा। बिना लीवरेज वाला अब भी पोज़िशन में था और मुनाफ़े में।']],
 take:['Your idea can be right and you can still lose, because the dip came first.','तुम्हारा विचार सही हो सकता है और फिर भी तुम हार सकते हो, क्योंकि गिरावट पहले आ गई।']}];
FAQ.leverage=[
[['What leverage should a beginner use?','नए ट्रेडर को कितना लीवरेज लेना चाहिए?'],['Low, like 2x to 5x, or none. High leverage gets liquidated by normal dips, as Chart 2 shows.','कम, जैसे 2x से 5x, या बिल्कुल नहीं। ज़्यादा लीवरेज सामान्य गिरावट में ही लिक्विडेट हो जाता है, चार्ट 2।']],
[['Does leverage make me richer?','क्या लीवरेज से मैं अमीर हो जाऊँगा?'],['It makes wins and losses bigger. It does not make you right more often.','यह जीत-हार दोनों बड़ी करता है। यह तुम्हें ज़्यादा बार सही नहीं बनाता।']],
[['What is margin?','मार्जिन क्या है?'],['The money you lock as a deposit to open the position. If the loss eats it, the platform closes you out.','वह रकम जो तुम पोज़िशन खोलने के लिए जमानत की तरह फँसाते हो। घाटा उसे खा जाए तो प्लेटफ़ॉर्म तुम्हें बाहर कर देता है।']]];
/* psy */
function psr(){var r=H.rng(7),a=[100],b=[100],k,x=[3,-6,2,-9,1,-12,-5];for(k=1;k<=34;k++){var g=H.gauss(r)*.7+.6;a.push(a[k-1]*(1+g/100));b.push(k<18?b[k-1]*(1+g/100):b[k-1]*(1+(x[(k-18)%7]*.8+(k>26?.4:0))/100*(k>=18&&k<26?1:.3)))}return [{v:a,col:CG,end:'Plan'},{v:b,col:CR,end:'Emotion'}]}
EX.psy=[
{type:'lines',series:psr,base:100,split:18,title:['Following a plan vs trading on emotion','प्लान पर चलना बनाम भावनाओं पर ट्रेड'],
 leg:[['Green: same small risk every trade, even after losses.','हरा: हर ट्रेड में वही छोटा रिस्क, घाटे के बाद भी।',CG],['Red: after the first loss (dashed line) he doubles size to win it back (revenge trading).','लाल: पहले घाटे के बाद (डैश लाइन) साइज़ दोगुना करता है घाटा वापस पाने को (रिवेंज ट्रेडिंग)।',CR]],
 take:['Same start. The difference is behaviour, not skill.','शुरुआत एक सी। फ़र्क व्यवहार का है, हुनर का नहीं।']},
{spec:[[100,30,.4],[100,10,.3],[113,6,.9],[105,14,.5]],seed:111,panel:null,
 marks:function(d){var p=H.maxI(d,S,d.length-1);return [{i:p-8},{i:p,up:1},{i:d.length-1}]},title:['FOMO: buying after the big jump','FOMO: बड़ी उछाल के बाद खरीदना'],
 leg:[['Calm time: a plan could have bought here with a stop.','शांत समय: प्लान से यहाँ स्टॉप के साथ खरीद सकते थे।'],['Price shoots up. Everyone is excited and buys here, at the top.','भाव तेज़ चढ़ा। सब उत्साह में यहीं ऊपर खरीदते हैं।'],['Price drifts back down. The late buyer is in loss.','भाव वापस नीचे आया। देर से खरीदने वाला घाटे में।']],
 take:['The fear of missing out makes us buy the top. If you missed it, wait for the next setup.','कुछ छूट जाने का डर हमसे चोटी पर खरीदवाता है। छूट गया तो अगले सेटअप का इंतज़ार करो।']}];
FAQ.psy=[
[['I lost, how do I stop wanting revenge?','घाटा हुआ, बदला लेने की इच्छा कैसे रोकूँ?'],['Set a daily loss limit and walk away when you hit it. Chart 1 shows where revenge trades lead.','रोज़ का घाटा-सीमा तय करो और वहाँ पहुँचते ही हट जाओ। चार्ट 1 दिखाता है रिवेंज ट्रेड कहाँ ले जाते हैं।']],
[['What is FOMO?','FOMO क्या है?'],['Fear Of Missing Out. Chart 2: you jump in late because price is moving. Plan your entries before.','कुछ छूट जाने का डर। चार्ट 2: भाव चल रहा है इसलिए देर से कूद पड़ते हैं। एंट्री पहले से तय करो।']],
[['Does a journal help?','क्या जर्नल से फ़ायदा होता है?'],['Yes. Writing why you entered shows your repeated mistakes. Use the Journal on this site.','हाँ। एंट्री का कारण लिखने से बार-बार होने वाली ग़लतियाँ दिखती हैं। इस साइट का जर्नल इस्तेमाल करो।']]];
})();
