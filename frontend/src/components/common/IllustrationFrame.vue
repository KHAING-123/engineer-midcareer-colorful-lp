<script setup>
/**
 * 共通のイラスト表示枠
 *
 *  ・画像の大きさ・縦横比に関係なく、枠の大きさは一定（画像はレイアウトに影響しない）。
 *  ・画像は object-fit: contain で枠内に全体を表示（切り取り・拡大・色の加工なし）。
 *  ・枠そのものに背景色は付けない。背景透過PNGなら、後ろのセクション背景・装飾がそのまま見える。
 *    ※ PNG自体に白背景が入っている場合は、その白がそのまま表示されます（素材を背景透過PNGにしてください）。
 *
 *  props
 *   src   : src/assets/images/ からの画像パス（lpContent.js で管理）
 *   alt   : 代替テキスト
 *   ratio : 枠の縦横比（例 '3 / 2'）。null の場合は親要素いっぱいに広がる
 */
import { img } from '../../utils/image.js'

defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  ratio: { type: String, default: '3 / 2' },
})
</script>

<template>
  <div class="illustration-frame" :class="{ 'illustration-frame--fill': !ratio }" :style="ratio ? { '--frame-ratio': ratio } : null">
    <img class="illustration-frame__img" :src="img(src)" :alt="alt" loading="lazy" decoding="async" />
  </div>
</template>

<style scoped>
.illustration-frame {
  position: relative;
  width: 100%;
  aspect-ratio: var(--frame-ratio, 3 / 2);
  background: transparent; /* 枠に色は付けない（背景透過PNGなら後ろの背景・装飾が見える） */
}
.illustration-frame--fill {
  aspect-ratio: auto;
  height: 100%;
}
.illustration-frame__img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent; /* ※ PNG の画素に焼き込まれた白は、これでは透明になりません */
}
</style>
