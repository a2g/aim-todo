import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { Solutions } from '../../puzzle/Solutions'
import { SolutionView } from './SolutionView'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { Solved } from '../../puzzle/Solved'
const prompt = promptSync({})

export function ViewBackwardSolve (solutions: Solutions): void {
  const titlePath = ['Backwards Solve']
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const numberOfSolutions: number = solutions.NumberOfSolutions()
    // solutions.GenerateSolutionNamesAndPush()
    console.warn(`Number of solutions = ${numberOfSolutions} , Legend: (a, b)= (unsolvedCount, total)`)
    if (solutions.GetSolutions().length > 1) {
      console.warn('    0. All solutions')
    }
    for (let i = 0; i < solutions.GetSolutions().length; i++) {
      const solution = solutions.GetSolutions()[i]
      let unsolvedCount = 0
      for (const achievement of solution.GetAchievementStubMap().GetValues()) {
        unsolvedCount += achievement.IsSolved() ? 0 : 1
      }
      const total = solution.GetAchievementStubMap().Size()
      const status = unsolvedCount === 0 ? Solved.Solved : Solved.Not
      const name = FormatText(solution.GetSolvingPath())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      console.warn(`    ${i + 1}. ${status}(${unsolvedCount}, ${total}) ${name}`)
    }

    const firstInput = prompt(
      '\nChoose an Piece Tree (b)ack, (r)e-run, e(x)it '
    ).toLowerCase()

    if (firstInput === null || firstInput === 'b') {
      break
    }
    if (firstInput === 'x') {
      return
    }

    if (firstInput === 'r') {
      solutions.SolvePartiallyUntilCloning()
      solutions.UpdateSolvedStatuses()
      continue
    } else {
      const theNumber = Number(firstInput)
      if (theNumber < 1 || theNumber > solutions.GetSolutions().length) {
        continue
      }

      // if they chose a number, go to that number
      const solution = solutions.GetSolutions()[theNumber - 1]
      if (solution != null) {
        SolutionView(solution, solutions, [...titlePath])
      }
    }
  }
}
