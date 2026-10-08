<script setup>
/**
 * オープニングの「紙」に印刷されている内容（ロゴ・英文・背景装飾）
 *  OpeningScreen.vue が紙の左右2枚（曲がる位置で分割）に同じものを1つずつ置きます。
 *  2枚は同時に表示されるので、アニメーションも常に同じ位置で揃います。
 *
 *  playing：文字・ロゴの表示アニメーションを開始
 *  still  ：紙がめくれている間は装飾の動きを止める（めくれる紙を軽くするため）
 *  表示タイミングは親が CSS 変数（--op-logo-delay など）で渡します。
 */
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import PreaiLogo from './PreaiLogo.vue'

defineProps({
  playing: { type: Boolean, default: false },
  still: { type: Boolean, default: false },
})

const { opening, site } = lpContent

// 英文を 行 → 単語 → 文字 に分け、全体の通し番号（表示順）を付ける
let n = 0
const lines = opening.lines.map((line) =>
  line.split(' ').map((word) => [...word].map((ch) => ({ ch, i: n++ }))),
)
</script>

<template>
  <div class="op-sheet" :class="{ 'is-playing': playing, 'is-still': still }">
    <!-- 背景：淡いブロブ・ドット・葉っぱ・光 -->
    <div class="op-sheet__decor">
      <span class="op-blob op-blob--yellow"></span>
      <span class="op-blob op-blob--mint"></span>
      <span class="op-blob op-blob--blue"></span>
      <span class="op-blob op-blob--pink"></span>
      <img class="op-dots op-dots--1" :src="img('common/deco-dots.svg')" alt="" />
      <img class="op-dots op-dots--2" :src="img('common/deco-dots.svg')" alt="" />
      <img class="op-leaf op-leaf--1" :src="img('common/deco-leaf-pair.svg')" alt="" />
      <img class="op-leaf op-leaf--2" :src="img('common/deco-leaf.svg')" alt="" />
      <img class="op-leaf op-leaf--3" :src="img('common/deco-leaf.svg')" alt="" />
      <span class="op-sweep"></span>
    </div>

    <div class="op-sheet__content">
      <div class="op-logo">
        <PreaiLogo :label="site.logoAlt" />
      </div>

      <!-- 2つの文を1行に並べる（画面がとても狭いときだけ、文の切れ目で折り返す） -->
      <p class="op-title">
        <template v-for="(words, li) in lines" :key="li">
          <span class="op-title__line">
            <template v-for="(word, wi) in words" :key="wi">
              <span class="op-title__word"><span
                  v-for="c in word"
                  :key="c.i"
                  class="op-char"
                  :style="{ '--ci': c.i }"
                >{{ c.ch }}</span></span>{{ wi < words.length - 1 ? ' ' : '' }}
            </template>
          </span>{{ li < lines.length - 1 ? ' ' : '' }}
        </template>
      </p>

      <div class="op-sub">
        <span class="op-sub__rule"></span>
        <p class="op-sub__words">
          <template v-for="(k, ki) in opening.keywords" :key="k.label">
            <span v-if="ki > 0" class="op-sub__x">×</span>
            <span class="op-sub__word" :class="`op-sub__word--${k.accent}`">{{ k.label }}</span>
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.op-sheet {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 50% 45%, #fffcf6 0%, #fff9f0 55%, #fff5e5 100%);
  color: #172b58;
}

/* ---------- 表示前は最初の状態で止めておく／めくれる間は装飾を止める ---------- */
.op-sheet:not(.is-playing) .op-sheet__content *,
.op-sheet:not(.is-playing) .op-sweep,
.op-sheet.is-still .op-sheet__decor > * {
  animation-play-state: paused;
}

/* ================= 背景装飾 ================= */
.op-sheet__decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
/* 淡いブロブ：ぼかしフィルターは使わず放射グラデーションで（軽量） */
.op-blob {
  position: absolute;
  width: 52vmax;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: op-float 11s ease-in-out infinite alternate;
}
.op-blob--yellow {
  top: -24vmax;
  left: -20vmax;
  background: radial-gradient(closest-side, rgba(255, 233, 168, 0.85), rgba(255, 233, 168, 0));
}
.op-blob--mint {
  bottom: -26vmax;
  left: -16vmax;
  background: radial-gradient(closest-side, rgba(221, 245, 228, 0.95), rgba(221, 245, 228, 0));
  animation-duration: 13s;
  animation-delay: -4s;
}
.op-blob--blue {
  top: -24vmax;
  right: -18vmax;
  background: radial-gradient(closest-side, rgba(230, 243, 255, 1), rgba(230, 243, 255, 0));
  animation-duration: 12s;
  animation-delay: -7s;
}
.op-blob--pink {
  bottom: -24vmax;
  right: -20vmax;
  background: radial-gradient(closest-side, rgba(255, 229, 235, 0.95), rgba(255, 229, 235, 0));
  animation-duration: 14s;
  animation-delay: -2s;
}
@keyframes op-float {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(2.5vmax, 2vmax, 0) scale(1.06); }
}

.op-dots {
  position: absolute;
  width: 84px;
  height: auto;
  opacity: 0.32;
  animation: op-dots 6s ease-in-out infinite;
}
.op-dots--1 { top: 14%; left: 18%; }
.op-dots--2 { bottom: 16%; right: 17%; width: 64px; animation-delay: -3s; }
@keyframes op-dots {
  0%, 100% { opacity: 0.22; }
  50% { opacity: 0.4; }
}

.op-leaf {
  position: absolute;
  height: auto;
  transform-origin: 50% 90%;
  animation: op-leaf 9s ease-in-out infinite;
}
.op-leaf--1 { width: 72px; left: 4%; bottom: 9%; opacity: 0.6; }
.op-leaf--2 { width: 38px; right: 7%; top: 13%; opacity: 0.5; rotate: 24deg; animation-duration: 10.5s; animation-delay: -4s; }
.op-leaf--3 { width: 30px; left: 11%; top: 20%; opacity: 0.38; rotate: -28deg; animation-duration: 8s; animation-delay: -2s; }
@keyframes op-leaf {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
  50% { transform: translate3d(6px, -8px, 0) rotate(5deg); }
}

/* 淡い光：ゆっくり横切る */
.op-sweep {
  position: absolute;
  inset: -10% auto -10% 0;
  width: 46%;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.55) 45%, rgba(255, 244, 214, 0.35) 55%, transparent 100%);
  transform: translate3d(-110%, 0, 0) skewX(-12deg);
  animation: op-sweep 3.4s cubic-bezier(0.45, 0, 0.35, 1) 0.2s both;
}
@keyframes op-sweep {
  to { transform: translate3d(330%, 0, 0) skewX(-12deg); }
}

/* ================= 中央のロゴ・文字 ================= */
.op-sheet__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: 20px;
  text-align: center;
}

/* ロゴ（Header / Footer と同じ部品をそのまま使用。大きさのみ指定） */
.op-logo {
  width: clamp(150px, 15vw, 236px);
  animation: op-logo var(--op-logo-dur, 0.6s) cubic-bezier(0.22, 0.61, 0.36, 1) var(--op-logo-delay, 0.1s) both;
}
@keyframes op-logo {
  from { opacity: 0; transform: translate3d(0, 10px, 0) scale(0.96); }
  to { opacity: 1; transform: none; }
}

.op-title {
  margin: clamp(22px, 3vw, 40px) 0 0;
  font-family: var(--font-heading);
  /* 1行（実測で約21文字幅）が画面の左右に余白を残して収まる大きさ。PC は最大 40px（以前の約67%） */
  font-size: clamp(0.75rem, (100vw - 48px) / 22, 2.5rem);
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  letter-spacing: 0.06em;
  color: #172b58;
}
.op-title__line {
  white-space: nowrap;
}
.op-title__word {
  display: inline-block;
}
.op-char {
  display: inline-block;
  animation: op-char var(--op-char-dur, 0.55s) cubic-bezier(0.22, 0.61, 0.36, 1)
    calc(var(--op-text-delay, 0.55s) + var(--ci) * var(--op-char-step, 20ms)) both;
}
@keyframes op-char {
  from { opacity: 0; transform: translate3d(0, 0.32em, 0); }
  to { opacity: 1; transform: none; }
}

.op-sub {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: clamp(20px, 2.4vw, 30px);
  animation: op-sub var(--op-sub-dur, 0.5s) ease-out var(--op-sub-delay, 1.75s) both;
}
@keyframes op-sub {
  from { opacity: 0; transform: translate3d(0, 6px, 0); }
  to { opacity: 1; transform: none; }
}
/* ナビの下線と同じ雰囲気の、3色の短いライン */
.op-sub__rule {
  width: 56px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff6b61 0 33%, #8fbdf0 33% 66%, #8fd19e 66% 100%);
  opacity: 0.85;
}
.op-sub__words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0 clamp(10px, 1.2vw, 16px);
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(0.8125rem, 0.7rem + 0.4vw, 1.0625rem);
  font-weight: 700;
  letter-spacing: 0.22em;
  line-height: 1.6;
}
.op-sub__x {
  color: rgba(23, 43, 88, 0.4);
  letter-spacing: 0;
}
.op-sub__word--coral { color: #ff6b61; }
.op-sub__word--blue { color: #4f8fd6; }
.op-sub__word--mint { color: #4dae73; }

/* ================= SP：装飾を減らして軽く ================= */
@media (max-width: 767px) {
  .op-dots--1,
  .op-leaf--3 {
    display: none;
  }
  .op-dots--2 { width: 52px; bottom: 12%; right: 8%; }
  .op-leaf--1 { width: 50px; left: 3%; bottom: 7%; }
  .op-leaf--2 { width: 28px; top: 10%; right: 6%; }
  .op-sweep { width: 70%; }
  .op-title { letter-spacing: 0.04em; }
  .op-sub__words { letter-spacing: 0.16em; }
}
</style>
