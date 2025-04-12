// import { Aggregates } from './Aggregates'
import { Box } from './Box'
import { AchievementStubMap } from './AchievementStubMap'

import { Evolution } from './Evolution'

import { A_WIN } from '../A_WIN'

/**
 * Does only a few things:
 * 1. A simple collection of Solutions
 * 2. Methods that call the same thing on all solutions
 * 3. Generating solution names - which is why it needs mapOfStartingThings...
 */
export class Evolutions {
  private readonly solutions: Evolution[]
  private readonly mapOfStartingThingsAndWhoStartsWithThem: Map<string, Set<string>>

  constructor(startFolder: string, startFile: string) {
    this.solutions = []
    const box = new Box(startFolder, startFile)


    // now lets initialize the first solution
    const solution1 = Evolution.createSolution(
      box.GetMapOfAllStartingThings(),
      this.CreateStubMapFromAchievements(box.GetSetOfAchievementWords())
      // this.CreateStubMapFromachievementAchievements(this.aggregates.setOfachievementAchievements)
    )
    this.solutions.push(solution1)

    this.mapOfStartingThingsAndWhoStartsWithThem = new Map<string, Set<string>>()
    const staringThings = solution1.GetStartingThings()
    for (const thing of staringThings.GetIterableIterator()) {
      const key = thing[0]
      // characters is mostly an empty set
      // because because less than one percent of objects
      // are constrained to a particular character
      const characters = thing[1]
      const newSet = new Set<string>()
      for (const character of characters) {
        newSet.add(character)
      }
      this.mapOfStartingThingsAndWhoStartsWithThem.set(key, newSet)
    }
  }

  public NumberOfSolutions (): number {
    return this.solutions.length
  }

  public SolvePartiallyUntilCloning (): boolean {
    let hasACloneJustBeenCreated = false
    const solutions = this.solutions
    for (const solution of solutions) {
      if (solution.IsUnsolved()) {
        if (solution.ProcessUntilCloning(this)) {
          hasACloneJustBeenCreated = true
          break// breaking here at a smaller step, allows catching of bugs as soon as they occur
        }
      }
    }
    return hasACloneJustBeenCreated
  }

  public GetSolutions (): Evolution[] {
    return this.solutions
  }

  public UpdateSolvedStatuses (): void {
    for (const solution of this.solutions) {
      solution.UpdateAchievementSolvedStatuses()
    }
  }

  public RemoveSolution (solution: Evolution): void {
    for (let i = 0; i < this.solutions.length; i++) {
      if (this.solutions[i] === solution) {
        this.solutions.splice(i, 1)
      }
    }
  }

  public CreateStubMapFromAchievements (setOfStrings: Set<string>): AchievementStubMap {
    setOfStrings.delete(A_WIN)
    const rootMapFromStubs = new AchievementStubMap(null)
    rootMapFromStubs.AddAchievementStub(A_WIN, true)

    for (const achievementAchievement of setOfStrings) {
      rootMapFromStubs.AddAchievementStub(achievementAchievement, false)
    }
    return rootMapFromStubs
  }

  public PerformThingsNeededAfterAllSolutionsFound (): void {
    this.GenerateSolutionNamesTheOldWay()
    this.KeepOnlyVisitedAchievementsFromAllSolutions()
  }

  public KeepOnlyVisitedAchievementsFromAllSolutions (): void {
    for (const solution of this.solutions) {
      solution.KeepOnlyVisitedAchievements()
    }
  }

  public GenerateSolutionNamesTheOldWay (): void {

    /*
    for (let i = 0; i < this.solutions.length; i++) {
      // now lets find out the amount leafNode name exists in all the other solutions
      const mapForCounting = new Map<string, number>()
      for (let j = 0; j < this.solutions.length; j++) {
        if (i === j) {
          continue
        }
        const otherSolution = this.solutions[j]
        const otherLeafs = otherSolution
          .GetRootMap()
          .GenerateMapOfLeavesFromWinAchievement()
        for (const leafNode of otherLeafs.values()) {
          if (leafNode != null) {
            const otherLeafNodeName = leafNode.GetOutput()
            let otherLeafNodeNameCount = 0
            const result = mapForCounting.get(otherLeafNodeName)
            if (result !== undefined) {
              otherLeafNodeNameCount = result
            }
            mapForCounting.set(otherLeafNodeName, otherLeafNodeNameCount + 1)
          }
        }
      }

      // find least popular leaf in solution i
      const currSolution = this.solutions[i]
      let minLeafNodeNameCount = 1000 // something high
      let minLeafNodeName = ''

      // get the prerequisites accumulated from all the solution nodes
      const accumulatedPrerequisites = currSolution.GetAccumulatedPrerequisites()

      // GenerateMapOfLeaves
      const currLeaves = currSolution
        .GetRootMap()
        .GenerateMapOfLeavesFromWinAchievement()
      for (const leafNode of currLeaves.values()) {
        if (leafNode != null) {
          const result = mapForCounting.get(leafNode.GetOutput())
          if (result !== undefined && result < minLeafNodeNameCount) {
            minLeafNodeNameCount = result
            minLeafNodeName = leafNode.GetOutput()
          } else if (!mapForCounting.has(leafNode.GetOutput())) {
            // our leaf is no where in the leafs of other solutions - we can use it!
            minLeafNodeNameCount = 0
            minLeafNodeName = leafNode.GetOutput()
          }

          // now we potentially add startingSet items to prerequisites
          this.mapOfStartingThingsAndWhoCanHaveThem.forEach(
            (characters: Set<string>, key: string) => {
              if (key === leafNode.GetOutput()) {
                for (const character of characters) {
                  accumulatedPrerequisites.add(character)
                }
              }
            }
          )
        }
      }

      if (minLeafNodeName !== '') {
        if (!currSolution.GetLastDisplayNameSegment().startsWith('sol_')) {
          currSolution.PushDisplayNameSegment(
            'sol_' +
            minLeafNodeName +
            Colors.Reset +
            (accumulatedPrerequisites.size > 0
              ? AddBrackets(GetDisplayName(Array.from(accumulatedPrerequisites)))
              : '')
          )
        }
      }
    } */
  }
}
