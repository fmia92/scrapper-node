import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'

const DB_PATH = path.join(process.cwd(), './db')
export const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
  mvp: 'https://kingsleague.pro/estadisticas/mvp/'
}

async function readDBFile (filename) {
  return readFile(`${DB_PATH}/${filename}`, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDBFile('teams.json')
export const PRESIDENTS = await readDBFile('presidents.json')

export const cleanText = text => text
  .replace(/\t|\n|\s:/g, '')
  .replace(/.*:/g, '')
  .trim()

export async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export async function writeDBFile (filename, data) {
  return writeFile(`${DB_PATH}/${filename}`, JSON.stringify(data, null, 2), 'utf-8')
}
