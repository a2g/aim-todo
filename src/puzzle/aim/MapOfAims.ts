

export class MapOfAims{

    public  map:Map<string, any>

    constructor(){
        this.map = new Map<string, any>()
    }

    Set(file: string, root: any) {
        this.map.set(file, root)
    }

    Clone() : MapOfAims 
    {
        const mapToReturn = new MapOfAims()
        for(const blah of this.map){
            const key = blah[0]
            const value = blah[1]
            mapToReturn.Set(key, this.CloneRecurseively(value))
        }
        return mapToReturn
    }

    private CloneRecurseively(blah: any) : any{
        const objectToReturn: any = {}
        for(const item of blah){
            const key = item[0] as string
            const value = item[1]
            const clone = this.CloneRecurseively(value)
            objectToReturn[key] =  clone
        }
        return objectToReturn
    }
}