document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".rx-image-with-text");
    if (!section) return;

    // Animate the content column
    gsap.from(section.querySelector(".rx-image-with-text__content"), {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate the media column with a slight delay
    gsap.from(section.querySelector(".rx-image-with-text__media"), {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.2, // Adds a nice staggered effect
      ease: "power2.out",
    });
  }
});
