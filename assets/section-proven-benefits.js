document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".rx-benefits__item", {
      scrollTrigger: {
        trigger: ".rx-benefits__grid",
        start: "top 85%", // Starts animation when the grid is 85% in view
        toggleActions: "play none none none",
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15, // A slightly longer stagger for a more pronounced effect
      ease: "power2.out",
    });

    gsap.from(".rx-benefits__header", {
      scrollTrigger: {
        trigger: ".rx-benefits__card",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }
});
