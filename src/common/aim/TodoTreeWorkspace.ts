import { AimFiles } from "./AimFiles"

export class TodoTreeWorkspace {
    private todoTree: any
    private aimFiles: AimFiles
    private names: string[]

    constructor(todoTree: any, aimFiles: AimFiles) {
        this.names = []
        this.todoTree = todoTree
        this.aimFiles = aimFiles.Clone()
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
        const clonedAimFiles = this.aimFiles.Clone()
        const newSolution = new TodoTreeWorkspace(clonedTodoTree, clonedAimFiles)

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

    public GetAimFiles (): AimFiles {
        return this.aimFiles
    }

    public GetNames (): string[] {
        return this.names
    }

    public GetTodoTree (): any {
        return this.todoTree
    }
}