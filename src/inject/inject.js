let r = 10;
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
	.get({ petLength: 10, petSize: 20, petSkin: "snake.svg" })
	.then(({ petLength, petSize, petSkin }) => {
		r = petSize / 2;
		container.style.setProperty("--size", `${petSize}px`);
		container.style.setProperty(
			"--image",
			`url(${browser.runtime.getURL(`skins/${petSkin}`)})`
		);

		for (let i = 0; i < petLength; i++) {
			const segment = document.createElement("div");
			container.prepend(segment);
			segments.push({ x: 0, y: 0, el: segment });
		}

		document.body.appendChild(container);

		document.addEventListener("mousemove", (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			move(e.clientX - r, e.clientY - r);
		});
	});

browser.storage.onChanged.addListener((changes) => {
	if ("petSize" in changes && "newValue" in changes.petSize) {
		r = changes.petSize.newValue / 2;
		container.style.setProperty("--size", `${changes.petSize.newValue}px`);
		move(mouseX, mouseY);
	}
	if ("petLength" in changes && "newValue" in changes.petLength) {
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
	if ("petSkin" in changes && "newValue" in changes.petSkin) {
		container.style.setProperty(
			"--image",
			`url(${browser.runtime.getURL(`skins/${changes.petSkin.newValue}`)})`
		);
	}
});
