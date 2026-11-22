(() => {
 const notice=document.querySelector('.site-notice');
 const release=window.SITE_RELEASE;
 const history=window.RECENT_UPDATES||[];
 const latest=history[0];
 const latestBatch=latest?history.filter(entry=>latest.batch?entry.batch===latest.batch:entry.date===latest.date):[];
 const updatedCount=new Set(latestBatch.map(entry=>entry.card)).size;
 const track=notice.querySelector('.notice-track');
 const original=track.textContent;
 track.replaceChildren();
 const parts=original.split(/(ファンメイドの非公式サイト|各権利者|運営・ジャッジ)/);
 for(const [i,text] of parts.entries()){const span=document.createElement('span');span.textContent=text;if(i%2)span.className='led-accent-'+i;track.append(span);}
 const releaseText=`　 ◆ 直近のカード・テーマ更新：${updatedCount}枚　 ◆ サイト最終更新日：${release.updated.replaceAll('-','/')}　`;
 const status=document.createElement('span');status.className='led-release';status.textContent=releaseText;track.append(status);
 notice.querySelector('.visually-hidden').textContent=original+releaseText;
 const full=document.querySelector('#noticeDialog p');full.textContent=original+releaseText;
 const dialog=document.querySelector('#noticeDialog'),opener=document.querySelector('#noticeOpen');
 opener.addEventListener('click',()=>dialog.showModal());
 document.querySelector('#noticeClose').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>opener.focus());
 const updates=document.querySelector('#recentUpdates');
 for(const entry of (window.RECENT_UPDATES||[]).slice(0,15)){
  const li=document.createElement('li'),button=document.createElement('button'),time=document.createElement('time'),heading=document.createElement('a'),detail=document.createElement('span');
  time.dateTime=entry.date;time.textContent=entry.date.replaceAll('-','/');
  heading.className='update-heading';heading.textContent=`${entry.card}　${entry.change||`Q&A ${entry.added}件追加`}`;heading.title=heading.textContent;
  heading.href='#card='+encodeURIComponent(entry.card);
  heading.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();closeMenu();navigateToCard(entry.card);});
  detail.className='update-detail';detail.textContent=entry.summary;detail.title=entry.summary;
  button.type='button';button.setAttribute('aria-expanded','false');button.setAttribute('aria-label',entry.card+'の更新内容を展開');button.append(detail);li.append(time,heading,button);updates.append(li);
  button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(expanded));li.classList.toggle('is-expanded',expanded);});
 }
 // Trap keyboard focus within the existing menu without changing guide behavior.
 const menu=document.querySelector('#siteMenu');
 menu.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const items=[...menu.querySelectorAll('button,a[href],summary,[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.disabled);
  const first=items[0],last=items.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
})();
