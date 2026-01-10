// Replace this with your published Google Sheet link
const publicSpreadsheetURL = 'PASTE_YOUR_GOOGLE_SHEET_PUBLISHED_LINK_HERE';

let artData = [];

window.addEventListener('DOMContentLoaded', init);

function init() {
  Tabletop.init({
    key: publicSpreadsheetURL,
    simpleSheet: true,
    callback: function(data, tabletop) {
      artData = data;
      renderCategories();
      renderGallery("All");
    }
  });
}

function renderCategories() {
  const categories = ["All", ...new Set(artData.map(a => a.Category))];
  const sidebar = document.getElementById("categories");
  sidebar.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.addEventListener("click", () => renderGallery(cat));
    sidebar.appendChild(btn);
  });
}

function renderGallery(filter) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  artData
    .filter(a => filter === "All" || a.Category === filter)
    .forEach(a => {
      const img = document.createElement("img");
      img.src = a.URL;
      img.alt = a.Title;
      gallery.appendChild(img);
    });
}
