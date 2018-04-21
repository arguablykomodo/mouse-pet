import "./inject.scss";

browser.storage.sync.get({
  petAutoHide: false,
  petEnabled: true,
  petLength: 10,
  petSkin: "snake.png",
}).then((settings: OptionStorage) => {
  const SIZE = 20;
  const angles: Array<[number, number]> = [];
  let isEnabled = settings.petEnabled;
  let autoHideEnabled = settings.petAutoHide;
  let autoHideTimer: number;

  const fragment = document.createDocumentFragment();
  const container = document.createElement("div");
  container.id = "mouse-pet-container";

  container.style.setProperty(
    "--mouse-pet-image",
    `url(${browser.runtime.getURL(`skins/${settings.petSkin}`)})`,
  );

  for (let i = 0; i < settings.petLength; i++) {
    angles.push([0, 0]);
    container.appendChild(document.createElement("div"));
  }

  fragment.appendChild(container);
  document.body.appendChild(fragment);

  browser.storage.onChanged.addListener((changes) => {
    if (changes.petEnabled)
      isEnabled = changes.petEnabled.newValue;

    if (changes.petAutoHide)
      autoHideEnabled = changes.petAutoHide.newValue;

    if (changes.petSkin)
      container.style.setProperty(
        "--mouse-pet-image",
        `url(${browser.runtime.getURL(`skins/${changes.petSkin.newValue}`)})`,
      );

    if (changes.petLength) {
      const lengthChange = changes.petLength.newValue - changes.petLength.oldValue;
      if (lengthChange > 0)
        for (let i = 0; i < lengthChange; i++) {
          angles.push([0, 0]);
          container.appendChild(document.createElement("div"));
        }
      else
        for (let i = 0; i < -lengthChange; i++) {
          angles.pop();
          container.lastElementChild!.remove();
        }
    }
  });

  let dx = 0, dy = 0;
  let x = 0, y = 0;

  document.addEventListener("mousemove", (e) => {
    if (!isEnabled) return;

    dx += e.movementX; dy += e.movementY;

    const r   = Math.hypot(dx, dy);
    const phi = Math.atan2(dy, dx);

    if (r >= SIZE / 2) {
      x = e.clientX; y = e.clientY;
      draw(r, phi);
    }
  });

  function draw(r: number, phi: number) {
    clearTimeout(autoHideTimer);
    container.className = "";

    let newTurn = angles[0][1];
    if (phi > Math.PI / 2 && angles[0][0] < -Math.PI / 2)
      newTurn--;
    else if (phi < -Math.PI / 2 && angles[0][0] > Math.PI / 2)
      newTurn++;

    angles.pop();
    angles.unshift([phi, newTurn]);

    let offsetX = x, offsetY = y;
    for (let i = 0; i < angles.length; i++) {
      (container.children[i] as HTMLDivElement).style.transform =
        `translate(${offsetX - SIZE / 2}px, ${offsetY - SIZE / 2}px) ` +
        `rotate(${angles[i][1] * Math.PI * 2 + angles[i][0]}rad)`;

      offsetX -= SIZE * Math.cos(angles[i][0]);
      offsetY -= SIZE * Math.sin(angles[i][0]);
    }

    dx = dy = 0;

    if (autoHideEnabled)
      autoHideTimer = setTimeout(() => container.className = "hidden", 1000);
  }
});
