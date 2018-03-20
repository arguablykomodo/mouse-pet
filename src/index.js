/**
 * Sets the appropiate size for the canvas
 */
function setSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Setup canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.id = "flying-mouse-canvas";
document.body.appendChild(canvas);
setSize();

/**
 * Renders everything
 * @param {number} x X coordinate of mouse
 * @param {number} y Y coordinate of mouse
 */
function draw(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(x - 5, y - 5, 10, 10);
}

document.addEventListener("mousemove", (e) => {
  draw(e.clientX, e.clientY);
});
