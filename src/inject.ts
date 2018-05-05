import "./inject.scss";

browser.storage.sync
  .get({
    petAutoHide: false,
    petEnabled: true,
    petLength: 10,
    petSize: 20,
    petSkin: "snake.svg"
  })
  .then((settings: OptionStorage) => {
    const angles: Array<[number, number]> = [];
    let size = settings.petSize;
    let isEnabled = settings.petEnabled;
    let autoHideEnabled = settings.petAutoHide;
    let autoHideTimer: number;

    const fragment = document.createDocumentFragment();
    const container = document.createElement("div");
    container.id = "mouse-pet-container";

    container.style.setProperty(
      "--mouse-pet-image",
      `url(${browser.runtime.getURL(`skins/${settings.petSkin}`)})`
    );
    container.style.setProperty("--mouse-pet-size", `${settings.petSize}px`);

    for (let i = 0; i < settings.petLength; i++) {
      angles.push([0, 0]);
      container.appendChild(document.createElement("div"));
    }

    container.className = settings.petEnabled ? "" : "hidden";

    fragment.appendChild(container);
    document.body.appendChild(fragment);

    browser.storage.onChanged.addListener(changes => {
      if (changes.petEnabled) {
        container.className = changes.petEnabled.newValue ? "" : "hidden";
        isEnabled = changes.petEnabled.newValue;
      }

      if (changes.petAutoHide) autoHideEnabled = changes.petAutoHide.newValue;

      if (changes.petSize) {
        size = changes.petSize.newValue;
        container.style.setProperty("--mouse-pet-size", `${size}px`);
      }

      if (changes.petSkin)
        container.style.setProperty(
          "--mouse-pet-image",
          `url(${browser.runtime.getURL(`skins/${changes.petSkin.newValue}`)})`
        );

      if (changes.petLength) {
        const lengthChange =
          changes.petLength.newValue - changes.petLength.oldValue;
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

    let dx = 0,
      dy = 0;
    let x = 0,
      y = 0;

    document.addEventListener("mousemove", e => {
      if (!isEnabled) return;

      dx += e.movementX;
      dy += e.movementY;

      const r = Math.hypot(dx, dy);
      const phi = Math.atan2(dy, dx);

      if (r >= size / 2) {
        x = e.clientX;
        y = e.clientY;
        draw(r, phi);
      }
    });

    function draw(r: number, phi: number) {
      clearTimeout(autoHideTimer);
      container.className = "";

      let newTurn = angles[0][1];
      if (phi > Math.PI / 2 && angles[0][0] < -Math.PI / 2) newTurn--;
      else if (phi < -Math.PI / 2 && angles[0][0] > Math.PI / 2) newTurn++;

      angles.pop();
      angles.unshift([phi, newTurn]);

      let offsetX = x,
        offsetY = y;
      for (let i = 0; i < angles.length; i++) {
        (container.children[i] as HTMLDivElement).style.transform =
          `translate(${offsetX - size / 2}px, ${offsetY - size / 2}px) ` +
          `rotate(${angles[i][1] * Math.PI * 2 + angles[i][0]}rad)`;

        offsetX -= size * Math.cos(angles[i][0]);
        offsetY -= size * Math.sin(angles[i][0]);
      }

      dx = dy = 0;

      if (autoHideEnabled)
        autoHideTimer = setTimeout(
          () => (container.className = "hidden"),
          1000
        );
    }
  });
