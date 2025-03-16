import { IdPrefixes } from '../../IdPrefixes'
import { AddBrackets } from './AddBrackets'
import { FormatText } from './FormatText'
import { Raw } from './Raw'

export class RawObjectsAndVerb {
  public type: Raw
  public objectA: string
  public objectB: string
  public output: string
  public startingCharacterForA: string
  public startingCharacterForB: string
  public prerequisites: string[]
  public typeJustForDebugging: string
  public achievementSpiel: string
  public mainSpiel: string
  public restrictionSpiel: string
  public speechLines: string[][]
  // other ideas for debugging fields to add
  // - the box the command came out of
  // - the id of the command

  constructor(

  ) {
    this.type = Raw.Use
    this.objectA = ''
    this.objectB = ''
    this.output = ''
    this.startingCharacterForA = ''
    this.startingCharacterForB = ''
    this.prerequisites = []
    this.mainSpiel = ''
    this.achievementSpiel = ''
    this.restrictionSpiel = ''
    this.typeJustForDebugging = ''
    this.speechLines = []
  }

  public PopulateSpielFields (isColor = true): void {
    const verb = FormatText(this.type, isColor)
    const output = FormatText(this.output)
    const objectA =
      FormatText(this.objectA, isColor) +
      FormatText(this.startingCharacterForA, isColor, true)
    if (this.objectB === undefined) {
      this.dumpRaw()
    }
    const objectB =
      FormatText(this.objectB, isColor) +
      FormatText(this.startingCharacterForB, isColor, true)

    this.restrictionSpiel =
      this.prerequisites.length > 0
        ? AddBrackets(FormatText(this.prerequisites, isColor))
        : ''

    let joiner = ' '
    switch (this.type) {
      case Raw.Use:
        joiner = ' with '
        break
      case Raw.Toggle:
        joiner = ' to '
        break
      case Raw.Auto:
        if (this.objectB.startsWith(IdPrefixes.Inv)) {
          this.mainSpiel = `You obtain a ${objectB}`
          this.achievementSpiel = `as a result of achievement ${objectA}`
        } else if (this.objectB.startsWith(IdPrefixes.Obj)) {
          this.mainSpiel = `You now see a ${objectB}`
          this.achievementSpiel = `as a result of achievement ${objectA}`
        } else if (this.objectB.startsWith(IdPrefixes.Dialog)) {
          this.mainSpiel = `You now see a dialogty ${objectB}`
          this.achievementSpiel = `as a result of achievement ${objectA}`
        } else if (this.objectB.startsWith(IdPrefixes.Aim)) {
          this.type = Raw.Achievement
          this.mainSpiel = `Achievement unlocked ${objectB}`
          this.achievementSpiel = `as a result of achievement ${objectA}`
        } else {
          this.mainSpiel = `${objectB} generically appears.... `
        }
        return
    }
    this.mainSpiel = verb + ' ' + objectA + joiner + objectB + ' results in ' + output + ' '
  }

  public appendStartingCharacterForA (startingCharacterForA: string): void {
    if (this.startingCharacterForA.length > 0) {
      this.startingCharacterForA += ', ' + startingCharacterForA
    } else {
      this.startingCharacterForA = startingCharacterForA
    }
  }

  public appendStartingCharacterForB (startingCharacterForB: string): void {
    if (this.startingCharacterForB.length > 0) {
      this.startingCharacterForB += ', ' + startingCharacterForB
    } else {
      this.startingCharacterForB = startingCharacterForB
    }
  }

  public dumpRaw (): void {
    console.warn('Dumping instance of RawObjectsAndVerb')
    console.warn(Raw[this.type])
    console.warn(this.objectA)
    console.warn(this.objectB)
  }

  public isAAchievementOrAuto (): boolean {
    return this.type === Raw.Achievement || this.type === Raw.Auto
  }
}
