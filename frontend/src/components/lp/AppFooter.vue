<script setup>
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import PreaiLogo from '../common/PreaiLogo.vue'

const { footer, site } = lpContent
</script>

<template>
  <footer class="site-footer">
    <div v-reveal="{ variant: 'fade' }" class="lp-container site-footer__inner">
      <a class="site-footer__logo" href="#top">
        <PreaiLogo class="site-footer__logo-mark" :label="`${site.logoAlt} トップへ戻る`" />
      </a>

      <nav class="site-footer__nav" aria-label="フッターメニュー">
        <ul>
          <li v-for="link in footer.links" :key="link.href">
            <a :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <ul class="site-footer__sns" aria-label="公式SNS">
        <li v-for="item in footer.sns" :key="item.href">
          <a :href="item.href" target="_blank" rel="noopener noreferrer">
            <img :src="img(item.icon)" :alt="`${item.label}（新しいタブで開く）`" width="40" height="40" />
          </a>
        </li>
      </ul>
    </div>
    <p class="site-footer__copy"><small>{{ footer.copyright }}</small></p>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-white);
  border-top: 4px solid var(--color-yellow);
}
.site-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 40px;
}
.site-footer__logo-mark {
  width: 84px; /* SP：以前 75px の約 1.12 倍 */
}
@media (min-width: 768px) {
  .site-footer__logo-mark {
    width: 90px; /* PC：以前 75px の 1.2 倍 */
  }
}
/* ロゴは小さくしても、リンク・SNS の位置が変わらないよう従来のロゴ幅（150px）の枠を確保（ロゴは左端） */
@media (min-width: 768px) {
  .site-footer__logo {
    width: 150px; /* 以前と同じく、狭い幅では詰まって縮む */
  }
}
.site-footer__nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
}
.site-footer__nav a {
  color: var(--color-navy);
  font-size: var(--fs-sm);
  font-weight: 500;
  text-decoration: none;
}
.site-footer__nav a:hover {
  text-decoration: underline;
}
.site-footer__sns {
  display: flex;
  gap: 12px;
}
.site-footer__sns a {
  display: block;
  border-radius: 50%;
  transition: transform var(--transition);
}
.site-footer__sns a:hover {
  transform: translateY(-2px);
}
.site-footer__sns img {
  width: 40px;
  height: 40px;
}
.site-footer__copy {
  padding: 16px var(--container-padding);
  background: var(--color-navy);
  color: var(--color-white);
  text-align: center;
  font-size: var(--fs-xs);
}
.site-footer__copy small {
  font-size: inherit;
}

@media (max-width: 767px) {
  .site-footer__inner {
    flex-direction: column;
    text-align: center;
  }
  .site-footer__nav ul {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}
</style>
