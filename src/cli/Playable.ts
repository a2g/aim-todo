import { Happener } from '../puzzle/Happener'
import { PlayerAI } from '../puzzle/PlayerAI'
import { Evolution } from '../puzzle/Evolution'

export class Playable {
  private readonly player: PlayerAI

  private readonly solution: Evolution

  private readonly happener: Happener

  private isCompleted: boolean

  constructor (player: PlayerAI, happener: Happener, solution: Evolution) {
    this.player = player
    this.solution = solution
    this.happener = happener
    this.isCompleted = false
  }

  public GetPlayer (): PlayerAI {
    return this.player
  }

  public GetSolution (): Evolution {
    return this.solution
  }

  public GetHappener (): Happener {
    return this.happener
  }

  public SetCompleted (): void {
    this.isCompleted = true
  }

  public IsCompleted (): boolean {
    return this.isCompleted
  }
}
