/* Slot definition:

    {
        x: number (0.0 - 1.0), 
        y: number (0.0 - 1.0), 
        color: 0 (empty), 1 - 6 (subtract 1 to get player color/id), 
        topLeftNeighbour: ref to Slot, 
        topRightNeighbour: ref to Slot, 
        leftNeighbour: ref to Slot,
        rightNeighbour: ref to Slot,
        bottomLeftNeighbour: ref to Slot, 
        bottomRightNeighbour: ref to Slot
    }
*/

class Vector {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalise() {
        let magn = this.magnitude;
        this.x /= magn;
        this.y /= magn;
    }

    static dot(_v1, _v2) {
        return _v1.x * _v2.x + _v1.y * _v2.y;
    }
}


class Movement {
    constructor() {
        this.cost = 0;
        this.angle = 0;
        this.nextSlot = null;   // ref to Slot
        this.playerSlot = null; // ref to slot
        this.moveVec = null;    // ref to Vector
    }
}

const UP_VEC = new Vector(0.0, -1.0);
let prevPlayerId = 0;


// some non-sense function written by Rainis Randmaa
function playRandomAITurn(board, playerID, playerSlots, targetSlots) {
    shuffleArray(playerSlots).some(slot => {
        let keys = shuffleArray([
            "topLeftNeighbour",
            "topRightNeighbour",
            "bottomLeftNeighbour",
            "bottomRightNeighbour",
            "leftNeighbour",
            "rightNeighbour",
        ]);

        for(key of keys) {
            if(slot[key] && slot[key].color != slot.color && slot[key][key] && !slot[key][key].color) {
                slot[key][key].color = slot.color; 
                slot.color = 0; 
                return true;
            }
            
            if(slot[key] && !slot[key].color) { slot[key].color = slot.color; slot.color = 0; return true; }
        }

        return false;
    });
}


// helper function to help sorting slots in ascending order
function slotCompareY(a, b) {
    return a.rotY - b.rotY;
}


function findSuitableTarget(board) {
    board.sort(slotCompareY);
    console.log(board)

    // check if any of the destination slots are free
    for(let i = 0; i < board.length; i++) {
        if(board[i].color != 0)
            continue;

        return board[i]
    }

    return null;
}


// this function might actually require some sort of path finding algorithm to be implemented
function correctMovement(playerId, movement, dstSlot, isJump) {
    let neighbours = shuffleNeighbours(playerId, movement.playerSlot);

    // check if any of the neighbours are colored and if not then quit without next slot to go to
    //if((neighbours.topLeftNeighbour == null     || neighbours.topLeftNeighbour.color == 0) && 
       //(neighbours.leftNeighbour == null        || neighbours.leftNeighbour.color == 0) && 
       //(neighbours.bottomLeftNeighbour == null  || neighbours.bottomLeftNeighbour.color == 0) &&
       //(neighbours.topRightNeighbour == null    || neighbours.topRightNeighbour.color == 0) && 
       //(neighbours.rightNeighbour == null       || neighbours.rightNeighbour.color == 0) && 
       //(neighbours.bottomRightNeighbour == null  || neighbours.bottomRightNeighbour.color == 0)) 
        //return;

    console.log("Movement cost in correctMovement(): ", movement.cost);
    console.log("Movement angle in correctMovement(): ", movement.angle * 180 / Math.PI);
    if(movement.moveVec.x <= 0) {
        if(movement.angle >= 0 && movement.angle < Math.PI / 3)
            movement.nextSlot = neighbours.topLeftNeighbour;
        else if(movement.angle >= Math.PI / 3 && movement.angle < (2 * Math.PI) / 3)
            movement.nextSlot = neighbours.leftNeighbour;
        else if(movement.angle >= (2 * Math.PI) / 3)
            movement.nextSlot = neighbours.bottomLeftNeighbour;
    } else {
        if(movement.angle > 0 && movement.angle <= Math.PI / 3)
            movement.nextSlot = neighbours.topRightNeighbour;
        else if(movement.angle > Math.PI / 3 && movement.angle <= (2 * Math.PI) / 3)
            movement.nextSlot = neighbours.rightNeighbour;
        else if(movement.angle > (2 * Math.PI) / 3)
            movement.nextSlot = neighbours.bottomRightNeighbour;
    }

    // recursively check find the jump destination 
    //if(movement.nextSlot != null && movement.nextSlot.color != 0) {
        //movement.moveVec.x = dstSlot.rotX - movement.nextSlot.rotX;
        //movement.moveVec.y = dstSlot.rotY - movement.nextSlot.rotY;
        //movement.cost = movement.moveVec.magnitude;
        //movement.playerSlot = movement.nextSlot;
        //movement.nextSlot = null;
        //correctMovement(playerId, movement, dstSlot, true);
    //} else if(movement.nextSlot != null && isJump == true) {
        //let currentNextSlot = movement.nextSlot;
        //let magnitude = movement.moveVec.magnitude;

        //movement.moveVec.normalise();
        //movement.angle = Math.acos(Vector.dot(movement.moveVec, UP_VEC));
        //movement.moveVec.x *= magnitude;
        //movement.moveVec.y *= magnitude;

        //movement.playerSlot = movement.nextSlot;
        //correctMovement(playerId, movement, dstSlot, true);
        
        //// no suitable next step found finish step
        //if(movement.nextSlot == null) {
            //movement.nextSlot = currentNextSlot;
            //movement.moveVec.x = dstSlot.rotX - movement.nextSlot.rotX;
            //movement.moveVec.y = dstSlot.rotY - movement.nextSlot.rotY;
            //magnitude = movement.moveVec.magnitude;
            //movement.moveVec.normalise();

            //movement.angle = Math.acos(Vector.dot(movement.moveVec, UP_VEC));
            //movement.cost = magnitude;
        //}
    //}
}

// analyse all player slots and determine the least costly player to move with move
function findSuitableMovement(playerSlots, dstSlot, playerID, boardSlotNeighbours) {
    let minMovement = null;
    
    // search for slots with minimal cost
    for(let i = 0; i < playerSlots.length; i++) {
        //playerSlots[i].color = 0;
        let movement = new Movement;

        movement.moveVec = new Vector(dstSlot.rotX - playerSlots[i].rotX, dstSlot.rotY - playerSlots[i].rotY);
        movement.cost = movement.moveVec.magnitude;
        movement.moveVec.normalise();
        movement.angle = Math.acos(Vector.dot(movement.moveVec, UP_VEC));
        movement.moveVec.x *= movement.cost;
        movement.moveVec.y *= movement.cost;
        movement.playerSlot = playerSlots[i];

        if(dstSlot.rotY != playerSlots[i].rotY) {
            correctMovement(playerID, movement, dstSlot, false);
            movement.playerSlot = playerSlots[i];

            if(movement.nextSlot != null && (minMovement == null || movement.cost < minMovement.cost))
                minMovement = movement;
        }
        else {
            console.log("Found destination on the same height as the player");
        }
    }

    if(minMovement == null)
        throw "Could not find the minimal movement path";

    return minMovement;
}

function shuffleNeighbours(playerID, slot) {
    let topLeftNeighbour = "topLeftNeighbour";
    let topRightNeighbour = "topRightNeighbour";
    let bottomLeftNeighbour = "bottomLeftNeighbour";
    let bottomRightNeighbour = "bottomRightNeighbour";
    let leftNeighbour = "leftNeighbour";
    let rightNeighbour = "rightNeighbour";

    switch(playerID) {
        case 1:
            topLeftNeighbour = "leftNeighbour";
            leftNeighbour = "bottomLeftNeighbour";
            bottomLeftNeighbour = "bottomRightNeighbour";
            bottomRightNeighbour = "topRightNeighbour";
            rightNeighbour = "topRightNeighbour";
            topRightNeighbour = "topLeftNeighbour";
            break;

        case 2:
            topLeftNeighbour = "bottomLeftNeighbour";
            leftNeighbour = "bottomRightNeighbour";
            bottomLeftNeighbour = "rightNeighbour";
            bottomRightNeighbour = "topRightNeighbour";
            rightNeighbour = "topLeftNeighbour";
            topRightNeighbour = "leftNeighbour";
            break;

        case 3:
            topLeftNeighbour = "bottomRightNeighbour";
            leftNeighbour = "rightNeighbour";
            bottomLeftNeighbour = "topRightNeighbour";
            bottomRightNeighbour = "topLeftNeighbour";
            rightNeighbour = "leftNeighbour";
            topRightNeighbour = "bottomLeftNeighbour";
            break;

        case 4:
            topLeftNeighbour = "rightNeighbour";
            leftNeighbour = "topRightNeighbour";
            bottomLeftNeighbour = "topLeftNeighbour";
            bottomRightNeighbour = "leftNeighbour";
            rightNeighbour = "bottomLeftNeighbour";
            topRightNeighbour = "bottomRightNeighbour";
            break;

        case 5:
            topLeftNeighbour = "topRightNeighbour";
            leftNeighbour = "topLeftNeighbour";
            bottomLeftNeighbour = "leftNeighbour";
            bottomRightNeighbour = "bottomLeftNeighbour";
            rightNeighbour = "bottomRightNeighbour";
            topRightNeighbour = "rightNeighbour";
            break;

        default:
            throw "Invalid player id";
            break;
    }

    return {
        "topLeftNeighbour": slot[topLeftNeighbour],
        "leftNeighbour": slot[leftNeighbour],
        "bottomLeftNeighbour": slot[bottomLeftNeighbour],
        "bottomRightNeighbour": slot[bottomRightNeighbour],
        "rightNeighbour": slot[rightNeighbour],
        "topRightNeighbour": slot[topLeftNeighbour]
    };
}

/**
    @param board: [Slot]            Game board (reference)
    @param playerID: number (0-5)   Player whose turn it is
    @param playerSlots: [Slot]      Player slots (reference)
    @param targetSlots: [Slot]      Target slots (reference)
    @returns void

    Takes one turn for the given player.
*/
function playAITurn(board, playerID, playerSlots, targetSlots) {
    board.forEach((slot) => {
        let rotation = playerID * 60;
        let location = rotatePoint(0, 0, (slot.x * 2 - 1), (slot.y * 2 - 1), rotation);

        if(slot.x * 2 - 1 > 1 || slot.x * 2 - 1 < -1 || slot.y * 2 - 1 > 1 || slot.y * 2 - 1 < - 1)
            console.log("Coordinate value overflow detected: {", slot.x * 2 - 1, " ", slot.y * 2 - 1, "}");

        slot.rotX = location.x;
        slot.rotY = location.y;
    });


    // sort playerSlots and targetSlots on decending order from y coordinate
    playerSlots.sort(slotCompareY);
    targetSlots.sort(slotCompareY);

    dstSlot = findSuitableTarget(board);
    if(dstSlot == null)
        throw "All slots in game are occupied? Not good";

    movement = findSuitableMovement(playerSlots, dstSlot, playerID);
    movement.nextSlot.color = movement.playerSlot.color;
    movement.playerSlot.color = 0;
    prevPlayerId = playerID;
}
