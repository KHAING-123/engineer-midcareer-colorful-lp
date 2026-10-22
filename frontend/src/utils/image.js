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
 *
 * ■ 軽量版（WebP）
 *  src/assets/images-optimized/ に、元画像と同じ相対パス（拡張子だけ .webp）で軽量版を置くと、
 *  img() は元画像の代わりに軽量版を返します（元画像はそのまま残ります）。
 *  元画像（png）を差し替えたときは、同じ名前の軽量版も作り直すか削除してください
 *  （削除すれば元画像が使われます）。
 */
const modules = import.meta.glob('../assets/images/**/*.{png,webp,jpg,jpeg,svg,gif,avif}', {
  eager: true,
  import: 'default',
})

// 軽量版（元画像と同じ相対パスの .webp）
const optimizedModules = import.meta.glob('../assets/images-optimized/**/*.webp', {
  eager: true,
  import: 'default',
})
const OPT_PREFIX = '../assets/images-optimized/'
const optimized = {}
for (const [key, url] of Object.entries(optimizedModules)) {
  optimized[key.slice(OPT_PREFIX.length).replace(/\.webp$/, '')] = url
}

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
  if (optimized[base]) return optimized[base]
  const entry = table[base]
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`[image] 画像が見つかりません: src/assets/images/${clean}`)
    return ''
  }
  const ext = EXT_PRIORITY.find((e) => entry[e])
  return entry[ext]
}
