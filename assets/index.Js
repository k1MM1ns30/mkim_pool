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

  // (추가) 모바일 드래그에서 "드래그 후 클릭" 막기용 플래그
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

    // ✅ 데스크탑(hover 가능)일 때만 mousemove 3D 사용
    const canHover = window.matchMedia("(hover: hover)").matches;

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

    // ✅ 모바일(<=480px)에서는 드래그(pointer)로 3D 회전
    const mqMobile = window.matchMedia("(max-width: 480px)");

    let dragging = false;
    let lastX = 0, lastY = 0;
    let moved = 0;
    const DRAG_THRESHOLD = 8;   // 이 이상 움직이면 "드래그"로 판단
    const SENS = 0.18;          // 감도(원하는 대로 조절)

    function onDown(e) {
      if (!mqMobile.matches) return;

      dragging = true;
      moved = 0;
      suppressNextTap = false;
      lastX = e.clientX;
      lastY = e.clientY;

      // pointer 캡처
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

      // dy 위아래 -> rotateX (방향 반대로)
      targetRX = Math.max(-max, Math.min(max, targetRX - dy * SENS));
      targetRY = Math.max(-max, Math.min(max, targetRY + dx * SENS));

      if (moved > DRAG_THRESHOLD) {
        // 드래그로 회전했다면, 그 손가락 떼는 순간 발생할 click을 막기
        suppressNextTap = true;
      }
    }

    function onUp(e) {
      if (!mqMobile.matches) return;

      dragging = false;

      // 원위치로 돌아가게 하고 싶으면 켜
      // targetRX = 0;
      // targetRY = 0;

      // suppressNextTap은 바로 끄면 click 이벤트보다 빨리 풀릴 수 있어서 약간 지연
      if (suppressNextTap) {
        setTimeout(() => { suppressNextTap = false; }, 0);
      }
    }

    stage.addEventListener("pointerdown", onDown, { passive: true });
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerup", onUp, { passive: true });
    stage.addEventListener("pointercancel", onUp, { passive: true });
  }

  // ✅ 2탭 로직은 canvas 유무랑 상관없이 실행
  const links = document.querySelectorAll(".imgs a");
  if (!links.length) return;

  let activeLink = null;
  const isTouch = window.matchMedia("(hover: none)").matches;

  links.forEach(link => {
    link.addEventListener("click", function(e) {
      if (!isTouch) return;

      // ✅ (추가) 방금 드래그로 3D 돌린 다음 생긴 click이면 탭 처리/이동 둘 다 막기
      if (suppressNextTap) {
        e.preventDefault();
        return;
      }

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

  // ✅ lizard
  const lizard = document.querySelector(".lizard");
  if (lizard) {
    lizard.addEventListener("click", () => {
      lizard.classList.toggle("is-visible");
    });
  }

  // ✅ 클릭 커서
  document.addEventListener("pointerdown", () => {
    document.body.classList.add("is-clicking");
  });

  document.addEventListener("pointerup", () => {
    document.body.classList.remove("is-clicking");
  });

  document.addEventListener("pointercancel", () => {
    document.body.classList.remove("is-clicking");
  });

});
