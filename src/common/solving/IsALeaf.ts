/**
* #### For the purposes of traversing, a leaf is one with all
* inputs are null.
* @param treeNode
* @returns true if a leaf
*/
export function IsALeaf (treeNode: any): boolean {
  const length = Object.keys(treeNode).length
  return length > 0 ? false : true
}