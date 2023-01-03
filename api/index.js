import { Hono } from 'hono'
import leaderboard from '../db/leaderboard.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      name: 'Kings League API',
      version: '1.0.0',
      description: 'API for Kings League',
      author: 'fran sola',
      license: 'MIT'
    }
  ])
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

export default app
