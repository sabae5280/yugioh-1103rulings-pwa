// マインフィールドの追加と、メロウガイストとの戦闘例・QAを整理。
(function () {
  const minefield = {
  "name": "マインフィールド",
  "reading": "マインフィールド",
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
  "image": "./minefieldriller-1103.jpg",
  "overviewManagementId": "79070",
  "source": "ユーザー提供資料",
  "damageStepGuide": true,
  "overview": "■墓地のフィールド魔法を手札に戻す効果\n▷自分フィールドの表側表示のこのカードがフィールドを離れた時に、任意に発動できる誘発効果。手札・墓地・表側で除外されている状態で発動する。\n▷自分の墓地のフィールド魔法カード1枚を対象に取り、手札に戻す。\n▷ダメージステップでも発動できる。\n▷チェーン2以降の効果処理でフィールドを離れた場合など、フィールドを離れた後に別の処理が続いた場合は、タイミングを逃して発動できない。\n▷メインデッキに戻った場合は発動できない。\n\n■裏側守備表示から戦闘でリバースした場合\n▷裏側守備表示で攻撃され、リバースした後に戦闘で破壊された場合は、環境によって発動できるかが異なる。詳しくはQAを参照。",
  "qa": [
    {
      "question": "裏側守備表示のこのカードが攻撃され、ダメージステップでリバースした後に戦闘で破壊された場合、効果を発動できますか？",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-6XD74KQN",
      "answers": [
        {
          "environments": [
            "1103",
            "1209"
          ],
          "answer": "いいえ、発動できません。戦闘で破壊される場合、ダメージステップに入る前から表側表示で存在している必要があります。"
        },
        {
          "environments": [
            "1402"
          ],
          "answer": "はい、発動できます。ダメージステップで表側表示になった後に戦闘で破壊された場合も、墓地のフィールド魔法を手札に戻す効果を発動できます。"
        }
      ]
    },
    {
      "question": "《イビリチュア・メロウガイスト》の効果でこのカードがデッキに戻った場合、効果を発動できますか？",
      "answer": "いいえ、発動できません。フィールドを離れていますが、メインデッキに戻った場合は、このカードの効果を発動できません。",
      "environments": [
        "1103"
      ],
      "managementId": "R-CD86Y2YZ"
    }
  ]
};
  if (window.RULINGS.some(card => card.name === minefield.name || card.overviewManagementId === minefield.overviewManagementId)) throw new Error("Duplicate Minefield");
  const merrow = window.RULINGS.find(card => card.name === "イビリチュア・メロウガイスト");
  const heading = "■《Ｅ・ＨＥＲＯ アブソルートＺｅｒｏ》";
  if (!merrow?.overview.includes(heading)) throw new Error("Missing Zero section");
  merrow.overview = merrow.overview.replace(heading, "■《マインフィールド》\n▷「フィールドから離れた時」を条件とする効果だが、このカードの効果でメインデッキに戻した場合は発動しない。エクストラデッキに戻る《Ｅ・ＨＥＲＯ アブソルートＺｅｒｏ》とは扱いが異なる。詳しくはQAを参照。\n\n" + heading);
  const index = merrow.qa.findIndex(entry => entry.question.startsWith("このカードの効果で《Ｅ・ＨＥＲＯ アブソルートＺｅｒｏ》"));
  if (index < 0) throw new Error("Missing Zero QA");
  merrow.qa.splice(index, 0, {"question": "このカードの効果で《マインフィールド》をメインデッキに戻した場合、墓地のフィールド魔法を手札に戻す効果は発動しますか？", "answer": "いいえ、発動しません。《マインフィールド》の発動条件は「フィールドから離れた時」ですが、メインデッキに戻った場合は効果を発動できません。\n\nエクストラデッキに戻った場合も効果を発動する《Ｅ・ＨＥＲＯ アブソルートＺｅｒｏ》とは、戻る場所によって扱いが異なります。", "environments": ["1103"], "managementId": "R-BY4L9GLH"});
  window.RULINGS.push(minefield);
})();
