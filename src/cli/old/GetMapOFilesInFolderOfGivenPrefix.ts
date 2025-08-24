import { join } from 'path'
import * as fs from 'fs'


import { parse } from 'jsonc-parser'
import { AimFileHeaderMap } from '../../common/aim/AimFileHeaderMap'
import { AimFileHeader } from '../../common/aim/AimFileHeader'
import { GetStartingThingsFromRawJson } from './GetStartingThingsFromRawJson'

export function GetMapOFilesInFolderOfGivenPrefix (folder: string, prefix: string): AimFileHeaderMap {
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
            if (file.startsWith(prefix) && file.endsWith('.jsonc')) {
                if (file.startsWith('aim_todo')) {
                    continue
                }
                const fileWithoutExtension = file.substring(0, file.length - 6)
                const text = fs.readFileSync(file, 'utf-8')
                const json: any = parse(text)

                const visibleThingsMap = GetStartingThingsFromRawJson(json)
                mapToReturn.Set(fileWithoutExtension, new AimFileHeader(fileWithoutExtension, json.root, visibleThingsMap, []))
            }
        }
    }
    return mapToReturn
}