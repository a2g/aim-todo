import promptSync from 'prompt-sync'
import { Solutions } from './puzzle/aim/Solutions'
import { $AimTodo, getJsonOfAimTodo } from './api/getJsonOfAimTrees'
import { LogGainsFromEachDialog } from './cli/LogGainsFromEachDialog'
import { ViewBackwardSolve } from './cli/views/ViewBackwardSolve'
import { EnumRecreator } from './cli/EnumRecreator'

const prompt = promptSync()

function main (): void {
  const aimTrees: $AimTodo[] = getJsonOfAimTodo()

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
          LogGainsFromEachDialog(aimTree.folder)

          const solutions = new Solutions(aimTree.file, aimTree.folder)

          for (; ;) {
            console.warn(`\nSubMenu of ${aimTree.folder}/${aimTree.file}`)
            console.warn(
              `number of solutions = ${solutions._solutions.size}`
            )
            console.warn('---------------------------------------')
            console.warn('1. Solve using aims')
            console.warn('2. Recreate a_all with all keys and values')
         
      

            const choice = prompt('Choose an option (b)ack: ').toLowerCase()
            if (choice === 'b') {
              break
            }
            switch (choice) {
              case '1':
                ViewBackwardSolve(solutions)
                break
              case '2':
                {
                  const enumRecreator = new EnumRecreator(aimTree.folder)
                  enumRecreator.WriteEnumFiles()
                }
                break
              case '3':

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
