import promptSync from 'prompt-sync'
import { Solutions } from './puzzle/aim/Solutions'
import { $IAimTree, getJsonOfAimTrees } from './api/getJsonOfAimTrees'
import { DumpGainsFromEachDialogInFolder } from './cli/DumpGansFromEachTalkInFolder'

const prompt = promptSync()

function main (): void {
  const aimTrees: $IAimTree[] = getJsonOfAimTrees()

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
          DumpGainsFromEachDialogInFolder(aimTree.folder)

          const solutions = new Solutions(aimTree.folder, aimTree.file)

          for (; ;) {
            console.warn(`\nSubMenu of ${aimTree.folder}/${aimTree.file}`)
            console.warn(
              `number of solutions = ${solutions._solutions.size}`
            )
            console.warn('---------------------------------------')
            console.warn('1. Solve using aims')
            console.warn('2. Validate forward a box-at-a-time')
            console.warn('3. Pieces in Boxes.')
            console.warn('4. Leaves all boxes at once.')
            console.warn('5. Leaves a box-at-a-time`')
            console.warn('6. Order of Commands in solve')
            console.warn('7. Choose climb into piece-trees (old)')
            console.warn('8. Play')

            const choice = prompt('Choose an option (b)ack: ').toLowerCase()
            if (choice === 'b') {
              break
            }
            switch (choice) {
              case '1':
                // ViewBackwardSolve(solutions)
                break
              case '2':

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
