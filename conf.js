'use strict'

const os = require('os')
const path = require('path')

module.exports = {
  output: path.join(os.tmpdir(), 'gourcify')
, inputdir: process.cwd()
, gource: {
    filename: 'gource.mp4'
  , videosize: '1280x720'
  }
}
