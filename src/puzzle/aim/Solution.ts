import { MapOfAims } from "./MapOfAims"

export class Solution {
  
    public names: string[]
    public todoTree: any
    public mapOfAims: any
    constructor(todoTree:any, mapOfAims :MapOfAims){
        this.names = []
        this.todoTree = todoTree
       this.mapOfAims = mapOfAims.Clone()
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
        const clonedTodoTree = this._CloneObject(this.todoTree)
        const clonedMapOfAims = this.mapOfAims.Clone()
        const newSolution = new Solution(clonedTodoTree, clonedMapOfAims)

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