<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import PreaiLogo from '../common/PreaiLogo.vue'

const { header, site } = lpContent
const isOpen = ref(false)
const menuButton = ref(null)
const drawer = ref(null)

const pad2 = (n) => String(n).padStart(2, '0')

function toggleMenu() {
  isOpen.value = !isOpen.value
}
function closeMenu({ returnFocus = false } = {}) {
  isOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}
function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) closeMenu({ returnFocus: true })
}

watch(isOpen, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    drawer.value?.querySelector('a')?.focus()
  }
})

// PC幅（CSSと同じ 1081px〜）ではハンバーガーを使わないので、開いたままなら閉じる
let desktopQuery
function onDesktopChange(e) {
  if (e.matches) closeMenu()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  desktopQuery = window.matchMedia('(min-width: 1081px)')
  desktopQuery.addEventListener('change', onDesktopChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  desktopQuery?.removeEventListener('change', onDesktopChange)
  document.body.style.overflow = ''
})
</script>

<template>
  <header id="top" class="site-header">
    <!-- 背景の装飾（淡い色のブロブ・ドット・葉っぱ）。文字より後ろ・クリック不可 -->
    <div class="site-header__bg" aria-hidden="true">
      <span class="hdr-blob hdr-blob--yellow-l"></span>
      <span class="hdr-blob hdr-blob--mint-l"></span>
      <span class="hdr-blob hdr-blob--pink-l"></span>
      <span class="hdr-blob hdr-blob--blue-r"></span>
      <span class="hdr-blob hdr-blob--yellow-r"></span>
      <span class="hdr-blob hdr-blob--pink-r"></span>
      <img class="hdr-dots" :src="img('common/deco-dots.svg')" alt="" />
      <img class="hdr-leaf hdr-leaf--l1" :src="img('common/deco-leaf-pair.svg')" alt="" />
      <img class="hdr-leaf hdr-leaf--l2" :src="img('common/deco-leaf.svg')" alt="" />
      <img class="hdr-leaf hdr-leaf--r1" :src="img('common/deco-leaf-pair.svg')" alt="" />
    </div>

    <div class="site-header__inner">
      <a class="site-header__logo" href="#top" @click="closeMenu()">
        <PreaiLogo class="site-header__logo-mark" :label="site.logoAlt" />
      </a>

      <!-- PCナビ：英字 → 日本語 → 色付きの短いライン -->
      <nav class="gnav" aria-label="メインメニュー">
        <ul class="gnav__list">
          <li v-for="item in header.nav" :key="item.href" class="gnav__item">
            <a class="gnav__link" :class="`accent--${item.accent || 'coral'}`" :href="item.href">
              <span v-if="item.labelEn" class="gnav__en" aria-hidden="true">{{ item.labelEn }}</span>
              <span class="gnav__ja">{{ item.label }}</span>
              <span class="gnav__line" aria-hidden="true"></span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="site-header__end">
        <!-- 表示用メッセージ（リンク・ボタンではありません） -->
        <p class="casual-talk casual-talk--header">
          <!-- 装飾（すべて絶対配置：Header の高さに影響しない） -->
          <span class="casual-talk__deco" aria-hidden="true">
            <span class="ct-brush"></span>
            <span class="ct-ray ct-ray--1"></span>
            <span class="ct-ray ct-ray--2"></span>
            <span class="ct-ray ct-ray--3"></span>
            <span class="ct-dots"></span>
            <span class="ct-circle ct-circle--pink"></span>
            <span class="ct-circle ct-circle--blue"></span>
            <img class="ct-leaf" :src="img('common/deco-leaf-pair.svg')" alt="" />
          </span>
          <!-- 文字と曲線だけをまとめて浮かせる（装飾・ブラシは動かさない） -->
          <span class="casual-talk__content">
            <span v-if="header.cta.labelEn" class="casual-talk__en" aria-hidden="true">
              <span class="casual-talk__dot"></span>{{ header.cta.labelEn }}
            </span>
            <span class="casual-talk__ja">{{ header.cta.label }}</span>
            <svg class="casual-talk__curve" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M2 10 C 40 3, 80 3, 122 10 C 134 12, 144 7, 140 4 C 136 1, 128 7, 138 11 C 156 15, 182 9, 198 4" />
            </svg>
          </span>
        </p>

        <!-- Tablet / SP のメニューボタン -->
        <button
          ref="menuButton"
          type="button"
          class="menu-trigger"
          :class="{ 'is-open': isOpen }"
          :aria-expanded="isOpen"
          aria-controls="global-drawer"
          @click="toggleMenu"
        >
          <span class="menu-trigger__text" aria-hidden="true">{{ isOpen ? header.menuCloseText : header.menuText }}</span>
          <span class="menu-trigger__lines" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
          <span class="visually-hidden">{{ isOpen ? header.menuCloseLabel : header.menuOpenLabel }}</span>
        </button>
      </div>
    </div>

    <!-- Tablet / SP メニュー -->
    <div class="drawer-layer" :class="{ 'is-open': isOpen }">
      <div class="drawer-overlay" aria-hidden="true" @click="closeMenu()"></div>
      <div
        id="global-drawer"
        ref="drawer"
        class="drawer"
        :class="{ 'is-open': isOpen }"
        :inert="!isOpen"
        :aria-hidden="!isOpen"
      >
        <!-- 背景（スクロールしない層）：パステルの光・葉・ドット・光の流れ。すべて装飾 -->
        <div class="drawer__bg" aria-hidden="true">
          <span class="m-glow m-glow--yellow"></span>
          <span class="m-glow m-glow--pink"></span>
          <span class="m-glow m-glow--blue"></span>
          <span class="m-glow m-glow--green"></span>
          <span class="m-ambient"></span>
          <span class="m-sweep"></span>
          <img class="m-leaf m-leaf--1" :src="img('common/deco-leaf.svg')" alt="" />
          <img class="m-leaf m-leaf--2" :src="img('common/deco-leaf-pair.svg')" alt="" />
          <img class="m-leaf m-leaf--3" :src="img('common/deco-leaf-pair.svg')" alt="" />
          <img class="m-leaf m-leaf--4" :src="img('common/deco-leaf.svg')" alt="" />
          <span class="m-dots m-dots--yellow"></span>
          <span class="m-dots m-dots--mint"></span>
          <span class="m-dots m-dots--blue"></span>
          <span class="m-dots m-dots--pink"></span>
        </div>

        <!-- 中身（スクロールする層） -->
        <div class="drawer__scroll">
        <nav aria-label="メニュー">
          <ol class="drawer__list">
            <li v-for="(item, index) in header.nav" :key="item.href" :style="{ '--i': index }">
              <a class="drawer__link" :class="`accent--${item.accent || 'coral'}`" :href="item.href" @click="closeMenu()">
                <span class="drawer__num" aria-hidden="true">{{ pad2(index + 1) }}</span>
                <span class="drawer__text">
                  <span v-if="item.labelEn" class="drawer__en" aria-hidden="true">{{ item.labelEn }}</span>
                  <span class="drawer__ja">{{ item.label }}</span>
                  <span class="drawer__line" aria-hidden="true"></span>
                </span>
              </a>
            </li>
          </ol>
        </nav>

        <p class="casual-talk casual-talk--drawer">
          <span class="casual-talk__deco" aria-hidden="true">
            <span class="ct-brush"></span>
            <span class="ct-ray ct-ray--1"></span>
            <span class="ct-ray ct-ray--2"></span>
            <span class="ct-ray ct-ray--3"></span>
          </span>
          <!-- 文字と曲線だけをまとめて浮かせる（装飾・ブラシは動かさない） -->
          <span class="casual-talk__content">
            <span v-if="header.cta.labelEn" class="casual-talk__en" aria-hidden="true">
              <span class="casual-talk__dot"></span>{{ header.cta.labelEn }}
            </span>
            <span class="casual-talk__ja">{{ header.cta.label }}</span>
            <svg class="casual-talk__curve" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M2 10 C 40 3, 80 3, 122 10 C 134 12, 144 7, 140 4 C 136 1, 128 7, 138 11 C 156 15, 182 9, 198 4" />
            </svg>
          </span>
        </p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  --line: rgba(31, 45, 90, 0.12);
  --en-color: #7f8fb3; /* 英字ラベル：淡いブルーグレー */
  /* ナビのアクセント色 */
  --acc-coral: #f58a80;
  --acc-mint: #4fcfc0;
  --acc-yellow: #f6d24a;
  --acc-pink: #f4a3b4;
  --acc-blue: #8cc2ec;
  position: sticky;
  top: 0;
  z-index: 100;
  /* Hero画像の地色になじむ、ごく薄いアイボリー */
  background: #fffdf7;
  box-shadow: 0 5px 18px rgba(31, 54, 105, 0.06);
}
.accent--coral { --acc: var(--acc-coral); }
.accent--mint { --acc: var(--acc-mint); }
.accent--yellow { --acc: var(--acc-yellow); }
.accent--pink { --acc: var(--acc-pink); }
.accent--blue { --acc: var(--acc-blue); }

/* ================= 背景の装飾 ================= */
.site-header__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.site-header__bg > * {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
.hdr-blob {
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--blob) 0%, color-mix(in srgb, var(--blob) 55%, transparent) 55%, transparent 100%);
  opacity: 0.55;
}
/* 左：黄・ミント・ピンク */
.hdr-blob--yellow-l { --blob: var(--color-yellow-pale); width: 340px; height: 240px; left: -60px; top: -70px; opacity: 0.9; }
.hdr-blob--mint-l { --blob: #d4f1ea; width: 260px; height: 190px; left: 200px; top: -110px; }
.hdr-blob--pink-l { --blob: var(--color-pink-pale); width: 220px; height: 170px; left: 330px; bottom: -110px; }
/* 右：水色・黄・ピンク */
.hdr-blob--blue-r { --blob: var(--color-blue-pale); width: 280px; height: 200px; right: 250px; bottom: -120px; }
.hdr-blob--yellow-r { --blob: var(--color-yellow-pale); width: 300px; height: 220px; right: 60px; top: -90px; opacity: 0.8; }
.hdr-blob--pink-r { --blob: var(--color-pink-pale); width: 260px; height: 190px; right: -60px; top: -40px; }
.hdr-dots {
  width: 72px;
  left: 20%;
  top: 10px;
  opacity: 0.35;
}
.hdr-leaf {
  transform-origin: 50% 90%;
  opacity: 0.65;
  animation: hdr-leaf-sway 11s ease-in-out infinite;
}
.hdr-leaf--l1 { width: 58px; left: -8px; bottom: -14px; rotate: 10deg; }
.hdr-leaf--l2 { width: 30px; left: 25%; bottom: -6px; rotate: -30deg; opacity: 0.55; animation-duration: 13s; animation-delay: -4s; }
.hdr-leaf--r1 { width: 54px; right: -6px; bottom: -8px; rotate: -12deg; animation-duration: 12.5s; animation-delay: -7s; }
@keyframes hdr-leaf-sway {
  0%, 100% { translate: 0 0; }
  40% { translate: 3px -4px; }
  70% { translate: -2px -2px; }
}

/* ================= レイアウト：ロゴ / ナビ / CASUAL TALK ================= */
/* 横幅を十分使う（最大1680px）。左右の列を同じ幅にしてナビを常に中央へ */
.site-header__inner {
  position: relative;
  z-index: 102;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  column-gap: clamp(16px, 2vw, 40px);
  height: var(--header-height);
  max-width: 1680px;
  margin-inline: auto;
  padding-inline: clamp(20px, 4vw, 64px);
}
.site-header__logo {
  justify-self: start;
  display: block;
}
.site-header__logo-mark {
  width: clamp(78px, 6.6vw, 100px); /* 以前 clamp(65px, 5.5vw, 84px) の約 1.2 倍 */
}
.site-header__end {
  justify-self: end;
  display: flex;
  align-items: center;
}

/* ================= PCナビ ================= */
.gnav__list {
  display: flex;
  align-items: center;
}
.gnav__item {
  position: relative;
}
/* 項目間の非常に薄い縦線 */
.gnav__item + .gnav__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 1px;
  height: 30px;
  background: var(--line);
  translate: 0 -50%;
}
.gnav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px clamp(14px, 1.9vw, 32px);
  color: var(--color-navy);
  text-decoration: none;
  white-space: nowrap;
  border-radius: 8px;
}
.gnav__en {
  color: var(--en-color);
  font-size: 0.65625rem; /* 10.5px：補足の小さなカテゴリラベル */
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1;
  transition: color 0.35s ease;
}
.gnav__ja {
  margin-top: 4px;
  font-size: clamp(0.9375rem, 0.875rem + 0.1vw, 1rem); /* 15〜16px */
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.25;
  transition: transform 0.35s ease;
}
.gnav__line {
  width: 28px;
  height: 3px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--acc);
  opacity: 0.85;
  transition: transform 0.35s ease, opacity 0.35s ease;
}
/* hover / キーボードフォーカス：文字が少し上へ、ラインが少し伸びる */
.gnav__link:hover .gnav__ja,
.gnav__link:focus-visible .gnav__ja {
  transform: translateY(-2px);
}
.gnav__link:hover .gnav__en,
.gnav__link:focus-visible .gnav__en {
  color: var(--color-navy-soft);
}
.gnav__link:hover .gnav__line,
.gnav__link:focus-visible .gnav__line {
  transform: scaleX(1.4);
  opacity: 1;
}

/* ================= CASUAL TALK（表示用メッセージ） ================= */
/*
 * 重なり順：装飾（光線・ドット・円・葉）→ 淡いブラシ背景 → 文字（＋黄色マーカー）→ ピンクの曲線
 * 装飾・ブラシ・曲線はすべて position: absolute なので、Header の高さは変わりません。
 */
.casual-talk {
  --dot-glow: 4px;
  --dot-glow-color: rgba(242, 107, 91, 0.1);
  --label-light: #f7897b;
  --curve: #f28b9b;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  cursor: default;
}
.casual-talk__deco {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.casual-talk__deco > * {
  position: absolute;
  pointer-events: none;
}

/* ---- 文字のまとまり：表示時に Fade In → その後ゆっくり浮く（translate のみ） ---- */
.casual-talk__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  animation:
    ct-content-in 0.6s ease-out both,
    ct-float 4.5s ease-in-out 1.8s infinite;
}
@keyframes ct-content-in {
  from { opacity: 0; translate: 0 4px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes ct-float {
  0%, 100% { translate: 0 0; }
  40% { translate: 0 -2px; }
  75% { translate: 0 1px; }
}

/* ---- ● CASUAL TALK ---- */
.casual-talk__en {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--color-coral);
  font-size: 0.6875rem; /* 11px */
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
  animation: casual-label-breathe 7.5s ease-in-out infinite;
}
.casual-talk__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-coral);
  animation:
    ct-dot-in 0.4s ease-out 0.05s both,
    casual-dot-pulse 4.2s ease-in-out 1.2s infinite;
}
@keyframes ct-dot-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 0.55; transform: scale(0.9); }
}

/* ---- まずは話を聞いてみる（丸ゴシックの太字：読みやすく柔らかい） ---- */
.casual-talk__ja {
  position: relative;
  z-index: 2; /* マーカーを文字の後ろ・ブラシの前に閉じ込める */
  display: inline-block;
  color: var(--color-navy);
  font-family: var(--font-heading);
  font-size: clamp(18px, 1.35vw, 23px);
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.1;
  white-space: nowrap;
}
/* 黄色の手書きマーカー（太さにムラ） */
.casual-talk__ja::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: 1%;
  right: 3%;
  bottom: 0.02em;
  height: 0.36em;
  border-radius: 40% 60% 55% 45% / 70% 45% 55% 30%;
  background:
    radial-gradient(60% 90% at 20% 60%, var(--color-yellow) 0 55%, transparent 75%),
    radial-gradient(55% 80% at 70% 40%, var(--color-yellow) 0 50%, transparent 72%),
    linear-gradient(90deg, color-mix(in srgb, var(--color-yellow) 45%, transparent), color-mix(in srgb, var(--color-yellow) 80%, transparent) 50%, color-mix(in srgb, var(--color-yellow) 35%, transparent));
  opacity: 0.7;
  rotate: -1deg;
  transition: opacity 0.35s ease;
}

/* ---- 淡いブラシ背景：ピンク → 黄 → 水色（端をぼかして「横に引いたブラシ」に） ---- */
.ct-brush {
  top: 13px;
  bottom: -9px;
  left: -18px;
  right: -16px;
  border-radius: 38% 62% 44% 56% / 58% 36% 64% 42%;
  background: linear-gradient(90deg, rgba(255, 190, 202, 0.55), rgba(255, 236, 170, 0.6) 45%, rgba(190, 222, 250, 0.55) 90%);
  background-size: 180% 100%;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%);
  opacity: 0.65;
  rotate: -1.5deg;
  transition: opacity 0.35s ease;
  animation: ct-brush-drift 10s ease-in-out infinite alternate;
}

/* ---- ピンク〜コーラルの手書き曲線（小さなループ付き） ---- */
.casual-talk__curve {
  position: absolute;
  z-index: 3;
  left: 6%;
  right: -6%;
  bottom: -10px;
  width: auto;
  height: 10px;
  overflow: visible;
  pointer-events: none;
  transform-origin: left center;
  transition: transform 0.35s ease;
}
.casual-talk__curve path {
  fill: none;
  stroke: var(--curve);
  stroke-width: 2;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  /* 左→右へ描く → 少し表示 → ゆっくり消える → 少し待つ、を 6.5 秒ごとにずっと繰り返す */
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: ct-curve-loop 6.5s ease-in-out 0.3s infinite both;
}
/*
 * 6.5s の内訳：
 *  0〜1.2s   描画（左→右）
 *  1.2〜4.0s 完成した線を表示
 *  4.0〜4.6s フェードアウト
 *  4.6〜6.5s 何もない時間（見えない間に描画前の位置へ戻す）
 */
@keyframes ct-curve-loop {
  0% { stroke-dashoffset: 1; opacity: 0; }
  3% { opacity: 0.85; }
  18.5% { stroke-dashoffset: 0; opacity: 0.85; }
  61.5% { stroke-dashoffset: 0; opacity: 0.85; }
  70.8% { stroke-dashoffset: 0; opacity: 0; }
  72% { stroke-dashoffset: 1; opacity: 0; }
  100% { stroke-dashoffset: 1; opacity: 0; }
}

/* ---- 左の光線（コーラル・ピンク・黄）／黄色のドット／右の淡い円・葉 ---- */
.ct-ray {
  width: 11px;
  height: 3px;
  border-radius: 999px;
  transform-origin: right center;
  /* 1本ずつ「パッ」と表示 → 数秒ごとに小さく脈打つ */
  animation:
    ct-ray-in 0.45s cubic-bezier(0.34, 1.3, 0.64, 1) var(--ray-delay, 0.15s) both,
    ct-ray-pulse 5s ease-in-out calc(var(--ray-delay, 0.15s) + 1.6s) infinite,
    ct-ray-sway 4.8s ease-in-out var(--ray-sway-delay, 0s) infinite;
}
@keyframes ct-ray-in {
  from { opacity: 0; scale: 0.3; }
  to { opacity: 1; scale: 1; }
}
@keyframes ct-ray-pulse {
  0%, 70%, 100% { opacity: 1; scale: 1; }
  80% { opacity: 0.75; scale: 0.95; }
  90% { opacity: 1; scale: 1.05; }
}
.ct-ray--1 { --ray-delay: 0.15s; left: -26px; top: 2px; background: var(--color-coral); rotate: 38deg; }
.ct-ray--2 { --ray-delay: 0.3s; --ray-sway-delay: -1.2s; left: -30px; top: 16px; background: #f7a9b6; rotate: 8deg; width: 12px; }
.ct-ray--3 { --ray-delay: 0.45s; --ray-sway-delay: -2.4s; left: -26px; top: 29px; background: var(--color-yellow); rotate: -22deg; width: 9px; }
.ct-dots {
  left: -34px;
  bottom: -12px;
  width: 30px;
  height: 6px;
  background: radial-gradient(circle, var(--color-yellow) 0 2px, transparent 2.5px) 0 0 / 8px 6px repeat-x;
  opacity: 0.65;
  rotate: -14deg;
}
.ct-circle {
  border-radius: 50%;
}
.ct-circle--pink {
  width: 30px;
  height: 30px;
  right: -34px;
  top: -6px;
  background: #f7a9b6;
  opacity: 0.18;
}
.ct-circle--blue {
  width: 12px;
  height: 12px;
  right: -44px;
  top: 22px;
  background: #8cc2ec;
  opacity: 0.2;
}
.ct-leaf {
  width: 22px;
  right: -40px;
  bottom: -14px;
  opacity: 0.8;
  transform-origin: 50% 90%;
  animation: hdr-leaf-sway 11s ease-in-out -3s infinite;
}

/* ---- PC hover：ブラシが少し明るく・曲線が少し伸びる・マーカーが少し強く ---- */
@media (hover: hover) and (pointer: fine) {
  .casual-talk--header:hover .ct-brush {
    opacity: 0.85;
  }
  .casual-talk--header:hover .casual-talk__curve {
    transform: scaleX(1.06);
  }
  .casual-talk--header:hover .casual-talk__ja::after {
    opacity: 0.9;
  }
}

@keyframes casual-dot-pulse {
  0%, 100% { opacity: 0.55; transform: scale(0.9); box-shadow: 0 0 0 0 var(--dot-glow-color); }
  50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 0 var(--dot-glow) var(--dot-glow-color); }
}
@keyframes casual-label-breathe {
  0%, 100% { color: var(--color-coral); }
  50% { color: var(--label-light); }
}
@keyframes ct-brush-drift {
  0% { background-position: 0% 0; }
  100% { background-position: 100% 0; }
}
@keyframes ct-ray-sway {
  0%, 100% { translate: 0 0; }
  50% { translate: -2px -1px; }
}

/* ================= メニューボタン（MENU ＋ 2本線） ================= */
.menu-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 4px 8px 12px;
  border: 0;
  background: none;
  color: var(--color-navy);
}
.menu-trigger__text {
  min-width: 3.4em;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  line-height: 1;
  text-align: right;
}
.menu-trigger__lines {
  position: relative;
  display: block;
  width: 26px;
  height: 10px;
}
.menu-trigger__lines > span {
  position: absolute;
  right: 0;
  height: 1.5px;
  border-radius: 1px;
  background: currentColor;
  transition: transform 0.3s ease, width 0.3s ease, top 0.3s ease;
}
.menu-trigger__lines > span:nth-child(1) { top: 0; width: 26px; }
.menu-trigger__lines > span:nth-child(2) { top: 8.5px; width: 17px; }
.menu-trigger:hover .menu-trigger__lines > span:nth-child(2) { width: 26px; }
.menu-trigger.is-open .menu-trigger__lines > span { top: 4.25px; width: 24px; }
.menu-trigger.is-open .menu-trigger__lines > span:nth-child(1) { transform: rotate(35deg); }
.menu-trigger.is-open .menu-trigger__lines > span:nth-child(2) { transform: rotate(-35deg); }
.menu-trigger__lines {
  transition: rotate 0.3s ease;
}
/* × を押したときだけ少し回転 */
.menu-trigger.is-open:active .menu-trigger__lines {
  rotate: 90deg;
}

/* ================= Tablet / SP メニュー ================= */
.drawer-layer {
  position: fixed;
  inset: 0;
  z-index: 101;
  overflow: hidden;
  pointer-events: none;
}
.drawer-layer.is-open {
  pointer-events: auto;
}
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(420px, 100%);
  height: 100dvh;
  background: #fffdf8;
  box-shadow: -12px 0 40px rgba(31, 45, 90, 0.08);
  overflow: hidden; /* スクロールは中の .drawer__scroll が担当（背景は固定） */
  opacity: 0;
  transform: translateX(24px);
  visibility: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
}
.drawer.is-open {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s;
}
.drawer__scroll {
  position: relative;
  z-index: 1; /* 背景・装飾より前 */
  height: 100%;
  padding: calc(var(--header-height) + 20px) clamp(24px, 6vw, 40px) 48px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* ---------- メニュー背景：アイボリー＋4色のパステルの光（境界の見えない柔らかい光） ---------- */
.drawer__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.drawer__bg > * {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
.m-glow {
  border-radius: 50%;
  will-change: transform;
}
/* 黄：上〜中央 / ピンク：右上〜右中央 / 水色：中央〜右下 / 緑：左下〜中央下 */
.m-glow--yellow {
  width: 110%; aspect-ratio: 1; left: -40%; top: -18%;
  background: radial-gradient(closest-side, rgba(255, 217, 90, 0.24), rgba(255, 217, 90, 0.08) 55%, transparent);
  animation: m-glow-a 16s ease-in-out infinite alternate;
}
.m-glow--pink {
  width: 95%; aspect-ratio: 1; right: -45%; top: 8%;
  background: radial-gradient(closest-side, rgba(255, 159, 165, 0.22), rgba(255, 159, 165, 0.07) 55%, transparent);
  animation: m-glow-b 18s ease-in-out -4s infinite alternate;
}
.m-glow--blue {
  width: 105%; aspect-ratio: 1; right: -40%; top: 48%;
  background: radial-gradient(closest-side, rgba(143, 189, 240, 0.22), rgba(143, 189, 240, 0.07) 55%, transparent);
  animation: m-glow-a 20s ease-in-out -9s infinite alternate-reverse;
}
.m-glow--green {
  width: 110%; aspect-ratio: 1; left: -45%; bottom: -22%;
  background: radial-gradient(closest-side, rgba(143, 209, 158, 0.24), rgba(143, 209, 158, 0.08) 55%, transparent);
  animation: m-glow-b 17s ease-in-out -6s infinite alternate;
}
@keyframes m-glow-a {
  from { transform: translate3d(-4%, 0, 0); }
  to { transform: translate3d(5%, -4%, 0); }
}
@keyframes m-glow-b {
  from { transform: translate3d(3%, 2%, 0); }
  to { transform: translate3d(-5%, -3%, 0); }
}
/* 淡い光がゆっくり漂う（Ambient Glow） */
.m-ambient {
  width: 90%; aspect-ratio: 1; left: 5%; top: 22%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 250, 225, 0.7), transparent);
  opacity: 0.8;
  animation: m-ambient 14s ease-in-out infinite;
}
@keyframes m-ambient {
  0%, 100% { transform: translate3d(-3%, 0, 0); }
  50% { transform: translate3d(3%, -2%, 0); }
}
/* 左上→右下へ淡い光が流れる（10秒に1回・流れた後は休む） */
.m-sweep {
  top: -20%; bottom: -20%; left: 0;
  width: 70%;
  background: linear-gradient(115deg, transparent 25%, rgba(255, 255, 255, 0.38) 50%, transparent 75%);
  transform: translate3d(-130%, 0, 0);
  animation: m-sweep 10s ease-in-out 1.2s infinite;
}
@keyframes m-sweep {
  0% { transform: translate3d(-130%, -4%, 0); }
  35%, 100% { transform: translate3d(170%, 4%, 0); }
}
/* 葉っぱ（既存素材）：1枚ずつ違う周期・開始でゆっくり漂う */
.m-leaf {
  opacity: 0.3;
  transform-origin: 50% 90%;
  animation: m-leaf-float 8s ease-in-out infinite;
}
.m-leaf--1 { width: 34px; right: 12%; top: 21%; rotate: 18deg; animation-duration: 7s; animation-delay: -1s; }
.m-leaf--2 { width: 54px; right: 5%; top: 50%; rotate: -12deg; opacity: 0.26; animation-duration: 9s; animation-delay: -3s; }
.m-leaf--3 { width: 58px; left: 4%; bottom: 7%; rotate: 8deg; opacity: 0.32; animation-duration: 8s; animation-delay: -5s; }
.m-leaf--4 { width: 30px; right: 14%; bottom: 13%; rotate: -24deg; opacity: 0.24; animation-duration: 10s; animation-delay: -2s; }
@keyframes m-leaf-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
  50% { transform: translate3d(5px, -10px, 0) rotate(5deg); }
}
/* 小さなドット（空いている右側・下部だけ） */
.m-dots {
  width: 34px;
  height: 20px;
  background: radial-gradient(circle, var(--dot) 0 2px, transparent 2.5px) 0 0 / 9px 10px;
  opacity: 0.4;
  animation: m-dot-pulse 5s ease-in-out infinite;
}
.m-dots--yellow { --dot: var(--color-yellow); right: 26%; top: 14%; }
.m-dots--mint { --dot: var(--color-green); right: 20%; top: 38%; animation-duration: 6s; animation-delay: -2s; }
.m-dots--blue { --dot: var(--color-blue); right: 9%; top: 66%; animation-duration: 4.5s; animation-delay: -1s; }
.m-dots--pink { --dot: var(--color-pink); left: 22%; bottom: 4%; animation-duration: 7s; animation-delay: -3s; }
@keyframes m-dot-pulse {
  0%, 100% { opacity: 0.25; scale: 0.95; }
  50% { opacity: 0.55; scale: 1.05; }
}
/* メニューを閉じている間は背景アニメーションを止める（負荷軽減） */
.drawer:not(.is-open) .drawer__bg > * {
  animation-play-state: paused;
}

.drawer__list {
  border-top: 1px solid var(--line);
}
.drawer__list > li {
  border-bottom: 1px solid var(--line);
}
.drawer__link {
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  padding: 18px 4px;
  color: var(--color-navy);
  text-decoration: none;
}
.drawer__num {
  align-self: start;
  padding-top: 2px;
  color: var(--color-coral);
  font-family: var(--font-number);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
}
.drawer__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}
.drawer__en {
  color: var(--en-color);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1;
}
.drawer__ja {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.3;
  transition: color 0.25s ease;
}
.drawer__line {
  width: 24px;
  height: 3px;
  margin-top: 3px;
  border-radius: 999px;
  background: var(--acc);
}
.drawer__link:hover .drawer__ja,
.drawer__link:focus-visible .drawer__ja {
  color: var(--color-coral-dark);
}
/* メニューを開いたときだけ：01→05 の順にふわっと表示 → 下線が左→右へ */
.drawer.is-open .drawer__list > li {
  animation: m-nav-in 0.42s ease-out calc(0.08s + var(--i, 0) * 0.06s) both;
}
.drawer__line {
  transform-origin: left center;
}
.drawer.is-open .drawer__line {
  animation: m-line-in 0.4s ease-out calc(0.3s + var(--i, 0) * 0.06s) both;
}
@keyframes m-nav-in {
  from { opacity: 0; transform: translate3d(0, 6px, 0); }
  to { opacity: 1; transform: none; }
}
@keyframes m-line-in {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
/* メニュー内の CTA の3本線：PC と同じアニメーションを、開いたときに実行 */
.casual-talk--drawer .ct-ray {
  animation: none;
}
.drawer.is-open .casual-talk--drawer .ct-ray {
  animation:
    ct-ray-in 0.45s cubic-bezier(0.34, 1.3, 0.64, 1) calc(var(--ray-delay, 0.15s) + 0.35s) both,
    ct-ray-pulse 5s ease-in-out calc(var(--ray-delay, 0.15s) + 2s) infinite,
    ct-ray-sway 4.8s ease-in-out var(--ray-sway-delay, 0s) infinite;
}
.casual-talk--drawer .ct-ray--1 { top: 1px; }
.casual-talk--drawer .ct-ray--2 { top: 14px; }
.casual-talk--drawer .ct-ray--3 { top: 27px; }
/* SPメニュー下の CASUAL TALK：テキスト＋黄色マーカー（ボタンにはしない） */
.casual-talk--drawer {
  --dot-glow: 2.5px;
  --dot-glow-color: rgba(242, 107, 91, 0.08);
  margin-top: 32px;
  gap: 6px;
}
.casual-talk--drawer {
  align-self: flex-start;
  margin-left: 26px; /* 左の3本線の分 */
}
.casual-talk--drawer .casual-talk__ja {
  font-size: 1.25rem;
}
.casual-talk--drawer .ct-brush {
  opacity: 0.45;
}
.casual-talk--drawer .casual-talk__content {
  animation: ct-float 4.5s ease-in-out infinite;
}
.casual-talk--drawer .casual-talk__curve path {
  animation: none;
  opacity: 0.85;
}
/* メニューを開いている間：同じループを繰り返す */
.drawer.is-open .casual-talk--drawer .casual-talk__curve path {
  animation: ct-curve-loop 6.5s ease-in-out 0.35s infinite both;
}
.drawer-overlay {
  position: absolute;
  inset: 0;
  background: rgba(31, 45, 90, 0.28);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s;
}
.drawer-layer.is-open .drawer-overlay {
  opacity: 1;
  visibility: visible;
}

/* ================= Responsive ================= */
/* PC（1081px〜）：ナビ表示・メニューボタン非表示 */
@media (min-width: 1081px) {
  .menu-trigger,
  .drawer-layer {
    display: none;
  }
}
/* ナビ5項目のまとまりだけを少し右へ（ロゴ・CTA は動かさない。CTA との間隔を確保できる幅だけ） */
@media (min-width: 1600px) {
  .gnav { translate: 24px 0; }
}
@media (min-width: 1440px) and (max-width: 1599px) {
  .gnav { translate: 18px 0; }
}
@media (min-width: 1200px) and (max-width: 1439px) {
  .gnav { translate: 12px 0; }
}
/* 小さめのPC：余白と文字を詰める */
@media (max-width: 1280px) {
  .gnav__link {
    padding-inline: clamp(10px, 1.2vw, 18px);
  }
  .casual-talk--header .casual-talk__ja {
    font-size: 18px;
  }
  .ct-dots,
  .ct-circle--blue {
    display: none;
  }
}
/* Tablet / SP（〜1080px）：ロゴ＋メニューボタンだけのシンプルなHeader */
@media (max-width: 1080px) {
  .site-header__inner {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .gnav,
  .casual-talk--header {
    display: none;
  }
  .hdr-blob--pink-l,
  .hdr-blob--blue-r,
  .hdr-leaf--l2,
  .hdr-dots {
    display: none;
  }
}
@media (max-width: 600px) {
  .site-header__logo-mark {
    width: 64px; /* 以前 56px の約 1.15 倍 */
  }
  .drawer {
    width: 100%;
    box-shadow: none;
  }
  .hdr-leaf--l1 {
    width: 40px;
  }
  .hdr-leaf--r1 {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hdr-leaf,
  .casual-talk__en,
  .casual-talk__dot,
  .casual-talk__ja,
  .drawer__bg > *,
  .drawer.is-open .drawer__list > li,
  .drawer.is-open .drawer__line,
  .drawer.is-open .casual-talk--drawer .ct-ray,
  .casual-talk--drawer .casual-talk__content,
  .ct-brush,
  .ct-ray,
  .ct-leaf,
  .casual-talk__content,
  .casual-talk__curve path,
  .drawer.is-open .casual-talk--drawer .casual-talk__curve path {
    animation: none;
  }
  .casual-talk__curve path {
    stroke-dashoffset: 0;
    opacity: 0.85;
  }
  .m-sweep {
    display: none;
  }
  .menu-trigger__lines {
    transition: none;
  }
  .casual-talk__dot {
    opacity: 1;
  }
  .gnav__ja,
  .gnav__line {
    transition: none;
  }
}
</style>
