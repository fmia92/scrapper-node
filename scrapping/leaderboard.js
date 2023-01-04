import * as cheerio from 'cheerio'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const TEAMS = await readFile(path.join(process.cwd(), '/db/teams.json'), 'utf-8')
  .then(JSON.parse)

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export async function getLeaderboard () {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: 2, type: 'string' },
    victories: { selector: 3, type: 'number' },
    defeats: { selector: 4, type: 'number' },
    goalsScored: { selector: 5, type: 'number' },
    goalConceded: { selector: 6, type: 'number' },
    cardsYellow: { selector: 7, type: 'number' },
    cardsRed: { selector: 8, type: 'number' }
  }

  const getTeamFromName = ({ name }) => TEAMS.find(team => team.name === name)

  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, '')
    .trim()

  const leaderboardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  const leaderboard = []

  $rows.each((i, el) => {
    const leaderboardEntries = leaderboardSelectorEntries.map(([key, { selector, type }]) => {
      const rawValue = $(el).find('td').eq(selector).text()
      const CleanedValue = cleanText(rawValue)
      const value = type === 'number' ? Number(CleanedValue) : CleanedValue
      return [key, value]
    })

    const { team: teamName, ...leaderboardForTeam } = Object.fromEntries(leaderboardEntries)
    const team = getTeamFromName({ name: teamName })

    leaderboard.push({
      ...leaderboardForTeam,
      team
    })
  })

  return leaderboard
}

const leaderboard = await getLeaderboard()
const filePath = path.join(process.cwd(), '/db/leaderboard.json')
await writeFile(filePath, JSON.stringify(leaderboard, null, 2), 'utf-8')
