(() => {
 const entries=[{name:'ダメージステップ表',file:'damage-step-reference'},{name:'強欲で謙虚な壺 フローチャート',file:'pot-of-duality-flowchart'}];
 const dialog=document.createElement('dialog');dialog.className='reference-dialog';dialog.setAttribute('aria-labelledby','referenceTitle');
 dialog.innerHTML='<header><button type="button" id="referenceBack" hidden>‹ 一覧へ</button><h2 id="referenceTitle">各種表・フローチャート</h2><button type="button" id="referenceClose" aria-label="資料を閉じる">閉じる ×</button></header><div id="referenceContent"></div>';
 document.body.append(dialog);
 const content=dialog.querySelector('#referenceContent'),back=dialog.querySelector('#referenceBack'),title=dialog.querySelector('h2');let selected=-1,previousOverflow='';
 function list(){title.textContent='各種表・フローチャート';back.hidden=true;content.innerHTML=entries.map((e,i)=>`<button class="reference-choice" data-reference-index="${i}">${e.name}<span aria-hidden="true">›</span></button>`).join('');}
 function show(i){selected=i;const e=entries[i];title.textContent=e.name;back.hidden=false;content.innerHTML=`<div class="reference-tools"><a href="./${e.file}.pdf" download="${e.file}.pdf" target="_blank" rel="noopener">PDFをダウンロード</a><button id="referenceZoom" type="button" aria-pressed="false">拡大する</button></div><div class="reference-image"><img src="./${e.file}.png" alt="${e.name}"></div>`;}
 document.querySelector('#referenceOpen').addEventListener('click',()=>{list();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();});
 dialog.querySelector('#referenceClose').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;document.querySelector('#referenceOpen').focus();});
 back.addEventListener('click',()=>{list();content.querySelectorAll('button')[selected]?.focus();});
 content.addEventListener('click',event=>{const choice=event.target.closest('[data-reference-index]');if(choice){show(Number(choice.dataset.referenceIndex));back.focus();}if(event.target.id==='referenceZoom'){const zoom=event.target.getAttribute('aria-pressed')!=='true';event.target.setAttribute('aria-pressed',String(zoom));event.target.textContent=zoom?'全体を表示':'拡大する';content.querySelector('.reference-image').classList.toggle('is-zoomed',zoom);}});
})();
