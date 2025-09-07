import { Meta } from './Meta'
import { Raw } from './Raw'

export class RawObjectsAndVerb {
  public typeAnnotation: Meta.Type
  public talkAnnotation: String
  public source: Raw
  public objectA: string
  public objectB: string
  public output: string
  public startingCharacterForA: string
  public startingCharacterForB: string
  public prerequisites: string[]
  public typeJustForDebugging: string
  public restrictionSpiel: string
  private childTuples: [string, string][]
  // other ideas for debugging fields to add
  // - the box the command came out of
  // - the id of the command

  constructor(
    source: Raw
  ) {
    this.source = source
    this.typeAnnotation = Meta.Type.Toggle
    this.talkAnnotation = ""
    this.objectA = ''
    this.objectB = ''
    this.output = ''
    this.startingCharacterForA = ''
    this.startingCharacterForB = ''
    this.prerequisites = []
    this.restrictionSpiel = ''
    this.typeJustForDebugging = ''
    this.childTuples = []
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
    console.warn(Raw[this.source])
    console.warn(this.objectA)
    console.warn(this.objectB)
  }

  public isAAchievementOrAuto (): boolean {
    return this.source === Raw.Achievement || this.source === Raw.Auto
  }

  public getChildTuple (index: number): [string, string] {
    return this.childTuples[index]
  }

  public addChildTuple (child: [string, string]) {
    this.childTuples.push(child)
  }

  public getChildTupleLength (): number {
    return this.childTuples.length
  }

}
