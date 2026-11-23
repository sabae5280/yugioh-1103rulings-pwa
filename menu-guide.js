(() => {
 const menu=document.querySelector('#siteMenu');
 const names=['00-idle','01-blink','02-wave-in','03-wave-smile'];
 const paths=names.map(n=>`./images/guide/death-guide-${n}-site.webp`);
 const variants=['explain','serious','thanks','think'];
 variants.forEach(n=>paths.push(`./images/guide/${n}-open.webp`,`./images/guide/${n}-closed.webp`));
 const pageVariants={admin:4,ai:4,guide:4,links:4,precautions:6,credits:8,philosophy:10,decision:10,contact:3};
 const variantProbability=0.2; // 80% normal, 20% page-specific expression per 8-second selection.
 const messages = {"simulator":"《収縮》《ゲイル》《聖杯》\n《聖槍》《巨大化》・・・\n\n頭痛が痛いデス・・・\n\n実装までもう少し\nお待ちくださいネ・・・","admin":"更新の記録とAI案内は\nこちらで確認できマス！","ai":"お使いのAIで検索できマス！\n案内をコピーして\n貼り付けてくださいネ。\n\n表の内容は未対応デス。\n元の画像もご確認ください！","about": "ワタシのターン、ドローデース。\n1103から1402環境まで！\n\n裁定ツアーガイドは\nお任せアレ！", "precautions": "本サイトは非公式デス(TωT)\n\nイベントで活用する時は、\n運営さんとジャッジさんの\n指示に従ってくださいネ。\n\n対戦相手とも、仲良く\nコミュニケーションを取って\nご利用くださいデス。", "guide": "管理者の手が回らず、\n画像の用意が\nできてないデス。\n┐(´д｀)┌\n\n実際に使って\n覚えてほしいデス。", "philosophy": "実は元々、\nプレイヤー向けではなく\nイベントの主催とジャッジを\nサポートしたいという思いで\n当サイトは作られたデス。\n\n勿論、プレイヤーさんも\nたくさん使ってくださいネ。", "decision": "管理者の手が回らず、\n画像の用意が\nできてないデス。\n┐(´д｀)┌\n\n後日画像で\nフローチャートを\n用意するデス。", "credits": "様々なテーマに関して、\n今後協力者を追加予定デス！\n\n各デッキの知見がある\n様々なプレイヤーに\n協力していただきまシタ！", "links": "こちらから、各種イベントや\n様々な関連サイトにアクセス\nできマスよ～。", "contact": "気軽に裁定に関する質問、\n当時のルールや確認事項、\nご要望を教えてデス♪"};
 const mobileMessages={"about": "ワタシのターン、\nドローデース。\n1103から\n1402環境まで！\n\n裁定ツアーガイドは\nお任せアレ！", "simulator": "《収縮》《ゲイル》\n《聖杯》《聖槍》\n《巨大化》・・・\n\n頭痛が痛いデス・・・\n\n実装までもう少し\nお待ちくださいネ・・・", "admin": "更新の記録と\nAI案内はこちらで\n確認できマス！", "precautions": "本サイトは\n非公式デス(TωT)\n\nイベントで活用する時は、\n運営さんと\nジャッジさんの指示に\n従ってくださいネ。\n\n対戦相手とも、仲良く\nコミュニケーションを\n取ってご利用くださいデス。", "guide": "管理者の手が回らず、\n画像の用意が\nできてないデス。\n┐(´д｀)┌\n\n実際に使って\n覚えてほしいデス。", "philosophy": "実は元々、\nプレイヤー向けではなく\nイベントの主催と\nジャッジを\nサポートしたい\nという思いで\n当サイトは\n作られたデス。\n\n勿論、プレイヤーさんも\nたくさん使って\nくださいネ。", "decision": "管理者の手が回らず、\n画像の用意が\nできてないデス。\n┐(´д｀)┌\n\n後日画像で\nフローチャートを\n用意するデス。", "credits": "様々なテーマに関して、\n今後協力者を\n追加予定デス！\n\n各デッキの知見がある\n様々なプレイヤーに\n協力して\nいただきまシタ！", "links": "こちらから、\n各種イベントや\n様々な関連サイトに\nアクセスできマスよ～。", "contact": "気軽に裁定に関する\n質問、当時のルールや\n確認事項、ご要望を\n教えてデス♪"};
 function messageForPage(){const page=menu.querySelector("[data-menu-page].is-active")?.dataset.menuPage||"about";return (matchMedia("(max-width:600px)").matches?mobileMessages[page]:null)||messages[page]||messages.about;}
 const host=document.createElement('div');host.className='menu-guide';
 host.innerHTML='<div class="menu-guide__bubble"><span aria-hidden="true" class="menu-guide__measure"></span><span aria-hidden="true" class="menu-guide__typed"></span><span class="visually-hidden"></span></div><div class="menu-guide__portrait"></div>';
 host.querySelector('.visually-hidden').textContent=messageForPage();
 const portrait=host.querySelector('.menu-guide__portrait');
 const images=paths.map((src,i)=>{const img=new Image(512,696);img.src=src;img.alt=i===0?'ガイドキャラクターのデスガイド':'';img.className=i===0?'is-current':'';portrait.append(img);return img;});
 menu.querySelector('.site-menu__page').after(host);
 const ready=Promise.all(images.map(img=>img.decode().catch(()=>{})));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let generation=0,timers=new Set();
 const typed=host.querySelector('.menu-guide__typed');
 function frame(i){host.dataset.frame=String(i);images.forEach((img,n)=>img.classList.toggle('is-current',n===i));}
 function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);}
 function stop(){generation++;timers.forEach(clearTimeout);timers.clear();frame(0);}
 function cycle(){const steps=[[1,90],[0,120],[2,150],[3,220],[2,150]];let i=0;function next(){if(i===steps.length){frame(0);later(cycle,2300+Math.random()*700);return;}const [f,ms]=steps[i++];frame(f);later(next,ms);}next();}
 function randomSegment(page){
 const special=Math.random()<variantProbability;
 const base=special?(pageVariants[page]??0):0;
 host.dataset.expression=base===0?'normal':'variant';frame(base);
 function gesture(){
  if(base>=4){frame(base+1);later(()=>frame(base),base===8?350:140);}
  else if(base===3){frame(2);later(()=>frame(3),170);}
  else {const steps=[[1,0],[0,110],[2,310],[3,480],[2,780],[0,950]];steps.forEach(([f,t])=>later(()=>frame(f),t));}
 }
 later(gesture,2300);later(gesture,5600);later(()=>randomSegment(page),8000);
 }
 async function start(){stop();if(menu.hidden||document.hidden)return;const token=generation;const currentPage=menu.querySelector('[data-menu-page].is-active')?.dataset.menuPage||'about';if(currentPage==='simulator'){host.dataset.expression='troubled';frame(10);}const message=messageForPage();host.querySelector('.menu-guide__measure').textContent=message;host.querySelector('.visually-hidden').textContent=message;typed.textContent=reduced.matches?message:'';if(reduced.matches)return;
 let count=0;function type(){typed.textContent=message.slice(0,++count);if(count<message.length)later(type,55);}later(type,200);
 await ready;if(token!==generation||menu.hidden||document.hidden)return;const page=menu.querySelector('[data-menu-page].is-active')?.dataset.menuPage||'about';
 if(page==='simulator'){host.dataset.expression='troubled';frame(10);function blink(){frame(11);later(()=>frame(10),140);later(blink,3000);}later(blink,3000);}else if(page==='about'){host.dataset.expression='normal';later(cycle,800+Math.random()*400);}else randomSegment(page);
 }
 menu.addEventListener('click',event=>{if(event.target.closest('[data-menu-page]'))start();});
 new MutationObserver(start).observe(menu,{attributes:true,attributeFilter:['hidden']});
 matchMedia('(max-width:600px)').addEventListener('change',start);
 document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);
})();
