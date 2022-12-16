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
let possibleResupplies = []
let friendlyCounters = []
let enemyCounters = []
let neutralCounters = []
let friendlyTraps = []
let enemyTraps = []
let friendlyResources = []
let enemyResources = []
let potentialAttacks = []
let potentialHeals = []
let potentialGeneration = []
let potentialCounters = []
let potentialTraps = []
let stateDataMode = null;
let tempStateData = null;
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
        //Change done button color based on how is already ready
        if (doneState == "notDone") { 
            doneButton.color = "#1188FF" //Blue
        } else if (doneState == "done") {
            doneButton.color = "#AAAAAA" //Grayed
        } else if (doneState == "hurry") {
            doneButton.textColor = "#1188FF" //Inverted white and blue
            doneButton.color = "#FFFFFF"
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

function clearSelected() {
    popupTech = null
    stateDataMode = null;
    tempStateData = null;
    selected = null;
    enemySelected = null;
    enemySelectedPlayer = null;
    moveCircles = []
    transportSpots = []
    dropOffSpots = []
    buildHexes = []
    buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    possibleHeals = []
    possibleResupplies = []
    defaultButtonMenu()
    drawBoard()
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
    //selected.stateData = [btn.name]
    tempStateData = btn.name
    stateDataMode = 'build2'
    buildPopup(btn.name)

    moveCircles = []
    transportSpots = []
    dropOffSpots = []
    //buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    possibleHeals = []
    possibleResupplies = []
    //buildHexes = getRangeCircles(selected, false, btn.name)

    for (let btn of buildButtons) {
        let unitName = btn.name
        let color = "#EE5555"
        if (tempStateData == unitName) {
            color = "#6464FF"
        } else if (gameObject.currentPlayerTurn != this_player)  {
            color = "#404040"
        } else if (checkIfAffordable(unitName))  {
            color = "#EEEEEE"
        } 
        btn.color = color
    }

    btn.color = "#00FFCC";

    determineTerritories()
    

    drawBoard();
}

function transportButtonClicked(btn) {
    console.log("transporting: "+btn.name);
    btn.color = "#00FFCC";
    //selected.stateData = [btn.name]
    tempStateData = btn.name
    stateDataMode = 'transport2'
    moveCircles = []
    transportSpots = []
    //dropOffSpots = []
    buildButtons = []
    resourceButtons = []
    possibleAttacks = []
    possibleHeals = []
    possibleResupplies = []
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

function cancelButtonClicked(btn) {
    if (selected != null) {
        selected.state = null
        selected.stateData = null
        sendToServer(convertToStr(selected,'cancel'))
    }
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

let currentKnownHoverX = -1
let currentKnownHoverY = -1

function checkForHovering(xPos,yPos) {
    if (tempStateData == null) {
        currentKnownHoverX = -1
        currentKnownHoverY = -1
        potentialAttacks = []
        potentialHeals = []
        potentialGeneration = []
        potentialCounters = []
        potentialTraps = []
        return
    }
    let position = gridMouse(xPos,yPos);


    x = position[0] + board_x_start;
    y = position[1] + board_y_start;

    if (x >= 0 && y >= 0 && y<gameObject.height && x< gameObject.width) {
        if (currentKnownHoverX != x || currentKnownHoverY != y) {
            currentKnownHoverX = x
            currentKnownHoverY = y

            potentialAttacks = []
            potentialHeals = []
            potentialGeneration = []
            potentialCounters = []
            potentialTraps = []

            let pos = [x,y]

            iconCountMap2 = []
            for (let i = 0; i<gameObject.height; i++) {
                let layer = []
                for (let j = 0; j<gameObject.width; j++) {
                    layer.push(0)
                }
                iconCountMap2.push(layer)
            }

            if ("attack" in UnitDB[tempStateData]) {
                let points = findPatternPoints(UnitDB[tempStateData]["attackPattern"], pos)
                for (let point of points) {
                    potentialAttacks.push(point)
                    iconCountMap2[point[1]][point[0]] += 1
                }
            }
            if ("heal" in UnitDB[tempStateData]) {
                let points = findPatternPoints(UnitDB[tempStateData]["healPattern"], pos)
                for (let point of points) {
                    potentialHeals.push(point)
                    iconCountMap2[point[1]][point[0]] += 1
                }
            }
            if ("generation" in UnitDB[tempStateData]) {
                let points = findPatternPoints(UnitDB[tempStateData]["generationPattern"], pos)
                for (let point of points) {
                    potentialGeneration.push(point)
                    iconCountMap2[point[1]][point[0]] += 1
                }
            }
            if ("counter" in UnitDB[tempStateData]) {
                let points = findPatternPoints(UnitDB[tempStateData]["counterPattern"], pos)
                for (let point of points) {
                    potentialCounters.push(point)
                    iconCountMap2[point[1]][point[0]] += 1
                }
            }
            if ("trap" in UnitDB[tempStateData]) {
                let points = findPatternPoints(UnitDB[tempStateData]["trapPattern"], pos)
                for (let point of points) {
                    potentialTraps.push(point)
                    iconCountMap2[point[1]][point[0]] += 1
                }
            }
            drawBoard()
        }
    } else {
        currentKnownHoverX = -1
        currentKnownHoverY = -1
        potentialAttacks = []
        potentialHeals = []
        potentialGeneration = []
        potentialCounters = []
        potentialTraps = []
    }

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
        if (stateDataMode == "build2") {
            sendToServer(convertToStr2(tempStateData, x,y))
            tempStateData = null
            stateDataMode = null
            createCardButtons(gameObject.hands[this_player])
            //clearSelected()
            return
        }


        if (selected) {
            if (selected.possibleStates.includes("research") ) {
                if (x==selected.position[0] && y == selected.position[1]) {
                    enterResearchMenu()
                    return;
                }
            }
            if (selected.possibleStates.includes("cloak") ) { //If clicked on cloak button on top of selected unit
                if (x==selected.position[0] && y == selected.position[1]) {
                    cloakCommand()
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
                //selected.stateData.unshift([x,y])     
                selected.stateData = [[x,y],tempStateData]       
                selected.state = 'build'
                sendToServer(convertToStr(selected,'build',selected.stateData))
                clearSelected();
                drawBoard();
                return;
            }
            if (JSON.stringify(dropOffSpots).indexOf(JSON.stringify([x,y])) !== -1) {
                console.log("clicked on a transport")
                //selected.stateData.unshift([x,y])     
                selected.stateData = [[x,y],tempStateData]          
                selected.state = 'transport'
                sendToServer(convertToStr(selected,'transport',selected.stateData))
                clearSelected();
                drawBoard();
                return;
            }

            if (JSON.stringify(possibleAttacks).indexOf("["+x+","+y) !== -1) {
                console.log("clicked on a attack")
                selected.stateData = getAnyUnitFromPos(x,y)      
                console.log(selected.stateData)    
                selected.state = 'attack'
                sendToServer(convertToStr(selected,'attack',selected.stateData))
                clearSelected();
                drawBoard();
                return;
            }
            if (JSON.stringify(possibleHeals).indexOf("["+x+","+y) !== -1) {
                console.log("clicked on a heal")
                selected.stateData = getUnitFromPos(this_player,x,y)      
                console.log(selected.stateData)    
                selected.state = 'heal'
                sendToServer(convertToStr(selected,'heal',selected.stateData))
                clearSelected();
                drawBoard();
                return;
            }
            if (JSON.stringify(possibleResupplies).indexOf("["+x+","+y) !== -1) {
                console.log("clicked on a resupply")
                selected.stateData = getUnitFromPos(this_player,x,y)      
                console.log(selected.stateData)    
                selected.state = 'resupply'
                sendToServer(convertToStr(selected,'resupply',selected.stateData))
                clearSelected();
                drawBoard();
                return;
            }
        }


        if (selected) {
            let newSelected = getUnitFromPos(this_player,x,y);
            clearSelected()
            selected = newSelected
        } else if (enemySelected) {
            let newSelected = getUnitFromPos(this_player,x,y);
            clearSelected()
            selected = newSelected
            if (selected == null) {
                enemySelected = getAnyUnitFromPos(x,y)
            }
        } else {
            selected = getUnitFromPos(this_player,x,y);
            if (selected == null) {
                enemySelected = getAnyUnitFromPos(x,y)
            }
        }
        if (selected) {
            continueShowingAnimations = false;
            moveCircles = getMoveCircles(selected);
            transportSpots = getTransportCircles(selected);
            possibleAttacks = getAttacks(selected);
            possibleHeals = getHeals(selected)
            possibleResupplies = getResupplies(selected)
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

                    let btnSize = 150;
                    if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
                        btnSize = 210
                    }

                    heightforResources = btnSize*.25;
                    let text = resource+" +"+selected.resourceGen[resource]

                    let newResourceButton = new Button((btnSize*1.2)*i, resourceBoxHeight + statBoxHeight, btnSize, heightforResources, resourceColors[resource], text, resourceButtonClicked);
                    newResourceButton.name = resource
                    newResourceButton.parameters = newResourceButton;
                    newResourceButton.textColor = "black"
                    newResourceButton.fontSize = heightforResources*.8-2
                    resourceButtons.push(newResourceButton);
                    i++;
                }
            }
            if (selected.possibleStates.includes("build") || selected.possibleStates.includes("upgrade")) {
                let possibleBuilds = selected.possiblebuilds || UnitDB[selected.name]['possibleBuilds'] || []
                let possibleUpgrades = selected.possibleupgrades || UnitDB[selected.name]['possibleUpgrades'] || []
                
                let btnSize = 50
                if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
                    btnSize = 120
                }

                //For labels above and below build and upgrade buttons
                let buttonLabelSize = btnSize * .5
                if (possibleBuilds.length > 0 && possibleUpgrades.length > 0) {
                    buttonLabelSize *= 2
                }

                let btnCount = possibleBuilds.length + possibleUpgrades.length
                let combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2 + buttonLabelSize
                let btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2) 
                if (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources) {
                    while (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources && btnSize > 20) {
                        btnSize -= 10
                        combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2 + buttonLabelSize
                        btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2)
                    }
                }

                let currentButtonHeight = 0

                if (possibleBuilds.length > 0) {
                    ButtonCollection["Build Label"] = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize*.4, "#000", "Build", function(){});
                    currentButtonHeight += btnSize * 0.5;
                } else if (possibleUpgrades.length > 0) {
                    ButtonCollection["Upgrade Label"] = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize*.4, "#000", "Upgrade", function(){});
                    currentButtonHeight += btnSize * 0.5;
                }

                effectiveResources = getEffectiveResources(selected) //Store in global variable

                //let i = 0
                for (let unitName of possibleBuilds) {

                    let color = "#EE5555"
                    if (selected.cloaked != undefined) { //Show Navy background if cloaked
                        color = "#00278F"
                    } else if (selected.state == "build" && selected.stateData[1] == unitName) {
                        color = "#6464FF"
                    } else if (selected.maxPopulation && selected.maxPopulation <= selected.population) {
                        color = "#777777"
                    } else if (selected.maxSupplies && selected.supplies <=0) {
                        color = "#FF0"
                    } else if (checkIfAffordable(unitName))  {
                        color = "#EEEEEE"
                    }

                    
                    //let newBuildButton = new Button(0, btnHeightStart + (btnSize * 1.2)*i, btnSize, btnSize, color, "", buildButtonClicked);
                    let newBuildButton = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize, color, "", buildButtonClicked);
                    newBuildButton.name = unitName
                    newBuildButton.parameters = newBuildButton;
                    newBuildButton.addImage(getUnitImage(this_player, unitName));
                    buildButtons.push(newBuildButton);
                    //i++;
                    currentButtonHeight += btnSize * 1.2;
                }
                for (let upgradeName of possibleUpgrades) {

                    let color = "#755724"
                    if (selected.cloaked != undefined) { //Show Navy background if cloaked
                        color = "#00278F"
                    } else if (selected.state == "upgrade" && selected.stateData == upgradeName) {
                        color = "#7842ff"
                    } else if (checkIfAffordable(upgradeName))  {
                        color = "#ffa200"
                    }

                    
                    //let newBuildButton = new Button(0, btnHeightStart + (btnSize * 1.2)*i, btnSize, btnSize, color, "", upgradeButtonClicked);
                    let newBuildButton = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize, color, "", upgradeButtonClicked);
                    newBuildButton.name = upgradeName
                    newBuildButton.parameters = newBuildButton;
                    newBuildButton.addImage(getUnitImage(this_player, upgradeName));
                    buildButtons.push(newBuildButton);
                    //i++;
                    currentButtonHeight += btnSize * 1.2;
                }

                //We do this at the end so that it renders at the bottom, below all the build buttons
                if (possibleBuilds.length > 0 && possibleUpgrades.length > 0) {
                    currentButtonHeight -= btnSize * 0.1;
                    UpgradeLabel = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize*.4, "#C50", "Upgrade", function(){});
                    UpgradeLabel.fontSize = btnSize * .25
                    ButtonCollection["Upgrade Label"] = UpgradeLabel
                    
                }
            }

            if (selected.possibleStates.includes("transport") && selected.carrying != undefined) {
                let possibleBuilds = selected.carrying
                
                let btnSize = 50
                if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
                    btnSize = 120
                }


                //For labels above and below buidld and upgrade buttons
                let buttonLabelSize = btnSize * .5

                let btnCount = possibleBuilds.length
                let combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2 + buttonLabelSize
                let btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2) 
                if (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources) {
                    while (btnHeightStart < resourceBoxHeight + statBoxHeight + heightforResources && btnSize > 20) {
                        btnSize -= 10
                        combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2 + buttonLabelSize
                        btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2)
                    }
                }

                let currentButtonHeight = 0

                if (possibleBuilds.length > 0) {
                    TransportLabel = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize*.4, "#090", "Transport", function(){});
                    TransportLabel.fontSize = btnSize * .23
                    ButtonCollection["Transport Label"] = TransportLabel
                    currentButtonHeight += btnSize * 0.5;
                }

                //let i = 0
                for (let unit of possibleBuilds) {
                    let unitName = unit.name
                    let color = "#32E632"

                    if (selected.cloaked != undefined) { //Show Navy background if cloaked
                        color = "#00278F"
                    }
                    
                    //let newBuildButton = new Button(0, btnHeightStart + (btnSize * 1.2)*i, btnSize, btnSize, color, "", transportButtonClicked);
                    let newBuildButton = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize, color, "", transportButtonClicked);
                    newBuildButton.name = unitName
                    newBuildButton.parameters = newBuildButton;
                    newBuildButton.addImage(getUnitImage(this_player, unitName));
                    buildButtons.push(newBuildButton);
                    //i++;
                    currentButtonHeight += (btnSize * 1.2)
                }
            }
            
        } else {
            //clearSelected()
            if (enemySelected) {
                continueShowingAnimations = false;
                enemySelectedPlayer = getPlayerfromUnit(enemySelected)
                if (enemySelectedPlayer != "neutral") {
                   possibleAttacks = getAttacks(enemySelected, enemySelectedPlayer);
                }
                buildPopup(enemySelected.name, enemySelectedPlayer)
            } else {
                clearSelected()
            }
        }
        
    }
    drawBoard();
}