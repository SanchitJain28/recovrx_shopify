document.addEventListener("DOMContentLoaded", () => {
  const researchSection = document.querySelector(".rx-research");

  if (
    !researchSection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const heading = researchSection.querySelector(".rx-research__heading");
  const container = researchSection.querySelector(".rx-research__container");
  const columns = researchSection.querySelectorAll(".rx-research__column");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: researchSection,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // 1. Heading Reveal
  if (heading) {
    tl.from(heading, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    });
  }

  // 2. Container Reveal
  if (container) {
    tl.from(
      container,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3",
    );
  }

  // 3. Stagger inner columns
  if (columns.length > 0) {
    tl.from(
      columns,
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.2",
    );
  }
});
