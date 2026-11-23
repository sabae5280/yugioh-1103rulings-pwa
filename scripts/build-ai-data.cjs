// Run from repository: node scripts/build-ai-data.cjs
// Requires playwright and an installed browser (Edge by default; AI_BROWSER=chromium optional).
const fs=require('fs'),path=require('path'),crypto=require('crypto'),http=require('http');
const root=path.resolve(__dirname,'..'),dest=path.join(root,'ai');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script[^>]+src="\.\/([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1]).filter(f=>f!=='ai/prompt.js');
const hash=crypto.createHash('sha256');for(const f of ['index.html',...scripts])hash.update(f).update(fs.readFileSync(path.join(root,f)));const sourceHash=hash.digest('hex');
if(process.argv.includes('--check')){const m=JSON.parse(fs.readFileSync(path.join(dest,'manifest.json'),'utf8'));if(m.sourceHash!==sourceHash)throw Error('AI資料が古くなっています。node scripts/build-ai-data.cjs で再生成してください。');console.log('AI資料はソースと一致しています');process.exit(0)}
const base='https://sabae5280.github.io/yugioh-1103rulings-pwa/';
function absolute(v){if(typeof v==='string'&&v.startsWith('./'))return new URL(v,base).href;if(Array.isArray(v))return v.map(absolute);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,absolute(x)]));return v}
(async()=>{const {chromium}=require('playwright');let browser;const server=http.createServer((req,res)=>{try{let filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403).end();return}if(fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');const ext=path.extname(filename);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json'})[ext]||'application/octet-stream');res.end(fs.readFileSync(filename))}catch{res.writeHead(404).end()}});
try{await new Promise(ok=>server.listen(0,'127.0.0.1',ok));browser=await chromium.launch({headless:true,...(process.env.AI_BROWSER==='chromium'?{}:{channel:'msedge'})});const page=await browser.newPage({serviceWorkers:'block'});await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>typeof allRulings!=='undefined'&&allRulings.length>0);
const {cards,release,pages}=await page.evaluate(()=>({cards:allRulings.map(item=>({...item,qa:(item.qa||[]).map(q=>({...q,siteEnvironmentTags:qaEnvironments(q,item)}))})),release:window.SITE_RELEASE,pages:window.SITE_MENU_PAGES}));
require('./render-ai-search.cjs')({dest,cards,release,pages,sourceHash,base});
console.log(`AI資料生成完了: ${cards.length}件 / ${release.version}`);
}finally{if(browser)await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});

