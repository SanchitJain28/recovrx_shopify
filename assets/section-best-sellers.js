document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".rx-bestsellers");
  if (!section || typeof gsap === "undefined") return;

  const track = section.querySelector(".rx-bestsellers__track");
  const slides = section.querySelectorAll(".rx-bestsellers__slide");
  const nextBtn = section.querySelector(".rx-next");
  const prevBtn = section.querySelector(".rx-prev");

  // Prevent slider logic if not enough items to loop properly
  if (slides.length <= 1) {
    if (nextBtn) nextBtn.style.display = "none";
    if (prevBtn) prevBtn.style.display = "none";
    return;
  }

  let isAnimating = false;
  let gap = parseInt(window.getComputedStyle(track).gap) || 12;

  function moveNext() {
    if (isAnimating) return;
    isAnimating = true;

    // Recalculate width on click for responsive resizing safety
    const slideWidth = track.firstElementChild.offsetWidth + gap;

    gsap.to(track, {
      x: -slideWidth,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Shift first element to the end physically in the DOM
        track.appendChild(track.firstElementChild);
        // Reset transform instantly so it loops seamlessly
        gsap.set(track, { x: 0 });
        isAnimating = false;
      },
    });
  }

  function movePrev() {
    if (isAnimating) return;
    isAnimating = true;

    const slideWidth = track.firstElementChild.offsetWidth + gap;

    // Shift last element to the front BEFORE animating
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    // Offset the track instantly to hide the shift
    gsap.set(track, { x: -slideWidth });

    // Animate back to 0
    gsap.to(track, {
      x: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating = false;
      },
    });
  }

  // Bind Buttons
  if (nextBtn) nextBtn.addEventListener("click", moveNext);
  if (prevBtn) prevBtn.addEventListener("click", movePrev);

  // Optional: Scroll Reveal Animation for the entire section (Compact entry)
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
    },
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });
});
