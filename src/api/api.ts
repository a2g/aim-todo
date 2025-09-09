import dotenv from 'dotenv'
// import { createClient, RedisClient } from 'redis';
import responseTime from 'response-time'
import cors from 'cors'
import path from 'path'

import express from 'express'
import { getJsonOfAllSolutionsApi, getJsonOfGameLevels, getSvgApi } from './JsonReturners'

const app = express()
const PORT = (process.env.PORT != null) ? `${process.env.PORT}` : 5011
/*
const redisClient: RedisClient = createClient({
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
}); */

dotenv.config()

app.use('/', express.static(path.join(__dirname, '../lib/src')))
app.use(responseTime())
app.use(
  cors({
    exposedHeaders: ['X-Response-Time']
  })
)
/*
function getSolutionsFromRedis(
  req: Request,
  responseSender: Response,
  next: NextFunction
) {
  next();

  const { username } = req.params;

  redisClient.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      responseSender.jsonc(username);
    } else {
      next();
    }
  });
}
  
*/
// app.get('/solutions/:firstFile', getSolutionsFromRedis, getSolutionsDirect);
app.get('/puz/:repo/:world/:area/sols', getJsonOfAllSolutionsApi)
app.get('/puz/:repo/:world/:area/svg', getSvgApi)
app.get('/puz/starters', getJsonOfGameLevels)

// serve ht main html from here
app.get('/', function (req, res) {
  res.send(`Hello World! ${req.path}`)
})

app.listen(PORT, () => {
  const a = `Congratulations, the backend server has started. It's listening on ${PORT}`
  const b = 'Some example calls:'
  const c = `http://localhost:${PORT}/puz/todo/practice-world/03/sols`
  const d = `http://localhost:${PORT}/puz/exclusive-worlds/panic/01/sols`
  const e = `http://localhost:${PORT}/puz/exclusive-worlds/mission/10_final/sols`
  const f = `http://localhost:${PORT}/starters`
  console.log(a)
  console.log(b)
  console.log(c)
  console.log(d)
  console.log(e)
  console.log(f)
})

module.exports = app
