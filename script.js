// script.js

const csvFile = 'art.csv';
let artData = [];

// Fullscreen overlay
const overlay = document.createElement('div');
overlay.className = 'fullscreen-overlay';
document.body.appendChild(overlay);

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  overlay.innerHTML = ''; // remove zoomed image
});

window.addEventListener('DOMContentLoaded', init);

function init() {
  fetch(csvFile)
    .then(response => response.text())
    .then(text => {
      artData = csvToArray(text);
      renderCategories();
      renderGallery('All');
    })
    .catch(err => console.error('Error loading CSV:', err));
}

// Convert CSV text to array of objects
function csvToArray(str, delimiter = ',') {
  const lines = str.trim().split('\n');
  const headers = lines[0].split(delimiter).map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim());
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}

// Render categories sidebar
function renderCategories() {
  const categories = ['All', ...new Set(artData.map(a => a.Category))];
  const sidebar = document.getElementById('categories');
  sidebar.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.addEventListener('click', () => renderGallery(cat));
    sidebar.appendChild(btn);
  });
}

// Render gallery
function renderGallery(filter) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  artData
    .filter(a => filter === 'All' || a.Category === filter)
    .forEach(a => {
      const img = document.createElement('img');
      img.src = a.URL;
      img.alt = a.Title;
      img.style.height = '450px';
      img.style.width = 'auto';
      img.style.cursor = 'pointer';
      img.style.transition = 'transform 0.25s ease';

      // Fullscreen click
      img.addEventListener('click', () => {
        const zoomImg = document.createElement('img');
        zoomImg.src = img.src;
        overlay.innerHTML = '';
        overlay.appendChild(zoomImg);
        overlay.classList.add('active');
      });

      gallery.appendChild(img);
    });
}
