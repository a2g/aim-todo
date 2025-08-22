import { Raw } from "../Raw"
import { RawObjectsAndVerb } from "../RawObjectsAndVerb"
import { Validated } from "../Validated"
import { VisibleThingsMap } from "../VisibleThingsMap"
import { AimFileHeader } from "./AimFileHeader"
import { AimFileHeaderMap } from "./AimFileHeaderMap"
import { AimFileHeaderDeConstructor as AimFileHeaderDeConstructor } from "./AimFileHeaderDeConstructor"


export class Validator {
  private readonly aimFileMap: AimFileHeaderMap
  private readonly aimFileNamesInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly solutionName: string
  private readonly essentialIngredients: Set<string> // yup these are added to

  public constructor(name: string, aimTreeMap: AimFileHeaderMap, startingThingsPassedIn: VisibleThingsMap, prerequisites: Set<string> | null = null) {
    this.solutionName = name
    this.aimFileMap = aimTreeMap
    this.aimFileMap.RemoveZeroedOrUnneededAims()
    this.aimFileNamesInSolvingOrder = []

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

  public GetAimTreeMap (): AimFileHeaderMap {
    return this.aimFileMap
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  public DeconstructAllAchievementsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const header of this.aimFileMap.GetAims()) {
      if (header.GetValidated() === Validated.Not) {
        if (this.DeconstructGivenHeaderAndRecordSteps(header)) {
          wasThereAtLeastSomeProgress = true
        }
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public DeconstructGivenHeaderAndRecordSteps (aimFileHeader: AimFileHeader): boolean {
    // push the commands
    const deconstructDoer = new AimFileHeaderDeConstructor(
      aimFileHeader,
      this.currentlyVisibleThings,
      this.aimFileMap
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

      if (rawObjectsAndVerb.source !== Raw.None) {
        // this is just here for debugging!
        aimFileHeader.AddCommand(rawObjectsAndVerb)
        console.log(`${rawObjectsAndVerb.source}  ${rawObjectsAndVerb.objectA} ${rawObjectsAndVerb.objectB}`)
      }
    }

    // So we have no more pieces in this piece tree - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    const numberOfPieces = deconstructDoer.GetNumberOfPieces()
    const isValidated = deconstructDoer.IsValidated()
    if (numberOfPieces <= 1 && isValidated == Validated.Not) {

      deconstructDoer.SetValidated(Validated.YesValidated)
      const raw = new RawObjectsAndVerb(Raw.Error_ZeroPiecesInAimNoticedInDeconstructing)
      raw.objectA = ' in '
      raw.objectB = ''
      raw.output = aimFileHeader.GetAimName()
      raw.prerequisites = []
      aimFileHeader.AddCommand(raw)


      // also tell the solution what order the achievement was achieved
      this.aimFileNamesInSolvingOrder.push(aimFileHeader.GetAimName())

      this.currentlyVisibleThings.Set(aimFileHeader.GetAimName(), new Set<string>())

      // then reveal all the goodies 
      const setToVisible = new RawObjectsAndVerb(Raw.Reveal)
      for (const goodie of aimFileHeader.GetThingsToRevealWhenAimIsMet().GetIterableIterator()) {
        if (!this.currentlyVisibleThings.Has(goodie[0])) {

          raw.objectA = goodie[0]
          setToVisible.addChildTuple([goodie[0], ""])

          this.currentlyVisibleThings.Set(goodie[0], new Set<string>())
        }
      }
      aimFileHeader.AddCommand(setToVisible)

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

  public GetOrderOfCommands (): RawObjectsAndVerb[] {
    const toReturn: RawObjectsAndVerb[] = []
    for (const filename of this.aimFileNamesInSolvingOrder) {
      const theAny = this.GetAimTreeMap().GetAimTreeByFilenameNoThrow(filename)
      const at = toReturn.length
      // const n = header.commandsCompletedInOrder.length
      toReturn.splice(at, 0, ...theAny.GetOrderedCommands())
      const raw = new RawObjectsAndVerb(Raw.Separator)
      raw.mainSpiel = ` --------------- end of achievement ${filename}`
      toReturn.push(raw)
    }
    return toReturn
  }

  public GetCountRecursively (): number {
    let count = 0
    for (const header of this.aimFileMap.GetAims()) {
      count += header.GetCountAfterUpdating()
    }
    return count
  }

  public GetNumberOfAimFiles (): number {
    return this.aimFileMap.Size()
  }

  public GetNumberOfNotYetValidated (): number {
    let numberOfNullAchievements = 0
    for (const aim of this.GetAimTreeMap().GetAims()) {
      numberOfNullAchievements += aim.GetTheAny() == null ? 0 : 1
    }
    return numberOfNullAchievements
  }

  public AddToListOfPrerequisites (essentialIngredients: string[]): void {
    essentialIngredients.forEach(item => this.essentialIngredients.add(item))
  }

}
