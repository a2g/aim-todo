import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { Solution } from './Solution'
import { GetMapOFilesInFolderOfGivenPrefix } from '../../cli/old/GetMapOFilesInFolderOfGivenPrefix'
import { AimFileHeaderMap } from './AimFileHeaderMap'

import { Box } from '../puzzle/Box'
import { VisibleThingsMap } from '../puzzle/VisibleThingsMap'
import { _STARTER_JSONC } from '../_STARTER_JSONC'

export class Solutions {
  filename: string
  fileAddress: string
  _solutions: Map<string, Solution>
  aimTreeMap: AimFileHeaderMap
  startingThingsMap: VisibleThingsMap

  constructor(animTodoFilename: string, fileAddress: string) {
    this.filename = animTodoFilename
    this.fileAddress = fileAddress
    this._solutions = new Map<string, Solution>()
    this.startingThingsMap = new VisibleThingsMap(null)

    const pathAndFile = fileAddress + animTodoFilename
    if (!existsSync(pathAndFile)) {
      throw new Error(
        `The d##_xxxx.jsonc was not found: ${pathAndFile} `
      )
    }
    const text = readFileSync(pathAndFile, 'utf-8')
    const parsedJson: any = parse(text)
    const aimTodoTree = parsedJson.root
    this.aimTreeMap = GetMapOFilesInFolderOfGivenPrefix(fileAddress, 'aim')


    this.InitializeStartingThings()

    // first map entry is added with blank ''
    this._solutions.set('', new Solution(aimTodoTree, this.aimTreeMap))

    let isNewSolutions = false
    do {
      isNewSolutions = false
      for (const solution of this._solutions.values()) {
        const wasNewSolutionGenerated = this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(solution.todoTree, solution)
        isNewSolutions = isNewSolutions || wasNewSolutionGenerated
        if (wasNewSolutionGenerated) {
          break
        }
      }
    } while (isNewSolutions)
  }

  InitializeStartingThings () {
    const box = new Box(_STARTER_JSONC)
    box.CopyStartingThingCharsToGivenMap(this.startingThingsMap)
  }

  GetStartingThings (): VisibleThingsMap {
    return this.startingThingsMap
  }

  public GetSolutions (): IterableIterator<Solution> {
    return this._solutions.values()
  }

  private traverseAndCreateSeparateTreesWhenEncounteringOneOf (thisObject: any, solution: Solution): boolean {
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

        for (const pair of mapOfRawChildren) {
          thisObject[pair[0]] = pair[1]
          const newSolution = solution.Clone()
          // here we add the new name
          newSolution.names.push(pair[0])
          this._solutions.set(newSolution.GetSolvingPath(), newSolution)

          delete thisObject[pair[0]]
        }

        // also delete the entry from the set
        this._solutions.delete(solution.GetSolvingPath())

        // now return with true, telling the caller that we have new  objects
        return true
      }
    }
    return false
  }
}
