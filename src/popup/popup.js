const enabled = document.getElementById("enabled");
enabled.addEventListener("change", () => {
	browser.storage.sync.set({ petEnabled: enabled.checked });
});

const autohide = document.getElementById("autohide");
autohide.addEventListener("change", () => {
	browser.storage.sync.set({ petAutoHide: autohide.checked });
});

const opacity = document.getElementById("opacity");
const opacityOut = document.querySelector("output[for=opacity]");
opacity.addEventListener("input", () => {
	opacityOut.textContent = `${opacity.value * 100}%`;
	browser.storage.sync.set({ petOpacity: parseFloat(o.value) });
});

const p = (s) => (s > 1 ? "s" : "");

const timeout = document.getElementById("timeout");
const timeoutOut = document.querySelector("output[for=timeout]");
timeout.addEventListener("input", () => {
	timeoutOut.textContent = `${timeout.value} second${p(timeout.value)}`;
	browser.storage.sync.set({ petAutoHideTimeout: parseInt(timeout.value) });
});

const length = document.getElementById("length");
const lengthOut = document.querySelector("output[for=length]");
length.addEventListener("input", () => {
	lengthOut.textContent = `${length.value} segment${p(length.value)}`;
	browser.storage.sync.set({ petLength: parseInt(length.value) });
});

const size = document.getElementById("size");
const sizeOut = document.querySelector("output[for=size]");
size.addEventListener("input", () => {
	sizeOut.textContent = `${size.value} pixel${p(size.value)}`;
	browser.storage.sync.set({ petSize: parseInt(size.value) });
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
			timeout.value = petAutoHideTimeout;
			timeoutOut.textContent = `${timeout.value} second${p(timeout.value)}`;
			opacity.value = petOpacity;
			opacityOut.textContent = `${opacity.value * 100}%`;
			length.value = petLength;
			lengthOut.textContent = `${length.value} segment${p(length.value)}`;
			size.value = petSize;
			sizeOut.textContent = `${size.value} pixel${p(size.value)}`;
			document.querySelector(
				'input[type=radio][name="skin"]:checked'
			).checked = false;
			document.querySelector(
				`input[type=radio][name="skin"][value="${petSkin}"]`
			).checked = true;
		}
	);
