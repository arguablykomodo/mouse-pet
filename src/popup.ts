import "./popup.scss";

async function main() {
  const petAutoHide = document.getElementById(
    "petAutoHide"
  ) as HTMLInputElement;
  const petEnabled = document.getElementById("petEnabled") as HTMLInputElement;
  const petLength = document.getElementById("petLength") as HTMLInputElement;
  const petSize = document.getElementById("petSize") as HTMLInputElement;
  const petSkin = document.getElementById("petSkin") as HTMLSelectElement;

  const settings: OptionStorage = await browser.storage.sync.get({
    petAutoHide: false,
    petEnabled: true,
    petLength: 10,
    petSize: 20,
    petSkin: "snake.svg"
  });

  petAutoHide.checked = settings.petAutoHide;
  petEnabled.checked = settings.petEnabled;
  petLength.value = settings.petLength.toString(10);
  petSize.value = settings.petSize.toString(10);
  petSkin.value = settings.petSkin;

  document.getElementById("update")!.addEventListener("click", () => {
    browser.storage.sync.set({
      petAutoHide: petAutoHide.checked,
      petEnabled: petEnabled.checked,
      petLength: parseInt(petLength.value, 10),
      petSize: parseInt(petSize.value, 10),
      petSkin: petSkin.value
    });
  });
}

document.addEventListener("DOMContentLoaded", main);
