/**
 * 画像の読み込みヘルパー
 *
 * lpContent.js では画像を 'members/member-01.png' のように
 * 「src/assets/images/ からのパス」で指定します。
 *
 * 同じ名前の画像が複数の拡張子で存在する場合は
 * png → webp → jpg → jpeg → svg の順に優先して使います。
 *
 * つまり、仮画像（member-01.svg）が入っている場所に
 * 本番画像（member-01.png など）を置くだけで自動的に差し替わります。
 * lpContent.js に書いた拡張子と実際のファイルの拡張子が違っても表示されます。
 */
const modules = import.meta.glob('../assets/images/**/*.{png,webp,jpg,jpeg,svg,gif,avif}', {
  eager: true,
  import: 'default',
})

const EXT_PRIORITY = ['png', 'webp', 'jpg', 'jpeg', 'avif', 'gif', 'svg']
const PREFIX = '../assets/images/'

// 拡張子を除いたパス → { 拡張子: URL } の対応表
const table = {}
for (const [key, url] of Object.entries(modules)) {
  const rel = key.slice(PREFIX.length)
  const dot = rel.lastIndexOf('.')
  const base = rel.slice(0, dot)
  const ext = rel.slice(dot + 1).toLowerCase()
  ;(table[base] ||= {})[ext] = url
}

export function img(path) {
  if (!path) return ''
  const clean = path.replace(/^\/+/, '')
  const dot = clean.lastIndexOf('.')
  const base = dot > -1 ? clean.slice(0, dot) : clean
  const entry = table[base]
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`[image] 画像が見つかりません: src/assets/images/${clean}`)
    return ''
  }
  const ext = EXT_PRIORITY.find((e) => entry[e])
  return entry[ext]
}
