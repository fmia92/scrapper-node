import { TEAMS, PRESIDENTS, cleanText } from './utils.js'

const LEADERBOARD_SELECTORS = {
  team: { selector: 2, type: 'string' },
  victories: { selector: 3, type: 'number' },
  defeats: { selector: 4, type: 'number' },
  goalsScored: { selector: 5, type: 'number' },
  goalConceded: { selector: 6, type: 'number' },
  cardsYellow: { selector: 7, type: 'number' },
  cardsRed: { selector: 8, type: 'number' }
}

export async function getLeaderboard ($) {
  const $rows = $('table tbody tr')

  const getTeamFromName = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(team => team.name === name)
    const president = PRESIDENTS.find(presidentFromDB => presidentFromDB.id === presidentId)
    return {
      ...restOfTeam,
      president
    }
  }

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
