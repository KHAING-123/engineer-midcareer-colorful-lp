<script setup>
import { ref } from 'vue'
import { useHeadingReveal } from '../../composables/useHeadingReveal.js'
import { lpContent } from '../../data/lpContent.js'
import { img } from '../../utils/image.js'
import MemberCard from './MemberCard.vue'

const { membersSection: section, members } = lpContent

// 見出しの \n は「幅が足りないときだけ改行する位置」として扱う（PCでは1行表示）
const titleParts = section.title.split('\n')
const labels = {
  nameSuffix: section.nameSuffix,
  ageUnit: section.ageUnit,
  previousPrefix: section.previousPrefix,
}

// タイトル（01 / MEMBERS / 見出し）の Scroll Animation：左から1回だけ → その後に本文・カード・Note（共通処理）
const heading = ref(null)
const { stateClass } = useHeadingReveal(heading)
</script>

<template>
  <section
    id="members"
    class="members lp-section heading-reveal-scope"
    :class="stateClass"
    aria-labelledby="members-title"
  >
    <!-- 背景装飾（すべて飾り） -->
    <div class="members__decor" aria-hidden="true">
      <span class="members__circle members__circle--yellow-l"></span>
      <span class="members__circle members__circle--pink-l"></span>
      <span class="members__circle members__circle--green-r"></span>
      <span class="members__circle members__circle--yellow-r"></span>
      <img class="members__deco members__deco--dots" :src="img('common/deco-dots.svg')" alt="" />
      <img class="members__deco members__deco--leaf-l" :src="img('common/deco-leaf.svg')" alt="" />
      <img class="members__deco members__deco--leaf-r" :src="img('common/deco-leaf-pair.svg')" alt="" />
      <span class="members__spark members__spark--r"></span>
      <!-- PC（1024px〜）だけ：周りの葉っぱ・小さな装飾（常にゆっくり揺れる） -->
      <span class="members-pc-deco">
        <img class="members-pc-leaf members-pc-leaf--1" :src="img('common/deco-leaf.svg')" alt="" />
        <img class="members-pc-leaf members-pc-leaf--2" :src="img('common/deco-leaf-pair.svg')" alt="" />
        <img class="members-pc-leaf members-pc-leaf--3" :src="img('common/deco-leaf.svg')" alt="" />
        <img class="members-pc-leaf members-pc-leaf--4" :src="img('common/deco-leaf.svg')" alt="" />
        <img class="members-pc-leaf members-pc-leaf--5" :src="img('common/deco-leaf-pair.svg')" alt="" />
        <img class="members-pc-leaf members-pc-leaf--6" :src="img('common/deco-leaf.svg')" alt="" />
        <img class="members-pc-leaf members-pc-leaf--7" :src="img('common/deco-leaf.svg')" alt="" />
        <span class="members-pc-blob members-pc-blob--mint"></span>
        <span class="members-pc-blob members-pc-blob--blue"></span>
        <span class="members-pc-rays"><i></i><i></i><i></i></span>
      </span>
    </div>

    <div class="lp-container members__grid">
      <!-- 左：01 + 見出し + 説明 + 手書き風メッセージ -->
      <div class="members__intro">
        <!-- タイトルグループ（01 / MEMBERS / 見出し）：heading-reveal。本文はここに含めず v-reveal のまま -->
        <div ref="heading" class="members__head heading-reveal">
          <span class="members__number heading-reveal__item" aria-hidden="true">{{ section.number }}</span>
          <div class="members__head-text">
            <span v-if="section.label" class="members__label heading-reveal__item" aria-hidden="true">{{ section.label }}</span>
            <h2 id="members-title" class="members__title heading-reveal__item heading-reveal__item--late">
              <template v-for="(part, i) in titleParts" :key="i"><wbr v-if="i > 0" />{{ part }}</template>
            </h2>
            <p v-if="section.lead" v-reveal="{ delay: 100 }" class="members__lead pre-line heading-reveal-content">{{ section.lead }}</p>
          </div>
        </div>

        <p v-if="section.handwritten" v-reveal="{ variant: 'fade', delay: 350 }" class="members__handwritten pre-line heading-reveal-content heading-reveal-content--note">{{ section.handwritten }}</p>
        <!-- PC（1024px〜）だけ：「いろんなバックグラウンド…」を表示しない代わりの葉っぱ -->
        <span class="members-pc-intro-leaves" aria-hidden="true">
          <img class="members-pc-intro-leaf members-pc-intro-leaf--1" :src="img('common/deco-leaf.svg')" alt="" />
          <img class="members-pc-intro-leaf members-pc-intro-leaf--2" :src="img('common/deco-leaf-pair.svg')" alt="" />
          <img class="members-pc-intro-leaf members-pc-intro-leaf--3" :src="img('common/deco-leaf.svg')" alt="" />
          <img class="members-pc-intro-leaf members-pc-intro-leaf--4" :src="img('common/deco-leaf.svg')" alt="" />
        </span>
      </div>

      <!-- 右：メンバー3名 + 補助メッセージ -->
      <div class="members__people">
        <ul class="members__list">
          <!-- 外側（li）：スクロール表示（タイトルの後に 1人ずつ） / 中：MemberCard の浮遊 -->
          <li
            v-for="(member, index) in members"
            :key="member.name"
            v-reveal="{ variant: 'fade' }"
            class="member-reveal heading-reveal-content"
            :style="{ '--mr-i': index }"
          >
            <MemberCard :member="member" :labels="labels" :index="index" />
          </li>
        </ul>

        <p v-if="section.sideNote" v-reveal="{ delay: 450 }" class="members__side-note heading-reveal-content heading-reveal-content--note">
          <span class="pre-line">{{ section.sideNote }}</span>
        </p>
      </div>

      <!--
        メンバー画像（member-01 → 02 → 03）を大きく縦に並べるギャラリー
        SP（〜767px）と PC（1024px〜）で使用（Tablet では非表示＝従来のメンバーカード）。
        画像の中に人物・プロフィールが含まれているため、文字は重ねない。
        レイヤーの分担（transform が競合しないように分離）
          .members-sp-card--reveal … スクロール表示（1枚ずつ・1回だけ）
          .members-sp-card__float  … 常時のゆっくりした浮遊 ＋ 影の呼吸
          .members-sp-card__frame  … 角丸・影・わずかな傾き・光
      -->
      <div class="members-sp-gallery">
        <template v-for="(member, index) in members" :key="`sp-${member.name}`">
          <div
            v-reveal="{ variant: 'fade' }"
            class="members-sp-card members-sp-card--reveal heading-reveal-content"
            :style="{ '--sp-i': index }"
          >
            <!--
              画像の後ろの Premium 背景（06 INTERVIEW の画像と同じデザイン言語。色は画像ごと）
              Blob・光・細い曲線・葉っぱ。動くのはここだけ（画像・スクロール表示とは別レイヤー）
            -->
            <span class="members-premium-bg" aria-hidden="true">
              <span class="members-premium-bg__blob"></span>
              <span class="members-premium-bg__blob members-premium-bg__blob--sub"></span>
              <span class="members-premium-bg__glow"></span>
              <span class="members-premium-bg__curve"></span>
              <span class="members-premium-bg__curve members-premium-bg__curve--sub"></span>
              <img class="members-premium-bg__leaf members-premium-bg__leaf--1" :src="img('common/deco-leaf.svg')" alt="" />
              <img class="members-premium-bg__leaf members-premium-bg__leaf--2" :src="img('common/deco-leaf.svg')" alt="" />
            </span>
            <div class="members-sp-card__float">
              <div class="members-sp-card__frame">
                <img
                  class="members-sp-card__image"
                  :src="img(member.image)"
                  :alt="member.imageAlt"
                  width="1371"
                  height="1148"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <!-- カード間の小さな葉っぱ（既存の葉っぱ素材） -->
            <img
              v-if="index < members.length - 1"
              class="members-sp-leaf"
              :class="`members-sp-leaf--${index}`"
              :src="img('common/deco-leaf.svg')"
              alt=""
              aria-hidden="true"
            />
          </div>

          <!-- 1枚目と2枚目の間：「一歩ずつ、できることが増えていく。」（SP 用。デザインは PC と同じ） -->
          <p
            v-if="index === 0 && section.sideNote"
            v-reveal="{ delay: 150 }"
            class="members__side-note members-sp-note heading-reveal-content"
          >
            <span class="pre-line">{{ section.sideNote }}</span>
            <!-- SP（〜767px）だけ：Note の周りの小さな葉っぱ（文字・画像には重ねない） -->
            <img class="members-sp-note-leaf members-sp-note-leaf--1" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <img class="members-sp-note-leaf members-sp-note-leaf--2" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <img class="members-sp-note-leaf members-sp-note-leaf--3" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <img class="members-sp-note-leaf members-sp-note-leaf--4" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <!-- PC（1024px〜）だけ：Note の右横・右下・下の葉っぱ -->
            <img class="members-note-leaf members-note-leaf--1" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
            <img class="members-note-leaf members-note-leaf--2" :src="img('common/deco-leaf-pair.svg')" alt="" aria-hidden="true" />
            <img class="members-note-leaf members-note-leaf--3" :src="img('common/deco-leaf.svg')" alt="" aria-hidden="true" />
          </p>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- セクション全体 ---------- */
.members {
  --members-bg-top: #fffdf7;
  --members-bg-bottom: #fff8e8;
  --members-hand-blue: #3a6db0;
  /* Note の浮遊量（SPで弱める） */
  --note-a-y: 10px;
  --note-b-y: 8px;
  --note-x: 3px;
  --note-rot: 1deg;
  background: linear-gradient(180deg, var(--members-bg-top) 0%, var(--members-bg-bottom) 100%);
}
.members__grid {
  display: grid;
  grid-template-columns: minmax(0, 4.4fr) minmax(0, 5.6fr);
  gap: clamp(24px, 3vw, 48px);
  align-items: start;
}

/* セクション上部の余白：タイトルを上寄せ（PC 約60px／SP 約40px） */
.members.lp-section {
  padding-top: var(--section-padding-top-heading);
}

/* ---------- 左：見出し ---------- */
.members__intro {
  position: relative;
  display: flex;
  flex-direction: column;
}
.members__head {
  display: flex;
  align-items: flex-start;
  gap: clamp(14px, 1.6vw, 22px);
}
.members__number {
  position: relative;
  flex-shrink: 0;
  color: var(--color-coral);
  font-family: var(--font-number);
  font-size: clamp(4rem, 3rem + 3vw, 6rem);
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -0.02em;
  transform: scaleY(1.08);
  transform-origin: top;
}
/* 01 の右上の小さなアクセント線 */
.members__number::after {
  content: '';
  position: absolute;
  top: -10px;
  right: -12px;
  width: 14px;
  height: 14px;
  border-top: 3px solid var(--color-coral);
  border-right: 3px solid var(--color-coral);
  border-radius: 0 10px 0 0;
  opacity: 0.55;
  transform: rotate(10deg);
}
.members__head-text {
  min-width: 0;
  padding-top: 4px;
}
.members__label {
  display: block;
  margin-bottom: 4px;
  color: var(--color-coral);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  opacity: 0.8;
  --hr-opacity: 0.8; /* タイトル表示後もこの濃さ */
}
.members__title {
  color: var(--color-navy);
  font-size: clamp(1.5rem, 1.2rem + 0.6vw, 1.875rem);
  font-weight: 900;
  letter-spacing: 0.03em;
  line-height: 1.4;
  word-break: keep-all; /* \n の位置（<wbr>）でだけ改行する */
  overflow-wrap: anywhere;
}
.members__lead {
  max-width: 30em;
  margin-top: 16px;
  color: var(--color-navy-soft);
  font-size: 0.9375rem;
  line-height: 1.95;
}

/* 左下の手書き風メッセージ（右カラムへつながる位置に） */
.members__handwritten {
  align-self: flex-end;
  margin-top: clamp(28px, 4vw, 56px);
  margin-right: clamp(0px, 3vw, 40px);
  color: var(--members-hand-blue);
  font-family: var(--font-heading);
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.9;
  transform: rotate(-9deg);
  /* Note B：文字＋下線ごと、紙が少し浮いているように */
  filter: drop-shadow(0 6px 10px rgba(31, 54, 105, 0.1));
  animation: note-float-b 7.4s ease-in-out -2.5s infinite;
}
.members__handwritten::after {
  content: '';
  display: block;
  width: 70%;
  height: 8px;
  margin-top: 2px;
  border-bottom: 2px solid currentColor;
  border-radius: 0 0 50% 50%;
  opacity: 0.35;
}

/* ---------- 右：メンバー ---------- */
.members__people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}
.members__list {
  display: grid;
  gap: 14px;
}
/* PCだけ少しずらして自然な配置感に（1・2人目を右へ） */
.members__list > li:nth-child(3n + 1),
.members__list > li:nth-child(3n + 2) {
  padding-left: clamp(0px, 3.2vw, 48px);
}

/* スクロール表示：1人ずつ、少し横＋下から（1回だけ。v-reveal の fade を使い、動きはここで指定） */
.members {
  --mr-x: 25px;
}
:global(.reveal-ready .members .member-reveal.reveal) {
  transform: translate3d(calc(var(--mr-x) * -1), 30px, 0) scale(0.985);
  transition:
    opacity 0.75s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(250ms + var(--mr-i, 0) * 120ms); /* 説明文の後に 0 / 120 / 240ms */
}
:global(.reveal-ready .members .member-reveal.reveal:nth-child(2n)) {
  transform: translate3d(var(--mr-x), 30px, 0) scale(0.985);
}
:global(.reveal-ready .members.is-content-ready .member-reveal.reveal.is-revealed) {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  :global(.reveal-ready .members .member-reveal.reveal),
  :global(.reveal-ready .members .member-reveal.reveal:nth-child(2n)) {
    transform: none;
  }
}

/* 右端：ピンクの丸の補助メッセージ */
.members__side-note {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(118px, 10.5vw, 150px);
  aspect-ratio: 1;
  margin-top: -40px;
  border-radius: 55% 45% 50% 50% / 50% 55% 45% 50%;
  background: var(--color-pink-pale);
  color: var(--color-navy);
  font-family: var(--font-heading);
  font-size: clamp(0.8125rem, 0.5rem + 0.45vw, 0.9375rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.8;
  text-align: center;
  /* Note A：ピンクの丸ごと浮かせる（柔らかい影＋ごく薄いピンクのGlow） */
  box-shadow: 0 12px 26px rgba(31, 54, 105, 0.07), 0 4px 10px rgba(31, 54, 105, 0.04),
    0 0 28px rgba(255, 159, 165, 0.22);
  animation: note-float-a 6.2s ease-in-out -1s infinite;
}
.members__side-note > span {
  display: block;
  transform: rotate(-8deg);
}
/* 丸の左上の小さな線 */
.members__side-note::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-top: 2px solid var(--color-coral);
  border-left: 2px solid var(--color-coral);
  border-radius: 12px 0 0 0;
  opacity: 0.6;
}

/* ---------- Note の浮遊（translate / rotate は既存の transform に重ねて適用） ---------- */
@keyframes note-float-a {
  0%,
  100% {
    translate: 0 0;
    rotate: calc(var(--note-rot) * -1);
  }
  50% {
    translate: 0 calc(var(--note-a-y) * -1);
    rotate: var(--note-rot);
  }
}
@keyframes note-float-b {
  0%,
  100% {
    translate: 0 0;
    rotate: var(--note-rot);
  }
  40% {
    translate: var(--note-x) calc(var(--note-b-y) * -1);
    rotate: calc(var(--note-rot) * -1);
  }
  75% {
    translate: calc(var(--note-x) * -0.7) calc(var(--note-b-y) * -0.45);
    rotate: 0deg;
  }
}
@media (prefers-reduced-motion: reduce) {
  .members__side-note,
  .members__handwritten {
    animation: none;
  }
}

/* ---------- 背景装飾 ---------- */
.members__decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.members__decor > * {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
.members__circle {
  border-radius: 50%;
}
.members__circle--yellow-l {
  width: 380px;
  height: 380px;
  left: -140px;
  bottom: -120px;
  background: var(--color-yellow-pale);
  opacity: 0.8;
}
.members__circle--pink-l {
  width: 280px;
  height: 240px;
  left: 60px;
  bottom: -130px;
  border-radius: 58% 42% 55% 45% / 48% 58% 42% 52%;
  background: var(--color-pink-pale);
  opacity: 0.7;
}
.members__circle--green-r {
  width: 120px;
  height: 120px;
  right: 4%;
  top: -30px;
  background: var(--color-green-pale);
}
.members__circle--yellow-r {
  width: 200px;
  height: 200px;
  right: -60px;
  bottom: 40px;
  background: var(--color-yellow-pale);
  opacity: 0.85;
}
.members__deco--dots {
  width: 80px;
  top: 36px;
  left: 40%;
  opacity: 0.6;
}
.members__deco--leaf-l {
  width: 40px;
  left: 22%;
  bottom: 48px;
  transform: rotate(-30deg);
  opacity: 0.7;
}
.members__deco--leaf-r {
  width: 64px;
  right: 7%;
  bottom: 110px;
  opacity: 0.75;
}
.members__spark--r {
  right: 3%;
  top: 34%;
  width: 22px;
  height: 22px;
  border-top: 2px solid var(--color-yellow-dark);
  border-right: 2px solid var(--color-yellow-dark);
  border-radius: 0 14px 0 0;
  opacity: 0.6;
}

/* ---------- Tablet（〜1024px）：縦方向に並べる ---------- */
@media (max-width: 1024px) {
  .members__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .members__handwritten {
    align-self: flex-start;
    margin: 24px 0 0 clamp(80px, 12vw, 120px);
  }
  .members__people {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 24px;
  }
  .members__list {
    width: 100%;
    max-width: 600px;
  }
  .members__side-note {
    width: 150px;
    margin-top: 0;
    font-size: 0.9375rem;
  }
}

/* ---------- SP（〜767px） ---------- */
@media (max-width: 767px) {
  /* Note の浮遊をPCより弱く */
  .members {
    --note-a-y: 5px;
    --note-b-y: 4px;
    --note-x: 2px;
    --note-rot: 0.5deg;
  }
  /* 01＋タイトルを1行目に、説明文は全幅で下に */
  .members__head {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 12px;
    align-items: end;
  }
  .members__head-text {
    display: contents;
  }
  .members__number {
    grid-row: 1 / span 2;
  }
  .members__label,
  .members__title {
    grid-column: 2;
  }
  .members__lead {
    grid-column: 1 / -1;
    max-width: none;
  }
  .members__number {
    font-size: 3.5rem;
  }
  .members__lead {
    font-size: var(--fs-sm);
  }
  /* 「いろんなバックグラウンドの仲間がいます！」は SP では表示しない（代わりに下の手書きメモ） */
  .members__handwritten {
    display: none;
  }
  .members {
    --mr-x: 12px;
  }
  .members__list > li:nth-child(3n + 1),
  .members__list > li:nth-child(3n + 2) {
    padding-left: 0;
  }
  .members__deco--dots {
    left: auto;
    right: 16px;
    top: 16px;
  }
  .members__circle--green-r {
    width: 80px;
    height: 80px;
  }
}
/* ================= SP（〜767px）だけ：メンバー画像ギャラリー ================= */
/* Tablet（768〜1023px）では表示しない（画像も loading="lazy" のため読み込まれません）。SP と PC は下のメディアクエリで表示 */
.members-sp-gallery {
  display: none;
}
@media (max-width: 767px) {
  /* SP の見出し：01 を大きく、説明文は読みやすく */
  .members__number {
    font-size: clamp(64px, 18vw, 90px);
  }
  .members__lead {
    font-size: 0.875rem;
    line-height: 1.8;
  }
  /* PC 用のメンバーカード一覧は SP では使わない（画像ギャラリーに置き換え） */
  .members__people {
    display: none;
  }

  .members-sp-gallery {
    --sp-note-w: clamp(120px, 36vw, 156px); /* 「一歩ずつ…」の大きさ（320〜430px で約 120〜155px） */
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 42px;
    /* 上：1枚目の右上に添える Note のための余白（画像の角にほんの数 px だけ重なり、画像内の文字は隠さない） */
    padding-top: calc(var(--sp-note-w) * 0.96);
    padding-bottom: 8px;
  }
  /* 背景の淡いパステル（画像より後ろ） */
  .members-sp-gallery::before,
  .members-sp-gallery::after {
    content: '';
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    pointer-events: none;
  }
  .members-sp-gallery::before {
    top: 22%;
    left: -40%;
    width: 120%;
    height: 32%;
    background: radial-gradient(closest-side, rgba(255, 214, 224, 0.55), transparent);
  }
  .members-sp-gallery::after {
    bottom: 10%;
    right: -45%;
    width: 120%;
    height: 30%;
    background: radial-gradient(closest-side, rgba(214, 236, 255, 0.6), transparent);
  }

  .members-sp-card {
    --sp-rot: -0.4deg;
    --sp-float-dur: 6.8s;
    position: relative;
  }
  .members-sp-card:nth-of-type(2) {
    --sp-rot: 0.5deg;
    --sp-float-dur: 7.5s;
  }
  .members-sp-card:nth-of-type(3) {
    --sp-rot: -0.3deg;
    --sp-float-dur: 7.1s;
  }

  /* 浮遊（最大 5px）＋ 浮いた時だけ少し広がる影 */
  .members-sp-card__float {
    position: relative;
    animation: members-sp-float var(--sp-float-dur) ease-in-out calc(var(--sp-i, 0) * -1.6s) infinite;
  }
  .members-sp-card__float::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    rotate: var(--sp-rot);
    box-shadow: 0 26px 52px rgba(36, 50, 80, 0.14);
    opacity: 0;
    animation: members-sp-shadow var(--sp-float-dur) ease-in-out calc(var(--sp-i, 0) * -1.6s) infinite;
    pointer-events: none;
  }
  @keyframes members-sp-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes members-sp-shadow {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  /* 画像：角丸・柔らかい影・ごくわずかな傾き・ゆっくり通過する光 */
  .members-sp-card__frame {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    rotate: var(--sp-rot);
    box-shadow:
      0 18px 40px rgba(36, 50, 80, 0.1),
      0 6px 16px rgba(36, 50, 80, 0.06);
  }
  .members-sp-card__image {
    display: block;
    width: 100%;
    height: auto; /* 縦横比はそのまま */
  }
  .members-sp-card__frame::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.2) 50%, transparent 65%);
    transform: translateX(-100%);
    opacity: 0.7;
    animation: members-sp-sweep 10s ease-in-out calc(var(--sp-i, 0) * 2.5s) infinite;
    pointer-events: none;
  }
  @keyframes members-sp-sweep {
    0% { transform: translateX(-100%); }
    30%, 100% { transform: translateX(100%); }
  }

  /* 「一歩ずつ、できることが増えていく。」：1枚目の画像の右上に添える（画像の角に少しだけ重なる）
     デザイン・動きは PC と同じ。位置と大きさだけ SP 用に調整 */
  .members-sp-note {
    position: absolute;
    z-index: 2;
    top: 0;
    right: clamp(2px, 2.5vw, 12px);
    width: var(--sp-note-w);
    margin: 0;
    font-size: clamp(13px, 3.8vw, 15px);
  }

  /* カード間の小さな葉っぱ（画像の外側の余白に置く） */
  .members-sp-leaf {
    position: absolute;
    bottom: -33px; /* カード間の余白（42px）の中に収める */
    width: auto;
    height: 20px;
    opacity: 0.75;
    pointer-events: none;
    animation: members-leaf-sway 9s ease-in-out infinite;
  }
  .members-sp-leaf--0 {
    right: 10px;
  }
  .members-sp-leaf--1 {
    left: 12px;
    height: 18px;
    animation-duration: 11s;
    animation-delay: -4s;
  }
  @keyframes members-leaf-sway {
    0%, 100% { transform: translateY(0) rotate(-3deg); }
    50% { transform: translateY(-7px) rotate(4deg); }
  }
}

/* スクロール表示：1枚ずつ、その画像が画面に入ったときに1回だけ（共通の v-reveal = IntersectionObserver、表示後は監視を解除）
   1枚目・3枚目は左から / 2枚目は右から（少し下から・ごく小さい scale も組み合わせる） */
:global(.reveal-ready .members .members-sp-card--reveal.reveal) {
  transform: translateX(-70px) translateY(18px) scale(0.98);
  transition:
    opacity 0.85s ease,
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 250ms; /* 説明文の後に */
}
:global(.reveal-ready .members .members-sp-card--reveal.reveal:nth-of-type(2)) {
  transform: translateX(70px) translateY(18px) scale(0.98);
}
:global(.reveal-ready .members.is-content-ready .members-sp-card--reveal.reveal.is-revealed) {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .members-sp-card__float,
  .members-sp-card__float::before,
  .members-sp-card__frame::after,
  .members-sp-leaf {
    animation: none;
  }
  .members-sp-card__frame::after {
    display: none;
  }
  :global(.reveal-ready .members .members-sp-card--reveal.reveal),
  :global(.reveal-ready .members .members-sp-card--reveal.reveal:nth-of-type(2)) {
    transform: none;
  }
}
/* ================= PC（1024px〜）だけ：上に見出し・下にメンバー画像3枚の Collage Layout ================= */
.members-pc-deco,
.members-pc-intro-leaves,
.members-note-leaf {
  display: none;
}
@media (min-width: 1024px) {
  /* ---------- 全体：見出しブロック（中央）→ 画像3枚 ---------- */
  .members__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(36px, 4vw, 64px);
  }
  .members__people {
    display: none; /* 従来のメンバーカード一覧は使わない */
  }

  /* ---------- 見出し：01 の右に MEMBERS・2行の見出し、説明文はその下に中央揃え ---------- */
  .members__intro {
    position: relative;
    align-items: center;
  }
  .members__head {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: clamp(14px, 1.4vw, 22px);
    align-items: center;
    width: fit-content;
    margin-inline: auto;
  }
  .members__head-text {
    display: contents;
  }
  .members__number {
    grid-row: 1 / span 2;
    font-size: clamp(5rem, 3rem + 3.6vw, 7.5rem);
  }
  .members__label {
    grid-column: 2;
    align-self: end;
  }
  .members__title {
    grid-column: 2;
    align-self: start;
    max-width: 6.6em; /* 「どんな人が / 働いている？」の2行に */
    font-size: clamp(1.875rem, 1.1rem + 1.2vw, 2.625rem);
    line-height: 1.3;
  }
  .members__lead {
    grid-column: 1 / -1;
    max-width: none;
    margin-top: clamp(18px, 1.8vw, 26px);
    text-align: center;
  }
  /* 「いろんなバックグラウンドの仲間がいます！」は PC では表示しない（代わりに葉っぱ） */
  .members__handwritten {
    display: none;
  }
  .members-pc-intro-leaves {
    position: absolute;
    left: clamp(0px, 3vw, 60px);
    top: 38%;
    display: block;
    width: 220px;
    height: 150px;
    pointer-events: none;
  }
  .members-pc-intro-leaf {
    position: absolute;
    width: auto;
    opacity: 0.85;
    animation: members-leaf-a 8.5s ease-in-out infinite;
  }
  .members-pc-intro-leaf--1 { left: 30%; top: 0; height: 30px; rotate: -25deg; }
  .members-pc-intro-leaf--2 { left: 0; top: 40%; height: 52px; animation-name: members-leaf-b; animation-duration: 10s; animation-delay: -3s; }
  .members-pc-intro-leaf--3 { right: 0; top: 30%; height: 34px; rotate: 35deg; animation-duration: 7.5s; animation-delay: -5s; }
  .members-pc-intro-leaf--4 { left: 48%; bottom: 0; height: 26px; rotate: 70deg; animation-name: members-leaf-b; animation-duration: 9s; animation-delay: -1.5s; }

  /* ---------- 画像3枚：横一列・少し重なり・角度と高さにリズム ---------- */
  .members-sp-gallery {
    position: static; /* Note はセクション上部（.members__grid 基準）に置く */
    --g: clamp(28px, 2.6vw, 44px); /* 画像同士の間隔（重ねない） */
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: var(--g);
    width: min(94vw, 1400px);
    margin-inline: calc(50% - min(47vw, 700px));
    padding-bottom: 80px; /* 中央の画像を下げた分 */
  }
  /* 3枚は重ねず、間隔をあけて並べる（幅は3等分。最大 460px） */
  .members-sp-card {
    --sp-rot: -1deg;
    --pc-float: 5px;
    --pc-float-dur: 7.2s;
    --pc-lift: clamp(30px, 3.2vw, 50px); /* 1枚目・3枚目を上げる量 */
    position: relative;
    flex: none;
    width: min(460px, calc((100% - var(--g) * 2) / 3));
    margin-top: calc(var(--pc-lift) * -1);
  }
  .members-sp-card:nth-of-type(2) {
    --sp-rot: 0.5deg;
    --pc-float: 7px;
    --pc-float-dur: 8.4s;
    margin-top: 70px; /* 中央は少し下（位置はそのまま） */
  }
  .members-sp-card:nth-of-type(3) {
    --sp-rot: 1deg;
    --pc-float: 4px;
    --pc-float-dur: 6.6s;
    margin-top: calc(12px - var(--pc-lift));
  }

  /* 登場後のごく小さい浮遊（3枚で周期・タイミングをずらす） */
  .members-sp-card__float {
    animation: members-pc-float var(--pc-float-dur) ease-in-out calc(var(--sp-i, 0) * 1.1s) infinite;
  }
  @keyframes members-pc-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(calc(var(--pc-float) * -1)); }
  }

  /* Photo Card：角丸・薄い白枠・柔らかい影・ごく薄い外側の光。角度は rotate（hover の transform と別） */
  .members-sp-card__frame {
    position: relative;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.92);
    border-radius: 20px;
    rotate: var(--sp-rot);
    box-shadow:
      0 22px 55px rgba(24, 45, 80, 0.13),
      0 8px 20px rgba(24, 45, 80, 0.08),
      0 0 0 8px rgba(255, 255, 255, 0.22);
    transition:
      transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.45s ease;
  }
  .members-sp-card__image {
    display: block;
    width: 100%;
    height: auto; /* 縦横比はそのまま・切り取らない */
  }
  @media (hover: hover) and (pointer: fine) {
    .members-sp-card__frame:hover {
      transform: translateY(-8px) scale(1.015);
      box-shadow:
        0 30px 64px rgba(24, 45, 80, 0.17),
        0 10px 24px rgba(24, 45, 80, 0.1),
        0 0 0 8px rgba(255, 255, 255, 0.26);
    }
  }

  /* 画像の間の葉っぱ（SP 用の要素）：PC では使わない（周りの葉っぱは .members-pc-leaf） */
  .members-sp-leaf {
    display: none;
  }

  /* 「一歩ずつ、できることが増えていく。」：セクション右上の余白（デザイン・動きはそのまま、位置だけ） */
  .members-sp-note {
    --note-w: clamp(120px, 10.5vw, 150px);
    position: absolute;
    z-index: 2;
    top: calc(clamp(0px, 1vw, 20px) + clamp(30px, 3vw, 45px)); /* 以前より 30〜45px 下 */
    right: clamp(0px, 3vw, 60px);
    width: var(--note-w);
    margin: 0;
    font-size: clamp(0.8125rem, 0.5rem + 0.45vw, 0.9375rem);
  }

  /* Note の右横・右下・下の葉っぱ（Note と一緒にゆっくり浮き、それぞれ別の周期で揺れる） */
  .members-note-leaf {
    position: absolute;
    display: block;
    width: auto;
    opacity: 0.85;
    pointer-events: none;
    animation: members-leaf-a 7s ease-in-out infinite;
  }
  .members-note-leaf--1 { right: -34px; top: 26%; height: 34px; rotate: 30deg; }
  .members-note-leaf--2 { right: -22px; bottom: -26px; height: 40px; animation-name: members-leaf-b; animation-duration: 9s; animation-delay: -3s; }
  .members-note-leaf--3 { left: 22%; bottom: -30px; height: 26px; rotate: -55deg; animation-duration: 8s; animation-delay: -5s; }

  /* ---------- 背景：淡い Blob をゆっくり動かす（PC だけ） ---------- */
  .members__circle--yellow-l,
  .members__circle--pink-l {
    animation: members-pc-bg-a 16s ease-in-out infinite;
  }
  .members__circle--green-r,
  .members__circle--yellow-r {
    animation: members-pc-bg-b 18s ease-in-out -6s infinite;
  }
  .members-pc-deco {
    position: absolute;
    inset: 0;
    display: block;
  }
  .members-pc-deco > * {
    position: absolute;
  }
  .members-pc-blob {
    border-radius: 50%;
    animation: members-pc-bg-a 14s ease-in-out -4s infinite;
  }
  .members-pc-blob--mint {
    left: 26%;
    bottom: 6%;
    width: 360px;
    height: 220px;
    background: radial-gradient(closest-side, rgba(200, 240, 218, 0.55), transparent);
  }
  .members-pc-blob--blue {
    right: 8%;
    top: 30%;
    width: 380px;
    height: 300px;
    background: radial-gradient(closest-side, rgba(210, 232, 255, 0.6), transparent);
    animation: members-pc-bg-b 17s ease-in-out -9s infinite;
  }
  @keyframes members-pc-bg-a {
    0%, 100% { translate: 0 0; scale: 1; }
    50% { translate: 15px -10px; scale: 1.05; }
  }
  @keyframes members-pc-bg-b {
    0%, 100% { translate: 0 0; scale: 1; }
    50% { translate: -12px 8px; scale: 1.04; }
  }

  /* 見出しの右上の短い線（小さなアクセント） */
  .members-pc-rays {
    top: clamp(40px, 5vw, 80px);
    left: calc(50% + clamp(170px, 15vw, 230px));
    width: 30px;
    height: 30px;
  }
  .members-pc-rays i {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 3px;
    height: 12px;
    border-radius: 2px;
    background: #ffc93d;
    transform-origin: 50% 100%;
  }
  .members-pc-rays i:nth-child(1) { rotate: -40deg; }
  .members-pc-rays i:nth-child(2) { rotate: 0deg; height: 15px; }
  .members-pc-rays i:nth-child(3) { rotate: 40deg; }

  /* ---------- 葉っぱ：余白に配置（画像・文字には重ねない）、2パターンでゆっくり揺らす ---------- */
  .members-pc-leaf {
    width: auto;
    opacity: 0.85;
    pointer-events: none;
    animation: members-leaf-a 9s ease-in-out infinite;
  }
  .members-pc-leaf--1 { left: 4%; top: 4%; height: 54px; rotate: -20deg; }
  .members-pc-leaf--2 { left: 20%; top: 2%; height: 60px; animation-name: members-leaf-b; animation-duration: 11s; animation-delay: -3s; }
  .members-pc-leaf--3 { left: calc(50% + clamp(240px, 22vw, 320px)); top: 5%; height: 44px; rotate: 30deg; animation-duration: 8s; animation-delay: -5s; }
  .members-pc-leaf--4 { left: 1%; top: 24%; height: 44px; rotate: -35deg; animation-name: members-leaf-b; animation-duration: 10s; animation-delay: -2s; }
  .members-pc-leaf--5 { right: 0.5%; top: 80%; height: 60px; rotate: 15deg; animation-duration: 12s; animation-delay: -7s; }
  .members-pc-leaf--6 { left: 30%; bottom: 2%; height: 42px; rotate: -60deg; animation-name: members-leaf-b; animation-duration: 9.5s; animation-delay: -4s; }
  .members-pc-leaf--7 { right: 30%; bottom: 2.5%; height: 40px; rotate: 50deg; animation-duration: 7.5s; animation-delay: -1s; }
  @keyframes members-leaf-a {
    0%, 100% { transform: translate(0, 0) rotate(-4deg); }
    50% { transform: translate(5px, -12px) rotate(5deg); }
  }
  @keyframes members-leaf-b {
    0%, 100% { transform: translate(0, 0) rotate(3deg); }
    50% { transform: translate(-6px, 8px) rotate(-5deg); }
  }

  /* ---------- スクロール表示：左 → 中央 → 右（各画像につき1回だけ） ---------- */
  :global(.reveal-ready .members .members-sp-card--reveal.reveal) {
    transform: translateX(-70px) translateY(35px) rotate(-4deg);
    transition:
      opacity 0.95s ease,
      transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: calc(250ms + var(--sp-i, 0) * 180ms);
  }
  :global(.reveal-ready .members .members-sp-card--reveal.reveal:nth-of-type(2)) {
    transform: translateY(80px) scale(0.96);
  }
  :global(.reveal-ready .members .members-sp-card--reveal.reveal:nth-of-type(3)) {
    transform: translateX(70px) translateY(35px) rotate(4deg);
  }
  :global(.reveal-ready .members.is-content-ready .members-sp-card--reveal.reveal.is-revealed) {
    transform: none;
  }
}
@media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
  .members-sp-card__float,
  .members-pc-leaf,
  .members-pc-intro-leaf,
  .members-note-leaf,
  .members-pc-blob,
  .members__circle {
    animation: none;
  }
  .members-sp-card__frame {
    transition: none;
  }
  .members-sp-card__frame:hover {
    transform: none;
  }
  :global(.reveal-ready .members .members-sp-card--reveal.reveal),
  :global(.reveal-ready .members .members-sp-card--reveal.reveal:nth-of-type(2)),
  :global(.reveal-ready .members .members-sp-card--reveal.reveal:nth-of-type(3)) {
    transform: none;
  }
}
/* ================= メンバー画像の後ろの Premium 背景（SP / PC 共通。06 INTERVIEW の画像と同じデザイン言語） ================= */
.members-sp-card__float {
  position: relative;
  z-index: 1; /* 背景装飾より前 */
}
.members-premium-bg {
  --bg-out: 30px; /* 画像からはみ出す範囲（SP は小さめ） */
  /* member-01：ピーチ・クリーム・淡いコーラル・淡いイエロー・少しミント */
  --c1: rgba(255, 220, 200, 0.67);
  --c2: rgba(255, 239, 194, 0.72);
  --c3: rgba(255, 205, 215, 0.51);
  --c4: rgba(190, 235, 205, 0.48);
  --line: rgba(255, 170, 140, 0.38);
  --line2: rgba(150, 215, 175, 0.33);
  position: absolute;
  z-index: 0;
  inset: calc(var(--bg-out) * -1);
  pointer-events: none;
}
/* member-02：ミント・ライトブルー・淡いグリーン・少し暖かいイエロー */
.members-sp-card:nth-of-type(2) .members-premium-bg {
  --c1: rgba(194, 240, 218, 0.67);
  --c2: rgba(201, 230, 255, 0.64);
  --c3: rgba(223, 246, 225, 0.67);
  --c4: rgba(255, 235, 180, 0.45);
  --line: rgba(120, 200, 170, 0.38);
  --line2: rgba(120, 180, 240, 0.33);
}
/* member-03：ライトブルー・ラベンダー・ソフトピンク・少しミント */
.members-sp-card:nth-of-type(3) .members-premium-bg {
  --c1: rgba(194, 225, 255, 0.67);
  --c2: rgba(225, 215, 255, 0.61);
  --c3: rgba(255, 215, 230, 0.51);
  --c4: rgba(205, 242, 225, 0.45);
  --line: rgba(120, 170, 240, 0.38);
  --line2: rgba(255, 170, 200, 0.3);
}
.members-premium-bg > * {
  position: absolute;
}
/* 大きな淡い Blob（不規則な形・少しぼかして「後ろから色が広がる」感じに） */
.members-premium-bg__blob {
  inset: -4% -3% 2% -6%;
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  background: linear-gradient(135deg, var(--c1), var(--c2) 55%, var(--c3));
  filter: blur(12px);
  opacity: 1;
  animation: members-premium-morph 14s ease-in-out calc(var(--sp-i, 0) * -4s) infinite;
}
.members-premium-bg__blob--sub {
  inset: 22% -8% -8% 34%;
  border-radius: 55% 45% 40% 60% / 45% 55% 50% 50%;
  background: linear-gradient(160deg, var(--c4), var(--c3));
  opacity: 0.7;
  animation-duration: 17s;
  animation-delay: calc(var(--sp-i, 0) * -3s - 6s);
}
/* 画像の後ろの淡い光（画像より少し大きい範囲） */
.members-premium-bg__glow {
  inset: -6%;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--c2) 0%, rgba(255, 255, 255, 0.12) 45%, transparent 72%);
  animation: members-premium-glow 10s ease-in-out calc(var(--sp-i, 0) * -3s) infinite;
}
/* 画像の後ろを通る大きな楕円の細い線（画像ごとに角度・位置を変える） */
.members-premium-bg__curve {
  inset: -2% 0 4% -3%;
  border: 1.5px solid var(--line);
  border-radius: 50%;
  rotate: -6deg;
  animation: members-premium-line 13s ease-in-out infinite;
}
.members-premium-bg__curve--sub {
  inset: 6% -4% -4% 4%;
  border-color: var(--line2);
  rotate: 8deg;
  animation-duration: 16s;
  animation-direction: reverse;
}
.members-sp-card:nth-of-type(2) .members-premium-bg__curve { rotate: 5deg; inset: 0 -4% 2% 0; }
.members-sp-card:nth-of-type(2) .members-premium-bg__curve--sub { rotate: -9deg; inset: 8% 2% -5% -5%; }
.members-sp-card:nth-of-type(3) .members-premium-bg__curve { rotate: -10deg; inset: -4% -2% 6% 2%; }
.members-sp-card:nth-of-type(3) .members-premium-bg__curve--sub { rotate: 4deg; inset: 4% -5% -2% -2%; }
/* 葉っぱ（既存の素材・ゆっくり揺れる）：1枚目 左上・右下 / 2枚目 右上・左下 / 3枚目 左上・右 */
.members-premium-bg__leaf {
  width: auto;
  height: 30px;
  opacity: 0.85;
  animation: members-premium-leaf 8s ease-in-out infinite alternate;
}
.members-premium-bg__leaf--1 { left: -1%; top: -2%; rotate: -35deg; }
.members-premium-bg__leaf--2 { right: -1%; bottom: -2%; height: 26px; rotate: 140deg; animation-duration: 9.5s; animation-delay: -3s; }
.members-sp-card:nth-of-type(2) .members-premium-bg__leaf--1 { left: auto; right: -1%; rotate: 35deg; }
.members-sp-card:nth-of-type(2) .members-premium-bg__leaf--2 { right: auto; left: -1%; rotate: -140deg; }
.members-sp-card:nth-of-type(3) .members-premium-bg__leaf--2 { bottom: auto; top: 46%; right: -2%; rotate: 70deg; }
@keyframes members-premium-glow {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.75; }
  50% { transform: translate3d(4px, -5px, 0) scale(1.025); opacity: 1; }
}
@keyframes members-premium-morph {
  0%, 100% { border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%; transform: translate3d(0, 0, 0); }
  50% { border-radius: 52% 48% 45% 55% / 44% 54% 46% 56%; transform: translate3d(5px, -4px, 0); }
}
@keyframes members-premium-line {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}
@keyframes members-premium-leaf {
  0% { transform: translate(0, 0) rotate(-3deg); }
  100% { transform: translate(3px, -6px) rotate(4deg); }
}

/* 画像：白い細いフレーム＋上品な影（PC / SP 共通。角丸は現在のまま） */
.members-sp-card__frame {
  border: 5px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 20px 45px rgba(30, 55, 90, 0.1),
    0 8px 18px rgba(30, 55, 90, 0.07),
    0 0 30px rgba(255, 255, 255, 0.45);
}
@media (min-width: 1024px) {
  .members-premium-bg {
    --bg-out: 48px; /* PC：少し広めに（画像の外まで淡い色が広がる） */
  }
}
/* SP：装飾をコンパクトに（画像・文字にかからない・横にはみ出さない） */
@media (max-width: 767px) {
  .members-premium-bg {
    --bg-out: 14px;
  }
  .members-premium-bg__blob {
    filter: blur(8px);
  }
  /* SP：葉っぱは画像の上の余白へ（画面の端・画像にかからない） */
  .members .members-premium-bg__leaf--1 {
    top: -14px;
    left: 10%;
    right: auto;
  }
  .members .members-sp-card:nth-of-type(2) .members-premium-bg__leaf--1 {
    left: auto;
    right: 10%;
  }
  .members-premium-bg__curve {
    opacity: 0.7;
  }
  .members-premium-bg__curve--sub,
  .members-premium-bg__leaf--2 {
    display: none;
  }
  .members-premium-bg__leaf--1 {
    height: 22px;
  }
}

/* ================= SP（〜767px）だけ：「一歩ずつ…」の周りの葉っぱ ================= */
.members-sp-note-leaf {
  display: none;
}
@media (max-width: 767px) {
  .members-sp-note-leaf {
    --leaf-rotate: -18deg;
    position: absolute;
    display: block;
    width: auto;
    opacity: 0.85;
    pointer-events: none;
    animation: members-note-leaf-float 5.5s ease-in-out infinite;
  }
  /* 上・左上・左（画像の上の余白側。Note の文字・画像には重ねない） */
  .members-sp-note-leaf--1 { --leaf-rotate: 12deg; top: -22px; left: 46%; height: 16px; animation-duration: 6.3s; animation-delay: -2s; }
  .members-sp-note-leaf--2 { --leaf-rotate: -18deg; top: -6px; left: -18px; height: 24px; }
  .members-sp-note-leaf--3 { --leaf-rotate: 22deg; top: 42%; left: -30px; height: 20px; width: 9px; object-fit: fill; animation-duration: 7.1s; animation-delay: -4s; }
  .members-sp-note-leaf--4 { --leaf-rotate: -8deg; top: -14px; right: 6%; height: 20px; animation-duration: 7.8s; animation-delay: -1s; }
  @keyframes members-note-leaf-float {
    0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--leaf-rotate)); }
    50% { transform: translate3d(3px, -7px, 0) rotate(calc(var(--leaf-rotate) + 3deg)); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .members-premium-bg__glow,
  .members-premium-bg__blob,
  .members-premium-bg__curve,
  .members-premium-bg__leaf,
  .members-sp-note-leaf {
    animation: none;
  }
}
</style>
