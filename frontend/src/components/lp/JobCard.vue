<script setup>
/**
 * 02 OUR WORK の仕事カード（1枚分）
 *  カードの色は lpContent.js の jobs[].accent（yellow / green / pink）で切り替わります。
 *  画像は IllustrationFrame で contain 表示（切り取り・色の加工なし）。PNG を差し替えても崩れません。
 *
 * レイヤーの分担（transform が競合しないように分離）
 *   li.our-work-card-reveal（JobsSection） … スクロール表示（1回だけ）
 *   .our-work-card                        … 常時のゆっくりした浮遊 ＋ 影の呼吸
 *   .our-work-card__surface               … カードの見た目と hover（PCのみ）
 *   .our-work-card__image-zoom            … 画像の hover（ごく小さい拡大）
 *   .our-work-card__image-float           … 画像のゆっくりした浮遊
 */
import IllustrationFrame from '../common/IllustrationFrame.vue'

defineProps({
  job: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
</script>

<template>
  <article
    class="our-work-card"
    :class="`our-work-card--${job.accent || 'yellow'}`"
    :style="{ '--i': index }"
  >
    <div class="our-work-card__surface">
      <!-- カード内の装飾（文字・画像より後ろ） -->
      <span class="our-work-card__deco" aria-hidden="true">
        <span class="our-work-card__blob"></span>
        <span class="our-work-card__circle"></span>
        <span class="our-work-card__curve"></span>
        <span class="our-work-card__dots"></span>
        <span class="our-work-card__dots our-work-card__dots--bottom"></span>
        <span class="our-work-card__wave"></span>
        <!-- 画像まわりの淡い光：左下 → 右上へごくゆっくり移動 -->
        <span class="our-work-card__glow"></span>
        <!-- カード上部の Premium Floating Accent（淡い光の玉・小さな光・流れる光のライン。画像・文字より後ろ） -->
        <span class="our-work-card__top">
          <i class="ow-orb ow-orb--1"></i>
          <i class="ow-orb ow-orb--2"></i>
          <i class="ow-orb ow-orb--3"></i>
          <i class="ow-spark ow-spark--1"></i>
          <i class="ow-spark ow-spark--2"></i>
          <i class="ow-spark ow-spark--3"></i>
          <i class="ow-spark ow-spark--4"></i>
          <i class="ow-lightline"></i>
        </span>
      </span>

      <div class="our-work-card__image">
        <span class="our-work-card__image-zoom">
          <span class="our-work-card__image-float">
            <IllustrationFrame :src="job.image" :alt="job.imageAlt" :ratio="null" />
          </span>
        </span>
      </div>

      <div class="our-work-card__content">
        <!-- タイトル上の短いライン（中を淡い光が左 → 右へ流れる） -->
        <span class="our-work-card__accent" aria-hidden="true"></span>
        <h3 class="our-work-card__title">{{ job.title }}</h3>
        <!-- 説明文の \n は「幅が足りないときだけ改行する位置」 -->
        <p class="our-work-card__description"><template v-for="(part, i) in job.description.split('\n')" :key="i"><wbr v-if="i > 0" />{{ part }}</template></p>
        <ul class="our-work-card__tags" aria-label="使用するスキル">
          <li v-for="tag in job.tags" :key="tag" class="our-work-card__tag">{{ tag }}</li>
        </ul>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ================= テーマカラー（Web：イエロー/オレンジ / モバイル：ブルー/シアン/ミント / データ・AI：ピンク/ラベンダー） ================= */
/* 色の指定は lpContent.js の accent（yellow / green / pink）のまま */
.our-work-card--yellow {
  --ow-bg:
    radial-gradient(circle at 18% 12%, rgba(255, 210, 120, 0.22), transparent 40%),
    linear-gradient(160deg, rgba(255, 249, 232, 0.98), rgba(255, 253, 248, 0.96) 55%, rgba(255, 240, 214, 0.9));
  --ow-deco: #ffc56b;     /* 装飾の色 */
  --ow-accent: #ff9a4d;   /* タイトル上のライン */
  --ow-tag-bg: #ffe9c7;   /* タグの背景 */
  --ow-border: rgba(255, 190, 120, 0.4);
  --ow-glow: rgba(255, 190, 110, 0.32);
}
.our-work-card--green {
  --ow-bg:
    radial-gradient(circle at 82% 12%, rgba(120, 210, 245, 0.2), transparent 40%),
    linear-gradient(160deg, rgba(234, 247, 255, 0.98), rgba(250, 253, 255, 0.96) 55%, rgba(222, 246, 240, 0.9));
  --ow-deco: #6cc7ec;
  --ow-accent: #3f9bf0;
  --ow-tag-bg: #d8efff;
  --ow-border: rgba(120, 190, 240, 0.42);
  --ow-glow: rgba(110, 200, 240, 0.3);
}
.our-work-card--pink {
  --ow-bg:
    radial-gradient(circle at 18% 12%, rgba(215, 170, 255, 0.22), transparent 40%),
    linear-gradient(160deg, rgba(246, 236, 255, 0.98), rgba(253, 250, 255, 0.96) 55%, rgba(255, 232, 244, 0.9));
  --ow-deco: #d9a5f0;
  --ow-accent: #ee6fb0;
  --ow-tag-bg: #f7dcf2;
  --ow-border: rgba(220, 165, 235, 0.42);
  --ow-glow: rgba(230, 160, 230, 0.3);
}

/* ================= 浮遊（カード全体）＋ 影の呼吸 ================= */
.our-work-card {
  --float-y: 4px;
  --radius: 24px;
  position: relative;
  height: 100%;
  border-radius: var(--radius);
  animation: our-work-card-float 6s ease-in-out calc(var(--i, 0) * 0.6s) infinite;
}
/* 浮いた時だけ少し広がる影（浮遊と同じ周期） */
.our-work-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 26px 52px rgba(29, 47, 78, 0.09);
  opacity: 0;
  animation: our-work-card-shadow 6s ease-in-out calc(var(--i, 0) * 0.6s) infinite;
  pointer-events: none;
}
@keyframes our-work-card-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(var(--float-y) * -1)); }
}
@keyframes our-work-card-shadow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* ================= カード本体 ================= */
.our-work-card__surface {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--ow-bg);
  border: 1px solid var(--ow-border);
  border-radius: var(--radius);
  box-shadow:
    0 18px 40px rgba(30, 55, 90, 0.08),
    0 6px 16px rgba(30, 55, 90, 0.05),
    0 18px 36px -16px var(--ow-glow),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition:
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.5s ease;
}

/* ---------- 装飾（よく見ると存在する程度。文字・画像より後ろ） ---------- */
.our-work-card__deco {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: translate 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.our-work-card__deco > * {
  position: absolute;
}
/* 淡い Blob（右下） */
.our-work-card__blob {
  right: -70px;
  bottom: -70px;
  width: 190px;
  height: 150px;
  border-radius: 58% 42% 50% 50% / 55% 60% 40% 45%;
  background: var(--ow-deco);
  opacity: 0.16;
  animation: our-work-blob 11s ease-in-out infinite;
}
/* 小さな丸（右上） */
.our-work-card__circle {
  top: 22px;
  right: 26px;
  width: 34px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--ow-deco);
  opacity: 0.22;
  animation: our-work-drift 12s ease-in-out infinite;
}
/* 細い曲線（画像の右側を囲むように） */
.our-work-card__curve {
  top: 40px;
  right: -60px;
  width: 200px;
  aspect-ratio: 1;
  border: 1.5px solid var(--ow-deco);
  border-color: var(--ow-deco) transparent transparent transparent;
  border-radius: 50%;
  opacity: 0.25;
  rotate: 35deg;
  animation: our-work-curve 14s ease-in-out infinite;
}
/* 小さなドット（左上 / 右下） */
.our-work-card__dots {
  top: 26px;
  left: 24px;
  width: 44px;
  height: 36px;
  background: radial-gradient(circle, var(--ow-deco) 1.6px, transparent 2.2px) 0 0 / 11px 11px;
  opacity: 0.25;
  animation: our-work-drift 10s ease-in-out -3s infinite;
}
.our-work-card__dots--bottom {
  top: auto;
  left: auto;
  right: 18px;
  bottom: 20px;
  width: 36px;
  height: 36px;
  opacity: 0.2;
  animation-delay: -6s;
}
/* テーマごとに少しだけ配置を変える（参考デザインに合わせて） */
.our-work-card--green .our-work-card__blob {
  right: -80px;
  bottom: 38%;
  width: 150px;
  height: 170px;
}
.our-work-card--green .our-work-card__circle {
  right: auto;
  left: 30%;
  top: 14px;
  width: 22px;
}
.our-work-card--pink .our-work-card__circle {
  top: 60px;
  right: 18px;
  width: 44px;
}
.our-work-card--pink .our-work-card__curve {
  right: auto;
  left: -70px;
  rotate: -40deg;
}

/* 下の柔らかい波（右下） */
.our-work-card__wave {
  left: 30%;
  right: -20%;
  bottom: -60px;
  height: 120px;
  border-radius: 60% 40% 0 0 / 80% 70% 0 0;
  background: linear-gradient(100deg, transparent, var(--ow-deco));
  opacity: 0.16;
  rotate: -6deg;
}
/* 画像まわりの淡い光：左下 → 右上へゆっくり移動 */
.our-work-card__glow {
  left: 0;
  top: 0;
  width: 70%;
  height: 55%;
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--ow-glow), transparent 70%);
  animation: our-work-glow 12s ease-in-out calc(var(--i, 0) * -4s) infinite;
}
@keyframes our-work-glow {
  0%, 100% { transform: translate3d(-6%, 22%, 0) scale(0.95); opacity: 0.7; }
  50% { transform: translate3d(40%, -6%, 0) scale(1.05); opacity: 1; }
}
/* ---------- カード上部の Premium Floating Accent（ごくゆっくり・カードの角丸の中だけ） ---------- */
.our-work-card__top {
  --d: calc(var(--i, 0) * 0.8s); /* 3枚のタイミングをずらす */
  left: 0;
  right: 0;
  top: 0;
  height: 46%;
}
.our-work-card__top > i {
  position: absolute;
  display: block;
}
/* 淡い光の玉：ゆっくり左右・上下に漂い、濃さと大きさがわずかに変わる */
.ow-orb {
  width: 64px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--ow-glow), transparent 75%);
  filter: blur(6px);
  opacity: 0.6;
  animation: ow-orb-drift 10s ease-in-out var(--d) infinite;
}
.ow-orb--1 { left: 8%; top: 8%; }
.ow-orb--2 { right: 10%; top: 18%; width: 48px; animation-duration: 12s; animation-delay: calc(var(--d) - 4s); animation-direction: reverse; }
.ow-orb--3 { left: 46%; top: 2%; width: 38px; animation-duration: 9s; animation-delay: calc(var(--d) - 7s); }
@keyframes ow-orb-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.45; }
  50% { transform: translate3d(14px, -6px, 0) scale(1.08); opacity: 0.8; }
}
/* 小さな光（ドット）：少しずつ位置を変えながら、やわらかく明滅 */
.ow-spark {
  width: 5px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--ow-deco);
  box-shadow: 0 0 6px var(--ow-glow);
  opacity: 0.2;
  animation: ow-spark-float 7s ease-in-out var(--d) infinite;
}
.ow-spark--1 { left: 22%; top: 12%; }
.ow-spark--2 { left: 64%; top: 7%; width: 4px; animation-duration: 8.5s; animation-delay: calc(var(--d) - 2.5s); }
.ow-spark--3 { right: 16%; top: 34%; width: 6px; animation-duration: 6.5s; animation-delay: calc(var(--d) - 4s); }
.ow-spark--4 { left: 10%; top: 40%; width: 4px; animation-duration: 9s; animation-delay: calc(var(--d) - 6s); }
@keyframes ow-spark-float {
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.2; }
  50% { transform: translate3d(6px, -8px, 0); opacity: 0.7; }
}
/* カード上端の流れる光のライン：左 → 右へゆっくり移動し、端でふわっと消えて、また左から */
.ow-lightline {
  left: 0;
  top: 7px;
  width: 34%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--ow-deco), transparent);
  filter: blur(0.6px);
  opacity: 0;
  animation: ow-lightline 9s ease-in-out var(--d) infinite;
}
@keyframes ow-lightline {
  0% { transform: translateX(-40%); opacity: 0; }
  12% { opacity: 0.7; }
  70% { opacity: 0.7; }
  88%, 100% { transform: translateX(260%); opacity: 0; }
}

@keyframes our-work-blob {
  0%, 100% { scale: 1; translate: 0 0; }
  50% { scale: 1.03; translate: -4px -3px; }
}
@keyframes our-work-drift {
  0%, 100% { translate: 0 0; rotate: 0deg; }
  50% { translate: 4px -5px; rotate: 3deg; }
}
@keyframes our-work-curve {
  0%, 100% { translate: 0 0; }
  50% { translate: -5px 4px; }
}

/* ---------- 画像：カードの上側 約半分（固定比率 3:2・中央・contain） ---------- */
.our-work-card__image {
  position: relative;
  z-index: 1;
  width: 100%;
  aspect-ratio: 3 / 2;
}
.our-work-card__image-zoom {
  position: absolute;
  inset: 14px 14px 2px;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.our-work-card__image-float {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  animation: our-work-image-float 7.2s ease-in-out calc(var(--i, 0) * -2s - 1.5s) infinite;
}
@keyframes our-work-image-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* ---------- 文字：タイトル → 説明 → タグ ---------- */
.our-work-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 22px 28px;
}
/* タイトル上の短いライン：中を細い光が左 → 右へゆっくり流れる */
.our-work-card__accent {
  position: relative;
  display: block;
  width: 44px;
  height: 4px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--ow-accent), color-mix(in srgb, var(--ow-accent) 55%, #ffffff));
  overflow: hidden;
}
.our-work-card__accent::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  transform: translateX(-120%);
  animation: our-work-accent-sweep 3s ease-in-out calc(var(--i, 0) * 0.35s) infinite;
}
@keyframes our-work-accent-sweep {
  0% { transform: translateX(-120%); }
  45%, 100% { transform: translateX(120%); }
}
.our-work-card__title {
  color: var(--color-navy);
  font-size: clamp(1.3125rem, 1rem + 0.45vw, 1.75rem);
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.35;
}
.our-work-card__description {
  margin-top: 12px;
  color: var(--color-navy-soft);
  word-break: keep-all; /* \n（<wbr>）の位置でだけ改行する */
  overflow-wrap: anywhere;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.85;
}
/* タグは各カードの下端に揃える */
.our-work-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 22px;
}
.our-work-card__tag {
  padding: 6px 11px;
  border-radius: 999px;
  background: var(--ow-tag-bg);
  color: #274b82;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
  /* カード表面から少し浮いて見える、テーマ色になじむ柔らかい影 */
  --tag-base: -2px;  /* 常に少し浮かせる量 */
  --tag-peak: -4px;  /* 浮遊のいちばん高い位置 */
  position: relative;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.7), /* 背景の装飾と重なっても形が分かるように */
    0 6px 14px color-mix(in srgb, var(--ow-accent) 14%, rgba(30, 55, 90, 0.06)),
    0 2px 5px rgba(30, 55, 90, 0.05);
  /* ゆっくりした浮遊は translate、hover は transform（別プロパティなので競合しない） */
  translate: 0 var(--tag-base);
  animation: ow-tag-float 5s ease-in-out var(--tag-delay, 0s) infinite;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
/* 上部のごく薄いハイライト（少し立体的に） */
.our-work-card__tag::before {
  content: '';
  position: absolute;
  inset: 1px 1px 45%;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
  pointer-events: none;
}
/* 4つのタグを少しずつずらして、順番にふわっと */
.our-work-card__tag:nth-child(2) { --tag-delay: 0.35s; }
.our-work-card__tag:nth-child(3) { --tag-delay: 0.7s; }
.our-work-card__tag:nth-child(4) { --tag-delay: 1.05s; }
@keyframes ow-tag-float {
  0%, 100% { translate: 0 var(--tag-base); }
  50% { translate: 0 var(--tag-peak); }
}

/* ---------- PC（マウス操作）の hover ---------- */
@media (hover: hover) and (pointer: fine) {
  .our-work-card:hover .our-work-card__surface {
    transform: translateY(-5px);
    border-color: color-mix(in srgb, var(--ow-accent) 45%, transparent);
    box-shadow:
      0 24px 50px rgba(30, 55, 90, 0.11),
      0 8px 18px rgba(30, 55, 90, 0.06),
      0 22px 42px -14px var(--ow-glow),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  .our-work-card__tag:hover {
    transform: translateY(-4px) scale(1.03); /* 浮遊の -2px と合わせて約 -6px */
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.75),
      0 10px 20px color-mix(in srgb, var(--ow-accent) 20%, rgba(30, 55, 90, 0.08)),
      0 3px 7px rgba(30, 55, 90, 0.06);
  }
  .our-work-card:hover .our-work-card__image-zoom {
    transform: scale(1.02);
  }
  .our-work-card:hover .our-work-card__deco {
    translate: 3px -3px;
  }
}

/* ---------- SP：浮遊を弱く、装飾を減らす ---------- */
@media (max-width: 767px) {
  .our-work-card {
    --float-y: 2px;
    --radius: 22px;
  }
  .our-work-card__content {
    padding: 18px 22px 24px;
  }
  .our-work-card__curve,
  .our-work-card__dots--bottom {
    display: none;
  }
  /* カード上部の装飾：小さく・数を減らし・ぼかしを弱く */
  .ow-orb {
    width: 48px;
    filter: blur(4px);
  }
  .ow-orb--2 { width: 36px; }
  .ow-orb--3,
  .ow-spark--4 {
    display: none;
  }
  /* タグの浮遊を控えめに */
  .our-work-card__tag {
    --tag-base: -1px;
    --tag-peak: -2.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .our-work-card,
  .our-work-card::before,
  .our-work-card__image-float,
  .our-work-card__deco > *,
  .our-work-card__accent::after,
  .our-work-card__top > i {
    animation: none;
  }
  .ow-lightline {
    display: none;
  }
  .our-work-card__accent::after {
    display: none;
  }
  .our-work-card__tag {
    transition: none;
    animation: none;
  }
  .our-work-card__tag:hover {
    transform: none;
  }
  .our-work-card__surface,
  .our-work-card__image-zoom,
  .our-work-card__deco {
    transition: none;
  }
  .our-work-card:hover .our-work-card__surface,
  .our-work-card:hover .our-work-card__image-zoom {
    transform: none;
  }
  .our-work-card:hover .our-work-card__deco {
    translate: none;
  }
}
</style>
