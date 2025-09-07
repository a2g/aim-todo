import promptSync from 'prompt-sync'
import { $AimTodo, getJsonOfAllTodoTrees } from '../api/getJsonOfAllTodoTrees'
import { TodoTreeWorkspaces } from '../common/aim/TodoTreeWorkspaces'
import { Validators } from '../common/aim/Validators'
//import { LogGainsFromEachDialog } from './log/LogGainsFromEachDialog'
import { EnumReCreator } from './re-creator/EnumReCreator'
import { ViewBackwardSolve } from './views/ViewBackwardSolve'
import { ViewForwardValidate } from './views/ViewForwardValidate'


const prompt = promptSync()

function main (): void {
  const aimTrees: $AimTodo[] = getJsonOfAllTodoTrees()

  for (; ;) {
    for (let i = 1; i <= aimTrees.length; i++) {
      const aimTree = aimTrees[i - 1]
      console.warn(`${i}. ${aimTree.world} ${aimTree.area}  ${i}`)
    }

    const indexAsString = prompt(
      'Choose an area to Load (b)ail): '
    ).toLowerCase()
    const index = Number(indexAsString) - 1
    switch (indexAsString) {
      case 'b':
        return
      default:
        if (index >= 0 && index < aimTrees.length) {
          const aimTree = aimTrees[index]
          //LogGainsFromEachDialog(aimTree.folder)

          const workspaces = new TodoTreeWorkspaces(aimTree.folder)
          const validators = new Validators(workspaces)

          for (; ;) {
            console.warn(`\nSubMenu of ${aimTree.folder}/${aimTree.file}`)
            console.warn(
              `number of solutions = ${workspaces.GetCount()}`
            )
            console.warn('---------------------------------------')
            console.warn('1. Delete a_aims - t_types ')
            console.warn('2. Recreate a_aims - t_types ')
            console.warn('3. Solve using aims')
            console.warn('4. Validate, starting from _starter.jsonc')

            const choice = prompt('Choose an option (b)ack: ').toLowerCase()
            if (choice === 'b') {
              break
            }
            switch (choice) {
              case '1':
                {
                  const enumReCreator = new EnumReCreator(aimTree.folder)
                  enumReCreator.DeleteFiles()
                }
                break
              case '2':
                {
                  const enumReCreator = new EnumReCreator(aimTree.folder)
                  enumReCreator.WriteEnumFiles()
                }
                break
              case '3':
                ViewBackwardSolve(workspaces)
                break
              case '4':
                ViewForwardValidate(validators)
                break
              case '4':

                break
              case '5':

                break
              case '6':

                break
              default:
            }
          }
        }
    }
  }
}

main()
