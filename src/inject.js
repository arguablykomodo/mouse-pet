const container = document.createElement("div");
container.id = "__mouse-pet-container";

const r = 10;
let x = 0;
let y = 0;
const head = document.createElement("div");
container.appendChild(head);

document.body.appendChild(container);

document.addEventListener("mousemove", (e) => {
	// Angle between center and target
	let a = Math.atan2(e.clientY - (y + r), e.clientX - (x + r));
	// Target, minus radius (in direction of angle), adjusted for top left corner
	x = e.clientX - r * Math.cos(a) - r;
	y = e.clientY - r * Math.sin(a) - r;

	head.style.transform = `translate(${x}px, ${y}px) rotate(${a}rad)`;
});
