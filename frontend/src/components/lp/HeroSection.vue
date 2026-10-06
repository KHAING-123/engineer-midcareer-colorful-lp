<script setup>
/**
 * Hero（メインビジュアル）
 * 画像1枚で表示します。PC用とSP用の画像を自動で切り替えます。
 *  - PC用: src/assets/images/hero/rookie-hero-pc.png
 *  - SP用: src/assets/images/hero/rookie-hero-sp.png
 *
 * 画像の上に、ゆっくり漂う葉っぱの装飾レイヤーを重ねています（画像そのものは動かしません）。
 */
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'

const { hero } = lpContent
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="visually-hidden">{{ hero.title }}</h1>
    <div class="hero__frame">
      <picture class="hero__picture">
        <source media="(max-width: 767px)" :srcset="img(hero.imageSp)" width="1024" height="1536" />
        <img class="hero__image" :src="img(hero.imagePc)" :alt="hero.alt" width="2048" height="768" fetchpriority="high" />
      </picture>

      <!-- 漂う葉っぱ（装飾） -->
      <div class="hero__leaves" aria-hidden="true">
        <img class="hero-leaf hero-leaf--1" :src="img('common/deco-leaf-pair.svg')" alt="" />
        <img class="hero-leaf hero-leaf--2" :src="img('common/deco-leaf.svg')" alt="" />
        <img class="hero-leaf hero-leaf--3" :src="img('common/deco-leaf.svg')" alt="" />
        <img class="hero-leaf hero-leaf--4" :src="img('common/deco-leaf.svg')" alt="" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * 画像は常に「画面幅いっぱい・縦横比そのまま」で縮小します（切り抜きなし）。
 * 超ワイド画面ではヘッダーと同じ最大幅で止め、左右は背景色で埋めます。
 */
.hero {
  position: relative;
  background: var(--color-cream);
}
.hero__frame {
  position: relative;
  max-width: var(--layout-wide-width);
  margin-inline: auto;
}
.hero__picture {
  display: block;
}
.hero__image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

/* ---------- 漂う葉っぱ：Hero画像の上・Headerの下。画像の枠外にははみ出さない ---------- */
.hero__leaves {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}
.hero-leaf {
  position: absolute;
  height: auto;
  transform-origin: 50% 90%; /* 茎側を軸に揺れる */
  pointer-events: none;
  user-select: none;
  animation: hero-leaf-drift-a 12s ease-in-out infinite;
  will-change: transform;
}
/* 左上の余白：手前（Medium） */
.hero-leaf--1 {
  width: 52px;
  top: 3%;
  left: 2.5%;
  opacity: 0.7;
}
/* 上中央の余白：奥（Small） */
.hero-leaf--2 {
  width: 30px;
  top: 3%;
  left: 40%;
  opacity: 0.45;
  animation-name: hero-leaf-drift-b;
  animation-duration: 14.5s;
  animation-delay: -5s;
}
/* 右下の角：手前（Large・少しぼかして奥行き）。一部は枠外 */
.hero-leaf--3 {
  width: 80px;
  top: 84%;
  right: -1.5%;
  opacity: 0.6;
  filter: blur(1.5px);
  animation-name: hero-leaf-drift-c;
  animation-duration: 13s;
  animation-delay: -8s;
}
/* 左端の中ほど：奥（Small） */
.hero-leaf--4 {
  width: 34px;
  top: 56%;
  left: 1.5%;
  opacity: 0.55;
  animation-duration: 10.5s;
  animation-delay: -3s;
  animation-direction: reverse;
}

/* 風に乗って漂う（上下だけでなく斜めに）。--leaf-amp で SP は約65% */
@keyframes hero-leaf-drift-a {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-3deg); }
  25% { transform: translate3d(calc(12px * var(--leaf-amp, 1)), calc(-10px * var(--leaf-amp, 1)), 0) rotate(2deg); }
  55% { transform: translate3d(calc(18px * var(--leaf-amp, 1)), calc(8px * var(--leaf-amp, 1)), 0) rotate(5deg); }
  80% { transform: translate3d(calc(-5px * var(--leaf-amp, 1)), calc(12px * var(--leaf-amp, 1)), 0) rotate(-1deg); }
}
@keyframes hero-leaf-drift-b {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(2deg); }
  30% { transform: translate3d(calc(-14px * var(--leaf-amp, 1)), calc(10px * var(--leaf-amp, 1)), 0) rotate(-4deg); }
  65% { transform: translate3d(calc(8px * var(--leaf-amp, 1)), calc(16px * var(--leaf-amp, 1)), 0) rotate(3deg); }
}
@keyframes hero-leaf-drift-c {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
  35% { transform: translate3d(calc(-16px * var(--leaf-amp, 1)), calc(-14px * var(--leaf-amp, 1)), 0) rotate(-5deg); }
  70% { transform: translate3d(calc(-6px * var(--leaf-amp, 1)), calc(-22px * var(--leaf-amp, 1)), 0) rotate(3deg); }
}

/* Tablet：3枚 */
@media (max-width: 1024px) {
  .hero-leaf--2 {
    display: none;
  }
}
/* SP（SP用画像）：2枚・PCの約65%のサイズ。文字・人物・Featureを避けた位置 */
@media (max-width: 767px) {
  .hero-leaf {
    will-change: auto;
  }
  .hero-leaf--3 {
    display: none;
  }
  .hero-leaf--1 {
    width: 36px;
    top: 0.5%;
    left: auto;
    right: 2%;
  }
  .hero-leaf--4 {
    width: 24px;
    top: 47%;
    left: 1%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-leaf {
    animation: none;
    will-change: auto;
  }
}
</style>
