import { TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2'
import express from 'express'
import path from 'path'
import url from 'url'
// eslint-igonre-next-line
import fs from 'fs-extra'
import { TwitterConfig, getTweetBBCode } from './twitter.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.join(__dirname, './config.json')
let httpPort: number | undefined
let ip: string | undefined
let twitterClient: TwitterApiReadOnly
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
      { ip, httpPort, twitter: { appKey: '', appSecret: '' } },
      { encoding: 'utf8' }
    )
    throw 'Please complete the config file.'
  }
  try {
    if (twitter) {
      twitterClient = await new TwitterApi({ appKey: twitter.appKey, appSecret: twitter.appSecret }).readOnly.appLogin()
      console.info('Twitter App connected.')
    }
  } catch (e) {
    console.error('[launchTwitterApp]', e)
    process.exit(1)
  }

const app = express()
  .get('/tweet/:tweetId', async (req, res) => {
    const mode: 'light' | 'dark' =
      req.query.mode === 'light' || req.query.mode === 'dark'
        ? (req.query.mode as 'light' | 'dark')
        : 'light'
    console.log(`Tweet: ${req.params.tweetId}, ${mode}`)
    const bbcode = await getTweetBBCode(twitterClient, req.params.tweetId, mode)
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
