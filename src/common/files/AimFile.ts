import { Step } from "../stuff/Step"
import { Solved } from "../solving/Solved"
import { Validated } from "../solving/Validated"
import { VisibleThingsMap } from "../stuff/VisibleThingsMap"


/**
*
*
* */
export class AimFile {
  private readonly commandsCompletedInOrder: Step[]
  private isSolved: Solved = Solved.Not
  private isNeeded: boolean
  private isValidated: Validated = Validated.Not
  private theAny: any
  private originalNodeCount = 0
  private nodeCount = 0
  private readonly thingsToRevealWhenAimIsMet: VisibleThingsMap
  private fileWithoutExtension: string
  constructor(fileWithoutExtension: string, rootProperty: any, visibleThingsMap: VisibleThingsMap, commandsCompletedInOrder: Step[], isNeeded = false, solved = Solved.Not) {
    this.isSolved = solved
    this.isNeeded = isNeeded
    this.theAny = rootProperty
    this.thingsToRevealWhenAimIsMet = visibleThingsMap
    this.originalNodeCount = this.GetCountAfterUpdating()
    this.fileWithoutExtension = fileWithoutExtension

    // this clones the commandsCompletedInOrder
    this.commandsCompletedInOrder = []
    if (commandsCompletedInOrder != null) {
      for (const command of commandsCompletedInOrder) {
        this.commandsCompletedInOrder.push(command)
      }
    }

  }

  public GetTheAny (): any {
    return this.theAny
  }

  public GetAimName (): string {
    return this.fileWithoutExtension
  }

  public SetValidated (validated: Validated): void {
    this.isValidated = validated
  }

  public SetSolved (solved: Solved): void {
    this.isSolved = solved
  }

  public IsSolved (): boolean {
    return this.isSolved !== Solved.Not
  }

  public IsNeeded (): boolean {
    return this.isNeeded
  }

  public SetNeeded (): void {
    this.isNeeded = true
  }

  public GetValidated (): Validated {
    return this.isValidated
  }

  public GetSolved (): Solved {
    return this.isSolved
  }

  public GetOrderedCommands (): Step[] {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The best way to clone in is using 'map'
    return this.commandsCompletedInOrder.map((x) => x)
  }

  public AddCommand (rawObjectsAndVerb: Step): void {
    this.commandsCompletedInOrder.push(rawObjectsAndVerb)
  }

  public Clone (): AimFile {
    const theAny = this._CloneObject(this.GetTheAny())
    const thingsMap = new VisibleThingsMap(this.thingsToRevealWhenAimIsMet)
    const clone = new AimFile(this.fileWithoutExtension, theAny, thingsMap, this.commandsCompletedInOrder)
    return clone
  }

  _CloneObject (thisObject: any): any {
    if (typeof thisObject === 'string') {
      return new String(thisObject)
    }
    const toReturn: any = {}
    for (const key in thisObject) {
      const clonedRoot = this._CloneObject(thisObject[key])
      const visibleThingsMap = new VisibleThingsMap(this.thingsToRevealWhenAimIsMet)
      toReturn[key] = new AimFile(this.fileWithoutExtension, clonedRoot, visibleThingsMap, this.commandsCompletedInOrder)
    }
    return toReturn
  }

  public GetOriginalNodeCount (): number {
    return this.originalNodeCount
  }

  public GetCountAfterUpdating (): number {
    this.nodeCount = 0
    this.UpdateNodeCountRecursively(this.theAny)
    return this.nodeCount
  }

  private UpdateNodeCountRecursively (thisObject: any) {
    this.nodeCount += 1
    for (const key in thisObject) {
      if (key !== "@") {
        this.UpdateNodeCountRecursively(thisObject[key])
      }
    }
  }

  GetThingsToRevealWhenAimIsMet (): VisibleThingsMap {
    return this.thingsToRevealWhenAimIsMet;
  }

}