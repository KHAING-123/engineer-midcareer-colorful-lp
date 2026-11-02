# Colorful LP Workflow 検証結果

## 1. 使用したテンプレート
- 未経験向け Colorful LP
- 元のProject：frontend/

## 2. 既存LPの再現テスト
- 出力先：output/colorful-basic/
- 複製・依存導入・Build・起動：成功
- ユーザーによる画面確認：OK
- 元のfrontend：変更なし

## 3. Customer Input反映テスト
- Input：docs/04-customer-input-test.md
- 出力先：output/colorful-input-test/
- 変更対象：jobsSection.title
- 変更前：PREAIでの仕事
- テスト時の変更後：未経験から、ITの仕事に挑戦しよう
- Input反映・Build・起動：成功
- ユーザーによる画面確認：OK
- 元のfrontendと既存出力：変更なし

## 4. テスト後の現在の状態
- 生成先の見出しを「PREAIでの仕事」に戻した。
- テスト用Inputの見出しも同じ内容に戻した。
- 保存後の画面確認：完了

## 5. 時間計測
- Input反映テストの記録時間：約60秒
- 資料読込とブラウザ確認の時間は含まれていない。
- LP制作全体の所要時間としては扱わない。

## 6. 現在できること
- Colorful LPを別フォルダへ複製する。
- InputのjobsSection.titleを生成先だけに反映する。
- 依存導入・Build・開発サーバー起動を行う。

## 7. 今後の対応
- Customer Inputの他の文章項目への対応
- 画像差し替えの扱い
- 応募リンク・正式URLの設定
- Spreadsheet入力への対応
- 他のDesign Patternへの対応
- 資料読込を含む時間計測claude

---

# 14項目版の検証結果(追記)

上記 1〜7 は、`jobsSection.title` のみの旧版の記録として維持する。以下は、7 Section の `title`・`lead` 計14項目に対応した版(`generate-colorful-lp` Skill)の検証結果。

## 8. 変更0件テスト(14項目版)
- Input：docs/02-customer-input.md
- 出力先：output/colorful-14fields-baseline/
- 14項目の分類：すべて「同じ」(現在値と一致)。変更・未指定・判断不能は0件。
- 範囲外の実データの差分：なし。
- 変更0件でも停止せず、生成・`npm ci`・Build・起動が成功した。lpContent.js は複製元と同一。
- Port：5173。HTTP 200。
- 記録時間：資料読込込みで61秒(資料読込は23秒)。
- 途中の計測コマンド失敗と復旧：
  - 計測に `/usr/bin/time` を使ったが、環境に存在せず、`npm ci` が実行されなかった。続けて実行した Build も `vite: not found` で失敗した。
  - `npm ci` を実際に1回だけ実行し、成功した。その後 Build をやり直して成功した。出力先のコードは変更していない。
  - 対応として、SKILL.md を改善した(計測は `date +%s` の差だけにする、`npm ci` 失敗時はそこで停止する、Build 成功後だけ開発サーバーを起動する)。
- 元のfrontendと既存出力：変更なし。
- ユーザーによる画面確認：この記録では扱わない(下記 9 の確認は 14項目変更版)。

## 9. 14項目変更テスト
- Input：docs/07-customer-input-14fields-test.md(docs/02 の複製。14項目の値の先頭に「【検証用】」を追加。ほかの行は変更なし)
- 出力先：output/colorful-14fields-test/
- 変更対象(14項目):
  - membersSection.title / lead
  - jobsSection.title / lead
  - growthSection.title / lead
  - supportSection.title / lead
  - careersSection.title / lead
  - interview.title / lead
  - selectionSection.title / lead
- 14項目の分類：すべて「変更」。同じ・未指定・判断不能は0件。範囲外の実データの差分はなし。
- 元の改行位置・改行数を維持した(増減0、`membersSection.lead` の空行も維持)。
- 差分確認：
  - `diff -rq frontend/src` の差分は `src/data/lpContent.js` だけ。行の差分は14行。
  - Node で両方の lpContent.js を比較し、値が異なるキーが指定の14項目と完全一致した。各値は Input と一致した。
  - 設定ファイル・`index.html`・`public/` は複製元と一致した。
- `npm ci`：1回、成功(esbuild の postinstall が許可リスト未登録という警告あり)。
- Build：成功。起動：成功。
- Port：5174(5173 は前回のサーバーが使用中。停止していない)。HTTP 200。配信される lpContent.js に「【検証用】」が14箇所あった(文字列の確認であり、表示の確認ではない)。
- 記録時間：資料読込込みで50秒(資料読込は14秒)。
- 元のfrontendと既存出力：変更なし。
- ユーザーによる画面確認：OK
  - 14項目の表示：OK
  - PC：OK
  - SP 390px：OK
  - SP 375px：OK
  - Opening・メニュー・ナビ：OK

## 10. 検証の範囲と未確認事項
- 時間の記録(61秒・50秒)に、ブラウザ確認の時間は含まれていない。LP制作全体の所要時間としては扱わない。
- 今回確認したのは、既存Colorful LPの再利用と、14項目の文章反映(変更0件・14項目変更の2パターン)。
- 空文字・空白だけ・見出しだけで値がない・単独の CR・CRLF などの不正な Input による停止動作は、実行テスト未実施。
- 画像内の文字(Hero・Members・最終CTA)と alt・資料の一致は、確認済みにしていない。
- optimized の WebP と元画像の内容の一致、素材の使用条件は、確認済みにしていない。
- 画面確認は「【検証用】」を付けた文章での結果。実際の案件の文章(長さや行数が異なる文章)での見え方は、別途確認が必要。
- 仮リンク(example.com)、応募リンクの有無、公開時の robots、ナビの範囲は、今後決める事項のまま。
- 未対応：Spreadsheet連携、画像差し替え、他のDesign Pattern。14項目以外の文字列(`number`・`label`・`note`・`sideNote`、配列の中身など)の反映も未対応。

## 11. 現在できること(14項目版)
- Colorful LPを別フォルダへ複製する。
- Input の7 Section の `title`・`lead`(14項目)を、生成先の lpContent.js だけに反映する。変更0件でも生成できる。
- 範囲外の実データに差分がある場合は、生成前に停止する(この停止動作は実行テスト未実施)。
- 依存導入・Build・開発サーバー起動を行い、失敗した時点で停止する。
