let board_x_start = 0
let board_y_start = 0
let moveCircles = []
let transportSpots = []
let dropOffSpots = []
let buildHexes = []
let buildButtons = []
let resourceButtons = []
let possibleAttacks = []
let possibleHeals = []
let stateDataMode = null;
let effectiveResources = {}
let researchOffsetXStored = 0
let researchOffsetYStored = 0
let researchOffsetSizeStored = 30

function gridMouse(x,y) {
    x = x - x_offset;
    y = y - y_offset;
    return [Math.floor(x/(size)), Math.floor(y/(size))];
}

function defaultButtonMenu() {
    let buttonsToDelete = []
    for (let key in ButtonCollection) {
        if (key != "logout" || key != "done") {
            buttonsToDelete.push(key)
        }
    }
    for (let key of buttonsToDelete) {
        delete ButtonCollection[key]
    }
    if (!("done" in ButtonCollection)) {
        if (canvas.height > canvas.width && canvas.width * canvas.height > 1000000) {
            doneButton = new Button(canvas.width - 250, canvas.height - 100, 230, 80, "#AAAAAA", "Done", endTurn);
        } else {
            doneButton = new Button(canvas.width - 160, canvas.height - 60, 140, 50, "#AAAAAA", "Done", endTurn);
        }
        ButtonCollection["done"] = doneButton
    }
    if (!("logout" in ButtonCollection)) {
        if (canvas.height > canvas.width && canvas.width * canvas.height > 1000000) {
            logoutButton = new Button(20, canvas.height - 100, 250, 80, "#AAAAAA", "Logout", logout);
        } else {
            logoutButton = new Button(20, canvas.height - 60, 160, 50, "#AAAAAA", "Logout", logout);
        }
        ButtonCollection["logout"] = logoutButton
    }
}

//Flip the stored research board variables with the real ones
function flipBoardVariables() {
    let offsetX_temp = x_offset;
    let offsetY_temp = y_offset;
    let size_temp = size;
    x_offset = researchOffsetXStored;
    y_offset = researchOffsetYStored;
    size = researchOffsetSizeStored;
    researchOffsetXStored = offsetX_temp
    researchOffsetYStored = offsetY_temp
    researchOffsetSizeStored = size_temp
}

function enterResearchMenu() {
    stateDataMode = "research"
    flipBoardVariables()
    drawBoard()
}

function clearSelected() {
    if (stateDataMode == "research") {
        flipBoardVariables()
    }
    popupTech = null
    stateDataMode = null;
    selected = null;
    moveCircles = []
    transportSpots = []
    dropOffSpots = []
    buildHexes = []
    buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    possibleHeals = []
    defaultButtonMenu()
}

function createCancelButton() {
    let btnSize = 120;
    if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
        btnSize = 180
    }

    let cancelButton = new Button(canvas.width - btnSize, resourceBoxHeight + statBoxHeight, btnSize, btnSize/3, "#F05050", "cancel", cancelButtonClicked);
    cancelButton.textColor = "white"
    ButtonCollection["cancel"] = cancelButton
}

function buildButtonClicked(btn) {
    console.log("building: "+btn.name);
    selected.stateData = [btn.name]
    stateDataMode = 'build2'
    buildPopup(btn.name)

    moveCircles = []
    transportSpots = []
    dropOffSpots = []
    //buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    possibleHeals = []
    buildHexes = getRangeCircles(selected, false, btn.name)

    for (let btn of buildButtons) {
        let unitName = btn.name
        let color = "#EE5555"
        if (selected.state == "build" && selected.stateData[1] == unitName) {
            color = "#6464FF"
        } else if (selected.maxPopulation && selected.maxPopulation <= selected.population) {
            color = "#777777"
        } else if (checkIfAffordable(unitName))  {
            color = "#EEEEEE"
        }
        btn.color = color
    }

    btn.color = "#00FFCC";
    

    drawBoard();
}

function transportButtonClicked(btn) {
    console.log("transporting: "+btn.name);
    btn.color = "#00FFCC";
    selected.stateData = [btn.name]
    stateDataMode = 'transport2'
    moveCircles = []
    transportSpots = []
    //dropOffSpots = []
    buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    possibleHeals = []
    dropOffSpots = getRangeCircles(selected, false, btn.name)
    drawBoard();
}

function resourceButtonClicked(btn) {
    selected.state = "resources"
    selected.stateData = btn.name
    sendToServer(convertToStr(selected,'resources',btn.name))
    clearSelected();
    drawBoard();
}

function researchButtonClicked(btn) {
    selected.state = "research"
    selected.stateData = btn.name
    sendToServer(convertToStr(selected,'research',btn.name))
    clearSelected();
    drawBoard();
}

function cancelButtonClicked(btn) {
    selected.state = null
    selected.stateData = null
    sendToServer(convertToStr(selected,'cancel'))
    clearSelected();
    drawBoard();
}

function checkWhatCouldBeClicked(xPos,yPos) {
    for (let key in ButtonCollection) {

        if (ButtonCollection[key].isMouseHovering(xPos,yPos)) {
            return ButtonCollection[key];
        }
    }

    if (stateDataMode == "research") {
        for (let key in currentTechButtons) {
            if (currentTechButtons[key].isMouseHovering(xPos,yPos)) {
                return currentTechButtons[key];
            }
        }
    }

    for (let btn of buildButtons) {
        if (btn.isMouseHovering(xPos,yPos)) {
            return btn;
        }
    }

    for (let btn of resourceButtons) {
        if (btn.isMouseHovering(xPos,yPos)) {
            return btn;
        }
    }

    let position = gridMouse(xPos,yPos);

    x = position[0] + board_x_start;
    y = position[1] + board_y_start;

    return x+","+y
}

function handleClick(xPos,yPos) {
    console.log("handling")

    

    for (let key in ButtonCollection) {

        if (ButtonCollection[key].potentialMouseClick(xPos,yPos)) {
            return;
        }
    }

    if (stateDataMode == "research") {
        for (let key in currentTechButtons) {
            if (currentTechButtons[key].potentialMouseClick(xPos,yPos)) {
                return;
            }
        }
        //No button was pressed
        if (popupTech != null) {
            back_research()
            return
        }
        clearSelected();
        drawBoard();
        return;
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
        if (selected != null && selected.possibleStates.includes("research") ) {
            if (x==selected.position[0] && y == selected.position[1]) {
                enterResearchMenu()
                return;
            }
        }
        if (JSON.stringify(moveCircles).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a move")
            selected.stateData = [x,y]
            selected.state = 'move'
            sendToServer(convertToStr(selected,'move',[x,y]))
            clearSelected();
            drawBoard();
            return;
        }
        if (JSON.stringify(transportSpots).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a transport")
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
        if (JSON.stringify(dropOffSpots).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a transport")
            selected.stateData.unshift([x,y])            
            selected.state = 'transport'
            sendToServer(convertToStr(selected,'transport',selected.stateData))
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
        if (JSON.stringify(possibleHeals).indexOf(JSON.stringify([x,y])) !== -1) {
            console.log("clicked on a heal")
            selected.stateData = getUnitFromPos(this_player,x,y)      
            console.log(selected.stateData)    
            selected.state = 'heal'
            sendToServer(convertToStr(selected,'heal',selected.stateData))
            clearSelected();
            drawBoard();
            return;
        }

        if (selected) {
            let newSelected = getUnitFromPos(this_player,x,y);
            clearSelected()
            selected = newSelected
        } else {
            selected = getUnitFromPos(this_player,x,y);
        }
        if (selected) {
            moveCircles = getMoveCircles(selected);
            transportSpots = getTransportCircles(selected);
            possibleAttacks = getAttacks(selected);
            possibleHeals = getHeals(selected)
            buildButtons = [];
            resourceButtons = [];
            let heightforResources = 0;
            drawStats(); //Added here so we know the current height for top-bars

            if (selected.state != null) {
                createCancelButton()
            }

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

                    let newResourceButton = new Button((btnSize*1.2)*i, resourceBoxHeight + statBoxHeight, btnSize, btnSize/3, resourceColors[resource], resource, resourceButtonClicked);
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
                if (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources) {
                    while (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources && btnSize > 20) {
                        btnSize -= 10
                        combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2
                        btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2)
                    }
                }

                effectiveResources = getEffectiveResources(selected) //Store in global variable

                let i = 0
                for (let unitName of possibleBuilds) {

                    let color = "#EE5555"
                    if (selected.state == "build" && selected.stateData[1] == unitName) {
                        color = "#6464FF"
                    } else if (selected.maxPopulation && selected.maxPopulation <= selected.population) {
                        color = "#777777"
                    } else if (checkIfAffordable(unitName))  {
                        color = "#EEEEEE"
                    }

                    
                    let newBuildButton = new Button(0, btnHeightStart + (btnSize * 1.2)*i, btnSize, btnSize, color, "", buildButtonClicked);
                    newBuildButton.name = unitName
                    newBuildButton.parameters = newBuildButton;
                    newBuildButton.addImage(getUnitImage(this_player, unitName));
                    buildButtons.push(newBuildButton);
                    i++;
                }
            }

            if (selected.possibleStates.includes("transport") && selected.carrying != undefined) {
                let possibleBuilds = selected.carrying
                
                let btnSize = 50
                if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
                    btnSize = 120
                }

                let btnCount = possibleBuilds.length
                let combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2
                let btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2) 
                if (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources) {
                    while (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources && btnSize > 20) {
                        btnSize -= 10
                        combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2
                        btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2)
                    }
                }
                let i = 0
                for (let unit of possibleBuilds) {
                    let unitName = unit.name
                    let color = "#32E632"

                    
                    let newBuildButton = new Button(0, btnHeightStart + (btnSize * 1.2)*i, btnSize, btnSize, color, "", transportButtonClicked);
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