document.addEventListener("DOMContentLoaded", () => {
  const whySection = document.querySelector(".rx-why");

  if (
    !whySection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const heading = whySection.querySelector(".rx-why__header");
  const cards = whySection.querySelectorAll(".rx-why__card");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: whySection,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Safe reveal for the heading
  if (heading) {
    tl.from(heading, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    });
  }

  // Safe, staggered reveal for the cards
  if (cards.length > 0) {
    tl.from(
      cards,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15, // Left to right cascade
        ease: "power2.out",
      },
      "-=0.2",
    ); // Overlaps with heading animation for speed
  }
});
