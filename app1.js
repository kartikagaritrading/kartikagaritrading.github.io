
(function(){
'use strict';
var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var fmt=function(v,d){return Number(v).toLocaleString('en-IN',{minimumFractionDigits:d||0,maximumFractionDigits:d||0})};

/* ---------- TradingView widgets (lazy) ---------- */
function tv(id,name,cfg){
  var el=document.getElementById(id); if(!el) return;
  el.innerHTML='';
  var box=document.createElement('div'); box.className='tradingview-widget-container'; box.style.height='100%'; box.style.width='100%';
  var w=document.createElement('div'); w.className='tradingview-widget-container__widget'; w.style.height='100%'; w.style.width='100%';
  var s=document.createElement('script'); s.async=true; s.type='text/javascript';
  s.src='https://s3.tradingview.com/external-embedding/embed-widget-'+name+'.js';
  s.text=JSON.stringify(cfg);
  box.appendChild(w); box.appendChild(s); el.appendChild(box);
}
var SYMS=[['Bitcoin','BINANCE:BTCUSDT'],['Ethereum','BINANCE:ETHUSDT'],['Gold','OANDA:XAUUSD'],['EUR/USD','FX:EURUSD'],['Nasdaq','FOREXCOM:NSXUSD']];
function lazy(id,fn){
  var el=document.getElementById(id); if(!el) return;
  if(!('IntersectionObserver' in window)){fn();return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();fn()}})},{rootMargin:'400px'});
  io.observe(el);
}
lazy('tv-tape',function(){tv('tv-tape','ticker-tape',{symbols:SYMS.map(function(s){return{proName:s[1],title:s[0]}}),showSymbolLogo:true,colorTheme:'dark',isTransparent:true,displayMode:'adaptive',locale:'in'})});
lazy('tv-overview',function(){tv('tv-overview','market-overview',{colorTheme:'dark',dateRange:'1D',showChart:true,locale:'in',isTransparent:true,showSymbolLogo:true,showFloatingTooltip:true,width:'100%',height:'520',
  tabs:[
   {title:'Crypto',symbols:[{s:'BINANCE:BTCUSDT',d:'Bitcoin'},{s:'BINANCE:ETHUSDT',d:'Ethereum'},{s:'BINANCE:BNBUSDT',d:'BNB'},{s:'BINANCE:SOLUSDT',d:'Solana'},{s:'BINANCE:XRPUSDT',d:'XRP'}]},
   {title:'Forex',symbols:[{s:'FX:EURUSD',d:'EUR/USD'},{s:'FX:GBPUSD',d:'GBP/USD'},{s:'FX:USDJPY',d:'USD/JPY'},{s:'FX_IDC:USDINR',d:'USD/INR'}]},
   {title:'Indices & gold',symbols:[{s:'FOREXCOM:NSXUSD',d:'Nasdaq 100'},{s:'FOREXCOM:SPXUSD',d:'S&P 500'},{s:'OANDA:XAUUSD',d:'Gold'},{s:'TVC:USOIL',d:'Crude Oil'}]}
  ]})});

function chips(id,onPick){
  var box=document.getElementById(id);
  SYMS.forEach(function(s,i){
    var b=document.createElement('button'); b.className='chip'; b.type='button'; b.textContent=s[0]; b.setAttribute('aria-pressed',i===0?'true':'false');
    b.addEventListener('click',function(){$$('#'+id+' .chip').forEach(function(c){c.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');onPick(s[1])});
    box.appendChild(b);
  });
}
function chartW(sym){tv('tv-chart','advanced-chart',{autosize:true,symbol:sym,interval:'60',timezone:'Asia/Kolkata',theme:'dark',style:'1',locale:'in',allow_symbol_change:true,hide_side_toolbar:false,studies:['RSI@tv-basicstudies'],support_host:'https://www.tradingview.com'})}
function taW(sym){tv('tv-ta','technical-analysis',{interval:'1h',width:'100%',height:'480',isTransparent:true,symbol:sym,showIntervalTabs:true,displayMode:'single',locale:'in',colorTheme:'dark'})}
chips('chart-chips',chartW); chips('ta-chips',taW);
lazy('tv-chart',function(){chartW(SYMS[0][1])});
lazy('tv-ta',function(){taW(SYMS[0][1])});
lazy('tv-cal',function(){tv('tv-cal','events',{colorTheme:'dark',isTransparent:true,width:'100%',height:'520',locale:'in',importanceFilter:'-1,0,1',countryFilter:'us,in,eu,gb,jp,cn'})});

/* ---------- live hero (Binance) ---------- */
var last={};
function setPx(el,v,key){
  var old=last[key]; el.textContent=v.txt;
  if(old!==undefined&&v.n!==old){el.classList.remove('flash-up','flash-dn');void el.offsetWidth;el.classList.add(v.n>old?'flash-up':'flash-dn')}
  last[key]=v.n;
}
function spark(vals){
  var cv=$('#lv-spark'),dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;
  cv.width=w*dpr;cv.height=h*dpr;var c=cv.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);
  var mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),up=vals[vals.length-1]>=vals[0],col=up?'#22c55e':'#ef4444';
  var X=function(i){return i/(vals.length-1)*(w-2)+1},Y=function(v){return h-4-(v-mn)/(mx-mn||1)*(h-10)};
  c.beginPath();vals.forEach(function(v,i){i?c.lineTo(X(i),Y(v)):c.moveTo(X(i),Y(v))});
  c.strokeStyle=col;c.lineWidth=2;c.lineJoin='round';c.stroke();
  c.lineTo(X(vals.length-1),h);c.lineTo(X(0),h);c.closePath();
  var g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,col+'44');g.addColorStop(1,col+'00');c.fillStyle=g;c.fill();
}
function live(){
  var syms=encodeURIComponent(JSON.stringify(['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT']));
  fetch('https://api.binance.com/api/v3/ticker/24hr?symbols='+syms).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){
    var m={};a.forEach(function(x){m[x.symbol]=x});
    var b=m.BTCUSDT,p=+b.lastPrice,ch=+b.priceChangePercent;
    setPx($('#lv-px'),{n:p,txt:'$'+fmt(p,p<1000?2:0)},'btc');
    var cEl=$('#lv-chg');cEl.textContent='24h: '+(ch>=0?'+':'')+ch.toFixed(2)+'%';cEl.className='chg num '+(ch>=0?'up':'dn');
    setPx($('#m-eth'),{n:+m.ETHUSDT.lastPrice,txt:'$'+fmt(m.ETHUSDT.lastPrice,0)},'eth');
    setPx($('#m-bnb'),{n:+m.BNBUSDT.lastPrice,txt:'$'+fmt(m.BNBUSDT.lastPrice,0)},'bnb');
    setPx($('#m-sol'),{n:+m.SOLUSDT.lastPrice,txt:'$'+fmt(m.SOLUSDT.lastPrice,2)},'sol');
    $('#lv-time').textContent=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    $('#lv-note').textContent='';
  }).catch(function(){$('#lv-note').textContent='Live price is unavailable right now. The ticker and charts may still work.'});
}
function sparkLoad(){
  fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=48').then(function(r){return r.json()}).then(function(k){spark(k.map(function(x){return +x[4]}))}).catch(function(){});
}
live();sparkLoad();setInterval(live,15000);setInterval(sparkLoad,300000);
window.addEventListener('resize',function(){clearTimeout(window.__rs);window.__rs=setTimeout(sparkLoad,250)});

/* ---------- fear & greed ---------- */
(function(){
  var HI={};
  fetch('https://api.alternative.me/fng/?limit=1').then(function(r){return r.json()}).then(function(j){
    var d=j.data[0],v=+d.value;
    $('#fg-n').textContent=v;$('#fg-l').textContent=HI[d.value_classification]||d.value_classification;
    $('#fg-i').style.left=v+'%';
    $('#fg-d').textContent=v<30?'People are panic-selling':v>70?'People are buying with excitement':'Neither too fearful nor too greedy';
  }).catch(function(){$('#fg-l').textContent='Not available now'});
})();

/* ---------- quiz ---------- */
(function(){
  var Q=[
   {q:'What does a green (bullish) candle mean?',o:['It closed above where it opened','It closed below where it opened','No trades happened'],a:0,w:'In a green candle the price rose after opening and closed higher.'},
   {q:'What is support?',o:['A price where a fall stopped before','A price where a rise stopped before','A helpline from your broker'],a:0,w:'Support is the floor of the market. Resistance is its ceiling.'},
   {q:'Why do traders use a Stop Loss?',o:['To increase profit','To fix the maximum loss in advance','To reduce broker fees'],a:1,w:'A Stop Loss says how much loss you accept if you are wrong.'},
   {q:'RSI shows 78. What does that usually mean?',o:['Too much buying has happened (overbought)','Too much selling has happened (oversold)','The indicator is broken'],a:0,w:'Above 70 is called overbought. A pause is possible, not certain.'},
   {q:'What does a 1:3 risk-reward mean?',o:['Risk 3 to make 1','Risk 1 to make a possible 3','Winning 1 of every 3 trades'],a:1,w:'With 1:3, even winning just 1 trade in 4 does not lose money.'}
  ];
  var i=0,score=0,body=$('#quiz-body');
  function show(){
    if(i>=Q.length){body.innerHTML='<p class="q">Your score: <b>'+score+' / '+Q.length+'</b></p><p class="why">'+(score>=4?'Excellent. Now try a strategy in the Strategy lab.':'No problem. Revisit the Level 1 topics with the Guru and try again.')+'</p><button class="btn" id="q-re" style="margin-top:12px">Play again</button>';$('#q-re').onclick=function(){i=0;score=0;show()};return}
    var q=Q[i];
    body.innerHTML='<p class="note">Question '+(i+1)+' / '+Q.length+'</p><p class="q">'+q.q+'</p><div class="opts"></div><p class="why" id="q-why"></p>';
    var box=body.querySelector('.opts'),done=false;
    q.o.forEach(function(t,k){
      var b=document.createElement('button');b.className='opt';b.type='button';b.textContent=t;
      b.onclick=function(){
        if(done)return;done=true;
        var kids=box.children;kids[q.a].classList.add('ok');
        if(k===q.a){score++}else{b.classList.add('bad')}
        $('#q-why').textContent=(k===q.a?'Correct. ':'Wrong. ')+q.w;
        var nx=document.createElement('button');nx.className='btn sm';nx.style.marginTop='12px';nx.textContent=i<Q.length-1?'Next question':'See score';
        nx.onclick=function(){i++;show()};body.appendChild(nx);
      };
      box.appendChild(b);
    });
  }
  show();
})();

$$('.gl').forEach(function(b){b.addEventListener('click',function(){var t=document.getElementById('tutor');t.scrollIntoView({behavior:'smooth'});setTimeout(function(){window.askGuru&&window.askGuru(b.dataset.g)},350)})});


/* ---------- practice simulator ---------- */
(function(){
  var S=null,MAXSTEPS=120;
  var cv=$('#pr-cv');
  function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
  function money(v){return (v<0?'-':'')+'$'+fmt(Math.abs(v),2)}
  function unreal(){if(!S.pos)return 0;return (S.C[S.i]-S.pos.entry)*S.pos.qty*S.pos.dir}
  function kp(){
    var u=unreal(),eq=S.bal+u,wr=S.trades.length?Math.round(S.trades.filter(function(t){return t.pnl>0}).length/S.trades.length*100)+'%':'—';
    $('#pr-kpis').innerHTML=kpi('Account (total)',money(eq),eq>=10000?'up':'dn')+kpi('Open trade profit/loss',S.pos?money(u):'No open trade',u>0?'up':u<0?'dn':'')+kpi('Trades / win rate',S.trades.length+' / '+wr)+kpi('Candles left',String(MAXSTEPS-S.steps));
    $('#pr-close').disabled=!S.pos||S.done;
    $('#pr-buy').disabled=!!S.pos||S.done;$('#pr-sell').disabled=!!S.pos||S.done;
    $('#pr-n1').disabled=S.done;$('#pr-n5').disabled=S.done;
  }
  function draw(){
    var dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;
    var c=cv.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);
    var N=60,a=Math.max(0,S.i-N+1),b=S.i,mn=Infinity,mx=-Infinity,k;
    for(k=a;k<=b;k++){if(S.L[k]<mn)mn=S.L[k];if(S.H[k]>mx)mx=S.H[k]}
    if(S.pos){[S.pos.sl,S.pos.tp,S.pos.entry].forEach(function(v){if(v<mn)mn=v;if(v>mx)mx=v})}
    var pad=(mx-mn)*.06||1;mn-=pad;mx+=pad;
    var pr=56,X=function(j){return 6+(j-a+.5)*((w-pr-12)/N)},Y=function(v){return h-8-(v-mn)/(mx-mn)*(h-16)};
    var bw=Math.max(2,(w-pr-12)/N*.6);
    c.font='11px Hind, sans-serif';c.fillStyle='#93a1bd';c.strokeStyle='#1f2b45';c.lineWidth=1;
    for(var g=0;g<=3;g++){var v=mn+(mx-mn)*g/3,y=Y(v);c.beginPath();c.moveTo(0,y);c.lineTo(w-pr,y);c.stroke();c.fillText(fmt(v,v<10?3:0),w-pr+4,y+4)}
    for(k=a;k<=b;k++){
      var up=S.C[k]>=S.O[k],col=up?'#22c55e':'#ef4444',x=X(k);
      c.strokeStyle=col;c.fillStyle=col;c.beginPath();c.moveTo(x,Y(S.H[k]));c.lineTo(x,Y(S.L[k]));c.stroke();
      var y1=Y(Math.max(S.O[k],S.C[k])),y2=Y(Math.min(S.O[k],S.C[k]));c.fillRect(x-bw/2,y1,bw,Math.max(1,y2-y1));
    }
    function hl(v,col,t){var y=Y(v);c.strokeStyle=col;c.setLineDash([5,4]);c.beginPath();c.moveTo(0,y);c.lineTo(w-pr,y);c.stroke();c.setLineDash([]);c.fillStyle=col;c.fillText(t,w-pr+4,y-3)}
    if(S.pos){hl(S.pos.entry,'#93a1bd','Entry');hl(S.pos.sl,'#ef4444','SL');hl(S.pos.tp,'#22c55e','Target')}
  }
  function say(t){$('#pr-msg').textContent=t}
  function closeAt(price,why){
    var p=S.pos,pnl=(price-p.entry)*p.qty*p.dir,R=pnl/p.risk;
    S.bal+=pnl;S.trades.push({pnl:pnl,R:R,why:why});S.pos=null;
    var st=store('pr_stats')||{n:0,w:0};st.n++;if(pnl>0)st.w++;store('pr_stats',st);
    say((why==='sl'?'Stop Loss hit. ':why==='tp'?'Target hit. ':'You closed the trade. ')+'Result: '+money(pnl)+' ('+(R>=0?'+':'')+R.toFixed(2)+'R).'+(why==='sl'?' The loss stayed within your limit. That is the job of a Stop Loss.':''));
  }
  function step(n){
    for(var q=0;q<n&&!S.done;q++){
      if(S.i>=S.C.length-1||S.steps>=MAXSTEPS){finish();return}
      S.i++;S.steps++;
      if(S.pos){
        var p=S.pos,i=S.i;
        if(p.dir===1){if(S.L[i]<=p.sl){closeAt(p.sl,'sl')}else if(S.H[i]>=p.tp){closeAt(p.tp,'tp')}}
        else{if(S.H[i]>=p.sl){closeAt(p.sl,'sl')}else if(S.L[i]<=p.tp){closeAt(p.tp,'tp')}}
      }
    }
    if(S.steps>=MAXSTEPS||S.i>=S.C.length-1){finish()}
    draw();kp();
  }
  function open(dir){
    if(S.pos||S.done)return;
    var e=S.C[S.i],slp=parseFloat($('#pr-sl').value)/100,rr=parseFloat($('#pr-rr').value),risk=S.bal*.01,qty=risk/(e*slp);
    S.pos={dir:dir,entry:e,sl:e*(1-dir*slp),tp:e*(1+dir*slp*rr),qty:qty,risk:risk};
    say((dir===1?'Long':'Short')+' taken. Entry '+fmt(e,e<10?4:2)+'. If the Stop Loss hits you lose '+money(risk)+'; if the Target hits you gain '+money(risk*rr)+'. Now step the candles forward.');
    draw();kp();
  }
  function finish(){
    if(S.done)return;
    if(S.pos)closeAt(S.C[S.i],'end');
    S.done=true;
    var n=S.trades.length,w=S.trades.filter(function(t){return t.pnl>0}).length,net=S.bal-10000,tip;
    if(!n)tip='You took no trade. Waiting can be a good decision, but for practice take at least one trade.';
    else if(net>=0&&w/n>=.4)tip='Well done. Notice that you fixed the risk in advance. That habit lasts in real trading.';
    else if(net<0)tip='A loss, but that is what practice is for. Check whether you traded against the trend or entered far from support and resistance. Ask the AI Guru about "support resistance" and "trend".';
    else tip='A profit, but the win rate is low. Check whether your risk-reward was good or whether luck did the work.';
    var all=store('pr_stats')||{n:0,w:0};
    var d=$('#pr-sum');d.hidden=false;
    d.innerHTML='<b>Round complete.</b><p style="margin:6px 0">Trades: '+n+' · Won: '+w+' · Final account: '+money(S.bal)+' ('+(net>=0?'+':'')+((net/100)).toFixed(1)+'%)</p><p style="color:var(--mu);margin-bottom:8px">'+tip+'</p><p class="note">All practice trades so far: '+all.n+', won: '+all.w+'</p><button class="btn gold sm" type="button" id="pr-again" style="margin-top:8px">Practise again</button> <a class="btn sm" href="https://t.me/kartiktradinghindi" target="_blank" rel="noopener" style="margin-top:8px">Join Telegram</a>';
    $('#pr-again').onclick=start;
    say('Round over. Look at the chart to see how the market moved on.');
    draw();kp();
  }
  function start(){
    var sym=$('#pr-sym').value,tf=$('#pr-tf').value,btn=$('#pr-start'),err=$('#pr-err');
    err.hidden=true;btn.disabled=true;btn.textContent='Loading data…';
    fetch('https://api.binance.com/api/v3/klines?symbol='+sym+'&interval='+tf+'&limit=1000').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(k){
      if(k.length<300)throw 0;
      var st=80+Math.floor(Math.random()*(k.length-80-MAXSTEPS-5));
      S={O:k.map(function(x){return +x[1]}),H:k.map(function(x){return +x[2]}),L:k.map(function(x){return +x[3]}),C:k.map(function(x){return +x[4]}),i:st,bal:10000,pos:null,trades:[],steps:0,done:false};
      $('#pr-box').hidden=false;$('#pr-sum').hidden=true;
      say('An unlabelled slice of past market is open. Read the chart, judge the trend, then buy or sell. Or step forward and wait first.');
      draw();kp();
