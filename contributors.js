(() => {
  const environments = ["1103", "1209", "1402"];
  const igaiLinks = { X: "https://x.com/igaiundine", note: "https://note.com/igaiundine", blog: "https://igaiundine.hatenablog.com/" };
  const organizer = id => "https://tonamel.com/organization/" + id + "?game=yugioh_ocg";
  const profiles = [
    { deck: "暗黒界", name: "ふぉる", image: "T_Morikawa_F.webp", links: {
      X: "https://x.com/T_Morikawa_F", note: "https://note.com/t_fort_morikawa", 主催: organizer("9W04L") } },
    { deck: "六武衆", name: "大嵐", image: "adsoji3.webp", links: {
      X: "https://x.com/adsoji3", blog: "https://oo-arashi.hatenablog.com/" } },
    { deck: "HERO", name: "くりすま", image: "xmas8787.webp", links: {
      X: "https://x.com/xmas8787", note: "https://note.com/uenog" } },
    { deck: "TGガジェット・０ガジェ", name: "みらーふぉーす", image: "ayumirrorforce.webp", links: {
      X: "https://x.com/ayumirrorforce", blog: "http://blog.livedoor.jp/mirror_force/",
      主催: organizer("TGuqD"), YouTube: "https://www.youtube.com/channel/UC3Kwes-TXoH4D0AmOxBd2RQ" } },
    { deck: "BF", name: "みんまや", image: "minmaya_.webp", links: {
      X: "https://x.com/minmaya_", note: "https://note.com/proper_stilt9947" } },
    { deck: "カラクリ", name: "キャリア", image: "PZFace.webp", links: {
      X: "https://x.com/PZFace", note: "https://note.com/brainy_roses651", 主催: organizer("PGKbY") } },
    { deck: "ドラグニティ", name: "ジグザグ", image: "zigzag8225.webp", links: {
      X: "https://x.com/zigzag8225", note: "https://note.com/zigzag8225" } },
    { deck: "剣闘獣", name: "あんだるぽ", image: "andal_po.png", links: {
      X: "https://x.com/andal_po?s=20", blog: "https://andal-po.blog.jp/" } },
    { deck: "墓守", name: "墓守村3名", image: "hakamorimura.webp", members: [
      { name: "menaka", links: { X: "https://x.com/kanamenakana", note: "https://note.com/menakanamenaka",
        主催: organizer("jw3Rz"), YouTube: "https://www.youtube.com/channel/UCGFSbkoC7SRvgpbiEaL73Qg" } },
      { name: "ななき", links: { X: "https://x.com/nanaki14", note: "https://note.com/nanaki14_1103" } },
      { name: "ひふみ", links: { X: "https://x.com/hifumi_justine", blog: "https://hifumijus.hatenablog.com/" } }
    ] },
    { deck: "ワーム", name: "以外", image: "igai-worm.webp", newRow: true, links: igaiLinks },
    { deck: "D", name: "以外", image: "igai-d.webp", links: igaiLinks }
  ];
  const byEnvironment = { "1103": profiles, "1209": [], "1402": [] };

  const icons = {
    X: '<path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.5 5.4 22H2.2l8.3-9.5L1 2h6.5l5.8 8.7L18.9 2Zm-1 18h1.8L6.6 4H4.7L17.9 20Z"/>',
    note: '<path fill="currentColor" d="M4 4.3h4.4v1.3c1.3-1 2.8-1.6 4.5-1.6 4.9 0 7.1 2.8 7.1 7.4v8.3h-4.6v-7.8c0-2.8-.9-4-3.3-4-2.2 0-3.4 1.5-3.4 4v7.8H4Z"/>',
    blog: '<path d="M3 5c3.6-.9 6.2-.3 9 1.5 2.8-1.8 5.4-2.4 9-1.5v13c-3.6-.9-6.2-.3-9 1.5-2.8-1.8-5.4-2.4-9-1.5ZM12 7v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    主催: '<path d="M7 4h10v4.5c0 3.7-2.3 6.1-5 6.1s-5-2.4-5-6.1ZM7 6H3v2c0 2.8 1.8 4.3 4.9 4.4M17 6h4v2c0 2.8-1.8 4.3-4.9 4.4M12 15v4M8.5 20h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    YouTube: '<path fill="currentColor" fill-rule="evenodd" d="M2.2 6.7c.3-1.5 1.3-2.1 2.8-2.3a56 56 0 0 1 14 0c1.5.2 2.5.8 2.8 2.3a27 27 0 0 1 0 10.6c-.3 1.5-1.3 2.1-2.8 2.3a56 56 0 0 1-14 0c-1.5-.2-2.5-.8-2.8-2.3a27 27 0 0 1 0-10.6ZM10 8.4v7.2l6-3.6Z"/>'
  };

  function linkButtons(person) {
    return Object.entries(person.links).map(([label, url]) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", person.name + " 氏の" + label + "（新しいタブで開く）");
      link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[label] + '</svg>';
      const caption = document.createElement("span");
      caption.textContent = label;
      link.append(caption);
      return link;
    });
  }

  window.openContributorDirectory = function (root) {
    root.innerHTML = `
      <div class="credit-tabs" role="tablist" aria-label="監修環境"></div>
      <section id="creditPanel" role="tabpanel">
        <p class="credit-hint">画像をタップすると、監修者の詳細が開きます。</p>
        <div class="credit-grid"></div>
        <p class="credit-empty" hidden>後日追加予定です。</p>
      </section>
      <dialog class="credit-dialog" aria-labelledby="creditName creditHonorific">
        <div class="credit-dialog-head">
          <span class="credit-era"></span>
          <button type="button" class="credit-close" autofocus>閉じる</button>
        </div>
        <div class="credit-art"><strong class="credit-spine"></strong><img alt=""></div>
        <div class="credit-signature" aria-live="polite" aria-atomic="true">
          <strong id="creditName"></strong> <span id="creditHonorific">氏</span>
        </div>
        <div class="credit-links"></div>
        <div class="credit-paging">
          <button type="button" class="credit-prev">前の方</button>
          <button type="button" class="credit-next">次の方</button>
        </div>
      </dialog>`;

    const tabs = root.querySelector(".credit-tabs");
    const panel = root.querySelector("#creditPanel");
    const grid = root.querySelector(".credit-grid");
    const dialog = root.querySelector("dialog");
    let current = [];
    let environment = environments[0];
    let index = 0;
    let opener;

    function showPerson(position) {
      index = (position + current.length) % current.length;
      const person = current[index];
      dialog.querySelector(".credit-era").textContent = environment + "環境";
      dialog.querySelector(".credit-spine").textContent = person.deck;
      const banner = dialog.querySelector("img");
      banner.src = "./images/links/" + person.image;
      banner.alt = person.deck + "　" + person.name + (person.members ? "" : " 氏") + "の監修バナー";
      dialog.querySelector("#creditName").textContent = person.name;
      dialog.querySelector("#creditHonorific").hidden = Boolean(person.members);
      const links = dialog.querySelector(".credit-links");
      if (person.members) {
        links.replaceChildren(...person.members.map(member => {
          const group = document.createElement("section");
          group.className = "credit-member";
          const heading = document.createElement("h3");
          heading.textContent = member.name + " 氏";
          const buttons = document.createElement("div");
          buttons.append(...linkButtons(member));
          group.append(heading, buttons);
          return group;
        }));
      } else {
        links.replaceChildren(...linkButtons(person));
      }
      dialog.scrollTop = 0;
      dialog.querySelector(".credit-paging").hidden = current.length < 2;
    }

    function selectEnvironment(era) {
      environment = era;
      current = byEnvironment[era];
      for (const tab of tabs.children) {
        const selected = tab.textContent === era;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected) panel.setAttribute("aria-labelledby", tab.id);
      }
      panel.querySelector(".credit-hint").hidden = !current.length;
      panel.querySelector(".credit-empty").hidden = Boolean(current.length);
      const tiles = current.map((person, position) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "credit-tile";
        if (person.newRow) tile.classList.add("credit-row-start");
        tile.setAttribute("aria-haspopup", "dialog");
        tile.innerHTML = '<span class="credit-caption"><strong></strong> <span></span></span><img alt="" loading="lazy" width="960" height="540">';
        tile.querySelector("strong").textContent = "【" + person.deck + "】";
        tile.querySelector(".credit-caption span").textContent = "監修：" + person.name + (person.members ? "" : " 氏");
        tile.querySelector("img").src = "./images/links/" + person.image;
        tile.addEventListener("click", async () => {
          if (opener?.classList.contains("is-opening") || dialog.open) return;
          opener = tile;
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            tile.classList.add("is-opening");
            await new Promise(resolve => setTimeout(resolve, 180));
            tile.classList.remove("is-opening");
          }
          if (!tile.isConnected || !tile.getClientRects().length || environment !== era) return;
          showPerson(position);
          dialog.showModal();
        });
        return tile;
      });
      grid.replaceChildren(...tiles);
    }

    for (const era of environments) {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.id = "creditTab" + era;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.textContent = era;
      tab.addEventListener("click", () => selectEnvironment(era));
      tabs.append(tab);
    }
    tabs.addEventListener("keydown", event => {
      const active = environments.indexOf(environment);
      const positions = { ArrowLeft: active + 2, ArrowRight: active + 1, Home: 0, End: 2 };
      if (!Object.hasOwn(positions, event.key)) return;
      event.preventDefault();
      const next = positions[event.key] % environments.length;
      selectEnvironment(environments[next]);
      tabs.children[next].focus();
    });

    dialog.querySelector(".credit-prev").onclick = () => showPerson(index - 1);
    dialog.querySelector(".credit-next").onclick = () => showPerson(index + 1);
    dialog.querySelector(".credit-close").onclick = () => dialog.close();
    dialog.addEventListener("close", () => opener?.focus({ preventScroll: true }));
    dialog.addEventListener("keydown", event => {
      // The parent menu also handles Escape and Tab. Leave these to the native dialog.
      if (event.key === "Escape" || event.key === "Tab") event.stopPropagation();
    });
    selectEnvironment(environment);
  };
})();
