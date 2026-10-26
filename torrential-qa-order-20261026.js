// 全データ・追記の読み込み後に、激流葬のQ&Aだけを整理する。
(function () {
  const card = window.RULINGS.find(item => item.name === "激流葬");
  if (!card) return;
  const appended = [
  {
    "question": "このカードで《E・HERO The シャイニング》と《クリッター》を同時に破壊した場合、それぞれの効果を発動できますか？",
    "answer": "はい、チェーンを組み、両方の効果を発動できます。",
    "environments": [
      "1103"
    ],
    "relatedFrom": "E・HERO The シャイニング",
    "managementId": "R-CCF8I"
  },
  {
    "question": "このカードの発動に《スターライト・ロード》がチェーンされた場合、その《スターライト・ロード》に《王家の呪い》を発動できますか？",
    "answer": "はい、発動できます。",
    "environments": [
      "1103"
    ],
    "relatedFrom": "王家の呪い",
    "managementId": "R-SBZQ5JH3VF"
  },
  {
    "question": "《オベリスクの巨神兵》の召喚に成功したタイミングで、このカードを発動できますか？",
    "answer": "いいえ、《オベリスクの巨神兵》の効果により、召喚成功時にはこのカードを発動できません。",
    "environments": [
      "1103"
    ],
    "relatedFrom": "オベリスクの巨神兵",
    "managementId": "R-YAUT657ZQH"
  }
];
  for (const original of appended) {
    const entry = card.qa.find(qa => qa.managementId === original.managementId || qa.question === original.question);
    if (entry) entry.managementId = original.managementId;
  }
  const order = ["R-YAUT657ZQH", "R-VHNUZF2W36", "R-DDP9TDMA5E", "R-5GHQ7Y6GKH", "R-EW6NBJATH9", "R-FDBRQ45JFN", "R-H8EYBUCJ4U", "R-SLXWR3RJQM", "R-SBZQ5JH3VF", "R-CCF8I"];
  const positions = new Map(order.map((id, index) => [id, index]));
  card.qa.sort((a, b) => (positions.get(a.managementId) ?? order.length) - (positions.get(b.managementId) ?? order.length));
})();
