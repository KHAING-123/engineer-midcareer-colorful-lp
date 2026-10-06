<script setup>
import { ref } from 'vue'
import { useHeadingReveal } from '../../composables/useHeadingReveal.js'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import SectionHeading from './SectionHeading.vue'

const { interview } = lpContent

// タイトル（06 / INTERVIEW / 見出し）の Scroll Animation：右から1回だけ → その後に既存コンテンツ（01〜03 と共通処理）
const heading = ref(null)
const { stateClass } = useHeadingReveal(heading)

// メモは lpContent.js の文章を \n で2行に分けて表示（最後の行に黄色の下線）
const noteLines = (interview.note || '').split('\n')
// 左下の黄色いドット（装飾）：5列×3行
const DOTS = 15
</script>

<template>
  <section id="interview" class="interview lp-section lp-section--cream heading-reveal-scope" :class="stateClass" aria-labelledby="interview-title">
    <!-- 背景の淡い丸とドット（装飾） -->
    <span class="iv-bg iv-bg--blue" aria-hidden="true"></span>
    <span class="iv-bg iv-bg--pink" aria-hidden="true"></span>
    <span class="iv-bg iv-bg--yellow" aria-hidden="true"></span>
    <span class="iv-bg-dots iv-bg-dots--l" aria-hidden="true"></span>
    <span class="iv-bg-dots iv-bg-dots--r" aria-hidden="true"></span>

    <!-- PC：左＝イラスト / 右＝見出し・説明・「面接でお話しすること」 / 下＝3つのポイント -->
    <div class="lp-container interview__grid">
      <!--
        人物ビジュアル：各パーツは別要素（画像を差し替えても装飾に影響しない）
        外側 figure：スクロール表示（1回） / 中：浮遊（ずっと） / 内：画像
      -->
      <figure v-reveal="{ variant: 'fade' }" class="interview__visual heading-reveal-content">
        <!-- 人物の後ろの大きな淡いピンクの丸（ゆっくり呼吸） -->
        <span class="interview__circle" aria-hidden="true"></span>
        <!-- 左下の黄色いドット -->
        <span class="interview__dotgrid" aria-hidden="true">
          <span v-for="n in DOTS" :key="n" class="interview__dot" :style="{ '--dur': `${4 + (n % 4) * 0.8}s`, '--delay': `${n * -0.37}s` }"></span>
        </span>

        <!--
          面接画像：やわらかい有機的なフレーム（画像そのものは加工しない）
            .interview__illust-float … 3:2 の枠（メモの位置の基準。大きさは従来のまま）＋ ゆっくり浮遊
            .interview__photo        … 枠の中央に少し大きめに配置（後ろにパステルの形・光・細い線、外に葉っぱ）
            .interview__photo-mask   … 有機的な形で切り抜き ＋ 柔らかい影
        -->
        <div class="interview__illust-float">
          <div class="interview__photo">
            <span class="iv-photo-layer iv-photo-layer--mint" aria-hidden="true"></span>
            <span class="iv-photo-layer iv-photo-layer--pink" aria-hidden="true"></span>
            <span class="iv-photo-layer iv-photo-layer--sky" aria-hidden="true"></span>
            <span class="iv-photo-glow" aria-hidden="true"></span>
            <span class="iv-photo-line" aria-hidden="true"></span>
            <span class="iv-photo-ring" aria-hidden="true"></span>
            <div class="interview__photo-mask">
              <img class="interview__photo-img" :src="img(interview.image)" :alt="interview.imageAlt" width="1370" height="1148" loading="lazy" decoding="async" />
              <span class="interview__photo-sheen" aria-hidden="true"></span>
            </div>
            <img class="iv-photo-leaf iv-photo-leaf--1" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <img class="iv-photo-leaf iv-photo-leaf--2" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <img class="iv-photo-leaf iv-photo-leaf--3" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
          </div>
        </div>

        <!--
          手書き風メモ「リラックスして お話ください。」（すべて HTML / CSS / SVG。人物画像とは別レイヤー）
          外側：位置＋スクロール表示 / 傾き / 浮遊 を別要素に分けて transform の競合を防ぐ
        -->
        <div v-if="interview.note" v-reveal="{ delay: 250 }" class="interview__note-wrap heading-reveal-content heading-reveal-content--note">
          <div class="interview__note-rotate">
            <div class="interview__note-float">
              <!-- 背景：淡いピンク・黄・水色のブラシ風の形 -->
              <span class="interview__note-blob" aria-hidden="true"></span>

              <!-- 左：コーラルの短い線 / 右：黄色の短い線 -->
              <span class="interview__rays interview__rays--l" aria-hidden="true">
                <span class="interview__ray interview__ray--1"></span>
                <span class="interview__ray interview__ray--2"></span>
                <span class="interview__ray interview__ray--3"></span>
              </span>
              <span class="interview__rays interview__rays--r" aria-hidden="true">
                <span class="interview__ray interview__ray--1"></span>
                <span class="interview__ray interview__ray--2"></span>
              </span>

              <p class="interview__note">
                <span
                  v-for="(line, i) in noteLines"
                  :key="i"
                  class="interview__note-line"
                  :class="{ 'is-last': i === noteLines.length - 1 }"
                ><span class="interview__note-text">{{ line }}</span></span>
              </p>

              <!-- 文字の下のコーラルの点線カーブ（左→右へ描いてはフェード） -->
              <svg class="interview__dotted" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M4 10 C 40 22, 90 22, 130 16 C 160 12, 184 8, 196 3" />
              </svg>

              <!-- 葉っぱ（既存の素材）と小さなドット -->
              <span class="interview__note-deco" aria-hidden="true">
                <img class="iv-leaf iv-leaf--1" :src="img('common/deco-leaf.svg')" alt="" />
                <img class="iv-leaf iv-leaf--2" :src="img('common/deco-leaf.svg')" alt="" />
                <img class="iv-leaf iv-leaf--3" :src="img('common/deco-leaf.svg')" alt="" />
                <span class="iv-ndot iv-ndot--1"></span>
                <span class="iv-ndot iv-ndot--2"></span>
                <span class="iv-ndot iv-ndot--3"></span>
                <span class="iv-ndot iv-ndot--4"></span>
              </span>
            </div>
          </div>
        </div>
      </figure>

      <div class="interview__head">
        <SectionHeading
          ref="heading"
          id="interview-title"
          :number="interview.number"
          :label="interview.label"
          :title="interview.title"
          :lead="interview.lead"
          slide-in
          slide-from="right"
        />
      </div>

      <!-- 面接でお話しすること：1枚のカードを4エリアに分ける -->
      <!-- 外側：位置（右側のまとまりを上へ） / 内側（panel）：白いカードの見た目とゆっくりした浮遊 -->
      <div class="interview__topics-card">
        <div class="interview__topics-panel">
        <div class="interview__topics-head">
          <span class="iv-title-rays iv-title-rays--l" aria-hidden="true"><span></span><span></span><span></span></span>
          <h3 class="interview__topics-title">{{ interview.listTitle }}</h3>
          <span class="iv-title-rays iv-title-rays--r" aria-hidden="true"><span></span><span></span><span></span></span>
        </div>
        <ul class="interview__topics">
          <!-- 外側（li）：スクロール表示（1回だけ・順番に） / 内側：カードの見た目と hover / アイコン：ゆっくり浮遊 -->
          <li
            v-for="(topic, index) in interview.topics"
            :key="topic.title"
            v-reveal="{ variant: 'fade' }"
            class="interview__topic heading-reveal-content"
            :class="`accent-${topic.accent || 'green'}`"
            :style="{ '--t-i': index }"
          >
            <div class="interview__topic-card">
              <!-- カード端の淡い装飾（角の Blob・丸・波・ドット。文字より後ろ） -->
              <span class="iv-topic-deco" aria-hidden="true">
                <span class="iv-topic-deco__blob"></span>
                <span class="iv-topic-deco__wave"></span>
                <span class="iv-topic-deco__circle"></span>
                <span class="iv-topic-deco__dot"></span>
              </span>
              <span class="interview__topic-icon premium-icon-host">
                <span class="premium-icon-glow" aria-hidden="true"></span>
                <img class="premium-icon-float" :src="img(topic.icon)" alt="" width="64" height="64" loading="lazy" :style="{ '--pi-delay': `${index * 0.4}s` }" />
              </span>
              <span class="interview__topic-text">
                <!-- 項目名の \n は「幅が足りないときだけ改行する位置」 -->
                <span class="interview__topic-title"><span class="interview__topic-mark"><template v-for="(part, i) in topic.title.split('\n')" :key="i"><wbr v-if="i > 0" />{{ part }}</template></span></span>
                <!-- タイトル下の細いライン（左 → 右へ伸びる・繰り返し）＋ 右端の小さなドット -->
                <span class="interview__topic-line" aria-hidden="true"><span class="interview__topic-bar"></span><span class="interview__topic-dots"></span></span>
                <span v-if="topic.description" class="interview__topic-desc pre-line">{{ topic.description }}</span>
              </span>
            </div>
          </li>
        </ul>
        </div>
      </div>

      <!-- 3つのポイント：外側＝スクロール表示 / 中＝浮遊 / 内＝カード（hover） -->
      <ul v-if="interview.points?.length" class="interview__points">
        <li
          v-for="(point, index) in interview.points"
          :key="point.title"
          v-reveal="{ delay: 100, i: index }"
          class="interview__point-item heading-reveal-content heading-reveal-content--card"
        >
          <div class="interview__point-float" :style="{ '--dur': ['6.5s', '7.2s', '6.8s'][index % 3], '--delay': `${index * -1.3}s` }">
            <div class="interview__point" :class="`point--${point.accent || 'yellow'}`">
              <span class="iv-point-rays" aria-hidden="true"><span></span><span></span><span></span></span>
              <!-- 外側：位置（レイアウトは不変） / 光：ゆっくり呼吸 / 内側の丸：ゆっくり浮遊（カードの浮遊・hover とは別要素） -->
              <span class="interview__point-icon" :style="{ '--pi-delay': `${index * 0.6}s` }">
                <span class="iv-point-icon-glow" aria-hidden="true"></span>
                <span class="iv-point-icon-float"><img :src="img(point.icon)" alt="" width="64" height="64" loading="lazy" /></span>
              </span>
              <span class="interview__point-body">
                <strong class="interview__point-title">{{ point.title }}</strong>
                <span v-if="point.description" class="interview__point-text">{{ point.description }}</span>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.interview {
  --iv-line: rgba(20, 50, 100, 0.08);
}
.interview__grid {
  display: grid;
  grid-template-columns: minmax(0, 46fr) minmax(0, 54fr);
  grid-template-areas:
    'visual head'
    'visual topics'
    'points points';
  column-gap: clamp(32px, 4vw, 56px);
  align-items: center;
}
.interview__visual { grid-area: visual; }
.interview__head { grid-area: head; align-self: end; }
.interview__topics-card { grid-area: topics; align-self: start; }
.interview__points { grid-area: points; }
/* 右側のまとまり（見出し・説明・お話しすることカード）を同じ量だけ少し上へ（PC 2列表示のみ）
   位置だけずらす top を使用：レイアウト・スクロール表示の transform に影響しない */
.interview__head,
.interview__topics-card {
  position: relative;
  top: var(--iv-content-shift, 0px);
}
@media (min-width: 1280px) {
  .interview { --iv-content-shift: -58px; } /* 以前より 30px 上 */
}
@media (min-width: 1025px) and (max-width: 1279px) {
  .interview { --iv-content-shift: -40px; } /* 以前より 26px 上 */
}
/* 下の3つのポイント：まとまりごと上へ（PC 2列表示のみ） */
@media (min-width: 1025px) {
  .interview .interview__points {
    margin-top: calc(clamp(8px, 1.5vw, 20px) - 35px);
  }
}

/* ================= 人物ビジュアル ================= */
.interview__visual {
  position: relative;
  isolation: isolate;
  width: 100%;
  max-width: 640px;
  margin: 0 auto 96px; /* 下はメモの分 */
}
/* 大きな淡いピンクの丸（人物の後ろ） */
.interview__circle {
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 50%;
  width: 84%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 205, 215, 0.55), rgba(255, 212, 222, 0.42) 70%, rgba(255, 220, 228, 0.3));
  translate: -50% -52%;
  pointer-events: none;
  animation: iv-circle 10s ease-in-out infinite;
}
/* 面接画像の枠（3:2・従来と同じ大きさ。メモの位置はこの枠が基準）：ゆっくり浮く */
.interview__illust-float {
  position: relative;
  z-index: 2;
  aspect-ratio: 3 / 2;
  animation: iv-illust-float 7s ease-in-out infinite;
}
/* 以前の淡いピンクの丸は、有機的なフレームの後ろの装飾に置き換え */
.interview__circle {
  display: none;
}
/* 画像：枠の中央に、以前の表示より約 10% 大きく（右側の列にははみ出さない幅） */
.interview__photo {
  --photo-shape: 30% 40% 32% 38% / 34% 30% 40% 34%;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 96%; /* 以前（88%）より大きく。右側の列にははみ出さない */
  aspect-ratio: 1370 / 1148;
  translate: -50% -50%;
}
/* 画像の後ろの水彩のような淡い背景（①左上〜中央：ブルー・ピンク・薄紫 / ②右下：ピンク・ラベンダー・ブルー） */
.interview__photo::before,
.interview__photo::after {
  content: '';
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  filter: blur(18px);
  pointer-events: none;
}
.interview__photo::before {
  left: -14%;
  top: -16%;
  width: 92%;
  height: 86%;
  background:
    radial-gradient(circle at 30% 30%, rgba(151, 214, 255, 0.34), transparent 55%),
    radial-gradient(circle at 70% 20%, rgba(255, 190, 215, 0.3), transparent 58%),
    radial-gradient(circle at 60% 80%, rgba(203, 190, 255, 0.22), transparent 60%);
}
.interview__photo::after {
  right: -14%;
  bottom: -18%;
  width: 84%;
  height: 76%;
  background:
    radial-gradient(circle at 60% 60%, rgba(255, 196, 220, 0.32), transparent 58%),
    radial-gradient(circle at 30% 40%, rgba(210, 196, 255, 0.26), transparent 60%),
    radial-gradient(circle at 80% 30%, rgba(170, 215, 255, 0.24), transparent 58%);
}
/* 画像：四角ベース・角は少し丸く、細い白フレーム＋透明感のある影で少し浮かせる */
.interview__photo-mask {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 5px solid rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  box-shadow:
    0 28px 60px rgba(37, 67, 110, 0.12),
    0 10px 28px rgba(37, 67, 110, 0.08),
    0 2px 8px rgba(255, 255, 255, 0.75);
}
.interview__photo-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 画像の上をごく淡い光がゆっくり通る */
.interview__photo-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, 0.16) 50%, transparent 62%);
  transform: translateX(-100%);
  animation: iv-photo-sheen 11s ease-in-out 2s infinite;
  pointer-events: none;
}
/* 後ろの半透明のパステルの形（少しずつずらして重ねる・ゆっくり形が変わる） */
.iv-photo-layer {
  position: absolute;
  z-index: 0;
  inset: -5%;
  border-radius: var(--photo-shape);
  pointer-events: none;
  animation: iv-photo-morph 14s ease-in-out infinite;
}
.iv-photo-layer--mint {
  translate: -4% -3%;
  background: rgba(200, 228, 255, 0.4); /* ライトブルー */
  filter: blur(6px);
}
.iv-photo-layer--pink {
  translate: 4% 5%;
  background: rgba(255, 210, 228, 0.42);
  filter: blur(6px);
  animation-duration: 17s;
  animation-delay: -6s;
}
.iv-photo-layer--sky {
  inset: -3% -6% 0 -1%;
  translate: 2% -4%;
  background: rgba(222, 210, 255, 0.36); /* ごく薄い紫 */
  filter: blur(6px);
  animation-duration: 15s;
  animation-delay: -10s;
}
/* 外側の細く淡いライン */
.iv-photo-line {
  position: absolute;
  z-index: 1;
  inset: -7% -6% -6% -7%;
  border: 1.5px solid rgba(110, 180, 255, 0.2);
  border-radius: 34% 38% 30% 40% / 36% 30% 38% 34%;
  pointer-events: none;
  animation: iv-photo-line 12s ease-in-out infinite;
}
/* もう1本の細いリング（ピンク・ごく薄く。外側のラインと同じ揺れを逆向きに） */
.iv-photo-ring {
  position: absolute;
  z-index: 1;
  inset: -10% -9% -11% -4%;
  border: 1.5px solid rgba(255, 170, 200, 0.18);
  border-radius: 46% 40% 50% 38% / 40% 48% 38% 50%;
  pointer-events: none;
  animation: iv-photo-line 15s ease-in-out -6s infinite reverse;
}
/* 周りのやわらかい光（ゆっくり明滅しながら少し移動） */
.iv-photo-glow {
  position: absolute;
  z-index: 1;
  top: -6%;
  right: 4%;
  width: 46%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 250, 225, 0.85), rgba(255, 244, 210, 0));
  pointer-events: none;
  animation: iv-photo-glow 9s ease-in-out infinite;
}
/* 外側の小さな葉っぱ（既存の素材）：左上・右上・左下 */
.iv-photo-leaf {
  position: absolute;
  z-index: 3;
  width: auto;
  opacity: 0.85;
  pointer-events: none;
  animation: iv-photo-leaf 8s ease-in-out infinite;
}
.iv-photo-leaf--1 { left: 34%; top: -11%; height: 36px; rotate: 40deg; }
.iv-photo-leaf--2 { right: -6%; top: 10%; height: 30px; rotate: 35deg; animation-duration: 9.5s; animation-delay: -3s; }
.iv-photo-leaf--3 { left: -7%; top: 34%; height: 32px; rotate: -70deg; animation-duration: 7.2s; animation-delay: -5s; }
/* 左下の黄色いドット（大きさ・濃さを少しずつ変える） */
.interview__dotgrid {
  position: absolute;
  z-index: 1;
  left: -2%;
  bottom: -6%;
  display: grid;
  grid-template-columns: repeat(5, 12px);
  gap: 8px;
  pointer-events: none;
}
.interview__dot {
  --size: 6px;
  width: var(--size);
  height: var(--size);
  margin: auto;
  border-radius: 50%;
  background: var(--color-yellow);
  opacity: 0.45;
  animation: iv-dot var(--dur, 5s) ease-in-out var(--delay, 0s) infinite; /* 4〜6.4秒・少しずつずらす */
}
.interview__dot:nth-child(3n) { --size: 4.5px; }
.interview__dot:nth-child(4n + 1) { --size: 7.5px; }
.interview__dot:nth-child(5n + 2) { --size: 5px; }

/* スクロール表示：少し下から浮き上がりながら（1回だけ・共通の v-reveal） */
:global(.reveal-ready .interview .interview__visual.reveal) {
  transform: translateY(24px) scale(0.97);
  transition:
    opacity 0.9s ease,
    transform 1s cubic-bezier(0.22, 1, 0.36, 1);
}
:global(.reveal-ready .interview.is-content-ready .interview__visual.reveal.is-revealed) {
  transform: none;
}

/* ================= 手書き風メモ「リラックスして お話ください。」 ================= */
/* 人物画像の右下に、画像枠に対する % で配置（画像を差し替えても位置が崩れにくい） */
.interview__note-wrap {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: calc(-12% - var(--note-drop, 95px)); /* PC：さらに 35px 下へ（60px → 95px） */
  pointer-events: none;
}
/* Tablet（2列から1列に切り替わる幅・メモは画像基準のまま）：12px 下へ */
@media (min-width: 961px) and (max-width: 1024px) {
  .interview__note-wrap { --note-drop: 26px; } /* 以前より 14px 下へ */
}
.interview__note-rotate {
  rotate: -3.5deg;
}
.interview__note-float {
  --note-y: 6px;
  position: relative;
  padding: 14px 22px 22px 26px;
  filter: drop-shadow(0 12px 24px rgba(40, 60, 100, 0.12));
  animation: iv-note-float 6s ease-in-out -1.5s infinite;
}
/* 背景：淡い黄の中心＋ピンク・水色の形を重ねたブラシ風（四角いカードにはしない） */
.interview__note-blob {
  position: absolute;
  z-index: 0;
  inset: 0 -6% 4% -4%;
  border-radius: 46% 54% 42% 58% / 58% 44% 56% 42%;
  background: radial-gradient(ellipse at 55% 55%, rgba(255, 235, 145, 0.55), rgba(255, 210, 225, 0.35) 55%, rgba(255, 220, 232, 0.12) 78%, transparent 92%);
}
.interview__note-blob::before,
.interview__note-blob::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}
.interview__note-blob::before {
  left: -6%;
  top: 18%;
  width: 55%;
  height: 70%;
  background: radial-gradient(closest-side, rgba(255, 196, 214, 0.55), transparent);
}
.interview__note-blob::after {
  right: -8%;
  top: -4%;
  width: 50%;
  height: 75%;
  background: radial-gradient(closest-side, rgba(200, 228, 250, 0.5), transparent);
}
.interview__note {
  position: relative;
  z-index: 1;
  color: #12356f;
  font-family: var(--font-heading);
  font-size: clamp(17px, 1.25vw, 23px);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.35;
}
.interview__note-line {
  display: block;
  white-space: nowrap;
}
.interview__note-line.is-last {
  padding-left: 0.6em; /* 手書きらしく2行目を少し右へ */
}
.interview__note-text {
  position: relative;
  z-index: 0;
}
/* 「お話ください。」の後ろの黄色い手書きマーカー（太さにムラ） */
.interview__note-line.is-last .interview__note-text::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: -3%;
  right: -4%;
  bottom: 0.02em;
  height: 0.4em;
  border-radius: 999px 60% 999px 45% / 999px 55% 999px 50%;
  /* 淡いパステルグリーン（葉っぱ #65C980 系より明るく淡く） */
  background: linear-gradient(90deg, rgba(174, 222, 185, 0.55), rgba(174, 222, 185, 0.8) 45%, rgba(174, 222, 185, 0.6));
  rotate: -1deg;
}
/* コーラルの点線カーブ */
.interview__dotted {
  position: absolute;
  z-index: 1;
  left: 16%;
  bottom: 4px;
  width: 80%;
  height: 14px;
  overflow: visible;
}
.interview__dotted path {
  fill: none;
  stroke: #ff6666;
  stroke-width: 2;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  /* 点線（2 と 5 の繰り返し）を、左→右へ現れるマスク線で描く */
  stroke-dasharray: 2 5;
  opacity: 0.85;
}
.interview__dotted {
  -webkit-mask-image: linear-gradient(90deg, #000 45%, transparent 55%);
  mask-image: linear-gradient(90deg, #000 45%, transparent 55%);
  -webkit-mask-size: 220% 100%;
  mask-size: 220% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  animation: iv-dotted 5s ease-in-out 0.6s infinite both;
}
/* 左右の短い線（順番に出る → 消える、を繰り返す） */
.interview__rays {
  position: absolute;
  z-index: 1;
  width: 18px;
  height: 30px;
}
.interview__rays--l { left: 4px; top: 16%; }
.interview__rays--r { right: 0; top: 2%; }
.interview__ray {
  position: absolute;
  height: 3px;
  border-radius: 999px;
  background: #ff6b6b;
  animation: iv-ray 4.2s ease-out var(--d, 0s) infinite both;
}
.interview__rays--l .interview__ray { right: 0; transform-origin: right center; }
.interview__rays--l .interview__ray--1 { --d: 0s;    width: 11px; top: 2px;  rotate: 35deg; }
.interview__rays--l .interview__ray--2 { --d: 0.25s; width: 13px; top: 13px; rotate: 0deg; background: #ff8a8a; }
.interview__rays--l .interview__ray--3 { --d: 0.5s;  width: 10px; top: 24px; rotate: -32deg; opacity: 0.85; }
.interview__rays--r .interview__ray { left: 0; transform-origin: left center; background: #ffcf3f; animation-name: iv-ray-flash; animation-duration: 3.2s; }
.interview__rays--r .interview__ray--1 { --d: 0.3s; width: 12px; top: 4px;  rotate: -50deg; }
.interview__rays--r .interview__ray--2 { --d: 0.5s; width: 11px; top: 16px; rotate: -12deg; }

/* 葉っぱ（既存素材）とドット */
.interview__note-deco {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.interview__note-deco > * {
  position: absolute;
}
.iv-leaf {
  transform-origin: 50% 90%;
  animation: iv-leaf var(--dur, 6s) ease-in-out var(--delay, 0s) infinite;
}
.iv-leaf--1 { --dur: 6s;   --delay: 0s;    width: 22px; right: 4%;  top: -30%; rotate: 20deg; }
.iv-leaf--2 { --dur: 7.5s; --delay: -2.5s; width: 16px; right: -6%; top: -8%;  rotate: 48deg; opacity: 0.85; }
.iv-leaf--3 { --dur: 5.5s; --delay: -1.2s; width: 20px; left: -8%;  bottom: 2%; rotate: -64deg; }
.iv-ndot {
  width: var(--s, 6px);
  height: var(--s, 6px);
  border-radius: 50%;
  background: var(--c);
  animation: iv-ndot var(--dur, 4.5s) ease-in-out var(--delay, 0s) infinite;
}
.iv-ndot--1 { --s: 7px; --c: #ffd95a; --dur: 4.4s; right: -10%; top: 38%; }
.iv-ndot--2 { --s: 5px; --c: #ffb3c6; --dur: 5.2s; --delay: -1.5s; right: -4%; top: 62%; }
.iv-ndot--3 { --s: 4px; --c: #9fdcb6; --dur: 4.8s; --delay: -3s; right: -16%; top: 56%; }
.iv-ndot--4 { --s: 6px; --c: #ffb3c6; --dur: 5.6s; --delay: -2s; left: 4%; bottom: -6%; }

@keyframes iv-circle {
  0%, 100% { scale: 1; opacity: 0.85; }
  50% { scale: 1.025; opacity: 1; }
}
@keyframes iv-illust-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -7px; }
}
@keyframes iv-photo-sheen {
  0% { transform: translateX(-100%); }
  35%, 100% { transform: translateX(100%); }
}
@keyframes iv-photo-morph {
  0%, 100% { border-radius: 30% 40% 32% 38% / 34% 30% 40% 34%; rotate: 0deg; }
  50% { border-radius: 38% 32% 40% 30% / 40% 36% 32% 38%; rotate: 2deg; }
}
@keyframes iv-photo-line {
  0%, 100% { rotate: -3deg; }
  50% { rotate: 3deg; }
}
@keyframes iv-photo-glow {
  0%, 100% { opacity: 0.5; translate: 0 0; }
  50% { opacity: 1; translate: -14px 8px; }
}
@keyframes iv-photo-leaf {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-3px) rotate(4deg); }
}
@keyframes iv-note-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 calc(var(--note-y) * -1); }
}
@keyframes iv-dotted {
  0% { -webkit-mask-position: 100% 0; mask-position: 100% 0; opacity: 0; }
  6% { opacity: 1; }
  40% { -webkit-mask-position: 0 0; mask-position: 0 0; opacity: 1; }
  72% { -webkit-mask-position: 0 0; mask-position: 0 0; opacity: 1; }
  88%, 100% { -webkit-mask-position: 0 0; mask-position: 0 0; opacity: 0; }
}
@keyframes iv-ray-flash {
  0%, 100% { opacity: 0.35; scale: 0.7; }
  18% { opacity: 1; scale: 1.1; }
  36% { opacity: 1; scale: 1; }
  60% { opacity: 0.35; scale: 0.75; }
}
/* 葉っぱ：基本の傾き（rotate）はそのままに、transform で揺らす */
@keyframes iv-leaf {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-6px) rotate(5deg); }
}
@keyframes iv-ndot {
  0%, 100% { opacity: 0.6; translate: 0 0; }
  50% { opacity: 1; translate: 0 -4px; }
}
@keyframes iv-ray {
  0% { opacity: 0; scale: 0.5; }
  14% { opacity: 1; scale: 1; }
  62% { opacity: 1; scale: 1; }
  80%, 100% { opacity: 0; scale: 0.6; }
}
@keyframes iv-dot {
  0%, 100% { opacity: 0.3; translate: 0 0; }
  50% { opacity: 0.8; translate: 0 -3px; }
}
/* ================= 面接でお話しすること（白い大きなカードの中に 4枚のカード・2×2） ================= */
.interview__topics-card {
  margin-top: 28px;
}
/* 白い大きなカード：背景から少し浮いて見える影 ＋ ゆっくりした浮遊 */
.interview__topics-panel {
  padding: clamp(20px, 2vw, 28px) clamp(18px, 1.8vw, 26px) clamp(20px, 2vw, 26px);
  background: rgba(255, 255, 255, 0.93);
  border: 1px solid rgba(235, 225, 245, 0.7);
  border-radius: 32px;
  box-shadow:
    0 24px 55px rgba(39, 58, 92, 0.1),
    0 8px 24px rgba(39, 58, 92, 0.06),
    0 0 60px rgba(255, 214, 232, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  animation: iv-panel-float 6s ease-in-out infinite;
}
@keyframes iv-title-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes iv-panel-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.interview__topics-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: clamp(16px, 1.6vw, 22px);
}
/* 見出し（ボタンではない）：淡いピンクの pill */
.interview__topics-title {
  padding: 8px 26px;
  border-radius: 999px;
  background: linear-gradient(120deg, rgba(255, 222, 234, 0.96), rgba(240, 228, 255, 0.94));
  box-shadow:
    0 10px 24px rgba(255, 150, 175, 0.15),
    0 4px 10px rgba(35, 55, 95, 0.06),
    0 0 18px rgba(232, 214, 255, 0.5);
  animation: iv-title-float 4.5s ease-in-out infinite;
  color: var(--color-navy);
  font-size: var(--fs-md);
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1.4;
}
/* 見出し左右の黄色い3本線 */
.iv-title-rays {
  position: relative;
  width: 18px;
  height: 26px;
  flex-shrink: 0;
  animation: iv-rays-pulse 4.6s ease-in-out infinite;
}
.iv-title-rays--r { animation-delay: -2.3s; }
.iv-title-rays > span {
  position: absolute;
  height: 3px;
  width: 13px;
  border-radius: 999px;
  background: var(--color-yellow);
}
.iv-title-rays--l > span { right: 0; transform-origin: right center; }
.iv-title-rays--r > span { left: 0; transform-origin: left center; }
.iv-title-rays > span:nth-child(1) { top: 2px; rotate: 32deg; }
.iv-title-rays > span:nth-child(2) { top: 12px; width: 15px; }
.iv-title-rays > span:nth-child(3) { top: 22px; rotate: -32deg; }
.iv-title-rays--r > span:nth-child(1) { rotate: -32deg; }
.iv-title-rays--r > span:nth-child(3) { rotate: 32deg; }
/* 左右の小さな線は3色（ピンク・イエロー・ブルー） */
.iv-title-rays > span:nth-child(1) { background: #ff9ab3; }
.iv-title-rays > span:nth-child(2) { background: #f9cf4f; }
.iv-title-rays > span:nth-child(3) { background: #8cbcf0; }

/* ---------- 4枚のカード ---------- */
.interview__topics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.2vw, 18px);
}
/* カードごとの色（lpContent.js の accent：green / pink / blue / yellow） */
.interview__topic.accent-green {
  --t-line: #5fcf9a;
  --t-bg: linear-gradient(135deg, rgba(242, 255, 247, 0.96), rgba(249, 255, 250, 0.92));
  --t-mark: rgba(190, 236, 170, 0.7);
  --t-ray: #8fd19e;
}
.interview__topic.accent-pink {
  --t-line: #f39ab2;
  --t-bg: linear-gradient(135deg, rgba(255, 245, 248, 0.96), rgba(255, 250, 250, 0.92));
  --t-mark: rgba(255, 200, 218, 0.7);
  --t-ray: #f6a3b8;
}
.interview__topic.accent-blue {
  --t-line: #7cb8f2;
  --t-bg: linear-gradient(135deg, rgba(241, 249, 255, 0.96), rgba(248, 252, 255, 0.92));
  --t-mark: rgba(190, 220, 250, 0.75);
  --t-ray: #8cbcf0;
}
.interview__topic.accent-yellow {
  --t-line: #f2c447;
  --t-bg: linear-gradient(135deg, rgba(255, 252, 235, 0.96), rgba(255, 250, 242, 0.92));
  --t-mark: rgba(255, 225, 120, 0.65);
  --t-ray: #f6c94a;
}
.interview__topic {
  display: flex;
}
.interview__topic-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.2vw, 16px);
  width: 100%;
  padding: clamp(16px, 1.6vw, 22px) clamp(14px, 1.4vw, 20px);
  isolation: isolate;
  background: var(--t-bg);
  border: 1px solid color-mix(in srgb, var(--t-line) 28%, rgba(255, 255, 255, 0.8));
  border-radius: 22px;
  box-shadow:
    0 16px 35px rgba(30, 55, 90, 0.07),
    0 5px 14px rgba(30, 55, 90, 0.05);
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.5s ease,
    border-color 0.5s ease;
}
/* カード端の淡い装飾（角丸の中だけ・文字より後ろ・ごくゆっくり動く） */
.iv-topic-deco {
  position: absolute;
  z-index: -1;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.iv-topic-deco > * {
  position: absolute;
}
.iv-topic-deco__blob {
  top: -34px;
  right: -30px;
  width: 120px;
  height: 100px;
  border-radius: 58% 42% 55% 45% / 48% 58% 42% 52%;
  background: color-mix(in srgb, var(--t-line) 16%, transparent);
  animation: iv-topic-ambient 12s ease-in-out calc(var(--t-i, 0) * -3s) infinite;
}
.iv-topic-deco__wave {
  left: -15%;
  right: -10%;
  bottom: -52px;
  height: 84px;
  border-radius: 50% 50% 0 0 / 80% 100% 0 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--t-line) 6%, transparent), color-mix(in srgb, var(--t-line) 20%, transparent));
  rotate: -4deg;
}
.iv-topic-deco__circle {
  left: 10px;
  bottom: 14%;
  width: 22px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: color-mix(in srgb, var(--t-line) 14%, transparent);
  animation: iv-topic-ambient 10s ease-in-out calc(var(--t-i, 0) * -2s - 3s) infinite;
}
.iv-topic-deco__dot {
  top: 18%;
  right: 14%;
  width: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: color-mix(in srgb, var(--t-line) 28%, transparent);
}
@keyframes iv-topic-ambient {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(2px, -3px) scale(1.02); }
}
/* アイコン：淡い丸＋白いリングで少し存在感を出し、ゆっくり浮く（カードごとにずらす） */
.interview__topic-icon {
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: clamp(60px, 5vw, 72px);
  height: clamp(60px, 5vw, 72px);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, var(--accent-pale) 70%);
  border: 1px solid color-mix(in srgb, var(--t-line) 25%, transparent);
  box-shadow:
    0 0 0 5px rgba(255, 255, 255, 0.75),
    0 8px 18px rgba(30, 55, 90, 0.06),
    0 0 22px color-mix(in srgb, var(--t-line) 28%, transparent);
  animation: iv-topic-icon-float 6s ease-in-out calc(var(--t-i, 0) * -1.4s) infinite;
  transition: translate 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.interview__topic-icon {
  --pi-color: var(--t-line);
  --pi-y: -2px; /* 丸自体もゆっくり浮くので、画像は小さめに */
  --pi-y-sp: -1.5px;
}
.interview__topic-icon img {
  width: 56%;
  height: 56%;
}
@keyframes iv-topic-icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.interview__topic-text {
  min-width: 0;
  color: var(--color-navy);
  font-size: var(--fs-sm);
  font-weight: 700;
  line-height: 1.65;
}
.interview__topic-title {
  display: block;
  font-size: clamp(0.9375rem, 0.8rem + 0.25vw, 1.0625rem);
  font-weight: 800;
  line-height: 1.5;
  word-break: keep-all; /* \n（<wbr>）の位置でだけ改行する */
  overflow-wrap: anywhere;
}
/* タイトル下の手書き風マーカー（文字の下側に少し重なる・行ごとに丸く） */
.interview__topic-mark {
  /* 以前のマーカー装飾はタイトル下のラインに置き換え */
}
/* タイトル下の細いライン：淡い下地の上を、色のラインが左 → 右へ伸びる（繰り返し）＋ 右端のドット */
.interview__topic-line {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 220px;
  margin-top: 8px;
}
.interview__topic-bar {
  position: relative;
  flex: 1;
  height: 2px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--t-line) 18%, transparent);
  overflow: hidden;
}
.interview__topic-bar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, color-mix(in srgb, var(--t-line) 45%, transparent), var(--t-line));
  transform: scaleX(0);
  transform-origin: left center;
  animation: iv-topic-line 3.4s ease-in-out calc(var(--t-i, 0) * 0.3s) infinite;
}
.interview__topic-dots {
  flex: none;
  width: 22px;
  height: 6px;
  background: radial-gradient(circle, var(--t-line) 2.2px, transparent 2.7px) 0 50% / 8px 6px repeat-x;
  opacity: 0.45;
  animation: iv-topic-dots 3.4s ease-in-out calc(var(--t-i, 0) * 0.3s) infinite;
}
@keyframes iv-topic-line {
  0% { transform: scaleX(0); opacity: 1; }
  45% { transform: scaleX(1); opacity: 1; }
  75% { transform: scaleX(1); opacity: 1; }
  92% { transform: scaleX(1); opacity: 0; }
  100% { transform: scaleX(0); opacity: 0; }
}
@keyframes iv-topic-dots {
  0%, 30%, 100% { opacity: 0.45; }
  50%, 75% { opacity: 0.9; }
}
/* 項目の説明（通常の太さ・少し小さめ） */
.interview__topic-desc {
  display: block;
  margin-top: 6px;
  color: var(--color-navy-soft);
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.7;
}
/* PC 2列（右側の列が狭い幅）：文章の幅を確保するため、アイコン・余白を少しコンパクトに */
@media (min-width: 1025px) {
  .interview__topics-panel {
    padding-inline: clamp(16px, 1.4vw, 20px);
  }
  .interview__topic-card {
    gap: 12px;
    padding: 18px 14px;
  }
  .interview__topic-icon {
    width: 56px;
    height: 56px;
  }
}
.interview__topic-desc {
  text-wrap: pretty; /* 最後の行が1〜2文字だけにならないように */
}
/* PC の狭め（1025〜1279px）：右側の列が狭く文章が細切れになるため、アイコンを上・文章を下に */
@media (min-width: 1025px) and (max-width: 1279px) {
  .interview__topic-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 16px 20px;
  }
  .interview__topic-icon {
    width: 52px;
    height: 52px;
  }
}

/* PC（マウス操作）：触れると少し浮く */
@media (hover: hover) and (pointer: fine) {
  .interview__topic-card:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--t-line) 45%, rgba(255, 255, 255, 0.8));
    box-shadow:
      0 22px 44px rgba(30, 55, 90, 0.1),
      0 8px 18px rgba(30, 55, 90, 0.06);
  }
  .interview__topic-card:hover .interview__topic-icon {
    translate: 0 -2px;
  }
  .interview__topic-card:hover .iv-topic-deco__blob {
    background: color-mix(in srgb, var(--t-line) 24%, transparent);
  }
}

/* スクロール表示：少し下から順番に（1回だけ・共通の v-reveal） */
:global(.reveal-ready .interview .interview__topic.reveal) {
  transform: translateY(20px) scale(0.98);
  transition:
    opacity 0.8s ease,
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(50ms + var(--t-i, 0) * 90ms); /* 左上 → 右上 → 左下 → 右下 */
}
:global(.reveal-ready .interview.is-content-ready .interview__topic.reveal.is-revealed) {
  transform: none;
}

/* ================= 3つのポイント（横長のやわらかいカード） ================= */
.interview__points {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 28px);
  margin-top: clamp(8px, 1.5vw, 20px);
}
.interview__point-item {
  display: flex;
}
.interview__point-float {
  flex: 1;
  display: flex;
  animation: iv-point-float var(--dur, 6.8s) ease-in-out var(--delay, 0s) infinite;
}
.interview__point {
  --pt-bg: #fff6d8;
  --pt-bd: #fbe7a6;
  --pt-icon: #ffeaa0;
  --pt-ray: var(--color-yellow);
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  border-radius: 40px;
  background: linear-gradient(135deg, #fffdf6, var(--pt-bg));
  border: 1px solid var(--pt-bd);
  box-shadow: 0 12px 30px rgba(30, 60, 100, 0.08);
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.35s ease;
}
.point--blue { --pt-bg: #e6f2ff; --pt-bd: #cfe4fb; --pt-icon: #cfe5fc; --pt-ray: #6fb3ee; }
.point--green { --pt-bg: #e6f7ee; --pt-bd: #cdeedd; --pt-icon: #cdeede; --pt-ray: #5ccb9b; }
.interview__point-icon {
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  --pt-float: -5px;
}
/* 丸いアイコン：既存の色の丸のまま、テーマ色の柔らかい影で少し浮かせ、ゆっくり上下 */
.iv-point-icon-float {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--pt-icon);
  box-shadow:
    0 10px 24px color-mix(in srgb, var(--pt-ray) 22%, transparent),
    0 4px 10px color-mix(in srgb, var(--pt-ray) 16%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  animation: iv-point-icon-float 5.2s ease-in-out var(--pi-delay, 0s) infinite;
  transition:
    translate 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    scale 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease;
}
.iv-point-icon-float img {
  width: 60%;
  height: 60%;
  filter: drop-shadow(0 2px 3px color-mix(in srgb, var(--pt-ray) 22%, transparent));
}
/* 後ろの淡い光（アイコンより少し大きい・ゆっくり呼吸） */
.iv-point-icon-glow {
  position: absolute;
  z-index: 0;
  inset: -18%;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--pt-ray) 45%, transparent), transparent 72%);
  opacity: 0.35;
  pointer-events: none;
  animation: iv-point-icon-glow 7s ease-in-out var(--pi-delay, 0s) infinite;
}
@keyframes iv-point-icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(var(--pt-float)); }
}
@keyframes iv-point-icon-glow {
  0%, 100% { transform: scale(0.95); opacity: 0.35; }
  50% { transform: scale(1.08); opacity: 0.55; }
}
/* PC hover：丸がもう少しだけ上がり、影が少し強くなる（浮遊の transform とは別プロパティ） */
@media (hover: hover) and (pointer: fine) {
  .interview__point:hover .iv-point-icon-float {
    translate: 0 -2px;
    scale: 1.04;
    box-shadow:
      0 14px 30px color-mix(in srgb, var(--pt-ray) 28%, transparent),
      0 6px 12px color-mix(in srgb, var(--pt-ray) 20%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
}
.interview__point-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.interview__point-title {
  color: var(--color-navy);
  font-family: var(--font-heading);
  font-size: var(--fs-md);
  font-weight: 900;
  line-height: 1.35;
}
.interview__point-text {
  color: var(--color-text);
  font-size: var(--fs-xs);
  line-height: 1.6;
}
/* カード左上の小さな手書き風の線 */
.iv-point-rays {
  position: absolute;
  left: 10px;
  top: -12px;
  width: 22px;
  height: 22px;
  animation: iv-rays-pulse 4.2s ease-in-out infinite;
}
.iv-point-rays > span {
  position: absolute;
  right: 0;
  height: 3px;
  width: 11px;
  border-radius: 999px;
  background: var(--pt-ray);
  transform-origin: right center;
}
.iv-point-rays > span:nth-child(1) { top: 0; rotate: 60deg; }
.iv-point-rays > span:nth-child(2) { top: 8px; rotate: 30deg; width: 13px; }
.iv-point-rays > span:nth-child(3) { top: 16px; rotate: 0deg; }
@media (hover: hover) and (pointer: fine) {
  .interview__point:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 38px rgba(30, 60, 100, 0.11);
  }
}

/* ================= 背景の淡い丸とドット ================= */
.iv-bg,
.iv-bg-dots {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}
.iv-bg {
  border-radius: 50%;
  animation: iv-bg-drift 14s ease-in-out infinite alternate;
}
.iv-bg--blue { width: 220px; height: 220px; right: -60px; top: -70px; background: rgba(214, 232, 252, 0.7); }
.iv-bg--pink { width: 180px; height: 180px; right: -80px; bottom: 18%; background: rgba(255, 224, 230, 0.6); animation-duration: 17s; animation-delay: -5s; }
.iv-bg--yellow { width: 200px; height: 200px; left: -90px; top: 32%; background: rgba(255, 240, 200, 0.6); animation-duration: 12s; animation-delay: -3s; }
.iv-bg-dots {
  width: 110px;
  height: 90px;
  background: radial-gradient(circle, rgba(200, 190, 175, 0.55) 0 1.6px, transparent 2px) 0 0 / 12px 12px;
  animation: iv-bg-dots 10s ease-in-out infinite;
}
.iv-bg-dots--l { left: 3%; top: 8%; }
.iv-bg-dots--r { right: 4%; top: 22%; animation-delay: -4s; }

@keyframes iv-rays-pulse {
  0%, 100% { opacity: 0.7; scale: 0.95; }
  50% { opacity: 1; scale: 1.05; }
}
@keyframes iv-point-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -4px; }
}
@keyframes iv-bg-drift {
  from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.85; }
  to { transform: translate3d(-12px, 10px, 0) scale(1.04); opacity: 1; }
}
@keyframes iv-bg-dots {
  0%, 100% { opacity: 0.45; translate: 0 0; }
  50% { opacity: 0.8; translate: 0 -4px; }
}

/* ----- Tablet 以下（〜1024px）：見出し → イラスト → お話しすること → ポイント の1列 ----- */
@media (max-width: 1024px) {
  .interview__grid {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'head'
      'visual'
      'topics'
      'points';
  }
  .interview__visual {
    width: 92%;
    max-width: 560px;
    margin: 100px auto 96px; /* 上：大きくした画像と外側の装飾が説明文にかからない余白 */
  }
  .interview__topics-card {
    width: 100%;
    max-width: 680px;
    justify-self: center;
    margin-top: 8px;
  }
  .interview__points {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    margin-top: 32px;
  }
}
/* ----- SP（〜960px）：メモは画像の直下に右寄せ（デザインはそのまま） ----- */
@media (max-width: 960px) {
  .interview__visual {
    max-width: 500px;
    margin-bottom: 8px;
  }
  .interview__note-wrap {
    position: relative;
    right: auto;
    bottom: auto;
    width: fit-content;
    margin: 4px 4% 0 auto; /* 画像の右下に添える（以前より 12px 下へ） */
  }
  .interview__note-float {
    --note-y: 3.5px;
    padding: 12px 18px 20px 24px;
  }
  .interview__note {
    font-size: clamp(15px, 4.5vw, 19px);
  }
  .iv-ndot--3 {
    display: none;
  }
  .interview__dotgrid {
    bottom: 10%;
    grid-template-columns: repeat(4, 10px);
    gap: 6px;
  }
  .interview__dot:nth-child(n + 13) {
    display: none;
  }
  .interview__topics-card {
    margin-top: 28px;
  }
}
@media (max-width: 767px) {
  /* SP：画像まわりの葉っぱは小さめにして、画像の外側へ */
  .iv-photo-leaf { height: 22px; }
  .iv-photo-leaf--1 { top: -16%; }
  .iv-photo-leaf--2 { right: -10%; }
  .iv-photo-leaf--3 { left: -10%; }
  /* SP：お話しすることは 1列 × 4枚 */
  .interview__topics {
    grid-template-columns: minmax(0, 1fr);
  }
  .interview__points {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  .iv-bg--yellow,
  .iv-bg-dots {
    display: none;
  }
}
/* ----- 狭いSP：お話しすることは1列×4項目 ----- */
@media (max-width: 560px) {
  .interview__topics-panel {
    padding: 18px 16px 10px;
    border-radius: 24px;
  }
  .interview__topics-head {
    justify-content: center;
  }
  .interview__topics-title {
    font-size: 1rem;
    padding: 5px 16px;
  }
  .interview__topic-card {
    gap: 12px;
    padding: 16px 14px;
    border-radius: 20px;
  }
  .interview__topic-icon {
    width: 56px;
    height: 56px;
  }
  .interview__point {
    padding: 14px 18px;
    border-radius: 32px;
  }
  .interview__point-icon {
    width: 60px;
    height: 60px;
  }
}
/* SP：浮遊・影・光を控えめに */
@media (max-width: 767px) {
  .interview__point-icon {
    --pt-float: -2.5px;
  }
  .iv-point-icon-float {
    box-shadow:
      0 7px 16px color-mix(in srgb, var(--pt-ray) 18%, transparent),
      0 3px 7px color-mix(in srgb, var(--pt-ray) 12%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
  .iv-point-icon-glow {
    inset: -12%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .iv-topic-deco__blob,
  .iv-topic-deco__circle,
  .interview__topic-dots {
    animation: none;
  }
  .interview__topic-bar::after {
    animation: none;
    transform: scaleX(1); /* ラインは表示したまま */
  }
  .interview__topic-card:hover .interview__topic-icon {
    translate: none;
  }
  .interview__topics-panel,
  .interview__topics-title,
  .interview__topic-icon {
    animation: none;
  }
  .interview__topic-card {
    transition: none;
  }
  .interview__topic-card:hover {
    transform: none;
  }
  :global(.reveal-ready .interview .interview__topic.reveal) {
    transform: none;
  }
  .interview__photo-sheen,
  .iv-photo-layer,
  .iv-photo-line,
  .iv-photo-ring,
  .iv-photo-glow,
  .iv-photo-leaf {
    animation: none;
  }
  .interview__photo-sheen {
    display: none;
  }
  :global(.reveal-ready .interview .interview__visual.reveal) {
    transform: none;
  }
  .interview__circle,
  .interview__illust-float,
  .interview__note-float,
  .interview__dotted,
  .interview__ray,
  .iv-leaf,
  .iv-ndot,
  .interview__dot,
  .iv-title-rays,
  .iv-point-icon-float,
  .iv-point-icon-glow,
  .iv-point-rays,
  .interview__point-float,
  .iv-bg,
  .iv-bg-dots {
    animation: none;
  }
  .interview__point {
    transition: none;
  }
  .interview__point:hover {
    transform: none;
  }
  .interview__point:hover .iv-point-icon-float {
    translate: none;
    scale: 1;
  }
  .interview__dotted {
    -webkit-mask-image: none;
    mask-image: none;
  }
  .interview__ray {
    opacity: 1;
  }
  .interview__dot {
    opacity: 0.55;
  }
}
</style>
