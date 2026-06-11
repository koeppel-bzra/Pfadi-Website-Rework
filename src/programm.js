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

// --- Besammlungsorte Map ---
const mapEl = document.getElementById('bso-map');
if (mapEl && typeof L !== 'undefined') {
    const orte = [
        { name: 'Altbad, Ernetschwil',                  lat: 47.2381911, lng: 8.9849133 },
        { name: 'Schulhaus, Ernetschwil',               lat: 47.2369704, lng: 9.0011865 },
        { name: 'Pfadihaus Schlatt, Ernetschwil',       lat: 47.2406273, lng: 9.0052283 },
        { name: 'Watti / Hof, Gommiswald',              lat: 47.2365378, lng: 9.0142031 },
        { name: 'Parkplatz Gauenhof, Gommiswald',       lat: 47.2336766, lng: 9.0198791 },
        { name: 'Parkplatz Treubund, Gommiswald',       lat: 47.2297758, lng: 9.0226669 },
        { name: 'Parkplatz Säge, Uetliburg',            lat: 47.2396192, lng: 9.0269785 },
        { name: 'Postautowendeplatz Giegen, Uetliburg', lat: 47.231747,  lng: 9.038424  },
        { name: 'Parkplatz Rittmarren',                 lat: 47.2549745, lng: 9.0403091 },
        { name: 'Parkplatz Schweizerhaus',              lat: 47.2629169, lng: 9.0447915 },
        { name: 'Bahnhof Uznach',                       lat: 47.2244957, lng: 8.9801608 },
    ];

    const map = L.map('bso-map', { scrollWheelZoom: false });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
    }).addTo(map);

    const markerIcon = L.divIcon({
        className: 'bso-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
    });

    const listEl = document.getElementById('bso-list');

    const markers = orte.map((ort) => {
        const mapsUrl = `https://www.google.com/maps?q=${ort.lat},${ort.lng}`;
        const marker = L.marker([ort.lat, ort.lng], { icon: markerIcon }).addTo(map);

        marker.bindPopup(
            `<div class="bso-popup"><strong>${ort.name}</strong>` +
            `<a href="${mapsUrl}" target="_blank" rel="noopener">` +
            `<i class="fa-solid fa-location-dot"></i> In Google Maps öffnen</a></div>`
        );

        if (listEl) {
            const li = document.createElement('li');
            li.className = 'bso-list-item';
            li.innerHTML = `<i class="fa-solid fa-location-dot"></i><span>${ort.name}</span>`;
            li.addEventListener('click', () => {
                map.setView([ort.lat, ort.lng], 16);
                marker.openPopup();
            });
            listEl.appendChild(li);
        }

        return marker;
    });

    const bounds = L.latLngBounds(orte.map((o) => [o.lat, o.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });

    // Leaflet kann die Container-Grösse beim ersten Render falsch berechnen;
    // invalidateSize() erzwingt eine Neuberechnung nach dem Layout.
    requestAnimationFrame(() => map.invalidateSize());
}