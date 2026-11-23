(() => {
 const body=document.querySelector('#menuPageBody');
 function prompt(){return window.AI_SEARCH_PROMPT;}
 body.addEventListener('click',async e=>{
 const share=e.target.closest('[data-ai-share]');
 if(share){
 const text=prompt(),status=body.querySelector('#ai-status'),provider=share.dataset.aiShare;
 if(navigator.share&&(!navigator.canShare||navigator.canShare({text}))){
 try{await navigator.share({title:'遊戯王GB裁定 検索案内',text});status.textContent='共有操作を終了しました。選んだアプリ側で内容を確認してください。';return;}
 catch(error){if(error.name==='AbortError'){status.textContent='共有をキャンセルしました。';return;}}
 }
 body.querySelector(`[data-ai-copy="${provider}"]`).click();
 return;
 }
 const copy=e.target.closest('[data-ai-copy]');if(!copy)return;
 const value=prompt(),status=body.querySelector('#ai-status'),fallback=body.querySelector('#ai-copy-fallback');
 try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText(value);fallback.hidden=true;status.textContent=`案内文をコピーしました。ホーム画面から${copy.dataset.aiCopy}アプリを開き、新しいチャットに貼り付けてください。ブラウザ版でも使用できます。`;}
 catch{fallback.hidden=false;const area=fallback.querySelector('textarea');area.value=value;area.focus();area.select();status.textContent='自動コピーができませんでした。下の検索用プロンプトを長押しなどでコピーしてください。';}
 });
 body.addEventListener('click',e=>{if(e.target.closest('[data-ai-select]')){const a=body.querySelector('#ai-copy-fallback textarea');a.focus();a.select();}});
})();
