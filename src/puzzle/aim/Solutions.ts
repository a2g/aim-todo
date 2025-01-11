import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { Solution } from './Solution'

export class Solutions {
  filename: string
  fileAddress: string
  _solutions: Set<Solution>

  constructor (filename: string, fileAddress: string) {
    this.filename = filename
    this.fileAddress = fileAddress
    this._solutions = new Set<any>()

    const pathAndFile = fileAddress + filename
    if (!existsSync(pathAndFile)) {
      throw new Error(
        `The dialogs_xxxx.jsonc was not found: ${pathAndFile} `
      )
    }
    const text = readFileSync(pathAndFile, 'utf-8')
    const parsedJson: any = parse(text)
    const rawJson = parsedJson.root


    this._solutions.add(new Solution(rawJson))

    let isNewSolutions = false
    do {
      isNewSolutions = false
      for (const solution of this._solutions) {
        const wasNewSolutionGenerated = this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(solution.root, solution)
        isNewSolutions = isNewSolutions || wasNewSolutionGenerated
      }
    } while (isNewSolutions)
  }

  private traverseAndCreateSeparateTreesWhenEncounteringOneOf (thisObject: any, solution: Solution): boolean {
    for (const key in thisObject) {
      if (key !== 'oneOf') {
        const child = thisObject[key]
        this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(child, solution)
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
          this._solutions.add(newSolution)

          delete thisObject[pair[0]] 
        }

        // also delete the entry from the set
        this._solutions.delete(solution)

        // now return with true, telling the caller that we have new  objects
        return true
      }
    }
    return false
  }
}
