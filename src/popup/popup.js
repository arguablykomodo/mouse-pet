const enabled = document.getElementById("enabled");
enabled.addEventListener("change", () => {
	browser.storage.sync.set({ petEnabled: enabled.checked });
});

const autohide = document.getElementById("autohide");
autohide.addEventListener("change", () => {
	browser.storage.sync.set({ petAutoHide: autohide.checked });
});

const pad = (s) => s.padStart(2, "0");

const o = document.getElementById("o");
const oOut = document.querySelector("output[for=o] span");
o.addEventListener("input", () => {
	oOut.textContent = o.value * 100;
	browser.storage.sync.set({ petOpacity: parseFloat(o.value) });
});

const t = document.getElementById("t");
const tOut = document.querySelector("output[for=t] span");
t.addEventListener("input", () => {
	tOut.textContent = pad(t.value);
	browser.storage.sync.set({ petAutoHideTimeout: parseInt(t.value) });
});

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

const skins = document.querySelectorAll('input[type=radio][name="skin"]');
for (skin of skins) {
	skin.addEventListener("change", (e) => {
		if (e.target.checked) {
			browser.storage.sync.set({ petSkin: e.target.value });
		}
	});
}

browser.storage.sync
	.get({
		petEnabled: true,
		petAutoHide: false,
		petAutoHideTimeout: 2,
		petOpacity: 1,
		petLength: 10,
		petSize: 20,
		petSkin: "snake.svg",
	})
	.then(
		({
			petEnabled,
			petAutoHide,
			petAutoHideTimeout,
			petOpacity,
			petLength,
			petSize,
			petSkin,
		}) => {
			enabled.checked = petEnabled;
			autohide.checked = petAutoHide;
			t.value = petAutoHideTimeout;
			tOut.textContent = pad(petAutoHideTimeout.toString());
			o.value = petOpacity;
			oOut.textContent = petOpacity * 100;
			n.value = petLength;
			nOut.textContent = pad(petLength.toString());
			d.value = petSize;
			dOut.textContent = pad(petSize.toString());
			document.querySelector(
				'input[type=radio][name="skin"]:checked'
			).checked = false;
			document.querySelector(
				`input[type=radio][name="skin"][value="${petSkin}"]`
			).checked = true;
		}
	);
