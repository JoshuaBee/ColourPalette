const $body = document.querySelector('body');
const $hue = document.querySelector('input');
if ($hue) {	
	$hue.value = getRandomInt(0, 360);
}

const lightnesses = [
	0.9,
	0.8,
	0.7,
	0.6,
	0.5,
	0.4,
	0.3,
	0.2,
	0.1
];
let sRGBColours = [];
let p3Colours = [];
let rec2020Colours = [];

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    viewTransition(() => {
		updateSiteColours();
	});
});
if ($hue) {
	$hue.addEventListener('input', () => {
		generatePalette();
	});
}

generatePalette();

function generatePalette() {
	sRGBColours = [];
	p3Colours = [];
	rec2020Colours = [];
	
	lightnesses.forEach(lightness => {
		let hue = $hue?.value || 0;
		let chroma = 0.4;
		let sRGBSelected = false;
		let p3Selected = false;
		let rec2020Selected = false;
		while (!(rec2020Selected && p3Selected && sRGBSelected)) {
			chroma -= 0.001;
			const color = new Color("oklch", [lightness, chroma, hue]);
			const colorString = `oklch(${lightness * 100}% ${Math.round(1000 * chroma) / 1000} ${hue})`;
	
			if (!rec2020Selected && color.inGamut("rec2020")) {
				rec2020Selected = true;
				rec2020Colours.push(colorString);
				const $rec2020Swatch = document.querySelector(`[data-gamut="rec2020"][data-lightness="${lightness * 100}%"]`);
				$rec2020Swatch.style.background = colorString;
			}
	
			if (!p3Selected && color.inGamut("p3")) {
				p3Selected = true;
				p3Colours.push(colorString);
				const $p3Swatch = document.querySelector(`[data-gamut="p3"][data-lightness="${lightness * 100}%"]`);
				$p3Swatch.style.background = colorString;
			}
	
			if (!sRGBSelected && color.inGamut("srgb")) {
				sRGBSelected = true;
				sRGBColours.push(colorString);
				const $sRGBSwatch = document.querySelector(`[data-gamut="sRGB"][data-lightness="${lightness * 100}%"]`);
				$sRGBSwatch.style.background = colorString;
			}
		}
	});
	
	viewTransition(() => {
		updateSiteColours();
		updateCodeBlock();
	});
}

function updateSiteColours() {
	if (window.matchMedia) {
		const srgb = window.matchMedia('(color-gamut: srgb)').matches;
		const p3 = window.matchMedia('(color-gamut: p3)').matches;
		const rec2020 = window.matchMedia('(color-gamut: rec2020)').matches;
		const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		
		if (dark) {
			if (rec2020) {
				$body.style.setProperty('--color-primary', rec2020Colours[4]);
				$body.style.setProperty('--color-primary-text', rec2020Colours[0]);
				$body.style.setProperty('--color-background', rec2020Colours[7]);
				$body.style.setProperty('--color-text', rec2020Colours[1]);
			} else if (p3) {
				$body.style.setProperty('--color-primary', p3Colours[4]);
				$body.style.setProperty('--color-primary-text', p3Colours[0]);
				$body.style.setProperty('--color-background', p3Colours[7]);
				$body.style.setProperty('--color-text', p3Colours[1]);
			} else if (srgb) {
				$body.style.setProperty('--color-primary', sRGBColours[4]);
				$body.style.setProperty('--color-primary-text', sRGBColours[0]);
				$body.style.setProperty('--color-background', sRGBColours[7]);
				$body.style.setProperty('--color-text', sRGBColours[1]);
			}
		} else {
			if (rec2020) {
				$body.style.setProperty('--color-primary', rec2020Colours[4]);
				$body.style.setProperty('--color-primary-text', rec2020Colours[8]);
				$body.style.setProperty('--color-background', rec2020Colours[1]);
				$body.style.setProperty('--color-text', rec2020Colours[7]);
			} else if (p3) {
				$body.style.setProperty('--color-primary', p3Colours[4]);
				$body.style.setProperty('--color-primary-text', p3Colours[8]);
				$body.style.setProperty('--color-background', p3Colours[1]);
				$body.style.setProperty('--color-text', p3Colours[7]);
			} else if (srgb) {
				$body.style.setProperty('--color-primary', sRGBColours[4]);
				$body.style.setProperty('--color-primary-text', sRGBColours[8]);
				$body.style.setProperty('--color-background', sRGBColours[1]);
				$body.style.setProperty('--color-text', sRGBColours[7]);
			}
		}
	}
}

function updateCodeBlock() {
	const codeBlock = document.querySelector('#code-block');
	if (codeBlock) {
		codeBlock.innerHTML = `
:root {
	--color-primary-1: ${sRGBColours[0]};
	--color-primary-2: ${sRGBColours[1]};
	--color-primary-3: ${sRGBColours[2]};
	--color-primary-4: ${sRGBColours[3]};
	--color-primary-5: ${sRGBColours[4]};
	--color-primary-6: ${sRGBColours[5]};
	--color-primary-7: ${sRGBColours[6]};
	--color-primary-8: ${sRGBColours[7]};
	--color-primary-9: ${sRGBColours[8]};
}

@media (color-gamut: p3) {
	:root {
		--color-primary-1: ${p3Colours[0]};
		--color-primary-2: ${p3Colours[1]};
		--color-primary-3: ${p3Colours[2]};
		--color-primary-4: ${p3Colours[3]};
		--color-primary-5: ${p3Colours[4]};
		--color-primary-6: ${p3Colours[5]};
		--color-primary-7: ${p3Colours[6]};
		--color-primary-8: ${p3Colours[7]};
		--color-primary-9: ${p3Colours[8]};
	}
}

@media (color-gamut: rec2020) {
	:root {
		--color-primary-1: ${rec2020Colours[0]};
		--color-primary-2: ${rec2020Colours[1]};
		--color-primary-3: ${rec2020Colours[2]};
		--color-primary-4: ${rec2020Colours[3]};
		--color-primary-5: ${rec2020Colours[4]};
		--color-primary-6: ${rec2020Colours[5]};
		--color-primary-7: ${rec2020Colours[6]};
		--color-primary-8: ${rec2020Colours[7]};
		--color-primary-9: ${rec2020Colours[8]};
	}
}
		`;
	}
}

function viewTransition(callback) {
	if (document.startViewTransition) {
		document.startViewTransition(() => {
			callback();
		});
	} else {
		callback();
	}
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}