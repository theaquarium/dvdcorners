window.addEventListener('load', () => {
	const logo = document.querySelector('#logo');

	let paused = false;

	let dragging = false;
	let offsetTop = 0;
	let offsetLeft = 0;
	let logoDims = logo.getBoundingClientRect();
	let oldWindowHeight = window.innerHeight;
	let oldWindowWidth = window.innerWidth;

	let arcing = false;
	let invertSine = false;
	let verticalArc = false;

	logo.style.fill = randomColor();

	logo.style.left = "100px";
	logo.style.top = "100px";

	logo.addEventListener('pointerdown', e => {
		dragging = true;

		logoDims = logo.getBoundingClientRect();

		offsetLeft = e.clientX - logoDims.left;
		offsetRight = logoDims.right - e.clientX;
		offsetBottom = logoDims.bottom - e.clientY;
		offsetTop = e.clientY - logoDims.top;
	});

	document.addEventListener('pointermove', e => {
		if (dragging) {
			const topBoundary = 50;
			const leftBoundary = 50;
			const bottomBoundary = window.innerHeight - 50;
			const rightBoundary = window.innerWidth - 50;

			if (e.clientY - offsetTop > topBoundary  && e.clientY + offsetBottom < bottomBoundary) {
				logo.style.top = (e.clientY - offsetTop) + "px";
				arcing = false;
			}
			if (e.clientX - offsetLeft > leftBoundary && e.clientX + offsetRight < rightBoundary) {
				logo.style.left = (e.clientX - offsetLeft) + "px";
				arcing = false;
			}
		}
	});

	document.addEventListener('pointerup', e => {
		dragging = false;
		last = Date.now();
	});

	let speed = Math.max(window.innerWidth, window.innerHeight) / 5;
	let arcHeight = Math.min(window.innerWidth, window.innerHeight) / 10;

	let farX = Math.floor(Math.random() * 2) === 1;
	let farY = Math.floor(Math.random() * 2) === 1;

	let targetX = farX ? window.innerWidth - logoDims.width : 0;
	let targetY = farY ? window.innerHeight - logoDims.height : 0;
	let yMod = 0;
	let xMod = 0;

	let last = Date.now();

	const moveBox = () => {
		if (dragging === false && paused === false) {
			logoDims = logo.getBoundingClientRect();
			const now = Date.now();
			const diff = now - last;
			last = now;

			const oldXMod = xMod;
			const oldYMod = yMod;

			const distTotal = Math.sqrt(Math.pow(targetX - (logoDims.left - oldXMod), 2) + Math.pow(targetY - (logoDims.top - oldYMod), 2));
			const dist = speed * (diff / 1000.0);
			const ratio = dist / distTotal;
			const distX = ratio * (targetX - (logoDims.left - oldXMod));
			const distY = ratio * (targetY - (logoDims.top - oldYMod));

			if (arcing) {
				const sign = invertSine ? -1 : 1;
				if (verticalArc) {
					xMod = sign * arcHeight * Math.sin(Math.PI * (logoDims.top / (window.innerHeight - logoDims.height)));
					yMod = 0;
				} else {
					yMod = sign * arcHeight * Math.sin(Math.PI * (logoDims.left / (window.innerWidth - logoDims.width)));
					xMod = 0;
				}
			} else {
				yMod = 0;
				xMod = 0;
			}

			if (distTotal > 2) {
				logo.style.top = (distY + logoDims.top + yMod - oldYMod) + "px";
				logo.style.left = (distX + logoDims.left + xMod - oldXMod) + "px";
			} else {
				const oldFarX = farX;
				const oldFarY = farY;

				farX = Math.floor(Math.random() * 2) === 1;
				farY = Math.floor(Math.random() * 2) === 1;

				while (farX === oldFarX && farY === oldFarY) {
					farX = Math.floor(Math.random() * 2) === 1;
					farY = Math.floor(Math.random() * 2) === 1;
				}

				if (farX === oldFarX) {
					arcing = true;
					verticalArc = true;
					invertSine = farX;
				} else if (farY === oldFarY) {
					arcing = true;
					verticalArc = false;
					invertSine = farY;
				} else {
					// Disable Arc	
					arcing = false;
				}
				
				const color = randomColor();
				logo.style.fill = color;

				targetX = farX ? window.innerWidth - logoDims.width : 0;
				targetY = farY ? window.innerHeight - logoDims.height : 0;
			}
		}

		requestAnimationFrame(moveBox);
	};

	requestAnimationFrame(moveBox);

	window.addEventListener('resize', () => {
		const oldLogoWidth = logoDims.width;
		const oldLogoHeight = logoDims.height;

		speed = Math.max(window.innerWidth, window.innerHeight) / 5;

		logoDims = logo.getBoundingClientRect();

		targetX = farX ? window.innerWidth - logoDims.width : 0;
		targetY = farY ? window.innerHeight - logoDims.height : 0;

		const maxWidth = Math.max(logoDims.width, oldLogoWidth);
		const maxHeight = Math.max(logoDims.height, oldLogoHeight);

		const xPercentage = logoDims.left / (oldWindowWidth - maxWidth);
		const yPercentage = logoDims.top / (oldWindowHeight - maxHeight);

		logo.style.top = (yPercentage * (window.innerHeight - maxHeight)) + 'px';
		logo.style.left = (xPercentage * (window.innerWidth - maxWidth)) + 'px';

		oldWindowWidth = window.innerWidth;
		oldWindowHeight = window.innerHeight;
		arcHeight = Math.min(window.innerWidth, window.innerHeight) / 10;
	});

	document.addEventListener('keyup', e => {
		if (e.keyCode === 32) {
			if (!paused) {
				paused = true;
			} else {
				last = Date.now();
				paused = false;
			}
		}
	});
});

const randomColor = () => {
	const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
	return colors[Math.floor(Math.random() * colors.length)];
};