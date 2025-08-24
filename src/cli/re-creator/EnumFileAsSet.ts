import { existsSync, rmSync, writeFileSync } from "fs"


interface $EnumType {
    enum: any
}

export class EnumFileAsSet {
    enumName: string
    fileName: string
    filePath: string
    setOfStrings: Set<string>

    constructor(fileName: string, enumName: string) {
        this.enumName = enumName
        this.fileName = fileName
        this.filePath = this.fileName + '.jsonc'
        this.setOfStrings = new Set<string>()
    }

    public Add (term: string) {
        this.setOfStrings.add(term)
    }



    public Delete () {
        if (existsSync(this.filePath)) {
            rmSync(this.filePath)
        }
    }

    public InitFromFiles (mapOfFiles: IterableIterator<string>) {
        this.setOfStrings.clear()
        for (const value of mapOfFiles) {
            this.setOfStrings.add(value)
        }
    }

    public Write () {
        this.Delete()

        //// if there's nothing to write, we don't create
        // Nah, all these set ones still need to be created if there are none
        // because otherwise the schema will complain that it can't find enum.
        //if (this.setOfStrings.size == 0) {
        //    return
        //}

        const json: any = {}
        json.$schema = 'http://json-schema.org/draft-07/schema'
        json.type = 'object'
        json.definitions = {}
        json.definitions[this.enumName] = {
            "enum": Array.from(this.setOfStrings)
        } as $EnumType

        writeFileSync(this.filePath, JSON.stringify(json, null, ' '))
    }
}