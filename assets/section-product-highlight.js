document.addEventListener("DOMContentLoaded", () => {
  const highlightSections = document.querySelectorAll(".rx-highlight");

  if (
    !highlightSections.length ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  highlightSections.forEach((section) => {
    const grid = section.querySelector(".rx-highlight__grid");
    const media = section.querySelector(".rx-highlight__media");
    const contentElems = section.querySelectorAll(
      ".rx-highlight__subheading, .rx-highlight__heading, .rx-highlight__text, .rx-highlight__feature, .rx-highlight__btn",
    );

    // Determine slide direction based on layout reverse class
    const isReversed = grid.classList.contains("rx-highlight__grid--reverse");
    const mediaStartX = isReversed ? 60 : -60; // Right vs Left

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // 1. Slide in Media safely
    if (media) {
      tl.from(media, {
        x: mediaStartX,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    // 2. Stagger Content safely
    if (contentElems.length > 0) {
      tl.from(
        contentElems,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08 /* Fast, snappy stagger */,
          ease: "power2.out",
        },
        "-=0.5",
      ); /* Overlap with media animation */
    }
  });
});
