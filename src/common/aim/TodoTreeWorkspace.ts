import { AimFileHeaderMap } from "./AimFileHeaderMap"

export class TodoTreeWorkspace {


    private names: string[]
    private todoTree: any
    private aimTreeMap: AimFileHeaderMap

    constructor(todoTree: any, aimTreeMap: AimFileHeaderMap) {
        this.names = []
        this.todoTree = todoTree
        this.aimTreeMap = aimTreeMap.Clone()
    }

    public GetSolvingPath (): string {
        if (this.names.length === 0) {
            return 'the_only_solution'
        }
        let name = ''
        for (let i = 0; i < this.names.length; i++) {
            name += (i != 0) ? '/' : ''
            name += this.names[i]
        }
        return name
    }

    Clone (): TodoTreeWorkspace {
        // this deep clones the 'root' member of the solution'
        const clonedTodoTree = this._CloneObject(this.todoTree)
        const clonedAimTreeMap = this.aimTreeMap.Clone()
        const newSolution = new TodoTreeWorkspace(clonedTodoTree, clonedAimTreeMap)

        // this clones the names
        newSolution.names.push(...this.names)

        // .. we leave it to the client to add the new segment, to be abled to identity it
        return newSolution
    }

    _CloneObject (thisObject: any): any {
        if (typeof thisObject === 'string') {
            return new String(thisObject)
        }
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

    public GetNames (): string[] {
        return this.names
    }

    public GetTodoTree (): any {
        return this.todoTree
    }
}