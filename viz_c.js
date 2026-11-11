(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff',GR='#93a1bd';
function nz(a,f){var r=H.fi(a.length,f);return r<0?a.length-1:r}
function trade(e0,sd,td){return function(d){var p=d[e0].c,s=p-sd,t=p+td,n=d.length-1;return [{t:'box',i1:e0,i2:n,v1:p,v2:t,col:'rgba(43,217,138,.15)'},{t:'box',i1:e0,i2:n,v1:s,v2:p,col:'rgba(255,92,108,.15)'},{t:'h',v:p,label:'Entry',col:W},{t:'h',v:s,label:'Stop',col:CR},{t:'h',v:t,label:'Target',col:CG}]}}
function C(i,o,c,h,l){return function(d){var x=d[i];x.o=o;x.c=c;x.h=h;x.l=l}}
function GRc(){return GR}
function mx(d,a,b){return d[H.maxI(d,a,b)].h}
function mn(d,a,b){return d[H.minI(d,a,b)].l}
/* trend */
function tl(d,a,b){var la=d[a].l,lb=d[b].l,sl=(lb-la)/(b-a);return function(i){return la+sl*(i-a)}}
EX.trend=[
{spec:[[100,30,.4],[108,15,.5],[104,6,.4],[118,12,.5],[112,8,.4],[126,14,.4]],seed:121,panel:null,
 over:function(d){var a=H.minI(d,46,56),b=H.minI(d,66,78),f=tl(d,a,b),n=d.length-1;return [{t:'line',pts:[[a,f(a)],[n,f(n)]],col:CB,label:'Uptrend line'}]},
 marks:function(d){return [{i:H.minI(d,46,56)},{i:H.minI(d,66,78)},{i:d.length-1,up:1}]},
 title:['Drawing an uptrend line','अपट्रेंड लाइन कैसे खींचें'],
 leg:[['First higher low.','पहला ऊँचा निचला स्तर (हायर लो)।'],['Second higher low, higher than the first. Join 1 and 2 with a line.','दूसरा हायर लो, पहले से ऊपर। 1 और 2 को लाइन से जोड़ो।'],['Price keeps respecting the line and climbs.','भाव लाइन का सम्मान करता रहा और चढ़ता गया।']],
 take:['Uptrend = each low is higher than the one before. The line below the lows is a support to watch.','अपट्रेंड = हर निचला स्तर पिछले से ऊपर। लोज़ के नीचे की लाइन देखने लायक सपोर्ट है।']},
{spec:[[100,30,.4],[108,15,.5],[104,6,.4],[118,12,.5],[112,8,.4],[124,10,.4],[100,18,.6]],seed:122,panel:null,
 over:function(d){var a=H.minI(d,46,56),b=H.minI(d,66,78),f=tl(d,a,b),n=d.length-1;return [{t:'line',pts:[[a,f(a)],[n,f(n)]],col:CB,label:'Uptrend line'}]},
 marks:function(d){var a=H.minI(d,46,56),b=H.minI(d,66,78),f=tl(d,a,b),k=H.fi(d.length,function(i){return d[i].c<f(i)},b+2);return [{i:b},{i:k<0?d.length-2:k},{i:d.length-1}]},
 title:['The trendline breaks','ट्रेंडलाइन टूट गई'],
 leg:[['Last higher low on the line.','लाइन पर आख़िरी हायर लो।'],['Price closes below the line. The uptrend may be ending.','भाव लाइन के नीचे बंद हुआ। अपट्रेंड ख़त्म हो सकता है।'],['Price kept falling after the break.','टूटने के बाद भाव गिरता रहा।']],
 take:['A break is a warning, not a sure sign. Wait for a close below, then look for a lower high.','टूटना चेतावनी है, पक्का संकेत नहीं। बंद भाव नीचे आने का इंतज़ार करो, फिर लोअर हाई देखो।']}];
FAQ.trend=[
[['How many touches make a valid trendline?','वैध ट्रेंडलाइन के लिए कितने टच चाहिए?'],['Two points draw it, a third touch confirms it. The more touches, the more traders watch it.','दो बिंदु से बनती है, तीसरा टच पक्का करता है। जितने ज़्यादा टच, उतने ज़्यादा ट्रेडर उसे देखते हैं।']],
[['Should I use wicks or bodies?','बत्ती से खींचूँ या बॉडी से?'],['Either, but be consistent. Wicks are more common. Small errors are normal.','कोई भी, पर एक जैसा रखो। बत्ती ज़्यादा आम है। छोटी ग़लतियाँ सामान्य हैं।']],
[['Does a trendline break mean I should sell?','ट्रेंडलाइन टूटे तो बेच दूँ?'],['It means be careful. Many breaks fail. Look at Chart 2 and then check Structure for confirmation.','मतलब सावधान रहो। कई ब्रेक फ़ेल होते हैं। चार्ट 2 देखो और पुष्टि के लिए स्ट्रक्चर देखो।']]];
/* sr */
function touches(d,f,gap,max){var o=[],last=-99;for(var i=S;i<d.length&&o.length<max;i++)if(f(i)&&i-last>=gap){o.push(i);last=i}return o}
EX.sr=[
{spec:[[100,30,.4],[108,12,.4],[101,10,.4],[108,10,.4],[101,10,.4],[108,10,.4]],seed:131,panel:null,
 over:function(d){var R=mx(d,S,d.length-1),Su=mn(d,S,d.length-1);return [{t:'zone',v1:R-.9,v2:R+.1,col:'rgba(255,92,108,.16)'},{t:'zone',v1:Su-.1,v2:Su+.9,col:'rgba(43,217,138,.16)'},{t:'h',v:R-.4,label:'Resistance',col:CR},{t:'h',v:Su+.4,label:'Support',col:CG}]},
 marks:function(d){var R=mx(d,S,d.length-1),Su=mn(d,S,d.length-1);return touches(d,function(i){return d[i].h>=R-.9},6,2).map(function(i){return {i:i,up:1}}).concat(touches(d,function(i){return d[i].l<=Su+.9},6,3).slice(-1).map(function(i){return {i:i}}))},
 title:['Price bouncing between support and resistance','भाव सपोर्ट और रेज़िस्टेंस के बीच उछलता हुआ'],
 leg:[['Price rises to the red zone and turns back down (resistance).','भाव लाल ज़ोन तक चढ़कर वापस मुड़ा (रेज़िस्टेंस)।'],['It does it again at the same place.','वही जगह फिर से।'],['Price falls to the green zone and bounces up (support).','भाव हरे ज़ोन तक गिरकर ऊपर उछला (सपोर्ट)।']],
 take:['Levels are zones, not exact lines. The more times price reacts there, the more traders watch it.','स्तर ज़ोन होते हैं, सटीक लाइन नहीं। जितनी बार भाव वहाँ पलटे, उतने ज़्यादा ट्रेडर उसे देखते हैं।']},
{spec:[[100,30,.4],[107,14,.3],[104,8,.4],[107,4,.3],[117,8,.5],[108,10,.4],[118,12,.5]],seed:132,panel:null,
 over:function(d){var R=mx(d,S,56);return [{t:'zone',v1:R-.9,v2:R+.1,col:'rgba(255,176,46,.18)'},{t:'h',v:R-.4,label:'Old resistance',col:CY}]},
 marks:function(d){var R=mx(d,S,56),b=H.fi(d.length,function(i){return d[i].c>R+.3},57),t=H.minI(d,b+3,Math.min(d.length-2,b+22));return [{i:H.maxI(d,S+8,S+16),up:1},{i:b,up:1},{i:t}]},
 title:['Resistance becomes support','टूटा हुआ रेज़िस्टेंस सपोर्ट बन जाता है'],
 leg:[['Price is stopped at the zone: resistance.','भाव ज़ोन पर रुका: रेज़िस्टेंस।'],['Price breaks above it.','भाव ऊपर तोड़ गया।'],['Price comes back to test the same zone from above. It holds, so it is now support, and price rises again.','भाव उसी ज़ोन को ऊपर से परखने लौटा। टिका, यानी अब सपोर्ट है, और भाव फिर चढ़ा।']],
 take:['An old ceiling often becomes the new floor. This is called role reversal.','पुरानी छत अक्सर नया फ़र्श बन जाती है। इसे रोल रिवर्सल कहते हैं।']}];
FAQ.sr=[
[['How do I find support and resistance?','सपोर्ट-रेज़िस्टेंस कैसे ढूँढूँ?'],['Look left at the chart. Mark places where price turned several times. Use zones, not single lines.','चार्ट में बाईं ओर देखो। जहाँ भाव कई बार पलटा, वहाँ निशान लगाओ। लाइन नहीं, ज़ोन बनाओ।']],
[['What if price breaks the level?','अगर भाव लेवल तोड़ दे तो?'],['It may be a real break (Chart 2) or a fakeout. Wait for a close beyond it and a retest. See Breakout lesson.','असली ब्रेक हो सकता है (चार्ट 2) या फ़ेकआउट। उसके पार बंद भाव और रीटेस्ट का इंतज़ार करो। ब्रेकआउट वाला पाठ देखो।']],
[['Which timeframe levels matter most?','कौन से टाइमफ़्रेम के लेवल ज़्यादा अहम?'],['Daily and weekly levels matter more than 5-minute ones, since more traders see them.','डेली और वीकली लेवल 5 मिनट वालों से ज़्यादा अहम हैं, क्योंकि ज़्यादा ट्रेडर उन्हें देखते हैं।']]];
/* ma */
EX.ma=[
{spec:[[100,30,.4],[112,30,.5],[112,10,.4],[100,22,.5]],seed:141,panel:null,
 over:function(d,I){return [{t:'ma',arr:I.e20,col:CY},{t:'ma',arr:I.e50,col:CB}]},
 marks:function(d,I){var x=H.xe(I,d.length,'e20','e50'),u=x.filter(function(a){return a[1]==='up'})[0],dn=x.filter(function(a){return a[1]==='dn'}).pop();return [{i:u?u[0]:S+10},{i:dn?dn[0]:d.length-5,up:1}]},
 title:['Fast average crossing the slow one','तेज़ औसत का धीमे औसत को काटना'],
 leg:[['Yellow line = 20-candle average (fast).','पीली लाइन = 20 कैंडल का औसत (तेज़)।',CY],['Blue line = 50-candle average (slow).','नीली लाइन = 50 कैंडल का औसत (धीमा)।',CB],['Yellow crosses above blue: trend may be turning up.','पीली नीली के ऊपर निकली: ट्रेंड ऊपर मुड़ सकता है।'],['Yellow crosses below blue: trend may be turning down.','पीली नीली के नीचे गई: ट्रेंड नीचे मुड़ सकता है।']],
 take:['Averages smooth the noise. They are late, so they confirm a trend that has already started.','औसत शोर हटाते हैं। वे देर से चलते हैं, इसलिए शुरू हो चुके ट्रेंड की पुष्टि करते हैं।']},
{spec:[[100,36,.4],[102,5,.3],[98,6,.3],[102,6,.3],[98,6,.3],[102,6,.3],[98,6,.3],[101,6,.3]],seed:142,panel:null,
 over:function(d,I){return [{t:'ma',arr:I.e20,col:CY},{t:'ma',arr:I.e50,col:CB}]},
 marks:function(d,I){return H.xe(I,d.length,'e20','e50').slice(0,4).map(function(x){return {i:x[0],up:x[1]==='dn'}})},
 title:['Sideways market: the averages keep crossing','साइडवेज़ बाज़ार: औसत बार-बार कटते हैं'],
 leg:[['Cross 1','कटान 1'],['Cross 2: opposite','कटान 2: उल्टी'],['Cross 3','कटान 3'],['Cross 4. Price went nowhere, each trade lost a bit.','कटान 4। भाव कहीं नहीं गया, हर ट्रेड में थोड़ा घाटा।']],
 take:['Crossovers work in trends and fail in ranges. Check what the market is doing first.','कटान ट्रेंड में चलती है, रेंज में फ़ेल होती है। पहले देखो बाज़ार क्या कर रहा है।']}];
FAQ.ma=[
[['SMA or EMA?','SMA या EMA?'],['EMA reacts faster to new prices, SMA is smoother. Beginners can use EMA 20 and 50 and test.','EMA नए भावों पर तेज़ चलता है, SMA ज़्यादा चिकना। नए लोग EMA 20 और 50 रखकर परख सकते हैं।']],
[['Which numbers are best?','कौन से नंबर सबसे अच्छे हैं?'],['No magic numbers. 20, 50 and 200 are popular because many traders watch them. Test, do not guess.','कोई जादुई नंबर नहीं। 20, 50, 200 मशहूर हैं क्योंकि कई ट्रेडर इन्हें देखते हैं। परखो, अंदाज़ा मत लगाओ।']],
[['Why do crossovers lose in sideways markets?','साइडवेज़ में कटान क्यों हारती है?'],['See Chart 2: price swings around the averages, so they cross over and over with no trend.','चार्ट 2 देखो: भाव औसतों के आसपास झूलता है, इसलिए बिना ट्रेंड के वे बार-बार कटते हैं।']]];
/* vol */
EX.vol=[
{spec:[[100,30,.3],[100,10,.2],[107,6,.7],[111,14,.4]],seed:151,panel:'vol',patch:function(d){for(var i=40;i<47;i++)d[i].v*=2.6},
 over:function(d){var L=mx(d,S,39);return [{t:'h',v:L,label:'Resistance',col:CY}]},
 marks:function(d){var L=mx(d,S,39);var b=H.fi(d.length,function(i){return d[i].c>L},40);return [{i:b<0?41:b,up:1},{i:d.length-1,up:1}]},
 title:['Breakout with big volume','भारी वॉल्यूम के साथ ब्रेकआउट'],
 leg:[['Price breaks above resistance and the volume bars jump.','भाव रेज़िस्टेंस के ऊपर निकला और वॉल्यूम के डंडे उछल गए।'],['Price keeps going. Many traders joined, so the move had fuel.','भाव चलता रहा। कई ट्रेडर जुड़े, इसलिए चाल में दम था।']],
 take:['Big volume shows many people agree with the move.','भारी वॉल्यूम बताता है कि कई लोग इस चाल से सहमत हैं।']},
{spec:[[100,30,.3],[100,10,.2],[100.8,3,.2],[98,16,.4]],seed:152,panel:'vol',patch:function(d){for(var i=38;i<54;i++)d[i].v*=.4},
 over:function(d){var L=mx(d,S,39);return [{t:'h',v:L,label:'Resistance',col:CY}]},
 marks:function(d){var L=mx(d,S,39);var b=H.fi(d.length,function(i){return d[i].h>L},40);return [{i:b<0?42:b,up:1},{i:d.length-1}]},
 title:['Breakout with small volume fails','कम वॉल्यूम का ब्रेकआउट फ़ेल'],
 leg:[['Price pokes above resistance but volume is low. Few people are behind it.','भाव रेज़िस्टेंस के ऊपर झाँका पर वॉल्यूम कम है। बहुत कम लोग साथ हैं।'],['Price falls back below.','भाव वापस नीचे आ गया।']],
 take:['A move with no volume is easy to reverse. Treat it with caution.','बिना वॉल्यूम की चाल आसानी से पलट जाती है। इस पर सावधानी रखो।']}];
FAQ.vol=[
[['Does forex have real volume?','क्या फॉरेक्स में असली वॉल्यूम होता है?'],['Forex is not on one exchange, so brokers show tick volume (number of price changes). It is a rough guide. Crypto exchanges show real volume.','फॉरेक्स एक एक्सचेंज पर नहीं होता, इसलिए ब्रोकर टिक वॉल्यूम (भाव बदलने की गिनती) दिखाते हैं। यह मोटा अंदाज़ा है। क्रिप्टो एक्सचेंज असली वॉल्यूम दिखाते हैं।']],
[['High volume means price will go up?','ज़्यादा वॉल्यूम का मतलब भाव चढ़ेगा?'],['No. High volume only means many are active. It can be up or down. The candle direction tells which.','नहीं। ज़्यादा वॉल्यूम का मतलब सिर्फ़ बहुत लोग सक्रिय हैं। चढ़ाई भी हो सकती है, गिरावट भी। कैंडल की दिशा बताती है।']],
[['How do I use volume with breakouts?','ब्रेकआउट के साथ वॉल्यूम कैसे देखूँ?'],['Compare the breakout bar with the bars before it. See both charts.','ब्रेकआउट वाले डंडे की तुलना पहले के डंडों से करो। दोनों चार्ट देखो।']]];
/* fib */
function fibo(d,L,Hh){return [.382,.5,.618].map(function(r,j){return {t:'h',v:Hh-(Hh-L)*r,label:['38.2%','50%','61.8%'][j],col:['#a78bfa',CY,CB][j]}})}
EX.fib=[
{spec:[[100,30,.4],[120,25,.5],[111,10,.4],[130,22,.5]],seed:161,panel:null,
 over:function(d){var L=mn(d,S,S+3),p=H.maxI(d,S+15,S+30);return fibo(d,L,d[p].h)},
 marks:function(d){var p=H.maxI(d,S+15,S+30);return [{i:H.minI(d,S,S+3)},{i:p,up:1},{i:H.minI(d,p+2,p+14)},{i:d.length-1,up:1}]},
 title:['Pullback stops near the 50-62% zone','पुलबैक 50-62% के पास रुका'],
 leg:[['Swing low: start of the move.','स्विंग लो: चाल की शुरुआत।'],['Swing high: top of the move. Fibonacci lines are drawn from 1 to 2.','स्विंग हाई: चाल की चोटी। फिबोनाची लाइनें 1 से 2 तक खींची जाती हैं।'],['Price pulls back and turns near the 50-61.8% lines.','भाव पीछे आया और 50-61.8% लाइनों के पास पलटा।'],['The uptrend continues to new highs.','अपट्रेंड नई ऊँचाइयों तक चला।']],
 take:['Traders use these levels as places to watch for a bounce, not as sure turning points.','ट्रेडर इन स्तरों को उछाल देखने की जगह मानते हैं, पक्के पलटने के बिंदु नहीं।']},
{spec:[[100,30,.4],[120,25,.5],[104,25,.5],[96,10,.4]],seed:162,panel:null,
 over:function(d){var L=mn(d,S,S+3),p=H.maxI(d,S+15,S+30);return fibo(d,L,d[p].h)},
 marks:function(d){var p=H.maxI(d,S+15,S+30);return [{i:p,up:1},{i:d.length-1}]},
 title:['Price slices through every level','भाव सारे स्तर चीरकर निकल गया'],
 leg:[['Top of the move.','चाल की चोटी।'],['Price passes all Fibonacci lines and keeps falling.','भाव सारी फिबोनाची लाइनें पार करके गिरता रहा।']],
 take:['Fibonacci is not magic. When a level fails, accept it and leave with a small loss.','फिबोनाची जादू नहीं है। स्तर फ़ेल हो जाए तो मानकर छोटे घाटे में निकल जाओ।']}];
FAQ.fib=[
[['How do I draw Fibonacci?','फिबोनाची कैसे खींचूँ?'],['Uptrend: from the swing low to the swing high. Downtrend: from the swing high to the swing low.','अपट्रेंड में: स्विंग लो से स्विंग हाई तक। डाउनट्रेंड में: स्विंग हाई से स्विंग लो तक।']],
[['Does 61.8% always hold?','क्या 61.8% हमेशा टिकता है?'],['No. See Chart 2. It is a zone to watch with other signs like candles and support.','नहीं। चार्ट 2 देखो। यह ऐसा ज़ोन है जिसे कैंडल और सपोर्ट जैसे दूसरे संकेतों के साथ देखो।']],
[['Which swing should I choose?','कौन सा स्विंग चुनूँ?'],['The clearest recent big move. If it is hard to see, skip the trade.','हाल की सबसे साफ़ बड़ी चाल। साफ़ न दिखे तो वह ट्रेड छोड़ दो।']]];
})();
