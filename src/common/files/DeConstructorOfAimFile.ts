

import { AimFiles } from './AimFiles'
import { AimFile } from './AimFile'

import { FirstLettersOf } from '../../../FirstLettersOf'
import { IdPrefixes } from '../../../IdPrefixes'
import { VisibleThingsMap } from '../stuff/VisibleThingsMap'
import { Step } from '../stuff/Step'
import { StepType } from '../stuff/StepType'
import { Validated } from '../stuff/Validated'
import { Box } from '../stuff/Box'
import { DialogFile } from '../files/DialogFile'

export class DeConstructorOfAimFile {
  private readonly theAimFile: AimFile

  // the state that needs update
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly allAimFiles: AimFiles// not used, but useful

  public constructor(theAimFile: AimFile, visibleThings: VisibleThingsMap, aimFiles: AimFiles) {
    this.theAimFile = theAimFile
    this.allAimFiles = aimFiles
    this.currentlyVisibleThings = visibleThings
    this.allAimFiles.Size()
  }

  /**
 * #### For the purposes of traversing, a leaf is one with all
 * inputs are null.
 * @param treeNode
 * @returns true if a leaf
 */
  public isALeaf (treeNode: any): boolean {
    const length = Object.keys(treeNode).length
    return length > 0 ? false : true
  }

  // In the constructor above, we see that the root of copied tree is created
  // and the first actual jigsaw piece that is attached to it is
  // gets pushed into the zero slot of the inputs
  public GetNumberOfPiecesRemaining (): number {
    const count = this.theAimFile.GetCountAfterUpdating()
    return count
  }

  public GetNextDoableCommandAndDeconstructTree (): Step | null {
    const theAny = this.theAimFile.GetTheAny()
    if (theAny != null) {
      const command = this.GetNextDoableCommandRecursively(theAny, 'root')
      return command
    }
    return null
  }

  /**
 * #### For the purposes of traversing, a leaf is one with all
 * inputs are null.
 * @param treeNode
 * @returns true if a leaf
 */
  private IsALeaf (treeNode: any): boolean {
    const length = Object.keys(treeNode).length
    return length > 0 ? false : true
  }

  private GetNextDoableCommandRecursively (treeNode: any, treeNodeKey: string): Step | null {
    if (typeof treeNode === 'string') {
      return null;
    }

    let numberOfChildrenLeaves = 0
    let numberOfChildren = 0
    for (const key in treeNode) {
      if (key !== '@') {
        const obj = treeNode[key]
        numberOfChildren += 1
        if (this.IsALeaf(obj)) {
          numberOfChildrenLeaves += 1
        }
      }
    }

    // if all children are leafs
    if (numberOfChildren > 0 && numberOfChildren == numberOfChildrenLeaves) {
      // then we test for removal
      let areAllChildDependenciesFulfilled = true
      for (const key in treeNode) {
        if (key !== '@') {
          // if the dependency is *NOT* fulfilled, then we set it to false
          if (!this.currentlyVisibleThings.Has(key)) {
            areAllChildDependenciesFulfilled = false
          }
        }
      }

      if (areAllChildDependenciesFulfilled) {
        // set the achievement as completed in the currently visible things
        this.currentlyVisibleThings.Set(treeNodeKey, new Set<string>())

        // if its a box it MUST exist, and we merge these things
        if (treeNodeKey.startsWith(IdPrefixes.Box)) {
          const box = new Box(treeNodeKey + ".jsonc");
          box.CopyStartingThingsToGivenMap(this.currentlyVisibleThings)
        }

        let objectA = ''
        let objectB = ''
        let talkAnnotation = null;
        let typeAnnotation = null;
        const dependencies = Object.keys(treeNode)
        for (var i = 0; i < dependencies.length; i++) {
          var obj = dependencies[i]
          if (obj == '@') {

            if (treeNode['@'].type != null) {
              typeAnnotation = treeNode['@'].type
            }

            if (treeNode['@'].talk != null) {
              talkAnnotation = treeNode['@'].talk
            }
            continue
          }
          if (objectA == '') {
            objectA = obj
          } else if (objectB == '') {
            objectB = obj
          }
        }

        // we remove all children.
        // we don't delete this node from its parent - because this
        // is now a leaf, and once the algorithm sees that the 
        // key is in the list of visible things (we just added it above)
        // then it will get deleted next time
        for (const key in treeNode) {
          delete treeNode[key]
        }

        // add speech from dialog file
        if (objectA.startsWith(FirstLettersOf.Dialog)) {
          const command = new Step(StepType.Dialog)
          command.objectA = objectA
          command.output = treeNodeKey
          command.metaSpeechLine = talkAnnotation
          command.metaType = typeAnnotation
          const file = new DialogFile(command.objectA + ".jsonc")
          const dialogLines = new Array<[string, string]>()
          file.CollectSpeechLinesForMainChoice(dialogLines)
          for (const line of dialogLines) {
            command.addChildTuple(line)
          }
          return command
        } else {
          let command = new Step(StepType.Command)
          command.objectA = objectA
          command.output = treeNodeKey
          command.metaSpeechLine = talkAnnotation
          command.metaType = typeAnnotation
          return command
        }
      }
      // if they were all leaf nodes, then we can't recurse down, so we return null
      return null
    } else {
      // at least one of the children isn't a leaf
      // so we can need to recurse down that non-leaf child
      for (const childKey in treeNode) {
        const child = treeNode[childKey]
        if (!this.IsALeaf(child)) {
          // the treeNode is the child's parent
          const toReturn = this.GetNextDoableCommandRecursively(child, childKey)
          if (toReturn != null) {
            return toReturn
          }
        }
      }
    }
    return null
  }

  public IsValidated (): Validated {
    return this.theAimFile.GetValidated()
  }

  public SetValidated (isValidated: Validated) {
    this.theAimFile.SetValidated(isValidated)
  }
}
