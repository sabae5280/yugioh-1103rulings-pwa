// 追加.docx に記載された既存カードへの追記・差し替え
(function () {
  const normalize = (value) => String(value || "").normalize("NFKC").replace(/[\s　]/g, "");
  const mergeEntry = (source) => {
    const existing = window.RULINGS.find((item) => normalize(item.name) === normalize(source.name));
    if (!existing) {
      window.RULINGS.push(source);
      return;
    }
    for (const key of ["reading", "type", "spellType", "trapType", "cardClass", "monsterTags", "environments"]) {
      if (source[key] !== undefined) existing[key] = source[key];
    }
    if (!existing.overview && source.overview) existing.overview = source.overview;
    if (!existing.image && source.image) existing.image = source.image;
    if (!existing.coverImage && source.coverImage) existing.coverImage = source.coverImage;
    existing.qa ||= [];
    for (const entry of source.qa || []) {
      const prior = existing.qa.find((item) => normalize(item.question) === normalize(entry.question));
      if (prior) Object.assign(prior, entry);
      else existing.qa.push(entry);
    }
  };

  for (const item of [...(window.M_ROW_RULINGS || []), ...(window.W_ROW_RULINGS || [])]) mergeEntry(item);

  const frog = window.RULINGS.find((item) => normalize(item.name) === normalize("鬼ガエル"));
  const frogQa = {
    question: "《溶岩魔人ラヴァゴーレム》《ヴォルカニック・クイーン》《異次元の一角戦士》などの効果によって通常召喚ができない状態で、『１ターンに１度、自分フィールド上に存在するモンスター１体を（コストとして）手札に戻す事で、このターン通常召喚に加えて１度だけ、自分は「鬼ガエル」以外の「ガエル」と名のついた\nモンスター１体を召喚する事ができる。』の効果を発動できますか？",
    answer: "いいえ、できません。通常召喚できない制約が発生中は、効果の発動自体が不可となります。もちろんコストだけ支払うこともできません。",
    environments: ["1103"]
  };
  if (frog) {
    frog.qa ||= [];
    const prior = frog.qa.find((entry) => normalize(entry.question) === normalize(frogQa.question));
    if (prior) Object.assign(prior, frogQa);
    else frog.qa.push(frogQa);
  }

  const virus = window.RULINGS.find((item) => normalize(item.name) === normalize("魔のデッキ破壊ウイルス"));
  const virusOverview = [
    "▶残存効果を残すカード",
    "▶発動時に、自分フィールドの攻撃力2000以上の闇属性モンスター1体をリリースする。リリースはコスト。その際、裏側守備表示のモンスターでもリリース可。\n▶発動時に相手の手札とフィールド上のモンスター（裏側含む）を全て確認し、攻撃力1500以下のモンスターを全て破壊する。手札のモンスターも『破壊』した扱い。\n▶適用中に相手がカードをドローした場合の確認・破壊はチェーンブロックを作らない。ドローフェイズのドロー直後及び、ドローを含むカードの効果処理が全て終了した時点でそのドローしたカードが該当する場合、チェーンブロックを作らず、即座に適用される。クイックエフェクト等を発動する前に破壊処理。",
    "▶バトルステップ以前に発動されていれば、その残存効果はダメージステップ中の《天空騎士パーシアス》等のドローに対しても適応される。\n▶手札で攻撃力が「？」となる《トラゴエディア》等は、この効果では破壊されない。フィールドではこのカードの効果処理時に効果範囲であれば破壊。"
  ].join("\n\n");
  const virusQa = [
    {
      question: "《魔のデッキ破壊ウイルス》の適用中、相手が「ドローする処理＋別の処理」を行う効果を発動した場合、どのように処理しますか？",
      answer: "カードをドローした時点で一度そのカードを確認し、その後、発動したカードの効果処理を最後まで行います。効果処理終了後、確認したカードがまだ相手の手札に存在し、《魔のデッキ破壊ウイルス》の破壊範囲に該当する場合、チェーンブロックを作らず破壊します。",
      environments: ["1103"]
    },
    {
      question: "相手フィールドに《勝利の導き手フレイヤ》と、その効果によって攻撃力が1500を超えている《コーリング・ノヴァ》が存在する状態で《魔のデッキ破壊ウイルス》を発動した場合、どうなりますか？",
      answer: "攻撃力の判定は対象を取らず、相手全モンスターに対し効果処理時の一度だけ同時判定します。その後の破壊処理の後に攻撃力が変動し対象になってもそれは破壊対象外です。つまりこの場合は《勝利の導き手フレイヤ》のみ破壊されます。その結果《コーリング・ノヴァ》の攻撃力が1500以下になっても、改めて判定して破壊することはありません。",
      environments: ["1103"]
    },
    {
      question: "《魔のデッキ破壊ウイルス》の適用中、相手がドローフェイズに《D.D.クロウ》をドローしました。破壊される前に《D.D.クロウ》の効果を発動できますか？",
      answer: "いいえ、できません。ドローしたカードの確認・破壊はチェーンブロックを作らず、「ドロー→確認→該当する場合は破壊」と処理されます。そのため、《D.D.クロウ》の効果を発動する前に破壊されます。",
      environments: ["1103"]
    }
  ];
  if (virus) {
    virus.overview = virusOverview;
    virus.qa ||= [];
    for (const entry of virusQa) {
      const prior = virus.qa.find((item) => normalize(item.question) === normalize(entry.question));
      if (prior) Object.assign(prior, entry);
      else virus.qa.push(entry);
    }
  }

  const correctedAnswer = "「六武衆」１体のみ対象にされた場合のみ発動できるため、発動することはできません。《ゴッドバードアタック》や《インフェルニティ・ブレイク》等、２枚が対象になってる場合なども同様です。\n\n※特に《インフェルニティ・ブレイク》のような、一見するとフィールド上の１枚しか対象に取っていないように見える効果でも、別の領域に別の対象をとっている効果のカードが存在するため注意。";
  for (const item of window.RULINGS) {
    const target = (item.qa || []).find((entry) => entry.managementId === "R-QU1RU" || entry.question.includes("《スクラップ・ドラゴン》の効果を発動しました"));
    if (target) {
      target.managementId = "R-QU1RU";
      target.answer = correctedAnswer;
      break;
    }
  }
})();
