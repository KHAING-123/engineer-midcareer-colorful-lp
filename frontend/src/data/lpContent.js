/**
 * ============================================================
 *  LPの文章・リンク・画像をまとめて管理するファイル
 * ============================================================
 *
 *  ■ 編集のルール
 *   - 文章は '...'（シングルクォート）の中だけを書き換えてください。
 *   - 行末の , （カンマ）は消さないでください。
 *   - 改行したい箇所は \n と書くと改行されます。
 *   - 画像は src/assets/images/ からのパスで指定します。
 *     例）'members/member-01.png' → src/assets/images/members/member-01.png
 *   - メンバーやカードを増やしたいときは { ... }, のかたまりを
 *     まるごとコピーして並べてください。
 *
 *  ■ 色の指定（accent）で使える値
 *   'yellow' / 'pink' / 'green' / 'blue'
 * ============================================================
 */

/* 応募・問い合わせのリンク先（ここを変えるとページ内のCTAがすべて変わります） */
const ENTRY_URL = 'https://example.com/entry'

export const lpContent = {
  /* ---------- ページ共通 ---------- */
  site: {
    companyName: 'PREAI',
    logo: 'common/preai-logo.svg',
    logoAlt: 'PREAI',
  },

  /* ---------- ヘッダー ---------- */
  header: {
    /*
     * label: 日本語 / labelEn: 上に小さく表示する英字 / href: 移動先
     * accent: 下の短いラインの色（'coral' / 'mint' / 'yellow' / 'pink' / 'blue'）
     */
    nav: [
      { label: '働く人', labelEn: 'PEOPLE', href: '#members', accent: 'coral' },
      { label: '仕事を知る', labelEn: 'WORK', href: '#jobs', accent: 'mint' },
      { label: '成長のサポート', labelEn: 'GROWTH', href: '#growth', accent: 'yellow' },
      { label: 'キャリア', labelEn: 'CAREER', href: '#careers', accent: 'pink' },
      { label: '選考・面接', labelEn: 'INTERVIEW', href: '#interview', accent: 'blue' },
    ],
    /* 「まずは話を聞いてみる」は表示用テキストです（リンクではありません） */
    cta: {
      label: 'まずは話を聞いてみる',
      labelEn: 'CASUAL TALK',
      href: ENTRY_URL, // ※ 現在は使用していません
    },
    menuText: 'MENU', // スマホのメニューボタンに表示する文字
    menuCloseText: 'CLOSE', // メニューを開いているときの文字
    menuOpenLabel: 'メニューを開く',
    menuCloseLabel: 'メニューを閉じる',
  },

  /* ---------- ヒーロー（メインビジュアル） ----------
   *  画像を差し替えるだけで変更できます。
   *  title はページの見出し(h1)として検索エンジン・読み上げソフト向けに使われます
   *  （画面上には表示されません。画像内の文字と同じ内容にしてください）。
   */
  hero: {
    title: '未経験から、エンジニアへ。PREAIで一緒に成長しよう。',
    imagePc: 'hero/hero-pc.png',
    imageSp: 'hero/hero-sp.png',
    alt: '未経験から、エンジニアへ。PREAIで一緒に成長しよう。笑顔で働く若手エンジニアのイラスト',
  },

  /* ---------- 01 どんな人が働いている？ ---------- */
  membersSection: {
    number: '01',
    label: 'MEMBERS',
    title: 'どんな人が\n働いている？',
    lead: 'PREAIには、さまざまな経験や強みを持ったメンバーが働いています。\nこれまで培ってきた経験を活かしながら、IT・AIという新しいスキルを身につけ、\nそれぞれのキャリアに挑戦しています。\n\n共通しているのは、\n新しいことを学び、自分の可能性を広げようとする姿勢です。',
    note: '入社メンバーの約7割が\nIT未経験からのスタート！', // ※ 現在のデザインでは表示していません
    handwritten: 'いろんな\nバックグラウンドの\n仲間がいます！', // 左側の手書き風メッセージ
    sideNote: '一歩ずつ、\nできることが\n増えていく。', // 右側のピンクの丸の中のメッセージ
    nameSuffix: 'さん', // 名前のあとにつける文字（例：Y.Sさん）
    ageUnit: '歳',
    previousPrefix: '元', // 前職の前につける文字（例：元アパレル販売）
  },
  /* メンバー：accent は人物の後ろの丸の色（'blue' / 'yellow' / 'green' / 'pink'） */
  members: [
    {
      name: 'Y.S',
      age: 24,
      image: 'members/member-01.png',
      imageAlt: '笑顔の若手メンバー Y.Sさんのイラスト',
      previousJob: 'アパレル販売',
      currentRole: 'Webエンジニア',
      comment: '最初は専門用語もわからなかったけど、先輩が一つずつ丁寧に教えてくれました！',
      accent: 'blue',
    },
    {
      name: 'K.T',
      age: 26,
      image: 'members/member-02.png',
      imageAlt: 'メガネをかけたメンバー K.Tさんのイラスト',
      previousJob: '飲食店スタッフ',
      currentRole: 'モバイルアプリエンジニア',
      comment: '自分が作ったアプリが動いた瞬間の感動は今でも忘れられません。',
      accent: 'pink',
    },
    {
      name: 'M.N',
      age: 23,
      image: 'members/member-03.png',
      imageAlt: 'ショートヘアのメンバー M.Nさんのイラスト',
      previousJob: '一般事務',
      currentRole: 'データアナリスト',
      comment: 'Excel作業が好きだった経験が、今のデータ分析の仕事に活きています。',
      accent: 'green',
    },
  ],

  /* ---------- 02 PREAIでの仕事 ---------- */
  jobsSection: {
    number: '02',
    label: 'OUR WORK',
    title: 'PREAIでの仕事',
    lead: 'お客様の課題を整理し、AIやITを活用して解決へ導く仕事です。\nまずはPMOやAI導入支援から経験し、\n将来的には要件定義やプロジェクトマネジメントにも挑戦できます。',
  },
  /*
   * 仕事カード（左から順に表示）
   *  image:  イラスト画像 / tags: スキルタグ（増減OK）
   *  accent: イラストの後ろの丸い背景の色（'yellow' / 'green' / 'pink' / 'blue'）
   */
  jobs: [
    {
      title: 'PM・PMO',
      image: 'jobs/web-development.png',
      imageAlt: 'パソコン画面でWebアプリを開発しているイラスト',
      description: '大手企業のDX・ITプロジェクトに参画し、\n会議運営、進捗・課題管理、関係者との調整などを担当します。\n経験を積みながら、要件整理や顧客折衝、プロジェクト全体を動かすPM業務へと\nステップアップしていきます。',
      tags: ['Excel', 'PowerPoint', 'Teams', 'Slack','生成AI'],
      accent: 'yellow',
    },
    {
      title: 'AI・DXツール導入支援',
      image: 'jobs/mobile-development.png',
      imageAlt: 'スマートフォンアプリの画面を設計しているイラスト',
      description: '大手企業を中心に、生成AIや\n業務効率化ツールの導入・活用を支援します。\nお客様の業務や課題を整理し、ツールの選定・\n導入から、活用方法の検討、現場への\n定着までサポートします。',
      tags: ['Microsoft Copilot', 'Power Platform（Power Apps等）', 'ChatGPT', 'Claude','Gemini','NotebookLM'],
      accent: 'green',
    },
    {
      title: '業務自動化',
      image: 'jobs/ai-data-development.png',
      imageAlt: 'グラフやAIのデータを分析しているイラスト',
      description: 'n8nやAIを活用し、これまで人が手作業で\n行っていた業務を自動化します。\n業務フローを整理し、AIや各種サービスを\n組み合わせながら、実際に動く仕組みを\nつくります。',
      tags: ['n8n', 'Claude Code', 'Codex', 'API連携'],
      accent: 'pink',
    },
  ],

  /* ---------- 03 未経験でも安心の成長ステップ ---------- */
  growthSection: {
    number: '03',
    label: 'GROWTH STEP',
    title: '実践から始める、\nPREAIならではの\n成長ステップ',
    lead: '知識を学ぶだけではなく、\nAI・自動化ツールを実際に作るところからスタート。\n実務経験とキャリア支援を通じて、自分の強みを伸ばしていきます。',
    /* 左側の手書き風メモ（1行目 / 2行目は「強調する言葉」＋「続き」。強調する言葉はコーラル色） */
    note: {
      line1: '未経験から、',
      highlight: 'できる',
      line2: 'を増やそう。',
    },
  },
  growthSteps: [
    {
      step: 'STEP 01',
      period: '入社〜1ヶ月',
      title: '実践型AI・IT研修',
      description: 'IT・AIの基礎を学びながら、n8nを使った業務自動化に挑戦。\n実際に自分で自動化ツールを作り、AIを「知っている」だけではなく\n「仕事で使える」状態を目指します。',
      icon: 'icons/growth/growth-basic-learning.png',
      accent: 'yellow',
    },
    {
      step: 'STEP 02',
      period: '2ヶ月目〜',
      title: 'OJT・プロジェクト参加',
      description: '先輩と一緒に実際のプロジェクトへ参画。\nPMOやAI・DXツールの導入支援など、実務を経験しながら仕事の進め方や\n顧客とのコミュニケーションを身につけます。',
      icon: 'icons/growth/growth-practice.png',
      accent: 'pink',
    },
    {
      step: 'STEP 03',
      // period: '4ヶ月〜',
      title: '定期的なキャリア1on1',
      description: '専属キャリアコンサルとの1on1を実施。\n現在の経験や強み、目指したいキャリアを整理し、\n次に身につけるスキルや挑戦する仕事を一緒に考えます。',
      icon: 'icons/growth/growth-project.png',
      accent: 'blue',
    },
    {
      step: 'STEP 04',
      // period: '1年目以降',
      title: '継続的なスキルアップ',
      description: 'AI・ITの学習を継続しながら、要件定義やプロジェクトマネジメント、\nAI活用・業務自動化など、目指すキャリアに必要な専門性を伸ばしていきます。',
      icon: 'icons/growth/growth-skill-up.png',
      accent: 'green',
    },
  ],

  /* ---------- 04 キャリアサポート ---------- */
  supportSection: {
    number: '04',
    label: 'SUPPORT',
    title: 'AI時代の成長環境',
    lead: 'PREAIでは、AIを研修だけで終わらせません。\n日々の業務から実際のプロジェクトまで、AIを使い、つくり、活かす環境を整えています。',
    image: 'support/support-mentor-illustration.png',
    imageAlt: '先輩メンターが後輩にパソコン画面を見せながら教えているイラスト',
  },
  supportItems: [
    {
      title: 'AIツール費用を会社負担',
      description: '必要なAIツールを、会社負担で利用できます。ChatGPTやClaude、Codexなど、\n業務や本人のスキルに合わせて必要なAIツール・プランを会社が負担。新しいツールも積極的に取り入れています。',
      icon: 'icons/support/support-mentor.png',
      accent: 'pink',
    },
    {
      title: 'AIを日常業務で活用',
      description: 'AIは、特別なものではなく日々の仕事の一部です。情報収集や資料作成、アイデア整理、議事録、分析など、さまざまな業務でAIを活用。実務を通じて、AIを使いこなす力を身につけます。',
      icon: 'icons/support/support-learning.png',
      accent: 'blue',
    },
    {
      title: 'AIで実際につくる',
      description: '使うだけでなく、AIを活用して仕組みをつくります。n8nやClaude Code、Codexなどを活用し、業務自動化やツール開発に挑戦。自分で考え、実際に動くものをつくる経験を積めます。',
      icon: 'icons/support/support-consultation.png',
      accent: 'yellow',
    },
    {
      title: 'AI・DX案件を経験',
      description: '学んだスキルを、実際のプロジェクトで活かします。大手企業を中心としたAI・DXプロジェクトに参画。Microsoft CopilotやPower Platformなどの導入・活用支援を通じて、AIをビジネスの現場で活かす経験を積みます。',
      icon: 'icons/support/support-certification.png',
      accent: 'green',
    },
  ],

  /* ---------- 05 キャリアの広がり ---------- */
  careersSection: {
    number: '05',
    label: 'CAREER PATH',
    title: 'キャリアの広がり',
    lead: '経験を積んだ先には、さまざまなキャリアの選択肢があります。',
    /*
     * カードの上の手書き風メモ（2行）
     *  1行目：highlight（コーラル色＋黄色の下線）＋ line1
     *  2行目：line2
     */
    note: {
      highlight: '未来',
      line1: 'の選択肢、',
      line2: 'ここから広がる。',
    },
  },
  careers: [
    {
      title: 'PM・プロジェクトマネージャー',
      description: '顧客やチームと連携\nしながら、プロジェクト\n全体を推進する。',
      icon: 'icons/career/career-developer.png',
      accent: 'yellow',
    },
    {
      title: 'ITコンサルタント',
      description: 'お客様の課題を整理し、\nITを活用した解決策を \n企画・提案する。',
      icon: 'icons/career/career-data-engineer.png',
      accent: 'blue',
    },
    {
      title: 'AI・DXプロジェクトリーダー',
      description: 'AI・DX導入プロジェクトの\n中心となり、顧客・エンジニアを巻き込みながら導入を推進する。',
      icon: 'icons/career/career-ai-engineer.png',
      accent: 'green',
    },
    {
      title: 'AI・自動化エンジニア',
      description: 'n8nやClaude Codeなどを活用し、\nAIを組み込んだ業務自動化や仕組みをつくる。',
      icon: 'icons/career/career-project-leader.png',
      accent: 'pink',
    },
    {
      title: 'AIコンサルタント',
      description: '業務課題を分析し、\n生成AIやAIツールを活用した業務改善を提案する。',
      icon: 'icons/career/career-project-manager.png',
      accent: 'yellow',
    },
  ],

  /* ---------- 06 面接について ---------- */
  interview: {
    number: '06',
    label: 'INTERVIEW',
    title: '面接について',
    lead: '面接では、これまでの経験や強み、これから挑戦したいことをお聞きします。\nPREAIで経験できる仕事やキャリアについても詳しくお話しします。\nまずはお互いを知るところから始めましょう。',
    image: 'interview/interview-conversation-illustration.png',
    imageAlt: '面接官と応募者が笑顔で会話しているイラスト',
    note: 'リラックスして\nお話ください。', // イラストの右下に添える手書き風メモ（\n で改行）
    listTitle: '面接でお話しすること',
    /*
     * 「面接でお話しすること」（2×2で表示：左上 → 右上 → 左下 → 右下 の順）
     *  title: 項目名（\n は「幅が足りないときだけ改行する位置」） / description: 説明文（\n で改行） / icon: アイコン画像 / accent: アイコンの後ろの丸の色（'green' / 'pink' / 'blue' / 'yellow'）
     */
    topics: [
      {
        title: 'あなたらしさについて',
        description: '社会人経験者向けに\n『これまでの経験・強み』\nについて話す内容へ。',
        icon: 'icons/interview/interview-learning.svg',
        accent: 'green',
      },
      {
        title: 'チームでの働き方\nについて',
        description: '『これまでどんな仕事・\n役割を経験してきたか』など、\n社会人経験を確認する内容へ。',
        icon: 'icons/interview/interview-career.svg',
        accent: 'pink',
      },
      {
        title: '仕事への向き合い方\nについて',
        description: '『今後どんなキャリアを\n築きたいか／IT・AI領域で\n何をやってみたいか』を話す\n内容へ。',
        icon: 'icons/interview/interview-idea.svg',
        accent: 'blue',
      },
      {
        title: '気になること・\n聞いてみたいこと',
        description: '仕事内容・働き方・案件・\nキャリアなど、応募者側から\n自由に質問できる内容は残す。',
        icon: 'icons/interview/interview-talk.svg',
        accent: 'yellow',
      },
    ],
    /*
     * 下の3つのポイント
     *  title / description / icon / accent: カードの色（'yellow' / 'blue' / 'green'）
     */
    points: [
      { title: '服装自由', description: 'いつものスタイルでOKです', icon: 'icons/interview/point-clothes.svg', accent: 'yellow' },
      { title: 'オンライン面接OK', description: 'ご自宅からでも参加できます', icon: 'icons/interview/point-online.svg', accent: 'blue' },
      { title: '逆質問大歓迎', description: '気になることもお気軽にどうぞ', icon: 'icons/interview/point-question.svg', accent: 'green' },
    ],
  },

  /* ---------- 07 選考の流れ ---------- */
  selectionSection: {
    number: '07',
    label: 'FLOW',
    title: '選考の流れ',
    lead: 'シンプルでスピーディー、できるだけ早く結果をご連絡します。',
    note: '※ 選考状況により前後する場合があります。',
  },
  /*
   * 選考の流れ（左から順に表示）
   *  duration: 丸の下に（ ）付きで表示する日数
   *  note:     黄色いメモとして表示する文章（最後の「内定」など。不要なら消してOK）
   *  circle:   丸・STEP名の色（'blue' / 'yellow' / 'sky' / 'lavender' / 'pink' / 'green'）
   *  description は現在のデザインでは表示していません
   */
  selectionFlow: [
    {
      title: '書類選考',
      duration: '1日',
      description: '応募フォームからエントリー',
      icon: 'icons/selection/selection-document.png',
      circle: 'blue',
    },
    {
      title: 'カジュアル面談',
      duration: 'オンライン/1日',
      description: '会社や仕事について気軽にお話し',
      icon: 'icons/selection/selection-casual-talk.png',
      circle: 'yellow',
    },
    {
      title: '面接',
      duration: '1日',
      description: '現場メンバーとの面接（1〜2回）',
      icon: 'icons/selection/selection-interview.png',
      circle: 'sky',
    },
    {
      title: '条件確認',
      duration: '1日',
      description: '勤務条件や入社日のすり合わせ',
      icon: 'icons/selection/selection-conditions.png',
      circle: 'lavender',
    },
    {
      title: '内定',
      note: '最短1週間で\nご連絡！',
      description: 'ようこそPREAIへ！',
      icon: 'icons/selection/selection-offer.png',
      circle: 'pink',
    },
  ],

  /* ---------- 最後のCTA ----------
   *  画像だけを表示します（「まずは話を聞いてみる」も画像の中に含まれています）。
   *  alt には画像の中の文字を書いてください（読み上げソフト用）。
   *  ※ button は現在使用していません。
   *  showText: true にすると title / lead を画像の上に文字で表示します。
   *  画像の中にすでに文字が入っている場合は false にしてください
   *  （その場合も title は読み上げ用の見出しとして使われます）。
   */
  finalCta: {
    title: 'あなたの「やってみたい」を\nPREAIで叶えよう。',
    lead: '未経験でも大丈夫。まずは気軽にお話ししましょう。',
    showText: false,
    button: {
      label: 'まずは話を聞いてみる',
      href: ENTRY_URL,
    },
    imagePc: 'cta/final-cta-pc.png',
    imageSp: 'cta/final-cta-sp.png',
    alt: 'はじめての一歩が、未来を変えていく。ここから、新しいキャリアを一緒に。PREAIは、あなたの挑戦を応援します。まずは話を聞いてみる',
  },

  /* ---------- フッター ---------- */
  footer: {
    // external: true → 新しいタブで開き、右側に外部リンクアイコンを表示
    links: [
      { label: '会社概要', href: 'https://www.preai.co.jp/company/', external: true },
      { label: 'プライバシーポリシー', href: 'https://example.com/privacy' },
      { label: '利用規約', href: 'https://example.com/terms' },
      // { label: '採用に関するお問い合わせ', href: 'https://example.com/contact' },
    ],
    // sns: [
    //   { label: 'X（旧Twitter）', href: 'https://x.com/', icon: 'icons/sns/sns-x.png' },
    //   { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'icons/sns/sns-instagram.png' },
    //   { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'icons/sns/sns-youtube.png' },
    // ],
    copyright: '© 株式会社PREAI. All Rights Reserved.',
  },
}
