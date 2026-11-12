// ナチュル・エクストリオを追加し、クリボーと無効化するモンスターの戦闘ダメージQAを整理。
(function () {
  const exterio = {
  "name": "ナチュル・エクストリオ",
  "reading": "ナチュルエクストリオ",
  "type": "monster",
  "cardClass": "fusion",
  "monsterTags": [
    "融合",
    "効果モンスター"
  ],
  "race": "獣族",
  "attribute": "地属性",
  "level": 10,
  "environments": [
    "1103",
    "1209",
    "1402"
  ],
  "image": "./naturia-exterio-1103.jpg",
  "overviewManagementId": "79058",
  "source": "ユーザー提供資料",
  "summonRule": true,
  "damageStepGuide": true,
  "overview": "■融合召喚について\n▷融合召喚する場合、《ナチュル・ビースト》と《ナチュル・パルキオン》を融合素材にする必要がある。この制限は効果として扱わない。\n▷融合素材代用モンスターは使用できない。《幻想召喚師》等によって、融合召喚以外の方法で特殊召喚することはできる。\n\n■魔法・罠カードの発動を無効にする効果\n▷モンスターゾーンで発動できる誘発即時効果。魔法・罠カードの発動に直接チェーンし、その発動を無効にして破壊する。\n▷既に表側表示の魔法・罠カードや、墓地の魔法・罠カードの「効果の発動」には発動できない。\n▷ダメージステップでも発動できる。同一チェーン上で複数回発動することもできる。\n▷処理時にこのカードがモンスターゾーンに表側表示で存在しなければ、発動を無効にして破壊する処理は行わない。\n\n■発動コスト\n▷自分の墓地のカード1枚を除外し、その後、自分のデッキの一番上のカード1枚を墓地へ送る。\n▷先にデッキからカードを墓地へ送り、そのカードを除外して発動することはできない。",
  "qa": [
    {
      "question": "既に表側表示の永続魔法・永続罠や、墓地の魔法・罠カードが効果を発動した場合、このカードで無効にできますか？",
      "answer": "いいえ、できません。このカードは魔法・罠カードの「カードの発動」にのみ対応し、「効果の発動」には対応しません。",
      "environments": [
        "1103"
      ],
      "managementId": "R-YCI80Q3U"
    },
    {
      "question": "このカードの効果にチェーンして《月の書》や《強制脱出装置》が発動し、処理時にこのカードがモンスターゾーンに表側表示で存在しなくなった場合、魔法・罠カードの発動を無効にできますか？",
      "answer": "いいえ、発動を無効にする処理も、破壊する処理も行いません。",
      "environments": [
        "1103"
      ],
      "managementId": "R-DLU24GCB"
    },
    {
      "question": "自分の墓地にカードが存在しない場合、先にデッキの一番上のカードを墓地へ送り、そのカードを除外して効果を発動できますか？",
      "answer": "いいえ、発動できません。先に墓地のカードを除外し、その後にデッキの一番上のカードを墓地へ送る必要があります。",
      "environments": [
        "1103"
      ],
      "managementId": "R-1F1ZVIEF"
    }
  ]
};
  const kuriboh = window.RULINGS.find(card => card.name === "クリボー");
  const doom = window.RULINGS.find(card => card.name === "死霊騎士デスカリバー・ナイト");
  const assault = window.RULINGS.find(card => card.name === "スターダスト・ドラゴン／バスター");
  const kuribohQa = kuriboh?.qa.find(entry => entry.managementId === "R-HQ8J6AAE");
  const doomIndex = doom?.qa.findIndex(entry => entry.managementId === "R-LSSL4P12");
  if (!kuribohQa || !doom || !assault || doomIndex < 0 || window.RULINGS.some(card => card.name === exterio.name)) throw new Error("Unexpected card data");
  Object.assign(kuribohQa, {
  "question": "このカードの効果を、攻撃している《死霊騎士デスカリバー・ナイト》や《スターダスト・ドラゴン／バスター》に無効にされました。攻撃モンスターが自身をリリースしてフィールドを離れていても、戦闘ダメージを受けますか？",
  "answer": "はい、受けます。このカードは[DS表③ダメージ計算時]の、戦闘ダメージを受ける直前に発動します。その時点でダメージの数値が決まっているため、攻撃モンスターが自身をリリースしてフィールドを離れても、決まっていた戦闘ダメージを受けます。\n\nこれはマスタールール2での特殊裁定です。"
});
  doom.qa.splice(doomIndex + 1, 0, {
  "question": "このカードの攻撃に対して相手が《クリボー》の効果を発動し、このカードが自身をリリースして、その発動を無効にしました。相手は戦闘ダメージを受けますか？",
  "answer": "はい、受けます。《クリボー》が効果を発動する時点ではダメージの数値が決まっているため、このカードがフィールドを離れても、相手は決まっていた戦闘ダメージを受けます。\n\nこれはマスタールール2での特殊裁定です。",
  "environments": [
    "1103"
  ],
  "managementId": "R-RC9SZMNE"
});
  assault.qa.splice(2, 0, {
  "question": "このカードの攻撃に対して相手が《クリボー》の効果を発動し、このカードが自身をリリースして、その発動を無効にしました。相手は戦闘ダメージを受けますか？",
  "answer": "はい、受けます。《クリボー》が効果を発動する時点ではダメージの数値が決まっているため、このカードがフィールドを離れても、相手は決まっていた戦闘ダメージを受けます。\n\nこれはマスタールール2での特殊裁定です。",
  "environments": [
    "1103"
  ],
  "managementId": "R-X11X6C3U"
});
  window.RULINGS.push(exterio);
})();
