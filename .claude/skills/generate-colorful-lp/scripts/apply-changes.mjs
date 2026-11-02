#!/usr/bin/env node
/**
 * apply-changes.mjs — read-csv-input.mjs が作った計画(plan.json)の「変更」を、
 * 生成先の lpContent.js の対応する title:/lead: 行だけに反映し、結果を検証する。
 *
 * 使い方:
 *   node apply-changes.mjs --plan <plan.json> --target <生成先>/src/data/lpContent.js [--source <frontend の lpContent.js>]
 *
 * - 依存パッケージなし。値は JS の文字列リテラルとして安全にエスケープして書く(コードとして実行しない)。
 * - 書き込み前にメモリ上で全検証し、成功した場合だけファイルを書き換える。
 * - frontend/ 側のファイル、--source と同じファイルへは書き込まない。
 * - 変更0件のときは何も書かない。
 * 終了コード: 0=成功 / 1=検証エラー(ファイルは書き換えない) / 2=使い方の誤り
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ITEMS } from './read-csv-input.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoFrontend = path.resolve(here, '../../../../frontend')

const evalModule = async (src) => (await import('data:text/javascript;base64,' + Buffer.from(src, 'utf8').toString('base64'))).lpContent

/** JS の単一引用符文字列にするためのエスケープ(\ ' 改行 制御文字 U+2028/2029) */
export function escapeJsString(s) {
  let out = ''
  for (const ch of s) {
    const c = ch.codePointAt(0)
    if (ch === '\\') out += '\\\\'
    else if (ch === "'") out += "\\'"
    else if (ch === '\n') out += '\\n'
    else if (c < 0x20 || c === 0x7f || c === 0x2028 || c === 0x2029) out += '\\u' + c.toString(16).padStart(4, '0')
    else out += ch
  }
  return out
}

const walk = (a, b, p, diffs) => {
  if (a && typeof a === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b ?? {})])) walk(a[k], b?.[k], p ? `${p}.${k}` : k, diffs)
  } else if (a !== b) diffs.push(p)
}

export async function applyChanges({ plan, targetPath, sourcePath }) {
  const errors = []
  const fail = (m) => errors.push(m)
  if (!plan || plan.ok !== true || !Array.isArray(plan.changes)) return { ok: false, errors: ['計画(plan)が検証成功の形式ではありません'] }
  const known = new Set(ITEMS.map((x) => x.id))
  const ids = plan.changes.map((c) => c.id)
  if (new Set(ids).size !== ids.length) fail('計画の変更に項目IDの重複があります')
  for (const c of plan.changes) {
    if (!known.has(c.id)) fail(`対応していない項目IDです: ${c.id}`)
    if (typeof c.to !== 'string' || c.to.trim() === '') fail(`変更後の値が空、または文字列ではありません: ${c.id}`)
    if (typeof c.from !== 'string') fail(`変更前の値が文字列ではありません: ${c.id}`)
  }
  const tAbs = path.resolve(targetPath)
  const sAbs = path.resolve(sourcePath)
  if (tAbs === sAbs) fail('書き込み先が複製元(frontend)の lpContent.js と同じです')
  if (tAbs === repoFrontend || tAbs.startsWith(repoFrontend + path.sep)) fail('書き込み先が frontend/ 配下です')
  if (!fs.existsSync(tAbs)) fail('書き込み先の lpContent.js が存在しません')
  if (errors.length) return { ok: false, errors }

  const srcText = fs.readFileSync(sAbs, 'utf8')
  const origText = fs.readFileSync(tAbs, 'utf8')
  const source = await evalModule(srcText)
  const origTarget = await evalModule(origText)
  // 書き込み先は「未変更の複製」であること(複製直後の状態)
  const pre = []
  walk(source, origTarget, '', pre)
  if (pre.length) return { ok: false, errors: [`書き込み先が複製元と一致していません(差分キー: ${pre.join(', ')})`] }
  for (const c of plan.changes) {
    const cur = source?.[c.block]?.[c.field]
    if (cur !== c.from) fail(`計画の変更前の値が、現在の複製元の値と一致しません: ${c.id}`)
  }
  if (errors.length) return { ok: false, errors }

  const lines = origText.split('\n')
  const replaced = []
  for (const c of plan.changes) {
    const s = lines.findIndex((l) => l === `  ${c.block}: {`)
    if (s < 0) return { ok: false, errors: [`ブロックが見つかりません: ${c.block}`] }
    const e = lines.findIndex((l, i) => i > s && l === '  },')
    if (e < 0) return { ok: false, errors: [`ブロックの終わりが見つかりません: ${c.block}`] }
    const hits = []
    for (let i = s + 1; i < e; i++) if (lines[i].startsWith(`    ${c.field}: '`)) hits.push(i)
    if (hits.length !== 1) return { ok: false, errors: [`対象行がちょうど1つではありません: ${c.id}(${hits.length} 件)`] }
    if (!/',$/.test(lines[hits[0]])) return { ok: false, errors: [`対象行の形式が想定と異なります(末尾が ', ではない): ${c.id}`] }
    lines[hits[0]] = `    ${c.field}: '${escapeJsString(c.to)}',`
    replaced.push({ id: c.id, line: hits[0] + 1 })
  }
  const newText = lines.join('\n')

  // メモリ上で検証
  const after = await evalModule(newText)
  const diffs = []
  walk(source, after, '', diffs)
  const expectedIds = [...ids].sort()
  const gotIds = [...diffs].sort()
  if (JSON.stringify(expectedIds) !== JSON.stringify(gotIds)) return { ok: false, errors: [`値が異なるキーが期待と一致しません。期待: ${expectedIds.join(', ')} / 実際: ${gotIds.join(', ')}`] }
  for (const c of plan.changes) if (after[c.block][c.field] !== c.to) return { ok: false, errors: [`反映後の値が期待と一致しません: ${c.id}`] }
  const a = origText.split('\n')
  const b = newText.split('\n')
  const diffLines = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) diffLines.push(i + 1)
  if (a.length !== b.length || diffLines.length !== replaced.length || diffLines.some((l) => !replaced.some((r) => r.line === l))) {
    return { ok: false, errors: [`差分の行が変更した行だけではありません(差分行: ${diffLines.join(', ')})`] }
  }

  if (plan.changes.length > 0) fs.writeFileSync(tAbs, newText, 'utf8')
  return { ok: true, written: plan.changes.length > 0, changedKeys: ids, replacedLines: replaced, diffLineNumbers: diffLines }
}

async function main() {
  const args = process.argv.slice(2)
  const o = {}
  for (let k = 0; k < args.length; k += 2) o[args[k]] = args[k + 1]
  if (!o['--plan'] || !o['--target']) {
    console.error('使い方: node apply-changes.mjs --plan <plan.json> --target <生成先 lpContent.js> [--source <frontend の lpContent.js>]')
    process.exit(2)
  }
  const source = o['--source'] ?? path.join(repoFrontend, 'src/data/lpContent.js')
  let result
  try {
    result = await applyChanges({ plan: JSON.parse(fs.readFileSync(o['--plan'], 'utf8')), targetPath: o['--target'], sourcePath: source })
  } catch (e) {
    result = { ok: false, errors: [e.message] }
  }
  console.log(JSON.stringify(result, null, 2))
  process.exit(result.ok ? 0 : 1)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
