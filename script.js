const canvas = document.querySelector("canvas"),

ctx = canvas.getContext("2d");

let brushWidth=5;

let isDrawing=false;

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDraw = () =>{
    isDrawing=true; // start drawing on clicking right mouse key only
    ctx.beginPath(); // start drawing
    ctx.lineWidth = brushWidth; // setting line width
    ctx.strokeStyle = "black"; // setting line color
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);   // creating line according to the mouse pointer
    ctx.stroke();   // drawing/filing line with color
}
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false); // when key is lifted it stop drawing.