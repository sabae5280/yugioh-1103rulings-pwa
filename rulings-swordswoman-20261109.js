// アマゾネスの剣士の追加と光と闇の竜・サクリファイスの整理。
(function () {
 const newCard = {
  "name": "アマゾネスの剣士",
  "reading": "アマゾネスのけんし",
  "type": "monster",
  "cardClass": "effect",
  "monsterTags": [
    "効果モンスター"
  ],
  "race": "戦士族",
  "attribute": "地属性",
  "level": 4,
  "specialTags": [
    "【アマゾネス】"
  ],
  "image": "./amazoness-swords-woman-1103.jpg",
  "environments": [
    "1103",
    "1209",
    "1402"
  ],
  "overviewManagementId": "79049",
  "source": "ユーザー提供資料",
  "overview": "■戦闘ダメージを相手が代わりに受ける効果\n▷モンスターゾーンで適用する永続効果。\n▷このカードの戦闘で自分が受ける戦闘ダメージは、代わりに相手が受ける。相手が受けるダメージも戦闘ダメージとして扱う。\n▷このカード自身がその戦闘で破壊される場合でも適用する。",
  "qa": [
    {
      "question": "このカードと《ＢＦ－アーマード・ウィング》が戦闘を行った場合、戦闘ダメージはどうなりますか？",
      "answer": "お互いの戦闘ダメージは0になります。このカードの効果で相手が代わりに受けるダメージも戦闘ダメージなので、《ＢＦ－アーマード・ウィング》の効果で防がれます。",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-TNKZ6DGI"
    },
    {
      "question": "相手の《アマゾネスの剣士》の効果で戦闘ダメージを受ける場合、《クリボー》や《トラゴエディア》の効果を発動できますか？",
      "answer": "はい、《クリボー》で戦闘ダメージを防ぐことができます。実際に戦闘ダメージを受けた場合は、《トラゴエディア》の特殊召喚効果を発動できます。",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-KKH5ECTU"
    },
    {
      "question": "自分が《和睦の使者》を発動したターンに、自分の《アマゾネスの剣士》で相手の攻撃表示の《青眼の白龍》を攻撃した場合、戦闘ダメージはどうなりますか？",
      "answer": "相手が1500の戦闘ダメージを受けます。ダメージを受けるのは相手なので、自分の《和睦の使者》では防がれません。",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-30Y077FF"
    },
    {
      "question": "自分の《アマゾネスの剣士》で、相手の守備表示の《アステカの石像》を攻撃した場合、相手が受けるダメージはいくつですか？",
      "answer": "1000です。攻撃力と守備力の差の500が《アステカの石像》の効果で倍になり、その戦闘ダメージを相手が代わりに受けます。",
      "environments": [
        "1103",
        "1209",
        "1402"
      ],
      "managementId": "R-7U66D39P"
    }
  ]
};
 const dragonQa = {
  "question": "《光と闇の竜》の効果で、《カードガンナー》の攻撃力を上げる効果など、そのカードごとに1ターンに1度発動できるモンスター効果の発動を無効にした場合、同じターンにその効果をもう一度発動できますか？",
  "answer": "いいえ、発動できません。《カードガンナー》のような効果は、発動を無効にされても、そのターンの発動回数を使ったものとして扱います。同じカードがそのままフィールドに表側表示で存在する限り、そのターン中に再び発動することはできません。",
  "environments": [
    "1103"
  ],
  "managementId": "R-NLDA07EK"
};
 if (window.RULINGS.some(item => item.name === newCard.name)) throw new Error("Duplicate card: " + newCard.name);
 const dragon = window.RULINGS.find(item => item.name === "光と闇の竜");
 const after = dragon.qa.findIndex(entry => entry.managementId === "R-L4FSS");
 if (after < 0) throw new Error("Missing Light and Darkness Dragon Q&A");
 dragon.qa.splice(after + 1, 0, dragonQa);
 const relinquished = window.RULINGS.find(item => item.name === "サクリファイス");
 const oldText = "\n\n■能力値を変更された後、装備が外れた場合\n▷その場合でも、攻撃力・守備力は固定された数値のままとなる。";
 if (!relinquished.overview.includes(oldText)) throw new Error("Missing Relinquished overview section");
 relinquished.overview = relinquished.overview.replace(oldText, "\n▷その後に装備が外れても、攻撃力・守備力は半分になった数値のまま。");
 window.RULINGS.push(newCard);
})();
