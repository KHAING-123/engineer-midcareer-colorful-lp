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
    imagePc: 'hero/rookie-hero-pc.png',
    imageSp: 'hero/rookie-hero-sp.png',
    alt: '未経験から、エンジニアへ。PREAIで一緒に成長しよう。笑顔で働く若手エンジニアのイラスト',
  },

  /* ---------- 01 どんな人が働いている？ ---------- */
  membersSection: {
    number: '01',
    label: 'MEMBERS',
    title: 'どんな人が\n働いている？',
    lead: 'PREAIには、接客・販売・事務など\nさまざまな業界からエンジニアに挑戦した\n仲間がたくさんいます。\n\nスタートラインはみんな同じ。\n「やってみたい」気持ちを大切にしています。',
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
    lead: 'お客様の「こうしたい」をITのチカラでカタチにする仕事です。\nまずは得意分野を見つけるところから始めましょう。',
  },
  /*
   * 仕事カード（左から順に表示）
   *  image:  イラスト画像 / tags: スキルタグ（増減OK）
   *  accent: イラストの後ろの丸い背景の色（'yellow' / 'green' / 'pink' / 'blue'）
   */
  jobs: [
    {
      title: 'Webアプリ開発',
      image: 'jobs/web-development.png',
      imageAlt: 'パソコン画面でWebアプリを開発しているイラスト',
      description: '業務システムやWebサービスの画面・\n機能をつくります。チームで設計から\nリリースまで取り組みます。',
      tags: ['HTML / CSS', 'JavaScript', 'Vue.js', 'PHP'],
      accent: 'yellow',
    },
    {
      title: 'モバイルアプリ開発',
      image: 'jobs/mobile-development.png',
      imageAlt: 'スマートフォンアプリの画面を設計しているイラスト',
      description: 'iOS・Androidアプリを開発します。\nユーザーが毎日使う身近なサービスに\n関われます。',
      tags: ['Flutter', 'Swift', 'Kotlin', 'Firebase'],
      accent: 'green',
    },
    {
      title: 'データ分析・AI開発',
      image: 'jobs/ai-data-development.png',
      imageAlt: 'グラフやAIのデータを分析しているイラスト',
      description: 'データを集めて分析し、AIモデルを\n活用した仕組みづくりに挑戦します。',
      tags: ['Python', 'SQL', '機械学習', '生成AI'],
      accent: 'pink',
    },
  ],

  /* ---------- 03 未経験でも安心の成長ステップ ---------- */
  growthSection: {
    number: '03',
    label: 'GROWTH STEP',
    title: '未経験でも安心の\n成長ステップ',
    lead: '基礎から実践まで、段階的にスキルを\n身につけられる環境があります。',
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
      title: '基礎学習',
      description: 'ITの基礎知識、プログラミングの基本を研修で学びます。\nPCの使い方からでも大丈夫です。',
      icon: 'icons/growth/growth-basic-learning.png',
      accent: 'yellow',
    },
    {
      step: 'STEP 02',
      period: '2〜3ヶ月',
      title: '実践課題',
      description: '簡単なアプリを実際に作りながら、\nチーム開発の流れやGitの使い方を身につけます。',
      icon: 'icons/growth/growth-practice.png',
      accent: 'pink',
    },
    {
      step: 'STEP 03',
      period: '4ヶ月〜',
      title: 'OJT・\nプロジェクト参加',
      description: '先輩と一緒に実際のプロジェクトへ参加。\nわからないことはすぐに相談できる環境です。',
      icon: 'icons/growth/growth-project.png',
      accent: 'blue',
    },
    {
      step: 'STEP 04',
      period: '1年目以降',
      title: '継続的なスキルアップ',
      description: '新しい技術の勉強会や資格取得を通じて、\n得意分野をどんどん伸ばしていきます。',
      icon: 'icons/growth/growth-skill-up.png',
      accent: 'green',
    },
  ],

  /* ---------- 04 キャリアサポート ---------- */
  supportSection: {
    number: '04',
    label: 'SUPPORT',
    title: 'キャリアサポート',
    lead: 'ひとりで悩まない。成長を支える仕組みがあります。',
    image: 'support/support-mentor-illustration.png',
    imageAlt: '先輩メンターが後輩にパソコン画面を見せながら教えているイラスト',
  },
  supportItems: [
    {
      title: 'メンター制度',
      description: '年の近い先輩がメンターとしてつき、仕事の進め方から日々の悩みまで相談にのります。',
      icon: 'icons/support/support-mentor.png',
      accent: 'pink',
    },
    {
      title: '研修・学習環境',
      description: 'オンライン教材や書籍購入を会社がサポート。業務時間内の学習時間も確保しています。',
      icon: 'icons/support/support-learning.png',
      accent: 'blue',
    },
    {
      title: 'キャリア相談',
      description: '定期的な1on1面談で、目指したい方向や次のステップを一緒に考えます。',
      icon: 'icons/support/support-consultation.png',
      accent: 'yellow',
    },
    {
      title: '資格取得支援',
      description: '基本情報技術者などの受験費用を会社が負担。合格時にはお祝い金もあります。',
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
      title: '開発エンジニア',
      description: 'Web・モバイルの設計から\n実装まで幅広く担当',
      icon: 'icons/career/career-developer.png',
      accent: 'yellow',
    },
    {
      title: 'データエンジニア',
      description: 'データ基盤を整え、\n活用できる形に整理',
      icon: 'icons/career/career-data-engineer.png',
      accent: 'blue',
    },
    {
      title: 'AIエンジニア',
      description: '機械学習・生成AIを使った\n仕組みを開発',
      icon: 'icons/career/career-ai-engineer.png',
      accent: 'green',
    },
    {
      title: 'プロジェクトリーダー',
      description: 'チームをまとめ、\n開発をリード',
      icon: 'icons/career/career-project-leader.png',
      accent: 'pink',
    },
    {
      title: 'PM・上流工程',
      description: 'お客様と要件を決め、\nプロジェクトを成功へ導く',
      icon: 'icons/career/career-project-manager.png',
      accent: 'yellow',
    },
  ],

  /* ---------- 06 面接について ---------- */
  interview: {
    number: '06',
    label: 'INTERVIEW',
    title: '面接について',
    lead: '面接は「見極める場」ではなく「お互いを知る場」です。\n緊張せず、ありのままのあなたを教えてください。',
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
        description: '得意なことや大切にしている\nことを教えてください。',
        icon: 'icons/interview/interview-learning.svg',
        accent: 'green',
      },
      {
        title: 'チームでの働き方\nについて',
        description: '周りの人とどのように\n関わって仕事をしたいかを\nお聞きします。',
        icon: 'icons/interview/interview-career.svg',
        accent: 'pink',
      },
      {
        title: '仕事への向き合い方\nについて',
        description: '仕事をするうえで\n大切にしたいことを\n教えてください。',
        icon: 'icons/interview/interview-idea.svg',
        accent: 'blue',
      },
      {
        title: '気になること・\n聞いてみたいこと',
        description: '仕事内容や働き方など、\n何でも質問してください。',
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
      duration: '1〜2日',
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
      duration: '1〜2日',
      description: '現場メンバーとの面接（1〜2回）',
      icon: 'icons/selection/selection-interview.png',
      circle: 'sky',
    },
    {
      title: '条件確認',
      duration: '1〜2日',
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
    links: [
      { label: '利用規約', href: 'https://example.com/terms' },
      { label: 'プライバシーポリシー', href: 'https://example.com/privacy' },
      { label: '採用に関するお問い合わせ', href: 'https://example.com/contact' },
    ],
    sns: [
      { label: 'X（旧Twitter）', href: 'https://x.com/', icon: 'icons/sns/sns-x.png' },
      { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'icons/sns/sns-instagram.png' },
      { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'icons/sns/sns-youtube.png' },
    ],
    copyright: '© PREAI Inc. All Rights Reserved.',
  },
}
