遊戯王1103環境 裁定集 更新パッチ
サイト共有ボタン・五十音ナビ更新

【反映方法】
このZIPを展開し、含まれる5つのファイルをGitHubリポジトリのトップ階層へ上書き・追加してください。
追加ファイル：card-readings.js
上書きファイル：index.html / app.js / styles.css / sw.js

今回の変更
・トップ左上に共有ボタンを追加。カードを開いているかどうかに関係なく、サイトのトップURLを共有します。対応ブラウザでは共有メニューを開き、それ以外はトップURLをコピーします。検索条件やカード表示状態は共有URLに含めません。
・検索欄の「共通効果」の下に五十音10行のナビを1列で表示します。該当カードがない行は無効表示です。
・カード一覧を五十音の行ごとに見出しで区切り、ナビから見出しへ移動できます。検索中は行ナビを隠します。
・英字・数字や読みの未設定だったカードに読みを追加し、行の先頭に誤表示される状態を解消します。
・Service Workerのキャッシュ番号を v28 に更新します。

この更新パッチは、既存のカードデータ（ア行～は行）を置き換えません。GitHub Pages反映後、ブラウザを再読み込みしてください。

【読みの確認に使用したKONAMI公式カードデータベース】
XX－セイバー ガトムズ：https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=8334&ope=2&request_locale=ja
D.D.クロウ：https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=6980&ope=2&request_locale=ja
W星雲隕石：https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=9551&ope=2&request_locale=ja
TGX1－HL：https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=9524&ope=2&request_locale=ja
TG1－EM1：https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=9541&ope=2&request_locale=ja
TGカード名の読み：https://www.db.yugioh-card.com/yugiohdb/faq_search.action?fid=24000&keyword=&ope=5&request_locale=ja

TGX1－HLおよびTG1－EM1は公式DBが独立したルビを表示しないため、TGの公式読み「テックジーナス」を反映し、後続の英字・数字を文字読みで補っています。
