const big = document.getElementById('big');
const rectangle = document.getElementById('rectangle');
const circle = document.getElementById('circle');
const newCanv = document.createElement('canvas');
const newCtx = newCanv.getContext('2d');
const bCtx = big.getContext('2d');
const rCtx = rectangle.getContext('2d');
const cCtx = circle.getContext('2d');

const datas = [];

const mouse = {
    x: 0,
    y: 0
};

const limits = {
    top: big.offsetTop,
    right: big.offsetWidth + big.offsetLeft - rectangle.offsetWidth,
    bottom: big.offsetHeight + big.offsetTop - rectangle.offsetHeight,
    left: big.offsetLeft
};

let isMouseDown = false;

let counter = 0;

let selected = null;

let cordX, cordY, imageData;

function init() {
    drawRect();
    drawCircle();
}

function drawRect() {
    rCtx.fillStyle = 'blue';
    rCtx.fillRect(0, 0, rectangle.width, rectangle.height);
}

function drawCircle() {
    cCtx.fillStyle = 'green';
    cCtx.beginPath();
    cCtx.ellipse(circle.width / 2, circle.height / 2, 70, 150, Math.PI / 2, 0, 2 * Math.PI);
    cCtx.fill();
}

const isCursorInRect = function(figure) {
    const isDrag = mouse.x > figure.x && mouse.x < figure.x + figure.w && mouse.y > figure.y && mouse.y < figure.y + figure.h;
    return isDrag;
}

function draw() {
    bCtx.clearRect(0, 0, big.width, big.height);
    bCtx.strokeStyle = 'red';
    bCtx.lineWidth = 3;

    for(let i in datas) {
        bCtx.putImageData(datas[i].imageData, datas[i].x, datas[i].y);

        if(isCursorInRect(datas[i])) {
            bCtx.strokeRect(datas[i].x, datas[i].y, datas[i].w, datas[i].h);
        }
    }

    if(selected) {
        datas.splice(datas.findIndex(item => item.id === selected.id), 1);
        datas.push(selected);
        bCtx.strokeRect(selected.x, selected.y, selected.w, selected.h);
    }
}

window.onmousemove = function(e) {
    mouse.x = e.clientX - big.offsetLeft;
    mouse.y = e.clientY - big.offsetTop;
    if(selected && isMouseDown) {
        const newLocation = {
            x: limits.left,
            y: limits.top
        };
        if (e.clientX > limits.right) {
            newLocation.x = limits.right;
        } else if (e.clientX > limits.left) {
            newLocation.x = e.clientX;
        }
        if (e.clientY > limits.bottom) {
            newLocation.y = limits.bottom;
        } else if (e.clientY > limits.top) {
            newLocation.y = e.clientY;
        }
        selected.x = newLocation.x - big.offsetLeft;
        selected.y = newLocation.y - big.offsetTop;
        newCanv.style.position = 'absolute';
        newCanv.style.zIndex = '1000';
        newCanv.style.left = `${e.clientX}px`;
        newCanv.style.top = `${e.clientY}px`;
        newCtx.putImageData(selected.imageData, 0, 0);      
        document.body.append(newCanv);
    }
    draw();
};

big.onmousedown = function() {
    for(let i in datas) {
        if(isCursorInRect(datas[i])) {
            selected = datas[i];
        }
    }
    isMouseDown = true;
};

document.addEventListener('keydown', e => {
    if(e.code === 'Delete' && selected) {
        datas.splice(datas.findIndex(item => item.id === selected.id), 1);
        selected = null;
    }
});

window.onmouseup = function(e) {
    if(e.target !== big && selected) {
        const ind = datas.findIndex(item => item.id === selected.id);
        datas.splice(ind, 1);
        selected = null;
        newCanv.remove();
    }
    isMouseDown = false;
};

window.onload = () => {
    init();
};

rectangle.addEventListener('dragstart', (e) => {
    imageData = rCtx.getImageData(0, 0, rectangle.width, rectangle.height);
    cordX = e.clientX - rectangle.getBoundingClientRect().left;
    cordY = e.clientY - rectangle.getBoundingClientRect().top;
});

circle.addEventListener('dragstart', (e) => {
    imageData = cCtx.getImageData(0, 0, circle.width, circle.height);
    cordX = e.clientX - circle.getBoundingClientRect().left;
    cordY = e.clientY - circle.getBoundingClientRect().top;
});

big.addEventListener('dragover', e => {
    e.preventDefault();
});

big.addEventListener('drop', e => {
    const x = e.clientX - big.offsetLeft - cordX;
    const y = e.clientY - big.offsetTop - cordY;
    datas.push({ 
        imageData,
        x,
        y,
        h: imageData.height,
        w: imageData.width,
        id: counter++
    });

    draw();
});
