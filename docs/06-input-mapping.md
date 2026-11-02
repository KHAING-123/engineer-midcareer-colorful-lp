# Input と lpContent.js の対応表

## この資料の目的
`docs/02-customer-input.md` の項目が、`frontend/src/data/lpContent.js` のどのキーに対応し、現在の表示でどう使われているかを整理する。Customer Input の反映対象を広げるときの基準にする。

- この資料は対応表の作成だけを目的とする。LP・Skill・既存Input・出力フォルダは変更していない。
- generate-colorful-lp Skill が反映できるのは、7 Section（01〜07）の `title`・`lead`、計14項目（「9.」に一覧）。
- 状態の区別（「9.」も参照）:
  - **Skill に対応済み**: `SKILL.md` に14項目の読み取り・照合・反映の手順が書かれている。
  - **実行テスト済み**: Skill を実際に実行して確認した。14項目版は、変更0件と14項目変更の2パターンで実行テスト済み（結果は `docs/05-generation-test-result.md` の 8・9）。不正な Input による停止動作は未実施。

## 確認方法と確認状況
- 「使用」欄は、`frontend/src/components/lp/` と `components/common/` の該当 Component を読んで確認した（コード確認済み）。
- `\n` の扱いは、`SectionHeading.vue`・`MembersSection.vue`・`GrowthSection.vue`・`InterviewSection.vue` などの実装を読んで確認した（コード確認済み）。
- 実際の見た目（折り返し・はみ出し・Animation・PC/SP の差）は、ブラウザで確認していない（未確認）。
- 画像内の文字は、実画像で確認していない（未確認）。

## 凡例

### 値の型
- 文字列 / 配列 / 真偽値 / オブジェクト。配列は `jobs[].title` のように要素のキーまで書く。

### 使用（現在の表示で使われているか）
| 記号 | 意味 |
|---|---|
| 使用 | 画面に表示される |
| 使用（条件付き） | `v-if` などで、値や条件によって表示される |
| 読み上げのみ | DOM にはあるが画面には表示されない（`visually-hidden`・`aria-hidden` など） |
| 未使用 | どの Component からも参照されていない |

### 改行の扱い（`\n`）
Component によって `\n` の扱いが異なる。反映時は、Input の改行位置が画面で強制改行になるか、候補にとどまるかを区別する。

| 記号 | 挙動 | 該当 |
|---|---|---|
| 強制 | `white-space: pre-line` により、`\n` で必ず改行する | 各Sectionの `title`・`lead`（`SectionHeading.vue` が `pre-line` で表示。01 MEMBERS の `title` を除く）、`membersSection.lead`、`membersSection.sideNote`、`selectionFlow[].note`、`finalCta.title` |
| 候補 | `split('\n')` して `<wbr>` を挟む。幅が足りないときだけ改行する | `membersSection.title`、`jobs[].description`、`growthSteps[].title`、`careers[].description`、`interview.topics[].title` |
| `<br>` | `split('\n')` して `<br>` を挟む。必ず改行する | `growthSteps[].description` |
| 行分割 | 行ごとに別要素にする | `interview.note`、`opening.lines`（1行ずつ） |
| なし | 改行指定の処理がない（`\n` は表示上は空白になる可能性。ブラウザで未確認） | `supportItems[].description` |

### 共通の制約
- 配列を反映するとき、`key` に使われる値は重複させない。重複すると描画が不安定になる（Vue の `:key`）。
  - `jobs[].title`、`supportItems[].title`、`careers[].title`、`interview.topics[].title`、`selectionFlow[].title`、`growthSteps[].step`、`members[].id`、`header.nav[].href`、`footer.links[].href`、`opening.keywords[].label`
- 色（`accent`・`circle`）は、定義されている値だけを使う（各表を参照）。
- 画像パスは「4.1 画像パス」と「5. 画像内テキスト」を参照する。

---

## 1. 通常の文章差し替え（Section別）

### 1.1 ページ共通・Opening・Header

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| Opening | 英文（Input 3） | `opening.lines[]` | 配列（文字列2要素） | 使用 | 1行を1要素。スペースで単語に分けて1文字ずつ表示する。長くすると演出時間が延びる（時間は OpeningScreen.vue 側の固定値で、lpContent.js では管理されない）。 |
| Opening | キーワード文言 | `opening.keywords[].label` | 文字列 | 使用 | `key` になるため重複不可。間に「×」が自動で入る。 |
| Opening | キーワード色 | `opening.keywords[].accent` | 文字列 | 使用 | `coral` / `blue` / `mint` のみ CSS 定義あり。 |
| Header | ナビ日本語 | `header.nav[].label` | 文字列 | 使用 | PCナビとSPメニューの両方に表示される。 |
| Header | ナビ英字 | `header.nav[].labelEn` | 文字列 | 使用（条件付き） | 空にすると英字が消える（`v-if`）。 |
| Header | ナビのリンク先 | `header.nav[].href` | 文字列 | 使用 | `key` になるため重複不可。Section の `id` と一致させる（現状 `#members` `#jobs` `#growth` `#careers` `#interview`）。ナビに載せないSectionは `#support` `#selection` `#entry`。 |
| Header | ナビ色 | `header.nav[].accent` | 文字列 | 使用 | `coral` / `mint` / `yellow` / `pink` / `blue`。 |
| Header | CTA日本語 | `header.cta.label` | 文字列 | 使用 | 表示のみ。リンクではない（「3. 未使用のCTA設定」を参照）。 |
| Header | CTA英字 | `header.cta.labelEn` | 文字列 | 使用（条件付き） | 空にすると英字が消える。 |
| Header | SPメニューのボタン文字 | `header.menuText` / `header.menuCloseText` | 文字列 | 使用 | 閉じた状態は `MENU`、開いた状態は `CLOSE`。 |
| Header | 読み上げ文言 | `header.menuOpenLabel` / `header.menuCloseLabel` | 文字列 | 読み上げのみ | 画面には出ない。 |
| 共通 | ブランド名 | `site.companyName` | 文字列 | 未使用 | どの Component も参照しない。変更しても表示は変わらない。 |
| 共通 | ロゴ代替テキスト | `site.logoAlt` | 文字列 | 読み上げのみ | Header・Footer・Opening のロゴの `aria-label`。Footer は「{logoAlt} トップへ戻る」。ロゴ自体の変更は「6. インラインSVGロゴ」を参照。 |
| 共通 | ロゴ画像 | `site.logo` | 文字列 | 未使用 | 画像ファイルは参照されていない（「6.」を参照）。 |

### 1.2 FV（Hero）

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| FV | 見出し（Input 5） | `hero.title` | 文字列 | 読み上げのみ | `h1` として `visually-hidden`。画面に出る文章は画像内にある。変更しても画面の文章は変わらない。 |
| FV | 代替テキスト | `hero.alt` | 文字列 | 読み上げのみ | PC 画像の `alt`。画像内の文章と同じにする（一致は未確認）。 |
| FV | PC画像 | `hero.imagePc` | 文字列 | 使用 | 画像パス。「4.1」を参照。 |
| FV | SP画像 | `hero.imageSp` | 文字列 | 使用 | 767px 以下で切り替わる。 |

### 1.3 01 MEMBERS

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 01 MEMBERS | 番号 | `membersSection.number` | 文字列 | 使用 | `01`。 |
| 01 MEMBERS | 英字 | `membersSection.label` | 文字列 | 使用（条件付き） | 空にすると消える。 |
| 01 MEMBERS | 見出し | `membersSection.title` | 文字列 | 使用 | `\n` は「候補」（`MembersSection.vue` が `split('\n')` して `<wbr>` を挟み、`word-break: keep-all`。幅が足りないときだけ改行。PCでは1行）。14項目のうち、`SectionHeading` を使わない唯一の title。 |
| 01 MEMBERS | 説明文 | `membersSection.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`MembersSection.vue` の `pre-line`）。空行は `\n\n`。 |
| 01 MEMBERS | 右側の補足メッセージ | `membersSection.sideNote` | 文字列 | 使用（条件付き） | **1枚目のメンバー画像の下**に表示される。`members` が空だと表示されない。`\n` は「強制」。コメントの「右側のピンクの丸」と実装の位置は一致するか未確認（PC/SPの見え方はブラウザで未確認）。 |
| 01 MEMBERS | メンバーID | `members[].id` | 文字列 | 使用 | `key`。重複不可。 |
| 01 MEMBERS | メンバー画像 | `members[].image` | 文字列 | 使用 | 画像パス。名前・年齢・コメントは画像内（「5.」を参照）。 |
| 01 MEMBERS | メンバー画像の代替テキスト | `members[].imageAlt` | 文字列 | 読み上げのみ | 画像内の情報と合わせる。一致は未確認。 |

### 1.4 02 OUR WORK

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 02 OUR WORK | 番号 | `jobsSection.number` | 文字列 | 使用 | |
| 02 OUR WORK | 英字 | `jobsSection.label` | 文字列 | 使用（条件付き） | |
| 02 OUR WORK | 見出し | `jobsSection.title` | 文字列 | 使用 | `\n` は「強制」（`SectionHeading.vue` の `pre-line`）。 |
| 02 OUR WORK | 説明文 | `jobsSection.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`SectionHeading.vue`）。 |
| 02 OUR WORK | 仕事名 | `jobs[].title` | 文字列 | 使用 | `key`。重複不可。 |
| 02 OUR WORK | 仕事の画像 | `jobs[].image` | 文字列 | 使用 | 画像パス。 |
| 02 OUR WORK | 画像の代替テキスト | `jobs[].imageAlt` | 文字列 | 読み上げのみ | |
| 02 OUR WORK | 仕事の説明 | `jobs[].description` | 文字列 | 使用 | `\n` は「候補」。Input の改行位置は、幅が足りないときの候補になる。 |
| 02 OUR WORK | スキルタグ | `jobs[].tags[]` | 配列（文字列） | 使用 | 件数の増減は可能。`key` なので重複不可。長いタグ（例：`Power Platform（Power Apps等）`）の折り返しはブラウザで未確認。 |
| 02 OUR WORK | 色 | `jobs[].accent` | 文字列 | 使用 | `yellow`（既定）/ `green` / `pink` の CSS を確認。`blue` は CSS が見つからない（既定の見た目になる可能性。未確認）。 |

### 1.5 03 GROWTH STEP

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 03 GROWTH STEP | 番号・英字 | `growthSection.number` / `growthSection.label` | 文字列 | 使用 | |
| 03 GROWTH STEP | 見出し | `growthSection.title` | 文字列 | 使用 | `\n` は「強制」（`GrowthSection.vue` が `SectionHeading` を使用。`growthSteps[].title` の「候補」とは別）。 |
| 03 GROWTH STEP | 説明文 | `growthSection.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`SectionHeading.vue`）。 |
| 03 GROWTH STEP | 補足メッセージ（1行目） | `growthSection.note.line1` | 文字列 | 使用（条件付き） | `note` オブジェクトが無いと全体が非表示。 |
| 03 GROWTH STEP | 補足メッセージ（強調語） | `growthSection.note.highlight` | 文字列 | 使用（条件付き） | コーラル色の強調。`line2` と同じ行に続く。 |
| 03 GROWTH STEP | 補足メッセージ（続き） | `growthSection.note.line2` | 文字列 | 使用（条件付き） | |
| 03 GROWTH STEP | STEP番号 | `growthSteps[].step` | 文字列 | 使用 | `key`。重複不可（`STEP 01` 形式）。 |
| 03 GROWTH STEP | 期間 | `growthSteps[].period` | 文字列 | 使用（条件付き） | キー自体を持たない（コメントアウト）場合は非表示。Input の「設定なし」は、キーを持たせないことで表す。 |
| 03 GROWTH STEP | 見出し | `growthSteps[].title` | 文字列 | 使用 | `\n` は「候補」。 |
| 03 GROWTH STEP | 説明 | `growthSteps[].description` | 文字列 | 使用 | `\n` は `<br>`（必ず改行）。 |
| 03 GROWTH STEP | アイコン | `growthSteps[].icon` | 文字列 | 使用 | 画像パス。設定は `.png`、実体は `.svg`。 |
| 03 GROWTH STEP | 色 | `growthSteps[].accent` | 文字列 | 使用 | `yellow`（既定）/ `pink` / `blue` / `green`。 |

### 1.6 04 SUPPORT

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 04 SUPPORT | 番号・英字 | `supportSection.number` / `supportSection.label` | 文字列 | 使用 | |
| 04 SUPPORT | 見出し | `supportSection.title` | 文字列 | 使用 | `\n` は「強制」（`CareerSupportSection.vue` が `SectionHeading` を使用）。 |
| 04 SUPPORT | 説明文 | `supportSection.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`SectionHeading.vue`）。 |
| 04 SUPPORT | 画像 | `supportSection.image` | 文字列 | 使用 | 画像パス。 |
| 04 SUPPORT | 画像の代替テキスト | `supportSection.imageAlt` | 文字列 | 読み上げのみ | |
| 04 SUPPORT | サポート名 | `supportItems[].title` | 文字列 | 使用 | `key`。重複不可。 |
| 04 SUPPORT | サポートの説明 | `supportItems[].description` | 文字列 | 使用 | 改行の処理は**ない**（「なし」）。現在の `supportItems[0]` には `\n` があるが、画面で改行されるかはブラウザで未確認。 |
| 04 SUPPORT | アイコン | `supportItems[].icon` | 文字列 | 使用 | 画像パス。 |
| 04 SUPPORT | 色 | `supportItems[].accent` | 文字列 | 使用 | `blue` / `yellow` / `green` の CSS を確認。`pink` の定義位置は未確認。 |

### 1.7 05 CAREER PATH

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 05 CAREER PATH | 番号・英字 | `careersSection.number` / `careersSection.label` | 文字列 | 使用 | |
| 05 CAREER PATH | 見出し | `careersSection.title` | 文字列 | 使用 | `\n` は「強制」（`CareerPathsSection.vue` が `SectionHeading` を使用）。 |
| 05 CAREER PATH | 説明文 | `careersSection.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`SectionHeading.vue`）。 |
| 05 CAREER PATH | 補足メッセージ（強調語） | `careersSection.note.highlight` | 文字列 | 使用（条件付き） | 黄色の下線つきの強調。`note` が無いと全体が非表示。 |
| 05 CAREER PATH | 補足メッセージ（続き） | `careersSection.note.line1` | 文字列 | 使用（条件付き） | 強調語と同じ行。 |
| 05 CAREER PATH | 補足メッセージ（2行目） | `careersSection.note.line2` | 文字列 | 使用（条件付き） | |
| 05 CAREER PATH | キャリア名 | `careers[].title` | 文字列 | 使用 | `key`。重複不可。 |
| 05 CAREER PATH | キャリアの説明 | `careers[].description` | 文字列 | 使用 | `\n` は「候補」。 |
| 05 CAREER PATH | アイコン | `careers[].icon` | 文字列 | 使用 | 画像パス。ファイル名とキャリア名が対応していない（例：`AI・自動化エンジニア` が `career-project-leader.png`）。名前から画像を推測しない。 |
| 05 CAREER PATH | 色 | `careers[].accent` | 文字列 | 使用 | `yellow`（既定）/ `blue` / `green` / `pink`。 |

### 1.8 06 INTERVIEW

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 06 INTERVIEW | 番号・英字 | `interview.number` / `interview.label` | 文字列 | 使用 | |
| 06 INTERVIEW | 見出し | `interview.title` | 文字列 | 使用 | `\n` は「強制」（`InterviewSection.vue` が `SectionHeading` を使用）。`interview.topics[].title` の「候補」とは別。 |
| 06 INTERVIEW | 説明文 | `interview.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`SectionHeading.vue`）。 |
| 06 INTERVIEW | 画像 | `interview.image` | 文字列 | 使用 | 画像パス。設定は `.png`、実体は `.jpg`。 |
| 06 INTERVIEW | 画像の代替テキスト | `interview.imageAlt` | 文字列 | 読み上げのみ | |
| 06 INTERVIEW | 補足メッセージ | `interview.note` | 文字列 | 使用（条件付き） | 「行分割」。`\n` で2行に分ける前提のデザイン（最後の行に下線）。3行以上は未確認。 |
| 06 INTERVIEW | リスト見出し | `interview.listTitle` | 文字列 | 使用 | |
| 06 INTERVIEW | トピック見出し | `interview.topics[].title` | 文字列 | 使用 | `key`。重複不可。`\n` は「候補」。 |
| 06 INTERVIEW | トピックの項目 | `interview.topics[].items[]` | 配列（文字列） | 使用（条件付き） | 現在は2項目ずつ。コードは件数を制限していないが、デザインは2項目前提（コメント）。`key` なので重複不可。 |
| 06 INTERVIEW | トピックのアイコン | `interview.topics[].icon` | 文字列 | 使用 | 画像パス（svg）。 |
| 06 INTERVIEW | トピックの色 | `interview.topics[].accent` | 文字列 | 使用 | `green`（既定）/ `pink` / `blue` / `yellow`。 |
| 06 INTERVIEW | ポイント見出し | `interview.points[].title` | 文字列 | 使用（条件付き） | `interview.points` が空だと全体が非表示。 |
| 06 INTERVIEW | ポイント説明 | `interview.points[].description` | 文字列 | 使用（条件付き） | |
| 06 INTERVIEW | ポイントのアイコン | `interview.points[].icon` | 文字列 | 使用 | 画像パス（svg）。 |
| 06 INTERVIEW | ポイントの色 | `interview.points[].accent` | 文字列 | 使用 | `yellow`（既定）/ `blue` / `green`。`pink` の CSS は見つからない。 |

### 1.9 07 FLOW

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 07 FLOW | 番号・英字 | `selectionSection.number` / `selectionSection.label` | 文字列 | 使用 | |
| 07 FLOW | 見出し | `selectionSection.title` | 文字列 | 使用 | `\n` は「強制」（`SelectionFlowSection.vue` が `SectionHeading` を使用）。 |
| 07 FLOW | 説明文 | `selectionSection.lead` | 文字列 | 使用（条件付き） | `\n` は「強制」（`SectionHeading.vue`）。 |
| 07 FLOW | 注意事項 | `selectionSection.note` | 文字列 | 使用（条件付き） | |
| 07 FLOW | ステップ名 | `selectionFlow[].title` | 文字列 | 使用 | `key`。重複不可。 |
| 07 FLOW | 日数・表記 | `selectionFlow[].duration` | 文字列 | 使用（条件付き） | 画面では `（{値}）` と括弧が付く。括弧を含めて入力しない。キーを持たないと非表示（Input の「設定なし」）。 |
| 07 FLOW | 補足メッセージ | `selectionFlow[].note` | 文字列 | 使用（条件付き） | 現在は「内定」のみ。`\n` は「強制」。 |
| 07 FLOW | 非表示の説明 | `selectionFlow[].description` | 文字列 | **未使用** | どの Component も参照しない。変更しても表示は変わらない。 |
| 07 FLOW | アイコン | `selectionFlow[].icon` | 文字列 | 使用 | 画像パス。 |
| 07 FLOW | 丸の色 | `selectionFlow[].circle` | 文字列 | 使用 | `blue`（既定）/ `yellow` / `sky` / `lavender` / `pink` / `green`。 |

STEP の番号（01〜05）は `selectionFlow` の並び順から自動で付く。lpContent.js には持たない。

### 1.10 最終CTA（文章部分）

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| 最終CTA | 見出し | `finalCta.title` | 文字列 | 読み上げのみ | `showText: false` のため `visually-hidden`。 |
| 最終CTA | 説明文 | `finalCta.lead` | 文字列 | 読み上げのみ | 同上。 |
| 最終CTA | 文章を表示するか | `finalCta.showText` | 真偽値 | 使用 | `true` にすると、画像の上に `title`・`lead` が重なって表示される。画像内にも文字があるため、二重になる。現在は `false` のまま維持する。 |
| 最終CTA | 画像の代替テキスト | `finalCta.alt` | 文字列 | 読み上げのみ | 画像内の文章と同じにする（一致は未確認）。 |
| 最終CTA | PC / SP 画像 | `finalCta.imagePc` / `finalCta.imageSp` | 文字列 | 使用 | 画像パス。 |

### 1.11 Footer

| Section | Input項目 | キー | 型 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| Footer | リンク文言 | `footer.links[].label` | 文字列 | 使用 | |
| Footer | リンク先 | `footer.links[].href` | 文字列 | 使用 | `key`。重複不可。`example.com` は仮リンク。 |
| Footer | 外部リンク | `footer.links[].external` | 真偽値 | 使用（条件付き） | `true` で新しいタブで開き、↗ アイコンが付く。未指定は `false` 扱い。 |
| Footer | SNSリンク | `footer.sns[]` | 配列 | 使用（条件付き） | 現在はキー自体がコメントアウト。`footer.sns` に要素があると表示される。`label`・`href`・`icon` が必要。 |
| Footer | Copyright | `footer.copyright` | 文字列 | 使用 | |

---

## 2. 値の型と共通の値

| 項目 | キー | 型 | 備考 |
|---|---|---|---|
| 共通の応募・問い合わせURL | `ENTRY_URL`（定数。`lpContent` のキーではない） | 文字列 | `header.cta.href` と `finalCta.button.href` に代入されるが、どちらも表示に使われていない（「3.」を参照）。 |

---

## 3. 未使用のCTA設定（通常の文章差し替えとは分ける）

| 場所 | キー | 型 | 現在の値 | 使用 | 反映時の注意 |
|---|---|---|---|---|---|
| Header | `header.cta.href` | 文字列 | `ENTRY_URL`（`https://example.com/entry`） | 未使用 | Header の CTA は `<p>` 内のテキスト。`<a>`・`<button>` ではない（PC・SPメニューとも）。 |
| 最終CTA | `finalCta.button.label` | 文字列 | まずは話を聞いてみる | 未使用 | 最終CTAは `<picture>` と `<img>` のみ。 |
| 最終CTA | `finalCta.button.href` | 文字列 | `ENTRY_URL` | 未使用 | リンクもボタンもない。 |
| 共通 | `ENTRY_URL` | 文字列 | `https://example.com/entry` | 実際のリンクには未使用 | 仮リンク。ここを変えても、画面上のどこにもリンクは現れない。 |

### 反映時の注意
- 値を差し替えるだけでは応募リンクは生まれない。リンクにするには Component の変更が必要（`AppHeader.vue`、`FinalCtaSection.vue`）。
- 最終CTAの「まずは話を聞いてみる」は画像内の文字。ボタンとして機能させるなら、画像のクリック領域を別に作る必要がある（実装方針は未決定）。
- 応募リンクの有無は、案件の要件に合わせて今後決める事項として維持する。決定済みとして扱わない。
- 最終CTAの `id="entry"` は、ページ内のどこからもリンクされていない。

---

## 4. 画像・アセット

### 4.1 画像パス（lpContent.js のキー）
画像のパスは、通常の文章差し替えとは違い、ファイルの用意が必要。`img()` の解決順は「WebP 優先 → 元画像（拡張子の優先順 png → webp → jpg → jpeg → avif → gif → svg）」。

| Section | キー | 設定パスの例 | 備考 |
|---|---|---|---|
| FV | `hero.imagePc` / `hero.imageSp` | `hero/hero-pc.png` | 画像内に文章あり。 |
| 01 MEMBERS | `members[].image` | `members/member-01.png` | 画像内に名前・年齢・コメントあり。 |
| 02 OUR WORK | `jobs[].image` | `jobs/work-pm-pmo.png` | |
| 03 GROWTH STEP | `growthSteps[].icon` | `icons/growth/growth-basic-learning.png` | 実体は `.svg`。optimized なし。 |
| 04 SUPPORT | `supportSection.image` / `supportItems[].icon` | `support/support-mentor-illustration.png` | |
| 05 CAREER PATH | `careers[].icon` | `icons/career/career-developer.png` | |
| 06 INTERVIEW | `interview.image` | `interview/interview-conversation-illustration.png` | 実体は `.jpg`。optimized なし。 |
| 06 INTERVIEW | `interview.topics[].icon` / `interview.points[].icon` | `icons/interview/point-clothes.svg` | svg。optimized なし。 |
| 07 FLOW | `selectionFlow[].icon` | `icons/selection/selection-document.png` | |
| 最終CTA | `finalCta.imagePc` / `finalCta.imageSp` | `cta/final-cta-pc.png` | 画像内に文章あり。 |
| 共通 | `site.logo` | `common/preai-logo.svg` | 未使用（「6.」を参照）。 |
| Footer | `footer.sns[].icon`（コメントアウト中） | `icons/sns/sns-x.png` | 実体は `.svg`。現在は未使用。 |

### 4.2 反映時の注意
- 設定パスの拡張子は無視され、拡張子を除いたパスで照合される。
- `images-optimized/` に同名の `.webp` があると、それが優先される。元画像だけを差し替えても、古い WebP が表示され続ける。
- 画像が見つからない場合、`img()` は空文字を返し、画像は表示されない（開発時のみ警告）。
- 画像の `width`・`height` 属性は Component に直書きされている。サイズの異なる画像を使う場合は、属性値との差を確認する（ブラウザで未確認）。
- `common/deco-*.svg`（装飾）は Component から直接指定されており、lpContent.js では管理されない。

---

## 5. 画像内テキスト（通常の文章差し替えでは変わらない）

下記の文章は画像の中にある。lpContent.js の文章やaltを変更しても、画面の文章は変わらない。変更するには、画像の修正・差し替えが必要。

| Section | 画像（キー） | 画像内の内容 | 関連する文章キー | 注意 |
|---|---|---|---|---|
| FV | `hero.imagePc` / `hero.imageSp` | キャッチコピーなど | `hero.title`（読み上げ）、`hero.alt` | 画像内の全文は未確認。`title` と `alt` は画像の文章と合わせる。 |
| 01 MEMBERS | `members[].image` | 名前・年齢・コメントなど | `members[].imageAlt` | 画像内の全文は未確認。画像ごとに差し替えが必要。 |
| 最終CTA | `finalCta.imagePc` / `finalCta.imageSp` | 見出し・CTA文言（「まずは話を聞いてみる」を含む） | `finalCta.title` / `finalCta.lead`（読み上げ）、`finalCta.alt` | `showText: true` にすると二重表示になる。画像内の文字と `alt` の一致は未確認。 |

### 反映時の注意
- Input に画像内テキストの変更が含まれる場合、文章の差し替えとは別の作業（画像の制作・差し替え）として扱う。
- 画像を差し替えたら、`images-optimized/` の同名 WebP も更新または削除する（「4.2」を参照）。
- 画像内の文字と `alt`・資料の一致は、実画像で確認する（未確認）。

---

## 6. インラインSVGロゴ

| 項目 | 内容 |
|---|---|
| 実装 | `components/common/PreaiLogo.vue` のインライン SVG（文字の形をパスで描画）。 |
| 使用箇所 | Header・Footer・Opening（`OpeningSheet.vue`）。 |
| lpContent.js との関係 | `site.logoAlt` だけが `aria-label` として渡される。`site.logo`（`common/preai-logo.svg`）は参照されていない。 |
| 文章や画像の差し替えで変わるか | **変わらない。** `site.logo` を別の画像パスにしても表示は変わらない。 |
| ロゴを変更するには | `PreaiLogo.vue` の SVG パス・色・`viewBox` の変更が必要（Component の変更）。 |
| 補足 | `common/preai-logo.svg` はファイルとして存在するが、表示では使われていない（このファイルとインラインSVGの見た目が一致するかは未確認）。 |

---

## 7. index.html（lpContent.js の管轄外）

通常の文章差し替えでは変更されない。別途、明示的に更新する対象。

| 項目 | 現在の値 | 備考 |
|---|---|---|
| `<title>` | PREAI 採用サイト｜未経験・若手エンジニア募集 | |
| `<meta name="description">` | 未経験・若手からエンジニアを目指せるPREAIの採用LP。研修・メンター制度・キャリアサポートで成長を支えます。 | |
| `<meta name="robots">` | `noindex, nofollow` | 公開時の設定は、案件の要件に合わせて今後決める。 |
| Hero 画像の preload | `/src/assets/images-optimized/hero/hero-sp.webp`（767px 以下）、`hero-pc.webp`（768px 以上） | `img()` を通さず直書き。Hero 画像のファイル名や置き場所を変えたら、ここも更新する。 |
| favicon | `/favicon.svg` | `public/favicon.svg`。 |
| フォント | Google Fonts（Zen Maru Gothic、Noto Sans JP、Caveat） | |

---

## 8. その他（lpContent.js 以外の直接記載。通常の文章差し替えでは変わらない）

| 場所 | 内容 |
|---|---|
| `App.vue` | スキップリンク「本文へスキップ」。 |
| `AppHeader.vue` | nav の `aria-label`「メインメニュー」「メニュー」。 |
| `AppFooter.vue` | 「フッターメニュー」「公式SNS」「（新しいタブで開く）」。 |
| `SelectionFlowSection.vue` | 読み上げ用の「STEP {番号}」。 |
| `OpeningSheet.vue` | キーワード間の「×」。 |
| `OpeningScreen.vue` | 演出時間・紙のめくりの設定。 |
| 各 Component | `common/deco-*.svg` の直接指定、画像の `width`・`height` 属性。 |

---

## 9. 現在の Skill の対応範囲との関係

### 9.1 対応範囲（14項目）
generate-colorful-lp Skill は、7 Section の `title`・`lead`、計14項目の**値（文字列）だけ**を、生成先の `lpContent.js` に反映する。

| # | キー | `\n` の扱い | 根拠（コード確認済み） |
|---|---|---|---|
| 1 | `membersSection.title` | 候補（`<wbr>`） | `MembersSection.vue`（`split('\n')` + `<wbr>`、`word-break: keep-all`） |
| 2 | `membersSection.lead` | 強制 | `MembersSection.vue`（`pre-line`） |
| 3 | `jobsSection.title` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 4 | `jobsSection.lead` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 5 | `growthSection.title` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 6 | `growthSection.lead` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 7 | `supportSection.title` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 8 | `supportSection.lead` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 9 | `careersSection.title` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 10 | `careersSection.lead` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 11 | `interview.title` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 12 | `interview.lead` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 13 | `selectionSection.title` | 強制 | `SectionHeading.vue`（`pre-line`） |
| 14 | `selectionSection.lead` | 強制 | `SectionHeading.vue`（`pre-line`） |

- 「強制」でも、`white-space: pre-line` は連続する空白を1つにまとめ、行末の空白を表示上は除く。`lpContent.js` に入れる値自体は変えない（表示上の見え方はブラウザで未確認）。
- 6 Section は `SectionHeading` 経由で、`title`・`lead` ともに `pre-line`。01 MEMBERS だけ、`title` が「候補」、`lead` が「強制」。
- `pre-line` クラスの定義は `frontend/src/assets/styles/lp.css`（`white-space: pre-line`）。6 Section が `SectionHeading` に `title`・`lead` を渡していることは、各 Section の Component（`JobsSection`・`GrowthSection`・`CareerSupportSection`・`CareerPathsSection`・`InterviewSection`・`SelectionFlowSection`）で確認した。

### 9.1.1 Input の判定ルール（詳細は `SKILL.md` の手順4-1）
| Input の状態 | 扱い |
|---|---|
| 項目自体（見出し・行）がない | 未指定。現在値を維持 |
| 見出しだけあり、コードブロックがない | 判断不能。生成前に停止 |
| 空文字、または空白・改行だけの値 | 判断不能。生成前に停止（削除と解釈しない） |
| CRLF | 先に LF に正規化してから解析。文章内容・空白・論理的な改行数は変えない |

### 9.2 状態の区別
| 状態 | 内容 |
|---|---|
| Skill に対応済み | `SKILL.md` に14項目の手順がある。 |
| 実行テスト済み | 14項目版を2パターンで実行した。変更0件（docs/02、出力先 `output/colorful-14fields-baseline/`）と、14項目すべてに「【検証用】」を付けた変更（docs/07、出力先 `output/colorful-14fields-test/`）。どちらも生成・`npm ci`・Build・起動が成功した。変更版は Node の比較で、変更キーが指定の14項目と完全一致した。**未実施**：空文字・空白だけ・見出しだけ・単独の CR・範囲外の差分などによる停止動作。 |
| ブラウザ確認済み | 14項目変更版（「【検証用】」付き）について、ユーザーが確認済み：14項目の表示、PC、SP 390px、SP 375px、Opening・メニュー・ナビ（すべて OK）。**未確認**：実際の案件の文章での見え方、画像内テキストと alt の一致、optimized WebP と元画像の一致、アンカー位置、画像 width/height のずれの影響。 |

### 9.3 14項目の外（文字列の置き換えだけでは対応できない。拡張する場合は別途方針を決める）
- `number`・`label`・`note`・`sideNote` など、14項目以外の文字列キー
- 配列の増減・並べ替え（`jobs[]`、`members[]` など）
- 画像の差し替え（「4.」「5.」）
- 未使用のCTA設定（「3.」）
- インラインSVGロゴ（「6.」）
- index.html（「7.」）
- Component 内の直接記載（「8.」）

## 10. 未確認事項
- 14項目版の Skill の、不正な Input（空文字・空白だけ・見出しだけ・単独の CR・範囲外の差分）による停止動作は、実行テスト未実施。
- 「【検証用】」を付けた14項目の画面上の見え方（PC、SP 390px・375px、Opening・メニュー・ナビ）は、ユーザーが確認済み。実際の案件の文章（長さ・行数が異なる）での折り返し・はみ出しは、ブラウザで未確認。
- `membersSection.sideNote` の表示位置（コメントと実装の差）は、ブラウザで未確認。
- `supportItems[].description` の `\n` が画面でどう表示されるかは、ブラウザで未確認。
- `jobs[].accent` の `blue`、`interview.points[].accent` の `pink`、`supportItems[].accent` の `pink` の見た目は、未確認（CSS の定義位置が確認できていない）。
- 画像内の文章と `alt`・資料の一致は、実画像で未確認。
- `common/preai-logo.svg` とインラインSVGの見た目の一致は、未確認。
- 正式な応募URL、応募リンクの有無、公開時の robots、プライバシーポリシーと利用規約のURLは、今後決める事項（未決定）。
