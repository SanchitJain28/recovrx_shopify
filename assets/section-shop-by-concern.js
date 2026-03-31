document.addEventListener("DOMContentLoaded", () => {
  const concernSection = document.querySelector(".rx-concern");

  if (
    !concernSection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const heading = concernSection.querySelector(".rx-concern__heading");
  const cards = concernSection.querySelectorAll(".rx-concern__card");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: concernSection,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Use .from() so CSS doesn't need opacity: 0
  if (heading) {
    tl.from(heading, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    });
  }

  if (cards.length > 0) {
    tl.from(
      cards,
      {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.2",
    );
  }
});
