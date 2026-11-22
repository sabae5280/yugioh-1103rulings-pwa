(() => {
 const entries=[{name:'ダメージステップ表',file:'damage-step-reference'},{name:'強欲で謙虚な壺 フローチャート',file:'pot-of-duality-flowchart'},{name:'ネクロバレーのしきたり',file:'necrovalley-reference-20261122',image:'necrovalley-reference-20261122.webp'}];
 const dialog=document.createElement('dialog');dialog.className='reference-dialog';dialog.setAttribute('aria-labelledby','referenceTitle');
 dialog.innerHTML='<header><button type="button" id="referenceBack" hidden>‹ 一覧へ</button><h2 id="referenceTitle">各種表・フローチャート</h2><button type="button" id="referenceClose" aria-label="資料を閉じる">× 閉じて戻る</button></header><div id="referenceContent"></div>';
 document.body.append(dialog);
 const content=dialog.querySelector('#referenceContent'),back=dialog.querySelector('#referenceBack'),title=dialog.querySelector('h2');let selected=-1,previousOverflow='';
 function list(){title.textContent='各種表・フローチャート';back.hidden=true;content.innerHTML=entries.map((e,i)=>`<button class="reference-choice" data-reference-index="${i}">${e.name}<span aria-hidden="true">›</span></button>`).join('');}
 function show(i){selected=i;const e=entries[i];title.textContent=e.name;back.hidden=false;content.innerHTML=`<div class="reference-tools"><a href="./${e.file}.pdf" download="${e.name}.pdf" data-pdf-download>PDFをダウンロード</a><button id="referenceZoom" type="button" aria-pressed="false">拡大する</button></div><p class="reference-save-status" role="status" style="font-size:13px;line-height:1.6">iPhoneでPDFが開いた場合は、共有ボタンから「“ファイル”に保存」を選んでください。</p><div class="reference-image"><img src="./${e.image || e.file+'.png'}" alt="${e.name}"></div>`;}
 let returnTarget=document.querySelector('#referenceOpen');
 function openReference(target,index){returnTarget=target;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';if(index===undefined)list();else show(index);dialog.showModal();}
 document.querySelector('#referenceOpen').addEventListener('click',event=>openReference(event.currentTarget));
 document.addEventListener('click',event=>{const link=event.target.closest('a.damage-step-reference__link, a[href$="necrovalley-reference-20261122.webp"]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();openReference(link,link.href.includes("necrovalley-reference")?2:0);});
 document.addEventListener('click',event=>{
  const link=event.target.closest('a.supplemental-image');if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const url=new URL(link.href);if(url.origin!==location.origin||! /\.(png|webp|jpe?g)$/i.test(url.pathname))return;
  event.preventDefault();returnTarget=link;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  title.textContent=link.querySelector('img')?.alt||'参考表';back.hidden=true;
  content.replaceChildren();const tools=document.createElement('div');tools.className='reference-tools';const zoom=document.createElement('button');zoom.id='referenceZoom';zoom.type='button';zoom.textContent='拡大する';zoom.setAttribute('aria-pressed','false');tools.append(zoom);
  const wrap=document.createElement('div');wrap.className='reference-image';const img=document.createElement('img');img.src=url.href;img.alt=title.textContent;wrap.append(img);content.append(tools,wrap);dialog.showModal();
 });
 dialog.querySelector('#referenceClose').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;(returnTarget?.isConnected?returnTarget:document.querySelector('#referenceOpen')).focus();});
 back.addEventListener('click',()=>{list();content.querySelectorAll('button')[selected]?.focus();});
 content.addEventListener('click',async event=>{
  const link=event.target.closest('[data-pdf-download]');if(!link)return;
  event.preventDefault();if(link.dataset.busy)return;
  const status=content.querySelector('.reference-save-status');
  link.dataset.busy='1';link.setAttribute('aria-disabled','true');status.textContent='PDFを準備しています…';
  try {
   const response=await fetch(link.href);if(!response.ok)throw new Error('PDF unavailable');
   const blob=await response.blob();
   const url=URL.createObjectURL(new Blob([blob],{type:'application/octet-stream'}));
   const save=document.createElement('a');save.href=url;save.download=link.download;document.body.append(save);save.click();save.remove();
   setTimeout(()=>URL.revokeObjectURL(url),120000);
   status.textContent='保存を開始しました。iPhoneでPDFが表示された場合は、共有 →「“ファイル”に保存」を選んでください。';
  }catch(error){status.textContent='PDFを取得できませんでした。通信状態を確認して、もう一度お試しください。';}
  finally{delete link.dataset.busy;link.removeAttribute('aria-disabled');}
 });
 content.addEventListener('click',event=>{const choice=event.target.closest('[data-reference-index]');if(choice){show(Number(choice.dataset.referenceIndex));back.focus();}if(event.target.id==='referenceZoom'){const zoom=event.target.getAttribute('aria-pressed')!=='true';event.target.setAttribute('aria-pressed',String(zoom));event.target.textContent=zoom?'全体を表示':'拡大する';content.querySelector('.reference-image').classList.toggle('is-zoomed',zoom);}});
})();
