import { RawObjectsAndVerb } from '../RawObjectsAndVerb'

import { Solved } from '../Solved'
import { Validated } from '../Validated'
import { VisibleThingsMap } from '../VisibleThingsMap'

/**
 * #### So this is NOT a piece, its just the thing that pieces attach to.
 * BUT it inherits from PieceBase, so it can participate in this hierarchical
 * operation where a piece removes itself from the piece's parent. And since
 * this AchievementStub is a pieces parent, it needs to derive form that class.
 *
 * Some parents have multiple children, so the PieceBAse has provision for this
 * but this AchievementStub can only ever have a single one. So we have these getters
 * and setters for GetTheAchievementWord, and GetThePiece - that make the code easier to
 * read because they reinforce that this only has one of those.
 *
 * This has solved and validated flags because this thing gets a tree added to it,
 * until it is solved, and additionally if all the pieces can be removed then
 * its validated. So zero pieces could be - initial state, or solved and validated.
 * And half a tree could be solved, and half validated Or have solved. So to make
 * it clear we have these flags.
 *
 * This is also where command steps that pertain to event are kept. Once we have
 * validated an order of achievement solving, then the most single minded way to do it
 * would be to do the steps required of ament1, then the steps required of achievement2.
 * The solution could be thousands of permutations that adhere to this,
 * but its handy to have a predictable deterministic solution - at least as a
 * starting point, before optimizations.
 */
export class AimFileHeader {
  private readonly commandsCompletedInOrder: RawObjectsAndVerb[]
  private isSolved: Solved = Solved.Not
  private isNeeded: boolean
  private isValidated: Validated = Validated.Not
  private theAny: any
  private originalNodeCount = 0
  private nodeCount = 0
  private readonly thingsToRevealWhenAimIsMet: VisibleThingsMap
  private fileWithoutExtension: string
  constructor(fileWithoutExtension: string, rootProperty: any, visibleThingsMap: VisibleThingsMap, commandsCompletedInOrder: RawObjectsAndVerb[], isNeeded = false, solved = Solved.Not) {
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

  public GetOrderedCommands (): RawObjectsAndVerb[] {
    // I would like to return a read only array here.
    // I can't do that, so instead, I will clone.
    // The best way to clone in is using 'map'
    return this.commandsCompletedInOrder.map((x) => x)
  }

  public AddCommand (rawObjectsAndVerb: RawObjectsAndVerb): void {
    this.commandsCompletedInOrder.push(rawObjectsAndVerb)
  }

  /*
  public ProcessStubUntilCloning (solution: Evolution, solutions: Evolutions, path: string): boolean {
    // if the achievement piece is already found, we drill into it
    if (this.inputs[0] != null) {
      return this.inputs[0].ProcessUntilCloning(solution, solutions, path + this.inputHints[0] + '/')
    }
  
    // else we find the achievement from piece
    return ProcessAndReturnTrueIfCloneOccurs(this, 0, '', solution, solutions)
  }*/

  public Clone (): AimFileHeader {
    const theAny = this._CloneObject(this.GetTheAny())
    const thingsMap = new VisibleThingsMap(this.thingsToRevealWhenAimIsMet)
    const clone = new AimFileHeader(this.fileWithoutExtension, theAny, thingsMap, this.commandsCompletedInOrder)
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
      toReturn[key] = new AimFileHeader(this.fileWithoutExtension, clonedRoot, visibleThingsMap, this.commandsCompletedInOrder)
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