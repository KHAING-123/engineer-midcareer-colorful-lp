<script setup>
import { ref } from 'vue'
import { useHeadingReveal } from '../../composables/useHeadingReveal.js'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import SectionHeading from './SectionHeading.vue'
import JobCard from './JobCard.vue'

const { jobsSection: section, jobs } = lpContent

// タイトル（02 / OUR WORK / 見出し）の Scroll Animation：左から1回だけ → その後に説明文・カード（01 MEMBERS と共通処理）
const heading = ref(null)
const { stateClass } = useHeadingReveal(heading)
</script>

<template>
  <section id="jobs" class="jobs lp-section lp-section--cream heading-reveal-scope" :class="stateClass" aria-labelledby="jobs-title">
    <span class="lp-blob lp-blob--green jobs__blob-1" aria-hidden="true"></span>
    <span class="lp-blob lp-blob--blue jobs__blob-2" aria-hidden="true"></span>
    <img class="lp-deco jobs__leaf" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
    <img class="lp-deco jobs__sparkle" :src="img('common/deco-sparkle.svg')" alt="" aria-hidden="true" />

    <div class="lp-container">
      <SectionHeading
        ref="heading"
        id="jobs-title"
        :number="section.number"
        :label="section.label"
        :title="section.title"
        :lead="section.lead"
        align="center"
        slide-in
      />
      <ul class="jobs__list">
        <!-- 外側（li）：スクロール表示（1回だけ） / 中：JobCard の浮遊・hover・画像の動き -->
        <li
          v-for="(job, index) in jobs"
          :key="job.title"
          v-reveal="{ variant: 'fade' }"
          class="our-work-card-reveal heading-reveal-content"
          :style="{ '--wr-i': index }"
        >
          <JobCard :job="job" :index="index" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* セクション上部の余白：01 MEMBERS と同じくタイトルを上寄せ */
.jobs.lp-section {
  padding-top: var(--section-padding-top-heading);
}
.jobs__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 2.5vw, 42px);
  align-items: stretch;
  margin-top: var(--space-xl);
}
.jobs__blob-1 {
  width: 360px;
  height: 320px;
  left: -140px;
  top: 60px;
}
.jobs__blob-2 {
  width: 300px;
  height: 280px;
  right: -100px;
  bottom: 40px;
}
.jobs__leaf {
  width: 56px;
  right: 8%;
  top: 72px;
  transform: rotate(18deg);
}
.jobs__sparkle {
  width: 44px;
  left: 30%;
  top: 60px;
}

/* カードのスクロール表示：共通の v-reveal（1回だけ）。タイトル・説明文の後に 0 / 140 / 280ms で
   下から少し上がりながら（scale 0.98 → 1） */
:global(.reveal-ready .jobs .our-work-card-reveal.reveal) {
  transform: translate3d(0, 30px, 0) scale(0.98);
  transition:
    opacity 0.8s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(250ms + var(--wr-i, 0) * 140ms);
}
:global(.reveal-ready .jobs.is-content-ready .our-work-card-reveal.reveal.is-revealed) {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  :global(.reveal-ready .jobs .our-work-card-reveal.reveal) {
    transform: none;
  }
}

/* Tablet：2列＋1列（3枚目は中央に） */
@media (max-width: 1024px) {
  .jobs__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .jobs__list > li:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    justify-self: center;
    width: calc(50% - clamp(24px, 2.5vw, 42px) / 2);
  }
}
@media (max-width: 767px) {
  .jobs__list {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin-inline: auto;
  }
  .jobs__list > li:last-child:nth-child(odd) {
    width: 100%;
  }
  .jobs__sparkle {
    left: 8%;
  }
}
</style>
