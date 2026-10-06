# engineer_rookie_lp

ルーキー（若手・未経験者）向け採用LPです。Vue 3 + Vite で作っています。

**プロジェクト本体は `frontend/` フォルダにあります。** 以下のパスはすべて `frontend/` から見た場所です。

---

## 1. 起動・ビルド方法

事前に [Node.js](https://nodejs.org/)（v20以上）をインストールしてください。
コマンドはすべて **`frontend/` フォルダの中で** 実行します。

```bash
cd frontend

# 最初の1回だけ（必要なパッケージをインストール）
npm install

# 開発用サーバーを起動（ブラウザで http://localhost:5173 を開く）
npm run dev

# 本番用ファイルを作成（frontend/dist/ に出力されます）
npm run build

# 本番用ファイルをローカルで確認
npm run preview
```

---

## 2. 文章・リンクを変更する方法

**文章・タイトル・メモの文言・リンク先は、すべて次の1ファイルにまとまっています。**

```
frontend/src/data/lpContent.js
```

| 変更したいもの | lpContent.js の場所 |
| --- | --- |
| ヘッダーのメニュー（日本語・英字・下線の色・移動先） | `header.nav` |
| ヘッダー右の「CASUAL TALK / まずは話を聞いてみる」 | `header.cta` |
| スマホのメニューボタンの文字（MENU / CLOSE） | `header.menuText` / `header.menuCloseText` |
| 各セクションの見出し・説明文 | `membersSection` / `jobsSection` / `growthSection` / `supportSection` / `careersSection` / `interview` / `selectionSection` |
| 01 メンバー（名前・年齢・前職・現職・コメント） | `members` |
| 01 手書き風メッセージ・ピンクの丸のメッセージ | `membersSection.handwritten` / `membersSection.sideNote` |
| 02 仕事内容（タイトル・説明・スキルタグ・画像） | `jobs` |
| 03 成長ステップ | `growthSteps` |
| 03 メモ「未経験から、できるを増やそう。」 | `growthSection.note` |
| 04 キャリアサポート | `supportItems` |
| 05 キャリアの広がり（5枚のカード） | `careers` |
| 05 メモ「未来の選択肢、ここから広がる。」 | `careersSection.note` |
| 06 「面接でお話しすること」4項目（文章・アイコン・丸の色） | `interview.topics` |
| 06 下の3つのポイント（タイトル・説明・アイコン・色） | `interview.points` |
| 06 イラスト横のメモ「リラックスしてお話ください。」 | `interview.note` |
| 07 選考の流れ（STEP名・日数・メモ・丸の色） | `selectionFlow` |
| 最後のCTA（画像の説明文） | `finalCta` |
| フッター（リンク・SNS・コピーライト） | `footer` |

### 編集のルール

- 文章は `'...'`（シングルクォート）の **中だけ** を書き換えてください。
- 行の最後の `,`（カンマ）は消さないでください。
- 改行したいところには `\n` と書きます。
  例：`title: 'どんな人が\n働いている？'`
- 文章の中で `'` を使いたいときは `\'` と書きます。
- 保存すると `npm run dev` 中のブラウザにすぐ反映されます。
  画面が真っ白になったら、カンマやクォートの消し忘れがないか確認してください。

### 色付き・下線付きの言葉があるメモ

一部のメモは、色を変える言葉だけを別の項目に分けています。つなげて読むと1つの文章になります。

```js
// 03 成長ステップ：「未経験から、」＋「できる（コーラル色）を増やそう。」
note: { line1: '未経験から、', highlight: 'できる', line2: 'を増やそう。' }

// 05 キャリアの広がり：「未来（コーラル色＋黄色の下線）の選択肢、」＋「ここから広がる。」
note: { highlight: '未来', line1: 'の選択肢、', line2: 'ここから広がる。' }
```

### 「まずは話を聞いてみる」について

- **ヘッダー**：表示用の文字です（リンク・ボタンではありません）。
  文字は `header.cta.label`、上の英字は `header.cta.labelEn` で変更します。
  `header.cta.href` と `ENTRY_URL` は現在使われていません。
- **最後のCTA**：画像（`src/assets/images/cta/`）の中に描かれています。文字を変える場合は画像を差し替えてください。
  `finalCta.button` は現在使われていません。

### メンバー・カードを増やす／減らす

`members` や `jobs` などは `{ ... },` のかたまりが1件分です。
増やすときはかたまりをまるごとコピーして並べ、減らすときはかたまりごと削除してください。

色の指定に使える値：

| 項目 | 使える値 |
| --- | --- |
| `members` / `jobs` / `growthSteps` / `supportItems` / `careers` の `accent` | `'yellow'` / `'pink'` / `'green'` / `'blue'` |
| `header.nav` の `accent`（ナビの下線） | `'coral'` / `'mint'` / `'yellow'` / `'pink'` / `'blue'` |
| `selectionFlow` の `circle`（アイコンの後ろの丸） | `'blue'` / `'yellow'` / `'lavender'` / `'pink'` / `'green'` |
| `interview.topics` の `accent`（アイコンの後ろの丸） | `'green'` / `'pink'` / `'blue'` / `'yellow'` |
| `interview.points` の `accent`（カードの色） | `'yellow'` / `'blue'` / `'green'` |

---

## 3. 画像を変更する方法

画像はすべて `frontend/src/assets/images/` の中にあります。

### 画像素材のルール（重要）

人物・イラスト・PC・スマホなどの画像は、**背景透過のPNG** を使ってください。

- 画像の後ろにある淡い色の丸・光・葉っぱなどの装飾は、すべて **CSS側** で描いています。
  背景透過PNGなら、セクションの背景や装飾が透明部分からそのまま見えて、自然になじみます。
- **白い背景が入ったPNGを使うと、その白い四角がそのまま表示されます**（CSSで白を消す処理はしていません）。
  白い四角が見えるときは、素材を背景透過PNGに作り直してください。
- 02 の仕事画像と、04・06 のイラストは、共通の表示枠（`src/components/common/IllustrationFrame.vue`）に入っています。
  サイズや縦横比が違う画像に差し替えても、はみ出したり切れたりせず、レイアウトも崩れません（枠内に全体が収まるよう自動で縮小）。
  できるだけ **今の画像と近い縦横比・周りの余白が少ない画像** にすると、いちばん大きくきれいに表示されます。

### いちばん簡単な差し替え方法

**同じ名前の画像ファイルをフォルダに置くだけで差し替わります。**

- 使える形式：`.png` / `.jpg` / `.jpeg` / `.webp` / `.svg`
- 同じ名前が複数ある場合の優先順：png → webp → jpg → jpeg → svg
  （例：`selection-document.svg` と `selection-document.png` がある場合は `.png` が表示されます）
- 画像を置いたあとは、`npm run dev` を一度止めて起動し直すと確実です。

別の名前の画像を使いたい場合は、`lpContent.js` の画像パスを書き換えてください。
パスは `src/assets/images/` から先の部分だけを書きます。

```js
image: 'members/member-01.png',   // → frontend/src/assets/images/members/member-01.png
```

### どの画像がどこにあるか

`frontend/src/assets/images/` から見た場所です。

| 変更したい画像 | 置き場所 | ファイル名 |
| --- | --- | --- |
| **Hero（メインビジュアル）** | `hero/` | PC用 `rookie-hero-pc.png`／スマホ用 `rookie-hero-sp.png` |
| **人物画像（01 メンバー）** | `members/` | `member-01.png` `member-02.png` `member-03.png` |
| **仕事画像（02）** | `jobs/` | `web-development.png` `mobile-development.png` `ai-data-development.png` |
| 成長ステップのアイコン（03） | `icons/growth/` | `growth-basic-learning` など |
| キャリアサポートのアイコン（04） | `icons/support/` | `support-mentor.png` など |
| キャリアサポートの人物イラスト（04） | `support/` | `support-mentor-illustration.png` |
| キャリアのアイコン（05） | `icons/career/` | `career-developer.png` など |
| 面接の人物イラスト（06） | `interview/` | `interview-conversation-illustration.png` |
| 面接でお話しすること・ポイントのアイコン（06） | `icons/interview/` | `interview-learning.svg` `point-clothes.svg` など |
| 選考の流れのアイコン（07） | `icons/selection/` | `selection-document` など |
| **Final CTA** | `cta/` | PC用 `final-cta-pc.png`／スマホ用 `final-cta-sp.png` |
| ロゴ・装飾（葉っぱ・ドットなど） | `common/` | `preai-logo.svg` `deco-leaf.svg` など |
| SNSアイコン | `icons/sns/` | `sns-x` `sns-instagram` `sns-youtube` |

- `growth/` `career/` `selection/` フォルダは、各セクション用の写真・イラストを追加するときのための予備フォルダです。
- 03・07 のアイコンと SNS アイコンは、現在は仮の画像（`.svg`）です。同じ名前の `.png` を置くと差し替わります。
- 07 の仮アイコンには淡い色の丸が描き込まれています。背景透過のアイコンに差し替えると、CSS の丸（`circle` の色）だけがきれいに見えます。

### Hero画像を変更する場合

1. PC用画像を `hero/rookie-hero-pc.png` として保存
2. スマホ用画像を `hero/rookie-hero-sp.png` として保存
3. 画像内のキャッチコピーを変えた場合は、`lpContent.js` の `hero.title`（見出し）と `hero.alt`（画像の説明）も同じ内容に書き換えてください。
   画面には表示されませんが、検索エンジンや読み上げソフトが使います。

- 画面幅 767px 以下でスマホ用、それより広いとPC用が表示されます。
- 画像は画面幅いっぱい（最大1440px）に、縦横比を保ったまま表示されます（切り取りなし）。
- 画像の上に、ゆっくり漂う葉っぱの装飾（CSS）を重ねています。画像そのものは動きません。

### 人物画像を変更する場合（01 メンバー）

`members/` に `member-01.png` のように保存します。
丸く切り抜かれて表示されるので、**正方形・人物が中央** の画像がおすすめです（推奨 480×480px）。
名前・年齢・前職などは `lpContent.js` の `members` で変更します。

### 仕事画像を変更する場合（02 PREAIでの仕事）

`jobs/` に同じ名前で保存するだけで差し替わります。

- おすすめ：**背景透過のPNG**・周りの余白が少ない・**横長（約3:2）**
- 画像の後ろの淡い色の丸はCSSで描いているので、背景透過の画像ならその上にきれいに重なります。
- 比率やサイズが違う画像でも、カードの大きさ・タイトル位置は変わらず、画像は枠内に収まるよう自動で縮小されます。
- 丸の色は `lpContent.js` の `jobs` の `accent` で変更できます。

### アイコンを変更する場合

`icons/` の中の各フォルダに、同じ名前で保存します。
**正方形** の画像（推奨 240×240px、背景透過PNGまたはSVG）がおすすめです。

### Final CTA 画像を変更する場合

`cta/` に `final-cta-pc.png`（PC用）と `final-cta-sp.png`（スマホ用）を保存します。

- Final CTA は **画像だけ** を表示します。「まずは話を聞いてみる」も画像の中に描いてください（HTMLのボタン・リンクはありません）。
- 画像の中の文字を変えたら、`lpContent.js` の `finalCta.alt` も同じ文字に書き換えてください（読み上げソフト用）。
- 現在の画像には見出しの文字が入っているため、`finalCta.showText` は `false`（HTMLの見出しは非表示・読み上げ用のみ）にしています。
  文字の入っていない画像に変える場合は `true` にしてください。

---

## 4. デザイン（色・余白など）を変更する方法

色・角丸・影・文字サイズ・ヘッダーの高さなどの共通値は、次のファイルにまとまっています。

```
frontend/src/assets/styles/variables.css
```

例：黄色を変える → `--color-yellow` を変更／ヘッダーの高さを変える → `--header-height` を変更

| ファイル | 内容 |
| --- | --- |
| `src/assets/styles/variables.css` | 色・余白・角丸・影・文字サイズ・ヘッダーの高さの共通値 |
| `src/assets/styles/base.css` | ページ全体の基本スタイル |
| `src/assets/styles/lp.css` | カード・装飾など複数セクション共通のスタイル |
| `src/assets/styles/ambient.css` | ページ全体の背景アニメーション（淡い光・光の流れ・葉っぱ・ドット） |
| `src/assets/styles/reveal.css` | スクロールでふわっと表示する演出の見た目（移動量・時間） |
| 各 `.vue` ファイルの `<style scoped>` | そのセクションだけのレイアウトとアニメーション |

フォントは Google Fonts の **Zen Maru Gothic**（見出し・手書き風メモ）、**Noto Sans JP**（本文）、**Caveat**（英字の手書き風）を使っています（`frontend/index.html` で読み込み）。

---

## 5. アニメーションについて

ページ全体に、ゆっくりした常時アニメーションが入っています。

| 種類 | 内容 | 設定している場所 |
| --- | --- | --- |
| 背景 | 淡い色の光・光の流れ・葉っぱ・ドットがゆっくり動く | `ambient.css` / `components/common/AmbientBackground.vue` |
| スクロール表示 | 各セクションが画面に入ったとき、下から1回だけふわっと表示 | `reveal.css` / `directives/reveal.js`（テンプレートの `v-reveal`） |
| セクションごと | カードの浮遊・影、手書き風メモの浮遊、線を描く演出など | 各セクションの `.vue` |
| ヘッダー | ナビの hover、CASUAL TALK の線・3本線・浮遊、スマホメニューの背景 | `components/lp/AppHeader.vue` |

- 端末で **「視差効果を減らす／動きを減らす」** を設定している場合は、動きがすべて止まり、完成した状態で表示されます。
- スクロール表示は、JavaScript が動かない環境では最初から全部表示されます。

---

## 6. ファイル構成

```
frontend/
├── index.html                   … フォントの読み込み・表示前のちらつき防止
├── package.json
└── src/
    ├── App.vue                  … セクションの並び順
    ├── main.js
    ├── data/
    │   └── lpContent.js         … ★文章・リンク・画像パス（ここを編集）
    ├── utils/
    │   └── image.js             … 画像読み込みの仕組み（通常は編集不要）
    ├── directives/
    │   └── reveal.js            … スクロール表示の仕組み（通常は編集不要）
    ├── assets/
    │   ├── images/              … ★画像
    │   └── styles/              … CSS
    └── components/
        ├── common/
        │   ├── AmbientBackground.vue … ページ全体の背景アニメーション
        │   └── IllustrationFrame.vue … 画像の共通表示枠（差し替えに強い）
        └── lp/
            ├── AppHeader.vue           … ヘッダー＋スマホメニュー
            ├── HeroSection.vue         … メインビジュアル
            ├── MembersSection.vue      … 01 どんな人が働いている？
            ├── JobsSection.vue         … 02 PREAIでの仕事
            ├── GrowthSection.vue       … 03 成長ステップ
            ├── CareerSupportSection.vue… 04 キャリアサポート
            ├── CareerPathsSection.vue  … 05 キャリアの広がり
            ├── InterviewSection.vue    … 06 面接について
            ├── SelectionFlowSection.vue… 07 選考の流れ
            ├── FinalCtaSection.vue     … 最後のCTA
            ├── AppFooter.vue           … フッター
            ├── SectionHeading.vue      … 番号付きセクション見出し（共通）
            ├── CtaButton.vue           … 黄色のCTAボタン（現在は未使用）
            ├── MemberCard.vue
            ├── JobCard.vue
            └── CareerCard.vue
```
