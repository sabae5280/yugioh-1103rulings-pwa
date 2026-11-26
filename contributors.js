(() => {
  const environments = ["1103", "1209", "1402"];
  const profiles = [
    { deck: "六武衆", name: "大嵐", image: "adsoji3.webp", environments: ["1103"], links: [["X", "https://x.com/adsoji3"]] },
    { deck: "暗黒界", name: "ふぉる", image: "T_Morikawa_F.webp", environments: ["1103"], links: [["X", "https://x.com/T_Morikawa_F"]] },
    { deck: "BF－ブラックフェザー", name: "みんまや", image: "minmaya_.webp", environments: ["1103"], links: [["X", "https://x.com/minmaya_"]] },
    { deck: "カラクリ", name: "キャリア", image: "PZFace.webp", environments: ["1103"], links: [["X", "https://x.com/PZFace"]] },
    { deck: "ドラグニティ", name: "ジグザグ", image: "zigzag8225.webp", environments: ["1103"], links: [["X", "https://x.com/zigzag8225"]] },
    { deck: "剣闘獣", name: "あんだるぽ", image: "andal_po.png", environments: ["1103"], links: [["X", "https://x.com/andal_po?s=20"]] }
  ];

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
      banner.alt = person.deck + "　" + person.name + " 氏の監修バナー";
      dialog.querySelector("#creditName").textContent = person.name;
      const links = person.links.slice(0, 3).map(([label, url]) => {
        const link = document.createElement("a");
        link.href = url;
        link.textContent = label;
        link.setAttribute("aria-label", person.name + " 氏の" + label + "（新しいタブで開く）");
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return link;
      });
      dialog.querySelector(".credit-links").replaceChildren(...links);
      dialog.querySelector(".credit-paging").hidden = current.length < 2;
    }

    function selectEnvironment(era) {
      environment = era;
      current = profiles.filter(person => person.environments.includes(era));
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
        tile.setAttribute("aria-haspopup", "dialog");
        tile.innerHTML = '<span class="credit-caption"><strong></strong> <span></span></span><img alt="" loading="lazy" width="960" height="540">';
        tile.querySelector("strong").textContent = "【" + person.deck + "】";
        tile.querySelector(".credit-caption span").textContent = "監修：" + person.name + " 氏";
        tile.querySelector("img").src = "./images/links/" + person.image;
        tile.addEventListener("click", () => {
          opener = tile;
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
