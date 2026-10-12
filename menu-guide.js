(() => {
 const menu=document.querySelector('#siteMenu');
 const names=['00-idle','01-blink','02-wave-in','03-wave-smile'];
 const paths=names.map(n=>`./images/guide/death-guide-${n}-site.webp`);
 const message='ワタシのターン、ドローデース！\n1103から1402環境まで！\n裁定ツアーガイドはお任せアレ！';
 const host=document.createElement('div');host.className='menu-guide';
 host.innerHTML='<div class="menu-guide__bubble"><span aria-hidden="true" class="menu-guide__typed"></span><span class="visually-hidden"></span></div><div class="menu-guide__portrait"></div>';
 host.querySelector('.visually-hidden').textContent=message;
 const portrait=host.querySelector('.menu-guide__portrait');
 const images=paths.map((src,i)=>{const img=new Image(512,696);img.src=src;img.alt=i===0?'ガイドキャラクターのデスガイド':'';img.className=i===0?'is-current':'';portrait.append(img);return img;});
 menu.querySelector('.site-menu__page').after(host);
 const ready=Promise.all(images.map(img=>img.decode().catch(()=>{})));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let generation=0,timers=new Set();
 const typed=host.querySelector('.menu-guide__typed');
 function frame(i){images.forEach((img,n)=>img.classList.toggle('is-current',n===i));}
 function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);}
 function stop(){generation++;timers.forEach(clearTimeout);timers.clear();frame(0);}
 function cycle(){const steps=[[1,90],[0,120],[2,150],[3,220],[2,150]];let i=0;function next(){if(i===steps.length){frame(0);later(cycle,8000+Math.random()*6000);return;}const [f,ms]=steps[i++];frame(f);later(next,ms);}next();}
 async function start(){stop();if(menu.hidden||document.hidden)return;const token=generation;typed.textContent=reduced.matches?message:'';if(reduced.matches)return;
 let count=0;function type(){typed.textContent=message.slice(0,++count);if(count<message.length)later(type,55);}later(type,200);
 await ready;if(token!==generation||menu.hidden||document.hidden)return;later(cycle,800+Math.random()*400);
 }
 new MutationObserver(start).observe(menu,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);
})();
