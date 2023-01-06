import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db')

async function readDBFile (filename) {
  return readFile(`${DB_PATH}/${filename}`, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDBFile('teams.json')
export const PRESIDENTS = await readDBFile('presidents.json')

export async function writeDBFile (filename, data) {
  return writeFile(`${DB_PATH}/${filename}`, JSON.stringify(data, null, 2), 'utf-8')
}
