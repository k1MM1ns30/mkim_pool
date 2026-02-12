document.addEventListener("DOMContentLoaded", () => {

  function setRealVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--real-vh', `${vh}px`);
  }
  setRealVh();
  window.addEventListener('resize', setRealVh);
  window.addEventListener('orientationchange', setRealVh);

  // ✅ 3D는 canvas가 있을 때만
  const stage = document.querySelector(".canvas");
  if (stage) {
    const max = 30;
    const persp = 1000;

    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let rafId = null;

    function animate() {
      const ease = 0.14;
      currentRX += (targetRX - currentRX) * ease;
      currentRY += (targetRY - currentRY) * ease;

      stage.style.transform =
        `perspective(${persp}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;

      rafId = requestAnimationFrame(animate);
    }

    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;

      targetRY = (x - 0.5) * (max * 2);
      targetRX = -(y - 0.5) * (max * 2);

      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    stage.addEventListener("mouseleave", () => {
      targetRX = 0;
      targetRY = 0;
    });
  }

  // ✅ 2탭 로직은 canvas 유무랑 상관없이 실행
  const links = document.querySelectorAll(".imgs a");
  if (!links.length) return;

  let activeLink = null;
  const isTouch = window.matchMedia("(hover: none)").matches;

  links.forEach(link => {
    link.addEventListener("click", function(e) {
      if (!isTouch) return;

      if (activeLink !== this) {
        e.preventDefault();
        links.forEach(l => l.classList.remove("is-active"));
        this.classList.add("is-active");
        activeLink = this;
      } else {
        this.classList.remove("is-active");
        activeLink = null; // 두 번째 탭은 이동 허용
      }
    });
  });

  // ✅ 바깥 탭 해제 (캡처링으로 더 안정적으로)
  document.addEventListener("pointerdown", (e) => {
    if (!isTouch) return;
    if (!e.target.closest(".imgs a")) {
      links.forEach(l => l.classList.remove("is-active"));
      activeLink = null;
    }
  }, true);

  // ✅ 스크롤하면 해제
  window.addEventListener("scroll", () => {
    if (!isTouch) return;
    links.forEach(l => l.classList.remove("is-active"));
    activeLink = null;
  }, { passive: true });
  const lizard = document.querySelector(".lizard");

lizard.addEventListener("click", () => {
  lizard.classList.toggle("is-visible");
});


  

  

});

