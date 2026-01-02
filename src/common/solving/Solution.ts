
import { VisibleThingsMap } from "../stuff/VisibleThingsMap"
import { Validated } from "../stuff/Validated"
import { StepType } from "../stuff/StepType"
import { Step } from "../stuff/Step"
import { AimFiles } from "../files/AimFiles"
import { AimFile } from "../files/AimFile"
import { DeConstructorOfAimFile } from "./DeConstructorOfAimFile"


export class Solution {
  private readonly aimFileMap: AimFiles
  private readonly aimFileNamesInSolvingOrder: string[]
  private readonly currentlyVisibleThings: VisibleThingsMap
  private readonly solutionName: string
  private readonly essentialIngredients: Set<string> // yup these are added to

  public constructor(name: string, aimFiles: AimFiles, startingThingsPassedIn: VisibleThingsMap, prerequisites: Set<string> | null = null) {
    this.solutionName = name
    this.aimFileMap = aimFiles
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

  public GetAimFiles (): AimFiles {
    return this.aimFileMap
  }

  public GetVisibleThingsAtTheMoment (): VisibleThingsMap {
    return this.currentlyVisibleThings
  }

  public DeconstructAllAchievementsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const header of this.aimFileMap.GetAimFiles()) {
      if (header.GetValidated() === Validated.Not) {
        if (this.DeconstructGivenHeaderAndRecordSteps(header)) {
          wasThereAtLeastSomeProgress = true
        }
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public DeconstructGivenHeaderAndRecordSteps (aimFileHeader: AimFile): boolean {
    // push the commands
    const deconstructDoer = new DeConstructorOfAimFile(
      aimFileHeader,
      this.currentlyVisibleThings,
      this.aimFileMap
    )

    let rawObjectsAndVerb: Step | null = null
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

      if (rawObjectsAndVerb.stepType !== StepType.None) {
        // this is just here for debugging!
        aimFileHeader.AddCommand(rawObjectsAndVerb)
        console.log(`${rawObjectsAndVerb.stepType}  ${rawObjectsAndVerb.objectA} ${rawObjectsAndVerb.objectB}`)
      }
    }

    // So we have no more pieces in this piece tree - but merging will still
    // bring in more pieces to continue deconstruction in the future
    //
    // But if its solved, then we mark it as validated!
    const numberOfPieces = deconstructDoer.GetNumberOfPiecesRemaining()
    const isValidated = deconstructDoer.IsValidated()
    if (numberOfPieces <= 1 && isValidated == Validated.Not) {

      deconstructDoer.SetValidated(Validated.YesValidated)
      const raw = new Step(StepType.Error_ZeroPiecesInAimNoticedInDeconstructing)
      raw.objectA = ' in '
      raw.objectB = ''
      raw.output = aimFileHeader.GetAimName()
      raw.prerequisites = []
      aimFileHeader.AddCommand(raw)


      // also tell the solution what order the achievement was achieved
      this.aimFileNamesInSolvingOrder.push(aimFileHeader.GetAimName())

      this.currentlyVisibleThings.Set(aimFileHeader.GetAimName(), new Set<string>())

      // then reveal all the goodies 
      const setToVisible = new Step(StepType.RevealedByPriorStep)
      for (const goodie of aimFileHeader.GetThingsToRevealWhenAimIsMet().GetIterableIterator()) {
        if (!this.currentlyVisibleThings.Has(goodie[0])) {

          raw.objectA = goodie[0]
          setToVisible.addChildTuple([goodie[0], ""])

          this.currentlyVisibleThings.Set(goodie[0], new Set<string>())
        }
      }
      aimFileHeader.AddCommand(setToVisible)
    }
    return true
  }

  public GetOrderOfCommands (): Step[] {
    const toReturn: Step[] = []
    for (const filename of this.aimFileNamesInSolvingOrder) {
      const theAny = this.GetAimFiles().GetAimFileByFilenameNoThrow(filename)
      if (theAny != null) {
        const at = toReturn.length
        toReturn.splice(at, 0, ...theAny.GetOrderedCommands())
        const raw = new Step(StepType.EndOfAchievement)
        raw.objectA = filename;
        toReturn.push(raw)
      } else {
        toReturn.push(new Step(StepType.Error_NoAimFileOfThatNameExists))
      }
    }
    return toReturn
  }

  public GetCountRecursively (): number {
    let count = 0
    for (const header of this.aimFileMap.GetAimFiles()) {
      count += header.GetCountAfterUpdating()
    }
    return count
  }

  public GetNumberOfAimFiles (): number {
    return this.aimFileMap.Size()
  }

  public GetNumberOfNotYetValidated (): number {
    let numberOfNullAchievements = 0
    for (const aim of this.GetAimFiles().GetAimFiles()) {
      numberOfNullAchievements += aim.GetTheAny() == null ? 0 : 1
    }
    return numberOfNullAchievements
  }

  public AddToListOfPrerequisites (essentialIngredients: string[]): void {
    essentialIngredients.forEach(item => this.essentialIngredients.add(item))
  }

}
