// ===== Galerie Lightbox =====

document.addEventListener('DOMContentLoaded', () => {

const lightbox     = document.getElementById('lightbox');
if (!lightbox) return; // not on the gallery page

const lbImg        = document.getElementById('lb-img');
const lbCaption    = document.getElementById('lb-caption');
const lbCounter    = document.getElementById('lb-counter');
const lbClose      = document.querySelector('.lb-close');
const lbPrev       = document.querySelector('.lb-prev');
const lbNext       = document.querySelector('.lb-next');
const lbImageWrap  = document.querySelector('.lb-image-wrap');

let album        = [];
let currentIndex = 0;
let isZoomed     = false;

// ----- Open / Close -----

function openLightbox(items, index) {
    album        = items;
    currentIndex = index;
    renderImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (isZoomed) { resetZoom(); return; }
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ----- Render -----
function renderImage() {
    const item = album[currentIndex];
    lbImg.classList.add('fading');

    setTimeout(() => {
        lbImg.src           = item.src;
        lbImg.alt           = item.alt;
        lbCaption.textContent = item.caption;
        lbCounter.textContent = `${currentIndex + 1} / ${album.length}`;
        lbPrev.disabled     = currentIndex === 0;
        lbNext.disabled     = currentIndex === album.length - 1;
        resetZoom(false);
        lbImg.classList.remove('fading');
        hasTimeout = null;
    }, 120);
}

// ----- Navigate -----
let hasTimeout = null;

function navigate(dir) {    
    if (!hasTimeout) {
        hasTimeout = setTimeout(() => {
            const next = currentIndex + dir;
            if (next < 0 || next >= album.length) return;
            currentIndex = next;
            renderImage();
            hasTimeout = null;
        }, 50);
    }
}

// ----- Zoom -----

function resetZoom(transition = true) {
    isZoomed = false;
    if (!transition) lbImg.style.transition = 'none';
    lbImg.style.transform       = 'scale(1)';
    lbImg.style.transformOrigin = 'center center';
    lbImg.classList.remove('zoomed');
    // re-enable transition on next frame
    if (!transition) requestAnimationFrame(() => {
        lbImg.style.transition = '';
    });
}

lbImg.addEventListener('click', (e) => {
    if (!isZoomed) {
        const rect = lbImg.getBoundingClientRect();
        const x    = ((e.clientX - rect.left)  / rect.width)  * 100;
        const y    = ((e.clientY - rect.top)   / rect.height) * 100;
        lbImg.style.transformOrigin = `${x}% ${y}%`;
        lbImg.style.transform       = 'scale(2.6)';
        lbImg.classList.add('zoomed');
        isZoomed = true;
    } else {
        resetZoom();
    }
});

// Pan while zoomed: update transform-origin on mousemove
lbImg.addEventListener('mousemove', (e) => {
    if (!isZoomed) return;
    const rect = lbImg.getBoundingClientRect();
    const x    = ((e.clientX - rect.left)  / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)   / rect.height) * 100;
    lbImg.style.transformOrigin = `${x}% ${y}%`;
});

// ----- Touch: swipe left/right to navigate -----

let touchStartX  = 0;
let touchStartY  = 0;
let didSwipe     = false;

lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    didSwipe    = false;
}, { passive: true });

lightbox.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1 || isZoomed) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > 12 && dx > dy) didSwipe = true;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    if (!didSwipe || isZoomed) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 48) navigate(dx < 0 ? 1 : -1);
});

// ----- Keyboard -----

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'Escape')     closeLightbox();
});

// ----- Button listeners -----

lbClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom(false);
});

lbPrev.addEventListener('click', () => navigate(-1));
lbNext.addEventListener('click', () => navigate(1));

// Close on backdrop click (not on image / buttons)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbImageWrap) closeLightbox();
});

// ----- Wire up all photo grids -----

document.querySelectorAll('.galerie-album').forEach((albumEl) => {
    const items = Array.from(albumEl.querySelectorAll('.photo-item')).map((item) => ({
        src:     item.dataset.fullSrc || item.querySelector('img').src,
        alt:     item.querySelector('img').alt,
        caption: item.dataset.caption || '',
    }));

    albumEl.querySelectorAll('.photo-item').forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('click', () => openLightbox(items, index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(items, index);
            }
        });
    });
});

}); // DOMContentLoaded