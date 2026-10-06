// 2026-10-07 指示書によるカード概要・裁定・表示表記の更新
(function () {
  const data = {"vylon_overview":"【基本情報】\n■効果分類：モンスター吸収は起動効果、戦闘を行った相手モンスターの破壊は誘発効果\n■吸収効果\n▷効果処理時に自身がフィールドを離れた場合、対象の相手モンスターはフィールドに残る\n▷効果モンスターしか吸収できない\n■戦闘相手の破壊効果は[DS表①ダメージステップ開始時]に発動する","vylon_qa":[{"question":"《ジェムナイト・パール》や《大地の騎士ガイアナイト》を吸収効果対象に選択できますか？","answer":"いいえ、できません。これらのモンスターは効果モンスターとして扱いません。"},{"question":"このカードが闇属性モンスターを装備しているとき、《A・O・J カタストル》と戦闘を行った場合、どうなりますか？","answer":"状況により異なります。\n闇属性モンスターを装備した《ヴァイロン・ディシグマ》と《A・O・J カタストル》のどちらから攻撃を行ったか（どちらがTPか）によって効果処理が異なります。\n\n●《ヴァイロン・ディシグマ》から攻撃した場合\n《ヴァイロン・ディシグマ》がチェーン1、《A・O・J カタストル》がチェーン2として効果が発動し、先に《A・O・J カタストル》の効果によって《ヴァイロン・ディシグマ》が破壊されます。その後《ヴァイロン・ディシグマ》の効果処理を行う時点で、そのカード自身がフィールド上に存在せず、装備しているモンスターも同様に存在しないため、《A・O・J カタストル》を破壊する事はできません。\n\n●《A・O・J カタストル》から攻撃した場合\n《A・O・J カタストル》がチェーン1、《ヴァイロン・ディシグマ》がチェーン2として効果が発動し、先に《ヴァイロン・ディシグマ》の効果によって《A・O・J カタストル》が破壊されますが、その後《A・O・J カタストル》の効果によって《ヴァイロン・ディシグマ》が破壊されます。"}],"veiler_overview":"【基本情報】\n■相手ターンのメインフェイズ中に発動できる《手札誘発》カードの一種。\n■相手フィールドの表側表示の効果モンスター１体を対象として発動する誘発即時効果\n■優先権を持っている場合に発動できる。\n■相手の召喚・セット直後や、メインフェイズ終了時の優先権放棄時など、相手モンスターの効果発動に　チェーンしない形でも発動可能。\n■相手モンスターの効果発動に直接チェーンして発動するほか、別の効果をチェーンに挟んだ後から発動することもできる。\n■対象の効果モンスターがコストとしてフィールドを離れる場合、その後からこのカードを発動することはできない。（自分に優先権が移ったタイミングで、既にそのモンスターがフィールド上に存在しない）\n■無効にできる効果を持たない効果モンスターも対象にできる。\n【無効化について】\n■効果の発動自体は無効にしない。そのため、発動コストを支払う処理は防げない。\n■対象モンスターがフィールドで発動した効果を無効にする。フィールドで効果発動後、コストなどでフィールドを離れた場合でも、その効果は無効になる。　※ ≒《禁じられた聖杯》に近い。\n⇒《レスキュー・ラビット》《ローンファイア・ブロッサム》など\n■このカードの効果処理時に、対象モンスターが表側表示で存在しない場合は不発となる。\n⇒このカードの効果にチェーン《月の書》《強制脱出装置》《サンダーブレイク》など\n■効果適用後、対象モンスターが裏側表示になった場合は無効化が解除される。\n■このカードの効果を受けた後、フィールドで発動した効果の処理時にそのモンスターがフィールドを離れている場合は、その効果は無効化されたままとなる。\n■効果適用後は、対象モンスターの永続効果および分類されない効果も無効になる。\n■対象モンスターがフィールドを離れた後、墓地などフィールド以外で新たに発動する効果は無効にできない。\n【エンドフェイズの処理に関して】\n「エンドフェイズ時まで無効」とは、エンドフェイズ終了時（ターンの最終ライン）まで常に無効になるという意味ではない。エンドフェイズ中に、このカードの効果を終了する処理を行う。\n■対象モンスターのエンドフェイズに発動する効果が**強制効果の場合、優先権の関係から無効化、または無効にしないことを《エフェクト・ヴェーラー》を使用した側が選択**できる。　※例はQ＆A参照\n■対象モンスターのエンドフェイズに発動する効果が**任意効果の場合**、このカードの無効化を終了した後に発動できるため、**基本的に無効化できない**。　※例はQ＆A参照\n【主な用途に関して】\n■召喚成功時の誘発効果や起動効果、永続効果、ルール効果の無効化。\n■コストを支払わせた後で効果を無効にする。\n■バトルフェイズへ入る前に、《Ａ・Ｏ・Ｊ カタストル》《N・グランモール》などの効果をあらかじめ無効にする。\n■自身の攻撃力を変化させる効果にも有効。\n※特に《キメラテック・フォートレス・ドラゴン》など、元々の攻撃力が「？」で、攻撃力を決定する処理が場に出た際に一度だけ行われるモンスターに対して使うことで、以後このカードの効果が切れた後も攻撃力を０にするなど、大きな影響を与える。","veiler_question":"遊戯王における効果無効の重ねがけのルールついて詳しく教えてください。","veiler_answer":"遊戯王には「基本的に既に無効になっているカードを更に無効にする事はできない」というルールがあります。\n\nよって、効果モンスターが《エフェクト・ヴェーラー》等の対象になった時、チェーンして《スキルドレイン》の発動や《デモンズチェーン》の対象にすれば、そのモンスターは《エフェクト・ヴェーラー》等の効果を受けません。\n※《エフェクト・ヴェーラー》の効果処理時には、既にそのカードの効果は無効化状態のため。\n\n一部モンスターは自身をコストに別のゾーンへと移動することでこれらの無効化からも逃れられるため、自身の《レスキューラビット》や《ローンファイア・ブロッサム》等を相手の《エフェクト・ヴェーラー》から守り、効果を発動する手段として重要なテクニックです。\n\nただし、《禁じられた聖杯》のような、無効化と同時にステータスの変動等の他の処理が行われる効果の場合は挙動が異なります。\n\n「無効化と同時にステータス変動等の他の処理」が適用されるなら、既に効果が無効になっている効果モンスターに対しても《禁じられた聖杯》等の効果が適用されます。※つまり原則に反して重ねがけ可能\n\n■簡単な覚え方\n▷①無効に対して、ただの無効のみの効果でチェーンを組む→最初に処理した無効化カードの効果が優先して適応、後に処理した無効化カードの効果は不発\n▷②無効に対して、無効+α（攻撃力アップなど）効果でチェーンを組む→重ねがけされた状態となる","veiler_new_qa":{"question":"エンドフェイズの処理に関して、それぞれに該当するモンスターの例を教えてください。\n①対象モンスターのエンドフェイズに発動する効果が**強制効果の場合、優先権の関係から無効化できる、または無効にしないことを《エフェクト・ヴェーラー》を使用した側が選択**できる例\n②対象モンスターのエンドフェイズに発動する効果が**任意効果の場合**、このカードの強制効果である無効化を終了（解除）した後に発動できるため、**基本的に無効化できない**例","answer":"以下に解答します。\n**■①《エフェクト・ヴェーラー》を撃った側が、相手エンドフェイズの効果処理を無効に（するかしないか選択）できるモンスター　＝　エンドフェイズに強制効果の処理がある相手モンスター**\n▷《ライトロード系》《裁きの龍》の墓地肥し効果\n▷《ワーム・リンクス》のドロー効果\n　⇒基本は無効にしたほうが良いが、相手のライブラリアウトを狙うのであれば無効にしないほうが良い場合も存在\n▷《月読命》《鳳凰》《火之加具土》等の《スピリットモンスター》の自身のバウンス\n　⇒無効にするかしないか、どちらが良いとも言えない。戦闘勝利でアドバンテージをとれるモンスターを持っている場合などは、あえて相手の場に残したほうが良い場合も存在\n　⇒場に残すか、手札に戻すか選べる。※《スピリットモンスター》はこの場合何度も誘発しない\n▷《ホルスの黒炎竜》等の《Lv系モンスター》における自身をコストにしたレベルアップ\n▷《サタンクロース》のドロー効果\n▷《紋章獣レオ》の自壊＋サーチ効果\n　⇒無効にしたほうが良い例\n▷《ヴォルカニック・クイーン》のモンスターリリースorバーン\n▷《レッド・デーモンズ・ドラゴン》《ディストラクター》のデメリット効果\n▷《邪神機－獄炎》《エーリアンモナイト》等の（蘇生先含む）自壊\n▷《コアキメイル》系の維持コスト\n⇒これらは基本無効にしないほうが良い、コストなども払わせたほうが良い例\n\n**■②《エフェクト・ヴェーラー》で無効にできず、効果の発動を許してしまうモンスター　＝　エンドフェイズに任意効果の処理がある相手モンスター**\n▷《ジェネクス・ニュートロン》《アルカナフォースXXⅠ－THE WORLD》・・・1103環境\n▷《魔導教士システィ》・・・1209環境で有名\n▷《武神－ヤマト》・・・1402環境有名\n**これらに該当するモンスターは、《エフェクト・ヴェーラー》でも無効にできず、その効果を貫通することが可能。**"}};
  const items = window.RULINGS || (window.RULINGS = []);
  const normalize = (value) => String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]/gi, "");
  const card = (name) => items.find((item) => normalize(item.name) === normalize(name));
  const vylon = card("ヴァイロン・ディシグマ");
  if (vylon) {
    vylon.overview = data.vylon_overview;
    vylon.qa ||= [];
    for (const incoming of data.vylon_qa) {
      const prior = vylon.qa.find((entry) => normalize(entry.question) === normalize(incoming.question));
      if (prior) Object.assign(prior, incoming);
      else vylon.qa.push(incoming);
    }
  }
  const veiler = card("エフェクト・ヴェーラー");
  if (veiler) {
    veiler.overview = data.veiler_overview;
    veiler.qa ||= [];
    const qa = veiler.qa.find((entry) => normalize(entry.managementId) === normalize("R-PEUZ33JD4L"));
    if (qa) {
      qa.question = data.veiler_question;
      qa.answer = data.veiler_answer;
    }
    const added = data.veiler_new_qa;
    const prior = veiler.qa.find((entry) => normalize(entry.question) === normalize(added.question));
    if (prior) Object.assign(prior, added);
    else veiler.qa.push(added);
  }

  // 公式カードデータベースの表記に沿った修正（天権は永続罠、読みの「テンケン」はカタカナ）。
  const tenken = card("炎舞－「天権」");
  if (tenken) {
    tenken.type = "trap";
    tenken.trapType = "永続罠";
    delete tenken.spellType;
    tenken.reading = "えんぶ－てんけん";
  }
  // 「甲虫装機」の公式ルビは「インゼクター」。造語部分をカタカナに統一。
  for (const item of items) {
    if (String(item.name || "").includes("甲虫装機") && typeof item.reading === "string") {
      item.reading = item.reading.replace(/^いんぜくたー/, "インゼクター");
      if (item.name === "【甲虫装機】共通効果") item.reading = "インゼクターきょうつうこうか";
    }
  }

  // 【効果の基本】が残っている場合は、本文を【基本情報】へ統合する。
  for (const item of items) {
    if (typeof item.overview !== "string" || !item.overview.includes("【効果の基本】")) continue;
    const lines = item.overview.split(/\r?\n/);
    let basic = [];
    let effect = [];
    let other = [];
    let section = "other";
    for (const line of lines) {
      const heading = line.match(/^【([^】]+)】/);
      if (heading) {
        section = heading[1] === "基本情報" ? "basic" : heading[1] === "効果の基本" ? "effect" : "other";
        if (section === "other") other.push(line);
        continue;
      }
      if (section === "basic") basic.push(line);
      else if (section === "effect") effect.push(line);
      else other.push(line);
    }
    const itemParts = ["【基本情報】", ...basic];
    if (effect.length) itemParts.push(...effect);
    item.overview = [...itemParts, ...other].join("\n");
  }

  const tablePattern = /(?:ダメージステップ|ダメステ)(?:の)?表(?:の)?([①②③④⑤⑥⑦⑧⑨⑩0-9]+)?(?:の)?((?:(?:ダメージステップ|ダメステ)?(?:開始時|終了時|ダメージ計算前|ダメージ計算後|計算前|計算後|戦闘結果解決時))|(?:[‐‑‒–—−－ー-](?:ⅰ|ⅱ|ⅲ|ⅳ|ⅴ|ⅵ|i{1,3}|iv|v)(?:以前|以後)?)|(?:以前|以後))?/gi;
  function standardize(value) {
    const protect = [];
    let text = String(value).replace(/《[^》]*》/g, (match) => {
      const token = `\u0000CARD${protect.length}\u0000`;
      protect.push(match);
      return token;
    });
    text = text.replace(tablePattern, (match, phaseNumber = "", phase = "") => {
      const normalizedPhase = String(phase).replace(/^(?:ダメージステップ|ダメステ)/, "");
      return `[DS表${phaseNumber || ""}${normalizedPhase || ""}]`;
    }).replace(/、{2,}/g, "、").replace(/\./g, "。");
    return text.replace(/\u0000CARD(\d+)\u0000/g, (_match, index) => protect[Number(index)]);
  }
  const textKeys = new Set(["overview", "summary", "details", "question", "answer"]);
  function normalizeFields(value, key = "") {
    if (typeof value === "string") return textKeys.has(key) ? standardize(value) : value;
    if (Array.isArray(value)) return value.map((entry) => normalizeFields(entry, key));
    if (value && typeof value === "object") {
      for (const [childKey, child] of Object.entries(value)) {
        if (textKeys.has(childKey)) value[childKey] = normalizeFields(child, childKey);
        else if (Array.isArray(child) || (child && typeof child === "object")) value[childKey] = normalizeFields(child, childKey);
      }
    }
    return value;
  }
  for (const item of items) normalizeFields(item);
})();
