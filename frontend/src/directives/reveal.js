/**
 * Scroll Reveal（v-reveal ディレクティブ）
 *
 * 使い方（テンプレート内）：
 *   <div v-reveal>                                  … 下からふわっと表示
 *   <div v-reveal="{ delay: 100 }">                 … 100ms 遅らせる
 *   <li  v-reveal="{ i: index }">                   … 並んだカードを順番に（間隔は reveal.css の --reveal-step）
 *   <div v-reveal="{ variant: 'fade' }">            … 位置を動かさずフェードのみ（transform を使う要素用）
 *   <figure v-reveal="{ variant: 'left' }">          … 左から少しだけ（24px）
 *
 * ・要素は最初から DOM にあり、CSS の opacity / transform だけで表示します（SEO・読み上げに影響なし）。
 * ・画面に入ったら1回だけ表示し、その後は監視をやめます。
 * ・見た目は src/assets/styles/reveal.css で管理しています。
 */

import { isOpeningHold, RELEASE_EVENT } from '../utils/opening.js'

let observer = null
const pending = new Set()
// オープニングの紙が閉じている間は監視を始めない（紙の下で表示が終わってしまわないように）
const held = new Set()
let releaseListening = false

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function show(el) {
  el.classList.add('is-revealed')
  pending.delete(el)
  observer?.unobserve(el)
}

// ページ内リンク（#interview など）で一気に移動したとき、飛び越えた要素は画面に入らないため、
// 画面より上にある未表示の要素をまとめて表示する
function revealPassed() {
  for (const el of pending) {
    if (el.getBoundingClientRect().bottom < 0) show(el)
  }
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // 画面に入った、またはすでに画面より上にある（途中から開いた・ページ内リンクで飛んだ）場合は表示
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) show(entry.target)
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )
  // スクロールが止まったとき・読み込み完了後に確認（毎フレームの位置計算はしない）
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', revealPassed, { passive: true })
  } else {
    let timer
    window.addEventListener('scroll', () => {
      clearTimeout(timer)
      timer = setTimeout(revealPassed, 150)
    }, { passive: true })
  }
  window.addEventListener('load', () => setTimeout(revealPassed, 300), { once: true })
  return observer
}

export const reveal = {
  mounted(el, { value = {} }) {
    el.classList.add('reveal')
    if (value.variant) el.classList.add(`reveal--${value.variant}`)
    if (value.delay) el.style.setProperty('--reveal-base', `${value.delay}ms`)
    if (value.i != null) el.style.setProperty('--reveal-i', String(value.i))

    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      show(el)
      return
    }
    pending.add(el)
    if (isOpeningHold()) {
      held.add(el)
      if (!releaseListening) {
        releaseListening = true
        window.addEventListener(
          RELEASE_EVENT,
          () => {
            held.forEach((e) => getObserver().observe(e))
            held.clear()
          },
          { once: true },
        )
      }
      return
    }
    getObserver().observe(el)
  },
  beforeUnmount(el) {
    held.delete(el)
    pending.delete(el)
    observer?.unobserve(el)
  },
}

export default {
  install(app) {
    // index.html の保険（Vue が起動しなかったら全表示に戻す）に「起動した」ことを知らせる
    window.__revealReady = true
    app.directive('reveal', reveal)
  },
}
