/**
 * オープニング（OpeningScreen.vue）とページ本体の連携用
 *  紙が閉じている間は html に HOLD_CLASS が付きます。
 *  紙がめくれ始めると RELEASE_EVENT が window に送られます。
 */
export const HOLD_CLASS = 'is-opening-hold'
export const RELEASE_EVENT = 'lp:opening-release'

export const isOpeningHold = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains(HOLD_CLASS)
