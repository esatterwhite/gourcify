'use strict'

const os = require('os')
const path = require('path')

module.exports = {
  outputdir: path.join(os.tmpdir(), 'gourcify')
, inputdir: process.cwd()
, gource: {
    filename: 'gource.mp4'
  }
}
