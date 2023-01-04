import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      path: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      path: '/presidents',
      description: 'Returns the presidents'
    },
    {
      path: '/teams',
      description: 'Returns the teams'
    }
  ])
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.use('/static/*', serveStatic({ root: './' }))

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const president = presidents.find(president => president.id === id)
  return president
    ? ctx.json(president)
    : ctx.json({ message: 'President not found' }, 404)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
  const id = ctx.req.param('id')
  const team = teams.find(team => team.id === id)
  return team
    ? ctx.json(team)
    : ctx.json({ message: 'Team not found' }, 404)
})

export default app
