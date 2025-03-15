import promptSync from 'prompt-sync'
import { Solutions } from '../../puzzle/aim/Solutions'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
const prompt = promptSync({})

export function ViewBackwardSolve (solutions: Solutions): void {
  const titlePath = ['Backwards Solve']
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const numberOfSolutions: number = solutions._solutions.size
    // solutions.GenerateSolutionNamesAndPush()
    console.warn(`Number of solutions = ${numberOfSolutions} , Legend: (a, b)= (unsolvedCount, total)`)
    if (solutions._solutions.size > 1) {
      console.warn('    0. All solutions')
    }

    const solutionArray = Array.from(solutions._solutions.values())
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
