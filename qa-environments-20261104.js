// QAの掲載開始環境と、対応する全環境を分けて扱う。
// 元のenvironmentsは新規裁定の抽出に使うため変更しない。
(function () {
  const order = ['1103', '1209', '1402'];
  const normalizeName = value => String(value || '').normalize('NFKC').toLowerCase()
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/[\s・･•·－―—–ー_＿《》「」『』【】-]/g, '');
  const firstRank = values => {
    const ranks = (values || []).map(value => order.indexOf(value)).filter(value => value >= 0);
    return ranks.length ? Math.min(...ranks) : 0;
  };
  const introductions = new Map();
  const register = (name, rank) => introductions.set(normalizeName(name), rank);
  for (const [name, data] of Object.entries(window.CARD_METADATA || {})) register(name, firstRank(data.environments));
  for (const item of window.RULINGS) {
    if (item.type !== 'category') register(item.name, firstRank(item.environments || window.CARD_METADATA?.[item.name]?.environments));
  }
  // 未掲載の参照カード・略称も含めた、1103より後の初登場環境。
  // 海外先行カードは日本OCGの発売時期を基準とする。
  const laterReferences = {
    '1209': [
      'アイアンコール', 'イリュージョン・スナッチ', 'オーバーレイ・イーター',
      'ガガガガール', 'セイクリッド・レオニス', 'ソウルドレイン', 'タスケナイト',
      '侵略の汎発感染', '地霊神グランソイル', '紋章獣ベルナーズ・ファルコン',
      '聖刻龍王－アトゥムス', '魔導書整理', 'グルフ', 'センチピード', 'ホーネット',
      '海皇の竜騎隊', '竜騎隊', '海皇の重装兵', '重装兵', 'マドルチェ', '先史遺産',
      '炎星', 'ＺＷ－一角獣皇槍', 'エヴォルカイザー・ドルカ', '白竜の忍者',
      '炎王', '炎舞', '炎舞－「天セン」'
    ],
    '1402': [
      'オレイカルコスの結界', 'サタンクロース', '手違い', '星態龍',
      '神竜騎士フェルグラント', '閃珖竜 スターダスト',
      'ＣＮｏ.３９ 希望皇ホープレイ・ヴィクトリー', 'ＲＵＭ－アストラル・フォース',
      '炎舞－「揺光」'
    ]
  };
  for (const [environment, names] of Object.entries(laterReferences)) {
    for (const name of names) register(name, order.indexOf(environment));
  }
  const splitAnswers = new WeakSet();
  for (const item of window.RULINGS) for (const entry of item.qa || []) {
    for (const answer of entry.answers || []) splitAnswers.add(answer);
  }
  const cache = new WeakMap();
  window.supportedQaEnvironments = function (entry, item) {
    const original = entry.environments || item.environments || ['1103'];
    // 時代別の回答は親QA・個別回答とも指定をそのまま維持する。
    if (entry.answers?.length || splitAnswers.has(entry)) return original;
    // 1103・1209のみ等、終了環境が明示された既存の区分も維持する。
    if (original.length > 1 && !original.includes('1402')) return original;
    if (cache.has(entry)) return cache.get(entry);
    let start = Math.max(firstRank(original), firstRank(item.environments));
    const ownRank = introductions.get(normalizeName(item.name));
    if (ownRank !== undefined) start = Math.max(start, ownRank);
    const text = normalizeName(`${entry.question || ''}\n${entry.answer || ''}`);
    for (const [name, rank] of introductions) {
      if (rank > start && name && text.includes(name)) start = rank;
    }
    const result = order.slice(start);
    cache.set(entry, result);
    return result;
  };
})();
