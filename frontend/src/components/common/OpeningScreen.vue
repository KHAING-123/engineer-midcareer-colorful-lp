<script setup>
/**
 * オープニング（ページを開いたときに1回だけ）
 *  ロゴ → 英文（1文字ずつ）→ AI × CAREER × GROWTH → 少し静止 → 紙が右から左へめくれて Hero が現れる。
 *
 * ■ 紙のしくみ（CSS 3D）
 *  紙を縦に3枚（左から 50% / 30% / 20%）に分け、蝶番のように順につないでいます。
 *    ・1枚目：画面の左端を軸に rotateY（本のページと同じ回り方）
 *    ・2枚目・3枚目：前の紙の右端を軸に、さらに少しずつ rotateY
 *  → 右端ほど大きく回るので、紙の端が先に浮き上がり、なめらかに曲がって見えます。
 *  90° を超えた部分は裏面（淡いアイボリー）が見えます。
 *  各面に同じ内容（OpeningSheet）を置き、見える部分だけ切り出しているので、静止中は1枚の紙に見えます。
 *
 * ■ 動かし方
 *  めくりは Web Animations API。全レイヤー（紙・陰影・端の光・Hero に落ちる影）に
 *  同じ長さ・同じイージングをかけ、ずれずに動かします（transform / opacity のみ）。
 *
 * ■ ページ本体との連携
 *  html.is-opening      … 演出中。スクロール停止
 *  html.is-opening-hold … 紙が閉じている間。Header / Hero のアニメーションを一時停止
 *  めくり開始時に hold を外し、'lp:opening-release' を送って v-reveal を開始（reveal.js）
 *
 *  この部品を App.vue から外せば、演出ごと無くなります。
 */
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import OpeningSheet from './OpeningSheet.vue'
import { HOLD_CLASS as HOLD, RELEASE_EVENT } from '../../utils/opening.js'

/* ---- 時間（ms）：ロゴ 0.6s → 英文 1.2s → 小見出し 0.5s → 静止 0.5s → めくり 2.0s ---- */
const T = {
  logoDelay: 100,
  logoDur: 600,
  textDelay: 550,
  charDur: 550,
  charStep: 20, // 1文字ごとの時間差（33文字 → 約1.2秒）
  subDelay: 1750,
  subDur: 500,
  hold: 500,
  turnPc: 2000,
  turnSp: 1700,
}
const INTRO_END = T.subDelay + T.subDur + T.hold // めくり開始（2.75s）
const TURN_EASING = 'cubic-bezier(0.42, 0, 0.32, 1)'
const CLASS = 'is-opening'

/* ---- 紙の分割（幅の割合）と、端の曲がりの配分 ---- */
const SEGS = [0.5, 0.3, 0.2]
const CURL_SHARE = [0, 0.42, 0.58] // 曲がりのうち、2枚目・3枚目が受け持つ割合
const OFFSETS = SEGS.map((_, i) => SEGS.slice(0, i).reduce((s, w) => s + w, 0))

// 各面の位置（つなぎ目は 1px 重ねて隙間を出さない）
const segStyle = (i) =>
  i === 0
    ? { left: '0', width: `${SEGS[0] * 100}vw` }
    : { left: 'calc(100% - 1px)', width: `calc(${SEGS[i] * 100}vw + 1px)`, transformOrigin: '1px 50%' }
const sheetStyle = (i) => (i === 0 ? {} : { left: `calc(${-OFFSETS[i] * 100}vw + 1px)` })

const done = ref(false)
const playing = ref(false)
const turning = ref(false)
const root = ref(null)
const segs = []
const shades = []
const backs = []
const edgeLight = ref(null)
const castShadow = ref(null)

const cssVars = {
  '--op-logo-delay': `${T.logoDelay}ms`,
  '--op-logo-dur': `${T.logoDur}ms`,
  '--op-text-delay': `${T.textDelay}ms`,
  '--op-char-dur': `${T.charDur}ms`,
  '--op-char-step': `${T.charStep}ms`,
  '--op-sub-delay': `${T.subDelay}ms`,
  '--op-sub-dur': `${T.subDur}ms`,
}

const timers = new Set()
const later = (fn, ms) => {
  const id = window.setTimeout(() => {
    timers.delete(id)
    fn()
  }, ms)
  timers.add(id)
}
let animations = []
let introDone = false
let heroReady = false
let released = false

// 描画前に付ける（最初の表示から紙が覆い、スクロールも止まる）
if (typeof document !== 'undefined') document.documentElement.classList.add(CLASS, HOLD)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Header / Hero のアニメーションと v-reveal を開始（めくり始めと同時） */
function release() {
  if (released) return
  released = true
  document.documentElement.classList.remove(HOLD)
  window.dispatchEvent(new Event(RELEASE_EVENT))
}

function finish() {
  if (done.value) return
  release()
  done.value = true
  document.documentElement.classList.remove(CLASS)
  timers.forEach(clearTimeout)
  timers.clear()
  animations.forEach((a) => a.cancel())
  animations = []
  removeSkipListeners()
}

/* ================= めくりのキーフレームを作る ================= */
const rad = (d) => (d * Math.PI) / 180
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (v) => v * v * (3 - 2 * v)
const ramp = (p, from, to) => smooth(clamp01((p - from) / (to - from)))

// p（0〜1）ごとの角度。イージングは animate() 側で全体に一括でかける
// 紙の端は p ≒ 0.85 で画面の左へ抜けるので、縮めて「抜けた瞬間 = 演出の終わり」にする（SP は細い紙が早く見えなくなるため短め）
const EXIT_AT = { pc: 0.88, sp: 0.78 }
function angles(progress, sp) {
  const p = progress * (sp ? EXIT_AT.sp : EXIT_AT.pc)
  // 1枚目（左端が軸）：最初は少しだけ → 最後は 95° 前後（真横を越えて画面外へ）
  const base = 1.5 * ramp(p, 0, 0.12) + 94 * Math.pow(clamp01((p - 0.06) / 0.94), 1.12)
  // 端の曲がり：まず端が浮き上がり → 大きく曲がり → 最後は少し戻る
  const curlMax = sp ? 90 : 112
  const curl = 30 * ramp(p, 0, 0.12) + (curlMax - 30) * ramp(p, 0.08, 0.5) - (curlMax - 40) * ramp(p, 0.5, 1)
  return SEGS.map((_, i) => (i === 0 ? base : curl * CURL_SHARE[i]))
}

function buildKeyframes(W, sp) {
  const P = W * 2.6 // perspective（紙の端が手前に来すぎないよう、幅の 2.6 倍）
  const cx = W / 2
  const project = (x, z) => cx + ((x - cx) * P) / (P - z)
  const N = sp ? 20 : 30
  const k = { segs: SEGS.map(() => []), shades: SEGS.map(() => []), backs: SEGS.map(() => []), light: [], shadow: [] }

  for (let i = 0; i <= N; i++) {
    const p = i / N
    const rel = angles(p, sp)
    let total = 0
    let x = 0
    let z = 0
    let edge = 0
    const totals = []
    rel.forEach((deg, s) => {
      total += deg
      totals.push(total)
      k.segs[s].push({ offset: p, transform: `rotateY(${(-deg).toFixed(2)}deg)` })
      // 紙の各つなぎ目・端の位置（3D）→ 画面上の x。一番右が「めくれの端」
      x += W * SEGS[s] * Math.cos(rad(total))
      z += W * SEGS[s] * Math.sin(rad(total))
      edge = Math.max(edge, project(x, z))
    })
    const last = totals[totals.length - 1]
    // 陰影：正面から光が当たる想定。傾くほど少し暗く。1枚目は覆いかぶさる紙の影も受ける
    totals.forEach((deg, s) => {
      const tilt = 1 - Math.max(0, Math.cos(rad(deg)))
      const covered = s === 0 ? 0.3 * ramp(last, 70, 130) : 0
      k.shades[s].push({ offset: p, opacity: Math.min(0.6, 0.42 * tilt + covered).toFixed(3) })
      k.backs[s].push({ offset: p, opacity: Math.min(0.5, 0.5 * (1 - Math.abs(Math.cos(rad(deg))))).toFixed(3) })
    })
    // 紙の端の柔らかい光：浮き上がる瞬間に強く、めくれるにつれて消える
    k.light.push({ offset: p, opacity: (ramp(p, 0, 0.1) * (1 - ramp(p, 0.22, 0.55))).toFixed(3) })
    // Hero に落ちる影：めくれの端のすぐ右
    k.shadow.push({
      offset: p,
      transform: `translate3d(${edge.toFixed(1)}px, 0, 0)`,
      opacity: (ramp(p, 0, 0.1) * (1 - ramp(p, 0.7, 0.95))).toFixed(3),
    })
  }
  return { k, P }
}

/* ================= 進行 ================= */
function startTurn() {
  if (turning.value || done.value) return
  turning.value = true
  release()

  if (reducedMotion()) {
    // 動きを減らす設定：めくらず、0.5 秒で静かに薄くする
    const anim = root.value?.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: 'ease-out', fill: 'forwards' })
    if (anim) {
      animations.push(anim)
      anim.finished.then(finish, finish)
    } else finish()
    return
  }

  const W = window.innerWidth
  const sp = W < 768
  const { k, P } = buildKeyframes(W, sp)
  root.value.style.setProperty('--op-perspective', `${P}px`)

  const opts = { duration: sp ? T.turnSp : T.turnPc, easing: TURN_EASING, fill: 'forwards' }
  const pairs = [[edgeLight.value, k.light], [castShadow.value, k.shadow]]
  SEGS.forEach((_, i) => pairs.unshift([segs[i], k.segs[i]], [shades[i], k.shades[i]], [backs[i], k.backs[i]]))
  // 1枚目には裏面が無いなど、要素が無いものは飛ばす
  animations = pairs.filter(([el]) => el?.animate).map(([el, frames]) => el.animate(frames, opts))
  if (!animations.length) return finish()
  animations[0].finished.then(finish, finish)
}

// 文字が出そろい、Hero 画像も表示できる状態になったらめくる
function tryTurn() {
  if (introDone && heroReady) startTurn()
}

function waitHero() {
  const hero = document.querySelector('.hero__image')
  const ready = () => {
    heroReady = true
    tryTurn()
  }
  if (!hero) return ready()
  const decoded = () => (hero.decode ? hero.decode().catch(() => {}) : Promise.resolve())
  if (hero.complete && hero.naturalWidth) decoded().then(ready)
  else {
    hero.addEventListener('load', () => decoded().then(ready), { once: true })
    hero.addEventListener('error', ready, { once: true })
  }
  later(ready, INTRO_END + 2000) // 画像が遅くても待ちすぎない
}

/* クリック・タップ・キー・スクロール操作で、すぐにめくる */
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchmove']
function onSkip() {
  introDone = true
  heroReady = true
  startTurn()
}
function removeSkipListeners() {
  SKIP_EVENTS.forEach((e) => window.removeEventListener(e, onSkip))
}

onMounted(async () => {
  // 再読み込み時も Hero から始める（ページ内リンク付きの URL は除く）
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  if (!location.hash) window.scrollTo(0, 0)

  await nextTick()
  // フォントを待ってから文字を出す（途中で書体が切り替わらないように）。最大 0.8 秒
  if (document.fonts?.ready) {
    await Promise.race([document.fonts.ready, new Promise((r) => later(r, 800))])
  }
  if (done.value) return
  // 2フレーム待ってから開始（初期状態が確実に描画されてから動かす）
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (done.value) return
      playing.value = true
      waitHero()
      later(() => {
        introDone = true
        tryTurn()
      }, reducedMotion() ? 1200 : INTRO_END)
      SKIP_EVENTS.forEach((e) => window.addEventListener(e, onSkip, { passive: true }))
    }),
  )
  // 何があっても 12 秒後には必ず終了（スクロールが止まったままにならないように）
  later(finish, 12000)
})
onBeforeUnmount(finish)
</script>

<template>
  <div v-if="!done" ref="root" class="opening" :class="{ 'is-turning': turning }" :style="cssVars" aria-hidden="true">
    <!-- めくれる紙の下（Hero 側）に落ちる影 -->
    <div ref="castShadow" class="opening__cast"></div>

    <div class="opening__stage">
      <!-- 1枚目（画面の左端が軸） -->
      <div :ref="(el) => (segs[0] = el)" class="opening__seg" :style="segStyle(0)">
        <div class="opening__face">
          <OpeningSheet class="opening__sheet" :style="sheetStyle(0)" :playing="playing" :still="turning" />
          <div :ref="(el) => (shades[0] = el)" class="opening__shade opening__shade--base"></div>
        </div>

        <!-- 2枚目（1枚目の右端が軸） -->
        <div :ref="(el) => (segs[1] = el)" class="opening__seg" :style="segStyle(1)">
          <div class="opening__face">
            <OpeningSheet class="opening__sheet" :style="sheetStyle(1)" :playing="playing" :still="turning" />
            <div :ref="(el) => (shades[1] = el)" class="opening__shade opening__shade--fold"></div>
          </div>
          <div class="opening__face opening__face--back">
            <div :ref="(el) => (backs[1] = el)" class="opening__shade opening__shade--back"></div>
          </div>

          <!-- 3枚目（紙の端。2枚目の右端が軸） -->
          <div :ref="(el) => (segs[2] = el)" class="opening__seg" :style="segStyle(2)">
            <div class="opening__face">
              <OpeningSheet class="opening__sheet" :style="sheetStyle(2)" :playing="playing" :still="turning" />
              <div :ref="(el) => (shades[2] = el)" class="opening__shade opening__shade--fold"></div>
              <div ref="edgeLight" class="opening__edge-light"></div>
            </div>
            <div class="opening__face opening__face--back">
              <div :ref="(el) => (backs[2] = el)" class="opening__shade opening__shade--back"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== 演出中だけ有効（この部品が html に付けるクラス） ===== */
html.is-opening,
html.is-opening body {
  overflow: hidden;
}
/* 紙が閉じている間は Header / Hero の動きを止め、めくれ始めたら動き出す */
html.is-opening-hold .site-header,
html.is-opening-hold .site-header *,
html.is-opening-hold .site-header *::before,
html.is-opening-hold .site-header *::after,
html.is-opening-hold .hero * {
  animation-play-state: paused !important;
}
</style>

<style scoped>
.opening {
  position: fixed;
  inset: 0;
  z-index: 10000;
  overflow: hidden;
  pointer-events: none;
}

/* ---------- 紙 ---------- */
.opening__stage {
  position: absolute;
  inset: 0;
  perspective: var(--op-perspective, 3000px);
  perspective-origin: 50% 50%;
}
.opening__seg {
  position: absolute;
  top: 0;
  bottom: 0;
  transform-origin: 0 50%;
  transform-style: preserve-3d;
}
.opening__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
/* 印刷内容は画面幅のまま置き、各面で見える部分だけを切り出す */
.opening__sheet {
  right: auto;
  width: 100vw;
}

/* 裏面：淡いアイボリー（紙の繊維のような、ごく淡いグラデーション） */
.opening__face--back {
  transform: rotateY(180deg);
  background: linear-gradient(90deg, #fbf2e2 0%, #fff8ec 35%, #fffaf2 70%, #f7eddc 100%);
}

/* 陰影（opacity を JS のキーフレームで変える） */
.opening__shade {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
.opening__shade--base {
  /* 右側（めくれの下）ほど暗い */
  background: linear-gradient(90deg, rgba(23, 43, 88, 0.06) 0%, rgba(23, 43, 88, 0.18) 70%, rgba(23, 43, 88, 0.36) 100%);
}
.opening__shade--fold {
  background: linear-gradient(90deg, rgba(23, 43, 88, 0.3) 0%, rgba(23, 43, 88, 0.16) 50%, rgba(23, 43, 88, 0.1) 100%);
}
.opening__shade--back {
  background: linear-gradient(90deg, rgba(110, 85, 50, 0.1) 0%, rgba(110, 85, 50, 0.26) 100%);
}
/* 紙の端の柔らかい光 */
.opening__edge-light {
  position: absolute;
  inset: 0 0 0 auto;
  width: 40%;
  opacity: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 70%, rgba(255, 252, 240, 0.95) 97%, rgba(23, 43, 88, 0.1) 100%);
  pointer-events: none;
}

/* ---------- Hero に落ちる影（めくれの端のすぐ右） ---------- */
.opening__cast {
  position: absolute;
  inset: 0 auto 0 0;
  width: min(36vw, 420px);
  opacity: 0;
  background: linear-gradient(90deg, rgba(23, 43, 88, 0.26) 0%, rgba(23, 43, 88, 0.1) 35%, rgba(23, 43, 88, 0) 100%);
}

/* めくっている間だけ GPU レイヤー化 */
.opening.is-turning .opening__seg,
.opening.is-turning .opening__cast {
  will-change: transform;
}
</style>
