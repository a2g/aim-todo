import promptSync from 'prompt-sync'
import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'

const prompt = promptSync({ sigint: true })

export function ViewLeavesOfHeader (leaves: string[], titlePath: string[]
): void {
  titlePath.push('Leaves-of-Header')

  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    let listItemNumber = 0

    if (leaves.length !== 0) {
      for (const leaf of leaves) {
        listItemNumber++
        console.warn(`${listItemNumber}. ${leaf}`)
      }
    } else {
      console.warn('zero leaves - all leaves are solved')
    }

    // allow user to choose item
    const input2 = prompt('Cant do much here - (b)ack').toLowerCase()
    if (input2 === null || input2 === 'b') {
      return
    } else {
      // show map entry for chosen item
      const theNumber2 = Number(input2)
      if (theNumber2 >= 1 && theNumber2 <= 9) {
      }
    }
  }
}
