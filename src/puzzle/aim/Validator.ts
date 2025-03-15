import { Piece } from "../Piece"
import { Raw } from "../Raw"
import { RawObjectsAndVerb } from "../RawObjectsAndVerb"
import { DialogFile } from "../talk/DialogFile"
import { Validated } from "../Validated"
import { VisibleThingsMap } from "../VisibleThingsMap"
import { AimStub } from "./AimStub"
import { AimStubMap } from "./AimStubMap"
import { SingleAimTreeDeConstructor as SingleAimTreeDeConstructor } from "./SingleAimTreeDeConstructor"


export class Validator {
  private readonly aimTreeMap: AimStubMap
  private readonly aimTreeFileNamesInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly remainingPieces: Map<string, Piece>
  private readonly dialogs: Map<string, DialogFile>
  private readonly solutionName
  private readonly essentialIngredients: Set<string> // yup these are added to

  public constructor(name: string, aimTreeMap: AimStubMap, startingThingsPassedIn: VisibleThingsMap, prerequisites: Set<string> | null = null) {
    this.solutionName = name
    this.aimTreeMap = aimTreeMap
    this.aimTreeMap.RemoveZeroedOrUnneededAims()
    //this.achievementStubs.CalculateInitialCounts()
    this.aimTreeFileNamesInSolvingOrder = []
    this.remainingPieces = new Map<string, Piece>()
    this.dialogs = new Map<string, DialogFile>()

    this.currentlyVisibleThings = new VisibleThingsMap(null)
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.currentlyVisibleThings.Set(item[0], item[1])
      }
    }

    // its prerequisitesEncounteredDuringSolving is passed in we deep copy it
    this.essentialIngredients = new Set<string>()
    if (prerequisites != null) {
      for (const restriction of prerequisites) {
        this.essentialIngredients.add(restriction)
      }
    }
  }

  public GetName (): string {
    return this.solutionName
  }

  public GetAimTreeMap (): AimStubMap {
    return this.aimTreeMap
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  public DeconstructAllAchievementsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const stub of this.aimTreeMap.GetAims()) {
      if (stub.GetValidated() === Validated.Not) {
        if (this.DeconstructGivenStubAndRecordSteps(stub)) {
          wasThereAtLeastSomeProgress = true
        }
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public DeconstructGivenStubAndRecordSteps (aimStub: AimStub): boolean {
    // push the commands
    const deconstructDoer = new SingleAimTreeDeConstructor(
      aimStub,
      this.remainingPieces,
      this.currentlyVisibleThings,
      this.dialogs,
      this.aimTreeMap
    )

    let rawObjectsAndVerb: RawObjectsAndVerb | null = null
    for (let j = 0; j < 200; j += 1) {
      rawObjectsAndVerb =
        deconstructDoer.GetNextDoableCommandAndDeconstructTree()
      if (rawObjectsAndVerb === null) {
        // all out of moves!
        // for debugging
        rawObjectsAndVerb =
          deconstructDoer.GetNextDoableCommandAndDeconstructTree()
        break
      }

      if (rawObjectsAndVerb.type !== Raw.None) {
        // this is just here for debugging!
        aimStub.AddCommand(rawObjectsAndVerb)
        console.log(`${rawObjectsAndVerb.type}  ${rawObjectsAndVerb.objectA} ${rawObjectsAndVerb.objectB}`)
      }
    }

    // So we have no more pieces in this piece tree - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    if (deconstructDoer.IsZeroPieces()) {
      // then write the achievement we just achieved

      const raw = new RawObjectsAndVerb()
      raw.type = Raw.DeConstructorNoticedZeroPieces
      raw.objectA = ' in '
      raw.objectB = ''
      raw.output = aimStub.GetTheAimWord()
      raw.prerequisites = []
      raw.speechLines = []
      aimStub.AddCommand(raw)


      // also tell the solution what order the achievement was achieved
      this.aimTreeFileNamesInSolvingOrder.push(aimStub.GetTheAimWord())

      // Sse if any autos depend on the newly completed achievement - if so execute them
      /*
      for (const piece of this.GetAutos()) {
        if (
          piece.inputHints.length === 2 &&
          piece.inputHints[0] === singleAimTree.GetTheAchievementWord()
        ) {
          const command = createCommandFromAutoPiece(piece)
          singleAimTree.AddCommand(command)
        }
      }
        */
    }
    return true
  }

  public GetAutos (): Piece[] {
    const toReturn: Piece[] = []
    this.remainingPieces.forEach((piece: Piece) => {
      if (piece.type.startsWith('AUTO')) {
        toReturn.push(piece)
      }
    })
    return toReturn
  }

  public GetOrderOfCommands (): RawObjectsAndVerb[] {
    const toReturn: RawObjectsAndVerb[] = []
    for (const filename of this.aimTreeFileNamesInSolvingOrder) {
      const theAny = this.GetAimTreeMap().GetAimTreeByFilenameNoThrow(filename)
      const at = toReturn.length
      // const n = stub.commandsCompletedInOrder.length
      toReturn.splice(at, 0, ...theAny.GetOrderedCommands())
      const raw = new RawObjectsAndVerb()
      raw.type = Raw.Separator
      raw.mainSpiel = ` --------------- end of achievement ${filename}`
      toReturn.push(raw)
    }
    return toReturn
  }

  public GetCountRecursively (): number {
    let count = 0
    for (const stub of this.aimTreeMap.GetAims()) {
      count += stub.GetCountRecursively()
    }
    return count
  }

  public GetNumberOfAchievements (): number {
    return this.GetAimTreeMap().Size()
  }


  public GetNumberOfNotYetValidated (): number {
    let numberOfNullAchievements = 0
    for (const aim of this.GetAimTreeMap().GetAims()) {
      numberOfNullAchievements += aim.GetTheAny() == null ? 0 : 1
    }
    return numberOfNullAchievements
  }

  public GetNumberOfRemainingPieces (): number {
    return this.remainingPieces.size
  }

  GetRemainingPiecesAsString (): string {
    let stringOfPieceIds = ''
    for (const piece of this.remainingPieces.values()) {
      stringOfPieceIds += `${piece.id}-${piece.output}, \n`
    }
    return stringOfPieceIds
  }

  public AddToListOfPrerequisites (essentialIngredients: string[]): void {
    essentialIngredients.forEach(item => this.essentialIngredients.add(item))
  }
}
