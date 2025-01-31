import assert from 'assert'
import { createCommandFromAutoPiece } from '../createCommandFromAutoPiece'
import { Piece } from '../Piece'
import { Raw } from '../Raw'
import { RawObjectsAndVerb } from '../RawObjectsAndVerb'

import { SpecialTypes } from '../SpecialTypes'
import { DialogFile } from '../talk/DialogFile'
import { VisibleThingsMap } from '../VisibleThingsMap'
import { Box } from '../Box'
 
import { Validated } from '../Validated'
import { AimTreeMap } from './AimTreeMap'

export class DeconstructDoer {
  private readonly theAimTree: any

  // the state that needs update
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly dialogs: Map<string, DialogFile>
  private readonly pieces: Map<string, Piece>
  private readonly aimTeeMap: AimTreeMap

  public constructor (theAimTree: any, pieces: Map<string, Piece>, visibleThings: VisibleThingsMap, theSolutionsDialogFiles: Map<string, DialogFile>, aimTreeMap: AimTreeMap) {
    this.theAimTree = theAimTree
    this.aimTeeMap = aimTreeMap
    this.currentlyVisibleThings = visibleThings
    this.dialogs = theSolutionsDialogFiles
    this.pieces = pieces
  }

  // In the constructor above, we see that the root of copied tree is created
  // and the first actual jigsaw piece that is attached to it is
  // gets pushed into the zero slot of the inputs
  public IsZeroPieces (): boolean {
    return this.theAimTree.inputs[0] == null
  }

  public GetNextDoableCommandAndDeconstructTree (): RawObjectsAndVerb | null {
    const thePiece = this.theAimTree.GetThePiece()
    if (thePiece != null) {
      const command = this.GetNextDoableCommandRecursively(thePiece)
      return command
    }
    return null
  }

  private GetNextDoableCommandRecursively (treeNode: any): RawObjectsAndVerb | null {
    if (this.isALeaf(treeNode)) {
      // isAFef - basically means has zero children

      let areAllChildrenVisibleOrActive = true
      for (let i = 0; i < treeNode.inputHints.length; i++) {
        if (!this.currentlyVisibleThings.Has(treeNode.inputHints[i])) {
          areAllChildrenVisibleOrActive = false
        }
      }
      if (areAllChildrenVisibleOrActivex) {
        const isSomeOtherAchievementThatHasBeenAchieved = (treeNode.type === SpecialTypes.SomeOtherAchievement) && this.aimTeeMap.IsAchievementPieceNulled(treeNode.output)
        const isStartingThingsAndTheyHaveBeenOpened = (treeNode.type === SpecialTypes.StartingThings) && this.currentlyVisibleThings.Has(treeNode.output)
        if (isSomeOtherAchievementThatHasBeenAchieved || isStartingThingsAndTheyHaveBeenOpened) {
          // if this best way to check whether we have just completed the root piece?
          const theStubPiece = this.theAimTree.GetThePiece()
          if (theStubPiece != null && theStubPiece.id === treeNode.id) {
            this.theAimTree.SetValidated(Validated.YesValidated)
          }

          // then we remove this key as a leaf piece..
          // by nulling its  input in the parent.
          const parent = treeNode.GetParent()
          if (treeNode.parent != null && parent != null) {
            for (let i = 0; i < treeNode.parent.inputHints.length; i++) {
              // nullify only the input of the parent who matches this output
              if (treeNode.parent.inputHints[i] === treeNode.output) {
                treeNode.parent.inputs[i] = null
                // don't blank out the input hint - its used to determine areAllInputHintsInTheVisibleSet
              }
            }
          }

          if (treeNode.boxToMerge != null) {
            this.MergeBox(treeNode.boxToMerge)
          }

          // if its from our stash, then decrement it or remove it from stash
          if (isSamePieceIsInOurStash) {
            if (treeNode.reuseCount - 1 <= 0) {
              this.pieces.delete(treeNode.id)
            } else {
              treeNode.SetCount(treeNode.reuseCount - 1)
              console.warn(`trans.count is now ${treeNode.reuseCount}`)
            }
          }

          // set the achievement as completed in the currently visible things
          this.currentlyVisibleThings.Set(this.theAimTree.GetTheAchievementWord(), new Set<string>())

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

  private AddToMapOfVisibleThings (thing: string): void {
    if (!this.currentlyVisibleThings.Has(thing)) {
      this.currentlyVisibleThings.Set(thing, new Set<string>())
    }
  }

  /**
   * #### For the purposes of traversing, a leaf is one with all
   * inputs are null.
   * @param piece
   * @returns true if a leaf
   */
  private isALeaf (treeNode: any): boolean {
    return Object.keys(treeNode).length? true : false
  }

  private MergeBox (boxToMerge: Box): void {
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
