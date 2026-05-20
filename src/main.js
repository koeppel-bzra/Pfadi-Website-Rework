
// Update Padding

function udpateMainPadding() {
    const header = document.querySelector('.top-nav');
    const main = document.querySelector('main');
    if (header && main) {
        main.style.paddingTop = `${header.offsetHeight}px`
    }
}

window.addEventListener('resize', udpateMainPadding);
window.addEventListener('load', udpateMainPadding);


// =======================
// COOKIE BANNER
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const button = document.getElementById('accept-btn');

    if (banner && button) {
        if (localStorage.getItem('cookiesAccepted')) {
            banner.style.display = 'none';
        }

        button.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.style.display = 'none';
        });
    }
});


// =======================
// HAMBURGER MENU
// =======================
const hamburger = document.querySelector('.hamburger');
const rightNav = document.querySelector('.right-nav');

if (hamburger && rightNav) {
    hamburger.addEventListener('click', () => {
        rightNav.classList.toggle('open');
    });
}


// =======================
// SCROLL NAVBAR
// =======================
let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            navbar.classList.add('hide');
        } else {
            navbar.classList.remove('hide');
        }

        lastScrollY = currentScrollY;
    });
}


// =======================
// SLIDESHOW
// =======================
const bilder = [
    "./images/DSC_0039.webp",
    "./images/DSC_0088.webp",
    "./images/DSC_0103.webp",
    "./images/IMG_1867.JPG",
    "./images/IMG_2011.JPG",
    "./images/1.jpeg"
];

let index = 0;

const img = document.getElementById('slideshow-images');
const leftImage = document.getElementById('left-image');
const rightImage = document.getElementById('right-image');

function updateImages() {
    if (!img || !leftImage || !rightImage) return;

    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1) % bilder.length];
}

// Initial setzen
updateImages();

// Auto Slide
setInterval(() => {
    index = (index + 1) % bilder.length;
    updateImages();
}, 5000);


// Buttons
const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');

if (backButton) {
    backButton.addEventListener('click', () => {
        index = (index - 1 + bilder.length) % bilder.length;
        updateImages();
    });
}

if (forwardButton) {
    forwardButton.addEventListener('click', () => {
        index = (index + 1) % bilder.length;
        updateImages();
    });
}


// =======================
// LIGHTBOX
// =======================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

if (img && lightbox && lightboxImg) {
    img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
    });
}

if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
}