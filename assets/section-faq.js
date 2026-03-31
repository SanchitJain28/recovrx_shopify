document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Reveal Animation for FAQ Items
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".rx-faq__item", {
      scrollTrigger: {
        trigger: ".rx-faq__list",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }

  // 2. Accordion Logic with GSAP Smooth Height Animation
  const faqItems = document.querySelectorAll(".rx-faq__item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".rx-faq__question");
    const wrapper = item.querySelector(".rx-faq__answer-wrapper");
    const icon = item.querySelector(".rx-faq__icon");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-active");

      // Auto-close other open items for a clean, focused experience
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("is-active")) {
          otherItem.classList.remove("is-active");
          otherItem
            .querySelector(".rx-faq__question")
            .setAttribute("aria-expanded", "false");
          gsap.to(otherItem.querySelector(".rx-faq__answer-wrapper"), {
            height: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(otherItem.querySelector(".rx-faq__icon"), {
            rotation: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });

      // Toggle current item
      if (isOpen) {
        // Close it
        item.classList.remove("is-active");
        btn.setAttribute("aria-expanded", "false");

        gsap.to(wrapper, { height: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(icon, { rotation: 0, duration: 0.4, ease: "power2.out" });
      } else {
        // Open it
        item.classList.add("is-active");
        btn.setAttribute("aria-expanded", "true");

        // Calculate natural height dynamically
        gsap.set(wrapper, { height: "auto" });
        const targetHeight = wrapper.offsetHeight;
        gsap.set(wrapper, { height: 0 }); // reset to 0 before animating

        gsap.to(wrapper, {
          height: targetHeight,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(icon, { rotation: 45, duration: 0.4, ease: "power2.out" }); // Rotates plus into an 'X'
      }
    });
  });
});
