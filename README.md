# engineer-midcareer-colorful-lp

PREAI の **未経験向け採用LP（Colorful LP）** です。Vue 3 + Vite で作っています。

**プロジェクト本体は `frontend/` フォルダにあります。** 以下のパスは、特に断りがない限り `frontend/` から見た場所です。

---

## 1. プロジェクト概要

### 目的

社会人経験はあるが IT・AI は未経験という方に、PREAI で「AI時代に選ばれる人材」へキャリアチェンジできることを伝え、カジュアル面談への第一歩を後押しする採用LPです。

### ターゲットユーザー

- 接客・販売・事務など、IT 以外の仕事で社会人経験を積んできた方
- これまでの経験を活かしながら、IT・AI のスキルを身につけたい方
- PM・PMO、AI・DX 導入支援、業務自動化などのキャリアに興味がある方

### デザインコンセプト

**Soft Colorful × Premium**

- アイボリー（クリーム）を基調に、淡いイエロー・ミント・ブルー・ピンクとネイビーの文字を組み合わせた、明るく親しみやすい配色
- 柔らかい影、ゆっくりした浮遊、淡い光などの控えめなアニメーションで、上品で落ち着いた印象に
- 葉っぱ・ドット・手書き風メモなどの装飾で、「成長」「新しい一歩」のイメージを表現

---

## 2. 使用技術

| 分類 | 内容 |
| --- | --- |
| フレームワーク | **Vue 3**（Composition API / `<script setup>` の SFC） |
| ビルドツール | **Vite 7**（`@vitejs/plugin-vue`） |
| 言語 | JavaScript（ES Modules）/ CSS（CSS カスタムプロパティ・`clamp()`・CSS アニメーション） |
| アニメーション | CSS アニメーション、IntersectionObserver（スクロール表示）、Web Animations API（オープニングのページめくり） |
| フォント | Google Fonts：**Zen Maru Gothic**（見出し）/ **Noto Sans JP**（本文）/ **Caveat**（英字の手書き風） |

- 依存パッケージは `vue` のみです。UI ライブラリ・アニメーションライブラリ・アイコンライブラリは使っていません。
- ロゴ（`PreaiLogo.vue`）とフッターの外部リンクアイコンは、インライン SVG で描いています。

---

## 3. ページ構成

上から順に表示されます（並び順は `src/App.vue`）。

| セクション | コンポーネント | 内容 |
| --- | --- | --- |
| Opening | `common/OpeningScreen.vue` | ページを開いた直後のオープニング（[4. Opening画面](#4-opening画面)） |
| Header | `lp/AppHeader.vue` | PREAI ロゴ、ナビ（PEOPLE / WORK / GROWTH / CAREER / INTERVIEW）、「CASUAL TALK / まずは話を聞いてみる」。1080px 以下はメニューボタン＋スライドメニュー |
| Hero | `lp/HeroSection.vue` | メインビジュアル画像（PC 用 / SP 用を自動切り替え）＋漂う葉っぱ |
| 01 MEMBERS | `lp/MembersSection.vue` / `MemberCard.vue` | どんな人が働いている？（メンバー3名・手書き風メモ） |
| 02 OUR WORK | `lp/JobsSection.vue` / `JobCard.vue` | PREAIでの仕事（PM・PMO / AI・DXツール導入支援 / 業務自動化） |
| 03 GROWTH STEP | `lp/GrowthSection.vue` | 実践から始める成長ステップ（STEP 01〜04） |
| 04 SUPPORT | `lp/CareerSupportSection.vue` | AI時代の成長環境（4項目＋イラスト） |
| 05 CAREER PATH | `lp/CareerPathsSection.vue` / `CareerCard.vue` | キャリアの広がり（5枚のカード） |
| 06 INTERVIEW | `lp/InterviewSection.vue` | 面接について（面接でお話しすること4項目・3つのポイント） |
| 07 FLOW | `lp/SelectionFlowSection.vue` | 選考の流れ（書類選考 → カジュアル面談 → 面接 → 条件確認 → 内定） |
| Final CTA | `lp/FinalCtaSection.vue` | 画像のみ（「まずは話を聞いてみる」も画像の中に描かれています） |
| Footer | `lp/AppFooter.vue` | ロゴ、会社概要（外部リンク）/ プライバシーポリシー / 利用規約、コピーライト |

- 02〜07 の番号付き見出しは共通の `lp/SectionHeading.vue` を使っています（01 は独自のレイアウト）。
- ヘッダーのナビは `#members` / `#jobs` / `#growth` / `#careers` / `#interview` へ移動します。

---

## 4. Opening画面

ページを開くたびに1回、オープニングを表示してから LP 本体に切り替わります。

| ファイル | 役割 |
| --- | --- |
| `src/components/common/OpeningScreen.vue` | 進行管理・ページめくり・LP 本体への切り替え |
| `src/components/common/OpeningSheet.vue` | 紙に載っている内容（ロゴ・英文・背景装飾） |
| `src/utils/opening.js` | LP 本体との連携用のクラス名・イベント名 |
| `src/data/lpContent.js` の `opening` | 英文（`lines`）とキーワード（`keywords`） |

### 表示内容

- **PREAI ロゴ**：Header / Footer と同じ `PreaiLogo.vue` をそのまま使用
- **YOUR EXPERIENCE. YOUR NEXT FUTURE.**：ネイビーの太字・1行・中央揃え（画面幅に合わせて `clamp()` で縮小。PC は最大 40px）
- **AI × CAREER × GROWTH**：3色の短いライン＋コーラル / ブルー / ミントの英字
- **背景**：アイボリーの紙に、四隅の淡いブロブ（イエロー・ミント・ブルー・ピンク）、葉っぱ、ドット、ゆっくり横切る淡い光。SP では装飾の数を減らしています。

### 流れと時間（PC）

| 順番 | 内容 | 時間 |
| --- | --- | --- |
| 1 | ロゴがふわっと表示 | 0.6秒 |
| 2 | 英文が1文字ずつ表示 | 約1.2秒 |
| 3 | AI × CAREER × GROWTH がフェードイン | 0.5秒 |
| 4 | 少し静止 | 0.5秒 |
| 5 | 紙の右端が浮き上がり、右から左へゆっくりめくれて Hero が現れる | 2.0秒（SP は 1.7秒） |

### Page Turn Animation のしくみ

- 紙を縦に3枚（左から 50% / 30% / 20%）に分け、蝶番のようにつないでいます。
  - 1枚目は画面の左端を軸に `rotateY` で回転（CSS 3D `perspective`）
  - 2枚目・3枚目は、前の紙の右端を軸にさらに少しずつ回転
  - 右端ほど大きく回るので、紙の端が先に浮き上がり、なめらかに曲がって見えます。90° を超えた部分は裏面（淡いアイボリー）が見えます。
- 各面に同じ内容を置き、見える部分だけを切り出しているので、静止中は1枚の紙に見えます。
- 紙・陰影・紙の端の光・Hero に落ちる影は、**Web Animations API** で同じ長さ・同じイージングで動かしています（`transform` / `opacity` のみ）。

### LP 本体への切り替え

- 演出中は `<html>` に `is-opening`（スクロール停止）と `is-opening-hold`（紙が閉じている間）のクラスが付きます。
- 紙が閉じている間は、Header / Hero の CSS アニメーションを一時停止しています。めくり始めると動き出します。
- スクロール表示（`v-reveal`）は、めくり開始時に送られるイベント `lp:opening-release` を受けてから監視を始めます（紙の下で表示が終わってしまわないように）。
- めくりは「英文の表示が終わった」かつ「Hero 画像の読み込み・デコードが完了した」後に始まります。
- 終了後はオープニングの DOM・タイマー・イベントをすべて片付け、スクロールを有効に戻します。何か問題があっても 12 秒後には必ず終了します。

### その他の動作

- オープニング中にクリック・タップ・キー操作・スクロール操作をすると、すぐにめくりが始まります。
- 再読み込みしても Hero から表示します（`#interview` などページ内リンク付きの URL を除く）。
- 端末で「視差効果を減らす／動きを減らす」を設定している場合は、めくらずに静止表示し、短いフェードで切り替わります。
- オープニングが不要になった場合は、`src/App.vue` の `<OpeningScreen />` の1行を削除すると演出ごと無くなります。

---

## 5. デザイン・アニメーション

アニメーションは、ほぼすべて `transform` / `opacity` を使った CSS アニメーションです。

| 種類 | 内容 | 設定している場所 |
| --- | --- | --- |
| 背景（Premium Ambient Background） | ページ全体で、淡い色の光・Soft Light Sweep（光の流れ）・葉っぱ・ドットがゆっくり動く | `assets/styles/ambient.css` / `components/common/AmbientBackground.vue` |
| 葉っぱ | Hero 画像の上・Header・各セクションで、葉っぱが風に揺れるように漂う | `HeroSection.vue` / `AppHeader.vue` / 各セクションの `.vue` / `ambient.css` |
| Scroll Fade In | 本文・カードなどが画面に入ったとき、下から1回だけふわっと表示 | `assets/styles/reveal.css` / `directives/reveal.js`（`v-reveal`） |
| セクションタイトル | 番号・英字ラベル・見出しが横からスッと表示され、その後に本文・カードが表示 | `assets/styles/heading-reveal.css` / `composables/useHeadingReveal.js` |
| アイコン | 03〜06 のアイコンが、後ろの淡い光とともにゆっくり浮遊・呼吸 | `assets/styles/premium-icon.css` |
| カード（Shadow / Floating） | メンバー・仕事・成長ステップ・キャリア・選考の流れのカードが、影とともにゆっくり浮遊 | `MemberCard.vue` / `JobCard.vue` / `GrowthSection.vue` / `CareerCard.vue` / `SelectionFlowSection.vue` |
| 装飾 | 手書き風メモの浮遊、線を描く演出、光の反射など | 各セクションの `.vue` |
| Header | ナビの hover、CASUAL TALK の表示・線・浮遊、SP メニュー | `AppHeader.vue` |
| Footer | ナビの hover（少し明るく・1px 上へ） | `AppFooter.vue` |

### レスポンシブ対応

- PC / Tablet / SP に対応しています。主な切り替え幅は **1080px**（Header がメニューボタン形式に）と **767px**（SP レイアウト・SP 用画像）です。
- 文字サイズや余白は `clamp()` で画面幅に合わせて変化します。
- SP では装飾の数や動く距離を減らし、横スクロールが出ないようにしています。

### アクセシビリティ

- 端末で「視差効果を減らす／動きを減らす」を設定している場合は、アニメーションが止まり、完成した状態で表示されます。
- スクロール表示は、JavaScript が動かない環境では最初から全部表示されます（`index.html` の保険処理）。
- Hero・Final CTA は画像のみですが、見出し（`title`）と代替テキスト（`alt`）を読み上げソフト・検索エンジン向けに設定しています。

---

## 6. フォルダ構成

```
engineer-midcareer-colorful-lp/
├── README.md
└── frontend/
    ├── index.html                     … フォントの読み込み・表示前のちらつき防止
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── App.vue                    … セクションの並び順
        ├── main.js                    … アプリの起動・CSS の読み込み
        ├── data/
        │   └── lpContent.js           … ★文章・リンク・画像パス（ここを編集）
        ├── utils/
        │   ├── image.js               … 画像読み込みの仕組み
        │   └── opening.js             … オープニングと LP 本体の連携用
        ├── directives/
        │   └── reveal.js              … スクロール表示（v-reveal）
        ├── composables/
        │   └── useHeadingReveal.js    … セクションタイトルの表示
        ├── assets/
        │   ├── images/                … ★画像（詳しくは「画像を変更する方法」）
        │   └── styles/
        │       ├── variables.css      … 色・余白・角丸・影・文字サイズの共通値
        │       ├── base.css           … ページ全体の基本スタイル
        │       ├── lp.css             … 複数セクション共通のスタイル
        │       ├── ambient.css        … ページ全体の背景アニメーション
        │       ├── reveal.css         … スクロール表示の見た目
        │       ├── heading-reveal.css … セクションタイトルの表示
        │       └── premium-icon.css   … アイコンの光・浮遊
        └── components/
            ├── common/
            │   ├── OpeningScreen.vue      … オープニング（ページめくり）
            │   ├── OpeningSheet.vue       … オープニングの紙の内容
            │   ├── PreaiLogo.vue          … PREAI ロゴ（Header / Footer / Opening 共通）
            │   ├── AmbientBackground.vue  … ページ全体の背景アニメーション
            │   └── IllustrationFrame.vue  … 画像の共通表示枠（02 / 04 で使用）
            └── lp/
                ├── AppHeader.vue            … Header ＋ SP メニュー
                ├── HeroSection.vue          … メインビジュアル
                ├── MembersSection.vue       … 01 MEMBERS
                ├── JobsSection.vue          … 02 OUR WORK
                ├── GrowthSection.vue        … 03 GROWTH STEP
                ├── CareerSupportSection.vue … 04 SUPPORT
                ├── CareerPathsSection.vue   … 05 CAREER PATH
                ├── InterviewSection.vue     … 06 INTERVIEW
                ├── SelectionFlowSection.vue … 07 FLOW
                ├── FinalCtaSection.vue      … Final CTA
                ├── AppFooter.vue            … Footer
                ├── SectionHeading.vue       … 番号付きセクション見出し（共通）
                ├── MemberCard.vue
                ├── JobCard.vue
                ├── CareerCard.vue
                └── CtaButton.vue            … 黄色の CTA ボタン（現在は未使用）
```

---

## 7. 開発環境の起動方法

事前に [Node.js](https://nodejs.org/) をインストールしてください（Vite 7 の要件により **v20.19 以上** または **v22.12 以上**）。
コマンドはすべて **`frontend/` フォルダの中で** 実行します。

```bash
cd frontend

# 最初の1回だけ（必要なパッケージをインストール）
npm install

# 開発用サーバーを起動（表示された URL をブラウザで開く。通常は http://localhost:5173）
npm run dev

# 本番用ファイルを作成（frontend/dist/ に出力）
npm run build

# 作成した本番用ファイルをローカルで確認
npm run preview
```

| コマンド | 実行内容（`package.json`） |
| --- | --- |
| `npm run dev` | `vite` |
| `npm run build` | `vite build` |
| `npm run preview` | `vite preview` |

---

## 8. デプロイ

### GitHub

ソースコードは GitHub で管理しています。

- リポジトリ：<https://github.com/KHAING-123/engineer-midcareer-colorful-lp>
- `node_modules/` と `dist/` は `.gitignore` で除外しています（ビルドはデプロイ先で行います）。

### Vercel

リポジトリ内に Vercel 用の設定ファイル（`vercel.json`）はありません。Vercel 側のプロジェクト設定で、次のように指定します。

| 項目 | 設定値 |
| --- | --- |
| **Root Directory** | `frontend`（`package.json` が `frontend/` にあるため必須） |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

- GitHub リポジトリを Vercel に連携すると、push のたびに自動でビルド・デプロイされます。
- Root Directory を設定しないと、`package.json` が見つからずビルドに失敗します。

---

## 付録A：文章・リンクを変更する方法

**文章・リンク・画像パスは、すべて `frontend/src/data/lpContent.js` にまとまっています。**

| 変更したいもの | lpContent.js の場所 |
| --- | --- |
| オープニングの英文・キーワード | `opening.lines` / `opening.keywords` |
| ヘッダーのメニュー（日本語・英字・下線の色・移動先） | `header.nav` |
| ヘッダー右の「CASUAL TALK / まずは話を聞いてみる」 | `header.cta.labelEn` / `header.cta.label` |
| スマホのメニューボタンの文字（MENU / CLOSE） | `header.menuText` / `header.menuCloseText` |
| Hero の見出し・画像の説明（画面には表示されない） | `hero.title` / `hero.alt` |
| 各セクションの見出し・説明文 | `membersSection` / `jobsSection` / `growthSection` / `supportSection` / `careersSection` / `interview` / `selectionSection` |
| 01 メンバー（名前・年齢・前職・現職・コメント） | `members` |
| 01 手書き風メッセージ・ピンクの丸のメッセージ | `membersSection.handwritten` / `membersSection.sideNote` |
| 02 仕事内容（タイトル・説明・スキルタグ・画像） | `jobs` |
| 03 成長ステップ / 手書き風メモ | `growthSteps` / `growthSection.note` |
| 04 成長環境の4項目 | `supportItems` |
| 05 キャリアの広がり / 手書き風メモ | `careers` / `careersSection.note` |
| 06 面接でお話しすること / 3つのポイント / メモ | `interview.topics` / `interview.points` / `interview.note` |
| 07 選考の流れ（STEP 名・日数・メモ・丸の色） | `selectionFlow` |
| Final CTA（画像の説明文） | `finalCta.alt` |
| フッター（リンク・コピーライト） | `footer` |

### 編集のルール

- 文章は `'...'`（シングルクォート）の **中だけ** を書き換えてください。行の最後の `,`（カンマ）は消さないでください。
- 改行したいところには `\n` と書きます（例：`title: 'どんな人が\n働いている？'`）。
- 文章の中で `'` を使いたいときは `\'` と書きます。
- 保存すると `npm run dev` 中のブラウザにすぐ反映されます。画面が真っ白になったら、カンマやクォートの消し忘れがないか確認してください。
- メンバーやカードは `{ ... },` のかたまりが1件分です。増やすときはまるごとコピーし、減らすときはかたまりごと削除します。

### 色の指定に使える値

| 項目 | 使える値 |
| --- | --- |
| `members` / `jobs` / `growthSteps` / `supportItems` / `careers` の `accent` | `'yellow'` / `'pink'` / `'green'` / `'blue'` |
| `header.nav` の `accent`（ナビの下線） | `'coral'` / `'mint'` / `'yellow'` / `'pink'` / `'blue'` |
| `opening.keywords` の `accent` | `'coral'` / `'blue'` / `'mint'` |
| `selectionFlow` の `circle`（アイコンの後ろの丸） | `'blue'` / `'yellow'` / `'sky'` / `'lavender'` / `'pink'` / `'green'` |
| `interview.topics` の `accent`（アイコンの後ろの丸） | `'green'` / `'pink'` / `'blue'` / `'yellow'` |
| `interview.points` の `accent`（カードの色） | `'yellow'` / `'blue'` / `'green'` |

### 注意点

- ヘッダーの「まずは話を聞いてみる」は表示用の文字です（リンクではありません）。`header.cta.href` と `ENTRY_URL` は現在使われていません。
- Final CTA の「まずは話を聞いてみる」は画像の中に描かれています。`finalCta.button` は現在使われていません。
- フッターの「会社概要」は新しいタブで開き、外部リンクアイコンが付きます（`external: true`）。
- フッターの「プライバシーポリシー」「利用規約」のリンク先は現在仮の URL（`example.com`）です。
- フッターの SNS（`footer.sns`）はコメントアウトしているため表示されません。戻すとアイコンが表示されます。

---

## 付録B：画像を変更する方法

画像はすべて `frontend/src/assets/images/` の中にあります。

### 差し替えのルール

- **同じ名前の画像ファイルを置くだけで差し替わります。**
  使える形式は `.png` / `.webp` / `.jpg` / `.jpeg` / `.avif` / `.gif` / `.svg` です。
- 同じ名前が複数ある場合は **png → webp → jpg → jpeg → avif → gif → svg** の順に優先されます。
  そのため `lpContent.js` に書いた拡張子と実際のファイルの拡張子が違っても表示されます。
- 別の名前の画像を使うときは、`lpContent.js` の画像パスを書き換えます（`src/assets/images/` から先の部分だけ。例：`'members/member-01.png'`）。
- 人物・イラストなどは **背景透過の PNG** を使ってください。後ろの丸・光・葉っぱなどの装飾は CSS で描いているため、白背景入りの画像だと白い四角がそのまま表示されます。
- 画像を置いたあとは、`npm run dev` を一度止めて起動し直すと確実です。

### どの画像がどこにあるか

| 画像 | 置き場所 | 現在のファイル |
| --- | --- | --- |
| **Hero** | `hero/` | PC 用 `hero-pc.png` / SP 用 `hero-sp.png` |
| 01 メンバー | `members/` | `member-01.png` `member-02.png` `member-03.png` |
| 02 仕事 | `jobs/` | `work-pm-pmo.png` `work-ai-dx-support.png` `work-automation.png` |
| 03 成長ステップのアイコン | `icons/growth/` | `growth-basic-learning.svg` など4点 |
| 04 成長環境のアイコン | `icons/support/` | `support-mentor.png` など4点 |
| 04 イラスト | `support/` | `support-mentor-illustration.png` |
| 05 キャリアのアイコン | `icons/career/` | `career-developer.png` など5点 |
| 06 面接のイラスト | `interview/` | `interview-conversation-illustration.jpg` |
| 06 アイコン | `icons/interview/` | `interview-learning.svg` `point-clothes.svg` など7点 |
| 07 選考の流れのアイコン | `icons/selection/` | `selection-document.png` など5点 |
| **Final CTA** | `cta/` | PC 用 `final-cta-pc.png` / SP 用 `final-cta-sp.png` |
| 装飾（葉っぱ・ドットなど） | `common/` | `deco-leaf.svg` `deco-leaf-pair.svg` `deco-dots.svg` など |
| SNS アイコン（現在は非表示） | `icons/sns/` | `sns-x.svg` `sns-instagram.svg` `sns-youtube.svg` |

- PREAI ロゴは画像ファイルではなく `components/common/PreaiLogo.vue`（インライン SVG）です。`common/preai-logo.svg` は現在使われていません。
- `growth/` `career/` `selection/` は、各セクション用の写真・イラストを追加するときのための予備フォルダです。

### 画像ごとの注意

- **Hero**：画面幅 767px 以下で SP 用、それより広いと PC 用が表示されます。画面幅いっぱい（最大 1440px）に、縦横比を保ったまま表示されます（切り取りなし）。画像内のキャッチコピーを変えたら、`hero.title` と `hero.alt` も同じ内容にしてください。
- **01 メンバー**：丸く切り抜かれるため、正方形・人物が中央の画像がおすすめです（推奨 480×480px）。
- **02 仕事**：横長（約 3:2）・余白が少ない背景透過 PNG がおすすめです。共通の表示枠（`IllustrationFrame.vue`）に入るので、比率が違っても枠内に収まり、レイアウトは崩れません。
- **アイコン**：正方形（推奨 240×240px）の背景透過 PNG または SVG がおすすめです。
- **Final CTA**：画像だけを表示します。画像内の文字を変えたら `finalCta.alt` も書き換えてください。文字の入っていない画像にする場合は `finalCta.showText` を `true` にすると、`title` / `lead` が文字で表示されます。

---

## 付録C：デザイン（色・余白など）を変更する方法

色・余白・角丸・影・文字サイズ・ヘッダーの高さなどの共通値は `frontend/src/assets/styles/variables.css` にまとまっています。

例：黄色を変える → `--color-yellow`／ヘッダーの高さを変える → `--header-height`

セクション固有のレイアウトとアニメーションは、各 `.vue` ファイルの `<style scoped>` にあります。
