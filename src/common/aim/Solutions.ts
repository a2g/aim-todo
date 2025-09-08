import { TodoTreeWorkspaces } from "./TodoTreeWorkspaces"
import { Solution } from "./Solution"



/**
 * Does only a few things:
 * 1. A simple collection of Solutions
 * 2. Methods that call the same thing on all solutions
 * 3. Generating solution names - which is why it needs mapOfStartingThings...
 */
export class Solutions {
  private readonly solutions: Solution[]

  constructor(workspaces: TodoTreeWorkspaces) {
    this.solutions = []
    for (const workspace of workspaces.GetSolutions()) {
      const startingThings = workspaces.GetStartingThings()
      const solution = new Solution(
        workspace.GetSolvingPath(),
        workspace.GetAimTreeMap(),
        startingThings)

      this.solutions.push(solution)
    }
  }

  public GetSolutions (): Solution[] {
    return this.solutions
  }

  public DeconstructAllAchievementsOfAllSolutionsAndRecordSteps (): boolean {
    let wasThereAtLeastSomeProgress = false
    for (const validator of this.solutions) {
      if (validator.DeconstructAllAchievementsAndRecordSteps()) {
        wasThereAtLeastSomeProgress = true
      }
    }
    return wasThereAtLeastSomeProgress
  }

  public FindEssentialIngredientsPerSolution (startingThingsPerCharacter: Map<string, Set<string>>): void {
    for (const item of startingThingsPerCharacter) {
      const character = item[0]
      const charactersSet = item[1]
      for (const validator of this.solutions) {
        const arrayOfCommands = validator.GetOrderOfCommands()
        for (const command of arrayOfCommands) {
          const hasObjectA: boolean = charactersSet.has(command.objectA)
          const hasObjectB: boolean = charactersSet.has(command.objectB)
          if (hasObjectA || hasObjectB) {
            validator.AddToListOfPrerequisites([character])
          }
        }
      }
    }
  }
}
