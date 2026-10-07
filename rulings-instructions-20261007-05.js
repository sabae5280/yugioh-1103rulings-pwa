// 2026-10-07 追加指示：昇霊術師 ジョウゲン
(function () {
  const source = {
    name: "昇霊術師 ジョウゲン",
    reading: "しょうれいじゅつし ジョウゲン",
    type: "monster",
    environments: ["1103"],
    image: "./images/additional-20261007-05/01.png",
    cardClass: "effect",
    monsterTags: ["効果モンスター"],
    race: "魔法使い族",
    attribute: "光属性",
    overview: "【基本情報 ＋ 補足】\n■手札１枚のランダムコストで発動できる起動効果\n▷墓地に送らなければならないため、《マクロコスモス》下では発動不可",
    qa: [
      {
        question: "「モンスターを特殊召喚する効果」の発動にチェーンして、《リビングデッドの呼び声》等で《昇霊術師 ジョウゲン》を特殊召喚した場合、どうなりますか？",
        answer: "「特殊召喚できなくなる」効果は、永続効果です。特殊召喚された時点でこの永続効果が適用される為、「モンスターを特殊召喚する効果」は不発に終わります。",
        environments: ["1103"]
      },
      {
        question: "自分の《BF－精鋭のゼピュロス》の効果起動にチェーンして相手が《リビングデッドの呼び声》でこのカードを特殊召喚した場合、どうなりますか？",
        answer: "《BF－精鋭のゼピュロス》の起動効果の発動コストとして、手札に１枚カードを戻します。《BF－精鋭のゼピュロス》の効果処理時には既にこのカードが表側表示で存在するため、《BF－精鋭のゼピュロス》は特殊召喚できず、墓地にとどまります。\nなお、その場合の効果は不発となっただけであり、効果の発動そのものが無効となっていないため、デュエル中１度しか発動できない権利は行使したものとして扱われます。",
        environments: ["1103"]
      },
      {
        question: "《水精鱗－メガロアビス》や《魔導法士 ジュノン》等の手札にて発動し自身を特殊召喚する効果の発動にチェーンして、《リビングデッドの呼び声》等が発動し《昇霊術師 ジョウゲン》が特殊召喚された場合、《水精鱗－メガロアビス》等はどうなりますか？",
        answer: "《水精鱗－メガロアビス》や《魔導法士 ジュノン》等の手札にて発動し自身を特殊召喚する効果の発動にチェーンした《リビングデッドの呼び声》等の効果によって、《昇霊術師 ジョウゲン》等の効果が適用された場合、《水精鱗－メガロアビス》等を特殊召喚する事はできず、効果を発動したその《水精鱗－メガロアビス》等は手札に残る事になります。",
        environments: ["1103"]
      },
      {
        question: "このカードがフィールド上に表側表示で存在する時に、《名推理》や《モンスターゲート》（《昇霊術師 ジョウゲン》をリリースした場合でも）を発動することはできますか？",
        answer: "できません。発動しようとすること自体が不可です。",
        environments: ["1103"]
      },
      {
        question: "このカードをリリースして、《溶岩魔神ラヴァ・ゴーレム》や《Ｄ－ＨＥＲＯ Ｂｌｏｏ－Ｄ》を特殊召喚することはできますか？",
        answer: "できません。発動しようとすること自体が不可です。",
        environments: ["1103"]
      },
      {
        question: "このカードがフィールド上に表側表示で存在する時に、このカードをシンクロ・エクシーズ・融合素材とすることはできますか？",
        answer: "できません。",
        environments: ["1103"]
      },
      {
        question: "特殊召喚後に《月の書》や《月読命》の効果を受けたモンスターを、その後《フォッシル・ダイナ・パキケファロ》のリバース時の効果や《昇霊術師 ジョウゲン》の起動効果で破壊できますか？",
        answer: "破壊できます。『特殊召喚された』という付与情報は裏側となっても消えません。\n※《亜空間物質転送装置》でも同様に付与情報は消えません。",
        environments: ["1103"]
      },
      {
        question: "このカードがフィールド上に表側表示で存在する時に、《カオスポッド》がリバースしたらどうなりますか？",
        answer: "《カオスポッド》の効果を通常通り処理する事ができます。特殊召喚の効果を処理するタイミングでは、このカードは既に場に存在しないからです。",
        environments: ["1103"]
      }
    ]
  };

  const normalize = (value) => String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s・･－―—–ー_＿《》「」『』【】]/g, "");
  const rulings = window.RULINGS || (window.RULINGS = []);
  const item = rulings.find((candidate) => normalize(candidate.name) === normalize(source.name));

  if (!item) {
    rulings.push(source);
    return;
  }

  for (const key of ["reading", "type", "environments", "image", "cardClass", "monsterTags", "race", "attribute", "overview"]) {
    item[key] = source[key];
  }
  item.qa ||= [];
  for (const qa of source.qa) {
    const prior = item.qa.find((entry) => normalize(entry.question) === normalize(qa.question));
    if (prior) Object.assign(prior, qa);
    else item.qa.push(qa);
  }
})();
