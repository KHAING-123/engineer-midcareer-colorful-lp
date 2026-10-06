<script setup>
defineProps({
  id: { type: String, required: true },
  number: { type: String, default: '' },
  label: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  align: { type: String, default: 'left' }, // 'left' | 'center'
  // true：番号・ラベル・見出しを左からスッと表示（heading-reveal）。親セクションで useHeadingReveal を使う
  slideIn: { type: Boolean, default: false },
  slideFrom: { type: String, default: 'left' }, // slideIn の方向：'left' | 'right'
})
</script>

<template>
  <div class="section-heading" :class="[`section-heading--${align}`, { 'heading-reveal': slideIn, 'heading-reveal--right': slideIn && slideFrom === 'right' }]">
    <!-- slideIn：番号・ラベル → 見出しの順に横から（heading-reveal）／通常：v-reveal -->
    <template v-if="slideIn">
      <div class="section-heading__meta heading-reveal__item">
        <span v-if="number" class="section-heading__number" aria-hidden="true">{{ number }}</span>
        <span v-if="label" class="section-heading__label" aria-hidden="true">{{ label }}</span>
      </div>
      <h2 :id="id" class="section-heading__title pre-line heading-reveal__item heading-reveal__item--late">{{ title }}</h2>
    </template>
    <template v-else>
      <div v-reveal class="section-heading__meta">
        <span v-if="number" class="section-heading__number" aria-hidden="true">{{ number }}</span>
        <span v-if="label" class="section-heading__label" aria-hidden="true">{{ label }}</span>
      </div>
      <h2 v-reveal :id="id" class="section-heading__title pre-line">{{ title }}</h2>
    </template>
    <p v-if="lead" v-reveal="{ delay: 100 }" class="section-heading__lead pre-line" :class="{ 'heading-reveal-content': slideIn }">{{ lead }}</p>
  </div>
</template>

<style scoped>
.section-heading__meta {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 8px;
}
.section-heading--center {
  text-align: center;
}
.section-heading--center .section-heading__meta {
  justify-content: center;
}
.section-heading__number {
  color: var(--color-coral);
  font-family: var(--font-number);
  font-size: var(--fs-number);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: 0.02em;
}
.section-heading__label {
  position: relative;
  padding-bottom: 6px;
  color: var(--color-coral);
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.18em;
}
.section-heading__title {
  font-size: var(--fs-xl);
  font-weight: 900;
  letter-spacing: 0.04em;
}
.section-heading__lead {
  margin-top: var(--space-md);
  color: var(--color-text);
}
.section-heading--center .section-heading__lead {
  margin-inline: auto;
  max-width: 44em;
}
</style>
