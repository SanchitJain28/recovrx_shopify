document.addEventListener("DOMContentLoaded", () => {
  const duoSection = document.querySelector(".rx-duo");

  if (
    !duoSection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const headerElems = duoSection.querySelectorAll(
    ".rx-duo__heading, .rx-duo__subtext",
  );
  const cards = duoSection.querySelectorAll(".rx-duo__card");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: duoSection,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // 1. Animate Header Text securely
  if (headerElems.length > 0) {
    tl.from(headerElems, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
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
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.2",
    );
  }
});
