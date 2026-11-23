(() => {
 const body=document.querySelector('#menuPageBody'),menu=document.querySelector('#siteMenu');
 const api='https://api.github.com/repos/sabae5280/yugioh-1103rulings-pwa';
 const repo='https://github.com/sabae5280/yugioh-1103rulings-pwa';
 let unlocked=false,entries=[],loaded=false,loading=false,shown=50,tab='history',notice='',filters={from:'',to:'',author:'',text:''},generation=0;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const active=()=>menu.dataset.adminPage==='true'&&!menu.hidden;
 const dateKey=s=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s));
 const timestamp=s=>new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(s));
 function render(){
  if(!active())return;
  if(!unlocked){body.innerHTML='<div class="admin-panel"><p>管理者・主催者向けの履歴とAI案内です。</p><form class="admin-login"><label>専用パスワード<input id="admin-password" type="password" autocomplete="current-password" required></label><button type="submit">開く</button><p id="admin-login-status" role="status"></p></form><p class="admin-note">簡易ロックです。機密情報の保管には使用しません。</p></div>';return;}
  body.innerHTML=`<div class="admin-panel"><div class="admin-toolbar"><button data-admin-tab="history" aria-pressed="${tab==='history'}">実装・更新履歴</button><button data-admin-tab="ai" aria-pressed="${tab==='ai'}">AI案内〈お試し版〉</button><button data-admin-lock>ロックする</button></div><div id="admin-content"></div></div>`;
  const host=body.querySelector('#admin-content');
  if(tab==='ai'){host.innerHTML=window.ADMIN_AI_CONTENT;return;}
  const authors=[...new Set(entries.map(e=>e.author))].sort((a,b)=>a.localeCompare(b,'ja'));
  host.innerHTML=`<p class="admin-note">GitHubに保存された変更を記録しています。日時は日本時間の保存日時です。記録上の作成者・保存者であり、実際の実装担当者や公開完了時刻と異なる場合があります。分割アップロードは別々の記録になります。</p><div class="admin-filters"><label>開始日<input id="admin-from" type="date" value="${esc(filters.from)}"></label><label>終了日<input id="admin-to" type="date" value="${esc(filters.to)}"></label><label>記録上の作成者<select id="admin-author"><option value="">すべて</option>${authors.map(a=>`<option${filters.author===a?' selected':''} value="${esc(a)}">${esc(a)}</option>`).join('')}</select></label><label>内容・担当者・ファイル名<input id="admin-text" type="search" value="${esc(filters.text)}" placeholder="例：ガイド、裁定、担当者名"></label></div><div class="admin-toolbar"><button data-admin-reset>条件をクリア</button><button data-admin-refresh ${loading?'disabled':''}>最新の履歴を取得</button></div><p class="admin-status" id="admin-history-status" role="status">${esc(notice)}</p><p id="admin-count"></p><ul class="admin-history-list" aria-label="実装・更新履歴" tabindex="0"></ul><button data-admin-more>さらに50件表示</button>`;
  renderList();
 }
 function renderList(){
  const list=body.querySelector('.admin-history-list');if(!list)return;
  const invalid=filters.from&&filters.to&&filters.from>filters.to;
  const matches=invalid?[]:entries.filter(e=>{const day=dateKey(e.date);return (!filters.from||day>=filters.from)&&(!filters.to||day<=filters.to)&&(!filters.author||e.author===filters.author)&&(!filters.text||[e.message,e.author,e.committer,...(e.files||[])].join(' ').toLowerCase().includes(filters.text.toLowerCase()))});
  body.querySelector('#admin-count').textContent=invalid?'開始日は終了日以前にしてください。':`${matches.length}件中 ${Math.min(shown,matches.length)}件を表示（新しい順）`;
  list.innerHTML=matches.slice(0,shown).map(e=>`<li><time datetime="${esc(e.date)}">${esc(timestamp(e.date))}</time><p>作成者：${esc(e.author)}${e.committer!==e.author?' ／保存者：'+esc(e.committer):''}</p><p>${esc(e.message||'説明なし')}</p><details data-admin-sha="${esc(e.sha)}"><summary>変更ファイルを確認</summary><div class="admin-files">${e.files?fileList(e.files):'<button data-admin-files="'+esc(e.sha)+'">変更ファイルを取得</button>'}</div></details><a href="${repo}/commit/${e.sha}" target="_blank" rel="noopener noreferrer">GitHubで変更内容を見る</a></li>`).join('')||'<li>該当する履歴はありません。</li>';
  body.querySelector('[data-admin-more]').hidden=shown>=matches.length;
 }
 function fileList(files){return files.length?'<ul>'+files.map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul>':'<p>変更ファイルの記録がありません。GitHubの詳細をご確認ください。</p>';}
 async function json(url){const res=await fetch(url,{cache:'no-store',headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error('HTTP '+res.status);return res.json();}
 async function load(){
  if(loading)return;loading=true;const token=++generation;notice='履歴を確認しています…';render();
  try{
   if(!loaded){try{const snapshot=await json('./admin-history.json');entries=snapshot.entries;loaded=true;}catch{} }
   if(token!==generation)return;render();
   let page=1,live=[],done=false;
   while(!done){const rows=await json(`${api}/commits?sha=main&per_page=100&page=${page}`);if(token!==generation)return;if(!Array.isArray(rows))throw Error('Invalid history');
    live.push(...rows.map(r=>({sha:r.sha,author:r.commit.author?.name||r.author?.login||'不明',committer:r.commit.committer?.name||'不明',authoredAt:r.commit.author?.date,date:r.commit.committer?.date||r.commit.author?.date,message:r.commit.message})));
    done=rows.length<100;page++;
   }
   const old=new Map(entries.map(e=>[e.sha,e]));entries=live.map(e=>({...e,files:old.get(e.sha)?.files}));loaded=true;notice='GitHubの最新記録を取得しました。ファイル名検索は変更ファイルを取得済みの記録が対象です。';
  }catch{notice=entries.length?'最新記録を取得できませんでした。同梱・取得済みの履歴を表示しています。時間をおいて再取得してください。':'履歴を取得できませんでした。通信を確認して再取得してください。';}
  finally{if(token===generation){loading=false;entries.sort((a,b)=>new Date(b.date)-new Date(a.date));render();}}
 }
 window.AdminMode={open(){menu.dataset.adminPage='true';render();if(unlocked&&tab==='history'&&!loaded)load();},leave(){menu.dataset.adminPage='false';}};
 body.addEventListener('submit',async event=>{
  if(!event.target.matches('.admin-login'))return;event.preventDefault();
  const input=body.querySelector('#admin-password'),value=input.value;input.value='';
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join('');
  if(hash===window.ADMIN_PASSWORD_SHA256){unlocked=true;tab='history';render();load();}else body.querySelector('#admin-login-status').textContent='パスワードが違います。';
 });
 body.addEventListener('input',e=>{const key={'admin-from':'from','admin-to':'to','admin-author':'author','admin-text':'text'}[e.target.id];if(key){filters[key]=e.target.value;shown=50;renderList();}});
 body.addEventListener('click',async e=>{
  if(e.target.closest('[data-admin-lock]')){unlocked=false;generation++;loading=false;render();return;}
  const t=e.target.closest('[data-admin-tab]');if(t){tab=t.dataset.adminTab;render();return;}
  if(e.target.closest('[data-admin-more]')){shown+=50;renderList();}
  if(e.target.closest('[data-admin-reset]')){filters={from:'',to:'',author:'',text:''};shown=50;render();}
  if(e.target.closest('[data-admin-refresh]'))load();
  const btn=e.target.closest('[data-admin-files]');if(btn){btn.disabled=true;try{const data=await json(`${api}/commits/${btn.dataset.adminFiles}`);const item=entries.find(x=>x.sha===btn.dataset.adminFiles);item.files=(data.files||[]).map(f=>f.filename);btn.parentElement.innerHTML=fileList(item.files);}catch{btn.disabled=false;btn.textContent='取得できませんでした。再試行';}}
 });
})();
