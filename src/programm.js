function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    return overlay;
}

function enableZoomFor(img) {
    img.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const alreadyZoomed = img.classList.contains('zoomed-image');

        // remove any existing zoom state
        document.querySelectorAll('.zoomed-image').forEach((el) => el.classList.remove('zoomed-image'));
        document.querySelectorAll('.zoom-overlay').forEach((el) => el.remove());

        if (!alreadyZoomed) {
            const overlay = createOverlay();
            document.body.appendChild(overlay);
            img.classList.add('zoomed-image');
            // prevent scrolling while zoomed
            document.documentElement.style.overflow = 'hidden';

            // close when clicking overlay
            overlay.addEventListener('click', () => {
                img.classList.remove('zoomed-image');
                overlay.remove();
                document.documentElement.style.overflow = '';
            });

            // also close when pressing Escape
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    img.classList.remove('zoomed-image');
                    overlay.remove();
                    document.documentElement.style.overflow = '';
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        } else {
            document.documentElement.style.overflow = '';
        }
    });
}

// Initialize zoom on gallery images and card images
const selector = '.programm-gallery img, .sc-programm-child img';
document.querySelectorAll(selector).forEach((img) => enableZoomFor(img));

// Clicking outside any image will close zoom (safety)
document.addEventListener('click', () => {
    document.querySelectorAll('.zoomed-image').forEach((el) => el.classList.remove('zoomed-image'));
    document.querySelectorAll('.zoom-overlay').forEach((el) => el.remove());
    document.documentElement.style.overflow = '';
});