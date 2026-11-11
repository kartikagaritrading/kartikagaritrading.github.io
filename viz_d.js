(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff',GR='#93a1bd';
function nz(a,f){var r=H.fi(a.length,f);return r<0?a.length-1:r}
function trade(e0,sd,td){return function(d){var p=d[e0].c,s=p-sd,t=p+td,n=d.length-1;return [{t:'box',i1:e0,i2:n,v1:p,v2:t,col:'rgba(43,217,138,.15)'},{t:'box',i1:e0,i2:n,v1:s,v2:p,col:'rgba(255,92,108,.15)'},{t:'h',v:p,label:'Entry',col:W},{t:'h',v:s,label:'Stop',col:CR},{t:'h',v:t,label:'Target',col:CG}]}}
function C(i,o,c,h,l){return function(d){var x=d[i];x.o=o;x.c=c;x.h=h;x.l=l}}
function GRc(){return GR}
function mx(d,a,b){return d[H.maxI(d,a,b)].h}
function mn(d,a,b){return d[H.minI(d,a,b)].l}
/* mtf */
EX.mtf=[{type:'multi',spec:[[100,60,.6],[150,140,.7],[141,40,.6]],seed:171,
 tags:['BIG · बड़ा चित्र','MIDDLE · बीच','ZOOM · पास से'],
 views:[{agg:12,show:20},{agg:4,show:44},{agg:1,show:60}],
 title:['The same market on three timeframes','एक ही बाज़ार तीन टाइमफ़्रेम पर'],
 leg:[['BIG: a clear uptrend. The last small fall is just a dip.','बड़ा: साफ़ अपट्रेंड। आख़िरी छोटी गिरावट बस एक डिप है।'],['MIDDLE: the rise has slowed and the dip begins.','बीच: चढ़ाई धीमी पड़ी और डिप शुरू हुआ।'],['ZOOM: it looks like a crash. A trader who sees only this may panic or short against the big trend.','पास से: क्रैश जैसा दिखता है। सिर्फ़ यही देखने वाला घबरा सकता है या बड़े ट्रेंड के ख़िलाफ़ शॉर्ट कर सकता है।']],
 take:['Start from the big picture for direction, then use the small chart only for the entry.','दिशा के लिए बड़े चित्र से शुरू करो, फिर एंट्री के लिए ही छोटा चार्ट देखो।']}];
FAQ.mtf=[
[['Which timeframes should I combine?','कौन से टाइमफ़्रेम मिलाऊँ?'],['A common set is 3: one big (daily or 4-hour) for direction, one middle (1-hour) for levels, one small (15-minute) for entry.','आम तौर पर 3: दिशा के लिए बड़ा (डेली या 4 घंटे), लेवल के लिए बीच का (1 घंटा), एंट्री के लिए छोटा (15 मिनट)।']],
[['What if the timeframes disagree?','टाइमफ़्रेम आपस में अलग कहें तो?'],['Trade with the bigger one, or skip. See the chart: the small view alone would mislead you.','बड़े के साथ ट्रेड करो, या छोड़ दो। चार्ट देखो: अकेला छोटा चार्ट गुमराह करता।']],
[['Is more timeframes better?','क्या ज़्यादा टाइमफ़्रेम बेहतर?'],['No. Two or three are enough. Too many cause confusion.','नहीं। दो या तीन काफ़ी हैं। बहुत ज़्यादा उलझन करते हैं।']]];
/* breakout */
EX.breakout=[
{spec:[[100,30,.3],[100,12,.2],[108,10,.5],[107,6,.3],[114,16,.4]],seed:181,panel:'vol',patch:function(d){for(var i=41;i<50;i++)d[i].v*=2},
 over:function(d){var L=mx(d,S,41);return [{t:'zone',v1:L-.6,v2:L+.1,col:'rgba(255,176,46,.16)'},{t:'h',v:L-.2,label:'Level',col:CY}]},
 marks:function(d){var L=mx(d,S,41),b=H.fi(d.length,function(i){return d[i].c>L+.3},42);return [{i:b,up:1},{i:H.minI(d,b+3,b+14)},{i:d.length-1,up:1}]},
 title:['A real breakout with a retest','रीटेस्ट के साथ असली ब्रेकआउट'],
 leg:[['Price closes above the level on strong volume.','भाव मज़बूत वॉल्यूम पर लेवल के ऊपर बंद हुआ।'],['Price returns to the level and holds: a retest (a safer entry than chasing).','भाव लेवल तक लौटा और टिका: रीटेस्ट (दौड़कर खरीदने से सुरक्षित एंट्री)।'],['The move continues.','चाल आगे चली।']],
 take:['A close beyond the level, strong volume and a successful retest all point to a real break.','लेवल के पार बंद भाव, मज़बूत वॉल्यूम और सफल रीटेस्ट, तीनों असली ब्रेक की ओर इशारा करते हैं।']},
{spec:[[100,30,.3],[100,12,.2],[101,3,.4],[96,19,.5]],seed:182,panel:'vol',patch:function(d){var L=mx(d,S,41),i=43;d[i]={o:L-.2,c:L-.4,h:L+1.8,l:L-.9,v:d[i].v};for(var k=41;k<46;k++)d[k].v*=.5},
 over:function(d){var L=mx(d,S,41);return [{t:'zone',v1:L-.6,v2:L+.1,col:'rgba(255,176,46,.16)'},{t:'h',v:L-.2,label:'Level',col:CY}]},
 marks:function(d){return [{i:43,up:1},{i:d.length-1}]},
 title:['A fakeout: breaks out, then falls back','फ़ेकआउट: ब्रेकआउट होकर वापस गिरा'],
 leg:[['Price pokes above the level but closes back below it, with low volume.','भाव लेवल के ऊपर झाँका पर नीचे वापस बंद हुआ, वॉल्यूम कम।'],['Price falls hard. Those who bought the poke are trapped.','भाव तेज़ गिरा। झाँकने पर खरीदने वाले फँस गए।']],
 take:['Do not buy the first poke. Wait for a close beyond the level.','पहली झाँक पर मत खरीदो। लेवल के पार बंद भाव का इंतज़ार करो।']}];
FAQ.breakout=[
[['How do I avoid fakeouts?','फ़ेकआउट से कैसे बचूँ?'],['Wait for a candle to CLOSE beyond the level, check volume, and consider waiting for the retest.','कैंडल के लेवल के पार बंद होने का इंतज़ार करो, वॉल्यूम देखो, और रीटेस्ट का इंतज़ार सोचो।']],
[['Where do I put the stop on a breakout?','ब्रेकआउट में स्टॉप कहाँ?'],['Just back inside the old range, below the level. If price returns there, the breakout failed.','पुरानी रेंज के अंदर, लेवल के नीचे। भाव वहाँ लौटे तो ब्रेकआउट फ़ेल हुआ।']],
[['Is waiting for a retest always better?','क्या रीटेस्ट का इंतज़ार हमेशा बेहतर?'],['Not always. Strong moves may never retest and you miss them. It trades fewer wins for a safer entry.','हमेशा नहीं। तेज़ चालें रीटेस्ट नहीं करतीं और छूट जाती हैं। यह सुरक्षित एंट्री के बदले कम मौके देता है।']]];
/* pullback */
EX.pullback=[
{spec:[[100,30,.4],[116,25,.5],[108,10,.4],[122,20,.4]],seed:191,panel:null,
 over:function(d,I){return [{t:'ma',arr:I.e20,col:CY}]},
 marks:function(d){var p=H.maxI(d,S+10,S+26);return [{i:p,up:1},{i:H.minI(d,p+2,p+14)},{i:d.length-1,up:1}]},
 title:['A healthy pullback in an uptrend','अपट्रेंड में स्वस्थ पुलबैक'],
 leg:[['The trend rises and makes a high.','ट्रेंड चढ़ा और एक चोटी बनी।'],['A short pullback to the yellow average. This is where a pullback buyer enters, with a stop below.','पीले औसत तक छोटा पुलबैक। यहाँ पुलबैक खरीदार स्टॉप नीचे रखकर घुसता है।'],['The trend continues to new highs.','ट्रेंड नई ऊँचाई तक चला।']],
 take:['Buying a dip in an uptrend gives a better price and a closer stop than chasing the top.','अपट्रेंड में डिप पर खरीदना चोटी के पीछे दौड़ने से बेहतर भाव और पास का स्टॉप देता है।']},
{spec:[[100,30,.4],[116,25,.5],[100,22,.6],[92,10,.5]],seed:192,panel:null,
 over:function(d,I){return [{t:'ma',arr:I.e20,col:CY},{t:'ma',arr:I.e50,col:CB}]},
 marks:function(d,I){var p=H.maxI(d,S+10,S+26),k=H.fi(d.length,function(i){return d[i].c<I.e50[i]},p+2);return [{i:p,up:1},{i:k<0?p+10:k},{i:d.length-1}]},
 title:['The "pullback" that was a reversal','जो "पुलबैक" थी, वह पलटाव निकला'],
 leg:[['The high.','चोटी।'],['This time the fall goes through the blue average and does not stop. The trend is changing.','इस बार गिरावट नीले औसत को चीरकर रुकी नहीं। ट्रेंड बदल रहा है।'],['Price keeps falling.','भाव गिरता रहा।']],
 take:['If the pullback is deep and fast and breaks the slow average, it may not be a pullback. Your stop protects you.','पुलबैक गहरी और तेज़ हो और धीमा औसत तोड़ दे, तो वह पुलबैक न भी हो। तुम्हारा स्टॉप तुम्हें बचाता है।']}];
FAQ.pullback=[
[['How do I know it is a pullback and not a reversal?','कैसे जानूँ पुलबैक है या पलटाव?'],['You cannot know in advance. A pullback is usually shallow and holds a level. Always place a stop.','पहले से नहीं जान सकते। पुलबैक आम तौर पर उथली होती है और किसी लेवल पर टिकती है। स्टॉप हमेशा रखो।']],
[['Where do I enter on a pullback?','पुलबैक में एंट्री कहाँ?'],['Near a support, a moving average or a Fibonacci zone, after a candle shows buyers returning.','सपोर्ट, मूविंग एवरेज या फिबोनाची ज़ोन के पास, जब कैंडल खरीदारों की वापसी दिखाए।']],
[['What if price never pulls back?','अगर भाव पुलबैक करे ही नहीं?'],['Then you miss that trade. That is fine. There are many more setups.','तो वह ट्रेड छूट गया। ठीक है। आगे बहुत मौके आएँगे।']]];
/* structure */
var ZZ=[[100,30,.3],[108,10,.3],[104,8,.3],[113,10,.3],[109,8,.3],[118,10,.3],[114,8,.3],[122,8,.3]];
EX.structure=[
{spec:ZZ,seed:201,panel:null,
 marks:function(d){return [{i:H.minI(d,44,52)},{i:H.maxI(d,54,62),up:1},{i:H.minI(d,62,70)},{i:H.maxI(d,72,80),up:1}]},
 over:function(d){return []},
 title:['An uptrend is a staircase','अपट्रेंड एक सीढ़ी है'],
 leg:[['Higher low (HL).','हायर लो (HL)।'],['Higher high (HH): higher than the earlier top.','हायर हाई (HH): पिछली चोटी से ऊपर।'],['Another HL, above the first.','एक और HL, पहले से ऊपर।'],['Another HH. HH + HL = uptrend.','एक और HH। HH + HL = अपट्रेंड।']],
 take:['As long as price keeps making HH and HL, the trend is up. Buy pullbacks to the HL.','जब तक HH और HL बनते रहें, ट्रेंड ऊपर है। HL तक पुलबैक में खरीदो।']},
{spec:[[100,30,.3],[108,10,.3],[104,8,.3],[113,10,.3],[108,8,.3],[116,10,.3],[104,14,.4],[98,10,.4]],seed:202,panel:null,
 over:function(d){var t=H.minI(d,62,70);return [{t:'h',v:d[t].l,label:'Last HL',col:CY}]},
 marks:function(d){var t=H.minI(d,62,70),k=H.fi(d.length,function(i){return d[i].c<d[t].l},t+3);return [{i:t},{i:H.maxI(d,72,82),up:1},{i:k<0?d.length-8:k}]},
 title:['Structure breaks: the staircase ends','स्ट्रक्चर टूटा: सीढ़ी ख़त्म'],
 leg:[['Last higher low, marked with the yellow line.','आख़िरी हायर लो, पीली लाइन से दिखाया।'],['Price makes a high but does not go much higher.','भाव ने चोटी बनाई पर बहुत ऊपर नहीं गया।'],['Price closes below the last HL. The staircase is broken (a break of structure).','भाव आख़िरी HL के नीचे बंद हुआ। सीढ़ी टूट गई (स्ट्रक्चर ब्रेक)।']],
 take:['Break of the last HL is the first sign that buyers are losing control.','आख़िरी HL का टूटना पहला संकेत है कि खरीदार पकड़ खो रहे हैं।']}];
FAQ.structure=[
[['What are BOS and CHoCH?','BOS और CHoCH क्या हैं?'],['BOS (break of structure) means the trend broke a level in its own direction. CHoCH (change of character) is the first break against the trend. Chart 2 shows a CHoCH.','BOS (स्ट्रक्चर ब्रेक) में ट्रेंड अपनी दिशा में लेवल तोड़ता है। CHoCH (चरित्र बदलाव) ट्रेंड के उलट पहला ब्रेक है। चार्ट 2 में CHoCH है।']],
[['Do I need a special indicator?','क्या ख़ास इंडिकेटर चाहिए?'],['No. Just your eyes and the high and low points.','नहीं। बस आँखें और ऊँचे-नीचे बिंदु।']],
[['Is this the same as trend?','यह ट्रेंड जैसा ही है?'],['It is a clearer way to read the trend: by the highs and lows, not by a drawn line.','यह ट्रेंड पढ़ने का ज़्यादा साफ़ तरीका है: खींची लाइन से नहीं, ऊँचे-नीचे बिंदुओं से।']]];
/* backtest */
function bt1(){var r=H.rng(5),a=[100],b=[100],k;for(k=1;k<=50;k++){a.push(a[k-1]*(1+(k<=30?1.4:-.9)/100+H.gauss(r)*.0025));b.push(b[k-1]*(1+.15/100+H.gauss(r)*.011))}return [{v:b,col:'#93a1bd',end:'Just hold'},{v:a,col:CG,end:'Strategy'}]}
function bt2(){var o=[],k,j,best=-1,bi=0;for(j=0;j<6;j++){var r=H.rng(40+j),v=[100];for(k=1;k<=40;k++)v.push(v[k-1]*(1+H.gauss(r)*.012));o.push(v);if(v[40]>best){best=v[40];bi=j}}
 return o.map(function(v,j){return j===bi?{v:v,col:CG,end:'Best of 6'}:{v:v,col:'#47536e'}})}
EX.backtest=[
{type:'lines',series:bt1,base:100,split:30,title:['Great on old data, weak on new data','पुराने डेटा पर शानदार, नए पर कमज़ोर'],
 leg:[['Left of the dashed line: the past data the rules were tuned on. The strategy looks great.','डैश लाइन के बाएँ: पुराना डेटा जिस पर नियम बैठाए गए। रणनीति शानदार दिखती है।',CG],['Right of the line: new data the rules never saw. The strategy stops working.','लाइन के दाएँ: नया डेटा जो नियमों ने नहीं देखा। रणनीति चलना बंद।',CG],['Grey line: simply holding.','धूसर लाइन: बस पकड़े रखना।','#93a1bd']],
 take:['This is overfitting. Always test on data the strategy has not seen.','इसे ओवरफ़िटिंग कहते हैं। रणनीति को हमेशा ऐसे डेटा पर परखो जो उसने देखा न हो।']},
{type:'lines',series:bt2,base:100,title:['Pure luck can look like skill','सिर्फ़ किस्मत भी हुनर जैसी दिख सकती है'],
 leg:[['Six random curves. No skill at all: each step is a coin flip.','छह रैंडम कर्व। बिल्कुल हुनर नहीं: हर कदम सिक्का उछालना है।'],['If you try many ideas and show only the best (green), it looks like a genius strategy.','कई आइडिया आज़माकर सिर्फ़ सबसे अच्छा (हरा) दिखाओ, तो वह जीनियस रणनीति लगती है।']],
 take:['Test few ideas, use many trades, and check on new data.','कम आइडिया परखो, ट्रेड ज़्यादा लो, और नए डेटा पर जाँचो।']}];
FAQ.backtest=[
[['How many trades do I need?','कितने ट्रेड चाहिए?'],['More is better. Many people look for at least 100. A handful of trades proves nothing.','ज़्यादा बेहतर। कई लोग कम से कम 100 देखते हैं। मुट्ठी भर ट्रेड कुछ साबित नहीं करते।']],
[['Backtest looks great, will it make money?','बैकटेस्ट शानदार है, क्या कमाएगा?'],['Not guaranteed. See the charts: tuned rules and luck can both fake it. Then forward test on a demo account.','पक्का नहीं। चार्ट देखो: बैठाए हुए नियम और किस्मत दोनों धोखा दे सकते हैं। फिर डेमो अकाउंट पर फ़ॉरवर्ड टेस्ट करो।']],
[['Where can I test on this site?','इस साइट पर कहाँ परखूँ?'],['Use the Strategy lab. It uses real recent prices and includes simple fees.','स्ट्रैटेजी लैब इस्तेमाल करो। उसमें असली हाल के भाव और सरल फ़ीस होती है।']]];
/* news */
EX.news=[
{spec:[[100,36,.3],[100,6,.2],[106,3,1.2],[100,3,.8],[103,12,.5]],seed:211,panel:null,
 over:function(d){var k=H.fi(d.length,function(i){return d[i].h-d[i].l>2.5},S+3);return [{t:'v',i:k-5,col:CY,label:'Alert'},{t:'v',i:k,col:CR,label:'News'}]},
 marks:function(d){var k=H.fi(d.length,function(i){return d[i].h-d[i].l>2.5},S+3);return [{i:k-5,nov:1},{i:k,up:1,nov:1},{i:d.length-1,up:1}]},
 title:['Quiet market, then a news spike','शांत बाज़ार, फिर ख़बर की उछाल'],
 leg:[['Alert comes before the news. The market is quiet. This is the time to prepare, not to trade.','अलर्ट ख़बर से पहले आता है। बाज़ार शांत है। यह तैयारी का वक़्त है, ट्रेड का नहीं।'],['News hits: huge candles, price jumps fast.','ख़बर आई: विशाल कैंडल, भाव तेज़ी से उछला।'],['After the storm, price calms down.','तूफ़ान के बाद भाव शांत हुआ।']],
 take:['Big news can move price a lot in seconds. Many beginners stay out until it settles.','बड़ी ख़बर कुछ ही सेकंड में भाव को बहुत हिला देती है। कई नए लोग शांत होने तक बाहर रहते हैं।']},
{spec:[[100,36,.3],[100,6,.2],[104,2,1],[96,3,1],[100,12,.5]],seed:212,panel:null,
 over:function(d){var k=H.fi(d.length,function(i){return d[i].h-d[i].l>2.5},S+3);return [{t:'h',v:99,label:'Your stop',col:CR},{t:'h',v:101.5,label:'Your target',col:CG},{t:'v',i:k,col:CR,label:'News'}]},
 marks:function(d){var k=H.fi(d.length,function(i){return d[i].h-d[i].l>2.5},S+3);return [{i:k,up:1,nov:1},{i:k+3}]},
 title:['Whipsaw: both sides get hit','व्हिपसॉ: दोनों तरफ़ चोट'],
 leg:[['Price spikes up past your target zone, then...','भाव ऊपर उछलकर तुम्हारे टारगेट ज़ोन के पार गया, फिर...'],['...falls hard through the stop. In a news candle price can hit both sides within minutes.','...तेज़ गिरकर स्टॉप के पार निकल गया। ख़बर की कैंडल में भाव मिनटों में दोनों तरफ़ चोट कर सकता है।']],
 take:['Spreads widen and stops can fill at worse prices during news. Smaller size or no trade is a valid choice.','ख़बर के समय स्प्रेड बढ़ता है और स्टॉप ख़राब भाव पर लग सकते हैं। छोटा साइज़ या ट्रेड न करना भी सही चुनाव है।']}];
FAQ.news=[
[['Which news matters most?','कौन सी ख़बरें सबसे ज़रूरी?'],['US CPI (inflation), the Fed interest rate decision and US jobs data (NFP) move markets a lot. Use the calendar on this site.','अमेरिकी CPI (महँगाई), फ़ेड की ब्याज दर का फ़ैसला और अमेरिकी जॉब्स डेटा (NFP) बाज़ार को बहुत हिलाते हैं। इस साइट का कैलेंडर देखो।']],
[['Should I trade the news?','क्या ख़बर पर ट्रेड करूँ?'],['It is the hardest time. Spreads are wide and moves are fast. Beginners often wait 15 to 30 minutes.','यह सबसे कठिन समय है। स्प्रेड चौड़ा और चाल तेज़। नए लोग अक्सर 15 से 30 मिनट रुकते हैं।']],
[['What should I do before news?','ख़बर से पहले क्या करूँ?'],['Close or reduce open trades, or move the stop. Know the time. The Telegram alert comes 10 minutes before major events.','खुले ट्रेड बंद या छोटे करो, या स्टॉप खिसकाओ। समय जानो। टेलीग्राम अलर्ट बड़ी ख़बरों से 10 मिनट पहले आता है।']]];
})();
