const SIZE = 20;

const bodyParts = new Array(10).fill(0);

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

let dx = 0, dy = 0; // These variables will track the mouse movement
let x = 0, y = 0; // And these ones will track the position

document.addEventListener("mousemove", (e) => {
  dx += e.movementX; x = e.clientX;
  dy += e.movementY; y = e.clientY;

  // If we moved an entire body piece away then draw
  const distance = Math.hypot(dx, dy);
  if (distance >= SIZE / 2)
    draw(distance, Math.atan2(dy, dx));
});

/**
 * Renders the creature
 * @param {number} r distance in polar coordinates
 * @param {number} phi rotation in polar coordinates
 */
function draw(r, phi) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // This basically shifts all body parts back by 1 and adds the new one
  bodyParts.pop();
  bodyParts.unshift(phi);

  // With these variables we will accumulate the offset between body parts
  let offsetX = x, offsetY = y;

  // Now we just render each bodypart
  for (const angle of bodyParts) {
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.rotate(angle);
    ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
    ctx.restore();

    // And add to the offset
    offsetX -= SIZE * Math.cos(angle);
    offsetY -= SIZE * Math.sin(angle);
  }
  dx = dy = 0;
}
