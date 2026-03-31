document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".rx-faq__trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      const content = this.nextElementSibling;

      // Close all other accordions
      triggers.forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        gsap.to(t.nextElementSibling, {
          height: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      // Toggle current
      if (!isExpanded) {
        this.setAttribute("aria-expanded", "true");
        gsap.to(content, { height: "auto", duration: 0.4, ease: "power2.out" });
      }
    });
  });
});
