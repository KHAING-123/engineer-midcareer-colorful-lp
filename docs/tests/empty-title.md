# Customer Input — PREAI 未経験向け Colorful LP

## このファイルの目的
現在のLPの文章・画像・リンクを、LP制作の入力資料として整理する。
このファイルを作成する段階では、LPのコードや内容は変更しない。

## 記載ルール
- 提供された lpContent.js を基準とする。
- 文章内の改行は、コードブロック内の実際の改行で示す。
- 画像・アイコンのパスは、lpContent.js に書かれた「設定パス」（frontend/src/assets/images/ 基準）で記載する。
- 設定パスと実在するファイル、実際に表示される画像は一致しない場合がある。区別は「15. 画像・素材の扱い」に記載する。
- 画像内の文章は、実際の画像との照合が必要（未実施）。
- コードの確認で分かったことと、ブラウザ・実画像で確認が必要なことを区別する。
- 「未確認」と書かれた情報は推測で補わない。
- example.com のURLは仮リンクとして扱う。
- 表示・未使用の区別は、主に lpContent.js のコメントに基づく。

## 1. 基本情報

- 会社名・ブランド名：PREAI
- 法人表記：株式会社PREAI（Copyrightより）
- LP名：未経験向け Colorful LP
- サービス名・募集名の正式名称：未確認
- LPの目的：未経験者向けの採用・応募促進（LP内容から整理）
- ターゲット：IT・エンジニア職に未経験から挑戦したい人（LP内容から整理）
- デザインパターン：Colorful
- 主な訴求：
  - 実践型AI・IT研修
  - PMO・AI・DX導入支援などの実務経験
  - キャリアコンサルによる1on1
  - AIツールの活用・業務自動化
- 共通の応募・問い合わせURL（lpContent.js の ENTRY_URL）：https://example.com/entry
- URLの状態：仮リンク。正式な応募先は未確認。
- ENTRY_URL は設定されているが、現在のコードでは実際の応募リンク（`<a>`）に使われていない（コード確認済み）。
  - Header CTA：表示のみ（`header.cta.href` は読み込まれていない）。
  - 最終CTA：画像のみ（`finalCta.button` は未使用）。
  - 応募導線をリンクにするかは、案件の要件に合わせて今後決める。

### ロゴ
- lpContent.js の設定：`site.logo` = common/preai-logo.svg、`site.logoAlt` = PREAI
- 実際の表示（コード確認済み）：Header・Footer・Opening は PreaiLogo.vue のインラインSVGで描画している。`site.logo`（画像ファイル）を参照するコンポーネントは確認できなかった。
- common/preai-logo.svg はファイルとして存在する（画面表示への使用は確認できず）。
- 代替テキスト（aria-label）：`site.logoAlt` = PREAI。Footerは「PREAI トップへ戻る」。
- 実際の見た目（SVGとファイルの一致など）：ブラウザ・実画像で未確認。

## 2. ページ構成

以下の順番を維持する。

1. Opening
2. Header
3. FV
4. 01 MEMBERS
5. 02 OUR WORK
6. 03 GROWTH STEP
7. 04 SUPPORT
8. 05 CAREER PATH
9. 06 INTERVIEW
10. 07 FLOW
11. 最終CTA
12. Footer

## 3. Opening

### 英文
```text
YOUR EXPERIENCE.
YOUR NEXT FUTURE.
```

### キーワード
| 文言 | 色 |
|---|---|
| AI | coral |
| CAREER | blue |
| GROWTH | mint |

## 4. Header

### ナビゲーション
ナビは5項目で、全Sectionへのリンクではない（コード確認済み）。

- リンクがあるSection：01 MEMBERS（#members）、02 OUR WORK（#jobs）、03 GROWTH STEP（#growth）、05 CAREER PATH（#careers）、06 INTERVIEW（#interview）。
- 対応する `id` は各Sectionに存在する。
- リンクがないSection：04 SUPPORT（#support）、07 FLOW（#selection）、最終CTA（#entry）。
- 「選考・面接」は #interview（06）に移動し、07 FLOW（#selection）には移動しない。
- 固定ヘッダーとの重なり、スクロール位置は、ブラウザで未確認。

| 日本語 | 英字 | リンク先 | 色 |
|---|---|---|---|
| 働く人 | PEOPLE | #members | coral |
| 仕事を知る | WORK | #jobs | mint |
| 成長のサポート | GROWTH | #growth | yellow |
| キャリア | CAREER | #careers | pink |
| 選考・面接 | INTERVIEW | #interview | blue |

### CTA表示
- 日本語：まずは話を聞いてみる
- 英字：CASUAL TALK
- 設定URL：https://example.com/entry（`header.cta.href`）
- 現在の扱い：表示のみ。リンクでもボタンでもない（コード確認済み）。
  - PC表示・SPメニュー内ともに `<p>` 内のテキストで、`<a>`・`<button>` ではない。
  - 設定URLは読み込まれていない。
- 応募リンクの有無：今後、案件の要件に合わせて決める。

### SPメニュー
- 閉じた状態：MENU
- 開いた状態：CLOSE
- 開く操作の読み上げ文言：メニューを開く
- 閉じる操作の読み上げ文言：メニューを閉じる

## 5. FV

### 見出し
```text
未経験から、エンジニアへ。PREAIで一緒に成長しよう。
```

### 画像
- PC：hero/hero-pc.png
- SP：hero/hero-sp.png

### 代替テキスト
```text
未経験から、エンジニアへ。PREAIで一緒に成長しよう。笑顔で働く若手エンジニアのイラスト
```

### 表示上の注意
- FVはPC・SP用の画像を切り替えて表示する。
- titleは画面上には表示しない見出しとして使用する。
- 画面上の文章は画像内に含まれる。
- titleやaltを編集しても、画像内の文章は変わらない。
- 画像内の全文：実画像との照合が必要。
- 独立したFV説明文：lpContent.jsには設定なし。

## 6. 01 MEMBERS

- 対応データ：membersSection / members
- 番号：01
- 英字：MEMBERS

### 見出し
```text
どんな人が
働いている？
```

### 説明文
```text
PREAIには、さまざまな経験や強みを持ったメンバーが働いています。
これまで培ってきた経験を活かしながら、IT・AIという新しいスキルを身につけ、
それぞれのキャリアに挑戦しています。

共通しているのは、
新しいことを学び、自分の可能性を広げようとする姿勢です。
```

### 右側の補足メッセージ
```text
一歩ずつ、
できることが
増えていく。
```

### メンバー画像
| ID | 画像 | 代替テキスト |
|---|---|---|
| member-01 | members/member-01.png | メンバー紹介画像1：キャリアコンサルタント兼エンジニアのメンバー |
| member-02 | members/member-02.png | メンバー紹介画像2：台湾出身のエンジニア兼SNS担当のメンバー |
| member-03 | members/member-03.png | メンバー紹介画像3：エンジニア兼事務のメンバー |

### 使用方針
- 現在の見出し・説明文・補足メッセージ・画像をそのまま使用する。
- 名前・年齢・コメントなどは画像内に含まれている。
- 画像内の情報は、lpContent.jsからは全文を取得できない。

## 7. 02 OUR WORK

- 対応データ：jobsSection / jobs
- 番号：02
- 英字：OUR WORK

### 見出し
```text

```

### 説明文
```text
お客様の課題を整理し、AIやITを活用して解決へ導く仕事です。
まずはPMOやAI導入支援から経験し、
将来的には要件定義やプロジェクトマネジメントにも挑戦できます。
```

### 仕事1：PM・PMO
- 画像：jobs/work-pm-pmo.png
- 代替テキスト：パソコン画面でWebアプリを開発しているイラスト
- スキルタグ：Excel / PowerPoint / Teams / Slack / 生成AI
- 色：yellow

説明：
```text
大手企業のDX・ITプロジェクトに参画し、
会議運営、進捗・課題管理、関係者との調整などを担当します。
経験を積みながら、要件整理や顧客折衝、プロジェクト全体を動かすPM業務へと
ステップアップしていきます。
```

### 仕事2：AI・DXツール導入支援
- 画像：jobs/work-ai-dx-support.png
- 代替テキスト：スマートフォンアプリの画面を設計しているイラスト
- スキルタグ：Microsoft Copilot / Power Platform（Power Apps等） / ChatGPT / Claude / Gemini / NotebookLM
- 色：green

説明：
```text
大手企業を中心に、生成AIや
業務効率化ツールの導入・活用を支援します。
お客様の業務や課題を整理し、ツールの選定・
導入から、活用方法の検討、現場への
定着までサポートします。
```

### 仕事3：業務自動化
- 画像：jobs/work-automation.png
- 代替テキスト：グラフやAIのデータを分析しているイラスト
- スキルタグ：n8n / Claude Code / Codex / API連携
- 色：pink

説明：
```text
n8nやAIを活用し、これまで人が手作業で
行っていた業務を自動化します。
業務フローを整理し、AIや各種サービスを
組み合わせながら、実際に動く仕組みを
つくります。
```

## 8. 03 GROWTH STEP

- 対応データ：growthSection / growthSteps
- 番号：03
- 英字：GROWTH STEP

### 見出し
```text
実践から始める、
PREAIならではの
成長ステップ
```

### 説明文
```text
知識を学ぶだけではなく、
AI・自動化ツールを実際に作るところからスタート。
実務経験とキャリア支援を通じて、自分の強みを伸ばしていきます。
```

### 補足メッセージ
- line1：未経験から、
- highlight：できる
- line2：を増やそう。

### STEP 01：実践型AI・IT研修
- 期間：入社〜1ヶ月
- アイコン（設定パス。実体は .svg）：icons/growth/growth-basic-learning.png
- 色：yellow

説明：
```text
IT・AIの基礎を学びながら、n8nを使った業務自動化に挑戦。
実際に自分で自動化ツールを作り、AIを「知っている」だけではなく
「仕事で使える」状態を目指します。
```

### STEP 02：OJT・プロジェクト参加
- 期間：2ヶ月目〜
- アイコン（設定パス。実体は .svg）：icons/growth/growth-practice.png
- 色：pink

説明：
```text
先輩と一緒に実際のプロジェクトへ参画。
PMOやAI・DXツールの導入支援など、実務を経験しながら仕事の進め方や
顧客とのコミュニケーションを身につけます。
```

### STEP 03：定期的なキャリア1on1
- 期間：設定なし。コメントアウトされた期間は使用しない。
- アイコン（設定パス。実体は .svg）：icons/growth/growth-project.png
- 色：blue

説明：
```text
専属キャリアコンサルとの1on1を実施。
現在の経験や強み、目指したいキャリアを整理し、
次に身につけるスキルや挑戦する仕事を一緒に考えます。
```

### STEP 04：継続的なスキルアップ
- 期間：設定なし。コメントアウトされた期間は使用しない。
- アイコン（設定パス。実体は .svg）：icons/growth/growth-skill-up.png
- 色：green

説明：
```text
AI・ITの学習を継続しながら、要件定義やプロジェクトマネジメント、
AI活用・業務自動化など、目指すキャリアに必要な専門性を伸ばしていきます。
```

## 9. 04 SUPPORT

- 対応データ：supportSection / supportItems
- 番号：04
- 英字：SUPPORT
- 見出し：AI時代の成長環境
- 画像：support/support-mentor-illustration.png
- 代替テキスト：先輩メンターが後輩にパソコン画面を見せながら教えているイラスト

### 説明文
```text
PREAIでは、AIを研修だけで終わらせません。
日々の業務から実際のプロジェクトまで、AIを使い、つくり、活かす環境を整えています。
```

### サポート1：AIツール費用を会社負担
- アイコン：icons/support/support-mentor.png
- 色：pink

説明：
```text
必要なAIツールを、会社負担で利用できます。ChatGPTやClaude、Codexなど、
業務や本人のスキルに合わせて必要なAIツール・プランを会社が負担。新しいツールも積極的に取り入れています。
```

### サポート2：AIを日常業務で活用
- アイコン：icons/support/support-learning.png
- 色：blue

説明：
```text
AIは、特別なものではなく日々の仕事の一部です。情報収集や資料作成、アイデア整理、議事録、分析など、さまざまな業務でAIを活用。実務を通じて、AIを使いこなす力を身につけます。
```

### サポート3：AIで実際につくる
- アイコン：icons/support/support-consultation.png
- 色：yellow

説明：
```text
使うだけでなく、AIを活用して仕組みをつくります。n8nやClaude Code、Codexなどを活用し、業務自動化やツール開発に挑戦。自分で考え、実際に動くものをつくる経験を積めます。
```

### サポート4：AI・DX案件を経験
- アイコン：icons/support/support-certification.png
- 色：green

説明：
```text
学んだスキルを、実際のプロジェクトで活かします。大手企業を中心としたAI・DXプロジェクトに参画。Microsoft CopilotやPower Platformなどの導入・活用支援を通じて、AIをビジネスの現場で活かす経験を積みます。
```

## 10. 05 CAREER PATH

- 対応データ：careersSection / careers
- 番号：05
- 英字：CAREER PATH
- 見出し：キャリアの広がり
- 説明文：経験を積んだ先には、さまざまなキャリアの選択肢があります。

### 補足メッセージ
- highlight：未来
- line1：の選択肢、
- line2：ここから広がる。

### キャリア1：PM・プロジェクトマネージャー
- アイコン：icons/career/career-developer.png
- 色：yellow

説明：
```text
顧客やチームと連携
しながら、プロジェクト
全体を推進する。
```

### キャリア2：ITコンサルタント
- アイコン：icons/career/career-data-engineer.png
- 色：blue

説明：
```text
お客様の課題を整理し、
ITを活用した解決策を 
企画・提案する。
```

### キャリア3：AI・DXプロジェクトリーダー
- アイコン：icons/career/career-ai-engineer.png
- 色：green

説明：
```text
AI・DX導入プロジェクトの
中心となり、顧客・エンジニアを巻き込みながら導入を推進する。
```

### キャリア4：AI・自動化エンジニア
- アイコン：icons/career/career-project-leader.png
- 色：pink

説明：
```text
n8nやClaude Codeなどを活用し、
AIを組み込んだ業務自動化や仕組みをつくる。
```

### キャリア5：AIコンサルタント
- アイコン：icons/career/career-project-manager.png
- 色：yellow

説明：
```text
業務課題を分析し、
生成AIやAIツールを活用した業務改善を提案する。
```

## 11. 06 INTERVIEW

- 対応データ：interview
- 番号：06
- 英字：INTERVIEW
- 見出し：面接について
- 画像（設定パス。実体は .jpg）：interview/interview-conversation-illustration.png
- 代替テキスト：面接官と応募者が笑顔で会話しているイラスト

### 説明文
```text
面接では、これまでの経験や強み、これから挑戦したいことをお聞きします。
PREAIで経験できる仕事やキャリアについても詳しくお話しします。
まずはお互いを知るところから始めましょう。
```

### 補足メッセージ
```text
リラックスして
お話ください。
```

### リスト見出し
面接でお話しすること

### トピック1：あなたらしさについて
- これまで経験してきた仕事や、取り組んできたこと
- 自分の得意なことや、大切にしている考え方
- アイコン：icons/interview/interview-learning.svg
- 色：green

### トピック2
見出し：
```text
チームでの働き方
について
```

- これまで一緒に働いてきた人たちとの関わり方
- チームで仕事を進めるうえで、大切にしていること
- アイコン：icons/interview/interview-career.svg
- 色：pink

### トピック3
見出し：
```text
仕事への向き合い方
について
```

- これから挑戦してみたいこと
- IT・AIへの興味や、将来のキャリアについて
- アイコン：icons/interview/interview-idea.svg
- 色：blue

### トピック4
見出し：
```text
気になること・
聞いてみたいこと
```

- 仕事内容や、入社後の働き方について
- 研修・キャリア・勤務条件など、なんでもOK
- アイコン：icons/interview/interview-talk.svg
- 色：yellow

### 面接のポイント
| 見出し | 説明 | アイコン | 色 |
|---|---|---|---|
| 服装自由 | いつものスタイルでOKです | icons/interview/point-clothes.svg | yellow |
| オンライン面接OK | ご自宅からでも参加できます | icons/interview/point-online.svg | blue |
| 逆質問大歓迎 | 気になることもお気軽にどうぞ | icons/interview/point-question.svg | green |

### 改行の注意
トピック見出しの改行位置は、コメントによると幅が足りない場合の改行候補として扱う。実際の挙動はComponentで確認する。

## 12. 07 FLOW

- 対応データ：selectionSection / selectionFlow
- 番号：07
- 英字：FLOW
- 見出し：選考の流れ
- 説明文：シンプルでスピーディー、できるだけ早く結果をご連絡します。
- 注意事項：※ 選考状況により前後する場合があります。

### 選考ステップ
| 順番 | 名称 | 日数・表記 | アイコン | 色 |
|---|---|---|---|---|
| 1 | 書類選考 | 1日 | icons/selection/selection-document.png | blue |
| 2 | カジュアル面談 | オンライン/1日 | icons/selection/selection-casual-talk.png | yellow |
| 3 | 面接 | 1日 | icons/selection/selection-interview.png | sky |
| 4 | 条件確認 | 1日 | icons/selection/selection-conditions.png | lavender |
| 5 | 内定 | 設定なし | icons/selection/selection-offer.png | pink |

### 内定の補足メッセージ
```text
最短1週間で
ご連絡！
```

### データにはあるが、現在のデザインでは非表示の説明
| 名称 | description |
|---|---|
| 書類選考 | 応募フォームからエントリー |
| カジュアル面談 | 会社や仕事について気軽にお話し |
| 面接 | 現場メンバーとの面接（1〜2回） |
| 条件確認 | 勤務条件や入社日のすり合わせ |
| 内定 | ようこそPREAIへ！ |

## 13. 最終CTA

- 対応データ：finalCta
- showText：false
- PC用画像：cta/final-cta-pc.png
- SP用画像：cta/final-cta-sp.png

### 設定上の見出し
```text
あなたの「やってみたい」を
PREAIで叶えよう。
```

### 設定上の説明文
```text
未経験でも大丈夫。まずは気軽にお話ししましょう。
```

### ボタン設定
- 文言：まずは話を聞いてみる
- URL：https://example.com/entry
- 現在の扱い：button設定は未使用（コメントおよびコードで確認済み）。

### 画像の代替テキスト
```text
はじめての一歩が、未来を変えていく。ここから、新しいキャリアを一緒に。PREAIは、あなたの挑戦を応援します。まずは話を聞いてみる
```

### 表示・リンクの注意
- 現在は画像を表示する構成。
- 見出しは読み上げ用として使用する。
- showTextがfalseのため、titleとleadを通常の表示テキストとして重ねない。
- 画面上のCTA文言は画像内に含まれている。
- 画像内の文字とaltの一致は実画像で確認する。
- 画像のクリック可否（コード確認済み）：FinalCtaSection.vue は `<picture>`・`<img>` のみで、リンク・ボタンはない。画像はクリックできず、応募リンクもない。
- ENTRY_URL は最終CTAでも実際のリンクには使われていない。
- 最終CTAのセクション `id` は `entry`。ページ内のどこからもリンクされていない。
- 応募リンクを付けるかは、今後、案件の要件に合わせて決める。

## 14. Footer

### リンク
| 文言 | URL | 設定 |
|---|---|---|
| 会社概要 | https://www.preai.co.jp/company/ | external: true |
| プライバシーポリシー | https://example.com/privacy | 仮リンク |
| 利用規約 | https://example.com/terms | 仮リンク |

### Copyright
```text
© 株式会社PREAI. All Rights Reserved.
```

### 使用しない設定
以下はコメントアウトされているため、現在の入力には含めない。
- 採用に関するお問い合わせリンク
- SNSリンク（X・Instagram・YouTube）

## 15. 画像・素材の扱い

### 設定パス・実在ファイル・実際の表示画像の違い
画像は `img()`（frontend/src/utils/image.js）で解決される。lpContent.js に書かれたパスは、そのままのファイル名で表示されるとは限らない。

1. 設定パス：lpContent.js に書かれたパス（frontend/src/assets/images/ 基準）。
2. 実在するファイル：frontend/src/assets/images/ に実際にあるファイル。拡張子が設定パスと異なる場合がある。
3. 実際に優先表示される画像：次の順で決まる（コード確認済み）。
   - ① `images-optimized/` に、設定パスの拡張子を除いたパスと同じ相対パスの `.webp` があれば、それを使う。
   - ② なければ `images/` の同名ファイルを、拡張子の優先順 png → webp → jpg → jpeg → avif → gif → svg で選ぶ。
   - ③ どちらもなければ空文字を返す（開発時のみ警告を出す）。
- 設定パスの拡張子は無視され、拡張子を除いたパスで照合される。
- 元画像（png等）を差し替えても、同名の WebP が `images-optimized/` に残っていると、WebP が表示され続ける。

### 画像の存在確認（コード確認済み）
lpContent.js の画像パス 41 件を照合した。欠落はない。

| 区分 | 設定パス → 実在するファイル | 実際に優先表示される画像 |
|---|---|---|
| ロゴ | common/preai-logo.svg → svg あり | 画面では未使用（ロゴはインラインSVG） |
| Hero・最終CTA | hero/hero-pc・hero-sp、cta/final-cta-pc・final-cta-sp（png） | images-optimized の webp |
| メンバー | members/member-01〜03（png） | images-optimized の webp |
| 仕事 | jobs/work-pm-pmo・work-ai-dx-support・work-automation（png） | images-optimized の webp |
| SUPPORT 画像・アイコン | support/support-mentor-illustration、icons/support/ の4件（png） | images-optimized の webp |
| CAREER アイコン | icons/career/ の5件（png） | images-optimized の webp |
| FLOW アイコン | icons/selection/ の5件（png） | images-optimized の webp |
| GROWTH アイコン | icons/growth/ の4件。設定は .png、実体は .svg | 元の svg（optimized なし） |
| INTERVIEW 画像 | interview/interview-conversation-illustration。設定は .png、実体は .jpg | 元の jpg（optimized なし） |
| INTERVIEW アイコン・ポイント | icons/interview/ の7件（svg） | 元の svg（optimized なし） |
| SNSアイコン | icons/sns/ の3件。設定は .png、実体は .svg（コメントアウトのため現在は未使用） | 未使用 |

- `images/career/`・`images/growth/`・`images/selection/` は README.txt のみ（アイコンは icons/ 配下）。
- 装飾画像 common/deco-*.svg（arrow-hand・dots・leaf-pair・leaf・sparkle・squiggle）はファイルとして存在する。コンポーネントから直接指定されているのは、leaf・leaf-pair・dots で確認した。他の使用状況は未確認。

### 画像サイズ（コード確認済み）
- Hero・最終CTA・面接画像は、`<img>` に width/height を直書きしている。
- Hero PC・最終CTA PC の属性値は 2048×768。実画像は Hero PC が 2046×768、最終CTA PC が 2048×768。
- 面接画像の属性値は 1370×1148。実画像（jpg）は 1370×1148。メンバー画像の実寸は 1371×1148。
- 属性値と実寸のずれによる表示への影響は、ブラウザで未確認。

### 画像内テキスト・見た目（未確認）
- FV・メンバー紹介・最終CTAの画像内テキストと、alt・資料の一致：実画像で未確認。
- optimized の WebP と元画像の内容が一致しているか：実画像で未確認。
- 素材の使用条件：本資料では未確認。

## 16. lpContent.js 以外に直接記載された内容（コード確認済み）

### index.html
- title：PREAI 採用サイト｜未経験・若手エンジニア募集
- description：未経験・若手からエンジニアを目指せるPREAIの採用LP。研修・メンター制度・キャリアサポートで成長を支えます。
- robots：`noindex, nofollow`（現在は検索エンジンに登録されない設定）
- Hero preload（`img()` を通さず直書き）：
  - SP（max-width: 767px）：/src/assets/images-optimized/hero/hero-sp.webp
  - PC（min-width: 768px）：/src/assets/images-optimized/hero/hero-pc.webp
- favicon：/favicon.svg
- フォント：Google Fonts（Zen Maru Gothic、Noto Sans JP、Caveat）
- 公開時の robots 設定は、今後、案件の要件に合わせて決める。

### コンポーネント内の文章（読み上げ用を含む）
| 場所 | 文言 | 用途 |
|---|---|---|
| App.vue | 本文へスキップ | スキップリンク（#main） |
| AppHeader.vue | メインメニュー、メニュー | nav の aria-label |
| AppFooter.vue | フッターメニュー、公式SNS、（新しいタブで開く）、「{logoAlt} トップへ戻る」 | aria-label・読み上げ用テキスト |
| SelectionFlowSection.vue | STEP {番号} | 読み上げ用（画面非表示） |
| OpeningSheet.vue | × | キーワード間の記号 |

- 手書き風メモ（GROWTH・CAREER PATH・INTERVIEW）の文言は lpContent.js の値を使っている。GrowthSection.vue・CareerPathsSection.vue のコメントに書かれた例文は、lpContent.js の値と一致しない場合がある。

### リンク（lpContent.js 以外）
- ロゴ（Header・Footer）：#top
- スキップリンク：#main
- 絶対URL：index.html の Google Fonts 以外には、コンポーネントでは確認できなかった。

### 画像・素材の直接指定
- common/deco-*.svg を、Header・ドロワー・Hero・Members等から `img()` で直接指定している。
- index.html の Hero preload（上記）。
- 画像の width/height 属性（「画像サイズ」を参照）。

### その他
- HeroSection.vue のコメントが `rookie-hero-pc.png`・`rookie-hero-sp.png` と書いている。実ファイルは hero-pc.png・hero-sp.png（コメントのみ）。
- Opening の演出時間や紙のめくりの設定は OpeningScreen.vue にあり、lpContent.js では管理されていない。

## 17. 未確定・確認が必要な項目

### 案件の要件に合わせて決める項目（今後決定）
- 正式な募集名
- 正式な応募・問い合わせURL
- Header CTA・最終CTAを応募リンクにするか（現在は表示のみ）
- 正式なプライバシーポリシーURL
- 正式な利用規約URL
- 公開時の robots 設定（現在は noindex, nofollow）
- 04 SUPPORT・07 FLOW をナビに含めるか（現在はナビ5項目のみ）

### コードで確認済み（旧「未確認」から更新）
- 各画像ファイルの存在：lpContent.js の41件すべて解決できる。
- 最終CTA画像の実際のリンク動作：リンクなし。
- Header CTAのリンク動作：リンクなし。
- lpContent.js 以外に直接記載された文章・リンク・素材：「16.」に整理した。
- ロゴの参照方法：インラインSVG。`site.logo` の画像ファイルは未使用。

### ブラウザ・実画像で未確認の項目
- 画像内の文章と代替テキストの一致（FV・メンバー・最終CTA）
- optimized の WebP と元画像の内容の一致
- アンカー移動時の位置（固定ヘッダーとの重なり）
- PC・SP（375px・390px）での表示、文章のはみ出し
- Opening・メニュー・Animationの動作
- 画像のwidth/height 属性値と実寸のずれによる表示への影響

## 18. 今回の使用方針

- 現在のColorful LPをサンプルとして使用する。
- 現在の文章・画像・リンク設定を記録する。
- 仮リンクや未確認事項はその状態を明示する。
- Sectionの表示順・番号・英字ラベルを維持する。
- メンバーセクションを含め、準備のためだけに文章を変更しない。
- この資料の保存だけでは実装・Build・公開を行わない。
