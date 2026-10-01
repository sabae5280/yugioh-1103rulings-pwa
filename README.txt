共有ボタンのiPhoneホーム画面版表示修正

iPhoneのノッチ・ステータスバーの安全領域を避けるよう、モバイル表示でヘッダー内の共有ボタンとメニューを下げました。Service Workerキャッシュ名はv37へ更新しています。

反映手順
1. ZIPを展開します。
2. styles.css と sw.js を、GitHubリポジトリ直下の同名ファイルへ上書きします。ZIP外側のフォルダーごと置かないでください。
3. GitHub DesktopのChangesに styles.css と sw.js が出ていることを確認し、コミットしてPush originします。
4. GitHub Pagesのデプロイ成功後、iPhoneホーム画面のサイトを完全終了し、Safariでサイトを開いて再読み込みします。
