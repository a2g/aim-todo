import { existsSync } from 'fs'
import { join } from 'path'
import { _STARTER_JSONC } from '../common/_STARTER_JSONC'
import { Solutions } from '../common/aim/Solutions'
import { FormatText } from '../common/puzzle/FormatText'
import { Validators } from '../common/aim/Validators'

export function getJsonOfAllSolutions (
  dirName: string,
  repo: string,
  world: string,
  area: string
): Record<string, unknown> {
  const path = join(dirName, `../../../../${repo}/${world}/${area}/`)

  const firstBoxFilename = _STARTER_JSONC

  if (!existsSync(path + firstBoxFilename)) {
    throw Error(`file doesn't exist ${path}${firstBoxFilename}`)
  }

  const workings = new Solutions(path, firstBoxFilename)
  const solutions = new Validators(workings)

  // display list
  let incomplete = 0
  let listItemNumber = 0
  for (const solution of solutions.GetValidators()) {
    console.warn(FormatText(solution.GetName()))
    //console.warn(FormatText(solution.GetAimTreeMap().CalculateListOfKeys()))
    for (const item of solution.GetAimTreeMap().GetAims()) {
      listItemNumber++

      // display list item
      const output = item.GetAimName()
      console.warn(`    ${listItemNumber}. ${output} )`)
      incomplete += item.IsSolved() ? 0 : 1
    }
  }

  console.warn(`Number of achievements incomplete ${incomplete}/${listItemNumber}`)

  const json = getJsonOfSolutionsFromSolver(solutions)
  return json
}

function getJsonOfSolutionsFromSolver (
  _solutions: Validators
): Record<string, unknown> {
  return {
    name: 'Solutions',
    children: null
  }
}
