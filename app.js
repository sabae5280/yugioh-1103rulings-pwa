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
let deferredPrompt = null;
const selectedEnvironments = new Set(["1103"]);
const advancedSelections = new Map();
const cardNavigationStack = [];
const backToCardButton = document.querySelector("#backToCard");

const isStandaloneDisplay = (typeof window.matchMedia === "function" && (
  window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches
)) || navigator.standalone === true;
document.documentElement.classList.toggle("is-standalone", Boolean(isStandaloneDisplay));

const typeLabels = { monster: "モンスター", spell: "魔法", trap: "罠", category: "共通効果" };
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

const filterGroups = [
  {
    id: "monsterTags",
    label: "モンスター分類",
    options: ["通常モンスター", "効果モンスター", "リバース効果", "チューナー", "儀式", "融合", "シンクロ", "エクシーズ", "トゥーン", "スピリット", "ユニオン", "デュアル", "召喚ルール効果", "手札誘発"]
  },
  {
    id: "race",
    label: "種族",
    options: ["獣戦士族", "海竜族", "岩石族", "植物族", "幻神獣族", "創造神族", "アンデット族", "恐竜族", "爬虫類族", "魚族", "天使族", "悪魔族", "サイキック族", "ドラゴン族", "魔法使い族", "戦士族", "鳥獣族", "炎族", "獣族", "機械族", "昆虫族", "雷族", "水族"]
  },
  {
    id: "attribute",
    label: "属性",
    options: ["闇属性", "光属性", "地属性", "水属性", "炎属性", "風属性", "神属性"]
  },
  {
    id: "spellType",
    label: "魔法分類",
    options: ["通常魔法", "速攻魔法", "装備魔法", "永続魔法", "フィールド魔法", "儀式魔法"]
  },
  {
    id: "trapType",
    label: "罠分類",
    options: ["通常罠", "永続罠", "カウンター罠"]
  },
  {
    id: "otherTags",
    label: "その他",
    options: ["一連の効果", "暫定回答あり", "調整中・ジャッジ案件"]
  }
];

const sitePages = {
  about: { title: "このサイトについて", body: "現在準備中です。" },
  guide: { title: "使い方", body: "現在準備中です。" },
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

function enrichItem(item) {
  const metadata = window.CARD_METADATA?.[item.name] || {};
  const enriched = {
    ...metadata,
    ...item,
    reading: item.reading || window.CARD_READINGS?.[item.name] || metadata.reading || "",
    environments: item.environments || metadata.environments || ["1103"],
    monsterTags: item.monsterTags || metadata.monsterTags || []
  };
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
  return hiragana.replace(/[\s・･－―—–ー_＿《》「」『』【】]/g, "");
}

// 裁定文中の《カード名》を拾い、参照先と参照元の両方に関連リンクを作る。
const relatedCardsByName = new Map(allRulings.map((item) => [normalize(item.name), new Map()]));
function addRelatedPair(source, targetName) {
  const target = allRulings.find((candidate) => normalize(candidate.name) === normalize(targetName));
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
  const qaText = (item.qa || []).flatMap((entry) => [entry.question, entry.answer, entry.managementId]);
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
  return allRulings.find((item) => normalize(item.name) === target);
}

function cardReference(name, displayName = `《${name}》`) {
  const target = findCard(name);
  const label = escapeHtml(displayName);
  if (!target) return `<span class="card-reference is-pending" title="カードページ準備中">${label}</span>`;
  return `<a class="card-reference" href="#card=${encodeURIComponent(target.name)}" data-card="${escapeHtml(target.name)}">${label}</a>`;
}

function linkedText(value) {
  // Rendering-only spacing: keep source wording and punctuation untouched.
  const readable = String(value || "").replace(/\r\n?/g, "\n").replace(
    /(?<!\n)\n(?!\n)(?=(?:▶|■|◆|●|★|①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|※|・))/g,
    "\n\n"
  );
  return escapeHtml(readable).replace(/《甲虫装機》の共通効果|《([^》]+)》/g, (match, name) => {
    if (match === "《甲虫装機》の共通効果") return cardReference("【甲虫装機】共通効果", match);
    return cardReference(name);
  }).replace(/\n/g, "<br>");
}

function cleanQaText(value) {
  const cardNames = [];
  let cleaned = String(value || "").replace(/《[^》]+》/g, (name) => {
    const token = `\u0000CARD_NAME_${cardNames.length}\u0000`;
    cardNames.push(name);
    return token;
  });
  cleaned = cleaned
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

function linkedQaText(value) {
  return linkedText(cleanQaText(value));
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
  return (environments || ["1103"]).some((environment) => selectedEnvironments.has(environment));
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
  return (item.qa || [])
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => environmentMatches(qaEnvironments(entry, item)))
    .sort((a, b) => {
      const aPinnedLast = a.entry.managementId === "R-W79LJTECPZ";
      const bPinnedLast = b.entry.managementId === "R-W79LJTECPZ";
      if (aPinnedLast !== bPinnedLast) return aPinnedLast ? 1 : -1;
      return qaBasePriority(a.entry, item) - qaBasePriority(b.entry, item) || a.index - b.index;
    })
    .map(({ entry }) => entry);
}

function environmentLabel(environments) {
  return environments.map((environment) => `${environment}環境`).join("・");
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

function qaPanel(item) {
  const entries = orderedQa(item);
  if (entries.length) {
    return `
      <section class="card-section">
        <h3>Q&amp;A</h3>
        <div class="qa-list">
          ${entries.map((entry, index) => `
            <details class="qa-item">
              <summary><span class="qa-marker">Q</span><span class="qa-question">${linkedQaText(entry.question)}</span></summary>
              <div class="answer"><span>A</span><p>${linkedQaText(entry.answer)}</p></div>
              ${qaImagesPanel(entry, item)}
              <p class="qa-environment">対応：${escapeHtml(environmentLabel(qaEnvironments(entry, item)))}</p>
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
  if (!environmentMatches(source.environments)) return entries;
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
    .filter((entry) => entry.card && environmentMatches(entry.card.environments))
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
              <summary><span class="qa-marker">Q</span><span>${linkedQaText(ruling.question)}</span></summary>
              <div class="answer"><span>A</span><p>${linkedQaText(ruling.answer)}</p></div>
            </details>` : `
            <details class="related-ruling related-ruling--overview">
              <summary>${escapeHtml(ruling.label)}内の関連記述</summary>
              <blockquote>${linkedText(ruling.text)}</blockquote>
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
  return [...new Set([...baseTags, ...autoTags])];
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

function overviewSections(text) {
  const lines = String(text || "").split("\n");
  const hasSectionHeadings = lines.some((line) => /^(?:■|◆|●|★|【[^】]+】)/.test(line.trim()));
  const startsSection = hasSectionHeadings
    ? (line) => /^(?:■|◆|●|★|【[^】]+】)/.test(line.trim())
    : (line) => /^▶/.test(line.trim());
  const sections = [];
  let current = [];
  for (const line of lines) {
    if (startsSection(line) && current.some((part) => part.trim())) {
      sections.push(current.join("\n").trim());
      current = [];
    }
    current.push(line);
  }
  if (current.some((part) => part.trim())) sections.push(current.join("\n").trim());

  if (!hasSectionHeadings && sections.length < 2) {
    return String(text || "").split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  }
  return sections;
}

function overviewDisclosureTitle(section, index, total) {
  const firstLine = String(section || "").split("\n").map((line) => line.trim()).find(Boolean) || "";
  const heading = firstLine.replace(/^(?:■|◆|●|★|▶|・)+\s*/, "").trim();
  if (heading && /^(?:■|◆|●|★|【)/.test(firstLine)) return heading;
  const sentence = firstLine.split(/(?<=[。！？])/)[0] || firstLine;
  const excerpt = sentence.length > 58 ? `${sentence.slice(0, 58)}…` : sentence;
  return excerpt || `概要 ${index + 1}/${total}`;
}

function overviewPanel(item) {
  const text = item.overview || item.summary || "";
  const nonemptyLines = text.split("\n").filter((line) => line.trim());
  const headingCount = nonemptyLines.filter((line) => /^(?:■|◆|●|★|【[^】]+】)/.test(line.trim())).length;
  const bulletCount = nonemptyLines.filter((line) => /^▶/.test(line.trim())).length;
  const complex = text.length > 280 || headingCount > 1 || bulletCount >= 4 || nonemptyLines.length >= 6 || (headingCount === 1 && text.length > 180);
  const sections = complex ? overviewSections(text) : [];
  const overviewHtml = !complex
    ? `<blockquote>${linkedText(text)}</blockquote>`
    : sections.length > 1
      ? `<div class="overview-disclosures">${sections.map((section, index) => `
          <details class="overview-disclosure">
            <summary>${linkedText(overviewDisclosureTitle(section, index, sections.length))}</summary>
            <blockquote>${linkedText(section)}</blockquote>
          </details>`).join("")}</div>`
      : `<details class="overview-disclosure overview-disclosure--single">
          <summary>${sections[0] && /^(?:■|◆|●|★|【[^】]+】)/.test(sections[0].trim()) ? linkedText(overviewDisclosureTitle(sections[0], 0, 1)) : "概要を開く"}</summary>
          <blockquote>${linkedText(text)}</blockquote>
        </details>`;

  return `
    <section class="card-section overview-section">
      <h3>概要</h3>
      ${overviewHtml}
      ${overviewManagementIdLine(item)}
      ${overviewImagesPanel(item)}
    </section>`;
}

function qaSearchableText(item) {
  return (item.qa || []).flatMap((entry) => [entry.question, entry.answer, entry.managementId]).join(" ");
}

// Search strings are large; normalize them once instead of rebuilding them on every keystroke.
const rulingSearchIndex = new WeakMap();
for (const item of allRulings) {
  rulingSearchIndex.set(item, {
    all: normalize(searchableText(item)),
    name: normalize(item.name),
    reading: normalize(item.reading),
    qa: normalize(qaSearchableText(item))
  });
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
  const content = item.type === "category"
    ? `
        <div class="category-overview">
          ${categoryCoverPanel(item)}
          ${overviewPanel(item)}
        </div>`
    : `
        <div class="card-profile">
          <div class="image-column">${imagePanel(item)}</div>
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

function renderCard(item, index) {
  const titleModifier = normalize(item.name) === normalize("未来融合－フューチャー・フュージョン")
    ? " card-name--future-fusion"
    : "";
  return `
    <article class="ruling-card" data-card-name="${escapeHtml(item.name)}">
      <button class="ruling-toggle" type="button" aria-expanded="false" aria-controls="ruling-${index}">
        ${typeBadge(item)}
        <span class="card-name${titleModifier}">${cardTitle(item)}</span>
        ${effectIcon(item)}
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
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
  cardNavigationStack.length = 0;
  syncBackToCardButton();
}

function goBackToCard() {
  const previous = cardNavigationStack.pop();
  if (!previous) return;
  currentFilter = previous.filter;
  searchInput.value = previous.query;
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === currentFilter));
  render();
  const hash = previous.cardName ? `#card=${encodeURIComponent(previous.cardName)}` : "";
  history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
  syncBackToCardButton();
  requestAnimationFrame(() => {
    const article = [...list.querySelectorAll(".ruling-card")].find((item) => item.dataset.cardName === previous.cardName);
    if (article) {
      const toggle = article.querySelector(".ruling-toggle");
      const body = document.getElementById(toggle.getAttribute("aria-controls"));
      populateCardBody(body);
      toggle.setAttribute("aria-expanded", "true");
      body.hidden = false;
    }
    window.scrollTo({ top: previous.scrollY, behavior: "auto" });
  });
}

function advancedFilterMatches(item) {
  for (const group of filterGroups) {
    const selected = advancedSelections.get(group.id);
    if (!selected?.size) continue;
    const values = ["monsterTags", "otherTags"].includes(group.id) ? tagsFor(item) : [item[group.id]].filter(Boolean);
    if (!values.some((value) => selected.has(value))) return false;
  }
  return true;
}

function buildAdvancedFilters() {
  advancedFilters.innerHTML = filterGroups.map((group) => `
    <fieldset class="advanced-filter-group">
      <legend>${escapeHtml(group.label)}</legend>
      <div class="advanced-filter-options">
        ${group.options.map((option) => `
          <label>
            <input type="checkbox" data-filter-group="${escapeHtml(group.id)}" value="${escapeHtml(option)}">
            <span>${escapeHtml(option)}</span>
          </label>`).join("")}
      </div>
    </fieldset>`).join("");
}

function resetAdvancedFilters() {
  selectedEnvironments.clear();
  selectedEnvironments.add("1103");
  advancedSelections.clear();
  advancedPanel.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = input.closest(".environment-filter") ? input.value === "1103" : false;
  });
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

function render() {
  window.clearTimeout(searchRenderTimer);
  searchRenderTimer = 0;
  const query = normalize(searchInput.value);
  const items = allRulings.filter((item) => {
    const typeMatches = currentFilter === "all" || item.type === currentFilter;
    const environmentMatchesItem = environmentMatches(item.environments);
    const haystack = rulingSearchIndex.get(item).all;
    return typeMatches && environmentMatchesItem && advancedFilterMatches(item) && (!query || haystack.includes(query));
  });

  count.textContent = `${items.length}件`;
  emptyState.hidden = items.length !== 0;

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
    }).join("");
    return;
  }

  rowNavigation.hidden = true;

  const nameMatches = items
    .filter((item) => rulingSearchIndex.get(item).name.includes(query))
    .sort((a, b) => {
      const aExact = rulingSearchIndex.get(a).name === query;
      const bExact = rulingSearchIndex.get(b).name === query;
      if (aExact !== bExact) return bExact - aExact;
      return a.name.localeCompare(b.name, "ja");
    });
  const nameSet = new Set(nameMatches);
  const readingMatches = items.filter((item) =>
    !nameSet.has(item) && rulingSearchIndex.get(item).reading.includes(query)
  );
  const readingSet = new Set(readingMatches);
  const qaMatches = items.filter((item) =>
    !nameSet.has(item) && !readingSet.has(item) && rulingSearchIndex.get(item).qa.includes(query)
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
    .join("");
}

list.addEventListener("click", async (event) => {
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
  if (sourceCardName && normalize(sourceCardName) !== normalize(name)) {
    cardNavigationStack.push({
      cardName: sourceCardName,
      query: searchInput.value,
      filter: currentFilter,
      scrollY: window.scrollY
    });
  }
  syncBackToCardButton();
  currentFilter = "all";
  searchInput.value = name;
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  render();
  history.replaceState(null, "", `#card=${encodeURIComponent(name)}`);
  requestAnimationFrame(() => {
    const button = list.querySelector(".ruling-toggle");
    if (!button) return;
    const body = document.getElementById(button.getAttribute("aria-controls"));
    populateCardBody(body);
    button.setAttribute("aria-expanded", "true");
    body.hidden = false;
    button.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function shareSite() {
  const siteUrl = new URL(location.href);
  siteUrl.search = "";
  siteUrl.hash = "";
  const url = siteUrl.toString();
  const shareData = { title: document.title, text: "遊戯王1103環境 裁定集", url };
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

advancedPanel.addEventListener("change", (event) => {
  const input = event.target.closest("input[type='checkbox']");
  if (!input) return;
  clearCardNavigation();

  if (input.closest(".environment-filter")) {
    if (input.checked) selectedEnvironments.add(input.value);
    else selectedEnvironments.delete(input.value);
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
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}

buildAdvancedFilters();
render();
