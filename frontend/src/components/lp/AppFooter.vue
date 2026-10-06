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
            <a
              :href="link.href"
              v-bind="link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
            >
              {{ link.label }}
              <template v-if="link.external">
                <!-- 外部リンクアイコン（↗） -->
                <svg class="site-footer__ext" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
                </svg>
                <span class="visually-hidden">（新しいタブで開く）</span>
              </template>
            </a>
          </li>
        </ul>
      </nav>

      <ul v-if="footer.sns?.length" class="site-footer__sns" aria-label="公式SNS">
        <li v-for="item in footer.sns" :key="item.href">
          <a :href="item.href" target="_blank" rel="noopener noreferrer">
            <img :src="img(item.icon)" :alt="`${item.label}（新しいタブで開く）`" width="40" height="40" />
          </a>
        </li>
      </ul>

      <p class="site-footer__copy"><small>{{ footer.copyright }}</small></p>
    </div>
  </footer>
</template>

<style scoped>
/* 深いネイビー＋ほとんど気づかない程度のグラデーション */
.site-footer {
  background: linear-gradient(180deg, #152b5c 0%, #11264f 100%);
  color: rgba(255, 255, 255, 0.92);
}
.site-footer__inner {
  display: flex;
  align-items: center;
  padding-block: 32px;
}

/* ロゴ：形・オレンジの丸はそのまま、濃い背景で見えるよう文字部分だけ白で表示 */
.site-footer__logo {
  display: block;
  flex-shrink: 0;
}
.site-footer__logo-mark {
  width: 90px;
}
.site-footer__logo-mark :deep(g) {
  fill: #fff;
}

/* 細い縦の区切り線（文字より少し高い程度） */
.site-footer__logo,
.site-footer__nav li {
  position: relative;
}
.site-footer__logo::after,
.site-footer__nav li:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%);
}
.site-footer__logo {
  padding-right: 52px;
}

.site-footer__nav ul {
  display: flex;
  align-items: center;
}
.site-footer__nav li {
  padding-inline: 44px;
}
.site-footer__nav a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.28s ease, opacity 0.28s ease, transform 0.28s ease;
}
.site-footer__nav a:hover,
.site-footer__nav a:focus-visible {
  color: #fff;
  transform: translateY(-1px);
}
.site-footer__ext {
  width: 0.95em;
  height: 0.95em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
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
  margin-left: auto;
  padding-left: 48px;
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--fs-sm);
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.site-footer__copy small {
  font-size: inherit;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* タブレット：横一列のまま、余白だけ詰める */
@media (max-width: 1100px) {
  .site-footer__logo {
    padding-right: 32px;
  }
  .site-footer__nav li {
    padding-inline: 24px;
  }
  .site-footer__copy {
    padding-left: 24px;
  }
}

/* SP：ロゴ → メニュー → Copyright の縦積み */
@media (max-width: 860px) {
  .site-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding-block: 36px 28px;
    padding-inline: 24px;
  }
  .site-footer__logo {
    padding-right: 0;
  }
  .site-footer__logo-mark {
    width: 84px;
  }
  .site-footer__logo::after,
  .site-footer__nav li::after {
    display: none;
  }
  .site-footer__nav ul {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .site-footer__nav li {
    padding-inline: 0;
  }
  .site-footer__copy {
    margin-left: 0;
    padding-left: 0;
    padding-top: 20px;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    font-size: var(--fs-xs);
    white-space: normal;
  }
}
@media (max-width: 380px) {
  .site-footer__inner {
    padding-inline: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-footer__nav a {
    transition: none;
  }
  .site-footer__nav a:hover,
  .site-footer__nav a:focus-visible {
    transform: none;
  }
}
</style>
