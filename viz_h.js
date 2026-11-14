(function(){if(!window.KV)return;var K=window.KV,H=K.H,S=H.START,EX=K.EX,FAQ=K.FAQ,CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',W='#ffffff';
/* expect */
EX.expect=[
{type:'bars',items:[{lab:'70% @1:0.3',v:-.09,txt:'-0.09',col:CR},{lab:'30% @1:2',v:-.1,txt:'-0.10',col:CR},{lab:'50% @1:1',v:0,txt:'0',col:CY},{lab:'60% @1:1',v:.2,txt:'+0.20',col:CG},{lab:'40% @1:3',v:.6,txt:'+0.60',col:CG}],title:['Average result per trade, in R (example)','हर ट्रेड का औसत नतीजा, R में (उदाहरण)'],
 leg:[['Each bar: win rate and reward-to-risk on the label.','हर डंडा: लेबल पर जीत प्रतिशत और रिवॉर्ड-टू-रिस्क।'],['70% wins but tiny wins and big losses: loses money.','70% जीत पर छोटी जीत और बड़ी हार: पैसा खोता है।'],['Only 40% wins with 1:3: the best of these.','सिर्फ़ 40% जीत पर 1:3: इनमें सबसे अच्छा।']],
 take:['Win rate alone tells you nothing. Win rate and reward-to-risk together decide. Example numbers only.','अकेला जीत प्रतिशत कुछ नहीं बताता। जीत प्रतिशत और रिवॉर्ड-टू-रिस्क मिलकर तय करते हैं। सिर्फ़ उदाहरण के आँकड़े।']},
{type:'bars',items:[{lab:'1',v:-1,txt:'-1',col:CR},{lab:'2',v:3,txt:'+3',col:CG},{lab:'3',v:-1,txt:'-1',col:CR},{lab:'4',v:-1,txt:'-1',col:CR},{lab:'5',v:3,txt:'+3',col:CG},{lab:'6',v:-1,txt:'-1',col:CR},{lab:'7',v:-1,txt:'-1',col:CR},{lab:'8',v:3,txt:'+3',col:CG},{lab:'9',v:-1,txt:'-1',col:CR},{lab:'10',v:-1,txt:'-1',col:CR}],title:['10 trades, 3 wins, 7 losses (example)','10 ट्रेड, 3 जीत, 7 हार (उदाहरण)'],
 leg:[['Seven small losses of -1R each.','-1R की सात छोटी हार।'],['Three wins of +3R each.','+3R की तीन जीत।'],['Total: 3 x 3 - 7 x 1 = +2R, even though 70% of trades lost.','कुल: 3 x 3 - 7 x 1 = +2R, भले ही 70% ट्रेड हारे।']],
 take:['You can lose most trades and still profit if wins are bigger than losses. Example only.','अगर जीत हार से बड़ी हो तो ज़्यादातर ट्रेड हारकर भी मुनाफ़ा हो सकता है। सिर्फ़ उदाहरण।']}];
FAQ.expect=[
[['What is R?','R क्या है?'],['R is your risk on one trade. If you risk 100 rupees, 1R is 100 and a 300 profit is 3R.','R एक ट्रेड पर तुम्हारा जोखिम है। 100 रुपये जोखिम पर 1R = 100 और 300 का मुनाफ़ा = 3R।']],
[['How many trades do I need to trust the numbers?','आँकड़ों पर भरोसे के लिए कितने ट्रेड चाहिए?'],['At least 30 to 50. With fewer, luck dominates.','कम से कम 30 से 50। उससे कम में क़िस्मत हावी रहती है।']],
[['Is a high win rate bad?','क्या ज़्यादा जीत प्रतिशत बुरा है?'],['No, but it only helps if your wins are not much smaller than your losses.','नहीं, पर तभी काम का है जब जीत हार से बहुत छोटी न हो।']]];
/* partial */
EX.partial=[
{spec:[[100,30,.3],[103,6,.3],[101,6,.3],[112,20,.4],[108,8,.4]],seed:601,panel:null,
 over:function(d){var e=d[36].c;return [{t:'h',v:e,label:'Entry',col:W},{t:'h',v:e-2,label:'First stop',col:CR,left:1},{t:'h',v:e+2,label:'1R target',col:CG}]},
 marks:function(d){var e=d[36].c,i=37;while(i<d.length-1&&d[i].h<e+2)i++;return [{i:36},{i:i},{i:Math.min(i+8,d.length-1),up:1}]},
 title:['Sell half at 1R, move the stop to entry','1R पर आधा बेचो, स्टॉप एंट्री पर लाओ'],
 leg:[['Entry. The first stop sits 2 below. That distance is 1R.','एंट्री। पहला स्टॉप 2 नीचे। यह दूरी 1R है।'],['Price reaches +1R. Sell half and move the stop to the entry price.','भाव +1R पर पहुँचा। आधा बेचो और स्टॉप एंट्री भाव पर ले आओ।'],['The trade cannot lose now. The rest can keep running.','अब ट्रेड में घाटा नहीं हो सकता। बाक़ी हिस्सा चलता रह सकता है।']],
 take:['Booking part of the profit and moving the stop to entry lowers stress. It also caps your gains if price runs.','आंशिक मुनाफ़ा बुक करने और स्टॉप एंट्री पर लाने से तनाव घटता है। पर भाव दूर गया तो कमाई भी सीमित रहती है।']},
{type:'bars',items:[{lab:'Hold all, reverses',v:-1,txt:'-1R',col:CR},{lab:'Half, reverses',v:.5,txt:'+0.5R',col:CG},{lab:'Hold all, runs',v:3,txt:'+3R',col:CG},{lab:'Half, runs',v:2,txt:'+2R',col:CY}],title:['Two plans, two outcomes (example)','दो योजनाएँ, दो नतीजे (उदाहरण)'],
 leg:[['If price reaches 1R and then reverses: holding all ends at -1R, taking half ends at +0.5R.','भाव 1R छूकर पलटे: पूरा रखने पर -1R, आधा बेचने पर +0.5R।'],['If price runs to 3R: holding all gives +3R, taking half gives +2R.','भाव 3R तक जाए: पूरा रखने पर +3R, आधा बेचने पर +2R।']],
 take:['Partial profits trade some upside for a smoother ride. Neither plan is always better. Example only.','आंशिक मुनाफ़ा कुछ ऊपरी कमाई देकर सफ़र को सहज बनाता है। कोई भी योजना हमेशा बेहतर नहीं। सिर्फ़ उदाहरण।']}];
FAQ.partial=[
[['Where do I take the first partial?','पहला हिस्सा कहाँ बेचूँ?'],['Many use 1R or the nearest support or resistance. Decide it in your plan before the trade.','कई लोग 1R या सबसे पास का सपोर्ट-रेज़िस्टेंस चुनते हैं। यह ट्रेड से पहले प्लान में तय करो।']],
[['Is moving the stop to breakeven always good?','क्या स्टॉप को ब्रेकईवन पर लाना हमेशा अच्छा है?'],['Not always. Moving too early can stop you out on a normal pullback. Give the trade some room.','हमेशा नहीं। बहुत जल्दी लाने पर सामान्य पुलबैक में ही स्टॉप लग सकता है। ट्रेड को थोड़ी जगह दो।']],
[['Can I use a trailing stop for the rest?','क्या बाक़ी हिस्से पर ट्रेलिंग स्टॉप लगा सकता हूँ?'],['Yes. Many traders sell half, then trail the rest.','हाँ। कई ट्रेडर आधा बेचते हैं, फिर बाक़ी पर ट्रेलिंग लगाते हैं।']]];
/* scam */
EX.scam=[
{type:'bars',items:[{lab:'Wins shown',v:20,txt:'+20',col:CG},{lab:'Losses hidden',v:-35,txt:'-35',col:CR},{lab:'Real total',v:-15,txt:'-15',col:CR}],title:['A signal group: shown vs real record (example)','एक सिग्नल ग्रुप: दिखाया बनाम असली रिकॉर्ड (उदाहरण)'],
 leg:[['Green: only winning trades are posted with screenshots.','हरा: सिर्फ़ जीते हुए ट्रेड स्क्रीनशॉट के साथ डाले जाते हैं।'],['Red: losing trades are deleted or never shown.','लाल: हारे हुए ट्रेड मिटा दिए जाते हैं या दिखाए ही नहीं जाते।'],['The full record is a loss.','पूरा रिकॉर्ड घाटे में है।']],
 take:['Always ask for the full, unedited record. Pretty screenshots prove nothing. Example numbers only.','हमेशा पूरा बिना छेड़ा रिकॉर्ड माँगो। सुंदर स्क्रीनशॉट कुछ साबित नहीं करते। सिर्फ़ उदाहरण के आँकड़े।']},
{type:'bars',items:[{lab:'1% a month',v:13,txt:'+13%',col:CG},{lab:'3% a month',v:43,txt:'+43%',col:CY},{lab:'10% a month',v:214,txt:'+214%',col:CR}],title:['What a monthly promise means in a year','महीने के वादे का एक साल में मतलब'],
 leg:[['1% a month compounds to about 13% a year.','महीने के 1% से साल में लगभग 13% बनते हैं।'],['3% a month is about 43% a year.','महीने के 3% से साल में लगभग 43%।'],['10% every month is about 214% a year. Almost nobody keeps this up.','हर महीने 10% यानी साल में लगभग 214%। इसे लगभग कोई नहीं निभा पाता।']],
 take:['A promise of high, steady monthly returns is a warning sign, not a feature.','ऊँचे और तय मासिक रिटर्न का वादा ख़तरे की निशानी है, ख़ूबी नहीं।']}];
FAQ.scam=[
[['How do I spot a scam?','स्कैम कैसे पहचानूँ?'],['Promised profit, pressure to act fast, asks for money or keys, hides losses, and avoids questions. Stop if you see two of these.','मुनाफ़े का वादा, जल्दबाज़ी का दबाव, पैसे या चाबी माँगना, हार छुपाना और सवालों से बचना। इनमें से दो दिखें तो रुक जाओ।']],
[['Are all paid groups scams?','क्या सभी पेड ग्रुप स्कैम हैं?'],['No. But a paid group cannot remove your risk. Verify the record and never trade blindly on a signal.','नहीं। पर पेड ग्रुप तुम्हारा जोखिम ख़त्म नहीं कर सकता। रिकॉर्ड जाँचो और सिग्नल पर आँख बंद करके ट्रेड मत करो।']],
[['What if I already lost money?','अगर पैसा खो चुका हूँ तो?'],['Stop sending more money, save the chats and receipts, and report it to cybercrime.gov.in or helpline 1930 in India.','और पैसा भेजना बंद करो, चैट और रसीदें सँभालो, और भारत में cybercrime.gov.in या हेल्पलाइन 1930 पर शिकायत करो।']]];
/* demolive */
EX.demolive=[
{type:'bars',items:[{lab:'Demo',v:8,txt:'+8',col:CG},{lab:'Live, calm',v:3,txt:'+3',col:CY},{lab:'Live, nervous',v:-4,txt:'-4',col:CR}],title:['Same plan, three situations (example)','वही प्लान, तीन हालात (उदाहरण)'],
 leg:[['Demo: no fear, you follow the plan.','डेमो: डर नहीं, तुम प्लान मानते हो।'],['Live, when you stay calm: results are usually a bit worse.','लाइव में शांत रहे: नतीजे आम तौर पर थोड़े कमज़ोर।'],['Live, when fear takes over: stops moved, trades closed early, plan broken.','लाइव में डर हावी हुआ: स्टॉप खिसकाए, ट्रेड जल्दी बंद किए, प्लान टूटा।']],
 take:['Real money changes behaviour. Start live with a very small size. Example numbers only.','असली पैसा बर्ताव बदलता है। लाइव में बहुत छोटे साइज़ से शुरू करो। सिर्फ़ उदाहरण के आँकड़े।']},
{type:'bars',items:[{lab:'Weeks 1-2',v:10,txt:'10%',col:CB},{lab:'Weeks 3-4',v:25,txt:'25%',col:CB},{lab:'Month 2',v:50,txt:'50%',col:CY},{lab:'Month 3+',v:100,txt:'100%',col:CG}],title:['Size ladder, % of planned size (idea)','साइज़ की सीढ़ी, तय साइज़ का % (विचार)'],
 leg:[['Start live at a small fraction of your planned size.','लाइव में तय साइज़ के छोटे हिस्से से शुरू करो।'],['Move up a step only after following the plan for the whole period.','अगला क़दम तभी जब पूरी अवधि प्लान माना हो।'],['If you break the plan, go back a step.','प्लान तोड़ा तो एक क़दम पीछे आ जाओ।']],
 take:['This is only an idea for gradual scaling, not a rule. Pick your own steps.','यह धीरे-धीरे बढ़ाने का सिर्फ़ एक विचार है, नियम नहीं। अपने क़दम ख़ुद चुनो।']}];
FAQ.demolive=[
[['How long should I practise on demo?','डेमो पर कितने दिन अभ्यास करूँ?'],['Until you have followed your plan for several weeks and logged at least 30 trades. There is no fixed number.','जब तक कई हफ़्ते प्लान माना हो और कम से कम 30 ट्रेड जर्नल में हों। कोई तय संख्या नहीं है।']],
[['Why do results get worse on live?','लाइव में नतीजे ख़राब क्यों होते हैं?'],['Fear and greed appear. Also real fills have spread and slippage that demo may hide.','डर और लालच आ जाते हैं। साथ ही असली भराव में स्प्रेड और स्लिपेज होता है जो डेमो में छुपा रह सकता है।']],
[['How much money should I start with?','कितने पैसे से शुरू करूँ?'],['Only an amount you can lose without it hurting your life. Risk a tiny part of it per trade.','सिर्फ़ उतना जिसे खोने से ज़िंदगी पर असर न पड़े। हर ट्रेड में उसका बहुत छोटा हिस्सा जोखिम में डालो।']]];
/* depth */
EX.depth=[
{type:'bars',items:[{lab:'98',v:120,txt:'120',col:CG},{lab:'99',v:90,txt:'90',col:CG},{lab:'99.5',v:40,txt:'40',col:CG},{lab:'100.5',v:35,txt:'35',col:CR},{lab:'101',v:70,txt:'70',col:CR},{lab:'102',v:150,txt:'150',col:CR}],title:['Order book at price 100 (example)','भाव 100 पर ऑर्डर बुक (उदाहरण)'],
 leg:[['Green: buy orders waiting below the price (bids).','हरा: भाव के नीचे इंतज़ार करते ख़रीद ऑर्डर (बिड)।'],['Red: sell orders waiting above (asks).','लाल: ऊपर इंतज़ार करते बिक्री ऑर्डर (आस्क)।'],['Big stacks can slow price, but orders can also be pulled away at any time.','बड़े ढेर भाव को रोक सकते हैं, पर ऑर्डर कभी भी हटाए जा सकते हैं।']],
 take:['The book shows intentions, not promises. Use it to see how thin or deep the market is.','बुक इरादे दिखाती है, वादे नहीं। इससे देखो कि बाज़ार कितना पतला या गहरा है।']},
{type:'bars',items:[{lab:'Deep book',v:.01,txt:'0.01%',col:CG},{lab:'Thin book',v:.4,txt:'0.4%',col:CY},{lab:'Tiny coin',v:2.5,txt:'2.5%',col:CR}],title:['Price push from the same market buy (example)','एक ही मार्केट ख़रीद से भाव में खिसकाव (उदाहरण)'],
 leg:[['Deep book: almost no slippage.','गहरी बुक: स्लिपेज लगभग नहीं।'],['Thin book: noticeable slippage.','पतली बुक: दिखने लायक़ स्लिपेज।'],['Tiny coin: you can pay much more than the price you saw.','छोटा कॉइन: जो भाव दिखा था उससे कहीं ज़्यादा देना पड़ सकता है।']],
 take:['Thin markets cost more to trade. Prefer liquid markets and consider limit orders.','पतले बाज़ार में ट्रेड महँगा पड़ता है। ज़्यादा कारोबार वाले बाज़ार चुनो और लिमिट ऑर्डर पर सोचो।']}];
FAQ.depth=[
[['What are bid and ask?','बिड और आस्क क्या हैं?'],['Bid is the highest price a buyer will pay. Ask is the lowest price a seller will take. The gap is the spread.','बिड वह सबसे ऊँचा भाव है जिस पर ख़रीदार लेने को तैयार है। आस्क वह सबसे नीचा भाव है जिस पर विक्रेता बेचने को तैयार है। दोनों का फ़र्क स्प्रेड है।']],
[['What is liquidity?','लिक्विडिटी क्या है?'],['How easily you can buy or sell without moving the price. High volume and a deep book mean high liquidity.','बिना भाव हिलाए कितनी आसानी से ख़रीद-बेच सकते हो। ज़्यादा वॉल्यूम और गहरी बुक मतलब ज़्यादा लिक्विडिटी।']],
[['Do large orders on the book predict price?','क्या बुक के बड़े ऑर्डर भाव बताते हैं?'],['Not reliably. They can be cancelled in a moment. Treat them as a clue only.','भरोसे से नहीं। उन्हें पल भर में हटाया जा सकता है। उन्हें सिर्फ़ इशारा मानो।']]];
/* safety */
EX.safety=[
{type:'bars',items:[{lab:'No 2FA',v:10,txt:'high',col:CR},{lab:'SMS code',v:6,txt:'medium',col:CY},{lab:'App code',v:3,txt:'low',col:CG},{lab:'Hardware key',v:1,txt:'lowest',col:CG}],title:['Login risk by protection (idea)','सुरक्षा के हिसाब से लॉगिन का जोखिम (विचार)'],
 leg:[['No second step: a stolen password is enough.','दूसरा क़दम नहीं: चोरी हुआ पासवर्ड ही काफ़ी है।'],['SMS code: better, but phone numbers can be hijacked.','SMS कोड: बेहतर, पर फ़ोन नंबर हाइजैक हो सकते हैं।'],['Authenticator app or hardware key: much safer.','ऑथेंटिकेटर ऐप या हार्डवेयर की: कहीं ज़्यादा सुरक्षित।']],
 take:['Bar heights are only a relative idea, not statistics. Turn on app-based 2FA everywhere.','डंडों की ऊँचाई सिर्फ़ तुलना का विचार है, आँकड़े नहीं। हर जगह ऐप वाला 2FA चालू करो।']},
{type:'bars',items:[{lab:'Exchange',v:20,txt:'trading',col:CY},{lab:'Own wallet',v:80,txt:'long term',col:CG}],title:['Where to keep your money (idea)','पैसा कहाँ रखें (विचार)'],
 leg:[['Exchange: only what you actively trade. An exchange can be hacked or freeze withdrawals.','एक्सचेंज: सिर्फ़ जो तुम सक्रिय ट्रेड करते हो। एक्सचेंज हैक हो सकता है या निकासी रोक सकता है।'],['Own wallet: you hold the keys. Then you must guard the seed phrase yourself.','अपना वॉलेट: चाबी तुम्हारे पास। तब सीड फ्रेज़ तुम्हें ख़ुद सँभालना होगा।']],
 take:['The 20/80 split is only an example. Decide your own, and write the seed phrase on paper, not in photos.','20/80 का बँटवारा सिर्फ़ उदाहरण है। अपना ख़ुद तय करो, और सीड फ्रेज़ काग़ज़ पर लिखो, फ़ोटो में नहीं।']}];
FAQ.safety=[
[['What is a seed phrase?','सीड फ्रेज़ क्या है?'],['A list of 12 or 24 words that can restore your wallet. Anyone who has it can take your coins. Never share it or type it into a website.','12 या 24 शब्दों की सूची जिससे तुम्हारा वॉलेट वापस बन सकता है। जिसके पास हो वह तुम्हारे कॉइन ले सकता है। किसी को मत दो, किसी वेबसाइट में मत डालो।']],
[['Is an exchange safe?','क्या एक्सचेंज सुरक्षित है?'],['Large regulated exchanges are safer, but nothing is risk free. Use 2FA and do not keep more than you need there.','बड़े नियमित एक्सचेंज ज़्यादा सुरक्षित हैं, पर कुछ भी बिना जोखिम का नहीं। 2FA लगाओ और ज़रूरत से ज़्यादा वहाँ मत रखो।']],
[['Someone from support messaged me first. Is it real?','सपोर्ट वाले ने ख़ुद मैसेज किया। क्या वह असली है?'],['Almost surely not. Real support will not ask for codes, keys or remote access. Close it and contact support from the official app.','लगभग पक्का नहीं। असली सपोर्ट कोड, चाबी या रिमोट एक्सेस नहीं माँगता। बंद करो और आधिकारिक ऐप से सपोर्ट से बात करो।']]];
})();
