document.addEventListener("DOMContentLoaded", () => {
  const newsletterSection = document.querySelector(".rx-newsletter");

  if (
    !newsletterSection ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  )
    return;

  gsap.registerPlugin(ScrollTrigger);

  const heading = newsletterSection.querySelector(".rx-newsletter__heading");
  const subtext = newsletterSection.querySelector(".rx-newsletter__subtext");
  const form = newsletterSection.querySelector(".rx-newsletter__form-wrapper");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: newsletterSection,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Stagger reveal the elements safely
  const elementsToAnimate = [heading, subtext, form].filter(Boolean);

  if (elementsToAnimate.length > 0) {
    tl.from(elementsToAnimate, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "power2.out",
    });
  }
});
