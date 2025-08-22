import { FormatText } from './FormatText'


import { AchievementHeaderMap } from './AchievementHeaderMap'

import { VisibleThingsMap } from './VisibleThingsMap'
import { DialogFile } from './talk/DialogFile'
import { Solved } from './Solved'
import { A_WIN } from '../A_WIN'

let globalSolutionId = 101
/**
 * Solution needs to be cloned.
 */
export class Evolution {
  // important ones
  private readonly stubs: AchievementHeaderMap

  private readonly dialogs: Map<string, DialogFile>

  // less important

  private readonly startingThings: VisibleThingsMap // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree
  private readonly essentialIngredients: Set<string> // yup these are added to
  private readonly solvingPathSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames

  private readonly id: number

  private constructor(
    id: number,
    startingThingsPassedIn: VisibleThingsMap,
    stubsToCopy: AchievementHeaderMap | null,
    prerequisites: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.id = id
    this.stubs = new AchievementHeaderMap(stubsToCopy)
    this.dialogs = new Map<string, DialogFile>()



    // starting things AND currentlyVisibleThings
    this.startingThings = new VisibleThingsMap(null)
    if (startingThingsPassedIn != null) {
      for (const item of startingThingsPassedIn.GetIterableIterator()) {
        this.startingThings.Set(item[0], item[1])
      }
    }

    // if solutionNameSegments is passed in, we deep copy it
    this.solvingPathSegments = []
    if (nameSegments != null) {
      for (const segment of nameSegments) {
        this.solvingPathSegments.push(segment)
      }
      // this.solutionNameSegments.push(`${this.id}`)
    } else {
      this.solvingPathSegments.push(`${this.id}`)
    }

    // its prerequisitesEncounteredDuringSolving is passed in we deep copy it
    this.essentialIngredients = new Set<string>()
    if (prerequisites != null) {
      for (const restriction of prerequisites) {
        this.essentialIngredients.add(restriction)
      }
    }
  }

  public static createSolution (
    startingThingsPassedIn: VisibleThingsMap,
    stubs: AchievementHeaderMap | null,
    prerequisites: Set<string> | null = null,
    nameSegments: string[] | null = null
  ): Evolution {
    globalSolutionId++
    return new Evolution(globalSolutionId, startingThingsPassedIn, stubs, prerequisites, nameSegments)
  }

  public Clone (): Evolution {
    // the weird order of this is because Solution constructor is used
    // primarily to construct, so passing in root piece is needed..
    // so we clone the whole tree and pass it in
    const clonedRootPieceMap =
      this.stubs.Clone()

    // When we clone we generally give everything new ids
    // but

    const clonedSolution = Evolution.createSolution(
      this.startingThings,
      clonedRootPieceMap,
      this.essentialIngredients,
      this.solvingPathSegments
    )

    return clonedSolution
  }



  public KeepOnlyVisitedAchievements (): void {
    const visitedAchievements = new Set<string>()
    visitedAchievements.add(A_WIN)
    /*
    const winAchievement = this.stubs.GetAchievementStubIfAny()
    this.stubs.KeepOnlyGivenAchievementStubs(visitedAchievements)
    */
  }

  public GetSolvingPath (): string {
    let result = 'sol_'
    for (let i = 0; i < this.solvingPathSegments.length; i += 1) {
      const symbol = i === 0 ? '' : '/'
      result += symbol + FormatText(this.solvingPathSegments[i])
    }
    return result
  }

  public AddToListOfPrerequisites (essentialIngredients: string[]): void {
    essentialIngredients.forEach(item => this.essentialIngredients.add(item))
  }

  public GetEssentialIngredients (): Set<string> {
    return this.essentialIngredients
  }

  public PushSolvingPathSegment (solutionName: string): void {
    this.solvingPathSegments.push(solutionName)
  }

  public FindAnyPieceMatchingIdRecursively (id: string): void | null {
    for (const header of this.stubs.GetValues()) {
      const piece = header.GetThePiece()
      if (piece != null) {
        const result = piece.FindAnyPieceMatchingIdRecursively(id)
        if (result != null) {
          return
        }
      }
    }
    return
  }

  public GetAchievementStubMap (): AchievementHeaderMap {
    return this.stubs
  }

  public GetStartingThings (): VisibleThingsMap {
    return this.startingThings
  }

  public UpdateAchievementSolvedStatuses (): void {
    let thereAreStillSomeUnsolved = false
    // go through all the achievement pieces
    for (const header of this.stubs.GetValues()) {
      // if there are no places to attach pieces it will return null
      const piece = header.GetThePiece()
      const firstMissingPiece = (piece != null) ? piece.ReturnTheFirstNullInputHint() : header.GetTheAchievementWord()
      if (firstMissingPiece === '') {
        if (!header.IsSolved()) {
          header.SetSolved(Solved.Solved)
        }
      } else {
        thereAreStillSomeUnsolved = true
      }
    }

    if (!thereAreStillSomeUnsolved) {
      //  this.KeepOnlyVisitedAchievements()
    }
  }

  public IsUnsolved (): boolean {
    for (const achievement of this.stubs.GetValues()) {
      if (!achievement.IsSolved()) {
        return true
      }
    }
    return false
  }

  public GetVisibleThingsAtTheStart (): VisibleThingsMap {
    return this.startingThings
  }



  public GetDialogFiles (): Map<string, DialogFile> {
    return this.dialogs
  }

}
