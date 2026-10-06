<script setup>
import { img } from '../../utils/image.js'

defineProps({
  career: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

// 左→右へ動きが伝わるように、周期と開始をカードごとにずらす（アイコンはカードの 0.7 秒後）
const DUR = [5.4, 5.8, 5.5, 6, 5.7]
</script>

<template>
  <article
    class="career-card lp-card premium-icon-hover"
    :class="`accent-${career.accent || 'yellow'}`"
    :style="{
      '--dur': `${DUR[index % DUR.length]}s`,
      '--delay': `${index * 0.5}s`,
      '--icon-delay': `${index * 0.5 + 0.7}s`,
      '--sweep-delay': `${index * 1.2 + 1}s`,
      '--dot-delay': `${index * 0.3}s`,
    }"
  >
    <!-- 淡い光の流れ（装飾・カード内に収める） -->
    <span class="career-card__sweep" aria-hidden="true"></span>
    <div class="career-card__icon premium-icon-host">
      <span class="premium-icon-glow" aria-hidden="true"></span>
      <img class="premium-icon-float" :src="img(career.icon)" alt="" width="120" height="120" loading="lazy" :style="{ '--pi-delay': `${index * 0.4}s` }" />
    </div>
    <h3 class="career-card__title">{{ career.title }}</h3>
    <!-- タイトル下の短いドットライン（明るいドットが左 → 右へ流れ続ける） -->
    <span class="career-card__dots" aria-hidden="true"></span>
    <!-- 説明文の \n は「幅が足りないときだけ改行する位置」 -->
    <p class="career-card__text"><template v-for="(part, i) in career.description.split('\n')" :key="i"><wbr v-if="i > 0" />{{ part }}</template></p>
  </article>
</template>

<style scoped>
.career-card {
  --float: 5px; /* 浮く量（SPで弱める） */
  --cc: #f5c84c; /* カードのアクセント色（枠・アイコン・ドット・背景の装飾） */
  isolation: isolate; /* 下の光・光の流れの重なり順をカード内で完結させる */
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 30px 18px 28px;
  text-align: center;
  background: linear-gradient(180deg, #ffffff 40%, color-mix(in srgb, var(--cc) 6%, #ffffff));
  border: 1.5px solid color-mix(in srgb, var(--cc) 40%, transparent);
  border-radius: 26px;
  /* 常にある柔らかい影＋アクセント色のごく薄い影 */
  box-shadow:
    0 12px 30px rgba(35, 55, 95, 0.08),
    0 4px 12px rgba(35, 55, 95, 0.05),
    0 16px 30px -14px color-mix(in srgb, var(--cc) 55%, transparent);
  /* 常時の浮遊は translate、hover は transform（競合しない） */
  animation: career-float var(--dur, 5.5s) ease-in-out var(--delay, 0s) infinite;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.35s ease;
}
/* 浮いたときに広がる影（濃さだけを浮遊と同じ周期で変える） */
.career-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    0 20px 42px rgba(35, 55, 95, 0.11),
    0 8px 18px rgba(35, 55, 95, 0.05),
    0 18px 30px -12px color-mix(in srgb, var(--accent) 60%, transparent);
  opacity: 0;
  pointer-events: none;
  animation: career-shadow var(--dur, 5.5s) ease-in-out var(--delay, 0s) infinite;
}
/* 下のアクセント色のライン付近にふんわりした光（ゆっくり呼吸） */
.career-card::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: 12%;
  right: 12%;
  bottom: -14px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 70%, transparent), transparent);
  opacity: 0.75;
  pointer-events: none;
  animation: career-accent-breathe 5.5s ease-in-out var(--delay, 0s) infinite;
}
/* 淡い光：左下 → 右上へゆっくり流れる（カードごとに時間差） */
.career-card.accent-blue { --cc: #78b9f7; }
.career-card.accent-green { --cc: #6fd39b; }
.career-card.accent-pink { --cc: #ff9aaf; }
/* カード内の淡い装飾（左上の Blob・右下の波）＋ 光の流れ（カードの角丸の中だけ） */
.career-card__sweep {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 45% at 0% 0%, color-mix(in srgb, var(--cc) 22%, transparent), transparent 70%),
    radial-gradient(ellipse 85% 34% at 100% 100%, color-mix(in srgb, var(--cc) 26%, transparent), transparent 72%),
    radial-gradient(ellipse 60% 22% at 20% 100%, color-mix(in srgb, var(--cc) 14%, transparent), transparent 70%);
}
.career-card__sweep::before {
  content: '';
  position: absolute;
  inset: -40% -60%;
  background: linear-gradient(115deg, transparent 42%, rgba(255, 255, 255, 0.55) 50%, transparent 58%);
  transform: translate3d(-60%, 30%, 0);
  animation: career-sweep 11s ease-in-out var(--sweep-delay, 1s) infinite both;
}
.career-card > :not(.career-card__sweep) {
  position: relative;
  z-index: 1;
}
.career-card__icon {
  width: 96px;
  height: 96px;
  margin-bottom: 18px;
  padding: 8px;
  border-radius: 50%;
  /* 淡いパステルの丸 ＋ 白いリング ＋ 淡い光 */
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, color-mix(in srgb, var(--cc) 22%, #ffffff) 75%);
  box-shadow:
    0 0 0 6px rgba(255, 255, 255, 0.95),
    0 0 0 7.5px color-mix(in srgb, var(--cc) 25%, transparent),
    0 8px 22px color-mix(in srgb, var(--cc) 30%, transparent);
  /* カードより少し遅れて、小さく浮いて脈打つ（外側にごく薄い光） */
  animation: career-icon var(--dur, 5.5s) ease-in-out var(--icon-delay, 0.7s) infinite;
  transition: scale 0.35s ease;
}

/* PC（マウス操作）の hover：少しだけさらに持ち上がる */
@media (hover: hover) and (pointer: fine) {
  .career-card:hover {
    transform: translateY(-5px);
    box-shadow:
      0 20px 42px rgba(35, 55, 95, 0.11),
      0 6px 16px rgba(35, 55, 95, 0.06),
      0 20px 34px -14px color-mix(in srgb, var(--cc) 65%, transparent);
  }
  .career-card:hover .career-card__icon img {
    scale: 1.05;
  }
  .career-card__icon img {
    transition:
      scale 0.35s ease,
      translate 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
      filter 0.35s ease;
  }
}

@keyframes career-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 calc(var(--float) * -1); }
}
@keyframes career-shadow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
@keyframes career-icon {
  0%, 100% {
    translate: 0 0;
    scale: 1;
    rotate: 0deg;
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.95), 0 0 0 7.5px color-mix(in srgb, var(--cc) 25%, transparent), 0 8px 22px color-mix(in srgb, var(--cc) 30%, transparent);
  }
  50% {
    translate: 0 -2px;
    scale: 1.04;
    rotate: 1deg;
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.95), 0 0 0 9px color-mix(in srgb, var(--cc) 20%, transparent), 0 10px 26px color-mix(in srgb, var(--cc) 40%, transparent);
  }
}
@keyframes career-accent-breathe {
  0%, 100% { opacity: 0.75; }
  50% { opacity: 1; }
}
@keyframes career-sweep {
  0% { transform: translate3d(-60%, 30%, 0); }
  30%, 100% { transform: translate3d(60%, -30%, 0); }
}
.career-card__icon {
  --pi-color: var(--cc);
  --pi-y: -3px; /* 丸自体もゆっくり脈打つので、画像は小さめに */
  --pi-y-sp: -2px;
}
.career-card__icon img {
  width: 100%;
  height: 100%;
}
.career-card__title {
  color: var(--color-navy);
  font-size: var(--fs-md);
  font-weight: 700;
  line-height: 1.4;
}
/* タイトル下の短いドットライン：淡いドットの上を、明るいドット（光）が左 → 右へ流れ続ける */
.career-card__dots {
  position: relative;
  display: block;
  flex: none;
  width: 58px;
  height: 6px;
  margin-top: 10px;
  background: radial-gradient(circle, color-mix(in srgb, var(--cc) 45%, transparent) 2.2px, transparent 2.6px) 0 50% / 12px 6px repeat-x;
}
.career-card__dots::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, var(--cc) 2.4px, transparent 2.8px) 0 50% / 12px 6px repeat-x;
  filter: drop-shadow(0 0 2px color-mix(in srgb, var(--cc) 60%, transparent));
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 40%, #000 60%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 40%, #000 60%, transparent);
  -webkit-mask-size: 30px 100%;
  mask-size: 30px 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  animation: career-dot-flow 2.4s linear var(--dot-delay, 0s) infinite;
}
@keyframes career-dot-flow {
  0% { -webkit-mask-position: -30px 0; mask-position: -30px 0; }
  100% { -webkit-mask-position: 58px 0; mask-position: 58px 0; }
}
.career-card__text {
  margin-top: 12px;
  word-break: keep-all; /* \n（<wbr>）の位置でだけ改行する */
  overflow-wrap: anywhere;
  color: var(--color-text);
  font-size: var(--fs-sm);
  line-height: 1.7;
}

@media (max-width: 767px) {
  .career-card {
    --float: 3px;
    box-shadow:
      0 8px 22px rgba(35, 55, 95, 0.06),
      0 3px 9px rgba(35, 55, 95, 0.035),
      0 12px 22px -12px color-mix(in srgb, var(--accent) 35%, transparent);
  }
}
@media (max-width: 600px) {
  /* 横長カード：アクセントの光を左側に */
  .career-card::before {
    left: -14px;
    right: auto;
    top: 15%;
    bottom: 15%;
    width: 18px;
    height: auto;
  }
  .career-card {
    display: grid;
    grid-template-columns: 64px 1fr;
    column-gap: 16px;
    align-items: center;
    padding: 18px 20px;
    text-align: left;
  }
  .career-card__icon {
    grid-row: span 3;
    width: 64px;
    height: 64px;
    margin: 0;
    padding: 6px;
  }
  .career-card__dots {
    margin-top: 6px;
  }
  .career-card__text {
    margin-top: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .career-card,
  .career-card::after,
  .career-card::before,
  .career-card__icon,
  .career-card__sweep::before,
  .career-card__dots::after {
    animation: none !important;
  }
  .career-card__dots::after {
    display: none; /* ドットラインは淡いドットのまま表示 */
  }
  .career-card__sweep::before {
    display: none;
  }
  .career-card {
    transition: none;
  }
  .career-card:hover,
  .career-card:hover .career-card__icon img {
    transform: none;
    scale: 1;
  }
}
</style>
