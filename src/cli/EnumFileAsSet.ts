import { existsSync, rmdirSync, writeFileSync } from "fs"
 

interface $EnumType {
    enum: any
}

export class EnumFileAsSet{
    enumName:string
    fileName: string
    setOfStrings: Set<string>

    constructor(fileName:string, enumName:string ){
        this.enumName = enumName
        this.fileName = fileName
        this.setOfStrings = new Set<string>()
    }
    
    public Add(term:string){
        this.setOfStrings.add( term)
    }

    public Write() {
        const filePath = this.fileName + '.jsonc'
        if (this.setOfStrings.size == 0) {
            if (existsSync(filePath)) {
                rmdirSync(filePath)
            }
            return//do nothing
        }
        const json:any = {}
        json.$schema = 'http://json-schema.org/draft-07/schema'
        json.type = 'object'
        json.definitions = {} 
        json.definitions[this.enumName] = { 
            "enum": Array.from(this.setOfStrings)
        } as $EnumType

        writeFileSync(filePath, JSON.stringify(json))
    }
}