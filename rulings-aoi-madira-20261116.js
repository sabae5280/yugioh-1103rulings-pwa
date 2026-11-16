// 水霊術－「葵」の追加と、マディラの巻き戻しQAの修正。
(function () {
 const patch = {
  "card": {
    "name": "水霊術－「葵」",
    "reading": "スイレイジュツアオイ",
    "type": "trap",
    "trapType": "通常罠",
    "environments": [
      "1103",
      "1209",
      "1402"
    ],
    "image": "./spiritual-water-art-aoi-1103.jpg",
    "overviewManagementId": "79073",
    "source": "ユーザー提供資料",
    "overview": "■発動条件・コスト\n▷ダメージステップには発動できない。\n▷発動時にコストとして、自分のモンスターゾーンの水属性モンスター1体をリリースする。裏側表示の水属性モンスターもリリースできる。\n\n■手札を墓地へ送る効果\n▷相手の手札を確認し、その中から1枚を選んで墓地へ送る。「捨てる」処理ではない。",
    "qa": [
      {
        "question": "このカードの効果で相手の手札の「暗黒界」モンスターを墓地へ送った場合、そのモンスターの「効果で手札から捨てられた」ことを条件とする効果は発動しますか？",
        "answer": "いいえ、発動しません。このカードの効果は手札を「墓地へ送る」処理であり、「捨てる」処理ではないためです。",
        "environments": [
          "1103"
        ],
        "managementId": "R-66A13Z36"
      },
      {
        "question": "このカードにチェーンして、相手は手札の《ヂェミナイ・デビル》の効果を発動できますか？",
        "answer": "いいえ、発動できません。このカードは手札を「墓地へ送る」効果であり、《ヂェミナイ・デビル》の発動条件となる、手札を「捨てる」効果ではないためです。",
        "environments": [
          "1103"
        ],
        "managementId": "R-AU7KUP23"
      }
    ]
  },
  "madiraQa": {
    "managementId": "R-RDWL8KAZ",
    "question": "このカードの攻撃宣言時に《サンダー・ブレイク》などで攻撃対象のモンスターを破壊しました。そのチェーン処理終了後や、巻き戻しで攻撃対象を選び直した後に、相手はカードや効果を発動できますか？",
    "answer": "いいえ、発動できません。巻き戻しでこのカードが攻撃対象を選び直す、または直接攻撃を続ける場合、相手はダメージステップ終了時までカードや効果を発動できません。"
  }
};
 const madira = window.RULINGS.find(card => card.name === "ジェムナイト・マディラ");
 const entry = madira?.qa.find(qa => qa.managementId === patch.madiraQa.managementId);
 if (!entry) throw new Error("Missing Madira replay QA");
 Object.assign(entry, patch.madiraQa);
 if (window.RULINGS.some(card => card.name === patch.card.name || String(card.overviewManagementId) === patch.card.overviewManagementId)) throw new Error("Duplicate Aoi");
 window.RULINGS.push(patch.card);
})();
