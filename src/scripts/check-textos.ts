import fs from 'fs'
import path from 'path'

const exts = ['.ts', '.tsx']
const textosRegex = /textos\[/i
const stringRegex = /["']([^"']{2,}?)["']/g

function walk(dir: string, filelist: string[] = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file)
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist)
    } else if (exts.includes(path.extname(file))) {
      filelist.push(filepath)
    }
  })
  return filelist
}

function scan() {
  const baseDir = path.resolve('./src')
  const files = walk(baseDir)
  const found: { file: string; line: number; text: string }[] = []


  files.forEach(file => {
    const lines = fs.readFileSync(file, 'utf-8').split('\n')
    lines.forEach((line, idx) => {
      if (textosRegex.test(line)) return
      const matches = [...line.matchAll(stringRegex)]
      matches.forEach(match => {
        const txt = match[1]
        if (/[a-zA-Z]/.test(txt)) {
          found.push({ file, line: idx + 1, text: txt })
        }
      })
    })
  })

  if (found.length > 0) {
    console.log('⚠️ Textos fijos encontrados:\n')
    found.forEach(({ file, line, text }) => {
      console.log(`→ ${file}:${line} → "${text}"`)
    })
    process.exit(1) // ← fuerza falla si se usa en CI
  } else {
    console.log('✅ No se encontraron textos fijos.')
  }
}

scan()
