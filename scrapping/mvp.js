import { cleanText, TEAMS } from './utils.js'

const MVP_SELECTORS = {
  team: { selector: 2, typeOf: 'string' },
  playerName: { selector: 3, typeOf: 'string' },
  gamesPlayed: { selector: 4, typeOf: 'number' },
  mvps: { selector: 5, typeOf: 'number' }
}

export async function getMvpList ($) {
  const $rows = $('table tbody tr')

  const getImageFromTeam = ({ name }) => {
    const { image } = TEAMS.find(team => team.name === name)
    return image
  }

  const mvpSelectorEntries = Object.entries(MVP_SELECTORS)
  const mvpList = []

  $rows.each((index, el) => {
    const mvpEntries = mvpSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find('td').eq(selector).text()
      const cleanedValue = cleanText(rawValue)
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue
      return [key, value]
    })

    const { team: teamName, ...mvpData } = Object.fromEntries(mvpEntries)
    const image = getImageFromTeam({ name: teamName })

    mvpList.push({
      ...mvpData,
      rank: index + 1,
      team: teamName,
      image
    })
  })

  return mvpList
}
