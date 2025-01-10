import promptSync from 'prompt-sync'
import { GetThreeStringsFromInput } from './GetThreeStringsFromInput'
import { Happener } from './Happener'
import { IHappenerCallbacks } from './IHappenerCallbacks'
import { LogicGrid } from './LogicGrid'
const prompt = promptSync()

// const result = prompt(message);

// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs objs table, and inv vs inv table, and a verb vs objs table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs objs ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 4. Check the verbs vs objs ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 5. Ensure there is no OBJS VS OBJS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a logic grid per location...which is easy - and doable.hmmn.
//
// May 2021, regarding point number 4... Some puzzles are just like that, eg use hanging cable in powerpoint.
// // even in maniac mansion it was like use radtion suit with meteot etc.
//

export class PlayerAI implements IHappenerCallbacks {
  public invVsInv: LogicGrid
  public invVsVerb: LogicGrid
  public invVsProp: LogicGrid
  public objVsVerb: LogicGrid
  public objVsProp: LogicGrid
  public game: Happener
  public autoCount: number

  constructor (game: Happener, numberOfAutopilotTurns: number) {
    this.game = game
    this.autoCount = numberOfAutopilotTurns
    const verbs = game.GetVerbsExcludingUse()
    const invs = game.GetEntireInvSuite()
    const objs = game.GetEntirePropSuite()

    this.invVsInv = new LogicGrid(invs, invs)
    this.invVsVerb = new LogicGrid(invs, verbs)
    this.invVsProp = new LogicGrid(invs, objs)
    this.objVsVerb = new LogicGrid(objs, verbs)
    this.objVsProp = new LogicGrid(objs, objs)
    // this.game.SubscribeToCallbacks(this);

    // since use same with same is illegal move, we block these out
    for (let i = 0; i < invs.length; i += 1) {
      // classic forloop useful because shared index
      this.invVsInv.SetColumnRow(i, i)
    }
    // since use same with same is illegal move, we block these out
    for (let i = 0; i < objs.length; i += 1) {
      // classic forloop useful because shared index
      this.objVsProp.SetColumnRow(i, i)
    }
  }

  public GetNextCommand (): string[] {
    for (;;) {
      if (this.autoCount > 0) {
        this.autoCount -= 1

        // 1. Check the invs vs invs ? this is the lowest hanging fruit
        const useInvOnInv = this.invVsInv.GetNextGuess()
        if (useInvOnInv[0] !== -1) {
          this.invVsInv.SetColumnRow(useInvOnInv[0], useInvOnInv[1])
          this.invVsInv.SetColumnRow(useInvOnInv[1], useInvOnInv[0])
          return [
            'use',
            this.game.GetInv(useInvOnInv[0]),
            this.game.GetInv(useInvOnInv[1])
          ]
        }
        // 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
        const invVsVerb = this.invVsVerb.GetNextGuess()
        if (invVsVerb[0] !== -1) {
          this.invVsVerb.SetColumnRow(invVsVerb[0], invVsVerb[1])
          return [
            this.game.GetVerb(invVsVerb[1]),
            this.game.GetInv(invVsVerb[0]),
            ''
          ]
        }
        // 3. Check the invs vs objs ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
        const useInvOnProp = this.invVsInv.GetNextGuess()
        if (useInvOnProp[0] !== -1) {
          this.invVsInv.SetColumnRow(useInvOnProp[0], useInvOnProp[1])
          this.invVsInv.SetColumnRow(useInvOnProp[1], useInvOnProp[0])
          return [
            'use',
            this.game.GetInv(useInvOnProp[0]),
            this.game.GetProp(useInvOnProp[1])
          ]
        }
        // 4. Check the verbs vs objs ? this is the fourth lowest hanging truit - if find something, then go to 1.
        const objVsVerb = this.objVsVerb.GetNextGuess()
        if (objVsVerb[0] !== -1) {
          this.objVsVerb.SetColumnRow(objVsVerb[0], objVsVerb[1])
          return [
            this.game.GetVerb(objVsVerb[1]),
            this.game.GetProp(objVsVerb[0]),
            ''
          ]
        }
        // 5. Ensure there is no OBJS VS OBJS because:
        const usePropOnProp = this.objVsProp.GetNextGuess()
        if (usePropOnProp[0] !== -1) {
          this.objVsProp.SetColumnRow(usePropOnProp[0], usePropOnProp[1])
          this.objVsProp.SetColumnRow(usePropOnProp[1], usePropOnProp[0])
          return [
            'use',
            this.game.GetProp(usePropOnProp[0]),
            this.game.GetProp(usePropOnProp[1])
          ]
        }
      } else {
        const input = prompt(
          'Enter a command with two or three terms (b)ack: '
        )
        if (input !== null) {
          if (input === 'b') {
            return ['b']
          }
          const items: string[] = GetThreeStringsFromInput(input)

          if (
            items.length === 2 &&
            items[0].toUpperCase() === 'DO' &&
            Number(items[1]) > 0
          ) {
            this.autoCount = Number(items[1])
            console.warn(
              `Auto count has been given ${this.autoCount} operations.`
            )
          } else if (items.length !== 3) {
            console.warn(`Please enter 3 words (not ${items.length} )`)
          } else {
            return items
          }
        } else {
          console.warn('At least enter something')
        }
      }
    }
  }

  public OnInvVisbilityChange (
    theNumber: number,
    newValue: boolean,
    nameForDebugging: string
  ): void {
    // the convention for the array is x then y, or column then row.
    // so Set..Column sets the first t
    this.invVsVerb.SetVisibilityOfColumn(theNumber, newValue, nameForDebugging)
    this.invVsProp.SetVisibilityOfColumn(theNumber, newValue, nameForDebugging)
    this.invVsInv.SetVisibilityOfRow(theNumber, newValue, nameForDebugging)
    this.invVsInv.SetVisibilityOfColumn(theNumber, newValue, nameForDebugging)
  }

  public OnPropVisbilityChange (
    theNumber: number,
    newValue: boolean,
    nameForDebugging: string
  ): void {
    // the convention for the array is x then y, or column then row.
    // so Set..Column sets the first t
    this.objVsVerb.SetVisibilityOfColumn(
      theNumber,
      newValue,
      nameForDebugging
    )
    this.invVsProp.SetVisibilityOfRow(theNumber, newValue, nameForDebugging)
    this.objVsProp.SetVisibilityOfRow(theNumber, newValue, nameForDebugging)
    this.objVsProp.SetVisibilityOfColumn(
      theNumber,
      newValue,
      nameForDebugging
    )
  }

  public OnAchievementValueChange (
    theNumber: number,
    newValue: number,
    nameForDebugging: string
  ): void {
    // the convention for the array is x then y, or column then row.
    // so Set..Column sets the first t
    this.objVsVerb.SetVisibilityOfColumn(
      theNumber,
      newValue > 0,
      nameForDebugging
    )
    this.invVsProp.SetVisibilityOfRow(
      theNumber,
      newValue > 0,
      nameForDebugging
    )
    this.objVsProp.SetVisibilityOfRow(
      theNumber,
      newValue > 0,
      nameForDebugging
    )
    this.objVsProp.SetVisibilityOfColumn(
      theNumber,
      newValue > 0,
      nameForDebugging
    )
  }
}
