// インヴェルズ3枚の追加とテーマタグ・号令の説明文の整理。
(function () {
  const cards = [
  {
    "name": "インヴェルズ・ギラファ",
    "reading": "インヴェルズギラファ",
    "type": "monster",
    "cardClass": "effect",
    "monsterTags": [
      "効果モンスター"
    ],
    "race": "悪魔族",
    "attribute": "闇属性",
    "level": 7,
    "environments": [
      "1103",
      "1209",
      "1402"
    ],
    "image": "./inverz-girastag-1103.jpg",
    "overviewManagementId": "79059",
    "source": "ユーザー提供資料",
    "specialTags": [
      "【インヴェルズ】",
      "【ヴェルズ】"
    ],
    "overview": "■「インヴェルズ」1体をリリースする召喚方法\n▷「インヴェルズ」モンスター1体をリリースし、表側攻撃表示でアドバンス召喚できる。この召喚方法は効果として扱わない。\n▷この方法で裏側守備表示でセットすることはできない。\n▷裏側守備表示の「インヴェルズ」モンスターもリリースできる。\n\n■相手のカードを墓地へ送り、回復する効果\n▷「インヴェルズ」モンスターをリリースしてアドバンス召喚に成功した時に、モンスターゾーンで任意に発動できる誘発効果。\n▷相手フィールドのカード1枚を対象に取り、墓地へ送る。墓地へ送った場合、自分は1000ライフポイント回復する。\n▷墓地へ送る処理と回復する処理は、同時に行う扱い。",
    "qa": [
      {
        "question": "「インヴェルズ」モンスター1体と、それ以外のモンスター1体をリリースしてアドバンス召喚した場合も、効果を発動できますか？",
        "answer": "はい、発動できます。",
        "environments": [
          "1103"
        ],
        "managementId": "R-IIC03PZJ"
      },
      {
        "question": "対象のカードを墓地へ送る処理と、ライフポイントを回復する処理は同時に行いますか？",
        "answer": "はい、同時に行う扱いです。",
        "environments": [
          "1103"
        ],
        "managementId": "R-SA4P0RB6"
      },
      {
        "question": "効果処理時に対象のカードがフィールドを離れており、墓地へ送れなかった場合、ライフポイントを回復しますか？",
        "answer": "いいえ、回復しません。",
        "environments": [
          "1103"
        ],
        "managementId": "R-CYHS8HUR"
      }
    ]
  },
  {
    "name": "インヴェルズの門番",
    "reading": "インヴェルズノモンバン",
    "type": "monster",
    "cardClass": "effect",
    "monsterTags": [
      "効果モンスター"
    ],
    "race": "悪魔族",
    "attribute": "闇属性",
    "level": 4,
    "environments": [
      "1103",
      "1209",
      "1402"
    ],
    "image": "./inverz-gatekeeper-1103.jpg",
    "overviewManagementId": "79060",
    "source": "ユーザー提供資料",
    "specialTags": [
      "【インヴェルズ】",
      "【ヴェルズ】"
    ],
    "overview": "■カード名の扱い\n▷「インヴェルズ」モンスターであり、「ヴェルズ」モンスターとしても扱う。\n\n■通常召喚を追加する効果\n▷モンスターゾーンで適用する永続効果。\n▷このカードが表側表示で存在する時に、「インヴェルズ」モンスターが表側表示でアドバンス召喚に成功した場合、そのターン、自分は通常召喚に加えて1度だけモンスターを通常召喚できる。\n▷「インヴェルズ」モンスターのアドバンス召喚後にこのカードを出しても、そのアドバンス召喚によって効果を適用することはできない。\n▷このカードが複数体存在していても、この効果で追加できる通常召喚は1ターンに1度のみ。",
    "qa": [
      {
        "question": "「インヴェルズ」モンスターが表側表示でアドバンス召喚に成功した後、このカードを特殊召喚しました。そのターンにもう1度通常召喚できますか？",
        "answer": "いいえ、そのアドバンス召喚によっては効果を適用できません。このカードが表側表示で存在する時に、「インヴェルズ」モンスターが表側表示でアドバンス召喚に成功する必要があります。",
        "environments": [
          "1103"
        ],
        "managementId": "R-1OQ5V0X6"
      },
      {
        "question": "このカードの効果で追加の通常召喚を行う際、このカード自身をリリースしてアドバンス召喚できますか？",
        "answer": "はい、できます。",
        "environments": [
          "1103"
        ],
        "managementId": "R-68QEV3HS"
      },
      {
        "question": "このカードの効果で追加の通常召喚を行えるターンに、《二重召喚》を発動した場合、通常召喚は合計何回できますか？",
        "answer": "合計3回できます。《二重召喚》による2回の通常召喚に加え、このカードの効果でもう1回通常召喚できます。",
        "environments": [
          "1103"
        ],
        "managementId": "R-TMGVR47G"
      }
    ]
  },
  {
    "name": "インヴェルズの斥候",
    "reading": "インヴェルズノセッコウ",
    "type": "monster",
    "cardClass": "effect",
    "monsterTags": [
      "効果モンスター"
    ],
    "race": "悪魔族",
    "attribute": "闇属性",
    "level": 1,
    "environments": [
      "1103",
      "1209",
      "1402"
    ],
    "image": "./inverz-scout-1103.jpg",
    "overviewManagementId": "79061",
    "source": "ユーザー提供資料",
    "specialTags": [
      "【インヴェルズ】",
      "【ヴェルズ】"
    ],
    "overview": "■カード名の扱い\n▷「インヴェルズ」モンスターであり、「ヴェルズ」モンスターとしても扱う。\n\n■墓地から自身を特殊召喚する効果\n▷墓地で発動する、対象を取らない起動効果。自分フィールドに魔法・罠カードが存在しない場合、自分のメインフェイズ1の開始時にのみ発動できる。\n▷墓地にこのカードが複数体存在していても、発動できるのはいずれか1体のみ。\n▷この効果を発動するターン、自分はこの効果による特殊召喚以外の特殊召喚を行えない。\n\n■リリース・シンクロ素材の制限\n▷モンスターゾーンで適用する永続効果。「インヴェルズ」モンスターのアドバンス召喚以外のためにはリリースできず、シンクロ素材にもできない。\n▷効果が無効になっている場合や、裏側表示の場合は、リリースの制限は適用されない。",
    "qa": [
      {
        "question": "墓地から自身を特殊召喚する効果の発動を《光と闇の竜》で無効にされた場合、そのターンに他の特殊召喚を行えますか？",
        "answer": "はい、行えます。効果の発動が無効になっているため、特殊召喚の制限は適用されません。",
        "environments": [
          "1103"
        ],
        "managementId": "R-YROQSOUA"
      },
      {
        "question": "《スキルドレイン》が適用されている場合、このカードをシンクロ素材にしたり、「インヴェルズ」以外のモンスターのアドバンス召喚のためにリリースしたりできますか？",
        "answer": "はい、できます。リリース・シンクロ素材の制限は永続効果のため、《スキルドレイン》で無効になります。",
        "environments": [
          "1103"
        ],
        "managementId": "R-Q0G6PBYZ"
      },
      {
        "question": "裏側表示のこのカードを、「インヴェルズ」モンスターのアドバンス召喚以外のためにリリースできますか？",
        "answer": "はい、できます。裏側表示では、リリースを制限する永続効果は適用されません。",
        "environments": [
          "1103"
        ],
        "managementId": "R-38LI8JM7"
      }
    ]
  }
];
  for (const card of cards) {
    if (window.RULINGS.some(existing => existing.name === card.name || existing.overviewManagementId === card.overviewManagementId)) throw new Error("Duplicate new card");
    window.RULINGS.push(card);
  }
  for (const card of window.RULINGS) {
    const tags = new Set(card.specialTags || []);
    if (card.name.includes("インヴェルズ")) {
      tags.add("【インヴェルズ】");
      tags.add("【ヴェルズ】");
    }
    if (card.type === "monster" && card.name.startsWith("ナチュル")) tags.add("【ナチュル】");
    if (tags.size) card.specialTags = [...tags];
  }
  const illusionist = window.RULINGS.find(card => card.name === "幻想召喚師");
  const commandQa = illusionist?.qa.find(entry => entry.managementId === "R-6RDEA65Q");
  const oldText = "《王宮の号令》はリバース効果の発動・解決を無効にする一方";
  if (!commandQa?.answer.includes(oldText)) throw new Error("Unexpected Royal Command QA");
  commandQa.answer = commandQa.answer.replace(oldText, "《王宮の号令》はリバース効果の発動・効果を無効にする一方");
})();
