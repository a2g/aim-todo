import { Command } from './Command'
import { Mix } from './Mix'

export function GetAnyErrorsFromObjectAvailability (
  objects: Command,
  visibleProps: string[],
  visibleInvs: string[]
): string {
  const isObject1InVisibleInvs = visibleInvs.includes(objects.object1)
  const isObject1InVisibleProps = visibleProps.includes(objects.object1)
  const isObject2InVisibleInvs = visibleInvs.includes(objects.object2)
  const isObject2InVisibleProps = visibleProps.includes(objects.object2)

  const type = objects.type
  if (type === Mix.InvVsInv) {
    if (!isObject1InVisibleInvs || !isObject2InVisibleInvs) {
      return 'One of those inventory items is not visible!'
    }
  }
  if (type === Mix.InvVsObject) {
    if (!isObject1InVisibleInvs || !isObject2InVisibleProps) {
      return 'One of those items is not visible!'
    }
  }
  if (type === Mix.ObjVsObj) {
    if (!isObject1InVisibleProps || !isObject2InVisibleProps) {
      return 'One of those objs is not visible!'
    }
  }
  if (type === Mix.Inv && !isObject1InVisibleInvs) {
    return 'That inv is not visible!'
  } else if (type === Mix.Prop && !isObject1InVisibleProps) {
    return 'That obj is not visible!'
  }

  return '' // no error!
}
