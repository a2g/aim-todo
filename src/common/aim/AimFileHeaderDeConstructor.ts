

import { AimFileHeaderMap } from './AimFileHeaderMap'
import { AimFileHeader } from './AimFileHeader'

import { FirstLettersOf } from '../../../FirstLettersOf'
import { IdPrefixes } from '../../../IdPrefixes'
import { VisibleThingsMap } from '../puzzle/VisibleThingsMap'
import { RawObjectsAndVerb } from '../puzzle/RawObjectsAndVerb'
import { Raw } from '../puzzle/Raw'
import { Validated } from '../puzzle/Validated'
import { Box } from '../puzzle/Box'
import { DialogFile } from '../dialog/DialogFile'

export class AimFileHeaderDeConstructor {
  private readonly theAimTree: AimFileHeader

  // the state that needs update
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly mapOfAimsTrees: AimFileHeaderMap// not used, but useful

  public constructor(theAimTree: AimFileHeader, visibleThings: VisibleThingsMap, aimTreeMap: AimFileHeaderMap) {
    this.theAimTree = theAimTree
    this.mapOfAimsTrees = aimTreeMap
    this.currentlyVisibleThings = visibleThings
    this.mapOfAimsTrees.Size()
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
    const count = this.theAimTree.GetCountAfterUpdating()
    return count
  }

  public GetNextDoableCommandAndDeconstructTree (): RawObjectsAndVerb | null {
    const theAny = this.theAimTree.GetTheAny()
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

  private GetNextDoableCommandRecursively (treeNode: any, treeNodeKey: string): RawObjectsAndVerb | null {
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
          // if the dependency is not fulfilled, then we set it to false
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

        // we remove all children.
        // we don't delete this node from its parent - because this
        // is now a leaf, and once the algorithm sees that the 
        // key is in the list of visible things (we just added it above)
        // then it will get deleted next time
        for (const key in treeNode) {
          delete treeNode[key]
        }

        let objectA = ''
        let objectB = ''
        let talkAnnotation = null;
        let typeAnnotation = null;
        const dependencies = Object.keys(treeNode) as string[]
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

        treeNode['@'].talk  // add speech from dialog file
        if (objectA.startsWith(FirstLettersOf.Dialog)) {
          const command = new RawObjectsAndVerb(Raw.Dialog)
          command.objectA = objectA
          command.output = treeNodeKey
          command.talkAnnotation = talkAnnotation
          command.typeAnnotation = typeAnnotation
          const file = new DialogFile(command.objectA + ".jsonc")
          const dialogLines = file.CollectSpeechLinesForMainChoice()
          for (const line of dialogLines) {
            command.addChildTuple(line)
          }
          return command
        } else {
          let command = new RawObjectsAndVerb(Raw.Command)
          command.objectA = objectA
          command.output = treeNodeKey
          command.talkAnnotation = talkAnnotation
          command.typeAnnotation = typeAnnotation
          return command
        }
      }
      // if they were all leaves, then we can't recurse down, so we return null
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
    return this.theAimTree.GetValidated()
  }

  public SetValidated (isValidated: Validated) {
    this.theAimTree.SetValidated(isValidated)
  }
}
