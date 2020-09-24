const big = document.getElementById('big');
const rectangle = document.getElementById('rectangle');
const circle = document.getElementById('circle');
const bCtx = big.getContext('2d');
const rCtx = rectangle.getContext('2d');
const cCtx = circle.getContext('2d');

let counter = 0;

const datas = [];

const mouse = {
    x: 0,
    y: 0
};

let selected = null;

let cordX, cordY, startX, startY, imageData;

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

window.onload = () => {
    init();
};