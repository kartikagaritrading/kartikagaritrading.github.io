/* Kartik Trading: language engine (Hindi / English / Both) */
(function(){
'use strict';
var D=window.HI_DICT||{};
var KEYS=Object.keys(D).filter(function(k){return k.length>12||/: $/.test(k)||/^ /.test(k)||/ $/.test(k)}).sort(function(a,b){return b.length-a.length});
var RULES=[
 [/^Question (\d+)\s*(?:of|\/)\s*(\d+)$/,'सवाल $1 / $2'],
 [/^Your score: (.*)$/,'तुम्हारा स्कोर: $1'],
 [/^Lowest in the last 80 hours/,'पिछले 80 घंटों का सबसे निचला'],
 [/\(support zone\), highest/,'(सपोर्ट ज़ोन), सबसे ऊँचा'],
 [/\(resistance zone\)\./,'(रेज़िस्टेंस ज़ोन)।']
];
var KEY='klang',lang='hi';
try{var q=(location.search.match(/[?&]lang=(hi|en|both)/)||[])[1];var s=q||localStorage.getItem(KEY);if(s==='hi'||s==='en'||s==='both')lang=s;if(q)localStorage.setItem(KEY,q)}catch(e){var q2=(location.search.match(/[?&]lang=(hi|en|both)/)||[])[1];if(q2)lang=q2}
var META=new WeakMap();
var INLINE={SPAN:1,B:1,I:1,STRONG:1,EM:1,A:1,BUTTON:1,LABEL:1,TH:1,TD:1,OPTION:1,NAV:1,SMALL:1,CODE:1,SUMMARY:1,CAPTION:1,TEXT:1,TSPAN:1,TITLE:1};
var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,SVG:1,CANVAS:1};

function tr(s){
  var t=s.trim(); if(!t||!/[A-Za-z]{2}/.test(t)) return null;
  var lead=s.slice(0,s.indexOf(t)), tail=s.slice(s.indexOf(t)+t.length);
  if(D.hasOwnProperty(t)) return lead+D[t]+tail;
  if(D.hasOwnProperty(s)) return D[s];
  for(var i=0;i<RULES.length;i++){ if(RULES[i][0].test(t)) return lead+t.replace(RULES[i][0],RULES[i][1])+tail; }
  var out=s,ch=false;
  for(var j=0;j<KEYS.length;j++){ var k=KEYS[j]; if(out.indexOf(k)>=0){ out=out.split(k).join(D[k]); ch=true } }
  return ch?out:null;
}
function skipNode(n){
  var p=n.parentNode; if(!p||p.nodeType!==1) return true;
  if(SKIP[p.nodeName.toUpperCase()]) return true;
  if(p.closest&&p.closest('.hi2,[data-nolang]')) return true;
  return false;
}
function dropSpan(m){ if(m.span&&m.span.parentNode) m.span.parentNode.removeChild(m.span); m.span=null }
function proc(n){
  if(skipNode(n)) return;
  var cur=n.nodeValue, m=META.get(n);
  if(!m||cur!==m.applied){ if(m&&m.span) dropSpan(m); m={en:cur,applied:cur,span:null}; META.set(n,m) }
  var hi=tr(m.en), want=m.en;
  if(hi&&lang==='hi'){ want=hi; dropSpan(m) }
  else if(hi&&lang==='both'){
    var tag=n.parentNode.nodeName.toUpperCase();
    if(!INLINE[tag] && m.en.trim().length>3){
      if(!m.span){ var sp=document.createElement('span'); sp.className='hi2'; sp.textContent=hi.trim(); n.parentNode.insertBefore(sp,n.nextSibling); m.span=sp }
      else if(m.span.textContent!==hi.trim()) m.span.textContent=hi.trim();
    } else dropSpan(m);
  } else dropSpan(m);
  if(n.nodeValue!==want) n.nodeValue=want;
  m.applied=n.nodeValue;
}
var ATTRS=['placeholder','aria-label','title','alt'];
function attrs(root){
  var els=root.querySelectorAll?root.querySelectorAll('[placeholder],[aria-label],[title],[alt]'):[];
  Array.prototype.forEach.call(els,function(el){
    ATTRS.forEach(function(a){
      if(!el.hasAttribute(a)) return;
      var key='data-en-'+a, cur=el.getAttribute(a);
      if(!el.hasAttribute(key)) el.setAttribute(key,cur);
      var en=el.getAttribute(key), hi=tr(en);
      var want=(lang==='hi'&&hi)?hi:en; if(cur!==want) el.setAttribute(a,want);
    });
  });
}
function walk(root){
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,list=[];
  while((n=w.nextNode())) list.push(n);
  list.forEach(proc);
  if(root.nodeType===1) attrs(root);
}
var titleEn=document.title;
function setTitle(){
  var hi=tr(titleEn);
  document.title=(lang==='hi'&&hi)?hi:titleEn;
  document.documentElement.setAttribute('lang',lang==='en'?'en':'hi');
}
/* style + switcher */
var st=document.createElement('style');
st.textContent='.hi2{display:block;color:var(--mu,#93a1bd);font-family:Hind,Inter,sans-serif;font-size:.94em;margin-top:2px}'+
 'h1>.hi2,h2>.hi2{font-size:.72em;font-weight:500;margin-top:6px}h3>.hi2,h4>.hi2{font-size:.82em;font-weight:500}li>.hi2,p>.hi2{margin-top:3px}.hi2.blk{border-top:1px dashed var(--line,#1f2b45);margin-top:10px;padding-top:8px;color:inherit}'+
 '.lang{display:flex;gap:2px;background:var(--panel,#0e1524);border:1px solid var(--line,#1f2b45);border-radius:9px;padding:2px;flex:none}'+
 '.lang button{background:none;border:0;color:var(--mu,#93a1bd);font:600 13px Hind,Inter,sans-serif;padding:5px 8px;border-radius:7px;cursor:pointer;min-height:30px}'+
 '.lang button[aria-pressed=true]{background:var(--gold,#ffb02e);color:#1a1200}'+
 '@media(max-width:560px){.lang button{padding:5px 6px;font-size:12px}.top .wrap{gap:8px}}';
document.head.appendChild(st);
function mount(){
  if(document.getElementById('lang')) return;
  var w=document.querySelector('.top .wrap'); if(!w) return;
  var d=document.createElement('div'); d.className='lang'; d.id='lang'; d.setAttribute('role','group'); d.setAttribute('aria-label','Language');
  d.setAttribute('data-nolang','1');
  [['hi','हिंदी'],['en','EN'],['both','दोनों']].forEach(function(p){
    var b=document.createElement('button'); b.type='button'; b.setAttribute('data-l',p[0]); b.textContent=p[1];
    b.addEventListener('click',function(){ set(p[0]) }); d.appendChild(b);
  });
  var nav=w.querySelector('nav'); w.insertBefore(d,nav?nav.nextSibling:null);
}
function paint(){
  var d=document.getElementById('lang'); if(!d) return;
  Array.prototype.forEach.call(d.querySelectorAll('button'),function(b){ b.setAttribute('aria-pressed',b.getAttribute('data-l')===lang?'true':'false') });
}
function set(l){
  lang=l; try{localStorage.setItem(KEY,l)}catch(e){}
  if(window.__onLang) try{window.__onLang(l)}catch(e){}
  setTitle(); walk(document.body); paint();
}
window.KLANG={get:function(){return lang},set:set,tr:tr};
var pend=[],sched=false;
function flush(){
  sched=false; var list=pend; pend=[];
  list.forEach(function(r){
    if(r.type==='characterData'){ proc(r.target) }
    else Array.prototype.forEach.call(r.addedNodes,function(n){
      if(n.nodeType===3) proc(n); else if(n.nodeType===1 && !(n.classList&&n.classList.contains('hi2'))) walk(n);
    });
  });
}
var mo=new MutationObserver(function(recs){ pend=pend.concat(recs); if(!sched){ sched=true; (window.requestAnimationFrame||setTimeout)(flush) } });
function start(){
  mount(); setTitle(); walk(document.body); paint();
  mo.observe(document.body,{childList:true,subtree:true,characterData:true});
}
if(document.body) start(); else document.addEventListener('DOMContentLoaded',start);
})();
