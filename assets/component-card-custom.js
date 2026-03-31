
(function () {
  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Card entrance stagger on scroll ── */
  const grids = document.querySelectorAll(".product-grid, [data-product-grid]");

  if (grids.length) {
    grids.forEach((grid) => {
      const cards = grid.querySelectorAll(".rx-card-wrapper");
      if (!cards.length) return;

      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: "power2.out",
      });
    });
  } else {
    /* Fallback: animate all cards on page if no grid wrapper */
    const cards = document.querySelectorAll(".rx-card-wrapper");
    if (cards.length) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cards[0],
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: "power2.out",
      });
    }
  }

  /* ── 3D tilt on mouse move ── */
  document.querySelectorAll(".rx-card").forEach((card) => {
    const MAX_TILT = 6; // degrees

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      gsap.to(card, {
        rotateY: dx * MAX_TILT,
        rotateX: -dy * MAX_TILT,
        duration: 0.35,
        ease: "power1.out",
        transformPerspective: 800,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.55,
        ease: "power2.out",
      });
    });
  });

  /* ── ATC button: intercept click, add to cart via AJAX ── */
  document.querySelectorAll(".rx-card__atc").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const variantId = btn.dataset.variantId;
      if (!variantId || btn.disabled) return;

      /* Pulse animation feedback */
      gsap
        .timeline()
        .to(btn, { scale: 0.88, duration: 0.12, ease: "power2.in" })
        .to(btn, { scale: 1, duration: 0.25, ease: "back.out(2)" });

      try {
        const res = await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: variantId, quantity: 1 }),
        });

        if (!res.ok) throw new Error("Cart add failed");

        /* Success: flash green */
        const originalBg = getComputedStyle(btn).backgroundColor;
        gsap.to(btn, {
          backgroundColor: "#22C55E",
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.set(btn, { backgroundColor: "" });
          },
        });

        /* Trigger Shopify cart drawer/bubble refresh if theme supports it */
        document.dispatchEvent(new CustomEvent("cart:refresh"));
      } catch (err) {
        console.error("[RecovrX] ATC error:", err);
      }
    });
  });
})();
