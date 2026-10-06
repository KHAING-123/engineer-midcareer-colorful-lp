<script setup>
import { ref } from 'vue'
import { useHeadingReveal } from '../../composables/useHeadingReveal.js'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import SectionHeading from './SectionHeading.vue'

const { selectionSection: section, selectionFlow } = lpContent

// タイトル（07 / FLOW / 見出し）の Scroll Animation：左から1回だけ → その後に既存コンテンツ（01〜03 と共通処理）
const heading = ref(null)
const { stateClass } = useHeadingReveal(heading)

const stepNumber = (index) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section id="selection" class="selection lp-section heading-reveal-scope" :class="stateClass" aria-labelledby="selection-title">
    <!-- 背景装飾（淡いブロブ・ドット・小さな丸。ゆっくり動く） -->
    <span class="lp-blob lp-blob--yellow selection__blob" aria-hidden="true"></span>
    <span class="lp-blob lp-blob--pink selection__blob-pink" aria-hidden="true"></span>
    <span class="lp-blob lp-blob--blue selection__blob-blue" aria-hidden="true"></span>
    <span class="selection__bubble" aria-hidden="true"></span>
    <img class="lp-deco selection__dots" :src="img('common/deco-dots.svg')" alt="" aria-hidden="true" />
    <img class="lp-deco selection__sparkle" :src="img('common/deco-sparkle.svg')" alt="" aria-hidden="true" />

    <div class="lp-container">
      <!-- 見出し：05 と同じ共通の中央揃え見出し -->
      <SectionHeading
        ref="heading"
        id="selection-title"
        :number="section.number"
        :label="section.label"
        :title="section.title"
        :lead="section.lead"
        align="center"
        slide-in
      />

      <!--
        5STEP（PC：横一列 / Tablet：3列＋2列 / SP：縦）
        レイヤーの分担（transform が競合しないように分離）
          li.flow-process__step       … スクロール表示（1回だけ）
          .flow-process__float        … 常時のゆっくりした浮遊
          .flow-process__circle       … hover（PCのみ）
          .flow-process__icon-wrap    … アイコンの hover（ごく小さい拡大）
          .flow-process__icon         … アイコンの浮遊
          .flow-process__arrow-wrap   … 矢印のスクロール表示
          .flow-process__arrow        … 矢印のループ（右へ流れる / SPは下へ）
      -->
      <ol class="flow-process">
        <li
          v-for="(item, index) in selectionFlow"
          :key="item.title"
          v-reveal="{ variant: 'fade' }"
          class="flow-process__step heading-reveal-content"
          :class="`flow-process__step--${item.circle || 'blue'}`"
          :style="{ '--i': index }"
        >
          <div class="flow-process__float">
            <div class="flow-process__circle">
              <span class="flow-process__number" aria-hidden="true">{{ stepNumber(index) }}</span>
              <span class="flow-process__icon-wrap">
                <img class="flow-process__icon" :src="img(item.icon)" alt="" width="120" height="120" loading="lazy" />
              </span>
            </div>
            <h3 class="flow-process__name"><span class="visually-hidden">STEP {{ stepNumber(index) }} </span>{{ item.title }}</h3>
            <p v-if="item.duration" class="flow-process__time">（{{ item.duration }}）</p>
          </div>

          <!-- 内定の下：最短1週間でご連絡！ -->
          <p v-if="item.note" class="flow-process__result-note">
            <span class="flow-process__spark flow-process__spark--l" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="pre-line">{{ item.note }}</span>
            <span class="flow-process__spark flow-process__spark--r" aria-hidden="true"><i></i><i></i><i></i></span>
          </p>

          <!-- 次の STEP への矢印（› › ›：右へ流れる。SPでは下向き） -->
          <span v-if="index < selectionFlow.length - 1" class="flow-process__arrow-wrap" aria-hidden="true">
            <span class="flow-process__arrow"><i></i><i></i><i></i></span>
          </span>
        </li>
      </ol>

      <p v-if="section.note" class="selection__note">{{ section.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.selection {
  background: linear-gradient(180deg, #fffdf7 0%, var(--color-cream) 100%);
}

/* ================= STEP のテーマカラー ================= */
.flow-process__step--blue {
  --fp-bg: #ddf3ff;     /* 丸の色 */
  --fp-glow: rgba(140, 205, 245, 0.35);
  --fp-num: #3a9be0;    /* 番号 */
  --fp-pill: #e2f3ff;   /* STEP名の背景 */
}
.flow-process__step--yellow {
  --fp-bg: #fff2b8;
  --fp-glow: rgba(255, 214, 90, 0.35);
  --fp-num: #e6a417;
  --fp-pill: #fff3c8;
}
.flow-process__step--sky {
  --fp-bg: #ddf1ff;
  --fp-glow: rgba(120, 190, 245, 0.35);
  --fp-num: #2f86d6;
  --fp-pill: #e0efff;
}
.flow-process__step--lavender {
  --fp-bg: #ede5ff;
  --fp-glow: rgba(175, 150, 240, 0.35);
  --fp-num: #8a6bdc;
  --fp-pill: #eee8ff;
}
.flow-process__step--pink {
  --fp-bg: #ffe5ea;
  --fp-glow: rgba(255, 160, 180, 0.35);
  --fp-num: #ec6b80;
  --fp-pill: #ffe4ea;
}
.flow-process__step--green {
  --fp-bg: #e1f7ea;
  --fp-glow: rgba(120, 215, 165, 0.35);
  --fp-num: #3fb67a;
  --fp-pill: #e2f6ea;
}

/* ================= レイアウト（PC：5STEP 横一列・中央） ================= */
.flow-process {
  --step-w: clamp(150px, 12vw, 210px);
  --circle: clamp(150px, 11vw, 205px);
  --gap: clamp(32px, 4vw, 64px);
  --float-y: 7px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: var(--gap);
  margin-top: clamp(40px, 4vw, 60px);
}
.flow-process__step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: none;
  width: var(--step-w);
  text-align: center;
}

/* ---------- 浮遊（STEP全体） ---------- */
.flow-process__float {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: flow-card-float 7s ease-in-out calc(var(--i, 0) * 0.35s) infinite;
}
@keyframes flow-card-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(var(--float-y) * -1)); }
}

/* ---------- 丸 ---------- */
.flow-process__circle {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--circle);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, #ffffff 0%, var(--fp-bg) 68%);
  box-shadow:
    0 12px 28px rgba(40, 60, 100, 0.07),
    0 4px 12px rgba(40, 60, 100, 0.04),
    0 0 26px var(--fp-glow),
    inset 0 0 0 6px rgba(255, 255, 255, 0.65);
  transition:
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
/* 浮いた時だけ少し広がる影（浮遊と同じ周期） */
.flow-process__circle::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 50%;
  box-shadow: 0 22px 42px rgba(40, 60, 100, 0.11);
  opacity: 0;
  animation: flow-card-shadow 7s ease-in-out calc(var(--i, 0) * 0.35s) infinite;
  pointer-events: none;
}
@keyframes flow-card-shadow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
.flow-process__number {
  position: absolute;
  top: 9%;
  left: 0;
  right: 0;
  color: var(--fp-num);
  font-family: var(--font-number);
  font-size: clamp(1.375rem, 0.9rem + 0.9vw, 2rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
}
.flow-process__icon-wrap {
  display: block;
  width: 62%;
  margin-top: 20%;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.flow-process__icon {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  animation: flow-icon-float 5.5s ease-in-out calc(var(--i, 0) * -1.1s) infinite;
}
@keyframes flow-icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* ---------- STEP名・日数 ---------- */
.flow-process__name {
  margin-top: 16px;
  padding: 8px 18px;
  border-radius: 999px;
  background: var(--fp-pill);
  color: var(--color-navy);
  font-size: clamp(0.9375rem, 0.75rem + 0.45vw, 1.1875rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.4;
  white-space: nowrap;
}
.flow-process__time {
  margin-top: 8px;
  color: var(--color-navy);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
}

/* ---------- 最短1週間でご連絡！ ---------- */
.flow-process__result-note {
  position: relative;
  margin-top: 16px;
  padding: 14px 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffe45f, #ffc933);
  color: var(--color-navy);
  font-size: clamp(0.875rem, 0.75rem + 0.3vw, 1.0625rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.5;
  white-space: nowrap;
  box-shadow: 0 12px 28px rgba(255, 193, 7, 0.2);
  animation: flow-result-float 6s ease-in-out infinite;
}
@keyframes flow-result-float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
}
/* 左右の小さな線（スパーク） */
.flow-process__spark {
  position: absolute;
  top: -14px;
  width: 26px;
  height: 26px;
  pointer-events: none;
}
.flow-process__spark--l {
  left: -18px;
}
.flow-process__spark--r {
  right: -18px;
  scale: -1 1;
}
.flow-process__spark i {
  position: absolute;
  width: 3px;
  height: 12px;
  border-radius: 2px;
  background: #ffc21f;
  transform-origin: 50% 100%;
  animation: flow-spark 2.4s ease-in-out infinite;
}
.flow-process__spark i:nth-child(1) { left: 2px; top: 10px; rotate: -60deg; }
.flow-process__spark i:nth-child(2) { left: 10px; top: 2px; rotate: -25deg; animation-delay: 0.2s; }
.flow-process__spark i:nth-child(3) { left: 20px; top: 4px; rotate: 10deg; animation-delay: 0.4s; }
@keyframes flow-spark {
  0%, 100% { scale: 0; opacity: 0; }
  40%, 60% { scale: 1; opacity: 1; }
}

/* ---------- 矢印（› › ›：丸の中心の高さ・STEP 間の中央） ---------- */
.flow-process__arrow-wrap {
  position: absolute;
  top: calc(var(--circle) / 2);
  left: 100%;
  width: var(--gap);
  height: 20px;
  margin-top: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.flow-process__arrow {
  --arrow-from: -4px;
  --arrow-to: 11px;
  display: flex;
  gap: 1px;
  animation: flow-arrow-move 1.8s ease-in-out calc(var(--i, 0) * 0.25s) infinite;
}
.flow-process__arrow i {
  width: 9px;
  height: 9px;
  border-top: 2.5px solid #ff8064;
  border-right: 2.5px solid #ff8064;
  border-radius: 1px;
  transform: rotate(45deg);
}
.flow-process__arrow i:nth-child(1) { opacity: 0.3; }
.flow-process__arrow i:nth-child(2) { opacity: 0.6; }
@keyframes flow-arrow-move {
  0% { transform: translateX(var(--arrow-from)); opacity: 0.35; }
  35% { opacity: 1; }
  70% { transform: translateX(calc(var(--arrow-to) * 0.64)); opacity: 1; }
  100% { transform: translateX(var(--arrow-to)); opacity: 0; }
}

/* ---------- PC（マウス操作）：hover で丸が少し浮く ---------- */
@media (hover: hover) and (pointer: fine) {
  .flow-process__step:hover .flow-process__circle {
    transform: translateY(-8px) scale(1.025);
    box-shadow:
      0 20px 40px rgba(40, 60, 100, 0.11),
      0 6px 14px rgba(40, 60, 100, 0.05),
      0 0 30px var(--fp-glow),
      inset 0 0 0 6px rgba(255, 255, 255, 0.65);
  }
  .flow-process__step:hover .flow-process__icon-wrap {
    transform: scale(1.04);
  }
}

/* ================= スクロール表示（1回だけ）：STEP 01 → 矢印 → STEP 02 → … ================= */
:global(.reveal-ready .selection .flow-process__step.reveal) {
  transform: translate3d(0, 24px, 0);
  transition:
    opacity 0.7s ease,
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(150ms + var(--i, 0) * 180ms);
}
:global(.reveal-ready .selection.is-content-ready .flow-process__step.reveal.is-revealed) {
  transform: none;
}
:global(.reveal-ready .selection .flow-process__step.reveal .flow-process__arrow-wrap) {
  opacity: 0;
  translate: -6px 0;
  transition:
    opacity 0.5s ease,
    translate 0.5s ease;
  transition-delay: calc(250ms + var(--i, 0) * 180ms); /* STEP の 100ms 後 */
}
:global(.reveal-ready .selection.is-content-ready .flow-process__step.is-revealed .flow-process__arrow-wrap) {
  opacity: 1;
  translate: 0 0;
}

.selection__note {
  margin-top: clamp(32px, 3.5vw, 48px);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  text-align: center;
}

/* ================= 背景装飾（ゆっくり動く） ================= */
.selection__blob {
  width: 380px;
  height: 320px;
  left: -140px;
  top: -80px;
  animation: selection-drift-a 13s ease-in-out infinite;
}
.selection__blob-pink {
  width: 260px;
  height: 220px;
  right: -90px;
  top: 40px;
  opacity: 0.8;
  animation: selection-drift-b 15s ease-in-out infinite;
}
.selection__blob-blue {
  width: 300px;
  height: 240px;
  right: 18%;
  bottom: -150px;
  opacity: 0.55;
  animation: selection-drift-a 14s ease-in-out -5s infinite;
}
.selection__bubble {
  position: absolute;
  z-index: 0;
  left: 8%;
  bottom: 22%;
  width: 18px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color-yellow-pale);
  opacity: 0.9;
  pointer-events: none;
  animation: selection-drift-b 10s ease-in-out -3s infinite;
}
.selection__dots {
  width: 70px;
  left: 4%;
  bottom: 12%;
  opacity: 0.45;
  animation: selection-drift-b 12s ease-in-out -6s infinite;
}
.selection__sparkle {
  width: 36px;
  right: 10%;
  top: 56px;
  opacity: 0.7;
}
@keyframes selection-drift-a {
  0%, 100% { translate: 0 0; rotate: 0deg; }
  50% { translate: 5px -8px; rotate: 3deg; }
}
@keyframes selection-drift-b {
  0%, 100% { translate: 0 0; rotate: 0deg; }
  50% { translate: -4px 6px; rotate: -2deg; }
}

/* ================= Tablet：3列＋2列（行の最後の矢印は非表示） ================= */
@media (max-width: 1024px) {
  .flow-process {
    --step-w: 180px;
    --circle: 150px;
    --gap: clamp(36px, 6vw, 56px);
    flex-wrap: wrap;
    row-gap: 40px;
    max-width: calc(var(--step-w) * 3 + var(--gap) * 2);
    margin-inline: auto;
  }
  .flow-process__step:nth-child(3) .flow-process__arrow-wrap {
    display: none;
  }
}

/* ================= SP：縦一列（矢印は下向き ⌄） ================= */
@media (max-width: 767px) {
  .flow-process {
    --step-w: 100%;
    --circle: clamp(135px, 38vw, 155px);
    --float-y: 3px;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0;
    max-width: none;
  }
  .flow-process__step {
    width: 100%;
  }
  .flow-process__name {
    font-size: 1.0625rem;
  }
  .flow-process__arrow-wrap,
  .flow-process__step:nth-child(3) .flow-process__arrow-wrap {
    position: static;
    display: flex;
    width: 40px;
    height: 52px;
    margin: 6px 0 4px;
  }
  /* 矢印の向きを下へ（ループの translateX も下方向になる） */
  .flow-process__arrow {
    --arrow-from: -3px;
    --arrow-to: 8px;
    rotate: 90deg;
  }
  :global(.reveal-ready .selection .flow-process__step.reveal .flow-process__arrow-wrap) {
    translate: 0 -6px;
  }
  .flow-process__result-note {
    font-size: 0.9375rem;
  }
}

/* 動きを減らす設定：ループ・hover を止め、スクロール表示は移動なし */
@media (prefers-reduced-motion: reduce) {
  .flow-process__float,
  .flow-process__circle::after,
  .flow-process__icon,
  .flow-process__arrow,
  .flow-process__result-note,
  .flow-process__spark i,
  .selection__blob,
  .selection__blob-pink,
  .selection__blob-blue,
  .selection__bubble,
  .selection__dots {
    animation: none;
  }
  .flow-process__spark i {
    scale: 1;
    opacity: 1;
  }
  .flow-process__circle,
  .flow-process__icon-wrap {
    transition: none;
  }
  .flow-process__step:hover .flow-process__circle,
  .flow-process__step:hover .flow-process__icon-wrap {
    transform: none;
  }
  :global(.reveal-ready .selection .flow-process__step.reveal),
  :global(.reveal-ready .selection .flow-process__step.reveal .flow-process__arrow-wrap) {
    transform: none;
    translate: none;
  }
  :global(.reveal-ready .selection .flow-process__step.reveal .flow-process__arrow-wrap) {
    opacity: 1;
  }
}
</style>
