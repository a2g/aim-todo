import { AimFileHeaderMap } from "./AimFileHeaderMap"

export class Solution {

    public names: string[]
    public todoTree: any
    public aimTreeMap: any

    constructor(todoTree: any, aimTreeMap: AimFileHeaderMap) {
        this.names = []
        this.todoTree = todoTree
        this.aimTreeMap = aimTreeMap.Clone()
    }

    public GetSolvingPath (): string {
        let name = ''
        for (let i = 0; i < this.names.length; i++) {
            name += (i != 0) ? '/' : ''
            name += this.names[i]
        }
        return name
    }


    Clone (): Solution {
        // this deep clones the 'root' member of the solution'
        const clonedTodoTree = this._CloneObject(this.todoTree)
        const clonedAimTreeMap = this.aimTreeMap.Clone()
        const newSolution = new Solution(clonedTodoTree, clonedAimTreeMap)

        // this clones the names
        newSolution.names.push(...this.names)

        // .. we leave it to the client to add the new segment, to be abled to identity it
        return newSolution
    }

    _CloneObject (thisObject: any): any {
        const toReturn: any = {}
        for (const key in thisObject) {
            const newChild = this._CloneObject(thisObject[key])
            toReturn[key] = newChild
        }
        return toReturn
    }


    public GetAimTreeMap (): AimFileHeaderMap {
        return this.aimTreeMap
    }



}