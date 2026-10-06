<script setup>
/**
 * Final CTA
 *  PC: final-cta-pc.png / SP: final-cta-sp.png の画像だけを表示します。
 *  「まずは話を聞いてみる」は画像の中に含まれているため、HTMLのボタン・リンクは置きません。
 */
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'

const { finalCta } = lpContent
</script>

<template>
  <section id="entry" class="final-cta" aria-labelledby="final-cta-title">
    <div v-reveal="{ variant: 'slow' }" class="final-cta__frame">
      <picture class="final-cta__picture">
        <source media="(max-width: 767px)" :srcset="img(finalCta.imageSp)" width="1024" height="1536" />
        <img class="final-cta__image" :src="img(finalCta.imagePc)" :alt="finalCta.alt" width="2048" height="768" loading="lazy" />
      </picture>

      <div class="final-cta__text" :class="{ 'visually-hidden': !finalCta.showText }">
        <h2 id="final-cta-title" class="final-cta__title pre-line">{{ finalCta.title }}</h2>
        <p v-if="finalCta.lead" class="final-cta__lead">{{ finalCta.lead }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * 画像は常に「画面幅いっぱい・縦横比そのまま」で縮小します（切り抜きなし）。
 * 超ワイド画面ではヘッダーと同じ最大幅で止め、左右は背景色で埋めます。
 */
.final-cta {
  background: var(--color-cream);
}
.final-cta__frame {
  position: relative;
  max-width: var(--layout-wide-width);
  margin-inline: auto;
  container-type: inline-size; /* showText: true のとき文字を画像幅に合わせて縮小するため */
}
.final-cta__picture {
  display: block;
}
.final-cta__image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

/* 画像に見出しが入っていない場合（lpContent.js の showText: true）の表示位置 */
.final-cta__text {
  position: absolute;
  left: 50%;
  top: 22%;
  width: 45%;
}
.final-cta__title {
  font-size: clamp(1.25rem, 2.6cqw, 2.5rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  line-height: 1.45;
}
.final-cta__lead {
  margin-top: 0.6em;
  color: var(--color-navy);
  font-weight: 700;
  font-size: clamp(0.875rem, 1.2cqw, 1.125rem);
}

/* SP：SP専用画像に切り替え（既存ブレイクポイント 767px） */
@media (max-width: 767px) {
  .final-cta__text {
    left: 8%;
    top: 64%;
    width: 84%;
    text-align: center;
  }
  .final-cta__title {
    font-size: clamp(1.125rem, 6cqw, 1.75rem);
  }
  .final-cta__lead {
    font-size: clamp(0.8125rem, 3.4cqw, 1rem);
  }
}
</style>
