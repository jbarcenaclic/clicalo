import fs from 'fs'
import path from 'path'

const currencies = ['MXN', 'USD', 'COP', 'CLP', 'BRL', 'ARS', 'PEN', 'PHP', 'EUR', 'R$', '₱', 'S/']
const pattern = new RegExp(`\\b(${currencies.map(c => c.replace(/[$]/g, '\\$')).join('|')})\\b`, 'g')
const whitelistFiles = ['textos.ts', 'check-monedas.ts']


function walk(dir: string, files: string[] = []): string[] {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file)
    if (fs.statSync(full).isDirectory()) {
      walk(full, files)
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      files.push(full)
    }
  })
  return files
}

function checkCurrencyUsage() {
  const root = './src'
  const files = walk(root)
  const issues: { file: string; line: number; text: string }[] = []

  files.forEach(file => {
    const fileName = path.basename(file)
    if (whitelistFiles.includes(fileName)) return // ❌ salta este archivo
    const lines = fs.readFileSync(file, 'utf-8').split('\n')
    lines.forEach((line, i) => {
      if (line.includes('formatCurrency')) return
      if (file.includes('/i18n/texts.ts') && line.includes('case ') || line.includes('currencyMap')) return
      if (pattern.test(line)) {
        issues.push({ file, line: i + 1, text: line.trim() })
      }
    })
  })

  if (issues.length) {
    console.log('❌ Monedas fijas detectadas:\n')
    issues.forEach(({ file, line, text }) => {
      console.log(`→ ${file}:${line} → ${text}`)
    })
    process.exit(1)
  } else {
    console.log('✅ No se encontraron monedas fijas.')
  }
}

checkCurrencyUsage()
