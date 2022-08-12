let board_x_start = 0
let board_y_start = 0


function gridMouse(x,y) {
    x = x - x_offset;
    y = y - y_offset;
    return [Math.floor(x/(size)), Math.floor(y/(size))];
}



function handleClick(xPos,yPos) {
    console.log("handling")
    let position = gridMouse(xPos,yPos);


    x = position[0] + board_x_start;
    y = position[1] + board_y_start;

    if (x >= 0 && y >= 0 && y<gameObject.height && x< gameObject.width) {
        selected = getUnitFromPos(this_player,x,y)
    }
    drawBoard();
}