// Builds static lesson pages from the site's own JS files. Run: node gen.js  (in repo root)
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=process.argv[2]||'.',OUT=process.argv[3]||ROOT,SITE='https://kartikagaritrading.github.io';
const rd=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
let css='';
const sb={console};sb.window=sb;
sb.document={createElement:()=>({set textContent(v){css+=v},appendChild(){}}),head:{appendChild(){}},body:{appendChild(){}},addEventListener(){},getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[]};
sb.navigator={};sb.localStorage={getItem:()=>null,setItem(){}};
vm.createContext(sb);
['hi_lessons.js','lessons2.js','lessons3.js','lessons4.js','lessons5.js','lessons6.js','viz.js','viz_a.js','viz_b.js','viz_c.js','viz_d.js','viz_e.js','viz_f.js','viz_g.js','viz_h.js','viz_i.js'].forEach(f=>{try{vm.runInContext(rd(f),sb,{filename:f})}catch(e){console.error('WARN',f,e.message)}});
// base lessons from app3.js
const a3=rd('app3.js'),s0=a3.indexOf('var G=['),s1=a3.indexOf('if(window.KX_LESSONS)');
const G=vm.runInNewContext('('+a3.slice(s0+6,s1).trim().replace(/;\s*$/,'')+')');
if(sb.KX_LESSONS)G.push(['More lessons',sb.KX_LESSONS]);
const HI=sb.HI_LESSONS||{};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug=t=>t.toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const L=[];const used={};
G.forEach(g=>g[1].forEach(t=>{let s=slug(t[1]);if(used[s])s+='-'+t[0];used[s]=1;L.push({id:t[0],title:t[1],body:t[3],next:t[4]||[],slug:s,group:g[0]})}));
const byId={};L.forEach(x=>byId[x.id]=x);
const today=new Date().toISOString().slice(0,10);
const VZ={};L.forEach(x=>{try{VZ[x.id]=(sb.KVIZ&&sb.KVIZ(x.id,'both'))||''}catch(e){VZ[x.id]=''}});
const PCSS=`.pg{max-width:760px;margin:0 auto;padding:22px 16px 60px}.pg h1{font-size:clamp(26px,5vw,36px);margin:10px 0 4px}.pg .hi{color:var(--gold);font-size:20px;margin-bottom:16px;font-family:Hind,sans-serif}.pg .crumb{color:var(--mu);font-size:14px}.pg .crumb a{text-decoration:underline}
.pg p,.pg li{margin:10px 0;color:var(--tx)}.pg ul{padding-left:20px}.pg .eg{background:var(--panel);border-left:3px solid var(--gold);padding:10px 14px;border-radius:6px;color:var(--mu);margin:12px 0}
.pg h2{font-size:24px;margin:30px 0 8px}.pg .hib{border-top:1px solid var(--line);margin-top:26px;padding-top:6px}.pg .cta{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px;margin:30px 0;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.pg .nx a{display:inline-block;margin:4px 6px 4px 0;padding:8px 12px;border:1px solid var(--line);border-radius:9px;background:var(--panel)}.pg .note{color:var(--mu);font-size:14px;margin-top:24px}
.pg a.btn{display:inline-flex}.pg ol{padding-left:24px}.pg article li a,.pg article .eg a{color:var(--gold);text-decoration:underline}${css}`;
const head=(title,desc,url,extra)=>`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="author" content="Kartik Agari">
<link rel="canonical" href="${url}"><link rel="icon" type="image/png" href="/favicon.png">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="article"><meta property="og:site_name" content="Kartik Agari Trading">
<link href="https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css"><style>${PCSS}</style>${extra||''}<script data-goatcounter="https://kartikagari.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script></head><body>
<header class="top"><div class="wrap"><a class="brand" href="/"><i></i>Kartik Agari</a><nav aria-label="Menu"><a href="/learn/">All lessons · सारे पाठ</a><a href="/kartik-agari/">My story</a><a href="/#tutor">AI Guru</a></nav><a class="btn gold sm" href="https://t.me/kartiktradinghindi" rel="noopener">Join Telegram</a></div></header>`;
const foot='<p class="note">Education only. This is not advice to buy or sell. · सिर्फ़ सीखने के लिए। ख़रीदने या बेचने की सलाह नहीं।</p></div></body></html>';
const plain=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
function write(rel,txt){const f=path.join(OUT,rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,txt)}
L.forEach(x=>{
  const h=HI[x.id],url=`${SITE}/learn/${x.slug}/`;
  const first=plain(x.body).slice(0,155);
  const title=`${x.title}${h?' ('+h.t+')':''} | Kartik Agari Trading`;
  const viz=VZ[x.id];
  const ld={"@context":"https://schema.org","@graph":[{"@type":"Article","headline":x.title,"alternativeHeadline":h?h.t:undefined,"author":{"@type":"Person","name":"Kartik Agari","alternateName":"कार्तिक आगरी","url":SITE+"/"},"inLanguage":["en","hi"],"mainEntityOfPage":url,"dateModified":today,"publisher":{"@type":"Organization","name":"Kartik Agari Trading","url":SITE+"/"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":SITE+"/"},{"@type":"ListItem","position":2,"name":"Lessons","item":SITE+"/learn/"},{"@type":"ListItem","position":3,"name":x.title,"item":url}]}]};
  const nx=x.next.filter(i=>byId[i]).map(i=>`<a href="/learn/${byId[i].slug}/">${esc(byId[i].title)}${HI[i]?' · '+esc(HI[i].t):''}</a>`).join('');
  const pg=head(title,first,url,'<script type="application/ld+json">'+JSON.stringify(ld)+'</script>')+
  `<div class="pg"><div class="crumb"><a href="/">Home</a> › <a href="/learn/">Lessons</a> › ${esc(x.group)}</div><h1>${esc(x.title)}</h1>${h?`<div class="hi" lang="hi">${esc(h.t)}</div>`:''}
<article>${x.body}${h?`<div class="hib" lang="hi"><h2>हिंदी में</h2>${h.b}</div>`:''}${viz}</article>
<div class="cta"><b>Have a question about this? Ask the AI Guru. · इस पर सवाल है? गुरु से पूछो।</b><a class="btn gold" href="/#tutor">Ask the Guru</a><a class="btn" href="https://t.me/kartiktradinghindi" rel="noopener">Telegram</a><a class="btn" href="https://kartiktradinghindi.blogspot.com" rel="noopener">Blogger</a></div>
${nx?`<h2>Next · आगे सीखो</h2><div class="nx">${nx}</div>`:''}`+foot;
  write(`learn/${x.slug}/index.html`,pg);
});
// hub
const groups={};L.forEach(x=>(groups[x.group]=groups[x.group]||[]).push(x));
const hub=head('Free Trading Lessons in Hindi and English | Kartik Agari Trading','All free crypto and forex trading lessons with chart examples, in Hindi and English, by Kartik Agari (कार्तिक आगरी).',SITE+'/learn/')+
`<div class="pg"><div class="crumb"><a href="/">Home</a> › Lessons</div><h1>Free trading lessons</h1><div class="hi" lang="hi">मुफ़्त ट्रेडिंग पाठ — हिंदी और English में</div><p>${L.length} lessons with chart examples. Education only. By Kartik Agari (कार्तिक आगरी).</p>`+
Object.keys(groups).map(g=>`<h2>${esc(g)}</h2><ul>${groups[g].map(x=>`<li><a href="/learn/${x.slug}/">${esc(x.title)}${HI[x.id]?' · '+esc(HI[x.id].t):''}</a></li>`).join('')}</ul>`).join('')+foot;
write('learn/index.html',hub);
// ---- Kartik's story page ----
const STORY_URL=SITE+'/kartik-agari/';
const pld={"@context":"https://schema.org","@type":"ProfilePage","mainEntity":{"@type":"Person","name":"Kartik Agari","alternateName":"कार्तिक आगरी","url":STORY_URL,"image":SITE+"/favicon.png","description":"Kartik Agari (कार्तिक आगरी) teaches crypto and forex trading in Hindi and English for free.","sameAs":["https://t.me/kartiktradinghindi","https://kartiktradinghindi.blogspot.com"]}};
const storyPg=head('Kartik Agari (कार्तिक आगरी): I lost money first, then I learned why','Kartik Agari (कार्तिक आगरी) is from Agar village near Dwarahat, Almora, Uttarakhand. He lost money first, then learned why. Now he teaches crypto and forex trading free, in Hindi and English.',STORY_URL,'<script type="application/ld+json">'+JSON.stringify(pld)+'</script>')+
`<div class="pg"><div class="crumb"><a href="/">Home</a> › My story</div>
<div style="display:flex;gap:16px;align-items:center;margin:14px 0 6px"><img src="/favicon.png" alt="Kartik Agari" width="96" height="96" style="border-radius:50%;border:2px solid var(--gold)"><div><div class="hi" style="margin:0;font-size:15px">Kartik Agari · <span lang="hi">कार्तिक आगरी</span></div><h1 style="margin:4px 0 0;font-size:clamp(26px,6.4vw,38px);line-height:1.15">I lost money first. Then I learned why.</h1></div></div>
<article lang="en">
<p style="font-size:18px">I'm Kartik, from Agar, a small village near Dwarahat in the hills of Almora, Uttarakhand. My childhood was not easy.</p>
<p>I learned trading from my two brothers, Luciferthenx and Karan. Both of them are traders, and they are the ones who motivated me to move forward.</p>
<h2>The honest part</h2>
<p>I mostly lost money at the start. My profits were small. Those losses became my best teacher, and they gave me four lessons:</p>
<div class="eg" style="font-size:18px;color:var(--tx)">“Trading is not gambling, and it is not a joke. Learn it seriously, and learn it with discipline.”</div>
<ul><li><b>Take it seriously.</b> Treat trading like a skill, not a game.</li><li><b>Be disciplined.</b> Have rules, and follow them.</li><li><b>Do not trade every day.</b> One or two trades a day is enough.</li><li><b>Do not overtrade.</b> More trades usually means more mistakes.</li></ul>
<h2>Why this site exists</h2>
<p>I built it so that anyone, from a village or a city, can learn trading <b>for free</b>, in <b>Hindi and English</b>, and with honesty. No “get rich quick”. No buy or sell tips. Only learning.</p>
<h2>What you will find here</h2>
<ul><li>54 lessons with real chart examples, in Hindi and English</li><li>Daily lessons and quizzes on Telegram that teach, not tell</li><li>A free trade review, and paper trading to practise without risking money</li></ul>
<h2>Start here, in 3 steps</h2>
<ol><li>Read <a href="/learn/risk-management/">Risk management</a>. It protects your money.</li><li>Learn the <a href="/learn/stop-loss/">Stop loss</a>. It protects you from one bad candle.</li><li>Understand <a href="/learn/overtrading/">Overtrading</a>. It protects you from yourself.</li></ol>
<p>If you are just starting, you are in the right place. You do not need big money. You need patience, discipline and a plan. Take what helps you, and start today with one lesson.</p>
</article>
<div class="cta"><b>Start free. Learn one lesson today.</b><a class="btn gold" href="/learn/risk-management/">Start learning</a><a class="btn" href="https://t.me/kartiktradinghindi" rel="noopener">Join Telegram</a><a class="btn" href="https://kartiktradinghindi.blogspot.com" rel="noopener">Blogger</a></div>`+foot;
write('kartik-agari/index.html',storyPg);

write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${SITE}/</loc><lastmod>${today}</lastmod></url>\n<url><loc>${SITE}/learn/</loc><lastmod>${today}</lastmod></url>\n<url><loc>${SITE}/kartik-agari/</loc><lastmod>${today}</lastmod></url>\n`+L.map(x=>`<url><loc>${SITE}/learn/${x.slug}/</loc><lastmod>${today}</lastmod></url>`).join('\n')+'\n</urlset>\n');
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('lessons',L.length,'hindi',L.filter(x=>HI[x.id]).length,'viz',L.filter(x=>sb.KV&&sb.KV.EX[x.id]).length);
