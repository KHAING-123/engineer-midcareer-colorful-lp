# CSV入力によるLP生成の検証結果(1件変更テスト)

## 1. 目的と範囲
- `generate-colorful-lp` Skill に追加した CSV 入力(`docs/09-spreadsheet-input-guide.md`)で、実際に LP の生成・Build・起動ができるかを確認した。
- 確認したのは**1件変更のテスト1回**だけ。ほかの CSV(複数件の変更、エラーを含む CSV など)を Skill 経由で実行した結果は、この記録には含まれない。

## 2. 実行内容
- 実行コマンド：`/generate-colorful-lp docs/tests/colorful-text-input-test.csv output/colorful-csv-test`(ユーザーが実行)
- Input：docs/tests/colorful-text-input-test.csv(Google Sheets から書き出した CSV)
  - 形式：UTF-8、BOM なし、行末 CRLF、末尾改行なし、29行
- 出力先：output/colorful-csv-test
- 操作：**変更1件・維持13件**(データ14件)
- 実際の変更キー：**`jobsSection.title` のみ**
  - 変更前：`PREAIでの仕事`
  - 変更後：`【CSV検証用】PREAIでの仕事`
  - `\n` の扱い：強制(改行の増減は0)

## 3. 結果
### CSV の検証(スクリプト `read-csv-input.mjs`)
- 検証成功(`ok: true`、終了コード 0)。**エラー0件、警告0件**。
- これは CSV の検証結果であり、次項の `npm ci` の警告とは別。

### 複製・反映・差分確認
- 複製直後(手順6-2)：`src/`、設定ファイル、`index.html`、`.gitignore`、`public/` が複製元と一致。除外対象(`node_modules`・`dist`・ZIP など)は含まれない。
- 反映(スクリプト `apply-changes.mjs`)：終了コード 0。`lpContent.js` の101行だけを置き換えた。
- 反映後の差分(手順8)：
  - `diff -rq` の差分は `src/data/lpContent.js` だけ。行の差分は101行の1行だけ。
  - Node での比較で、値が異なるキーは `jobsSection.title` のみ。値は期待値(`【CSV検証用】PREAIでの仕事`)と一致。
  - 設定ファイル、`index.html`、`public/` は複製元と同じ。
  - `frontend/` 側の `jobsSection.title` は変わらず `PREAIでの仕事`。

### 依存導入・Build・起動
- `npm ci`：**1回で成功**。
  - 警告：`esbuild@0.28.2` の postinstall が `allowScripts` で許可されていない、という npm の警告(`npm warn install-scripts`)。**CSV の検証警告(0件)とは別の、npm 側の警告。**
- Build：**成功**(2.37秒)。ログに警告なし。
- 開発サーバー：**ポート 5175**、`/` は **HTTP 200**。配信される `lpContent.js` に「【CSV検証用】」が1箇所あった(文字列の確認であり、表示の確認ではない)。
  - 5173・5174 は以前のサーバーが使用中だったため避けた。既存のサーバーは停止していない(200 のまま)。

### 時間(`date +%s` の差。手順0の開始から数えた経過時間)
| 区間 | 経過 |
|---|---|
| 資料・Input 読込完了 | 12秒 |
| 照合(CSV検証)完了 | 14秒 |
| 複製完了 | 26秒 |
| 反映・差分確認完了 | 27秒 |
| `npm ci` 完了 | 35秒 |
| Build 完了 | 38秒 |
| 開発サーバー応答確認 | 47秒 |

- **資料読込込みの合計：47秒**(うち資料の読込：12秒)。
- **ブラウザでの確認時間は、この計測に含まれない。**

### 元データ
- `frontend/`、既存の `output/`(他の5フォルダ)、`docs/01〜03`、`docs/06`、CSV 雛形、Input の CSV、`docs/archive/`、ZIP のハッシュと Git 状態は、作業前後で同じ(変更なし)。作業前から `frontend/engineer-opportunity.zip` に変更があった。

## 4. ユーザーによる画面確認(ブラウザ)
次の5項目を、ユーザーが確認済み(すべて OK)。
1. CSV の見出し反映(「【CSV検証用】PREAIでの仕事」)
2. PC
3. SP 390px
4. SP 375px
5. Opening・メニュー・ナビ

## 5. 検証の種類の区別
| 種類 | 内容 | 状態 |
|---|---|---|
| スクリプトの単体テスト | `read-csv-input.mjs`・`apply-changes.mjs` を、一時領域のテスト用 CSV・コピーした `lpContent.js` で実行(48件。形式の違い、エラー検知、値の保持、書き込みの拒否など。`docs/09` の「10.」) | 実施済み(LP は生成していない) |
| Skill 経由の実行 | 上記「2.」の1回。CSV の検証成功 → 複製 → 反映 → `npm ci` → Build → 起動 | **今回実施済み(1件変更のみ)** |
| ユーザーの画面確認 | 上記「4.」の5項目 | 実施済み(1件変更のみ) |
| Skill 経由でのエラー時の停止 | CSV の検証エラー時に、Skill が出力フォルダを作らずに停止すること | **未実施**(スクリプトのエラー検知は単体テストで確認済み) |

## 6. 未確認・未対応
- 確認していないこと(確認済みにしない)：
  - 画像内文字(Hero・Members・最終CTA)と alt・資料の一致
  - optimized の WebP と元画像の内容の一致
  - 素材の使用条件
  - アンカー移動時の位置、画像の width/height 属性と実寸のずれの影響
  - 実際の案件の文章での折り返し・はみ出し(今回は「【CSV検証用】」を付けた見出し1件のみ)
  - 複数件の変更、`membersSection.title`(改行が「候補」の項目)の変更など、1件変更以外のパターンの Skill 経由の実行
  - Google Sheets 上でのプルダウン・条件付き書式・保護の設定の動作
- 未対応：Google Sheets との API 連携(CSV の手動の書き出しのみ)、画像の差し替え、カード・リンク・色・デザイン選択、他の Design Pattern。
- 今後決める事項(決定済みとして扱わない)：応募リンクの有無、公開時の robots、正式な各URL、ナビの範囲。
- Skill の指示に従う実行は、AI が手順を読んで行うものであり、プログラムによる機械的な強制ではない。CSV の解析・検証・反映の部分だけ、スクリプトが機械的に判定する。
