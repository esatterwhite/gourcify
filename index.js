'use strict'

const fs = require('fs')
const path = require('path')
const Piscina = require('piscina')
const config = require('keef')
const execa = require('execa')
const repos = require('./lib/repos/index.js')

const avatars = new Piscina({
  filename: path.resolve(__dirname, 'workers', 'avatars.js')
, workerData: {
    output: config.get('output')
  }
})

const history = new Piscina({
  filename: path.resolve(__dirname, 'workers', 'history.js')
, workerData: {
    output: config.get('output')
  }
})

const commiters = new Piscina({
  filename: path.resolve(__dirname, 'workers', 'commiters.js')
, workerData: {
    output: config.get('output')
  }
})

/* instanbul ignore next */
async function onSignal(signal) {
  console.warn('shutdown signal recieved')
  await close()
}

async function main() {
  const repositories = await repos.find(config.get('inputdir'))
  await Promise.all(
    repositories.map((repo) => {
      return Promise.all([
        history.runTask({repo})
      , commiters.runTask({repo}).then((users) => {
          return Promise.all(
            users.map((user) => {
              return avatars.runTask(user)
            })
          )
        })
      ])
    })
  )

  await combineHistory(repositories)
  return {repos: repositories}
}

async function close() {
  await avatars.destroy()
  await commiters.destroy()
}

async function combineHistory(repos) {
  const names = repos.map((repo) => {
    const {name} = path.parse(repo)
    return `${name}.txt`
  })
  const cwd = path.join(config.get('output'), 'gitlog')
  const writer = fs.createWriteStream(path.join(cwd, 'gource.txt'))
  const sort = execa('sort')
  const cat = execa('cat', names, {
    cwd: path.join(config.get('output'), 'gitlog')
  })
  cat.stdout.pipe(sort.stdin)
  sort.stdout.pipe(writer)
  await sort
}

// Properly teardown on INT and TERM signals.
process.on('SIGTERM', onSignal)
process.on('SIGINT', onSignal)

/* istanbul ignore next */
function handleCatch(err) {
  console.error(err)
  process.nextTick(() => {
    throw err
  })
}

module.exports = main

if (require.main === module) {
  main()
    .then((res) => {
      console.log('successfully gourcified %d repositories', res.repos.length)
      return close()
    })
    .catch(handleCatch)
}
