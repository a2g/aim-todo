import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'
import { AchievementStub } from './AchievementStub'
import { DeconstructDoer } from './DeconstructDoer'
import { AchievementStubMap } from './AchievementStubMap'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { createCommandFromAutoPiece } from './createCommandFromAutoPiece'
import { DialogFile } from './talk/DialogFile'
import { Validated } from './Validated'

export class Validator {
  private readonly achievementStubs: AchievementStubMap
  private readonly rootPieceKeysInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly remainingPieces: Map<string, Piece>
  private readonly dialogs: Map<string, DialogFile>
  private readonly solutionName
  private readonly essentialIngredients: Set<string> // yup these are added to

  public constructor (name: string, startingPieces: Map<string, Set<Piece>>, startingDialogFiles: Map<string, DialogFile>, stubMap: AchievementStubMap, startingThingsPassedIn: VisibleThingsMap, prerequisites: Set<string> | null = null) {
    this.solutionName = name
    this.achievementStubs = new AchievementStubMap(stubMap)
    this.achievementStubs.RemoveZeroOrUnneededStubs()
    this.achievementStubs.CalculateInitialCounts()
    this.rootPieceKeysInSolvingOrder = []
    this.remainingPieces = new Map<string, Piece>()
    this.dialogs = new Map<string, DialogFile>()

    Box.CopyPiecesFromAtoBViaIds(startingPieces, this.remainingPieces)
    Box.CopyDialogsFromAtoB(startingDialogFiles, this.dialogs)

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

  public GetRootMap (): AchievementStubMap {
    return this.achievementStubs
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  public DeconstructAllAchievementsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const stub of this.achievementStubs.GetValues()) {
      if (stub.GetValidated() === Validated.Not) {
        if (this.DeconstructGivenStubAndRecordSteps(stub)) {
          wasThereAtLeastSomeProgress = true
        }
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public DeconstructGivenStubAndRecordSteps (stub: AchievementStub): boolean {
    // push the commands
    const deconstructDoer = new DeconstructDoer(
      stub,
      this.remainingPieces,
      this.currentlyVisibleThings,
      this.dialogs,
      this.achievementStubs
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
        stub.AddCommand(rawObjectsAndVerb)
        console.log(`${rawObjectsAndVerb.type}  ${rawObjectsAndVerb.objectA} ${rawObjectsAndVerb.objectB}`)
      }
    }

    // So we have no more pieces in this piece tree - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    if (deconstructDoer.IsZeroPieces()) {
      // then write the achievement we just achieved
      stub.AddCommand(
        new RawObjectsAndVerb(Raw.DeonstructorNoticedZeroPieces,
          ' in ',
          '',
          stub.GetTheAchievementWord(),
          [],
          [],
          ''
        )
      )

      // also tell the solution what order the achievement was achieved
      this.rootPieceKeysInSolvingOrder.push(stub.GetTheAchievementWord())

      // Sse if any autos depend on the newly completed achievement - if so execute them
      for (const piece of this.GetAutos()) {
        if (
          piece.inputHints.length === 2 &&
          piece.inputHints[0] === stub.GetTheAchievementWord()
        ) {
          const command = createCommandFromAutoPiece(piece)
          stub.AddCommand(command)
        }
      }
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
    for (const key of this.rootPieceKeysInSolvingOrder) {
      const stub = this.GetRootMap().AchievementStubByName(key)
      const at = toReturn.length
      // const n = stub.commandsCompletedInOrder.length
      toReturn.splice(at, 0, ...stub.GetOrderedCommands())
      toReturn.push(new RawObjectsAndVerb(Raw.Separator,
        ` --------------- end of achievement ${key}`,
        '',
        '',
        [],
        [],
        ''
      ))
    }
    return toReturn
  }

  public GetCountRecursively (): number {
    let count = 0
    for (const stub of this.achievementStubs.GetValues()) {
      count += stub.GetCountRecursively()
    }
    return count
  }

  public GetNumberOfAchievements (): number {
    return this.GetRootMap().Size()
  }

  public GetNumberOfNotYetValidated (): number {
    let numberOfNullAchievements = 0
    for (const achievement of this.GetRootMap().GetValues()) {
      numberOfNullAchievements += achievement.GetThePiece() == null ? 0 : 1
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
