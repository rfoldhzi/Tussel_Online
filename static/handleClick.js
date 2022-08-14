let board_x_start = 0
let board_y_start = 0
let moveCircles = []
let buildHexes = []
let buildButtons = []
let resourceButtons = []
let possibleAttacks = []
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
    resourceButtons = []
    possibleAttacks = []
}

function buildButtonClicked(btn) {
    console.log("building: "+btn.name);
    btn.color = "#00FFCC";
    selected.stateData = [btn.name]
    stateDataMode = 'build2'
    moveCircles = []
    buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    buildHexes = getRangeCircles(selected, false, btn.name)
    drawBoard();
}

function resourceButtonClicked(btn) {
    selected.state = "resources"
    selected.stateData = btn.name
    sendToServer(convertToStr(selected,'resources',btn.name))
    clearSelected();
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

    for (let btn of resourceButtons) {
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

        if (JSON.stringify(possibleAttacks).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a attack")
            selected.stateData = getAnyUnitFromPos(x,y)      
            console.log(selected.stateData)    
            selected.state = 'attack'
            sendToServer(convertToStr(selected,'attack',selected.stateData))
            clearSelected();
            drawBoard();
            return;
        }

        selected = getUnitFromPos(this_player,x,y);
        if (selected) {
            moveCircles = getMoveCircles(selected);
            possibleAttacks = getAttacks(selected);
            buildButtons = [];
            resourceButtons = [];
            let heightforResources = 0;
            if (selected.possibleStates.includes("resources")) {
                let i = 0
                for (let resource in selected.resourceGen) {
                    if (selected.resourceGen[resource] <= 0) {
                        continue;
                    }

                    let btnSize = 120;
                    if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
                        btnSize = 180
                    }

                    heightforResources = btnSize/3;

                    let newResourceButton = new Button((btnSize*1.2)*i, resourceBoxHeight, btnSize, btnSize/3, resourceColors[resource], resource, resourceButtonClicked);
                    newResourceButton.name = resource
                    newResourceButton.parameters = newResourceButton;
                    newResourceButton.textColor = "black"
                    resourceButtons.push(newResourceButton);
                    i++;
                }
            }
            if (selected.possibleStates.includes("build")) {
                let possibleBuilds = selected.possiblebuilds || UnitDB[selected.name]['possibleBuilds'] || []
                
                let btnSize = 50
                if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
                    btnSize = 120
                }

                let btnCount = possibleBuilds.length
                let combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2
                let btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2) 
                if (btnHeightStart < resourceBoxHeight + heightforResources) {
                    while (btnHeightStart < resourceBoxHeight + heightforResources && btnSize > 20) {
                        btnSize -= 10
                        combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2
                        btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2)
                    }
                }

                let i = 0
                for (let unitName of possibleBuilds) {
                    
                    let newBuildButton = new Button(0, btnHeightStart + (btnSize * 1.2)*i, btnSize, btnSize, "#AAAAAA", "", buildButtonClicked);
                    newBuildButton.name = unitName
                    newBuildButton.parameters = newBuildButton;
                    newBuildButton.addImage(getUnitImage(this_player, unitName));
                    buildButtons.push(newBuildButton);
                    i++;
                }
            }
            
        } else {
            clearSelected()
        }
        
    }
    drawBoard();
}