<script setup>
/**
 * ページ全体の背景アニメーション（Premium Ambient Background）
 * 見た目・動きはすべて src/assets/styles/ambient.css の CSS アニメーションです。
 *
 * ここでは光の配置を各セクションに合わせるため、
 * セクションの開始位置（ページ上端からの距離）を CSS 変数 --y-xxx として渡しています。
 * 計測はページの大きさが変わったとき（画像の読み込み・画面幅の変更）だけ行います。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

// CSS変数名 → 対象要素
const anchors = {
  members: '#members',
  jobs: '#jobs',
  growth: '#growth',
  support: '#support',
  careers: '#careers',
  interview: '#interview',
  selection: '#selection',
  entry: '#entry',
  footer: '.site-footer',
}

const layer = ref(null)
let observer
let frame = 0

function measure() {
  frame = 0
  const el = layer.value
  if (!el) return
  const base = el.getBoundingClientRect().top
  for (const [name, selector] of Object.entries(anchors)) {
    const target = document.querySelector(selector)
    if (target) el.style.setProperty(`--y-${name}`, `${Math.round(target.getBoundingClientRect().top - base)}px`)
  }
}
function scheduleMeasure() {
  if (!frame) frame = requestAnimationFrame(measure)
}

onMounted(() => {
  measure()
  observer = new ResizeObserver(scheduleMeasure)
  observer.observe(document.querySelector('#main') || document.body)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="layer" class="ambient" aria-hidden="true">
    <span class="ambient-sweep ambient-sweep--a"></span>
    <span class="ambient-sweep ambient-sweep--b"></span>
    <span class="ambient-orb ambient-orb--pink ambient-orb--blob ambient-orb--a"></span>
    <span class="ambient-orb ambient-orb--green ambient-orb--b"></span>
    <span class="ambient-orb ambient-orb--yellow ambient-orb--c"></span>
    <span class="ambient-orb ambient-orb--blue ambient-orb--d"></span>
    <span class="ambient-orb ambient-orb--pink ambient-orb--e"></span>
    <span class="ambient-orb ambient-orb--yellow ambient-orb--blob ambient-orb--f"></span>
    <span class="ambient-orb ambient-orb--green ambient-orb--blob ambient-orb--g"></span>
    <span class="ambient-orb ambient-orb--blue ambient-orb--h"></span>
    <span class="ambient-orb ambient-orb--pink ambient-orb--i"></span>
    <span class="ambient-orb ambient-orb--yellow ambient-orb--j"></span>
    <span class="ambient-orb ambient-orb--pink ambient-orb--k"></span>
    <span class="ambient-orb ambient-orb--blue ambient-orb--l"></span>
  </div>
</template>
