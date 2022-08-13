let board_x_start = 0
let board_y_start = 0
let moveCircles = []

function gridMouse(x,y) {
    x = x - x_offset;
    y = y - y_offset;
    return [Math.floor(x/(size)), Math.floor(y/(size))];
}

function clearSelected() {
    selected = null;
    moveCircles = []
}

function handleClick(xPos,yPos) {
    console.log("handling")

    for (let btn of ButtonCollection) {

        if (btn.potentialMouseClick(xPos,yPos)) {
            return;
        }
    }

    let position = gridMouse(xPos,yPos);


    x = position[0] + board_x_start;
    y = position[1] + board_y_start;

    if (x >= 0 && y >= 0 && y<gameObject.height && x< gameObject.width) {
        //if (moveCircles.includes([x,y])) {
        if (JSON.stringify(moveCircles).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a move")
            selected.stateData = [x,y]
            selected.state = 'move'
            sendToServer(convertToStr(selected,'move',[x,y]))
            clearSelected();
            drawBoard();
            return;
        }
        selected = getUnitFromPos(this_player,x,y);
        if (selected) {
            moveCircles = getMoveCircles(selected);
            console.log("movecircles: "+moveCircles)
        } else {
            clearSelected()
        }
        
    }
    drawBoard();
}