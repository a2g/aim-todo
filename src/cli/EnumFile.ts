import { writeFileSync } from "fs"
 

interface $EnumType {
    enum: any
}

export class EnumFile{
    arrayOfStrings: string[] = []
    fileName: string
    enumName:string

    constructor(fileName:string, enumName:string ){
        this.enumName = enumName
        this.fileName = fileName
    }
    
    public Add(term:string){
        this.arrayOfStrings.push( term)
    }

    public Write() {
        const json:any = {}
        json.$schema = 'http://json-schema.org/draft-07/schema'
        json.type = 'object'
        json.definitions = {} 
        json.definitions[this.enumName] = { 
            "enum": this.arrayOfStrings
        } as $EnumType

        const filePath =  this.fileName + '.jsonc'
        writeFileSync(filePath, JSON.stringify(json))
    }
}