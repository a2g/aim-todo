import { Meta } from './Meta'
import { StepType } from './StepType'

export class Step {
  public stepType: StepType
  public metaType: Meta.Type
  public metaSpeechLine: string
  public objectA: string
  public objectB: string
  public output: string
  public prerequisites: string[]
  public restrictionSpiel: string
  private childTuples: [string, string][]

  constructor(
    source: StepType
  ) {
    this.stepType = source
    this.metaType = Meta.Type.Toggle
    this.metaSpeechLine = ""
    this.objectA = ''
    this.objectB = ''
    this.output = ''
    this.prerequisites = []
    this.restrictionSpiel = ''
    this.childTuples = []
  }

  public dumpRaw (): void {
    console.warn('Dumping instance of Step')
    console.warn(StepType[this.stepType])
    console.warn(this.objectA)
    console.warn(this.objectB)
  }

  public isAAchievementOrAuto (): boolean {
    return this.stepType === StepType.Achievement || this.stepType === StepType.Auto
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

  public GetChildTuples (): Array<[string, string]> {
    return this.childTuples
  }

}
