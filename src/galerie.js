const API_KEY = "AIzaSyBBlF2D1mftbAYFwRzaTomYqae6QOZFyH4";
const FOLDER_ID = "1mQyuSWXdds_uH_0m9UdmGEWcoWsi-sQd";

let galleryImages = [];
let currentIndex = 0;

async function fetchAllImages() {
  const images = [];
  let pageToken = "";

  do {
    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("q", `'${FOLDER_ID}' in parents and mimeType contains 'image/'`);
    url.searchParams.set("fields", "nextPageToken, files(id, name)");
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(`Drive API Fehler ${data.error.code}: ${data.error.message}`);
    }

    console.log("Drive API Antwort:", data);
    if (data.files) images.push(...data.files);
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return images;
}

function driveThumb(id, size = "w600") {
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}

function renderGallery(images) {
  const container = document.getElementById("galerie-container");

  const section = document.createElement("section");
  section.className = "galerie-album";
  section.id = "pfila-2026";

  section.innerHTML = `
    <div class="album-header">
      <div class="album-header-left">
        <h2>Pfila 2026</h2>
        <span class="album-badge"><i class="fa-solid fa-tent"></i> Lager</span>
        <span class="album-count"><i class="fa-solid fa-images"></i> ${images.length} Fotos</span>
      </div>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "photo-grid";

  images.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "photo-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Foto öffnen: ${file.name}`);

    item.innerHTML = `
      <img src="${driveThumb(file.id, "w400")}" alt="${file.name}" loading="lazy">
      <div class="photo-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
    `;

    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });

    grid.appendChild(item);
  });

  section.appendChild(grid);
  container.appendChild(section);
}

function openLightbox(index) {
  currentIndex = index;
  const file = galleryImages[index];
  const lbImg = document.getElementById("lb-img");

  lbImg.src = driveThumb(file.id, "w1600");
  document.getElementById("lb-caption").textContent = file.name;
  document.getElementById("lb-counter").textContent = `${index + 1} / ${galleryImages.length}`;
  document.getElementById("lightbox").classList.add("active");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
}

function navigate(direction) {
  currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
  const lbImg = document.getElementById("lb-img");
  lbImg.classList.add("fading");
  setTimeout(() => {
    openLightbox(currentIndex);
    lbImg.classList.remove("fading");
  }, 150);
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("galerie-container");
  container.innerHTML =
    '<p style="text-align:center;padding:2rem;color:var(--text-muted)">Bilder werden geladen…</p>';

  try {
    galleryImages = await fetchAllImages();
    container.innerHTML = "";

    if (galleryImages.length === 0) {
      container.innerHTML =
        '<p style="text-align:center;padding:2rem">Keine Bilder gefunden.</p>';
      return;
    }

    renderGallery(galleryImages);
  } catch (err) {
    console.error("Galerie konnte nicht geladen werden:", err);
    container.innerHTML =
      '<p style="text-align:center;padding:2rem;color:var(--primary-red)">Fehler beim Laden der Bilder.</p>';
  }

  document.querySelector(".lb-close").addEventListener("click", closeLightbox);
  document.querySelector(".lb-prev").addEventListener("click", () => navigate(-1));
  document.querySelector(".lb-next").addEventListener("click", () => navigate(1));

  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("active")) return;
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "Escape") closeLightbox();
  });
});
