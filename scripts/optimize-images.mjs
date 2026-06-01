import path from 'node:path'
import { optimizeImageDirectory } from './lib/image-optimizer.mjs'

const targets = process.argv.slice(2)
const dirs = targets.length > 0
  ? targets
  : [path.join('public', 'images')]

let totalBefore = 0
let totalAfter = 0
let changed = 0

for (const dir of dirs) {
  const results = await optimizeImageDirectory(path.resolve(process.cwd(), dir))
  for (const result of results) {
    totalBefore += result.before
    totalAfter += result.after
    if (result.changed) {
      changed += 1
      console.log(`${result.before}\t${result.after}\t-${result.before - result.after}\t${path.relative(process.cwd(), result.filePath)}`)
    }
  }
}

console.log(`optimized=${changed} before=${totalBefore} after=${totalAfter} saved=${totalBefore - totalAfter}`)
