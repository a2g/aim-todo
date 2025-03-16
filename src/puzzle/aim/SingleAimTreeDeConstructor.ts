import { Piece } from '../Piece'
import { RawObjectsAndVerb } from '../RawObjectsAndVerb'
import { DialogFile } from '../talk/DialogFile'
import { VisibleThingsMap } from '../VisibleThingsMap'
import { Box } from '../Box'
import { AimFileHeaderMap } from './AimFileHeaderMap'
import { AimFileHeader } from './AimFileHeader'

export class SingleAimTreeDeConstructor {
  private readonly theAimTree: AimFileHeader

  // the state that needs update
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly dialogs: Map<string, DialogFile>
  private readonly pieces: Map<string, Piece>
  private readonly mapOfAimsTrees: AimFileHeaderMap// not used, but useful

  public constructor(theAimTree: AimFileHeader, pieces: Map<string, Piece>, visibleThings: VisibleThingsMap, theSolutionsDialogFiles: Map<string, DialogFile>, aimTreeMap: AimFileHeaderMap) {
    this.theAimTree = theAimTree
    this.mapOfAimsTrees = aimTreeMap
    this.currentlyVisibleThings = visibleThings
    this.dialogs = theSolutionsDialogFiles
    this.pieces = pieces
    this.mapOfAimsTrees.Size()
  }

  /**
 * #### For the purposes of traversing, a leaf is one with all
 * inputs are null.
 * @param piece
 * @returns true if a leaf
 */
  public isALeaf (treeNode: any): boolean {
    return Object.keys(treeNode).length ? true : false
  }

  // In the constructor above, we see that the root of copied tree is created
  // and the first actual jigsaw piece that is attached to it is
  // gets pushed into the zero slot of the inputs
  public IsZeroPieces (): boolean {
    return this.theAimTree.GetTheAny()[0] == null
  }

  public GetNextDoableCommandAndDeconstructTree (): RawObjectsAndVerb | null {
    const theAny = this.theAimTree.GetTheAny()
    if (theAny != null) {
      const command = this.GetNextDoableCommandRecursively(theAny, 'root', null)
      return command
    }
    return null
  }

  /**
 * #### For the purposes of traversing, a leaf is one with all
 * inputs are null.
 * @param piece
 * @returns true if a leaf
 */
  private IsALeaf (treeNode: any): boolean {
    return Object.keys(treeNode).length ? true : false
  }

  private GetNextDoableCommandRecursively (treeNode: any, treeNodeKey: string, treeNodeParent: any): RawObjectsAndVerb | null {
    let numberOfChildrenLeaves = 0
    let numberOfChildren = 0
    for (const key in treeNode) {
      const obj = treeNode[key]
      numberOfChildren += 1
      if (!this.IsALeaf(obj)) {
        numberOfChildrenLeaves += 1
      }
    }

    if (numberOfChildren > 0 && numberOfChildren == numberOfChildrenLeaves) {
      // then we test for removal
      let areAllChildrenActive = true
      for (const key in treeNode) {
        if (!this.currentlyVisibleThings.Has(key)) {
          areAllChildrenActive = false
        }
      }

      if (areAllChildrenActive) {
        // set the achievement as completed in the currently visible things
        this.currentlyVisibleThings.Set(treeNodeKey, new Set<string>())

        // construct the new command - whilst we have all the data.
        let command = new RawObjectsAndVerb()
        command.output = treeNodeKey

        // we remove from parent (if non null)
        if (treeNodeParent != null) {
          for (const key in treeNodeParent) {
            const obj = treeNodeParent[key]
            if (obj === treeNodeParent) {
              delete treeNodeParent[key]
            }
          }
        }

        return command
      }
      // if they were all leaves, then we can't recurse down, so we return null
      return null
    } else {
      // atleats one of the children isn't a leaf
      // so we can need to recurse down that non-leaf child
      for (const childKey in treeNode) {
        const child = treeNode[childKey]
        numberOfChildren += 1
        if (!this.IsALeaf(child)) {
          const toReturn = this.GetNextDoableCommandRecursively(child, childKey, parent)
          if (toReturn != null) {
            return toReturn
          }
        }
      }
    }
    return null
  }
  /*
  
      if (areAllChildrenLeaves) {
        // isAFef - basically means has zero children
  
        let areAllChildrenVisibleOrActive = true
        for (let i = 0; i < treeNode.inputHints.length; i++) {
          if (!this.currentlyVisibleThings.Has(treeNode.inputHints[i])) {
            areAllChildrenVisibleOrActive = false
          }
        }
        if (areAllChildrenVisibleOrActive) {
    
      
            // Now for the verb/object combo that we need to return
            let toReturn: RawObjectsAndVerb | null = null
  
            let verb = Raw.None
            if (treeNode.parent == null) {
              // I think this means tha the root piece isn't set objerly!
              // so we need to set breakpoint on this return, and debug.
              assert(false)
            } else if (treeNode.type.toLowerCase().includes('grab')) {
              verb = Raw.Grab
            } else if (treeNode.type.toLowerCase().includes('dialog')) {
              verb = Raw.Dialog
            } else if (treeNode.type.toLowerCase().includes('toggle')) {
              verb = Raw.Toggle
            } else if (treeNode.type.toLowerCase().includes('auto')) {
              verb = Raw.Auto
            } else if (treeNode.type.toLowerCase().includes('open')) {
              verb = Raw.Open
            } else {
              verb = Raw.Use
            }
  
            this.AddToMapOfVisibleThings(treeNode.output)
  
            // When we achieve achievements, we sometimes want the happening that result
            // from them to execute straight away. But sometimes there are
            // autos in the unused pieces pile that take the achievement as input
            // so we want to climb through the tree, find them, and stub their inputs.
            // But sometimes the inputs are all nulled...Maybe in this case
            // we should not say anything is done, and simply limit our response
            // to what we've already done - ie kill the node
  
            // now lets return the piece
            if (treeNode.type === SpecialTypes.SomeOtherAchievement) {
              toReturn = new RawObjectsAndVerb(
                Raw.None,
                '',
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            } else if (treeNode.type === SpecialTypes.StartingThings) {
              toReturn = new RawObjectsAndVerb(
                Raw.None,
                '',
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
  
              )
            } else if (treeNode.type === SpecialTypes.VerifiedLeaf) {
              toReturn = new RawObjectsAndVerb(
                Raw.None,
                '',
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            } else if (treeNode.inputs.length === 0) {
              toReturn = new RawObjectsAndVerb(
                Raw.None,
                '',
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            } else if (verb === Raw.Grab) {
              toReturn = new RawObjectsAndVerb(
                Raw.Grab,
                treeNode.inputHints[0],
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            } else if (verb === Raw.Dialog) {
              const path = treeNode.GetDialogPath()
              const dialogPropName = treeNode.inputHints[0]
              const dialogState = this.dialogs.get(dialogPropName + '.jsonc')
              if (dialogState != null) {
                const speechLines = dialogState.CollectSpeechLinesNeededToGetToPath(path)
  
                toReturn = new RawObjectsAndVerb(
                  Raw.Dialog,
                  treeNode.inputHints[0],
                  '',
                  treeNode.output,
                  treeNode.getPrerequisites(),
                  speechLines,
                  treeNode.type
                )
              }
            } else if (verb === Raw.Open) {
              toReturn = new RawObjectsAndVerb(
                Raw.Open,
                treeNode.inputHints[0],
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            } else if (verb === Raw.Toggle) {
              toReturn = new RawObjectsAndVerb(
                Raw.Toggle,
                treeNode.inputHints[0],
                '',
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            } else if (verb === Raw.Auto) {
              // console.warn(pathOfThis)
              toReturn = createCommandFromAutoPiece(treeNode)
            } else if (verb === Raw.Use) {
              // then its nearly definitely 'use', unless I messed up
              toReturn = new RawObjectsAndVerb(
                Raw.Use,
                treeNode.inputHints[0],
                treeNode.inputHints[1],
                treeNode.output,
                treeNode.getPrerequisites(),
                [],
                treeNode.type
              )
            }
            return toReturn
          }
        }
      }
  
      // else we recurse in to the children
      for (const key in treeNode) {// https://www.geeksforgeeks.org/how-to-iterate-over-object-properties-in-typescript/
        const value = treeNode[key]
        const toReturn = this.GetNextDoableCommandRecursively(value)
        if (toReturn != null) {
            return toReturn
        }
      }    
  
      return null
    }
    */

  public AddToMapOfVisibleThings (thing: string): void {
    if (!this.currentlyVisibleThings.Has(thing)) {
      this.currentlyVisibleThings.Set(thing, new Set<string>())
    }
  }



  public MergeBox (boxToMerge: Box): void {
    console.warn(`Merging box ${boxToMerge.GetFilename()}`)

    Box.CopyPiecesFromAtoBViaIds(boxToMerge.GetPieces(), this.pieces)
    Box.CopyDialogsFromAtoB(boxToMerge.GetDialogFiles(), this.dialogs)
    boxToMerge.CopyStartingThingCharsToGivenMap(this.currentlyVisibleThings)
    // I don't think we copy the stubs to the stub map ..do we
    // because even though the stub piece might not be found later
    // on, we still should be able to place its leaf nodes early
    // boxToMerge.CopyStubsToGivenStubMap(this.stubs)
    // boxToMerge.CopyStartingThingCharsToGivenMap(this.startingThings)
  }
}
