(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff',GR='#93a1bd';
function nz(a,f){var r=H.fi(a.length,f);return r<0?a.length-1:r}
function trade(e0,sd,td){return function(d){var p=d[e0].c,s=p-sd,t=p+td,n=d.length-1;return [{t:'box',i1:e0,i2:n,v1:p,v2:t,col:'rgba(43,217,138,.15)'},{t:'box',i1:e0,i2:n,v1:s,v2:p,col:'rgba(255,92,108,.15)'},{t:'h',v:p,label:'Entry',col:W},{t:'h',v:s,label:'Stop',col:CR},{t:'h',v:t,label:'Target',col:CG}]}}
function C(i,o,c,h,l){return function(d){var x=d[i];x.o=o;x.c=c;x.h=h;x.l=l}}
function GRc(){return GR}
function mx(d,a,b){return d[H.maxI(d,a,b)].h}
function mn(d,a,b){return d[H.minI(d,a,b)].l}
/* RSI */
EX.rsi=[
{spec:[[100,40,.7],[84,16,.6],[98,24,.6]],seed:3,panel:'rsi',title:['Chart 1: RSI went below 30, then price bounced','चार्ट 1: RSI 30 के नीचे गया, फिर भाव उछला'],
 marks:function(d,I){return [{i:nz(d,function(i){return I.rsi[i]<30})},{i:d.length-1,up:1}]},
 leg:[['RSI drops under 30 (oversold): price has fallen fast.','RSI 30 के नीचे गया (ओवरसोल्ड): भाव तेज़ी से गिर चुका है।'],['Later price is higher than at 1.','बाद में भाव 1 वाली जगह से ऊपर है।']],
 take:['Here the bounce worked. Look at Chart 2 before you trust it.','यहाँ उछाल काम कर गया। भरोसा करने से पहले चार्ट 2 देखो।']},
{spec:[[100,40,.7],[62,50,.8]],seed:5,panel:'rsi',title:['Chart 2: RSI went below 30, price kept falling','चार्ट 2: RSI 30 के नीचे गया, भाव गिरता ही रहा'],
 marks:function(d,I){return [{i:nz(d,function(i){return I.rsi[i]<30})},{i:d.length-1}]},
 leg:[['Same signal as Chart 1: RSI under 30.','चार्ट 1 जैसा ही संकेत: RSI 30 के नीचे।'],['Price is much lower. RSI stayed low for long.','भाव काफ़ी नीचे है। RSI बहुत देर नीचे रहा।']],
 take:['A buyer at 1 kept losing. In a strong downtrend RSI can stay low for days.','1 पर खरीदने वाला घाटे में रहा। तेज़ गिरावट में RSI कई दिन नीचे रह सकता है।']},
{spec:[[100,40,.7],[150,50,.8]],seed:7,panel:'rsi',title:['Chart 3: RSI above 70, price kept rising','चार्ट 3: RSI 70 के ऊपर, फिर भी भाव चढ़ता रहा'],
 marks:function(d,I){return [{i:nz(d,function(i){return I.rsi[i]>70}),up:1},{i:d.length-1,up:1}]},
 leg:[['RSI goes over 70 (overbought).','RSI 70 के ऊपर गया (ओवरबॉट)।'],['Much later RSI is still high and price is far higher.','बहुत बाद भी RSI ऊँचा है और भाव कहीं ऊपर है।']],
 take:['Selling at 1 just because RSI hit 70 would miss most of the move.','सिर्फ़ RSI 70 छूने पर 1 पर बेच देते तो ज़्यादातर चाल छूट जाती।']}];
FAQ.rsi=[
[['Should I always buy when RSI goes below 30?','क्या RSI 30 के नीचे जाते ही हमेशा खरीद लूँ?'],['No. Chart 1 bounced, Chart 2 kept falling. The difference is the bigger trend. Under 30 only means "fell fast".','नहीं। चार्ट 1 में उछला, चार्ट 2 में गिरता रहा। फ़र्क बड़े ट्रेंड का है। 30 के नीचे का मतलब सिर्फ़ "तेज़ी से गिरा" है।']],
[['RSI is above 70. Should I sell?','RSI 70 के ऊपर है, बेच दूँ?'],['See Chart 3: in a strong uptrend RSI stays high while price climbs. Check trend and resistance first, and keep a stop-loss.','चार्ट 3 देखो: तेज़ी में RSI ऊँचा रहता है और भाव चढ़ता है। पहले ट्रेंड और रेज़िस्टेंस देखो, और स्टॉप-लॉस रखो।']],
[['Which RSI setting should I use?','RSI की कौन सी सेटिंग रखूँ?'],['14 is the common default. A smaller number jumps more, a bigger one is slower. Start with 14 and do not keep changing it.','14 आम सेटिंग है। छोटा नंबर ज़्यादा उछलता है, बड़ा धीमा चलता है। 14 से शुरू करो, बार-बार मत बदलो।']]];
/* MACD */
EX.macd=[
{spec:[[100,40,.5],[91,16,.5],[110,36,.5]],seed:11,panel:'macd',title:['Chart 1: MACD crossover when the trend turned','चार्ट 1: ट्रेंड पलटते समय MACD की कटान'],
 marks:function(d,I){var lo=H.minI(d,S,d.length-1),c=H.crosses(I,d.length).filter(function(x){return x[0]>lo&&x[1]==='up'})[0];return [{i:lo},{i:c?c[0]:Math.min(d.length-1,lo+8),up:1},{i:d.length-1,up:1}]},
 leg:[['Price makes its low after a fall.','गिरावट के बाद भाव का सबसे निचला बिंदु।'],['MACD line crosses above Signal: momentum turns up.','MACD लाइन Signal के ऊपर कटी: रफ़्तार ऊपर मुड़ी।'],['Price is higher now. The signal came a bit late but caught the move.','अब भाव ऊपर है। संकेत थोड़ी देर से आया पर चाल पकड़ ली।']],
 take:['MACD works best when a real trend change follows.','MACD तब सबसे अच्छा चलता है जब असली ट्रेंड बदलाव आए।']},
{spec:[[100,36,.4],[103,5,.3],[97,6,.3],[103,6,.3],[97,6,.3],[103,6,.3],[97,6,.3],[101,6,.3]],seed:2,panel:'macd',title:['Chart 2: sideways market, many false crossovers','चार्ट 2: साइडवेज़ बाज़ार में बार-बार नकली कटान'],
 marks:function(d,I){return H.crosses(I,d.length).slice(0,4).map(function(x){return {i:x[0],up:x[1]==='dn'}})},
 leg:[['Cross 1: looks like a signal.','कटान 1: संकेत जैसा लगता है।'],['Cross 2: reverses right away.','कटान 2: तुरंत उल्टा हो गया।'],['Cross 3: another one.','कटान 3: एक और।'],['Cross 4: price went nowhere.','कटान 4: भाव कहीं नहीं पहुँचा।']],
 take:['In a range the lines cross again and again and each trade loses a little. Check the trend first.','रेंज में लाइनें बार-बार कटती हैं और हर ट्रेड में थोड़ा घाटा होता है। पहले ट्रेंड देखो।']}];
FAQ.macd=[
[['Should I buy as soon as MACD crosses up?','MACD ऊपर कटते ही खरीद लूँ?'],['Not by itself. Chart 1 shows a good one, Chart 2 shows many false ones. First check if the market trends or moves sideways.','अकेले नहीं। चार्ट 1 में अच्छी कटान है, चार्ट 2 में कई नकली। पहले देखो बाज़ार ट्रेंड में है या साइडवेज़।']],
[['What do the histogram bars tell me?','हिस्टोग्राम के डंडे क्या बताते हैं?'],['They show the gap between MACD and Signal. Shorter bars mean the push is fading, even before the lines cross.','यह MACD और Signal की दूरी है। डंडे छोटे होने का मतलब ज़ोर घट रहा है, लाइनें कटने से पहले ही।']],
[['Why is MACD always a bit late?','MACD थोड़ा देर से क्यों बताता है?'],['It is built from averages of old prices, so it follows price. Use it as confirmation, not as a forecast.','यह पुराने भावों के औसत से बना है, इसलिए भाव के पीछे चलता है। पुष्टि के लिए इस्तेमाल करो, अंदाज़े के लिए नहीं।']]];
/* bull */
EX.bull=[{spec:[[100,30,.6],[135,24,1],[96,28,1]],seed:21,panel:null,
 over:function(d){var a=H.minI(d,S,S+8),p=H.maxI(d,S+12,d.length-1);return [{t:'line',pts:[[a,d[a].l],[p,d[p].h]],col:CG,label:'Bull'},{t:'line',pts:[[p,d[p].h],[d.length-1,d[d.length-1].l]],col:CR,label:'Bear'}]},
 marks:function(d){var a=H.minI(d,S,S+8),p=H.maxI(d,S+12,d.length-1);return [{i:a},{i:p,up:1},{i:d.length-1}]},
 title:['One full cycle: bull then bear','एक पूरा चक्र: पहले बुल, फिर बियर'],
 leg:[['Start of a long rise.','लंबी बढ़त की शुरुआत।'],['Top: the rise stops, sellers take over.','ऊँचाई: बढ़त रुकी, बेचने वाले हावी।'],['A long fall: price is back near the start.','लंबी गिरावट: भाव शुरुआत के पास लौट आया।']],
 take:['Between 1 and 2 buyers won (bull). Between 2 and 3 sellers won (bear). Both phases last a long time, not a day.','1 से 2 तक खरीदार जीते (बुल)। 2 से 3 तक बेचने वाले (बियर)। दोनों दौर लंबे चलते हैं, एक दिन के नहीं।']}];
FAQ.bull=[
[['Is a green candle a bull market?','एक हरी कैंडल का मतलब क्या बुल मार्केट है?'],['No. One candle is one moment. A bull market is many weeks or months of higher highs, like 1 to 2 above.','नहीं। एक कैंडल एक पल है। बुल मार्केट कई हफ़्ते-महीनों की ऊँची चोटियाँ हैं, जैसे ऊपर 1 से 2।']],
[['Can I make money in a bear market?','बियर मार्केट में कमाई हो सकती है?'],['Yes, by short selling, but it is risky. Many beginners simply stay out until the fall ends.','हाँ, शॉर्ट करके, पर रिस्क है। कई नए लोग गिरावट रुकने तक बाहर रहते हैं।']],
[['How do I know the top is in?','टॉप आ गया, कैसे पता चले?'],['Nobody knows in advance. Traders wait for the trend to break, which is covered in the Trend and Structure lessons.','पहले से कोई नहीं जानता। ट्रेडर ट्रेंड टूटने का इंतज़ार करते हैं, यह ट्रेंड और स्ट्रक्चर वाले पाठों में है।']]];
/* longshort */
EX.longshort=[
{spec:[[100,34,.4],[100,6,.3],[110,30,.5]],seed:31,panel:null,title:['Long: buy first, sell higher','लॉन्ग: पहले खरीदो, ऊँचा बेचो'],
 over:function(d){var p=d[S+6].c;return [{t:'h',v:p,label:'Buy',col:W}]},
 marks:function(d){return [{i:S+6},{i:d.length-1,up:1}]},
 leg:[['You buy here.','यहाँ तुम खरीदते हो।'],['You sell higher. Gap = profit.','ऊँचे भाव पर बेचते हो। फ़र्क = मुनाफ़ा।']],
 take:['Long wins when price goes up. If it falls instead, you lose that same gap.','भाव चढ़े तो लॉन्ग में मुनाफ़ा। उल्टा गिरे तो वही फ़र्क घाटा बनता है।']},
{spec:[[100,34,.4],[100,6,.3],[90,30,.5]],seed:32,panel:null,title:['Short: sell first, buy back lower','शॉर्ट: पहले बेचो, सस्ता वापस खरीदो'],
 over:function(d){var p=d[S+6].c;return [{t:'h',v:p,label:'Sell',col:W}]},
 marks:function(d){return [{i:S+6,up:1},{i:d.length-1}]},
 leg:[['You sell (short) here.','यहाँ तुम बेचते (शॉर्ट) हो।'],['You buy back lower. Gap = profit.','सस्ता वापस खरीदते हो। फ़र्क = मुनाफ़ा।']],
 take:['Short wins when price falls. If price rises, the loss can keep growing, so a stop-loss is a must.','भाव गिरे तो शॉर्ट में मुनाफ़ा। चढ़े तो घाटा बढ़ता जाता है, इसलिए स्टॉप-लॉस ज़रूरी।']}];
FAQ.longshort=[
[['How can I sell something I do not own?','जो चीज़ मेरे पास नहीं, उसे बेच कैसे सकता हूँ?'],['In forex and crypto futures the platform lets you open a short position. You are betting on the price, not holding the coin.','फॉरेक्स और क्रिप्टो फ्यूचर्स में प्लेटफ़ॉर्म शॉर्ट पोज़िशन खोलने देता है। तुम भाव पर दाँव लगाते हो, कॉइन रखते नहीं।']],
[['Which is riskier, long or short?','लॉन्ग ज़्यादा रिस्की है या शॉर्ट?'],['A long can lose at most what you put in. A short has no top, so the loss can be larger. Always use a stop.','लॉन्ग में ज़्यादा से ज़्यादा लगाई रकम जाती है। शॉर्ट की कोई ऊपरी सीमा नहीं, घाटा बड़ा हो सकता है। स्टॉप हमेशा रखो।']],
[['Should a beginner short?','नए ट्रेडर को शॉर्ट करना चाहिए?'],['First practice long and stops on a demo account. Add short later, once the basics feel easy.','पहले डेमो में लॉन्ग और स्टॉप सीखो। बेसिक आसान लगने लगें तब शॉर्ट जोड़ो।']]];
/* crypto */
EX.crypto=[
{type:'bars',items:[{lab:'Forex',v:.5,txt:'~0.5%',col:CB},{lab:'Gold',v:1,txt:'~1%',col:CY},{lab:'Bitcoin',v:3,txt:'~3%',col:'#f7931a'},{lab:'Altcoin',v:8,txt:'~8%',col:CR}],title:['A busy day: rough size of the move','एक हलचल वाले दिन की चाल का मोटा आकार'],
 leg:[['Forex pair moves little in a day.','फॉरेक्स जोड़ी एक दिन में कम हिलती है।'],['Gold moves a bit more.','सोना थोड़ा ज़्यादा।'],['Bitcoin swings several percent.','बिटकॉइन कई प्रतिशत झूलता है।'],['Small coins can swing much more.','छोटे कॉइन इससे कहीं ज़्यादा।']],
 take:['These are rough illustrations, not exact data. The idea: crypto moves far more, so profit and loss both come faster.','ये मोटे उदाहरण हैं, सटीक आँकड़े नहीं। बात यह है: क्रिप्टो बहुत ज़्यादा हिलता है, इसलिए मुनाफ़ा और घाटा दोनों जल्दी आते हैं।']},
{spec:[[100,30,.5],[112,25,.6],[90,8,.7],[100,8,.5]],seed:41,panel:null,title:['A sharp crash inside a few candles','कुछ ही कैंडल में तेज़ गिरावट'],
 marks:function(d){var p=H.maxI(d,S,d.length-1),b=H.minI(d,p,d.length-1);return [{i:p,up:1},{i:b},{i:d.length-1,up:1}]},
 leg:[['Fast rise.','तेज़ चढ़ाई।'],['Price drops hard within a few candles.','कुछ ही कैंडल में भाव तेज़ गिरा।'],['It recovers partly. Anyone with a tight stop or high leverage was already out.','आंशिक वापसी। टाइट स्टॉप या ज़्यादा लीवरेज वाले पहले ही बाहर हो चुके थे।']],
 take:['Crypto trades 24 hours, so such moves can come at night. Use smaller size than in forex.','क्रिप्टो 24 घंटे चलता है, ऐसी चाल रात में भी आ सकती है। फॉरेक्स से छोटा साइज़ रखो।']}];
FAQ.crypto=[
[['Is crypto better than forex for beginners?','नए लोगों के लिए क्रिप्टो फॉरेक्स से बेहतर है?'],['Neither is better. Crypto moves more, so it is easier to win big and also to lose big. Start with a small size.','कोई बेहतर नहीं। क्रिप्टो ज़्यादा हिलता है, इसलिए बड़ा कमाना भी आसान और गँवाना भी। छोटे साइज़ से शुरू करो।']],
[['Why does crypto trade on weekends?','क्रिप्टो वीकेंड पर भी क्यों चलता है?'],['There is no central exchange that closes. It runs 24x7, so a gap-free but sudden move can come any time.','कोई एक एक्सचेंज नहीं जो बंद हो। यह 24x7 चलता है, इसलिए अचानक चाल कभी भी आ सकती है।']],
[['Is a big green day safe to chase?','बड़े हरे दिन के पीछे दौड़ना सही है?'],['See Chart 2: a fast rise can reverse as fast. Waiting for a pullback is usually safer. See the Pullback lesson.','चार्ट 2 देखो: तेज़ चढ़ाई उतनी ही तेज़ उलट सकती है। पुलबैक का इंतज़ार आम तौर पर सुरक्षित है। पुलबैक वाला पाठ देखो।']]];
/* forex */
EX.forex=[
{spec:[[100,34,.3],[100,6,.2],[103,24,.3]],seed:51,panel:null,title:['A 50-pip move on EUR/USD','EUR/USD में 50 पिप की चाल'],
 over:function(d){var p=d[S+6].c,q=d[d.length-1].c;return [{t:'h',v:p,label:'1.1000',col:W,left:1},{t:'h',v:q,label:'1.1050',col:CG,left:1}]},
 marks:function(d){return [{i:S+6},{i:d.length-1,up:1}]},
 leg:[['You buy at 1.1000.','तुम 1.1000 पर खरीदते हो।'],['Price reaches 1.1050. The 4th decimal moved by 50, so it is 50 pips.','भाव 1.1050 पहुँचा। चौथे दशमलव में 50 की चाल, यानी 50 पिप।']],
 take:['1 pip = 0.0001 on most pairs. 50 pips = 0.0050.','ज़्यादातर जोड़ियों में 1 पिप = 0.0001। 50 पिप = 0.0050।']},
{type:'bars',items:[{lab:'0.01 lot',v:.1,txt:'$0.10',col:CB},{lab:'0.1 lot',v:1,txt:'$1',col:CY},{lab:'1.0 lot',v:10,txt:'$10',col:CR}],title:['What one pip is worth (EUR/USD, approx.)','एक पिप की कीमत (EUR/USD, लगभग)'],
 leg:[['Micro lot: a pip is about 10 cents.','माइक्रो लॉट: एक पिप करीब 10 सेंट।'],['Mini lot: about 1 dollar per pip.','मिनी लॉट: करीब 1 डॉलर प्रति पिप।'],['Standard lot: about 10 dollars per pip.','स्टैंडर्ड लॉट: करीब 10 डॉलर प्रति पिप।']],
 take:['So a 50-pip move earns about 5 dollars on 0.1 lot and 50 dollars on 1.0 lot. Loss is the same size, so start tiny.','यानी 50 पिप की चाल 0.1 लॉट पर करीब 5 डॉलर और 1.0 लॉट पर 50 डॉलर देती है। घाटा भी इतना ही, इसलिए छोटे से शुरू करो।']}];
FAQ.forex=[
[['What is a pip in simple words?','पिप आसान भाषा में क्या है?'],['It is the smallest usual step of a currency price, the 4th decimal (0.0001). Pips tell you how far price moved.','यह करेंसी भाव का सबसे छोटा आम कदम है, चौथा दशमलव (0.0001)। पिप बताता है भाव कितना चला।']],
[['What is a lot?','लॉट क्या है?'],['The size of your trade. A bigger lot makes every pip worth more, for profit and for loss. See Chart 2.','तुम्हारे ट्रेड का साइज़। बड़ा लॉट हर पिप की कीमत बढ़ाता है, मुनाफ़े की भी और घाटे की भी। चार्ट 2 देखो।']],
[['Is JPY different?','JPY वाली जोड़ियाँ अलग हैं?'],['Yes, for JPY pairs a pip is the 2nd decimal (0.01). Always check your platform.','हाँ, JPY जोड़ियों में पिप दूसरा दशमलव (0.01) होता है। अपना प्लेटफ़ॉर्म ज़रूर जाँचो।']]];
/* candle */
EX.candle=[
{spec:[[100,60,.3]],seed:61,panel:null,patch:function(d){C(34,100,103,103.2,99.7)(d);C(38,102.5,99.5,102.7,99.3)(d);C(42,100,100.1,102,98)(d)},
 marks:function(d){return [{i:34,up:1},{i:38,up:1},{i:42,up:1}]},title:['Three kinds of candles','तीन तरह की कैंडल'],
 leg:[['Big green body, short wicks: buyers were strong all session.','बड़ी हरी बॉडी, छोटी बत्ती: पूरे समय खरीदार मज़बूत।'],['Big red body: sellers were strong.','बड़ी लाल बॉडी: बेचने वाले मज़बूत।'],['Tiny body with long wicks (doji): both sides tried, nobody won. Indecision.','छोटी बॉडी, लंबी बत्तियाँ (डोजी): दोनों ने ज़ोर लगाया, कोई नहीं जीता। असमंजस।']],
 take:['Body = open to close. Wick = how far price went and came back.','बॉडी = खुला से बंद भाव। बत्ती = भाव कहाँ तक गया और लौट आया।']},
{spec:[[100,30,.4],[88,22,.5],[88.5,4,.3],[95,8,.4]],seed:62,panel:null,patch:function(d){var i=55,o=d[i-1].c;d[i]={o:o,c:o+.6,h:o+.9,l:o-3.8,v:d[i].v*1.6}},
 marks:function(d){return [{i:55},{i:d.length-1,up:1}]},title:['Long lower wick after a fall (hammer)','गिरावट के बाद लंबी निचली बत्ती (हैमर)'],
 leg:[['Price dived, then buyers pushed it back up and it closed near the top. Long lower wick.','भाव गिरा, फिर खरीदारों ने वापस ऊपर धकेला और ऊपर के पास बंद हुआ। लंबी निचली बत्ती।'],['Price rose afterwards.','बाद में भाव चढ़ा।']],
 take:['The long wick shows sellers got rejected there. It is a hint, not a promise: wait for the next candle.','लंबी बत्ती बताती है वहाँ बेचने वाले ठुकरा दिए गए। यह इशारा है, पक्का वादा नहीं: अगली कैंडल का इंतज़ार करो।']},
{spec:[[100,30,.4],[104,20,.4],[104.5,3,.2],[96,12,.5]],seed:63,panel:null,patch:function(d){var i=53;d[i-1]={o:104,c:104.6,h:104.8,l:103.9,v:90};d[i]={o:104.9,c:102.4,h:105,l:102.2,v:170}},
 marks:function(d){return [{i:53,up:1},{i:d.length-1}]},title:['Big red candle swallows the green one (engulfing)','बड़ी लाल कैंडल ने हरी को निगल लिया (एंगल्फ़िंग)'],
 leg:[['Red body covers the whole green body before it. Sellers took over at the top.','लाल बॉडी ने पिछली हरी बॉडी को पूरा ढक लिया। ऊपर बेचने वाले हावी हो गए।'],['Price fell after.','बाद में भाव गिरा।']],
 take:['Patterns work better at a key level (support or resistance), not in the middle of nowhere.','पैटर्न किसी अहम स्तर (सपोर्ट या रेज़िस्टेंस) पर बेहतर चलते हैं, बीच में कहीं नहीं।']}];
FAQ.candle=[
[['What do the colours mean?','रंगों का क्या मतलब है?'],['Green: close above open. Red: close below open. Colours can differ on your app, check once.','हरा: बंद भाव खुले से ऊपर। लाल: नीचे। तुम्हारे ऐप में रंग अलग हो सकते हैं, एक बार जाँच लो।']],
[['Do candle patterns always work?','क्या कैंडल पैटर्न हमेशा चलते हैं?'],['No. They are hints. They work better at support or resistance and with the trend. Test them before trusting.','नहीं, ये इशारे हैं। सपोर्ट-रेज़िस्टेंस और ट्रेंड के साथ बेहतर चलते हैं। भरोसा करने से पहले परखो।']],
[['Which timeframe candle is best?','कौन से टाइमफ़्रेम की कैंडल बेहतर?'],['Bigger timeframes (1 hour, 4 hour, daily) have less noise. 1-minute candles give many false signals.','बड़े टाइमफ़्रेम (1 घंटा, 4 घंटा, डेली) में शोर कम होता है। 1 मिनट की कैंडल में नकली संकेत ज़्यादा।']]];
})();
