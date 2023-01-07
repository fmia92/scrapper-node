import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'
import { getLeaderboard } from './leaderboard.js'
import { getMvpList } from './mvp.js'
import { log } from './log.js'
import { getTopScoresList } from './top_scorers.js'
// import { getCoaches } from './coaches.js'

const DB_PATH = path.join(process.cwd(), './db')
export const SCRAPPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderboard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList
  },
  top_scorers: {
    url: 'https://kingsleague.pro/estadisticas/goles/',
    scraper: getTopScoresList
  }
  // coaches: {
  //   url: 'https://es.besoccer.com/competicion/info/kings-league/2023',
  //   scraper: getCoaches
  // }
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

export async function scrapeAndSave (page) {
  const start = performance.now()
  try {
    const { scraper, url } = SCRAPPINGS[page]
    log.info(`Scraping [${page}] list...`)
    const $ = await scrape(url)
    const content = await scraper($)
    log.success(`[${page}] list scraped!`)
    log.info(`Writing [${page}] list to file...`)
    writeDBFile(`${page}.json`, content)
    log.success(`[${page}] list written to file!`)
  } catch (error) {
    log.error(`Error scraping [${page}] list!`)
    log.error(error)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    log.info(`[${page}] list scraped in ${time} seconds`)
  }
}

export async function writeDBFile (filename, data) {
  return writeFile(`${DB_PATH}/${filename}`, JSON.stringify(data, null, 2), 'utf-8')
}
