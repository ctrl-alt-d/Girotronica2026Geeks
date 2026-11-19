import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import './style.css';
import { setupFlowDemo, setupSoundDemo } from './demos.js';
import geekscatLogo from '../assets/logo-classic/geekscat_logo.svg';
import girotronicaWordmark from '../assets/girotronica/girotronica_wordmark.svg';

// Every content slide gets the same footer, so it lives here instead of
// being repeated in index.html.
for (const content of document.querySelectorAll('.content-slide:not(.photo-slide) .slide-content')) {
  const footer = document.createElement('footer');
  footer.className = 'slide-footer';
  footer.innerHTML = `
    <p class="slide-footer-title">Creative coding &amp; clown computing</p>
    <div class="slide-footer-logos">
      <img class="footer-event-logo" src="${girotronicaWordmark}" alt="La Girotrònica" />
      <img class="footer-geekscat-logo" src="${geekscatLogo}" alt="Geeks.cat" />
    </div>`;
  content.append(footer);
}

// Reveal listens for keys on the document. Keep Space, Enter and the arrow
// keys inside the demo controls so they operate the control, not the deck.
for (const zone of document.querySelectorAll('.demo-controls, .pads')) {
  zone.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') event.stopPropagation();
  });
}

const deck = new Reveal({
  width: 1200,
  height: 675,
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  transition: 'slide',
  plugins: [Notes],
});

deck.initialize().then(() => {
  const demos = [setupFlowDemo(), setupSoundDemo()];
  const sync = () => {
    const current = deck.getCurrentSlide();
    for (const demo of demos) demo.setActive(current.contains(demo.root));
  };
  deck.on('slidechanged', sync);
  sync();
});
