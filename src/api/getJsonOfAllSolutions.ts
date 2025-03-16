import { existsSync } from 'fs'
import { FormatText } from '../puzzle/FormatText'
import { join } from 'path'
import { _STARTER_JSONC } from '../_STARTER_JSONC'
import { Solutions } from '../puzzle/aim/Solutions'

export function getJsonOfAllSolutions (
  repo: string,
  world: string,
  area: string
): Record<string, unknown> {
  const path = join(__dirname, `../../../../${repo}/${world}/${area}/`)

  const firstBoxFilename = _STARTER_JSONC

  if (!existsSync(path + firstBoxFilename)) {
    throw Error(`file doesn't exist ${path}${firstBoxFilename}`)
  }

  const solutions = new Solutions(path, firstBoxFilename)

  // for (let i = 0; i < 200; i++) {
  //   solutions.SolvePartiallyUntilCloning()
  //   solutions.UpdateSolvedStatuses()
  // }

  // display list
  let incomplete = 0
  let listItemNumber = 0
  for (const solution of solutions.GetSolutions()) {
    console.warn(FormatText(solution.GetSolvingPath()))
    //console.warn(FormatText(solution.GetAimTreeMap().CalculateListOfKeys()))
    for (const item of solution.GetAimTreeMap().GetAims()) {
      listItemNumber++

      // display list item
      const output = item.GetTheRootWord()
      console.warn(`    ${listItemNumber}. ${output} )`)
      incomplete += item.IsSolved() ? 0 : 1
    }
  }

  console.warn(`Number of achievements incomplete ${incomplete}/${listItemNumber}`)

  const json = getJsonOfSolutionsFromSolver(solutions)
  return json
}

function getJsonOfSolutionsFromSolver (
  _solutions: Solutions
): Record<string, unknown> {
  return {
    name: 'Solutions',
    children: null
  }
}
