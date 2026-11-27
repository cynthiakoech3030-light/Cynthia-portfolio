const name = document.getElementById('name');
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let userMoved = false;

// Place the light on the name (coordinates relative to the heading)
function lightAt(clientX, clientY) {
  const r = name.getBoundingClientRect();
  name.style.setProperty('--x', `${clientX - r.left}px`);
  name.style.setProperty('--y', `${clientY - r.top}px`);
}

// The page glow follows the cursor everywhere
window.addEventListener('pointermove', (e) => {
  userMoved = true;
  root.style.setProperty('--mx', `${e.clientX}px`);
  root.style.setProperty('--my', `${e.clientY}px`);
  lightAt(e.clientX, e.clientY);
});

// Touch: keep the light on the finger
name.addEventListener('pointerdown', (e) => { userMoved = true; lightAt(e.clientX, e.clientY); });

// One opening moment: the light sweeps across the name, then hands control to you
function intro() {
  if (reduceMotion) { lightAt(name.offsetWidth * 0.5, name.offsetHeight * 0.5); return; }
  const r = name.getBoundingClientRect();
  const start = performance.now();
  const duration = 2200;

  (function frame(now) {
    if (userMoved) return;
    const t = Math.min((now - start) / duration, 1);
    const x = r.left + (r.width + 200) * t - 100;
    const y = r.top + r.height * (0.5 + 0.25 * Math.sin(t * Math.PI * 3));
    lightAt(x, y);
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}
window.addEventListener('load', () => requestAnimationFrame(intro));

// Click the email to copy it
const copyBtn = document.getElementById('copy');
const status = document.getElementById('status');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    status.textContent = 'Email copied to your clipboard.';
  } catch {
    status.textContent = 'Could not copy. Select the email and copy it manually.';
  }
  setTimeout(() => (status.textContent = ''), 2500);
});

document.getElementById('year').textContent = new Date().getFullYear();

const printResume = document.getElementById('print-resume');
printResume.addEventListener('click', () => window.print());

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`);
  window.location.href = `mailto:cynthiakoech3030@gmail.com?subject=${subject}&body=${body}`;
});