document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP and ScrollTrigger are loaded (from theme.liquid)
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero text animation (on load)
    gsap.from(".rx-about__title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.1,
    });

    gsap.from(".rx-about__subtitle", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
    });

    // 2. Story Image reveal
    gsap.from(".rx-about__story-image-wrap", {
      scrollTrigger: {
        trigger: ".rx-about__story",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // 3. Story Text reveal
    gsap.from(".rx-about__story-content", {
      scrollTrigger: {
        trigger: ".rx-about__story",
        start: "top 80%",
      },
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });

    // 4. Core Standards Cards Stagger
    gsap.from(".rx-about__card", {
      scrollTrigger: {
        trigger: ".rx-about__standards",
        start: "top 75%",
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15, // Creates a domino effect
      ease: "power2.out",
    });
  }
});
