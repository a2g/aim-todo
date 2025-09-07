import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { TodoTreeWorkspace } from './TodoTreeWorkspace'
import { GetMapOFilesInFolderOfGivenPrefix } from '../../cli/old/GetMapOFilesInFolderOfGivenPrefix'
import { AimFileHeaderMap } from './AimFileHeaderMap'

import { Box } from '../puzzle/Box'
import { VisibleThingsMap } from '../puzzle/VisibleThingsMap'
import { _STARTER_JSONC } from '../_STARTER_JSONC'
import { _TODO_TREE_JSONC } from '../_TODO_TREE_JSONC'

/**
 * Workspaces are like proto-solutions - they are used to explore possible solutions.
 * 
 * We start off with one workspace, then we add more every time
 * we encounter a branching point, like 'oneOf'
 */
export class TodoTreeWorkspaces {
  fileAddress: string
  workspaces: Map<string, TodoTreeWorkspace>
  aimTreeMap: AimFileHeaderMap
  startingThingsMap: VisibleThingsMap

  constructor(fullFolderPath: string) {
    this.fileAddress = fullFolderPath
    this.workspaces = new Map<string, TodoTreeWorkspace>()
    this.startingThingsMap = new VisibleThingsMap(null)

    const pathAndFile = fullFolderPath + _TODO_TREE_JSONC
    if (!existsSync(pathAndFile)) {
      throw new Error(
        `The '${_TODO_TREE_JSONC} was not found: ${pathAndFile} `
      )
    }
    const text = readFileSync(pathAndFile, 'utf-8')
    const parsedJson: any = parse(text)
    const aimTodoTree = parsedJson.root
    this.aimTreeMap = GetMapOFilesInFolderOfGivenPrefix(fullFolderPath, 'aim')


    this.InitializeStartingThings()

    // first workspace is added with blank workspace name
    this.workspaces.set('', new TodoTreeWorkspace(aimTodoTree, this.aimTreeMap))

    let isNewSolutions = false
    do {
      isNewSolutions = false
      for (const solution of this.workspaces.values()) {
        const wasNewSolutionGenerated = this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(solution.GetTodoTree(), solution)
        isNewSolutions = isNewSolutions || wasNewSolutionGenerated
        if (wasNewSolutionGenerated) {
          break
        }
      }
    } while (isNewSolutions)
  }

  GetCount () {
    return this.workspaces.size
  }

  InitializeStartingThings () {
    const box = new Box(_STARTER_JSONC)
    box.CopyStartingThingCharsToGivenMap(this.startingThingsMap)
  }

  GetStartingThings (): VisibleThingsMap {
    return this.startingThingsMap
  }

  public GetSolutions (): IterableIterator<TodoTreeWorkspace> {
    return this.workspaces.values()
  }

  private traverseAndCreateSeparateTreesWhenEncounteringOneOf (thisObject: any, solution: TodoTreeWorkspace): boolean {
    if (typeof thisObject === 'string') {
      return false;
    }
    for (const key in thisObject) {
      if (key !== 'oneOf') {
        const child = thisObject[key]
        if (this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(child, solution)) {
          return true
        }
      } else {
        const oneOfObject = thisObject[key]
        const mapOfRawChildren = new Map<string, any>()
        for (const key2 in oneOfObject) {
          mapOfRawChildren.set(key2, oneOfObject[key2])
        }

        // we've got the children, so delete the parent 'oneOf'
        delete thisObject.oneOf

        // add a new workspace every time we reach a branching point like 'one of'
        for (const pair of mapOfRawChildren) {
          thisObject[pair[0]] = pair[1]
          const newSolution = solution.Clone()
          newSolution.GetNames().push(pair[0])
          this.workspaces.set(newSolution.GetSolvingPath(), newSolution)

          delete thisObject[pair[0]]
        }

        // also delete the entry from the set
        this.workspaces.delete(solution.GetSolvingPath())

        // now return with true, telling the caller that we have new  objects
        return true
      }
    }
    return false
  }
}
