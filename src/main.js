import Reveal from 'reveal.js';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import './style.css';
import { createChaosBackground } from './chaos.js';
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

const deck = new Reveal({
  width: 1200,
  height: 675,
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  transition: 'slide',
});

deck.initialize().then(() => {
  // The chaos sketch is painted on the cover's background layer, which spans
  // the whole screen rather than just the 1200×675 slide.
  const cover = document.querySelector('.cover');
  const chaos = createChaosBackground(deck.getSlideBackground(cover));
  const sync = () => chaos.setActive(deck.getCurrentSlide() === cover);
  deck.on('slidechanged', sync);
  sync();
});
