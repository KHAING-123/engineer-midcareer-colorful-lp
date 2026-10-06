<script setup>
import { ref } from 'vue'
import { useHeadingReveal } from '../../composables/useHeadingReveal.js'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import SectionHeading from './SectionHeading.vue'

const { growthSection: section, growthSteps } = lpContent

// タイトル（03 / GROWTH STEP / 見出し）の Scroll Animation：左から1回だけ → 説明文 → Note → STEP カード（01・02 と共通処理）
const heading = ref(null)
const { stateClass } = useHeadingReveal(heading)
</script>

<template>
  <section id="growth" class="growth lp-section lp-section--white heading-reveal-scope" :class="stateClass" aria-labelledby="growth-title">
    <span class="lp-blob lp-blob--pink growth__blob-1" aria-hidden="true"></span>
    <span class="lp-blob lp-blob--yellow growth__blob-2" aria-hidden="true"></span>

    <div class="lp-container growth__grid">
      <div class="growth__intro">
        <SectionHeading
          ref="heading"
          id="growth-title"
          :number="section.number"
          :label="section.label"
          :title="section.title"
          :lead="section.lead"
          slide-in
        />
        <!--
          手書き風メモ「未経験から、できるを増やそう。」
          外側：スクロール表示（1回だけ） / 内側：ずっと続くループアニメーション（完全に分離）
        -->
        <div v-if="section.note" v-reveal="{ delay: 200 }" class="growth-note-wrap heading-reveal-content">
          <div class="growth-note">
            <!-- 淡いパステル背景（ゆっくり動く） -->
            <span class="growth-note__bg" aria-hidden="true"><span class="growth-note__bg-inner"></span></span>

            <!-- 左の3本線（黄・オレンジ・コーラル） -->
            <span class="growth-note__rays" aria-hidden="true">
              <span class="gn-ray gn-ray--1"></span>
              <span class="gn-ray gn-ray--2"></span>
              <span class="gn-ray gn-ray--3"></span>
            </span>

            <div class="growth-note__body">
              <p class="growth-note__text">
                <span class="growth-note__line">{{ section.note.line1 }}</span>
                <span class="growth-note__line"><em class="growth-note__em">{{ section.note.highlight }}</em>{{ section.note.line2 }}</span>
              </p>

              <!-- 右の成長グラフ：グラフと緑の光線は浮遊、赤い矢印は描画ループ（別要素） -->
              <div class="growth-note__visual" aria-hidden="true">
                <div class="gn-float">
                  <span class="gn-bar gn-bar--1"></span>
                  <span class="gn-bar gn-bar--2"></span>
                  <span class="gn-bar gn-bar--3"></span>
                  <span class="gn-glint gn-glint--1"></span>
                  <span class="gn-glint gn-glint--2"></span>
                  <span class="gn-glint gn-glint--3"></span>
                  <span class="gn-glint gn-glint--4"></span>
                </div>
                <svg class="gn-arrow gn-arrow--red" viewBox="0 0 90 56" focusable="false">
                  <path class="gn-arrow__line" pathLength="1" d="M4 50 C 30 46, 54 34, 80 10" />
                  <path class="gn-arrow__head" pathLength="1" d="M67 9 L81 9 L79 23" />
                </svg>
              </div>
            </div>

            <!-- 下を横切る青い矢印（描画ループ） -->
            <svg class="gn-arrow gn-arrow--blue" viewBox="0 0 300 44" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path class="gn-arrow__line" pathLength="1" d="M4 38 C 70 22, 128 20, 178 25 C 226 30, 262 26, 292 8" />
              <path class="gn-arrow__head" pathLength="1" d="M278 7 L293 7 L291 21" />
            </svg>
          </div>
        </div>
      </div>

      <ol class="timeline">
        <li
          v-for="(item, index) in growthSteps"
          :key="item.step"
          v-reveal="{ delay: 100, i: index }"
          class="timeline__item heading-reveal-content heading-reveal-content--card premium-icon-hover"
          :class="`accent-${item.accent || 'yellow'}`"
        >
          <div class="timeline__marker premium-icon-host">
            <span class="premium-icon-glow" aria-hidden="true"></span>
            <img class="premium-icon-float" :src="img(item.icon)" alt="" width="120" height="120" loading="lazy" :style="{ '--pi-delay': `${index * 0.4}s` }" />
          </div>
          <div class="timeline__card lp-card">
            <!-- 右上のドット・右下の淡い弧（文字より後ろ） -->
            <span class="timeline__deco" aria-hidden="true"><span class="timeline__deco-dots"></span><span class="timeline__deco-arc"></span></span>
            <div class="timeline__meta">
              <span class="timeline__step">{{ item.step }}</span>
              <span v-if="item.period" class="timeline__period">{{ item.period }}</span>
            </div>
            <!-- タイトル：下のドットラインは表示時に左 → 右へ伸びる（1回だけ） -->
            <!-- タイトルの \n は「幅が足りないときだけ改行する位置」 -->
            <h3 class="timeline__title"><template v-for="(part, i) in item.title.split('\n')" :key="i"><wbr v-if="i > 0" />{{ part }}</template></h3>
            <!-- 説明文の \n：PC / Tablet は改行、SP は改行せず自然に折り返す -->
            <p class="timeline__text"><template v-for="(part, i) in item.description.split('\n')" :key="i"><br v-if="i > 0" class="timeline__br" />{{ part }}</template></p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.growth__grid {
  display: grid;
  grid-template-columns: minmax(280px, 400px) 1fr;
  gap: clamp(40px, 6vw, 96px);
  align-items: start;
}
.growth__intro {
  position: sticky;
  /* タイトル〜説明文〜Note をまとめて少し上へ（STEP カードの位置は変えない。transform は使わない）
     通常位置は margin-top、スクロールで止まる位置は top を同じだけ上げる（元は +40px） */
  top: calc(var(--header-height) + 12px);
  margin-top: -28px;
}
/* ================= 手書き風メモ「未経験から、できるを増やそう。」 ================= */
/* 説明文の下に置き、右寄せ（PC は見出し・説明文の列の右端、1列表示ではコンテナの右端） */
.growth-note-wrap {
  --gn-float: 3.5px; /* メモ全体の上下（SPで弱める） */
  --gn-text: 2px;    /* 文字の上下 */
  --gn-vis: 3px;     /* グラフの上下 */
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 24px;
}
.growth-note {
  position: relative;
  width: min(100%, clamp(300px, 26vw, 380px));
  padding: 16px 16px 30px 36px; /* 下は青い矢印の分 */
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 32px 28px 36px 26px / 30px 34px 28px 32px;
  box-shadow: 0 10px 25px rgba(24, 58, 110, 0.07), 0 3px 10px rgba(24, 58, 110, 0.04);
  animation: gn-note-float 5s ease-in-out infinite;
}
/* パステル背景：左〜中央は淡い黄、右は淡い水色〜ミント（中の層だけがゆっくり動く） */
.growth-note__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: inherit;
  background: #fffdf8;
}
.growth-note__bg-inner {
  position: absolute;
  inset: -12%;
  background:
    radial-gradient(60% 75% at 30% 55%, rgba(255, 236, 170, 0.55), transparent 70%),
    radial-gradient(50% 70% at 82% 35%, rgba(200, 232, 250, 0.7), transparent 72%),
    radial-gradient(40% 55% at 90% 80%, rgba(205, 240, 225, 0.55), transparent 72%);
  animation: gn-bg-drift 15s ease-in-out infinite alternate;
}

/* 左の3本線：1本ずつ「パッ、パッ、パッ」と出る → 維持 → 薄くなる、を繰り返す */
.growth-note__rays {
  position: absolute;
  z-index: 3;
  left: 10px;
  top: 14px;
  width: 20px;
  height: 40px;
}
.gn-ray {
  position: absolute;
  right: 0;
  height: 4px;
  border-radius: 999px;
  transform-origin: right center;
  animation: gn-ray-loop 5s ease-out calc(0.3s + var(--d, 0s)) infinite both;
}
.gn-ray--1 { --d: 0s;   width: 15px; top: 0;    background: #ffd95a; rotate: 52deg; }
.gn-ray--2 { --d: 0.2s; width: 18px; top: 15px; background: #f7b27a; rotate: 22deg; }
.gn-ray--3 { --d: 0.4s; width: 16px; top: 30px; background: #f58a80; rotate: -14deg; }

.growth-note__body {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

/* 文字：丸みのある太字。「できる」だけコーラル */
.growth-note__text {
  flex: 1;
  min-width: 0;
  color: var(--color-navy);
  font-family: var(--font-heading);
  font-size: clamp(20px, 1.65vw, 27px);
  font-weight: 900;
  letter-spacing: 0.01em;
  line-height: 1.35;
  animation: gn-text-float 4.2s ease-in-out infinite;
}
.growth-note__line {
  display: block;
  white-space: nowrap;
}
.growth-note__em {
  display: inline-block;
  font-style: normal;
  color: #f0616a;
  font-size: 1.1em;
  rotate: -1deg;
}

/* 右の成長グラフ */
.growth-note__visual {
  position: relative;
  flex-shrink: 0;
  width: 66px;
  height: 50px;
  margin-top: 2px;
}
.gn-float {
  position: absolute;
  inset: 0;
  transform-origin: 50% 100%;
  animation: gn-visual-float 5.6s ease-in-out -1s infinite;
}
.gn-bar {
  position: absolute;
  bottom: 3px;
  width: 11px;
  border-radius: 3px 3px 2px 2px;
  transform-origin: 50% 100%;
  animation: gn-bar-grow 4s ease-in-out var(--d, 0s) infinite;
}
.gn-bar--1 { --d: 0s;   left: 14px; height: 11px; background: #b7bfcd; }
.gn-bar--2 { --d: 0.2s; left: 30px; height: 20px; background: #8fbdf0; }
.gn-bar--3 { --d: 0.4s; left: 46px; height: 31px; background: #f7b5bd; }
/* 緑の光線 */
.gn-glint {
  position: absolute;
  width: 8px;
  height: 2.5px;
  border-radius: 999px;
  background: #7fd6b8;
  animation: gn-glint 3.2s ease-in-out var(--d, 0s) infinite;
}
.gn-glint--1 { --d: 0s;   left: 0;     top: 10px; rotate: 30deg; }
.gn-glint--2 { --d: 0.5s; left: 5px;   top: 0;    rotate: 70deg; width: 6px; }
.gn-glint--3 { --d: 1s;   right: -9px;  top: 14px; rotate: -40deg; }
.gn-glint--4 { --d: 1.5s; right: -11px; top: 25px; rotate: -10deg; width: 6px; }

/* 矢印（SVG）：左→右へ描く → 維持 → 消える → 待つ、を繰り返す */
.gn-arrow {
  position: absolute;
  z-index: 3;
  overflow: visible;
  pointer-events: none;
}
.gn-arrow path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}
.gn-arrow--red {
  left: -3px;
  top: -11px;
  width: 70px;
  height: 44px;
}
.gn-arrow--red path {
  stroke: #f0717a;
  stroke-width: 2.5;
}
.gn-arrow--red .gn-arrow__line { animation: gn-draw-line 6.5s ease-in-out infinite both; }
.gn-arrow--red .gn-arrow__head { animation: gn-draw-head 6.5s ease-in-out infinite both; }
.gn-arrow--blue {
  left: 16%;
  right: 5%;
  bottom: 6px;
  width: auto;
  height: 24px;
}
.gn-arrow--blue path {
  stroke: #6fc2ef;
  stroke-width: 3;
  opacity: 0.85;
}
.gn-arrow--blue .gn-arrow__line { animation: gn-draw-line 7.2s ease-in-out 0.8s infinite both; }
.gn-arrow--blue .gn-arrow__head { animation: gn-draw-head 7.2s ease-in-out 0.8s infinite both; }

@keyframes gn-note-float {
  0%, 100% { transform: translate3d(0, 0, 0); box-shadow: 0 10px 25px rgba(24, 58, 110, 0.07), 0 3px 10px rgba(24, 58, 110, 0.04); }
  50% { transform: translate3d(0, calc(var(--gn-float) * -1), 0); box-shadow: 0 18px 38px rgba(24, 58, 110, 0.1), 0 5px 14px rgba(24, 58, 110, 0.05); }
}
@keyframes gn-bg-drift {
  from { transform: translate3d(-2%, 0, 0); }
  to { transform: translate3d(2%, -1%, 0); }
}
@keyframes gn-text-float {
  0%, 100% { translate: 0 0; rotate: 0deg; }
  50% { translate: 0 calc(var(--gn-text) * -1); rotate: -0.3deg; }
}
@keyframes gn-visual-float {
  0%, 100% { translate: 0 0; rotate: 0deg; }
  50% { translate: 0 calc(var(--gn-vis) * -1); rotate: 1deg; }
}
@keyframes gn-ray-loop {
  0% { opacity: 0; scale: 0.4; translate: -3px 0; }
  8% { opacity: 1; scale: 1; translate: 0 0; }
  62% { opacity: 1; scale: 1; translate: 0 0; }
  78%, 100% { opacity: 0.12; scale: 0.9; translate: 0 0; }
}
@keyframes gn-bar-grow {
  0%, 100% { scale: 1 0.85; }
  40% { scale: 1 1; }
  70% { scale: 1 0.92; }
}
@keyframes gn-glint {
  0%, 100% { opacity: 0.35; scale: 0.9; }
  50% { opacity: 1; scale: 1.08; }
}
/* 線：0〜5% なし → 5〜25% 描く → 25〜65% 維持 → 65〜75% 消える → 待機 */
@keyframes gn-draw-line {
  0%, 5% { stroke-dashoffset: 1; opacity: 0; }
  6% { opacity: 1; }
  25% { stroke-dashoffset: 0; opacity: 1; }
  65% { stroke-dashoffset: 0; opacity: 1; }
  75% { stroke-dashoffset: 0; opacity: 0; }
  76%, 100% { stroke-dashoffset: 1; opacity: 0; }
}
/* 矢じり：線を描き終わる直前から描く */
@keyframes gn-draw-head {
  0%, 22% { stroke-dashoffset: 1; opacity: 0; }
  23% { opacity: 1; }
  30% { stroke-dashoffset: 0; opacity: 1; }
  65% { stroke-dashoffset: 0; opacity: 1; }
  75% { stroke-dashoffset: 0; opacity: 0; }
  76%, 100% { stroke-dashoffset: 1; opacity: 0; }
}

/* ---- タイムライン ---- */
.timeline {
  position: relative;
  display: grid;
  gap: 28px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 43px;
  top: 40px;
  bottom: 40px;
  border-left: 3px dashed var(--color-coral);
  opacity: 0.45;
}
.timeline__item {
  /* STEP ごとのテーマ色（左の線・矢印・アイコンの輪・ドットライン・カードの淡い色） */
  --step-color: #f5c84c;
  --step-tint: rgba(255, 248, 220, 0.72);
  /* 浮遊の強さ（SPで弱める） */
  --card-float: 5px;
  --icon-float: 2.5px;
  position: relative;
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 24px;
  align-items: center;
}
.timeline__marker {
  position: relative;
  z-index: 1;
  width: 88px;
  height: 88px;
  padding: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, var(--accent-pale) 72%);
  border: 3px solid var(--step-color);
  outline: 2px solid color-mix(in srgb, var(--step-color) 28%, transparent); /* 二重の輪 */
  outline-offset: 4px;
  box-shadow: 0 6px 16px rgba(31, 55, 95, 0.07);
  /* カードより少し遅れて、小さく浮いて脈打つ */
  animation: step-icon-pulse var(--icon-dur, 4.8s) ease-in-out var(--icon-delay, 0.5s) infinite;
}
.timeline__marker {
  --pi-color: var(--step-color);
  --pi-y: -3px; /* 丸自体もゆっくり脈打つので、画像は小さめに */
  --pi-y-sp: -2px;
}
.timeline__marker img {
  width: 100%;
  height: 100%;
}
.timeline__card {
  padding: 24px 30px 26px;
  border: 1px solid color-mix(in srgb, var(--step-color) 22%, transparent);
  border-left: 5px solid var(--step-color);
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 30%, var(--step-tint));
  /* 常時の影（静的）：ネイビー系＋各カードのアクセント色をごく薄く */
  box-shadow:
    0 18px 40px rgba(32, 52, 90, 0.08),
    0 6px 16px rgba(32, 52, 90, 0.06),
    0 14px 30px -12px color-mix(in srgb, var(--step-color) 40%, transparent);
  /* 常時の浮遊は個別プロパティ translate、hover は transform（競合しない） */
  animation: step-card-float var(--card-dur, 5.4s) ease-in-out var(--card-delay, 0s) infinite;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.35s ease;
}
/* 浮いたときに広がる影（濃さだけを浮遊と同じ周期で変える） */
.timeline__card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 18px 38px rgba(32, 56, 100, 0.1), 0 6px 16px rgba(32, 56, 100, 0.05);
  opacity: 0;
  pointer-events: none;
  animation: step-card-shadow var(--card-dur, 5.4s) ease-in-out var(--card-delay, 0s) infinite;
}
.timeline__item.accent-pink { --step-color: #ff9aaf; --step-tint: rgba(255, 234, 240, 0.72); }
.timeline__item.accent-blue { --step-color: #78b9f7; --step-tint: rgba(230, 242, 255, 0.75); }
.timeline__item.accent-green { --step-color: #78d69a; --step-tint: rgba(228, 248, 236, 0.75); }
/* 上から下へ動きが伝わるように、周期と開始を少しずつずらす */
/* アイコンはカードと同じ周期で、常に 0.8 秒遅れて動く */
.timeline__item:nth-child(1) { --card-dur: 5.2s; --card-delay: 0s;   --icon-dur: 5.2s; --icon-delay: 0.8s; }
.timeline__item:nth-child(2) { --card-dur: 5.8s; --card-delay: 0.6s; --icon-dur: 5.8s; --icon-delay: 1.4s; }
.timeline__item:nth-child(3) { --card-dur: 5.4s; --card-delay: 1.2s; --icon-dur: 5.4s; --icon-delay: 2s; }
.timeline__item:nth-child(4) { --card-dur: 6s;   --card-delay: 1.8s; --icon-dur: 6s;   --icon-delay: 2.6s; }

/* PC（マウス操作）の hover：さらに少し持ち上がり、影が強くなる */
@media (hover: hover) and (pointer: fine) {
  .timeline__card:hover {
    transform: translateY(-5px);
    box-shadow:
      0 24px 48px rgba(32, 52, 90, 0.1),
      0 8px 20px rgba(32, 52, 90, 0.07),
      0 18px 34px -12px color-mix(in srgb, var(--step-color) 50%, transparent);
  }
}

@keyframes step-card-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 calc(var(--card-float) * -1); }
}
@keyframes step-card-shadow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
@keyframes step-icon-pulse {
  0%, 100% { translate: 0 0; scale: 1; box-shadow: 0 6px 16px rgba(31, 55, 95, 0.07); }
  50% { translate: 0 calc(var(--icon-float) * -1); scale: 1.035; box-shadow: 0 9px 20px rgba(31, 55, 95, 0.1); }
}
.timeline__card::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 50%;
  translate: 0 -50%;
  border: 9px solid transparent;
  border-right-color: var(--step-color);
  border-left: 0;
}
.timeline__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.timeline__step {
  position: relative;
  color: #f36f61;
  font-family: var(--font-number);
  font-weight: 700;
  text-transform: uppercase;
  font-size: var(--fs-md);
  letter-spacing: 0.08em;
}
.timeline__period {
  position: relative;
  padding: 3px 14px;
  border-radius: var(--radius-pill);
  background: var(--accent-pale);
  color: var(--color-navy);
  font-size: var(--fs-xs);
  font-weight: 700;
}
.timeline__title {
  position: relative;
  display: inline-block;
  margin-top: 6px;
  padding-bottom: 12px;
  color: var(--color-navy);
  font-size: var(--fs-lg);
  font-weight: 900;
  word-break: keep-all; /* \n（<wbr>）の位置でだけ改行する */
  overflow-wrap: anywhere;
}
/* タイトル下の丸いドットのライン（STEP の色） */
.timeline__title::after {
  content: '';
  position: absolute;
  left: 2px;
  right: 0;
  bottom: 0;
  height: 5px;
  background: radial-gradient(circle, var(--step-color) 2.2px, transparent 2.6px) 0 50% / 10px 5px repeat-x;
  /* 繰り返し：左 → 右へ表示 → 少し止まる → ふわっと消える（ドットの形はそのまま、見える範囲だけを変える） */
  clip-path: inset(0 100% 0 0);
  animation: step-dot-loop 3.6s ease-in-out var(--dot-delay, 0s) infinite;
}
.timeline__item:nth-child(2) .timeline__title::after { --dot-delay: 0.25s; }
.timeline__item:nth-child(3) .timeline__title::after { --dot-delay: 0.5s; }
.timeline__item:nth-child(4) .timeline__title::after { --dot-delay: 0.75s; }
@keyframes step-dot-loop {
  0% { clip-path: inset(0 100% 0 0); opacity: 0; }
  8% { opacity: 1; }
  38% { clip-path: inset(0 0 0 0); opacity: 1; }
  72% { clip-path: inset(0 0 0 0); opacity: 1; }
  88% { clip-path: inset(0 0 0 0); opacity: 0; }
  100% { clip-path: inset(0 100% 0 0); opacity: 0; }
}
.timeline__text {
  position: relative;
  margin-top: 10px;
  text-wrap: pretty; /* 最後の行が1〜2文字だけにならないように */
  font-size: var(--fs-sm);
  line-height: 1.85;
}

/* カード内の装飾：右上のドット・右下の淡い弧（カードの角丸の中だけ） */
.timeline__deco {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}
.timeline__deco-dots {
  position: absolute;
  top: 22px;
  right: 26px;
  width: 92px;
  height: 66px;
  background: radial-gradient(circle, var(--step-color) 2.2px, transparent 2.8px) 0 0 / 23px 22px;
  opacity: 0.22;
}
.timeline__deco-arc {
  position: absolute;
  right: -60px;
  bottom: -110px;
  width: 260px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, transparent 52%, color-mix(in srgb, var(--step-color) 22%, transparent) 53%, color-mix(in srgb, var(--step-color) 12%, transparent) 70%, transparent 71%);
  opacity: 0.5;
}

/* ================= スクロール表示（1回だけ）：カード → タイトル（+150ms）。ドットラインは常に繰り返し ================= */
.timeline__item {
  --step-base: calc(var(--reveal-base, 0ms) * var(--reveal-base-scale) + var(--reveal-i, 0) * var(--reveal-step) + var(--hr-seq, 0ms));
}
:global(.reveal-ready .growth .timeline__item.reveal) {
  transform: translate3d(0, 24px, 0) scale(0.985);
  transition:
    opacity 0.8s ease,
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--step-base);
}
:global(.reveal-ready .growth.is-content-ready .timeline__item.reveal.is-revealed) {
  transform: none;
}
:global(.reveal-ready .growth .timeline__item .timeline__title) {
  opacity: 0;
  translate: 0 8px;
  transition:
    opacity 0.6s ease,
    translate 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--step-base) + 150ms);
}
:global(.reveal-ready .growth.is-content-ready .timeline__item.is-revealed .timeline__title) {
  opacity: 1;
  translate: 0 0;
}

.growth__blob-1 {
  width: 420px;
  height: 380px;
  left: -160px;
  bottom: -60px;
}
.growth__blob-2 {
  width: 300px;
  height: 260px;
  right: -80px;
  top: 80px;
}

@media (max-width: 960px) {
  .growth__grid {
    grid-template-columns: 1fr;
  }
  .growth__intro {
    position: static;
  }
}
@media (max-width: 767px) {
  .growth__intro {
    margin-top: -15px;
  }
  /* SP：動きを約25%小さく */
  .timeline__item {
    --card-float: 3.5px;
    --icon-float: 1.5px;
  }
  .timeline__card {
    box-shadow:
      0 8px 22px rgba(32, 56, 100, 0.06),
      0 2px 8px rgba(32, 56, 100, 0.035),
      0 12px 24px -10px color-mix(in srgb, var(--accent) 35%, transparent);
  }
  .growth-note-wrap {
    --gn-float: 3px;
    --gn-text: 1.5px;
    --gn-vis: 2.5px;
  }
}
@media (max-width: 600px) {
  /* SP：中央寄せの小さな補足メッセージ */
  .growth-note-wrap {
    justify-content: center;
  }
  .growth-note {
    width: 92%;
    max-width: 330px;
    padding: 14px 12px 28px 32px;
  }
  .growth-note__rays {
    left: 8px;
  }
  .growth-note__text {
    font-size: clamp(18px, 5vw, 20px);
  }
  .timeline::before {
    left: 31px;
  }
  .timeline__item {
    grid-template-columns: 64px 1fr;
    gap: 16px;
    align-items: start;
  }
  .timeline__marker {
    width: 64px;
    height: 64px;
    padding: 4px;
  }
  .timeline__card {
    padding: 18px 18px 20px;
    border-radius: 22px;
  }
  .timeline__br {
    display: none;
  }
  .timeline__title {
    font-size: 1.125rem;
  }
  .timeline__deco-dots {
    top: 14px;
    right: 14px;
    width: 46px;
    height: 44px;
  }
  .timeline__marker {
    outline-offset: 3px;
  }
  .timeline__card::before {
    top: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .growth-note,
  .growth-note__bg-inner,
  .gn-ray,
  .growth-note__text,
  .gn-float,
  .gn-bar,
  .gn-glint,
  .gn-arrow path,
  .timeline__card,
  .timeline__card::after,
  .timeline__marker {
    animation: none !important;
  }
  .timeline__card {
    transition: none;
  }
  .timeline__card:hover {
    transform: none;
  }
  :global(.reveal-ready .growth .timeline__item.reveal) {
    transform: none;
  }
  :global(.reveal-ready .growth .timeline__item .timeline__title) {
    opacity: 1;
    translate: none;
  }
  .timeline__title::after {
    animation: none;
    clip-path: none;
    opacity: 1;
  }
  .gn-ray,
  .gn-glint {
    opacity: 1;
  }
  .gn-arrow path {
    stroke-dashoffset: 0;
  }
}
</style>
