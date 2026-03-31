document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined") {
    // Animate the left column info
    gsap.from(".rx-contact__info", {
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.1,
    });

    // Stagger the detail items inside the left column
    gsap.from(".rx-contact__detail-item", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.3,
    });

    // Animate the right column form
    gsap.from(".rx-contact__form-wrapper", {
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });
  }
});
