    }).catch(function(){err.textContent='Could not load data. Check your internet and try again. (Binance is blocked on some networks.)';err.hidden=false}).then(function(){btn.disabled=false;btn.textContent='Start a new round'});
  }
  $('#pr-start').addEventListener('click',start);
  $('#pr-n1').addEventListener('click',function(){if(S)step(1)});
  $('#pr-n5').addEventListener('click',function(){if(S)step(5)});
  $('#pr-buy').addEventListener('click',function(){if(S)open(1)});
  $('#pr-sell').addEventListener('click',function(){if(S)open(-1)});
  $('#pr-close').addEventListener('click',function(){if(S&&S.pos){closeAt(S.C[S.i],'manual');draw();kp()}});
  window.addEventListener('resize',function(){if(S)draw()});
})();


/* ---------- today summary ---------- */
(function(){
  var COINS=[['BTCUSDT','Bitcoin'],['ETHUSDT','Ethereum'],['SOLUSDT','Solana'],['BNBUSDT','BNB']];
  var grid=$('#sumgrid');
  function tagc(t,c){return '<span class="tg2 '+(c||'')+'">'+t+'</span>'}
  function card(name,k){
    var C=k.map(function(x){return +x[4]}),H=k.map(function(x){return +x[2]}),L=k.map(function(x){return +x[3]}),n=C.length,p=C[n-1];
    var e20=emaA(C,20)[n-1],e50=emaA(C,50)[n-1],r=rsiA(C,14)[n-1],ch=(p/C[n-7]-1)*100;
    var hi=Math.max.apply(null,H.slice(-20)),lo=Math.min.apply(null,L.slice(-20)),d=p<10?4:p<1000?2:0;
    var tr,tc,txt;
    if(p>e20&&e20>e50){tr='Uptrend';tc='up';txt='Price is above both the 20 and 50 EMA.'}
    else if(p<e20&&e20<e50){tr='Downtrend';tc='dn';txt='Price is below both the 20 and 50 EMA.'}
    else{tr='No clear direction';tc='';txt='Price is moving between the moving averages.'}
    var rs=r>70?'RSI '+r.toFixed(0)+': overbought, a pause is possible.':r<30?'RSI '+r.toFixed(0)+': oversold, a bounce is possible.':'RSI '+r.toFixed(0)+': normal zone.';
    return '<div class="sc panel"><div class="hd"><b>'+name+'</b><span class="num '+(ch>=0?'up':'dn')+'" style="font-weight:700">'+(ch>=0?'+':'')+ch.toFixed(2)+'% (24h)</span></div>'+
      '<div class="pxx">$'+fmt(p,d)+'</div><div class="tags">'+tagc(tr,tc)+tagc(r>70?'Overbought':r<30?'Oversold':'RSI normal',r>70?'dn':r<30?'up':'')+'</div>'+
      '<p>'+txt+' '+rs+'</p><p>Lowest in the last 80 hours <b class="num">$'+fmt(lo,d)+'</b> (support zone), highest <b class="num">$'+fmt(hi,d)+'</b> (resistance zone).</p></div>';
  }
  function load(){
    Promise.all(COINS.map(function(c){return fetch('https://api.binance.com/api/v3/klines?symbol='+c[0]+'&interval=4h&limit=120').then(function(r){if(!r.ok)throw 0;return r.json()})})).then(function(all){
      grid.innerHTML=all.map(function(k,i){return card(COINS[i][1],k)}).join('');
      $('#sum-note').textContent='Calculated on 4-hour candles. Last update: '+new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    }).catch(function(){if(!grid.innerHTML)grid.innerHTML='<div class="panel" style="padding:16px;color:var(--mu)">Today\'s summary is unavailable right now. Check your internet and reload.</div>'});
  }
  load();setInterval(load,300000);
})();

/* ---------- about / privacy ---------- */
(function(){
  var T={about:['About','<p>Kartik Trading is a free learning space started by Kartik from a village in Almora, Uttarakhand. It teaches crypto and forex trading in simple Hindi.</p><p>No trade signals or investment advice are sold here. Market alerts arrive automatically on the Telegram channel and are for information only.</p><p>For questions, find us on Telegram: t.me/kartiktradinghindi</p>'],
   privacy:['Privacy','<p>This website does not ask for your name, email or any account.</p><p>The calculators, strategy lab and practice arena run in your phone browser. Practice statistics are saved only in your browser, not with us.</p><p>Charts come from TradingView, prices from Binance and Fear &amp; Greed from alternative.me. Those services may keep their own cookies or logs, which we do not control.</p>']};
  var d=$('#dlg');
  $$('[data-dlg]').forEach(function(b){b.addEventListener('click',function(){var t=T[b.dataset.dlg];$('#dlg-t').textContent=t[0];$('#dlg-b').innerHTML=t[1];if(d.showModal)d.showModal()})});
})();



/* ---------- 4-week course ---------- */
(function(){
  var W=[
   ['Week 1: Basics','Know what you are looking at',[
    ['Learn: Bull and Bear markets','g','bull'],['Learn: Long and Short','g','longshort'],['Learn: Reading candlesticks','g','candle'],['Play: Build 5 candle shapes','v','v1'],['Take the 5-question check','q','']]],
   ['Week 2: Risk','The habit that keeps you in the game',[
    ['Learn: Risk management','g','risk'],['Learn: Stop Loss','g','sl'],['Learn: Risk-reward ratio','g','rr'],['Play: See the risk (try 1% and 5%)','v','v2'],['Calculator: size a trade','c','t1']]],
   ['Week 3: Reading charts','Levels, trend and momentum',[
    ['Learn: Support and resistance','g','sr'],['Play: Spot the levels (3 rounds)','v','v3'],['Learn: Trend and trendlines','g','trend'],['Learn: RSI','g','rsi'],['Compare the 5-minute and 1-day meters','a','']]],
   ['Week 4: Practice','Decide, act, review',[
    ['Learn: Multi-timeframe analysis','g','mtf'],['Arena: round 1, always use a Stop Loss','p',''],['Arena: 3 more rounds, note your win rate','p',''],['Strategy lab: EMA crossover vs buy and hold','l',''],['Learn: Trading psychology','g','psy']]]
  ];
  var ALL=[];W.forEach(function(w,wi){w[2].forEach(function(t,ti){ALL.push({id:wi*5+ti,w:wi,t:t})})});
  var KEY='course_done_v1',done={};
  try{var raw=localStorage.getItem(KEY);if(raw)done=JSON.parse(raw)||{}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
  function go(id,smooth){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
  function act(t){
    var k=t[1],v=t[2];
    if(k==='g'){go('tutor');setTimeout(function(){window.askGuru&&window.askGuru(v)},450)}
    else if(k==='v'){var b=document.querySelector('#vz-tabs [data-v='+v+']');if(b)b.click();go('visual')}
    else if(k==='q'){go('quiz')}
    else if(k==='c'){var b2=document.querySelector('#tool-tabs [data-t='+v+']');if(b2)b2.click();go('tools')}
    else if(k==='a'){go('analysis')}
    else if(k==='p'){go('practice')}
    else if(k==='l'){go('lab')}
  }
  var box=$('#weeks');
  function render(){
    var n=0,nextId=-1;ALL.forEach(function(x){if(done[x.id])n++;else if(nextId<0)nextId=x.id});
    box.innerHTML='';
    W.forEach(function(w,wi){
      var d=document.createElement('div');d.className='wk panel';
      d.innerHTML='<h3>'+w[0]+'</h3><div class="wsub">'+w[1]+'</div>';
      w[2].forEach(function(t,ti){
        var id=wi*5+ti,row=document.createElement('div');row.className='task'+(done[id]?' done':'')+(id===nextId?' next':'');
        var cb=document.createElement('input');cb.type='checkbox';cb.checked=!!done[id];cb.setAttribute('aria-label','Mark done: '+t[0]);
        cb.addEventListener('change',function(){if(cb.checked)done[id]=1;else delete done[id];save();render()});
        var b=document.createElement('button');b.type='button';b.className='tt';b.textContent=t[0];
        b.addEventListener('click',function(){act(t)});
        row.appendChild(cb);row.appendChild(b);d.appendChild(row);
      });
      box.appendChild(d);
    });
    $('#cb-fill').style.width=(n/ALL.length*100)+'%';$('#cb-txt').textContent=n+' / '+ALL.length+' done';
    var nb=$('#cb-next'),dn=$('#cb-done');
    if(n===ALL.length){nb.hidden=true;dn.hidden=false;dn.innerHTML='<b>Path complete. Well done.</b> Now keep practising in the arena, follow the Telegram alerts and compare them with your own reading. Never risk money you cannot afford to lose. <a href="https://t.me/kartiktradinghindi" target="_blank" rel="noopener" style="text-decoration:underline">Join the Telegram channel</a>.'}
    else{dn.hidden=true;nb.hidden=false;var nt=ALL[nextId].t[0];nb.textContent=(n?'Continue: ':'Start: ')+nt;nb.onclick=function(){act(ALL[nextId].t)}}
  }
  $('#cb-reset').addEventListener('click',function(){done={};save();render()});
  render();
})();

/* ---------- visual lessons ---------- */
(function(){
  $$('#vz-tabs .chip').forEach(function(b){b.addEventListener('click',function(){
    $$('#vz-tabs .chip').forEach(function(c){c.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');
    ['v1','v2','v3'].forEach(function(id){document.getElementById(id).hidden=id!==b.dataset.v});
    if(b.dataset.v==='v1')drawC();if(b.dataset.v==='v3'&&!SR)srNew();else if(b.dataset.v==='v3')srDraw();
  })});
  /* --- candle builder --- */
  var cv=$('#cd-cv'),I={o:$('#cd-o'),h:$('#cd-h'),l:$('#cd-l'),c:$('#cd-c')};
  function V(){return{o:+I.o.value,h:+I.h.value,l:+I.l.value,c:+I.c.value}}
  function fix(src){
    var v=V();
    if(src==='h'){if(v.h<Math.max(v.o,v.c))v.h=Math.max(v.o,v.c)}
    else if(src==='l'){if(v.l>Math.min(v.o,v.c))v.l=Math.min(v.o,v.c)}
    else{if(v.h<Math.max(v.o,v.c))v.h=Math.max(v.o,v.c);if(v.l>Math.min(v.o,v.c))v.l=Math.min(v.o,v.c)}
    I.h.value=v.h;I.l.value=v.l;
  }
  function drawC(){
    var v=V(),dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;if(!w)return;cv.width=w*dpr;cv.height=h*dpr;
    var c=cv.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);
    var Y=function(p){return h-14-(p/100)*(h-28)},x=w/2,bw=Math.min(90,w*.3),up=v.c>=v.o,col=up?'#2bd98a':'#ff5c6c';
    c.font='13px Hind, sans-serif';c.textBaseline='middle';
    c.strokeStyle='rgba(255,255,255,.07)';for(var g=1;g<5;g++){c.beginPath();c.moveTo(0,h*g/5);c.lineTo(w,h*g/5);c.stroke()}
    c.strokeStyle=col;c.fillStyle=col;c.lineWidth=3;c.beginPath();c.moveTo(x,Y(v.h));c.lineTo(x,Y(v.l));c.stroke();
    var t=Y(Math.max(v.o,v.c)),b=Y(Math.min(v.o,v.c));c.fillRect(x-bw/2,t,bw,Math.max(3,b-t));
    function lab(p,txt,side){c.fillStyle='#9ba7c9';c.textAlign=side;var xx=side==='left'?x+bw/2+10:x-bw/2-10;c.fillText(txt,xx,Y(p));c.strokeStyle='rgba(255,255,255,.25)';c.setLineDash([3,3]);c.lineWidth=1;c.beginPath();c.moveTo(side==='left'?x+bw/2:x-bw/2,Y(p));c.lineTo(xx+(side==='left'?-2:2),Y(p));c.stroke();c.setLineDash([])}
    lab(v.h,'High','left');lab(v.l,'Low','left');lab(v.o,'Open','right');lab(v.c,'Close','right');
    $('#o-open').textContent=v.o;$('#o-high').textContent=v.h;$('#o-low').textContent=v.l;$('#o-close').textContent=v.c;
    var body=Math.abs(v.c-v.o),range=v.h-v.l||1,up2=v.h-Math.max(v.o,v.c),lo2=Math.min(v.o,v.c)-v.l,m;
    var kind=up?'green':'red';
    if(lo2>body*2&&up2<range*.15)m='<b>Hammer:</b> price fell a long way but buyers pulled it back up. After a fall, it is read as a possible reversal.';
    else if(up2>body*2&&lo2<range*.15)m='<b>Shooting star:</b> price rose but sellers pushed it back down. After a rise, it is read as a possible reversal.';
    else if(body<range*.1)m='<b>Doji:</b> open and close are almost equal. Buyers and sellers are equally strong, so direction may change.';
    else if(body>range*.6)m='<b>Big '+kind+' candle:</b> '+(up?'Buyers stayed in control and price closed high. It shows strength.':'Sellers stayed in control and price closed low. It shows weakness.');
    else m='<b>'+(kind==='green'?'Green':'Red')+' candle:</b> '+(up?'Close is above open, so buyers won.':'Close is below open, so sellers won.')+' The thin lines (wicks) show where price went but could not stay.';
    $('#cd-msg').innerHTML=m;
  }
  ['o','c'].forEach(function(k){I[k].addEventListener('input',function(){fix('x');drawC()})});
  I.h.addEventListener('input',function(){fix('h');drawC()});I.l.addEventListener('input',function(){fix('l');drawC()});
  var PR={green:[30,85,28,82],red:[82,86,18,22],hammer:[70,74,15,72],star:[30,88,26,28],doji:[50,78,22,51]};
  $$('[data-p]').forEach(function(b){b.addEventListener('click',function(){var p=PR[b.dataset.p];I.o.value=p[0];I.h.value=p[1];I.l.value=p[2];I.c.value=p[3];drawC()})});
  window.addEventListener('resize',function(){if(!$('#v1').hidden)drawC();else if(!$('#v3').hidden&&SR)srDraw()});
  drawC();
  /* --- risk visual --- */
  var R={cap:$('#rk-cap'),rp:$('#rk-rp'),rr:$('#rk-rr')};
  function rupee(x){return '₹'+fmt(Math.round(x),0)}
  function rk(){
    var cap=+R.cap.value,rp=+R.rp.value,rr=+R.rr.value,loss=cap*rp/100,gain=loss*rr;
    $('#rk-capv').textContent=rupee(cap);$('#rk-rpv').textContent=rp+'% (= '+rupee(loss)+')';$('#rk-rrv').textContent=rr+'x';
    $('#rk-l').style.flexGrow=1;$('#rk-g').style.flexGrow=rr;$('#rk-lt').textContent='-'+rupee(loss);$('#rk-gt').textContent='+'+rupee(gain);
    var ten=cap*Math.pow(1-rp/100,10);$('#rk-ten').textContent=rupee(ten)+' ('+(((ten/cap)-1)*100).toFixed(1)+'%)';
    $('#rk-win').textContent=(100/(1+rr)).toFixed(0)+'%';
    var m;
    if(rp>=5)m='<b>Danger:</b> '+rp+'% risk is far too high. Ten losses in a row would take about half your capital. Professionals risk 1% to 2%.';
    else if(rr<1.5)m='<b>Careful:</b> the Target is only '+rr+'x the risk. You must win more than half your trades. Look for trades with at least 2x.';
    else m='<b>Good balance:</b> risking '+rupee(loss)+' for a possible '+rupee(gain)+'. Winning just 1 in every '+Math.ceil(1+rr)+' trades is enough to avoid a loss.';
    $('#rk-msg').innerHTML=m;
  }
  ['cap','rp','rr'].forEach(function(k){R[k].addEventListener('input',rk)});rk();
  /* --- support game --- */
  var SR=null;
  function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function srNew(){
    var r=rng(Math.floor(Math.random()*1e9)),S=30+r()*15,Rz=S+30+r()*20,p=(S+Rz)/2,K=[];
    for(var i=0;i<56;i++){
      var o=p,hi=o,lo=o,c=o;
      for(var k=0;k<5;k++){
        var pull=((S+Rz)/2-c)*.05;c+=pull+(r()-.5)*7;
        if(c<S){hi=Math.max(hi,c);lo=Math.min(lo,c-r()*1.2);c=S+r()*2.5}
        if(c>Rz){lo=Math.min(lo,c);hi=Math.max(hi,c+r()*1.2);c=Rz-r()*2.5}
        hi=Math.max(hi,c);lo=Math.min(lo,c);
      }
      K.push({o:o,h:hi,l:lo,c:c});p=c;
    }
    SR={K:K,S:S,R:Rz,step:0,score:0,done:false,taps:[]};
    $('#sr-q').textContent='Question 1 of 2: tap the level where price kept turning back up from below (support, the floor).';
    $('#sr-msg').textContent='';srDraw();
  }
  function srScale(){var mn=1e9,mx=-1e9;SR.K.forEach(function(k){if(k.l<mn)mn=k.l;if(k.h>mx)mx=k.h});mn-=6;mx+=6;return{mn:mn,mx:mx}}
  function srDraw(){
    var cv2=$('#sr-cv'),dpr=window.devicePixelRatio||1,w=cv2.clientWidth,h=cv2.clientHeight;if(!w)return;cv2.width=w*dpr;cv2.height=h*dpr;
    var c=cv2.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);var sc=srScale(),n=SR.K.length;
    var Y=function(v){return h-8-(v-sc.mn)/(sc.mx-sc.mn)*(h-16)},X=function(i){return 8+(i+.5)*((w-16)/n)},bw=Math.max(2,(w-16)/n*.6);
    if(SR.done){
      [[SR.S,'43,217,138','Support'],[SR.R,'255,92,108','Resistance']].forEach(function(z){c.fillStyle='rgba('+z[1]+',.16)';c.fillRect(0,Y(z[0]+2.6),w,Y(z[0]-2.6)-Y(z[0]+2.6));c.strokeStyle='rgb('+z[1]+')';c.setLineDash([5,4]);c.beginPath();c.moveTo(0,Y(z[0]));c.lineTo(w,Y(z[0]));c.stroke();c.setLineDash([]);c.fillStyle='rgb('+z[1]+')';c.font='13px Hind,sans-serif';c.fillText(z[2],8,Y(z[0])-6)});
    }
    SR.K.forEach(function(k,i){var up=k.c>=k.o,col=up?'#2bd98a':'#ff5c6c',x=X(i);c.strokeStyle=col;c.fillStyle=col;c.lineWidth=1.4;c.beginPath();c.moveTo(x,Y(k.h));c.lineTo(x,Y(k.l));c.stroke();var t=Y(Math.max(k.o,k.c)),b=Y(Math.min(k.o,k.c));c.fillRect(x-bw/2,t,bw,Math.max(1,b-t))});
    SR.taps.forEach(function(t){c.strokeStyle='#ff9f45';c.lineWidth=2;c.beginPath();c.moveTo(0,Y(t));c.lineTo(w,Y(t));c.stroke()});
  }
  $('#sr-cv').addEventListener('click',function(e){
    if(!SR||SR.done)return;var cv2=this,rc=cv2.getBoundingClientRect(),sc=srScale(),h=rc.height,y=e.clientY-rc.top,v=sc.mn+(h-8-y)/(h-16)*(sc.mx-sc.mn);
    var want=SR.step===0?SR.S:SR.R,d=Math.abs(v-want),pts=d<=3.5?1:0;SR.score+=pts;SR.taps.push(v);
    var name=SR.step===0?'Support':'Resistance';
    if(SR.step===0){SR.step=1;$('#sr-msg').innerHTML=(pts?'✅ <b>Correct!</b> ':'❌ <b>A bit off.</b> ')+'Now question 2: tap the level where price kept rising and then turned back down (resistance, the ceiling).';$('#sr-q').textContent='Question 2 of 2: where is resistance?';srDraw()}
    else{SR.done=true;srDraw();var s=SR.score;$('#sr-q').textContent='Your score: '+s+' / 2';$('#sr-msg').innerHTML=(pts?'✅ <b>Correct!</b> ':'❌ <b>A bit off.</b> ')+'The shaded bands are the real support (green) and resistance (red); the orange lines are where you tapped. '+(s===2?'Sharp eye.':s===1?'Half right. Try again.':'No problem. Look at where price turned again and again; that is a level.')}
  });
  $('#sr-new').addEventListener('click',srNew);
})();

/* ---------- calculators ---------- */
$$('#tool-tabs .chip').forEach(function(b){b.addEventListener('click',function(){
  $$('#tool-tabs .chip').forEach(function(c){c.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');
  $$('.tabpane').forEach(function(p){p.hidden=p.id!==b.dataset.t});
})});
function num(id){return parseFloat(document.getElementById(id).value)}
function kpi(l,v,cls){return '<div class="kpi"><span>'+l+'</span><b class="'+(cls||'')+'">'+v+'</b></div>'}
function show(n,html,err){
  var e=document.getElementById('e'+n),o=document.getElementById('o'+n);
  if(err){e.textContent=err;e.hidden=false;o.hidden=true}else{e.hidden=true;o.innerHTML=html;o.hidden=false}
}
var CALC={
 c1:function(){
  var c=num('a-cap'),r=num('a-rp'),e=num('a-en'),s=num('a-sl'),d=Math.abs(e-s);
