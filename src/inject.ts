const SIZE = 20;

const angles: number[] = [];

// Setup canvas
const container = document.createElement("div");
container.id = "mouse-pet-container";
document.body.appendChild(container);

browser.storage.sync.get({
  petEnabled: true,
  petLength: 10,
  petSkin: "snake.png",
}).then((options) => {

  container.style.display = options.petEnabled ? "block" : "none";

  // Setup bodyparts
  for (let i = 0; i < options.petLength; i++) {
    angles.push(0);
    const bodypart = document.createElement("div");
    bodypart.style.width = bodypart.style.height = `${SIZE}px`;
    bodypart.style.backgroundImage = `url(${browser.extension.getURL(`skins/${options.petSkin}`)})`;

    if (i === 0)
      bodypart.style.backgroundPositionX = `-${SIZE * 2}px`;
    else if (i !== options.petLength - 1)
      bodypart.style.backgroundPositionX = `-${SIZE}px`;

    container.appendChild(bodypart);
  }

  // Update bodyparts on change
  browser.storage.onChanged.addListener((changes) => {

    if (changes.petEnabled)
      container.style.display = changes.petEnabled.newValue ? "block" : "none";

    if (changes.petLength) {
      const sizeChange = changes.petLength.newValue - changes.petLength.oldValue;
      if (sizeChange > 0) {
        (container.lastChild as HTMLDivElement).style.backgroundPositionX = `-${SIZE}px`;
        for (let i = 0; i < sizeChange; i++) {
          angles.push(0);
          const bodypart = document.createElement("div");
          bodypart.style.width = bodypart.style.height = `${SIZE}px`;
          bodypart.style.backgroundPositionX = `-${SIZE}px`;
          bodypart.style.backgroundImage = `url(${browser.extension.getURL(`skins/${options.petSkin}`)})`;
          container.appendChild(bodypart);
        }
        (container.lastChild as HTMLDivElement).style.backgroundPositionX = "0";
      } else {
        for (let i = sizeChange; i < 0; i++) {
          angles.pop();
          (container.lastChild as HTMLDivElement).remove();
        }
        (container.lastChild as HTMLDivElement).style.backgroundPositionX = "0";
      }
    }

    if (changes.petSkin) {
      for (const bodypart of container.children) {
        (bodypart as HTMLDivElement).style.backgroundImage =
          `url(${browser.extension.getURL(`skins/${changes.petSkin.newValue}`)})`;
      }
    }

  });
});

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

function draw(r: number, phi: number) {
  // This basically shifts all body parts back by 1 and adds the new one
  angles.pop();
  angles.unshift(phi);

  // With these variables we will accumulate the offset between body parts
  let offsetX = x, offsetY = y;

  // Now we just render each bodypart
  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
    const element = container.children[i] as HTMLDivElement;

    element.style.transform = `
      translate(${offsetX - SIZE / 2}px, ${offsetY - SIZE / 2}px)
      rotate(${angle}rad)
    `;

    offsetX -= SIZE * Math.cos(angle);
    offsetY -= SIZE * Math.sin(angle);
  }
  dx = dy = 0;
}
