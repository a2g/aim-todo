export class Solution {
  
    public root: any
    public names: string[]
    constructor(root:any){
        this.root = root
        this.names = []
    }

    public GetName() : string {
        let name = ''
        for (let i = 0; i < this.names.length; i++) {
            name += (i != 0) ? '/' : ''
            name += this.names[i]
        }
        return name
    }


    Clone(): Solution {
        // this deep clones the 'root' member of the solution'
        const newSolution = new Solution(this._CloneObject(this.root))

        // this clones the names
        newSolution.names.push(...this.names)

        // .. we leave it to the client to add the new segment, to be abled to identity it
        return newSolution
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