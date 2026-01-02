import { VisibleThingsMap } from "../stuff/VisibleThingsMap"




export function GetStartingThingsFromRawJson (json: any): VisibleThingsMap {
  const thingsToRevealWhenAimIsMet = new VisibleThingsMap(null)
  const setPlayers = new Set<string>()
  /* starting things is optional in the json */
  if (
    json.thingsToRevealWhenAimIsMet !== undefined &&
    json.thingsToRevealWhenAimIsMet !== null
  ) {
    for (const thing of json.thingsToRevealWhenAimIsMet) {
      if (thing.character !== undefined && thing.character !== null) {
        setPlayers.add(thing.character)
      }
    }
  }

  /* starting things is optional in the json */
  if (
    json.thingsToRevealWhenAimIsMet !== undefined &&
    json.thingsToRevealWhenAimIsMet !== null
  ) {
    for (const item of json.thingsToRevealWhenAimIsMet) {
      if (!thingsToRevealWhenAimIsMet.Has(item.thing)) {
        thingsToRevealWhenAimIsMet.Set(item.thing, new Set<string>())
      }
      if (item.character !== undefined && item.character !== null) {
        const { character } = item
        const setOfCharacters = thingsToRevealWhenAimIsMet.Get(item.thing)
        if (character.length > 0 && setOfCharacters != null) {
          setOfCharacters.add(character)
        }
      }
    }
  }

  setPlayers.delete('undefined')
  return thingsToRevealWhenAimIsMet
}
