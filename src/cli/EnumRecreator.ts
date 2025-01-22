import { join } from 'path'
import * as fs from 'fs'

import { _STARTER } from '../_STARTER'
import { EnumFileAsSet } from './EnumFileAsSet'
import { parse } from 'jsonc-parser'
import { EnumFileAsArray } from './EnumFileAsArray'

export class EnumRecreator {
  a_all = new EnumFileAsArray('a_all', 'all_enum')
  a_aims = new EnumFileAsSet('a_aims', 'aim_enum')
  b_boxes = new EnumFileAsSet('b_boxes', 'box_enum')
  c_cutscenes = new EnumFileAsSet('c_cutscenes', 'cutscene_enum')
  d_dialogs = new EnumFileAsSet('d_dialogs', 'dialog_enum')
  i_inventory = new EnumFileAsSet('i_inventory', 'inventory_enum')
  k_knowledge = new EnumFileAsSet('k_knowledge', 'knowledge_enum')
  o_objects = new EnumFileAsSet('o_objects', 'object_enum')
  t_types = new EnumFileAsSet('t_types', 'type_enum')
  u_unrecognized = new EnumFileAsArray('u_unrecognized', 'un_enum')
  _folder: string

  constructor(folder: string) {
    this._folder = folder
    const cwd = process.cwd()
    console.log(cwd)
    process.chdir(join(__dirname, '/../../../..'))
    process.chdir(folder)

    console.warn('Results of FindAndAddPiecesRecursively')
    const files = fs.readdirSync('.')
    if (files.length > 0) {

      for (const file of files) {
       //  const pathAndFile = folder + file
        if (file.startsWith('aim') && file.endsWith('.jsonc')) {
          const text = fs.readFileSync(file, 'utf-8')
          const parsedJson: any = parse(text)
          const root = parsedJson.root
          const list: string[] = []
          this.CollectAllKeysAndValuesRecursively(root, list)
        }
      }
    }
  }

  public WriteEnumFiles(): void {
    this.a_aims.Write()
    this.b_boxes.Write()
    this.c_cutscenes.Write()
    this.d_dialogs.Write()
    this.i_inventory.Write()
    this.k_knowledge.Write()
    this.o_objects.Write()
    this.t_types.Write()
    this.u_unrecognized.Write()
   // this.a_all.Write() don't need this
  }

  private CollectAllKeysAndValuesRecursively(json: any, keysAndValues: string[]): void {
    for (const key in json) {
      keysAndValues.push(key)
      if (key.startsWith('oneOf')) {
      } else if (key.startsWith('aim')) {
        this.a_aims.Add(key)
      } else if (key.startsWith('box')) {
        this.b_boxes.Add(key)
      } else if (key.startsWith('cut')) {
        this.c_cutscenes.Add(key)
      } else if (key.startsWith('d')) {
        this.d_dialogs.Add(key)
      } else if (key.startsWith('inv_')) {
        this.i_inventory.Add(key)
      } else if (key.startsWith('invament_')) {
        this.k_knowledge.Add(key)
      } else if (key.startsWith('obj_')) {
        this.o_objects.Add(key)
      } else if (key.startsWith('type_')) {
        this.t_types.Add(key)
      } else {
        this.u_unrecognized.Add(key)
      }
      this.a_all.Add(key)
      this.CollectAllKeysAndValuesRecursively(json[key], keysAndValues)
    }
  }
}

