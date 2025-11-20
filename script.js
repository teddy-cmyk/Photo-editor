// Photo Editor JavaScript
// Handles upload, URL loading, filters, rotation, reset & download

const uploadInput = document.getElementById('upload');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');

// Filter controls
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturate = document.getElementById('saturation');
const blur = document.getElementById('blur');
const grayscale = document.getElementById('grayscale');
const hue = document.getElementById('hue');

const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
const resetBtn = document.getElementById('reset');
const downloadBtn = document.getElementById('download');

// URL loading controls
const urlInput = document.getElementById("image-url");
const loadUrlBtn = document.getElementById("load-url");

let img = new Image();
let rotation = 0;

// ===================================================================
// Load image from URL  (works with ANY image URL)
// ===================================================================
loadUrlBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Please paste an image URL.");
        return;
    }

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous"; // allows cross-site images

    tempImg.onload = function () {
        img = tempImg;

        imageCanvas.width = img.width;
        imageCanvas.height = img.height;

        rotation = 0; // reset rotation
        drawImageWithFilters();
    };

    tempImg.onerror = function () {
        alert("Could not load this image. The website might block external loading (CORS).");
    };

    tempImg.src = url;
});

// ===================================================================
// Load image from file upload
// ===================================================================
uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        img.onload = function () {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            rotation = 0;
            drawImageWithFilters();
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// ===================================================================
// Filters
// ===================================================================
function getFilterValues() {
    return `
        brightness(${brightness.value}%)
        contrast(${contrast.value}%)
        saturate(${saturate.value}%)
        blur(${blur.value}px)
        grayscale(${grayscale.value}%)
        hue-rotate(${hue.value}deg)
    `;
}

function drawImageWithFilters() {
    if (!img.src) return;

    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    ctx.filter = getFilterValues();
    ctx.save();

    // Move to center for rotation
    ctx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw image
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    ctx.restore();
}

// Sliders update
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', drawImageWithFilters);
});

// ===================================================================
// Rotation
// ===================================================================
rotateLeftBtn.addEventListener('click', () => {
    rotation -= 90;
    drawImageWithFilters();
});

rotateRightBtn.addEventListener('click', () => {
    rotation += 90;
    drawImageWithFilters();
});

// ===================================================================
// Reset
// ===================================================================
resetBtn.addEventListener('click', () => {
    brightness.value = 100;
    contrast.value = 100;
    saturate.value = 100;
    blur.value = 0;
    grayscale.value = 0;
    hue.value = 0;
    rotation = 0;

    drawImageWithFilters();
});

// ===================================================================
// ⭐ TEXT TOOL (Add Text at Bottom of Image Automatically)
// ===================================================================
const textInput = document.getElementById('text-input');
const textColor = document.getElementById('text-color');
const textSize = document.getElementById('text-size');
const addTextBtn = document.getElementById('add-text-btn');

addTextBtn.addEventListener("click", () => {
    if (!img.src) {
        alert("Please load an image first.");
        return;
    }
    if (!textInput.value.trim()) {
        alert("Please type something first.");
        return;
    }

    // Position text at bottom center
    const x = imageCanvas.width / 2;
    const y = imageCanvas.height - parseInt(textSize.value) - 10;

    ctx.save();
    ctx.font = `${textSize.value}px sans-serif`;
    ctx.fillStyle = textColor.value;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    ctx.fillText(textInput.value, x, y);
    ctx.restore();
});

// ===================================================================
// Download
// ===================================================================
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = imageCanvas.toDataURL();
    link.click();
});
