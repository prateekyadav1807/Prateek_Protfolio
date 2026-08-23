import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILE = join(__dirname, '../../visitors.json')

export const getVisitors = (req, res) => {
  let count = 1
  if (existsSync(FILE)) {
    count = JSON.parse(readFileSync(FILE, 'utf-8')).count + 1
  }
  writeFileSync(FILE, JSON.stringify({ count }))
  res.json({ count })
}
