import * as cheerio from 'cheerio'

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
    team: 2,
    victories: 3,
    defeats: 4,
    goalsScored: 5,
    goalConceded: 6,
    cardsYellow: 7,
    cardsRed: 8
  }

  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, '')
    .trim()

  const leaderboardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  $rows.each((i, el) => {
    const leaderboardEntries = leaderboardSelectorEntries.map(([key, selector]) => {
      const rawValue = $(el).find('td').eq(selector).text()
      const value = cleanText(rawValue)
      return [key, value]
    })

    console.log(Object.fromEntries(leaderboardEntries))
  })
}

await getLeaderboard()

// const leaderboard = [{
//     team: '',
//     victories: 0,
//     defeats: 0,
//     goalsScored: 0,
//     goalConceded: 0,
//     cardsYellow: 0,
//     cardsRed: 0,
// }]
