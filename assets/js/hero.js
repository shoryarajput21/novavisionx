// ===== HERO ENTRANCE (GSAP) — runs once; skipped entirely for prefers-reduced-motion =====
// Targets only existing hero elements. Page content, layout and links are untouched.
(()=>{
if(window.__novaHeroInit)return;window.__novaHeroInit=true;           // never initialise twice
const root=document.documentElement,reveal=()=>root.classList.remove('hero-pre');

// Split text nodes into inline-block word spans (keeps the <em> highlight and original spacing).
function splitWords(el){const words=[];(function walk(n){[...n.childNodes].forEach(c=>{
  if(c.nodeType===3){const f=document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;
      if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t))}
      else{const w=document.createElement('span');w.textContent=t;w.style.display='inline-block';f.appendChild(w);words.push(w)}});
    c.replaceWith(f)}
  else if(c.nodeType===1)walk(c)})})(el);return words}

function start(){
  const g=window.gsap,hero=document.querySelector('.hero');
  if(!g||!hero||!root.classList.contains('hero-pre')||hero.getBoundingClientRect().bottom<0){reveal();return}   // GSAP missing / already revealed / hero off-screen: show content as-is
  const q=s=>hero.querySelector(s),badge=q('.badge'),h1=q('h1'),lead=q('p.l'),trust=q('.trust'),
        btns=[...hero.querySelectorAll('.cta .btn')],blob=q('.stage .blob'),img=q('.stage img'),chipA=q('.stage .fc.a'),chipB=q('.stage .fc.b');
  if(!(badge&&h1&&lead&&trust&&btns.length&&blob&&img&&chipA&&chipB)){reveal();return}
  let ran=false;
  g.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{
    ran=true;let alive=true;
    root.classList.add('hero-gsap');
    const orig=h1.innerHTML,words=splitWords(h1);

    // Initial (hidden) state — applied synchronously before the pre-hide class is lifted, so there is no flash.
    btns.forEach(b=>b.style.transition='none');            // .btn has a CSS transform transition that would fight GSAP
    g.set(badge,{autoAlpha:0,y:14});
    g.set(h1,{visibility:'visible'});
    g.set(words,{autoAlpha:0,y:32});
    g.set(lead,{autoAlpha:0,y:20});
    g.set(btns,{autoAlpha:0,y:18});
    g.set(trust,{autoAlpha:0,y:10});
    g.set(blob,{autoAlpha:0,scale:.88});
    g.set(img,{autoAlpha:0,y:48,scale:.96});
    g.set([chipA,chipB],{autoAlpha:0,y:16,scale:.92});
    reveal();

    // Restrained idle float: hero image (matches the old 5s CSS cycle) + the two chips, each on a different period.
    const floats=[],mk=(el,y,d)=>{const f={on:false,t:g.to(el,{y,duration:d,ease:'sine.inOut',yoyo:true,repeat:-1,paused:true})};floats.push(f);return f};
    const fImg=mk(img,-8,2.5),fA=mk(chipA,-6,3.2),fB=mk(chipB,-5,3.8);
    let visible=true;const go=f=>{f.on=true;if(visible)f.t.play()};
    const io='IntersectionObserver' in window?new IntersectionObserver(([e])=>{visible=e.isIntersecting;floats.forEach(f=>f.on&&f.t.paused(!visible))}):null;
    io&&io.observe(hero);

    const done=[badge,lead,trust,...btns,blob];
    const tl=g.timeline({paused:true,defaults:{ease:'power3.out'},onComplete(){
      g.set(done,{clearProps:'opacity,visibility,transform'});g.set(words,{clearProps:'opacity,visibility,transform'});
      requestAnimationFrame(()=>btns.forEach(b=>b.style.transition=''));}});           // hover effects resume untouched
    tl.to(blob,{autoAlpha:1,scale:1,duration:1.3,ease:'expo.out'},0)
      .to(badge,{autoAlpha:1,y:0,duration:.7},.05)
      .to(words,{autoAlpha:1,y:0,duration:.95,stagger:.06},.2)
      .to(img,{autoAlpha:1,y:0,scale:1,duration:1.2,onComplete:()=>go(fImg)},.35)
      .to(lead,{autoAlpha:1,y:0,duration:.85},.65)
      .to(btns,{autoAlpha:1,y:0,duration:.8,stagger:.1},.85)
      .to(trust,{autoAlpha:1,y:0,duration:.7},1.05)
      .to(chipA,{autoAlpha:1,y:0,scale:1,duration:.9,onComplete:()=>go(fA)},1)
      .to(chipB,{autoAlpha:1,y:0,scale:1,duration:.9,onComplete:()=>go(fB)},1.15);

    // Begin once the hero image is decoded (short cap) so it doesn't pop in mid-animation.
    const wait=new Promise(r=>setTimeout(r,700));
    Promise.race([img.decode?img.decode().catch(()=>{}):0,wait]).then(()=>{if(alive)tl.play()});

    return()=>{alive=false;io&&io.disconnect();h1.innerHTML=orig;btns.forEach(b=>b.style.transition='');root.classList.remove('hero-gsap');reveal()};   // if the user switches to reduced motion mid-flight
  });
  if(!ran)reveal();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();   // deferred GSAP has executed by DOMContentLoaded
})();
