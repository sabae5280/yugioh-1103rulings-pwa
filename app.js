const list = document.querySelector("#rulingList");
const count = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const clearButton = document.querySelector("#clearButton");
const resetButton = document.querySelector("#resetButton");
const emptyState = document.querySelector("#emptyState");
const filters = document.querySelector("#filters");
const installButton = document.querySelector("#installButton");
const iosTip = document.querySelector("#iosTip");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector("#lightboxClose");
const advancedToggle = document.querySelector("#advancedToggle");
const advancedPanel = document.querySelector("#advancedPanel");
const advancedFilters = document.querySelector("#advancedFilters");
const menuButton = document.querySelector("#menuButton");
const siteMenu = document.querySelector("#siteMenu");
const menuClose = document.querySelector("#menuClose");
const menuPageTitle = document.querySelector("#menuPageTitle");
const menuPageBody = document.querySelector("#menuPageBody");
const homeButton = document.querySelector("#homeButton");
const backToTopButton = document.querySelector("#backToTop");
const rowNavigation = document.querySelector("#rowNavigation");
const shareButton = document.querySelector("#shareButton");
const shareStatus = document.querySelector("#shareStatus");

let currentFilter = "all";
let activeQaSearchItem = null;
let activeQaSearchId = null;
let activeDifficultSearch = false;
let deferredPrompt = null;
let referencedCardName = null;
const selectedEnvironments = new Set(['1103', '1209', '1402']);
const environmentModes = {
  'all': ['1103', '1209', '1402'], '1103': ['1103'],
  '1209': ['1103', '1209'], '1209-only': ['1209'], '1402-only': ['1402']
};
const environmentNames = { all: 'すべての掲載カード', '1103': '1103環境', '1209': '1209環境', '1209-only': '1209新規カード・新規裁定', '1402-only': '1402新規カード・新規裁定' };
// Each new visit starts with all cards; old saved environment filters must not hide results.
let environmentMode = 'all';
function setEnvironmentMode(mode) {
  environmentMode = Object.hasOwn(environmentModes, mode) ? mode : 'all';
  selectedEnvironments.clear();
  environmentModes[environmentMode].forEach(e => selectedEnvironments.add(e));
  document.querySelectorAll('input[name="environmentMode"]').forEach(input => {
    input.checked = input.value === environmentMode;
    input.closest('label').classList.toggle('is-primary', input.checked);
  });
  document.querySelector('#environmentSummary').textContent = environmentNames[environmentMode];
}
const advancedSelections = new Map();
const cardNavigationStack = [];
const backToCardButton = document.querySelector("#backToCard");

const isStandaloneDisplay = (typeof window.matchMedia === "function" && (
  window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches
)) || navigator.standalone === true;
document.documentElement.classList.toggle("is-standalone", Boolean(isStandaloneDisplay));

const typeLabels = { monster: "モンスター", spell: "魔法", trap: "罠", category: "テーマ共通効果" };
const kanaRows = [
  { id: "a", label: "ア行", pattern: /^[あいうえおぁぃぅぇぉ]/ },
  { id: "ka", label: "カ行", pattern: /^[かきくけこがぎぐげご]/ },
  { id: "sa", label: "サ行", pattern: /^[さしすせそざじずぜぞ]/ },
  { id: "ta", label: "タ行", pattern: /^[たちつてとだぢづでど]/ },
  { id: "na", label: "ナ行", pattern: /^[なにぬねの]/ },
  { id: "ha", label: "ハ行", pattern: /^[はひふへほばびぶべぼぱぴぷぺぽ]/ },
  { id: "ma", label: "マ行", pattern: /^[まみむめも]/ },
  { id: "ya", label: "ヤ行", pattern: /^[やゆよゃゅょ]/ },
  { id: "ra", label: "ラ行", pattern: /^[らりるれろ]/ },
  { id: "wa", label: "ワ行", pattern: /^[わをん]/ }
];

const searchConfig = window.RULING_SEARCH_CONFIG || { terms: [], aliases: {}, cardTags: {}, qaTags: {} };
const filterGroups = [
  { id: 'rulingTerms', label: '裁定関連用語（非公式含む）', options: searchConfig.terms.map(term => term.label) },
  { id: 'monsterTags', label: 'モンスターの分類', options: ['通常モンスター', '効果モンスター', 'リバース効果', 'チューナー', '儀式', '融合', 'シンクロ', 'エクシーズ', 'トゥーン', 'スピリット', 'ユニオン', 'デュアル'] },
  { id: 'spellType', label: '魔法の分類', options: ['通常魔法', '速攻魔法', '装備魔法', '永続魔法', 'フィールド魔法', '儀式魔法'] },
  { id: 'trapType', label: '罠の分類', options: ['通常罠', '永続罠', 'カウンター罠'] },
  { id: 'otherTags', label: 'その他', options: ['難解な裁定', 'ジャッジ確認案件', 'エラッタ'] }
];

const sitePages = {
  about: {"title": "このサイトについて", "body": "ご覧いただきありがとうデス。\n1103環境を中心に、マスタールール２での当時裁定を解説しています。\nメニューから使用上の注意点などをよくご確認の上、ご活用ください。"},
  precautions: {"title": "使用上の注意事項", "body": "本サイトは非公式デス。\n\n複数名で様々な当時裁定を照らし合わせ、有識者の監修も経て作成しておりますが、\n100％の精度ではありません。\n\n必ず自己責任でご活用ください。\n\nイベントで活用する際は、事前に会場ルール（セルフジャッジの有無）などを確認の上、対戦相手とよくコミュニケーションをとった上でご使用ください。"},
  guide: { title: "使い方", body: "カード名・読みがな・裁定の内容で検索できます。ひらがな／カタカナ、全角／半角の違いを吸収し、「ダメステ」でも「ダメージステップ」を検索できます。\n\n複数の語はスペースで区切ってください。例えば「コピー・プラント 強化蘇生」で、両方が関係するQ&Aや基本情報を探せます。入力例の「、」は別々の検索例です。\n\n詳細検索には五十音、カード種類、対応環境、用語・分類があります。各分類は個別に開閉でき、閉じても条件は維持されます。同じ分類内では選択した項目のいずれかに一致するカードを、異なる分類間では両方の条件に一致するカードを表示します。\n\n用語のチェックボックスは絞り込み、用語名は説明の表示です。用語は登録済みのタグに基づきます。説明未登録の項目は準備中と表示します。\n\n条件は検索欄の下の「×」または「条件をクリア」で解除できます。新しくサイトを開いたときは全環境の掲載カードを表示します。" },
  contact: { title: "お問い合わせ", body: "現在準備中です。" },
  links: { title: "各種リンク集", body: "現在準備中です。" }
};

const handTrapArticle = {
  title: "〖1103〗TGワーウルフはいつ出せるのか？〖裁定〗",
  url: "https://oo-arashi.hatenablog.com/entry/2025/03/23/194630",
  image: "https://cdn-ak.f.st-hatena.com/images/fotolife/o/oo-arashi/20250311/20250311113030.jpg",
  description: "《TG ワーウルフ》の発動タイミングと、1103当時の手札誘発の扱いを検討する記事。",
  siteName: "oo-arashi’s blog"
};
const mysterySpaceArticle = {
  title: "謎空間 (召喚無効、魔法罠のカードの発動無効) について",
  url: "https://andal-po.blog.jp/archives/1079147390.html",
  image: "./article-mystery-space.png",
  description: "召喚や魔法・罠カードの発動が無効になった際の処理をまとめた記事。",
  siteName: "Andal-po Blog"
};
const galeArticle = {
  title: "攻守半減のあれやこれ",
  url: "https://note.com/lovely_minnow640/n/n3baa1b267485",
  image: "./article-gale-effect.png",
  description: "《BF－疾風のゲイル》等の攻守半減効果による数値固定と、関連する裁定をまとめた記事。",
  siteName: "note"
};

function articleTextFor(item) {
  return [item.name, item.overview, item.summary, ...(item.details || []), ...(item.qa || []).flatMap((entry) => [entry.question, entry.answer])]
    .filter(Boolean).join(" ");
}

function withMatchingArticles(item) {
  const text = articleTextFor(item);
  const articles = [...(item.externalArticles || [])];
  const appendUnique = (article) => {
    if (!articles.some((existing) => existing.url === article.url)) articles.push(article);
  };
  if (/手札で発動する誘発効果|手札誘発/.test(text) || /TG\s*ワーウルフ/i.test(item.name)) appendUnique(handTrapArticle);
  if (/謎空間/.test(text)) appendUnique(mysterySpaceArticle);
  if (/疾風のゲイル|ゲイル効果/.test(text)) appendUnique(galeArticle);
  return articles;
}

function cleanOverviewText(value) {
  if (value === undefined || value === null) return value;
  return String(value)
    .replace(/^【基本情報】/gm, "【基本情報 ＋ 補足】")
    .split(/\r?\n/)
    .filter((line) => !/^[■◾◾️]\s*効果補足\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function enrichItem(item) {
  const metadata = window.CARD_METADATA?.[item.name] || {};
  const enriched = {
    ...metadata,
    ...item,
    reading: item.reading || window.CARD_READINGS?.[item.name] || metadata.reading || "",
    environments: item.environments || metadata.environments || ["1103"],
    monsterTags: item.monsterTags || metadata.monsterTags || []
  };
  enriched.overview = cleanOverviewText(enriched.overview);
  enriched.summary = cleanOverviewText(enriched.summary);
  enriched.details = (enriched.details || []).map(cleanOverviewText);
  enriched.externalArticles = withMatchingArticles(enriched);
  return enriched;
}

const japaneseCollator = new Intl.Collator("ja", { numeric: true, sensitivity: "base" });
const allRulings = window.RULINGS
  .map(enrichItem)
  .sort((a, b) => japaneseCollator.compare(a.reading || a.name, b.reading || b.name));

// Keep Q&A IDs stable across reloads and reserve IDs already assigned to entries.
const usedManagementIds = new Set();
const usedQaIds = new Set();
for (const item of allRulings) {
  for (const entry of item.qa || []) {
    if (entry.managementId) {
      const rawId = String(entry.managementId).replace(/^ID\s*:\s*/i, "");
      const normalizedId = rawId.startsWith("R-") ? rawId : `R-${rawId}`;
      entry.managementId = normalizedId;
      usedQaIds.add(normalizedId.slice(2).toUpperCase());
    }
  }
}

function managementIdFor(key) {
  let hash = 2166136261;
  for (const character of key) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const range = 90000;
  let candidate = 10000 + (hash >>> 0) % range;
  while (usedManagementIds.has(String(candidate).padStart(5, "0"))) {
    candidate = 10000 + ((candidate - 10000 + 1) % range);
  }
  const id = String(candidate).padStart(5, "0");
  usedManagementIds.add(id);
  return id;
}

function qaManagementIdFor(key) {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let hash = 2166136261;
  for (const character of key) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  let value = (hash >>> 0) % (36 ** 5);
  let id = "";
  for (let index = 0; index < 5; index += 1) {
    id = alphabet[value % 36] + id;
    value = Math.floor(value / 36);
  }
  while (usedQaIds.has(id)) {
    value = (value + 1) % (36 ** 5);
    let next = value;
    id = "";
    for (let index = 0; index < 5; index += 1) {
      id = alphabet[next % 36] + id;
      next = Math.floor(next / 36);
    }
  }
  usedQaIds.add(id);
  return `R-${id}`;
}

const missingQaIds = allRulings.flatMap((item) => (item.qa || [])
  .map((entry, index) => ({ entry, key: `qa:${item.name}:${index + 1}` }))
  .filter(({ entry }) => !entry.managementId))
  .sort((a, b) => a.key.localeCompare(b.key, "ja"));
for (const { entry, key } of missingQaIds) entry.managementId = qaManagementIdFor(key);

for (const item of [...allRulings].sort((a, b) => a.name.localeCompare(b.name, "ja"))) {
  item.overviewManagementId = item.overviewManagementId || managementIdFor(`overview:${item.name}`);
}

function normalizedManagementId(value) {
  return String(value || "").replace(/^ID\s*:\s*/i, "").replace(/^R-/i, "").replace(/[^a-z0-9]/gi, "").toUpperCase();
}
function itemByManagementId(value) {
  const wanted = normalizedManagementId(value);
  return allRulings.find((item) => [item.id, item.managementId, item.overviewManagementId]
    .some((id) => normalizedManagementId(id) === wanted)) || null;
}
function rulingByManagementId(value) {
  const item = itemByManagementId(value);
  if (item) return { item, entry: null };
  const wanted = normalizedManagementId(value);
  for (const card of allRulings) {
    for (const entry of card.qa || []) {
      if (normalizedManagementId(entry.managementId) === wanted) return { item: card, entry };
    }
  }
  return null;
}
function directManagementIdQuery(value) {
  const raw = String(value || "").trim();
  if (/^(?:ID\s*:\s*)?R-[A-Z0-9-]{5,}$/i.test(raw) || /^\d{5}$/.test(raw)) {
    return rulingByManagementId(raw);
  }
  return null;
}
function appendUniqueQa(item, qa) {
  item.qa ||= [];
  const prior = item.qa.find((entry) => normalize(entry.question) === normalize(qa.question));
  if (prior) Object.assign(prior, qa);
  else item.qa.push(qa);
}
function applyAttachedDataCorrections() {
  const patch = window.CARD_DATA_CORRECTIONS || {};
  const replaceAnswerStar = (target) => {
    if (!target?.entry) return false;
    const answer = String(target.entry.answer || "");
    if (/^.*★.*$/m.test(answer)) target.entry.answer = answer.replace(/^.*★.*$/m, patch.answerSentence);
    else target.entry.answer = `${answer}${answer ? "\n" : ""}${patch.answerSentence}`;
    return true;
  };
  const answerTarget = rulingByManagementId("R-VVG6M");
  if (!replaceAnswerStar(answerTarget)) {
    const fallback = allRulings.flatMap((item) => (item.qa || []).map((entry) => ({ item, entry })))
      .find(({ entry }) => /王宮の弾圧/.test(entry.answer || "") && /⑤/.test(entry.answer || "") && /★/.test(entry.answer || ""));
    if (fallback) replaceAnswerStar(fallback);
  }

  const 露払い = allRulings.find((item) => normalize(item.name) === normalize("六武衆の露払い"));
  if (露払い) {
    露払い.overview = [露払い.overview || "", "▶このカードは発動時に他に表側表示の《六武衆》名称モンスターがあればよい。効果処理時の他の《六武衆》名称モンスターの所在は問わない。※他の旧《六武衆》モンスターは、発動時及び効果処理時まで《六武衆》名称が他に表側表示で存在しないと不発となるため注意."].filter(Boolean).join("\n");
    const target = rulingByManagementId("R-GSVXI");
    if (target?.entry) {
      target.entry.question = patch.yaitaQuestion;
      target.entry.answer = patch.yaitaAnswer;
    } else appendUniqueQa(露払い, { question: patch.yaitaQuestion, answer: patch.yaitaAnswer });
  }

  let targetCard = itemByManagementId("65733") || allRulings.find((item) => /装備ユニオン|ジュラック・グアイバ/.test(item.overview || ""));
  if (targetCard) targetCard.overview = patch["65733Overview"];

  const idTarget = rulingByManagementId("R-I75NP");
  if (idTarget?.entry) idTarget.entry.answer = patch.rI75npAnswer;
  else {
    const fallback = allRulings.flatMap((item) => (item.qa || []).map((entry) => ({ item, entry })))
      .find(({ entry }) => /墓地の《六武衆》モンスターを２体対象/.test(entry.question || ""));
    if (fallback) fallback.entry.answer = patch.rI75npAnswer;
  }

  const sixShield = allRulings.find((item) => normalize(item.name) === normalize("六尺瓊勾玉"));
  if (sixShield) appendUniqueQa(sixShield, { question: patch.sixShieldQuestion, answer: patch.sixShieldAnswer });

  const ultimate = allRulings.find((item) => normalize(item.name) === normalize("究極・背水の陣"));
  if (ultimate) {
    ultimate.overview = patch.ultimateOverview;
    for (const qa of patch.ultimateQas || []) appendUniqueQa(ultimate, qa);
  }

  targetCard = itemByManagementId("32650") || allRulings.find((item) => item.type === "category" && /六武衆/.test(item.name) && /身代わり効果/.test(item.overview || ""));
  if (targetCard) targetCard.overview = patch["32650Overview"];
}
applyAttachedDataCorrections();

const referencePopularity = new Map();

for (const item of allRulings) {
  const text = [item.overview, item.summary, ...(item.details || []), ...(item.qa || []).flatMap((entry) => [entry.question, entry.answer])].filter(Boolean).join(" ");
  for (const match of text.matchAll(/《([^》]+)》/g)) {
    const key = normalize(match[1]);
    referencePopularity.set(key, (referencePopularity.get(key) || 0) + 1);
  }
}

function normalize(value) {
  const normalized = String(value || "")
    .normalize("NFKC")
    .toLowerCase();

  // カタカナをひらがなへ統一し、表記ゆれを吸収する。
  const hiragana = normalized.replace(/[ァ-ヶ]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60)
  );

  // 中黒、空白、長音・ハイフン、カード名を囲う記号の差を吸収する。
  return hiragana.replace(/[\s・･•·－―—–ー_＿《》「」『』【】-]/g, "");
}

// 裁定文中の《カード名》を拾い、参照先と参照元の両方に関連リンクを作る。
// Strip answer/check stamps from the runtime data as well as rendered text.
for (const card of allRulings) for (const entry of card.qa || []) {
  entry.question = stripQaDates(entry.question);
  entry.answer = stripQaDates(entry.answer);
}

const relatedCardsByName = new Map(allRulings.map((item) => [normalize(item.name), new Map()]));
const cardsByNormalizedName = new Map();
for (const item of allRulings) {
  const key = normalize(item.name);
  if (!cardsByNormalizedName.has(key)) cardsByNormalizedName.set(key, item);
}
function addRelatedPair(source, targetName) {
  const target = cardsByNormalizedName.get(normalize(targetName));
  if (!target || target === source) return;
  relatedCardsByName.get(normalize(source.name)).set(normalize(target.name), target);
  relatedCardsByName.get(normalize(target.name)).set(normalize(source.name), source);
}
for (const item of allRulings) {
  const text = [
    item.overview, item.summary, ...(item.details || []),
    ...(item.qa || []).flatMap((entry) => [entry.question, entry.answer])
  ].filter(Boolean).join(" ");
  for (const match of text.matchAll(/《([^》]+)》/g)) addRelatedPair(item, match[1]);
  for (const relatedName of item.related || []) addRelatedPair(item, relatedName);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function searchableText(item) {
  const qaText = (item.qa || []).filter(entry => environmentMatches(qaEnvironments(entry, item))).flatMap((entry) => [entry.question, entry.answer, entry.managementId, entry.difficult ? "難解" : ""]);
  return [
    item.name,
    item.reading,
    item.overview,
    item.summary,
    ...(item.details || []),
    ...qaText,
    item.overviewManagementId,
    ...(item.related || []),
    ...(item.monsterTags || []),
    ...(item.specialTags || []),
    item.race,
    item.attribute,
    item.spellType,
    item.trapType,
    ...(item.environments || []).map((environment) => `${environment}環境`)
  ].join(" ");
}

function kanaRowFor(item) {
  let source = item.reading || item.name || "";
  if (item.type === "category") source = source.match(/《([^》]+)》/)?.[1] || source;
  const first = normalize(source).slice(0, 1).replace("ゔ", "う");
  return kanaRows.find((row) => row.pattern.test(first)) || null;
}

function renderKanaNavigation(items) {
  const availableRows = new Set(items.map(kanaRowFor).filter(Boolean).map((row) => row.id));
  rowNavigation.innerHTML = kanaRows.map((row) => availableRows.has(row.id)
    ? `<a href="#row-${row.id}">${row.label}</a>`
    : `<span aria-disabled="true">${row.label}</span>`).join("");
  rowNavigation.hidden = false;
}

function findCard(name) {
  const target = normalize(name);
  return cardsByNormalizedName.get(target);
}

function cardReference(name, displayName = `《${name}》`, highlightCurrent = false) {
  const target = findCard(name);
  const label = escapeHtml(displayName);
  if (!target) return `<span class="card-reference is-pending" title="カードページ準備中">${label}</span>`;
  const modifier = highlightCurrent ? " card-reference--current" : "";
  return `<a class="card-reference${modifier}" href="#card=${encodeURIComponent(target.name)}" data-card="${escapeHtml(target.name)}">${label}</a>`;
}

function linkedText(value, currentCardName = null, preserveSingleLines = false) {
  // Rendering-only spacing: keep source wording and punctuation untouched.
  const source = String(value || "").replace(/\r\n?/g, "\n");
  const readable = preserveSingleLines ? source : source.replace(
    /(?<!\n)\n(?!\n)(?=(?:▶|■|◆|●|★|①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|※|・))/g,
    "\n\n"
  );
  const categoryReferences = new Map([
    ["《甲虫装機》の共通効果", "【甲虫装機】共通効果"],
    ["《アーティファクト》の共通効果", "【アーティファクト】共通効果"],
    ["《征竜》の共通効果", "【征竜】共通効果"],
    ["《Sin》共通効果", "《Sin》共通効果"]
  ]);
  return escapeHtml(readable).replace(/《甲虫装機》の共通効果|《アーティファクト》の共通効果|《征竜》の共通効果|《Sin》共通効果|《([^》]+)》/g, (match, name) => {
    const category = categoryReferences.get(match);
    if (category) return cardReference(category, match);
    const isCurrentCard = Boolean(currentCardName && normalize(name) === normalize(currentCardName));
    return cardReference(name, undefined, isCurrentCard);
  }).replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
}

function stripQaDates(value) {
  return String(value || '').replace(/[（(]\s*(?:(?:回答|確認|更新)日?[：:]?\s*)?\d{2,4}[\/．.]\d{1,2}[\/．.]\d{1,2}\s*[）)](?=\s*(?:$|※))/gm, '')
    .replace(/^(?:回答|確認|更新)日[：:]\s*\d{2,4}(?:年|[\/.-])\d{1,2}(?:月|[\/.-])\d{1,2}日?\s*$/gm, '');
}
function renderAnswer(value, currentCardName = null) {
  const text = String(value || "");
  const pattern = /\[\[補足:([^\]\n]+)\]\]([\s\S]*?)\[\[\/補足\]\]/g;
  let html = "", cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const before = text.slice(cursor, match.index);
    html += renderAnswerBody((cursor ? before.trimStart() : before).trimEnd(), currentCardName);
    html += `<details class="answer-disclosure"><summary>${escapeHtml(match[1])}</summary><div class="answer-disclosure__body">${renderAnswerBody(match[2].trim(), currentCardName)}</div></details>`;
    cursor = match.index + match[0].length;
  }
  return html + renderAnswerBody(cursor ? text.slice(cursor).trimStart() : text, currentCardName);
}

function renderAnswerBody(value, currentCardName = null) {
  const blocks = [];
  for (const line of cleanQaText(value).split('\n')) {
    const marked = line.match(/^\s*([①②③④⑤⑥⑦⑧⑨⑩▷■])\s*(.*)$/);
    if (marked) blocks.push({marker:marked[1],text:marked[2]});
    else if (line.trim() && blocks.at(-1)?.marker) blocks.at(-1).text += '\n' + line;
    else blocks.push({text:line});
  }
  return blocks.map(block => block.marker
    ? `<div class="answer-point"><span>${block.marker}</span><div>${linkedText(block.text,currentCardName)}</div></div>`
    : `<div class="answer-line">${linkedText(block.text,currentCardName) || '<br>'}</div>`).join('');
}
function cleanQaText(value) {
  const cardNames = [];
  let cleaned = stripQaDates(String(value || "")).replace(/《[^》]+》/g, (name) => {
    const token = `\u0000CARD_NAME_${cardNames.length}\u0000`;
    cardNames.push(name);
    return token;
  });
  cleaned = cleaned
    .replace(/\[\[補足:([^\]\n]+)\]\]/g, "$1")
    .replace(/\[\[\/補足\]\]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([、。，．！？：；）】])/g, "$1")
    .replace(/([（「『]) +/g, "$1")
    .replace(/([ぁ-んァ-ヶ一-龯々]) +([ぁ-んァ-ヶ一-龯々、。，．！？：；「」『』（）])/g, "$1$2")
    .replace(/([0-9０-９]) +(?=[ぁ-んァ-ヶ一-龯々])/g, "$1")
    .replace(/([ぁ-んァ-ヶ一-龯々]) +(?=[0-9０-９])/g, "$1");
  return cleaned
    .replace(/\u0000CARD_NAME_(\d+)\u0000/g, (_match, index) => cardNames[Number(index)])
    .replace(/([、。，．！？：；]) +/g, "$1")
    .replace(/》 +(?=[ぁ-んァ-ヶ一-龯々])/g, "》")
    .replace(/([ぁ-んァ-ヶ一-龯々]) +(?=《)/g, "$1");
}

function linkedQaText(value, currentCardName = null) {
  return linkedText(cleanQaText(value), currentCardName);
}

function copyIconButton(copyText, ariaLabel) {
  return `<button class="qa-copy-id copy-icon" type="button" data-copy-text="${escapeHtml(copyText)}" aria-label="${escapeHtml(ariaLabel)}" title="${escapeHtml(ariaLabel)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg></button>`;
}

function cardTitle(item) {
  if (item.type === "category") return escapeHtml(item.name);
  const name = `《${escapeHtml(item.name)}》`;
  if (!item.reading) return name;
  return `<ruby>${name}<rt>${escapeHtml(item.reading)}</rt></ruby>`;
}

function typeBadge(item) {
  const label = typeLabels[item.type];
  const modifier = item.type === "monster" ? ` monster-${item.cardClass || "effect"}` : "";
  return `<span class="type-badge type-${escapeHtml(item.type)}${modifier}">${escapeHtml(label)}</span>`;
}

function effectIcon(item) {
  const iconMap = {
    "装備魔法": ["equip", "装備魔法"],
    "フィールド魔法": ["field", "フィールド魔法"],
    "速攻魔法": ["quick", "速攻魔法"],
    "儀式魔法": ["ritual", "儀式魔法"],
    "永続魔法": ["continuous", "永続魔法"],
    "永続罠": ["continuous", "永続罠"],
    "カウンター罠": ["counter", "カウンター罠"]
  };
  const icon = iconMap[item.spellType || item.trapType];
  if (!icon) return "";
  return `<span class="effect-icon effect-icon-${icon[0]}" role="img" aria-label="${icon[1]}" title="${icon[1]}"></span>`;
}

function imagePanel(item) {
  if (item.imageVariants?.length) {
    return `<div class="card-image-variants">${item.imageVariants.map(image => `
      <figure class="card-image-variant">
        ${imagePanel({ ...item, imageVariants: null, image: image.src })}
        <figcaption>${escapeHtml(image.caption || "")}</figcaption>
      </figure>`).join("")}</div>`;
  }
  if (item.image) {
    return `
      <button class="image-zoom-button" type="button" data-image-src="${escapeHtml(item.image)}" data-image-name="${escapeHtml(item.name)}" aria-label="《${escapeHtml(item.name)}》のカード画像を拡大表示">
        <img class="card-image" src="${escapeHtml(item.image)}" alt="《${escapeHtml(item.name)}》のカード画像" loading="lazy">
        <span>クリックで拡大</span>
      </button>`;
  }
  return `<div class="image-placeholder" aria-label="カード画像準備中"><span>IMAGE</span><small>画像準備中</small></div>`;
}

function environmentMatches(environments) {
  if (environmentMode === "all") return true;
  const values = environments?.length ? environments : ['1103'];
  return values.some((environment) => selectedEnvironments.has(environment));
}

function qaEnvironments(entry, item) {
  return entry.environments || item.environments || ["1103"];
}

function qaBasePriority(entry, item) {
  const question = entry.question || "";
  const rulingText = `${question} ${entry.answer || ""}`;
  const references = [...rulingText.matchAll(/《([^》]+)》/g)]
    .map((match) => match[1])
    .filter((name) => normalize(name) !== normalize(item.name));

  if (references.length) {
    const popularity = Math.max(...references.map((name) => referencePopularity.get(normalize(name)) || 0), 0);
    return 1000 - popularity;
  }
  if (/(?:効果分類|効果の種別|種類|分類)/.test(question)) return 0;
  if (/対象を取/.test(question)) return 10;
  if (/(?:コスト|手順)/.test(question)) return 20;
  if (/(?:発動条件|発動できますか|処理時|タイミング)/.test(question)) return 30;
  if (/(?:ダメージステップ|ダメステ)/.test(question)) return 40;
  return 50;
}

function orderedQa(item) {
  const outsideReference = referencedCardName === item.name && !environmentMatches(item.environments);
  const entries = (item.qa || []).filter((entry) => outsideReference || environmentMatches(qaEnvironments(entry, item)));
  const pinnedFirst = entries.filter((entry) => entry.pinFirst);
  const pinnedLast = entries.filter((entry) => entry.managementId === "R-W79LJTECPZ" && !entry.pinFirst);
  const pinnedFirstSet = new Set(pinnedFirst);
  const pinnedLastSet = new Set(pinnedLast);
  return [
    ...pinnedFirst,
    ...entries.filter((entry) => !pinnedFirstSet.has(entry) && !pinnedLastSet.has(entry)),
    ...pinnedLast
  ];
}

function environmentLabel(environments) {
  return !environments || environments.length === 0 ? "全環境" : environments.map((environment) => `${environment}環境`).join("・");
}

function qaImagesPanel(entry, item) {
  const images = entry.images || [];
  if (!images.length) return "";
  return `<div class="qa-supplemental-images">${images.map((source, index) => {
    const image = typeof source === "string" ? { src: source } : source;
    const alt = image.alt || `${item.name}のQ&A参考画像${index + 1}`;
    return `<button class="supplemental-image qa-supplemental-image" type="button" data-image-src="${escapeHtml(image.src)}" data-image-name="${escapeHtml(alt)}" aria-label="${escapeHtml(alt)}を拡大表示"><img src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" loading="lazy">${image.caption ? `<span>${escapeHtml(image.caption)}</span>` : ""}</button>`;
  }).join("")}</div>`;
}

function qaPanel(item, entriesOverride = null) {
  let entries = entriesOverride ?? orderedQa(item);
  if (activeDifficultSearch) entries = entries.filter((entry) => entry.difficult);
  if (activeQaSearchItem === item && activeQaSearchId) {
    entries = entries.filter((entry) => normalizedManagementId(entry.managementId) === activeQaSearchId);
  }
  if (entries.length) {
    return `
      <section class="card-section">
        <h3>Q&amp;A</h3>
        <div class="qa-list">
          ${entries.map((entry, index) => `
            <details class="qa-item" data-qa-id="${escapeHtml(entry.managementId || '')}"${activeQaSearchItem === item && activeQaSearchId ? " open" : ""}>
              <summary><span class="qa-marker">Q</span>${entry.difficult ? '<span class="qa-difficult-badge" title="難解な裁定" aria-label="難解な裁定">!</span>' : ""}<span class="qa-question">${linkedQaText(entry.question)}</span></summary>
              ${(entry.answers && entry.answers.length ? entry.answers : [entry]).map((answerEntry) => `
                <div class="answer"><span>A</span><div class="answer-body">${renderAnswer(answerEntry.answer)}</div></div>
                <p class="qa-environment">対応：${escapeHtml(environmentLabel(qaEnvironments(answerEntry, item)))}</p>
              `).join("")}
              ${qaImagesPanel(entry, item)}
              ${entry.managementId ? `<p class="qa-management-id"><span>管理ID：${escapeHtml(entry.managementId)}</span>${copyIconButton(`ID: ${entry.managementId}`, "管理IDをコピー")}</p>` : ""}
            </details>
          `).join("")}
        </div>
      </section>`;
  }
  if (item.type === "category") return "";
  return `
    <section class="card-section">
      <h3>裁定メモ</h3>
      <ul class="details">${(item.details || ["Q&Aは今後追記予定です。"]).map((detail) => `<li>${linkedText(detail)}</li>`).join("")}</ul>
    </section>`;
}

function containsCardReference(text, card) {
  const target = normalize(card.name);
  return [...String(text || "").matchAll(/《([^》]+)》/g)].some((match) => normalize(match[1]) === target);
}

function relatedRulings(source, target) {
  const entries = [];
  const seen = new Set();
  const addOverview = (text, label = "概要") => {
    const blocks = String(text || "").split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
    for (const block of blocks) {
      if (!containsCardReference(block, target)) continue;
      const key = `overview:${normalize(block)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ type: "overview", label, text: block });
    }
  };

  addOverview(source.overview || source.summary);
  for (const detail of source.details || []) addOverview(detail, "裁定メモ");
  for (const qa of source.qa || []) {
    if (!environmentMatches(qaEnvironments(qa, source))) continue;
    if (!containsCardReference(`${qa.question || ""}\n${qa.answer || ""}`, target)) continue;
    const key = `qa:${normalize(qa.question)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ type: "qa", question: qa.question, answer: qa.answer });
  }
  return entries;
}

function relatedPanel(item) {
  const inferredNames = [...(relatedCardsByName.get(normalize(item.name))?.values() || [])].map((related) => related.name);
  const relatedNames = [...new Map([...(item.related || []), ...inferredNames].map((name) => [normalize(name), name])).values()];
  if (!relatedNames.length) return "";

  const cards = relatedNames.map((name) => ({ card: findCard(name), name }))
    .filter((entry) => entry.card)
    .map(({ card }) => ({ card, rulings: relatedRulings(card, item) }));
  if (!cards.length) return "";

  return `
    <section class="card-section">
      <h3>関連カード・裁定</h3>
      <div class="related-list related-ruling-list">${cards.map(({ card, rulings }) => `
        <div class="related-ruling-card">
          <div class="related-ruling-card__name">${cardReference(card.name)}</div>
          ${rulings.length ? `<div class="related-ruling-card__items">${rulings.map((ruling) => ruling.type === "qa" ? `
            <details class="related-ruling">
              <summary><span class="qa-marker">Q</span><span>${linkedQaText(ruling.question, item.name)}</span></summary>
              <div class="answer"><span>A</span><div class="answer-body">${renderAnswer(ruling.answer, item.name)}</div></div>
            </details>` : `
            <details class="related-ruling related-ruling--overview">
              <summary>${escapeHtml(ruling.label)}内の関連記述</summary>
              <blockquote>${linkedText(ruling.text, item.name)}</blockquote>
            </details>`).join("")}</div>` : `<p class="related-ruling-card__empty">このカードに関連する個別裁定はありません。</p>`}
        </div>`).join("")}</div>
    </section>`;
}

function tagsFor(item) {
  const articleText = articleTextFor(item);
  const autoTags = [];
  if (item.summonRule || /召喚ルール効果|召喚ルールによる特殊召喚/.test(articleText)) autoTags.push("召喚ルール効果");
  if (/手札で発動する誘発効果|手札誘発/.test(articleText)) autoTags.push("手札誘発");
  if (/一連の効果/.test(articleText)) autoTags.push("一連の効果");
  if (/ダメージステップ|ダメステ|DS表/.test(articleText)) autoTags.push("ダメージステップ");
  if (/エンドフェイズ/.test(articleText)) autoTags.push("エンドフェイズの処理");
  if (/暫定回答/.test(articleText)) autoTags.push("暫定回答あり");
  if (/調整中|ジャッジ案件/.test(articleText)) autoTags.push("調整中・ジャッジ案件");
  let baseTags = [];
  if (item.type === "category") baseTags = ["カテゴリ共通効果"];
  if (item.type === "monster") {
    const tags = [...(item.monsterTags || [])].map((tag) => tag === "召喚ルール" ? "召喚ルール効果" : tag);
    if (item.summonRule && !tags.includes("召喚ルール効果")) tags.push("召喚ルール効果");
    if (item.race) tags.push(item.race);
    if (item.attribute) tags.push(item.attribute);
    baseTags = tags;
  }
  if (item.type === "spell") baseTags = item.spellType ? [item.spellType] : ["魔法"];
  if (item.type === "trap") baseTags = item.trapType ? [item.trapType] : ["罠"];
  return [...new Set([...baseTags, ...(item.specialTags || []), ...autoTags])];
}

function tagsPanel(item) {
  const tags = tagsFor(item);
  if (!tags.length) return "";
  return `
    <section class="card-section tag-section">
      <h3>関連タグ</h3>
      <div class="tag-list">${tags.map((tag) => `<span class="tag-chip">#${escapeHtml(tag)}</span>`).join("")}</div>
    </section>`;
}

function inquiryPanel(item) {
  if (item.type === "category") return "";
  return `
    <section class="card-section card-inquiry">
      <button class="card-inquiry__button" type="button" data-card-inquiry="${escapeHtml(item.name)}" disabled>
        このカードについて問い合わせる
      </button>
      <span class="card-inquiry__status">問い合わせ先は準備中です</span>
    </section>`;
}

function damageStepReferencePanel(item) {
  if (item.hideDamageStepReference) return '';
  if (!item.damageStepGuide) return "";

  return `
    <section class="card-section damage-step-reference">
      <h3>ダメージステップ早見表</h3>
      <a class="damage-step-reference__link" href="./damage-step-reference.png" target="_blank" rel="noopener" aria-label="ダメージステップ早見表を拡大表示">
        <img src="./damage-step-reference.png" alt="1103・1209環境 ダメージステップ完全解説マニュアル" loading="lazy">
        <span>タップして拡大表示</span>
      </a>
    </section>`;
}

function supplementalImagesPanel(item) {
  const images = item.supplementalImages || [];
  if (!images.length) return "";

  return `
    <section class="card-section supplemental-images">
      <h3>${escapeHtml(item.supplementalImagesTitle || "参考画像")}</h3>
      <div class="supplemental-images__grid">
        ${images.map((entry, index) => {
          const image = typeof entry === "string" ? { src: entry } : entry;
          const alt = image.alt || `${item.name}の参考画像${index + 1}`;
          const caption = image.caption ? `<span>${escapeHtml(image.caption)}</span>` : "";
          return `
            <button class="supplemental-image" type="button" data-image-src="${escapeHtml(image.src)}" data-image-name="${escapeHtml(alt)}" aria-label="${escapeHtml(alt)}を拡大表示">
              <img src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" loading="lazy">
              ${caption}
            </button>`;
        }).join("")}
      </div>
    </section>`;
}

function overviewImagesPanel(item) {
  const images = item.overviewImages || [];
  if (!images.length) return "";

  return `
    <div class="overview-images">
      ${images.map((entry, index) => {
        const image = typeof entry === "string" ? { src: entry } : entry;
        const alt = image.alt || `${item.name}の概要参考画像${index + 1}`;
        return `
          <button class="supplemental-image" type="button" data-image-src="${escapeHtml(image.src)}" data-image-name="${escapeHtml(alt)}" aria-label="${escapeHtml(alt)}を拡大表示">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" loading="lazy">
            ${image.caption ? `<span>${escapeHtml(image.caption)}</span>` : ""}
          </button>`;
      }).join("")}
    </div>`;
}

function externalArticlesPanel(item) {
  const articles = item.externalArticles || [];
  if (!articles.length) return "";

  return `
    <section class="card-section external-articles">
      <h3>外部記事</h3>
      <div class="external-article-list">
        ${articles.map((article) => `
          <a class="external-article-card" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">
            ${article.image ? `<img src="${escapeHtml(article.image)}" alt="" loading="lazy">` : `<span class="external-article-card__placeholder" aria-hidden="true">ARTICLE</span>`}
            <span class="external-article-card__content">
              <strong>${escapeHtml(article.title)}</strong>
              ${article.description ? `<span>${escapeHtml(article.description)}</span>` : ""}
              <small>${escapeHtml(article.siteName || new URL(article.url).hostname)}</small>
            </span>
          </a>`).join("")}
      </div>
    </section>`;
}

function categoryCoverPanel(item) {
  if (item.cardImages?.length) return `<div class="category-card-images">${item.cardImages.map(image => imagePanel({...item, image})).join('')}</div>`;
  if (!item.coverImage) return "";
  const alt = item.coverImageAlt || `${item.name}のカバー画像`;
  return `
    <button class="category-cover" type="button" data-image-src="${escapeHtml(item.coverImage)}" data-image-name="${escapeHtml(alt)}" aria-label="${escapeHtml(alt)}を拡大表示">
      <img src="${escapeHtml(item.coverImage)}" alt="${escapeHtml(alt)}" loading="lazy">
    </button>`;
}

function overviewManagementIdLine(item) {
  const id = item.overviewManagementId;
  if (!id) return "";
  return `<p class="qa-management-id overview-management-id"><span>管理ID：${escapeHtml(id)}</span>${copyIconButton(`ID: ${id}`, "概要の管理IDをコピー")}</p>`;
}

function convertOverviewToPlainStyle(value) {
  const protectedParts = [];
  let text = String(value || "").replace(/『選び』ます/g, "『選ぶ』");
  text = text.replace(/「[^」]*」|『[^』]*』|《[^》]*》/g, (part) => {
    const token = `\u0000OVERVIEW_PROTECTED_${protectedParts.length}\u0000`;
    protectedParts.push(part);
    return token;
  });
  const fixed = [
    ["ではありませんでした", "ではなかった"], ["じゃありませんでした", "ではなかった"],
    ["ありませんでした", "なかった"], ["できませんでした", "できなかった"],
    ["ではありません", "ではない"], ["じゃありません", "ではない"],
    ["できません", "できない"], ["しません", "しない"], ["行いません", "行わない"],
    ["なりません", "ならない"], ["されません", "されない"], ["られません", "られない"],
    ["ありません", "ない"], ["行われます", "行われる"], ["行います", "行う"],
    ["できました", "できた"], ["できています", "できている"], ["できています", "できている"],
    ["できます", "できる"], ["なります", "なる"], ["あります", "ある"],
    ["されています", "されている"], ["していました", "していた"], ["ています", "ている"],
    ["されます", "される"], ["られます", "られる"], ["します", "する"],
    ["可能です", "可能である"], ["ですので", "であるため"], ["ですが", "だが"],
    ["ですけど", "だが"], ["でした", "であった"], ["でしょう", "だろう"],
    ["してください", "する"], ["ください", "する"]
  ];
  for (const [from, to] of fixed) text = text.replaceAll(from, to);
  text = text.replace(/のです(?=([。、！？\n）)]|$))/g, "のだ");
  text = text.replace(/([ぁ-ん]+)ませんでした/g, (_match, stem) => {
    const negativePast = {い:"わ",き:"か",ぎ:"が",し:"さ",ち:"た",に:"な",び:"ば",み:"ま",り:"ら"};
    if (stem.endsWith("し")) return `${stem.slice(0, -1)}しなかった`;
    const kana = stem.slice(-1);
    return `${negativePast[kana] ? stem.slice(0, -1) + negativePast[kana] : stem}なかった`;
  });
  text = text.replace(/([ぁ-ん]+)ません/g, (_match, stem) => {
    const negative = {い:"わ",き:"か",ぎ:"が",し:"さ",ち:"た",に:"な",び:"ば",み:"ま",り:"ら"};
    if (stem.endsWith("し")) return `${stem.slice(0, -1)}しない`;
    const kana = stem.slice(-1);
    return `${negative[kana] ? stem.slice(0, -1) + negative[kana] : stem}ない`;
  });
  text = text.replace(/([ぁ-ん])ました/g, (_match, kana) => {
    const past = {い:"った",き:"いた",ぎ:"いだ",し:"した",ち:"った",に:"んだ",び:"んだ",み:"んだ",り:"った"};
    return past[kana] || `${kana}た`;
  });
  text = text.replace(/([ぁ-ん])ます/g, (_match, kana) => {
    const plain = {い:"う",き:"く",ぎ:"ぐ",し:"す",ち:"つ",に:"ぬ",び:"ぶ",み:"む",り:"る",え:"える",け:"ける",せ:"せる",て:"てる",ね:"ねる",へ:"へる",め:"める",れ:"れる"};
    return plain[kana] || kana;
  });
  text = text.replace(/ですか(?=([？?。、！？\n）)]|$))/g, "であるか")
    .replace(/です(?=([。、！？\n）)]|$))/g, "である")
    .replace(/いである(?=([。、！？\n）)]|$))/g, "い")
    .replace(/ ([、。，．！？])/g, "$1");
  return text.replace(/\u0000OVERVIEW_PROTECTED_(\d+)\u0000/g, (_match, index) => protectedParts[Number(index)]);
}

function overviewSegments(value) {
  const lines = String(value || "").replace(/\r\n?/g, "\n").split("\n");
  const segments = [];
  let current = { title: null, lines: [] };
  const flush = () => {
    current.lines = current.lines.join("\n").trim();
    if (current.title !== null || current.lines) segments.push(current);
    current = { title: null, lines: [] };
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "－区切り線－" || /^[─━—–－ｰー_=]{3,}$/.test(trimmed)) continue;
    if (/^[■◾◾️]\s*効果補足\s*$/.test(trimmed)) continue;
    const tap = trimmed.match(/^【タップで開く】\s*(.*)$/);
    const heading = trimmed.match(/^【([^】]+)】\s*(.*)$/);
    if (tap || heading) {
      flush();
      current = { title: tap ? (tap[1] || "詳細") : heading[1], lines: [] };
      const remainder = tap ? "" : heading[2];
      if (remainder) current.lines.push(remainder);
    } else {
      current.lines.push(line.trim());
    }
  }
  flush();
  return segments;
}

function renderOverviewBody(value) {
  const text = convertOverviewToPlainStyle(value).replace(/▶/g, "■");
  const lines = text.split("\n");
  const output = [];
  let point = null;
  let headingCount = 0;
  let prose = [];
  const flushPoint = () => {
    if (!point) return;
    const marker = point.marker;
    const section = marker === "■" && headingCount++ > 0 ? " overview-point--section" : "";
    output.push(`<div class="overview-point overview-point--${marker === "▷" ? "sub" : "main"}${section}"><span class="overview-point__marker">${escapeHtml(marker)}</span><span class="overview-point__text">${linkedText(point.lines.join("\n"), null, true)}</span></div>`);
    point = null;
  };
  const flushProse = () => {
    const body = prose.join("\n").trim();
    if (body) output.push(`<div class="overview-prose">${linkedText(body, null, true)}</div>`);
    prose = [];
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushPoint(); flushProse(); continue; }
    const marker = trimmed.match(/^(■|▷|◆|●|★|▼|▽|※|①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|→)\s*(.*)$/);
    if (marker) {
      flushProse();
      flushPoint();
      point = { marker: marker[1], lines: [marker[2]] };
    } else if (point) {
      point.lines.push(trimmed);
    } else {
      prose.push(trimmed);
    }
  }
  flushPoint();
  flushProse();
  return output.join("");
}

function errataNoticePanel(notice) {
  if (!notice) return "";
  return `<aside class="errata-notice" aria-label="エラッタに関する注意">
    <strong class="errata-notice__title"><span aria-hidden="true">⚠</span> エラッタに関する注意</strong>
    <p>${escapeHtml(notice.text)}</p>
    ${notice.detail ? `<p class="errata-notice__detail">▷${escapeHtml(notice.detail)}</p>` : ""}
  </aside>`;
}

function renderOverviewText(value, errataNotice = null) {
  const segments = overviewSegments(value);
  const isBasicHeading = (title) => /^基本情報(?:\s*[＋+]\s*補足)?$/.test(String(title || "").trim());
  const basicIndex = segments.findIndex((segment) => isBasicHeading(segment.title));
  let basicText = "";
  let details = [];
  if (basicIndex >= 0) {
    basicText = [...segments.slice(0, basicIndex).filter((segment) => segment.title === null).map((segment) => segment.lines), segments[basicIndex].lines].filter(Boolean).join("\n");
    details = segments.slice(basicIndex + 1);
  } else if (segments.length && segments[0].title === null) {
    basicText = segments[0].lines;
    details = segments.slice(1);
  } else {
    details = segments;
  }
  if (!basicText && !errataNotice) basicText = "後日追加予定";
  const basic = `<section class="overview-basic"><div class="overview-heading-row"><span class="overview-heading-label"><span class="overview-heading-icon" aria-hidden="true">◆</span><span class="overview-heading-text">基本情報 ＋ 補足</span></span></div><div class="overview-basic__body">${errataNoticePanel(errataNotice)}${renderOverviewBody(basicText)}</div></section>`;
  const folded = details.filter((segment) => !isBasicHeading(segment.title)).map((segment) => `
    <details class="overview-disclosure">
      <summary><span class="overview-heading-icon" aria-hidden="true">◆</span><span class="overview-heading-text">${escapeHtml(segment.title || "詳細")}</span></summary>
      <div class="overview-disclosure__body">${renderOverviewBody(segment.lines)}</div>
    </details>`).join("");
  return `${basic}${folded}`;
}

function overviewPanel(item) {
  const text = item.overview || item.summary || "";
  if (!text) return "";
  return `
    <section class="card-section overview-section">
      <h3>概要</h3>
      <blockquote class="overview-copy">${renderOverviewText(text, item.errataNotice)}</blockquote>
      ${overviewManagementIdLine(item)}
      ${overviewImagesPanel(item)}
    </section>`;
}

function qaSearchableText(item) {
  return (item.qa || []).filter(entry => environmentMatches(qaEnvironments(entry, item))).flatMap((entry) => [entry.question, entry.answer, entry.managementId, entry.difficult ? "難解" : ""]).join(" ");
}

// Search strings are large; normalize them once instead of rebuilding them on every keystroke.
const rulingSearchIndex = new WeakMap();
let indexedEnvironmentMode = null;
function rebuildEnvironmentSearchIndex() {
for (const item of allRulings) {
  rulingSearchIndex.set(item, {
    all: expandSearchText(searchableText(item)),
    name: normalize(item.name),
    reading: normalize(item.reading),
    qa: expandSearchText(qaSearchableText(item)),
    qaEntries: new Map(orderedQa(item).map(entry => [entry, expandSearchText([item.name, item.reading, entry.question, entry.answer, ...(entry.tags || [])].join(" "))])),
    overview: expandSearchText([item.name, item.reading, item.overview, item.summary, ...(item.details || [])].join(" "))
  });
}
indexedEnvironmentMode = environmentMode;
}

let searchRenderTimer = 0;
function scheduleSearchRender(delay = 140) {
  window.clearTimeout(searchRenderTimer);
  searchRenderTimer = window.setTimeout(() => {
    searchRenderTimer = 0;
    render();
  }, delay);
}

function renderCardBody(item) {
  if (activeQaSearchItem === item && activeQaSearchId) {
    return `<div class="full-width-content id-search-qa-only">${qaPanel(item)}</div>`;
  }
  const content = item.type === "category"
    ? `
        <div class="category-overview">
          ${categoryCoverPanel(item)}
          ${overviewPanel(item)}
        </div>`
    : `
        <div class="card-profile">
          <div class="image-column${item.imageVariants?.length ? " image-column--variants" : ""}">${imagePanel(item)}</div>
          ${overviewPanel(item)}
        </div>`;

  return `${content}
    <div class="full-width-content">
      ${damageStepReferencePanel(item)}
      ${supplementalImagesPanel(item)}
      ${qaPanel(item)}
      ${relatedPanel(item)}
      ${externalArticlesPanel(item)}
      ${tagsPanel(item)}
      ${inquiryPanel(item)}
    </div>`;
}

function qaSearchPreviews(item) {
  const tokens = searchTokens(searchInput.value);
  if (referencedCardName || !tokens.length || nameMatchesTokens(item, tokens)) return '';
  const matches = matchingQa(item, tokens);
  if (!matches.length) return '';
  return `<div class="qa-search-previews" aria-label="検索に該当するQ&A">${matches.map(entry => `<button class="qa-search-preview" type="button" data-qa-jump="${escapeHtml(entry.managementId)}"><span>Q ${searchSnippet(cleanQaText(entry.question), tokens)}</span><small>回答：${searchSnippet(cleanQaText(entry.answer), tokens)}</small><strong>このQ&Aを開く →</strong></button>`).join('')}</div>`;
}

function renderCard(item, index) {
  const longTitleModifier = [...String(item.name || "")].length >= 15 ? " card-name--long" : "";
  const titleModifier = normalize(item.name) === normalize("未来融合－フューチャー・フュージョン")
    ? " card-name--future-fusion"
    : "";
  return `
    <article class="ruling-card" data-card-name="${escapeHtml(item.name)}">
      <button class="ruling-toggle" type="button" aria-expanded="false" aria-controls="ruling-${index}">
        ${typeBadge(item)}
        <span class="card-name${titleModifier}${longTitleModifier}">${cardTitle(item)}</span>
        ${effectIcon(item)}
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
      ${qaSearchPreviews(item)}
      <div id="ruling-${index}" class="ruling-body" data-card-name="${escapeHtml(item.name)}" hidden></div>
    </article>`;
}

function populateCardBody(body) {
  if (body.dataset.loaded === "true") return;
  const item = findCard(body.dataset.cardName);
  if (!item) return;
  body.innerHTML = renderCardBody(item);
  body.dataset.loaded = "true";
}

function syncBackToCardButton() {
  if (backToCardButton) backToCardButton.hidden = cardNavigationStack.length === 0;
}

function clearCardNavigation() {
  referencedCardName = null;
  if (location.hash.startsWith('#card=')) history.replaceState(null, '', `${location.pathname}${location.search}`);
  cardNavigationStack.length = 0;
  syncBackToCardButton();
}

function goBackToCard() {
  const previous = cardNavigationStack.pop();
  if (!previous) return;
  currentFilter = previous.filter;
  referencedCardName = previous.reference;
  searchInput.value = previous.query;
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === currentFilter));
  render();
  const hash = previous.cardName ? `#card=${encodeURIComponent(previous.cardName)}` : "";
  history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
  syncBackToCardButton();
  requestAnimationFrame(() => {
    for (const saved of previous.openCards || []) {
      const article = [...list.querySelectorAll('.ruling-card')].find(item => item.dataset.cardName === saved.name);
      if (!article) continue;
      const toggle = article.querySelector(".ruling-toggle");
      const body = document.getElementById(toggle.getAttribute("aria-controls"));
      populateCardBody(body);
      toggle.setAttribute("aria-expanded", "true");
      body.hidden = false;
      body.querySelectorAll('details').forEach((detail, index) => { detail.open = saved.details.includes(index); });
    }
    window.scrollTo({ top: previous.scrollY, behavior: "auto" });
  });
}

function advancedFilterMatches(item) {
  for (const group of filterGroups) {
    const selected = advancedSelections.get(group.id);
    if (!selected?.size) continue;
    const values = ['rulingTerms', 'monsterTags', 'otherTags'].includes(group.id) ? filterTagsFor(item) : [item[group.id]].filter(Boolean);
    if (!values.some(value => selected.has(value))) return false;
  }
  return true;
}

function buildAdvancedFilters() {
  advancedFilters.innerHTML = filterGroups.map(group => `
    <details class="filter-section filter-section--${group.id}">
      <summary>${escapeHtml(group.label)} <span class="selection-summary" data-group-summary="${group.id}">指定なし</span></summary>
      <fieldset class="advanced-filter-group"><legend class="visually-hidden">${escapeHtml(group.label)}</legend>
      <p class="filter-help">複数選択時は、いずれかに該当するカードを表示します。</p>
      <div class="advanced-filter-options">${group.options.map((option, index) => {
        const id = `filter-${group.id}-${index}`;
        const term = searchConfig.terms.find(term => term.label === option);
        return `<div class="filter-option"><input id="${id}" type="checkbox" data-filter-group="${group.id}" value="${escapeHtml(option)}" aria-label="${escapeHtml(option)}で絞り込む">${term
          ? `<button type="button" class="term-help" aria-expanded="false" aria-controls="${id}-help">${escapeHtml(option)} <span aria-hidden="true">ⓘ</span></button><span id="${id}-help" class="term-tooltip" role="tooltip" hidden>${escapeHtml(term.description || '説明準備中です。')}</span>`
          : `<label for="${id}">${escapeHtml(option)}${effectIcon({spellType: group.id === 'spellType' ? option : '', trapType: group.id === 'trapType' ? option : ''})}</label>`}</div>`;
      }).join('')}</div></fieldset>
    </details>`).join('');
}

function resetAdvancedFilters() {
  advancedSelections.clear();
  advancedPanel.querySelectorAll("input[type='checkbox']").forEach(input => { input.checked = false; });
  setEnvironmentMode('all');
}

function goHome() {
  clearCardNavigation();
  searchInput.value = "";
  currentFilter = "all";
  resetAdvancedFilters();
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  advancedToggle.setAttribute("aria-expanded", "false");
  advancedPanel.hidden = true;
  if (!siteMenu.hidden) {
    siteMenu.hidden = true;
    document.body.classList.remove("menu-open");
  }
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openMenu(page = "about") {
  const content = sitePages[page] || sitePages.about;
  menuPageTitle.textContent = content.title;
  menuPageBody.textContent = content.body;
  siteMenu.hidden = false;
  document.body.classList.add("menu-open");
  siteMenu.querySelectorAll("[data-menu-page]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.menuPage === page);
  });
  menuClose.focus();
}

function closeMenu() {
  siteMenu.hidden = true;
  document.body.classList.remove("menu-open");
  menuButton.focus();
}

function firstCardEnvironment(item) {
  return ['1103', '1209', '1402'].find(env => (item.environments || ['1103']).includes(env)) || '1103';
}

function newRulingsFor(item, environment) {
  return (item.qa || []).filter(entry => {
    const marked = [...(entry.newInEnvironments || []), ...(searchConfig.newRulings?.[entry.managementId] || []), ...(entry.environments || [])];
    return marked.includes(environment);
  });
}

function existingNewRulingGroups(tokens, directIdMatch) {
  if (!environmentMode.endsWith('-only')) return [];
  const environment = environmentMode.split('-')[0];
  const rank = { '1103': 0, '1209': 1, '1402': 2 };
  return allRulings.flatMap(item => {
    if (rank[firstCardEnvironment(item)] >= rank[environment]) return [];
    if (currentFilter !== 'all' && item.type !== currentFilter) return [];
    if (directIdMatch && directIdMatch.item !== item) return [];
    const entries = newRulingsFor(item, environment).filter(entry => {
      if (directIdMatch?.entry && directIdMatch.entry !== entry) return false;
      if (activeDifficultSearch && !entry.difficult) return false;
      if (!tokens.length) return true;
      const text = expandSearchText([item.name, item.reading, entry.question, entry.answer, entry.managementId, entry.difficult ? '難解' : ''].join(' '));
      return tokens.every(token => text.includes(token));
    });
    if (!entries.length) return [];
    // Restrict Q&A tags to the entries that will actually be shown in this section.
    const scoped = { ...item, qa: entries.map(entry => ({ ...entry, environments: [environment] })) };
    if (!advancedFilterMatches(scoped)) return [];
    return [{ item, entries }];
  });
}

function renderExistingNewRulings(groups) {
  if (!environmentMode.endsWith('-only')) return '';
  const environment = environmentMode.split('-')[0];
  return `<section class="existing-rulings-section" aria-labelledby="existing-rulings-title">
    <h3 id="existing-rulings-title" class="row-section__title">既存カードの新規裁定 <small>${environment}環境</small></h3>
    ${groups.length ? groups.map(({item, entries}, index) => `
      <article class="ruling-card existing-ruling" data-card-name="${escapeHtml(item.name)}">
        <button class="ruling-toggle" type="button" aria-expanded="true" aria-controls="existing-ruling-${index}">
          ${typeBadge(item)}<span class="card-name">${cardTitle(item)}</span>${effectIcon(item)}<span class="chevron" aria-hidden="true">⌄</span>
        </button>
        <div id="existing-ruling-${index}" class="ruling-body" data-loaded="true" data-card-name="${escapeHtml(item.name)}">${qaPanel(item, entries)}</div>
      </article>`).join('') : '<p class="existing-rulings-empty">この表示条件に該当する新規裁定は、まだ登録されていません。</p>'}
  </section>`;
}

function render() {
  syncFilterSummary();
  if (indexedEnvironmentMode !== environmentMode) rebuildEnvironmentSearchIndex();
  window.clearTimeout(searchRenderTimer);
  searchRenderTimer = 0;
  if (referencedCardName) {
    activeQaSearchItem = null;
    activeQaSearchId = null;
    activeDifficultSearch = false;
    rowNavigation.hidden = true;
    emptyState.hidden = true;
    const target = findCard(referencedCardName);
    count.textContent = target ? 'カード参照中' : '未掲載';
    const outside = target && !environmentMatches(target.environments);
    list.innerHTML = `<div class="reference-notice" role="status">${outside ? `このカードは選択中の${escapeHtml(environmentMode.split('-')[0])}環境${environmentMode.endsWith('-only') ? '（新規のみ）' : ''}の表示対象外です。参考として表示しています。` : '選択中の環境を維持してカードを参照しています。'}<button type="button" data-reference-back>元の裁定へ戻る</button></div>` + (target ? renderCard(target, 'reference') : '<p>このカードは未掲載です。</p>');
    return;
  }
  const tokens = searchTokens(searchInput.value);
  const query = tokens.join('');
  const directIdMatch = directManagementIdQuery(searchInput.value);
  activeDifficultSearch = query === normalize("難解");
  activeQaSearchItem = directIdMatch?.entry ? directIdMatch.item : null;
  activeQaSearchId = directIdMatch?.entry ? normalizedManagementId(directIdMatch.entry.managementId) : null;
  const items = allRulings.filter((item) => {
    const typeMatches = currentFilter === "all" || item.type === currentFilter;
    const environmentMatchesItem = environmentMode.endsWith('-only')
      ? firstCardEnvironment(item) === environmentMode.split('-')[0]
      : environmentMatches(item.environments);
    const haystack = rulingSearchIndex.get(item).all;
    return typeMatches && environmentMatchesItem && advancedFilterMatches(item)
      && (!directIdMatch || item === directIdMatch.item)
      && (!directIdMatch?.entry || environmentMatches(qaEnvironments(directIdMatch.entry, item)))
      && (!tokens.length || matchesSearch(item, tokens));
  });

  const existingGroups = existingNewRulingGroups(tokens, directIdMatch);
  const existingCount = existingGroups.reduce((total, group) => total + group.entries.length, 0);
  const existingHtml = renderExistingNewRulings(existingGroups);
  count.textContent = `${items.length}件${existingCount ? ` ＋ 既存カードの新規裁定 ${existingCount}件` : ''}`;
  document.querySelector('#showResults').textContent = `${items.length + existingCount}件の結果を見る`;
  emptyState.hidden = items.length + existingCount !== 0;

  if (!query) {
    renderKanaNavigation(items);
    let rowCardIndex = 0;
    list.innerHTML = kanaRows.map((row) => {
      const rowItems = items.filter((item) => kanaRowFor(item)?.id === row.id);
      if (!rowItems.length) return "";
      return `<section id="row-${row.id}" class="row-section" aria-labelledby="row-title-${row.id}">
        <h3 id="row-title-${row.id}" class="row-section__title">${row.label}</h3>
        <div class="row-section__cards">${rowItems.map((item) => renderCard(item, rowCardIndex++)).join("")}</div>
      </section>`;
    }).join("") + existingHtml;
    return;
  }

  rowNavigation.hidden = true;

  const nameMatches = items
    .filter((item) => tokens.every(token => rulingSearchIndex.get(item).name.includes(token)))
    .sort((a, b) => {
      const aExact = rulingSearchIndex.get(a).name === query;
      const bExact = rulingSearchIndex.get(b).name === query;
      if (aExact !== bExact) return bExact - aExact;
      return a.name.localeCompare(b.name, "ja");
    });
  const nameSet = new Set(nameMatches);
  const readingMatches = items.filter((item) =>
    !nameSet.has(item) && tokens.every(token => rulingSearchIndex.get(item).reading.includes(token))
  );
  const readingSet = new Set(readingMatches);
  const qaMatches = items.filter((item) =>
    !nameSet.has(item) && !readingSet.has(item) && matchingQa(item, tokens).length > 0
  );
  const groupedSet = new Set([...nameMatches, ...readingMatches, ...qaMatches]);
  const otherMatches = items.filter((item) => !groupedSet.has(item));

  let cardIndex = 0;
  const groups = [
    { title: "カード名に該当", items: nameMatches },
    { title: "読みがなに該当", items: readingMatches },
    { title: "Q&Aに該当カードあり", items: qaMatches },
    { title: "その他の該当カード", items: otherMatches }
  ];

  list.innerHTML = groups
    .filter((group) => group.items.length)
    .map((group) => `
      <section class="search-group">
        <h3 class="search-group__title">${group.title}<span>${group.items.length}件</span></h3>
        <div class="search-group__cards">
          ${group.items.map((item) => renderCard(item, cardIndex++)).join("")}
        </div>
      </section>`)
    .join("") + existingHtml;
}

list.addEventListener("click", async (event) => {
  if (event.target.closest('[data-reference-back]')) {
    if (cardNavigationStack.length) goBackToCard(); else goHome();
    return;
  }
  const qaJump = event.target.closest('[data-qa-jump]');
  if (qaJump) {
    const article = qaJump.closest('.ruling-card');
    const toggle = article.querySelector('.ruling-toggle');
    const body = article.querySelector('.ruling-body');
    populateCardBody(body);
    body.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    const qa = [...body.querySelectorAll('[data-qa-id]')].find(el => el.dataset.qaId === qaJump.dataset.qaJump);
    if (qa) { qa.open = true; qa.scrollIntoView({behavior:'smooth', block:'start'}); qa.querySelector('summary').focus({preventScroll:true}); }
    return;
  }
  const copyButton = event.target.closest("[data-copy-text]");
  if (copyButton) {
    event.preventDefault();
    event.stopPropagation();
    const copyText = copyButton.dataset.copyText;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
        copied = true;
      }
    } catch (_error) {
      copied = false;
    }
    if (!copied) {
      const helper = document.createElement("textarea");
      helper.value = copyText;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.select();
      try { copied = document.execCommand("copy"); } catch (_error) { copied = false; }
      helper.remove();
    }
    const originalLabel = copyButton.getAttribute("aria-label") || "コピー";
    copyButton.setAttribute("aria-label", copied ? "コピーしました" : "コピーできませんでした");
    copyButton.title = copied ? "コピーしました" : "コピーできませんでした";
    copyButton.classList.toggle("is-copied", copied);
    window.setTimeout(() => {
      if (copyButton.isConnected) {
        copyButton.setAttribute("aria-label", originalLabel);
        copyButton.title = originalLabel;
        copyButton.classList.remove("is-copied");
      }
    }, 1600);
    return;
  }
  const imageButton = event.target.closest("[data-image-src]");
  if (imageButton) {
    openLightbox(imageButton.dataset.imageSrc, imageButton.dataset.imageName);
    return;
  }
  const cardLink = event.target.closest("[data-card]");
  if (cardLink) {
    event.preventDefault();
    const sourceCardName = cardLink.closest(".ruling-card")?.dataset.cardName || "";
    navigateToCard(cardLink.dataset.card, sourceCardName);
    return;
  }
  const button = event.target.closest(".ruling-toggle");
  if (!button) return;
  const body = document.getElementById(button.getAttribute("aria-controls"));
  const open = button.getAttribute("aria-expanded") === "true";
  if (!open) populateCardBody(body);
  button.setAttribute("aria-expanded", String(!open));
  body.hidden = open;
});

rowNavigation.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#row-']");
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  advancedPanel.hidden = true;
  advancedToggle.setAttribute('aria-expanded', 'false');
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

function openLightbox(src, name) {
  lightboxImage.src = src;
  lightboxImage.alt = `《${name}》の拡大カード画像`;
  imageLightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  imageLightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.classList.remove("lightbox-open");
}

lightboxClose.addEventListener("click", closeLightbox);
imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageLightbox.hidden) closeLightbox();
  if (event.key === "Escape" && !siteMenu.hidden) closeMenu();
});

function navigateToCard(name, sourceCardName = "") {
  if (sourceCardName && normalize(sourceCardName) === normalize(name)) return;
  if (normalize(sourceCardName) !== normalize(name)) {
    cardNavigationStack.push({
      reference: referencedCardName,
      openCards: [...list.querySelectorAll('.ruling-card')].filter(article => !article.querySelector('.ruling-body').hidden).map(article => ({name: article.dataset.cardName, details: [...article.querySelectorAll('.ruling-body details')].flatMap((el,i) => el.open ? [i] : [])})),
      cardName: sourceCardName,
      query: searchInput.value,
      filter: currentFilter,
      scrollY: window.scrollY
    });
  }
  syncBackToCardButton();
  const target = findCard(name);
  referencedCardName = target?.name || name;
  render();
  history.replaceState(null, "", `#card=${encodeURIComponent(name)}`);
  requestAnimationFrame(() => {
    if (referencedCardName !== (target?.name || name)) return;
    const article = [...list.querySelectorAll('.ruling-card')].find(el => el.dataset.cardName === target?.name);
    const button = article?.querySelector(".ruling-toggle");
    if (!button) return;
    const body = document.getElementById(button.getAttribute("aria-controls"));
    populateCardBody(body);
    button.setAttribute("aria-expanded", "true");
    body.hidden = false;
    article.previousElementSibling?.classList.contains('reference-notice')
      ? article.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' })
      : button.scrollIntoView({ behavior: 'smooth', block: 'start' });
    button.focus({preventScroll:true});
  });
}

async function shareSite() {
  const siteUrl = new URL(location.href);
  siteUrl.search = "";
  siteUrl.hash = "";
  const url = siteUrl.toString();
  const shareData = { title: document.title, text: "遊戯王 GB 裁定アーカイブ", url };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "共有メニューを開きました。";
      return;
    }
    await navigator.clipboard.writeText(url);
    shareStatus.textContent = "共有リンクをコピーしました。";
  } catch (error) {
    if (error?.name === "AbortError") return;
    const helper = document.createElement("textarea");
    helper.value = url;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (_error) { copied = false; }
    helper.remove();
    shareStatus.textContent = copied ? "共有リンクをコピーしました。" : "共有リンクをコピーできませんでした。";
  }
}

searchInput.addEventListener("input", (event) => {
  clearCardNavigation();
  if (event.isComposing) return;
  scheduleSearchRender();
});
searchInput.addEventListener("compositionend", () => scheduleSearchRender(80));
clearButton.addEventListener("click", () => {
  clearCardNavigation();
  searchInput.value = "";
  searchInput.focus();
  render();
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  clearCardNavigation();
  currentFilter = button.dataset.filter;
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item === button));
  render();
});

resetButton.addEventListener("click", () => {
  clearCardNavigation();
  searchInput.value = "";
  currentFilter = "all";
  resetAdvancedFilters();
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  render();
});

advancedToggle.addEventListener("click", () => {
  const open = advancedToggle.getAttribute("aria-expanded") === "true";
  advancedToggle.setAttribute("aria-expanded", String(!open));
  advancedPanel.hidden = open;
});

document.querySelector(".search-panel").addEventListener("change", (event) => {
  const input = event.target.closest("input[type='checkbox'], input[name='environmentMode']");
  if (!input) return;
  clearCardNavigation();

  if (input.closest(".environment-filter")) {
    setEnvironmentMode(input.value);
    document.querySelector("#formatPicker").open = false;
    document.querySelector("#formatPicker summary").focus();
  } else {
    const groupId = input.dataset.filterGroup;
    if (!advancedSelections.has(groupId)) advancedSelections.set(groupId, new Set());
    const selection = advancedSelections.get(groupId);
    if (input.checked) selection.add(input.value);
    else selection.delete(input.value);
  }
  render();
});

menuButton.addEventListener("click", () => openMenu("about"));
shareButton.addEventListener("click", shareSite);
homeButton.addEventListener("click", goHome);
backToTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
backToCardButton?.addEventListener("click", goBackToCard);
menuClose.addEventListener("click", closeMenu);
siteMenu.addEventListener("click", (event) => {
  if (event.target.closest("[data-menu-close]")) {
    closeMenu();
    return;
  }
  const pageButton = event.target.closest("[data-menu-page]");
  if (!pageButton) return;
  openMenu(pageButton.dataset.menuPage);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
iosTip.hidden = !(isIos && !isStandaloneDisplay);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      await registration.update();
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) registration.update().catch(() => {});
      });
    } catch (_) { /* Offline use continues with the installed worker. */ }
  });
}

// This is deliberately separate from card-name identity normalization.
function searchTokens(value) {
  return [...String(value || '').normalize('NFKC').matchAll(/"([^"]+)"|([^\s]+)/g)]
    .map(match => {
      let token = normalize(match[1] || match[2]);
      for (const [alias, full] of Object.entries(searchConfig.aliases)) token = token.replaceAll(normalize(alias), normalize(full));
      return token;
    }).filter(Boolean);
}

function expandSearchText(value) {
  let text = normalize(value);
  for (const [alias, full] of Object.entries(searchConfig.aliases)) text = text.replaceAll(normalize(alias), normalize(full));
  // Add the registered reading of mentioned cards, including references in Q&A.
  if (!expandSearchText.names) {
    const names = new Map();
    for (const card of allRulings) {
      const name = normalize(card.name), reading = normalize(card.reading);
      if (name && reading) { names.set(name, name + ' ' + reading); names.set(reading, name + ' ' + reading); }
    }
    expandSearchText.names = names;
    expandSearchText.pattern = new RegExp([...names.keys()].sort((a,b) => b.length-a.length).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  }
  const additions = new Set();
  for (const match of text.matchAll(expandSearchText.pattern)) additions.add(expandSearchText.names.get(match[0]));
  return [text, ...additions].join(' ');
}

function nameMatchesTokens(item, tokens) {
  return tokens.every(token => normalize(item.name).includes(token) || normalize(item.reading).includes(token));
}

function matchingQa(item, tokens) {
  const indexed = rulingSearchIndex.get(item);
  return orderedQa(item).filter(entry => {
    const text = indexed?.qaEntries.get(entry) || expandSearchText([item.name, item.reading, entry.question, entry.answer].join(' '));
    return tokens.every(token => text.includes(token));
  });
}

function matchesSearch(item, tokens) {
  const indexed = rulingSearchIndex.get(item);
  if (nameMatchesTokens(item, tokens)) return true;
  // Multiple terms must occur in one Q&A (including its owning card) or overview.
  // Never combine unrelated Q&As into a false A+B match.
  if (tokens.length > 1) return matchingQa(item, tokens).length > 0 || tokens.every(token => indexed.overview.includes(token));
  return tokens.every(token => indexed.all.includes(token));
}

function searchSnippet(value, tokens) {
  const text = String(value || '').replace(/\s+/g, ' ');
  let flat = '';
  const positions = [];
  for (let i = 0; i < text.length; i++) {
    const chars = normalize(text[i]);
    flat += chars;
    for (let j = 0; j < chars.length; j++) positions.push(i);
  }
  const needles = new Set(tokens);
  for (const [alias, full] of Object.entries(searchConfig.aliases)) {
    if (tokens.some(token => normalize(full).includes(token))) needles.add(normalize(alias));
  }
  for (const card of allRulings) {
    if (tokens.some(token => normalize(card.reading).includes(token))) needles.add(normalize(card.name));
  }
  const spans = [];
  for (const needle of needles) {
    if (!needle) continue;
    for (let at = flat.indexOf(needle); at >= 0; at = flat.indexOf(needle, at + needle.length)) {
      spans.push([positions[at], positions[at + needle.length - 1] + 1]);
    }
  }
  spans.sort((a,b) => a[0] - b[0]);
  const start = Math.max(0, (spans[0]?.[0] || 0) - 30), end = Math.min(text.length, start + 150);
  const merged = [];
  for (const [from,to] of spans) {
    if (to <= start || from >= end) continue;
    const last = merged.at(-1);
    if (last && from <= last[1]) last[1] = Math.max(last[1], Math.min(end,to));
    else merged.push([Math.max(start,from),Math.min(end,to)]);
  }
  let out = start ? '…' : '', cursor = start;
  for (const [from,to] of merged) {
    out += escapeHtml(text.slice(cursor,from)) + '<mark>' + escapeHtml(text.slice(from,to)) + '</mark>';
    cursor = to;
  }
  return out + escapeHtml(text.slice(cursor,end)) + (end < text.length ? '…' : '');
}

function filterTagsFor(item) {
  const tags = new Set([...tagsFor(item), ...(item.tags || []), ...(item.rulingTags || []), ...(searchConfig.cardTags[item.name] || [])]);
  if (item.errataNotice) tags.add('エラッタ');
  for (const entry of orderedQa(item)) {
    for (const tag of [...(entry.tags || []), ...(entry.specialTags || []), ...(searchConfig.qaTags[entry.managementId] || [])]) tags.add(tag);
    if (entry.judgeConfirmation) tags.add('ジャッジ確認案件');
  }
  for (const term of searchConfig.terms) {
    if ((term.aliases || []).some(alias => tags.has(alias))) tags.add(term.label);
  }
  // 難解検索は明示的な難解登録で判定する。本文や検索タグからは推測しない。
  tags.delete('難解な裁定・暫定回答');
  tags.delete('難解な裁定');
  // ブラック・ガーデンは整理後に難解登録する予定のため、検索対象として維持する。
  if (orderedQa(item).some(entry => entry.difficult) || item.name === 'ブラック・ガーデン') tags.add('難解な裁定');
  if (tags.has('調整中・ジャッジ案件')) tags.add('ジャッジ確認案件');
  return [...tags];
}

function syncFilterSummary() {
  filters.querySelectorAll('.filter').forEach(button => {
    const selected = button.dataset.filter === currentFilter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const chips = [];
  if (currentFilter !== 'all') chips.push(`<button type="button" data-clear-type>${escapeHtml(typeLabels[currentFilter])} ×</button>`);
  if (environmentMode !== 'all') chips.push(`<button type="button" data-clear-environment>${escapeHtml(environmentNames[environmentMode])} ×</button>`);
  for (const group of filterGroups) {
    const selected = advancedSelections.get(group.id) || new Set();
    const summary = document.querySelector(`[data-group-summary="${group.id}"]`);
    if (summary) summary.textContent = selected.size ? `${selected.size}件選択` : '指定なし';
    for (const value of selected) chips.push(`<button type="button" data-clear-group="${group.id}" data-clear-value="${escapeHtml(value)}">${escapeHtml(value)} ×</button>`);
  }
  const active = document.querySelector('#activeConditions');
  active.innerHTML = chips.join('');
  active.hidden = !chips.length;
}

function clearConditions() {
  clearCardNavigation();
  currentFilter = 'all';
  resetAdvancedFilters();
  render();
}

document.querySelector('#clearConditions').addEventListener('click', clearConditions);
document.querySelector('#showResults').addEventListener('click', () => {
  advancedPanel.hidden = true;
  advancedToggle.setAttribute('aria-expanded', 'false');
  document.querySelector('.result-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
  advancedToggle.focus({ preventScroll: true });
});
document.querySelector('#activeConditions').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  clearCardNavigation();
  if (button.hasAttribute('data-clear-type')) currentFilter = 'all';
  if (button.hasAttribute('data-clear-environment')) setEnvironmentMode('all');
  if (button.dataset.clearGroup) {
    advancedSelections.get(button.dataset.clearGroup)?.delete(button.dataset.clearValue);
    advancedPanel.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = advancedSelections.get(input.dataset.filterGroup)?.has(input.value) || false;
    });
  }
  render();
});

let activeTermButton = null;
let pinnedTermButton = null;
function closeTermHelp() {
  if (!activeTermButton) return;
  document.getElementById(activeTermButton.getAttribute('aria-controls')).hidden = true;
  activeTermButton.setAttribute('aria-expanded', 'false');
  activeTermButton = pinnedTermButton = null;
}
function openTermHelp(button) {
  if (activeTermButton !== button) closeTermHelp();
  activeTermButton = button;
  const tip = document.getElementById(button.getAttribute('aria-controls'));
  tip.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  const box = button.getBoundingClientRect();
  const width = Math.min(300, window.innerWidth - 24);
  tip.style.width = `${width}px`;
  tip.style.left = `${Math.max(12, Math.min(box.left, window.innerWidth - width - 12))}px`;
  tip.style.top = `${Math.max(8, Math.min(box.bottom + 6, window.innerHeight - tip.offsetHeight - 12))}px`;
}
advancedFilters.addEventListener('click', event => {
  const button = event.target.closest('.term-help');
  if (!button) return;
  if (pinnedTermButton === button) closeTermHelp();
  else { openTermHelp(button); pinnedTermButton = button; }
});
advancedFilters.addEventListener('pointerover', event => {
  if (event.pointerType !== 'mouse') return;
  const button = event.target.closest('.term-help');
  if (button && !pinnedTermButton) openTermHelp(button);
});
advancedFilters.addEventListener('pointerout', event => {
  if (pinnedTermButton || !activeTermButton) return;
  if (!event.target.closest('.filter-option')?.contains(event.relatedTarget)) closeTermHelp();
});
advancedFilters.addEventListener('focusin', event => {
  const button = event.target.closest('.term-help');
  if (button) openTermHelp(button);
});
advancedFilters.addEventListener('focusout', event => {
  if (!event.target.closest('.filter-option')?.contains(event.relatedTarget)) closeTermHelp();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.term-help, .term-tooltip')) closeTermHelp();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeTermHelp(); });
window.addEventListener('resize', closeTermHelp);
window.addEventListener('scroll', closeTermHelp, { passive: true });

setEnvironmentMode(environmentMode);
buildAdvancedFilters();
render();
if (location.hash.startsWith('#card=')) {
  try { navigateToCard(decodeURIComponent(location.hash.slice(6))); } catch (_) { /* Ignore malformed external fragments. */ }
}

// Keep sharing available in browsers and installed PWAs alike.
shareButton.hidden = false;
document.querySelector('#formatPicker').addEventListener('click', event => {
  if (event.target.matches('input[name="environmentMode"]')) {
    document.querySelector('#formatPicker').open = false;
    document.querySelector('#formatPicker summary').focus();
  }
});
