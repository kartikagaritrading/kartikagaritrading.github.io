  if([c,r,e,s].some(isNaN)||c<=0||r<=0||d===0) return show(1,'','Fill every field correctly. Entry and Stop Loss must be different.');
  var risk=c*r/100,q=risk/d,val=q*e;
  show(1,kpi('Amount at risk',fmt(risk,2))+kpi('Position size (units)',fmt(q,4))+kpi('Position value',fmt(val,2))+kpi('Leverage needed',(val/c).toFixed(2)+'x'));
 },
 c2:function(){
  var e=num('b-en'),s=num('b-sl'),t=num('b-tg'),q=num('b-q'),d=Math.abs(e-s);
  if([e,s,t,q].some(isNaN)||d===0||q<=0) return show(2,'','Fill every field correctly. Entry and Stop Loss must be different.');
  var rr=Math.abs(t-e)/d,win=1/(1+rr)*100;
  show(2,kpi('Risk : reward','1 : '+rr.toFixed(2))+kpi('Loss if Stop Loss hits',fmt(d*q,2),'dn')+kpi('Gain if Target hits',fmt(Math.abs(t-e)*q,2),'up')+kpi('Win rate needed to break even',win.toFixed(1)+'%'));
 },
 c3:function(){
  var l=num('p-lot'),p=num('p-pip'),v=num('p-val');
  if([l,p,v].some(isNaN)||l<=0||v<=0) return show(3,'','Fill every field correctly.');
  var pv=l*v,pl=pv*p;
  show(3,kpi('Value of 1 pip ($)',fmt(pv,2))+kpi(pl>=0?'Total profit ($)':'Total loss ($)',fmt(Math.abs(pl),2),pl>=0?'up':'dn'));
 },
 c4:function(){
  var s=num('d-st'),a=num('d-ad')||0,r=num('d-r'),m=Math.round(num('d-m'));
  if([s,r,m].some(isNaN)||s<0||m<1||m>600) return show(4,'','Fill every field correctly. Keep months between 1 and 600.');
  var v=s,put=s;for(var i=0;i<m;i++){v=v*(1+r/100)+a;put+=a}
  put=s+a*m;
  show(4,kpi('Final capital',fmt(v,0))+kpi('Total invested',fmt(put,0))+kpi('Total gain',fmt(v-put,0),v>=put?'up':'dn')+kpi('Total growth',((v/put-1)*100).toFixed(1)+'%'));
 }
};
$$('[data-calc]').forEach(function(b){b.addEventListener('click',function(){CALC[b.dataset.calc]()})});
$$('.tabpane input').forEach(function(i){i.addEventListener('keydown',function(e){if(e.key==='Enter'){var b=i.closest('.tabpane').querySelector('[data-calc]');if(b)b.click()}})});


/* ---------- AI guru ---------- */
(function(){
  var AI_ENDPOINT=''; /* later: put the address of a real AI server here */
  var G=[
   ['Basics',[
    ['bull','Bull & Bear markets',['bull','bear','बुल','बियर','तेज़ी','मंदी','बुलिश','बेयरिश','bullish','bearish'],'<p>When prices keep rising for a long time, it is a <b>bull market</b>. When they keep falling for a long time, it is a <b>bear market</b>.</p><div class="eg">Memory trick: a bull thrusts its horns up, a bear swipes its paw down.</div><p>Markets never move in one direction only. Even inside a bull market there are small drops, and inside a bear market there are small bounces.</p>',['candle','longshort']],
    ['longshort','Long & Short',['long','short','लॉन्ग','शॉर्ट','buy','sell','ख़रीद','खरीद','बेच'],'<p><b>Long</b> means buying in the hope the price rises. <b>Short</b> means selling in the hope the price falls, then buying back cheaper later.</p><div class="eg">Example: Bitcoin is at 100. You go Long and it reaches 110: you gain 10. You go Short and it drops to 90: you gain 10. If it moves the wrong way, you lose just as much.</div><p>A Short has no upper limit on loss, so a Stop Loss matters even more there.</p>',['sl','leverage']],
    ['crypto','What is Crypto',['crypto','क्रिप्टो','bitcoin','बिटकॉइन','ethereum','इथेरियम','blockchain'],'<p>Crypto is digital money that no single bank or government controls. <b>Bitcoin</b> is the first and biggest. Other programs and coins run on <b>Ethereum</b>.</p><ul><li>The market is open 24 hours a day, 7 days a week.</li><li>Prices move up and down very fast.</li><li>Small coins carry a higher risk of losing everything.</li></ul><p>Profits from crypto are taxed in India. Check with your tax advisor.</p>',['bull','risk']],
    ['forex','Forex, Pip & Lot',['forex','फॉरेक्स','pip','पिप','lot','लॉट','eurusd','eur/usd','spread','स्प्रेड','currency','करेंसी'],'<p>In Forex you exchange one country\'s currency for another. <b>EUR/USD = 1.1200</b> means 1 euro costs 1.12 dollars.</p><ul><li><b>Pip:</b> the smallest usual price move, the 4th decimal in EUR/USD (0.0001).</li><li><b>Lot:</b> trade size. 1 standard lot = 100,000 units.</li><li><b>Spread:</b> the gap between the buy and sell price. This is the broker\'s earning.</li></ul><div class="eg">On 0.1 lot, a 30 pip gain is about 30 dollars (in EUR/USD). Try it yourself in the Pip calculator in the tools below.</div>',['leverage','sl']],
    ['candle','Reading candlesticks',['candle','कैंडल','कैंडलस्टिक','चार्ट','chart','doji','डोजी','hammer','हथौड़ा','engulfing'],'<p>Every candle tells the story of one time period: where it opened (Open), the highest point (High), the lowest point (Low) and where it closed (Close).</p><ul><li><b>Green candle:</b> close is above open, so buyers won.</li><li><b>Red candle:</b> close is below open, so sellers won.</li><li><b>Long wick:</b> price went there but could not stay.</li></ul><div class="eg">Doji: open and close are almost equal. Buyers and sellers are equally strong, so the direction may change.</div><p>Never decide from one candle. Read it together with nearby candles and support and resistance.</p>',['sr','trend']]
   ]],
   ['Risk & mindset',[
    ['risk','Risk management',['risk','रिस्क','जोखिम','नुकसान','capital','पूँजी','पूंजी','1%'],'<p>The first rule of staying in trading: <b>never risk more than 1% to 2% of your capital on one trade.</b></p><div class="eg">Capital is 50,000. 1% risk = 500. Even if a trade goes wrong, you lose only 500. After 10 losses in a row you are down only about 10%.</div><p>First decide how much you can lose, then decide how much you want to earn. The Position Size calculator below does this maths.</p>',['sl','rr','possize']],
    ['sl','Stop Loss',['stop','स्टॉप','sl','stoploss','stop loss'],'<p>A Stop Loss is the price at which your trade closes automatically, so the loss stays within the limit you chose.</p><ul><li>Set it <b>before</b> you enter the trade, not after.</li><li>Place it where being hit means your idea was wrong, for example below support.</li><li>When you are losing, never move the Stop Loss further away.</li></ul><div class="eg">You buy Bitcoin at 100 and support is at 95. You put the Stop Loss at 94. Your risk is 6 per unit.</div>',['rr','possize']],
    ['rr','Risk-reward ratio',['rr','reward','रिवॉर्ड','रिस्क रिवॉर्ड','risk reward','1:2','1:3','target','टारगेट','win rate'],'<p>Risk-reward shows how much you can gain compared to how much you risk.</p><div class="eg">Risk 5, target 15 gives a ratio of 1:3. You make no loss even if you win only one trade in four. At 1:1 you must win more than half of your trades.</div><p>Skip most trades that offer less than 1:2. The Risk-Reward calculator below shows this.</p>',['possize','psy']],
    ['possize','Position sizing',['position','पोज़िशन','पोजिशन','size','साइज़','कितना लगाऊँ','कितना लगाऊं','quantity'],'<p>Position size is how much quantity to buy. Formula: <b>(Capital × Risk%) ÷ (Entry − Stop Loss)</b>.</p><div class="eg">Capital 100,000, risk 1% = 1,000. Entry 100, Stop Loss 95, difference 5. Quantity = 1,000 ÷ 5 = 200 units.</div><p>You do not need to put half your capital in. What matters is that the loss is only 1,000 when the Stop Loss is hit.</p>',['leverage','psy']],
    ['leverage','Leverage & margin',['leverage','लीवरेज','margin','मार्जिन','liquidation','लिक्विडेशन','10x','100x'],'<p>Leverage lets a broker give you a trade many times bigger than your capital. 10x means a 10,000 trade from 1,000.</p><ul><li>Profit becomes 10 times bigger, and so does loss.</li><li>At 10x, just a 10% move against you can wipe out everything (Liquidation).</li><li>Most beginners lose their capital because of too much leverage.</li></ul><p>While learning, stay at 2x to 3x at most, or use no leverage.</p>',['risk','psy']],
    ['psy','Trading psychology',['psychology','साइकोलॉजी','fomo','डर','लालच','revenge','बदला','emotion','भावना','दिमाग़','जर्नल','journal'],'<p>Most losses come from wrong emotions, not from reading the chart wrong.</p><ul><li><b>FOMO:</b> price has already run and you buy high out of fear of missing out.</li><li><b>Revenge trade:</b> taking a big trade after a loss to win it back quickly.</li><li><b>Greed:</b> not exiting at the target and giving the profit back chasing more.</li></ul><p>Cure: a written plan and a trading journal. For every trade write the Entry, Stop Loss, target and reason. After 3 losses in a row, stop for the day.</p>',['risk','rr']]
   ]],
   ['Technical analysis',[
    ['trend','Trend & trendlines',['trend','ट्रेंड','ट्रेंडलाइन','trendline','uptrend','downtrend','sideways','रेंज','range'],'<p>Trend is the direction of the market. <b>Uptrend:</b> every high and every low is above the previous one (Higher High, Higher Low). <b>Downtrend:</b> both are below the previous ones.</p><ul><li>A line joining the lows acts as support in an uptrend.</li><li>A line joining the highs acts as a barrier in a downtrend.</li><li>When there is a limit on both sides and price moves in between, it is called a Range or Sideways.</li></ul><p>Rule: trading with the trend is easier than guessing against it.</p>',['sr','ma']],
    ['sr','Support & resistance',['support','सपोर्ट','resistance','रेज़िस्टेंस','रेजिस्टेंस','level','लेवल','स्तर','floor','ceiling'],'<p><b>Support:</b> a price where a fall stopped earlier, the floor of the market. <b>Resistance:</b> a price where a rise stopped earlier, the ceiling of the market.</p><ul><li>The more times price touches a level and turns back, the stronger that level.</li><li>After it breaks, support often becomes resistance, and resistance becomes support.</li><li>Treat them as a small zone, not a single line.</li></ul><div class="eg">Draw horizontal lines on the chart above and see where price turned in the last week.</div>',['breakout','fib']],
    ['ma','Moving averages',['ma','ema','sma','मूविंग','एवरेज','moving','average','golden','cross','क्रॉसओवर','crossover'],'<p>A moving average is the average of the last few closing prices, drawn as a smooth line on the chart. <b>EMA</b> gives more weight to recent prices, so it reacts faster.</p><ul><li>Price staying above the EMA means the trend is up.</li><li><b>Crossover:</b> when a fast EMA (like 20) crosses above a slow EMA (like 50) it is a bullish signal; crossing below is bearish.</li></ul><p>In a range market, crossovers give many false signals. Test it on old data in the Strategy Lab.</p>',['rsi','backtest']],
    ['rsi','RSI',['rsi','आरएसआई','overbought','oversold','ओवरबॉट','ओवरसोल्ड'],'<p>RSI is a number from 0 to 100 that shows how strong the recent move has been.</p><ul><li><b>Above 70:</b> buying has been heavy (Overbought), a pause may come.</li><li><b>Below 30:</b> selling has been heavy (Oversold), a bounce may come.</li></ul><div class="eg">In a strong uptrend RSI can stay above 70 for weeks. So selling the moment you see 70 is wrong. Read it together with the trend.</div><p>Divergence: price makes a new high but RSI does not, so the move is getting weak.</p>',['macd','trend']],
    ['macd','MACD',['macd','एमएसीडी','histogram','हिस्टोग्राम','signal','सिग्नल'],'<p>MACD is the difference between two EMAs (12 and 26), plus a signal line (9) and a histogram. It shows the strength and change of a trend.</p><ul><li>MACD line crosses above the signal line: leaning bullish.</li><li>Crosses below: leaning bearish.</li><li>When the histogram starts shrinking, the current move is losing strength.</li></ul><p>MACD is a lagging indicator, meaning it signals after the move has started. Do not rely on it alone.</p>',['rsi','mtf']],
    ['vol','Volume',['volume','वॉल्यूम','मात्रा'],'<p>Volume shows how much was traded in that period. It measures the strength behind a move.</p><ul><li>Price rises and volume rises too: the move has power.</li><li>Price rises but volume falls: the move is weak and may reverse.</li><li>Heavy volume when a level breaks makes a real breakout more likely.</li></ul>',['breakout','sr']],
    ['fib','Fibonacci',['fibonacci','fib','फिबोनाची','फ़िबोनाची','retracement','61.8','38.2'],'<p>After a big move, price often returns part of it. Fibonacci retracement shows the likely stopping levels: <b>38.2%, 50% and 61.8%</b>.</p><div class="eg">Price went from 100 to 200. The 61.8% pullback level is 200 − 61.8 = 138.2. Support is expected there.</div><p>It is not a signal on its own. Where a Fibonacci level and an old support meet, confidence is higher.</p>',['sr','pullback']],
    ['mtf','Multi-timeframe',['timeframe','टाइमफ्रेम','mtf','multi','मल्टी','1h','4h','15m','daily','weekly','टाइम फ्रेम'],'<p>The same market looks different on different timeframes. So go from big to small:</p><ul><li><b>1 day / 1 week:</b> decide the big direction (trend).</li><li><b>4 hours / 1 hour:</b> find support, resistance and the trade zone.</li><li><b>15 minutes / 5 minutes:</b> pick the exact entry time.</li></ul><div class="eg">If the 1 day is bullish and the 15 minute shows a small dip, that is often a buying chance. In reverse, if the 1 day is bearish, be careful on a 15 minute rise.</div><p>Switch the tabs from 1 minute to 1 month in the analysis meter above and see this yourself.</p>',['trend','sr']]
   ]],
   ['Strategy',[
    ['breakout','Breakout & fakeout',['breakout','ब्रेकआउट','fakeout','फ़ेकआउट','फेकआउट','fake','झूठा','false'],'<p><b>Breakout:</b> price breaks a support or resistance and moves ahead. <b>Fakeout:</b> it looks like it broke out but soon comes back inside.</p><ul><li>A real breakout usually comes with higher volume.</li><li>The candle should close outside the level, not just poke a wick through.</li><li>If price returns to the level after breaking and holds (Retest), confidence grows.</li></ul><p>A simple fix: wait for the candle to close, do not jump in at once.</p>',['pullback','vol']],
    ['pullback','Pullback',['pullback','पुलबैक','retest','रीटेस्ट','dip'],'<p>A pullback is a small retreat inside a trend. In a strong uptrend, price dips a little and then rises again. Smart traders wait for this retreat instead of chasing a running price.</p><div class="eg">The trend is up. Price came back to the old resistance (now support) or to the 20 EMA and made a green candle there. That is a possible Entry, with the Stop Loss below that zone.</div>',['sr','ma']],
    ['structure','Market structure',['structure','स्ट्रक्चर','bos','choch','higher high','lower low','smart money','स्मार्ट मनी','institution','संस्था'],'<p>Market structure is the sequence of highs and lows. It tells you whether bulls or bears are in control.</p><ul><li>In an uptrend, if the previous low breaks, be careful: it is the first sign the trend may change.</li><li>In a downtrend, a close above the previous high is the same sign.</li></ul><p>Big players (institutions) trade very large amounts, so they seem to stop or turn price in certain zones. This idea is worth learning, but do not treat it as magic.</p>',['trend','breakout']],
    ['backtest','Backtesting',['backtest','बैकटेस्ट','बैकटेस्टिंग','strategy','रणनीति','स्ट्रैटेजी','test','परख'],'<p>Backtesting means running your strategy on old real prices to see how it would have done.</p><ul><li>Results with more trades are more reliable.</li><li>Always include fees, otherwise the result looks falsely high.</li><li>Check the biggest drop (Max Drawdown): could you bear that loss?</li><li>What worked in one period may not work in every period.</li></ul><p>Try the three strategies in the Strategy Lab above and compare them with simply buying and holding.</p>',['mtf','psy']],
    ['news','News & calendar',['news','ख़बर','खबर','fed','एफ़ईडी','cpi','महँगाई','nfp','rate','ब्याज','calendar','कैलेंडर'],'<p>On numbers like the Fed interest rate, inflation (CPI) and jobs (NFP), the market can move sharply within seconds.</p><ul><li>At such times the spread widens and your Stop Loss may feel further away than expected.</li><li>Beginners should avoid new trades around big news.</li><li>Check in advance the time of the news marked with three highlights in the calendar.</li></ul>',['psy','risk']]
   ]]
  ];
  var IDX={},ORDER=[];G.forEach(function(g){g[1].forEach(function(t){IDX[t[0]]={id:t[0],title:t[1],kw:t[2],body:t[3],next:t[4]};ORDER.push(t[0])})});
  function LT(id){
    var t=IDX[id],h=window.HI_LESSONS&&window.HI_LESSONS[id],l=window.KLANG?window.KLANG.get():'en';
    var vz=(window.KVIZ&&window.KVIZ(id,l))||'';
    if(!h||l==='en')return {title:t.title,body:t.body+vz};
    if(l==='hi')return {title:h.t,body:h.b+vz};
    return {title:t.title+' · '+h.t,body:t.body+'<div class="hi2 blk">'+h.b+'</div>'+vz};
  }
  var msgs=$('#msgs'),box=$('#topics');
  function esc(x){return x.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function add(cls,html){var d=document.createElement('div');d.className='m '+cls;d.innerHTML=html;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
  function nextBtns(ids){
    var h='<div class="nx">';
    ids.forEach(function(i){if(IDX[i])h+='<button type="button" data-t="'+i+'">'+IDX[i].title+'</button>'});
    return h+'</div>';
  }
  function teach(id,asQ){
    var t=IDX[id]; if(!t)return;
    var n=ORDER.indexOf(id),seq=ORDER[n+1];
    var nx=(t.next||[]).slice(); if(seq&&nx.indexOf(seq)<0)nx.unshift(seq);
    var lt=LT(id),d=add('b','<h4>'+lt.title+'</h4>'+lt.body+(nx.length?'<p class="note" style="margin-top:6px">Learn next:</p>'+nextBtns(nx.slice(0,3)):''));
    wire(d);
  }
  function wire(d){d.querySelectorAll('[data-t]').forEach(function(b){b.addEventListener('click',function(){add('u',esc(LT(b.dataset.t).title));teach(b.dataset.t)})})}
  G.forEach(function(g){
    var h=document.createElement('h4');h.textContent=g[0];box.appendChild(h);
    g[1].forEach(function(t){var b=document.createElement('button');b.type='button';b.textContent=t[1];b.addEventListener('click',function(){add('u',esc(t[1]));teach(t[0]);document.getElementById('tutor').scrollIntoView&&0});box.appendChild(b)});
  });
  function norm(x){return x.toLowerCase().replace(/[?!.,।]/g,' ').replace(/\s+/g,' ').trim()}
  var STOP=['क्या','है','कैसे','और','को','का','की','के','में','से','पर','kya','hai','kaise','what','is','how','मुझे','बताओ','समझाओ','सीखना','सीखो'];
  function find(q){
    var s=norm(q),toks=s.split(' '),best=null,bs=0;
    ORDER.forEach(function(id){
      var sc=0;
      IDX[id].kw.forEach(function(k){
        k=norm(k);if(k.length<2)return;
        var ascii=/^[a-z0-9 \/.:%]+$/.test(k),hit;
        if(ascii&&k.indexOf(' ')<0)hit=toks.some(function(t){return t===k||(k.length>3&&t.indexOf(k)===0)});
        else hit=s.indexOf(k)>=0;
        if(hit)sc+=k.length>3?2:1;
      });
      IDX[id].title.toLowerCase().split(/[\s\/()]+/).forEach(function(w){if(w.length>2&&STOP.indexOf(w)<0&&toks.indexOf(w)>=0)sc+=1});
      if(sc>bs){bs=sc;best=id}
    });
    return bs>0?best:null;
  }
  function miss(){
    var d=add('b','<p>I do not have a ready lesson for that question yet. Try one of these topics:</p>'+nextBtns(['candle','sr','rsi','risk','mtf','breakout'])+'<p class="note" style="margin-top:8px">You can also ask on the Telegram channel; new lessons will be added from your questions.</p>');
    wire(d);
  }
  $('#ask').addEventListener('submit',function(e){
    e.preventDefault();
    var inp=$('#q'),q=inp.value.trim();if(!q)return;
    inp.value='';add('u',esc(q));
    if(AI_ENDPOINT){
      var w=add('b','<p>Thinking…</p>');
      fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:q})}).then(function(r){return r.json()}).then(function(j){w.innerHTML='<p>'+esc(String(j.answer||'')).replace(/\n/g,'<br>')+'</p>'}).catch(function(){w.remove();var id=find(q);id?teach(id):miss()});
      return;
    }
    var id=find(q);id?teach(id):miss();
  });
  window.askGuru=function(id){if(!IDX[id])return;add('u',esc(LT(id).title));teach(id)};
  function sayHello(){var hello=add('b','<h4>Hello, I am your trading Guru</h4><p>I explain in simple Hindi with examples. Pick a topic below, or type a question in Hindi or English.</p>'+nextBtns(['bull','candle','risk','sr','rsi','mtf']));
  wire(hello);}
  sayHello();
  window.__onLang=function(){msgs.innerHTML='';sayHello()};
})();

/* ---------- strategy lab ---------- */
var ST={
 ema:{la:'Fast EMA',lb:'Slow EMA',a:20,b:50,h:'Buy when the fast EMA moves above the slow EMA; sell and exit when it moves below.'},
 rsi:{la:'Buy when RSI is below',lb:'Sell when RSI is above',a:30,b:55,h:'Buy when RSI falls very low; exit once it recovers.'},
 brk:{la:'Buy when price clears the high of the last N candles',lb:'Sell when price breaks the low of the last N candles',a:20,b:10,h:'Buy when price breaks above the recent high; exit when it breaks a shorter recent low.'}
};
function stUI(){var s=ST[$('#bt-st').value];$('#bt-la').textContent=s.la;$('#bt-lb').textContent=s.lb;$('#bt-a').value=s.a;$('#bt-b').value=s.b;$('#bt-help').textContent=s.h+' These are long-only strategies and each signal is traded at the start of the next candle.'}
$('#bt-st').addEventListener('change',stUI);stUI();

function emaA(arr,n){var k=2/(n+1),p=arr[0],o=[];for(var i=0;i<arr.length;i++){p=i?arr[i]*k+p*(1-k):arr[i];o.push(p)}return o}
function rsiA(c,n){
  var o=new Array(c.length).fill(50),g=0,l=0;
  for(var i=1;i<c.length;i++){
    var d=c[i]-c[i-1],up=d>0?d:0,dn=d<0?-d:0;
    if(i<=n){g+=up/n;l+=dn/n;if(i===n)o[i]=l===0?100:100-100/(1+g/l)}
    else{g=(g*(n-1)+up)/n;l=(l*(n-1)+dn)/n;o[i]=l===0?100:100-100/(1+g/l)}
  }
  return o;
}
function signals(st,H,L,C,a,b){
  var n=C.length,w=new Array(n).fill(0),pos=0,i;
  if(st==='ema'){var f=emaA(C,a),s=emaA(C,b);for(i=b;i<n;i++)w[i]=f[i]>s[i]?1:0}
  else if(st==='rsi'){var r=rsiA(C,14);for(i=15;i<n;i++){if(!pos&&r[i]<a)pos=1;else if(pos&&r[i]>b)pos=0;w[i]=pos}}
  else{for(i=Math.max(a,b);i<n;i++){var hh=-Infinity,ll=Infinity,j;for(j=i-a;j<i;j++)if(H[j]>hh)hh=H[j];for(j=i-b;j<i;j++)if(L[j]<ll)ll=L[j];
    if(!pos&&C[i]>hh)pos=1;else if(pos&&C[i]<ll)pos=0;w[i]=pos}}
  return w;
}
function backtest(O,H,L,C,T,st,a,b,fee){
  var n=C.length,w=signals(st,H,L,C,a,b),eq=1,pos=0,eqIn=1,pIn=0,iIn=0,curve=[1],trades=[];
  for(var i=1;i<n;i++){
    var want=w[i-1];
    if(pos&&!want){eq*=O[i]/C[i-1];eq*=(1-fee);trades.push({i0:iIn,i1:i,p0:pIn,p1:O[i],r:eq/eqIn-1});pos=0}
    else if(!pos&&want){eqIn=eq;eq*=(1-fee);pos=1;pIn=O[i];iIn=i;eq*=C[i]/O[i]}
    else if(pos){eq*=C[i]/C[i-1]}
    curve.push(eq);
  }
  var open=false;
  if(pos){trades.push({i0:iIn,i1:n-1,p0:pIn,p1:C[n-1],r:eq/eqIn-1,open:true});open=true}
  var peak=1,mdd=0;curve.forEach(function(v){if(v>peak)peak=v;var d=v/peak-1;if(d<mdd)mdd=d});
  var wins=trades.filter(function(t){return t.r>0}),gp=0,gl=0;
  trades.forEach(function(t){if(t.r>0)gp+=t.r;else gl+=-t.r});
  return{curve:curve,bh:C.map(function(v){return v/C[0]}),trades:trades,total:eq-1,hold:C[n-1]/C[0]-1,mdd:mdd,
    win:trades.length?wins.length/trades.length:0,pf:gl>0?gp/gl:(gp>0?Infinity:0),open:open,n:n};
}
function drawCurve(r){
  var cv=$('#bt-cv'),dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;
  cv.width=w*dpr;cv.height=h*dpr;var c=cv.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);
  var all=r.curve.concat(r.bh),mn=Math.min.apply(null,all),mx=Math.max.apply(null,all),pad=[8,44,8,8];
  var X=function(i){return pad[3]+i/(r.n-1)*(w-pad[1]-pad[3])},Y=function(v){return h-pad[2]-(v-mn)/(mx-mn||1)*(h-pad[0]-pad[2])};
  c.font='12px Hind, sans-serif';c.fillStyle='#93a1bd';c.strokeStyle='#1f2b45';c.lineWidth=1;
  for(var g=0;g<=4;g++){var v=mn+(mx-mn)*g/4,y=Y(v);c.beginPath();c.moveTo(pad[3],y);c.lineTo(w-pad[1],y);c.stroke();c.fillText((v).toFixed(2)+'x',w-pad[1]+4,y+4)}
  var line=function(a,col,lw){c.beginPath();a.forEach(function(v,i){i?c.lineTo(X(i),Y(v)):c.moveTo(X(i),Y(v))});c.strokeStyle=col;c.lineWidth=lw;c.lineJoin='round';c.stroke()};
  line(r.bh,'#64748b',1.6);line(r.curve,'#ffb02e',2.2);
}
function pct(v,d){return (v>=0?'+':'')+(v*100).toFixed(d||1)+'%'}
$('#bt-run').addEventListener('click',function(){
  var err=$('#bt-err'),out=$('#bt-out'),btn=this;
  var sym=$('#bt-sym').value,tf=$('#bt-tf').value,st=$('#bt-st').value,a=parseInt($('#bt-a').value,10),b=parseInt($('#bt-b').value,10),fee=parseFloat($('#bt-fee').value)/100;
  err.hidden=true;
  if(!(a>0)||!(b>0)||isNaN(fee)||fee<0||fee>0.05){err.textContent='Enter valid numbers. Keep the fee between 0 and 5%.';err.hidden=false;return}
  if(st==='ema'&&a>=b){err.textContent='The fast EMA number must be smaller than the slow EMA number.';err.hidden=false;return}
  if(st==='rsi'&&a>=b){err.textContent='The buy RSI must be lower than the sell RSI.';err.hidden=false;return}
  btn.disabled=true;btn.textContent='Loading data…';
  fetch('https://api.binance.com/api/v3/klines?symbol='+sym+'&interval='+tf+'&limit=1000').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(k){
    var T=k.map(function(x){return x[0]}),O=k.map(function(x){return +x[1]}),H=k.map(function(x){return +x[2]}),L=k.map(function(x){return +x[3]}),C=k.map(function(x){return +x[4]});
    if(C.length<Math.max(a,b)+30)throw 1;
    var r=backtest(O,H,L,C,T,st,a,b,fee);
    var d0=new Date(T[0]).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),d1=new Date(T[T.length-1]).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
    $('#bt-kpis').innerHTML=
      kpi('Strategy return',pct(r.total),r.total>=0?'up':'dn')+kpi('Buy and hold',pct(r.hold),r.hold>=0?'up':'dn')+
      kpi('Max drawdown',pct(r.mdd),'dn')+kpi('Number of trades',String(r.trades.length))+
      kpi('Win rate',(r.win*100).toFixed(0)+'%')+kpi('Profit factor',r.pf===Infinity?'∞':r.pf.toFixed(2))+
      kpi('Candles',String(r.n))+kpi('Period',d0+' to '+d1);
    out.hidden=false;drawCurve(r);
    var rows=r.trades.slice(-8).reverse().map(function(t){
      var f=function(i){return new Date(T[i]).toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
      return '<tr><td>'+f(t.i0)+' to '+f(t.i1)+(t.open?' (open)':'')+'</td><td>'+fmt(t.p0,t.p0<10?4:2)+'</td><td>'+fmt(t.p1,t.p1<10?4:2)+'</td><td class="'+(t.r>=0?'up':'dn')+'">'+pct(t.r,2)+'</td></tr>';
    }).join('');
    $('#bt-tbl').innerHTML='<tr><th>Period</th><th>Entry</th><th>Exit</th><th>Result</th></tr>'+(rows||'<tr><td colspan="4" style="text-align:left;color:var(--mu)">No trade was made with these settings. Try different numbers.</td></tr>');
    $('#bt-foot').textContent='Ran on the last '+r.n+' candles. Each trade used the full capital and a '+(fee*100).toFixed(2)+'% fee was charged on each side. Slippage, leverage and tax are not included. Past results do not guarantee future ones.';
  }).catch(function(e){
    err.textContent=e===1?'Not enough data for these settings. Use smaller numbers.':'Could not load data. Check your internet and try again. (Binance is blocked on some networks.)';
    err.hidden=false;
  }).then(function(){btn.disabled=false;btn.textContent='Run backtest'});
});
window.addEventListener('resize',function(){});
})();
