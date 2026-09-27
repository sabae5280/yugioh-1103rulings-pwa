(() => {
  const find = (name) => window.RULINGS.find((item) => item.name === name);

  const infernity = find("《インフェルニティ》共通効果");
  if (infernity) {
    infernity.coverImage = "./infernity-common-cover.webp";
    infernity.coverImageAlt = "《インフェルニティ》共通効果のカバー画像";
    infernity.overviewImages = [{
      src: "./infernity-common-diagram.webp",
      alt: "《インフェルニティ》の手札枚数と効果適用に関する参考画像"
    }];
  }

  const obsoleteDamageStepImages = new Set([
    "./k-26-extra-1.jpg",
    "./k-27-extra-1.png",
    "./k-38-extra-1.jpg",
    "./k-38-extra-2.jpg",
    "./k-39-extra-1.jpg"
  ]);

  const potOfDuality = find("強欲で謙虚な壺");
  if (potOfDuality) {
    potOfDuality.supplementalImagesTitle = "《強欲で謙虚な壺》発動可否フローチャート";
    potOfDuality.supplementalImages = [{
      src: "./pot-of-duality-flowchart.png",
      alt: "《強欲で謙虚な壺》発動可否判定フローチャート",
      caption: "タップして拡大表示"
    }];
  }

  const articles = {
    mysterySpace: {
      title: "謎空間（召喚無効、魔法罠のカードの発動無効）について",
      url: "https://andal-po.blog.jp/archives/1079147390.html",
      image: "./article-mystery-space.png",
      description: "召喚・特殊召喚や魔法・罠カードの発動が無効になった場合の『謎空間』を解説した記事です。",
      siteName: "たんけんの こころえ その１"
    },
    galeEffect: {
      title: "攻守半減のあれやこれ｜よんふ",
      url: "https://note.com/lovely_minnow640/n/n3baa1b267485",
      image: "./article-gale-effect.png",
      description: "《ＢＦ－疾風のゲイル》に代表される、攻撃力・守備力を半分に固定する処理の解説記事です。",
      siteName: "note"
    }
  };

  const addArticle = (item, article) => {
    item.externalArticles = item.externalArticles || [];
    if (!item.externalArticles.some((entry) => entry.url === article.url)) {
      item.externalArticles.push(article);
    }
  };

  const appendQa = (item, question, answer) => {
    if (!item) return;
    item.qa = item.qa || [];
    if (!item.qa.some((entry) => entry.question === question)) {
      item.qa.push({ question, answer, environments: ["1103"] });
    }
  };

  const rRighteousJustice = find("Ｒ－ライトジャスティス");
  appendQa(
    rRighteousJustice,
    "自分の場に２体の《HERO》モンスターが存在し、相手の場にはセットされた魔法・罠カードが１枚のみ、自分の場にはセットカードがない状態です。この状態で《Ｒ－ライトジャスティス》を発動し、このカード自体を含む２枚を選択して破壊することは可能ですか？",
    "いいえ、できません。\n※《サイクロン》でその《サイクロン》自体を破壊できないのと同様、空打ちに該当します。"
  );
  appendQa(
    rRighteousJustice,
    "相手フィールドに《E・HERO》と名のついたモンスターが３体と魔法・罠カードが１枚存在し、自分フィールドには魔法・罠カードが２枚存在しています。この状況で相手が発動した《Ｒ－ライトジャスティス》にチェーンして、自分は《スターライト・ロード》を発動できますか？",
    "この場合、《Ｒ－ライトジャスティス》の効果によって自分フィールドの魔法・罠カードが確実に２枚破壊されるため、《Ｒ－ライトジャスティス》の発動にチェーンして《スターライト・ロード》を発動できます。\n\nただし、《Ｒ－ライトジャスティス》の効果によって自分フィールドの魔法・罠カードが２枚破壊されるかどうかが不確定な場合、チェーンして《スターライト・ロード》を発動することはできません。\n※例えば、自分と相手のフィールドに魔法・罠カードがそれぞれ２枚存在し、相手フィールドに《E・HERO》と名のついたモンスターが３体存在する状態で《Ｒ－ライトジャスティス》が発動した場合、自分フィールドの魔法・罠カードが２枚破壊されるとは限りません。その場合は、チェーンして《スターライト・ロード》を発動できません。"
  );

  const normalizeOverview = (value) => {
    if (typeof value !== "string") return value;
    return value
      .replaceAll("\\n", "\n")
      .replaceAll("＼n", "\n")
      .replace(/([^\n])▶/g, "$1\n▶")
      .split("\n")
      .map((line) => line.replace(/^(\s*)・/, "$1▶"))
      .join("\n");
  };

  for (const item of window.RULINGS) {
    item.related = [...new Set(item.related || [])];
    item.supplementalImages = (item.supplementalImages || []).filter((entry) => {
      const src = typeof entry === "string" ? entry : entry.src;
      return !obsoleteDamageStepImages.has(src) && src !== "./damage-step-reference.png";
    });

    const text = [
      item.name,
      item.overview,
      item.summary,
      ...(item.details || []),
      ...(item.qa || []).flatMap((entry) => [entry.question, entry.answer])
    ].filter(Boolean).join("\n");

    if (text.includes("謎空間")) addArticle(item, articles.mysterySpace);
    if (/疾風のゲイル|ゲイル効果/.test(text)) addArticle(item, articles.galeEffect);

    const normalizeTerm = (value) => typeof value === "string"
      ? value.replaceAll("効果解決時", "効果処理時")
      : value;
    item.overview = normalizeTerm(item.overview);
    item.summary = normalizeTerm(item.summary);
    item.details = (item.details || []).map(normalizeTerm);
    for (const entry of item.qa || []) {
      entry.question = normalizeTerm(entry.question);
      entry.answer = normalizeTerm(entry.answer);
    }
  }

  const knownCardNames = new Set([
    ...window.RULINGS.map((item) => item.name.replace(/^《|》$/g, "")),
    "モンスターゲート",
    "Ｒ－ライトジャスティス",
    "R－ライトジャスティス",
    "スターライト・ロード"
  ]);
  const normalizeCardQuotes = (value) => {
    if (typeof value !== "string") return value;
    let normalized = value.replace(/「《([^》]+)》」/g, "《$1》");
    for (const name of knownCardNames) normalized = normalized.replaceAll(`「${name}」`, `《${name}》`);
    return normalized;
  };

  for (const item of window.RULINGS) {
    item.overview = normalizeCardQuotes(normalizeOverview(item.overview));
    item.summary = normalizeCardQuotes(normalizeOverview(item.summary));
    item.details = (item.details || []).map((value) => normalizeCardQuotes(normalizeOverview(value)));
    for (const entry of item.qa || []) {
      entry.question = normalizeCardQuotes(normalizeOverview(entry.question));
      entry.answer = normalizeCardQuotes(normalizeOverview(entry.answer));
    }
  }
})();
