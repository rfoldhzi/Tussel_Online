let board_x_start = 0
let board_y_start = 0
let moveCircles = []
let buildHexes = []
let buildButtons = []
let stateDataMode = null;

function gridMouse(x,y) {
    x = x - x_offset;
    y = y - y_offset;
    return [Math.floor(x/(size)), Math.floor(y/(size))];
}

function clearSelected() {
    stateDataMode = null;
    selected = null;
    moveCircles = []
    buildHexes = []
    buildButtons = []
}

function buildButtonClicked(btn) {
    console.log("building: "+btn.name);
    btn.color = "#00FFCC";
    selected.stateData = [btn.name]
    stateDataMode = 'build2'
    moveCircles = []
    buildButtons = []
    buildHexes = getRangeCircles(selected, built = btn.name)
    drawBoard();
}

function handleClick(xPos,yPos) {
    console.log("handling")

    for (let btn of ButtonCollection) {

        if (btn.potentialMouseClick(xPos,yPos)) {
            return;
        }
    }

    for (let btn of buildButtons) {
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

        if (JSON.stringify(buildHexes).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a build")
            selected.stateData.unshift([x,y])            
            selected.state = 'build'
            sendToServer(convertToStr(selected,'build',selected.stateData))
            clearSelected();
            drawBoard();
            return;
        }

        selected = getUnitFromPos(this_player,x,y);
        if (selected) {
            moveCircles = getMoveCircles(selected);
            if (selected.possibleStates.includes("build")) {
                buildButtons = []
                let possibleBuilds = selected.possiblebuilds || UnitDB[selected.name]['possibleBuilds'] || []
                
                let i = 0
                for (let unitName of possibleBuilds) {
                    
                    let newBuildButton = new Button(0, Math.floor(canvas.height/4) + 100*i, 80, 80, "#AAAAAA", "", buildButtonClicked);
                    newBuildButton.name = unitName
                    newBuildButton.parameters = newBuildButton;
                    newBuildButton.addImage(getUnitImage(this_player, unitName));
                    buildButtons.push(newBuildButton);
                    i++;
                }
            }
            console.log("movecircles: "+moveCircles)
        } else {
            clearSelected()
        }
        
    }
    drawBoard();
}