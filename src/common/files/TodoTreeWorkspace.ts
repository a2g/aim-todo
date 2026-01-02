import { AimFiles } from "./AimFiles"
import { TodoTreeFile } from "./TodoTreeFile"

export class TodoTreeWorkspace {
    private todoTreeFile: TodoTreeFile
    private aimFiles: AimFiles
    private names: string[]

    constructor(todoTreeFile: TodoTreeFile, aimFiles: AimFiles) {
        this.names = []
        this.todoTreeFile = todoTreeFile
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
        const clonedTodoTree = this.todoTreeFile.Clone()
        const clonedAimFiles = this.aimFiles.Clone()
        const newSolution = new TodoTreeWorkspace(clonedTodoTree, clonedAimFiles)

        // this clones the names
        newSolution.names.push(...this.names)

        // .. we leave it to the client to add the new segment, to be able to identity it
        return newSolution
    }


    public GetAimFiles (): AimFiles {
        return this.aimFiles
    }

    public GetNames (): string[] {
        return this.names
    }

    public GetTodoTreeJson (): any {
        return this.todoTreeFile.GetJson()
    }
}