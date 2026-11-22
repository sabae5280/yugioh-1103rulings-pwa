(() => {
 let widgetPromise;
 function loadWidgets(){
  if(window.twttr?.widgets)return Promise.resolve(window.twttr.widgets);
  if(widgetPromise)return widgetPromise;
  widgetPromise=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;
   const timer=setTimeout(()=>{script.remove();reject(new Error('timeout'));},15000);
   script.onload=()=>{clearTimeout(timer);window.twttr?.widgets?resolve(window.twttr.widgets):reject(new Error('unavailable'));};
   script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('network'));};document.head.append(script);
  }).catch(error=>{widgetPromise=null;throw error;});return widgetPromise;
 }
 document.querySelector('#menuPageBody').addEventListener('click',async event=>{
  const button=event.target.closest('.load-posts');if(!button||button.disabled)return;
  const row=button.closest('.contributor-posts'),status=row.querySelector('.post-status'),target=row.querySelector('.post-embed');
  button.disabled=true;status.textContent='投稿を読み込んでいます…';
  try{
   const widgets=await loadWidgets();if(!row.isConnected)return;
   let timer;const result=await Promise.race([widgets.createTimeline({sourceType:'profile',screenName:row.dataset.handle},target,{height:320,width:Math.max(180,Math.round(row.clientWidth)),lang:'ja',dnt:true,chrome:'nofooter noborders'}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),15000);})]).finally(()=>clearTimeout(timer));
   if(!row.isConnected)return;
   if(!result)throw new Error('unavailable');status.textContent='';button.hidden=true;
  }catch(_){if(!row.isConnected)return;status.textContent='投稿を表示できませんでした。「Xで見る」からご確認ください。';button.disabled=false;button.textContent='再読み込み';target.replaceChildren();}
 });
})();
