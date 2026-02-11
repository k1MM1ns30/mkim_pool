document.addEventListener("DOMContentLoaded", () => {

  function setRealVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--real-vh', `${vh}px`);
  }
  setRealVh();
  window.addEventListener('resize', setRealVh);
  window.addEventListener('orientationchange', setRealVh);




  const stage = document.querySelector(".canvas");
  if (!stage) return;

  const max = 30;          // 회전 세기 (30은 꽤 과함)
  const persp = 1000;      // 200 -> 너무 강함 (800~1400 추천)

  let targetRX = 0, targetRY = 0; // 목표값
  let currentRX = 0, currentRY = 0; // 현재값(부드럽게 따라감)
  let rafId = null;

  function animate() {
    // easing(부드럽게 따라가기): 0.12~0.2 사이 추천
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

    // 애니메이션 루프가 아직 안 돌고 있으면 시작
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  stage.addEventListener("mouseleave", () => {
    targetRX = 0;
    targetRY = 0;

    // 살짝 있다가(값이 0으로 거의 수렴하면) 멈추게 하고 싶으면 아래처럼
    // 여기선 그냥 계속 돌려도 부담 적음. (원하면 stop 로직도 만들어줄게)
  });

  const links = document.querySelectorAll(".imgs a");
  let activeLink = null;

  links.forEach(link => {
    link.addEventListener("click", function(e) {

      // hover 없는 디바이스(모바일)만 적용
      if (window.matchMedia("(hover: none)").matches) {

        if (activeLink !== this) {
          e.preventDefault(); // 첫 탭에서는 이동 막기
          links.forEach(l => l.classList.remove("is-active"));
          this.classList.add("is-active");
          activeLink = this;
        } else {
          this.classList.remove("is-active");
          activeLink = null;
        }

      }

    });
  });

  // ✅ 이미지 밖 탭하면 해제
  document.addEventListener("click", (e) => {
    if (window.matchMedia("(hover: none)").matches) {
      if (!e.target.closest(".imgs a")) {
        links.forEach(l => l.classList.remove("is-active"));
        activeLink = null;
      }
    }
  });

// ✅ 스크롤하면 해제
  window.addEventListener("scroll", () => {
    if (window.matchMedia("(hover: none)").matches) {
      links.forEach(l => l.classList.remove("is-active"));
      activeLink = null;
    }
  }, { passive: true });


  



});


