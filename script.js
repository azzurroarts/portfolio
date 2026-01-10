// Fullscreen overlay setup
const overlay = document.createElement('div');
overlay.className = 'fullscreen-overlay';
document.body.appendChild(overlay);

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  overlay.innerHTML = ''; // remove the zoomed image
});

// Add click event to images
function renderGallery(filter) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  artData
    .filter(a => filter === 'All' || a.Category === filter)
    .forEach(a => {
      const img = document.createElement('img');
      img.src = a.URL;
      img.alt = a.Title;

      // Fullscreen click behavior
      img.addEventListener('click', () => {
        const zoomImg = document.createElement('img');
        zoomImg.src = img.src;
        overlay.innerHTML = ''; // clear previous
        overlay.appendChild(zoomImg);
        overlay.classList.add('active');
      });

      gallery.appendChild(img);
    });
}
