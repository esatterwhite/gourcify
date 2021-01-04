'use strict'
const path = require('path')
const execa = require('execa')
const mkdirp = require('mkdirp')
const {workerData = {}} = require('piscina')
const OUTPUT_DIR = path.join(workerData.output || process.cwd(), 'gitlog')
const ESC = '\\'
module.exports = history

async function history({repo}) {
  await mkdirp(OUTPUT_DIR)
  const {name} = path.parse(repo)
  const logfile = path.join(OUTPUT_DIR, `${name}.txt`)
  await execa('gource', [
    '--output-custom-log'
  , logfile
  , repo
  ])

  await execa.command(`sed -i -r s#(.+)${ESC}|#${ESC}1|/${name}# ${name}.txt`, {
    cwd: OUTPUT_DIR
  })
}

// gource --output-custom-log log1.txt repo1
// sed -i -r "s#(.+)\|#\1|/repo1#" log1.txt
