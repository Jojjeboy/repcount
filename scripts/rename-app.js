/**
 * App Rename Script
 *
 * Renames the app from its current "TailAdmin" identity to a new name.
 *
 * Usage:
 *   node scripts/rename-app.js "New App Name"
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// --- Name derivations --------------------------------------------------------

function toSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toTitleCase(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// --- File helpers -------------------------------------------------------------

function readFile(relPath) {
  const abs = path.join(ROOT, relPath)
  if (!fs.existsSync(abs)) {
    console.warn(`  File not found, skipping: ${relPath}`)
    return null
  }
  return fs.readFileSync(abs, 'utf-8')
}

function writeFile(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content, 'utf-8')
}

/** Global case-insensitive replacement */
function globalReplace(content, from, to) {
  const regex = new RegExp(from, 'gi')
  return content.replace(regex, to)
}

// --- Individual file updaters -------------------------------------------------

function updatePackageJson(slug) {
  const rel = 'package.json'
  const content = readFile(rel)
  if (!content) return

  const parsed = JSON.parse(content)
  const oldName = parsed.name
  parsed.name = slug
  writeFile(rel, JSON.stringify(parsed, null, 2) + '\n')
  console.log(`  package.json       "name": "${oldName}" -> "${slug}"`)
}

function updateIndexHtml(newName) {
  const rel = 'index.html'
  let content = readFile(rel)
  if (!content) return

  content = globalReplace(content, 'TailAdmin', newName)
  writeFile(rel, content)
  console.log(`  index.html         Updated title tag`)
}

function updateRouterIndex(newName) {
  const rel = 'src/router/index.ts'
  let content = readFile(rel)
  if (!content) return

  content = globalReplace(content, 'TailAdmin', newName)
  writeFile(rel, content)
  console.log(`  src/router/index.ts Updated document.title`)
}

function updateFourZeroFour(newName) {
  const rel = 'src/views/Errors/FourZeroFour.vue'
  let content = readFile(rel)
  if (!content) return

  content = globalReplace(content, 'TailAdmin', newName)
  writeFile(rel, content)
  console.log(`  FourZeroFour.vue    Updated copyright footer`)
}

function updateViteConfig(newName) {
  const rel = 'vite.config.ts'
  let content = readFile(rel)
  if (!content) return

  // Replace "PushIt" and the specific description found in the file
  content = globalReplace(content, 'PushIt', newName)
  content = globalReplace(content, 'Advanced Tally Counter PWA', `${newName} Admin Dashboard`)

  writeFile(rel, content)
  console.log(`  vite.config.ts     Updated PWA manifest`)
}

function updateReadme(newName) {
  const rel = 'README.md'
  let content = readFile(rel)
  if (!content) return

  content = globalReplace(content, 'TailAdmin', newName)
  writeFile(rel, content)
  console.log(`  README.md          Global replacement of app name`)
}

// --- Main --------------------------------------------------------------------

function main() {
  const rawName = process.argv[2]

  if (!rawName) {
    console.error('Usage: node scripts/rename-app.js "New App Name"')
    console.error('Example: node scripts/rename-app.js "Boiler Admin"')
    process.exit(1)
  }

  const slug = toSlug(rawName)
  const titleCase = toTitleCase(slug)

  console.log('\nRename plan:')
  console.log(`  Input name  : ${rawName}`)
  console.log(`  Slug        : ${slug}`)
  console.log(`  Title case  : ${titleCase}`)
  console.log('\nApplying changes...')

  updatePackageJson(slug)
  updateIndexHtml(titleCase)
  updateRouterIndex(titleCase)
  updateFourZeroFour(titleCase)
  updateViteConfig(titleCase)
  updateReadme(titleCase)

  console.log('\nDone! Run `npm install` to update package-lock.json if necessary.')
}

main()
