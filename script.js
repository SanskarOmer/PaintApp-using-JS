const canvas = document.querySelector("canvas");

ctx = canvas.getContext("2d");
toolBtns = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fill-color");
sizeSlider = document.querySelector("#size-slider");
colorBtns = document.querySelectorAll(".colors .option");
colorPicker = document.querySelector("#color-picker");
clearCanvas = document.querySelector(".clear-canvas");
saveImg = document.querySelector(".save-img");

let prevMouseX,prevMouseY;
let isDrawing=false;
let brushWidth=5;
let selectedTool ="brush";
let selectedColor="#000"

const setBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    // setting canvas width/height offset width/height returns viewable width/height of an element. 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDraw = (e) =>{
    isDrawing=true; // start drawing on clicking right mouse key only
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.moveTo(prevMouseX, prevMouseY); // move to the point where mouse is clicked
    ctx.beginPath(); // start drawing
    ctx.lineWidth = brushWidth; // setting line width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;// setting line color
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
    // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {

    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle|
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);// added copied data to canvas

    if(selectedTool === "brush" || selectedTool === "eraser") {
        //if selected tool is eraser set color to white
        ctx.strokeStyle = selectedTool ==="eraser" ? "#fff" :selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filing line with color
    } else if(selectedTool === "rectangle"){
            drawRect(e);
    } else if(selectedTool === "circle"){
            drawCircle(e);
    }else if(selectedTool === "triangle"){
            drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
    // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
    });
});

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
    // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});


clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0,0,canvas.width,canvas.height) // to clear whole area
    setBackground();
});


saveImg.addEventListener("click", () => {
    // saving current canvas as image
    const img = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = img;
    a.download = "image.jpg";
    a.click();
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false); // when key is lifted it stop drawing.