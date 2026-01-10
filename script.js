const csvFile = 'art.csv';
let artData = [];

// Fullscreen overlay
const overlay = document.createElement('div');
overlay.className = 'fullscreen-overlay';
document.body.appendChild(overlay);

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');

  // Animate back to original grid position
  const img = overlay.querySelector('img');
  if (!img) return;
  const rect = img.dataset.originalRect && JSON.parse(img.dataset.originalRect);
  if (rect) {
    img.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / img.naturalWidth}, ${rect.height / img.naturalHeight})`;
  }

  setTimeout(() => overlay.innerHTML = '', 350); // remove after animation
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

// CSV to array
function csvToArray(str, delimiter = ',') {
  const lines = str.trim().split('\n');
  const headers = lines[0].split(delimiter).map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim());
    let obj = {};
    headers.forEach((header, i) => obj[header] = values[i]);
    return obj;
  });
}

// Sidebar
function renderCategories() {
  const categories = ['All', ...new Set(artData.map(a => a.Category))];
  const sidebar = document.getElementById('categories');

  // Clear buttons except title
  sidebar.querySelectorAll('button').forEach(b => b.remove());

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.addEventListener('click', () => renderGallery(cat));
    sidebar.appendChild(btn);
  });
}

// Gallery
function renderGallery(filter) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  artData
    .filter(a => filter === 'All' || a.Category === filter)
    .forEach(a => {
      const img = document.createElement('img');
      img.src = a.URL;
      img.alt = a.Title;

      // Hover zoom is in CSS
      img.addEventListener('click', e => {
        const zoomImg = document.createElement('img');
        zoomImg.src = img.src;

        // Save original position for smooth animation
        const rect = img.getBoundingClientRect();
        zoomImg.dataset.originalRect = JSON.stringify(rect);

        // Start animation from grid position
        zoomImg.style.position = 'fixed';
        zoomImg.style.left = rect.left + 'px';
        zoomImg.style.top = rect.top + 'px';
        zoomImg.style.width = rect.width + 'px';
        zoomImg.style.height = rect.height + 'px';
        zoomImg.style.transform = 'none';
        zoomImg.style.transition = 'all 0.35s ease';

        overlay.innerHTML = '';
        overlay.appendChild(zoomImg);
        overlay.classList.add('active');

        // Animate to center full screen
        requestAnimationFrame(() => {
          zoomImg.style.left = '50%';
          zoomImg.style.top = '50%';
          zoomImg.style.transform = 'translate(-50%, -50%) scale(1)';
          zoomImg.style.width = '';
          zoomImg.style.height = '';
        });
      });

      gallery.appendChild(img);
    });
}
