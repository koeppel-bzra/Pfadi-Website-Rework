// Datenschutzerklärung 

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const button = document.getElementById('accept-btn');

    if (localStorage.getItem('cookiesAccepted')) {
        banner.style.display = 'none';
    }

    button.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.style.display = 'none';
    })
})








// Hamburger

const hamburger = document.querySelector('.hamburger');
const rightNav = document.querySelector('.right-nav');

hamburger.addEventListener('click', () => {
    rightNav.classList.toggle('open');
})

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



// Scrollbar

let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
        navbar.classList.remove('hide');
    }

    else if (currentScrollY > lastScrollY) {
        navbar.classList.add('hide');
    }

    else if (currentScrollY < lastScrollY) {
        navbar.classList.remove('hide');
    }

    lastScrollY = currentScrollY;
});



// Nach-Oben Button

const oben = document.querySelector('#nach-oben');

oben.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
})



// Slideshow

const bilder = ["../images/DSC_0039.webp", "../images/DSC_0088.webp", "../images/DSC_0103.webp"];
let index = 0;

const img = document.getElementById('slideshow-images');
const leftImage = document.getElementById('left-image');
const rightImage = document.getElementById('right-image');

leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];

setInterval(() => {
    index = (index + 1) % bilder.length;
    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];

}, 8000);

const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');

backButton.addEventListener('click', () => {
    index = (index - 1 + bilder.length ) % bilder.length;
    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];
})

forwardButton.addEventListener('click', () => {
    index = (index + 1 + bilder.length ) % bilder.length;
    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];
})

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = lightbox.querySelector('.close');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
}

img.addEventListener('click', () => {
    openLightbox(img.src);
})

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
})

// Dark Mode Toggle

const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.className = 'fas fa-sun';
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});