import { FormatText } from './FormatText'
import { Piece } from './Piece'

import { AchievementStubMap } from './AchievementStubMap'
import { Evolutions } from './Evolutions'
import { VisibleThingsMap } from './VisibleThingsMap'
import { Box } from './Box'
import { DialogFile } from './talk/DialogFile'
import { Solved } from './Solved'
import { GenerateMapOfLeavesTracingAchievementsRecursively } from './GenerateMapOfLeavesTraccingGoalsRecursively'
import { A_WIN } from '../A_WIN'

let globalSolutionId = 101
/**
 * Solution needs to be cloned.
 */
export class Evolution {
  // important ones
  private readonly stubs: AchievementStubMap
  private readonly remainingPieces: Map<string, Set<Piece>>
  private readonly dialogs: Map<string, DialogFile>

  // less important

  private readonly startingThings: VisibleThingsMap // once, this was updated dynamically in GetNextDoableCommandAndDesconstructTree
  private readonly essentialIngredients: Set<string> // yup these are added to
  private readonly solvingPathSegments: string[] // these get assigned by SolverViaRootPiece.GenerateNames

  private readonly id: number

  private constructor(
    id: number,
    pieces: Map<string, Set<Piece>>,
    dialogs: Map<string, DialogFile>,
    startingThingsPassedIn: VisibleThingsMap,
    stubsToCopy: AchievementStubMap | null,
    prerequisites: Set<string> | null = null,
    nameSegments: string[] | null = null
  ) {
    this.id = id
    this.stubs = new AchievementStubMap(stubsToCopy)
    this.dialogs = new Map<string, DialogFile>()
    this.remainingPieces = new Map<string, Set<Piece>>()

    // pieces
    Box.CopyDialogsFromAtoB(dialogs, this.dialogs)
    Box.CopyPiecesFromAtoB(pieces, this.remainingPieces)

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
    pieces: Map<string, Set<Piece>>,
    dialogs: Map<string, DialogFile>,
    startingThingsPassedIn: VisibleThingsMap,
    stubs: AchievementStubMap | null,
    prerequisites: Set<string> | null = null,
    nameSegments: string[] | null = null
  ): Evolution {
    globalSolutionId++
    return new Evolution(globalSolutionId, pieces, dialogs, startingThingsPassedIn, stubs, prerequisites, nameSegments)
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
      this.remainingPieces,
      this.dialogs,
      this.startingThings,
      clonedRootPieceMap,
      this.essentialIngredients,
      this.solvingPathSegments
    )

    return clonedSolution
  }

  public ProcessUntilCloning (solutions: Evolutions): boolean {
    let isBreakingDueToSolutionCloning = false
    for (const stub of this.stubs.GetValues()) {
      if (/* stub.IsNeeded()&& */ !stub.IsSolved()) {
        if (stub.ProcessStubUntilCloning(this, solutions, '/')) {
          isBreakingDueToSolutionCloning = true
          break
        }
      }
    }

    return isBreakingDueToSolutionCloning
  }

  public KeepOnlyVisitedAchievements (): void {
    const visitedAchievements = new Set<string>()
    visitedAchievements.add(A_WIN)
    const leaves = new Map<string, Piece>()
    const winAchievement = this.stubs.GetAchievementStubIfAny()
    const piece = winAchievement?.GetThePiece()
    if (piece != null) {
      GenerateMapOfLeavesTracingAchievementsRecursively(
        piece,
        A_WIN,
        leaves,
        visitedAchievements,
        this.stubs
      )
    }
    this.stubs.KeepOnlyGivenAchievementStubs(visitedAchievements)
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

  public FindAnyPieceMatchingIdRecursively (id: string): Piece | null {
    for (const stub of this.stubs.GetValues()) {
      const piece = stub.GetThePiece()
      if (piece != null) {
        const result = piece.FindAnyPieceMatchingIdRecursively(id)
        if (result != null) {
          return result
        }
      }
    }
    return null
  }

  public GetAchievementStubMap (): AchievementStubMap {
    return this.stubs
  }

  public GetStartingThings (): VisibleThingsMap {
    return this.startingThings
  }

  public UpdateAchievementSolvedStatuses (): void {
    let thereAreStillSomeUnsolved = false
    // go through all the achievement pieces
    for (const stub of this.stubs.GetValues()) {
      // if there are no places to attach pieces it will return null
      const piece = stub.GetThePiece()
      const firstMissingPiece = (piece != null) ? piece.ReturnTheFirstNullInputHint() : stub.GetTheAchievementWord()
      if (firstMissingPiece === '') {
        if (!stub.IsSolved()) {
          stub.SetSolved(Solved.Solved)
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

  public GetNumberOfPiecesRemaining (): number {
    return this.remainingPieces.size
  }

  public GetDialogFiles (): Map<string, DialogFile> {
    return this.dialogs
  }

  public GetAutos (): Piece[] {
    const toReturn: Piece[] = []
    this.remainingPieces.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (piece.type.startsWith('AUTO')) {
          toReturn.push(piece)
        }
      })
    })
    return toReturn
  }

  public GetPiecesThatOutputString (objectToObtain: string): Set<Piece> {
    // since the remainingPieces are a map index by output piece
    // then a remainingPieces.Get will retrieve all matching pieces.
    // BUT...
    // we want it to return a random empty set if not found
    // and for now, it seems like it was changed to a slow
    // iteration through the map to match - possibly for debugging.
    for (const pair of this.remainingPieces) {
      if (pair[0] === objectToObtain) {
        return pair[1]
      }
    }
    return new Set<Piece>()
  }

  public RemovePiece (piece: Piece): void {
    if (piece.reuseCount - 1 <= 0) {
      const key = piece.output
      if (this.remainingPieces.has(key)) {
        const oldSet = this.remainingPieces.get(key)
        if (oldSet != null) {
          // console.warn(" old size = "+oldSet.size);
          oldSet.delete(piece)
          // console.warn(" newSize = "+oldSet.size);
        }
      } else {
        piece.SetCount(piece.reuseCount - 1)
        console.warn(`trans.count is now ${piece.reuseCount}`)
      }
    }
  }
}
