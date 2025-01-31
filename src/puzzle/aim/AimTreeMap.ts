

export class AimTreeMap{

    public  map:Map<string, any>

    constructor(){
        this.map = new Map<string, any>()
    }

    Set(file: string, root: any) {
        this.map.set(file, root)
    }

    Clone() : AimTreeMap 
    {
        const mapToReturn = new AimTreeMap()
        for(const blah of this.map){
            const key = blah[0]
            const value = blah[1]
            mapToReturn.Set(key, this._CloneObject(value))
        }
        return mapToReturn
    }

    _CloneObject(thisObject: any): any {
        const toReturn: any = {}
        for (const key in thisObject) {
            const newChild = this._CloneObject(thisObject[key])
            toReturn[key] = newChild
        }
        return toReturn
    }
}