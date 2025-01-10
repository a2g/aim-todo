import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'

export class Solutions {
  filename: string
  fileAddress: string
  _solutions: Set<any>

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

    this._solutions.add(rawJson)

    let isNewSolutions = false
    do {
      isNewSolutions = false
      for (const item of this._solutions) {
        const wasNewSolutionGenerated = this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(item, item, this._solutions)
        isNewSolutions = isNewSolutions || wasNewSolutionGenerated
      }
    } while (isNewSolutions)
  }

  private traverseAndCreateSeparateTreesWhenEncounteringOneOf (thisObject: any, rootObject: any, existingRoots: Set<any>): boolean {
    for (const key in thisObject) {
      if (key !== 'oneOf') {
        const child = thisObject[key]
        this.traverseAndCreateSeparateTreesWhenEncounteringOneOf(child, rootObject, existingRoots)
      } else {
        const oneOfObject = thisObject[key]
        const mapOfRawChildren = new Map<string, any>()
        for (const key2 in oneOfObject) {
          mapOfRawChildren.set(key2, oneOfObject[key2])
        }

        // we've got the children, so delete the parent 'oneOf'
        delete thisObject.oneOf

        // also delete the entry from the map
        existingRoots.delete(rootObject)

        for (const pair of mapOfRawChildren) {
          thisObject[pair[0]] = pair[1]
          const clone = this.CloneObject(rootObject)
          existingRoots.add(clone)

          delete thisObject[pair[0]] 
        }
        // now return with true, telling the caller that we have new  objects
        return true
      }
    }
    return false
  }

  CloneObject (thisObject: any): any {
    const toReturn: any = {}
    for (const key in thisObject) {
      const newChild = this.CloneObject(thisObject[key])
      toReturn[key] = newChild
    }
    return toReturn
  }
}
