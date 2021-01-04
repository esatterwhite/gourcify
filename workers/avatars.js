'use strict'

const crypto = require('crypto')
const path = require('path')
const stream = require('stream')
const {promises: fs, constants, createWriteStream} = require('fs')
const {promisify, debuglog} = require('util')
const {workerData = {}} = require('piscina')
const sharp = require('sharp')
const got = require('got')
const mkdirp = require('mkdirp')

const OUTPUT_DIR = path.join(workerData.outputdir || process.cwd(), 'avatar')
const SIZE = 100
const pipeline = promisify(stream.pipeline)
const log = debuglog('gravatar')

module.exports = avatar

const circular = Buffer.from(
  '<svg><rect x="0" y="0" width="100" height="100" rx="100" ry="100"/></svg>'
)


async function avatar({name, email}) {
  const IMG_PATH = path.join(OUTPUT_DIR, `${name}.png`)
  if (await exists(IMG_PATH)) {
    log('image for %s already exists %s', name, IMG_PATH)
    return
  }
  await mkdirp(OUTPUT_DIR)

  log('fetching avatar url for %s', name)

  const url = `https://www.gravatar.com/avatar/${md5(email)}?size=${SIZE}&d=identicon`
  const imgfilter = sharp()
    .composite([{
      input: circular
    , blend: 'dest-in'
    }])
    .png()

  try {
    await pipeline(
      got.stream(url)
    , imgfilter
    , createWriteStream(IMG_PATH)
    )
    log(IMG_PATH)
  } catch (err) {
    log('unable to fetch avatar url for %s', email)
  }
}

async function exists(file) {
  try {
    await fs.access(file, constants.F_OK)
    return true
  } catch {
    return false
  }
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}
