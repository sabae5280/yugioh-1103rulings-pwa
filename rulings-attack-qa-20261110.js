// ドリル・ウォリアー、禁じられた聖杯、幻獣の角にＱ＆Ａを追加。
(function () {
 const additions = {
  "ドリル・ウォリアー": {
    "question": "《ドリル・ウォリアー》の攻撃力を半分にして直接攻撃できる効果の解決後に、《スキルドレイン》や《禁じられた聖杯》が適用された場合、どうなりますか？",
    "managementId": "R-KBD2QW92",
    "answer": "攻撃力の半減は取り消されず、そのターンは引き続き直接攻撃できます。《禁じられた聖杯》の場合は、半減後の攻撃力が400アップします。",
    "environments": [
      "1103"
    ]
  },
  "禁じられた聖杯": {
    "question": "《禁じられた聖杯》の効果が適用されている《ジェネティック・ワーウルフ》に《収縮》を発動した場合、攻撃力はいくつになりますか？",
    "managementId": "R-F4GYIZMD",
    "environments": [
      "1103",
      "1209",
      "1402"
    ],
    "answers": [
      {
        "environments": [
          "1103",
          "1209"
        ],
        "answer": "1000になります。《収縮》によって《禁じられた聖杯》の400アップは打ち消され、元々の攻撃力2000の半分になります。"
      },
      {
        "environments": [
          "1402"
        ],
        "answer": "1400になります。元々の攻撃力2000の半分である1000に、《禁じられた聖杯》の400アップを加えます。"
      }
    ]
  },
  "幻獣の角": {
    "question": "《幻獣の角》を装備した《ジェネティック・ワーウルフ》に《収縮》を発動した場合、攻撃力はいくつになりますか？",
    "managementId": "R-PQKMWN7K",
    "answer": "1800になります。元々の攻撃力2000を《収縮》で半分の1000にし、《幻獣の角》の800アップを加えます。",
    "environments": [
      "1103"
    ]
  }
};
 for (const [name, entry] of Object.entries(additions)) {
  const card = window.RULINGS.find(item => item.name === name);
  if (!card) throw new Error("Missing card: " + name);
  (card.qa ||= []).push(entry);
 }
})();
