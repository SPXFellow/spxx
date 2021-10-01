import Twitter from 'twitter-lite'
import express from 'express'
import path from 'path'
// eslint-igonre-next-line
import fs from 'fs-extra'
import { TwitterConfig, getTweetBBCode } from './twitter.js'

const configPath = path.join(path.dirname('.'), './config.json')
let httpPort: number | undefined
let ip: string | undefined
let twitterClient: Twitter | undefined
let twitter: TwitterConfig | undefined

(function loadFiles() {
	if (fs.existsSync(configPath)) {
		const config = fs.readJsonSync(configPath)
		ip = config.ip
		httpPort = config.httpPort
		twitter = config.twitter
		if (!ip || !httpPort || !twitter) {
			throw ("Expected 'ip', 'httpPort', 'ownerPassword', and 'vipPassword' in './config.json'.")
		}
	} else {
		ip = 'localhost'
		httpPort = 80
		fs.writeJsonSync(configPath, { ip, httpPort, keyFile: null, certFile: null, password: null }, { encoding: 'utf8' })
		throw 'Please complete the config file.'
	}
})();

(async function launchTwitterApp() {
	try {
		if (twitter) {
			twitterClient = new Twitter({
				version: '2',
				extension: false,
				consumer_key: twitter.apiKey,
				consumer_secret: twitter.apiSecretKey,
				bearer_token: twitter.bearerToken,
			})
			console.info('Twitter App connected.')
		}
	} catch (e) {
		console.error('[launchTwitterApp]', e)
		process.exit(1)
	}
})()

const app = express()
/* 	.get('/bugs', (_req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(JSON.stringify(BugCache.getResolvedBugCache()))
	})
	.get('/colors', (_req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(JSON.stringify(ColorCache.colors))
	}) */
	.get('/user-script', (_req, res) => {
		res.redirect(302, 'https://cdn.jsdelivr.net/npm/@spxx/userscript/dist/bundle.user.js')
	})
  .get('/tweet/:tweetId', async (req, res) => {
    const mode: 'light' | 'dark' = req.query.mode === 'light' || req.query.mode === 'dark' ? req.query.mode as 'light' | 'dark' : 'light'
    const bbcode = await getTweetBBCode(twitterClient, req.params.tweetId, mode)
    res.send(bbcode)
  })

app
	.listen(httpPort, () => {
		console.info(`HTTP server is running at ${ip} (locally listening ${httpPort})`)
	})
	.on('error', e => {
		console.error('[HttpServer] ', e.message)
	})
