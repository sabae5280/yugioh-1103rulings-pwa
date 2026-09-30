遊戯王1103環境 裁定集 更新パッケージ（2026-10-01修正版）

カオス・ソーサラーの管理ID「R-W79LJTECPZ」のQ&Aを、優先順による並べ替え後も一番下に表示する修正を含む更新パッケージです。ら行のカード・裁定・画像の追加と修正、カード名・概要IDのコピー機能、Q&A内画像表示、iPhoneホーム画面版の共有ボタン表示修正も含みます。

反映手順（GitHub Desktop）
1. ZIPを展開します。
2. 展開したフォルダーの中身を、リポジトリ直下へコピーします。外側のフォルダーごと配置しないでください。
3. app.js、index.html、styles.css、sw.js、rulings-r-row.js はリポジトリ直下の同名ファイルへ上書きします。
4. images/r-row 内の画像を、リポジトリ直下の images/r-row へ追加します。同名ファイルは上書きします。
5. GitHub DesktopのChangesで app.js、sw.js、rulings-r-row.js と追加画像が表示されることを確認し、コミットしてPush originします。

サイトが読み込むのはリポジトリ直下の app.js です。app.js.js ではありません。ZIP内のREADME.txtはアップロード不要です。Service Workerのキャッシュ名はv36です。
