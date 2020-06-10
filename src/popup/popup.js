const pad = (s) => s.padStart(2, "0");

const n = document.getElementById("n");
const nOut = document.querySelector("output[for=n] span");
n.addEventListener("input", () => {
	nOut.textContent = pad(n.value);
	browser.storage.sync.set({ petLength: parseInt(n.value) });
});

const d = document.getElementById("d");
const dOut = document.querySelector("output[for=d] span");
d.addEventListener("input", () => {
	dOut.textContent = pad(d.value);
	browser.storage.sync.set({ petSize: parseInt(d.value) });
});

browser.storage.sync
	.get({ petLength: 10, petSize: 20 })
	.then(({ petLength, petSize }) => {
		n.value = petLength;
		nOut.textContent = pad(petLength.toString());
		d.value = petSize;
		dOut.textContent = pad(petSize.toString());
	});
