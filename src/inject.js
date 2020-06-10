const container = document.createElement("div");
container.id = "__mouse-pet-container";

const length = 10;
const r = 10;

const segments = [];
for (let i = 0; i < length; i++) {
	const segment = document.createElement("div");
	container.prepend(segment);
	segments.push({ x: 0, y: 0, el: segment });
}

document.body.appendChild(container);

function move(xi, yi, xf, yf, r1, r2) {
	// Angle between center and target
	let a = Math.atan2(yf - yi, xf - xi);
	// Target, minus radius (in direction of angle), adjusted for top left corner
	x = xf - (r1 + r2) * Math.cos(a);
	y = yf - (r1 + r2) * Math.sin(a);
	return { x, y, a };
}

document.addEventListener("mousemove", (e) => {
	let lastx = e.clientX - r;
	let lasty = e.clientY - r;
	let r2 = 0;
	for (segment of segments) {
		let { x, y, a } = move(segment.x, segment.y, lastx, lasty, r, r2);
		segment.x = x;
		segment.y = y;
		segment.el.style.setProperty("--x", `${x}px`);
		segment.el.style.setProperty("--y", `${y}px`);
		segment.el.style.setProperty("--a", `${a}rad`);
		lastx = x;
		lasty = y;
		r2 = r;
	}
});
