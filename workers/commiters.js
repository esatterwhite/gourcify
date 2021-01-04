'use strict'

const execa = require('execa')

module.exports = committers
async function committers({repo}) {
  const {stdout} = await execa('git', ['log', '--pretty=format:%ae|%an'], {
    cwd: repo
  })

  return stdout.split('\n').map((line) => {
    const [email, name] = line.split('|')
    return {email, name}
  })
}
