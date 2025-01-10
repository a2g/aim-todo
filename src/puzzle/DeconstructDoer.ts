import assert from 'assert'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { AchievementStub } from './AchievementStub'
import { SpecialTypes } from './SpecialTypes'
import { DialogFile } from './talk/DialogFile'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { AchievementStubMap } from './AchievementStubMap'
import { Validated } from './Validated'

export class DeconstructDoer {
  private readonly theStub: AchievementStub

  // the state that needs update
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly dialogs: Map<string, DialogFile>
  private readonly pieces: Map<string, Piece>
  private readonly stubMap: AchievementStubMap

  public constructor (theStub: AchievementStub, pieces: Map<string, Piece>, visibleThings: VisibleThingsMap, theSolutionsDialogFiles: Map<string, DialogFile>, stubMap: AchievementStubMap) {
    this.theStub = theStub
    this.stubMap = stubMap
    this.currentlyVisibleThings = visibleThings
    this.dialogs = theSolutionsDialogFiles
    this.pieces = pieces
  }

  // In the constructor above, we see that the root of copied tree is created
  // and the first actual jigsaw piece that is attached to it is
  // gets pushed into the zero slot of the inputs
  public IsZeroPieces (): boolean {
    return this.theStub.inputs[0] == null
  }

  public GetNextDoableCommandAndDeconstructTree (): RawObjectsAndVerb | null {
    const thePiece = this.theStub.GetThePiece()
    if (thePiece != null) {
      const command = this.GetNextDoableCommandRecursively(thePiece)
      return command
    }
    return null
  }

  private GetNextDoableCommandRecursively (piece: Piece): RawObjectsAndVerb | null {
    if (this.isALeaf(piece)) {
      // if its a leaf, we do a quick check whether we can return a command,
      // if we can't then
      // we recurse through children

      let areAllInputHintsInTheVisibleSet = true
      for (let i = 0; i < piece.inputHints.length; i++) {
        if (!this.currentlyVisibleThings.Has(piece.inputHints[i])) {
          areAllInputHintsInTheVisibleSet = false
        }
      }
      if (areAllInputHintsInTheVisibleSet) {
        const isSamePieceIsInOurStash = piece.id !== 'stub' && this.pieces.has(piece.id)
        const isSomeOtherAchievementThatHasBeenAchieved = (piece.type === SpecialTypes.SomeOtherAchievement) && this.stubMap.IsAchievementPieceNulled(piece.output)
        const isStartingThingsAndTheyHaveBeenOpened = (piece.type === SpecialTypes.StartingThings) && this.currentlyVisibleThings.Has(piece.output)
        if (isSamePieceIsInOurStash || isSomeOtherAchievementThatHasBeenAchieved || isStartingThingsAndTheyHaveBeenOpened) {
          // if this best way to check whether we have just completed the root piece?
          const theStubPiece = this.theStub.GetThePiece()
          if (theStubPiece != null && theStubPiece.id === piece.id) {
            this.theStub.SetValidated(Validated.YesValidated)
          }

          // then we remove this key as a leaf piece..
          // by nulling its  input in the parent.
          const parent = piece.GetParent()
          if (piece.parent != null && parent != null) {
            for (let i = 0; i < piece.parent.inputHints.length; i++) {
              // nullify only the input of the parent who matches this output
              if (piece.parent.inputHints[i] === piece.output) {
                piece.parent.inputs[i] = null
                // don't blank out the input hint - its used to determine areAllInputHintsInTheVisibleSet
              }
            }
          }

          if (piece.boxToMerge != null) {
            this.MergeBox(piece.boxToMerge)
          }

          // if its from our stash, then decrement it or remove it from stash
          if (isSamePieceIsInOurStash) {
            if (piece.reuseCount - 1 <= 0) {
              this.pieces.delete(piece.id)
            } else {
              piece.SetCount(piece.reuseCount - 1)
              console.warn(`trans.count is now ${piece.reuseCount}`)
            }
          }

          // set the achievement as completed in the currently visible things
          this.currentlyVisibleThings.Set(this.theStub.GetTheAchievementWord(), new Set<string>())

          // Now for the verb/object combo that we need to return
          let toReturn: RawObjectsAndVerb | null = null

          let verb = Raw.None
          if (piece.parent == null) {
            // I think this means tha the root piece isn't set objerly!
            // so we need to set breakpoint on this return, and debug.
            assert(false)
          } else if (piece.type.toLowerCase().includes('grab')) {
            verb = Raw.Grab
          } else if (piece.type.toLowerCase().includes('dialog')) {
            verb = Raw.Dialog
          } else if (piece.type.toLowerCase().includes('toggle')) {
            verb = Raw.Toggle
          } else if (piece.type.toLowerCase().includes('auto')) {
            verb = Raw.Auto
          } else if (piece.type.toLowerCase().includes('open')) {
            verb = Raw.Open
          } else {
            verb = Raw.Use
          }

          this.AddToMapOfVisibleThings(piece.output)

          // When we achieve achievements, we sometimes want the happening that result
          // from them to execute straight away. But sometimes there are
          // autos in the unused pieces pile that take the achievement as input
          // so we want to climb through the tree, find them, and stub their inputs.
          // But sometimes the inputs are all nulled...Maybe in this case
          // we should not say anything is done, and simply limit our response
          // to what we've already done - ie kill the node

          // now lets return the piece
          if (piece.type === SpecialTypes.SomeOtherAchievement) {
            toReturn = new RawObjectsAndVerb(
              Raw.None,
              '',
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          } else if (piece.type === SpecialTypes.StartingThings) {
            toReturn = new RawObjectsAndVerb(
              Raw.None,
              '',
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type

            )
          } else if (piece.type === SpecialTypes.VerifiedLeaf) {
            toReturn = new RawObjectsAndVerb(
              Raw.None,
              '',
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          } else if (piece.inputs.length === 0) {
            toReturn = new RawObjectsAndVerb(
              Raw.None,
              '',
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          } else if (verb === Raw.Grab) {
            toReturn = new RawObjectsAndVerb(
              Raw.Grab,
              piece.inputHints[0],
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          } else if (verb === Raw.Dialog) {
            const path = piece.GetDialogPath()
            const dialogPropName = piece.inputHints[0]
            const dialogState = this.dialogs.get(dialogPropName + '.jsonc')
            if (dialogState != null) {
              const speechLines = dialogState.CollectSpeechLinesNeededToGetToPath(path)

              toReturn = new RawObjectsAndVerb(
                Raw.Dialog,
                piece.inputHints[0],
                '',
                piece.output,
                piece.getPrerequisites(),
                speechLines,
                piece.type
              )
            }
          } else if (verb === Raw.Open) {
            toReturn = new RawObjectsAndVerb(
              Raw.Open,
              piece.inputHints[0],
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          } else if (verb === Raw.Toggle) {
            toReturn = new RawObjectsAndVerb(
              Raw.Toggle,
              piece.inputHints[0],
              '',
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          } else if (verb === Raw.Auto) {
            // console.warn(pathOfThis)
            toReturn = createCommandFromAutoPiece(piece)
          } else if (verb === Raw.Use) {
            // then its nearly definitely 'use', unless I messed up
            toReturn = new RawObjectsAndVerb(
              Raw.Use,
              piece.inputHints[0],
              piece.inputHints[1],
              piece.output,
              piece.getPrerequisites(),
              [],
              piece.type
            )
          }
          return toReturn
        }
      }
    }

    // else we recurse in to the children
    for (const input of piece.inputs) {
      if (input !== null) {
        const toReturn = this.GetNextDoableCommandRecursively(input)
        if (toReturn != null) {
          return toReturn
        }
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
  private isALeaf (piece: Piece): boolean {
    for (const a of piece.inputs) {
      if (a !== null) {
        return false
      }
    }
    return true
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
