// Ｄ・ステープランの追加、インヴェルズの概要とワームのQAを整理。
(function () {
  const staplen = {
  "name": "Ｄ・ステープラン",
  "reading": "ディフォーマーステープラン",
  "type": "monster",
  "cardClass": "effect",
  "monsterTags": [
    "効果モンスター"
  ],
  "race": "機械族",
  "attribute": "地属性",
  "level": 4,
  "environments": [
    "1103",
    "1209",
    "1402"
  ],
  "image": "./morphtronic-staplen-1103.jpg",
  "overviewManagementId": "79067",
  "source": "ユーザー提供資料",
  "damageStepGuide": true,
  "overview": "■表示形式によって得る効果\n▷表示形式に応じて以下の効果を得る。効果を得ること自体は、効果として扱わない。\n\n■攻撃表示の効果\n▷相手は他のモンスターを攻撃対象に選択できない。モンスターゾーンで適用する永続効果。\n▷このカードが戦闘で破壊された場合、[DS表⑥ダメージステップ終了時]に発動する誘発効果により、このカードを破壊したモンスターの攻撃力を300ポイント下げる。\n\n■守備表示の効果\n▷このカードは戦闘では破壊されない。モンスターゾーンで適用する永続効果。裏側守備表示で攻撃された場合も、リバースした時から適用される。\n▷このカードが攻撃された場合、[DS表④ダメージ計算後]に発動する誘発効果。相手フィールドの表側攻撃表示モンスター1体を対象に取り、守備表示にする。その後、このカードを攻撃表示にする。\n▷対象モンスターを守備表示にできなかった場合、このカードは攻撃表示にならない。",
  "qa": [
    {
      "question": "裏側守備表示のこのカードが攻撃された場合、戦闘で破壊されますか？",
      "answer": "いいえ、破壊されません。ダメージステップで表側表示になった時から、戦闘では破壊されない効果が適用されます。",
      "environments": [
        "1103"
      ],
      "managementId": "R-LH0VMIGY"
    },
    {
      "question": "守備表示の効果で対象にしたモンスターが、効果処理時に表側攻撃表示で存在せず、守備表示にできませんでした。このカードは攻撃表示になりますか？",
      "answer": "いいえ、攻撃表示にならず、守備表示のままです。",
      "environments": [
        "1103"
      ],
      "managementId": "R-VJIMB9HU"
    },
    {
      "question": "《スキルドレイン》の適用中に、攻撃表示のこのカードが戦闘で破壊され墓地へ送られました。攻撃力を300ポイント下げる効果は発動しますか？",
      "answer": "はい、発動します。墓地で発動する効果のため、《スキルドレイン》では無効になりません。",
      "environments": [
        "1103"
      ],
      "managementId": "R-CUN931LF"
    },
    {
      "question": "《イビリチュア・メロウガイスト》に戦闘で破壊され、その効果でデッキに戻った場合、攻撃力を300ポイント下げる効果を発動できますか？",
      "answer": "いいえ、デッキに戻った場合は発動できません。",
      "environments": [
        "1103"
      ],
      "managementId": "R-Q865FB5S"
    }
  ]
};
  if (window.RULINGS.some(card => card.name === staplen.name || card.overviewManagementId === staplen.overviewManagementId)) throw new Error("Duplicate Staplen");
  const jet = window.RULINGS.find(card => card.name === "ワーム・ジェートリクプス");
  const cartaros = window.RULINGS.find(card => card.name === "ワーム・カルタロス");
  if (!jet || !cartaros) throw new Error("Missing Worm cards");
  const nameSection = "■カード名の扱い\n▷「インヴェルズ」モンスターであり、「ヴェルズ」モンスターとしても扱う。\n\n";
  for (const card of window.RULINGS) {
    if (card.name.includes("インヴェルズ") && card.overview?.includes(nameSection)) card.overview = card.overview.replace(nameSection, "");
  }
  jet.qa.push({"question": "このカードがリバースした時の効果に対して、《神の警告》や《王宮の弾圧》を発動できますか？", "answer": "いいえ、発動できません。墓地で発動する、このカード自身を特殊召喚する効果に対してであれば、発動して無効にできます。", "environments": ["1103"], "managementId": "R-TBFNA9DD"});
  cartaros.qa.push({"question": "相手フィールドに《ライオウ》が存在する状況で、このカードが戦闘以外でリバースしました。その効果にチェーンして《毒蛇の供物》を発動し、このカードと《ライオウ》を破壊した場合、手札に加える効果は適用されますか？", "answer": "はい、適用されます。強制効果のため、《ライオウ》が存在していても効果は発動します。効果処理時に《ライオウ》がフィールドを離れていれば、このカード自身もフィールドを離れていても、デッキから該当するモンスターを手札に加えます。", "environments": ["1103"], "managementId": "R-QVXM1B04"});
  window.RULINGS.push(staplen);
})();
