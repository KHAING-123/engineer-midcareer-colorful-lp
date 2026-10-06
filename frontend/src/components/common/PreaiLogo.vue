<script setup>
/**
 * PREAI ロゴ（Header / Footer 共通）
 *  画像ファイルではなく、インライン SVG で文字の形を描いています。
 *  色：P・R はネイビー → E・A・i はダークグレーへ自然につながる／i の上にオレンジの丸
 *  大きさは使う側で width を指定してください（高さは縦横比から自動）。
 */
import { useId } from 'vue'

defineProps({
  label: { type: String, default: 'PREAI' }, // 読み上げ用の名前
})

// Header と Footer で同じロゴを2つ置くため、グラデーションの id を重複させない
const gid = `preai-logo-grad-${useId()}`
</script>

<template>
  <svg class="preai-logo" viewBox="0 12 246 51" role="img" :aria-label="label" focusable="false">
    <defs>
      <linearGradient :id="gid" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="246" y2="0">
        <stop offset="0" stop-color="#0a205c" />
        <stop offset="0.36" stop-color="#16285a" />
        <stop offset="0.52" stop-color="#34394a" />
        <stop offset="1" stop-color="#3a3d45" />
      </linearGradient>
    </defs>
    <g :fill="`url(#${gid})`" fill-rule="evenodd">
      <!-- P：上の横棒を左へ伸ばし、先端を斜めに切った未来的な形 -->
      <path d="M0 16 H40 C50 16 55 22 55 30 C55 38 50 44 40 44 H22 V60 H8 V27 L0 27 Z M22 26.5 H38 C41 26.5 42.5 28 42.5 30 C42.5 32 41 33.5 38 33.5 H22 Z" />
      <!-- R -->
      <path d="M62 16 H98 C108 16 113 22 113 30 C113 37 109 42 101 43.3 L115 60 H99.5 L87 44 H76 V60 H62 Z M76 26.5 H96 C99 26.5 100.5 28 100.5 30 C100.5 32 99 33.5 96 33.5 H76 Z" />
      <!-- E -->
      <path d="M122 16 H166 V26.5 H136 V32.8 H162 V43.2 H136 V49.5 H166 V60 H122 Z" />
      <!-- A：三角形をベースに、中央の三角の抜きで形を見せる幾何学的な A -->
      <path d="M172 60 L191 16 H203 L222 60 H208.5 L197 33 L185.5 60 Z M191.5 60 L197 47.5 L202.5 60 Z" />
      <!-- i（縦棒） -->
      <rect x="230" y="30" width="13" height="30" rx="1.5" />
    </g>
    <!-- i の上のオレンジの丸 -->
    <circle cx="236.5" cy="20" r="6.5" fill="#ffa31a" />
  </svg>
</template>

<style scoped>
.preai-logo {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
