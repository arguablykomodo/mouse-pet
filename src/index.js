const SIZE = 20;


// Setup canvas
const container = document.createElement("div");
container.id = "flying-mouse-container";
document.body.appendChild(container);

// Setup bodyparts
const angles = new Array(10).fill(0);
for (let i = 0; i < 10; i++) {
  const bodypart = document.createElement("div");
  bodypart.style.width = bodypart.style.height = `${SIZE}px`;
  bodypart.style.backgroundImage = `url(${browser.extension.getURL("skins/snake.png")})`;

  if (i === 0)
    bodypart.style.backgroundPositionX = `-${SIZE * 2}px`;
  else if (i !== 9)
    bodypart.style.backgroundPositionX = `-${SIZE}px`;

  container.appendChild(bodypart);
}

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
  // This basically shifts all body parts back by 1 and adds the new one
  angles.pop();
  angles.unshift(phi);

  // With these variables we will accumulate the offset between body parts
  let offsetX = x, offsetY = y;

  // Now we just render each bodypart
  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
    /** @type {HTMLDivElement} */
    const element = container.children[i];

    element.style.transform = `
      translate(${offsetX - SIZE / 2}px, ${offsetY - SIZE / 2}px) 
      rotate(${angle}rad)
    `;
    
    offsetX -= SIZE * Math.cos(angle);
    offsetY -= SIZE * Math.sin(angle);
  }
  dx = dy = 0;
}
