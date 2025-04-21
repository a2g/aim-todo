

import { existsSync, rmSync, writeFileSync } from "fs"


interface $EnumType {
    enum: any
}

export class EnumFileAsArray {
    arrayOfStrings: string[] = []
    fileName: string
    enumName: string
    filePath: string

    constructor(fileName: string, enumName: string) {
        this.enumName = enumName
        this.fileName = fileName
        this.filePath = this.fileName + '.jsonc'
    }

    public Add (term: string) {
        this.arrayOfStrings.push(term)
    }

    public Delete () {
        if (existsSync(this.filePath)) {
            rmSync(this.filePath)
        }
    }

    public Write () {
        this.Delete()

        // if there's nothing to write, we don't create
        if (this.arrayOfStrings.length == 0) {
            return//do nothing
        }

        const json: any = {}
        json.$schema = 'http://json-schema.org/draft-07/schema'
        json.type = 'object'
        json.definitions = {}
        json.definitions[this.enumName] = {
            "enum": this.arrayOfStrings
        } as $EnumType

        writeFileSync(this.filePath, JSON.stringify(json, null, ' '))
    }
}