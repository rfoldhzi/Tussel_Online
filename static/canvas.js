let jsonText = '{"units":{"0":[{"name":"town","parent":null,"type":"building","possibleStates":["resources","build","research"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":50,"health":50,"UnitID":"0","score":450,"resourceGen":{"gold":10,"metal":10,"energy":10},"abilities":{"costly":1.75},"position":[3,3],"population":0,"maxPopulation":4}],"1":[{"name":"bot fortress","parent":null,"type":"building","possibleStates":["resources","build"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":3,"maxHealth":50,"health":50,"UnitID":"1","score":300,"resourceGen":{"gold":0,"metal":20,"energy":20},"abilities":{},"position":[3,15],"population":0,"maxPopulation":4}],"2":[{"name":"town","parent":null,"type":"building","possibleStates":["resources","build","research"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":50,"health":50,"UnitID":"2","score":450,"resourceGen":{"gold":10,"metal":10,"energy":10},"abilities":{"costly":1.75},"position":[9,9],"population":0,"maxPopulation":4}],"3":[{"name":"plant base","parent":null,"type":"building","possibleStates":["resources","build"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":8,"health":8,"UnitID":"3","score":200,"resourceGen":{"energy":10},"abilities":{"deathSpawn":"mad plant base"},"position":[15,3],"population":0,"maxPopulation":3}],"4":[{"name":"plant base","parent":null,"type":"building","possibleStates":["resources","build"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":8,"health":8,"UnitID":"4","score":200,"resourceGen":{"energy":10},"abilities":{"deathSpawn":"mad plant base"},"position":[15,15],"population":0,"maxPopulation":3}]},"resources":{"0":{"gold":20,"metal":0,"energy":0},"1":{"gold":20,"metal":0,"energy":0},"2":{"gold":20,"metal":0,"energy":0},"3":{"gold":20,"metal":0,"energy":0},"4":{"gold":20,"metal":0,"energy":0}},"went":{"0":false,"1":true,"2":true,"3":true,"4":true},"tech":{"0":[],"1":[],"2":[],"3":[],"4":[]},"scores":{"0":0,"1":0,"2":0,"3":0,"4":0},"progress":{"0":{},"1":{},"2":{},"3":{},"4":{}},"botmode":[],"ready":true,"started":true,"turn":0,"id":0,"mode":"halo","allai":false,"width":19,"height":19,"ai":4,"targetPlayers":4,"intGrid":[255,255,248,127,14,7,192,192,248,24,31,3,1,192,112,16,31,199,31,253,183,255,227,255,246,223,252,113,252,4,7,1,192,96,124,12,15,129,129,240,56,127,15,255,255,128]}';
let gameObject = JSON.parse(jsonText)
let ButtonCollection = [];
let doneButton;

class Button {
    constructor(x, y, width, height, color, text, func) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.text = text;
        this.func = func
    }

    render() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        fontSize = this.height - 2
        context.font = fontSize + "px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(this.text, this.x + Math.floor(this.width / 2), this.y + Math.floor(this.height * .8) + 2);
    }

    potentialMouseClick(mouseX, mouseY) {
        console.log("click checklnig");
        if (mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.height) {
            console.log("click successful");
            this.func()
            return true;
        }
        return false;
    }
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


function loadGame() {
    callback = function (responseText) {
        jsonText = responseText;
        newGameObject = JSON.parse(jsonText)
        if (gameObject.intGrid.join(',')!== newGameObject.intGrid.join(',')) {
            gameObject = newGameObject;
            generateGrid()
            generateBoardColors();
        }
        gameObject = newGameObject;
        clearSelected()
        drawBoard()
    }
    httpGetAsync("http://" + window.location.host + "/finish_turn", callback);
}





function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function randomGreen() {
    let g = Math.random() * 50 + 150;
    return rgbToHex(Math.floor(g * Math.random() * 0.5), Math.floor(g), Math.floor(g * Math.random() * 0.5));
}
function randomYellow() {
    let y = Math.random() * 55 + 175;
    return rgbToHex(Math.floor(y), Math.floor(y * (Math.random() * 0.15 + .65)), Math.floor(y * Math.random() * 0.15));
}
function randomBlue() {
    let b = Math.random() * 30 + 180;
    return rgbToHex(Math.floor(b * Math.random() * 0.2), Math.floor(b * Math.random() * 0.25 + .5), Math.floor(b));
}

function randomBlueWeighted(x) {
    let base = 13;
    let sub = ((base) * (base + 1)) / 2 - ((base - x) * ((base - x) + 1)) / 2;
    if (x > base) {
        sub = ((base) * (base + 1)) / 2 + x - base;
    }
    sub = Math.floor(sub)
    let g = Math.max(0, 180 - sub)
    let b = Math.max(0, 180 - Math.floor(sub / 2))
    return rgbToHex(Math.floor(b * Math.random() * .1 + .1), Math.floor(g * (Math.random() * .125 + .625)), b)
}

var canvas// = document.getElementById("myCanvas");
let is_dragging = false;
let maybe_dragging = false;
let startX;
let startY;
let startX_offset;
let startY_offset;
let true_startX;
let true_startY;
let true_startX_offset;
let true_startY_offset;
let x_offset = 0;
let y_offset = 0;
let size = 20;
let zoom_distance;
let start_size = 20;

let this_player = 0;
let selected = null;

var context;// = canvas.getContext('2d');
let fontSize = Math.floor(size / 2);

function clearBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let BlueCircle = new Image(size, size)
BlueCircle.src = '/static/assets/MoveCircle.png'

function drawMoveCircles() {
    for (const position of moveCircles) {
        console.log(position);
        context.drawImage(BlueCircle, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
    }
}

function drawUnits() {
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            //console.log(unit)
            draw(player, unit);
        }
    }

}

function drawBoard() {
    console.log("drawing board");
    clearBoard()

    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            let tileColor = BoardColors[x + gameObject.width * y]
            context.fillStyle = tileColor;
            context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
        }
    }
    //draw(4, 7,"bot");
    fontSize = Math.floor(size / 2);
    context.font = fontSize + "px Arial";

    context.textAlign = "right";
    drawUnits();
    drawMoveCircles()
    for (let btn of ButtonCollection) {
        btn.render();
    }
}

var intervalID = window.setInterval(myCallback, 1000);

function myCallback() {
    drawBoard();
}

function replaceColor2(srcR, srcG, srcB, dstR, dstG, dstB) {
    const im = context.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < im.data.length; i += 4) {
        //console.log(im.data[i]+ " " + im.data[i + 1] + " " + im.data[i + 2]);
        if (
            im.data[i] === srcR &&
            im.data[i + 1] === srcG &&
            im.data[i + 2] === srcB
        ) {

            im.data[i] = dstR;
            im.data[i + 1] = dstG;
            im.data[i + 2] = dstB;
        }
    }
    context.putImageData(im, 0, 0);
}


function draw(player, unit) {
    if (selected === unit) {
        context.fillStyle = "#FFFFFFBB";
    } else {
        context.fillStyle = rgbToHex(playerColors[player][0], playerColors[player][1], playerColors[player][2]) + "99";
    }
    context.fillRect(unit.position[0] * size + x_offset, unit.position[1] * size + y_offset, size, size);

    let img = getUnitImage(player, unit.name);

    if (img != null) {
        context.drawImage(img, size * unit.position[0] + x_offset, size * unit.position[1] + y_offset);
    }

    context.fillStyle = "white";
    context.fillText(unit.health, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
    /*
    var img = new Image(size, size);

    img.onload = function () {
        img.height = size;
        img.setAttribute('crossOrigin', '');
        img.crossOrigin = "Anonymous";
        context.drawImage(img, size * x + x_offset, size * y + y_offset, 20, 20);
        replaceColor(233, 19, 212, 255, 160, 0)
    };
    img.src = '/static/assets/soldier.png';
    */
}

let mouse_down = function (event) {
    event.preventDefault();
    console.log(event)

    startX = parseInt(event.clientX);
    startY = parseInt(event.clientY);
    startX_offset = x_offset;
    startY_offset = y_offset;


    maybe_dragging = true;
    //is_dragging = true;
    return;
}

let mouse_up = function (event) {
    if (!is_dragging) {
        if (maybe_dragging) {
            maybe_dragging = false;
            event.preventDefault();
            handleClick(parseInt(event.clientX), parseInt(event.clientY))
        }
        return;
    }

    event.preventDefault();
    is_dragging = false;
}

let mouse_out = function (event) {
    if (!is_dragging) {
        return;
    }

    event.preventDefault();
    is_dragging = false;
}

let mouse_move = function (event) {
    if (maybe_dragging) {
        maybe_dragging = false;
        is_dragging = true;
    }
    if (!is_dragging) {
        return;
    }

    event.preventDefault();

    let mouseX = parseInt(event.clientX);
    let mouseY = parseInt(event.clientY);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    x_offset = startX_offset + dx;
    y_offset = startY_offset + dy;

    drawBoard();
}

//Touch based events
let touch_down = function (event) {
    event.preventDefault();
    console.log(event)

    if (event.touches.length == 1) {

        startX = parseInt(event.touches[0].clientX);
        startY = parseInt(event.touches[0].clientY);
        startX_offset = x_offset;
        startY_offset = y_offset;

        true_startX = startX;
        true_startY = startY;
        true_startX_offset = startX_offset;
        true_startY_offset = startY_offset;

        maybe_dragging = true;
    } else if (event.touches.length == 2) {
        if (!is_dragging) {
            startX = parseInt(event.touches[0].clientX);
            startY = parseInt(event.touches[0].clientY);
            startX_offset = x_offset;
            startY_offset = y_offset;

            true_startX = startX;
            true_startY = startY;
            true_startX_offset = startX_offset;
            true_startY_offset = startY_offset;

            is_dragging = true;
            maybe_dragging = false;
        }
        let secondX = parseInt(event.touches[1].clientX);
        let secondY = parseInt(event.touches[1].clientY);
        zoom_distance = Math.pow((Math.pow(event.touches[0].clientX - secondX, 2) + Math.pow(event.touches[0].clientY - secondY, 2)), 0.5);
        start_size = size;
    }
    return;
}

let touch_up = function (event) {
    if (!is_dragging) {
        if (maybe_dragging) {
            maybe_dragging = false;
            event.preventDefault();
            handleClick(parseInt(startX), parseInt(startY))
        }
        return;
    }

    event.preventDefault();
    console.log(event)

    if (event.touches.length == 1) {
        startX = parseInt(event.touches[0].clientX);
        startY = parseInt(event.touches[0].clientY);
        startX_offset = x_offset;
        startY_offset = y_offset;

        true_startX = startX;
        true_startY = startY;
        true_startX_offset = startX_offset;
        true_startY_offset = startY_offset;
    } else if (event.touches.length == 0) {
        is_dragging = false;
    }

}

let touch_move = function (event) {
    if (maybe_dragging) {
        maybe_dragging = false;
        is_dragging = true;
    }
    if (!is_dragging) {
        return;
    }

    event.preventDefault();

    let mouseX = parseInt(event.touches[0].clientX);
    let mouseY = parseInt(event.touches[0].clientY);

    if (event.touches.length == 2) {
        let secondX = parseInt(event.touches[1].clientX);
        let secondY = parseInt(event.touches[1].clientY);
        let new_zoom_distance = Math.pow((Math.pow(event.touches[0].clientX - secondX, 2) + Math.pow(event.touches[0].clientY - secondY, 2)), 0.5);
        size = start_size * (new_zoom_distance / zoom_distance);

        let xBlocks = (true_startX - true_startX_offset) / start_size
        let xProjected = true_startX_offset + size * xBlocks
        let xChange = true_startX - xProjected

        startX = true_startX - xChange

        let yBlocks = (true_startY - true_startY_offset) / start_size
        let yProjected = true_startY_offset + size * yBlocks
        let yChange = true_startY - yProjected

        startY = true_startY - yChange

        //startX_offset = true_startX_offset - (true_startX-true_startX_offset) * (new_zoom_distance/zoom_distance);
        //startY_offset = true_startY_offset - (true_startY-true_startY_offset) * (new_zoom_distance/zoom_distance);

        //startX = true_startX - (true_startX-true_startX_offset) * (new_zoom_distance/zoom_distance);
        //startY = true_startY - (true_startY-true_startY_offset) * (new_zoom_distance/zoom_distance);

        unitImages = {};
    }

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    x_offset = startX_offset + dx;
    y_offset = startY_offset + dy;



    drawBoard();
}



document.addEventListener('DOMContentLoaded', function () {

    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    canvas.onmousedown = mouse_down;
    canvas.onmouseup = mouse_up;
    canvas.onmouseout = mouse_out;
    canvas.onmousemove = mouse_move;
    canvas.addEventListener("touchstart", touch_down, false);
    canvas.addEventListener("touchmove", touch_move, false);
    canvas.addEventListener("touchend", touch_up, false);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    doneButton = new Button(canvas.width - 250, canvas.height - 100, 230, 80, "#AAAAAA", "Done", loadGame);
    ButtonCollection.push(doneButton)

    canvas.addEventListener('wheel', function (event) {

        console.log(event.deltaY);

        size += Math.floor(event.deltaY / 100);

        console.log(size);

        unitImages = {};
        drawBoard();

        event.preventDefault();
    }, false);

    generateGrid()
    generateBoardColors();

    if (canvas.getContext) {
        context.fillStyle = '#fa4b2a';    // color of fill
        context.fillRect(10, 40, 140, 160); // create rectangle  


        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                context.fillStyle = randomGreen();
                context.fillRect(x * 20, y * 20, 20, 20);
            }
        }
    }
    loadGame();

    document.body.onkeyup = function (e) {
        if (e.key == " " ||
            e.code == "Space" ||
            e.keyCode == 32
        ) {
            loadGame()
        }
    }
})

