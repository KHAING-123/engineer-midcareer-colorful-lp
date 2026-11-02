# LP Reference

## 使用するLP
未経験向け Colorful LP

## 使用技術
- Vue 3
- CSS
- Vite
- PC・SP対応

## 基本方針
- 現在の完成版を参考にする。
- 準備段階ではコード・文章・画像を変更しない。
- 現在の配色・レイアウト・アニメーションを参考にする。

## ページ構成
- Opening
- Header
- FV
- 01 MEMBERS：どんな人が働いている？
- 02 OUR WORK：PREAIでの仕事
- 03 GROWTH STEP：実践から始める、PREAIならではの成長ステップ
- 04 SUPPORT：AI時代の成長環境
- 05 CAREER PATH：キャリアの広がり
- 06 INTERVIEW：面接について
- 07 FLOW：選考の流れ
- 最終CTA
- Footer

### ページ構成に含まれない要素（コードで確認）
- スキップリンク「本文へスキップ」（App.vue、`#main` へ移動）。
- 背景Animation（AmbientBackground）。セクション背景より上・本文より下に描画される。App.vue の最後に置かれている。
- 上記は番号付きSectionではなく、上の「ページ構成」の順序には含めていない。

## 参考ファイル

### 構成・内容
- frontend/index.html（title・description・robots・Hero画像のpreload・フォント読み込み）
- frontend/src/App.vue（Sectionの並び順、スキップリンク、Opening、背景Animation）
- frontend/src/main.js（CSS・ディレクティブの読み込み）
- frontend/src/data/lpContent.js（文章・リンク・画像パス）
- frontend/src/components/lp/（各Section・Header・Footer）
- frontend/src/components/common/（Opening、背景Animation、ロゴ、画像枠）

### 画像
- frontend/src/utils/image.js（画像パスの解決。WebP優先・拡張子補完）
- frontend/src/assets/images/（元画像）
- frontend/src/assets/images-optimized/（軽量版WebP。存在する画像ではこちらが優先される）

### スタイル・Animation
- frontend/src/assets/styles/（variables / base / lp / ambient / reveal / heading-reveal / premium-icon の各CSS）
- frontend/src/directives/reveal.js（スクロール表示 `v-reveal`）
- frontend/src/composables/useHeadingReveal.js（見出しのスクロール表示）
- frontend/src/utils/opening.js（Opening演出とページ本体の連携）
- frontend/src/components/common/OpeningScreen.vue・OpeningSheet.vue（Opening）
- frontend/src/components/common/AmbientBackground.vue（背景Animation）

## 画像について
- FVはPC用・SP用の画像を使用している。
- メンバー紹介は画像内に文章が含まれている。
- 最終CTAも画像内に文章が含まれている。
- 画像内の文章を変える場合は、画像の修正・差し替えが必要。
- lpContent.js に書かれた画像パスと、実際に表示される画像は一致しない場合がある（拡張子の補完、images-optimized の優先）。詳細は 02-customer-input.md の「15. 画像・素材の扱い」を参照する。
- 画像を差し替えるときは、元画像と images-optimized の同名WebPの両方を確認する（WebPが残っていると、そちらが表示される）。

## 現在の状態と今後決める事項
- 現在の状態：Header CTA と最終CTAは表示のみで、応募リンクはない。robots は noindex, nofollow が設定されている。
- 今後決める事項：応募リンクを付けるか、公開時の robots 設定をどうするかは、案件の要件に合わせて決める。
