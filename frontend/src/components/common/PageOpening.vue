<script setup>
/**
 * ページを開いたときの演出（1回だけ）
 *  アイボリーの紙が画面を覆い → 右上が少し浮き → 左下へ向かってふわっとめくれて Hero が現れる。
 *
 *  ・LP 本体は動かさず、画面全体を覆う専用レイヤーだけを動かします。
 *  ・演出中だけ <html> に .is-page-opening を付け、スクロールを止め、Header / Hero を軽く表示させます。
 *  ・終わったらレイヤーを DOM から外し、スクロールを戻します（エラー時も保険のタイマーで必ず戻す）。
 *  ・この部品を App.vue から外せば、演出ごと無くなります。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const CLASS = 'is-page-opening' // 紙が覆っている間（スクロール停止）
const RUN = 'is-page-opening-run' // めくれる演出の実行中（Header / Hero の表示演出もこの間）
const done = ref(false)
const running = ref(false)
const paper = ref(null)
let fallback = 0
let waitTimer = 0

function finish() {
  if (done.value) return
  done.value = true
  document.documentElement.classList.remove(CLASS, RUN)
  clearTimeout(fallback)
  clearTimeout(waitTimer)
}

function start() {
  if (running.value || done.value) return
  running.value = true
  clearTimeout(waitTimer)
  // 動きを減らす設定：めくる演出はせず、短いフェードだけ
  // （CSS アニメーションは全体設定で止まるため、Web Animations API で 0.35 秒だけ薄くする）
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const anim = paper.value?.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 350, delay: 100, fill: 'forwards' })
    if (anim) anim.finished.then(finish, finish)
    else finish()
    return
  }
  document.documentElement.classList.add(RUN)
}

// 描画前に付ける（最初の表示から紙が覆い、スクロールも止まる）
if (typeof document !== 'undefined') document.documentElement.classList.add(CLASS)

onMounted(() => {
  // Hero 画像が表示できる状態になってからめくる（紙の下に何も無いまま開かないように）。最大 1.2 秒だけ待つ
  const hero = document.querySelector('.hero__image')
  if (!hero || (hero.complete && hero.naturalWidth)) {
    requestAnimationFrame(() => requestAnimationFrame(start))
  } else {
    hero.addEventListener('load', start, { once: true })
    hero.addEventListener('error', start, { once: true })
    waitTimer = window.setTimeout(start, 1200)
  }
  // 何があっても 4 秒後には必ず終了（スクロールが止まったままにならないように）
  fallback = window.setTimeout(finish, 4000)
})
onBeforeUnmount(finish)

function onEnd(e) {
  // 紙そのもののアニメーションが終わったら終了
  if (e.target === e.currentTarget) finish()
}
</script>

<template>
  <div v-if="!done" class="page-opening" :class="{ 'is-running': running }" aria-hidden="true">
    <!-- めくれた紙の下の Hero に落ちる、柔らかい影 -->
    <div class="page-opening__shadow"></div>
    <!-- Hero の上を1回だけ流れる淡い光 -->
    <div class="page-opening__light"></div>
    <!-- 紙 -->
    <div class="page-opening__stage">
      <div ref="paper" class="page-opening__paper" @animationend="onEnd">
        <span class="page-opening__curl"></span>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== 演出中：スクロール停止・Header / Hero を軽く表示（この部品が付けるクラスの間だけ有効） ===== */
html.is-page-opening,
html.is-page-opening body {
  overflow: hidden;
}
html.is-page-opening-run .site-header {
  animation: po-header var(--po-header-dur, 0.5s) ease-out var(--po-header-delay, 0.65s) both;
}
html.is-page-opening-run .hero__frame {
  animation: po-hero 0.6s ease-out var(--po-hero-delay, 0.55s) both;
}
@keyframes po-header {
  from { opacity: 0.7; translate: 0 -5px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes po-hero {
  from { opacity: 0.92; scale: 1.01; }
  to { opacity: 1; scale: 1; }
}
</style>

<style scoped>
.page-opening {
  /* 全体の長さ（SP では短く） */
  --po-dur: 1.1s;
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  perspective: 2400px;
}
@media (max-width: 767px) {
  .page-opening { --po-dur: 0.85s; }
  :global(html.is-page-opening-run) {
    --po-header-delay: 0.5s;
    --po-hero-delay: 0.42s;
  }
}

/* 演出が始まるまでは、すべて最初の状態で止めておく */
.page-opening:not(.is-running) *,
.page-opening:not(.is-running) *::before {
  animation-play-state: paused !important;
}

/* 紙：左下の角を軸に、右上がこちらへ持ち上がってめくれる（回転は控えめ） */
.page-opening__stage {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}
.page-opening__paper {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #fffdf8 0%, #fffaf1 60%, #fff6e9 100%);
  transform-origin: 0% 100%;
  backface-visibility: hidden;
  box-shadow: -20px 10px 40px rgba(40, 55, 80, 0.1);
  animation: po-paper var(--po-dur) cubic-bezier(0.55, 0.05, 0.3, 1) both;
  will-change: transform, clip-path, opacity;
}
/*
 *  0〜18%  ：静止（約 0.2 秒）
 *  18〜34% ：右上の角が少し浮く（角を切り取り、少し傾ける）
 *  34〜100%：左下を軸に右上からめくれていき、最後に消える
 */
@keyframes po-paper {
  0%, 18% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 100% 100%, 0 100%);
    transform: rotate3d(1, 1, 0, 0deg);
    opacity: 1;
  }
  34% {
    clip-path: polygon(0 0, 90% 0, 100% 14%, 100% 100%, 0 100%);
    transform: rotate3d(1, 1, 0, 6deg);
    opacity: 1;
  }
  70% {
    clip-path: polygon(0 0, 55% 0, 100% 62%, 100% 100%, 0 100%);
    transform: rotate3d(1, 1, 0, 38deg) translate3d(-3%, 3%, 0);
    opacity: 1;
  }
  100% {
    clip-path: polygon(0 0, 0 0, 100% 100%, 100% 100%, 0 100%);
    transform: rotate3d(1, 1, 0, 70deg) translate3d(-8%, 8%, 0);
    opacity: 0;
  }
}
/* めくれた端のあたりに見える、紙の裏側の柔らかいグラデーション */
.page-opening__curl {
  position: absolute;
  inset: 0;
  background: linear-gradient(225deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 236, 220, 0.8) 6%, rgba(40, 55, 80, 0.06) 14%, transparent 26%);
  opacity: 0;
  animation: po-curl var(--po-dur) ease-out both;
}
@keyframes po-curl {
  0%, 18% { opacity: 0; }
  34%, 80% { opacity: 1; }
  100% { opacity: 0; }
}
/* めくれていく紙の下に落ちる影（Hero 側） */
.page-opening__shadow {
  position: absolute;
  inset: 0;
  background: linear-gradient(225deg, rgba(40, 55, 80, 0.1), transparent 45%);
  opacity: 0;
  animation: po-shadow var(--po-dur) ease-out both;
}
@keyframes po-shadow {
  0%, 25% { opacity: 0; }
  55% { opacity: 1; }
  100% { opacity: 0; }
}
/* Hero の上を1回だけ流れる淡い光（白・淡い黄・淡い青） */
.page-opening__light {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.15) 42%, rgba(255, 240, 190, 0.14) 50%, rgba(200, 225, 250, 0.12) 58%, transparent 70%);
  transform: translate3d(-100%, 0, 0);
  animation: po-light calc(var(--po-dur) * 0.55) ease-in-out calc(var(--po-dur) * 0.55) both;
}
@keyframes po-light {
  from { transform: translate3d(-100%, 0, 0); opacity: 1; }
  to { transform: translate3d(100%, 0, 0); opacity: 0.6; }
}

/* 動きを減らす設定：紙は短いフェードだけ */
@media (prefers-reduced-motion: reduce) {
  .page-opening__paper {
    animation: none;
    clip-path: none;
    transform: none;
  }
  .page-opening__curl,
  .page-opening__shadow,
  .page-opening__light {
    display: none;
  }
  :global(html.is-page-opening-run .site-header),
  :global(html.is-page-opening-run .hero__frame) {
    animation: none;
  }
}
</style>
