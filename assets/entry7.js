const THRESHOLD = 80;
let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      document.body.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


document.addEventListener("pointerdown", () => {
  document.body.classList.add("is-clicking");
});

document.addEventListener("pointerup", () => {
  document.body.classList.remove("is-clicking");
});

document.addEventListener("pointercancel", () => {
  document.body.classList.remove("is-clicking");
});
