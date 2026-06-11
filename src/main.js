
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
// DARK MODE
// =======================
const darkToggle = document.getElementById('dark-mode-toggle');
if (darkToggle) {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkToggle.textContent = '☀️';
    }
    darkToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        darkToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', String(isDark));
    });
}


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

        if (currentScrollY <= 0) {
            navbar.classList.remove('hide');
        } else if (currentScrollY > lastScrollY) {
            navbar.classList.add('hide');
        } else {
            navbar.classList.remove('hide');
        }

        lastScrollY = Math.max(0, currentScrollY);
    });
}


// =======================
// SLIDESHOW
// =======================
const bilder = [
    "./images/slideshow-01.webp",
    "./images/slideshow-02.webp",
    "./images/slideshow-03.webp",
    "./images/slideshow-04.jpg",
    "./images/slideshow-05.jpg",
    "./images/slideshow-06.jpg",
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