import fs from 'node:fs'
import path from 'node:path'
import { findForbiddenStyleIssues } from './lib/content-quality.mjs'

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const TARGET_DIRS = ['articles', 'blog', 'news', 'podcasts']
const FAIL_ON_ISSUES = process.argv.includes('--fail-on-issues')

function listMdxFiles() {
  const files = []

  for (const dir of TARGET_DIRS) {
    const dirPath = path.join(CONTENT_ROOT, dir)
    if (!fs.existsSync(dirPath)) continue

    for (const file of fs.readdirSync(dirPath)) {
      if (file.endsWith('.mdx')) files.push(path.join(dirPath, file))
    }
  }

  return files.sort()
}

function stripFrontmatter(raw) {
  const match = raw.match(/^---\s*\n[\s\S]*?\n---\s*\n?/)
  return match ? raw.slice(match[0].length) : raw
}

function auditFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const body = stripFrontmatter(raw).replace(/<!-- FR -->[\s\S]*$/u, '')
  const issues = findForbiddenStyleIssues(body)

  return {
    file: path.relative(process.cwd(), filePath),
    issues,
  }
}

const results = listMdxFiles()
  .map(auditFile)
  .filter(result => result.issues.length > 0)

if (results.length === 0) {
  console.log('Content quality audit passed. No forbidden style issues found.')
  process.exit(0)
}

console.log(`Content quality audit found ${results.length} files with style issues.\n`)
for (const result of results) {
  console.log(result.file)
  for (const issue of result.issues) {
    console.log(`  - ${issue}`)
  }
}

if (FAIL_ON_ISSUES) process.exit(1)
