<script setup>
defineProps({
  label: { type: String, required: true },
  href: { type: String, required: true },
  size: { type: String, default: 'md' }, // 'md' | 'lg'
})
</script>

<template>
  <a class="lp-cta-button" :class="{ 'lp-cta-button--lg': size === 'lg' }" :href="href">
    <span>{{ label }}</span>
    <span class="lp-cta-button__arrow" aria-hidden="true">→</span>
  </a>
</template>
