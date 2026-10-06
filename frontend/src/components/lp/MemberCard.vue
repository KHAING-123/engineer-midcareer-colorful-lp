<script setup>
/**
 * メンバー1人分：丸い人物画像 ＋ 横長プロフィールカード（人物はカードの外へ少しはみ出す）
 * 文字・画像はすべて lpContent.js の members / membersSection から受け取ります。
 * 色は member.accent（blue / pink / green / yellow）で切り替わります。
 *
 * レイヤーの分担（transform が競合しないように分離）
 *   .member              … hover（PCのみ）
 *   .member__avatar-float … 人物の浮遊（＋人物まわりの線・ドット）
 *   .member__card-float   … カードの浮遊（＋浮いた時の影）
 *   ※ スクロール表示は親（MembersSection の li.member-reveal）
 */
import { computed } from 'vue'
import { img } from '../../utils/image.js'

const props = defineProps({
  member: { type: Object, required: true },
  labels: { type: Object, default: () => ({}) }, // nameSuffix / ageUnit / previousPrefix
  reverse: { type: Boolean, default: false }, // true：人物を右側に（PC）
  index: { type: Number, default: 0 },
})

// 浮遊の周期を1人ずつ少し変える（カードと人物も別の周期）
const CARD_DUR = ['6.5s', '7.2s', '6.8s']
const AVATAR_DUR = ['6.1s', '7.4s', '5.8s']
const floatStyle = computed(() => ({
  '--card-dur': CARD_DUR[props.index % 3],
  '--avatar-dur': AVATAR_DUR[props.index % 3],
  '--float-delay': `${props.index * -1.7}s`,
}))
</script>

<template>
  <article
    class="member"
    :class="[`member--${member.accent || 'blue'}`, { 'member--reverse': reverse }]"
    :style="floatStyle"
  >
    <!-- 人物（丸）＋まわりの短い線・ドット -->
    <div class="member__avatar-float">
      <div class="member__avatar">
        <img :src="img(member.image)" :alt="member.imageAlt" width="240" height="240" loading="lazy" />
      </div>
      <span class="member__rays" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="member__adots" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    </div>

    <!-- 横長プロフィールカード -->
    <div class="member__card-float">
      <div class="member__card">
        <!-- カード内の装飾（文字より後ろ） -->
        <span class="member__card-bg" aria-hidden="true">
          <span class="member__blob"></span>
          <span class="member__blob member__blob--sub"></span>
          <span class="member__circle"></span>
          <span class="member__leaf"></span>
          <span class="member__dots"><i></i><i></i><i></i><i></i><i></i><i></i></span>
        </span>

        <h3 class="member__name">
          {{ member.name }}{{ labels.nameSuffix }}<span class="member__sep" aria-hidden="true"> / </span><span class="visually-hidden">、</span><span class="member__age">{{ member.age }}{{ labels.ageUnit }}</span>
        </h3>
        <p class="member__career">
          <span class="member__prev">{{ labels.previousPrefix }}{{ member.previousJob }}</span>
          <span class="member__arrow" aria-hidden="true">→</span><span class="visually-hidden">から</span>
          <strong class="member__now">{{ member.currentRole }}</strong>
        </p>
        <p class="member__comment">{{ member.comment }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ================= 色（Blue / Pink / Mint） ================= */
.member {
  --m-tint: rgba(230, 245, 255, 0.88);   /* カードのグラデーション（右下側） */
  --m-border: rgba(116, 190, 245, 0.28); /* 枠線 */
  --m-accent: #5aa9ec;                   /* 線・ドット */
  --m-pale: #d4ebfb;                     /* Blob・丸 */
  --m-divider: rgba(116, 190, 245, 0.4); /* 区切り線 */
}
.member--pink {
  --m-tint: rgba(255, 235, 238, 0.88);
  --m-border: rgba(244, 164, 174, 0.28);
  --m-accent: #f47f8c;
  --m-pale: #ffd9df;
  --m-divider: rgba(244, 164, 174, 0.45);
}
.member--green {
  --m-tint: rgba(228, 250, 237, 0.9);
  --m-border: rgba(113, 211, 158, 0.28);
  --m-accent: #4cc68a;
  --m-pale: #c8f0d9;
  --m-divider: rgba(113, 211, 158, 0.45);
}
.member--yellow {
  --m-tint: rgba(255, 246, 218, 0.9);
  --m-border: rgba(240, 196, 100, 0.3);
  --m-accent: #f2b33d;
  --m-pale: #fdecbf;
  --m-divider: rgba(240, 196, 100, 0.45);
}

/* ================= レイアウト（PC / Tablet：人物が横からはみ出す） ================= */
.member {
  --avatar-size: clamp(116px, 10.5vw, 150px);
  --avatar-in: clamp(22px, 2vw, 30px); /* 人物がカードに重なる量 */
  --card-float-y: 5px;
  --avatar-float-y: 6px;
  position: relative;
  display: flex;
  align-items: center;
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.member--reverse {
  flex-direction: row-reverse;
  margin-left: auto;
}

/* ---------- 人物 ---------- */
.member__avatar-float {
  position: relative;
  z-index: 2; /* カードより上 */
  flex: none;
  width: var(--avatar-size);
  animation: member-avatar-float var(--avatar-dur, 6.4s) ease-in-out var(--float-delay, 0s) infinite;
}
.member__avatar {
  position: relative;
  aspect-ratio: 1;
  border: 10px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94); /* 画像に背景色が含まれるため、CSS では色を重ねない */
  box-shadow: 0 16px 35px rgba(31, 52, 91, 0.12), 0 4px 12px rgba(31, 52, 91, 0.06);
  overflow: hidden;
}
.member__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 人物から外へ広がる短い丸線 3本（左上。人物が右のときは右上へ反転） */
.member__rays {
  position: absolute;
  top: -2%;
  left: -4%;
  width: 34%;
  aspect-ratio: 1;
  pointer-events: none;
}
.member--reverse .member__rays {
  left: auto;
  right: -4%;
  scale: -1 1;
}
.member__rays i {
  position: absolute;
  width: 11%;
  height: 36%;
  border-radius: 999px;
  background: var(--m-accent);
  transform-origin: 50% 100%;
  animation: member-ray 3.2s ease-in-out infinite;
}
.member__rays i:nth-child(1) { left: 6%; top: 44%; rotate: -62deg; }
.member__rays i:nth-child(2) { left: 26%; top: 14%; rotate: -34deg; animation-delay: 0.4s; }
.member__rays i:nth-child(3) { left: 56%; top: 0; rotate: -8deg; animation-delay: 0.8s; }

/* 人物の下側の小さなドット */
.member__adots {
  position: absolute;
  left: -10%;
  bottom: 6%;
  width: 22%;
  aspect-ratio: 1;
  pointer-events: none;
}
.member--reverse .member__adots {
  left: auto;
  right: -10%;
}
.member__adots i {
  position: absolute;
  width: 12%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--m-accent);
  animation: member-dot 4.2s ease-in-out infinite;
}
.member__adots i:nth-child(1) { left: 10%; top: 8%; }
.member__adots i:nth-child(2) { left: 48%; top: 28%; animation-delay: 0.7s; }
.member__adots i:nth-child(3) { left: 22%; top: 58%; width: 9%; animation-delay: 1.4s; }
.member__adots i:nth-child(4) { left: 64%; top: 74%; width: 16%; opacity: 0.4; animation-delay: 2.1s; }

/* ---------- カード ---------- */
.member__card-float {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  max-width: 400px;
  margin-left: calc(var(--avatar-in) * -1);
  border-radius: 30px;
  animation: member-card-float var(--card-dur, 6.8s) ease-in-out var(--float-delay, 0s) infinite;
}
.member--reverse .member__card-float {
  margin-left: 0;
  margin-right: calc(var(--avatar-in) * -1);
}
/* 浮いた時だけ濃くなる影（カードの浮遊と同じ周期で重ねる） */
.member__card-float::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  box-shadow: 0 22px 48px rgba(31, 52, 91, 0.11);
  opacity: 0;
  animation: member-card-shadow var(--card-dur, 6.8s) ease-in-out var(--float-delay, 0s) infinite;
  pointer-events: none;
}
.member__card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 22px 16px calc(var(--avatar-in) + 18px);
  border: 1px solid var(--m-border);
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), var(--m-tint));
  box-shadow:
    0 14px 35px rgba(31, 52, 91, 0.07),
    0 5px 16px rgba(31, 52, 91, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transition: box-shadow 0.4s ease;
}
.member--reverse .member__card {
  padding: 32px calc(var(--avatar-in) + 30px) 32px 54px; /* 左はドットの分だけ少し広め */
}
.member__card > :not(.member__card-bg) {
  position: relative; /* 装飾より前 */
}

/* カード内の装飾（Blob・丸・葉・ドット）：カードの角丸の中だけに表示 */
.member__card-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}
.member__card-bg > * {
  position: absolute;
}
.member__blob {
  right: -40px;
  bottom: -54px;
  width: 190px;
  height: 130px;
  border-radius: 58% 42% 50% 50% / 60% 55% 45% 40%;
  background: var(--m-pale);
  opacity: 0.75;
  animation: member-blob 9s ease-in-out infinite;
}
.member__blob--sub {
  right: 70px;
  bottom: -70px;
  width: 120px;
  height: 100px;
  opacity: 0.45;
  animation-delay: -4s;
}
.member--reverse .member__blob {
  right: auto;
  left: -40px;
}
.member--reverse .member__blob--sub {
  left: 70px;
}
.member__circle {
  display: none;
  top: 20px;
  right: 58px;
  width: 38px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--m-pale);
  opacity: 0.8;
}
.member--blue .member__circle {
  display: block;
}
.member__leaf {
  display: none;
  top: 22px;
  right: 58px;
  width: 30px;
  height: 40px;
  border-radius: 0 100% 0 100%;
  background: var(--m-pale);
  rotate: 28deg;
}
.member--green .member__leaf {
  display: block;
}
/* 小さなドット（人物と反対側の上） */
.member__dots {
  top: 22px;
  right: 14px;
  width: 26px;
  height: 34px;
}
.member--reverse .member__dots {
  right: auto;
  left: 12px;
}
.member__dots i {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--m-accent);
  animation: member-dot 4.6s ease-in-out infinite;
}
.member__dots i:nth-child(1) { left: 14px; top: 0; }
.member__dots i:nth-child(2) { left: 4px; top: 8px; animation-delay: 0.5s; }
.member__dots i:nth-child(3) { left: 18px; top: 12px; animation-delay: 1s; }
.member__dots i:nth-child(4) { left: 8px; top: 19px; animation-delay: 1.5s; }
.member__dots i:nth-child(5) { left: 20px; top: 25px; animation-delay: 2s; }
.member__dots i:nth-child(6) { left: 2px; top: 29px; animation-delay: 2.5s; }

/* ---------- 文字 ---------- */
.member__name {
  color: var(--color-navy);
  font-size: var(--fs-base);
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: 0.02em;
}
.member__sep {
  color: var(--color-text-muted);
  font-weight: 700;
}
.member__career {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 8px;
  margin-top: 2px;
  font-size: var(--fs-xs);
  line-height: 1.6;
}
.member__prev {
  color: #667085;
  font-weight: 500;
}
.member__arrow {
  color: #ff6b57;
  font-weight: 700;
}
.member__now {
  color: var(--color-navy);
  font-weight: 800;
}
.member__comment {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--m-divider);
  color: var(--color-navy);
  font-size: var(--fs-sm);
  font-weight: 400;
  line-height: 1.75;
  text-wrap: balance; /* 最後の行が1〜2文字だけにならないように */
}
.member__comment::before {
  content: '「';
}
.member__comment::after {
  content: '」';
}

/* ---------- hover（PCのみの追加演出） ---------- */
@media (hover: hover) and (pointer: fine) {
  .member:hover {
    transform: translateY(-5px);
  }
  .member:hover .member__card {
    box-shadow:
      0 22px 50px rgba(31, 52, 91, 0.11),
      0 6px 18px rgba(31, 52, 91, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.85);
  }
}

/* ---------- ループアニメーション（控えめ） ---------- */
@keyframes member-card-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(var(--card-float-y) * -1)); }
}
@keyframes member-card-shadow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
@keyframes member-avatar-float {
  0%, 100% { transform: translateY(0) rotate(-0.5deg); }
  50% { transform: translateY(calc(var(--avatar-float-y) * -1)) rotate(0.5deg); }
}
@keyframes member-ray {
  0%, 100% { opacity: 0.3; scale: 0.85; }
  50% { opacity: 1; scale: 1.05; }
}
@keyframes member-dot {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.75; }
}
@keyframes member-blob {
  0%, 100% { scale: 1; }
  50% { scale: 1.03; }
}

/* ================= SP（〜600px）：人物を小さく、カードの上側にそろえる ================= */
@media (max-width: 600px) {
  .member {
    --avatar-size: 92px;
    --avatar-in: 18px;
    align-items: flex-start;
  }
  .member__card {
    padding: 14px 16px 14px calc(var(--avatar-in) + 14px);
  }
  .member__card-float {
    margin-top: 12px;
  }
}
/* SP：浮遊を少し弱く（文字サイズは PC と同じ変数で自動調整） */
@media (max-width: 767px) {
  .member {
    --card-float-y: 3px;
    --avatar-float-y: 4px;
  }
}
/* とても狭い画面：人物 → カードの縦並び */
@media (max-width: 359px) {
  .member {
    flex-direction: column;
    align-items: center;
  }
  .member__card-float {
    width: 100%;
    margin-left: 0;
    margin-top: -20px;
  }
  .member__card {
    padding: 28px 16px 14px;
  }
}

/* 動きを減らす設定：ループ・hover の移動なし（全体設定でもアニメーションは止まります） */
@media (prefers-reduced-motion: reduce) {
  .member__avatar-float,
  .member__card-float,
  .member__card-float::before,
  .member__rays i,
  .member__adots i,
  .member__dots i,
  .member__blob {
    animation: none;
  }
  .member {
    transition: none;
  }
  .member:hover {
    transform: none;
  }
}
</style>
