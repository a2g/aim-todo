import * as fs from 'fs'
import { join } from 'path'
import { AIM_TODO_JSONC } from '../common/AIM_TODO_JSONC'

export interface $AimTodo {
  // used by CLI
  file: string
  folder: string
  // used by web UI
  repo: string
  world: string
  area: string
  repoSlashWorldSlashArea: string
  // used by both
  displayName: string
}

export function getJsonOfAimTodo (): $AimTodo[] {
  console.log(process.cwd())

  process.chdir(join(__dirname, '/../../../..'))

  const allFolders = new Array<[string, string, string]>()
  allFolders.push(['todo', 'practice-world', '01'])
  allFolders.push(['todo', 'practice-world', '02'])
  allFolders.push(['todo', 'practice-world', '03'])

  // lets try adding more folders from 'private-world'
  // but that folder may not exist, so we try/catch it

  const ignoreSet = new Set([
    'settings.json',
    '.gitmodules',
    '.gitignore',
    'package.json',
    'tsconfig.json',
    '.git',
    '.DS_Store',
    'package-lock.json',
    'node_modules'
  ])
  process.chdir('./exclusive-worlds')
  const folders = fs.readdirSync('.')
  for (const folder of folders) {
    if (!ignoreSet.has(folder)) {
      process.chdir(folder)
      const folders2 = fs.readdirSync('.')
      for (const folder2 of folders2) {
        if (!ignoreSet.has(folder2)) {
          allFolders.push(['exclusive-worlds', folder, folder2])
        }
      }
      process.chdir('..')
    }
  }
  process.chdir('..')

  const toReturn = new Array<$AimTodo>()
  for (const folder of allFolders) {
    const repo = folder[0]
    const world = folder[1]
    const area = folder[2]
    process.chdir(`./${repo}/${world}/${area}`)
    const files = fs.readdirSync('.')
    for (const file of files) {
      if (file === AIM_TODO_JSONC) {
        toReturn.push({
          // these are needed for CLI
          file,
          folder: `${repo}/${world}/${area}/`,
          // used by web ui
          repo,
          world,
          area,
          repoSlashWorldSlashArea: `${repo}/${world}/${area}`,
          // used by both
          displayName: `${repo}/${world}/${area}`
        })
      }
    }
    process.chdir('..')
    process.chdir('..')
    process.chdir('..')
  }

  return toReturn
}
