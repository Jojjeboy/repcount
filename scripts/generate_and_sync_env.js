/**
 * Environment Variable Generator & GitHub Secrets Syncer
 *
 * 1. Reads 'firebaseConfig' from scripts/pasted_secret_config.js.
 * 2. Generates/updates your local .env file.
 * 3. Automatically syncs these variables to your GitHub Repository Secrets
 * using the GitHub CLI (gh), if installed and authenticated.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. Try to load the user's pasted config from the helper file
const configPath = path.resolve(__dirname, 'pasted_secret_config.js')
let firebaseConfig = null

try {
  const rawContent = fs.readFileSync(configPath, 'utf8')
  const match = rawContent.match(/{[\s\S]*?}/)
  if (match) {
    firebaseConfig = new Function('return ' + match[0])()
  }
} catch {
  console.error(
    `❌ Kunde inte läsa eller tolka ${configPath}. Se till att filen existerar och innehåller ditt Firebase-objekt.`,
  )
  process.exit(1)
}

if (!firebaseConfig || !firebaseConfig.apiKey) {
  console.error(`❌ Misslyckades att hämta ett giltigt firebaseConfig-objekt från ${configPath}.`)
  process.exit(1)
}

// 2. Auto-detect framework
function getEnvPrefix() {
  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }

      if (deps['vite']) return 'VITE_'
      if (deps['next']) return 'NEXT_PUBLIC_'
      if (deps['react-scripts']) return 'REACT_APP_'
      if (deps['nuxt']) return 'NUXT_PUBLIC_'
      if (deps['gatsby']) return 'GATSBY_'
      if (deps['@vue/cli-service']) return 'VUE_APP_'
      if (deps['svelte']) return 'VITE_'
    }
  } catch {
    // Ignore error
  }
  return ''
}

function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()
}

// 3. Update the local .env file
const prefix = getEnvPrefix()
const envPath = path.resolve(process.cwd(), '.env')

let envContent = ''
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8')
}

const generatedVars = []

for (const [key, value] of Object.entries(firebaseConfig)) {
  const snakeKey = toSnakeCase(key)
  const envKey = `${prefix}FIREBASE_${snakeKey}`

  const regex = new RegExp(`^${envKey}=.*`, 'm')
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${envKey}=${value}`)
  } else {
    const newline = envContent.endsWith('\n') || envContent === '' ? '' : '\n'
    envContent += `${newline}${envKey}=${value}`
  }
  generatedVars.push({ key: envKey, value })
}

fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8')

console.log(`\n✅ Läste konfiguration från scripts/pasted_secret_config.js och uppdaterade .env!\n`)
generatedVars.forEach((v) => console.log(`   - ${v.key}`))
console.log(
  `\n⚠️ Se till att scripts/pasted_secret_config.js ligger i din .gitignore så dina hemligheter förblir dolda.\n`,
)

// 4. Check for GitHub CLI (gh) and sync secrets
function syncToGitHub() {
  console.log('🔄 Kontrollerar anslutning till GitHub CLI (gh)...')

  // Check if gh CLI is installed
  try {
    execSync('gh --version', { stdio: 'ignore' })
  } catch {
    console.log('ℹ️ GitHub CLI (gh) hittades inte på den här datorn. Hoppar över synkronisering.')
    console.log('   Tips: Installera det via https://cli.github.com/ för att automatisera detta i framtiden.\n')
    return
  }

  // Check if authenticated
  try {
    execSync('gh auth status', { stdio: 'ignore' })
  } catch {
    console.log('ℹ️ GitHub CLI är installerat men du är inte inloggad.')
    console.log('   Kör "gh auth login" i din terminal först om du vill synka dina hemligheter.\n')
    return
  }

  // Check if we are inside a Git repository linked to GitHub
  try {
    execSync('gh repo view', { stdio: 'ignore' })
  } catch {
    console.log('ℹ️ Nuvarande mapp verkar inte vara ett länkat GitHub-repository.')
    console.log('   Kör "git init" och koppla ett fjärr-repo (remote) först.\n')
    return
  }

  console.log('🚀 Synkroniserar variabler till ditt GitHub-repository som Secrets...\n')

  for (const { key, value } of generatedVars) {
    try {
      // Set the secret. Using --body avoids issues with special characters in shells.
      execSync(`gh secret set ${key} --body "${value}"`, { stdio: 'inherit' })
      console.log(`   ✅ Synkade hemlighet: ${key}`)
    } catch {
      console.error(`   ❌ Misslyckades att synka hemlighet: ${key}`)
    }
  }

  console.log('\n🎉 Alla tillgängliga variabler har synkroniserats till GitHub Secrets!\n')
}

// Run the GitHub Sync
syncToGitHub()
