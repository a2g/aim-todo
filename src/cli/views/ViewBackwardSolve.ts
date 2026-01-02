import promptSync from 'prompt-sync'
import { TodoTreeWorkspaces } from '../../common/aim/TodoTreeWorkspaces'
import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'
const prompt = promptSync({})

export function ViewBackwardSolve (solutions: TodoTreeWorkspaces): void {
  const titlePath = ['Backwards Solve']
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const numberOfSolutions: number = solutions.workspaces.size
    // solutions.GenerateSolutionNamesAndPush()
    console.warn(`Number of solutions = ${numberOfSolutions} , Legend: (a, b)= (unsolvedCount, total)`)
    if (solutions.workspaces.size > 1) {
      console.warn('    0. All solutions')
    }

    const solutionArray = Array.from(solutions.workspaces.values())
    for (let i = 0; i < solutionArray.length; i++) {
      const solution = solutionArray[i]
      console.warn(`    ${i + 1}. ${solution.GetSolvingPath()}`)
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
  }
}
