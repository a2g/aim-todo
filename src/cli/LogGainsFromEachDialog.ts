import { join } from 'path'
import * as fs from 'fs'
import { DialogFile } from '../puzzle/talk/DialogFile'
import { Aggregates } from '../puzzle/Aggregates'
import { Box } from '../puzzle/Box'
import { _STARTER } from '../_STARTER'

export function LogGainsFromEachDialog (folder: string): void {
  const cwd = process.cwd()
  process.chdir(join(__dirname, '/../../../..'))
  process.chdir(folder)

  console.warn('Results of FindAndAddPiecesRecursively')
  const files = fs.readdirSync('.')
  for (const file of files) {
    if (file.startsWith('cut') && file.endsWith('.jsonc') && file !== 'c_cuts.jsonc') {
      const aggregates = new Aggregates()
      const dialogFile = new DialogFile(file, folder, aggregates)

      const mapOGainsByPage = new Map<string, string>()
      const emptyBox = new Box('')
      console.warn('')
      console.warn(`Talk file: ${file}`)
      console.warn('===========================')
      dialogFile.FindAndAddPiecesRecursively(_STARTER, '', [], mapOGainsByPage, emptyBox)
    }
    process.chdir(cwd)
  }
}
