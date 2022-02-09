/* Slot definition:

    {
        x: number (0.0 - 1.0), 
        y: number (0.0 - 1.0), 
        color: 0 (empty), 1 - 6 (subtract 1 to get player color/id), 
        topLeftNeighbour: ref to Slot, 
        topRightNeighbour: ref to Slot, 
        bottomLeftNeighbour: ref to Slot, 
        bottomRightNeighbour: ref to Slot
    }
*/

/**
    @param board: [Slot]            Game board (reference)
    @param playerID: number (0-5)   Player whose turn it is
    @returns void

    Takes one turn for the given player.
*/
function playAITurn(board, playerID) {

}