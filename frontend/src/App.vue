<script setup>
import AppHeader from './components/lp/AppHeader.vue'
import HeroSection from './components/lp/HeroSection.vue'
import MembersSection from './components/lp/MembersSection.vue'
import JobsSection from './components/lp/JobsSection.vue'
import GrowthSection from './components/lp/GrowthSection.vue'
import CareerSupportSection from './components/lp/CareerSupportSection.vue'
import CareerPathsSection from './components/lp/CareerPathsSection.vue'
import InterviewSection from './components/lp/InterviewSection.vue'
import SelectionFlowSection from './components/lp/SelectionFlowSection.vue'
import FinalCtaSection from './components/lp/FinalCtaSection.vue'
import AppFooter from './components/lp/AppFooter.vue'
import AmbientBackground from './components/common/AmbientBackground.vue'
import PageOpening from './components/common/PageOpening.vue'
</script>

<template>
  <!-- ページを開いたときの紙がめくれる演出（不要になったらこの1行を消すだけ） -->
  <PageOpening />
  <div class="lp-page">
    <a class="skip-link" href="#main">本文へスキップ</a>
    <AppHeader />
    <main id="main">
      <HeroSection />
      <MembersSection />
      <JobsSection />
      <GrowthSection />
      <CareerSupportSection />
      <CareerPathsSection />
      <InterviewSection />
      <SelectionFlowSection />
      <FinalCtaSection />
    </main>
    <AppFooter />
    <!-- 背景アニメーション：セクション背景より上・本文より下に描画するため最後に置く -->
    <AmbientBackground />
  </div>
</template>
