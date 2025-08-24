
/**
 * Tries to find a piece to connect to the kth input of thePiece.
 *
 * Now the complicated bit:
 * If it finds multiple pieces that match the hint, it clones the solution so we have extra
 * solutions to connect those extra pieces to - and adds the new solutions to the solution list.
 * @param thePiece - the piece whose kth input we are trying to connect
 * @param k - the input we are trying to connect
 * @param thePieceId - the id of thePiece, passed separately since its not a member of pieceBase
 * @param solution - the solution to which the piece belongs.
 * @param solutions - used if we have multiple, and need to clone this solution, and take a bet each way.
 *
 * @returns true if a clone has occurred
 */
export function ProcessAndReturnTrueIfCloneOccurs (
): boolean {
  return false
}
