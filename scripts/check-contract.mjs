#!/usr/bin/env node
/**
 * Contract checker — adapted from the sibling cortai-style-kit's check-contract.mjs,
 * extended for this app's mutating device endpoints (approve/quarantine/block/patch).
 *
 * Guards the "one file to change" promise: as long as this passes, the mock/real
 * adapter swap in src/api/index.ts stays a one-file change, and toast copy always
 * comes from the API response rather than being invented per-call-site.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
let failed = false

function fail(message) {
  console.error(`CONTRACT FAIL: ${message}`)
  failed = true
}

function read(relPath) {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) fail(`missing required file: ${relPath}`)
  return existsSync(full) ? readFileSync(full, 'utf8') : ''
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

// 1. Required shared ui exports
const REQUIRED_UI_EXPORTS = [
  'Badge',
  'StatusPill',
  'Table',
  'Tabs',
  'Drawer',
  'Select',
  'ToastProvider',
  'useToast',
  'LoadingState',
  'EmptyState',
  'ErrorState',
]
{
  const src = read('src/components/ui/index.ts')
  for (const name of REQUIRED_UI_EXPORTS) {
    const re = new RegExp(`\\b${name}\\b`)
    if (!re.test(src)) fail(`src/components/ui/index.ts no longer exports "${name}"`)
  }
}

// 2. Required CSS tokens in :root
const REQUIRED_TOKENS = [
  '--bg',
  '--panel',
  '--panel-2',
  '--line',
  '--line-2',
  '--text',
  '--text-2',
  '--text-3',
  '--wired',
  '--wired-dim',
  '--wireless',
  '--wireless-dim',
  '--iot',
  '--iot-dim',
  '--danger',
  '--danger-bg',
  '--ok',
  '--mono',
  '--sans',
  '--disp',
]
{
  const css = read('src/index.css')
  const rootBlockMatch = css.match(/:root\s*{([^}]*)}/)
  const rootBlock = rootBlockMatch ? rootBlockMatch[1] : ''
  for (const token of REQUIRED_TOKENS) {
    if (!rootBlock.includes(`${token}:`)) fail(`:root in src/index.css is missing token ${token}`)
  }

  const REQUIRED_CLASSES = ['.btn', '.card', '.tagpill', '.kv', '.fld', '.gsug', '.ov', '.toast']
  for (const cls of REQUIRED_CLASSES) {
    if (!css.includes(cls)) fail(`src/index.css no longer defines global class ${cls}`)
  }

  if (!css.includes('@tailwind base') || !css.includes('@tailwind components') || !css.includes('@tailwind utilities')) {
    fail('src/index.css is missing one or more @tailwind directives')
  }
}

// 3. @ alias wired
{
  const tsconfig = read('tsconfig.json')
  if (!tsconfig.includes('"@/*"')) fail('tsconfig.json no longer wires the "@/*" path alias')
  const viteConfig = read('vite.config.ts')
  if (!viteConfig.includes("'@'")) fail('vite.config.ts no longer wires the "@" resolve alias')
}

// 4. src/api/index.ts still exports the swappable deviceApi
{
  const apiIndex = read('src/api/index.ts')
  if (!/export const deviceApi/.test(apiIndex)) {
    fail('src/api/index.ts no longer exports "deviceApi" — the mock/real swap point is broken')
  }
}

// 5 + 6. Walk pages: deviceApi usage must import from '@/api', no hardcoded JSX numeric
//        literals, and no hardcoded outcome strings passed to a toast call.
const MUTATING_METHODS = ['approve', 'quarantine', 'block', 'patch']
const OUTCOME_WORDS = /\b(Approved|Blocked|Quarantined|placed on|banned network-wide)\b/i

function checkPageFile(filePath) {
  const relPath = filePath.slice(ROOT.length + 1)
  const text = readFileSync(filePath, 'utf8')
  const usesDeviceApi = /\bdeviceApi\.(list|approve|quarantine|block|patch)\b/.test(text)
  if (!usesDeviceApi) return // presentational-only file, exempt (mirrors StepForms.tsx precedent)

  if (!/from ['"]@\/api['"]/.test(text)) {
    fail(`${relPath} calls deviceApi.* but doesn't import it from '@/api'`)
  }

  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  function visit(node) {
    // No hardcoded digits in rendered JSX text.
    if (ts.isJsxText(node)) {
      const trimmed = node.text.trim()
      if (trimmed && /\d/.test(trimmed)) {
        fail(`${relPath} has a hardcoded numeric literal in JSX text: "${trimmed}"`)
      }
    }

    // Mutating calls: string-literal arguments must not carry the outcome copy directly.
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sourceFile)
      const isMutatingCall = MUTATING_METHODS.some((m) => callee.endsWith(`.${m}`))
      if (isMutatingCall) {
        for (const arg of node.arguments) {
          if (ts.isStringLiteral(arg) && OUTCOME_WORDS.test(arg.text)) {
            fail(
              `${relPath} passes a hardcoded outcome string to ${callee}(...) — outcome text must come from the API's DeviceActionResult.outcomeMessage, not a literal`,
            )
          }
        }
      }
      // Toast calls: same rule, in case an outcome string is composed and shown outside deviceApi's own return value.
      if (/\.(show)$/.test(callee) || callee === 'showToast' || callee === 'toast') {
        for (const arg of node.arguments) {
          if (ts.isStringLiteral(arg) && OUTCOME_WORDS.test(arg.text)) {
            fail(
              `${relPath} shows a hardcoded outcome toast ("${arg.text}") instead of using result.outcomeMessage`,
            )
          }
        }
      }
    }

    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
}

if (existsSync(join(ROOT, 'src/pages'))) {
  for (const file of walk(join(ROOT, 'src/pages'))) {
    checkPageFile(file)
  }
}

if (failed) {
  console.error('\nContract check failed — see CONTRACT FAIL lines above.')
  process.exit(1)
}

console.log('CONTRACT OK')