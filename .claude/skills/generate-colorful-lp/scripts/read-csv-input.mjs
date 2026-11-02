#!/usr/bin/env node
/**
 * read-csv-input.mjs — Google Sheets 書き出し CSV(14項目の入力表)を読み取り・検証する。
 *
 * 使い方:
 *   node read-csv-input.mjs <CSVファイル> [--frontend-content <lpContent.js>] [--out <JSON出力ファイル>]
 *
 * - 依存パッケージなし(Node 標準のみ)。
 * - CSV の文字列はデータとして扱う。eval・動的実行・シェル展開はしない。
 * - frontend の lpContent.js は「現在値」を得るために、テキストとして読み、data: URL 経由で
 *   モジュールとして評価する(複製元の信頼できるファイルだけを対象にする)。CSV の内容は評価しない。
 * - 結果は JSON を標準出力に出す。終了コード: 0=検証成功 / 1=検証エラー / 2=使い方の誤り。
 * - 文章の前後の空白・改行は削除しない。セル内の CRLF だけ LF に正規化する。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const HEADER = ['項目ID', 'セクション', '項目名', '操作', '入力内容', '備考']
export const OPERATIONS = ['維持', '変更']

/** 対応する14項目(順序は SKILL.md の表と同じ) */
export const ITEMS = [
  ['membersSection', 'title', '01 MEMBERS', '見出し'],
  ['membersSection', 'lead', '01 MEMBERS', '説明文'],
  ['jobsSection', 'title', '02 OUR WORK', '見出し'],
  ['jobsSection', 'lead', '02 OUR WORK', '説明文'],
  ['growthSection', 'title', '03 GROWTH STEP', '見出し'],
  ['growthSection', 'lead', '03 GROWTH STEP', '説明文'],
  ['supportSection', 'title', '04 SUPPORT', '見出し'],
  ['supportSection', 'lead', '04 SUPPORT', '説明文'],
  ['careersSection', 'title', '05 CAREER PATH', '見出し'],
  ['careersSection', 'lead', '05 CAREER PATH', '説明文'],
  ['interview', 'title', '06 INTERVIEW', '見出し'],
  ['interview', 'lead', '06 INTERVIEW', '説明文'],
  ['selectionSection', 'title', '07 FLOW', '見出し'],
  ['selectionSection', 'lead', '07 FLOW', '説明文'],
].map(([block, field, section, label]) => ({ id: `${block}.${field}`, block, field, section, label }))

export class CsvError extends Error {
  constructor(message, line) {
    super(message)
    this.line = line
  }
}

/** バイト列 → 文字列(UTF-8 厳密。先頭 BOM は取り除いて有無を返す) */
export function decodeUtf8(buf) {
  const bom = buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf
  let text
  try {
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bom ? buf.subarray(3) : buf)
  } catch {
    throw new CsvError('UTF-8 として読めません(不正なバイト列)')
  }
  return { text, bom }
}

/**
 * RFC 4180 に沿った CSV パーサー(状態機械)。行分割・カンマ分割は使わない。
 * - フィールドは「引用符つき」か「引用符なし」。引用符なしフィールドに " があればエラー。
 * - 引用符つきフィールド内の "" は ",  カンマ・LF・CRLF はそのまま(CRLF は LF に正規化)。
 * - 閉じ引用符の直後は , 改行 EOF のどれかだけ。
 * - 引用符の外の単独 CR、引用符内の単独 CR はエラー。
 * - 末尾の改行は有っても無くてもよい。空行は 1 列の行になる(列数の検証で検出される)。
 */
export function parseCsv(text) {
  const n = text.length
  const rows = []
  let row = []
  let i = 0
  const lineAt = (idx) => {
    let l = 1
    for (let k = 0; k < idx && k < n; k++) if (text[k] === '\n') l++
    return l
  }
  for (;;) {
    if (i >= n && row.length === 0) break
    let f = ''
    if (text[i] === '"') {
      const start = i
      i++
      for (;;) {
        if (i >= n) throw new CsvError('引用符が閉じられていません', lineAt(start))
        const ch = text[i]
        if (ch === '"') {
          if (text[i + 1] === '"') {
            f += '"'
            i += 2
          } else {
            i++
            break
          }
        } else if (ch === '\r') {
          if (text[i + 1] === '\n') {
            f += '\n'
            i += 2
          } else {
            throw new CsvError('引用符内に単独の CR(改行コード CR だけ)があります', lineAt(i))
          }
        } else {
          f += ch
          i++
        }
      }
      if (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
        throw new CsvError(`閉じ引用符の直後に不正な文字があります: ${JSON.stringify(text[i])}`, lineAt(i))
      }
    } else {
      while (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
        if (text[i] === '"') throw new CsvError('引用符なしのフィールドの中に " があります', lineAt(i))
        f += text[i]
        i++
      }
    }
    row.push(f)
    if (i >= n) {
      rows.push(row)
      row = []
      break
    }
    if (text[i] === ',') {
      i++
      continue
    }
    if (text[i] === '\r') {
      if (text[i + 1] === '\n') i += 2
      else throw new CsvError('単独の CR(改行コード CR だけ)があります', lineAt(i))
    } else {
      i++ // \n
    }
    rows.push(row)
    row = []
  }
  return rows
}

/** frontend の lpContent.js を読み込む(現在値) */
export async function loadLpContent(filePath) {
  const src = fs.readFileSync(filePath, 'utf8')
  const mod = await import('data:text/javascript;base64,' + Buffer.from(src, 'utf8').toString('base64'))
  if (!mod.lpContent || typeof mod.lpContent !== 'object') throw new Error('lpContent が見つかりません: ' + filePath)
  return mod.lpContent
}

/** CSV の中身を検証し、反映計画(plan)を作る */
export function buildPlan(rows, lpContent) {
  const errors = []
  const warnings = []
  const err = (code, message, extra = {}) => errors.push({ code, message, ...extra })

  if (rows.length === 0) {
    err('empty', 'CSV が空です')
    return { ok: false, errors, warnings }
  }

  // ヘッダー
  const header = rows[0]
  if (header.length !== HEADER.length || header.some((h, k) => h !== HEADER[k])) {
    err('header', `ヘッダーが指定の6列ではありません。期待: ${HEADER.join(',')} / 実際: ${header.join(',')}`)
  }

  // 件数・列数(行番号は「ファイル上の行」ではなく「CSV の行(ヘッダーを1行目)」)
  const body = rows.slice(1)
  if (body.length !== ITEMS.length) err('row-count', `データ行が ${ITEMS.length} 件ではありません(${body.length} 件)`)
  body.forEach((r, k) => {
    if (r.length !== HEADER.length) err('column-count', `データ ${k + 1} 件目(CSV の ${k + 2} 行目)が ${HEADER.length} 列ではありません(${r.length} 列)`, { row: k + 2 })
  })

  // 項目ID: 重複・欠落・不明
  const byId = new Map()
  for (const r of body) {
    if (r.length !== HEADER.length) continue
    const id = r[0]
    if (byId.has(id)) err('duplicate-id', `項目IDが重複しています: ${JSON.stringify(id)}`, { id })
    else byId.set(id, r)
  }
  const known = new Set(ITEMS.map((x) => x.id))
  for (const it of ITEMS) if (!byId.has(it.id)) err('missing-id', `項目IDがありません: ${it.id}`, { id: it.id })
  for (const id of byId.keys()) if (!known.has(id)) err('unknown-id', `対応していない項目IDです: ${JSON.stringify(id)}`, { id })

  // 各項目: 操作・入力内容
  const items = []
  const changes = []
  for (const it of ITEMS) {
    const r = byId.get(it.id)
    if (!r) continue
    const [, section, label, operation, input] = r
    const current = lpContent?.[it.block]?.[it.field]
    if (typeof current !== 'string') {
      err('no-current', `frontend の lpContent.js に文字列の現在値がありません: ${it.id}`, { id: it.id })
      continue
    }
    if (section !== it.section) warnings.push({ code: 'section-differs', id: it.id, message: `セクション列が想定と異なります(反映には使いません): ${JSON.stringify(section)} / 想定 ${it.section}` })
    if (label !== it.label) warnings.push({ code: 'label-differs', id: it.id, message: `項目名列が想定と異なります(反映には使いません): ${JSON.stringify(label)} / 想定 ${it.label}` })
    if (!OPERATIONS.includes(operation)) {
      err('bad-operation', `操作が「維持」「変更」のどちらでもありません: ${it.id} = ${JSON.stringify(operation)}`, { id: it.id })
      continue
    }
    let value
    let classification
    if (operation === '維持') {
      value = current
      classification = '維持'
      if (input !== current) warnings.push({ code: 'keep-input-ignored', id: it.id, message: '操作が「維持」のため、入力内容は反映しません(現在値を使います)' })
    } else {
      if (input.trim() === '') {
        err('empty-change', `「変更」の入力内容が空、または空白・改行だけです: ${it.id}`, { id: it.id })
        continue
      }
      value = input
      classification = input === current ? '同じ' : '変更'
      if (classification === '変更') changes.push({ id: it.id, block: it.block, field: it.field, from: current, to: input })
    }
    items.push({ id: it.id, operation, classification, current, value })
  }

  if (errors.length) return { ok: false, errors, warnings }
  const counts = { 維持: 0, 変更: 0, 同じ: 0 }
  for (const x of items) counts[x.classification]++
  return {
    ok: true,
    errors: [],
    warnings,
    counts: { total: items.length, 操作が維持: items.filter((x) => x.operation === '維持').length, 操作が変更: items.filter((x) => x.operation === '変更').length, 反映する変更: changes.length, 変更だが現在値と同じ: counts.同じ },
    changes,
    items,
  }
}

function defaultFrontendContent() {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../../../../frontend/src/data/lpContent.js')
}

async function main() {
  const args = process.argv.slice(2)
  let csvPath
  let frontend = defaultFrontendContent()
  let outPath
  for (let k = 0; k < args.length; k++) {
    if (args[k] === '--frontend-content') frontend = path.resolve(args[++k] ?? '')
    else if (args[k] === '--out') outPath = args[++k]
    else if (!csvPath) csvPath = args[k]
    else {
      console.error('使い方: node read-csv-input.mjs <CSVファイル> [--frontend-content <lpContent.js>] [--out <JSON>]')
      process.exit(2)
    }
  }
  if (!csvPath) {
    console.error('使い方: node read-csv-input.mjs <CSVファイル> [--frontend-content <lpContent.js>] [--out <JSON>]')
    process.exit(2)
  }
  let result
  try {
    const buf = fs.readFileSync(csvPath)
    const { text, bom } = decodeUtf8(buf)
    const crlfRows = (text.match(/\r\n/g) || []).length
    const rows = parseCsv(text)
    const lpContent = await loadLpContent(frontend)
    result = buildPlan(rows, lpContent)
    result.file = { path: csvPath, bytes: buf.length, bom, endsWithNewline: /\n$/.test(text), crlfInText: crlfRows > 0, parsedRows: rows.length }
  } catch (e) {
    const parse = e instanceof CsvError
    result = { ok: false, errors: [{ code: parse ? 'csv-format' : 'read-failed', message: e.message, ...(e.line ? { line: e.line } : {}) }], warnings: [] }
  }
  const json = JSON.stringify(result, null, 2)
  if (outPath) fs.writeFileSync(outPath, json + '\n', 'utf8')
  console.log(json)
  process.exit(result.ok ? 0 : 1)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
