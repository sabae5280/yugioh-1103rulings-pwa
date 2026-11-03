// ユーザー提供の裁定資料に基づく追加。聖槍QAの記録日：2011年6月23日。
(function () {
  const card = {
  "name": "メタル・リフレクト・スライム",
  "reading": "メタルリフレクトスライム",
  "type": "trap",
  "trapType": "永続罠",
  "environments": [
    "1103",
    "1209",
    "1402"
  ],
  "image": "./metal-reflect-slime-1103.jpg",
  "overviewManagementId": "79011",
  "source": "ユーザー提供資料",
  "overview": "■カードの発動について\n▷ダメージステップには発動できない。\n\n■特殊召喚する効果について\n▷カードの発動時に、効果モンスター（水族・水属性・レベル10・攻撃力0／守備力3000）として、自分のモンスターゾーンに守備表示で特殊召喚する。\n▷特殊召喚後も罠カードとして扱う。罠モンスターの共通ルールについては《罠（トラップ）モンスター》を参照。\n\n■攻撃できない効果について\n▷自身の効果で特殊召喚されたこのカードが、モンスターゾーンで適用する永続効果。\n▷罠カードの効果ではなく、モンスター効果として扱う。",
  "qa": [
    {
      "question": "自身の効果で特殊召喚されたこのカードは、通常モンスターとして扱われますか？",
      "answer": "いいえ、「このカードは攻撃できない」という効果を持つ効果モンスターとして扱われます。",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-RMVJ1FQZ"
    },
    {
      "question": "「このカードは攻撃できない」という効果は、《スキルドレイン》で無効になりますか？",
      "answer": "はい、無効になります。攻撃表示にするなど、攻撃できる状態であれば、このカードで攻撃宣言を行えます。",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-UINQL1RP"
    }
  ],
  "related": [
    "罠（トラップ）モンスター"
  ]
};
  if (window.RULINGS.some(item => item.name === card.name)) throw new Error("Duplicate card: " + card.name);
  window.RULINGS.push(card);
  const traps = window.RULINGS.find(item => item.name === "罠（トラップ）モンスター");
  if (!traps) throw new Error("Missing trap monster category");
  traps.qa.push({
  "question": "モンスターとして存在する罠モンスターを対象に《サイクロン》が発動されました。チェーンして、その罠モンスターに《禁じられた聖槍》を発動した場合、破壊されますか？",
  "answer": "いいえ、破壊されません。《禁じられた聖槍》によって魔法・罠カードの効果を受けなくなるため、罠カードとして対象にされた場合も、《サイクロン》の効果を受けずフィールドに残ります。",
  "environments": [
    "1103",
    "1209",
    "1402"
  ],
  "managementId": "R-44DKKRYB"
});
})();
