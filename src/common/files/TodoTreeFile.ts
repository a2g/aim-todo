import { existsSync, readFileSync } from "fs"
import { parse } from "jsonc-parser"
import { _TODO_TREE_JSONC } from "../_TODO_TREE_JSONC"

/**
 * This represents the _todo_tree.jsonc file
 * 
 * Its just a plain json file
 */
export class TodoTreeFile {
  private jsonOfTodoTree: any

  constructor(fullFolderPath: string) {
    if (fullFolderPath.length === 0) {
      return
    }
    const pathAndFile = fullFolderPath + _TODO_TREE_JSONC
    if (!existsSync(pathAndFile)) {
      throw new Error(
        `The '${_TODO_TREE_JSONC} was not found: ${pathAndFile} `
      )
    }
    const text = readFileSync(pathAndFile, 'utf-8')
    const json: any = parse(text)
    this.jsonOfTodoTree = json.root

  }

  public GetJson (): any {
    return this.jsonOfTodoTree
  }

  Clone (): TodoTreeFile {
    const todoTreeFile = new TodoTreeFile('')
    todoTreeFile.jsonOfTodoTree = this._CloneObject(this.jsonOfTodoTree)
    return todoTreeFile
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
}