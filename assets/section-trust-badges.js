document.addEventListener("DOMContentLoaded", () => {
  const trustSection = document.querySelector(".rx-trust");

  if (
    !trustSection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const badges = trustSection.querySelectorAll(".rx-trust__item");

  if (badges.length > 0) {
    gsap.from(badges, {
      scrollTrigger: {
        trigger: trustSection,
        start: "top 95%", // Trigger slightly earlier since it's a thin section
        toggleActions: "play none none none",
      },
      y: 20, // Short travel distance since it's a compact section
      opacity: 0,
      duration: 0.4, // Fast animation
      stagger: 0.1, // Snappy sequence
      ease: "power2.out",
    });
  }
});
