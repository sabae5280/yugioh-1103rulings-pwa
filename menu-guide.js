(() => {
 const menu=document.querySelector('#siteMenu');
 const names=['00-idle','01-blink','02-wave-in','03-wave-smile'];
 const paths=names.map(n=>`./images/guide/death-guide-${n}-site.webp`);
 const messages = {"about": "ワタシのターン、ドローデース。\n1103から1402環境まで！\n\n裁定ツアーガイドは\nお任せアレ！", "precautions": "本サイトは非公式デス(TωT)\n\nイベントで活用する時は、\n運営さんとジャッジさんの\n指示に従ってくださいネ。\n\n対戦相手とも、仲良く\nコミュニケーションを取って\nご利用くださいデス。", "guide": "管理者の手が回らず、\n画像の用意ができてないデス。\n┐(´д｀)┌\n\n実際に使って覚えてほしいデス。", "philosophy": "実は元々、プレイヤー向けではなく\nイベントの主催とジャッジを\nサポートしたいという思いで\n当サイトは作られたデス。\n\n勿論、プレイヤーさんも\nたくさん使ってくださいネ。", "decision": "管理者の手が回らず、\n画像の用意ができてないデス。\n┐(´д｀)┌\n\n後日画像で\nフローチャートを\n用意するデス。", "credits": "様々なテーマに関して、\n今後協力者を追加予定デス！\n\n各デッキの知見がある\n様々なプレイヤーに\n協力していただきまシタ！", "links": "こちらから、各種イベントや\n様々な関連サイトにアクセス\nできマスよ～。", "contact": "気軽に裁定に関する質問、\n当時のルールや確認事項、\nご要望を教えてデス♪"};
 function messageForPage(){return messages[menu.querySelector("[data-menu-page].is-active")?.dataset.menuPage] || messages.about;}
 const host=document.createElement('div');host.className='menu-guide';
 host.innerHTML='<div class="menu-guide__bubble"><span aria-hidden="true" class="menu-guide__measure"></span><span aria-hidden="true" class="menu-guide__typed"></span><span class="visually-hidden"></span></div><div class="menu-guide__portrait"></div>';
 host.querySelector('.visually-hidden').textContent=messageForPage();
 const portrait=host.querySelector('.menu-guide__portrait');
 const images=paths.map((src,i)=>{const img=new Image(512,696);img.src=src;img.alt=i===0?'ガイドキャラクターのデスガイド':'';img.className=i===0?'is-current':'';portrait.append(img);return img;});
 menu.querySelector('.site-menu__page').after(host);
 const expression=document.createElement('div');expression.className='menu-guide__expression';expression.setAttribute('role','img');expression.setAttribute('aria-label','ガイドキャラクターのデスガイド');portrait.append(expression);
 const moods={precautions:'serious',guide:'explain',philosophy:'think',decision:'think',credits:'thanks',links:'explain',contact:'happy'};
 const ready=Promise.all(images.map(img=>img.decode().catch(()=>{})));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let generation=0,timers=new Set();
 const typed=host.querySelector('.menu-guide__typed');
 function frame(i){images.forEach((img,n)=>img.classList.toggle('is-current',n===i));}
 function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);}
 function stop(){portrait.classList.remove('guide-gesture');generation++;timers.forEach(clearTimeout);timers.clear();frame(0);}
 function cycle(){if(host.dataset.mood){portrait.classList.remove('guide-gesture');void portrait.offsetWidth;portrait.classList.add('guide-gesture');later(()=>portrait.classList.remove('guide-gesture'),900);later(cycle,3100);return;}const steps=[[1,90],[0,120],[2,150],[3,220],[2,150]];let i=0;function next(){if(i===steps.length){frame(0);later(cycle,2300+Math.random()*700);return;}const [f,ms]=steps[i++];frame(f);later(next,ms);}next();}
 async function start(){stop();if(menu.hidden||document.hidden)return;host.dataset.mood=moods[menu.querySelector('[data-menu-page].is-active')?.dataset.menuPage]||'';const token=generation;const message=messageForPage();host.querySelector('.menu-guide__measure').textContent=message;host.querySelector('.visually-hidden').textContent=message;typed.textContent=reduced.matches?message:'';if(reduced.matches)return;
 let count=0;function type(){typed.textContent=message.slice(0,++count);if(count<message.length)later(type,55);}later(type,200);
 await ready;if(token!==generation||menu.hidden||document.hidden)return;later(cycle,800+Math.random()*400);
 }
 menu.addEventListener('click',event=>{if(event.target.closest('[data-menu-page]'))start();});
 new MutationObserver(start).observe(menu,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);
})();
