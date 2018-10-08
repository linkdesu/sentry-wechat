const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const dotenv = require('dotenv')

const Wechat = require('./lib/wechat')

dotenv.config()
const {
  HOST = '0.0.0.0',
  PORT = 3000,
  NODE_ENV = 'production',

  WECHAT_CORP_ID,
  WECHAT_CORP_SECRET,
  WECHAT_AGENT_ID,
  WECHAT_TO_PARTY,
  WECHAT_TO_USER,
  WECHAT_TO_TAG
} = process.env

const app = new Koa()
const wechat = new Wechat(WECHAT_CORP_ID, WECHAT_CORP_SECRET, WECHAT_AGENT_ID)

app.use(bodyparser({
  onerror (err, ctx) {
    ctx.throw('Body parse failed', 422)
  }
}))

app.use(async ({ request, response }) => {
  let { method, query, body } = request

  let title = `[${body.level} ${body.id}] ${body.project}`
  let description = body.message
  let msgUrl = body.url

  wechat.sendMsg(title, description, {
    msgUrl,
    toParty: 2
  })

  response.body='ok'
  return response
})

app.listen({
  host: HOST,
  port: PORT
})
console.log(`Server listening on ${HOST}:${PORT}, env: ${NODE_ENV}`)
