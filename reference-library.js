(() => {
 const entries=[{name:'ダメージステップ表',file:'damage-step-reference'},{name:'強欲で謙虚な壺 フローチャート',file:'pot-of-duality-flowchart'}];
 const dialog=document.createElement('dialog');dialog.className='reference-dialog';dialog.setAttribute('aria-labelledby','referenceTitle');
 dialog.innerHTML='<header><button type="button" id="referenceBack" hidden>‹ 一覧へ</button><h2 id="referenceTitle">各種表・フローチャート</h2><button type="button" id="referenceClose" aria-label="資料を閉じる">閉じる ×</button></header><div id="referenceContent"></div>';
 document.body.append(dialog);
 const content=dialog.querySelector('#referenceContent'),back=dialog.querySelector('#referenceBack'),title=dialog.querySelector('h2');let selected=-1,previousOverflow='';
 function list(){title.textContent='各種表・フローチャート';back.hidden=true;content.innerHTML=entries.map((e,i)=>`<button class="reference-choice" data-reference-index="${i}">${e.name}<span aria-hidden="true">›</span></button>`).join('');}
 function show(i){selected=i;const e=entries[i];title.textContent=e.name;back.hidden=false;content.innerHTML=`<div class="reference-tools"><a href="./${e.file}.pdf" download="${e.name}.pdf" data-pdf-download>PDFをダウンロード</a><button id="referenceZoom" type="button" aria-pressed="false">拡大する</button></div><p class="reference-save-status" role="status" style="font-size:13px;line-height:1.6">iPhoneでPDFが開いた場合は、共有ボタンから「“ファイル”に保存」を選んでください。</p><div class="reference-image"><img src="./${e.file}.png" alt="${e.name}"></div>`;}
 document.querySelector('#referenceOpen').addEventListener('click',()=>{list();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();});
 dialog.querySelector('#referenceClose').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;document.querySelector('#referenceOpen').focus();});
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
