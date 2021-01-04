'use strict'

const path = require('path')
const {promises: fs} = require('fs')
const CWD = process.cwd()

module.exports = findRepositories

async function findRepositories(root = CWD) {
  const repos = []
  const dir = await fs.opendir(root)
  for await (const dirent of dir) {
    if (!dirent.isDirectory()) continue
    const git_path = path.join(root, dirent.name, '.git')
    try {
      const stat = await fs.stat(git_path)
      if (!stat.isDirectory()) continue
      repos.push(path.join(root, dirent.name))
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  return repos.sort()
}
