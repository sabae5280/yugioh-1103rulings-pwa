const list = document.querySelector("#rulingList");
const count = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const clearButton = document.querySelector("#clearButton");
const resetButton = document.querySelector("#resetButton");
const emptyState = document.querySelector("#emptyState");
const filters = document.querySelector("#filters");
const installButton = document.querySelector("#installButton");
const iosTip = document.querySelector("#iosTip");

let currentFilter = "all";
let deferredPrompt = null;

const typeLabels = { monster: "モンスター", spell: "魔法", trap: "罠" };

function normalize(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s・－―ー_]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  const query = normalize(searchInput.value);
  const items = window.RULINGS.filter((item) => {
    const typeMatches = currentFilter === "all" || item.type === currentFilter;
    const haystack = normalize([item.name, item.reading, item.summary, ...(item.details || [])].join(" "));
    return typeMatches && (!query || haystack.includes(query));
  });

  count.textContent = `${items.length}件`;
  emptyState.hidden = items.length !== 0;
  list.innerHTML = items.map((item, index) => `
    <article class="ruling-card">
      <button class="ruling-toggle" type="button" aria-expanded="false" aria-controls="ruling-${index}">
        <span class="type-badge type-${escapeHtml(item.type)}">${escapeHtml(typeLabels[item.type])}</span>
        <span class="card-name">《${escapeHtml(item.name)}》</span>
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
      <div id="ruling-${index}" class="ruling-body" hidden>
        <p class="summary">${escapeHtml(item.summary)}</p>
        <ul class="details">${(item.details || []).map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>
        <p class="meta">出典区分：${escapeHtml(item.source)}</p>
      </div>
    </article>
  `).join("");
}

list.addEventListener("click", (event) => {
  const button = event.target.closest(".ruling-toggle");
  if (!button) return;
  const body = document.getElementById(button.getAttribute("aria-controls"));
  const open = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!open));
  body.hidden = open;
});

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
