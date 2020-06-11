let r = 10;
let enabled = true;
let autohide = false;
let timeout = 2000;
let timeoutId;
const segments = [];
const container = document.createElement("div");
container.id = "__mouse-pet-container";

let mouseX = 0;
let mouseY = 0;

// Moves and rotates a segment so that its nearest point touches the target position
function moveSegment(xi, yi, xf, yf, r1, r2) {
	// Angle between center and target
	let a = Math.atan2(yf - yi, xf - xi);
	// Target, minus radius (in direction of angle), adjusted for top left corner
	x = xf - (r1 + r2) * Math.cos(a);
	y = yf - (r1 + r2) * Math.sin(a);
	return { x, y, a };
}

// Moves the whole pet so as to follow the target
function move(xf, yf) {
	let r2 = 0;
	for (segment of segments) {
		let { x, y, a } = moveSegment(segment.x, segment.y, xf, yf, r, r2);
		segment.x = x;
		segment.y = y;
		segment.el.style.setProperty("--x", `${x}px`);
		segment.el.style.setProperty("--y", `${y}px`);
		segment.el.style.setProperty("--a", `${a}rad`);
		xf = x;
		yf = y;
		r2 = r;
	}
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
			r = petSize / 2;
			container.style.setProperty("--size", `${petSize}px`);
			container.style.setProperty(
				"--image",
				`url(${browser.runtime.getURL(`skins/${petSkin}`)})`
			);
			container.style.setProperty("--opacity", petOpacity);
			if (!petEnabled) container.classList.add("disabled");
			autohide = petAutoHide;
			timeout = petAutoHideTimeout * 1000;

			for (let i = 0; i < petLength; i++) {
				const segment = document.createElement("div");
				container.prepend(segment);
				segments.push({ x: 0, y: 0, el: segment });
			}

			document.body.appendChild(container);

			document.addEventListener("mousemove", (e) => {
				if (!enabled) return;
				mouseX = e.clientX;
				mouseY = e.clientY;
				move(e.clientX - r, e.clientY - r);
				if (autohide) {
					if (timeoutId) {
						clearTimeout(timeoutId);
						container.classList.remove("hidden");
					}
					timeoutId = setTimeout(
						() => container.classList.add("hidden"),
						timeout
					);
				}
			});
		}
	);

browser.storage.onChanged.addListener((changes) => {
	if ("petAutoHide" in changes) {
		autohide = changes.petAutoHide.newValue;
		if (!autohide) container.classList.remove("hidden");
		else
			timeoutId = setTimeout(() => container.classList.add("hidden"), timeout);
	}
	if ("petAutoHideTimeout" in changes)
		timeout = changes.petAutoHideTimeout.newValue * 1000;
	if ("petOpacity" in changes)
		container.style.setProperty("--opacity", changes.petOpacity.newValue);
	if ("petEnabled" in changes) {
		enabled = changes.petEnabled.newValue;
		if (enabled) container.classList.remove("disabled");
		else container.className = "disabled";
	}
	if ("petSize" in changes) {
		r = changes.petSize.newValue / 2;
		container.style.setProperty("--size", `${changes.petSize.newValue}px`);
		move(mouseX, mouseY);
	}
	if ("petLength" in changes) {
		const diff = changes.petLength.newValue - segments.length;
		if (diff > 0) {
			for (let i = 0; i < diff; i++) {
				const segment = document.createElement("div");
				container.prepend(segment);
				segments.push({ x: 0, y: 0, el: segment });
			}
		} else {
			for (let i = 0; i < -diff; i++) {
				segments[segments.length - 1].el.remove();
				segments.pop();
			}
		}
		move(mouseX, mouseY);
	}
	if ("petSkin" in changes) {
		container.style.setProperty(
			"--image",
			`url(${browser.runtime.getURL(`skins/${changes.petSkin.newValue}`)})`
		);
	}
});
