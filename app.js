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

let currentFilter = "all";
let deferredPrompt = null;

const typeLabels = { monster: "モンスター", spell: "魔法", trap: "罠" };

function normalize(value) {
  const normalized = String(value || "")
    .normalize("NFKC")
    .toLowerCase();

  // カタカナをひらがなへ統一し、表記ゆれを吸収する。
  const hiragana = normalized.replace(/[ァ-ヶ]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60)
  );

  // 中黒、空白、長音・ハイフン類の有無を検索結果に影響させない。
  return hiragana.replace(/[\s・･－―—–ー_＿]/g, "");
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
  const qaText = (item.qa || []).flatMap((entry) => [entry.question, entry.answer]);
  return [
    item.name,
    item.reading,
    item.overview,
    item.summary,
    ...(item.details || []),
    ...qaText,
    ...(item.related || [])
  ].join(" ");
}

function findCard(name) {
  const target = normalize(name);
  return window.RULINGS.find((item) => normalize(item.name) === target);
}

function cardReference(name) {
  const target = findCard(name);
  const label = `《${escapeHtml(name)}》`;
  if (!target) return `<span class="card-reference is-pending" title="カードページ準備中">${label}</span>`;
  return `<a class="card-reference" href="#card=${encodeURIComponent(target.name)}" data-card="${escapeHtml(target.name)}">${label}</a>`;
}

function linkedText(value) {
  return escapeHtml(value || "").replace(/《([^》]+)》/g, (_match, name) => cardReference(name));
}

function cardTitle(item) {
  const name = `《${escapeHtml(item.name)}》`;
  if (!item.reading) return name;
  return `<ruby>${name}<rt>${escapeHtml(item.reading)}</rt></ruby>`;
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

function qaPanel(item) {
  if (item.qa?.length) {
    return `
      <section class="card-section">
        <h3>Q&amp;A</h3>
        <div class="qa-list">
          ${item.qa.map((entry, index) => `
            <details class="qa-item" ${index === 0 ? "open" : ""}>
              <summary><span class="qa-marker">Q</span><span class="qa-question">${linkedText(entry.question)}</span></summary>
              <div class="answer"><span>A</span><p>${linkedText(entry.answer)}</p></div>
              ${entry.date ? `<p class="qa-date">裁定日：${escapeHtml(entry.date)}</p>` : ""}
            </details>
          `).join("")}
        </div>
      </section>`;
  }
  return `
    <section class="card-section">
      <h3>裁定メモ</h3>
      <ul class="details">${(item.details || ["Q&Aは今後追記予定です。"]).map((detail) => `<li>${linkedText(detail)}</li>`).join("")}</ul>
    </section>`;
}

function relatedPanel(item) {
  if (!item.related?.length) return "";
  return `
    <section class="card-section">
      <h3>関連カード</h3>
      <div class="related-list">${item.related.map(cardReference).join("")}</div>
    </section>`;
}

function qaSearchableText(item) {
  return (item.qa || []).flatMap((entry) => [entry.question, entry.answer]).join(" ");
}

function renderCard(item, index) {
  return `
    <article class="ruling-card">
      <button class="ruling-toggle" type="button" aria-expanded="false" aria-controls="ruling-${index}">
        <span class="type-badge type-${escapeHtml(item.type)}">${escapeHtml(typeLabels[item.type])}</span>
        <span class="card-name">${cardTitle(item)}</span>
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
      <div id="ruling-${index}" class="ruling-body" hidden>
        <div class="card-profile">
          <div class="image-column">${imagePanel(item)}</div>
          <div class="content-column">
            <section class="card-section overview-section">
              <h3>概要</h3>
              <blockquote>${linkedText(item.overview || item.summary)}</blockquote>
            </section>
            ${qaPanel(item)}
            ${relatedPanel(item)}
          </div>
        </div>
        <p class="meta">出典区分：${escapeHtml(item.source)}</p>
      </div>
    </article>`;
}

function render() {
  const query = normalize(searchInput.value);
  const items = window.RULINGS.filter((item) => {
    const typeMatches = currentFilter === "all" || item.type === currentFilter;
    const haystack = normalize(searchableText(item));
    return typeMatches && (!query || haystack.includes(query));
  });

  count.textContent = `${items.length}件`;
  emptyState.hidden = items.length !== 0;

  if (!query) {
    list.innerHTML = items.map(renderCard).join("");
    return;
  }

  const nameMatches = items
    .filter((item) => normalize(item.name).includes(query))
    .sort((a, b) => {
      const aExact = normalize(a.name) === query;
      const bExact = normalize(b.name) === query;
      if (aExact !== bExact) return bExact - aExact;
      return a.name.localeCompare(b.name, "ja");
    });
  const nameSet = new Set(nameMatches);
  const qaMatches = items.filter((item) => !nameSet.has(item) && normalize(qaSearchableText(item)).includes(query));
  const groupedSet = new Set([...nameMatches, ...qaMatches]);
  const otherMatches = items.filter((item) => !groupedSet.has(item));

  let cardIndex = 0;
  const groups = [
    { title: "カード名に該当", items: nameMatches },
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

list.addEventListener("click", (event) => {
  const imageButton = event.target.closest("[data-image-src]");
  if (imageButton) {
    openLightbox(imageButton.dataset.imageSrc, imageButton.dataset.imageName);
    return;
  }
  const cardLink = event.target.closest("[data-card]");
  if (cardLink) {
    event.preventDefault();
    navigateToCard(cardLink.dataset.card);
    return;
  }
  const button = event.target.closest(".ruling-toggle");
  if (!button) return;
  const body = document.getElementById(button.getAttribute("aria-controls"));
  const open = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!open));
  body.hidden = open;
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
});

function navigateToCard(name) {
  currentFilter = "all";
  searchInput.value = name;
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  render();
  history.replaceState(null, "", `#card=${encodeURIComponent(name)}`);
  requestAnimationFrame(() => {
    const button = list.querySelector(".ruling-toggle");
    if (!button) return;
    const body = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", "true");
    body.hidden = false;
    button.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

searchInput.addEventListener("input", render);
clearButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  render();
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.dataset.filter;
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item === button));
  render();
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  currentFilter = "all";
  filters.querySelectorAll(".filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all"));
  render();
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
const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
iosTip.hidden = !(isIos && !isStandalone);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}

render();
