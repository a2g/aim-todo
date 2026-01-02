import { existsSync } from 'fs'
import { join } from 'path'
import { TodoTreeWorkspaces as TodoListWorkspace } from '../common/solving/TodoTreeWorkspaces'
import { FormatText } from '../common/stuff/FormatText'
import { Solutions } from '../common/solving/Solutions'
import { _TODO_TREE_JSONC } from '../common/_TODO_TREE_JSONC'
import { Solution } from '../common/solving/Solution'
import { GetMainSpiel } from './GetMainSpiel'
import { GetChildrenAsJsonArray } from './GetChildrenAsJsonArray'

interface $INameIsAAchievementChildren {
  name: string
  isAAchievementOrAuto: boolean
  children: Array<[string, string]>
}

export function getJsonOfAllSolutions (
  dirName: string,
  repo: string,
  world: string,
  area: string
): Record<string, unknown> {
  const path = join(dirName, `../../../../${repo}/${world}/${area}/`)

  const file = _TODO_TREE_JSONC

  if (!existsSync(path + file)) {
    throw Error(`file doesn't exist ${path}${file}`)
  }

  const workings = new TodoListWorkspace(path)
  const solutions = new Solutions(workings)

  // display list
  let incomplete = 0
  let listItemNumber = 0
  for (const solution of solutions.GetSolutions()) {
    console.warn(FormatText(solution.GetName()))
    //console.warn(FormatText(solution.GetAimFiles().CalculateListOfKeys()))
    for (const item of solution.GetAimFiles().GetAimFiles()) {
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
  _solutions: Solutions
): Record<string, unknown> {
  const jsonOfSolutions = getJsonArrayOfSolutions(_solutions.GetSolutions())

  return {
    name: 'Solutions',
    children: jsonOfSolutions,
  }
}

function getJsonArrayOfSolutions (
  solutions: Solution[]
): $INameIsAAchievementChildren[] {
  const toReturn = new Array<$INameIsAAchievementChildren>()
  for (const solution of solutions) {
    for (let i = 0; i < 200; i++) {
      solution.DeconstructAllAchievementsAndRecordSteps()
    }
    toReturn.push({
      name: `Solution ${solution.GetName()}`,
      isAAchievementOrAuto: false,
      children: getOrderedCommands(solution, {})
    })
  }

  return toReturn
}

function getOrderedCommands (
  solution: Solution, settings: Settings
): any[] {
  const toReturn = new Array<$INameIsAAchievementChildren>()
  const commands = solution.GetOrderOfCommands()
  for (const command of commands) {
    if (settings.compressChildren) {
      toReturn.push({
        name: GetMainSpiel(command, settings),
        isAAchievementOrAuto: true,
        children: GetChildrenAsJsonArray(command)
      })
    } else {
      toReturn.push({
        name: GetMainSpiel(command, settings),
        isAAchievementOrAuto: true,
        children: []
      })
      for (let i = 0; i < command.getChildTupleLength(); i++) {
        const speechLine = command.getChildTuple(i)
        toReturn.push({
          name: `${speechLine[0]}: ${speechLine[1]}`,
          isAAchievementOrAuto: true,
          children: []
        })
      }
    }
  }
  return toReturn
}
