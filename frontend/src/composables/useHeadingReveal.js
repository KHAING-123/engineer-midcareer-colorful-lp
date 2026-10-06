/**
 * セクションタイトルの Scroll Animation（01 MEMBERS / 02 OUR WORK などで共通）
 *
 *  ・タイトル（番号 / 英字ラベル / 見出し）が画面に入ったら、左からスッと表示（1回だけ）
 *  ・タイトル表示開始から CONTENT_DELAY 後に、本文・カードなどの既存 v-reveal を解放
 *  ・見た目は src/assets/styles/heading-reveal.css
 *
 * 使い方（セクションのコンポーネント）：
 *   const heading = ref(null)                          // タイトルグループの要素（またはコンポーネント）
 *   const { stateClass } = useHeadingReveal(heading)
 *
 *   <section class="heading-reveal-scope" :class="stateClass">
 *     <div ref="heading" class="heading-reveal">
 *       <span class="heading-reveal__item">01</span>
 *       <h2 class="heading-reveal__item heading-reveal__item--late">見出し</h2>
 *     </div>
 *     <p v-reveal class="heading-reveal-content">本文</p>             … タイトルの後に表示
 *     <li v-reveal class="heading-reveal-content heading-reveal-content--card">…</li>
 *   </section>
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const CONTENT_DELAY = 350 // ms：タイトルがほぼ定位置に着いた頃に本文などを開始
const THRESHOLD = 0.25

export function useHeadingReveal(target) {
  const headingIn = ref(false)
  const contentReady = ref(false)
  const stateClass = computed(() => ({ 'is-heading-in': headingIn.value, 'is-content-ready': contentReady.value }))

  let observer = null
  let contentTimer = 0
  let inView = false // タイトルが画面内にあるか
  let scrolled = false // ユーザーがスクロールしたか（読み込み直後の Hero 表示中は実行しない）

  const el = () => target.value?.$el ?? target.value

  function show(instant = false) {
    if (headingIn.value) return
    headingIn.value = true
    observer?.disconnect() // 1回だけ：以後は監視しない
    observer = null
    removeListeners()
    if (instant) {
      contentReady.value = true
      return
    }
    // 動きを減らす設定：移動なしで、不透明度だけふわっと（全体設定で CSS transition が止まるため WAAPI で）
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el()?.querySelectorAll('.heading-reveal__item').forEach((item) => {
        item.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' })
      })
    }
    contentTimer = window.setTimeout(() => (contentReady.value = true), CONTENT_DELAY)
  }

  // ページ内リンクなどでタイトルを飛び越えた場合は、動きなしで全部表示
  function checkPassed() {
    const e = el()
    if (e && e.getBoundingClientRect().bottom < 0) show(true)
  }

  // 大きい画面では読み込み時点でタイトルが見えていることがあるため、最初のスクロールを待ってから実行
  function onFirstScroll() {
    if (window.scrollY <= 0) return
    scrolled = true
    window.removeEventListener('scroll', onFirstScroll)
    if (inView) show()
  }

  function removeListeners() {
    window.removeEventListener('scroll', onFirstScroll)
    window.removeEventListener('scrollend', checkPassed)
  }

  onMounted(() => {
    const e = el()
    if (!('IntersectionObserver' in window) || !e) {
      show(true)
      return
    }
    scrolled = window.scrollY > 0 // 途中の位置で再読み込みした場合など
    observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView && scrolled) show()
        else if (!inView && entry.boundingClientRect.bottom < 0) show(true)
      },
      { threshold: THRESHOLD },
    )
    observer.observe(e)
    if (!scrolled) window.addEventListener('scroll', onFirstScroll, { passive: true })
    window.addEventListener('scrollend', checkPassed, { passive: true })
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    clearTimeout(contentTimer)
    removeListeners()
  })

  return { headingIn, contentReady, stateClass }
}
