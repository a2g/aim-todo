import { join } from 'path'
import * as fs from 'fs'

import { _STARTER } from '../_STARTER'
import { parse } from 'jsonc-parser'
import { AimFileHeaderMap } from '../puzzle/aim/AimFileHeaderMap'
import { AimFileHeader } from '../puzzle/aim/AimFileHeader'

export function GetMapOfAimFilesInFolder (folder: string): AimFileHeaderMap {
    const mapToReturn = new AimFileHeaderMap()
    const cwd = process.cwd()
    console.log(cwd)
    process.chdir(join(__dirname, '/../../../..'))
    process.chdir(folder)

    console.warn('Results of FindAndAddPiecesRecursively')
    const files = fs.readdirSync('.')
    if (files.length > 0) {

        for (const file of files) {
            //  const pathAndFile = folder + file
            if (file.startsWith('aim') && file.endsWith('.jsonc')) {
                const text = fs.readFileSync(file, 'utf-8')
                const parsedJson: any = parse(text)
                const root = parsedJson.root
                mapToReturn.Set(file, new AimFileHeader(root, []))
            }
        }
    }
    return mapToReturn
}