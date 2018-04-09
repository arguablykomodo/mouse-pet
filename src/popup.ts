async function main() {
  const petEnabled = document.getElementById("petEnabled") as HTMLInputElement;
  const petLength = document.getElementById("petLength") as HTMLInputElement;
  const petSkin = document.getElementById("petSkin") as HTMLSelectElement;

  const settings: OptionStorage = await browser.storage.sync.get({
    petEnabled: true,
    petLength: 10,
    petSkin: "snake.png",
  });

  petEnabled.checked = settings.petEnabled;
  petLength.value = settings.petLength.toString(10);
  petSkin.value = settings.petSkin;

  document.getElementById("update")!.addEventListener("click", () => {
    browser.storage.sync.set({
      petEnabled: petEnabled.checked,
      petLength: parseInt(petLength.value, 10),
      petSkin: petSkin.value,
    });
  });
}

document.addEventListener("DOMContentLoaded", main);
