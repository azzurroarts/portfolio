// script.js

// CSV file in the same folder
const csvFile = 'art.csv';

let artData = [];

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

function renderGallery(filter) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  artData
    .filter(a => filter === 'All' || a.Category === filter)
    .forEach(a => {
      const img = document.createElement('img');
      img.src = a.URL;
      img.alt = a.Title;
      gallery.appendChild(img);
    });
}
