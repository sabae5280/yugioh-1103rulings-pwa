// 群雄割拠：効果を受けないモンスターと一時除外から戻るモンスターのQA。
(function () {
 const additions = {
  "immune": {
    "question": "③に関して、自分フィールドに《ジェネティック・ワーウルフ》（獣戦士族）と、《禁じられた聖槍》によって罠カードの効果を受けない状態の《セイバーザウルス》（恐竜族）が存在します。このカードを発動した場合、どう処理しますか？",
    "answer": "残す種族を1つ選び、《ジェネティック・ワーウルフ》か《セイバーザウルス》のどちらかを墓地へ送ります。\n\nこのカードはモンスターが受ける効果ではないため、罠カードの効果を受けない《セイバーザウルス》も、墓地へ送るモンスターに選べます。",
    "environments": [
      "1103"
    ],
    "managementId": "R-X1XCB59F"
  },
  "returning": {
    "question": "《亜空間物質転送装置》で除外したモンスターを戻す際、自分フィールドにこのカードと、そのモンスターとは種族の異なる表側表示モンスターが存在します。戻すモンスターは除外されたままになりますか？",
    "answer": "いいえ、そのモンスターは墓地へ送られます。除外されたままにはなりません。",
    "environments": [
      "1103"
    ],
    "managementId": "R-50SJ0L2W"
  }
};
 const card = window.RULINGS.find(item => item.name === "群雄割拠");
 if (!card) throw new Error("Missing Rivalry");
 const immuneIndex = card.qa.findIndex(qa => qa.managementId === "R-AE2R8");
 if (immuneIndex < 0) throw new Error("Missing section 3 QA");
 card.qa.splice(immuneIndex + 1, 0, additions.immune);
 const returnIndex = card.qa.findIndex(qa => qa.question.startsWith("⑧"));
 if (returnIndex < 0) throw new Error("Missing section 8 QA");
 card.qa.splice(returnIndex, 0, additions.returning);
})();
