// ダイガスタ・フェニクスとシューティング・スター・ドラゴンの《月の書》との処理を整理。
(function () {
  const phoenix = window.RULINGS.find(card => card.name === "ダイガスタ・フェニクス");
  const shootingStar = window.RULINGS.find(card => card.name === "シューティング・スター・ドラゴン");
  const nextQa = shootingStar?.qa.findIndex(entry => entry.question.includes("チューナーが1体もめくれなかった後、《月の書》"));
  if (!phoenix || !shootingStar || nextQa < 0) throw new Error("Missing card or QA");
  phoenix.overview = "■2回攻撃できる効果\n▷1ターンに1度、モンスターゾーンで発動できる起動効果。先攻1ターン目のメインフェイズおよびメインフェイズ2には発動できない。\n▷発動コストとして、このカードのエクシーズ素材を1つ取り除く。\n▷自分のモンスターゾーンに表側表示で存在する風属性モンスター1体を対象に取る。このカード自身も対象にできる。\n▷対象のモンスターは、このターンの1度のバトルフェイズ中に2回攻撃できる。";
  phoenix.qa.push(...[
  {
    "question": "このカードの効果にチェーンして《月の書》が発動し、対象のモンスターが裏側守備表示になりました。そのターンに表側攻撃表示になった場合、2回攻撃できますか？",
    "answer": "はい、できます。効果処理時に対象が裏側守備表示でも、2回攻撃できる効果は適用されます。このカード自身を対象にした場合も同様です。",
    "environments": [
      "1103"
    ],
    "managementId": "R-CBH92MO1"
  },
  {
    "question": "このカードの効果が適用された後、対象のモンスターが《月の書》で裏側守備表示になりました。そのターンに再び表側攻撃表示になった場合、2回攻撃できますか？",
    "answer": "いいえ、できません。効果が適用された後に裏側守備表示になった時点で、2回攻撃できる効果の適用はなくなります。",
    "environments": [
      "1103"
    ],
    "managementId": "R-P43781O2"
  }
]);
  shootingStar.qa.splice(nextQa, 0, {
  "question": "デッキをめくる効果にチェーンして《月の書》が発動し、このカードが裏側守備表示のまま効果を処理しました。そのターンに表側攻撃表示になった場合、何回攻撃できますか？ また、同じ効果を再度発動した場合、攻撃回数は変わりますか？",
  "answer": "最初にめくったチューナーの数まで攻撃できます。同じ効果を再度発動しても、最初に適用された攻撃回数は上書きされません。",
  "environments": [
    "1103"
  ],
  "managementId": "R-K6RHLDRP"
});
})();
