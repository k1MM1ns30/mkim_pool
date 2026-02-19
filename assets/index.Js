document.addEventListener("DOMContentLoaded", () => {

  function setRealVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--real-vh', `${vh}px`);
  }
  setRealVh();
  window.addEventListener('resize', setRealVh);
  window.addEventListener('orientationchange', setRealVh);

  const stage = document.querySelector(".canvas");

  // 드래그 후 잘못된 tap 방지용
  let suppressNextTap = false;

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

    const canHover = window.matchMedia("(hover: hover)").matches;

    // 데스크탑 mouse hover 3D
    if (canHover) {
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

    // 모바일 drag 3D
    const mqMobile = window.matchMedia("(max-width: 480px)");

    let dragging = false;
    let lastX = 0, lastY = 0;
    let moved = 0;

    const DRAG_THRESHOLD = 8;
    const SENS = 0.18;

    function onDown(e) {
      if (!mqMobile.matches) return;

      dragging = true;
      moved = 0;
      suppressNextTap = false;

      lastX = e.clientX;
      lastY = e.clientY;

      stage.setPointerCapture?.(e.pointerId);

      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function onMove(e) {
      if (!mqMobile.matches || !dragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      lastX = e.clientX;
      lastY = e.clientY;

      moved += Math.abs(dx) + Math.abs(dy);

      targetRX = Math.max(-max, Math.min(max, targetRX - dy * SENS));
      targetRY = Math.max(-max, Math.min(max, targetRY + dx * SENS));

      if (moved > DRAG_THRESHOLD) {
        suppressNextTap = true;
      }
    }

    function onUp(e) {
      if (!mqMobile.matches) return;

      dragging = false;

      if (suppressNextTap) {
        setTimeout(() => {
          suppressNextTap = false;
        }, 0);
      }
    }

    stage.addEventListener("pointerdown", onDown, { passive: true });
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerup", onUp, { passive: true });
    stage.addEventListener("pointercancel", onUp, { passive: true });
  }

  // ✅ 모바일에서 사진 누르면 손 떼는 순간 바로 이동
  const isTouch = window.matchMedia("(hover: none)").matches;

  document.querySelectorAll(".imgs a").forEach(a => {

    a.addEventListener("pointerup", (e) => {

      if (!isTouch) return;

      // 드래그 직후 tap이면 이동 금지
      if (suppressNextTap) {
        e.preventDefault();
        return;
      }

      const href = a.getAttribute("href");
      if (href) {
        window.location.href = href;
      }

    });

  });


  // 클릭 커서 효과
  document.addEventListener("pointerdown", () => {
    document.body.classList.add("is-clicking");
  });

  document.addEventListener("pointerup", () => {
    document.body.classList.remove("is-clicking");
  });

  document.addEventListener("pointercancel", () => {
    document.body.classList.remove("is-clicking");
  });


  // lizard toggle (그대로 유지)
  const lizard = document.querySelector(".lizard");

  if (lizard) {
    lizard.addEventListener("click", () => {
      lizard.classList.toggle("is-visible");
    });
  }

});
