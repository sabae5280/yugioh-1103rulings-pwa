(() => {
  const find = (name) => window.RULINGS.find((item) => item.name === name);

  const infernity = find("《インフェルニティ》共通効果");
  if (infernity) {
    infernity.coverImage = "./infernity-common-cover.webp";
    infernity.coverImageAlt = "《インフェルニティ》共通効果のカバー画像";
    infernity.overviewImages = [{
      src: "./infernity-common-overview.webp",
      alt: "《インフェルニティ》の手札枚数と効果適用に関する参考画像"
    }];
  }

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

  for (const item of window.RULINGS) {
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
})();
