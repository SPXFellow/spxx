import express from 'express'
import path from 'path'
import fs from 'fs-extra'
import { TwitterConfig, getTweetBBCode } from './twitter.js'

const configPath = path.join(__dirname, './config.json')
let httpPort: number | undefined
let ip: string | undefined
let twitter: TwitterConfig | undefined

if (fs.existsSync(configPath)) {
  const config = fs.readJsonSync(configPath)
  ip = config.ip
  httpPort = config.httpPort
  twitter = config.twitter
  if (!ip || !httpPort || !twitter) {
    throw "Expected 'ip', 'httpPort', 'twitter' in './config.json'."
  }
} else {
  ip = 'localhost'
  httpPort = 80
  fs.writeJsonSync(
    configPath,
    { ip, httpPort, twitter: { bearer_token: '' } },
    { encoding: 'utf8' }
  )
  throw 'Please complete the config file.'
}

const app = express().get('/tweet/:tweetId', async (req, res) => {
  const mode: 'light' | 'dark' =
    req.query.mode === 'light' || req.query.mode === 'dark'
      ? (req.query.mode as 'light' | 'dark')
      : 'light'
  console.log(`Tweet: ${req.params.tweetId}, ${mode}`)
  const bbcode = await getTweetBBCode(twitter!, req.params.tweetId, mode)
  res.send(bbcode)
})

app
  .listen(httpPort, () => {
    console.info(
      `HTTP server is running at ${ip} (locally listening ${httpPort})`
    )
  })
  .on('error', (e) => {
    console.error('[HttpServer] ', e.message)
  })
