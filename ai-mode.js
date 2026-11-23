(() => {
 const body=document.querySelector('#menuPageBody');
 function prompt(){return window.AI_SEARCH_PROMPT;}
 body.addEventListener('click',async e=>{
 const copy=e.target.closest('[data-ai-copy]');if(!copy)return;
 const value=prompt(),status=body.querySelector('#ai-status'),fallback=body.querySelector('#ai-copy-fallback');
 try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText(value);fallback.hidden=true;status.textContent=`${copy.dataset.aiCopy}用の検索用プロンプトをコピーしました。「${copy.dataset.aiCopy}を開く」から貼り付けてください。`;}
 catch{fallback.hidden=false;const area=fallback.querySelector('textarea');area.value=value;area.focus();area.select();status.textContent='自動コピーができませんでした。下の検索用プロンプトを長押しなどでコピーしてください。';}
 });
 body.addEventListener('click',e=>{if(e.target.closest('[data-ai-select]')){const a=body.querySelector('#ai-copy-fallback textarea');a.focus();a.select();}});
})();
