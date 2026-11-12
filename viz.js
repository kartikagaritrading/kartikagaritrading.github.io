/* Kartik Agari: worked-example charts engine (illustrative prices, bilingual) */
(function(){
'use strict';
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(r){var u=0,v;while(!u)u=r();v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function gen(spec,seed,patch){
  var r=rng(seed),c=100,out=[];
  spec.forEach(function(sg){var tgt=sg[0],n=sg[1],nz=sg[2],vm=sg[3]||1;
    for(var k=0;k<n;k++){var o=c,cl=c+(tgt-c)/(n-k)+gauss(r)*nz,
      hi=Math.max(o,cl)+Math.abs(gauss(r))*nz*.5,lo=Math.min(o,cl)-Math.abs(gauss(r))*nz*.5;
      out.push({o:o,h:hi,l:lo,c:cl,v:(60+Math.abs(cl-o)/nz*25)*vm*(.7+r()*.6)});c=cl}});
  if(patch)patch(out);
  return out;
}
function ema(a,n){var k=2/(n+1),p=a[0],o=[];for(var i=0;i<a.length;i++){p=i?a[i]*k+p*(1-k):a[i];o.push(p)}return o}
function rsi(c,n){var o=[],g=0,l=0;for(var i=0;i<c.length;i++){if(!i){o.push(50);continue}
  var d=c[i]-c[i-1],u=d>0?d:0,dn=d<0?-d:0;
  if(i<=n){g+=u/n;l+=dn/n;o.push(i===n?(l===0?100:100-100/(1+g/l)):50)}else{g=(g*(n-1)+u)/n;l=(l*(n-1)+dn)/n;o.push(l===0?100:100-100/(1+g/l))}}return o}
function calc(d){var c=d.map(function(x){return x.c}),e12=ema(c,12),e26=ema(c,26),m=e12.map(function(v,i){return v-e26[i]}),s=ema(m,9);
  return {c:c,rsi:rsi(c,14),macd:m,sig:s,hist:m.map(function(v,i){return v-s[i]}),e20:ema(c,20),e50:ema(c,50)}}
var START=30;
var H={gen:gen,calc:calc,rng:rng,gauss:gauss,ema:ema,START:START,
 fi:function(n,f,from){for(var i=from===undefined?START:from;i<n;i++)if(f(i))return i;return -1},
 li:function(n,f){for(var i=n-1;i>=START;i--)if(f(i))return i;return -1},
 minI:function(d,a,b){var m=a;for(var i=a;i<=b;i++)if(d[i].l<d[m].l)m=i;return m},
 maxI:function(d,a,b){var m=a;for(var i=a;i<=b;i++)if(d[i].h>d[m].h)m=i;return m},
 crosses:function(I,n){var o=[];for(var i=START+1;i<n;i++){var a=I.macd[i-1]-I.sig[i-1],b=I.macd[i]-I.sig[i];if(a<=0&&b>0)o.push([i,'up']);else if(a>=0&&b<0)o.push([i,'dn'])}return o},
 xe:function(I,n,a,b){var o=[];for(var i=START+1;i<n;i++){var p=I[a][i-1]-I[b][i-1],q=I[a][i]-I[b][i];if(p<=0&&q>0)o.push([i,'up']);else if(p>=0&&q<0)o.push([i,'dn'])}return o},
 agg:function(d,k){var o=[];for(var i=0;i+k<=d.length;i+=k){var s=d.slice(i,i+k),h=-1e9,l=1e9,v=0;s.forEach(function(x){if(x.h>h)h=x.h;if(x.l<l)l=x.l;v+=x.v});o.push({o:s[0].o,c:s[k-1].c,h:h,l:l,v:v})}return o}
};
var CG='#2bd98a',CR='#ff5c6c',CY='#ffb02e',CB='#38bdf8',GR='#93a1bd';
function head(h){return '<svg viewBox="0 0 360 '+h+'" role="img" aria-label="chart" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;background:#0b1220;border-radius:10px">'}
function candles(d,from,X,Y,bw){var s='';for(var i=from;i<d.length;i++){var x=d[i],col=x.c>=x.o?CG:CR,cx=X(i);
  s+='<line x1="'+cx.toFixed(1)+'" x2="'+cx.toFixed(1)+'" y1="'+Y(x.h).toFixed(1)+'" y2="'+Y(x.l).toFixed(1)+'" stroke="'+col+'"/>';
  var t=Y(Math.max(x.o,x.c)),b=Y(Math.min(x.o,x.c));s+='<rect x="'+(cx-bw/2).toFixed(1)+'" y="'+t.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+Math.max(1,b-t).toFixed(1)+'" fill="'+col+'"/>'}return s}
function draw(d,I,e,marks){
  var st=e.start===undefined?START:e.start,W=360,PX=8,PW=W-PX*2-22,H1=e.panel?150:200,y0=8,y1=y0+H1,y2=y1+16,H2=76,n=d.length-st,vis=d.slice(st),ov=e.over?e.over(d,I):[];
  var hi=-1e9,lo=1e9;vis.forEach(function(x){if(x.h>hi)hi=x.h;if(x.l<lo)lo=x.l});
  ov.forEach(function(o){var vs=o.t==='h'?[o.v]:o.t==='zone'?[o.v1,o.v2]:o.t==='box'?[o.v1,o.v2]:o.t==='line'?o.pts.map(function(p){return p[1]}):o.t==='ma'?o.arr.slice(st):[];vs.forEach(function(v){if(v>hi)hi=v;if(v<lo)lo=v})});
  var pad=(hi-lo)*.08;hi+=pad;lo-=pad;
  var X=function(i){return PX+(i-st+.5)*PW/n},Y=function(v){return y0+(hi-v)/(hi-lo)*H1},bw=Math.max(2,PW/n*.62),yb=e.panel?y2+H2:y1;
  var s=head(yb+6)+'<rect x="'+PX+'" y="'+y0+'" width="'+PW+'" height="'+H1+'" fill="none" stroke="#1f2b45"/>';
  ov.forEach(function(o){
    if(o.t==='zone')s+='<rect x="'+PX+'" y="'+Y(o.v2).toFixed(1)+'" width="'+PW+'" height="'+Math.max(2,Y(o.v1)-Y(o.v2)).toFixed(1)+'" fill="'+(o.col||'rgba(255,176,46,.14)')+'"/>';
    if(o.t==='box')s+='<rect x="'+X(o.i1).toFixed(1)+'" y="'+Y(o.v2).toFixed(1)+'" width="'+(X(o.i2)-X(o.i1)).toFixed(1)+'" height="'+Math.max(2,Y(o.v1)-Y(o.v2)).toFixed(1)+'" fill="'+(o.col||'rgba(56,189,248,.14)')+'"/>'});
  s+=candles(d,st,X,Y,bw);
  ov.forEach(function(o){
    if(o.t==='h'){s+='<line x1="'+PX+'" x2="'+(PX+PW)+'" y1="'+Y(o.v).toFixed(1)+'" y2="'+Y(o.v).toFixed(1)+'" stroke="'+(o.col||CY)+'" stroke-width="1.2" '+(o.solid?'':'stroke-dasharray="5 3"')+'/>';
      if(o.label)s+='<text x="'+(o.left?PX+3:PX+PW-2)+'" y="'+(Y(o.v)-3).toFixed(1)+'" text-anchor="'+(o.left?'start':'end')+'" fill="'+(o.col||CY)+'" font-size="9.5" font-weight="700">'+o.label+'</text>'}
    if(o.t==='line'){s+='<line x1="'+X(o.pts[0][0]).toFixed(1)+'" y1="'+Y(o.pts[0][1]).toFixed(1)+'" x2="'+X(o.pts[1][0]).toFixed(1)+'" y2="'+Y(o.pts[1][1]).toFixed(1)+'" stroke="'+(o.col||CB)+'" stroke-width="1.6"'+(o.dash?' stroke-dasharray="4 3"':'')+'/>';
      if(o.label)s+='<text x="'+X(o.pts[1][0]).toFixed(1)+'" y="'+(Y(o.pts[1][1])-4).toFixed(1)+'" text-anchor="end" fill="'+(o.col||CB)+'" font-size="9.5" font-weight="700">'+o.label+'</text>'}
    if(o.t==='ma'){var p=[];for(var i=st;i<d.length;i++)p.push(X(i).toFixed(1)+','+Y(o.arr[i]).toFixed(1));s+='<polyline points="'+p.join(' ')+'" fill="none" stroke="'+o.col+'" stroke-width="1.5"/>'}
    if(o.t==='v')s+='<line x1="'+X(o.i).toFixed(1)+'" x2="'+X(o.i).toFixed(1)+'" y1="'+y0+'" y2="'+yb+'" stroke="'+(o.col||'#fff')+'" stroke-opacity=".7" stroke-dasharray="3 3"/>'+(o.label?'<text x="'+(X(o.i)+3).toFixed(1)+'" y="'+(y0+10)+'" fill="'+(o.col||'#fff')+'" font-size="9.5" font-weight="700">'+o.label+'</text>':'')});
  if(e.panel){
    s+='<rect x="'+PX+'" y="'+y2+'" width="'+PW+'" height="'+H2+'" fill="none" stroke="#1f2b45"/>';
    if(e.panel==='rsi'){var R=function(v){return y2+(100-v)/100*H2};
      s+='<rect x="'+PX+'" y="'+R(100)+'" width="'+PW+'" height="'+(R(70)-R(100))+'" fill="rgba(255,92,108,.10)"/><rect x="'+PX+'" y="'+R(30)+'" width="'+PW+'" height="'+(R(0)-R(30))+'" fill="rgba(43,217,138,.10)"/>';
      [30,70].forEach(function(v){s+='<line x1="'+PX+'" x2="'+(PX+PW)+'" y1="'+R(v)+'" y2="'+R(v)+'" stroke="'+GR+'" stroke-dasharray="3 3" stroke-width=".8"/><text x="'+(PX+PW+3)+'" y="'+(R(v)+3)+'" fill="'+GR+'" font-size="9">'+v+'</text>'});
      var p=[];for(var i=st;i<d.length;i++)p.push(X(i).toFixed(1)+','+R(I.rsi[i]).toFixed(1));
      s+='<polyline points="'+p.join(' ')+'" fill="none" stroke="'+CY+'" stroke-width="1.6"/><text x="'+(PX+4)+'" y="'+(y2+11)+'" fill="'+CY+'" font-size="10" font-weight="700">RSI 14</text>'}
    else if(e.panel==='macd'){var mx=0,i;for(i=st;i<d.length;i++)mx=Math.max(mx,Math.abs(I.macd[i]),Math.abs(I.sig[i]),Math.abs(I.hist[i]));mx*=1.15;
      var M=function(v){return y2+H2/2-v/mx*H2/2};
      s+='<line x1="'+PX+'" x2="'+(PX+PW)+'" y1="'+M(0)+'" y2="'+M(0)+'" stroke="'+GR+'" stroke-width=".6" stroke-dasharray="3 3"/>';
      for(i=st;i<d.length;i++){var hv=I.hist[i];s+='<rect x="'+(X(i)-bw/2).toFixed(1)+'" y="'+(hv>=0?M(hv):M(0)).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+Math.max(.5,Math.abs(M(hv)-M(0))).toFixed(1)+'" fill="'+(hv>=0?'rgba(43,217,138,.55)':'rgba(255,92,108,.55)')+'"/>'}
      var a1=[],a2=[];for(i=st;i<d.length;i++){a1.push(X(i).toFixed(1)+','+M(I.macd[i]).toFixed(1));a2.push(X(i).toFixed(1)+','+M(I.sig[i]).toFixed(1))}
      s+='<polyline points="'+a1.join(' ')+'" fill="none" stroke="'+CB+'" stroke-width="1.6"/><polyline points="'+a2.join(' ')+'" fill="none" stroke="'+CY+'" stroke-width="1.4"/><text x="'+(PX+4)+'" y="'+(y2+11)+'" font-size="10" font-weight="700"><tspan fill="'+CB+'">MACD</tspan><tspan fill="'+GR+'"> / </tspan><tspan fill="'+CY+'">Signal</tspan></text>'}
    else if(e.panel==='vol'){var vm=0,k;for(k=st;k<d.length;k++)vm=Math.max(vm,d[k].v);
      for(k=st;k<d.length;k++){var hh=d[k].v/vm*(H2-10);s+='<rect x="'+(X(k)-bw/2).toFixed(1)+'" y="'+(y2+H2-hh).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+hh.toFixed(1)+'" fill="'+(d[k].c>=d[k].o?'rgba(43,217,138,.6)':'rgba(255,92,108,.6)')+'"/>'}
      s+='<text x="'+(PX+4)+'" y="'+(y2+11)+'" fill="'+GR+'" font-size="10" font-weight="700">Volume</text>'}}
  (marks||[]).forEach(function(m,k){var cx=X(m.i);
    if(!m.nov)s+='<line x1="'+cx.toFixed(1)+'" x2="'+cx.toFixed(1)+'" y1="'+y0+'" y2="'+yb+'" stroke="#fff" stroke-opacity=".3" stroke-dasharray="2 3"/>';
    var cy=m.up?Y(d[m.i].h)-11:Y(d[m.i].l)+11;cy=Math.max(y0+9,Math.min(y1-9,cy));
    s+='<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="8" fill="'+CY+'"/><text x="'+cx.toFixed(1)+'" y="'+(cy+3.8).toFixed(1)+'" text-anchor="middle" font-size="11" font-weight="800" fill="#1a1200">'+(k+1)+'</text>'});
  return s+'</svg>';
}
function drawLines(e){
  var W=360,PX=8,PW=W-PX*2-4,h=190,y0=8,ser=e.series(),lo=1e9,hi=-1e9;
  ser.forEach(function(q){q.v.forEach(function(v){if(v>hi)hi=v;if(v<lo)lo=v})});if(e.base!==undefined){if(e.base>hi)hi=e.base;if(e.base<lo)lo=e.base}
  var pd=(hi-lo)*.08;hi+=pd;lo-=pd;var N=ser[0].v.length,X=function(i){return PX+i*PW/(N-1)},Y=function(v){return y0+(hi-v)/(hi-lo)*h};
  var s=head(h+16)+'<rect x="'+PX+'" y="'+y0+'" width="'+PW+'" height="'+h+'" fill="none" stroke="#1f2b45"/>';
  if(e.base!==undefined)s+='<line x1="'+PX+'" x2="'+(PX+PW)+'" y1="'+Y(e.base)+'" y2="'+Y(e.base)+'" stroke="'+GR+'" stroke-dasharray="3 3" stroke-width=".8"/>';
  if(e.split)s+='<line x1="'+X(e.split)+'" x2="'+X(e.split)+'" y1="'+y0+'" y2="'+(y0+h)+'" stroke="#fff" stroke-opacity=".6" stroke-dasharray="4 3"/>';
  ser.forEach(function(q){var p=q.v.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1)});s+='<polyline points="'+p.join(' ')+'" fill="none" stroke="'+q.col+'" stroke-width="2"/>'+(q.end?'<text x="'+(PX+PW-3)+'" y="'+(Y(q.v[N-1])-5).toFixed(1)+'" text-anchor="end" font-size="10" font-weight="700" fill="'+q.col+'">'+q.end+'</text>':'')});
  return s+'</svg>';
}
function drawBars(e){
  var W=360,PX=14,PW=W-PX*2,h=170,y0=22,it=e.items,mx=0,neg=false;it.forEach(function(b){mx=Math.max(mx,Math.abs(b.v));if(b.v<0)neg=true});
  var zero=neg?y0+h/2:y0+h,sc=(neg?h/2:h)*.8,bw=PW/it.length*.55,s=head(h+y0+22);
  s+='<line x1="'+PX+'" x2="'+(PX+PW)+'" y1="'+zero+'" y2="'+zero+'" stroke="'+GR+'" stroke-width=".8"/>';
  it.forEach(function(b,i){var cx=PX+(i+.5)*PW/it.length,bh=Math.abs(b.v)/mx*sc,up=b.v>=0;
    s+='<rect x="'+(cx-bw/2).toFixed(1)+'" y="'+(up?zero-bh:zero).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+bh.toFixed(1)+'" rx="3" fill="'+b.col+'"/><text x="'+cx.toFixed(1)+'" y="'+(up?zero-bh-5:zero+bh+13).toFixed(1)+'" text-anchor="middle" font-size="12" font-weight="800" fill="#e9eef8">'+b.txt+'</text><text x="'+cx.toFixed(1)+'" y="'+(y0+h+15)+'" text-anchor="middle" font-size="11" fill="'+GR+'">'+b.lab+'</text>'});
  return s+'</svg>';
}
function drawMulti(e,d){
  var out='',tags=e.tags;
  e.views.forEach(function(vw,k){var a=vw.agg===1?d:H.agg(d,vw.agg),cut=a.slice(Math.max(0,a.length-(vw.show||44)));
    var ee={start:0,panel:null,over:vw.over?function(){return vw.over(cut)}:null};
    var I={};var sv=draw(cut,I,ee,vw.marks?vw.marks(cut):[]).replace('height:auto','height:auto');
    sv=sv.replace('</svg>','<text x="12" y="22" fill="#fff" font-size="12" font-weight="800">'+tags[k]+'</text></svg>');
    out+='<div style="margin:6px 0">'+sv+'</div>'});
  return out;
}
var HEAD={ex:['Worked examples on charts','चार्ट पर उदाहरण'],
 note:['Illustration with made-up prices, built to explain. Not a real market and not advice.','बनावटी भाव से बनाया समझाने वाला चित्र। असली बाज़ार नहीं और सलाह नहीं।'],
 faq:['What people often ask','लोग अक्सर पूछते हैं']};
function L(p,l){return l==='en'?p[0]:l==='hi'?p[1]:p[0]+'<span class="kv-hi">'+p[1]+'</span>'}
var css='.kxv{margin-top:14px;border-top:1px solid #1f2b45;padding-top:10px}.kxv h5{margin:14px 0 4px;font-size:16px}.kxv h4{margin:0 0 4px}.kxv .kv-note{color:#93a1bd;font-size:13px;margin:0 0 6px}'+
'.kxv .kv-hi{display:block;color:#ffd48a}.kxv ol{margin:8px 0 6px;padding-left:0;list-style:none}.kxv li{display:flex;gap:8px;margin:4px 0;font-size:14.5px}'+
'.kxv li b{flex:none;width:20px;height:20px;border-radius:50%;background:#ffb02e;color:#1a1200;text-align:center;font-size:12px;line-height:20px}.kxv li i{flex:none;width:14px;height:14px;border-radius:3px;margin-top:3px}'+
'.kxv .kv-take{background:rgba(255,176,46,.10);border-left:3px solid #ffb02e;padding:8px 10px;border-radius:6px;font-size:14.5px;margin:6px 0 14px}'+
'.kxv .kv-q{font-weight:700;margin:12px 0 2px}.kxv .kv-a{margin:0 0 6px;font-size:14.5px}';
var inj=false,cache={},KV={EX:{},FAQ:{},H:H,draw:draw};window.KV=KV;
function build(e){
  if(e.type==='lines')return drawLines(e);
  if(e.type==='bars')return drawBars(e);
  var d=gen(e.spec,e.seed,e.patch);
  if(e.type==='multi')return drawMulti(e,d);
  var I=calc(d);return draw(d,I,e,e.marks?e.marks(d,I):[]);
}
window.KVIZ=function(id,l){
  var ex=KV.EX[id];if(!ex)return '';
  if(!inj){try{var st=document.createElement('style');st.textContent=css;document.head.appendChild(st)}catch(x){}inj=true}
  if(!cache[id])cache[id]=ex.map(function(e){try{return build(e)}catch(x){return ''}});
  var h='<div class="kxv" data-nolang><h4>'+L(HEAD.ex,l)+'</h4><p class="kv-note">'+L(HEAD.note,l)+'</p>';
  ex.forEach(function(e,k){
    h+='<h5>'+L(e.title,l)+'</h5>'+cache[id][k]+'<ol>'+(function(){var q=0;return e.leg.map(function(x){return '<li>'+(x[2]?'<i style="background:'+x[2]+'"></i>':'<b>'+(++q)+'</b>')+'<span>'+L(x,l)+'</span></li>'}).join('')})()+'</ol><div class="kv-take">'+L(e.take,l)+'</div>'});
  var fq=KV.FAQ[id]||[];
  if(fq.length)h+='<h4>'+L(HEAD.faq,l)+'</h4>'+fq.map(function(f){return '<p class="kv-q">'+L(f[0],l)+'</p><p class="kv-a">'+L(f[1],l)+'</p>'}).join('');
  return h+'</div>';
};
})();
