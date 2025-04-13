import { existsSync, readFileSync } from 'fs'
import { VisibleThingsMap } from './VisibleThingsMap'
import { parse } from 'jsonc-parser'
import { DialogFile } from './talk/DialogFile'
import { Piece } from './Piece'
import { _STARTER_JSONC } from '../_STARTER_JSONC'

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.jsonc file
 * so that's in there too.
 */
export class Box {
  public static GetArrayOfSingleObjectVerbs (): string[] {
    return ['grab', 'toggle']
  }

  public static GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return [true, true]
  }

  private readonly allPlayers: string[]
  private readonly mapOfStartingThings: VisibleThingsMap

  private readonly filename: string

  constructor(filename: string) {
    this.filename = filename

    this.allPlayers = []
    this.mapOfStartingThings = new VisibleThingsMap(null)

    if (filename.length !== 0) {
      if (!existsSync(filename)) {
        throw new Error(
          `file doesn't exist ${process.cwd()} ${filename}`
        )
      }
      const text = readFileSync(filename, 'utf8')
      const scenario = parse(text)


      const setPlayers = new Set<string>()
      /* starting things is optional in the json */
      if (
        scenario.startingThingsLinkedToPlayers !== undefined &&
        scenario.startingThingsLinkedToPlayers !== null
      ) {
        for (const thing of scenario.startingThingsLinkedToPlayers) {
          if (thing.character !== undefined && thing.character !== null) {
            setPlayers.add(thing.character)
          }
        }
      }

      /* starting things is optional in the json */
      if (
        scenario.startingThingsLinkedToPlayers !== undefined &&
        scenario.startingThingsLinkedToPlayers !== null
      ) {
        for (const item of scenario.startingThingsLinkedToPlayers) {
          if (!this.mapOfStartingThings.Has(item.thing)) {
            this.mapOfStartingThings.Set(item.thing, new Set<string>())
          }
          if (item.character !== undefined && item.character !== null) {
            const { character } = item
            const setOfCharacters = this.mapOfStartingThings.Get(item.thing)
            if (character.length > 0 && setOfCharacters != null) {
              setOfCharacters.add(character)
            }
          }
        }
      }

      setPlayers.delete('undefined')
    }
  }

  public CopyStartingThingCharsToGivenMap (givenMap: VisibleThingsMap): void {
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      givenMap.Set(item[0], item[1])
    }
  }
  public GetArrayOfSingleObjectVerbs (): string[] {
    return this.GetArrayOfSingleObjectVerbs()
  }

  public GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs()
  }

  public GetMapOfAllStartingThings (): VisibleThingsMap {
    return this.mapOfStartingThings
  }

  public GetArrayOfPlayers (): string[] {
    return this.allPlayers
  }

  public GetFilename (): string {
    return this.filename
  }

  public static CopyPiecesFromAtoBViaIds (a: Map<string, Set<Piece>>, b: Map<string, Piece>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        const newPiece = piece.ClonePieceAndEntireTree()
        b.set(piece.id, newPiece)
      })
    })
  }

  public static CopyPiecesFromAtoB (a: Map<string, Set<Piece>>, b: Map<string, Set<Piece>>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (!b.has(piece.output)) {
          b.set(piece.output, new Set<Piece>())
        }
        const newPiece = piece.ClonePieceAndEntireTree()
        b.get(piece.output)?.add(newPiece)
      })
    })
  }

  public static CopyDialogsFromAtoB (a: Map<string, DialogFile>, b: Map<string, DialogFile>): void {
    for (const dialog of a.values()) {
      b.set(dialog.GetName(), dialog)
    }
  }

  public GetStartingThingsForPlayer (charName: string): Set<string> {
    const startingThingSet = new Set<string>()
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      for (const name of item[1]) {
        if (name === charName) {
          startingThingSet.add(item[0])
          break
        }
      }
    }
    return startingThingSet
  }

  public GetFileNameWithoutExtension (): string {
    let withoutExtension = this.filename
    const lastIndexOfDot = this.filename.lastIndexOf('.')
    if (lastIndexOfDot !== -1) {
      withoutExtension = this.filename.substring(0, lastIndexOfDot)
    }
    return withoutExtension
  }
}
