import { _STARTER } from '../_STARTER'
import { EnumFileAsSet } from './EnumFileAsSet'
import { EnumFileAsArray } from './EnumFileAsArray'
import { GetMapOFilesInFolderOfGivenPrefix } from './GetMapOFilesInFolderOfGivenPrefix'

export class EnumReCreator {
  a_all = new EnumFileAsArray('a_all', 'all_enum')
  a_aims = new EnumFileAsSet('a_aims', 'aim_enum')
  c_cuts = new EnumFileAsSet('c_cutscenes', 'cutscene_enum')
  d_dialogs = new EnumFileAsSet('d_dialogs', 'dialog_enum')
  i_inventory = new EnumFileAsSet('i_inventory', 'inventory_enum')
  k_knowledge = new EnumFileAsSet('k_knowledge', 'knowledge_enum')
  o_objects = new EnumFileAsSet('o_objects', 'object_enum')
  // t_types = new EnumFileAsSet('t_types', 'type_enum')
  u_unrecognized = new EnumFileAsArray('u_unrecognized', 'un_enum')
  _folder: string

  constructor(folder: string) {
    this._folder = folder
  }

  public WriteEnumFiles (): void {
    const mapOfAims = GetMapOFilesInFolderOfGivenPrefix(this._folder, 'aim')
    const mapOfCuts = GetMapOFilesInFolderOfGivenPrefix(this._folder, 'cut')
    const mapOfDialogs = GetMapOFilesInFolderOfGivenPrefix(this._folder, 'd')

    for (const aimFileHeader of mapOfAims.map.values()) {
      const list: string[] = []
      this.CollectAllKeysAndValuesRecursively(aimFileHeader.GetTheAny(), list)
    }


    this.a_aims.InitFromFiles(mapOfAims.GetRawMap().keys())
    this.c_cuts.InitFromFiles(mapOfCuts.GetRawMap().keys())
    this.d_dialogs.InitFromFiles(mapOfDialogs.GetRawMap().keys())

    this.a_aims.Write()
    this.c_cuts.Write()
    this.d_dialogs.Write()
    this.i_inventory.Write()
    this.k_knowledge.Write()
    this.o_objects.Write()
    // this.t_types.Write()
    this.u_unrecognized.Write()
    // this.a_all.Write() don't need this
  }

  public DeleteFiles (): void {

    this.a_aims.Delete()
    this.c_cuts.Delete()
    this.d_dialogs.Delete()
    this.i_inventory.Delete()
    this.k_knowledge.Delete()
    this.o_objects.Delete()
    // this.t_types.Write()
    this.u_unrecognized.Delete()
    // this.a_all.Write() don't need this
  }

  private CollectAllKeysAndValuesRecursively (json: any, keysAndValues: string[]): void {
    for (const key in json) {
      keysAndValues.push(key)
      if (key.startsWith('oneOf')) {
      } else if (key.startsWith('aim')) {
        this.a_aims.Add(key)
      } else if (key.startsWith('cut')) {
        this.c_cuts.Add(key)
      } else if (key.startsWith('d')) {
        this.d_dialogs.Add(key)
      } else if (key.startsWith('inv_')) {
        this.i_inventory.Add(key)
      } else if (key.startsWith('invament_')) {
        this.k_knowledge.Add(key)
      } else if (key.startsWith('obj_')) {
        this.o_objects.Add(key)
      } else {
        this.u_unrecognized.Add(key)
      }
      this.a_all.Add(key)
      this.CollectAllKeysAndValuesRecursively(json[key], keysAndValues)
    }
  }
}

