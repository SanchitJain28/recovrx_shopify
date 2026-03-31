document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in the header smoothly on page load
    gsap.from(".rx-privacy__header", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.1,
    });

    // Stagger reveal the privacy clauses as the user scrolls down
    gsap.utils.toArray(".rx-privacy__block").forEach((block) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  }
});
