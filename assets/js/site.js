/* Nova Vision Digital — shared behaviour (all pages). Contact links live in config.js, reviews in reviews.js */
(()=>{
const N=window.NOVA||{};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(id,cls='')=>`<svg class="ic-svg ${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;

/* ----- contact links from config ----- */
const tg=(N.telegramUrl||'').trim();
$$('[data-tg]').forEach(a=>{a.hidden=!tg;if(tg)a.href=tg});
$$('[data-ig]').forEach(a=>{if(N.instagramUrl)a.href=N.instagramUrl});
$$('[data-mail]').forEach(a=>{if(N.email){a.href='mailto:'+N.email;if(a.dataset.mail==='text')a.textContent=N.email}});
$$('[data-mailtext]').forEach(x=>{if(N.email)x.textContent=N.email});
// when Telegram is missing, rebalance the 3-up contact grid
$$('.opts').forEach(g=>{const n=[...g.children].filter(c=>!c.hidden).length;g.classList.toggle('n2',n===2);g.classList.toggle('n1',n===1)});

/* ----- mobile nav ----- */
const mb=$('#mb'),lk=$('#lk');
if(mb&&lk){
 const set=o=>{lk.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');mb.innerHTML=icon(o?'i-x':'i-menu')};
 mb.addEventListener('click',()=>set(!lk.classList.contains('open')));
 lk.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
 matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)set(false)});
}

/* ----- our recent work ----- */
const CATEGORIES=['Hair Care','Skin Care','Snacks','Supplements'];
const V='assets/videos/';
const PORTFOLIO=[
{title:"Hair Care Ad 1",category:"Hair Care",thumb:V+"Hair_care_1.jpg",src:V+"Hair_care_1.mp4"},
{title:"Hair Care Ad 2",category:"Hair Care",thumb:V+"Hair_care_2.jpg",src:V+"Hair_care_2.mp4"},
{title:"Hair Care Ad 3",category:"Hair Care",thumb:V+"Hair_care_3.jpg",src:V+"Hair_care_3.mp4"},
{title:"Hair Care Ad 4",category:"Hair Care",thumb:V+"Hair_care_4.jpg",src:V+"Hair_care_4.mp4"},
{title:"Skin Care Ad 1",category:"Skin Care",thumb:V+"Skin_care_1.jpg",src:V+"Skin_care_1.mp4"},
{title:"Skin Care Ad 2",category:"Skin Care",thumb:V+"Skin_care_2.jpg",src:V+"Skin_care_2.mp4"},
{title:"Skin Care Ad 3",category:"Skin Care",thumb:V+"Skin_care_3.jpg",src:V+"Skin_care_3.mp4"},
{title:"Snack Ad",category:"Snacks",thumb:V+"Snack.jpg",src:V+"Snack.mp4"},
{title:"Supplement Ad",category:"Supplements",thumb:V+"Supplyment_ugc_ai_.jpg",src:V+"Supplyment_ugc_ai_.mp4"}];
const gal=$('#gal');
if(gal){
 const limit=+gal.dataset.limit||0,flt=$('#flt');let cat='All';
 const card=p=>`<button class="vc" data-i="${PORTFOLIO.indexOf(p)}" aria-label="Play ${esc(p.title)}"><img loading="lazy" decoding="async" width="270" height="480" src="${p.thumb}" alt="${esc(p.title)} video ad thumbnail"><div class="pl"><span>${icon('i-play','fill')}</span></div><div class="t"><small>${esc(p.category)}</small><b>${esc(p.title)}</b></div></button>`;
 const draw=()=>{
  if(flt)flt.innerHTML=['All',...CATEGORIES].map(c=>`<button type="button" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
  let list=PORTFOLIO.filter(p=>cat==='All'||p.category===cat);if(limit)list=list.slice(0,limit);
  gal.innerHTML=list.map(card).join('')};
 draw();
 if(flt)flt.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b.dataset.c){cat=b.dataset.c;draw()}});
 let dlg=null;
 const close=()=>{if(dlg&&dlg.open)dlg.close()};
 gal.addEventListener('click',e=>{const b=e.target.closest('.vc');if(!b)return;const p=PORTFOLIO[b.dataset.i];
  if(!dlg){dlg=document.createElement('dialog');dlg.setAttribute('aria-label','Video player');document.body.append(dlg);
   dlg.addEventListener('click',e=>{if(e.target===dlg)close()});dlg.addEventListener('close',()=>{dlg.innerHTML=''})}
  dlg.innerHTML=`<button class="x" type="button" aria-label="Close video">${icon('i-x')}</button><video src="${p.src}" poster="${p.thumb}" controls autoplay playsinline preload="metadata"></video>`;
  dlg.querySelector('.x').onclick=close;dlg.showModal()});
}

/* ----- reviews (real ones only, from reviews.js) ----- */
const REV=(window.NOVA_REVIEWS||[]).filter(r=>r&&r.name&&r.text);
if(REV.length){
 $$('[data-needs-reviews]').forEach(x=>x.hidden=false);
 const rv=$('#rv');
 if(rv){const max=+rv.dataset.limit||REV.length;
  rv.innerHTML=REV.slice(0,max).map(v=>`<article class="rc rv">${v.rating?`<div class="st" role="img" aria-label="${+v.rating} out of 5 stars">${'★'.repeat(+v.rating)}${'☆'.repeat(5-v.rating)}</div>`:''}<p>“${esc(v.text)}”</p><div class="who"><div class="av" aria-hidden="true">${esc(v.name[0])}</div><div><b>${esc(v.name)}</b>${v.role?`<small>${esc(v.role)}</small>`:''}</div></div></article>`).join('')}
}else{$$('[data-no-reviews]').forEach(x=>x.hidden=false)}

/* ----- faq ----- */
const FAQ=[
["What are AI UGC video ads?","They are AI-generated, UGC-style video ads made from your product photos, voiceover and AI video. They are not made by real creators, and we are upfront about this with every client."],
["How much does one UGC video cost?","A single AI-generated UGC video is $40 (USD). It includes delivery in 3-5 days and 2 revisions."],
["What is included in the 5-video bundle?","Five AI-generated UGC video ads with multiple creative variations and product-focused storytelling, for $150 ($30 per video), with delivery in 3-5 days and 2 revisions included."],
["How do I place an order?","Message us on Instagram or Telegram, or use the form on the Order page. Send your product link and photos, plus a few notes on your audience and goals."],
["Do you offer calls?","We handle everything over chat and email, so every detail is documented in writing."],
["How does payment work?","50% advance to start, the remaining 50% on delivery. We accept PayPal, Payoneer and Wise."],
["Do you make health or results claims?","No. Scripts avoid medical or result claims, and you approve every script before production."],
["Do you also set up Google Ads?","Yes. Google Ads setup is $150 and covers campaign structure, initial keyword and targeting configuration, ad copy setup, and conversion tracking guidance."],
["Do you offer Facebook and Instagram Ads setup?","Yes. Message us for a quote; pricing is provided on request."],
["Does the pricing include advertising spend?","No. Ad spend, ongoing management, and third-party tool fees are not included unless separately agreed upon. We do not guarantee sales, rankings, or ROAS."],
["Can I request changes to my videos?","Yes. Both UGC packages include 2 revisions."],
["Where can I see your previous work?","Visit the Our Recent Work page. Every video there is an AI-generated UGC-style ad."]];
const fq=$('#fq');
if(fq){
 const max=+fq.dataset.limit||FAQ.length;
 fq.innerHTML=FAQ.slice(0,max).map((q,i)=>`<h3><button class="q" type="button" aria-expanded="false" aria-controls="a${i}" id="q${i}"><span>${q[0]}</span><span aria-hidden="true">+</span></button></h3><div class="a" id="a${i}" role="region" aria-labelledby="q${i}" hidden>${q[1]}</div>`).join('');
 fq.addEventListener('click',e=>{const b=e.target.closest('.q');if(!b)return;const p=$('#'+b.getAttribute('aria-controls')),o=p.hidden;p.hidden=!o;b.setAttribute('aria-expanded',o);b.lastChild.textContent=o?'−':'+'});
}

/* ----- order form ----- */
const f=$('#f');
if(f){
 const svc=new URLSearchParams(location.search).get('service');
 if(svc){const s=f.elements.service;[...s.options].forEach(o=>{if(o.value===svc)s.value=svc})}
 const MAIL=N.email||'';
 f.addEventListener('submit',async e=>{e.preventDefault();let ok=true;
  const m={name:'Enter your full name.',email:'Enter a valid email address.',company:'Enter your brand name.',product:'Enter a link to your product.',service:'Choose a service.',details:'Add at least 10 characters of project details.'};
  [...f.elements].filter(x=>x.name&&m[x.name]).forEach(x=>{const v=x.value.trim();const bad=!v||(x.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))||(x.name==='product'&&!/\S+\.\S+/.test(v))||(x.name==='details'&&v.length<10);x.setAttribute('aria-invalid',bad);x.nextElementSibling.textContent=bad?m[x.name]:'';if(bad&&ok){x.focus();ok=false}});
  const fm=$('#fm');fm.hidden=false;fm.className='';if(!ok){fm.textContent='Please fix the highlighted fields.';return}
  const d=Object.fromEntries(new FormData(f));if(d.website_hp)return;
  const done=()=>{fm.className='ok';fm.textContent='Thanks! We will reply within 24 hours.';f.reset()};
  if(N.formEndpoint){const btn=f.querySelector('button[type=submit]');btn.disabled=true;
   try{const r=await fetch(N.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:d.name,email:d.email,brand:d.company,product_link:d.product,service:d.service,details:d.details})});
    if(!r.ok)throw 0;done()}catch(_){fm.textContent='Something went wrong. Please email us at '+MAIL+'.'}btn.disabled=false;return}
  const body=`Name: ${d.name}\nEmail: ${d.email}\nBrand: ${d.company}\nProduct link: ${d.product}\nService: ${d.service}\n\nProject details:\n${d.details}`;
  location.href=`mailto:${MAIL}?subject=${encodeURIComponent('Video order: '+d.company)}&body=${encodeURIComponent(body)}`;
  done();fm.append(document.createElement('br'),`If your email app did not open, send the details to ${MAIL}.`)});
}

/* ----- reveal on scroll ----- */
const els=$$('.rv');
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});els.forEach(x=>io.observe(x))}
else els.forEach(x=>x.classList.add('in'));
})();
