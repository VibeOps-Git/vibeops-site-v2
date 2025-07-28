// Carousel data (add more slides as needed)
const carouselSlides = [
  {
    title: 'Castaway Crew Desktop Demo',
    video: 'https://www.youtube.com/embed/trIZD2Lwe4s?si=wIkpTjN2aVDXjxPC',
    youtubeId: 'trIZD2Lwe4s',
    caption: 'Bold design, built to mesmerize',
    link: 'https://www.castawaycrewmn.com/'
  },
  {
    title: 'Castaway Crew Mobile Demo',
    video: 'https://www.youtube.com/embed/eJlnI9NCQuU?si=-gZXhg1msHeQkPuh',
    youtubeId: 'eJlnI9NCQuU',
    caption: 'Base-Level Demo',
    link: 'https://www.castawaycrewmn.com/'
  },
  {
    title: 'EaZy Visuals Website Demo',
    video: 'https://www.youtube.com/embed/ArMIzD2MoeY?si=msg7G9dYaYRLl4DG',
    youtubeId: 'ArMIzD2MoeY',
    caption: 'A showcase of dynamic web design.',
    link: 'https://www.eazy-visuals.com/'
  }
];

// --- Service Demos Carousel Data ---
const serviceDemos = [
  {
    title: 'Roof Estimator Prototype',
    caption: 'Explore a tool that generates a bill of materials based on address inputs, showcasing potential for construction or engineering workflows.',
    link: '/roof-demo'
  },
  {
    title: 'AI Reporting Prototype',
    caption: 'Preview an AI-driven solution that creates customized reports for various industries, using field notes, inspection data, or general inputs.',
    link: '/ai-report-generator'
  },
  {
    title: 'Cost Estimation Prototype',
    caption: 'Discover a concept for rapid quoting, generating detailed cost breakdowns based on customizable inputs like size or terrain.',
    link: '/pipeline-estimator'
  },
  {
    title: 'Project Tracking Prototype',
    caption: 'Imagine real-time project oversight with interactive dashboards, showcasing Gantt charts and resource analytics tailored to your needs.',
    link: '/construction-tracker'
  }
];

const track = document.querySelector('.carousel-track');
const indicators = document.querySelector('.carousel-indicators');
const serviceTrack = document.querySelector('.service-demos-track');
const serviceIndicators = document.querySelector('.service-demos-indicators');
const leftArrow = document.querySelector('.carousel-arrow.arrow-left');
const rightArrow = document.querySelector('.carousel-arrow.arrow-right');
let currentIndex = 0;
let isTransitioning = false;

// Modal elements
const modal = document.getElementById('videoModal');
const modalVid = document.getElementById('modalVid');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalTitle = document.getElementById('modalTitle');
const modalOverlay = document.getElementById('modalOverlay');
const modalLeft = modal.querySelector('.arrow-left');
const modalRight = modal.querySelector('.arrow-right');
const closeModalBtn = modal.querySelector('.close-modal');

// Render slides
function renderSlides() {
  track.innerHTML = '';
  carouselSlides.forEach((slide, i) => {
    const card = document.createElement('div');
    card.className = 'carousel-card scale-hover';
    card.setAttribute('role', 'option');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', slide.title);
    if (i === currentIndex) card.classList.add('active');
    // Use YouTube thumbnail for non-active cards
    let mediaHtml = '';
    if (i === currentIndex) {
      mediaHtml = `<iframe
        src="${slide.video}"
        data-src="${slide.video}"
        title="${slide.title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        class="carousel-iframe"
        loading="lazy"
        tabindex="-1"
      ></iframe>`;
    } else {
      // Use YouTube's high quality thumbnail
      mediaHtml = `<div class="carousel-thumb" style="position:relative;width:100%;height:180px;cursor:pointer;background:#000;border-radius:10px;overflow:hidden;">
        <img src="https://img.youtube.com/vi/${slide.youtubeId}/hqdefault.jpg" alt="${slide.title} thumbnail" style="width:100%;height:100%;object-fit:cover;display:block;">
        <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);border-radius:50%;padding:12px 16px;">
          <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="12,8 26,16 12,24" fill="#00ffcc"/></svg>
        </span>
      </div>`;
    }
    card.innerHTML = `
      ${mediaHtml}
      <div class="carousel-caption">
        <h4>${slide.title}</h4>
        <p class="muted-text">${slide.caption}</p>
        ${slide.link ? `<a href="${slide.link}" target="_blank" rel="noopener noreferrer" class="footer-cta-text">Visit Project →</a>` : ''}
      </div>
    `;
    // Click/keyboard: open modal
    card.addEventListener('click', () => openModal(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openModal(i);
    });
    // If not active, clicking the thumbnail swaps to iframe and opens modal
    if (i !== currentIndex) {
      const thumb = card.querySelector('.carousel-thumb');
      if (thumb) {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(i);
        });
      }
    }
    track.appendChild(card);
  });
}

// Render indicators
function renderIndicators() {
  indicators.innerHTML = '';
  carouselSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-indicator' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(i);
    });
    indicators.appendChild(dot);
  });
}

function updateCarousel() {
  renderSlides();
  renderIndicators();
  // Center active card
  const cards = Array.from(track.children);
  cards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));
  if (cards[currentIndex]) {
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

// Ensure goToSlide always wraps and updates correctly
function goToSlide(idx) {
  if (isTransitioning) return;
  isTransitioning = true;
  currentIndex = ((idx % carouselSlides.length) + carouselSlides.length) % carouselSlides.length;
  updateCarousel();
  const cards = Array.from(track.children);
  if (cards[currentIndex]) {
    cards[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    // Ensure full visibility for first/last cards
    setTimeout(() => {
      const scrollX = currentIndex === 0 ? 0 : cards[currentIndex].offsetLeft - 8;
      track.scrollTo({ left: scrollX, behavior: 'smooth' });
      isTransitioning = false;
    }, 100);
  } else {
    isTransitioning = false;
  }
}

function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }

// Keyboard navigation
track.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});
document.addEventListener('keydown', (e) => {
  if (modal.style.display === 'block') {
    if (e.key === 'ArrowLeft') modalPrev();
    if (e.key === 'ArrowRight') modalNext();
    if (e.key === 'Escape') closeModal();
  }
});

// Modal logic
function openModal(idx) {
  currentIndex = idx;
  updateModal();
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  closeModalBtn.focus();
  document.body.classList.add('modal-open');
}
function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modalVid.src = '';
  modalImg.src = '';
  document.body.classList.remove('modal-open');
}
function modalPrev() { openModal((currentIndex - 1 + carouselSlides.length) % carouselSlides.length); }
function modalNext() { openModal((currentIndex + 1) % carouselSlides.length); }
function updateModal() {
  const slide = carouselSlides[currentIndex];
  modalVid.style.display = 'block';
  modalImg.style.display = 'none';
  modalVid.src = slide.video;
  modalTitle.textContent = slide.title;
  modalCaption.innerHTML = slide.caption + (slide.link ? ` <a href='${slide.link}' target='_blank' rel='noopener noreferrer' style='color:#00ffcc;text-decoration:underline;'>Visit Project →</a>` : '');
}
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
modalLeft.addEventListener('click', modalPrev);
modalRight.addEventListener('click', modalNext);
modal.addEventListener('click', (e) => e.stopPropagation());

// Accessibility: trap focus in modal
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Initial render
updateCarousel();

if (leftArrow && rightArrow) {
  leftArrow.addEventListener('click', prevSlide);
  rightArrow.addEventListener('click', nextSlide);
}

// --- Video Carousel Logic ---
(function() {
  const track = document.querySelector('.case-studies .carousel-track');
  const indicators = document.querySelector('.case-studies .carousel-indicators');
  const leftArrow = document.querySelector('.case-studies .carousel-arrow.arrow-left');
  const rightArrow = document.querySelector('.case-studies .carousel-arrow.arrow-right');
  let currentIndex = 0;
  let isTransitioning = false;
  let hasInteracted = false;

  function renderSlides() {
    track.innerHTML = '';
    carouselSlides.forEach((slide, i) => {
      const card = document.createElement('div');
      card.className = 'carousel-card scale-hover';
      card.setAttribute('role', 'option');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', slide.title);
      if (i === currentIndex) card.classList.add('active');
      let mediaHtml = '';
      if (i === currentIndex) {
        mediaHtml = `<iframe
          src="${slide.video}"
          data-src="${slide.video}"
          title="${slide.title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          class="carousel-iframe"
          loading="lazy"
          tabindex="-1"
        ></iframe>`;
      } else {
        mediaHtml = `<div class="carousel-thumb" style="position:relative;width:100%;height:180px;cursor:pointer;background:#000;border-radius:10px;overflow:hidden;">
          <img src="https://img.youtube.com/vi/${slide.youtubeId}/hqdefault.jpg" alt="${slide.title} thumbnail" style="width:100%;height:100%;object-fit:cover;display:block;">
          <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);border-radius:50%;padding:12px 16px;">
            <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="12,8 26,16 12,24" fill="#00ffcc"/></svg>
          </span>
        </div>`;
      }
      card.innerHTML = `
        ${mediaHtml}
        <div class="carousel-caption">
          <h4>${slide.title}</h4>
          <p class="muted-text">${slide.caption}</p>
          ${slide.link ? `<a href="${slide.link}" target="_blank" rel="noopener noreferrer" class="footer-cta-text">Visit Project →</a>` : ''}
        </div>
      `;
      card.addEventListener('click', () => openModal(i));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openModal(i);
      });
      if (i !== currentIndex) {
        const thumb = card.querySelector('.carousel-thumb');
        if (thumb) {
          thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(i);
          });
        }
      }
      track.appendChild(card);
    });
  }

  function renderIndicators() {
    indicators.innerHTML = '';
    carouselSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('tabindex', '0');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i, true);
      });
      indicators.appendChild(dot);
    });
  }

  function updateCarousel(scroll = false) {
    renderSlides();
    renderIndicators();
    const cards = Array.from(track.children);
    cards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));
    if (scroll && cards[currentIndex]) {
      cards[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function goToSlide(idx, user = false) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = ((idx % carouselSlides.length) + carouselSlides.length) % carouselSlides.length;
    updateCarousel(user);
    setTimeout(() => { isTransitioning = false; }, 100);
    if (user) hasInteracted = true;
  }

  function nextSlide() { goToSlide(currentIndex + 1, true); }
  function prevSlide() { goToSlide(currentIndex - 1, true); }

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', prevSlide);
    rightArrow.addEventListener('click', nextSlide);
  }

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Accessibility: allow Enter/Space to activate
  Array.from(track.children).forEach((card, i) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') goToSlide(i, true);
    });
  });

  // Initial render (no scroll)
  updateCarousel(false);
})();

// --- Service Demos Carousel Logic ---
(function() {
  const serviceTrack      = document.querySelector('.service-demos-track');
  const serviceIndicators = document.querySelector('.service-demos-indicators');
  const leftBtn           = document.querySelector('.carousel-arrow.service-demos-left');
  const rightBtn          = document.querySelector('.carousel-arrow.service-demos-right');
  let currentServiceIndex = 0;
  let cardFullWidth       = 0;

  function renderServiceDemos() {
    serviceTrack.innerHTML = '';
    serviceDemos.forEach((demo, i) => {
      const card = document.createElement('div');
      card.className = 'carousel-card scale-hover';
      card.tabIndex   = 0;
      card.innerHTML = `
        <div class="carousel-caption">
          <h4>${demo.title}</h4>
          <p class="muted-text">${demo.caption}</p>
          <a href="${demo.link}" class="btn primary w-full">Explore the Prototype →</a>
        </div>
      `;
      // 3D tilt effect
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const tiltX = ((y / r.height) - 0.5) * 12;
        const tiltY = ((x / r.width)  - 0.5) * -18;
        card.style.transform = `scale(1.04) perspective(600px) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
      serviceTrack.appendChild(card);
    });
    updateCardFullWidth();
  }

  function updateCardFullWidth() {
    const first = serviceTrack.querySelector('.carousel-card');
    if (!first) return;
    const style = getComputedStyle(first);
    cardFullWidth = first.offsetWidth
                   + parseFloat(style.marginLeft)
                   + parseFloat(style.marginRight);
  }

  function updateIndicatorsAndCards() {
    const cards = Array.from(serviceTrack.children);
    if (!cards.length) return;

    const trackW = serviceTrack.offsetWidth;
    // center-of-track position
    const style  = getComputedStyle(cards[0]);
    const centerOffset = serviceTrack.scrollLeft
                       + trackW/2
                       - cards[0].offsetWidth/2
                       + parseFloat(style.marginLeft);

    currentServiceIndex = Math.max(0, Math.min(
      cards.length - 1,
      Math.round(centerOffset / cardFullWidth)
    ));

    // rebuild indicators + toggle .active
    serviceIndicators.innerHTML = '';
    cards.forEach((card,i) => {
      card.classList.toggle('active', i === currentServiceIndex);
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator' + (i === currentServiceIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to demo ${i+1}`);
      dot.addEventListener('click', () => {
        const left = Math.max(0, Math.min(
          serviceTrack.scrollWidth - trackW,
          i*cardFullWidth - (trackW - cards[i].offsetWidth)/2
        ));
        serviceTrack.scrollTo({ left, behavior: 'smooth' });
      });
      serviceIndicators.appendChild(dot);
    });
  }

  // on scroll or resize, re-compute active card & indicators
  serviceTrack.addEventListener('scroll', () => window.requestAnimationFrame(updateIndicatorsAndCards));
  window.addEventListener('resize', () => {
    updateCardFullWidth();
    window.requestAnimationFrame(updateIndicatorsAndCards);
  });

  // arrow buttons page by one card
  if (leftBtn)  leftBtn .addEventListener('click', () => serviceTrack.scrollBy({ left: -cardFullWidth, behavior: 'smooth' }));
  if (rightBtn) rightBtn.addEventListener('click', () => serviceTrack.scrollBy({ left:  cardFullWidth, behavior: 'smooth' }));

  // initial render + state
  renderServiceDemos();
  updateIndicatorsAndCards();
})();
