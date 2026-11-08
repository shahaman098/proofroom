// Progressive enhancement only: article content and native details work without JS.
const details = document.querySelector('.contents-bar details');
const summary = details.querySelector('summary');
details.closest('nav').classList.add('enhanced');
const links = [...details.querySelectorAll('a[href^="#"]')];
const sections = links.map(link => document.getElementById(link.hash.slice(1)));
const number = details.querySelector('.current-number');
const title = details.querySelector('.current-title');
let scheduled = false;
function updateSection() {
  scheduled = false;
  const offset = Math.max(summary.getBoundingClientRect().height + 40, parseFloat(getComputedStyle(sections[0]).scrollMarginTop) + 8);
  let active = 0;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= offset) active = index;
  });
  number.textContent = String(active + 1).padStart(2, '0');
  title.textContent = sections[active].textContent;
  links.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleUpdate() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateSection); }
}
links.forEach(link => link.addEventListener('click', () => {
  details.open = false;
  // Let the native anchor handle history and scrolling, then move keyboard focus.
  requestAnimationFrame(() => {
    const heading = document.getElementById(link.hash.slice(1));
    heading.setAttribute('tabindex', '-1');
    heading.focus({preventScroll: true});
    scheduleUpdate();
  });
}));
details.addEventListener('keydown', event => {
  if (event.key === 'Escape' && details.open) {
    details.open = false;
    summary.focus();
  }
});
window.addEventListener('scroll', scheduleUpdate, {passive: true});
window.addEventListener('resize', scheduleUpdate, {passive: true});
window.addEventListener('pageshow', scheduleUpdate);
updateSection();
