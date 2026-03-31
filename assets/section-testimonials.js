document.addEventListener("DOMContentLoaded", () => {
  const testimonialsSection = document.querySelector(".rx-testimonials");

  if (
    !testimonialsSection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const heading = testimonialsSection.querySelector(".rx-testimonials__header");
  const cards = testimonialsSection.querySelectorAll(".rx-testimonials__card");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: testimonialsSection,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // 1. Animate Heading securely
  if (heading) {
    tl.from(heading, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    });
  }

  // 2. Stagger Cards securely
  if (cards.length > 0) {
    tl.from(
      cards,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15, // Creates a nice left-to-right cascading reveal
        ease: "power2.out",
      },
      "-=0.2",
    ); // Overlap slightly with the heading animation
  }
});
