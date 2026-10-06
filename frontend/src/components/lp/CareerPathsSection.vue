<script setup>
import { ref } from 'vue'
import { useHeadingReveal } from '../../composables/useHeadingReveal.js'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import SectionHeading from './SectionHeading.vue'
import CareerCard from './CareerCard.vue'

const { careersSection: section, careers } = lpContent

// タイトル（05 / CAREER PATH / 見出し）の Scroll Animation：左から1回だけ → その後に既存コンテンツ（01〜03 と共通処理）
const heading = ref(null)
const { stateClass } = useHeadingReveal(heading)
</script>

<template>
  <section id="careers" class="careers lp-section lp-section--white heading-reveal-scope" :class="stateClass" aria-labelledby="careers-title">
    <span class="lp-blob lp-blob--blue careers__blob-1" aria-hidden="true"></span>
    <span class="lp-blob lp-blob--green careers__blob-2" aria-hidden="true"></span>
    <img class="lp-deco careers__leaf" :src="img('common/deco-leaf-pair.svg')" alt="" aria-hidden="true" />

    <div class="lp-container">
      <SectionHeading
        ref="heading"
        id="careers-title"
        :number="section.number"
        :label="section.label"
        :title="section.title"
        :lead="section.lead"
        align="center"
        slide-in
      />
      <!--
        手書き風メモ「なりたい自分を、ここからみつけよう。」
        外側：スクロール表示（1回） / 中：ずっと続く浮遊 / 内：文字と装飾（それぞれ別の周期でループ）
      -->
      <div v-if="section.note" v-reveal="{ delay: 150 }" class="career-note-reveal heading-reveal-content heading-reveal-content--note">
        <div class="career-note-float">
          <div class="career-note">
            <!-- 背景：淡い黄・ミントのブラシ＋ピンクの光（四角いカードにはしない） -->
            <span class="cn-brush cn-brush--yellow" aria-hidden="true"></span>
            <span class="cn-brush cn-brush--mint" aria-hidden="true"></span>
            <span class="cn-glow" aria-hidden="true"></span>

            <!-- 小さな装飾：葉っぱ・三角・ドット -->
            <span class="cn-deco" aria-hidden="true">
              <img class="cn-leaf" :src="img('common/deco-leaf-pair.svg')" alt="" />
              <span class="cn-tri cn-tri--1"></span>
              <span class="cn-tri cn-tri--2"></span>
              <span class="cn-tri cn-tri--3"></span>
              <span class="cn-dot cn-dot--1"></span>
              <span class="cn-dot cn-dot--2"></span>
              <span class="cn-dot cn-dot--3"></span>
            </span>

            <p class="career-note__text">
              <span class="career-note__line">
                <!-- 余計な空白が下線の範囲に入らないよう、改行せずに並べる -->
                <span class="career-note__underline"><em class="career-note__em">{{ section.note.highlight }}</em><svg class="cn-underline" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M2 8 C 30 4, 70 4, 118 6" /></svg></span>{{ section.note.line1 }}
              </span>
              <span class="career-note__line career-note__line--2">{{ section.note.line2 }}</span>
            </p>

            <!-- 文字の下の、少しカーブしたミントの線 -->
            <svg class="cn-mint" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M4 22 C 60 10, 120 8, 180 14 C 220 18, 260 16, 296 8" />
            </svg>
          </div>
        </div>
      </div>

      <div class="careers__track">
        <span v-reveal="{ variant: 'fade', delay: 100 }" class="careers__line heading-reveal-content" aria-hidden="true"></span>
        <ul class="careers__list">
          <li v-for="(career, index) in careers" :key="career.title" v-reveal="{ delay: 100, i: index }" class="heading-reveal-content heading-reveal-content--card">
            <CareerCard :career="career" :index="index" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ================= 手書き風メモ「なりたい自分を、ここからみつけよう。」 ================= */
.career-note-reveal {
  --cn-float: 3.5px; /* 浮く量（SPで弱める） */
  display: flex;
  justify-content: center;
  margin-top: 14px;
}
.career-note-float {
  /* メモ全体（文字・下線・ブラシ・葉・ドット・三角）をまとめて少し右上がりに／中央から少し右へ
     傾きは rotate、浮遊は translate（別プロパティなので競合しない） */
  rotate: -2deg;
  translate: 18px 0;
  animation: cn-float 7s ease-in-out infinite;
}
.career-note {
  position: relative;
  isolation: isolate;
  width: clamp(280px, 23vw, 340px);
  padding: 14px 22px 22px;
}
/* 背景のブラシ（淡い黄・ミント）とピンクの光。柔らかい影は drop-shadow で形に沿わせる */
.cn-brush,
.cn-glow {
  position: absolute;
  z-index: -1;
  pointer-events: none;
}
.cn-brush--yellow {
  left: 4%;
  right: 16%;
  top: 8%;
  bottom: 30%;
  border-radius: 40% 60% 46% 54% / 60% 40% 60% 40%;
  background: linear-gradient(100deg, rgba(255, 236, 170, 0.15), rgba(255, 230, 150, 0.55) 30%, rgba(255, 240, 190, 0.35) 85%, rgba(255, 240, 190, 0));
  rotate: -3deg;
  filter: drop-shadow(0 9px 20px rgba(40, 60, 100, 0.05));
}
.cn-brush--mint {
  left: 22%;
  right: 2%;
  top: 44%;
  bottom: 6%;
  border-radius: 55% 45% 50% 50% / 45% 60% 40% 55%;
  background: linear-gradient(100deg, rgba(200, 240, 225, 0), rgba(200, 240, 225, 0.5) 25%, rgba(215, 245, 232, 0.35) 90%, rgba(215, 245, 232, 0));
  rotate: 2deg;
}
.cn-glow {
  inset: -10% -6%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 190, 200, 0.22), transparent 75%);
  opacity: 0.6;
  animation: cn-glow 7s ease-in-out infinite; /* 浮遊と同じ周期：浮くと光が広がる */
}

/* 文字：ネイビー＋コーラル（「ここから」だけ） */
.career-note__text {
  position: relative;
  color: var(--color-navy);
  font-family: var(--font-heading);
  font-size: clamp(21px, 0.9rem + 0.55vw, 25px);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.5;
}
.career-note__line {
  display: block;
  white-space: nowrap;
}
.career-note__line--2 {
  padding-left: 1.2em; /* 手書きらしく2行目を少し右へ */
}
.career-note__em {
  font-style: normal;
  color: var(--color-coral);
  animation: cn-em-breathe 6s ease-in-out infinite;
}
.career-note__underline {
  position: relative;
  display: inline-block;
}
/* 黄色の手書き下線：左→右へ描く → 維持 → 薄く消える → また描く */
.cn-underline {
  position: absolute;
  z-index: -1;
  left: -6%;
  bottom: -2px;
  width: 114%; /* 絶対配置の SVG は left/right では伸びないので幅を明示 */
  height: 10px;
  overflow: visible;
}
.cn-underline path {
  fill: none;
  stroke: var(--color-yellow);
  stroke-width: 6;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  opacity: 0.85;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: cn-underline 5.8s ease-in-out 0.4s infinite both;
}
/* ミントの線（別の周期） */
.cn-mint {
  position: absolute;
  left: 14%;
  bottom: 4px;
  width: 80%;
  height: 15px;
  overflow: visible;
  pointer-events: none;
}
.cn-mint path {
  fill: none;
  stroke: #7fd6b8;
  stroke-width: 3.2;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: cn-mint 8.2s ease-in-out 1.2s infinite both;
}

/* 小さな装飾 */
.cn-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.cn-deco > * {
  position: absolute;
}
.cn-leaf {
  width: 33px;
  left: -12px;
  top: -15px;
  transform-origin: 50% 90%;
  opacity: 0.9;
  animation: cn-leaf 6.4s ease-in-out infinite;
}
.cn-tri {
  width: 9.5px;
  height: 8.5px;
  background: #ffd95a;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  opacity: 0.6;
  animation: cn-small var(--dur, 6s) ease-in-out var(--delay, 0s) infinite;
}
.cn-tri--1 { --dur: 5.4s; --delay: 0s;    left: -18px; bottom: 18%; }
.cn-tri--2 { --dur: 6.8s; --delay: -2s;   right: 2%;   top: 2%; rotate: 30deg; }
.cn-tri--3 { --dur: 6s;   --delay: -3.6s; right: -15px; bottom: 30%; rotate: -20deg; width: 8px; height: 7px; }
.cn-dot {
  width: var(--s, 5px);
  height: var(--s, 5px);
  border-radius: 50%;
  background: var(--c, #ffd95a);
  animation: cn-small var(--dur, 5s) ease-in-out var(--delay, 0s) infinite;
}
.cn-dot--1 { --s: 4px; --c: #ffd95a; --dur: 4.6s; --delay: -1s; right: -8px; top: 22%; }
.cn-dot--2 { --s: 5px; --c: #7fd6b8; --dur: 7.4s; --delay: -3s; left: 8%; bottom: -4px; }
.cn-dot--3 { --s: 3.5px; --c: #ffd95a; --dur: 5.8s; --delay: -2.2s; right: 20%; bottom: -8px; }

@keyframes cn-float {
  0%, 100% { translate: 18px 0; }
  50% { translate: 18px calc(var(--cn-float) * -1); }
}
@keyframes cn-glow {
  0%, 100% { opacity: 0.5; scale: 0.97; }
  50% { opacity: 0.9; scale: 1.04; }
}
@keyframes cn-em-breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.82; }
}
@keyframes cn-underline {
  0% { stroke-dashoffset: 1; opacity: 0; }
  12% { opacity: 0.85; }
  45% { stroke-dashoffset: 0; opacity: 0.85; }
  75% { stroke-dashoffset: 0; opacity: 0.85; }
  90% { stroke-dashoffset: 0; opacity: 0; }
  91%, 100% { stroke-dashoffset: 1; opacity: 0; }
}
@keyframes cn-mint {
  0%, 4% { stroke-dashoffset: 1; opacity: 0; }
  5% { opacity: 0.8; }
  28% { stroke-dashoffset: 0; opacity: 0.8; }
  66% { stroke-dashoffset: 0; opacity: 0.8; }
  78% { stroke-dashoffset: 0; opacity: 0; }
  79%, 100% { stroke-dashoffset: 1; opacity: 0; }
}
@keyframes cn-leaf {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-5deg); }
  50% { transform: translate3d(5px, -6px, 0) rotate(6deg); }
}
@keyframes cn-small {
  0%, 100% { opacity: 0.35; transform: translateY(0) rotate(0deg); }
  50% { opacity: 0.8; transform: translateY(-5px) rotate(12deg); }
}
.careers__track {
  position: relative;
  margin-top: var(--space-lg);
}
/* カードの背面を通る「広がり」の矢印ライン */
.careers__line {
  position: absolute;
  left: 2%;
  right: 2%;
  top: 70px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--color-yellow), var(--color-blue), var(--color-green), var(--color-pink), var(--color-coral));
}
.careers__line::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 50%;
  translate: 0 -50%;
  border: 12px solid transparent;
  border-left: 16px solid var(--color-coral);
  border-right: 0;
}
.careers__list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(12px, 1.6vw, 24px);
}
.careers__list > li {
  display: flex;
  /* カードのスクロール表示：下 20px から、80ms ずつ順番に（共通の v-reveal） */
  --reveal-y: 20px;
  --reveal-step: 80ms;
}
.careers__list > li > * {
  flex: 1;
}

.careers__blob-1 {
  width: 360px;
  height: 320px;
  right: -120px;
  top: -40px;
}
.careers__blob-2 {
  width: 280px;
  height: 240px;
  left: -100px;
  bottom: -40px;
}
.careers__leaf {
  width: 80px;
  left: 6%;
  top: 72px;
}

/* タブレット以下：折り返した行も中央に揃える */
@media (max-width: 1024px) {
  .careers__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    --cols: 3;
    --gap: clamp(12px, 1.6vw, 24px);
  }
  .careers__list > li {
    flex: 0 1 calc((100% - var(--gap) * (var(--cols) - 1)) / var(--cols));
  }
  .careers__line {
    display: none;
  }
}
@media (max-width: 767px) {
  .careers__list {
    --cols: 2;
  }
  /* SP：小さく中央に・動きも小さく・装飾を減らす */
  .career-note-reveal {
    --cn-float: 2.5px;
  }
  .career-note-float {
    translate: 0 0;
    rotate: -1.25deg;
  }
  @keyframes cn-float-sp {
    0%, 100% { translate: 0 0; }
    50% { translate: 0 calc(var(--cn-float) * -1); }
  }
  .career-note-float {
    animation-name: cn-float-sp;
  }
  .career-note {
    width: min(80vw, 290px);
    padding: 12px 18px 20px;
  }
  .career-note__text {
    font-size: clamp(21px, 5.4vw, 22.5px);
  }
  .cn-tri--2,
  .cn-tri--3,
  .cn-dot--3 {
    display: none;
  }
  .cn-leaf {
    width: 28px;
    left: -6px;
  }
  .careers__leaf {
    display: none;
  }
}
@media (max-width: 600px) {
  .careers__list {
    --cols: 1;
    --gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .career-note-float,
  .cn-glow,
  .career-note__em,
  .cn-underline path,
  .cn-mint path,
  .cn-leaf,
  .cn-tri,
  .cn-dot {
    animation: none !important;
  }
  .cn-underline path,
  .cn-mint path {
    stroke-dashoffset: 0;
  }
  .cn-tri,
  .cn-dot {
    opacity: 0.6;
  }
}
</style>
