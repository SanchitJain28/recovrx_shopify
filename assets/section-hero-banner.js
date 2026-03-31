document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".rx-hero");
  if (!heroSection || typeof gsap === "undefined") return;

  const slides = heroSection.querySelectorAll(".rx-hero__slide");
  const dots = heroSection.querySelectorAll(".rx-hero__dot");
  const autoplayEnabled = heroSection.dataset.autoplay === "true";
  const autoplaySpeed = parseInt(heroSection.dataset.speed) || 5000;

  let currentIndex = 0;
  let autoplayTimer;
  let isAnimating = false;

  // Initial animation for the first slide on page load
  animateSlideIn(slides[0]);

  function animateSlideIn(slide) {
    const headline = slide.querySelector(".rx-hero__headline");
    const subtext = slide.querySelector(".rx-hero__subtext");
    const cta = slide.querySelector(".rx-hero__cta");

    // Reset properties before animating
    gsap.set([headline, subtext, cta], { clearProps: "all" });

    const tl = gsap.timeline();

    if (headline) {
      tl.fromTo(
        headline,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
      );
    }

    if (subtext) {
      tl.fromTo(
        subtext,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.7", // Overlap animation
      );
    }

    if (cta) {
      tl.fromTo(
        cta,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      );
    }
  }

  function goToSlide(index) {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[index];

    // Update Dots Status
    if (dots.length > 0) {
      dots[currentIndex].classList.remove("is-active");
      dots[currentIndex].setAttribute("aria-selected", "false");
      dots[index].classList.add("is-active");
      dots[index].setAttribute("aria-selected", "true");
    }

    // Crossfade Backgrounds
    gsap.to(currentSlide, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        currentSlide.classList.remove("is-active");
        currentSlide.setAttribute("aria-hidden", "true");
      },
    });

    nextSlide.classList.add("is-active");
    nextSlide.setAttribute("aria-hidden", "false");

    gsap.fromTo(
      nextSlide,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimating = false;
        },
      },
    );

    // Trigger Text Animations on the newly active slide
    animateSlideIn(nextSlide);
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  // Click events for dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  // Autoplay Logic
  function startAutoplay() {
    if (autoplayEnabled && slides.length > 1) {
      autoplayTimer = setInterval(nextSlide, autoplaySpeed);
    }
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
});
